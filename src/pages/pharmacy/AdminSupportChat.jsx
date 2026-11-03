import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as chatApi from '../../api/chat'
import { useAuth } from '../../contexts/AuthContext'

const unwrap = (response) => { const outer = response?.data ?? response; return outer?.data ?? outer }

const AdminSupportChat = () => {
  const { user } = useAuth()
  const client = useQueryClient()
  const [message, setMessage] = useState('')
  const endRef = useRef(null)
  const conversationQuery = useQuery({ queryKey: ['admin-support-conversation'], queryFn: () => chatApi.getOrCreateAdminSupportConversation(), enabled: Boolean(user?._id || user?.id) })
  const conversation = unwrap(conversationQuery.data)
  const messagesQuery = useQuery({ queryKey: ['admin-support-messages', conversation?._id], queryFn: () => chatApi.getMessages(conversation._id, { limit: 100 }), enabled: Boolean(conversation?._id), refetchInterval: 2500, refetchIntervalInBackground: true })
  const messages = useMemo(() => unwrap(messagesQuery.data)?.messages || [], [messagesQuery.data])
  const sendMutation = useMutation({ mutationFn: () => chatApi.sendAdminSupportMessage(conversation._id, message.trim()), onSuccess: () => { setMessage(''); client.invalidateQueries({ queryKey: ['admin-support-messages', conversation._id] }); client.invalidateQueries({ queryKey: ['chat-unread-count'] }) }, onError: (error) => toast.error(error.response?.data?.message || error.message || 'Message could not be sent') })
  // Opening a thread and receiving a new message while it remains open are
  // both explicit reads. Keep the sidebar count accurate without a refresh.
  useEffect(() => {
    if (!conversation?._id) return
    chatApi.markMessagesAsRead(conversation._id)
      .then(() => client.invalidateQueries({ queryKey: ['chat-unread-count'] }))
      .catch(() => {})
  }, [client, conversation?._id, messages.length])
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'nearest' }) }, [messages])
  const submit = (event) => { event.preventDefault(); if (message.trim()) sendMutation.mutate() }
  return <div className="card" style={{ minHeight: 560 }}><div className="card-header d-flex align-items-center gap-2"><span className="avatar avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"><i className="fa-solid fa-headset" /></span><div><h4 className="card-title mb-0">Admin Support</h4><small className="text-muted">Secure direct communication with My Doctor administration</small></div></div><div className="card-body d-flex flex-column p-0" style={{ minHeight: 0 }}><div className="flex-grow-1 overflow-auto p-3" style={{ minHeight: 360, background: '#f8fafc' }}>{messagesQuery.isLoading ? <div className="text-center py-5"><span className="spinner-border spinner-border-sm" /></div> : messages.length ? messages.map((entry) => { const own = String(entry.senderId?._id || entry.senderId) === String(user?._id); return <div className={`d-flex mb-3 ${own ? 'justify-content-end' : 'justify-content-start'}`} key={entry._id}><div className={own ? 'bg-primary text-white rounded-3 p-3' : 'bg-white border rounded-3 p-3'} style={{ maxWidth: '78%' }}><div>{entry.message}</div><small className={own ? 'text-white-50' : 'text-muted'}>{new Date(entry.createdAt).toLocaleString()}</small></div></div> }) : <div className="text-center text-muted py-5">Send a message to start your support conversation.</div>}<span ref={endRef} /></div><form className="border-top p-3 d-flex gap-2" onSubmit={submit}><input className="form-control" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write to Admin…" /><button className="btn btn-primary" disabled={sendMutation.isPending || !message.trim()}>{sendMutation.isPending ? 'Sending…' : 'Send'}</button></form></div></div>
}

export default AdminSupportChat
