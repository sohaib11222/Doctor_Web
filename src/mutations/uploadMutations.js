/**
 * Upload Mutations
 * All POST requests related to file uploads
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Upload profile image
export const useUploadProfileImage = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (formData) => api.upload(API_ROUTES.UPLOAD.PROFILE, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['doctor', 'profile'] })
    },
  })
}

// Upload doctor documents
export const useUploadDoctorDocs = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (formData) => api.upload(API_ROUTES.UPLOAD.DOCTOR_DOCS, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'profile'] })
    },
  })
}

// Upload clinic images
export const useUploadClinicImages = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (formData) => api.upload(API_ROUTES.UPLOAD.CLINIC, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'profile'] })
    },
  })
}

// Upload product images
export const useUploadProductImages = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (formData) => api.upload(API_ROUTES.UPLOAD.PRODUCT, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// Upload blog cover image
export const useUploadBlogCover = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (formData) => api.upload(API_ROUTES.UPLOAD.BLOG, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', 'posts'] })
    },
  })
}

// Upload general image
export const useUploadGeneralImage = () => {
  return useMutation({
    mutationFn: (formData) => api.upload(API_ROUTES.UPLOAD.GENERAL, formData),
  })
}

