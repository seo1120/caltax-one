import React from 'react';

const imgSimpleLineIconsCheck = "https://www.figma.com/api/mcp/asset/87a0ad9f-9864-47dc-9c6e-4bc237bb78ce";
const imgWeuiBackFilled = "https://www.figma.com/api/mcp/asset/c1e16d1e-e34d-47fd-8ec2-6fa89f929822";
const imgEllipse15Payment = "https://www.figma.com/api/mcp/asset/904efa9e-7299-4eb0-86ae-c21fce77b27b";

export default function Payment({ selectedTab, setSelectedTab, onBack, onPayNow }) {
  return (
    <div className="bg-white relative w-full min-h-screen">
      <div className="max-w-md mx-auto relative pb-8">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={onBack}
          className="absolute h-[40px] left-4 top-[29px] w-[20px] cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img alt="Back" className="block max-w-none size-full" src={imgWeuiBackFilled} />
        </button>

        {/* 헤더 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[97px] w-[calc(100%-32px)] max-w-[354px] flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <p className="font-normal text-[24px] text-black">
              Manage Your Tax Obligations
            </p>
            <div className="relative shrink-0 size-[25px]">
              <img alt="" className="block max-w-none size-full" src={imgSimpleLineIconsCheck} />
            </div>
          </div>
          <p className="font-normal text-[16px] text-black whitespace-pre-wrap">
            Your total balance is split across different agencies. Please review each tab (FTB, EDD, CDTFA) and proceed with payment individually.
          </p>
        </div>

        {/* 탭 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[227px] flex gap-4">
          <button
            onClick={() => setSelectedTab('FTB')}
            className={`h-[41px] rounded-[20px] flex items-center justify-center relative ${
              selectedTab === 'FTB' ? 'bg-[#f6f6f6] w-[83px]' : 'bg-white w-[83px]'
            }`}
          >
            <p className={`${selectedTab === 'FTB' ? 'font-bold' : 'font-normal'} text-[20px] text-black`}>
              FTB
            </p>
            {selectedTab === 'FTB' && (
              <div className="absolute left-[67px] size-[8px] top-[5px]">
                <div className="absolute inset-0" style={{ "--fill-0": "rgba(21, 117, 203, 1)" }}>
                  <img alt="" className="block max-w-none size-full" src={imgEllipse15Payment} />
                </div>
              </div>
            )}
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
            {selectedTab === 'EDD' && (
              <div className="absolute left-[68px] size-[8px] top-[5px]">
                <div className="absolute inset-0" style={{ "--fill-0": "rgba(21, 117, 203, 1)" }}>
                  <img alt="" className="block max-w-none size-full" src={imgEllipse15Payment} />
                </div>
              </div>
            )}
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
            {selectedTab === 'CDTFA' && (
              <div className="absolute left-[91px] size-[8px] top-[5px]">
                <div className="absolute inset-0" style={{ "--fill-0": "rgba(21, 117, 203, 1)" }}>
                  <img alt="" className="block max-w-none size-full" src={imgEllipse15Payment} />
                </div>
              </div>
            )}
          </button>
        </div>

        {/* 결제 카드 */}
        <div className="absolute bg-[#005aab] h-[217px] left-1/2 -translate-x-1/2 rounded-[20px] top-[308px] w-[calc(100%-24px)] max-w-[369px]">
          {/* Due Soon 배지 */}
          <div className="absolute bg-[#e4f1ff] left-4 top-4 px-2 py-1 rounded-[20px]">
            <p className="font-normal text-[14px] text-[#1575cb]">
              Due Soon
            </p>
          </div>
          
          {/* 세금 정보 */}
          <p className="absolute font-normal text-[20px] text-white left-4 top-[63px]">
            {selectedTab} 2024 Q4 Personal Income Tax
          </p>
          
          {/* 금액 */}
          <p className="absolute font-bold text-[32px] text-[#fbfbfb] left-4 top-[99px] w-[171px] whitespace-pre-wrap">
            $200.00
          </p>
        </div>

        {/* Pay Now 버튼 */}
        <button
          onClick={onPayNow}
          className="absolute bg-[#f6f6f6] h-[40px] left-1/2 -translate-x-1/2 px-[40px] py-[10px] rounded-[40px] top-[467px] w-[calc(100%-48px)] max-w-[339px] flex items-center justify-center"
        >
          <p className="font-normal text-[18px] text-[#005aab]">
            Pay Now
          </p>
        </button>
      </div>
    </div>
  );
}

