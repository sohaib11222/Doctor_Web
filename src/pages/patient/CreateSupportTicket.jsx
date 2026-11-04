import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import { createSupportTicket, uploadSupportAttachments, unwrapTicketData } from '../../api/supportTickets'
import { useAppointments } from '../../queries/appointmentQueries'
import { usePatientOrders } from '../../queries/orderQueries'
import { usePaymentHistory } from '../../queries/patientQueries'

const categories = ['APPOINTMENT', 'RESCHEDULE', 'VIDEO_CALL', 'PAYMENT', 'PHARMACY_ORDER', 'PARAPHARMACY_ORDER', 'DELIVERY', 'REFUND', 'PRESCRIPTION', 'ACCOUNT_REGISTRATION', 'DOCTOR', 'TECHNICAL', 'OTHER']
const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
const label = (value) => String(value || '').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
const errorText = (error) => error?.response?.data?.errors?.[0]?.message || error?.response?.data?.message || error?.message || 'Unable to create this support ticket.'
const unwrap = (response) => { const outer = response?.data ?? response; return outer?.data ?? outer ?? {} }
const toList = (response, keys) => {
  const data = unwrap(response)
  for (const key of keys) if (Array.isArray(data?.[key])) return data[key]
  return Array.isArray(data) ? data : []
}

const recordText = (record) => {
  const identifier = record?.appointmentNumber || record?.orderNumber || record?.transactionNumber || record?._id || record?.id
  const status = record?.status || record?.paymentStatus || 'Record'
  return `${identifier} — ${label(status)}`
}

const CreateSupportTicket = () => {
  const navigate = useNavigate()
  const fileInput = useRef(null)
  const [form, setForm] = useState({ subject: '', category: 'APPOINTMENT', priority: 'MEDIUM', relatedType: '', relatedRecordId: '', description: '' })
  const [files, setFiles] = useState([])
  const [progress, setProgress] = useState(0)
  const appointmentsQuery = useAppointments({ page: 1, limit: 100 })
  const ordersQuery = usePatientOrders({ page: 1, limit: 100 })
  const paymentsQuery = usePaymentHistory({ page: 1, limit: 100 })
  const appointments = useMemo(() => toList(appointmentsQuery.data, ['appointments', 'items']), [appointmentsQuery.data])
  const orders = useMemo(() => toList(ordersQuery.data, ['orders', 'items']), [ordersQuery.data])
  const payments = useMemo(() => toList(paymentsQuery.data, ['transactions', 'payments', 'items']), [paymentsQuery.data])
  const relatedRecords = form.relatedType === 'APPOINTMENT' ? appointments : form.relatedType === 'ORDER' ? orders : form.relatedType === 'TRANSACTION' ? payments : []
  const create = useMutation({ mutationFn: createSupportTicket })

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value, ...(key === 'relatedType' ? { relatedRecordId: '' } : {}) }))
  const chooseFiles = (event) => {
    const selected = Array.from(event.target.files || [])
    if (selected.length > 5) return toast.error('You can attach up to five files.')
    if (selected.some((file) => file.size > 25 * 1024 * 1024)) return toast.error('Each attachment must be 25 MB or smaller.')
    setFiles(selected)
  }

  const submit = async (event) => {
    event.preventDefault()
    if (form.subject.trim().length < 4 || form.description.trim().length < 10) return toast.error('Add a subject and at least 10 characters describing the issue.')
    if (form.relatedType && !form.relatedRecordId) return toast.error('Choose one of your own records for this ticket.')
    try {
      let attachments = []
      if (files.length) {
        const formData = new FormData()
        files.forEach((file) => formData.append('supportTicket', file, file.name))
        const upload = unwrapTicketData(await uploadSupportAttachments(formData, (event) => {
          if (event.total) setProgress(Math.round((event.loaded / event.total) * 100))
        }))
        attachments = (upload?.attachments || []).map((attachment) => attachment._id)
      }
      const ticket = unwrapTicketData(await create.mutateAsync({
        subject: form.subject.trim(),
        category: form.category,
        priority: form.priority,
        description: form.description.trim(),
        relatedRecord: form.relatedType ? { type: form.relatedType, recordId: form.relatedRecordId } : null,
        attachments,
      }))
      toast.success(`Ticket ${ticket.ticketNumber || ''} was sent to support.`)
      navigate(`/support-tickets/${ticket._id}`)
    } catch (error) {
      toast.error(errorText(error))
    }
  }

  const recordsLoading = form.relatedType === 'APPOINTMENT' ? appointmentsQuery.isLoading : form.relatedType === 'ORDER' ? ordersQuery.isLoading : form.relatedType === 'TRANSACTION' ? paymentsQuery.isLoading : false
  const sending = create.isPending

  return <div className="content"><div className="container-fluid">
    <div className="d-flex align-items-center gap-3 mb-4"><Link to="/support-tickets" className="btn btn-outline-secondary"><i className="fa-solid fa-arrow-left" /></Link><div><h3 className="mb-0">New support ticket</h3><small className="text-muted">Tell us how we can help. We will keep all replies in this ticket.</small></div></div>
    <form onSubmit={submit}><div className="row g-4"><div className="col-xl-8"><div className="card"><div className="card-body"><div className="row g-3">
      <div className="col-12"><label className="form-label">Subject <span className="text-danger">*</span></label><input className="form-control" value={form.subject} maxLength="180" onChange={(event) => update('subject', event.target.value)} placeholder="Briefly describe what you need help with" required /></div>
      <div className="col-md-6"><label className="form-label">Issue category</label><select className="form-select" value={form.category} onChange={(event) => update('category', event.target.value)}>{categories.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></div>
      <div className="col-md-6"><label className="form-label">Priority</label><select className="form-select" value={form.priority} onChange={(event) => update('priority', event.target.value)}>{priorities.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></div>
      <div className="col-md-6"><label className="form-label">Related record <span className="text-muted fw-normal">(optional)</span></label><select className="form-select" value={form.relatedType} onChange={(event) => update('relatedType', event.target.value)}><option value="">No related record</option><option value="APPOINTMENT">Appointment issue</option><option value="ORDER">Orders</option><option value="TRANSACTION">Payment / transaction</option></select></div>
      {form.relatedType && <div className="col-md-6"><label className="form-label">Select record <span className="text-danger">*</span></label><select className="form-select" value={form.relatedRecordId} onChange={(event) => update('relatedRecordId', event.target.value)} disabled={recordsLoading} required><option value="">{recordsLoading ? 'Loading your records…' : 'Choose a record'}</option>{relatedRecords.map((record) => <option key={record._id || record.id} value={record._id || record.id}>{recordText(record)}</option>)}</select><small className="text-muted">Only your own records can be linked to this ticket.</small></div>}
      <div className="col-12"><label className="form-label">Describe the issue <span className="text-danger">*</span></label><textarea className="form-control" rows="7" minLength="10" maxLength="8000" value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Include the relevant details so our team can help you quickly." required /></div>
      <div className="col-12"><label className="form-label">Attachments <span className="text-muted fw-normal">(optional)</span></label><input ref={fileInput} type="file" className="form-control" multiple accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx" onChange={chooseFiles} /><small className="text-muted">JPG, PNG, WebP, PDF, DOC, or DOCX — up to 25 MB per file.</small>{files.length > 0 && <div className="d-flex flex-wrap gap-2 mt-2">{files.map((file) => <span className="badge bg-light text-dark border" key={`${file.name}-${file.lastModified}`}><i className="fa-solid fa-paperclip me-1" />{file.name}</span>)}</div>}{progress > 0 && progress < 100 && <div className="progress mt-2"><div className="progress-bar" style={{ width: `${progress}%` }} /></div>}</div>
    </div></div></div></div><div className="col-xl-4"><div className="card"><div className="card-body"><h5>Before you submit</h5><ul className="small text-muted ps-3"><li>Support conversations are private to you and the My Doctor admin team.</li><li>Attach any useful documents or screenshots.</li><li>We will notify you when the team replies or changes the ticket status.</li></ul><button className="btn btn-primary w-100" disabled={sending}>{sending ? 'Sending…' : 'Submit ticket'} <i className="fa-solid fa-paper-plane ms-2" /></button></div></div></div></div></form>
  </div></div>
}

export default CreateSupportTicket
