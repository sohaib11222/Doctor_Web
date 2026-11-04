import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { StreamCall, StreamTheme, StreamVideo } from '@stream-io/video-react-sdk'

import * as videoApi from '../../api/video'
import { useVideoCall } from '../../hooks/useVideoCall'
import MedicalVideoCall from './MedicalVideoCall'

const ACCEPTANCE_POLL_INTERVAL_MS = 1_000
const MAX_CONSECUTIVE_SESSION_ERRORS = 3

const delay = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))

const sessionFromPayload = (payload, fallbackStatus) => {
  if (!payload) return null
  const source = payload.session && typeof payload.session === 'object' ? payload.session : {}
  const sessionId = source._id || source.id || payload.sessionId
  const streamCallId = source.sessionId || source.callId || payload.streamCallId
  const status = source.status || payload.status || fallbackStatus

  if (!sessionId && !streamCallId) return null
  return {
    ...source,
    _id: sessionId,
    sessionId: streamCallId,
    callId: source.callId || streamCallId,
    status: status ? String(status).toUpperCase() : null,
  }
}

const AppointmentVideoCallRoom = ({ backPath, localRole, remoteRole }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const appointmentId = searchParams.get('appointmentId')
  const mode = searchParams.get('mode') === 'answer' ? 'answer' : 'caller'
  const {
    client,
    call,
    loading,
    error,
    startCall,
    getSession,
    prepareOutgoingCall,
    joinActiveCall,
    endCall,
  } = useVideoCall(appointmentId)
  const [session, setSession] = useState(null)
  const acceptedSessionPayloadRef = useRef(
    mode === 'answer' ? location.state?.videoCall || null : null
  )
  const [setupError, setSetupError] = useState(null)
  const callerStartRef = useRef(null)
  const joinRef = useRef(false)

  useEffect(() => {
    if (!appointmentId) return undefined
    let cancelled = false

    const getCallerStartPayload = () => {
      // React Strict Mode temporarily mounts, cleans up, and mounts this
      // component again in development. Both passes must use one backend
      // start request so only one appointment session/call ID is created.
      if (callerStartRef.current?.appointmentId !== appointmentId) {
        callerStartRef.current = {
          appointmentId,
          promise: startCall(),
        }
      }
      return callerStartRef.current.promise
    }

    const applySessionPayload = (payload, fallbackStatus = null) => {
      if (cancelled) return null
      const nextSession = sessionFromPayload(payload, fallbackStatus)
      if (!nextSession) {
        throw new Error('Video call session is not available')
      }

      acceptedSessionPayloadRef.current = payload
      if (!cancelled) setSession(nextSession)
      return nextSession
    }

    const joinAcceptedCall = async (payload) => {
      if (joinRef.current || cancelled) return
      joinRef.current = true
      try {
        await joinActiveCall(payload)
      } catch (joinError) {
        joinRef.current = false
        throw joinError
      }
    }

    const waitForAcceptanceAndJoin = async (initialPayload) => {
      let payload = initialPayload
      let currentSession = applySessionPayload(payload, 'RINGING')
      let consecutiveErrors = 0

      while (!cancelled) {
        if (currentSession.status === 'ACTIVE') {
          await joinAcceptedCall(payload)
          return
        }
        if (['DECLINED', 'MISSED', 'ENDED'].includes(currentSession.status)) return

        await delay(ACCEPTANCE_POLL_INTERVAL_MS)
        if (cancelled) return

        try {
          payload = await getSession({ silent: true })
          currentSession = applySessionPayload(payload, currentSession.status)
          consecutiveErrors = 0
        } catch (pollError) {
          consecutiveErrors += 1
          if (consecutiveErrors >= MAX_CONSECUTIVE_SESSION_ERRORS) throw pollError
        }
      }
    }

    const prepare = async () => {
      try {
        let payload
        try {
          payload = mode === 'caller'
            ? await getCallerStartPayload()
            : acceptedSessionPayloadRef.current || await getSession()
        } catch (startError) {
          // An existing ACTIVE session must never be silently reset. A page
          // refresh or a second device simply rejoins the same protected call.
          const message = startError?.response?.data?.message || startError?.message || ''
          if (mode !== 'caller' || !/already active/i.test(message)) throw startError
          payload = await getSession({ silent: true })
        }
        if (cancelled) return
        const nextSession = applySessionPayload(payload, mode === 'caller' ? 'RINGING' : null)
        if (!nextSession || cancelled) return

        // The receiver gets the ACTIVE response from /video/accept and joins
        // immediately. The caller instead waits for that exact server-side
        // transition and then joins from the same payload.
        if (mode === 'caller') {
          if (nextSession.status === 'ACTIVE') {
            await joinAcceptedCall(payload)
          } else if (nextSession.status === 'RINGING') {
            await prepareOutgoingCall(payload)
            if (cancelled) return
            await waitForAcceptanceAndJoin(payload)
          }
        } else if (nextSession.status === 'ACTIVE') {
          await joinAcceptedCall(payload)
        }
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || 'Unable to start video call'
        if (!cancelled) setSetupError(message)
      }
    }
    prepare()
    return () => {
      cancelled = true
    }
  }, [appointmentId, getSession, joinActiveCall, mode, prepareOutgoingCall, startCall])

  useEffect(() => {
    if (!['DECLINED', 'MISSED', 'ENDED'].includes(session?.status)) return
    endCall()
  }, [endCall, session?.status])

  const leave = async () => {
    try {
      if (session?._id) await videoApi.endVideoSession(session._id)
    } catch (err) {
      toast.warning(err?.response?.data?.message || err?.message || 'Unable to end call')
    }
    await endCall()
    navigate(backPath)
  }

  if (!appointmentId) {
    return (
      <div className="content" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 420, width: '100%', textAlign: 'center', background: '#fff', borderRadius: 24, padding: '40px 30px', boxShadow: '0 20px 60px rgba(34, 72, 130, 0.16)' }}>
          <h4>Missing appointment</h4>
          <p style={{ color: '#68717d', margin: '12px 0 22px' }}>An appointment ID is required to start a video call.</p>
          <button className="btn btn-primary rounded-pill px-4" onClick={() => navigate(backPath)}>Back</button>
        </div>
      </div>
    )
  }

  if (setupError || error) {
    return (
      <div className="content" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 420, width: '100%', textAlign: 'center', background: '#fff', borderRadius: 24, padding: '40px 30px', boxShadow: '0 20px 60px rgba(34, 72, 130, 0.16)' }}>
          <h4>Unable to start call</h4>
          <p style={{ color: '#68717d', margin: '12px 0 22px' }}>{setupError || error}</p>
          <button className="btn btn-primary rounded-pill px-4" onClick={() => navigate(backPath)}>Back</button>
        </div>
      </div>
    )
  }

  if (client && call) {
    return (
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <StreamTheme className="str-video__theme-dark">
            <MedicalVideoCall
              onEndCall={leave}
              localRole={localRole}
              remoteRole={remoteRole}
            />
          </StreamTheme>
        </StreamCall>
      </StreamVideo>
    )
  }

  const isRinging = session?.status === 'RINGING'
  const isJoining = session?.status === 'ACTIVE'
  const ended = ['DECLINED', 'MISSED', 'ENDED'].includes(session?.status)
  const missingRingingSupport = session && !session.status
  if (missingRingingSupport) {
    return (
      <div className="content" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 420, width: '100%', textAlign: 'center', background: '#fff', borderRadius: 24, padding: '40px 30px', boxShadow: '0 20px 60px rgba(34, 72, 130, 0.16)' }}>
          <h4>Update required</h4>
          <p style={{ color: '#68717d', margin: '12px 0 22px' }}>This video call requires a backend update to support ringing.</p>
          <button className="btn btn-primary rounded-pill px-4" onClick={() => navigate(backPath)}>Back</button>
        </div>
      </div>
    )
  }
  if (ended) {
    return (
      <div className="content" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 420, width: '100%', textAlign: 'center', background: '#fff', borderRadius: 24, padding: '40px 30px', boxShadow: '0 20px 60px rgba(34, 72, 130, 0.16)' }}>
          <h4>Call ended</h4>
          <p style={{ color: '#68717d', margin: '12px 0 22px' }}>The video call has ended.</p>
          <button className="btn btn-primary rounded-pill px-4" onClick={() => navigate(backPath)}>Back</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #f3f7ff, #ffffff)', padding: 24 }}>
      <div style={{ maxWidth: 420, width: '100%', textAlign: 'center', background: '#fff', borderRadius: 24, padding: '40px 30px', boxShadow: '0 20px 60px rgba(34, 72, 130, 0.16)' }}>
        <div className="spinner-border text-primary mb-3" role="status"><span className="visually-hidden">Loading...</span></div>
        <h4 style={{ marginBottom: 8 }}>
          {isRinging ? `Calling ${remoteRole}...` : isJoining ? 'Joining call...' : 'Starting call...'}
        </h4>
        <p style={{ color: '#68717d', marginBottom: 22 }}>
          {isRinging ? `Waiting for ${remoteRole.toLowerCase()} to answer...` : isJoining ? 'Connecting securely...' : 'Creating call...'}
        </p>
        <button className="btn btn-danger rounded-pill px-4" onClick={leave} disabled={loading}>Cancel</button>
      </div>
    </div>
  )
}

export default AppointmentVideoCallRoom
