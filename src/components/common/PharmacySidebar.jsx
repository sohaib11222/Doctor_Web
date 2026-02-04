import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const PharmacySidebar = () => {
  const location = useLocation()
  const { user } = useAuth()
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  const userRole = user?.role?.toUpperCase()
  const showSubscriptionPlans = userRole === 'PHARMACY'

  return (
    <div className="profile-sidebar">
      <div className="widget-profile pro-widget-content">
        <div className="profile-info-widget">
          <div className="profile-det-info">
            <h3>Pharmacy</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-widget">
        <nav className="dashboard-menu">
          <ul>
            <li className={isActive('/pharmacy/dashboard') ? 'active' : ''}>
              <Link to="/pharmacy/dashboard">
                <i className="fas fa-columns" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className={isActive('/pharmacy/profile') ? 'active' : ''}>
              <Link to="/pharmacy/profile">
                <i className="fas fa-store" />
                <span>Pharmacy Profile</span>
              </Link>
            </li>
            <li className={isActive('/pharmacy/products') ? 'active' : ''}>
              <Link to="/pharmacy/products">
                <i className="fas fa-box" />
                <span>Products</span>
              </Link>
            </li>
            <li className={isActive('/pharmacy/orders') ? 'active' : ''}>
              <Link to="/pharmacy/orders">
                <i className="fas fa-shopping-bag" />
                <span>Orders</span>
              </Link>
            </li>
            {showSubscriptionPlans && (
              <li className={isActive('/pharmacy/subscription-plans') ? 'active' : ''}>
                <Link to="/pharmacy/subscription-plans">
                  <i className="fas fa-crown" />
                  <span>Subscription Plans</span>
                </Link>
              </li>
            )}
            <li className={isActive('/pharmacy/payment') ? 'active' : ''}>
              <Link to="/pharmacy/payment">
                <i className="fas fa-hand-holding-usd" />
                <span>Payouts</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default PharmacySidebar
