import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePharmacyOrders } from '../../queries'
import { useUpdateOrderStatus, useUpdateShippingFee } from '../../mutations'
import { toast } from 'react-toastify'

const PharmacyOrders = () => {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showShippingModal, setShowShippingModal] = useState(false)
  const [shippingFee, setShippingFee] = useState('')
  const limit = 10

  const queryParams = useMemo(() => {
    const params = { page, limit }
    if (statusFilter) params.status = statusFilter
    return params
  }, [statusFilter, page])

  const { data: ordersResponse, isLoading, error, refetch } = usePharmacyOrders(queryParams)
  
  // Fetch all orders for counts
  const { data: allOrdersResponse } = usePharmacyOrders({ page: 1, limit: 1000 })

  const orders = useMemo(() => {
    if (!ordersResponse) return []
    // Handle both response.data and direct data (axios interceptor already returns response.data)
    const responseData = ordersResponse.data || ordersResponse
    return Array.isArray(responseData) ? responseData : (responseData.orders || [])
  }, [ordersResponse])

  // Calculate status counts
  const statusCounts = useMemo(() => {
    if (!allOrdersResponse) return {}
    // Handle both response.data and direct data (axios interceptor already returns response.data)
    const responseData = allOrdersResponse.data || allOrdersResponse
    const allOrders = Array.isArray(responseData) ? responseData : (responseData.orders || [])
    
    const counts = {
      'ALL': allOrders.length,
      'PENDING': 0,
      'CONFIRMED': 0,
      'PROCESSING': 0,
      'SHIPPED': 0,
      'DELIVERED': 0,
      'CANCELLED': 0,
    }
    
    allOrders.forEach((order) => {
      const status = order.status
      if (counts.hasOwnProperty(status)) {
        counts[status]++
      }
    })
    
    return counts
  }, [allOrdersResponse])

  const updateStatusMutation = useUpdateOrderStatus()
  const updateShippingMutation = useUpdateShippingFee()

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order)
    setShowStatusModal(true)
  }

  const handleUpdateShipping = (order) => {
    setSelectedOrder(order)
    setShippingFee(order.shipping?.toString() || '0')
    setShowShippingModal(true)
  }

  const handleStatusChange = (status) => {
    if (!selectedOrder) return
    updateStatusMutation.mutate(
      { orderId: selectedOrder._id, status },
      {
        onSuccess: () => {
          setShowStatusModal(false)
          setSelectedOrder(null)
          refetch()
        }
      }
    )
  }

  const handleShippingSubmit = (e) => {
    e.preventDefault()
    if (!selectedOrder) return
    
    const fee = parseFloat(shippingFee)
    if (isNaN(fee) || fee < 0) {
      toast.error('Please enter a valid shipping fee')
      return
    }

    updateShippingMutation.mutate(
      { orderId: selectedOrder._id, shippingFee: fee },
      {
        onSuccess: () => {
          setShowShippingModal(false)
          setSelectedOrder(null)
          setShippingFee('')
          refetch()
        }
      }
    )
  }

  if (isLoading && page === 1) {
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
                <p className="mt-3">Loading orders...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar"></div>
            <div className="col-lg-12 col-xl-12">
              <div className="text-center py-5">
                <i className="fe fe-alert-circle" style={{ fontSize: '64px', color: '#dc3545' }}></i>
                <h5 className="mt-3">Error Loading Orders</h5>
                <p className="text-muted">{error.message || 'Failed to load orders'}</p>
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

  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar"></div>
          <div className="col-lg-12 col-xl-12">
            <div className="dashboard-header">
              <h3>Pharmacy Orders</h3>
            </div>

            {/* Filter Tabs */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="order-filter-tabs d-flex flex-wrap gap-2">
                  <button
                    className={`btn btn-sm ${statusFilter === '' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => {
                      setStatusFilter('')
                      setPage(1)
                    }}
                  >
                    All Orders {statusCounts['ALL'] > 0 && <span className="badge bg-light text-dark ms-1">{statusCounts['ALL']}</span>}
                  </button>
                  {['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                    <button
                      key={status}
                      className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => {
                        setStatusFilter(status)
                        setPage(1)
                      }}
                    >
                      {status} {statusCounts[status] > 0 && <span className="badge bg-light text-dark ms-1">{statusCounts[status]}</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="card">
              <div className="card-body">
                {orders.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fe fe-package" style={{ fontSize: '64px', color: '#dee2e6' }}></i>
                    <h5 className="mt-3">No orders found</h5>
                    <p className="text-muted">You don't have any orders yet.</p>
                  </div>
                ) : (
                  <div className="order-list">
                    {orders.map((order) => {
                      const patient = typeof order.patientId === 'object' ? order.patientId : null
                      const patientName = patient?.fullName || 'Unknown Patient'
                      const firstItem = order.items?.[0]
                      const product = typeof firstItem?.productId === 'object' ? firstItem.productId : null
                      
                      return (
                        <div key={order._id} className="order-item mb-4 pb-4 border-bottom">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h5 className="mb-1">Order #{order.orderNumber}</h5>
                              <p className="text-muted small mb-0">
                                <i className="fe fe-user me-1"></i>
                                {patientName}
                              </p>
                              <p className="text-muted small mb-0">
                                <i className="fe fe-calendar me-1"></i>
                                Ordered on {formatDate(order.createdAt)}
                              </p>
                              {order.deliveredAt && (
                                <p className="text-muted small mb-0">
                                  <i className="fe fe-truck me-1"></i>
                                  Delivered on {formatDate(order.deliveredAt)}
                                </p>
                              )}
                            </div>
                            <div className="text-end">
                              {getStatusBadge(order.status)}
                              <h5 className="mt-2 mb-0">Total: {formatCurrency(order.total)}</h5>
                              <p className="text-muted small mb-0 mt-1">
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

                          {/* Order Items */}
                          <div className="order-items mb-3">
                            <h6 className="mb-2">Items ({order.items?.length || 0}):</h6>
                            <ul className="list-unstyled">
                              {order.items?.slice(0, 3).map((item, index) => {
                                const product = typeof item.productId === 'object' ? item.productId : null
                                const productName = product?.name || 'Product'
                                return (
                                  <li key={index} className="d-flex justify-content-between mb-2">
                                    <span>
                                      {productName} <span className="text-muted">x{item.quantity}</span>
                                    </span>
                                    <span className="fw-bold">{formatCurrency(item.total)}</span>
                                  </li>
                                )
                              })}
                              {order.items?.length > 3 && (
                                <li className="text-muted">
                                  +{order.items.length - 3} more item(s)
                                </li>
                              )}
                            </ul>
                          </div>

                          {/* Order Actions */}
                          <div className="d-flex align-items-center justify-content-end flex-wrap gap-2">
                            <Link
                              to={`/pharmacy-order-details/${order._id}`}
                              className="btn btn-sm btn-primary"
                            >
                              <i className="fe fe-eye me-1"></i>
                              View Details
                            </Link>
                            {/* Only allow setting shipping fee if order is not paid yet */}
                            {['PENDING', 'CONFIRMED'].includes(order.status) && 
                             order.paymentStatus === 'PENDING' && (
                              <button
                                className="btn btn-sm btn-info"
                                onClick={() => handleUpdateShipping(order)}
                                disabled={updateShippingMutation.isLoading}
                              >
                                <i className="fe fe-truck me-1"></i>
                                Set Shipping
                              </button>
                            )}
                            {/* Only allow updating status if order is paid */}
                            {order.paymentStatus === 'PAID' && 
                             ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'].includes(order.status) && (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleUpdateStatus(order)}
                                disabled={updateStatusMutation.isLoading}
                              >
                                <i className="fe fe-edit me-1"></i>
                                Update Status
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Pagination */}
            {ordersResponse?.data?.pagination && ordersResponse.data.pagination.pages > 1 && (
              <div className="card mt-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-0">
                        Showing page {ordersResponse.data.pagination.page} of {ordersResponse.data.pagination.pages}
                      </p>
                    </div>
                    <div>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setPage(p => p + 1)}
                        disabled={page >= ordersResponse.data.pagination.pages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Order Status</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowStatusModal(false)
                    setSelectedOrder(null)
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>Select new status for order #{selectedOrder.orderNumber}:</p>
                <div className="d-grid gap-2">
                  {['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status) => (
                    <button
                      key={status}
                      className="btn btn-outline-primary"
                      onClick={() => handleStatusChange(status)}
                      disabled={updateStatusMutation.isLoading || selectedOrder.status === status}
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
      {showShippingModal && selectedOrder && (
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
                    setSelectedOrder(null)
                    setShippingFee('')
                  }}
                ></button>
              </div>
              <form onSubmit={handleShippingSubmit}>
                <div className="modal-body">
                  <p>Set shipping fee for order #{selectedOrder.orderNumber}:</p>
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
                      setSelectedOrder(null)
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

export default PharmacyOrders

