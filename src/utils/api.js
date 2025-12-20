/**
 * API Client Setup
 * Axios instance with interceptors and custom API functions
 */

import axios from 'axios'
import BASE_URL from './apiConfig'

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response

      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
      }

      return Promise.reject({
        status,
        message: data?.message || error.message,
        data: data,
      })
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        data: null,
      })
    } else {
      // Something else happened
      return Promise.reject({
        status: 0,
        message: error.message || 'An unexpected error occurred',
        data: null,
      })
    }
  }
)

// Custom API functions for different HTTP methods
export const api = {
  // GET request
  get: async (url, config = {}) => {
    try {
      const response = await apiClient.get(url, config)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // POST request
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.post(url, data, config)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // PUT request
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.put(url, data, config)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // PATCH request
  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.patch(url, data, config)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // DELETE request
  delete: async (url, config = {}) => {
    try {
      const response = await apiClient.delete(url, config)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Upload file (multipart/form-data)
  upload: async (url, formData, config = {}) => {
    try {
      const response = await apiClient.post(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config.headers,
        },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default apiClient

