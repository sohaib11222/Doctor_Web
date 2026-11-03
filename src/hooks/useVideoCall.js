import { useCallback, useEffect, useRef, useState } from 'react'
import { StreamVideoClient } from '@stream-io/video-react-sdk'

import { useAuth } from '../contexts/AuthContext'
import * as videoApi from '../api/video'

const FALLBACK_STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY
const MEDIA_PERMISSION_TIMEOUT_MS = 12_000
const STREAM_PREPARE_TIMEOUT_MS = 15_000
const STREAM_JOIN_TIMEOUT_MS = 20_000
const STREAM_JOIN_RETRY_DELAY_MS = 750
const STREAM_JOIN_ATTEMPTS = 4

// The API client already unwraps the HTTP response. Responses can still be
// shaped as { data: { ... } } depending on the endpoint, so normalise once.
const responseData = (response) => response?.data?.data ?? response?.data ?? response
const userIdFrom = (value) => String(value?._id || value?.id || value || '').trim()
const delay = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))

const within = (promise, timeoutMs, message) => new Promise((resolve, reject) => {
  const timer = window.setTimeout(() => reject(new Error(message)), timeoutMs)
  Promise.resolve(promise).then(
    (value) => { window.clearTimeout(timer); resolve(value) },
    (error) => { window.clearTimeout(timer); reject(error) },
  )
})

/**
 * Shared video-call hook for both doctors and patients.
 *
 * The backend owns the ringing state machine (RINGING / ACTIVE / ENDED /
 * DECLINED / MISSED). Stream is only used to carry the media once a session is
 * ACTIVE, so both participants always join the same call id that the server
 * created.
 */
export const useVideoCall = (appointmentId) => {
  const { user } = useAuth()
  const [client, setClient] = useState(null)
  const [call, setCall] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const clientRef = useRef(null)
  const callRef = useRef(null)

  const requestMediaPermissions = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Camera and microphone are not supported in this browser')
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      stream.getTracks().forEach((track) => track.stop())
    } catch (err) {
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        throw new Error('Camera and microphone permissions are required. Please allow access in your browser settings.')
      }
      if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
        throw new Error('No camera or microphone was found. Please connect one and try again.')
      }
      throw new Error(`Failed to access camera/microphone: ${err?.message || 'Unknown error'}`)
    }
  }, [])

  const getConnectionDetails = useCallback((payload) => {
    const session = payload?.session || payload || {}
    const streamApiKey = payload?.streamApiKey || FALLBACK_STREAM_API_KEY
    const streamToken = payload?.streamToken
    const streamCallId = payload?.streamCallId || session?.sessionId || session?.callId
    const currentUserId = userIdFrom(user?._id || user?.id)
    const memberIds = [...new Set((payload?.streamMembers || [session?.doctorId, session?.patientId])
      .map(userIdFrom)
      .filter(Boolean))]

    if (!streamApiKey || !streamToken || !streamCallId || !currentUserId) {
      throw new Error('The video-call connection details are incomplete')
    }

    return { streamApiKey, streamToken, streamCallId, currentUserId, memberIds }
  }, [user])

  const createStreamResources = useCallback((payload) => {
    const details = getConnectionDetails(payload)
    const streamClient = new StreamVideoClient({
      apiKey: details.streamApiKey,
      user: {
        id: details.currentUserId,
        name: user?.fullName || user?.name || user?.email || 'User',
      },
      token: details.streamToken,
    })
    return {
      ...details,
      streamClient,
      streamCall: streamClient.call('default', details.streamCallId),
    }
  }, [getConnectionDetails, user])

  const prepareOutgoingCall = useCallback(async (payload) => {
    const details = getConnectionDetails(payload)
    const resources = createStreamResources(payload)
    try {
      // Deliberately not a join. This creates exactly one private call and
      // declares both appointment users as members while the receiver is still
      // on the ringing screen. The temporary client disconnects immediately;
      // both users join fresh authenticated clients once the call is ACTIVE.
      const data = resources.memberIds.length > 0
        ? { data: { members: resources.memberIds.map((id) => ({ user_id: id })) } }
        : undefined
      await within(
        resources.streamCall.getOrCreate(data),
        STREAM_PREPARE_TIMEOUT_MS,
        'The video service did not prepare the shared call in time. Please try again.',
      )
      return { streamCallId: details.streamCallId }
    } finally {
      await resources.streamClient.disconnectUser().catch(() => {})
    }
  }, [createStreamResources, getConnectionDetails])

  const joinStreamCall = useCallback(async (payload) => {
    let resources = createStreamResources(payload)

    try {
      await within(
        requestMediaPermissions(),
        MEDIA_PERMISSION_TIMEOUT_MS,
        'Camera and microphone access timed out. Check the browser permission prompt and try again.',
      )

      let lastJoinError = null
      for (let attempt = 0; attempt < STREAM_JOIN_ATTEMPTS; attempt += 1) {
        try {
          await within(
            // The caller already created the call with both members. The
            // receiver joins that same call without being able to replace it.
            resources.streamCall.join({ create: false }),
            STREAM_JOIN_TIMEOUT_MS,
            'The video service did not connect in time. Please check your connection and try again.',
          )
          lastJoinError = null
          break
        } catch (joinError) {
          lastJoinError = joinError
          await resources.streamClient.disconnectUser().catch(() => {})

          if (attempt < STREAM_JOIN_ATTEMPTS - 1) {
            await delay(STREAM_JOIN_RETRY_DELAY_MS)
            resources = createStreamResources(payload)
          }
        }
      }
      if (lastJoinError) throw lastJoinError

      await Promise.allSettled([resources.streamCall.camera.enable(), resources.streamCall.microphone.enable()])

      clientRef.current = resources.streamClient
      callRef.current = resources.streamCall
      setClient(resources.streamClient)
      setCall(resources.streamCall)
      return resources
    } catch (err) {
      await resources.streamClient.disconnectUser().catch(() => {})
      throw err
    }
  }, [createStreamResources, requestMediaPermissions])

  /** Start ringing the other participant. */
  const startCall = useCallback(async () => {
    if (!appointmentId || !user) return null
    setLoading(true)
    setError(null)
    try {
      return responseData(await videoApi.startVideoSession(appointmentId))
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to start video call'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [appointmentId, user])

  /** Read the latest session (used to poll for acceptance). */
  const getSession = useCallback(async ({ silent = false } = {}) => {
    if (!appointmentId || !user) return null
    try {
      return responseData(await videoApi.getVideoSessionByAppointment(appointmentId))
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to load video call'
      if (!silent) setError(message)
      throw err
    }
  }, [appointmentId, user])

  /** Join Stream once the server has marked the session ACTIVE. */
  const joinActiveCall = useCallback(async (knownPayload = null) => {
    setLoading(true)
    setError(null)
    try {
      const payload = knownPayload?.streamToken ? knownPayload : await getSession()
      const activeSession = payload?.session || knownPayload?.session || payload
      if (activeSession?.status !== 'ACTIVE') {
        throw new Error('The other participant has not accepted the call yet')
      }
      return await joinStreamCall({ ...payload, session: activeSession })
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to join video call'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [getSession, joinStreamCall])

  const endCall = useCallback(async () => {
    const currentCall = callRef.current
    const currentClient = clientRef.current
    callRef.current = null
    clientRef.current = null
    setCall(null)
    setClient(null)
    await currentCall?.leave().catch(() => {})
    await currentClient?.disconnectUser().catch(() => {})
  }, [])

  useEffect(() => () => {
    const activeCall = callRef.current
    const activeClient = clientRef.current
    callRef.current = null
    clientRef.current = null
    activeCall?.leave().catch(() => {})
    activeClient?.disconnectUser().catch(() => {})
  }, [])

  return { client, call, loading, error, startCall, getSession, prepareOutgoingCall, joinActiveCall, endCall }
}
