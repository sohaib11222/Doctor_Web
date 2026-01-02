import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useOrder } from '../../queries'
import { usePayForOrder } from '../../mutations'
import { toast } from 'react-toastify'
import BASE_URL from '../../utils/apiConfig'

const OrderDetails = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('DUMMY')

  const { data: orderResponse, isLoading, error, refetch } = useOrder(orderId)
  const payMutation = usePayForOrder()

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

  const handlePay = () => {
    if (!order) return

    const amountToPay = order.requiresPaymentUpdate && order.initialTotal
      ? order.total - order.initialTotal
      : order.total

    if (window.confirm(`Pay ${formatCurrency(amountToPay)} for this order?`)) {
      payMutation.mutate(
        { orderId: order._id, paymentMethod },
        {
          onSuccess: () => {
            refetch()
            toast.success('Payment processed successfully!')
          }
        }
      )
    }
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

  const pharmacy = typeof order.pharmacyId === 'object' ? order.pharmacyId : null
  const pharmacyName = pharmacy?.name || 'Pharmacy'
  const shippingAddress = order.shippingAddress
  const amountToPay = order.requiresPaymentUpdate && order.initialTotal
    ? order.total - order.initialTotal
    : order.total
  const showPaymentButton = (order.paymentStatus === 'PENDING' || order.paymentStatus === 'PARTIAL') &&
    order.finalShipping !== null && order.finalShipping !== undefined

  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar"></div>
          <div className="col-lg-12 col-xl-12">
            <div className="dashboard-header d-flex justify-content-between align-items-center">
              <h3>Order Details</h3>
              <Link to="/order-history" className="btn btn-outline-primary btn-sm">
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
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status Alerts */}
            {order.requiresPaymentUpdate && (
              <div className="alert alert-warning" role="alert">
                <i className="fe fe-info me-2"></i>
                <strong>Shipping Fee Updated</strong>
                <p className="mb-0 mt-2">
                  The shipping fee has been updated. Please pay the additional {formatCurrency(amountToPay)} to proceed.
                </p>
              </div>
            )}
            {(order.finalShipping === null || order.finalShipping === undefined) && (
              <div className="alert alert-info" role="alert">
                <i className="fe fe-info me-2"></i>
                <strong>Waiting for Shipping Fee</strong>
                <p className="mb-0 mt-2">
                  The pharmacy owner is setting the shipping fee. You will be able to pay once the shipping fee is confirmed.
                </p>
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
                {order.requiresPaymentUpdate && order.initialTotal && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>Already Paid</span>
                    <span>{formatCurrency(order.initialTotal)}</span>
                  </div>
                )}
                <hr />
                {order.requiresPaymentUpdate ? (
                  <div className="d-flex justify-content-between">
                    <strong>Amount Due</strong>
                    <strong className="text-warning">{formatCurrency(amountToPay)}</strong>
                  </div>
                ) : (
                  <div className="d-flex justify-content-between">
                    <strong>Total</strong>
                    <strong>{formatCurrency(order.total)}</strong>
                  </div>
                )}
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
                    <strong>Pharmacy:</strong>
                  </div>
                  <div className="col-sm-8">
                    {pharmacyName}
                  </div>
                </div>
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

            {/* Payment Section */}
            {showPaymentButton && (
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title mb-0">Payment</h4>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <select
                      className="form-select"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="DUMMY">Test Payment (Dummy)</option>
                      <option value="CARD">Credit Card</option>
                      <option value="PAYPAL">PayPal</option>
                    </select>
                  </div>
                  <button
                    className="btn btn-primary btn-lg w-100"
                    onClick={handlePay}
                    disabled={payMutation.isLoading}
                  >
                    {payMutation.isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Processing...
                      </>
                    ) : (
                      `Pay ${formatCurrency(amountToPay)}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails

