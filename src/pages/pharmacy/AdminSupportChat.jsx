import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as chatApi from '../../api/chat'
import { useAuth } from '../../contexts/AuthContext'
import { normalizeImageUrl } from '../../utils/imageUtils'

const unwrap = (response) => { const outer = response?.data ?? response; return outer?.data ?? outer }
const isImage = (item) => item?.type === 'image' || String(item?.mimeType || '').startsWith('image/') || /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(String(item?.url || ''))
const fileName = (item) => item?.name || String(item?.url || '').split('/').pop() || 'Attachment'
const errorText = (error) => error?.response?.data?.errors?.[0]?.message || error?.response?.data?.message || error?.message || 'Message could not be sent.'

const MessageAttachments = ({ attachments = [], own }) => attachments.length ? <div className="d-flex flex-column gap-2 mt-2">{attachments.map((item, index) => {
  const href = normalizeImageUrl(item.url)
  return <a key={`${item.url}-${index}`} href={href} target="_blank" rel="noreferrer" className={`text-decoration-none rounded border p-2 d-flex align-items-center gap-2 ${own ? 'border-light text-white' : 'bg-white text-dark'}`} download={!isImage(item) ? fileName(item) : undefined}>
    {isImage(item) ? <img src={href} alt={fileName(item)} style={{ width: 54, height: 42, objectFit: 'cover' }} className="rounded" /> : <i className="fa-solid fa-file-arrow-down fs-5" />}
    <span className="text-truncate flex-grow-1">{fileName(item)}</span><i className="fa-solid fa-download" />
  </a>
})}</div> : null

const AdminSupportChat = () => {
  const { user } = useAuth(); const client = useQueryClient(); const endRef = useRef(null); const inputRef = useRef(null)
  const [message, setMessage] = useState(''); const [files, setFiles] = useState([]); const [uploading, setUploading] = useState(false)
  const conversationQuery = useQuery({ queryKey: ['admin-support-conversation'], queryFn: () => chatApi.getOrCreateAdminSupportConversation(), enabled: Boolean(user?._id || user?.id), refetchOnWindowFocus: true })
  const conversation = unwrap(conversationQuery.data)
  const messagesQuery = useQuery({ queryKey: ['admin-support-messages', conversation?._id], queryFn: () => chatApi.getMessages(conversation._id, { limit: 100 }), enabled: Boolean(conversation?._id), refetchInterval: 2500, refetchIntervalInBackground: true })
  const messages = useMemo(() => { const list = unwrap(messagesQuery.data)?.messages; return Array.isArray(list) ? list : [] }, [messagesQuery.data])
  const refresh = () => { client.invalidateQueries({ queryKey: ['admin-support-messages', conversation?._id] }); client.invalidateQueries({ queryKey: ['admin-support-conversation'] }); client.invalidateQueries({ queryKey: ['chat-unread-count'] }) }
  const sendMutation = useMutation({ mutationFn: async () => {
    setUploading(Boolean(files.length))
    try {
      const attachments = await Promise.all(files.map(async (file) => {
        const uploaded = await chatApi.uploadChatFile(file)
        if (!uploaded?.url) throw new Error(`Could not upload ${file.name}`)
        return { type: file.type.startsWith('image/') ? 'image' : 'file', url: uploaded.url, name: file.name, size: file.size, mimeType: file.type }
      }))
      return chatApi.sendAdminSupportMessage(conversation._id, message.trim(), attachments)
    } finally { setUploading(false) }
  }, onSuccess: () => { setMessage(''); setFiles([]); if (inputRef.current) inputRef.current.value = ''; refresh() }, onError: (error) => toast.error(errorText(error)) })
  useEffect(() => { if (!conversation?._id) return; chatApi.markMessagesAsRead(conversation._id).then(() => client.invalidateQueries({ queryKey: ['chat-unread-count'] })).catch(() => {}) }, [client, conversation?._id, messages.length])
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'nearest' }) }, [messages.length])
  const selectFiles = (event) => { const chosen = Array.from(event.target.files || []); if (chosen.length + files.length > 10) return toast.error('Attach up to 10 files per message.'); if (chosen.some((file) => file.size > 50 * 1024 * 1024)) return toast.error('Each attachment must be 50 MB or smaller.'); setFiles((current) => [...current, ...chosen]) }
  const submit = (event) => { event.preventDefault(); if (message.trim() || files.length) sendMutation.mutate() }
  if (conversationQuery.isLoading) return <div className="text-center py-5"><span className="spinner-border text-primary" /></div>
  if (conversationQuery.isError || !conversation?._id) return <div className="alert alert-danger">{errorText(conversationQuery.error || new Error('Could not open the Admin Support conversation.'))}</div>
  const busy = sendMutation.isPending || uploading
  return <div className="card overflow-hidden" style={{ minHeight: 590 }}><div className="card-header d-flex align-items-center gap-2"><span className="avatar avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"><i className="fa-solid fa-headset" /></span><div><h4 className="card-title mb-0">Admin Support</h4><small className="text-muted">Secure direct communication with My Doctor administration</small></div></div><div className="card-body d-flex flex-column p-0" style={{ minHeight: 0 }}><div className="flex-grow-1 overflow-auto p-3" style={{ minHeight: 380, background: '#f8fafc', maxHeight: 'calc(100vh - 310px)' }}>{messagesQuery.isLoading ? <div className="text-center py-5"><span className="spinner-border spinner-border-sm" /></div> : messages.length ? messages.map((entry) => { const own = String(entry.senderId?._id || entry.senderId) === String(user?._id || user?.id); return <div className={`d-flex mb-3 ${own ? 'justify-content-end' : 'justify-content-start'}`} key={entry._id}><div className={own ? 'bg-primary text-white rounded-3 p-3' : 'bg-white border rounded-3 p-3'} style={{ maxWidth: '78%', minWidth: 110 }}><div style={{ whiteSpace: 'pre-wrap' }}>{entry.message}</div><MessageAttachments attachments={entry.attachments || []} own={own} /><small className={own ? 'd-block text-white-50 mt-2' : 'd-block text-muted mt-2'}>{new Date(entry.createdAt).toLocaleString()}</small></div></div> }) : <div className="text-center text-muted py-5">Send a message to start your support conversation.</div>}<span ref={endRef} /></div><form className="border-top p-3" onSubmit={submit}><input ref={inputRef} type="file" className="d-none" multiple onChange={selectFiles} /><div className="d-flex gap-2 align-items-center"><button type="button" className="btn btn-light rounded-circle" style={{ width: 42, height: 42 }} disabled={busy} aria-label="Attach files" onClick={() => inputRef.current?.click()}><i className="fa-solid fa-paperclip" /></button><input className="form-control" value={message} onChange={(event) => setMessage(event.target.value)} maxLength="8000" disabled={busy} placeholder="Write to Admin…" /><button className="btn btn-primary rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: 42, height: 42 }} aria-label="Send message" title="Send message" disabled={busy || (!message.trim() && !files.length)}>{busy ? <span className="spinner-border spinner-border-sm" /> : <i className="fa-solid fa-paper-plane" />}</button></div>{files.length > 0 && <div className="d-flex flex-wrap gap-2 mt-2">{files.map((file, index) => <span className="badge bg-light text-dark border" key={`${file.name}-${file.lastModified}`}>{file.name} <button type="button" className="btn-close ms-1" style={{ fontSize: 9 }} aria-label={`Remove ${file.name}`} onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} /></span>)}</div>}</form></div></div>
}
export default AdminSupportChat
