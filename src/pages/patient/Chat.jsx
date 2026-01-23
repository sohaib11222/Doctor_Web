import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as chatApi from '../../api/chat'
import * as appointmentApi from '../../api/appointments'
import { useUploadChatFile } from '../../mutations/uploadMutations'
import { normalizeImageUrl } from '../../utils/imageUtils'

const Chat = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const fileInputRef = useRef(null)

  // Get doctorId and appointmentId from URL params (if coming from appointment page)
  const doctorIdFromUrl = searchParams.get('doctorId')
  const appointmentIdFromUrl = searchParams.get('appointmentId')

  // Fetch patient's appointments to get conversations with long polling
  const { data: appointmentsData, isLoading: appointmentsLoading, refetch: refetchAppointments } = useQuery({
    queryKey: ['patientAppointments'],
    queryFn: () => appointmentApi.listAppointments({ status: 'CONFIRMED', limit: 100 }),
    enabled: !!user,
    refetchInterval: 5000, // Poll every 5 seconds for new conversations
    refetchIntervalInBackground: true
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

  // Fetch messages for selected conversation with long polling
  const { data: messagesData, isLoading: messagesLoading, refetch: refetchMessages } = useQuery({
    queryKey: ['patientConversationMessages', selectedConversation?.conversationId],
    queryFn: () => {
      if (!selectedConversation?.conversationId) return null
      return chatApi.getMessages(selectedConversation.conversationId)
    },
    enabled: !!selectedConversation?.conversationId,
    refetchInterval: 2000, // Poll every 2 seconds for real-time updates
    refetchIntervalInBackground: true // Continue polling even when tab is in background
  })

  // Extract messages
  const messages = useMemo(() => {
    if (!messagesData) return []
    const responseData = messagesData.data || messagesData
    return Array.isArray(responseData) ? responseData : (responseData.messages || [])
  }, [messagesData])

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

  // Upload chat file mutation
  const uploadChatFileMutation = useUploadChatFile()

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, attachments = null }) => {
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
        message: message ? message.substring(0, 50) + '...' : null,
        attachments: attachments?.length || 0
      })
      
      return await chatApi.sendMessageToDoctor(doctorIdStr, appointmentIdStr, message || null, attachments, patientIdStr)
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

  // Handle file selection
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate file sizes (50MB max)
    const maxSize = 50 * 1024 * 1024
    const oversizedFiles = files.filter(file => file.size > maxSize)
    if (oversizedFiles.length > 0) {
      toast.error(`Some files are too large. Maximum size is 50MB.`)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    setUploadingFiles(true)
    const uploadedAttachments = []

    try {
      // Upload files one by one
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)

        try {
          const uploadResponse = await uploadChatFileMutation.mutateAsync(formData)
          const fileUrl = uploadResponse.data?.url || uploadResponse.url
          
          if (fileUrl) {
            // Determine file type
            const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''
            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(fileExtension)
            
            uploadedAttachments.push({
              type: isImage ? 'image' : 'file',
              url: fileUrl,
              name: file.name,
              size: file.size
            })
          }
        } catch (uploadError) {
          console.error('Error uploading file:', uploadError)
          toast.error(`Failed to upload ${file.name}`)
        }
      }

      if (uploadedAttachments.length > 0) {
        // Send message with attachments
        sendMessageMutation.mutate({ 
          message: newMessage.trim() || null,
          attachments: uploadedAttachments 
        })
        setSelectedFiles([])
        setNewMessage('')
      }
    } catch (error) {
      console.error('Error handling files:', error)
      toast.error('Failed to upload files')
    } finally {
      setUploadingFiles(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Handle send message
  const handleSendMessage = (e) => {
    e.preventDefault()
    
    if (!selectedConversation) {
      toast.error('Please select a conversation first')
      return
    }
    
    if (!newMessage.trim() && selectedFiles.length === 0) {
      toast.error('Please enter a message or select a file')
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
    
    // If files are selected, upload them first
    if (selectedFiles.length > 0) {
      handleFileSelect({ target: { files: selectedFiles } })
    } else {
      sendMessageMutation.mutate({ message: newMessage.trim() })
    }
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
          position: relative;
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
          height: 100%;
        }
        .chat-list-header {
          padding: 12px;
          border-bottom: 1px solid #e5e5e5;
          flex-shrink: 0;
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
          height: 100%;
        }
        .chat-details-header {
          padding: 15px;
          border-bottom: 1px solid #e5e5e5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          background: #fff;
          z-index: 10;
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
          position: sticky;
          bottom: 0;
          z-index: 10;
        }
        .chat-attach-button {
          flex-shrink: 0;
        }
        .chat-attach-button i {
          display: block !important;
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
            position: relative;
            height: auto;
          }
          .chat-details-area {
            margin-left: 0;
            position: relative;
            height: auto;
            max-height: none;
            margin-top: 24px;
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
                  <div className="d-flex align-items-center mb-2">
                    <Link 
                      to="/patient/dashboard" 
                      className="btn btn-sm btn-outline-secondary me-2"
                      style={{ minWidth: '40px', padding: '4px 8px' }}
                      title="Back to Dashboard"
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </Link>
                    <h4 className="mb-0">All Chats</h4>
                  </div>
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

                    <div className="chat-messages-area" ref={messagesContainerRef}>
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
                                    {message.message && <div style={{ marginBottom: message.attachments?.length > 0 ? '12px' : '0' }}>{message.message}</div>}
                                    
                                    {/* Display attachments */}
                                    {message.attachments && message.attachments.length > 0 && (
                                      <div className="chat-attachments" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: message.message ? '8px' : '0' }}>
                                        {message.attachments.map((attachment, attIndex) => {
                                          const fileUrl = normalizeImageUrl(attachment.url) || attachment.url
                                          const isImage = attachment.type === 'image' || 
                                                         ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(
                                                           attachment.url?.split('.').pop()?.toLowerCase() || ''
                                                         )
                                          
                                          return (
                                            <div key={attIndex} className="chat-attachment-item" style={{ 
                                              maxWidth: '100%',
                                              borderRadius: '8px',
                                              overflow: 'hidden',
                                              border: '1px solid #e0e0e0'
                                            }}>
                                              {isImage ? (
                                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                                                  <img 
                                                    src={fileUrl} 
                                                    alt={attachment.name || 'Attachment'} 
                                                    style={{ 
                                                      maxWidth: '100%', 
                                                      maxHeight: '300px', 
                                                      objectFit: 'contain',
                                                      display: 'block'
                                                    }}
                                                    onError={(e) => {
                                                      e.target.style.display = 'none'
                                                      e.target.nextSibling.style.display = 'flex'
                                                    }}
                                                  />
                                                  <div style={{ display: 'none', padding: '12px', backgroundColor: '#f5f5f5', alignItems: 'center', gap: '8px' }}>
                                                    <i className="fa-solid fa-image" style={{ fontSize: '20px', color: '#999' }}></i>
                                                    <span style={{ fontSize: '12px', color: '#666' }}>Image preview unavailable</span>
                                                  </div>
                                                </a>
                                              ) : (
                                                <a 
                                                  href={fileUrl} 
                                                  target="_blank" 
                                                  rel="noopener noreferrer"
                                                  style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '12px', 
                                                    padding: '12px',
                                                    backgroundColor: '#f5f5f5',
                                                    textDecoration: 'none',
                                                    color: '#333'
                                                  }}
                                                >
                                                  <i className="fa-solid fa-file" style={{ fontSize: '24px', color: '#2196F3' }}></i>
                                                  <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '14px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                      {attachment.name || 'File'}
                                                    </div>
                                                    {attachment.size && (
                                                      <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                                                        {(attachment.size / 1024 / 1024).toFixed(2)} MB
                                                      </div>
                                                    )}
                                                  </div>
                                                  <i className="fa-solid fa-download" style={{ color: '#2196F3' }}></i>
                                                </a>
                                              )}
                                            </div>
                                          )
                                        })}
                                      </div>
                                    )}
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
                        ref={fileInputRef}
                        type="file"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                        accept="*/*"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="chat-attach-button"
                        style={{
                          width: '40px',
                          height: '40px',
                          minWidth: '40px',
                          border: 'none',
                          background: 'transparent',
                          borderRadius: '50%',
                          color: '#666',
                          cursor: uploadingFiles ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          flexShrink: 0,
                          opacity: uploadingFiles ? 0.5 : 1,
                          transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!uploadingFiles) {
                            e.target.style.color = '#2196F3'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!uploadingFiles) {
                            e.target.style.color = '#666'
                          }
                        }}
                        title="Attach file"
                        disabled={uploadingFiles}
                      >
                        <i className="fa-solid fa-paperclip" style={{ display: 'block' }}></i>
                      </button>
                      <input
                        type="text"
                        className="chat-input-field"
                        placeholder="Type your message here..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={uploadingFiles}
                      />
                      <button
                        type="submit"
                        className="chat-send-button"
                        disabled={(!newMessage.trim() && selectedFiles.length === 0) || sendMessageMutation.isLoading || uploadingFiles}
                        title="Send"
                      >
                        {uploadingFiles ? (
                          <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Uploading...</span>
                          </div>
                        ) : (
                          <i className="fa-solid fa-paper-plane"></i>
                        )}
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
