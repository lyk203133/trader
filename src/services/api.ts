import axios, { AxiosError } from 'axios';

// 配置axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.request);
    } else {
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// 登录API接口
export const authApi = {
  // 登录
  login: async (credentials: { account: string; password: string; captcha?: string,captchaId?:string }) => {
    return api.post('/auth.php', credentials);
  },

  // 注册
  register: async (userData: { account: string; password: string; email?: string; inviteCode?: string }) => {
    return api.post('/auth/register', userData);
  },

  // 忘记密码
  forgotPassword: async (email: string) => {
    return api.post('/auth/forgot-password', { email });
  },

  // 重置密码
  resetPassword: async (data: { token: string; newPassword: string }) => {
    return api.post('/auth/reset-password', data);
  },

  // 获取验证码
  getCaptcha: async () => {
    return api.get('/captcha.php');
  },

  // 验证验证码
  verifyCaptcha: async (captcha: string) => {
    return api.post('/auth/verify-captcha', { captcha });
  },
};

// 用户相关API
export const userApi = {
  // 获取用户信息
  getUserInfo: async () => {
    return api.get('/user/info');
  },

  // 更新用户信息
  updateUserInfo: async (userInfo: any) => {
    return api.put('/user/info', userInfo);
  },
};

export default api;