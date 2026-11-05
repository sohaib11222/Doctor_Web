import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { resendEmailVerification, verifyEmail } from '../../api/auth'
import { useAuth } from '../../contexts/AuthContext'

const VerifyEmail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setSession } = useAuth()
  const [email, setEmail] = useState(location.state?.email || '')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    if (!email.trim() || !/^\d{6}$/.test(code)) {
      toast.error('Inserisci il tuo indirizzo email e il codice a 6 cifre.')
      return
    }
    setLoading(true)
    try {
      const response = await verifyEmail(email.trim(), code)
      setSession(response)
      toast.success('Email verificata. Benvenuto in My Doctor!')
      navigate('/patient/dashboard', { replace: true })
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Codice non valido o scaduto.')
    } finally { setLoading(false) }
  }

  const resend = async () => {
    if (!email.trim()) { toast.error('Inserisci il tuo indirizzo email.'); return }
    setResending(true)
    try {
      await resendEmailVerification(email.trim())
      toast.success('Abbiamo inviato un nuovo codice di verifica.')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Impossibile inviare un nuovo codice.')
    } finally { setResending(false) }
  }

  return <div className="content"><div className="container"><div className="row justify-content-center"><div className="col-md-7 col-lg-5"><div className="account-content"><div className="account-box"><div className="account-wrapper"><div className="text-center mb-4"><div className="mb-3" style={{ fontSize: 38, color: '#087f94' }}><i className="fa-solid fa-envelope-circle-check" /></div><h3 className="account-title">Verifica la tua email</h3><p className="account-subtitle">Inserisci il codice di 6 cifre inviato al tuo indirizzo email.</p></div><form onSubmit={submit}><div className="form-group"><label>Email</label><input type="email" className="form-control" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></div><div className="form-group"><label>Codice di verifica</label><input type="text" inputMode="numeric" autoComplete="one-time-code" className="form-control text-center" style={{ letterSpacing: '0.45em', fontSize: '1.2rem' }} maxLength="6" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} required /></div><button className="btn btn-primary account-btn w-100" disabled={loading} type="submit">{loading ? 'Verifica in corso...' : 'Verifica email'}</button><button className="btn btn-link w-100 mt-2" disabled={loading || resending} type="button" onClick={resend}>{resending ? 'Invio in corso...' : 'Invia di nuovo il codice'}</button></form><div className="account-footer"><p>Hai già verificato il tuo account? <Link to="/login">Accedi</Link></p></div></div></div></div></div></div></div></div>
}

export default VerifyEmail
