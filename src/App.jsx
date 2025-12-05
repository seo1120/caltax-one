import React, { useState, useEffect } from 'react';
import { User, CreditCard, Building2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// 간단한 스타일을 위한 컴포넌트
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

export default function CalTaxDemo() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', ssn: '', address: '' });
  const [selectedTab, setSelectedTab] = useState('FTB');
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [notification, setNotification] = useState(null);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentScreen('onboarding');
    }, 1000);
  };

  const handleOnboarding = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentScreen('dashboard');
    }, 1000);
  };

  const handlePayment = () => {
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('submitted');
      startWorkerLambdaSimulation();
    }, 1000);
  };

  const startWorkerLambdaSimulation = () => {
    setTimeout(() => {
      setPaymentStatus('completed');
      setNotification("📧 [Email Received] Payment Confirmation: Your $200 to FTB has been successfully processed.");
    }, 4000);
  };

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
          <Input label="Email" placeholder="demo@caltax.gov" />
          <Input label="Password" type="password" placeholder="••••••••" />
          <Button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Log In'}
          </Button>
        </Card>
      </div>
    );
  }

  if (currentScreen === 'onboarding') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Complete Your Profile</h2>
            <p className="text-gray-500 text-sm">Enter this once, we'll save it securely.</p>
          </div>
          <Input 
            label="Full Name" 
            value={userInfo.name} 
            onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
            placeholder="Alex Kim" 
          />
          <Input 
            label="SSN (Social Security Number)" 
            value={userInfo.ssn}
            onChange={(e) => setUserInfo({...userInfo, ssn: e.target.value})}
            placeholder="XXX-XX-XXXX" 
          />
          <Input 
            label="Primary Address" 
            value={userInfo.address}
            onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
            placeholder="1234 Irvine Blvd, CA" 
          />
          <Button onClick={handleOnboarding} disabled={isLoading}>
            {isLoading ? 'Saving to Aurora DB...' : 'Save & Continue'}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {notification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 animate-bounce z-50">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{notification}</span>
          <button onClick={() => setNotification(null)} className="ml-2 text-green-200">✕</button>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hello, {userInfo.name || 'User'}</h1>
            <p className="text-gray-500">Welcome to your tax dashboard</p>
          </div>
          <div className="bg-white p-2 rounded-full shadow-sm">
            <User className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {['FTB', 'EDD', 'CDTFA'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setSelectedTab(tab); setPaymentStatus('idle'); setNotification(null); }}
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
                <span className="text-gray-500">Name:</span> <span className="font-medium">{userInfo.name || 'Alex Kim'}</span>
              </div>
              <div>
                <span className="text-gray-500">SSN:</span> <span className="font-medium">{userInfo.ssn ? '***-**-' + userInfo.ssn.slice(-4) : '***-**-1234'}</span>
              </div>
            </div>
          </div>

          {paymentStatus === 'idle' && (
            <div className="space-y-4">
               <div className="flex items-center gap-3 p-3 border border-blue-200 bg-blue-50 rounded-lg cursor-pointer">
                  <CreditCard className="text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-900">Bank Transfer (ACH)</p>
                    <p className="text-xs text-blue-600">Connected: Chase ****8899</p>
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
                Transaction ID: #FTB-2025-8829<br/>
                Added to official ledger.
              </p>
              <Button variant="secondary" onClick={() => setPaymentStatus('idle')}>Make Another Payment</Button>
            </div>
          )}

        </Card>
      </div>
    </div>
  );
}