import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { ViewProps } from '../types';
import { InputField, NeonButton, LanguageSwitcher } from '../components';
import { User, Lock, Key } from 'lucide-react';

const LoginView: React.FC<ViewProps> = ({ navigate, t, lang, setLang }) => {
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');

  return (
    <div className="flex flex-col h-full justify-center px-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-60 h-60 bg-rose-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-6 right-6 z-20">
        <LanguageSwitcher currentLang={lang} setLang={setLang} />
      </div>
      <div className="z-10 w-full max-w-sm mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-4">
            <Shield size={40} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-widest">{t.appName}</h1>
          <p className="text-slate-400 text-sm mt-2">{t.appSub}</p>
        </div>
        <div className="space-y-4">
          <InputField icon={User} placeholder={t.login.accPlaceholder} />
          <InputField 
            icon={Lock} 
            isSecure={true} 
            placeholder={t.login.passPlaceholder} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputField 
            icon={Key} 
            isSecure={true} 
            placeholder={t.login.captchaPlaceholder} 
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
          />
          <NeonButton fullWidth onClick={() => navigate('dashboard')}>{t.login.loginBtn}</NeonButton>
          <div className="flex justify-between text-xs text-slate-400 mt-4">
            <button onClick={() => navigate('register')} className="hover:text-emerald-400 underline decoration-slate-600">{t.login.register}</button>
            <button onClick={() => navigate('forgot-password')} className="hover:text-emerald-400 hover:underline decoration-slate-600 transition-all">{t.login.forgotPass}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;

