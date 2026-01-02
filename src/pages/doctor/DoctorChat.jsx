import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as chatApi from '../../api/chat'

const DoctorChat = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const messagesEndRef = useRef(null)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState(null)

  // Catch any errors
  useEffect(() => {
    const errorHandler = (event) => {
      console.error('Error in DoctorChat:', event.error)
      setError(event.error?.message || 'An error occurred')
    }
    window.addEventListener('error', errorHandler)
    return () => window.removeEventListener('error', errorHandler)
  }, [])

  // Get patientId from URL params (if coming from appointments page)
  const patientIdFromUrl = searchParams.get('patientId')
  const appointmentIdFromUrl = searchParams.get('appointmentId')

  // Fetch all conversations
  const { data: conversationsData, isLoading: conversationsLoading, refetch: refetchConversations } = useQuery({
    queryKey: ['doctorPatientConversations'],
    queryFn: () => chatApi.getConversations(),
    enabled: !!user
  })

  // Fetch messages for selected conversation
  const { data: messagesData, isLoading: messagesLoading, refetch: refetchMessages } = useQuery({
    queryKey: ['conversationMessages', selectedConversation?._id],
    queryFn: async () => {
      if (!selectedConversation?._id) return null
      const response = await chatApi.getMessages(selectedConversation._id, { page: 1, limit: 100 })
      console.log('Fetched messages:', response)
      return response
    },
    enabled: !!selectedConversation?._id
  })

  // Fetch unread count
  const { data: unreadData } = useQuery({
    queryKey: ['unreadCount'],
    queryFn: () => chatApi.getUnreadCount(),
    enabled: !!user,
    refetchInterval: 30000 // Poll every 30 seconds
  })

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message }) => {
      if (!selectedConversation || !user) {
        throw new Error('Conversation or user not found')
      }
      
      console.log('Sending message to conversation:', selectedConversation)
      
      // For doctor-patient conversation
      if (selectedConversation.conversationType === 'DOCTOR_PATIENT') {
        const appointmentId = selectedConversation.appointmentId?._id || selectedConversation.appointmentId
        const patientId = selectedConversation.patientId?._id || selectedConversation.patientId
        
        console.log('Message data:', { doctorId: user._id, patientId, appointmentId, message })
        
        if (!appointmentId) {
          throw new Error('Appointment ID is required for patient conversations')
        }
        
        if (!patientId) {
          throw new Error('Patient ID is required for patient conversations')
        }
        
        const response = await chatApi.sendMessageToPatient(
          user._id,
          patientId,
          appointmentId,
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
      await queryClient.invalidateQueries(['doctorPatientConversations'])
      await queryClient.invalidateQueries(['unreadCount'])
      
      // Refetch messages to show the new message
      await refetchMessages()
      // Refetch conversations to update the list (in case conversation was just created)
      await refetchConversations()
      
      setNewMessage('')
      setTimeout(() => scrollToBottom(), 100)
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send message'
      toast.error(errorMessage)
    }
  })

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (conversationId) => chatApi.markMessagesAsRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctorPatientConversations'])
      queryClient.invalidateQueries(['unreadCount'])
    }
  })

  // Start conversation mutation (if coming from appointments page)
  const startConversationMutation = useMutation({
    mutationFn: async ({ patientId, appointmentId }) => {
      if (!user) throw new Error('User not found')
      const response = await chatApi.startConversationWithPatient(user._id, patientId, appointmentId)
      return response
    },
    onSuccess: async (response) => {
      // Extract conversation from response
      const conversation = response?.data || response
      console.log('Created conversation:', conversation)
      
      // Invalidate and refetch conversations to get the new one in the list
      await queryClient.invalidateQueries(['doctorPatientConversations'])
      
      // Wait a bit for the refetch to complete
      setTimeout(async () => {
        // Refetch conversations to get updated list
        const refetchResult = await queryClient.refetchQueries(['doctorPatientConversations'])
        console.log('Refetched conversations:', refetchResult)
        
        // Find the newly created conversation in the updated list
        const conversations = refetchResult[0]?.data?.data?.conversations || refetchResult[0]?.data?.conversations || []
        const newConversation = conversations.find(
          conv => conv._id === conversation._id || conv._id?.toString() === conversation._id?.toString()
        ) || conversation
        
        console.log('Selected conversation:', newConversation)
        setSelectedConversation(newConversation)
      }, 500)
      
      // Also set it immediately in case refetch takes time
      setSelectedConversation(conversation)
      
      // Clear URL params
      navigate('/chat-doctor', { replace: true })
      toast.success('Conversation started successfully')
    },
    onError: (error) => {
      console.error('Start conversation error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to start conversation'
      toast.error(errorMessage)
    }
  })

  // Extract conversations from response (handle both direct data and nested data structure)
  const allConversations = useMemo(() => {
    return conversationsData?.data?.conversations || conversationsData?.conversations || []
  }, [conversationsData])
  
  // Filter conversations by search
  const filteredConversations = useMemo(() => {
    return allConversations.filter(conv => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      const patientName = conv.patientId?.fullName?.toLowerCase() || ''
      return patientName.includes(query)
    })
  }, [allConversations, searchQuery])

  // Filter only doctor-patient conversations
  const patientConversations = useMemo(() => {
    return filteredConversations.filter(
      conv => conv.conversationType === 'DOCTOR_PATIENT'
    )
  }, [filteredConversations])
  
  // If we have a selected conversation that's not in the list, add it temporarily
  const conversationsToShow = useMemo(() => {
    const list = [...patientConversations]
    if (selectedConversation && !patientConversations.find(c => c._id === selectedConversation._id)) {
      list.unshift(selectedConversation)
    }
    return list
  }, [patientConversations, selectedConversation])
  
  // Extract messages from response
  const messages = useMemo(() => {
    return messagesData?.data?.messages || messagesData?.messages || []
  }, [messagesData])
  
  // Debug logging (remove in production)
  useEffect(() => {
    if (conversationsData) {
      console.log('Conversations Data:', conversationsData)
      console.log('All Conversations:', allConversations)
      console.log('Patient Conversations:', patientConversations)
      console.log('Selected Conversation:', selectedConversation)
    }
  }, [conversationsData, allConversations, patientConversations, selectedConversation])

  // Handle URL params - start conversation if patientId and appointmentId are provided
  useEffect(() => {
    if (patientIdFromUrl && appointmentIdFromUrl && user && !startConversationMutation.isLoading && conversationsData) {
      // Check if conversation already exists in the list
      const existingConv = patientConversations.find(
        conv => {
          const convPatientId = conv.patientId?._id || conv.patientId
          const convAppointmentId = conv.appointmentId?._id || conv.appointmentId
          return convPatientId === patientIdFromUrl && convAppointmentId === appointmentIdFromUrl
        }
      )
      
      if (existingConv) {
        // Conversation exists, just select it
        setSelectedConversation(existingConv)
        navigate('/chat-doctor', { replace: true })
      } else if (!startConversationMutation.isLoading) {
        // Conversation doesn't exist, create it
        startConversationMutation.mutate({
          patientId: patientIdFromUrl,
          appointmentId: appointmentIdFromUrl
        })
      }
    }
  }, [patientIdFromUrl, appointmentIdFromUrl, user, conversationsData, patientConversations, startConversationMutation])

  // Select first conversation on load if none selected and no URL params
  useEffect(() => {
    if (!selectedConversation && conversationsToShow.length > 0 && !patientIdFromUrl) {
      handleSelectConversation(conversationsToShow[0])
    }
  }, [conversationsToShow, patientIdFromUrl, selectedConversation])

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
  
  // Group messages by date
  const groupMessagesByDate = (messages) => {
    if (!messages || !Array.isArray(messages)) return {}
    const groups = {}
    messages.forEach(msg => {
      const date = new Date(msg.createdAt).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(msg)
    })
    return groups
  }

  // Format date for separator
  const formatDateSeparator = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }
  }

  const groupedMessages = useMemo(() => groupMessagesByDate(messages), [messages])

  // Show error if any
  if (error) {
    return (
      <div className="page-wrapper chat-page-wrapper doctor-chat-wrapper">
        <div className="container">
          <div className="content doctor-content">
            <div className="alert alert-danger">
              <h4>Error</h4>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={() => setError(null)}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .doctor-chat-wrapper {
          padding-top: 68px;
          min-height: 100vh;
          background: #f5f5f5;
        }
        .doctor-chat-wrapper .container {
          max-width: 100%;
          padding: 24px;
        }
        .doctor-chat-container {
          display: flex;
          gap: 24px;
          height: calc(100vh - 192px);
          max-height: calc(100vh - 192px);
        }
        .chat-list-sidebar {
          width: 400px;
          flex-shrink: 0;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .chat-list-header {
          padding: 12px;
          border-bottom: 1px solid #e5e5e5;
        }
        .chat-list-header h4 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 11px;
          color: #0A0A0A;
        }
        .chat-search-box {
          position: relative;
        }
        .chat-search-box .form-control-feedback {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }
        .chat-search-box input {
          width: 100%;
          padding: 8px 12px 8px 35px;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          font-size: 14px;
        }
        .chat-list-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 0 12px;
        }
        .recent-chat-section {
          padding: 16px 0;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .section-header h6 {
          font-size: 14px;
          font-weight: 600;
          color: #0A0A0A;
          margin: 0;
        }
        .chat-item {
          display: flex;
          align-items: flex-start;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 4px;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }
        .chat-item:hover {
          background: #f5f5f5;
        }
        .chat-item.active {
          background: #e3f2fd;
        }
        .chat-item-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          margin-right: 12px;
          flex-shrink: 0;
          position: relative;
        }
        .chat-item-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
        .chat-item-content {
          flex: 1;
          min-width: 0;
        }
        .chat-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 4px;
        }
        .chat-item-name {
          font-size: 15px;
          font-weight: 600;
          color: #0A0A0A;
          margin: 0;
        }
        .chat-item-time {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #999;
        }
        .chat-item-message {
          font-size: 14px;
          color: #666;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .chat-item-icons {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .chat-item-icons .unread-badge {
          background: #2196F3;
          color: #fff;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
        }
        .chat-details-area {
          flex: 1;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }
        .chat-details-header {
          padding: 15px;
          border-bottom: 1px solid #e5e5e5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }
        .chat-details-user {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .chat-details-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          position: relative;
        }
        .chat-details-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
        .chat-details-user-info h5 {
          font-size: 18px;
          font-weight: 600;
          color: #0A0A0A;
          margin: 0 0 2px 0;
        }
        .chat-details-user-info small {
          font-size: 12px;
          color: #4CAF50;
        }
        .chat-messages-area {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 24px;
          padding-bottom: 40px;
          min-height: 0;
        }
        .chat-date-separator {
          text-align: center;
          margin: 20px 0;
          position: relative;
        }
        .chat-date-separator::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          background: #e5e5e5;
        }
        .chat-date-separator span {
          background: #fff;
          padding: 0 12px;
          position: relative;
          color: #999;
          font-size: 12px;
        }
        .chat-message {
          display: flex;
          margin-bottom: 24px;
          max-width: 75%;
        }
        .chat-message.incoming {
          align-self: flex-start;
        }
        .chat-message.outgoing {
          align-self: flex-end;
          flex-direction: row-reverse;
          margin-left: auto;
        }
        .chat-message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          flex-shrink: 0;
          margin: 0 8px;
        }
        .chat-message-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
        .chat-message-content {
          flex: 1;
        }
        .chat-message-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .chat-message-header h6 {
          font-size: 14px;
          font-weight: 600;
          color: #0A0A0A;
          margin: 0;
        }
        .chat-message-header span {
          font-size: 12px;
          color: #999;
        }
        .chat-message-bubble {
          background: #f5f5f5;
          border-radius: 0 15px 15px 15px;
          padding: 14px 20px;
          font-size: 14px;
          color: #0A0A0A;
        }
        .chat-message.outgoing .chat-message-bubble {
          border-radius: 15px 0 15px 15px;
          background: #e3f2fd;
        }
        .chat-input-area {
          padding: 15px;
          border-top: 1px solid #e5e5e5;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          background: #fff;
        }
        .chat-input-actions {
          display: flex;
          gap: 8px;
        }
        .chat-input-actions button {
          width: 36px;
          height: 36px;
          border: none;
          background: transparent;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
        }
        .chat-input-actions button:hover {
          background: #f5f5f5;
        }
        .chat-input-field {
          flex: 1;
          padding: 10px 16px;
          border: 1px solid #e5e5e5;
          border-radius: 24px;
          font-size: 14px;
        }
        .chat-send-button {
          width: 40px;
          height: 40px;
          border: none;
          background: #2196F3;
          border-radius: 50%;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chat-send-button:hover {
          background: #1976D2;
        }
        .chat-send-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        @media (max-width: 991px) {
          .doctor-chat-container {
            flex-direction: column;
            height: auto;
          }
          .chat-list-sidebar {
            width: 100%;
            max-height: 400px;
          }
          .chat-details-area {
            display: none;
          }
          .chat-details-area.show {
            display: flex;
          }
        }
      `}</style>
      <div className="page-wrapper chat-page-wrapper doctor-chat-wrapper">
        <div className="container">
          <div className="content doctor-content">
            <div className="doctor-chat-container">
              {/* Left Sidebar - Chat List */}
              <div className="chat-list-sidebar">
                <div className="chat-list-header">
                  <h4>All Chats</h4>
                  <div className="chat-search-box">
                    <span className="form-control-feedback">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                    <input
                      type="text"
                      placeholder="Search"
                      className="form-control"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="chat-list-content">
                  {/* Recent Chat Section */}
                  <div className="recent-chat-section">
                    <div className="section-header">
                      <h6>Recent Chat</h6>
                    </div>
                    {conversationsLoading ? (
                      <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : conversationsToShow.length === 0 ? (
                      <div className="text-center py-3 text-muted">
                        <p>No patient conversations found</p>
                        <small>Start chatting with patients from your appointments</small>
                      </div>
                    ) : (
                      conversationsToShow.map((conversation) => {
                        const patient = conversation.patientId
                        const isSelected = selectedConversation?._id === conversation._id
                        return (
                          <div
                            key={conversation._id}
                            className={`chat-item ${isSelected ? 'active' : ''}`}
                            onClick={() => handleSelectConversation(conversation)}
                          >
                            <div className="chat-item-avatar">
                              <img
                                src={patient?.profileImage || '/assets/img/doctors-dashboard/profile-01.jpg'}
                                alt={patient?.fullName || 'Patient'}
                                onError={(e) => {
                                  e.target.src = '/assets/img/doctors-dashboard/profile-01.jpg'
                                }}
                              />
                            </div>
                            <div className="chat-item-content">
                              <div className="chat-item-header">
                                <h5 className="chat-item-name">{patient?.fullName || 'Patient'}</h5>
                                <div className="chat-item-time">
                                  <small>{formatTime(conversation.lastMessageAt)}</small>
                                  {conversation.unreadCount > 0 && (
                                    <div className="chat-item-icons">
                                      <span className="unread-badge">{conversation.unreadCount}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <p className="chat-item-message">{getLastMessagePreview(conversation)}</p>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Right Area - Chat Details */}
              <div className="chat-details-area">
                {selectedConversation ? (
                  <>
                    <div className="chat-details-header">
                      <div className="chat-details-user">
                        <div className="chat-details-avatar">
                          <img
                            src={
                              selectedConversation.patientId?.profileImage ||
                              '/assets/img/doctors-dashboard/profile-01.jpg'
                            }
                            alt={selectedConversation.patientId?.fullName || 'Patient'}
                            onError={(e) => {
                              e.target.src = '/assets/img/doctors-dashboard/profile-01.jpg'
                            }}
                          />
                        </div>
                        <div className="chat-details-user-info">
                          <h5>{selectedConversation.patientId?.fullName || 'Patient'}</h5>
                          <small>Patient</small>
                        </div>
                      </div>
                    </div>

                    <div className="chat-messages-area">
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
                        Object.keys(groupedMessages).map((date) => (
                          <div key={date}>
                            <div className="chat-date-separator">
                              <span>{formatDateSeparator(date)}</span>
                            </div>
                            {groupedMessages[date].map((msg) => {
                              const isDoctor =
                                msg.senderId?._id === user?._id || msg.senderId === user?._id
                              return (
                                <div
                                  key={msg._id}
                                  className={`chat-message ${isDoctor ? 'outgoing' : 'incoming'}`}
                                >
                                  <div className="chat-message-avatar">
                                    <img
                                      src={
                                        isDoctor
                                          ? user?.profileImage || '/assets/img/doctors-dashboard/profile-01.jpg'
                                          : selectedConversation.patientId?.profileImage ||
                                            '/assets/img/doctors-dashboard/profile-01.jpg'
                                      }
                                      alt={isDoctor ? user?.fullName : selectedConversation.patientId?.fullName}
                                      onError={(e) => {
                                        e.target.src = '/assets/img/doctors-dashboard/profile-01.jpg'
                                      }}
                                    />
                                  </div>
                                  <div className="chat-message-content">
                                    <div className="chat-message-header">
                                      <h6>
                                        {isDoctor
                                          ? user?.fullName || 'You'
                                          : selectedConversation.patientId?.fullName || 'Patient'}
                                      </h6>
                                      <span>{formatMessageTime(msg.createdAt)}</span>
                                    </div>
                                    <div className="chat-message-bubble">{msg.message}</div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input Area */}
                    <div className="chat-input-area">
                      <div className="chat-input-actions">
                        <button type="button" title="More options">
                          <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        <button type="button" title="Emoji">
                          <i className="fa-regular fa-face-smile"></i>
                        </button>
                        <button type="button" title="Voice message">
                          <i className="fa-solid fa-microphone"></i>
                        </button>
                      </div>
                      <form onSubmit={handleSendMessage} style={{ flex: 1, display: 'flex', gap: '12px' }}>
                        <input
                          type="text"
                          className="chat-input-field"
                          placeholder="Type your message here..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          disabled={sendMessageMutation.isLoading}
                        />
                        <button
                          type="submit"
                          className="chat-send-button"
                          title="Send"
                          disabled={!newMessage.trim() || sendMessageMutation.isLoading}
                        >
                          {sendMessageMutation.isLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status">
                              <span className="visually-hidden">Sending...</span>
                            </span>
                          ) : (
                            <i className="fa-solid fa-paper-plane"></i>
                          )}
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      flexDirection: 'column',
                      color: '#999'
                    }}
                  >
                    <i className="fa-solid fa-comments" style={{ fontSize: '64px', marginBottom: '16px' }}></i>
                    <h5>Select a conversation</h5>
                    <p>Choose a patient from the list to start chatting</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DoctorChat
