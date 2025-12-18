import { useState } from 'react'
import { Link } from 'react-router-dom'

const OrderHistory = () => {
  const [filter, setFilter] = useState('all')

  const orders = [
    {
      id: 'ORD001',
      orderDate: '15 Nov 2024',
      items: [
        { name: 'Benzaxapine Croplex', quantity: 2, price: '$19', total: '$38' },
        { name: 'Ombinazol Bonibamol', quantity: 1, price: '$22', total: '$22' }
      ],
      total: '$60',
      status: 'Delivered',
      deliveryDate: '18 Nov 2024',
      trackingNumber: 'TRK123456789'
    },
    {
      id: 'ORD002',
      orderDate: '10 Nov 2024',
      items: [
        { name: 'Dantotate Dantodazole', quantity: 3, price: '$10', total: '$30' }
      ],
      total: '$30',
      status: 'Shipped',
      deliveryDate: '20 Nov 2024',
      trackingNumber: 'TRK987654321'
    },
    {
      id: 'ORD003',
      orderDate: '05 Nov 2024',
      items: [
        { name: 'Alispirox Aerorenone', quantity: 1, price: '$26', total: '$26' },
        { name: 'Benzaxapine Croplex', quantity: 1, price: '$19', total: '$19' }
      ],
      total: '$45',
      status: 'Delivered',
      deliveryDate: '08 Nov 2024',
      trackingNumber: 'TRK456789123'
    },
    {
      id: 'ORD004',
      orderDate: '01 Nov 2024',
      items: [
        { name: 'Ombinazol Bonibamol', quantity: 2, price: '$22', total: '$44' }
      ],
      total: '$44',
      status: 'Cancelled',
      deliveryDate: null,
      trackingNumber: null
    }
  ]

  const getStatusBadge = (status) => {
    const badges = {
      'Delivered': 'badge-success',
      'Shipped': 'badge-info',
      'Processing': 'badge-warning',
      'Cancelled': 'badge-danger',
      'Pending': 'badge-secondary'
    }
    return <span className={`badge ${badges[status] || 'badge-secondary'}`}>{status}</span>
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === filter.toLowerCase())

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
                  <div className="order-filter-tabs">
                    <button
                      className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setFilter('all')}
                    >
                      All Orders
                    </button>
                    <button
                      className={`btn btn-sm ${filter === 'delivered' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setFilter('delivered')}
                    >
                      Delivered
                    </button>
                    <button
                      className={`btn btn-sm ${filter === 'shipped' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setFilter('shipped')}
                    >
                      Shipped
                    </button>
                    <button
                      className={`btn btn-sm ${filter === 'cancelled' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setFilter('cancelled')}
                    >
                      Cancelled
                    </button>
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
                {filteredOrders.length === 0 ? (
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
                    {filteredOrders.map((order) => (
                      <div key={order.id} className="order-item mb-4 pb-4 border-bottom">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h5 className="mb-1">Order #{order.id}</h5>
                            <p className="text-muted small mb-0">
                              <i className="fe fe-calendar me-1"></i>
                              Ordered on {order.orderDate}
                            </p>
                            {order.deliveryDate && (
                              <p className="text-muted small mb-0">
                                <i className="fe fe-truck me-1"></i>
                                Delivered on {order.deliveryDate}
                              </p>
                            )}
                          </div>
                          <div className="text-end">
                            {getStatusBadge(order.status)}
                            <h5 className="mt-2 mb-0">Total: {order.total}</h5>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="order-items mb-3">
                          <h6 className="mb-2">Items:</h6>
                          <ul className="list-unstyled">
                            {order.items.map((item, index) => (
                              <li key={index} className="d-flex justify-content-between mb-2">
                                <span>
                                  {item.name} <span className="text-muted">x{item.quantity}</span>
                                </span>
                                <span className="fw-bold">{item.total}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Order Actions */}
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                          <div>
                            {order.trackingNumber && (
                              <div className="mb-2">
                                <span className="text-muted small">Tracking Number: </span>
                                <strong>{order.trackingNumber}</strong>
                              </div>
                            )}
                          </div>
                          <div className="order-actions">
                            <button className="btn btn-sm btn-outline-primary me-2">
                              <i className="fe fe-download me-1"></i>
                              Download Invoice
                            </button>
                            {order.status === 'Delivered' && (
                              <button className="btn btn-sm btn-outline-success me-2">
                                <i className="fe fe-star me-1"></i>
                                Rate Order
                              </button>
                            )}
                            {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                              <button className="btn btn-sm btn-outline-danger">
                                <i className="fe fe-x me-1"></i>
                                Cancel Order
                              </button>
                            )}
                            <Link
                              to={`/order-details/${order.id}`}
                              className="btn btn-sm btn-primary"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderHistory

