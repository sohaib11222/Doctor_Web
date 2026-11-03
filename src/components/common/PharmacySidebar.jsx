import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useUnreadOrderCount } from '../../queries/orderQueries'
import { useQuery } from '@tanstack/react-query'
import * as prescriptionApi from '../../api/productPrescriptionRequest'
import * as chatApi from '../../api/chat'

const PharmacySidebar = () => {
  const location = useLocation()
  const { user } = useAuth()
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  const userRole = user?.role?.toUpperCase()
  const showSubscriptionPlans = userRole === 'PHARMACY'
  const { data: unreadOrdersCount = 0 } = useUnreadOrderCount(Boolean(user?._id))
  const { data: prescriptionResponse } = useQuery({ queryKey: ['pending-product-prescriptions'], queryFn: prescriptionApi.getPendingProductPrescriptionCount, enabled: Boolean(user?._id), refetchInterval: 10000 })
  const prescriptionPayload = prescriptionResponse?.data?.data || prescriptionResponse?.data || prescriptionResponse
  const pendingPrescriptions = prescriptionPayload?.pendingCount || 0
  const { data: chatUnreadResponse } = useQuery({ queryKey: ['chat-unread-count'], queryFn: chatApi.getUnreadCount, enabled: Boolean(user?._id), refetchInterval: 7000 })
  const chatPayload = chatUnreadResponse?.data || chatUnreadResponse
  const chatUnread = chatPayload?.unreadCount || 0

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
                {unreadOrdersCount > 0 && (
                  <small className="unread-msg">{unreadOrdersCount > 99 ? '99+' : unreadOrdersCount}</small>
                )}
              </Link>
            </li>
            <li className={isActive('/pharmacy/prescription-requests') ? 'active' : ''}>
              <Link to="/pharmacy/prescription-requests"><i className="fas fa-file-prescription" /><span>Prescription Requests</span>{pendingPrescriptions > 0 && <small className="unread-msg">{pendingPrescriptions > 99 ? '99+' : pendingPrescriptions}</small>}</Link>
            </li>
            <li className={isActive('/pharmacy/admin-chat') ? 'active' : ''}>
              <Link to="/pharmacy/admin-chat"><i className="fas fa-headset" /><span>Admin Support</span>{chatUnread > 0 && <small className="unread-msg">{chatUnread > 99 ? '99+' : chatUnread}</small>}</Link>
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
