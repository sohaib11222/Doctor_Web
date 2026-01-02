import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb'
import { useCart } from '../../contexts/CartContext'
import { toast } from 'react-toastify'

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart()

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      toast.info('Item removed from cart')
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId)
    toast.info(`${productName} removed from cart`)
  }

  const subtotal = getCartTotal()
  const shipping = subtotal >= 50 ? 0 : 25
  const tax = 0
  const total = subtotal + shipping + tax

  return (
    <>
      <Breadcrumb title="Pharmacy" li1="Cart" li2="Shopping Cart" />
      <div className="content">
        <div className="container">
          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <h4>Your cart is empty</h4>
              <p className="text-muted mb-4">Add some products to your cart to continue shopping.</p>
              <Link to="/product-all" className="btn btn-primary">
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              <div className="card card-table">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover table-center mb-0">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>SKU</th>
                          <th>Price</th>
                          <th className="text-center">Quantity</th>
                          <th>Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={item._id}>
                            <td>
                              <h2 className="table-avatar">
                                <Link to={`/product-description?id=${item._id}`} className="avatar avatar-sm me-2">
                                  <img className="avatar-img" src={item.image} alt={item.name} />
                                </Link>
                              </h2>
                              <Link to={`/product-description?id=${item._id}`}>{item.name}</Link>
                            </td>
                            <td>{item.sku || 'N/A'}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td className="text-center">
                              <div className="input-group1">
                                <span className="input-group-btn">
                                  <button
                                    type="button"
                                    className="quantity-left-minus btn btn-danger btn-number"
                                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                  >
                                    <span><i className="fas fa-minus"></i></span>
                                  </button>
                                </span>
                                <input
                                  type="text"
                                  id={`quantity${item._id}`}
                                  name={`quantity${item._id}`}
                                  className="input-number"
                                  value={item.quantity}
                                  readOnly
                                />
                                <span className="input-group-btn">
                                  <button
                                    type="button"
                                    className="quantity-right-plus btn btn-success btn-number"
                                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                    disabled={item.stock && item.quantity >= item.stock}
                                  >
                                    <span><i className="fas fa-plus"></i></span>
                                  </button>
                                </span>
                              </div>
                            </td>
                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                            <td>
                              <div className="table-action">
                                <a
                                  href="#"
                                  className="btn btn-sm bg-danger-light"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleRemoveItem(item._id, item.name)
                                  }}
                                >
                                  <i className="fas fa-times"></i>
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-7 col-lg-6">
                  <div className="terms-accept">
                    <div className="custom-checkbox">
                      <input type="checkbox" id="terms_accept" defaultChecked />
                      <label htmlFor="terms_accept">I have read and accept the Terms & Conditions</label>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to clear your cart?')) {
                          clearCart()
                          toast.info('Cart cleared')
                        }
                      }}
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
                <div className="col-md-5 col-lg-6">
                  <div className="booking-total">
                    <ul className="booking-total-list">
                      <li>
                        <span>Subtotal</span>
                        <span className="total-cost">${subtotal.toFixed(2)}</span>
                      </li>
                      <li>
                        <span>Shipping</span>
                        <span className="total-cost">
                          {shipping === 0 ? (
                            <span className="text-success">Free</span>
                          ) : (
                            `$${shipping.toFixed(2)}`
                          )}
                        </span>
                      </li>
                      {tax > 0 && (
                        <li>
                          <span>Tax</span>
                          <span className="total-cost">${tax.toFixed(2)}</span>
                        </li>
                      )}
                      <li>
                        <span>Total</span>
                        <span className="total-cost">${total.toFixed(2)}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="submit-section">
                    <Link to="/product-checkout" className="btn btn-primary submit-btn w-100">
                      Proceed to Checkout
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Cart
