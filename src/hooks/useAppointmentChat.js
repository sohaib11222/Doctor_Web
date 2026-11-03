import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import * as chatApi from '../api/chat'

const idOf = (value) => {
  if (!value) return ''
  return typeof value === 'object' ? value._id || value.id || '' : value
}

const unwrap = (response) => response?.data?.data ?? response?.data ?? response

/**
 * Creates/reuses the canonical appointment conversation before navigation.
 * This mirrors the Veterinary flow: an appointment action never lands on a
 * chat page that still has to guess whether it should create a conversation.
 */
export const useAppointmentChat = (route) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [openingAppointmentId, setOpeningAppointmentId] = useState('')

  const openAppointmentChat = useCallback(async (appointment) => {
    const appointmentId = idOf(appointment?._id) || idOf(appointment?.appointmentId)
    const doctorId = idOf(appointment?.doctorId)
    const patientId = idOf(appointment?.patientId)
    const currentUserId = idOf(user)
    const role = String(user?.role || '').toUpperCase()

    if (!appointmentId || !doctorId || !patientId) {
      throw new Error('This appointment does not contain enough information to open chat.')
    }
    if (!['DOCTOR', 'PATIENT'].includes(role)) {
      throw new Error('Only the appointment doctor or patient can open this chat.')
    }

    setOpeningAppointmentId(String(appointmentId))
    try {
      const response = role === 'DOCTOR'
        ? await chatApi.startConversationWithPatient(currentUserId, patientId, appointmentId)
        : await chatApi.startConversationWithDoctor(doctorId, appointmentId, currentUserId)
      const conversation = unwrap(response)
      const conversationId = idOf(conversation)
      if (!conversationId) throw new Error('The appointment chat could not be prepared.')

      const params = new URLSearchParams({
        conversationId: String(conversationId),
        appointmentId: String(appointmentId),
        doctorId: String(doctorId),
        patientId: String(patientId),
      })
      navigate(`${route}?${params.toString()}`, { state: { chatReady: true } })
      return conversation
    } catch (error) {
      // A completed chat is immutable but must stay readable.  The API rightly
      // refuses to reopen it as an active conversation; reuse its history
      // instead of leaving the patient or doctor at a failed appointment link.
      const isCompletedConflict = error?.response?.status === 409 &&
        /completed/i.test(error?.response?.data?.message || error?.message || '')
      if (!isCompletedConflict) throw error

      const history = unwrap(await chatApi.getConversations({ limit: 100 }))
      const completedConversation = (history?.conversations || []).find((item) =>
        idOf(item?.doctorId) === String(doctorId) &&
        idOf(item?.patientId) === String(patientId) &&
        idOf(item?.appointmentId) === String(appointmentId) &&
        item?.status === 'COMPLETED'
      )
      const completedConversationId = idOf(completedConversation)
      if (!completedConversationId) throw error

      const params = new URLSearchParams({
        conversationId: String(completedConversationId),
        appointmentId: String(appointmentId),
        doctorId: String(doctorId),
        patientId: String(patientId),
      })
      navigate(`${route}?${params.toString()}`, { state: { chatReady: true } })
      return completedConversation
    } finally {
      setOpeningAppointmentId('')
    }
  }, [navigate, route, user])

  return {
    openAppointmentChat,
    openingAppointmentId,
    isOpening: (appointmentId) => String(openingAppointmentId) === String(appointmentId || ''),
  }
}

