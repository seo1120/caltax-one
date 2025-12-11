import json
import boto3
from decimal import Decimal
from boto3.dynamodb.conditions import Key

# DynamoDB 설정
dynamodb = boto3.resource('dynamodb')
TABLE_NAME = 'CalTax-Transactions' 
table = dynamodb.Table(TABLE_NAME)

def convert_decimal_to_float(value):
    """Decimal을 float로 변환"""
    if isinstance(value, Decimal):
        return float(value)
    return value

def lambda_handler(event, context):
    # CORS 헤더 (API Gateway 필수)
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
    }

    # OPTIONS 요청 처리 (CORS preflight)
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,  # 숫자 필수
            'headers': headers,
            'body': json.dumps({'message': 'OK'})  # 문자열 필수
        }

    try:
        # 이메일 추출
        query_params = event.get('queryStringParameters') or {}
        email = query_params.get('email')
        
        print(f"[Lambda] 조회할 이메일: {email}")

        if not email:
            return {
                'statusCode': 400,  # 숫자 필수
                'headers': headers,  # CORS 헤더 필수
                'body': json.dumps({  # 문자열 필수
                    'paid': False,
                    'message': 'Email is required'
                })
            }

        # DynamoDB Query - email만으로 조회 (정렬 키 없이)
        print(f"[Lambda] DynamoDB Query 시작: email={email}")
        response = table.query(
            KeyConditionExpression=Key('email').eq(email),
            ScanIndexForward=False,  # timestamp 내림차순
            Limit=1
        )

        items = response.get('Items', [])
        count = len(items)
        
        print(f"[Lambda] 검색된 데이터 개수: {count}")

        if count == 0:
            print("[Lambda] 데이터 없음 - paid=False 반환")
            return {
                'statusCode': 200,  # 숫자 필수
                'headers': headers,  # CORS 헤더 필수
                'body': json.dumps({  # 문자열 필수
                    'paid': False,
                    'message': 'No records found'
                })
            }

        # 가장 최근 데이터
        item = items[0]
        print(f"[Lambda] 최신 항목: {item}")
        
        # Decimal 변환 (간단하게)
        amount = convert_decimal_to_float(item.get('amount', 0))
        timestamp = convert_decimal_to_float(item.get('timestamp', 0))
        status = str(item.get('status', ''))
        
        # status 확인
        is_paid = (status.upper() == 'COMPLETED')
        
        # transactionId 생성
        transaction_id = item.get('transactionId')
        if not transaction_id:
            transaction_id = f"{email}-{int(timestamp)}"
        
        # 결과 데이터
        result_data = {
            'paid': is_paid,
            'transactionId': transaction_id,
            'amount': amount,
            'agency': item.get('tax_type', item.get('agency', '')),
            'status': status,
            'message': 'Payment Confirmed' if is_paid else 'Payment not completed'
        }
        
        print(f"[Lambda] 응답 데이터: {result_data}")

        # API Gateway 형식에 맞게 반환
        return {
            'statusCode': 200,  # 1. 상태 코드 필수 (숫자)
            'headers': headers,  # 2. CORS 헤더 필수
            'body': json.dumps(result_data)  # 3. body는 반드시 문자열(String)
        }

    except Exception as e:
        import traceback
        error_msg = str(e)
        error_trace = traceback.format_exc()
        print(f"[Lambda] 에러 발생: {error_msg}")
        print(f"[Lambda] 스택 트레이스:\n{error_trace}")
        
        # 에러 발생 시에도 API Gateway 형식 유지
        return {
            'statusCode': 500,  # 숫자 필수
            'headers': headers,  # CORS 헤더 필수
            'body': json.dumps({  # 문자열 필수
                'paid': False,
                'error': error_msg,
                'message': 'Internal server error'
            })
        }

