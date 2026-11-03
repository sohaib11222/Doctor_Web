import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import * as videoApi from '../../api/video'
import { useAuth } from '../../contexts/AuthContext'

const payloadData = (response) => response?.data?.data ?? response?.data ?? response

const ROUTE_BY_ROLE = {
  DOCTOR: '/doctor/video-call',
  PATIENT: '/video-call',
}

const BACK_PATH_BY_ROLE = {
  DOCTOR: '/appointments',
  PATIENT: '/patient-appointments',
}

const IncomingCallNotifier = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [incoming, setIncoming] = useState(null)
  const [answering, setAnswering] = useState(false)
  const [declining, setDeclining] = useState(false)
  const soundCleanupRef = useRef(null)
  const role = String(user?.role || '').toUpperCase()

  useEffect(() => {
    if (!['DOCTOR', 'PATIENT'].includes(role)) return undefined
    let disposed = false
    const refresh = async () => {
      try {
        const payload = payloadData(await videoApi.getIncomingVideoSessions())
        const sessions = Array.isArray(payload?.sessions) ? payload.sessions : []
        if (!disposed) setIncoming(sessions[0] || null)
      } catch {
        // A temporary polling issue must never block the dashboard.
      }
    }
    refresh()
    const timer = window.setInterval(refresh, 2000)
    return () => {
      disposed = true
      window.clearInterval(timer)
    }
  }, [role])

  useEffect(() => {
    soundCleanupRef.current?.()
    soundCleanupRef.current = incoming ? startRingtone() : null
    return () => soundCleanupRef.current?.()
  }, [incoming?._id])

  const answer = async () => {
    if (!incoming?._id) return
    setAnswering(true)
    try {
      const acceptedPayload = payloadData(await videoApi.acceptVideoSession(incoming._id))
      const appointmentId = incoming.appointmentId?._id || incoming.appointmentId
      const route = ROUTE_BY_ROLE[role] || '/video-call'
      setIncoming(null)
      navigate(`${route}?appointmentId=${appointmentId}&mode=answer`, {
        state: { videoCall: acceptedPayload },
      })
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Unable to accept the call')
      setIncoming(null)
    } finally {
      setAnswering(false)
    }
  }

  const decline = async () => {
    if (!incoming?._id) return
    setDeclining(true)
    try {
      await videoApi.endVideoSession(incoming._id)
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Unable to decline the call')
    } finally {
      setIncoming(null)
      setDeclining(false)
    }
  }

  if (!incoming) return null
  const callerName = incoming.caller?.name || 'Someone'
  const appointment = incoming.appointmentId || {}

  return (
    <div style={overlayStyle} role="alertdialog" aria-modal="true" aria-label="Incoming video call">
      <div style={cardStyle}>
        <div style={pulseStyle}><i className="fa-solid fa-phone" /></div>
        <div style={{ fontSize: 13, letterSpacing: '.08em', color: '#79909a', fontWeight: 700 }}>Incoming video call</div>
        <h3 style={{ margin: '9px 0 6px' }}>{callerName}</h3>
        <p style={{ color: '#60717c', margin: 0 }}>
          {appointment.appointmentNumber ? `${appointment.appointmentNumber} · ` : ''}Incoming call for your appointment
        </p>
        <div style={actionsStyle}>
          <button type="button" onClick={decline} disabled={declining || answering} style={{ ...roundButtonStyle, background: '#ea4d57' }}>
            <i className="fa-solid fa-phone-slash" /><span>Decline</span>
          </button>
          <button type="button" onClick={answer} disabled={declining || answering} style={{ ...roundButtonStyle, background: '#20b358' }}>
            <i className="fa-solid fa-phone" /><span>{answering ? 'Connecting...' : 'Accept'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

const startRingtone = () => {
  if (typeof window === 'undefined') return () => {}
  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return () => {}
  const context = new AudioContext()
  let stopped = false
  let timer

  const ring = () => {
    if (stopped) return
    context.resume().catch(() => {})
    const pulseDelays = [0, 0.22]
    pulseDelays.forEach((delay, index) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = index ? 520 : 440
      gain.gain.setValueAtTime(0.0001, context.currentTime + delay)
      gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + delay + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + delay + 0.18)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(context.currentTime + delay)
      oscillator.stop(context.currentTime + delay + 0.2)
    })
  }
  ring()
  timer = window.setInterval(ring, 1200)
  return () => {
    stopped = true
    window.clearInterval(timer)
    context.close().catch(() => {})
  }
}

const overlayStyle = { position: 'fixed', inset: 0, zIndex: 12000, display: 'grid', placeItems: 'center', padding: 16, background: 'rgba(7, 27, 37, .45)', backdropFilter: 'blur(3px)' }
const cardStyle = { width: 'min(390px, 100%)', textAlign: 'center', background: '#fff', borderRadius: 28, padding: '30px 22px 26px', boxShadow: '0 24px 80px rgba(0,0,0,.28)' }
const pulseStyle = { width: 70, height: 70, borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto 18px', color: '#fff', background: '#20b358', fontSize: 28, boxShadow: '0 0 0 12px rgba(32,179,88,.15)' }
const actionsStyle = { display: 'flex', justifyContent: 'space-evenly', gap: 22, marginTop: 28 }
const roundButtonStyle = { width: 104, minHeight: 78, border: 0, borderRadius: 18, color: '#fff', display: 'grid', placeItems: 'center', gap: 4, fontWeight: 700, cursor: 'pointer', fontSize: 14 }

export default IncomingCallNotifier
