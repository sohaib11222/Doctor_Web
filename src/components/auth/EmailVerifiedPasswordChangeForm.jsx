import { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as authApi from '../../api/auth'
import { useLanguage } from '../../contexts/LanguageContext'

const EmailVerifiedPasswordChangeForm = () => {
  const { user } = useAuth()
  const { translateText: tr } = useLanguage()
  const [codeSent, setCodeSent] = useState(false)
  const [verified, setVerified] = useState(false)
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const sendCode = async () => {
    setBusy(true)
    try {
      await authApi.requestChangePasswordCode()
      setCodeSent(true); setVerified(false); setCode('')
      toast.success(`${tr('We sent a verification code to')} ${user?.email || tr('your registered email')}.`)
    } catch (error) {
      toast.error(tr(error.response?.data?.message || error.message || 'Unable to send the code.'))
    } finally { setBusy(false) }
  }

  const verifyCode = async (event) => {
    event.preventDefault()
    if (!/^\d{6}$/.test(code)) { toast.error(tr('Enter the 6-digit code.')); return }
    setBusy(true)
    try {
      await authApi.verifyChangePasswordCode(code)
      setVerified(true)
      toast.success(tr('Code verified. You can now choose a new password.'))
    } catch (error) {
      toast.error(tr(error.response?.data?.message || error.message || 'The code is invalid or expired.'))
    } finally { setBusy(false) }
  }

  const save = async (event) => {
    event.preventDefault()
    if (newPassword.length < 8) { toast.error(tr('The new password must contain at least 8 characters.')); return }
    if (newPassword !== confirmPassword) { toast.error(tr('The passwords do not match.')); return }
    setBusy(true)
    try {
      await authApi.changePassword(code, newPassword)
      toast.success(tr('Password updated successfully.'))
      setCodeSent(false); setVerified(false); setCode(''); setNewPassword(''); setConfirmPassword('')
    } catch (error) {
      toast.error(tr(error.response?.data?.message || error.message || 'Unable to update the password.'))
    } finally { setBusy(false) }
  }

  return <div className="card pass-card"><div className="card-body"><div className="border-bottom pb-3 mb-4"><h5 className="mb-1">{tr('Modify password')}</h5><p className="text-muted mb-0">{tr('For your security, first confirm the code sent to your registered email.')}</p></div><div className="p-3 rounded mb-4" style={{ background: '#f2f8f9' }}><div className="small text-muted mb-1">{tr('Registered email')}</div><strong>{user?.email || tr('Email unavailable')}</strong><button type="button" className="btn btn-outline-primary btn-sm ms-3" disabled={busy} onClick={sendCode}>{tr(codeSent ? 'Resend code' : 'Send code')}</button></div>{codeSent && !verified && <form className="row" onSubmit={verifyCode}><div className="col-md-6"><div className="mb-3"><label className="form-label">{tr('Verification code')}</label><input className="form-control" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength="6" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" required /><small className="text-muted">{tr('The code expires in 10 minutes.')}</small></div><button className="btn btn-primary" type="submit" disabled={busy}>{tr(busy ? 'Verifying...' : 'Verify code')}</button></div></form>}{verified && <form className="row" onSubmit={save}><div className="col-md-6"><div className="mb-3"><label className="form-label">{tr('New password')}</label><input className="form-control" type="password" autoComplete="new-password" minLength="8" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required /></div><div className="mb-3"><label className="form-label">{tr('Confirm new password')}</label><input className="form-control" type="password" autoComplete="new-password" minLength="8" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required /></div><button className="btn btn-primary" type="submit" disabled={busy}>{tr(busy ? 'Saving...' : 'Save new password')}</button></div></form>}</div></div>
}

export default EmailVerifiedPasswordChangeForm
