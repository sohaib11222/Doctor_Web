/**
 * API Configuration
 * All API routes and endpoints are defined here
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://157.180.108.156:4001/api'

export const API_ROUTES = {
  // ==================== Common & Public Routes ====================
  HEALTH: '/health',
  
  // Auth Routes
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH_TOKEN: '/auth/refresh-token',
    CHANGE_PASSWORD: '/auth/change-password',
    APPROVE_DOCTOR: '/auth/approve-doctor',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_RESET_CODE: '/auth/verify-reset-code',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Specialization Routes
  SPECIALIZATION: {
    BASE: '/specialization',
    LIST: '/specialization',
    CREATE: '/specialization',
    UPDATE: (id) => `/specialization/${id}`,
    DELETE: (id) => `/specialization/${id}`,
    ADMIN_LIST: '/admin/specializations',
  },

  // Doctor Routes
  DOCTOR: {
    BASE: '/doctor',
    LIST: '/doctor',
    PROFILE: (id) => `/doctor/profile/${id}`,
    UPDATE_PROFILE: '/doctor/profile',
    DASHBOARD: '/doctor/dashboard',
    REVIEWS: '/doctor/reviews',
    BUY_SUBSCRIPTION: '/doctor/buy-subscription',
    MY_SUBSCRIPTION: '/doctor/my-subscription',
    ADMIN_LIST: '/admin/doctors',
    ADMIN_CHAT_LIST: '/admin/doctors/chat',
  },

  // Product Routes
  PRODUCT: {
    BASE: '/products',
    LIST: '/products',
    GET: (id) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
    ADMIN_LIST: '/admin/products',
  },

  // Pharmacy Routes
  PHARMACY: {
    BASE: '/pharmacy',
    LIST: '/pharmacy',
    GET: (id) => `/pharmacy/${id}`,
    CREATE: '/pharmacy',
    UPDATE: (id) => `/pharmacy/${id}`,
    DELETE: (id) => `/pharmacy/${id}`,
    ADMIN_LIST: '/admin/pharmacies',
  },

  // Review Routes
  REVIEW: {
    BASE: '/reviews',
    CREATE: '/reviews',
    DELETE: (id) => `/reviews/${id}`,
    BY_DOCTOR: (doctorId) => `/reviews/doctor/${doctorId}`,
    LIST: '/reviews',
    ADMIN_LIST: '/admin/reviews',
  },

  // Blog Routes
  BLOG: {
    BASE: '/blog',
    LIST: '/blog',
    GET: (id) => `/blog/${id}`,
    CREATE: '/blog',
    UPDATE: (id) => `/blog/${id}`,
    DELETE: (id) => `/blog/${id}`,
  },

  // Availability Routes
  AVAILABILITY: {
    BASE: '/availability',
    SET: '/availability',
    GET: '/availability',
    SLOTS: '/availability/slots',
    CHECK: '/availability/check',
  },

  // Weekly Schedule Routes
  WEEKLY_SCHEDULE: {
    BASE: '/weekly-schedule',
    CREATE_UPDATE: '/weekly-schedule',
    GET: '/weekly-schedule',
    UPDATE_DURATION: '/weekly-schedule/duration',
    ADD_SLOT: (dayOfWeek) => `/weekly-schedule/day/${dayOfWeek}/slot`,
    UPDATE_SLOT: (dayOfWeek, slotId) => `/weekly-schedule/day/${dayOfWeek}/slot/${slotId}`,
    DELETE_SLOT: (dayOfWeek, slotId) => `/weekly-schedule/day/${dayOfWeek}/slot/${slotId}`,
    GET_SLOTS: '/weekly-schedule/slots',
  },

  // Appointment Routes
  APPOINTMENT: {
    BASE: '/appointment',
    CREATE: '/appointment',
    LIST: '/appointment',
    GET: (id) => `/appointment/${id}`,
    ACCEPT: (id) => `/appointment/${id}/accept`,
    REJECT: (id) => `/appointment/${id}/reject`,
    CANCEL: (id) => `/appointment/${id}/cancel`,
    UPDATE_STATUS: (id) => `/appointment/${id}/status`,
    ADMIN_LIST: '/admin/appointments',
  },

  // Subscription Routes
  SUBSCRIPTION: {
    BASE: '/subscription',
    PLAN: {
      BASE: '/admin/subscription-plan',
      CREATE: '/admin/subscription-plan',
      LIST: '/admin/subscription-plan',
      GET: (id) => `/admin/subscription-plan/${id}`,
      UPDATE: (id) => `/admin/subscription-plan/${id}`,
      DELETE: (id) => `/admin/subscription-plan/${id}`,
      ACTIVE: '/admin/subscription-plan/active',
      ALTERNATIVE_CREATE: '/subscription',
      ALTERNATIVE_UPDATE: (id) => `/subscription/${id}`,
      ASSIGN: '/subscription/assign',
      PUBLIC_LIST: '/subscription',
    },
  },

  // User Routes
  USER: {
    BASE: '/users',
    LIST: '/users',
    GET: (id) => `/users/${id}`,
    UPDATE_PROFILE: '/users/profile',
    UPDATE_STATUS: (id) => `/users/status/${id}`,
    ADMIN_DELETE: (id) => `/admin/users/${id}`,
  },

  // Admin Routes
  ADMIN: {
    BASE: '/admin',
    DASHBOARD: '/admin/dashboard',
    PROFILE: '/admin/profile',
    UPDATE_PROFILE: '/admin/profile',
    PATIENTS: '/admin/patients',
    ACTIVITY: '/admin/activity',
  },

  // Patient Routes
  PATIENT: {
    BASE: '/patient',
    DASHBOARD: '/patient/dashboard',
    APPOINTMENTS_HISTORY: '/patient/appointments/history',
    PAYMENTS_HISTORY: '/patient/payments/history',
    MEDICAL_RECORDS: '/patient/medical-records',
    MEDICAL_RECORD_DELETE: (id) => `/patient/medical-records/${id}`,
  },

  // Transaction Routes
  TRANSACTION: {
    BASE: '/transaction',
    LIST: '/transaction',
    GET: (id) => `/transaction/${id}`,
    CREATE: '/transaction',
    UPDATE: (id) => `/transaction/${id}`,
    ADMIN_LIST: '/admin/transactions',
    PAYMENT_TRANSACTION: (id) => `/payment/transaction/${id}`,
  },

  // Payment Routes
  PAYMENT: {
    BASE: '/payment',
    APPOINTMENT: '/payment/appointment',
    PRODUCT: '/payment/product',
    TRANSACTIONS: '/payment/transactions',
    REFUND: (id) => `/payment/refund/${id}`,
  },

  // Favorite Routes
  FAVORITE: {
    BASE: '/favorite',
    ADD: '/favorite',
    LIST: (patientId) => `/favorite/${patientId}`,
    DELETE: (id) => `/favorite/${id}`,
  },

  // Chat Routes
  CHAT: {
    BASE: '/chat',
    CONVERSATIONS: '/chat/conversations',
    UNREAD_COUNT: '/chat/unread-count',
    CREATE_CONVERSATION: '/chat/conversation',
    SEND_MESSAGE: '/chat/send',
    MESSAGES: (conversationId) => `/chat/messages/${conversationId}`,
    MARK_READ: (conversationId) => `/chat/conversations/${conversationId}/read`,
  },

  // Video Routes
  VIDEO: {
    BASE: '/video',
    START: '/video/start',
    END: '/video/end',
    BY_APPOINTMENT: (appointmentId) => `/video/by-appointment/${appointmentId}`,
  },

  // Announcement Routes
  ANNOUNCEMENT: {
    BASE: '/announcements',
    CREATE: '/announcements',
    LIST: '/announcements',
    GET: (id) => `/announcements/${id}`,
    UPDATE: (id) => `/announcements/${id}`,
    DELETE: (id) => `/announcements/${id}`,
    READ_STATUS: (id) => `/announcements/${id}/read-status`,
    DOCTOR_LIST: '/announcements/doctor',
    UNREAD_COUNT: '/announcements/unread-count',
    MARK_READ: (id) => `/announcements/${id}/read`,
  },

  // Notification Routes
  NOTIFICATION: {
    BASE: '/notification',
    SEND: '/notification',
    GET: (userId) => `/notification/${userId}`,
    MARK_READ: (id) => `/notification/read/${id}`,
  },

  // Mapping Routes
  MAPPING: {
    BASE: '/mapping',
    ROUTE: '/mapping/route',
    NEARBY: '/mapping/nearby',
    CLINIC: (id) => `/mapping/clinic/${id}`,
  },

  // Upload Routes
  UPLOAD: {
    BASE: '/upload',
    PROFILE: '/upload/profile',
    DOCTOR_DOCS: '/upload/doctor-docs',
    CLINIC: '/upload/clinic',
    PRODUCT: '/upload/product',
    BLOG: '/upload/blog',
    GENERAL: '/upload/general',
  },

  // Order Routes
  ORDER: {
    BASE: '/orders',
    CREATE: '/orders',
    GET: (id) => `/orders/${id}`,
    LIST: '/orders',
    UPDATE_STATUS: (id) => `/orders/${id}/status`,
    UPDATE_SHIPPING: (id) => `/orders/${id}/shipping`,
    CANCEL: (id) => `/orders/${id}/cancel`,
    PAY: (id) => `/orders/${id}/pay`,
    ADMIN_LIST: '/admin/orders',
  },
}

export default BASE_URL

