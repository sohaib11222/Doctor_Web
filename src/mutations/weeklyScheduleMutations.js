/**
 * Weekly Schedule Mutations
 * All POST/PUT/DELETE requests related to weekly schedules
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Create or update weekly schedule
export const useCreateUpdateWeeklySchedule = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.WEEKLY_SCHEDULE.CREATE_UPDATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-schedule'] })
      queryClient.invalidateQueries({ queryKey: ['weekly-schedule', 'slots'] })
    },
  })
}

// Update appointment duration
export const useUpdateAppointmentDuration = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.put(API_ROUTES.WEEKLY_SCHEDULE.UPDATE_DURATION, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-schedule'] })
    },
  })
}

// Add time slot to day
export const useAddTimeSlot = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ dayOfWeek, data }) => 
      api.post(API_ROUTES.WEEKLY_SCHEDULE.ADD_SLOT(dayOfWeek), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-schedule'] })
      queryClient.invalidateQueries({ queryKey: ['weekly-schedule', 'slots'] })
    },
  })
}

// Update time slot
export const useUpdateTimeSlot = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ dayOfWeek, slotId, data }) => 
      api.put(API_ROUTES.WEEKLY_SCHEDULE.UPDATE_SLOT(dayOfWeek, slotId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-schedule'] })
      queryClient.invalidateQueries({ queryKey: ['weekly-schedule', 'slots'] })
    },
  })
}

// Delete time slot
export const useDeleteTimeSlot = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ dayOfWeek, slotId }) => 
      api.delete(API_ROUTES.WEEKLY_SCHEDULE.DELETE_SLOT(dayOfWeek, slotId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-schedule'] })
      queryClient.invalidateQueries({ queryKey: ['weekly-schedule', 'slots'] })
    },
  })
}

