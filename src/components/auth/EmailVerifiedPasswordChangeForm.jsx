import { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as authApi from '../../api/auth'

const EmailVerifiedPasswordChangeForm = () => {
  const { user } = useAuth()
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
      toast.success(`Abbiamo inviato un codice di verifica a ${user?.email || 'la tua email registrata'}.`)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Impossibile inviare il codice.')
    } finally { setBusy(false) }
  }

  const verifyCode = async (event) => {
    event.preventDefault()
    if (!/^\d{6}$/.test(code)) { toast.error('Inserisci il codice di 6 cifre.'); return }
    setBusy(true)
    try {
      await authApi.verifyChangePasswordCode(code)
      setVerified(true)
      toast.success('Codice verificato. Ora puoi scegliere una nuova password.')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Codice non valido o scaduto.')
    } finally { setBusy(false) }
  }

  const save = async (event) => {
    event.preventDefault()
    if (newPassword.length < 8) { toast.error('La nuova password deve contenere almeno 8 caratteri.'); return }
    if (newPassword !== confirmPassword) { toast.error('Le password non corrispondono.'); return }
    setBusy(true)
    try {
      await authApi.changePassword(code, newPassword)
      toast.success('Password aggiornata con successo.')
      setCodeSent(false); setVerified(false); setCode(''); setNewPassword(''); setConfirmPassword('')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Impossibile aggiornare la password.')
    } finally { setBusy(false) }
  }

  return <div className="card pass-card"><div className="card-body"><div className="border-bottom pb-3 mb-4"><h5 className="mb-1">Modifica password</h5><p className="text-muted mb-0">Per la tua sicurezza, conferma prima il codice inviato alla tua email registrata.</p></div><div className="p-3 rounded mb-4" style={{ background: '#f2f8f9' }}><div className="small text-muted mb-1">Email registrata</div><strong>{user?.email || 'Email non disponibile'}</strong><button type="button" className="btn btn-outline-primary btn-sm ms-3" disabled={busy} onClick={sendCode}>{codeSent ? 'Invia nuovamente il codice' : 'Invia codice'}</button></div>{codeSent && !verified && <form className="row" onSubmit={verifyCode}><div className="col-md-6"><div className="mb-3"><label className="form-label">Codice di verifica</label><input className="form-control" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength="6" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" required /><small className="text-muted">Il codice scade tra 10 minuti.</small></div><button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Verifica in corso...' : 'Verifica codice'}</button></div></form>}{verified && <form className="row" onSubmit={save}><div className="col-md-6"><div className="mb-3"><label className="form-label">Nuova password</label><input className="form-control" type="password" autoComplete="new-password" minLength="8" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required /></div><div className="mb-3"><label className="form-label">Conferma nuova password</label><input className="form-control" type="password" autoComplete="new-password" minLength="8" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required /></div><button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Salvataggio...' : 'Salva nuova password'}</button></div></form>}</div></div>
}

export default EmailVerifiedPasswordChangeForm
