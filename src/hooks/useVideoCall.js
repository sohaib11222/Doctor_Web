import { useState, useCallback, useEffect } from 'react'
import { StreamVideoClient, Call } from '@stream-io/video-react-sdk'
import { useAuth } from '../contexts/AuthContext'
import * as videoApi from '../api/video'

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY || '3cp572t2hewb'

export const useVideoCall = (appointmentId) => {
  const { user } = useAuth()
  const [client, setClient] = useState(null)
  const [call, setCall] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Initialize Stream client and call
  const initializeCall = useCallback(async () => {
    if (!appointmentId || !user) return

    setLoading(true)
    setError(null)

    try {
      // Get session data from backend (includes token and call ID)
      const sessionData = await videoApi.getVideoSessionByAppointment(appointmentId)
      console.log('✅ [FRONTEND] getVideoSessionByAppointment response:', sessionData)
      
      // Handle response structure (axios interceptor returns response.data)
      const responseData = sessionData?.data || sessionData
      const streamToken = responseData?.streamToken
      const streamCallId = responseData?.streamCallId || responseData?.sessionId || `appointment-${appointmentId}`
      
      if (!streamToken) {
        console.error('❌ [FRONTEND] No Stream token in response:', responseData)
        throw new Error('No Stream token received from backend')
      }

      // Create Stream client
      const streamClient = new StreamVideoClient({
        apiKey: STREAM_API_KEY,
        user: {
          id: user._id,
          name: user.fullName || user.email,
        },
        token: streamToken,
      })

      setClient(streamClient)

      // Get or create call
      const streamCall = streamClient.call('default', streamCallId)
      setCall(streamCall)

      return { streamClient, streamCall }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to initialize video call'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [appointmentId, user])

  // Request camera and microphone permissions
  const requestMediaPermissions = async () => {
    try {
      console.log('🎥 [FRONTEND] Requesting camera and microphone permissions...')
      
      // Check if MediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API is not supported in this browser')
      }

      // Request both camera and microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach(track => track.stop())
      
      console.log('✅ [FRONTEND] Camera and microphone permissions granted')
      return true
    } catch (err) {
      console.error('❌ [FRONTEND] Permission request failed:', err)
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        throw new Error('Camera and microphone permissions are required for video calls. Please allow access in your browser settings.')
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        throw new Error('No camera or microphone found. Please connect a camera and microphone to use video calls.')
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        throw new Error('Camera or microphone is already in use by another application. Please close other applications using your camera/microphone.')
      } else {
        throw new Error(`Failed to access camera/microphone: ${err.message}`)
      }
    }
  }

  // Start video call
  const startCall = useCallback(async () => {
    if (!appointmentId || !user) {
      console.error('❌ [FRONTEND] Missing appointmentId or user:', { appointmentId, user: !!user })
      return
    }

    console.log('🚀 [FRONTEND] Starting video call...')
    console.log('📋 [FRONTEND] Appointment ID:', appointmentId)
    console.log('👤 [FRONTEND] User:', user._id, user.fullName || user.email)
    console.log('🔑 [FRONTEND] Stream API Key:', STREAM_API_KEY ? `${STREAM_API_KEY.substring(0, 4)}...` : 'MISSING')

    setLoading(true)
    setError(null)

    try {
      // Request camera and microphone permissions first
      await requestMediaPermissions()
      console.log('📡 [FRONTEND] Calling backend API: /api/video/start')
      // Start session on backend
      const sessionData = await videoApi.startVideoSession(appointmentId)
      console.log('✅ [FRONTEND] Backend response received:', sessionData)
      console.log('✅ [FRONTEND] Response structure:', {
        success: sessionData?.success,
        hasData: !!sessionData?.data,
        dataKeys: sessionData?.data ? Object.keys(sessionData.data) : [],
        fullResponse: JSON.stringify(sessionData, null, 2)
      })

      // Handle different response structures
      const responseData = sessionData?.data || sessionData
      
      if (!responseData) {
        console.error('❌ [FRONTEND] No data in response:', sessionData)
        throw new Error('Invalid response from backend: no data received')
      }

      const streamToken = responseData.streamToken
      const streamCallId = responseData.streamCallId || responseData.sessionId || `appointment-${appointmentId}`

      if (!streamToken) {
        console.error('❌ [FRONTEND] No Stream token received from backend')
        console.error('❌ [FRONTEND] Response data:', responseData)
        throw new Error('No Stream token received from backend. Please check backend logs.')
      }

      if (!streamCallId) {
        console.warn('⚠️ [FRONTEND] No Stream call ID received, using appointment ID')
        // Use appointment ID as fallback
        const fallbackCallId = `appointment-${appointmentId}`
        console.log('ℹ️ [FRONTEND] Using fallback call ID:', fallbackCallId)
      }

      console.log('🔧 [FRONTEND] Creating Stream client...')
      // Create Stream client
      const streamClient = new StreamVideoClient({
        apiKey: STREAM_API_KEY,
        user: {
          id: user._id,
          name: user.fullName || user.email,
        },
        token: streamToken,
      })
      console.log('✅ [FRONTEND] Stream client created')

      setClient(streamClient)

      console.log('📞 [FRONTEND] Getting Stream call:', streamCallId)
      // Get or create call
      const streamCall = streamClient.call('default', streamCallId)
      console.log('📞 [FRONTEND] Joining Stream call...')
      await streamCall.join({ create: true })
      console.log('✅ [FRONTEND] Joined Stream call successfully')
      
      // Enable camera and microphone after joining
      try {
        console.log('🎥 [FRONTEND] Enabling camera and microphone...')
        await streamCall.camera.enable()
        await streamCall.microphone.enable()
        console.log('✅ [FRONTEND] Camera and microphone enabled')
      } catch (err) {
        console.warn('⚠️ [FRONTEND] Could not enable camera/microphone:', err)
        // Don't throw - user might have denied permissions, but call can still continue
      }
      
      setCall(streamCall)

      return { streamClient, streamCall }
    } catch (err) {
      console.error('❌ [FRONTEND] Error starting video call:', err)
      console.error('❌ [FRONTEND] Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      })
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to start video call'
      console.error('❌ [FRONTEND] Error message:', errorMessage)
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [appointmentId, user])

  // End video call
  const endCall = useCallback(async () => {
    if (call) {
      try {
        await call.leave()
      } catch (err) {
        console.error('Error leaving call:', err)
      }
    }

    if (client) {
      try {
        await client.disconnectUser()
      } catch (err) {
        console.error('Error disconnecting client:', err)
      }
    }

    setCall(null)
    setClient(null)
  }, [call, client])

  // Cleanup on unmount - only when component is actually unmounting
  useEffect(() => {
    // Store refs to avoid stale closures
    const currentCall = call
    const currentClient = client
    
    return () => {
      // Only cleanup on actual unmount, not on every render
      console.log('🧹 [useVideoCall] Cleanup: Component unmounting')
      if (currentCall) {
        currentCall.leave().catch((err) => {
          // Ignore "already left" errors during cleanup
          if (!err.message?.includes('already been left') && !err.message?.includes('already left')) {
            console.error('Error leaving call during cleanup:', err)
          }
        })
      }
      if (currentClient) {
        // Don't disconnect client immediately - let it handle cleanup
        // currentClient.disconnectUser().catch((err) => {
        //   console.error('Error disconnecting client during cleanup:', err)
        // })
      }
    }
  }, []) // Empty deps - only run on mount/unmount

  return {
    client,
    call,
    loading,
    error,
    initializeCall,
    startCall,
    endCall,
  }
}

