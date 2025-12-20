/**
 * Favorite Queries
 * All GET requests related to favorites
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Get favorite doctors for a patient
export const useFavoriteDoctors = (patientId) => {
  return useQuery({
    queryKey: ['favorites', patientId],
    queryFn: () => api.get(API_ROUTES.FAVORITE.LIST(patientId)),
    enabled: !!patientId,
  })
}

