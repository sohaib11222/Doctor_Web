import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useOrder } from '../../queries'
import { useUpdateOrderStatus, useUpdateShippingFee } from '../../mutations'
import { toast } from 'react-toastify'
import BASE_URL from '../../utils/apiConfig'
import { useLanguage } from '../../contexts/LanguageContext'

const DELIVERY_DAY_OPTIONS = [2, 3, 4, 5]
const deliveryPreview = (value) => {
  const days = Number(value)
  if (!DELIVERY_DAY_OPTIONS.includes(days)) return null
  const today = new Date()
  return new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + days, 12))
}

const hasShippingQuote = (order) => order?.finalShipping !== null
  && order?.finalShipping !== undefined
  && Boolean(order?.pharmacyAcceptedAt)
  && DELIVERY_DAY_OPTIONS.includes(Number(order?.promisedDeliveryDays))

const PharmacyOrderDetails = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { translateText: tr, formatDate, formatDateTime, language } = useLanguage()
  const [showStatusModal, setShowStatusModal] = useState(false)

  const { data: orderResponse, isLoading, error, refetch } = useOrder(orderId)
  const updateStatusMutation = useUpdateOrderStatus()
  const updateShippingFeeMutation = useUpdateShippingFee()
  const [showShippingModal, setShowShippingModal] = useState(false)
  const [shippingFee, setShippingFee] = useState('')
  const [deliveryDays, setDeliveryDays] = useState('')

  // Handle both response.data and direct data (axios interceptor already returns response.data)
  const order = orderResponse?.data || orderResponse

  const formatOrderDate = (dateString) => formatDateTime(dateString, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '€0.00'
    return new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    const badges = {
      'DELIVERED': 'badge-success',
      'SHIPPED': 'badge-info',
      'PROCESSING': 'badge-warning',
      'CONFIRMED': 'badge-primary',
      'PENDING': 'badge-secondary',
      'CANCELLED': 'badge-danger',
      'REFUNDED': 'badge-danger'
    }
    return <span className={`badge ${badges[status] || 'badge-secondary'}`}>{tr(status || '—')}</span>
  }

  const normalizeImageUrl = (imageUri) => {
    if (!imageUri || typeof imageUri !== 'string') return null
    const trimmedUri = imageUri.trim()
    if (!trimmedUri) return null
    const baseUrl = BASE_URL.replace('/api', '')
    if (trimmedUri.startsWith('http://') || trimmedUri.startsWith('https://')) {
      return trimmedUri
    }
    const imagePath = trimmedUri.startsWith('/') ? trimmedUri : `/${trimmedUri}`
    return `${baseUrl}${imagePath}`
  }

  const handleUpdateStatus = () => {
    setShowStatusModal(true)
  }

  const handleStatusChange = (status) => {
    if (!order) return
    updateStatusMutation.mutate(
      { orderId: order._id, status },
      {
        onSuccess: () => {
          setShowStatusModal(false)
          refetch()
        }
      }
    )
  }

  const handleUpdateShippingFee = () => {
    if (!order) return
    const fee = parseFloat(shippingFee)
    if (isNaN(fee) || fee < 0) {
      toast.error(tr('Please enter a valid shipping fee (non-negative number)'))
      return
    }
    const days = Number(deliveryDays)
    if (!DELIVERY_DAY_OPTIONS.includes(days)) {
      toast.error(tr('Select a delivery commitment of 2, 3, 4, or 5 days'))
      return
    }
    updateShippingFeeMutation.mutate(
      { orderId: order._id, shippingFee: fee, deliveryDays: days },
      {
        onSuccess: () => {
          setShowShippingModal(false)
          setShippingFee('')
          refetch()
        }
      }
    )
  }

  const handleOpenShippingModal = () => {
    if (!order) return
    setShippingFee(String(order.finalShipping ?? order.shipping ?? order.initialShipping ?? 0))
    setDeliveryDays(order.promisedDeliveryDays?.toString() || '')
    setShowShippingModal(true)
  }

  if (isLoading) {
    return (
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar"></div>
            <div className="col-lg-12 col-xl-12">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">{tr('Loading...')}</span>
                </div>
                <p className="mt-3">{tr('Loading order details...')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar"></div>
            <div className="col-lg-12 col-xl-12">
              <div className="text-center py-5">
                <i className="fe fe-alert-circle" style={{ fontSize: '64px', color: '#dc3545' }}></i>
                <h5 className="mt-3">{tr('Error Loading Order')}</h5>
                <p className="text-muted">{tr(error?.message || 'Failed to load order details')}</p>
                <button className="btn btn-primary mt-3" onClick={() => refetch()}>
                  {tr('Retry')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const patient = typeof order.patientId === 'object' ? order.patientId : null
  const patientName = patient?.fullName || tr('Unknown Patient')
  const patientEmail = patient?.email || '—'
  const patientPhone = patient?.phone || '—'
  const shippingAddress = order.shippingAddress

  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar"></div>
          <div className="col-lg-12 col-xl-12">
            <div className="dashboard-header d-flex justify-content-between align-items-center">
              <h3>{tr('Order Details')}</h3>
              <Link to="/pharmacy/orders" className="btn btn-outline-primary btn-sm">
                <i className="fe fe-arrow-left me-2"></i>
                {tr('Back to Orders')}
              </Link>
            </div>

            {/* Order Header */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">{tr('Order Number')}</p>
                    <h4 className="mb-0">#{order.orderNumber}</h4>
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                    <p className="text-muted small mb-0 mt-2">
                      {tr('Payment')}: <span className={`badge ${
                        order.paymentStatus === 'PAID' ? 'badge-success' :
                        order.paymentStatus === 'PARTIAL' ? 'badge-warning' :
                        'badge-secondary'
                      }`}>
                        {tr(order.paymentStatus)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="card mb-4">
              <div className="card-header">
                <h4 className="card-title mb-0">{tr('Customer Information')}</h4>
              </div>
              <div className="card-body">
                <div className="row mb-2">
                  <div className="col-sm-4">
                    <strong>{tr('Name')}:</strong>
                  </div>
                  <div className="col-sm-8">
                    {patientName}
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-4">
                    <strong>{tr('Email')}:</strong>
                  </div>
                  <div className="col-sm-8">
                    {patientEmail}
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <strong>{tr('Phone')}:</strong>
                  </div>
                  <div className="col-sm-8">
                    {patientPhone}
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {shippingAddress && (
              <div className="card mb-4">
                <div className="card-header">
                  <h4 className="card-title mb-0">{tr('Shipping Address')}</h4>
                </div>
                <div className="card-body">
                  <p className="mb-1">{shippingAddress.line1}</p>
                  {shippingAddress.line2 && <p className="mb-1">{shippingAddress.line2}</p>}
                  <p className="mb-1">
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                  </p>
                  <p className="mb-0">{shippingAddress.country}</p>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="card mb-4">
              <div className="card-header">
                <h4 className="card-title mb-0">{tr('Order Items')}</h4>
              </div>
              <div className="card-body">
                {order.items?.map((item, index) => {
                  const product = typeof item.productId === 'object' ? item.productId : null
                  const productName = product?.name || tr('Product')
                  const productImage = product?.images?.[0]
                  const normalizedImageUrl = normalizeImageUrl(productImage)
                  const itemPrice = item.discountPrice || item.price

                  return (
                    <div key={index} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                      {normalizedImageUrl ? (
                        <img
                          src={normalizedImageUrl}
                          alt={productName}
                          className="img-fluid"
                          style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginRight: '15px' }}
                        />
                      ) : (
                        <div
                          className="bg-light d-flex align-items-center justify-content-center"
                          style={{ width: '80px', height: '80px', borderRadius: '8px', marginRight: '15px' }}
                        >
                          <i className="fe fe-package" style={{ fontSize: '32px', color: '#dee2e6' }}></i>
                        </div>
                      )}
                      <div className="flex-grow-1">
                        <h5 className="mb-1">{productName}</h5>
                        <p className="text-muted mb-1">{tr('Quantity')}: {item.quantity}</p>
                        <p className="text-muted mb-0">{formatCurrency(itemPrice)} {tr('each')}</p>
                        {item.variantName && <p className="text-muted small mb-0">{tr('Option')}: {item.variantName}</p>}
                      </div>
                      <div>
                        <h5 className="mb-0">{formatCurrency(item.total)}</h5>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="card mb-4">
              <div className="card-header">
                <h4 className="card-title mb-0">{tr('Order Summary')}</h4>
              </div>
              <div className="card-body">
                {(() => {
                  const realTotal = (Number(order.subtotal) || 0) + (Number(order.shipping) || 0)
                  return (
                    <>
                <div className="d-flex justify-content-between mb-2">
                  <span>{tr('Subtotal')}</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <div>
                    <span>{tr('Shipping')}</span>
                    {hasShippingQuote(order) && order.finalShipping !== order.initialShipping && (
                      <small className="text-muted d-block">
                        {tr('Updated from')} {formatCurrency(order.initialShipping || 0)}
                      </small>
                    )}
                    {hasShippingQuote(order) && order.shippingUpdatedAt && (
                      <small className="text-muted d-block">
                        {tr('Updated on')} {formatOrderDate(order.shippingUpdatedAt)}
                      </small>
                    )}
                  </div>
                  <span>{hasShippingQuote(order) ? formatCurrency(order.shipping) : tr('To be confirmed')}</span>
                </div>
                {hasShippingQuote(order) && order.promisedDeliveryDays && <div className="d-flex justify-content-between mb-2"><span>{tr('Delivery commitment')}</span><span>{order.promisedDeliveryDays} {tr(order.promisedDeliveryDays === 1 ? 'day' : 'days')}</span></div>}
                {hasShippingQuote(order) && order.expectedDeliveryDate && <div className="small text-muted mb-2">{tr('Expected delivery')}: {formatOrderDate(order.expectedDeliveryDate)}</div>}
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>{tr('Total')}</strong>
                  <strong>{formatCurrency(realTotal)}</strong>
                </div>
                    </>
                  )
                })()}
              </div>
            </div>

            {/* Order Information */}
            <div className="card mb-4">
              <div className="card-header">
                <h4 className="card-title mb-0">{tr('Order Information')}</h4>
              </div>
              <div className="card-body">
                <div className="row mb-2">
                  <div className="col-sm-4">
                    <strong>{tr('Order Date')}:</strong>
                  </div>
                  <div className="col-sm-8">
                    {formatOrderDate(order.createdAt)}
                  </div>
                </div>
                {order.deliveredAt && (
                  <div className="row mb-2">
                    <div className="col-sm-4">
                      <strong>{tr('Delivered Date')}:</strong>
                    </div>
                    <div className="col-sm-8">
                      {formatOrderDate(order.deliveredAt)}
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-sm-4">
                    <strong>{tr('Payment Status')}:</strong>
                  </div>
                  <div className="col-sm-8">
                    <span className={`badge ${
                      order.paymentStatus === 'PAID' ? 'badge-success' :
                      order.paymentStatus === 'PARTIAL' ? 'badge-warning' :
                      'badge-secondary'
                    }`}>
                      {tr(order.paymentStatus)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card">
              <div className="card-body">
                <div className="d-flex gap-2 flex-wrap">
                  {order.paymentStatus === 'PENDING' && (
                    <button
                      className="btn btn-primary"
                      onClick={handleOpenShippingModal}
                      disabled={updateShippingFeeMutation.isLoading}
                    >
                      <i className="fe fe-truck me-2"></i>
                      {tr(hasShippingQuote(order) ? 'Update Shipping & Delivery' : 'Set Shipping & Delivery')}
                    </button>
                  )}
                  {/* Only allow updating status if order is paid */}
                  {order.paymentStatus === 'PAID' && 
                   ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'].includes(order.status) && (
                    <button
                      className="btn btn-success"
                      onClick={handleUpdateStatus}
                      disabled={updateStatusMutation.isLoading}
                    >
                      <i className="fe fe-edit me-2"></i>
                      {tr('Update Status')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{tr('Update Order Status')}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowStatusModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>{tr('Select new status for order')} #{order.orderNumber}:</p>
                <div className="d-grid gap-2">
                  {['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status) => (
                    <button
                      key={status}
                      className="btn btn-outline-primary"
                      onClick={() => handleStatusChange(status)}
                      disabled={updateStatusMutation.isLoading || order.status === status}
                    >
                      {tr(status)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Fee Update Modal */}
      {showShippingModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{tr('Set shipping & delivery commitment')}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowShippingModal(false)
                    setShippingFee('')
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>{tr('Set the order-specific shipping fee and delivery commitment for order')} #{order.orderNumber}.</p>
                <div className="mb-3">
                  <label className="form-label">{tr('Current Shipping Fee')}</label>
                  <div className="form-control-plaintext">
                    {formatCurrency(order.shipping || order.initialShipping || 0)}
                    {order.initialShipping && order.initialShipping !== order.shipping && (
                      <small className="text-muted d-block">
                        {tr('Initial estimate')}: {formatCurrency(order.initialShipping)}
                      </small>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="shippingFee" className="form-label">{tr('New Shipping Fee (€)')}</label>
                  <input
                    type="number"
                    className="form-control"
                    id="shippingFee"
                    min="0"
                    step="0.01"
                    value={shippingFee}
                    onChange={(e) => setShippingFee(e.target.value)}
                    placeholder={tr('Enter shipping fee')}
                  />
                  <small className="text-muted">
                    {tr('Subtotal')}: {formatCurrency(order.subtotal)} + {tr('Tax')}: {formatCurrency(order.tax)} + {tr('Shipping')} = {tr('New Total')}
                  </small>
                </div>
                <div className="mb-3">
                  <label htmlFor="deliveryDays" className="form-label">{tr('Expected delivery time')} <span className="text-danger">*</span></label>
                  <select className="form-select" id="deliveryDays" value={deliveryDays} onChange={(e) => setDeliveryDays(e.target.value)} required>
                    <option value="">{tr('Select a delivery commitment')}</option>
                    {DELIVERY_DAY_OPTIONS.map((days) => <option key={days} value={days}>{days} {tr('days')}</option>)}
                  </select>
                  {deliveryPreview(deliveryDays) && <small className="text-muted d-block mt-2">{tr('Expected delivery date')}: {formatDate(deliveryPreview(deliveryDays), { day: '2-digit', month: 'long', year: 'numeric' })}</small>}
                  <small className="text-muted d-block mt-1">{tr('Choose the commitment you can keep for this order.')}</small>
                </div>
                {shippingFee && !isNaN(parseFloat(shippingFee)) && (
                  <div className="alert alert-info">
                    <strong>{tr('New Total')}:</strong> {formatCurrency(order.subtotal + order.tax + parseFloat(shippingFee))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowShippingModal(false)
                    setShippingFee('')
                    setDeliveryDays('')
                  }}
                >
                  {tr('Cancel')}
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateShippingFee}
                  disabled={updateShippingFeeMutation.isLoading || shippingFee === '' || isNaN(parseFloat(shippingFee)) || !DELIVERY_DAY_OPTIONS.includes(Number(deliveryDays))}
                >
                  {tr(updateShippingFeeMutation.isLoading ? 'Saving...' : 'Send shipping details')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PharmacyOrderDetails

