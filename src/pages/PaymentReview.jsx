import React from 'react';

const imgWeuiBackFilledReview = "https://www.figma.com/api/mcp/asset/629c8ff8-85bf-4382-995d-b752e69218d4";
const imgSimpleLineIconsCheckReview = "https://www.figma.com/api/mcp/asset/f94bd370-e8f5-4f55-83fb-969e634d72e4";
const imgEllipse21 = "https://www.figma.com/api/mcp/asset/e2b642b4-74c4-44e6-ba38-2263e61a427b";
const imgEllipse22 = "https://www.figma.com/api/mcp/asset/fd4ae797-8152-4887-919f-616a287ec7a7";
const imgGroupCheckbox = "https://www.figma.com/api/mcp/asset/3b7eadfd-0027-4afa-b866-579353688b46";

export default function PaymentReview({ 
  selectedTab, 
  userInfo, 
  selectedPaymentMethod, 
  setSelectedPaymentMethod,
  onBack,
  onConfirm,
  isLoading,
  paymentStatus
}) {
  return (
    <div className="bg-white relative w-full min-h-screen">
      <div className="max-w-md mx-auto relative pb-8">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={onBack}
          className="absolute h-[40px] left-4 top-[29px] w-[20px] cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img alt="Back" className="block max-w-none size-full" src={imgWeuiBackFilledReview} />
        </button>

        {/* 헤더 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[97px] w-[calc(100%-32px)] max-w-[354px]">
          <div className="flex items-center">
            <p className="font-normal text-[24px] text-black">
              Review Payment Details
            </p>
          </div>
        </div>

        {/* Summary 섹션 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[177px] w-[calc(100%-32px)] max-w-[354px]">
          <p className="font-normal text-[16px] text-[#005aab]">
            Summary
          </p>
        </div>

        {/* Summary 카드 */}
        <div className="absolute bg-[#f6f6f6] h-[192px] left-1/2 -translate-x-1/2 rounded-[20px] top-[164px] w-[calc(100%-32px)] max-w-[359px]">
          <div className="absolute left-4 top-[47px] w-[calc(100%-32px)] flex flex-col gap-[14px]">
            <div className="flex flex-col gap-[10px]">
              <p className="font-normal text-[16px] text-black">
                Tax Type
              </p>
              <p className="font-bold text-[20px] text-black">
                {selectedTab} 2024 Q4 Personal Income Tax
              </p>
            </div>
            <div className="flex flex-col gap-[10px]">
              <p className="font-normal text-[16px] text-black">
                Total Amount
              </p>
              <p className="font-bold text-[32px] text-[#005aab]">
                $200.00
              </p>
            </div>
          </div>
        </div>

        {/* Taxpayer Information 섹션 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[395px] w-[calc(100%-32px)] max-w-[354px]">
          <p className="font-normal text-[16px] text-[#005aab]">
            Taxpayer Information
          </p>
        </div>

        {/* Taxpayer Information 카드 */}
        <div className="absolute bg-[#f6f6f6] h-[86px] left-1/2 -translate-x-1/2 rounded-[20px] top-[424px] w-[calc(100%-32px)] max-w-[359px]">
          <div className="absolute left-4 top-[14px] w-[calc(100%-32px)] flex flex-col gap-[14px]">
            <div className="flex flex-col gap-[10px]">
              <p className="font-normal text-[16px] text-black">
                Name
              </p>
              <div className="flex items-center justify-between">
                <p className="font-bold text-[20px] text-black">
                  {userInfo.name || 'Alex Kim'}
                </p>
                <div className="relative shrink-0 size-[25px]">
                  <img alt="" className="block max-w-none size-full" src={imgSimpleLineIconsCheckReview} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bg-[#f6f6f6] h-[86px] left-1/2 -translate-x-1/2 rounded-[20px] top-[520px] w-[calc(100%-32px)] max-w-[359px]">
          <div className="absolute left-4 top-[14px] w-[calc(100%-32px)] flex flex-col gap-[14px]">
            <div className="flex flex-col gap-[10px]">
              <p className="font-normal text-[16px] text-black">
                SSN
              </p>
              <div className="flex items-center justify-between">
                <p className="font-bold text-[20px] text-black">
                  {userInfo.ssn ? `***-**-${userInfo.ssn.slice(-4)}` : '***-**-1234'}
                </p>
                <div className="relative shrink-0 size-[25px]">
                  <img alt="" className="block max-w-none size-full" src={imgSimpleLineIconsCheckReview} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method 섹션 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[580px] w-[calc(100%-32px)] max-w-[354px]">
          <p className="font-normal text-[16px] text-[#005aab]">
            Payment Method
          </p>
        </div>

        {/* Bank Account (ACH) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[624px] w-[calc(100%-32px)] max-w-[359px]">
          <div className="bg-[#f6f6f6] h-[86px] rounded-[20px] flex items-center gap-4 px-4 relative">
            <button
              onClick={() => setSelectedPaymentMethod('ACH')}
              className="size-[16px] flex items-center justify-center relative"
            >
              <div className="absolute inset-0">
                <img alt="" className="block max-w-none size-full" src={imgEllipse21} />
              </div>
              {selectedPaymentMethod === 'ACH' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="size-[8px] rounded-full bg-[#005aab]"></div>
                </div>
              )}
            </button>
            <div className="flex-1">
              <p className="font-normal text-[16px] text-black mb-2">
                Bank Account(ACH)
              </p>
              <div className="flex items-center justify-between">
                <div className="bg-white px-2 py-1 rounded-[20px]">
                  <p className="font-normal text-[15px] text-[#6d6d6d]">
                    Chase ****8899
                  </p>
                </div>
                <div className="bg-[#e4f1ff] px-2 py-1 rounded-[20px]">
                  <p className="font-normal text-[15px] text-[#1575cb]">
                    No fee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Credit/Debit Card */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[720px] w-[calc(100%-32px)] max-w-[359px]">
          <div className="bg-[#f6f6f6] h-[86px] rounded-[20px] flex items-center gap-4 px-4 relative">
            <button
              onClick={() => setSelectedPaymentMethod('Card')}
              className="size-[16px] flex items-center justify-center relative"
            >
              <div className="absolute inset-0">
                <img alt="" className="block max-w-none size-full" src={imgEllipse22} />
              </div>
              {selectedPaymentMethod === 'Card' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="size-[8px] rounded-full bg-[#005aab]"></div>
                </div>
              )}
            </button>
            <div className="flex-1">
              <p className="font-normal text-[16px] text-black mb-2">
                Credit/Debit Card
              </p>
              <div className="flex items-center justify-between">
                <div className="bg-white px-2 py-1 rounded-[20px]">
                  <p className="font-normal text-[15px] text-[#6d6d6d]">
                    Visa ****4242
                  </p>
                </div>
                <div className="bg-[#e4f1ff] px-2 py-1 rounded-[20px]">
                  <p className="font-normal text-[15px] text-[#1575cb]">
                    2.3% fee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Conditions 체크박스 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[855px] w-[calc(100%-32px)] max-w-[354px] flex gap-[9px] items-center">
          <div className="relative shrink-0 size-[24px]">
            <div className="absolute inset-[12.5%_12.5%_0.78%_12.5%]">
              <img alt="" className="block max-w-none size-full" src={imgGroupCheckbox} />
            </div>
          </div>
          <p className="font-normal text-[14px] text-black flex-1">
            I agree to the <span className="text-[#005aab] underline">Terms&Conditions</span> and authorize this payment.
          </p>
        </div>

        {/* Confirm & Pay 버튼 */}
        <button
          onClick={onConfirm}
          disabled={isLoading || paymentStatus === 'processing'}
          className="absolute bg-[#005aab] h-[40px] left-1/2 -translate-x-1/2 px-[40px] py-[10px] rounded-[40px] top-[924px] w-[calc(100%-48px)] max-w-[339px] flex items-center justify-center"
        >
          <p className="font-bold text-[18px] text-white">
            {isLoading || paymentStatus === 'processing' ? 'Processing...' : 'Confirm & Pay'}
          </p>
        </button>
      </div>
    </div>
  );
}

