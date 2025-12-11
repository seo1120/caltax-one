import React from 'react';
import { Input } from '../components/UI';

export default function Login({ loginForm, setLoginForm, handleLogin, isLoading, loginError }) {
  return (
    <div className="bg-white w-full min-h-screen flex flex-col items-center">
      {/* 배경 이미지 */}
      <div className="h-[137px] w-[163px] mt-[118px] mb-8">
        <div className="w-full h-full flex items-center justify-center">
          <img 
            alt="CalTax One Logo" 
            className="w-full h-full object-contain" 
            src="/caltaxone-logo.png" 
          />
        </div>
      </div>
      
      {/* 폼 영역 */}
      <div className="w-full max-w-[322px] px-4">
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {loginError}
            </div>
          )}
          
          <Input 
            label="Email" 
            name="email"
            type="email"
            value={loginForm.email}
            onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
            placeholder="" 
          />
          <Input 
            label="Password" 
            name="password"
            type="password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
            placeholder="" 
          />
          
          <button
            type="submit"
            onClick={handleLogin}
            disabled={isLoading}
            className="bg-[#005aab] h-10 flex items-center justify-center px-10 py-2.5 rounded-[40px] w-full text-lg font-normal text-white disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Login'}
          </button>
        </form>
        
        {/* Sign Up 링크 */}
        <div className="flex items-center gap-3 text-base leading-normal mt-[184px] justify-center">
          <p className="text-black">Don't have an account?</p>
          <p 
            className="text-[#005aab] underline decoration-solid cursor-pointer"
            onClick={() => {
              // TODO: Sign up 화면으로 이동하는 로직 추가
              console.log('Sign up clicked');
            }}
          >
            Sign Up
          </p>
        </div>
      </div>
    </div>
  );
}

