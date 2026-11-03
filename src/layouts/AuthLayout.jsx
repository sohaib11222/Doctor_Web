import { createContext, useContext } from 'react'
import { Link } from 'react-router-dom'
import '../styles/auth-modern.css'

const AuthLayoutContext = createContext(false)

const AuthLayout = ({ children }) => {
  // A few legacy auth screens already wrap themselves in AuthLayout while the
  // route also wraps them.  Treat the inner wrapper as transparent so every
  // auth screen still renders one consistent shell.
  const isNested = useContext(AuthLayoutContext)
  if (isNested) return children

  return (
    <AuthLayoutContext.Provider value={true}>
      <div className="account-page md-auth-shell">
        <aside className="md-auth-visual" aria-label="My Doctor care team">
          <div className="md-auth-visual-overlay" />
          <div className="md-auth-visual-content">
            <span className="md-auth-kicker"><i className="fa-solid fa-heart-pulse" /> Care, connected</span>
            <h1>Healthcare that feels personal.</h1>
            <p>Find trusted doctors, manage appointments and stay connected to the care that matters.</p>
            <div className="md-auth-trust-row">
              <span><i className="fa-solid fa-shield-heart" /> Secure by design</span>
              <span><i className="fa-solid fa-video" /> Care from anywhere</span>
            </div>
          </div>
        </aside>
        <main className="md-auth-main">
          <Link to="/" className="md-auth-brand" aria-label="My Doctor home">
            <img src="/assets/img/doctor_final.png" alt="My Doctor" />
          </Link>
          <div className="md-auth-content">{children}</div>
        </main>
      </div>
    </AuthLayoutContext.Provider>
  )
}

export default AuthLayout

