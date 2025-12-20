/**
 * Patient Mutations
 * All POST/PUT/DELETE requests related to patients
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Create medical record
export const useCreateMedicalRecord = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.PATIENT.MEDICAL_RECORDS, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', 'medical-records'] })
    },
  })
}

// Delete medical record
export const useDeleteMedicalRecord = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (recordId) => api.delete(API_ROUTES.PATIENT.MEDICAL_RECORD_DELETE(recordId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', 'medical-records'] })
    },
  })
}

