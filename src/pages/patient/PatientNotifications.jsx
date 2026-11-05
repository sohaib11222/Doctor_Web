import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../queries/notificationQueries'
import { useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '../../mutations/notificationMutations'
import { toast } from 'react-toastify'
import { useLanguage } from '../../contexts/LanguageContext'

const PatientNotifications = () => {
  const { language, translateText: tr, formatDate: formatLocalizedDate } = useLanguage()
  const { user } = useAuth()
  const [filter, setFilter] = useState('all') // 'all', 'unread', 'read'

  // Build query params based on filter
  const queryParams = useMemo(() => {
    const params = { page: 1, limit: 50 }
    if (filter === 'unread') {
      params.isRead = false
    } else if (filter === 'read') {
      params.isRead = true
    }
    return params
  }, [filter])

  // Fetch notifications
  const { data: notificationsData, isLoading, refetch } = useNotifications(queryParams)

  // Mark as read mutation
  const markAsReadMutation = useMarkNotificationAsRead()
  const markAllAsReadMutation = useMarkAllNotificationsAsRead()

  // Extract notifications
  const notifications = useMemo(() => {
    if (!notificationsData) return []
    const responseData = notificationsData.data || notificationsData
    return responseData.notifications || responseData.data || []
  }, [notificationsData])

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    const typeUpper = (type || 'SYSTEM').toUpperCase()
    switch (typeUpper) {
      case 'APPOINTMENT':
        return 'isax isax-calendar-tick5'
      case 'MESSAGE':
        return 'isax isax-messages-1'
      case 'PAYMENT':
        return 'isax isax-wallet-2'
      case 'REVIEW':
        return 'isax isax-star-1'
      case 'PRESCRIPTION':
        return 'isax isax-document-text'
      default:
        return 'isax isax-notification'
    }
  }

  // Get notification icon color class
  const getNotificationIconColor = (type) => {
    const typeUpper = (type || 'SYSTEM').toUpperCase()
    switch (typeUpper) {
      case 'APPOINTMENT':
        return 'color-blue'
      case 'MESSAGE':
        return 'color-violet'
      case 'PAYMENT':
        return 'color-yellow'
      case 'REVIEW':
        return 'color-orange'
      case 'PRESCRIPTION':
        return 'color-green'
      default:
        return 'color-blue'
    }
  }

  // Format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return tr('Just now')
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return tr('Just now')
    const relative = new Intl.RelativeTimeFormat(language === 'it' ? 'it-IT' : 'en-US', { numeric: 'auto' })
    if (diffInSeconds < 3600) return relative.format(-Math.floor(diffInSeconds / 60), 'minute')
    if (diffInSeconds < 86400) return relative.format(-Math.floor(diffInSeconds / 3600), 'hour')
    if (diffInSeconds < 604800) return relative.format(-Math.floor(diffInSeconds / 86400), 'day')
    
    return formatLocalizedDate(date, { day: 'numeric', month: 'short', year: 'numeric' })
  }

  // Handle mark as read
  const handleMarkAsRead = async (notificationId) => {
    if (!notificationId) {
      toast.error(tr('Invalid notification ID'))
      return
    }
    try {
      await markAsReadMutation.mutateAsync(notificationId)
      toast.success(tr('Notification marked as read'))
    } catch (error) {
      console.error('Mark as read error:', error)
      // The axios interceptor returns error.response directly, so check both structures
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.message || 
                          error?.data?.message ||
                          error?.message || 
                          'Failed to mark notification as read'
      toast.error(tr(errorMessage))
    }
  }

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync()
      toast.success(tr('All notifications marked as read'))
    } catch (error) {
      console.error('Mark all as read error:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to mark all notifications as read'
      toast.error(tr(errorMessage))
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <>
      <div className="dashboard-header">
        <h3>{tr('Notifications')}</h3>
        {unreadCount > 0 && (
          <button 
            className="btn btn-sm btn-primary"
            onClick={handleMarkAllAsRead}
            disabled={markAllAsReadMutation.isPending}
          >
            {markAllAsReadMutation.isPending ? tr('Marking...') : tr('Mark All as Read')}
          </button>
        )}
      </div>
      <div className="card">
        <div className="card-body">
          {/* Filter Tabs */}
          <div className="mb-3">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  {tr('All')}
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${filter === 'unread' ? 'active' : ''}`}
                  onClick={() => setFilter('unread')}
                >
                  {tr('Unread')} {unreadCount > 0 && <span className="badge bg-danger">{unreadCount}</span>}
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${filter === 'read' ? 'active' : ''}`}
                  onClick={() => setFilter('read')}
                >
                  {tr('Read')}
                </button>
              </li>
            </ul>
          </div>

          {/* Notifications List */}
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">{tr('Loading...')}</span>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">{tr('No notifications found')}</p>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                >
                  <div className={`notification-icon ${getNotificationIconColor(notification.type)}`}>
                    <i className={getNotificationIcon(notification.type)}></i>
                  </div>
                  <div className="notification-content">
                    <h5>{tr(notification.title)}</h5>
                    <p>{tr(notification.body)}</p>
                    <span className="notification-time">{formatTimeAgo(notification.createdAt)}</span>
                  </div>
                  <div className="notification-action">
                    {!notification.isRead && (
                      <button
                        className="btn btn-sm btn-link text-primary"
                        onClick={() => {
                          console.log('Marking notification as read:', notification._id)
                          handleMarkAsRead(notification._id)
                        }}
                        disabled={markAsReadMutation.isPending}
                        title={tr('Mark as read')}
                      >
                        <i className="isax isax-tick-circle"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default PatientNotifications
