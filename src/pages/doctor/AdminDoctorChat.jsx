import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as chatApi from '../../api/chat'

const AdminDoctorChat = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState(null)

  // Catch any errors
  useEffect(() => {
    const errorHandler = (event) => {
      console.error('Error in AdminDoctorChat:', event.error)
      setError(event.error?.message || 'An error occurred')
    }
    window.addEventListener('error', errorHandler)
    return () => window.removeEventListener('error', errorHandler)
  }, [])

  // Fetch all conversations (admin-doctor only for this page) with long polling
  const { data: conversationsData, isLoading: conversationsLoading, refetch: refetchConversations } = useQuery({
    queryKey: ['adminDoctorConversations'],
    queryFn: () => chatApi.getConversations(),
    enabled: !!user,
    refetchInterval: 5000, // Poll every 5 seconds for new conversations
    refetchIntervalInBackground: true
  })

  // Fetch messages for selected conversation with long polling
  const { data: messagesData, isLoading: messagesLoading, refetch: refetchMessages } = useQuery({
    queryKey: ['conversationMessages', selectedConversation?._id],
    queryFn: async () => {
      if (!selectedConversation?._id) return null
      const response = await chatApi.getMessages(selectedConversation._id, { page: 1, limit: 100 })
      console.log('Fetched messages:', response)
      return response
    },
    enabled: !!selectedConversation?._id,
    refetchInterval: 2000, // Poll every 2 seconds for real-time updates
    refetchIntervalInBackground: true // Continue polling even when tab is in background
  })

  // Fetch unread count
  const { data: unreadData } = useQuery({
    queryKey: ['unreadCount'],
    queryFn: () => chatApi.getUnreadCount(),
    enabled: !!user,
    refetchInterval: 30000 // Poll every 30 seconds
  })

  // Extract conversations from response
  const allConversations = useMemo(() => {
    return conversationsData?.data?.conversations || conversationsData?.conversations || []
  }, [conversationsData])

  // Filter conversations by search
  const filteredConversations = useMemo(() => {
    return allConversations.filter(conv => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      const adminName = conv.adminId?.fullName?.toLowerCase() || ''
      return adminName.includes(query)
    })
  }, [allConversations, searchQuery])

  // Filter only admin-doctor conversations
  const adminConversations = useMemo(() => {
    return filteredConversations.filter(
      conv => conv.conversationType === 'ADMIN_DOCTOR'
    )
  }, [filteredConversations])

  // If we have a selected conversation that's not in the list, add it temporarily
  const conversationsToShow = useMemo(() => {
    const list = [...adminConversations]
    if (selectedConversation && !adminConversations.find(c => c._id === selectedConversation._id)) {
      list.unshift(selectedConversation)
    }
    return list
  }, [adminConversations, selectedConversation])

  // Extract messages from response
  const messages = useMemo(() => {
    return messagesData?.data?.messages || messagesData?.messages || []
  }, [messagesData])

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message }) => {
      if (!selectedConversation || !user) {
        throw new Error('Conversation or user not found')
      }
      
      console.log('Sending message to admin conversation:', selectedConversation)
      
      // Determine if this is admin-doctor conversation
      if (selectedConversation.conversationType === 'ADMIN_DOCTOR') {
        const adminId = selectedConversation.adminId?._id || selectedConversation.adminId
        
        console.log('Message data:', { doctorId: user._id, adminId, message })
        
        if (!adminId) {
          throw new Error('Admin ID is required for admin conversations')
        }
        
        const response = await chatApi.sendMessageToAdmin(
          user._id,
          adminId,
          message
        )
        console.log('Message sent successfully:', response)
        return response
      } else {
        throw new Error('Invalid conversation type')
      }
    },
    onSuccess: async () => {
      // Invalidate queries to refetch updated data
      await queryClient.invalidateQueries(['conversationMessages', selectedConversation?._id])
      await queryClient.invalidateQueries(['adminDoctorConversations'])
      await queryClient.invalidateQueries(['unreadCount'])
      
      // Refetch messages to show the new message
      await refetchMessages()
      // Refetch conversations to update the list
      await refetchConversations()
      
      setNewMessage('')
      setTimeout(() => scrollToBottom(), 100)
    },
    onError: (error) => {
      console.error('Send message error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send message'
      toast.error(errorMessage)
    }
  })

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (conversationId) => chatApi.markMessagesAsRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminDoctorConversations'])
      queryClient.invalidateQueries(['unreadCount'])
    }
  })

  // Start conversation mutation (if needed - when admin sends first message, conversation is created automatically)
  const startConversationMutation = useMutation({
    mutationFn: async ({ adminId }) => {
      if (!user) throw new Error('User not found')
      const response = await chatApi.startConversationWithAdmin(user._id, adminId)
      return response
    },
    onSuccess: async (response) => {
      const conversation = response?.data || response
      console.log('Created conversation:', conversation)
      
      await queryClient.invalidateQueries(['adminDoctorConversations'])
      
      setTimeout(async () => {
        const refetchResult = await queryClient.refetchQueries(['adminDoctorConversations'])
        const conversations = refetchResult[0]?.data?.data?.conversations || refetchResult[0]?.data?.conversations || []
        const newConversation = conversations.find(
          conv => conv._id === conversation._id || conv._id?.toString() === conversation._id?.toString()
        ) || conversation
        
        setSelectedConversation(newConversation)
      }, 500)
      
      setSelectedConversation(conversation)
      toast.success('Conversation started successfully')
    },
    onError: (error) => {
      console.error('Start conversation error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to start conversation'
      toast.error(errorMessage)
    }
  })

  // Debug logging
  useEffect(() => {
    if (conversationsData) {
      console.log('Admin Conversations Data:', conversationsData)
      console.log('All Conversations:', allConversations)
      console.log('Admin Conversations:', adminConversations)
      console.log('Selected Conversation:', selectedConversation)
    }
  }, [conversationsData, allConversations, adminConversations, selectedConversation])

  // Select first conversation on load if none selected
  useEffect(() => {
    if (!selectedConversation && conversationsToShow.length > 0) {
      handleSelectConversation(conversationsToShow[0])
    }
  }, [conversationsToShow.length])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages && messages.length > 0) {
      scrollToBottom()
    }
  }, [messages])

  // Mark as read when conversation is selected
  useEffect(() => {
    if (selectedConversation && selectedConversation.unreadCount > 0) {
      markAsReadMutation.mutate(selectedConversation._id)
    }
  }, [selectedConversation?._id])

  // Auto-scroll to bottom when new messages arrive (only scroll messages container, not entire page)
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      // Scroll only the messages container, not the entire page
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    } else if (messagesEndRef.current) {
      // Fallback: scroll the end element into view within its container
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation)
    // Mark as read
    if (conversation.unreadCount > 0) {
      markAsReadMutation.mutate(conversation._id)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    sendMessageMutation.mutate({ message: newMessage.trim() })
  }

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Format message time
  const formatMessageTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  // Get last message preview
  const getLastMessagePreview = (conversation) => {
    // This would ideally come from the conversation's last message
    // For now, we'll show a placeholder
    return 'Click to view messages'
  }

  // Show error if any
  if (error) {
    return (
      <div className="content doctor-content">
        <div className="container">
          <div className="alert alert-danger">
            <h4>Error</h4>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => setError(null)}>
              Dismiss
            </button>
          </div>
        </div>
      </div>
    )
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
              <div className="d-flex align-items-center mb-3">
                <Link 
                  to="/doctor/dashboard" 
                  className="btn btn-sm btn-outline-secondary me-3"
                  style={{ minWidth: '40px' }}
                  title="Back to Dashboard"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </Link>
                <div>
                  <h3 className="mb-0">Admin Messages</h3>
                  <p className="text-muted mb-0">Communicate with platform administrators</p>
                </div>
              </div>
              <p className="text-muted small">
                <strong>Note:</strong> Admin conversations appear here once an administrator starts a conversation with you, 
                or you can send a message to start a new conversation.
              </p>
            </div>

            <div className="card chat-card">
              <div className="card-body p-0">
                <div className="row g-0">
                  {/* Admin List Sidebar */}
                  <div className="col-md-4 border-end">
                    <div className="chat-sidebar">
                      <div className="chat-sidebar-header p-3 border-bottom">
                        <h6 className="mb-0">Administrators</h6>
                        <div className="mt-2">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Search admins..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="chat-sidebar-list" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {conversationsLoading ? (
                          <div className="text-center p-3">
                            <div className="spinner-border spinner-border-sm" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        ) : conversationsToShow.length === 0 ? (
                          <div className="text-center p-3 text-muted">
                            <p>No admin conversations found</p>
                            <small>
                              Admin conversations will appear here once an administrator starts a conversation with you.
                              <br />
                              You can also send a message to start a new conversation.
                            </small>
                          </div>
                        ) : (
                          conversationsToShow.map((conversation) => {
                            const admin = conversation.adminId
                            return (
                              <div
                                key={conversation._id}
                                className={`chat-sidebar-item p-3 border-bottom ${
                                  selectedConversation?._id === conversation._id ? 'active bg-light' : ''
                                }`}
                                onClick={() => handleSelectConversation(conversation)}
                                style={{ cursor: 'pointer' }}
                              >
                                <div className="d-flex align-items-center">
                                  {/* <div className="avatar avatar-sm me-3 position-relative">
                                    <img
                                      src={admin?.profileImage || '/assets/img/doctors/doctor-thumb-01.jpg'}
                                      alt={admin?.fullName || 'Admin'}
                                      className="rounded-circle"
                                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                      onError={(e) => {
                                        e.target.src = '/assets/img/doctors/doctor-thumb-01.jpg'
                                      }}
                                    />
                                  </div> */}
                                  <div className="flex-grow-1">
                                    <h6 className="mb-1">{admin?.fullName || 'Admin'}</h6>
                                    <p className="text-muted small mb-0 text-truncate" style={{ maxWidth: '150px' }}>
                                      {getLastMessagePreview(conversation)}
                                    </p>
                                    <span className="text-muted small">
                                      {formatTime(conversation.lastMessageAt)}
                                    </span>
                                  </div>
                                  {conversation.unreadCount > 0 && (
                                    <span className="badge bg-danger">{conversation.unreadCount}</span>
                                  )}
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="col-md-8">
                    {selectedConversation ? (
                      <>
                        <div className="chat-header p-3 border-bottom">
                          <div className="d-flex align-items-center">
                            {/* <div className="avatar avatar-sm me-3 position-relative">
                              <img
                                src={
                                  selectedConversation.adminId?.profileImage ||
                                  '/assets/img/doctors/doctor-thumb-01.jpg'
                                }
                                alt={selectedConversation.adminId?.fullName || 'Admin'}
                                className="rounded-circle"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                onError={(e) => {
                                  e.target.src = '/assets/img/doctors/doctor-thumb-01.jpg'
                                }}
                              />
                            </div> */}
                            <div>
                              <h6 className="mb-0">
                                {selectedConversation.adminId?.fullName || 'Admin'}
                              </h6>
                              <span className="text-muted small">Administrator</span>
                            </div>
                          </div>
                        </div>

                        <div
                          ref={messagesContainerRef}
                          className="chat-messages p-3"
                          style={{ height: '400px', overflowY: 'auto' }}
                        >
                          {messagesLoading ? (
                            <div className="text-center py-5">
                              <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading messages...</span>
                              </div>
                            </div>
                          ) : messages.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                              <p>No messages yet</p>
                              <small>Start the conversation by sending a message</small>
                            </div>
                          ) : (
                            messages.map((msg) => {
                              const isDoctor = msg.senderId?._id === user?._id || msg.senderId === user?._id
                              return (
                                <div
                                  key={msg._id}
                                  className={`message-item mb-3 d-flex ${
                                    isDoctor ? 'justify-content-end' : 'justify-content-start'
                                  }`}
                                >
                                  <div
                                    className={`message-bubble ${
                                      isDoctor ? 'bg-primary' : 'bg-light'
                                    }`}
                                    style={{
                                      maxWidth: '70%',
                                      padding: '10px 15px',
                                      borderRadius: '15px',
                                      wordWrap: 'break-word',
                                      backgroundColor: isDoctor ? '#2196F3' : '#f5f5f5',
                                      color: isDoctor ? '#ffffff' : '#0A0A0A'
                                    }}
                                  >
                                    <p className="mb-1" style={{ color: isDoctor ? '#ffffff' : '#0A0A0A', margin: 0 }}>
                                      {msg.message}
                                    </p>
                                    <span
                                      className="message-time small"
                                      style={{ 
                                        fontSize: '11px',
                                        color: isDoctor ? 'rgba(255, 255, 255, 0.8)' : '#999'
                                      }}
                                    >
                                      {formatMessageTime(msg.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              )
                            })
                          )}
                          <div ref={messagesEndRef} />
                        </div>

                        <form className="chat-input-area" onSubmit={handleSendMessage} style={{
                          padding: '15px',
                          borderTop: '1px solid #e5e5e5',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          flexShrink: 0,
                          background: '#fff',
                          position: 'sticky',
                          bottom: 0,
                          zIndex: 10
                        }}>
                          <input
                            type="text"
                            className="chat-input-field"
                            placeholder="Type your message here..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={sendMessageMutation.isLoading}
                            style={{
                              flex: 1,
                              padding: '10px 16px',
                              border: '1px solid #e5e5e5',
                              borderRadius: '24px',
                              fontSize: '14px'
                            }}
                          />
                          <button
                            type="submit"
                            className="chat-send-button"
                            disabled={!newMessage.trim() || sendMessageMutation.isLoading}
                            title="Send"
                            style={{
                              width: '40px',
                              height: '40px',
                              border: 'none',
                              background: sendMessageMutation.isLoading || !newMessage.trim() ? '#ccc' : '#2196F3',
                              borderRadius: '50%',
                              color: '#fff',
                              cursor: sendMessageMutation.isLoading || !newMessage.trim() ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              if (!sendMessageMutation.isLoading && newMessage.trim()) {
                                e.target.style.background = '#1976D2'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!sendMessageMutation.isLoading && newMessage.trim()) {
                                e.target.style.background = '#2196F3'
                              }
                            }}
                          >
                            {sendMessageMutation.isLoading ? (
                              <i className="fa-solid fa-spinner fa-spin"></i>
                            ) : (
                              <i className="fa-solid fa-paper-plane"></i>
                            )}
                          </button>
                        </form>
                      </>
                    ) : (
                      <div
                        className="chat-placeholder d-flex align-items-center justify-content-center"
                        style={{ height: '500px' }}
                      >
                        <div className="text-center">
                          <i className="fe fe-message-circle" style={{ fontSize: '64px', color: '#dee2e6' }}></i>
                          <h5 className="mt-3">Select an administrator</h5>
                          <p className="text-muted">
                            {conversationsToShow.length > 0
                              ? 'Choose an admin from the list to start a conversation'
                              : 'Admin conversations will appear here once an administrator starts a conversation with you, or you can send a message to start a new conversation.'}
                          </p>
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
