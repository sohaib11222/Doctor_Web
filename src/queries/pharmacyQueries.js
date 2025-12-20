/**
 * Pharmacy Queries
 * All GET requests related to pharmacies
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Get all pharmacies (public)
export const usePharmacies = (params = {}) => {
  return useQuery({
    queryKey: ['pharmacies', params],
    queryFn: () => api.get(API_ROUTES.PHARMACY.LIST, { params }),
  })
}

// Get pharmacy by ID (public)
export const usePharmacy = (pharmacyId) => {
  return useQuery({
    queryKey: ['pharmacy', pharmacyId],
    queryFn: () => api.get(API_ROUTES.PHARMACY.GET(pharmacyId)),
    enabled: !!pharmacyId,
  })
}

// Admin: Get all pharmacies
export const useAdminPharmacies = (params = {}) => {
  return useQuery({
    queryKey: ['admin', 'pharmacies', params],
    queryFn: () => api.get(API_ROUTES.PHARMACY.ADMIN_LIST, { params }),
  })
}

