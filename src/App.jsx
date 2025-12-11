import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User, CreditCard, Building2, CheckCircle, AlertCircle, Loader2, LogOut } from 'lucide-react';
import { signIn, signOut, getCurrentUser, fetchUserAttributes, fetchAuthSession } from 'aws-amplify/auth';
import Onboarding from './Onboarding';

// --- UI 컴포넌트 ---
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

const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

// --- 메인 컴포넌트 ---
export default function CalTaxDemo() {
  // 상태 관리
  const [currentScreen, setCurrentScreen] = useState('login'); // login, onboarding, dashboard
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', ssn: '', address: '', email: '' });
  const [selectedTab, setSelectedTab] = useState('FTB');
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, submitted, completed
  const [notification, setNotification] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  // 타이머 관리를 위한 Ref (메모리 누수 방지)
  const timerRef = useRef(null);
  // DB 조회 중복 방지를 위한 Ref
  const isCheckingDBRef = useRef(false);

  // --- API / 로직 함수들 ---
  
  // DB에서 납부 상태 확인하는 함수 (먼저 정의)
  const checkPaymentStatusFromDB = useCallback(async (emailToCheck) => {
    if (!emailToCheck) {
      return;
    }

    // 이미 조회 중이면 중복 요청 방지
    if (isCheckingDBRef.current) {
      console.log('[DB 조회] 이미 조회 중입니다. 중복 요청을 건너뜁니다.');
      return;
    }

    isCheckingDBRef.current = true;

    try {
      console.log(`[DB 조회 시작] 이메일: ${emailToCheck}`);
      const response = await fetch(`https://pv08g0ynz0.execute-api.us-west-2.amazonaws.com/status?email=${encodeURIComponent(emailToCheck)}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        // 500 에러는 서버 측 문제이므로 조용하게 처리
        if (response.status === 500) {
          console.warn(`[DB 조회] 서버 에러 (500): 서버 측 문제로 납부 상태를 확인할 수 없습니다.`);
          return; // 조용하게 종료
        }
        throw new Error(`Status check failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[DB 납부 상태 응답]:', data);
      
      if (data.paid === true) {
        console.log('[납부 완료 확인] DB에서 납부 완료 상태 확인됨');
        setPaymentStatus('completed');
        if (data.transactionId) {
          setPaymentData({ 
            transactionId: data.transactionId, 
            message: data.message || 'Payment completed successfully' 
          });
        }
      } else {
        console.log('[납부 미완료] DB에서 납부 내역 없음');
        setPaymentStatus('idle');
      }
    } catch (error) {
      // 네트워크 에러나 기타 에러는 조용하게 처리
      if (error.message.includes('500')) {
        console.warn('[DB 조회] 서버 에러: 서버 측 문제로 납부 상태를 확인할 수 없습니다.');
      } else {
        console.warn('[DB 조회] 에러:', error.message);
      }
      // 에러가 발생해도 기본 상태 유지 (idle 상태 유지)
    } finally {
      // 조회 완료 후 플래그 해제 (1초 후에 해제하여 짧은 시간 내 중복 방지)
      setTimeout(() => {
        isCheckingDBRef.current = false;
      }, 1000);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      await getCurrentUser();
      const attributes = await fetchUserAttributes();
      console.log('Cognito 사용자 속성 로드:', attributes);
      
      const mappedUser = {
        name: attributes.name || attributes['custom:name'] || '',
        ssn: attributes['custom:ssn'] || '',
        address: attributes['custom:address'] || '',
        email: attributes.email || ''
      };
      
      setUserInfo(mappedUser);

      // 온보딩 완료 여부 체크
      if (mappedUser.ssn && mappedUser.address) {
        setCurrentScreen('dashboard');
        // 초기 로드 시 DB에서 납부 상태 확인
        if (mappedUser.email) {
          console.log(`[Auth Check] ${mappedUser.email} 사용자의 납부 내역 조회 시작`);
          checkPaymentStatusFromDB(mappedUser.email);
        }
      } else {
        setCurrentScreen('onboarding');
      }
    } catch (error) {
      console.log('미로그인 상태:', error);
      setCurrentScreen('login');
    }
  };

  // 1. [Mount] 초기 인증 상태 확인 및 클린업 설정
  useEffect(() => {
    checkAuthStatus();

    // 컴포넌트가 사라질 때(Unmount) 실행 중인 타이머 취소
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 2. [Dashboard 진입 & 이메일 확보 시] DB 납부 내역 조회 (백업용)
  // 주로 이메일이 나중에 업데이트되었을 때를 대비
  useEffect(() => {
    if (currentScreen === 'dashboard' && userInfo.email && paymentStatus === 'idle' && !isCheckingDBRef.current) {
      console.log(`[Dashboard useEffect] ${userInfo.email} 사용자의 납부 내역 조회 시작`);
      checkPaymentStatusFromDB(userInfo.email);
    }
  }, [currentScreen, userInfo.email, paymentStatus, checkPaymentStatusFromDB]);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    
    try {
      await signIn({ username: loginForm.email, password: loginForm.password });
      
      // 로그인 성공 직후 정보 로드
      const attributes = await fetchUserAttributes();
      const mappedUser = {
        name: attributes.name || attributes['custom:name'] || '',
        ssn: attributes['custom:ssn'] || '',
        address: attributes['custom:address'] || '',
        email: attributes.email || loginForm.email || ''
      };
      
      setUserInfo(mappedUser);
      
      if (mappedUser.ssn && mappedUser.address) {
        setCurrentScreen('dashboard');
        // 로그인 직후 DB에서 납부 상태 확인
        if (mappedUser.email) {
          console.log(`[Login] ${mappedUser.email} 사용자의 납부 내역 조회 시작`);
          checkPaymentStatusFromDB(mappedUser.email);
        }
      } else {
        setCurrentScreen('onboarding');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      setLoginError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    const attributes = await fetchUserAttributes();
    const updatedUser = {
      name: attributes.name || attributes['custom:name'] || '',
      ssn: attributes['custom:ssn'] || '',
      address: attributes['custom:address'] || '',
      email: attributes.email || ''
    };
    setUserInfo(prev => ({
      ...prev,
      ...updatedUser
    }));
    setCurrentScreen('dashboard');
    // 온보딩 완료 후 DB에서 납부 상태 확인
    if (updatedUser.email) {
      console.log(`[Onboarding Complete] ${updatedUser.email} 사용자의 납부 내역 조회 시작`);
      checkPaymentStatusFromDB(updatedUser.email);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('로그아웃 에러:', error);
    } finally {
      // 상태 초기화
      setUserInfo({ name: '', ssn: '', address: '', email: '' });
      setLoginForm({ email: '', password: '' });
      setPaymentStatus('idle');
      setPaymentData(null);
      setCurrentScreen('login');
    }
  };

  // 탭 변경 시 상태 초기화 및 진행 중인 시뮬레이션 취소
  const handleTabChange = (tab) => {
    if (timerRef.current) clearTimeout(timerRef.current); // 기존 타이머 취소
    setSelectedTab(tab);
    setPaymentStatus('idle');
    setNotification(null);
    setPaymentData(null);
  };

  const handlePayment = async () => {
    setPaymentStatus('processing');
    setNotification(null);
    
    try {
      const session = await fetchAuthSession();
      const accessToken = session.tokens?.accessToken?.toString();
      
      const response = await fetch('https://pv08g0ynz0.execute-api.us-west-2.amazonaws.com/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        },
        body: JSON.stringify({
          amount: 200,
          agency: selectedTab,
          payerName: userInfo.name,
          ssn: userInfo.ssn,
          address: userInfo.address,
          email: userInfo.email,
        }),
      });

      if (!response.ok) throw new Error(`Payment API Error: ${response.status}`);

      const data = await response.json();
      console.log('결제 요청 성공:', data);
      setPaymentData(data);
      setPaymentStatus('submitted');
      
      // 비동기 처리 시뮬레이션 시작
      startWorkerLambdaSimulation();
      
    } catch (error) {
      console.error('결제 요청 실패:', error);
      setPaymentStatus('idle');
      setNotification(`❌ Error: ${error.message}`);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const startWorkerLambdaSimulation = () => {
    // 기존 타이머가 있다면 취소 (안전장치)
    if (timerRef.current) clearTimeout(timerRef.current);

    // Ref에 타이머 ID 저장
    timerRef.current = setTimeout(() => {
      setPaymentStatus('completed');
      setNotification(`📧 [Email Received] Payment Confirmation: $200.00 to ${selectedTab} processed.`);
      
      // DB 상태 재확인
      if (userInfo.email) {
        // DB 반영 딜레이를 고려해 1초 뒤 조회
        setTimeout(() => checkPaymentStatusFromDB(userInfo.email), 1000);
      }
    }, 4000);
  };

  // --- 렌더링 ---

  if (currentScreen === 'login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">CalTax One</h1>
            <p className="text-gray-500">Secure Login with Amazon Cognito</p>
          </div>
          
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <Input 
              label="Email" 
              value={loginForm.email}
              onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
              placeholder="demo@caltax.gov" 
            />
            <Input 
              label="Password" 
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              placeholder="••••••••" 
            />
            <Button onClick={handleLogin} disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Log In'}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  if (currentScreen === 'onboarding') {
    return (
      <Onboarding 
        onComplete={handleOnboardingComplete}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
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

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hello, {userInfo.name || 'User'}</h1>
            <p className="text-gray-500">Welcome to your tax dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {['FTB', 'EDD', 'CDTFA'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`pb-4 px-4 font-medium transition-colors relative ${
                selectedTab === tab ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
              {selectedTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>

        <Card>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{selectedTab} Payment</h2>
              <p className="text-sm text-gray-500">2024 Q1 Estimated Tax</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">$200.00</p>
              <p className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full mt-1 inline-block">Due Soon</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Payer Information (Pre-filled)</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Name:</span> <span className="font-medium">{userInfo.name || 'Not set'}</span>
              </div>
              <div>
                <span className="text-gray-500">SSN:</span> <span className="font-medium">{userInfo.ssn ? '***-**-' + userInfo.ssn.slice(-4) : 'Not set'}</span>
              </div>
            </div>
          </div>

          {paymentStatus === 'idle' && (
            <div className="space-y-4">
               <div className="flex items-center gap-3 p-3 border border-blue-200 bg-blue-50 rounded-lg cursor-pointer">
                  <CreditCard className="text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-900">Bank Transfer (ACH)</p>
                    <p className="text-xs text-blue-600">
                      {userInfo.address ? `Connected: ${userInfo.address.split(',')[0]}` : 'Payment method not configured'}
                    </p>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-200"></div>
               </div>
              <Button onClick={handlePayment}>Submit & Pay $200.00</Button>
            </div>
          )}

          {paymentStatus === 'processing' && (
            <div className="text-center py-8">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="font-medium text-gray-900">Processing Request...</p>
              <p className="text-sm text-gray-500">Sending to "Brain" Lambda</p>
            </div>
          )}

          {paymentStatus === 'submitted' && (
            <div className="text-center py-6 bg-green-50 rounded-lg border border-green-100">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-green-800">Request Received!</h3>
              <p className="text-sm text-green-600 mb-4">
                We have queued your payment. <br/>
                The "Worker Lambda" is processing it in the background.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                Waiting for final confirmation...
              </div>
            </div>
          )}

          {paymentStatus === 'completed' && (
            <div className="text-center py-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Payment Successful</h3>
              <p className="text-gray-500 mb-6">
                {paymentData?.transactionId ? (
                  <>Transaction ID: {paymentData.transactionId}<br/></>
                ) : null}
                {paymentData?.message || 'Added to official ledger.'}
              </p>
              <Button variant="secondary" onClick={() => { setPaymentStatus('idle'); setPaymentData(null); }}>Make Another Payment</Button>
            </div>
          )}

        </Card>
      </div>
    </div>
  );
}