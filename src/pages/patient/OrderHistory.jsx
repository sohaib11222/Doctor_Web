import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePatientOrders } from '../../queries'
import { useCancelOrder } from '../../mutations'
import { toast } from 'react-toastify'

const OrderHistory = () => {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const limit = 10

  const queryParams = useMemo(() => {
    const params = { page, limit }
    if (statusFilter) params.status = statusFilter
    return params
  }, [statusFilter, page])

  const { data: ordersResponse, isLoading, error, refetch } = usePatientOrders(queryParams)
  
  // Fetch all orders for counts
  const { data: allOrdersResponse } = usePatientOrders({ page: 1, limit: 1000 })

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

  const cancelOrderMutation = useCancelOrder()

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

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrderMutation.mutate(orderId, {
        onSuccess: () => {
          refetch()
        }
      })
    }
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
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* PatientSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            <div className="dashboard-header">
              <h3>Order History</h3>
            </div>

            {/* Filter Tabs */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between flex-wrap">
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
                  <Link to="/pharmacy-index" className="btn btn-primary btn-sm">
                    <i className="fe fe-shopping-cart me-2"></i>
                    Continue Shopping
                  </Link>
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
                    <p className="text-muted">You haven't placed any orders yet.</p>
                    <Link to="/pharmacy-index" className="btn btn-primary mt-3">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="order-list">
                    {orders.map((order) => {
                      const pharmacy = typeof order.pharmacyId === 'object' ? order.pharmacyId : null
                      const pharmacyName = pharmacy?.name || 'Pharmacy'
                      const firstItem = order.items?.[0]
                      const product = typeof firstItem?.productId === 'object' ? firstItem.productId : null
                      
                      return (
                        <div key={order._id} className="order-item mb-4 pb-4 border-bottom">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h5 className="mb-1">Order #{order.orderNumber}</h5>
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
                              <p className="text-muted small mb-0">
                                <i className="fe fe-store me-1"></i>
                                {pharmacyName}
                              </p>
                            </div>
                            <div className="text-end">
                              {getStatusBadge(order.status)}
                              <h5 className="mt-2 mb-0">Total: {formatCurrency(order.total)}</h5>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="order-items mb-3">
                            <h6 className="mb-2">Items ({order.items?.length || 0}):</h6>
                            <ul className="list-unstyled">
                              {order.items?.map((item, index) => {
                                const product = typeof item.productId === 'object' ? item.productId : null
                                const productName = product?.name || 'Product'
                                const itemPrice = item.discountPrice || item.price
                                return (
                                  <li key={index} className="d-flex justify-content-between mb-2">
                                    <span>
                                      {productName} <span className="text-muted">x{item.quantity}</span>
                                    </span>
                                    <span className="fw-bold">{formatCurrency(item.total)}</span>
                                  </li>
                                )
                              })}
                            </ul>
                          </div>

                          {/* Order Actions */}
                          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                            <div>
                              {order.paymentStatus === 'PENDING' && order.finalShipping === null && (
                                <div className="mb-2">
                                  <span className="badge bg-info text-white">Processing...</span>
                                  <small className="text-muted d-block mt-1">Waiting for shipping fee</small>
                                </div>
                              )}
                            </div>
                            <div className="order-actions">
                              {(order.paymentStatus === 'PENDING' || order.paymentStatus === 'PARTIAL') && 
                               order.finalShipping !== null && order.finalShipping !== undefined && (
                                <Link
                                  to={`/order-details/${order._id}`}
                                  className="btn btn-sm btn-success me-2"
                                >
                                  <i className="fe fe-credit-card me-1"></i>
                                  Pay Now
                                </Link>
                              )}
                              {(order.status === 'PENDING' || order.status === 'CONFIRMED') && 
                               order.paymentStatus === 'PENDING' && (
                                <button 
                                  className="btn btn-sm btn-outline-danger me-2"
                                  onClick={() => handleCancelOrder(order._id)}
                                  disabled={cancelOrderMutation.isLoading}
                                >
                                  <i className="fe fe-x me-1"></i>
                                  Cancel Order
                                </button>
                              )}
                              <Link
                                to={`/order-details/${order._id}`}
                                className="btn btn-sm btn-primary"
                              >
                                <i className="fe fe-eye me-1"></i>
                                View Details
                              </Link>
                            </div>
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
    </div>
  )
}

export default OrderHistory
