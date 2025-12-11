import React, { useState, useEffect, useCallback, useRef } from 'react';
import { signIn, signOut, getCurrentUser, fetchUserAttributes, fetchAuthSession } from 'aws-amplify/auth';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Payment from './pages/Payment';
import PaymentReview from './pages/PaymentReview';
import PaymentSuccess from './pages/PaymentSuccess';
import Dashboard from './pages/Dashboard';

// --- 메인 컴포넌트 ---
export default function CalTaxDemo() {
  // 상태 관리
  const [currentScreen, setCurrentScreen] = useState('landing'); // landing, login, onboarding, dashboard, payment, payment-review, payment-success
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', ssn: '', address: '', email: '' });
  const [selectedTab, setSelectedTab] = useState('FTB');
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, submitted, completed
  const [notification, setNotification] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('ACH');

  // 타이머 관리를 위한 Ref (메모리 누수 방지)
  const timerRef = useRef(null);
  // DB 조회 중복 방지를 위한 Ref
  const isCheckingDBRef = useRef(false);

  // --- API / 로직 함수들 ---
  
  // DB에서 납부 상태 확인하는 함수 (먼저 정의)
  const checkPaymentStatusFromDB = useCallback(async (emailToCheck) => {
    if (!emailToCheck) {
      return;
    }

    // 이미 조회 중이면 중복 요청 방지
    if (isCheckingDBRef.current) {
      console.log('[DB 조회] 이미 조회 중입니다. 중복 요청을 건너뜁니다.');
      return;
    }

    isCheckingDBRef.current = true;

    try {
      console.log(`[DB 조회 시작] 이메일: ${emailToCheck}`);
      const response = await fetch(`https://pv08g0ynz0.execute-api.us-west-2.amazonaws.com/status?email=${encodeURIComponent(emailToCheck)}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        // 500 에러는 서버 측 문제이므로 조용하게 처리
        if (response.status === 500) {
          console.warn(`[DB 조회] 서버 에러 (500): 서버 측 문제로 납부 상태를 확인할 수 없습니다.`);
          return; // 조용하게 종료
        }
        throw new Error(`Status check failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[DB 납부 상태 응답]:', data);
      
      if (data.paid === true) {
        console.log('[납부 완료 확인] DB에서 납부 완료 상태 확인됨');
        setPaymentStatus('completed');
        if (data.transactionId) {
          setPaymentData({ 
            transactionId: data.transactionId, 
            message: data.message || 'Payment completed successfully' 
          });
        }
      } else {
        console.log('[납부 미완료] DB에서 납부 내역 없음');
        setPaymentStatus('idle');
      }
    } catch (error) {
      // 네트워크 에러나 기타 에러는 조용하게 처리
      if (error.message.includes('500')) {
        console.warn('[DB 조회] 서버 에러: 서버 측 문제로 납부 상태를 확인할 수 없습니다.');
      } else {
        console.warn('[DB 조회] 에러:', error.message);
      }
      // 에러가 발생해도 기본 상태 유지 (idle 상태 유지)
    } finally {
      // 조회 완료 후 플래그 해제 (1초 후에 해제하여 짧은 시간 내 중복 방지)
      setTimeout(() => {
        isCheckingDBRef.current = false;
      }, 1000);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      await getCurrentUser();
      const attributes = await fetchUserAttributes();
      console.log('Cognito 사용자 속성 로드:', attributes);
      
      const mappedUser = {
        name: attributes.name || attributes['custom:name'] || '',
        ssn: attributes['custom:ssn'] || '',
        address: attributes['custom:address'] || '',
        email: attributes.email || ''
      };
      
      setUserInfo(mappedUser);

      // 온보딩 완료 여부 체크
      if (mappedUser.ssn && mappedUser.address) {
        setCurrentScreen('dashboard');
        // 초기 로드 시 DB에서 납부 상태 확인
        if (mappedUser.email) {
          console.log(`[Auth Check] ${mappedUser.email} 사용자의 납부 내역 조회 시작`);
          checkPaymentStatusFromDB(mappedUser.email);
        }
      } else {
        setCurrentScreen('onboarding');
      }
    } catch (error) {
      console.log('미로그인 상태:', error);
      setCurrentScreen('landing');
    }
  };

  // 1. [Mount] 초기 인증 상태 확인 및 클린업 설정
  useEffect(() => {
    checkAuthStatus();

    // 컴포넌트가 사라질 때(Unmount) 실행 중인 타이머 취소
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 2. [Dashboard 진입 & 이메일 확보 시] DB 납부 내역 조회 (백업용)
  // 주로 이메일이 나중에 업데이트되었을 때를 대비
  useEffect(() => {
    if (currentScreen === 'dashboard' && userInfo.email && paymentStatus === 'idle' && !isCheckingDBRef.current) {
      console.log(`[Dashboard useEffect] ${userInfo.email} 사용자의 납부 내역 조회 시작`);
      checkPaymentStatusFromDB(userInfo.email);
    }
  }, [currentScreen, userInfo.email, paymentStatus, checkPaymentStatusFromDB]);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    
    try {
      await signIn({ username: loginForm.email, password: loginForm.password });
      
      // 로그인 성공 직후 정보 로드
      const attributes = await fetchUserAttributes();
      const mappedUser = {
        name: attributes.name || attributes['custom:name'] || '',
        ssn: attributes['custom:ssn'] || '',
        address: attributes['custom:address'] || '',
        email: attributes.email || loginForm.email || ''
      };
      
      setUserInfo(mappedUser);
      
      if (mappedUser.ssn && mappedUser.address) {
        setCurrentScreen('dashboard');
        // 로그인 직후 DB에서 납부 상태 확인
        if (mappedUser.email) {
          console.log(`[Login] ${mappedUser.email} 사용자의 납부 내역 조회 시작`);
          checkPaymentStatusFromDB(mappedUser.email);
        }
      } else {
        setCurrentScreen('onboarding');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      setLoginError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    const attributes = await fetchUserAttributes();
    const updatedUser = {
      name: attributes.name || attributes['custom:name'] || '',
      ssn: attributes['custom:ssn'] || '',
      address: attributes['custom:address'] || '',
      email: attributes.email || ''
    };
    setUserInfo(prev => ({
      ...prev,
      ...updatedUser
    }));
    setCurrentScreen('dashboard');
    // 온보딩 완료 후 DB에서 납부 상태 확인
    if (updatedUser.email) {
      console.log(`[Onboarding Complete] ${updatedUser.email} 사용자의 납부 내역 조회 시작`);
      checkPaymentStatusFromDB(updatedUser.email);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('로그아웃 에러:', error);
    } finally {
      // 상태 초기화
      setUserInfo({ name: '', ssn: '', address: '', email: '' });
      setLoginForm({ email: '', password: '' });
      setPaymentStatus('idle');
      setPaymentData(null);
      setCurrentScreen('landing');
    }
  };

  // 탭 변경 시 상태 초기화 및 진행 중인 시뮬레이션 취소
  const handleTabChange = (tab) => {
    if (timerRef.current) clearTimeout(timerRef.current); // 기존 타이머 취소
    setSelectedTab(tab);
    setPaymentStatus('idle');
    setNotification(null);
    setPaymentData(null);
  };

  const handlePayment = async () => {
    setPaymentStatus('processing');
    setNotification(null);
    
    try {
      const session = await fetchAuthSession();
      const accessToken = session.tokens?.accessToken?.toString();
      
      const response = await fetch('https://pv08g0ynz0.execute-api.us-west-2.amazonaws.com/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        },
        body: JSON.stringify({
          amount: 200,
          agency: selectedTab,
          payerName: userInfo.name,
          ssn: userInfo.ssn,
          address: userInfo.address,
          email: userInfo.email,
          paymentMethod: selectedPaymentMethod,
        }),
      });

      if (!response.ok) throw new Error(`Payment API Error: ${response.status}`);

      const data = await response.json();
      console.log('결제 요청 성공:', data);
      setPaymentData(data);
      setPaymentStatus('submitted');
      
      // 비동기 처리 시뮬레이션 시작
      startWorkerLambdaSimulation();
      
    } catch (error) {
      console.error('결제 요청 실패:', error);
      setPaymentStatus('idle');
      setNotification(`❌ Error: ${error.message}`);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const startWorkerLambdaSimulation = () => {
    // 기존 타이머가 있다면 취소 (안전장치)
    if (timerRef.current) clearTimeout(timerRef.current);

    // Ref에 타이머 ID 저장
    timerRef.current = setTimeout(() => {
      setPaymentStatus('completed');
      setNotification(`📧 [Email Received] Payment Confirmation: $200.00 to ${selectedTab} processed.`);

      // DB 상태 재확인
      if (userInfo.email) {
        // DB 반영 딜레이를 고려해 1초 뒤 조회
        setTimeout(() => {
          checkPaymentStatusFromDB(userInfo.email);
        }, 1000);
      }
      // 결제 완료 후 성공 페이지로 이동
      setCurrentScreen('payment-success');
    }, 4000);
  };

  // --- 렌더링 ---
  switch (currentScreen) {
    case 'landing':
      return <Landing onGetStarted={() => setCurrentScreen('login')} />;
    
    case 'login':
      return (
        <Login
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          handleLogin={handleLogin}
          isLoading={isLoading}
          loginError={loginError}
        />
      );
    
    case 'onboarding':
      return (
        <Onboarding
          onComplete={handleOnboardingComplete}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />
      );
    
    case 'payment':
      return (
        <Payment
          selectedTab={selectedTab}
          setSelectedTab={handleTabChange}
          onBack={() => setCurrentScreen('dashboard')}
          onPayNow={() => setCurrentScreen('payment-review')}
        />
      );
    
    case 'payment-review':
      return (
        <PaymentReview
          selectedTab={selectedTab}
          userInfo={userInfo}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          onBack={() => setCurrentScreen('payment')}
          onConfirm={handlePayment}
          isLoading={isLoading}
          paymentStatus={paymentStatus}
        />
      );
    
    case 'payment-success':
      return (
        <PaymentSuccess
          selectedTab={selectedTab}
          onReturnToDashboard={() => setCurrentScreen('dashboard')}
        />
      );
    
    case 'dashboard':
    default:
      return (
        <Dashboard
          userInfo={userInfo}
          notification={notification}
          setNotification={setNotification}
          onLogout={handleLogout}
          onReviewPay={() => {
            setCurrentScreen('payment');
            setSelectedTab('FTB');
          }}
          setSelectedTab={setSelectedTab}
        />
      );
  }
}
