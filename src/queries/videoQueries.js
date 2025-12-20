/**
 * Video Queries
 * All GET requests related to video sessions
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Get video session by appointment ID
export const useVideoSession = (appointmentId) => {
  return useQuery({
    queryKey: ['video', 'session', appointmentId],
    queryFn: () => api.get(API_ROUTES.VIDEO.BY_APPOINTMENT(appointmentId)),
    enabled: !!appointmentId,
  })
}

