import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as chatApi from '../../api/chat'
import * as appointmentApi from '../../api/appointments'

const Chat = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const messagesEndRef = useRef(null)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Get doctorId and appointmentId from URL params (if coming from appointment page)
  const doctorIdFromUrl = searchParams.get('doctorId')
  const appointmentIdFromUrl = searchParams.get('appointmentId')

  // Fetch patient's appointments to get conversations
  const { data: appointmentsData, isLoading: appointmentsLoading, refetch: refetchAppointments } = useQuery({
    queryKey: ['patientAppointments'],
    queryFn: () => appointmentApi.listAppointments({ status: 'CONFIRMED', limit: 100 }),
    enabled: !!user
  })

  // Extract appointments
  const appointments = useMemo(() => {
    if (!appointmentsData) return []
    const responseData = appointmentsData.data || appointmentsData
    return Array.isArray(responseData) ? responseData : (responseData.appointments || [])
  }, [appointmentsData])

  // Create conversations list from appointments
  const conversations = useMemo(() => {
    if (!appointments || appointments.length === 0) return []
    
    return appointments.map(apt => ({
      _id: `conv-${apt._id}`, // Temporary ID
      appointmentId: apt._id,
      doctorId: apt.doctorId?._id || apt.doctorId,
      doctor: apt.doctorId,
      appointment: apt,
      conversationType: 'DOCTOR_PATIENT',
      lastMessageAt: apt.appointmentDate ? new Date(apt.appointmentDate) : new Date(),
      unreadCount: 0 // Will be updated when we fetch actual conversations
    }))
  }, [appointments])

  // Fetch messages for selected conversation
  const { data: messagesData, isLoading: messagesLoading, refetch: refetchMessages } = useQuery({
    queryKey: ['patientConversationMessages', selectedConversation?._id],
    queryFn: () => {
      if (!selectedConversation?.conversationId) return null
      return chatApi.getMessages(selectedConversation.conversationId)
    },
    enabled: !!selectedConversation?.conversationId
  })

  // Extract messages
  const messages = useMemo(() => {
    if (!messagesData) return []
    const responseData = messagesData.data || messagesData
    return Array.isArray(responseData) ? responseData : (responseData.messages || [])
  }, [messagesData])

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize conversation when appointmentId/doctorId from URL
  useEffect(() => {
    if (appointmentIdFromUrl && doctorIdFromUrl && appointments.length > 0) {
      const appointment = appointments.find(apt => apt._id === appointmentIdFromUrl)
      if (appointment) {
        const conversation = conversations.find(conv => conv.appointmentId === appointmentIdFromUrl)
        if (conversation) {
          handleSelectConversation(conversation)
        }
      }
    }
  }, [appointmentIdFromUrl, doctorIdFromUrl, appointments, conversations])

  // Handle selecting a conversation
  const handleSelectConversation = async (conversation) => {
    if (!user) {
      toast.error('Please login to start a conversation')
      return
    }

    try {
      // Get or create conversation with doctor
      const conversationData = await chatApi.startConversationWithDoctor(
        conversation.doctorId,
        conversation.appointmentId,
        user._id
      )
      
      const actualConversation = conversationData.data || conversationData
      
      // Update selected conversation with actual conversation data
      setSelectedConversation({
        ...conversation,
        conversationId: actualConversation._id,
        ...actualConversation
      })

      // Mark messages as read
      if (actualConversation._id) {
        await chatApi.markMessagesAsRead(actualConversation._id)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to start conversation'
      toast.error(errorMessage)
      console.error('Error starting conversation:', error)
    }
  }

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message }) => {
      if (!selectedConversation) {
        throw new Error('No conversation selected')
      }
      
      if (!user) {
        throw new Error('User not authenticated')
      }
      
      // Extract IDs as strings (handle both object and string formats)
      const doctorId = typeof selectedConversation.doctorId === 'object' 
        ? selectedConversation.doctorId._id || selectedConversation.doctorId 
        : selectedConversation.doctorId
      
      const appointmentId = typeof selectedConversation.appointmentId === 'object'
        ? selectedConversation.appointmentId._id || selectedConversation.appointmentId
        : selectedConversation.appointmentId
      
      const patientId = typeof user._id === 'object' ? user._id._id || user._id : user._id
      
      // Ensure all IDs are strings
      const doctorIdStr = String(doctorId)
      const appointmentIdStr = String(appointmentId)
      const patientIdStr = String(patientId)
      
      if (!doctorIdStr || !appointmentIdStr || !patientIdStr) {
        throw new Error('Doctor ID, Appointment ID, or Patient ID missing')
      }
      
      console.log('Sending message with:', {
        doctorId: doctorIdStr,
        appointmentId: appointmentIdStr,
        patientId: patientIdStr,
        message: message.substring(0, 50) + '...'
      })
      
      return await chatApi.sendMessageToDoctor(doctorIdStr, appointmentIdStr, message, null, patientIdStr)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['patientConversationMessages', selectedConversation?._id])
      setNewMessage('')
      setTimeout(() => scrollToBottom(), 100)
    },
    onError: (error) => {
      console.error('Send message error:', error)
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to send message'
      
      // Show detailed error if validation error
      if (error.response?.status === 400) {
        const validationErrors = error.response?.data?.errors || error.response?.data?.error
        if (validationErrors) {
          console.error('Validation errors:', validationErrors)
          toast.error(`Validation error: ${typeof validationErrors === 'string' ? validationErrors : JSON.stringify(validationErrors)}`)
        } else {
          toast.error(errorMessage)
        }
      } else {
        toast.error(errorMessage)
      }
    }
  })

  // Handle send message
  const handleSendMessage = (e) => {
    e.preventDefault()
    
    if (!selectedConversation) {
      toast.error('Please select a conversation first')
      return
    }
    
    if (!newMessage.trim()) {
      toast.error('Please enter a message')
      return
    }
    
    // Validate that we have all required IDs
    const doctorId = typeof selectedConversation.doctorId === 'object' 
      ? selectedConversation.doctorId._id || selectedConversation.doctorId 
      : selectedConversation.doctorId
    
    const appointmentId = typeof selectedConversation.appointmentId === 'object'
      ? selectedConversation.appointmentId._id || selectedConversation.appointmentId
      : selectedConversation.appointmentId
    
    if (!doctorId || !appointmentId) {
      toast.error('Missing doctor or appointment information. Please select a conversation again.')
      return
    }
    
    sendMessageMutation.mutate({ message: newMessage.trim() })
  }

  // Filter conversations by search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations
    
    const query = searchQuery.toLowerCase()
    return conversations.filter(conv => {
      const doctorName = conv.doctor?.fullName || conv.doctor?.userId?.fullName || ''
      return doctorName.toLowerCase().includes(query)
    })
  }, [conversations, searchQuery])

  // Format date for display
  const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const now = new Date()
    const diffTime = Math.abs(now - d)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return d.toLocaleDateString()
  }

  // Format time for display
  const formatTime = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups = []
    let currentDate = null
    
    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt).toDateString()
      
      if (messageDate !== currentDate) {
        currentDate = messageDate
        groups.push({ type: 'date', date: messageDate, formattedDate: formatDate(message.createdAt) })
      }
      
      groups.push(message)
    })
    
    return groups
  }, [messages])

  if (appointmentsLoading) {
    return (
      <div className="page-wrapper chat-page-wrapper patient-chat-wrapper">
        <div className="container">
          <div className="content doctor-content">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading conversations...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .patient-chat-wrapper {
          padding-top: 68px;
          min-height: 100vh;
          background: #f5f5f5;
        }
        .patient-chat-wrapper .container {
          max-width: 100%;
          padding: 24px;
        }
        .patient-chat-container {
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
        .chat-item {
          display: flex;
          align-items: flex-start;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 4px;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          transition: background 0.2s;
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
          display: flex;
          flex-direction: column;
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
          margin-right: auto;
        }
        .chat-message.outgoing {
          align-self: flex-end;
          flex-direction: row-reverse;
          margin-left: auto;
          margin-right: 0;
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
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 40px;
          text-align: center;
          color: #999;
        }
        .empty-state i {
          font-size: 64px;
          margin-bottom: 16px;
          opacity: 0.5;
        }
        @media (max-width: 991px) {
          .patient-chat-container {
            flex-direction: column;
            height: auto;
          }
          .chat-list-sidebar {
            width: 100%;
            max-height: 400px;
          }
        }
      `}</style>
      <div className="page-wrapper chat-page-wrapper patient-chat-wrapper">
        <div className="container">
          <div className="content doctor-content">
            <div className="patient-chat-container">
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
                  {filteredConversations.length === 0 ? (
                    <div className="empty-state">
                      <i className="fa-solid fa-comments"></i>
                      <p>No conversations found</p>
                      <small>Book an appointment to start chatting with your doctor</small>
                    </div>
                  ) : (
                    filteredConversations.map((conversation) => {
                      const doctorName = conversation.doctor?.fullName || conversation.doctor?.userId?.fullName || 'Unknown Doctor'
                      const doctorImage = conversation.doctor?.profileImage || conversation.doctor?.userId?.profileImage || '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
                      const isActive = selectedConversation?.appointmentId === conversation.appointmentId
                      
                      return (
                        <div
                          key={conversation._id}
                          className={`chat-item ${isActive ? 'active' : ''}`}
                          onClick={() => handleSelectConversation(conversation)}
                        >
                          <div className="chat-item-avatar">
                            <img src={doctorImage} alt={doctorName} />
                          </div>
                          <div className="chat-item-content">
                            <div className="chat-item-header">
                              <h5 className="chat-item-name">{doctorName}</h5>
                              <div className="chat-item-time">
                                <small>{formatTime(conversation.lastMessageAt)}</small>
                                {conversation.unreadCount > 0 && (
                                  <div className="chat-item-icons">
                                    <span className="unread-badge">{conversation.unreadCount}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="chat-item-message">
                              Appointment: {formatDate(conversation.appointment?.appointmentDate)}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Right Area - Chat Details */}
              <div className="chat-details-area">
                {!selectedConversation ? (
                  <div className="empty-state">
                    <i className="fa-solid fa-comments"></i>
                    <p>Select a conversation to start chatting</p>
                  </div>
                ) : (
                  <>
                    <div className="chat-details-header">
                      <div className="chat-details-user">
                        <div className="chat-details-avatar">
                          <img 
                            src={selectedConversation.doctor?.profileImage || selectedConversation.doctor?.userId?.profileImage || '/assets/img/doctors-dashboard/doctor-profile-img.jpg'} 
                            alt={selectedConversation.doctor?.fullName || selectedConversation.doctor?.userId?.fullName} 
                          />
                        </div>
                        <div className="chat-details-user-info">
                          <h5>{selectedConversation.doctor?.fullName || selectedConversation.doctor?.userId?.fullName || 'Unknown Doctor'}</h5>
                          <small>Online</small>
                        </div>
                      </div>
                    </div>

                    <div className="chat-messages-area">
                      {messagesLoading ? (
                        <div className="text-center py-5">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading messages...</span>
                          </div>
                        </div>
                      ) : groupedMessages.length === 0 ? (
                        <div className="empty-state">
                          <i className="fa-solid fa-comment-dots"></i>
                          <p>No messages yet</p>
                          <small>Start the conversation by sending a message</small>
                        </div>
                      ) : (
                        <>
                          {groupedMessages.map((item, index) => {
                            if (item.type === 'date') {
                              return (
                                <div key={`date-${index}`} className="chat-date-separator">
                                  <span>{item.formattedDate}</span>
                                </div>
                              )
                            }

                            const message = item
                            
                            // Determine if message is from patient (outgoing) or doctor (incoming)
                            // Handle both object and string formats for senderId
                            const senderId = typeof message.senderId === 'object' 
                              ? (message.senderId._id || message.senderId) 
                              : message.senderId
                            
                            const currentUserId = typeof user?._id === 'object' 
                              ? (user._id._id || user._id) 
                              : user?._id
                            
                            // Message is outgoing if sent by current patient user
                            const isOutgoing = String(senderId) === String(currentUserId)
                            
                            // Get sender info
                            const senderName = message.senderId?.fullName || 'Unknown'
                            const senderImage = message.senderId?.profileImage || 
                                              (isOutgoing 
                                                ? (user?.profileImage || '/assets/img/doctors-dashboard/profile-06.jpg')
                                                : (selectedConversation.doctor?.profileImage || 
                                                   selectedConversation.doctor?.userId?.profileImage || 
                                                   '/assets/img/doctors-dashboard/doctor-profile-img.jpg'))

                            return (
                              <div 
                                key={message._id} 
                                className={`chat-message ${isOutgoing ? 'outgoing' : 'incoming'}`}
                                style={{
                                  alignSelf: isOutgoing ? 'flex-end' : 'flex-start',
                                  marginLeft: isOutgoing ? 'auto' : '0',
                                  marginRight: isOutgoing ? '0' : 'auto'
                                }}
                              >
                                <div className="chat-message-avatar">
                                  <img src={senderImage} alt={senderName} />
                                </div>
                                <div className="chat-message-content">
                                  <div className="chat-message-header" style={{ justifyContent: isOutgoing ? 'flex-end' : 'flex-start' }}>
                                    <h6>{isOutgoing ? 'You' : senderName}</h6>
                                    <span>{formatTime(message.createdAt)}</span>
                                  </div>
                                  <div className="chat-message-bubble">
                                    {message.message}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                          <div ref={messagesEndRef} />
                        </>
                      )}
                    </div>

                    <form className="chat-input-area" onSubmit={handleSendMessage}>
                      <input
                        type="text"
                        className="chat-input-field"
                        placeholder="Type your message here..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="chat-send-button"
                        disabled={!newMessage.trim() || sendMessageMutation.isLoading}
                        title="Send"
                      >
                        <i className="fa-solid fa-paper-plane"></i>
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Chat
