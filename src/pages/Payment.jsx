import React from 'react';

const imgSimpleLineIconsCheck = "https://www.figma.com/api/mcp/asset/87a0ad9f-9864-47dc-9c6e-4bc237bb78ce";
const imgWeuiBackFilled = "https://www.figma.com/api/mcp/asset/c1e16d1e-e34d-47fd-8ec2-6fa89f929822";
const imgEllipse15Payment = "https://www.figma.com/api/mcp/asset/904efa9e-7299-4eb0-86ae-c21fce77b27b";

export default function Payment({ selectedTab, setSelectedTab, onBack, onPayNow }) {
  return (
    <div className="bg-white relative w-full min-h-screen">
      <div className="max-w-md mx-auto relative pb-8 px-4 flex flex-col gap-8 pt-[29px]">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={onBack}
          className="w-[20px] h-[40px] cursor-pointer hover:opacity-80 transition-opacity self-start"
        >
          <img alt="Back" className="block max-w-none w-full h-full object-contain" src={imgWeuiBackFilled} />
        </button>

        {/* 헤더 */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <p className="font-normal text-[24px] text-black">
              Manage Your Tax Obligations
            </p>
            <div className="relative shrink-0 size-[25px]">
              <img alt="" className="block max-w-none size-full" src={imgSimpleLineIconsCheck} />
            </div>
          </div>
          <p className="font-normal text-[16px] text-black whitespace-pre-wrap leading-6">
            Your total balance is split across different agencies. Please review each tab (FTB, EDD, CDTFA) and proceed with payment individually.
          </p>
        </div>

        {/* 탭 */}
        <div className="flex gap-4 justify-center w-full">
          <button
            onClick={() => setSelectedTab('FTB')}
            className={`h-[41px] rounded-[20px] flex items-center justify-center relative ${
              selectedTab === 'FTB' ? 'bg-[#f6f6f6] w-[83px]' : 'bg-white w-[83px]'
            }`}
          >
            <p className={`${selectedTab === 'FTB' ? 'font-bold' : 'font-normal'} text-[20px] text-black`}>
              FTB
            </p>
            <div className="absolute right-2 top-2 size-[8px]">
              <div className="absolute inset-0" style={{ "--fill-0": "rgba(21, 117, 203, 1)" }}>
                <img alt="" className="block max-w-none size-full" src={imgEllipse15Payment} />
              </div>
            </div>
          </button>
          <button
            onClick={() => setSelectedTab('EDD')}
            className={`h-[41px] rounded-[20px] flex items-center justify-center relative ${
              selectedTab === 'EDD' ? 'bg-[#f6f6f6] w-[83px]' : 'bg-white w-[83px]'
            }`}
          >
            <p className={`${selectedTab === 'EDD' ? 'font-bold' : 'font-normal'} text-[20px] text-black`}>
              EDD
            </p>
            <div className="absolute right-2 top-2 size-[8px]">
              <div className="absolute inset-0" style={{ "--fill-0": "rgba(21, 117, 203, 1)" }}>
                <img alt="" className="block max-w-none size-full" src={imgEllipse15Payment} />
              </div>
            </div>
          </button>
          <button
            onClick={() => setSelectedTab('CDTFA')}
            className={`h-[41px] rounded-[20px] flex items-center justify-center relative ${
              selectedTab === 'CDTFA' ? 'bg-[#f6f6f6] w-[110px]' : 'bg-white w-[110px]'
            }`}
          >
            <p className={`${selectedTab === 'CDTFA' ? 'font-bold' : 'font-normal'} text-[20px] text-black`}>
              CDTFA
            </p>
            <div className="absolute right-2 top-2 size-[8px]">
              <div className="absolute inset-0" style={{ "--fill-0": "rgba(21, 117, 203, 1)" }}>
                <img alt="" className="block max-w-none size-full" src={imgEllipse15Payment} />
              </div>
            </div>
          </button>
        </div>

        {/* 결제 카드 & 버튼 컨테이너 */}
        <div className="w-full max-w-[369px] mx-auto relative bg-[#005aab] rounded-[20px] p-[20px] flex flex-col gap-[20px]">
          <div className="flex flex-col gap-4">
            {/* Due Soon 배지 */}
            <div className="bg-[#e4f1ff] px-2 py-1 rounded-[20px] self-start">
              <p className="font-normal text-[14px] text-[#1575cb]">
                Due Soon
              </p>
            </div>
            
            {/* 세금 정보 및 금액 */}
            <div className="flex flex-col gap-2">
              <p className="font-normal text-[20px] text-white">
                {selectedTab} 2024 Q4 Personal Income Tax
              </p>
              <p className="font-bold text-[32px] text-[#fbfbfb]">
                $200.00
              </p>
            </div>
          </div>
          
          {/* Pay Now 버튼 */}
          <button
            onClick={onPayNow}
            className="bg-[#f6f6f6] h-[40px] px-[40px] py-[10px] rounded-[40px] w-full flex items-center justify-center"
          >
            <p className="font-normal text-[18px] text-[#005aab]">
              Pay Now
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

