import api from './axios'

/**
 * Get route from patient location to clinic
 * @param {Object} from - { lat: number, lng: number }
 * @param {Object} to - { lat: number, lng: number }
 * @returns {Promise<Object>} Route information
 */
export const getRoute = async (from, to) => {
  const response = await api.get('/mapping/route', {
    params: {
      fromLat: from.lat,
      fromLng: from.lng,
      toLat: to.lat,
      toLng: to.lng
    }
  })
  return response.data || response
}

/**
 * Get nearby clinics
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Radius in kilometers (optional, default: 10)
 * @returns {Promise<Array>} Array of nearby clinics
 */
export const getNearbyClinics = async (lat, lng, radius = 10) => {
  const response = await api.get('/mapping/nearby', {
    params: { lat, lng, radius }
  })
  return response.data || response
}

/**
 * Get clinic location by ID
 * @param {string} clinicId - Clinic ID
 * @returns {Promise<Object>} Clinic location details
 */
export const getClinicLocation = async (clinicId) => {
  const response = await api.get(`/mapping/clinic/${clinicId}`)
  return response.data || response
}

