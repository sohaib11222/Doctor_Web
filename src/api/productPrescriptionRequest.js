import api from './axios'

export const getProductPrescriptionEligibility = (productId, variantId) => api.get(`/product-prescription-requests/product/${productId}/eligibility`, { params: variantId ? { variantId } : {} })
export const submitProductPrescriptionRequest = (data) => api.post('/product-prescription-requests', data)
export const getMyProductPrescriptionRequests = (params = {}) => api.get('/product-prescription-requests/mine', { params })
export const getSellerProductPrescriptionRequests = (params = {}) => api.get('/product-prescription-requests/seller', { params })
export const getPendingProductPrescriptionCount = () => api.get('/product-prescription-requests/seller/pending-count')
export const reviewProductPrescriptionRequest = (id, data) => api.put(`/product-prescription-requests/${id}/review`, data)
