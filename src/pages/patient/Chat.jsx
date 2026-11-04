import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import '../../styles/chat-workspace.css'
import { useAuth } from '../../contexts/AuthContext'
import * as chatApi from '../../api/chat'
import * as appointmentApi from '../../api/appointments'
import { useUploadChatFile } from '../../mutations/uploadMutations'
import { normalizeImageUrl } from '../../utils/imageUtils'
import { formatCurrency } from '../../utils/currency'
import { useLanguage } from '../../contexts/LanguageContext'

const Chat = () => {
  const { translateText: tr, formatDate: formatLocalizedDate } = useLanguage()
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
  const conversationIdFromUrl = searchParams.get('conversationId')
  const doctorIdFromUrl = searchParams.get('doctorId')
  const appointmentIdFromUrl = searchParams.get('appointmentId')

  // Fetch real conversations from the backend (patient has access to /chat/conversations)
  const { data: conversationsData, isLoading: conversationsLoading, refetch: refetchConversations } = useQuery({
    queryKey: ['patientConversations'],
    queryFn: () => chatApi.getConversations({ page: 1, limit: 100 }),
    enabled: !!user,
    refetchInterval: 5000,
    refetchIntervalInBackground: true
  })

  // Extract real conversations (mergedInto: null, one per doctor-patient relationship)
  const realConversations = useMemo(() => {
    if (!conversationsData) return []
    const responseData = conversationsData.data || conversationsData
    const list = Array.isArray(responseData) ? responseData : (responseData.conversations || [])
    return list.map(conv => ({
      _id: conv._id,
      conversationId: conv._id,
      doctorId: conv.doctorId?._id || conv.doctorId,
      patientId: conv.patientId?._id || conv.patientId,
      appointmentId: conv.appointmentId?._id || conv.appointmentId,
      doctor: conv.doctorId,
      patient: conv.patientId,
      appointment: conv.appointmentId,
      status: conv.status || 'ACTIVE',
      lastMessageAt: conv.lastMessageAt,
      lastMessage: conv.lastMessage,
      unreadCount: conv.unreadCount || 0,
      source: 'backend'
    }))
  }, [conversationsData])

  // Fetch confirmed appointments to merge with conversations (appointments lacking a chat)
  const { data: appointmentsData, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['patientAppointmentsForChat'],
    queryFn: () => appointmentApi.listAppointments({ status: 'CONFIRMED', limit: 100 }),
    enabled: !!user
  })

  const appointments = useMemo(() => {
    if (!appointmentsData) return []
    const responseData = appointmentsData.data || appointmentsData
    return Array.isArray(responseData) ? responseData : (responseData.appointments || [])
  }, [appointmentsData])

  // Build merged conversation list: real conversations first, then confirmed
  // appointments that don't yet have a conversation.
  const mergedConversations = useMemo(() => {
    const byAppointment = new Map()
    realConversations.forEach(conv => {
      if (conv.appointmentId) byAppointment.set(String(conv.appointmentId), conv)
    })

    const merged = [...realConversations]

    appointments.forEach(apt => {
      const aptId = String(apt._id)
      if (!byAppointment.has(aptId)) {
        merged.push({
          _id: `apt-${aptId}`,
          conversationId: null,
          doctorId: apt.doctorId?._id || apt.doctorId,
          patientId: user?._id,
          appointmentId: aptId,
          doctor: apt.doctorId,
          patient: null,
          appointment: apt,
          status: 'SCHEDULED',
          lastMessageAt: null,
          lastMessage: null,
          unreadCount: 0,
          source: 'appointment'
        })
      }
    })

    return merged.sort((a, b) => {
      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0
      return bTime - aTime
    })
  }, [realConversations, appointments, user])

  // Fetch messages for selected conversation with long polling
  const { data: messagesData, isLoading: messagesLoading, refetch: refetchMessages } = useQuery({
    queryKey: ['patientConversationMessages', selectedConversation?.conversationId],
    queryFn: () => {
      if (!selectedConversation?.conversationId) return null
      return chatApi.getMessages(selectedConversation.conversationId)
    },
    enabled: !!selectedConversation?.conversationId,
    refetchInterval: 2000,
    refetchIntervalInBackground: true
  })

  // Extract messages
  const messages = useMemo(() => {
    if (!messagesData) return []
    const responseData = messagesData.data || messagesData
    return Array.isArray(responseData) ? responseData : (responseData.messages || [])
  }, [messagesData])

  // Conversation status (from getMessages response)
  const conversationStatus = useMemo(() => {
    if (!messagesData) return selectedConversation?.status || 'ACTIVE'
    const responseData = messagesData.data || messagesData
    return responseData.conversation?.status || selectedConversation?.status || 'ACTIVE'
  }, [messagesData, selectedConversation])

  const isCompleted = conversationStatus === 'COMPLETED'

  // Group messages by date for display
  const groupedMessages = useMemo(() => {
    const groups = []
    messages.forEach((message, index) => {
      const messageDate = message.createdAt ? formatLocalizedDate(message.createdAt) : null
      const prevDate = index > 0 ? (messages[index - 1].createdAt ? formatLocalizedDate(messages[index - 1].createdAt) : null) : null
      if (messageDate && messageDate !== prevDate) {
        groups.push({ type: 'date', formattedDate: messageDate })
      }
      groups.push(message)
    })
    return groups
  }, [messages])

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    } else if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // A detail page may already have prepared the canonical conversation. Select
  // that exact history first so navigation never creates a duplicate chat.
  useEffect(() => {
    if (!conversationIdFromUrl) return
    const conversation = realConversations.find((item) => String(item.conversationId) === String(conversationIdFromUrl))
    if (!conversation) return
    setSelectedConversation({ ...conversation, conversationId: conversation.conversationId })
    if (conversation.unreadCount > 0) {
      chatApi.markMessagesAsRead(conversation.conversationId).catch(() => {})
    }
  }, [conversationIdFromUrl, realConversations])

  // Backward-compatible route support for older appointment links.
  useEffect(() => {
    if (!conversationIdFromUrl && appointmentIdFromUrl && doctorIdFromUrl && mergedConversations.length > 0) {
      const conversation = mergedConversations.find(conv => String(conv.appointmentId) === String(appointmentIdFromUrl))
      if (conversation) {
        handleSelectConversation(conversation)
      }
    }
  }, [conversationIdFromUrl, appointmentIdFromUrl, doctorIdFromUrl, mergedConversations])

  // Handle selecting a conversation
  const handleSelectConversation = async (conversation) => {
    if (!user) {
      toast.error(tr('Please login to start a conversation'))
      return
    }

    // If this is a real backend conversation, select it directly.
    // If it's an appointment without a conversation, create one via the backend.
    if (conversation.conversationId) {
      setSelectedConversation({
        ...conversation,
        conversationId: conversation.conversationId
      })
      if (conversation._id) {
        try {
          await chatApi.markMessagesAsRead(conversation._id)
        } catch {
          // Ignore read errors
        }
      }
      return
    }

    // Appointment without a conversation yet: create one.
    try {
      const conversationData = await chatApi.startConversationWithDoctor(
        conversation.doctorId,
        conversation.appointmentId,
        user._id
      )

      const actualConversation = conversationData.data || conversationData

      setSelectedConversation({
        ...conversation,
        conversationId: actualConversation._id,
        ...actualConversation
      })

      if (actualConversation._id) {
        await chatApi.markMessagesAsRead(actualConversation._id)
      }
      refetchConversations()
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to start conversation'
      toast.error(tr(errorMessage))
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

      if (isCompleted) {
        throw new Error('This chat has been marked as completed. No further messages can be sent.')
      }

      const doctorId = typeof selectedConversation.doctorId === 'object'
        ? selectedConversation.doctorId._id || selectedConversation.doctorId
        : selectedConversation.doctorId

      const appointmentId = typeof selectedConversation.appointmentId === 'object'
        ? selectedConversation.appointmentId._id || selectedConversation.appointmentId
        : selectedConversation.appointmentId

      const patientId = typeof user._id === 'object' ? user._id._id || user._id : user._id

      const doctorIdStr = String(doctorId)
      const appointmentIdStr = String(appointmentId)
      const patientIdStr = String(patientId)

      if (!doctorIdStr || !appointmentIdStr || !patientIdStr) {
        throw new Error('Doctor ID, Appointment ID, or Patient ID missing')
      }

      return await chatApi.sendMessageToDoctor(doctorIdStr, appointmentIdStr, message || null, attachments, patientIdStr)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['patientConversationMessages', selectedConversation?._id])
      setNewMessage('')
      setTimeout(() => scrollToBottom(), 100)
      refetchConversations()
    },
    onError: (error) => {
      console.error('Send message error:', error)
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to send message'

      if (error.response?.status === 400) {
        const validationErrors = error.response?.data?.errors || error.response?.data?.error
        if (validationErrors) {
          console.error('Validation errors:', validationErrors)
          toast.error(`${tr('Validation error')}: ${typeof validationErrors === 'string' ? tr(validationErrors) : JSON.stringify(validationErrors)}`)
        } else {
          toast.error(tr(errorMessage))
        }
      } else {
        toast.error(tr(errorMessage))
      }
    }
  })

  const canSend = !isCompleted && !!selectedConversation

  // Handle file selection
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const maxSize = 50 * 1024 * 1024
    const oversizedFiles = files.filter(file => file.size > maxSize)
    if (oversizedFiles.length > 0) {
      toast.error(tr('Some files are too large. Maximum size is 50MB.'))
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    setUploadingFiles(true)
    const uploadedAttachments = []

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)

        try {
          const uploadResponse = await uploadChatFileMutation.mutateAsync(formData)
          const fileUrl = uploadResponse.data?.url || uploadResponse.url

          if (fileUrl) {
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
          toast.error(`${tr('Failed to upload')} ${file.name}`)
        }
      }

      if (uploadedAttachments.length > 0) {
        sendMessageMutation.mutate({
          message: newMessage.trim() || null,
          attachments: uploadedAttachments
        })
        setSelectedFiles([])
        setNewMessage('')
      }
    } finally {
      setUploadingFiles(false)
    }
  }

  // Handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if ((!newMessage.trim() && selectedFiles.length === 0) || !selectedConversation || isCompleted) {
      if (isCompleted) {
        toast.error(tr('This chat has been completed. No further messages can be sent.'))
      }
      return
    }

    if (selectedFiles.length > 0) {
      handleFileSelect({ target: { files: selectedFiles } })
    } else {
      sendMessageMutation.mutate({ message: newMessage.trim() })
    }
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
    return formatLocalizedDate(date)
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return formatLocalizedDate(date, { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const filteredConversations = mergedConversations.filter(conv => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const doctorName = (conv.doctor?.fullName || '').toLowerCase()
    const appointmentNumber = (conv.appointment?.appointmentNumber || '').toLowerCase()
    return doctorName.includes(query) || appointmentNumber.includes(query)
  })

  const doctorName = (conv) => conv.doctor?.fullName || conv.doctor?.userId?.fullName || 'Unknown Doctor'
  const doctorImage = (conv) => conv.doctor?.profileImage || conv.doctor?.userId?.profileImage || '/assets/img/doctors-dashboard/doctor-profile-img.jpg'

  if (conversationsLoading || appointmentsLoading) {
    return (
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
                <p className="mt-3">Loading conversations...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="content patient-chat-page">
      <div className="container">
        <div className="row">
          {/* Left Area - Conversation List */}
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            <div className="card chat-list-card h-100">
              <div className="card-body p-0">
                <div className="chat-list-header">
                  <div className="d-flex align-items-center mb-2">
                    <Link to="/patient/dashboard" className="btn btn-sm btn-outline-secondary me-2" style={{ minWidth: '40px', padding: '4px 8px' }}>
                      <i className="fa-solid fa-chevron-left"></i>
                    </Link>
                    <h4 className="mb-0">All Chats</h4>
                  </div>
                  <div className="chat-search-box">
                    <span className="form-control-feedback"><i className="fa-solid fa-magnifying-glass"></i></span>
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
                      const isActive = selectedConversation?.conversationId === conversation.conversationId ||
                        (selectedConversation?.appointmentId === conversation.appointmentId && !conversation.conversationId)
                      const statusBadge = conversation.status === 'COMPLETED'
                        ? 'bg-success'
                        : conversation.status === 'SCHEDULED'
                          ? 'bg-warning text-dark'
                          : 'bg-info text-dark'

                      return (
                        <div
                          key={conversation._id || `apt-${conversation.appointmentId}`}
                          className={`chat-item ${isActive ? 'active' : ''}`}
                          onClick={() => handleSelectConversation(conversation)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="chat-item-avatar">
                            <img src={doctorImage(conversation)} alt={doctorName(conversation)} />
                          </div>
                          <div className="chat-item-content">
                            <div className="chat-item-header">
                              <div className="d-flex justify-content-between align-items-start">
                                <h5 className="chat-item-name">{doctorName(conversation)}</h5>
                                <span className={`badge ${statusBadge} ms-2`}>{conversation.status}</span>
                              </div>
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
                              {conversation.lastMessage?.message || `Appointment: ${formatDate(conversation.appointment?.appointmentDate)}`}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Area - Chat Details */}
          <div className="col-lg-8 col-xl-9">
            <div className="card chat-details-card h-100">
              <div className="card-body p-0 d-flex flex-column">
                {!selectedConversation ? (
                  <div className="empty-state flex-fill">
                    <i className="fa-solid fa-comments"></i>
                    <p>Select a conversation to start chatting</p>
                  </div>
                ) : (
                  <>
                    <div className="chat-details-header p-3 border-bottom">
                      <div className="chat-details-user d-flex align-items-center">
                        <div className="chat-details-avatar me-3">
                          <img
                            src={doctorImage(selectedConversation)}
                            alt={doctorName(selectedConversation)}
                          />
                        </div>
                        <div className="chat-details-user-info">
                          <h5 className="mb-1">{doctorName(selectedConversation)}</h5>
                          <small className={`text-${isCompleted ? 'success' : 'muted'}`}>
                            {isCompleted ? 'Chat completed' : 'Online'}
                          </small>
                        </div>
                      </div>
                      {isCompleted && (
                        <div className="mt-2">
                          <span className="badge bg-success">Completed by doctor</span>
                        </div>
                      )}
                    </div>

                    <div className="chat-messages-area flex-fill overflow-y-auto" ref={messagesContainerRef}>
                      {messagesLoading ? (
                        <div className="text-center py-5">
                          <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading messages...</span></div>
                          <p className="mt-3">Loading messages...</p>
                        </div>
                      ) : groupedMessages.length === 0 ? (
                        <div className="empty-state flex-fill">
                          <i className="fa-solid fa-comment-dots"></i>
                          <p>No messages yet</p>
                          <small>{isCompleted ? 'This chat has been completed.' : 'Start the conversation by sending a message'}</small>
                        </div>
                      ) : (
                        <>
                          {groupedMessages.map((item, index) => {
                            if (item.type === 'date') {
                              return (
                                <div key={`date-${index}`} className="chat-date-separator text-center my-3">
                                  <span>{item.formattedDate}</span>
                                </div>
                              )
                            }

                            const message = item
                            const senderId = typeof message.senderId === 'object'
                              ? (message.senderId._id || message.senderId)
                              : message.senderId
                            const currentUserId = typeof user?._id === 'object'
                              ? (user._id._id || user._id)
                              : user?._id
                            const isOutgoing = String(senderId) === String(currentUserId)
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
                                    {message.attachments && message.attachments.length > 0 && (
                                      <div className="chat-attachments" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: message.message ? '8px' : '0' }}>
                                        {message.attachments.map((attachment, attIndex) => {
                                          const fileUrl = normalizeImageUrl(attachment.url) || attachment.url
                                          const isImage = attachment.type === 'image' ||
                                            ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(
                                              attachment.url?.split('.').pop()?.toLowerCase() || ''
                                            )
                                          return (
                                            <div key={attIndex} className="chat-attachment-item" style={{ maxWidth: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                                              {isImage ? (
                                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                                                  <img src={fileUrl} alt={attachment.name || 'Attachment'} style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', display: 'block' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                                                  <div style={{ display: 'none', padding: '12px', backgroundColor: '#f5f5f5', alignItems: 'center', gap: '8px' }}>
                                                    <i className="fa-solid fa-image" style={{ fontSize: '20px', color: '#999' }}></i>
                                                    <span style={{ fontSize: '12px', color: '#666' }}>Image preview unavailable</span>
                                                  </div>
                                                </a>
                                              ) : (
                                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f5f5f5', textDecoration: 'none', color: '#333' }}>
                                                  <i className="fa-solid fa-file" style={{ fontSize: '24px', color: '#2196F3' }}></i>
                                                  <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '14px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{attachment.name || 'File'}</div>
                                                    {attachment.size && (
                                                      <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>{(attachment.size / 1024 / 1024).toFixed(2)} MB</div>
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
                      <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} onChange={handleFileSelect} accept="*/*" />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="chat-attach-button"
                        style={{
                          width: '40px', height: '40px', minWidth: '40px', border: 'none',
                          background: 'transparent', borderRadius: '50%', color: '#666',
                          cursor: (uploadingFiles || isCompleted) ? 'not-allowed' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '20px', flexShrink: 0, opacity: (uploadingFiles || isCompleted) ? 0.5 : 1,
                          transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => { if (!(uploadingFiles || isCompleted)) { e.target.style.color = '#2196F3' } }}
                        onMouseLeave={(e) => { if (!(uploadingFiles || isCompleted)) { e.target.style.color = '#666' } }}
                        title="Attach file"
                        disabled={uploadingFiles || isCompleted}
                      >
                        <i className="fa-solid fa-paperclip" style={{ display: 'block' }}></i>
                      </button>
                      <input
                        type="text"
                        className="chat-input-field"
                        placeholder={isCompleted ? 'This chat is completed. No new messages can be sent.' : 'Type your message here...'}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={uploadingFiles || isCompleted}
                      />
                      <button
                        type="submit"
                        className="chat-send-button"
                        disabled={(!newMessage.trim() && selectedFiles.length === 0) || sendMessageMutation.isLoading || uploadingFiles || isCompleted}
                        title="Send"
                      >
                        {uploadingFiles ? (
                          <div className="spinner-border spinner-border-sm" role="status"><span className="visually-hidden">Uploading...</span></div>
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
    </div>
  )
}

export default Chat
