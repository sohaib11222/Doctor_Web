import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import * as pharmacyApi from '../../api/pharmacy'
import * as orderApi from '../../api/order'
import * as productApi from '../../api/product'
import * as prescriptionApi from '../../api/productPrescriptionRequest'

const orderStatuses = [
  { value: 'PENDING', label: 'Awaiting action', icon: 'fa-clock', tone: 'warning' },
  { value: 'CONFIRMED', label: 'Confirmed', icon: 'fa-circle-check', tone: 'info' },
  { value: 'PROCESSING', label: 'Preparing', icon: 'fa-box-open', tone: 'primary' },
  { value: 'SHIPPED', label: 'In delivery', icon: 'fa-truck', tone: 'secondary' },
  { value: 'DELIVERED', label: 'Delivered', icon: 'fa-circle-check', tone: 'success' },
  { value: 'CANCELLED', label: 'Cancelled', icon: 'fa-ban', tone: 'danger' },
]

const unwrap = (response) => {
  const first = response?.data ?? response
  return first?.data ?? first ?? {}
}
const orderName = (order, fallback) => order?.patientId?.fullName || order?.patientId?.email || order?.shippingAddress?.fullName || fallback
const orderTotal = (order) => order?.totalAmount ?? order?.total ?? order?.amount ?? 0

const PharmacyDashboard = () => {
  const { user } = useAuth()
  const { translateText: tr, formatDate, language } = useLanguage()
  const role = String(user?.role || '').toUpperCase()
  const isParapharmacy = role === 'PARAPHARMACY'
  const price = (amount) => new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-US', { style: 'currency', currency: 'EUR' }).format(Number(amount || 0))

  const pharmacy = useQuery({ queryKey: ['my-pharmacy'], queryFn: pharmacyApi.getMyPharmacy, enabled: Boolean(user) })
  const orders = useQuery({ queryKey: ['pharmacy-dashboard-orders'], queryFn: async () => Promise.all(orderStatuses.map(({ value }) => orderApi.getPharmacyOrders({ page: 1, limit: 8, status: value }))), enabled: Boolean(user), refetchInterval: 15000 })
  const products = useQuery({ queryKey: ['pharmacy-dashboard-products', user?._id || user?.id, language], queryFn: () => productApi.listProducts({ sellerId: user?._id || user?.id, page: 1, limit: 100, isActive: 'all' }), enabled: Boolean(user?._id || user?.id), refetchInterval: 30000 })
  const inventory = useQuery({ queryKey: ['pharmacy-inventory-summary'], queryFn: productApi.getInventorySummary, enabled: Boolean(user?._id || user?.id), refetchInterval: 30000 })
  const prescriptions = useQuery({ queryKey: ['pharmacy-dashboard-prescriptions'], queryFn: prescriptionApi.getPendingProductPrescriptionCount, enabled: role === 'PHARMACY' || role === 'PARAPHARMACY', refetchInterval: 15000 })
  const subscription = useQuery({ queryKey: ['pharmacy-dashboard-subscription'], queryFn: pharmacyApi.getMyPharmacySubscription, enabled: role === 'PHARMACY', retry: 1 })

  const business = unwrap(pharmacy.data)
  const productList = useMemo(() => {
    const value = unwrap(products.data)
    return Array.isArray(value.products) ? value.products : []
  }, [products.data])
  const statusStats = useMemo(() => orderStatuses.map((definition, index) => {
    const value = unwrap(orders.data?.[index])
    return { ...definition, count: Number(value?.pagination?.total || value?.total || 0), orders: Array.isArray(value?.orders) ? value.orders : [] }
  }), [orders.data])
  const recentOrders = useMemo(() => statusStats.flatMap((item) => item.orders)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .filter((order, index, list) => list.findIndex((item) => String(item._id) === String(order._id)) === index)
    .slice(0, 8), [statusStats])
  const profileComplete = Boolean(business?.name && business?.phone && business?.address?.line1 && business?.address?.city)
  const pendingPrescriptionCount = Number(unwrap(prescriptions.data)?.pendingCount || unwrap(prescriptions.data)?.count || 0)
  const inventorySummary = unwrap(inventory.data)
  const lowStock = Number(inventorySummary?.lowStockCount ?? productList.filter((product) => Number(product.stock || 0) <= 5).length)
  const totalUnits = Number(inventorySummary?.totalUnits ?? productList.reduce((total, product) => total + Number(product.stock || 0), 0))
  const totalSales = recentOrders.filter((order) => String(order.paymentStatus || '').toUpperCase() === 'PAID')
    .reduce((total, order) => total + Number(orderTotal(order)), 0)
  const subscriptionInfo = unwrap(subscription.data)
  const activeSubscription = Boolean(subscriptionInfo?.subscriptionPlan || subscriptionInfo?.plan || subscriptionInfo?.isActive)
  const pendingApproval = String(user?.status || '').toUpperCase() === 'PENDING'
  const stockMessage = lowStock
    ? `${lowStock} ${tr(lowStock === 1 ? 'product needs stock attention.' : 'products need stock attention.')}`
    : tr('Your visible product stock levels are healthy.')

  return (
    <div>
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h3 className="mb-1">{tr(isParapharmacy ? 'Parapharmacy dashboard' : 'Pharmacy dashboard')}</h3>
          <p className="text-muted mb-0">{tr('Keep your products, orders, prescriptions and fulfilment on track.')}</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Link className="btn btn-outline-primary" to="/pharmacy/products"><i className="fa-solid fa-plus me-2" />{tr('Add product')}</Link>
          <Link className="btn btn-primary" to="/pharmacy/orders"><i className="fa-solid fa-box me-2" />{tr('Manage orders')}</Link>
        </div>
      </div>

      {pendingApproval && <div className="alert alert-warning d-flex align-items-center gap-2"><i className="fa-solid fa-hourglass-half" /><span>{tr('Your account is awaiting administrator approval. You can finish setup while review is in progress.')}</span></div>}
      {!business?._id ? (
        <div className="card border-primary mb-4"><div className="card-body d-flex align-items-center justify-content-between gap-3 flex-wrap"><div><h5 className="mb-1">{tr(isParapharmacy ? 'Create your parapharmacy profile' : 'Create your pharmacy profile')}</h5><p className="text-muted mb-0">{tr('Set up the public business information customers see before publishing products.')}</p></div><Link className="btn btn-primary" to="/pharmacy/profile">{tr('Set up profile')}</Link></div></div>
      ) : !profileComplete ? (
        <div className="alert alert-info d-flex align-items-center justify-content-between gap-3 flex-wrap"><div><strong>{tr('Complete your business profile')}</strong><div className="small">{tr('Add a name, phone number and address to complete your storefront.')}</div></div><Link className="btn btn-sm btn-primary" to="/pharmacy/profile">{tr('Complete profile')}</Link></div>
      ) : null}
      {role === 'PHARMACY' && !activeSubscription && <div className="alert alert-primary d-flex align-items-center justify-content-between gap-3 flex-wrap"><div><strong>{tr('Choose a subscription')}</strong><div className="small">{tr('Activate a Pharmacy plan to continue selling and managing your catalogue.')}</div></div><Link className="btn btn-sm btn-primary" to="/pharmacy/subscription-plans">{tr('View plans')}</Link></div>}

      <div className="row g-3 mb-4">
        <Metric icon="fa-boxes-stacked" tone="primary" label={tr('Products')} value={inventorySummary?.totalProducts ?? productList.length} detail={`${totalUnits} ${tr('units in stock')} · ${lowStock} ${tr('low in stock')}`} detailTone="warning" />
        <Metric icon="fa-file-prescription" tone="warning" label={tr('Prescription reviews')} value={pendingPrescriptionCount} detail={tr('Awaiting your decision')} />
        <Metric icon="fa-cart-shopping" tone="info" label={tr('Open orders')} value={statusStats.slice(0, 4).reduce((total, item) => total + item.count, 0)} detail={tr('Need fulfilment attention')} />
        <Metric icon="fa-chart-line" tone="success" label={tr('Recent paid sales')} value={price(totalSales)} detail={tr('Latest paid orders')} />
      </div>

      <div className="row g-3 mb-4">
        {statusStats.map((item) => <div className="col-6 col-md-4 col-xl-2" key={item.value}><Link to={`/pharmacy/orders?status=${item.value}`} className="card h-100 text-decoration-none"><div className="card-body text-center"><i className={`fa-solid ${item.icon} text-${item.tone} mb-2`} /><div className="h4 mb-1 text-dark">{orders.isLoading ? '—' : item.count}</div><small className="text-muted">{tr(item.label)}</small></div></Link></div>)}
      </div>

      <div className="row g-4">
        <div className="col-xl-8"><div className="card h-100"><div className="card-header d-flex justify-content-between align-items-center"><h5 className="mb-0">{tr('Recent orders')}</h5><Link to="/pharmacy/orders" className="small">{tr('View all')}</Link></div><div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead><tr><th>{tr('Order')}</th><th>{tr('Customer')}</th><th>{tr('Total')}</th><th>{tr('Payment')}</th><th>{tr('Status')}</th><th /></tr></thead><tbody>{orders.isLoading ? <tr><td colSpan="6" className="text-center py-4"><span className="spinner-border spinner-border-sm" /></td></tr> : recentOrders.length ? recentOrders.map((order) => <tr key={order._id}><td><strong>{order.orderNumber || `#${String(order._id).slice(-6)}`}</strong><div className="small text-muted">{formatDate(order.createdAt)}</div></td><td>{orderName(order, tr('Patient'))}</td><td>{price(orderTotal(order))}</td><td><span className={`badge ${String(order.paymentStatus || '').toUpperCase() === 'PAID' ? 'bg-success' : 'bg-warning text-dark'}`}>{tr(String(order.paymentStatus || 'PENDING'))}</span></td><td><span className="badge bg-light text-dark border">{tr(String(order.status || 'PENDING'))}</span></td><td className="text-end"><Link to={`/pharmacy/orders/${order._id}`} className="btn btn-sm btn-outline-primary">{tr('Open')}</Link></td></tr>) : <tr><td colSpan="6" className="text-center py-5 text-muted">{tr('New orders will appear here when customers complete checkout.')}</td></tr>}</tbody></table></div></div></div>
        <div className="col-xl-4"><div className="card mb-4"><div className="card-header"><h5 className="mb-0">{tr('Quick actions')}</h5></div><div className="list-group list-group-flush"><QuickLink to="/pharmacy/products" icon="fa-box" label={tr('Manage products')} /><QuickLink to="/pharmacy/orders" icon="fa-truck" label={tr('Fulfil orders')} /><Link to="/pharmacy/prescription-requests" className="list-group-item list-group-item-action d-flex justify-content-between"><span><i className="fa-solid fa-file-prescription me-2 text-primary" />{tr('Review prescriptions')}</span>{pendingPrescriptionCount ? <span className="badge bg-danger">{pendingPrescriptionCount}</span> : <i className="fa-solid fa-chevron-right" />}</Link><QuickLink to="/pharmacy/admin-chat" icon="fa-headset" label={tr('Admin Support')} /><QuickLink to="/pharmacy/profile" icon="fa-store" label={tr('Business profile')} /></div></div><div className="card"><div className="card-body"><h5 className="mb-2">{tr('Inventory overview')}</h5><p className="text-muted small mb-2">{stockMessage}</p><p className="small mb-3"><strong>{totalUnits}</strong> {tr('units currently available')}</p><Link to="/pharmacy/products" className="btn btn-outline-primary btn-sm">{tr('Review inventory')}</Link></div></div></div>
      </div>
    </div>
  )
}

const Metric = ({ icon, tone, label, value, detail, detailTone = 'muted' }) => <div className="col-sm-6 col-xl-3"><div className="card h-100"><div className="card-body d-flex align-items-center gap-3"><span className={`avatar avatar-lg bg-${tone} ${tone === 'warning' ? 'text-dark' : 'text-white'} rounded-circle d-flex align-items-center justify-content-center`}><i className={`fa-solid ${icon}`} /></span><div><small className="text-muted">{label}</small><h3 className="mb-0">{value}</h3><small className={`text-${detailTone}`}>{detail}</small></div></div></div></div>
const QuickLink = ({ to, icon, label }) => <Link to={to} className="list-group-item list-group-item-action d-flex justify-content-between"><span><i className={`fa-solid ${icon} me-2 text-primary`} />{label}</span><i className="fa-solid fa-chevron-right" /></Link>

export default PharmacyDashboard
