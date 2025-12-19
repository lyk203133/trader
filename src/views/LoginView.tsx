import React, { useState } from 'react';
import { Shield, Loader2 } from 'lucide-react';
import { ViewProps } from '../types';
import { InputField, NeonButton, LanguageSwitcher } from '../components';
import { User, Lock, Key } from 'lucide-react';
import { authApi } from '../services/api';

const LoginView: React.FC<ViewProps> = ({ navigate, t, lang, setLang }) => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 获取验证码图片
  const fetchCaptcha = async () => {
    try {
      // 这里假设API返回base64格式的图片
      const response = await authApi.getCaptcha();
      if (response.data?.captchaImage) {
        setCaptchaId(response.data?.id);
        setCaptchaImage(response.data?.captchaImage);
      }
    } catch (err) {
      console.error('获取验证码失败:', err);
      // 模拟一个验证码（实际开发中应从API获取）
       setCaptchaId(0);
      setCaptchaImage('data:image/svg+xml;base64,' + btoa(`
        <svg width="120" height="40" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="40" fill="#1e293b"/>
          <text x="10" y="25" font-family="Arial" font-size="16" fill="#10b981">${Math.random().toString(36).substr(2, 6).toUpperCase()}</text>
          <line x1="0" y1="10" x2="120" y2="30" stroke="#475569" stroke-width="1"/>
          <line x1="0" y1="30" x2="120" y2="10" stroke="#475569" stroke-width="1"/>
        </svg>
      `));
    }
  };

  // 组件加载时获取验证码
  React.useEffect(() => {
    fetchCaptcha();
  }, []);

  // 刷新验证码
  const refreshCaptcha = () => {
    fetchCaptcha();
  };

  // 处理登录
  const handleLogin = async () => {
    // 验证输入
    if (!account.trim()) {
      setError(t.login.errors?.accountRequired || '请输入账号');
      return;
    }
    if (!password.trim()) {
      setError(t.login.errors?.passwordRequired || '请输入密码');
      return;
    }
    if (!captcha.trim()) {
      setError(t.login.errors?.captchaRequired || '请输入验证码');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 调用登录API
      const response = await authApi.login({
        account: account.trim(),
        password: password.trim(),
        captcha: captcha.trim(),
        captchaId:captchaId
      });

      // 处理登录成功
      if (response.data?.token) {
        // 存储token
        localStorage.setItem('token', response.data.token);
        
        // 存储用户信息
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        // 登录成功，跳转到仪表板
        navigate('dashboard');
        
        // 显示成功消息（如果有的话）
        if (response.data.message) {
          // 可以使用toast或消息提示组件
          console.log('登录成功:', response.data.message);
        }
      } else {
        setError(t.login.errors?.invalidCredentials || '登录失败，请检查账号密码');
      }
    } catch (err: any) {
      // 处理错误
      console.error('登录错误:', err);
      
      // 根据错误类型显示不同的错误消息
      if (err.response?.status === 401) {
        setError(t.login.errors?.invalidCredentials || '账号或密码错误');
      } else if (err.response?.status === 403) {
        setError(t.login.errors?.invalidCaptcha || '验证码错误');
      } else if (err.response?.status === 429) {
        setError(t.login.errors?.tooManyAttempts || '尝试次数过多，请稍后再试');
      } else if (err.message === 'Network Error') {
        setError(t.login.errors?.networkError || '网络错误，请检查网络连接');
      } else {
        setError(t.login.errors?.unknownError || `登录失败: ${err.message || '未知错误'}`);
      }
      
      // 登录失败时刷新验证码
      refreshCaptcha();
    } finally {
      setLoading(false);
      setCaptcha(''); // 清空验证码输入
    }
  };

  // 处理回车键登录
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleLogin();
    }
  };

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
        
        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/50 rounded-lg text-rose-300 text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4" onKeyPress={handleKeyPress}>
          <InputField 
            icon={User} 
            placeholder={t.login.accPlaceholder} 
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            disabled={loading}
          />
          
          <InputField 
            icon={Lock} 
            isSecure={true} 
            placeholder={t.login.passPlaceholder} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          
          {/* 验证码输入区域 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <InputField 
                icon={Key}
                isSecure={false}
                placeholder={t.login.captchaPlaceholder}
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                disabled={loading}
                className="flex-1"
              />
              
              {/* 验证码图片 */}
              <div 
                className="h-12 w-32 rounded-lg border border-slate-700 bg-slate-800 overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-colors"
                onClick={refreshCaptcha}
                title={t.login.refreshCaptcha || "点击刷新验证码"}
              >
                {captchaImage ? (
                  <img 
                    src={captchaImage} 
                    alt="验证码" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 size={20} className="text-slate-500 animate-spin" />
                  </div>
                )}
              </div>
            </div>
            
            {/* 刷新验证码提示 */}
            <p className="text-xs text-slate-500 text-right">
              {t.login.captchaHint || "看不清？点击图片刷新"}
            </p>
          </div>
          
          {/* 登录按钮 */}
          <NeonButton 
            fullWidth 
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.login.loggingIn || "登录中..."}
              </span>
            ) : (
              t.login.loginBtn
            )}
          </NeonButton>
          
          <div className="flex justify-between text-xs text-slate-400 mt-4">
            <button 
              onClick={() => navigate('register')} 
              className="hover:text-emerald-400 underline decoration-slate-600 disabled:opacity-50"
              disabled={loading}
            >
              {t.login.register}
            </button>
            <button 
              onClick={() => navigate('forgot-password')} 
              className="hover:text-emerald-400 hover:underline decoration-slate-600 transition-all disabled:opacity-50"
              disabled={loading}
            >
              {t.login.forgotPass}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;