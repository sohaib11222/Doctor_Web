import api from './axios'

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
    message: response.message || response.data?.message
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
    message: response.message || response.data?.message
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
  // Backend doesn't have forgot-password endpoint yet
  // Return error for now
  throw new Error('Forgot password feature not implemented in backend yet')
}

export const resetPassword = async (token, password, password_confirmation) => {
  // Backend doesn't have reset-password endpoint yet
  // Return error for now
  throw new Error('Reset password feature not implemented in backend yet')
}

/**
 * Change user password
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Success message
 */
export const changePassword = async (oldPassword, newPassword) => {
  const response = await api.post('/auth/change-password', {
    oldPassword,
    newPassword
  })
  return response.data
}

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

