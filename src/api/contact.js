import api from './axios'

export const getContactDetails = () => api.get('/footer-options')
export const createContactInquiry = (data) => api.post('/contact-queries', data)
