import { createContext, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/auth-modern.css'
import LanguageToggle from '../components/common/LanguageToggle'

const AuthLayoutContext = createContext(false)

const AuthLayout = ({ children }) => {
  // A few legacy auth screens already wrap themselves in AuthLayout while the
  // route also wraps them.  Treat the inner wrapper as transparent so every
  // auth screen still renders one consistent shell.
  const isNested = useContext(AuthLayoutContext)
  const { pathname } = useLocation()
  if (isNested) return children
  const path = pathname.toLowerCase()
  const context = path.includes('doctor')
    ? { eyebrow: 'For medical professionals', title: 'Bring better care within reach.', description: 'Set up your professional account, manage consultations and give every patient a more connected care experience.', icon: 'fa-user-doctor' }
    : path.includes('pharmacy')
      ? { eyebrow: 'For healthcare businesses', title: 'Care that continues beyond the consultation.', description: 'Join My Doctor to manage your pharmacy, serve patients and keep healthcare essentials within reach.', icon: 'fa-briefcase-medical' }
      : path.includes('register')
        ? { eyebrow: 'Welcome to My Doctor', title: 'Your care, organized around you.', description: 'Create your account to find trusted care, manage appointments and keep health conversations together.', icon: 'fa-heart-pulse' }
        : { eyebrow: 'My Doctor secure access', title: 'Healthcare that feels personal.', description: 'Find trusted doctors, manage appointments and stay connected to the care that matters.', icon: 'fa-shield-heart' }

  return (
    <AuthLayoutContext.Provider value={true}>
      <div className="account-page md-auth-shell">
        <div className="md-auth-language-control">
          <LanguageToggle />
        </div>
        <aside className="md-auth-visual" aria-label="My Doctor care team">
          <div className="md-auth-visual-overlay" />
          <div className="md-auth-visual-content">
            <Link to="/" className="md-auth-visual-brand" aria-label="My Doctor home">
              <img src="/assets/img/doctor_final.png" alt="My Doctor" />
            </Link>
            <div className="md-auth-hero">
              <span className="md-auth-kicker"><i className={`fa-solid ${context.icon}`} /> {context.eyebrow}</span>
              <h1>{context.title}</h1>
              <p>{context.description}</p>
            </div>
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

