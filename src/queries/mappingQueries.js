/**
 * Mapping Queries
 * All GET requests related to mapping and location
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Get route from patient to clinic (public)
export const useRoute = (params = {}) => {
  return useQuery({
    queryKey: ['mapping', 'route', params],
    queryFn: () => api.get(API_ROUTES.MAPPING.ROUTE, { params }),
    enabled: !!params.from && !!params.to,
  })
}

// Get nearby clinics (public)
export const useNearbyClinics = (params = {}) => {
  return useQuery({
    queryKey: ['mapping', 'nearby', params],
    queryFn: () => api.get(API_ROUTES.MAPPING.NEARBY, { params }),
    enabled: !!params.lat && !!params.lng,
  })
}

// Get clinic location by ID (public)
export const useClinicLocation = (clinicId) => {
  return useQuery({
    queryKey: ['mapping', 'clinic', clinicId],
    queryFn: () => api.get(API_ROUTES.MAPPING.CLINIC(clinicId)),
    enabled: !!clinicId,
  })
}

