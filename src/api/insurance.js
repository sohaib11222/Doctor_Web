import api from './axios'

/**
 * Get all active insurance companies (public)
 */
export const getActiveInsuranceCompanies = async () => {
  const response = await api.get('/insurance')
  return response.data
}

/**
 * Get insurance company by ID (public)
 */
export const getInsuranceCompanyById = async (id) => {
  const response = await api.get(`/insurance/${id}`)
  return response.data
}
