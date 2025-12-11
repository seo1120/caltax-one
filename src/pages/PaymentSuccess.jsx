import React from 'react';

const imgSimpleLineIconsCheckSuccess = "https://www.figma.com/api/mcp/asset/55d09722-2b0d-446a-817a-e4e69dc16702";

export default function PaymentSuccess({ selectedTab, onReturnToDashboard }) {
  // 현재 날짜 포맷팅
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${String(currentDate.getDate()).padStart(2, '0')}`;

  return (
    <div className="bg-white relative w-full min-h-screen">
      <div className="max-w-md mx-auto relative pb-8">
        {/* Payment Successful 제목 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[219px] w-[calc(100%-32px)] max-w-[354px]">
          <p className="font-bold text-[24px] text-black text-center">
            Payment Successful
          </p>
        </div>

        {/* 체크 아이콘 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[300px] size-[121px]">
          <img alt="Success" className="block max-w-none size-full" src={imgSimpleLineIconsCheckSuccess} />
        </div>

        {/* Summary 카드 */}
        <div className="absolute bg-[#f6f6f6] h-[155px] left-1/2 -translate-x-1/2 rounded-[20px] top-[476px] w-[calc(100%-32px)] max-w-[359px]">
          <div className="absolute left-4 top-[25px] w-[calc(100%-32px)] flex flex-col gap-[14px]">
            <div className="flex flex-col gap-[10px]">
              <p className="font-bold text-[20px] text-black">
                {selectedTab} 2024 Q4 Personal Income Tax
              </p>
            </div>
            <div className="flex flex-col gap-[10px]">
              <p className="font-bold text-[32px] text-[#005aab]">
                $200.00
              </p>
            </div>
            <p className="font-normal text-[16px] text-black">
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Return to Dashboard 버튼 */}
        <button
          onClick={onReturnToDashboard}
          className="absolute bg-[#005aab] h-[40px] left-1/2 -translate-x-1/2 px-[40px] py-[10px] rounded-[40px] top-[656px] w-[calc(100%-32px)] max-w-[359px] flex items-center justify-center"
        >
          <p className="font-bold text-[18px] text-white">
            Return to Dashboard
          </p>
        </button>
      </div>
    </div>
  );
}

