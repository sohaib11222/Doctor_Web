/**
 * Mapping Queries
 * All GET requests related to mapping and location
 */

import { useQuery } from '@tanstack/react-query'
import * as mappingApi from '../api/mapping'

/**
 * Get route from patient to clinic
 * @param {Object} from - { lat: number, lng: number }
 * @param {Object} to - { lat: number, lng: number }
 * @param {Object} options - React Query options
 */
export const useRoute = (from, to, options = {}) => {
  return useQuery({
    queryKey: ['mapping', 'route', from, to],
    queryFn: () => mappingApi.getRoute(from, to),
    enabled: !!(from?.lat && from?.lng && to?.lat && to?.lng) && (options.enabled !== false),
    ...options
  })
}

/**
 * Get nearby clinics
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Radius in kilometers (optional, default: 10)
 * @param {Object} options - React Query options
 */
export const useNearbyClinics = (lat, lng, radius = 10, options = {}) => {
  return useQuery({
    queryKey: ['mapping', 'nearby', lat, lng, radius],
    queryFn: () => mappingApi.getNearbyClinics(lat, lng, radius),
    enabled: !!(lat && lng) && (options.enabled !== false),
    ...options
  })
}

/**
 * Get clinic location by ID
 * @param {string} clinicId - Clinic ID
 * @param {Object} options - React Query options
 */
export const useClinicLocation = (clinicId, options = {}) => {
  return useQuery({
    queryKey: ['mapping', 'clinic', clinicId],
    queryFn: () => mappingApi.getClinicLocation(clinicId),
    enabled: !!clinicId && (options.enabled !== false),
    ...options
  })
}

