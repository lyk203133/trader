import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, User, Lock, Smartphone, Mail, Shield, 
  Camera, CreditCard, FileText, Upload, AlertTriangle, 
  Ticket, RefreshCcw 
} from 'lucide-react';
import { ViewProps } from '../types';
import { InputField, NeonButton } from '../components';

const RegisterView: React.FC<ViewProps> = ({ navigate, t }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [txPass, setTxPass] = useState('');

  useEffect(() => {
    setGeneratedCaptcha(Math.random().toString(36).substring(2, 6).toUpperCase());
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleGetSms = () => {
    if(!phone) return alert('請輸入手機號碼');
    if(countdown === 0) {
      setCountdown(60);
      alert('驗證碼已發送 (模擬: 123456)');
    }
  };

  const handleNextStep = () => {
    if(captchaInput.toUpperCase() !== generatedCaptcha) {
      return alert(t.register.errCaptcha);
    }
    if(!smsCode) {
      return alert(t.register.errSms);
    }
    setStep(2);
  };
  
  const handleUpload = (id: string) => {
    const btn = document.getElementById(id);
    if(btn) {
      btn.classList.add("border-emerald-500", "text-emerald-400");
      btn.classList.remove("border-slate-700", "text-slate-400", "border-dashed");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-4 border-b border-slate-800 flex items-center">
        <button onClick={() => step === 1 ? navigate('login') : setStep(1)} className="p-2">
          <ArrowLeft className="text-slate-300" />
        </button>
        <span className="ml-2 font-bold text-white">{step === 1 ? t.register.title : t.register.kycTitle}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-24 no-scrollbar">
        {step === 1 ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
            <InputField icon={User} label={t.register.accLabel} />
            <InputField 
              icon={Lock} 
              isSecure={true} 
              label={t.register.passLabel} 
              value={pass} 
              onChange={(e) => setPass(e.target.value)} 
            />
            <InputField 
              icon={Lock} 
              isSecure={true} 
              label={t.register.passConfirmLabel} 
              value={confirmPass} 
              onChange={(e) => setConfirmPass(e.target.value)} 
            />
            
            <div>
              <label className="block text-slate-400 text-xs mb-1 uppercase tracking-wider">{t.register.phoneLabel}</label>
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
              <label className="block text-slate-400 text-xs mb-1 uppercase tracking-wider">{t.register.smsLabel}</label>
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
                  {countdown > 0 ? `${countdown} ${t.register.resendSms}` : t.register.getSms}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1 uppercase tracking-wider">{t.register.captchaLabel}</label>
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-emerald-500" />
                  </div>
                  <input 
                    type="text" 
                    value={captchaInput} 
                    onChange={(e) => setCaptchaInput(e.target.value)} 
                    placeholder={t.register.captchaPlaceholder} 
                    className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 p-3 placeholder-slate-500 transition-colors" 
                  />
                </div>
                <div 
                  onClick={() => setGeneratedCaptcha(Math.random().toString(36).substring(2, 6).toUpperCase())} 
                  className="bg-slate-700 px-4 py-3 rounded-lg text-white font-mono font-bold tracking-widest cursor-pointer hover:bg-slate-600 select-none flex items-center gap-2" 
                  title="點擊刷新"
                >
                  {generatedCaptcha} <RefreshCcw size={14} />
                </div>
              </div>
            </div>

            <InputField 
              icon={Ticket} 
              label={t.register.inviteLabel} 
              placeholder={t.register.invitePlaceholder} 
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
            />

            <InputField 
              icon={Shield} 
              isSecure={true} 
              label={t.register.txPassLabel} 
              subLabel={t.register.txPassSub} 
              value={txPass}
              onChange={(e) => setTxPass(e.target.value)}
            />
            <NeonButton fullWidth className="mt-8" onClick={handleNextStep}>{t.register.next}</NeonButton>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <section>
              <h3 className="text-emerald-400 text-sm font-bold mb-3 uppercase tracking-wider flex items-center">
                <User size={16} className="mr-2"/> {t.register.idCard}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  id="id_front" 
                  onClick={() => handleUpload('id_front')} 
                  className="h-32 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 transition-all"
                >
                  <Camera className="mb-2 opacity-50" />
                  <span className="text-xs">{t.register.uploadFront}</span>
                </button>
                <button 
                  id="id_back" 
                  onClick={() => handleUpload('id_back')} 
                  className="h-32 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 transition-all"
                >
                  <Camera className="mb-2 opacity-50" />
                  <span className="text-xs">{t.register.uploadBack}</span>
                </button>
              </div>
            </section>

            <section>
              <h3 className="text-emerald-400 text-sm font-bold mb-3 uppercase tracking-wider flex items-center">
                <CreditCard size={16} className="mr-2"/> {t.register.bankCard}
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button 
                  id="bank_front" 
                  onClick={() => handleUpload('bank_front')} 
                  className="h-24 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 hover:bg-slate-800 transition-all"
                >
                  <span className="text-xs">{t.register.bankCardFront}</span>
                </button>
                <button 
                  id="bank_back" 
                  onClick={() => handleUpload('bank_back')} 
                  className="h-24 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 hover:bg-slate-800 transition-all"
                >
                  <span className="text-xs">{t.register.bankCardBack}</span>
                </button>
              </div>
              <InputField icon={FileText} placeholder={t.register.bankName} />
              <InputField icon={FileText} placeholder={t.register.branchCode} />
              <InputField icon={FileText} placeholder={t.register.bankAcc} />
            </section>

            <section className="bg-slate-800 p-4 rounded-xl border border-rose-900/50">
              <h3 className="text-rose-400 text-sm font-bold mb-3 uppercase tracking-wider flex items-center">
                <AlertTriangle size={16} className="mr-2"/> {t.register.qrCode}
              </h3>
              <p className="text-xs text-slate-400 mb-4">{t.register.qrDesc}</p>
              <button 
                id="qr_upload" 
                onClick={() => handleUpload('qr_upload')} 
                className="w-full h-40 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-rose-500 hover:bg-slate-800 transition-all bg-slate-900"
              >
                <Upload className="mb-2" />
                <span className="text-xs font-bold">{t.register.uploadQR}</span>
              </button>
            </section>

            <NeonButton fullWidth className="mt-8" onClick={() => navigate('login')}>{t.register.submitAudit}</NeonButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterView;

