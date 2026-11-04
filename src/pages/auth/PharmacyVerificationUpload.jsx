import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import AuthLayout from '../../layouts/AuthLayout'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../api/axios'
import { useLanguage } from '../../contexts/LanguageContext'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPT = '.jpg,.jpeg,.png,.webp,.pdf,.doc,.docx'
const DOCUMENTS = [
  { key: 'license', type: 'PHARMACY_LICENSE', label: 'Business or pharmacy license', help: 'Current operating or registration license' },
  { key: 'qualification', type: 'PROFESSIONAL_QUALIFICATION', label: 'Professional qualification', help: 'Pharmacist degree or relevant qualification' },
  { key: 'ownerId', type: 'OWNER_IDENTIFICATION', label: 'Owner photo ID', help: 'Government-issued identification' },
  { key: 'addressProof', type: 'ADDRESS_PROOF', label: 'Address proof', help: 'Utility bill, lease, or comparable business proof' },
]

const uploadError = (error) => {
  const payload = error?.response?.data || error?.data || error
  const detail = Array.isArray(payload?.errors) ? payload.errors[0]?.message : null
  if (payload?.message && payload.message !== 'Network Error') return detail || payload.message
  if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') return 'We could not reach the upload service. Please check your connection and try again.'
  return 'Your documents could not be uploaded. Please try again.'
}

const PharmacyVerificationUpload = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { translateText: tr } = useLanguage()
  const [files, setFiles] = useState({})
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const complete = useMemo(() => DOCUMENTS.every((document) => files[document.key]), [files])
  const accountLabel = String(user?.role || '').toUpperCase() === 'PARAPHARMACY' ? 'Parapharmacy' : 'Pharmacy'

  const chooseFile = (document, event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > MAX_FILE_SIZE) {
      toast.error(tr('Each document must be 10 MB or smaller.'))
      event.target.value = ''
      return
    }
    setFiles((current) => ({ ...current, [document.key]: file }))
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!complete) return toast.error(tr('Please add all required verification documents before continuing.'))
    const formData = new FormData()
    DOCUMENTS.forEach((document) => {
      formData.append('files', files[document.key], files[document.key].name)
      formData.append('docType', document.type)
    })
    setLoading(true)
    setProgress(0)
    try {
      const response = await api.post('/upload/pharmacy-docs', formData, { onUploadProgress: (event) => { if (event.total) setProgress(Math.min(100, Math.round((event.loaded / event.total) * 100))) } })
      if (response?.success === false) throw new Error(response.message || 'Upload failed')
      localStorage.setItem('pharmacy_documents_submitted', 'true')
      toast.success(tr('Documents uploaded successfully. Your account is now under review.'))
      navigate('/pending-approval')
    } catch (error) {
      toast.error(tr(uploadError(error)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="auth-pharmacy-flow auth-pharmacy-flow--documents">
        <div className="auth-pharmacy-flow__steps" aria-label="Verification progress"><span className="is-complete"><i className="fa-solid fa-check" /><b>Account</b></span><span className="is-complete"><i className="fa-solid fa-check" /><b>Phone</b></span><span className="is-active"><i className="fa-solid fa-file-shield" /><b>Documents</b></span><span><i className="fa-solid fa-circle-check" /><b>Approval</b></span></div>
        <section className="auth-pharmacy-flow__panel">
          <div className="auth-pharmacy-flow__header"><div className="logo-icon"><i className="fa-solid fa-file-shield" /></div><div><h3>Verify your {accountLabel.toLowerCase()}</h3><p>Provide the required business documents so the My Doctor team can review and approve your account.</p></div></div>
          <form onSubmit={submit} encType="multipart/form-data" className="mt-3"><div className="auth-document-grid">{DOCUMENTS.map((document) => { const file = files[document.key]; return <div className={`auth-document-card ${file ? 'is-selected' : ''}`} key={document.key}><div className="auth-document-card__icon"><i className={`fa-solid ${file ? 'fa-circle-check' : 'fa-file-arrow-up'}`} /></div><div className="flex-grow-1 min-width-0"><label htmlFor={document.key} className="auth-document-card__title">{document.label} <span className="text-danger">*</span></label><div className="auth-document-card__help" title={file?.name || document.help}>{file?.name || document.help}</div></div><label htmlFor={document.key} className="btn btn-sm btn-outline-primary mb-0">{file ? 'Change' : 'Select'}</label><input className="d-none" id={document.key} type="file" accept={ACCEPT} onChange={(event) => chooseFile(document, event)} /></div> })}</div>{loading && <div className="mt-3" aria-live="polite"><div className="d-flex justify-content-between small text-muted mb-1"><span>Uploading documents…</span><span>{progress}%</span></div><div className="progress" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"><div className="progress-bar" style={{ width: `${progress}%` }} /></div></div>}<div className="auth-document-footer mt-3"><div className="text-muted small"><i className="fa-solid fa-shield-halved me-2" />JPG, PNG, WebP, PDF, DOC, and DOCX files up to 10 MB.</div><button type="submit" className="btn btn-primary-gradient" disabled={loading || !complete}>{loading ? 'Uploading…' : 'Submit for review'} <i className="fa-solid fa-arrow-right ms-2" /></button></div></form>
        </section>
        <div className="text-center mt-3"><Link to="/pharmacy-phone-verification" className="text-muted">Back to phone verification</Link></div>
      </div>
    </AuthLayout>
  )
}

export default PharmacyVerificationUpload
