import React from 'react';

const imgSimpleLineIconsCheckSuccess = "https://www.figma.com/api/mcp/asset/55d09722-2b0d-446a-817a-e4e69dc16702";

export default function PaymentSuccess({ selectedTab, onReturnToDashboard }) {
  // 현재 날짜 포맷팅
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${String(currentDate.getDate()).padStart(2, '0')}`;

  return (
    <div className="bg-white relative w-full min-h-screen">
      <div className="max-w-md mx-auto relative pb-12 px-4 flex flex-col gap-8 pt-[200px] items-center">
        {/* Payment Successful 제목 */}
        <div className="w-full">
          <p className="font-bold text-[24px] text-black text-center">
            Payment Successful
          </p>
        </div>

        {/* 체크 아이콘 */}
        <div className="size-[121px]">
          <img alt="Success" className="block max-w-none size-full" src={imgSimpleLineIconsCheckSuccess} />
        </div>

        {/* Summary 카드 */}
        <div className="bg-[#f6f6f6] rounded-[20px] p-6 w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-[20px] text-black leading-tight">
              {selectedTab} 2024 Q4 Personal Income Tax
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-bold text-[32px] text-[#005aab]">
              $200.00
            </p>
          </div>
          <p className="font-normal text-[16px] text-black text-right">
            {formattedDate}
          </p>
        </div>

        {/* Return to Dashboard 버튼 */}
        <button
          onClick={onReturnToDashboard}
          className="bg-[#005aab] h-[50px] rounded-[40px] w-full flex items-center justify-center shadow-lg hover:bg-[#004a8b] active:scale-[0.98] transition-all"
        >
          <p className="font-bold text-[18px] text-white">
            Return to Dashboard
          </p>
        </button>
      </div>
    </div>
  );
}

