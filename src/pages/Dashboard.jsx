import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const imgMaterialSymbolsLightLabProfileOutlineRounded = "https://www.figma.com/api/mcp/asset/860da5a0-f492-48ab-92c8-8dee10c31a56";
const imgCarbonSecurity = "https://www.figma.com/api/mcp/asset/562cd119-2f1b-485d-b3da-18b758b7bd36";
const imgRiDashboardLine = "https://www.figma.com/api/mcp/asset/5d3ad30d-26f4-4f50-aa74-0aa559a43cb8";
const imgGroup = "https://www.figma.com/api/mcp/asset/d470cf6a-49ab-4d19-8248-b80bfd53ed86";
const imgUilCalender = "https://www.figma.com/api/mcp/asset/cea5319f-14c6-4e16-9e7e-e9191126d7b0";
const imgEllipse18 = "https://www.figma.com/api/mcp/asset/4eb3c8d5-a8af-41aa-a776-094a783f18fb";

// 달력 데이터 생성 (특정 월)
const getCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const days = [];
  // 빈 칸 (이전 달)
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  // 현재 달 날짜
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }
  return days;
};

// 현재 달의 달력 데이터 생성
const getCurrentMonth = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const date = new Date(year, month, 1);
  
  return {
    year: year,
    month: month,
    monthName: date.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
    days: getCalendarDays(year, month)
  };
};

export default function Dashboard({ 
  userInfo, 
  notification, 
  setNotification,
  onLogout,
  onReviewPay,
  setSelectedTab
}) {
  const currentMonth = getCurrentMonth();
  const importantDates = [20, 22, 27]; // 결제 마감일

  return (
    <div className="bg-white relative w-full min-h-screen">
      <div className="max-w-md mx-auto relative pb-8">
        {notification && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-3 animate-bounce z-50 ${
            notification.startsWith('❌') ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
          }`}>
            {notification.startsWith('❌') ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{notification}</span>
            <button 
              onClick={() => setNotification(null)} 
              className="ml-2 opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* 프로필 아이콘 */}
        <button
          onClick={onLogout}
          className="absolute right-4 top-8 overflow-clip size-[31px] cursor-pointer hover:opacity-80 transition-opacity z-30"
        >
          <div className="absolute inset-[4.17%]">
            <img alt="" className="block max-w-none size-full" src={imgGroup} />
          </div>
        </button>

        {/* 로고 이미지 */}
        <div className="absolute h-[59px] left-4 top-6 w-[60px]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
            <img alt="CalTax One Logo" className="w-full h-full object-contain" src="/caltaxone-logo.png" />
          </div>
        </div>

        {/* 헤더 영역 */}
        <div className="absolute left-4 top-[125px] w-[204px] flex flex-col gap-[11px]">
          <p className="font-bold text-[32px] text-black w-[191px] whitespace-pre-wrap">
            Hello, {userInfo.name?.split(' ')[0] || 'User'}
          </p>
          <div className="flex gap-[7px] items-center">
            <div className="relative shrink-0 size-[19px]">
              <img alt="" className="block max-w-none size-full" src={imgMaterialSymbolsLightLabProfileOutlineRounded} />
            </div>
            <p className="font-normal text-[17px] text-[#6d6d6d]">
              {userInfo.name || 'Not set'}
            </p>
          </div>
          <div className="flex gap-[7px] items-center">
            <div className="relative shrink-0 size-[14px]">
              <img alt="" className="block max-w-none size-full" src={imgCarbonSecurity} />
            </div>
            <p className="font-normal text-[17px] text-[#6d6d6d]">
              {userInfo.ssn ? '***-**-' + userInfo.ssn.slice(-4) : 'Not set'}
            </p>
          </div>
        </div>

        {/* 대시보드 라벨 */}
        <div className="absolute left-4 size-[18px] top-[285px]">
          <img alt="" className="block max-w-none size-full" src={imgRiDashboardLine} />
        </div>
        <p className="absolute font-normal left-[22px] text-[16px] text-[#afd5ff] top-[284px]">
          Dashboard
        </p>

        {/* 큰 파란 카드 - Total Amount Due */}
        <div className="absolute bg-[#005aab] h-[304px] left-1/2 -translate-x-1/2 rounded-[20px] top-[267px] w-[calc(100%-24px)] max-w-[369px]">
          <div className="absolute left-[35px] top-[53px] w-[171px] flex flex-col gap-4 items-start justify-center text-[#fbfbfb]">
            <p className="font-normal text-[20px] w-full">Total Amount Due</p>
            <p className="font-bold text-[32px] w-full">$600.00</p>
          </div>
        </div>

        {/* 작은 파란 카드들 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[423px] flex gap-4 w-[calc(100%-48px)] max-w-[369px]">
          <div className="bg-[#1575cb] h-[77px] rounded-[16px] flex-1 flex flex-col justify-center items-start pl-4 text-[#fbfbfb]">
            <p className="text-[16.551px]">Payments Due</p>
            <p className="text-[20px]">3</p>
          </div>
          <div className="bg-[#1575cb] h-[77px] rounded-[16px] flex-1 flex flex-col justify-center items-start pl-4 text-[#fbfbfb]">
            <p className="text-[16.551px]">Recent payment</p>
            <p className="text-[20px]">$200.00</p>
          </div>
        </div>

        {/* Review & Pay 버튼 */}
        <div className="absolute bg-[#f6f6f6] h-[40px] left-1/2 -translate-x-1/2 px-[40px] py-[10px] rounded-[40px] top-[517px] w-[calc(100%-48px)] max-w-[339px] flex items-center justify-center">
          <button
            onClick={onReviewPay}
            className="font-normal text-[18px] text-[#005aab]"
          >
            Review & Pay
          </button>
        </div>

        {/* Upcoming Deadlines */}
        <div className="absolute left-4 top-[598px] flex gap-[4px] items-center">
          <div className="relative shrink-0 size-[18px]">
            <img alt="" className="block max-w-none size-full" src={imgUilCalender} />
          </div>
          <p className="font-normal text-[16px] text-black">Upcoming Deadlines</p>
        </div>

        {/* Deadline 항목들 */}
        <div className="absolute left-4 size-[11px] top-[641px]">
          <div className="absolute inset-0">
            <img alt="" className="block max-w-none size-full" src={imgEllipse18} />
          </div>
        </div>
        <p className="absolute font-normal left-[23px] text-[18px] text-black top-[636px]">12/20</p>
        <p className="absolute font-normal left-[79px] text-[17px] text-black top-[636.5px]">FTB Payment</p>

        <div className="absolute left-4 size-[11px] top-[676px]">
          <div className="absolute inset-0">
            <img alt="" className="block max-w-none size-full" src={imgEllipse18} />
          </div>
        </div>
        <p className="absolute font-normal left-[23px] text-[18px] text-black top-[671px]">12/22</p>
        <p className="absolute font-normal left-[79px] text-[17px] text-black top-[671.5px]">EDD Payment</p>

        <div className="absolute left-4 size-[11px] top-[711px]">
          <div className="absolute inset-0">
            <img alt="" className="block max-w-none size-full" src={imgEllipse18} />
          </div>
        </div>
        <p className="absolute font-normal left-[23px] text-[18px] text-black top-[706px]">12/27</p>
        <p className="absolute font-normal left-[79px] text-[17px] text-black top-[706.5px]">CDTFA Payment</p>

        {/* 캘린더 그리드 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[761px] w-[calc(100%-42px)] max-w-[336px] pb-4">
          <div className="flex flex-col gap-4">
            {/* 월 헤더 */}
            <div className="text-center text-lg font-semibold text-black mb-2">
              {currentMonth.monthName}
            </div>
            
            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                <div key={idx} className="text-center text-xs font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            
            {/* 달력 날짜 */}
            <div className="grid grid-cols-7 gap-2">
              {currentMonth.days.map((day, idx) => {
                if (day === null) {
                  return <div key={idx} className="size-[39px]"></div>;
                }
                const isImportant = importantDates.includes(day);
                return (
                  <div
                    key={idx}
                    className={`size-[39px] rounded-full flex items-center justify-center text-sm font-medium ${
                      isImportant
                        ? 'bg-[#1575cb] text-white'
                        : 'bg-[#f6f6f6] text-black'
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

