import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { api } from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('auth_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user_info') || 'null'))
  const refreshToken = ref(localStorage.getItem('refresh_token') || null)
  const loading = ref(false)
  const error = ref(null)
  const refreshTimer = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  // 解析 JWT 获取过期时间
  function getTokenExpiration(token) {
    if (!token) return null
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp ? payload.exp * 1000 : null // 转换为毫秒
    } catch {
      return null
    }
  }

  // 设置自动刷新定时器
  function setupTokenRefresh() {
    
    clearRefreshTimer()
    
    if (!token.value || !refreshToken.value) return
    
    const expirationTime = getTokenExpiration(token.value)
    if (!expirationTime) return
    
    // 在 token 过期前 1 分钟刷新
    const refreshTime = expirationTime -  60 * 1000 - Date.now()
    
    if (refreshTime > 0) {
      refreshTimer.value = setTimeout(async () => {
        await refreshAuthToken()
      }, 60000)
    }
  }

  // 清除刷新定时器
  function clearRefreshTimer() {
    if (refreshTimer.value) {
      clearTimeout(refreshTimer.value)
      refreshTimer.value = null
    }
  }

  // 刷新 token
  async function refreshAuthToken() {
    if (!refreshToken.value) {
      logout()
      return false
    }
    
    try {
      const response = await api.post('/auth/refresh', {
        refresh_token: refreshToken.value
      }, {
        headers: {
          Authorization: null // 不发送原 token
        }
      })
      
      if (response.data.success) {
       
        const { token: newToken, refresh_token: newRefreshToken, user: userData } = response.data.data
        
        // 更新 token
        token.value = newToken
        refreshToken.value = newRefreshToken
        
        // 保存到 localStorage
        localStorage.setItem('auth_token', newToken)
        localStorage.setItem('refresh_token', newRefreshToken)
        
        // 重新设置定时器
        setupTokenRefresh()
        
        // 更新 api 默认头部
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        
        return true
      } else {
        error.value = response.data.message || 'Token 刷新失败'
        //logout()
        return false
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || '刷新 token 失败'
      //logout()
      return false
    }
  }

  async function login(credentials) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/login', credentials)
      
      if (response.data.success) {
        const { 
          token: authToken, 
          refresh_token: refreshTokenValue,
          user: userData 
        } = response.data.data
        
        // 保存 token 和用户信息
        token.value = authToken
        user.value = userData
        refreshToken.value = refreshTokenValue
        
        // 存储到 localStorage
        localStorage.setItem('auth_token', authToken)
        localStorage.setItem('refresh_token', refreshTokenValue)
        localStorage.setItem('user_info', JSON.stringify(userData))
        
        // 设置 api 默认头部
        api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
        
        // 设置自动刷新
        setupTokenRefresh()
        
        return true
      } else {
        error.value = response.data.message || '登录失败'
        return false
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || '网络错误，请稍后重试'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    // 清除定时器
    clearRefreshTimer()
    
    // 清除状态
    token.value = null
    user.value = null
    refreshToken.value = null
    
    // 清除 localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_info')
    
    // 清除 axios 默认头部
    delete api.defaults.headers.common['Authorization']
    
    // 可以添加登出 API 调用
    // api.post('/auth/logout')
  }

  function updateUserInfo(userData) {
    user.value = userData
    localStorage.setItem('user_info', JSON.stringify(userData))
  }

  // 监听 token 变化，设置自动刷新
  watch(token, () => {
    if (token.value) {
      setupTokenRefresh()
    } else {
      clearRefreshTimer()
    }
  }, { immediate: true })

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    refreshToken,
    login,
    logout,
    updateUserInfo,
    refreshAuthToken,
    clearRefreshTimer
  }
})