import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../queries/notificationQueries'
import { useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '../../mutations/notificationMutations'
import { toast } from 'react-toastify'

const DoctorNotifications = () => {
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
    if (!dateString) return 'Just now'
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  // Handle mark as read
  const handleMarkAsRead = async (notificationId) => {
    if (!notificationId) {
      toast.error('Invalid notification ID')
      return
    }
    try {
      await markAsReadMutation.mutateAsync(notificationId)
      toast.success('Notification marked as read')
    } catch (error) {
      console.error('Mark as read error:', error)
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.message || 
                          error?.data?.message ||
                          error?.message || 
                          'Failed to mark notification as read'
      toast.error(errorMessage)
    }
  }

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync()
      toast.success('All notifications marked as read')
    } catch (error) {
      console.error('Mark all as read error:', error)
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.message || 
                          error?.data?.message ||
                          error?.message || 
                          'Failed to mark all notifications as read'
      toast.error(errorMessage)
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <>
      <div className="dashboard-header">
        <h3>Notifications</h3>
        {unreadCount > 0 && (
          <button 
            className="btn btn-sm btn-primary"
            onClick={handleMarkAllAsRead}
            disabled={markAllAsReadMutation.isPending}
          >
            {markAllAsReadMutation.isPending ? 'Marking...' : 'Mark All as Read'}
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
                  All
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${filter === 'unread' ? 'active' : ''}`}
                  onClick={() => setFilter('unread')}
                >
                  Unread {unreadCount > 0 && <span className="badge bg-danger">{unreadCount}</span>}
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${filter === 'read' ? 'active' : ''}`}
                  onClick={() => setFilter('read')}
                >
                  Read
                </button>
              </li>
            </ul>
          </div>

          {/* Notifications List */}
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No notifications found</p>
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
                    <h5>{notification.title}</h5>
                    <p>{notification.body}</p>
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
                        title="Mark as read"
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

export default DoctorNotifications

