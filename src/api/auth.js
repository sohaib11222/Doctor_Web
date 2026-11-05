import api from './axios'
import { API_ROUTES } from '../utils/apiConfig'

export const login = async (email, password) => {
  // Backend uses /auth/login for all users (role is determined by email/user in DB)
  // Request: { email, password }
  // Backend returns: { success: true, message: "OK", data: { user, token } }
  // axios interceptor returns response.data, so we get: { success, message, data }
  const response = await api.post('/auth/login', { email, password })
  
  // Extract user and token from response.data
  return {
    user: response.data?.user || response.user,
    token: response.data?.token || response.token,
    message: response.message || response.data?.message,
    requiresEmailVerification: Boolean(response.data?.requiresEmailVerification || response.requiresEmailVerification),
    email: response.data?.email || response.email || email,
  }
}

export const register = async (data, userType = 'patient') => {
  // Backend uses /auth/register for all users
  // Include role in data if not already present
  const registrationData = {
    ...data,
    role: data.role || (userType === 'doctor' ? 'DOCTOR' : 'PATIENT')
  }
  
  // Backend returns: { success: true, message: "OK", data: { user, token } }
  // axios interceptor returns response.data, so we get: { success, message, data }
  const response = await api.post('/auth/register', registrationData)
  
  // Extract user and token from response.data
  return {
    user: response.data?.user || response.user,
    token: response.data?.token || response.token,
    message: response.message || response.data?.message,
    requiresEmailVerification: Boolean(response.data?.requiresEmailVerification || response.requiresEmailVerification),
    email: response.data?.email || response.email || registrationData.email,
  }
}

export const getUser = async () => {
  // Decode token to get userId, then fetch user from /api/users/:id
  // The axios interceptor will automatically handle token refresh on 401 errors
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('No token found')
  }

  try {
    // Decode JWT token to get user info
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
    const decoded = JSON.parse(jsonPayload)

    // Fetch user by ID - axios interceptor will handle token refresh automatically
    const response = await api.get(`/users/${decoded.userId}`)
    return response.data || response
  } catch (error) {
    // If error persists after refresh attempt, clear token
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
    }
    throw error
  }
}

export const logout = async () => {
  // Backend doesn't have logout endpoint (JWT is stateless)
  // Just clear token on frontend
  return Promise.resolve()
}

export const forgotPassword = async (email) => {
  return api.post(API_ROUTES.AUTH.FORGOT_PASSWORD, { email })
}

export const verifyResetCode = async (email, code) => api.post(API_ROUTES.AUTH.VERIFY_RESET_CODE, { email, code })

export const resetPassword = async (email, code, newPassword) => {
  return api.post(API_ROUTES.AUTH.RESET_PASSWORD, { email, code, newPassword })
}

/**
 * Change user password
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Success message
 */
export const changePassword = async (code, newPassword) => {
  const response = await api.post('/auth/change-password', {
    code,
    newPassword
  })
  return response.data
}

export const requestChangePasswordCode = async () => api.post(API_ROUTES.AUTH.REQUEST_CHANGE_PASSWORD_CODE)
export const verifyChangePasswordCode = async (code) => api.post(API_ROUTES.AUTH.VERIFY_CHANGE_PASSWORD_CODE, { code })
export const verifyEmail = async (email, code) => api.post(API_ROUTES.AUTH.VERIFY_EMAIL, { email, code })
export const resendEmailVerification = async (email) => api.post(API_ROUTES.AUTH.RESEND_EMAIL_VERIFICATION, { email })

/**
 * Refresh JWT token
 * @param {string} refreshToken - Current token to refresh
 * @returns {Promise<Object>} New token
 */
export const refreshToken = async (refreshToken) => {
  const response = await api.post('/auth/refresh-token', {
    refreshToken
  })
  return response.data?.token || response.token
}

export const sendPhoneOtp = async (phone) => {
  const response = await api.post(API_ROUTES.AUTH.SEND_PHONE_OTP, phone ? { phone } : {})
  return response.data || response
}

export const verifyPhoneOtp = async (code, phone) => {
  const payload = { code }
  if (phone) payload.phone = phone
  const response = await api.post(API_ROUTES.AUTH.VERIFY_PHONE_OTP, payload)
  return response.data || response
}

