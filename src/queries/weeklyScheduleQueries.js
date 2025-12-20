/**
 * Weekly Schedule Queries
 * All GET requests related to weekly schedules
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Get weekly schedule
export const useWeeklySchedule = () => {
  return useQuery({
    queryKey: ['weekly-schedule'],
    queryFn: () => api.get(API_ROUTES.WEEKLY_SCHEDULE.GET),
  })
}

// Get available slots for a date (public)
export const useWeeklyScheduleSlots = (params = {}) => {
  return useQuery({
    queryKey: ['weekly-schedule', 'slots', params],
    queryFn: () => api.get(API_ROUTES.WEEKLY_SCHEDULE.GET_SLOTS, { params }),
    enabled: !!params.doctorId && !!params.date,
  })
}

