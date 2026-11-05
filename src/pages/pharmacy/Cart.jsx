import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb'
import { useCart } from '../../contexts/CartContext'
import { toast } from 'react-toastify'
import { getImageUrl } from '../../utils/imageUtils'
import { useLanguage } from '../../contexts/LanguageContext'

const Cart = () => {
  const { translateText: tr } = useLanguage()
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart()

  const handleQuantityChange = (productId, variantId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, variantId)
      toast.info(tr('Item removed from cart'))
    } else {
      updateQuantity(productId, newQuantity, variantId)
    }
  }

  const handleRemoveItem = (productId, variantId, productName) => {
    removeFromCart(productId, variantId)
    toast.info(`${productName} ${tr('removed from cart')}`)
  }

  const subtotal = getCartTotal()
  const tax = 0
  const total = subtotal + tax

  return (
    <>
      <Breadcrumb title="Pharmacy" li1="Cart" li2="Shopping Cart" />
      <div className="content">
        <div className="container">
          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <h4>{tr('Your cart is empty')}</h4>
              <p className="text-muted mb-4">{tr('Add some products to your cart to continue shopping.')}</p>
              <Link to="/product-all" className="btn btn-primary">
                {tr('Browse Products')}
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
                          <th>{tr('Product')}</th>
                          <th>{tr('SKU')}</th>
                          <th>{tr('Price')}</th>
                          <th className="text-center">{tr('Quantity')}</th>
                          <th>{tr('Total')}</th>
                          <th>{tr('Action')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={item.cartItemId || `${item._id}:${item.variantId || ''}`}>
                            <td>
                              <h2 className="table-avatar">
                                <Link to={`/product-description?id=${item._id}`} className="avatar avatar-sm me-2">
                                  <img className="avatar-img" src={getImageUrl(item.image, '/assets/img/products/product.jpg')} alt={item.name} />
                                </Link>
                              </h2>
                              <Link to={`/product-description?id=${item._id}${item.variantId ? `&variantId=${item.variantId}` : ''}`}>{item.name}</Link>
                              {item.variantName && <div className="small text-muted">{item.variantName}</div>}
                            </td>
                            <td>{item.sku || tr('N/A')}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td className="text-center">
                              <div className="input-group1 cart-qty-stepper">
                                <span className="input-group-btn">
                                  <button
                                    type="button"
                                    className="quantity-left-minus btn btn-danger btn-number"
                                    onClick={() => handleQuantityChange(item._id, item.variantId, item.quantity - 1)}
                                  >
                                    <span><i className="fas fa-minus"></i></span>
                                  </button>
                                </span>
                                <input
                                  type="text"
                                  id={`quantity${item.cartItemId || item._id}`}
                                  name={`quantity${item.cartItemId || item._id}`}
                                  className="input-number cart-qty-value"
                                  value={item.quantity}
                                  readOnly
                                />
                                <span className="input-group-btn">
                                  <button
                                    type="button"
                                    className="quantity-right-plus btn btn-success btn-number"
                                    onClick={() => handleQuantityChange(item._id, item.variantId, item.quantity + 1)}
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
                                    handleRemoveItem(item._id, item.variantId, item.name)
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
                      <label htmlFor="terms_accept">{tr('I have read and accept the Terms & Conditions')}</label>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => {
                        if (window.confirm(tr('Are you sure you want to clear your cart?'))) {
                          clearCart()
                          toast.info(tr('Cart cleared'))
                        }
                      }}
                    >
                      {tr('Clear Cart')}
                    </button>
                  </div>
                </div>
                <div className="col-md-5 col-lg-6">
                  <div className="booking-total">
                    <ul className="booking-total-list">
                      <li>
                        <span>{tr('Subtotal')}</span>
                        <span className="total-cost">${subtotal.toFixed(2)}</span>
                      </li>
                      <li>
                        <span>{tr('Shipping')}</span>
                        <span className="total-cost">
                           {tr('Set by seller after request')}
                        </span>
                      </li>
                       <li className="small text-muted">
                         {tr('Your pharmacy or parapharmacy will send the shipping fee and delivery commitment before payment.')}
                       </li>
                      {tax > 0 && (
                        <li>
                          <span>{tr('Tax')}</span>
                          <span className="total-cost">${tax.toFixed(2)}</span>
                        </li>
                      )}
                      <li>
                        <span>{tr('Total')}</span>
                        <span className="total-cost">${total.toFixed(2)}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="submit-section">
                    <Link to="/product-checkout" className="btn btn-primary submit-btn w-100">
                      {tr('Proceed to Checkout')}
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
