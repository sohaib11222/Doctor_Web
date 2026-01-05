import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams, useBeforeUnload } from 'react-router-dom'
import { 
  StreamVideo, 
  StreamCall, 
  CallControls, 
  SpeakerLayout,
  useCallStateHooks,
  ParticipantView
} from '@stream-io/video-react-sdk'
import { useAuth } from '../../contexts/AuthContext'
import { useVideoCall } from '../../hooks/useVideoCall'
import { toast } from 'react-toastify'
import * as videoApi from '../../api/video'

const VideoCallRoom = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const appointmentId = searchParams.get('appointmentId')
  const { user } = useAuth()
  
  const { client, call, loading, error, startCall, endCall } = useVideoCall(appointmentId)
  const [callStarted, setCallStarted] = useState(false)
  const startCallRef = useRef(false) // Use ref to prevent multiple calls
  const [isCallActive, setIsCallActive] = useState(false)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)
  const pendingNavigation = useRef(null)

  useEffect(() => {
    console.log('🔍 [VideoCallRoom] useEffect triggered:', {
      appointmentId,
      hasUser: !!user,
      callStarted,
      loading,
      hasClient: !!client,
      hasCall: !!call,
      startCallRef: startCallRef.current
    })

    // Start call immediately when component mounts (if not already started)
    if (appointmentId && user && !startCallRef.current && !loading) {
      console.log('🚀 [VideoCallRoom] Starting video call...')
      startCallRef.current = true // Set immediately to prevent multiple calls
      setCallStarted(true)
      
      startCall()
        .then(() => {
          console.log('✅ [VideoCallRoom] Video call started successfully')
          toast.success('Video call started')
          setIsCallActive(true)
        })
        .catch((err) => {
          console.error('❌ [VideoCallRoom] Error starting call:', err)
          
          let errorMessage = err.response?.data?.message || err.message || 'Failed to start video call'
          
          // Check if it's a permission error
          if (err.message?.includes('permission') || err.message?.includes('Permission')) {
            errorMessage = err.message
            toast.error(errorMessage, { autoClose: 8000 })
          } else {
            toast.error(errorMessage)
          }
          
          startCallRef.current = false // Reset on error so user can retry
          setCallStarted(false)
        })
    }
  }, [appointmentId, user, loading, startCall])

  const handleEndCall = async () => {
    try {
      setIsCallActive(false)
      if (call) {
        // Get session ID from call metadata or try to find it
        try {
          const sessionData = await videoApi.getVideoSessionByAppointment(appointmentId)
          if (sessionData.data?.sessionId) {
            await videoApi.endVideoSession(sessionData.data.sessionId)
          }
        } catch (err) {
          console.error('Error ending session on backend:', err)
          // Continue even if backend call fails
        }
      }
      await endCall()
      toast.success('Call ended')
      navigate('/patient-appointments')
    } catch (err) {
      toast.error('Error ending call')
      console.error(err)
    }
  }

  // Prevent navigation away from active call
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isCallActive && call) {
        e.preventDefault()
        e.returnValue = 'You have an active call. Are you sure you want to leave?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isCallActive, call])

  // Handle browser back button
  useEffect(() => {
    if (!isCallActive) return

    const handlePopState = (e) => {
      e.preventDefault()
      setShowLeaveConfirm(true)
      pendingNavigation.current = () => {
        window.history.pushState(null, '', window.location.href)
        handleEndCall()
      }
    }

    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isCallActive])

  if (loading) {
    return (
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Initializing video call...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="alert alert-danger">
                <h5>Error</h5>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={() => navigate('/patient-appointments')}>
                  Back to Appointments
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show loading if client/call not ready or still loading
  if (loading || !client || !call) {
    return (
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Preparing video call...</p>
                {!client && <p className="text-muted">Initializing client...</p>}
                {!call && <p className="text-muted">Creating call...</p>}
                {loading && <p className="text-muted">Joining call...</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render video UI once client and call are ready
  console.log('🎥 [VideoCallRoom] Rendering video UI:', { 
    hasClient: !!client, 
    hasCall: !!call, 
    callId: call?.id,
    callState: call?.state
  })

  return (
    <>
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <VideoCallContent 
            onEndCall={handleEndCall} 
            currentUserId={user?._id}
            currentUserRole="PATIENT"
          />
        </StreamCall>
      </StreamVideo>

      {/* Leave confirmation modal */}
      {showLeaveConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <h5 style={{ marginBottom: '15px' }}>End Call?</h5>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              You have an active call. Are you sure you want to end it?
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowLeaveConfirm(false)
                  pendingNavigation.current = null
                  window.history.pushState(null, '', window.location.href)
                }}
              >
                Stay in Call
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  setShowLeaveConfirm(false)
                  handleEndCall()
                }}
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Separate component to use Stream hooks
const VideoCallContent = ({ onEndCall, currentUserId, currentUserRole }) => {
  const { useCallCallingState, useParticipants } = useCallStateHooks()
  const callingState = useCallCallingState()
  const participants = useParticipants()
  
  console.log('📹 [VideoCallContent] Call state:', callingState)
  console.log('👥 [VideoCallContent] Participants:', participants)

  // Don't render if call is not joined
  if (callingState !== 'joined') {
    return (
      <div className="content" style={{ height: '100vh', padding: 0, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
        <div className="text-center text-white">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Joining call... (State: {callingState})</p>
        </div>
      </div>
    )
  }

  // Separate local and remote participants - use multiple methods to ensure we get the right participants
  const localParticipant = participants.find(p => p.isLocalParticipant)
  
  // Filter remote participants - exclude local participant by both isLocalParticipant and userId
  const localUserId = currentUserId || localParticipant?.userId
  const remoteParticipants = participants.filter(p => {
    const isNotLocal = !p.isLocalParticipant
    const isDifferentUser = p.userId !== localUserId
    return isNotLocal && isDifferentUser
  })
  
  // Get unique participants by userId to avoid duplicates
  const uniqueRemoteParticipants = Array.from(
    new Map(remoteParticipants.map(p => [p.userId, p])).values()
  )

  console.log('👥 [VideoCallContent] Participant details:', {
    totalParticipants: participants.length,
    allParticipants: participants.map(p => ({
      userId: p.userId,
      name: p.name,
      isLocalParticipant: p.isLocalParticipant,
      sessionId: p.sessionId,
      publishedTracks: p.publishedTracks
    })),
    localUserId,
    localParticipant: localParticipant ? {
      userId: localParticipant.userId,
      name: localParticipant.name,
      hasVideo: localParticipant.publishedTracks?.includes('video'),
      hasAudio: localParticipant.publishedTracks?.includes('audio'),
      publishedTracks: localParticipant.publishedTracks
    } : null,
    remoteParticipantsCount: remoteParticipants.length,
    uniqueRemoteParticipantsCount: uniqueRemoteParticipants.length,
    remoteParticipants: uniqueRemoteParticipants.map(p => ({
      userId: p.userId,
      name: p.name,
      hasVideo: p.publishedTracks?.includes('video'),
      hasAudio: p.publishedTracks?.includes('audio'),
      publishedTracks: p.publishedTracks
    }))
  })

  return (
    <div className="content" style={{ height: '100vh', padding: 0, margin: 0, overflow: 'hidden', backgroundColor: '#000' }}>
      <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Header with call info */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          zIndex: 20, 
          padding: '15px 20px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px' }}>
            Video Consultation
          </div>
          <div style={{ color: '#fff', fontSize: '14px' }}>
            {localParticipant && uniqueRemoteParticipants.length > 0 ? '2 participants' : '1 participant'}
          </div>
        </div>

        {/* Main video area - 50/50 split */}
        <div style={{ 
          flex: 1, 
          position: 'relative', 
          overflow: 'hidden', 
          width: '100%', 
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          gap: '10px',
          padding: '10px'
        }}>
          {/* Left side - Doctor (remote) - 50% width */}
          <div style={{ 
            width: 'calc(50% - 5px)',
            height: '100%',
            position: 'relative',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            overflow: 'hidden',
            minWidth: 0
          }}>
            {uniqueRemoteParticipants.length > 0 ? (
              <>
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#000'
                }}>
                  <ParticipantView 
                    participant={uniqueRemoteParticipants[0]}
                  />
                  <style>{`
                    div[data-testid*="participant"],
                    div[data-testid*="Participant"] {
                      width: 100% !important;
                      height: 100% !important;
                      display: flex !important;
                      align-items: center !important;
                      justify-content: center !important;
                    }
                    div[data-testid*="participant"] video,
                    div[data-testid*="Participant"] video,
                    video {
                      width: 100% !important;
                      height: 100% !important;
                      object-fit: cover !important;
                    }
                  `}</style>
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  zIndex: 10
                }}>
                  <span style={{ 
                    backgroundColor: '#2196F3', 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%',
                    display: 'inline-block'
                  }}></span>
                  Doctor: {uniqueRemoteParticipants[0].name || uniqueRemoteParticipants[0].userId || 'Doctor'}
                </div>
              </>
            ) : (
              <div style={{ 
                width: '100%',
                height: '100%',
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#fff',
                fontSize: '18px',
                gap: '10px'
              }}>
                <div>Waiting for doctor to join...</div>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  {remoteParticipants.length > 0 ? `${remoteParticipants.length} remote participant(s) found but filtered out` : 'No remote participants'}
                </div>
              </div>
            )}
          </div>

          {/* Right side - Patient (local/You) - 50% width */}
          {localParticipant ? (
            <div style={{ 
              width: 'calc(50% - 5px)',
              height: '100%',
              position: 'relative',
              backgroundColor: '#1a1a1a',
              borderRadius: '8px',
              overflow: 'hidden',
              minWidth: 0
            }}>
              <div style={{ 
                width: '100%', 
                height: '100%', 
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ParticipantView 
                  participant={localParticipant}
                />
                <style>{`
                  div[data-testid*="participant"] {
                    width: 100% !important;
                    height: 100% !important;
                  }
                  div[data-testid*="participant"] video {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                  }
                `}</style>
              </div>
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: '#fff',
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 10
              }}>
                <span style={{ 
                  backgroundColor: '#4CAF50', 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%',
                  display: 'inline-block'
                }}></span>
                Patient: You
              </div>
            </div>
          ) : (
            <div style={{ 
              width: 'calc(50% - 5px)',
              height: '100%',
              position: 'relative',
              backgroundColor: '#1a1a1a',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '18px'
            }}>
              Initializing your video...
            </div>
          )}
        </div>

        {/* Custom Call controls at bottom - moved inside StreamCall context */}
        <CustomCallControlsWrapper onEndCall={onEndCall} />
      </div>
    </div>
  )
}

// Custom call controls wrapper - must be inside StreamCall context
const CustomCallControlsWrapper = ({ onEndCall }) => {
  return <CustomCallControls onEndCall={onEndCall} />
}

// Custom call controls component with icons
const CustomCallControls = ({ onEndCall }) => {
  const { useMicrophoneState, useCameraState } = useCallStateHooks()
  const micState = useMicrophoneState()
  const cameraState = useCameraState()

  const toggleMic = async () => {
    if (micState.microphone.enabled) {
      await micState.microphone.disable()
    } else {
      await micState.microphone.enable()
    }
  }

  const toggleCamera = async () => {
    if (cameraState.camera.enabled) {
      await cameraState.camera.disable()
    } else {
      await cameraState.camera.enable()
    }
  }

  return (
    <div style={{ 
      position: 'absolute', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      zIndex: 20, 
      padding: '20px',
      background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{ 
        backgroundColor: 'rgba(0,0,0,0.7)', 
        borderRadius: '50px',
        padding: '12px 20px',
        display: 'flex',
        gap: '15px',
        alignItems: 'center'
      }}>
        {/* Microphone Toggle */}
        <button
          onClick={toggleMic}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: micState.microphone.enabled ? '#4CAF50' : '#dc3545',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            transition: 'all 0.3s'
          }}
          title={micState.microphone.enabled ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {micState.microphone.enabled ? (
            <i className="fa fa-microphone" style={{ fontSize: '20px' }}></i>
          ) : (
            <i className="fa fa-microphone-slash" style={{ fontSize: '20px' }}></i>
          )}
        </button>

        {/* Camera Toggle */}
        <button
          onClick={toggleCamera}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: cameraState.camera.enabled ? '#4CAF50' : '#dc3545',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            transition: 'all 0.3s'
          }}
          title={cameraState.camera.enabled ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {cameraState.camera.enabled ? (
            <i className="fa fa-video" style={{ fontSize: '20px' }}></i>
          ) : (
            <i className="fa fa-video-slash" style={{ fontSize: '20px' }}></i>
          )}
        </button>

        {/* End Call */}
        <button
          onClick={onEndCall}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#dc3545',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            transition: 'all 0.3s'
          }}
          title="End Call"
        >
          <i className="fa fa-phone" style={{ fontSize: '20px', transform: 'rotate(135deg)' }}></i>
        </button>
      </div>
    </div>
  )
}

export default VideoCallRoom
