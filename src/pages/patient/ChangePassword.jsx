import { Link } from 'react-router-dom'
import EmailVerifiedPasswordChangeForm from '../../components/auth/EmailVerifiedPasswordChangeForm'

const ChangePassword = () => <div className="content doctor-content"><div className="container"><nav className="settings-tab mb-3"><ul className="nav nav-tabs-bottom"><li className="nav-item"><Link className="nav-link" to="/profile-settings">Profilo</Link></li><li className="nav-item"><Link className="nav-link active" to="/change-password">Modifica password</Link></li></ul></nav><EmailVerifiedPasswordChangeForm /></div></div>

export default ChangePassword
