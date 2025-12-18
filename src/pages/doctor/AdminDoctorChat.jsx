import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const AdminDoctorChat = () => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const messagesEndRef = useRef(null)

  const admins = [
    {
      id: 1,
      name: 'Admin Support',
      avatar: '/assets/img/doctors/doctor-thumb-01.jpg',
      lastMessage: 'Thank you for your inquiry. We will get back to you soon.',
      lastMessageTime: '10:30 AM',
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: 'Verification Team',
      avatar: '/assets/img/doctors/doctor-thumb-02.jpg',
      lastMessage: 'Your documents have been reviewed.',
      lastMessageTime: 'Yesterday',
      unread: 0,
      online: false
    },
    {
      id: 3,
      name: 'Billing Support',
      avatar: '/assets/img/doctors/doctor-thumb-03.jpg',
      lastMessage: 'Payment processed successfully.',
      lastMessageTime: '2 days ago',
      unread: 1,
      online: true
    }
  ]

  const sampleMessages = [
    {
      id: 1,
      sender: 'admin',
      message: 'Hello! How can we assist you today?',
      time: '10:00 AM',
      date: '15 Nov 2024'
    },
    {
      id: 2,
      sender: 'doctor',
      message: 'I have a question about my subscription plan.',
      time: '10:05 AM',
      date: '15 Nov 2024'
    },
    {
      id: 3,
      sender: 'admin',
      message: 'Sure! What would you like to know?',
      time: '10:06 AM',
      date: '15 Nov 2024'
    },
    {
      id: 4,
      sender: 'doctor',
      message: 'Can I upgrade my plan mid-month?',
      time: '10:10 AM',
      date: '15 Nov 2024'
    },
    {
      id: 5,
      sender: 'admin',
      message: 'Yes, you can upgrade at any time. The billing will be prorated.',
      time: '10:15 AM',
      date: '15 Nov 2024'
    }
  ]

  useEffect(() => {
    if (selectedAdmin) {
      setMessages(sampleMessages)
      scrollToBottom()
    }
  }, [selectedAdmin])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'doctor',
        message: newMessage,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      }
      setMessages([...messages, message])
      setNewMessage('')
      scrollToBottom()
    }
  }

  const handleSelectAdmin = (admin) => {
    setSelectedAdmin(admin)
    // Mark as read
    // TODO: Update unread count via API
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
              <h3>Admin Messages</h3>
              <p className="text-muted">Communicate with platform administrators</p>
            </div>

            <div className="card chat-card">
              <div className="card-body p-0">
                <div className="row g-0">
                  {/* Admin List Sidebar */}
                  <div className="col-md-4 border-end">
                    <div className="chat-sidebar">
                      <div className="chat-sidebar-header p-3 border-bottom">
                        <h6 className="mb-0">Administrators</h6>
                      </div>
                      <div className="chat-sidebar-list">
                        {admins.map((admin) => (
                          <div
                            key={admin.id}
                            className={`chat-sidebar-item p-3 border-bottom ${selectedAdmin?.id === admin.id ? 'active' : ''}`}
                            onClick={() => handleSelectAdmin(admin)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="d-flex align-items-center">
                              <div className="avatar avatar-sm me-3 position-relative">
                                <img
                                  src={admin.avatar}
                                  alt={admin.name}
                                  className="rounded-circle"
                                />
                                {admin.online && (
                                  <span className="status online"></span>
                                )}
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-1">{admin.name}</h6>
                                <p className="text-muted small mb-0 text-truncate" style={{ maxWidth: '150px' }}>
                                  {admin.lastMessage}
                                </p>
                                <span className="text-muted small">{admin.lastMessageTime}</span>
                              </div>
                              {admin.unread > 0 && (
                                <span className="badge bg-danger">{admin.unread}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="col-md-8">
                    {selectedAdmin ? (
                      <>
                        <div className="chat-header p-3 border-bottom">
                          <div className="d-flex align-items-center">
                            <div className="avatar avatar-sm me-3 position-relative">
                              <img
                                src={selectedAdmin.avatar}
                                alt={selectedAdmin.name}
                                className="rounded-circle"
                              />
                              {selectedAdmin.online && (
                                <span className="status online"></span>
                              )}
                            </div>
                            <div>
                              <h6 className="mb-0">{selectedAdmin.name}</h6>
                              <span className="text-muted small">
                                {selectedAdmin.online ? 'Online' : 'Offline'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="chat-messages p-3" style={{ height: '400px', overflowY: 'auto' }}>
                          {messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`message-item mb-3 ${msg.sender === 'doctor' ? 'message-sent' : 'message-received'}`}
                            >
                              <div className={`message-bubble ${msg.sender === 'doctor' ? 'bg-primary text-white' : 'bg-light'}`}>
                                <p className="mb-0">{msg.message}</p>
                                <span className={`message-time small ${msg.sender === 'doctor' ? 'text-white-50' : 'text-muted'}`}>
                                  {msg.time}
                                </span>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>

                        <div className="chat-input p-3 border-top">
                          <form onSubmit={handleSendMessage}>
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                              />
                              <button
                                className="btn btn-primary"
                                type="submit"
                                disabled={!newMessage.trim()}
                              >
                                <i className="fe fe-send"></i>
                              </button>
                            </div>
                          </form>
                        </div>
                      </>
                    ) : (
                      <div className="chat-placeholder d-flex align-items-center justify-content-center" style={{ height: '500px' }}>
                        <div className="text-center">
                          <i className="fe fe-message-circle" style={{ fontSize: '64px', color: '#dee2e6' }}></i>
                          <h5 className="mt-3">Select an administrator</h5>
                          <p className="text-muted">Choose an admin from the list to start a conversation</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDoctorChat

