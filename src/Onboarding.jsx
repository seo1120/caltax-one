// src/Onboarding.jsx
import React, { useState } from 'react';
import { updateUserAttributes } from 'aws-amplify/auth';

const Card = ({ children, className }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, disabled, variant = 'primary' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-3 rounded-lg font-bold transition-all duration-200 ${
      variant === 'primary'
        ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
);

const Input = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Complete Your Profile</h2>
          <p className="text-gray-500 text-sm">Enter this once, we'll save it securely to AWS Cognito.</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <Input 
          label="Full Name" 
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Alex Kim" 
        />

        <Input 
          label="SSN (Social Security Number)" 
          name="ssn"
          value={formData.ssn}
          onChange={handleChange}
          placeholder="XXX-XX-XXXX" 
        />

        <Input 
          label="Primary Address" 
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="1234 Irvine Blvd, CA" 
        />

        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving to Cognito...' : 'Save & Continue'}
        </Button>
      </Card>
    </div>
  );
}

export default Onboarding;