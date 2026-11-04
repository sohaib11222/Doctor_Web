import api from './axios'

export const unwrapTicketData = (response) => response?.data ?? response ?? {}
export const listSupportTickets = (params = {}) => api.get('/support-tickets', { params })
export const getSupportTicket = (ticketId) => api.get(`/support-tickets/${ticketId}`)
export const createSupportTicket = (data) => api.post('/support-tickets', data)
export const replyToSupportTicket = (ticketId, data) => api.post(`/support-tickets/${ticketId}/messages`, data)
export const reopenSupportTicket = (ticketId) => api.post(`/support-tickets/${ticketId}/reopen`)
export const getSupportTicketUnreadCount = () => api.get('/support-tickets/unread-count')
export const uploadSupportAttachments = (formData, onUploadProgress) => api.post('/support-tickets/attachments', formData, { onUploadProgress })

export const listAdminSupportTickets = (params = {}) => api.get('/support-tickets/admin', { params })
export const getAdminSupportTicket = (ticketId) => api.get(`/support-tickets/admin/${ticketId}`)
export const updateAdminSupportTicket = (ticketId, data) => api.patch(`/support-tickets/admin/${ticketId}`, data)
export const replyToAdminSupportTicket = (ticketId, data) => api.post(`/support-tickets/admin/${ticketId}/messages`, data)
export const getAdminSupportTicketUnreadCount = () => api.get('/support-tickets/admin/unread-count')
