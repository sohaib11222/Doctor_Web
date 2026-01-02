import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useOrder } from '../../queries'
import { useUpdateOrderStatus, useUpdateShippingFee } from '../../mutations'
import { toast } from 'react-toastify'
import BASE_URL from '../../utils/apiConfig'

const PharmacyOrderDetails = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showShippingModal, setShowShippingModal] = useState(false)
  const [shippingFee, setShippingFee] = useState('')

  const { data: orderResponse, isLoading, error, refetch } = useOrder(orderId)
  const updateStatusMutation = useUpdateOrderStatus()
  const updateShippingMutation = useUpdateShippingFee()

  // Handle both response.data and direct data (axios interceptor already returns response.data)
  const order = orderResponse?.data || orderResponse

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
    return <span className={`badge ${badges[status] || 'badge-secondary'}`}>{status}</span>
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

  const handleUpdateShipping = () => {
    setShippingFee(order?.shipping?.toString() || '0')
    setShowShippingModal(true)
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

  const handleShippingSubmit = (e) => {
    e.preventDefault()
    if (!order) return
    
    const fee = parseFloat(shippingFee)
    if (isNaN(fee) || fee < 0) {
      toast.error('Please enter a valid shipping fee')
      return
    }

    updateShippingMutation.mutate(
      { orderId: order._id, shippingFee: fee },
      {
        onSuccess: () => {
          setShowShippingModal(false)
          setShippingFee('')
          refetch()
        }
      }
    )
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
                  <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-3">Loading order details...</p>
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
                <h5 className="mt-3">Error Loading Order</h5>
                <p className="text-muted">{error?.message || 'Failed to load order details'}</p>
                <button className="btn btn-primary mt-3" onClick={() => refetch()}>
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const patient = typeof order.patientId === 'object' ? order.patientId : null
  const patientName = patient?.fullName || 'Unknown Patient'
  const patientEmail = patient?.email || 'N/A'
  const patientPhone = patient?.phone || 'N/A'
  const shippingAddress = order.shippingAddress

  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar"></div>
          <div className="col-lg-12 col-xl-12">
            <div className="dashboard-header d-flex justify-content-between align-items-center">
              <h3>Order Details</h3>
              <Link to="/pharmacy-orders" className="btn btn-outline-primary btn-sm">
                <i className="fe fe-arrow-left me-2"></i>
                Back to Orders
              </Link>
            </div>

            {/* Order Header */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">Order Number</p>
                    <h4 className="mb-0">#{order.orderNumber}</h4>
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                    <p className="text-muted small mb-0 mt-2">
                      Payment: <span className={`badge ${
                        order.paymentStatus === 'PAID' ? 'badge-success' :
                        order.paymentStatus === 'PARTIAL' ? 'badge-warning' :
                        'badge-secondary'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="card mb-4">
              <div className="card-header">
                <h4 className="card-title mb-0">Customer Information</h4>
              </div>
              <div className="card-body">
                <div className="row mb-2">
                  <div className="col-sm-4">
                    <strong>Name:</strong>
                  </div>
                  <div className="col-sm-8">
                    {patientName}
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-4">
                    <strong>Email:</strong>
                  </div>
                  <div className="col-sm-8">
                    {patientEmail}
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <strong>Phone:</strong>
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
                  <h4 className="card-title mb-0">Shipping Address</h4>
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
                <h4 className="card-title mb-0">Order Items</h4>
              </div>
              <div className="card-body">
                {order.items?.map((item, index) => {
                  const product = typeof item.productId === 'object' ? item.productId : null
                  const productName = product?.name || 'Product'
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
                        <p className="text-muted mb-1">Quantity: {item.quantity}</p>
                        <p className="text-muted mb-0">{formatCurrency(itemPrice)} each</p>
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
                <h4 className="card-title mb-0">Order Summary</h4>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <div>
                    <span>Shipping</span>
                    {order.finalShipping !== null && order.finalShipping !== order.initialShipping && (
                      <small className="text-muted d-block">
                        Updated from {formatCurrency(order.initialShipping || 0)}
                      </small>
                    )}
                  </div>
                  <span>{formatCurrency(order.shipping)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total</strong>
                  <strong>{formatCurrency(order.total)}</strong>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="card mb-4">
              <div className="card-header">
                <h4 className="card-title mb-0">Order Information</h4>
              </div>
              <div className="card-body">
                <div className="row mb-2">
                  <div className="col-sm-4">
                    <strong>Order Date:</strong>
                  </div>
                  <div className="col-sm-8">
                    {formatDate(order.createdAt)}
                  </div>
                </div>
                {order.deliveredAt && (
                  <div className="row mb-2">
                    <div className="col-sm-4">
                      <strong>Delivered Date:</strong>
                    </div>
                    <div className="col-sm-8">
                      {formatDate(order.deliveredAt)}
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-sm-4">
                    <strong>Payment Status:</strong>
                  </div>
                  <div className="col-sm-8">
                    <span className={`badge ${
                      order.paymentStatus === 'PAID' ? 'badge-success' :
                      order.paymentStatus === 'PARTIAL' ? 'badge-warning' :
                      'badge-secondary'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card">
              <div className="card-body">
                <div className="d-flex gap-2 flex-wrap">
                  {/* Only allow setting shipping fee if order is not paid yet */}
                  {['PENDING', 'CONFIRMED'].includes(order.status) && 
                   order.paymentStatus === 'PENDING' && (
                    <button
                      className="btn btn-info"
                      onClick={handleUpdateShipping}
                      disabled={updateShippingMutation.isLoading}
                    >
                      <i className="fe fe-truck me-2"></i>
                      Set Shipping Fee
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
                      Update Status
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
                <h5 className="modal-title">Update Order Status</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowStatusModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Select new status for order #{order.orderNumber}:</p>
                <div className="d-grid gap-2">
                  {['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status) => (
                    <button
                      key={status}
                      className="btn btn-outline-primary"
                      onClick={() => handleStatusChange(status)}
                      disabled={updateStatusMutation.isLoading || order.status === status}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Fee Modal */}
      {showShippingModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Set Shipping Fee</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowShippingModal(false)
                    setShippingFee('')
                  }}
                ></button>
              </div>
              <form onSubmit={handleShippingSubmit}>
                <div className="modal-body">
                  <p>Set shipping fee for order #{order.orderNumber}:</p>
                  <div className="mb-3">
                    <label className="form-label">Shipping Fee ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={shippingFee}
                      onChange={(e) => setShippingFee(e.target.value)}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowShippingModal(false)
                      setShippingFee('')
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={updateShippingMutation.isLoading}
                  >
                    {updateShippingMutation.isLoading ? 'Updating...' : 'Update Shipping Fee'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PharmacyOrderDetails

