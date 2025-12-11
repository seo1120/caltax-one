import React, { useState } from 'react';
import { updateUserAttributes } from 'aws-amplify/auth';
import { Input } from '../components/UI';

function Onboarding({ onComplete, userInfo, setUserInfo }) {
  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    ssn: userInfo?.ssn || '',
    address: userInfo?.address || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 입력값 변경 처리
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  // "Save & Continue" 버튼 클릭 시 실행
  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. AWS Cognito에 정보 저장 (핵심!)
      await updateUserAttributes({
        userAttributes: {
          name: formData.name,
          'custom:ssn': formData.ssn,       // Cognito에서 만든 속성 이름
          'custom:address': formData.address // Cognito에서 만든 속성 이름
        },
      });
      
      // 2. 로컬 상태도 업데이트
      if (setUserInfo) {
        setUserInfo(formData);
      }
      
      // 3. 저장 성공하면 상위 컴포넌트(App.jsx)에 알려줌 -> 메인 화면으로 전환됨
      onComplete(); 
      
    } catch (error) {
      console.error("저장 실패:", error);
      setError(error.message || "저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const imgSimpleLineIconsCheck = "https://www.figma.com/api/mcp/asset/9b799d42-4a4f-47a4-a7b7-89cbe66d0acf";

  return (
    <div className="bg-white relative w-full min-h-screen overflow-hidden">
      {/* 헤더 영역 */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[124px] w-[282px] flex flex-col gap-2">
        <div className="flex gap-2 items-center w-full">
          <h2 className="text-2xl font-normal text-black">Complete Your Profile</h2>
          <div className="relative shrink-0 size-[25px]">
            <img alt="" className="block max-w-none size-full" src={imgSimpleLineIconsCheck} />
          </div>
        </div>
        <p className="text-base font-normal text-black w-full whitespace-pre-wrap">
          Enter this once, we'll save it securely.
        </p>
      </div>

      {/* 폼 영역 */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[226px] w-[342px] flex flex-col gap-5 items-center">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm w-full">
            {error}
          </div>
        )}

        <div className="flex flex-col items-start w-[322px]">
          <Input 
            label="Full Name" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="" 
          />
        </div>

        <div className="flex flex-col items-start p-2.5 w-full">
          <div className="flex flex-col items-start w-full">
            <Input 
              label="SSN (Social Security Number)" 
              name="ssn"
              value={formData.ssn}
              onChange={handleChange}
              placeholder="" 
            />
          </div>
        </div>

        <div className="flex flex-col items-start p-2.5 w-full">
          <div className="flex flex-col items-start w-full">
            <Input 
              label="Primary Address" 
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="" 
            />
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[597px]">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-[#005aab] h-10 flex items-center justify-center px-10 py-2.5 rounded-[40px] w-[322px] text-lg font-normal text-white disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </div>
  );
}

export default Onboarding;

