import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as announcementApi from '../../api/announcements'

const DoctorAnnouncements = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState('all') // all, unread, pinned
  const [page, setPage] = useState(1)
  const limit = 20

  // Fetch announcements for doctor
  const { data: announcementsData, isLoading: announcementsLoading, error: announcementsError } = useQuery({
    queryKey: ['doctorAnnouncements', filter, page],
    queryFn: () => {
      const params = {
        page,
        limit,
        ...(filter === 'unread' ? { isRead: false } : {})
      }
      return announcementApi.getDoctorAnnouncements(params)
    },
    enabled: !!user,
    refetchInterval: 30000 // Refetch every 30 seconds
  })

  // Fetch unread count
  const { data: unreadCountData } = useQuery({
    queryKey: ['announcementUnreadCount'],
    queryFn: () => announcementApi.getUnreadAnnouncementCount(),
    enabled: !!user,
    refetchInterval: 30000 // Refetch every 30 seconds
  })

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id) => announcementApi.markAnnouncementAsRead(id),
    onSuccess: (response, announcementId) => {
      queryClient.invalidateQueries(['doctorAnnouncements'])
      queryClient.invalidateQueries(['announcementUnreadCount'])
      toast.success('Announcement marked as read')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to mark as read'
      toast.error(errorMessage)
    }
  })

  // Extract data from response
  const announcements = useMemo(() => {
    if (!announcementsData) return []
    // Axios interceptor returns response.data = { success, message, data: {...} }
    const data = announcementsData.data || announcementsData
    return data.announcements || []
  }, [announcementsData])

  const pagination = useMemo(() => {
    if (!announcementsData) return null
    const data = announcementsData.data || announcementsData
    return data.pagination || null
  }, [announcementsData])

  const unreadCount = useMemo(() => {
    if (!unreadCountData) return 0
    const data = unreadCountData.data || unreadCountData
    return data.unreadCount || 0
  }, [unreadCountData])

  // Filter announcements based on selected filter
  const filteredAnnouncements = useMemo(() => {
    let filtered = [...announcements]
    
    if (filter === 'unread') {
      filtered = filtered.filter(a => !a.isRead)
    } else if (filter === 'pinned') {
      filtered = filtered.filter(a => a.isPinned)
    }
    
    // Sort: pinned first, then by priority (URGENT > IMPORTANT > NORMAL), then by date
    return filtered.sort((a, b) => {
      // Pinned first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      
      // Priority order
      const priorityOrder = { URGENT: 3, IMPORTANT: 2, NORMAL: 1 }
      const aPriority = priorityOrder[a.priority] || 1
      const bPriority = priorityOrder[b.priority] || 1
      if (aPriority !== bPriority) return bPriority - aPriority
      
      // Then by date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }, [announcements, filter])

  const pinnedCount = useMemo(() => {
    return announcements.filter(a => a.isPinned).length
  }, [announcements])

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const options = { day: 'numeric', month: 'short', year: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  // Get priority badge class
  const getPriorityBadge = (priority) => {
    const badges = {
      'URGENT': 'badge-danger',
      'IMPORTANT': 'badge-warning',
      'NORMAL': 'badge-info'
    }
    return badges[priority] || 'badge-secondary'
  }

  // Get priority icon
  const getPriorityIcon = (priority) => {
    const icons = {
      'URGENT': 'fe-alert-circle text-danger',
      'IMPORTANT': 'fe-info text-warning',
      'NORMAL': 'fe-check-circle text-success'
    }
    return icons[priority] || 'fe-info'
  }

  // Get announcement type badge
  const getTypeBadge = (announcementType) => {
    const badges = {
      'BROADCAST': 'badge-primary',
      'TARGETED': 'badge-secondary'
    }
    return badges[announcementType] || 'badge-secondary'
  }

  // Handle mark as read
  const handleMarkAsRead = (id) => {
    markAsReadMutation.mutate(id)
  }

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    setPage(1) // Reset to first page when filter changes
  }

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (announcementsLoading) {
    return (
      <div className="content doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              {/* DoctorSidebar will be rendered by DashboardLayout */}
            </div>
            <div className="col-lg-12 col-xl-12">
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (announcementsError) {
    console.error('Error loading announcements:', announcementsError)
  }

  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* DoctorSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            <div className="dashboard-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3>Announcements</h3>
                  <p className="text-muted mb-0">Stay updated with platform news and updates</p>
                </div>
                <div className="announcement-stats">
                  <span className="badge bg-danger me-2">{unreadCount} Unread</span>
                  <span className="badge bg-primary">{pinnedCount} Pinned</span>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="announcement-filter-tabs d-flex flex-wrap gap-2">
                  <button
                    className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleFilterChange('all')}
                  >
                    All Announcements ({announcements.length})
                  </button>
                  <button
                    className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleFilterChange('unread')}
                  >
                    Unread ({unreadCount})
                  </button>
                  <button
                    className={`btn btn-sm ${filter === 'pinned' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleFilterChange('pinned')}
                  >
                    Pinned ({pinnedCount})
                  </button>
                </div>
              </div>
            </div>

            {/* Announcements List */}
            <div className="announcements-list">
              {filteredAnnouncements.length === 0 ? (
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="fe fe-bell-off" style={{ fontSize: '64px', color: '#dee2e6' }}></i>
                    <h5 className="mt-3">No announcements found</h5>
                    <p className="text-muted">You're all caught up!</p>
                  </div>
                </div>
              ) : (
                <>
                  {filteredAnnouncements.map((announcement) => {
                    const isUrgent = announcement.priority === 'URGENT'
                    const isUnread = !announcement.isRead
                    
                    return (
                      <div
                        key={announcement._id}
                        className={`card mb-3 announcement-card ${announcement.isPinned ? 'pinned' : ''} ${isUnread ? 'unread' : ''} ${isUrgent ? 'urgent' : ''}`}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div className="announcement-icon me-3">
                              <i className={`fe ${getPriorityIcon(announcement.priority)}`}></i>
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h5 className="mb-1">
                                    {announcement.isPinned && (
                                      <i className="fe fe-pin text-primary me-2" title="Pinned"></i>
                                    )}
                                    {isUrgent && (
                                      <i className="fe fe-alert-circle text-danger me-2" title="Urgent"></i>
                                    )}
                                    {announcement.title}
                                    {isUnread && (
                                      <span className="badge bg-danger ms-2">New</span>
                                    )}
                                  </h5>
                                  <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                                    <span className={`badge ${getPriorityBadge(announcement.priority)}`}>
                                      {announcement.priority}
                                    </span>
                                    <span className={`badge ${getTypeBadge(announcement.announcementType)}`}>
                                      {announcement.announcementType}
                                    </span>
                                    <span className="text-muted small">
                                      <i className="fe fe-calendar me-1"></i>
                                      {formatDate(announcement.createdAt)} at {formatTime(announcement.createdAt)}
                                    </span>
                                    {announcement.createdBy && (
                                      <span className="text-muted small">
                                        <i className="fe fe-user me-1"></i>
                                        {announcement.createdBy.fullName || 'Admin'}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <p className="mb-2">{announcement.message}</p>
                              
                              {/* Display image if available */}
                              {announcement.image && (
                                <div className="mb-2">
                                  <img 
                                    src={announcement.image} 
                                    alt={announcement.title}
                                    className="img-fluid rounded"
                                    style={{ maxHeight: '200px' }}
                                  />
                                </div>
                              )}
                              
                              {/* Display link if available */}
                              {announcement.link && (
                                <div className="mb-2">
                                  <a 
                                    href={announcement.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-primary"
                                  >
                                    <i className="fe fe-external-link me-1"></i>
                                    View Link
                                  </a>
                                </div>
                              )}
                              
                              {/* Display file if available */}
                              {announcement.file && (
                                <div className="mb-2">
                                  <a 
                                    href={announcement.file} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-secondary"
                                  >
                                    <i className="fe fe-download me-1"></i>
                                    Download File
                                  </a>
                                </div>
                              )}
                              
                              {isUnread && (
                                <button
                                  className="btn btn-sm btn-primary mt-2"
                                  onClick={() => handleMarkAsRead(announcement._id)}
                                  disabled={markAsReadMutation.isLoading}
                                >
                                  {markAsReadMutation.isLoading ? (
                                    <>
                                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                      Marking...
                                    </>
                                  ) : (
                                    <>
                                      <i className="fe fe-check me-1"></i>
                                      Mark as Read
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  
                  {/* Pagination */}
                  {pagination && pagination.pages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                      <nav>
                        <ul className="pagination">
                          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => handlePageChange(page - 1)}
                              disabled={page === 1}
                            >
                              Previous
                            </button>
                          </li>
                          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                            <li key={pageNum} className={`page-item ${page === pageNum ? 'active' : ''}`}>
                              <button 
                                className="page-link"
                                onClick={() => handlePageChange(pageNum)}
                              >
                                {pageNum}
                              </button>
                            </li>
                          ))}
                          <li className={`page-item ${page === pagination.pages ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => handlePageChange(page + 1)}
                              disabled={page === pagination.pages}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Info Alert */}
            <div className="alert alert-info mt-4">
              <div className="d-flex">
                <div className="flex-shrink-0">
                  <i className="fe fe-info"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="alert-heading">About Announcements</h6>
                  <p className="mb-0 small">
                    Important announcements from the platform will appear here. Pinned announcements stay at the top, 
                    and urgent announcements are highlighted. Make sure to read all announcements to stay updated.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorAnnouncements
