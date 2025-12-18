import { useState } from 'react'
import { Link } from 'react-router-dom'

const DoctorAnnouncements = () => {
  const [filter, setFilter] = useState('all') // all, unread, pinned

  const announcements = [
    {
      id: 1,
      title: 'New Feature: Video Consultations Available',
      message: 'We are excited to announce that video consultations are now available for all doctors. You can now conduct virtual appointments with your patients.',
      date: '15 Nov 2024',
      time: '10:30 AM',
      type: 'feature',
      priority: 'high',
      pinned: true,
      read: false,
      urgent: true
    },
    {
      id: 2,
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance will occur on November 20, 2024 from 2:00 AM to 4:00 AM EST. The platform will be temporarily unavailable during this time.',
      date: '14 Nov 2024',
      time: '3:15 PM',
      type: 'maintenance',
      priority: 'medium',
      pinned: true,
      read: true,
      urgent: false
    },
    {
      id: 3,
      title: 'Payment Processing Update',
      message: 'Your payment for November has been processed successfully. You can view the details in your account section.',
      date: '13 Nov 2024',
      time: '9:00 AM',
      type: 'payment',
      priority: 'low',
      pinned: false,
      read: false,
      urgent: false
    },
    {
      id: 4,
      title: 'New Patient Review Guidelines',
      message: 'Please review the updated patient review guidelines. These changes will help improve the quality of patient feedback.',
      date: '12 Nov 2024',
      time: '11:45 AM',
      type: 'policy',
      priority: 'medium',
      pinned: false,
      read: true,
      urgent: false
    },
    {
      id: 5,
      title: 'Holiday Schedule Reminder',
      message: 'Reminder: The platform will operate with limited support during the holiday season. Please plan your appointments accordingly.',
      date: '10 Nov 2024',
      time: '2:30 PM',
      type: 'reminder',
      priority: 'low',
      pinned: false,
      read: true,
      urgent: false
    }
  ]

  const getTypeBadge = (type) => {
    const badges = {
      'feature': 'badge-primary',
      'maintenance': 'badge-warning',
      'payment': 'badge-success',
      'policy': 'badge-info',
      'reminder': 'badge-secondary'
    }
    return <span className={`badge ${badges[type] || 'badge-secondary'}`}>{type}</span>
  }

  const getPriorityIcon = (priority) => {
    const icons = {
      'high': 'fe-alert-circle text-danger',
      'medium': 'fe-info text-warning',
      'low': 'fe-check-circle text-success'
    }
    return <i className={`fe ${icons[priority] || 'fe-info'}`}></i>
  }

  const filteredAnnouncements = () => {
    let filtered = announcements
    if (filter === 'unread') {
      filtered = filtered.filter(a => !a.read)
    } else if (filter === 'pinned') {
      filtered = filtered.filter(a => a.pinned)
    }
    // Sort: pinned first, then by date
    return filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.date) - new Date(a.date)
    })
  }

  const markAsRead = (id) => {
    // TODO: Update announcement read status via API
    console.log('Marking announcement as read:', id)
  }

  const togglePin = (id) => {
    // TODO: Toggle pin status via API
    console.log('Toggling pin for announcement:', id)
  }

  const unreadCount = announcements.filter(a => !a.read).length
  const pinnedCount = announcements.filter(a => a.pinned).length

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
                    onClick={() => setFilter('all')}
                  >
                    All Announcements ({announcements.length})
                  </button>
                  <button
                    className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilter('unread')}
                  >
                    Unread ({unreadCount})
                  </button>
                  <button
                    className={`btn btn-sm ${filter === 'pinned' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilter('pinned')}
                  >
                    Pinned ({pinnedCount})
                  </button>
                </div>
              </div>
            </div>

            {/* Announcements List */}
            <div className="announcements-list">
              {filteredAnnouncements().length === 0 ? (
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="fe fe-bell-off" style={{ fontSize: '64px', color: '#dee2e6' }}></i>
                    <h5 className="mt-3">No announcements found</h5>
                    <p className="text-muted">You're all caught up!</p>
                  </div>
                </div>
              ) : (
                filteredAnnouncements().map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`card mb-3 announcement-card ${announcement.pinned ? 'pinned' : ''} ${!announcement.read ? 'unread' : ''} ${announcement.urgent ? 'urgent' : ''}`}
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-start">
                        <div className="announcement-icon me-3">
                          {getPriorityIcon(announcement.priority)}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h5 className="mb-1">
                                {announcement.pinned && (
                                  <i className="fe fe-pin text-primary me-2" title="Pinned"></i>
                                )}
                                {announcement.urgent && (
                                  <i className="fe fe-alert-circle text-danger me-2" title="Urgent"></i>
                                )}
                                {announcement.title}
                                {!announcement.read && (
                                  <span className="badge bg-danger ms-2">New</span>
                                )}
                              </h5>
                              <div className="d-flex align-items-center gap-2 mb-2">
                                {getTypeBadge(announcement.type)}
                                <span className="text-muted small">
                                  <i className="fe fe-calendar me-1"></i>
                                  {announcement.date} at {announcement.time}
                                </span>
                              </div>
                            </div>
                            <div className="announcement-actions">
                              <button
                                className="btn btn-sm btn-link"
                                onClick={() => togglePin(announcement.id)}
                                title={announcement.pinned ? 'Unpin' : 'Pin'}
                              >
                                <i className={`fe ${announcement.pinned ? 'fe-pin' : 'fe-pin-off'}`}></i>
                              </button>
                            </div>
                          </div>
                          <p className="mb-0">{announcement.message}</p>
                          {!announcement.read && (
                            <button
                              className="btn btn-sm btn-primary mt-3"
                              onClick={() => markAsRead(announcement.id)}
                            >
                              Mark as Read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
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

