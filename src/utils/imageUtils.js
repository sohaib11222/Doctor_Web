/**
 * Utility function to normalize image URLs
 * Converts relative paths to full URLs based on API base URL
 * 
 * @param {string} imageUri - The image URI (can be relative or full URL)
 * @returns {string|null} - Normalized full URL or null if invalid
 */
export const normalizeImageUrl = (imageUri) => {
  if (!imageUri || typeof imageUri !== 'string') return null
  const trimmedUri = imageUri.trim()
  if (!trimmedUri) return null
  
  // If already a full URL, return as-is
  if (trimmedUri.startsWith('http://') || trimmedUri.startsWith('https://')) {
    return trimmedUri
  }
  
  // Get base URL without /api
  const apiBaseURL = import.meta.env.VITE_API_URL || 'https://mydoctoradmin.mydoctorplus.it/api'
  const baseURL = apiBaseURL.replace('/api', '')
  
  // If path already starts with /, use as-is; otherwise add /
  const imagePath = trimmedUri.startsWith('/') ? trimmedUri : `/${trimmedUri}`
  
  // Construct full URL
  return `${baseURL}${imagePath}`
}

/**
 * Get image URL with fallback
 * @param {string} imageUri - The image URI
 * @param {string} fallback - Fallback image path
 * @returns {string} - Normalized image URL or fallback
 */
export const getImageUrl = (imageUri, fallback = '/assets/img/placeholder.jpg') => {
  return normalizeImageUrl(imageUri) || fallback
}

