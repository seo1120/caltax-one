import React from 'react';

export default function Landing({ onGetStarted }) {
  return (
    <div className="bg-white relative w-full min-h-screen overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute top-[10%] left-0 right-0 flex items-center justify-center">
        <div className="relative w-full max-w-md h-[250px] md:h-[300px] flex items-center justify-center">
          <div className="absolute inset-0 overflow-hidden">
            <img 
              alt="CalTax One" 
              className="w-full h-full object-contain" 
              src="/caltaxone-logo.png" 
            />
          </div>
        </div>
      </div>
      
      {/* 콘텐츠 오버레이 */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center w-full max-w-md">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">CalTax One</h1>
          <p className="text-xl text-gray-600 mb-8">Your trusted tax payment platform</p>
          <button
            onClick={onGetStarted}
            className="px-8 py-3 text-white rounded-lg font-bold transition-all duration-200 w-auto mx-auto"
            style={{ backgroundColor: '#005AAB' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004A8B'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#005AAB'}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

