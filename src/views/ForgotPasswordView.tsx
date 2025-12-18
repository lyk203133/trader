import React, { useState, useEffect } from 'react';
import { ArrowLeft, Smartphone, Mail, Lock } from 'lucide-react';
import { ViewProps } from '../types';
import { InputField, NeonButton } from '../components';

const ForgotPasswordView: React.FC<ViewProps> = ({ navigate, t }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleGetSms = () => {
    if(!phone) return alert('Please enter phone number');
    setCountdown(60);
    alert('Verification code sent: 888888'); 
  };

  const handleVerify = () => {
    if(smsCode !== '888888') return alert(t.forgot.errSms || 'Invalid Code');
    setStep(2);
  };

  const handleReset = () => {
    if(!newPass || !confirmPass) return;
    if(newPass !== confirmPass) return alert(t.forgot.errMatch || 'Mismatch');
    alert(t.common.success);
    navigate('login');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 justify-center px-6 relative">
      <div className="absolute top-6 left-4">
        <button onClick={() => navigate('login')} className="p-2 bg-slate-800 rounded-full border border-slate-700 hover:border-emerald-500 transition-all">
          <ArrowLeft className="text-slate-300" size={20} />
        </button>
      </div>
      <div className="z-10 w-full max-w-sm mx-auto">
        <div className="animate-in fade-in slide-in-from-bottom duration-500">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">{step === 1 ? t.forgot.verifyTitle : t.forgot.resetTitle}</h2>
          </div>
          
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs mb-1 uppercase tracking-wider">{t.forgot.phoneLabel}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Smartphone className="h-5 w-5 text-emerald-500" />
                  </div>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 p-3 placeholder-slate-500 transition-colors" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1 uppercase tracking-wider">{t.forgot.smsLabel}</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-emerald-500" />
                    </div>
                    <input 
                      type="text" 
                      value={smsCode} 
                      onChange={(e) => setSmsCode(e.target.value)} 
                      className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 p-3 placeholder-slate-500 transition-colors" 
                    />
                  </div>
                  <button 
                    onClick={handleGetSms} 
                    disabled={countdown > 0} 
                    className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all ${countdown > 0 ? 'bg-slate-700 text-slate-500' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}
                  >
                    {countdown > 0 ? `${countdown}s` : t.forgot.getSms}
                  </button>
                </div>
              </div>
              <NeonButton fullWidth className="mt-4" onClick={handleVerify}>{t.forgot.next}</NeonButton>
            </div>
          ) : (
            <div className="space-y-4">
              <InputField 
                icon={Lock} 
                isSecure={true} 
                placeholder={t.register.passLabel} 
                value={newPass} 
                onChange={(e) => setNewPass(e.target.value)} 
              />
              <InputField 
                icon={Lock} 
                isSecure={true} 
                placeholder={t.register.passConfirmLabel} 
                value={confirmPass} 
                onChange={(e) => setConfirmPass(e.target.value)} 
              />
              <NeonButton fullWidth className="mt-6" onClick={handleReset}>{t.forgot.done}</NeonButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordView;

