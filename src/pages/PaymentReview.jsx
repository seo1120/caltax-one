import React, { useState } from 'react';
import { Check } from 'lucide-react';

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
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  return (
    <div className="bg-white relative w-full min-h-screen">
      <div className="max-w-md mx-auto relative pb-12 px-4 flex flex-col gap-6 pt-[29px]">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={onBack}
          className="w-[20px] h-[40px] cursor-pointer hover:opacity-80 transition-opacity self-start"
        >
          <img alt="Back" className="block max-w-none w-full h-full object-contain" src={imgWeuiBackFilledReview} />
        </button>

        {/* 헤더 */}
        <div className="w-full pt-4 pb-2">
          <p className="font-normal text-[24px] text-black text-start">
            Review Payment Details
          </p>
        </div>

        {/* Main Content Container */}
        <div className="flex flex-col gap-6">
          
          {/* Summary Section */}
          <div className="flex flex-col gap-2">
            <p className="font-normal text-[16px] text-[#005aab]">
              Summary
            </p>
            <div className="bg-[#f6f6f6] rounded-[20px] p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="font-normal text-[16px] text-black">
                  Tax Type
                </p>
                <p className="font-bold text-[20px] text-black leading-tight">
                  {selectedTab} 2024 Q4 Personal Income Tax
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-normal text-[16px] text-black">
                  Total Amount
                </p>
                <p className="font-bold text-[32px] text-[#005aab]">
                  $200.00
                </p>
              </div>
            </div>
          </div>

          {/* Taxpayer Information Section */}
          <div className="flex flex-col gap-2">
            <p className="font-normal text-[16px] text-[#005aab]">
              Taxpayer Information
            </p>
            
            {/* Name Card */}
            <div className="bg-[#f6f6f6] rounded-[20px] p-4 flex flex-col gap-2">
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

            {/* SSN Card */}
            <div className="bg-[#f6f6f6] rounded-[20px] p-4 flex flex-col gap-2">
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

          {/* Payment Method Section */}
          <div className="flex flex-col gap-2">
            <p className="font-normal text-[16px] text-[#005aab]">
              Payment Method
            </p>
            
            {/* Bank Account (ACH) */}
            <div 
              className="bg-[#f6f6f6] rounded-[20px] p-4 flex items-center gap-4 cursor-pointer"
              onClick={() => setSelectedPaymentMethod('ACH')}
            >
              <div className="size-[16px] flex items-center justify-center relative shrink-0">
                <div className="absolute inset-0">
                  <img alt="" className="block max-w-none size-full" src={imgEllipse21} />
                </div>
                {selectedPaymentMethod === 'ACH' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-[8px] rounded-full bg-[#005aab]"></div>
                  </div>
                )}
              </div>
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

            {/* Credit/Debit Card */}
            <div 
              className="bg-[#f6f6f6] rounded-[20px] p-4 flex items-center gap-4 cursor-pointer"
              onClick={() => setSelectedPaymentMethod('Card')}
            >
              <div className="size-[16px] flex items-center justify-center relative shrink-0">
                <div className="absolute inset-0">
                  <img alt="" className="block max-w-none size-full" src={imgEllipse22} />
                </div>
                {selectedPaymentMethod === 'Card' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-[8px] rounded-full bg-[#005aab]"></div>
                  </div>
                )}
              </div>
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

          {/* Terms & Conditions */}
          <div className="flex gap-[9px] items-center py-2 cursor-pointer" onClick={() => setIsTermsAccepted(!isTermsAccepted)}>
            <div className={`relative shrink-0 size-[24px] rounded-[4px] border flex items-center justify-center transition-colors ${
              isTermsAccepted ? 'bg-[#005aab] border-[#005aab]' : 'bg-white border-gray-400'
            }`}>
              {isTermsAccepted && <Check className="text-white size-[18px]" strokeWidth={3} />}
            </div>
            <p className="font-normal text-[14px] text-black flex-1 select-none">
              I agree to the <span className="text-[#005aab] underline cursor-pointer">Terms&Conditions</span> and authorize this payment.
            </p>
          </div>

          {/* Confirm & Pay 버튼 */}
          <button
            onClick={onConfirm}
            disabled={isLoading || paymentStatus === 'processing'}
            className="bg-[#005aab] h-[50px] rounded-[40px] w-full flex items-center justify-center shadow-lg active:scale-[0.98] transition-transform disabled:opacity-70 disabled:active:scale-100"
          >
            <p className="font-bold text-[18px] text-white">
              {isLoading || paymentStatus === 'processing' ? 'Processing...' : 'Confirm & Pay'}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

