import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import { useCreateOrder } from '../../mutations'
import { toast } from 'react-toastify'

const ProductCheckout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: user?.fullName?.split(' ')[0] || '',
    lastName: user?.fullName?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    shipToDifferentAddress: false,
    shippingLine1: '',
    shippingLine2: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: 'USA',
    orderNotes: '',
    paymentMethod: 'DUMMY',
    cardName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    termsAccepted: false
  })

  const subtotal = getCartTotal()
  const shipping = 0 // Shipping will be set by pharmacy owner
  const tax = 0
  const total = subtotal + shipping + tax

  // Create order mutation
  const createOrderMutation = useCreateOrder()

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.warning('Your cart is empty')
      navigate('/product-all')
    }
  }, [cartItems, navigate])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.termsAccepted) {
      toast.error('Please accept the Terms & Conditions to continue')
      return
    }

    if (!user) {
      toast.error('Please login to complete checkout')
      navigate('/login')
      return
    }

    // Prepare order items
    const orderItems = cartItems.map(item => ({
      productId: item._id,
      quantity: item.quantity
    }))

    // Prepare shipping address if provided
    let shippingAddress = null
    if (formData.shipToDifferentAddress) {
      // Only include shipping address if all required fields are filled
      if (formData.shippingLine1?.trim() && formData.shippingCity?.trim() && 
          formData.shippingState?.trim() && formData.shippingZip?.trim()) {
        shippingAddress = {
          line1: formData.shippingLine1.trim(),
          line2: formData.shippingLine2?.trim() || undefined,
          city: formData.shippingCity.trim(),
          state: formData.shippingState.trim(),
          country: formData.shippingCountry?.trim() || 'USA',
          zip: formData.shippingZip.trim()
        }
      }
    }

    // Create order
    createOrderMutation.mutate(
      {
        items: orderItems,
        shippingAddress: shippingAddress || undefined,
        paymentMethod: formData.paymentMethod
      },
      {
        onSuccess: (data) => {
          clearCart()
          toast.success('Order created successfully! The pharmacy owner will set the shipping fee.')
          navigate(`/order-details/${data.data._id}`)
        }
      }
    )
  }

  if (cartItems.length === 0) {
    return null // Will redirect in useEffect
  }

  return (
    <>
      <Breadcrumb title="Pharmacy" li1="Checkout" li2="Checkout" />
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-7">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Billing details</h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="info-widget">
                      <h4 className="card-title">Personal Information</h4>
                      <div className="row">
                        <div className="col-md-6 col-sm-12">
                          <div className="mb-3 card-label">
                            <label className="mb-2">First Name</label>
                            <input
                              className="form-control"
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <div className="mb-3 card-label">
                            <label className="mb-2">Last Name</label>
                            <input
                              className="form-control"
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <div className="mb-3 card-label">
                            <label className="mb-2">Email</label>
                            <input
                              className="form-control"
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <div className="mb-3 card-label">
                            <label className="mb-2">Phone</label>
                            <input
                              className="form-control"
                              type="text"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      {!user && (
                        <div className="exist-customer">
                          Existing Customer? <Link to="/login">Click here to login</Link>
                        </div>
                      )}
                    </div>

                    <div className="info-widget">
                      <h4 className="card-title">Shipping Details</h4>
                      <div className="terms-accept">
                        <div className="custom-checkbox">
                          <input
                            type="checkbox"
                            id="ship_different"
                            name="shipToDifferentAddress"
                            checked={formData.shipToDifferentAddress}
                            onChange={handleInputChange}
                          />
                          <label htmlFor="ship_different">Ship to a different address?</label>
                        </div>
                      </div>
                      {formData.shipToDifferentAddress && (
                        <div className="row mt-3">
                          <div className="col-md-12 mb-3 card-label">
                            <label className="ps-0 ms-0 mb-2">Address Line 1</label>
                            <input
                              type="text"
                              className="form-control"
                              name="shippingLine1"
                              value={formData.shippingLine1 || ''}
                              onChange={handleInputChange}
                              placeholder="Street address"
                            />
                          </div>
                          <div className="col-md-12 mb-3 card-label">
                            <label className="ps-0 ms-0 mb-2">Address Line 2 (Optional)</label>
                            <input
                              type="text"
                              className="form-control"
                              name="shippingLine2"
                              value={formData.shippingLine2 || ''}
                              onChange={handleInputChange}
                              placeholder="Apartment, suite, etc."
                            />
                          </div>
                          <div className="col-md-6 mb-3 card-label">
                            <label className="ps-0 ms-0 mb-2">City</label>
                            <input
                              type="text"
                              className="form-control"
                              name="shippingCity"
                              value={formData.shippingCity || ''}
                              onChange={handleInputChange}
                              placeholder="City"
                            />
                          </div>
                          <div className="col-md-6 mb-3 card-label">
                            <label className="ps-0 ms-0 mb-2">State</label>
                            <input
                              type="text"
                              className="form-control"
                              name="shippingState"
                              value={formData.shippingState || ''}
                              onChange={handleInputChange}
                              placeholder="State"
                            />
                          </div>
                          <div className="col-md-6 mb-3 card-label">
                            <label className="ps-0 ms-0 mb-2">ZIP Code</label>
                            <input
                              type="text"
                              className="form-control"
                              name="shippingZip"
                              value={formData.shippingZip || ''}
                              onChange={handleInputChange}
                              placeholder="ZIP Code"
                            />
                          </div>
                          <div className="col-md-6 mb-3 card-label">
                            <label className="ps-0 ms-0 mb-2">Country</label>
                            <input
                              type="text"
                              className="form-control"
                              name="shippingCountry"
                              value={formData.shippingCountry || 'USA'}
                              onChange={handleInputChange}
                              placeholder="Country"
                            />
                          </div>
                        </div>
                      )}
                      <div className="mb-3 card-label">
                        <label className="ps-0 ms-0 mb-2">Order notes (Optional)</label>
                        <textarea
                          rows="5"
                          className="form-control"
                          name="orderNotes"
                          value={formData.orderNotes}
                          onChange={handleInputChange}
                          placeholder="Any special instructions for your order..."
                        />
                      </div>
                    </div>

                    <div className="payment-widget">
                      <h4 className="card-title">Payment Method</h4>

                      <div className="payment-list">
                        <label className="payment-radio credit-card-option">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="CARD"
                            checked={formData.paymentMethod === 'CARD'}
                            onChange={handleInputChange}
                          />
                          <span className="checkmark"></span>
                          Credit card
                        </label>
                        {formData.paymentMethod === 'CARD' && (
                          <div className="row mt-3">
                            <div className="col-md-6">
                              <div className="mb-3 card-label">
                                <label htmlFor="card_name">Name on Card</label>
                                <input
                                  className="form-control"
                                  id="card_name"
                                  type="text"
                                  name="cardName"
                                  value={formData.cardName}
                                  onChange={handleInputChange}
                                  required={formData.paymentMethod === 'CARD'}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3 card-label">
                                <label htmlFor="card_number">Card Number</label>
                                <input
                                  className="form-control"
                                  id="card_number"
                                  placeholder="1234  5678  9876  5432"
                                  type="text"
                                  name="cardNumber"
                                  value={formData.cardNumber}
                                  onChange={handleInputChange}
                                  required={formData.paymentMethod === 'CARD'}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="mb-3 card-label">
                                <label htmlFor="expiry_month">Expiry Month</label>
                                <input
                                  className="form-control"
                                  id="expiry_month"
                                  placeholder="MM"
                                  type="text"
                                  name="expiryMonth"
                                  value={formData.expiryMonth}
                                  onChange={handleInputChange}
                                  maxLength="2"
                                  required={formData.paymentMethod === 'CARD'}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="mb-3 card-label">
                                <label htmlFor="expiry_year">Expiry Year</label>
                                <input
                                  className="form-control"
                                  id="expiry_year"
                                  placeholder="YY"
                                  type="text"
                                  name="expiryYear"
                                  value={formData.expiryYear}
                                  onChange={handleInputChange}
                                  maxLength="2"
                                  required={formData.paymentMethod === 'CARD'}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="mb-3 card-label">
                                <label htmlFor="cvv">CVV</label>
                                <input
                                  className="form-control"
                                  id="cvv"
                                  type="text"
                                  name="cvv"
                                  value={formData.cvv}
                                  onChange={handleInputChange}
                                  maxLength="4"
                                  required={formData.paymentMethod === 'CARD'}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="payment-list">
                        <label className="payment-radio paypal-option">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="PAYPAL"
                            checked={formData.paymentMethod === 'PAYPAL'}
                            onChange={handleInputChange}
                          />
                          <span className="checkmark"></span>
                          Paypal
                        </label>
                      </div>

                      <div className="payment-list">
                        <label className="payment-radio paypal-option">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="DUMMY"
                            checked={formData.paymentMethod === 'DUMMY'}
                            onChange={handleInputChange}
                          />
                          <span className="checkmark"></span>
                          Test Payment (Dummy)
                        </label>
                      </div>

                      <div className="terms-accept">
                        <div className="custom-checkbox">
                          <input
                            type="checkbox"
                            id="terms_accept1"
                            name="termsAccepted"
                            checked={formData.termsAccepted}
                            onChange={handleInputChange}
                            required
                          />
                          <label htmlFor="terms_accept1">
                            I have read and accept <Link to="/terms-condition">Terms & Conditions</Link>
                          </label>
                        </div>
                      </div>

                      <div className="submit-section mt-4">
                        <button
                          type="submit"
                          className="btn btn-primary submit-btn"
                          disabled={createOrderMutation.isLoading}
                        >
                          {createOrderMutation.isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Creating Order...
                            </>
                          ) : (
                            'Place Order'
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-5 theiaStickySidebar">
              <div className="card booking-card">
                <div className="card-header">
                  <h3 className="card-title">Your Order</h3>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-center mb-0">
                      <tbody>
                        <tr>
                          <th>Product</th>
                          <th className="text-end">Total</th>
                        </tr>
                      </tbody>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={item._id}>
                            <td>
                              {item.name} <span className="text-muted">x{item.quantity}</span>
                            </td>
                            <td className="text-end">${(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="booking-summary pt-5">
                    <div className="booking-item-wrap">
                      <ul className="booking-date d-block pb-0">
                        <li>
                          Subtotal <span>${subtotal.toFixed(2)}</span>
                        </li>
                        <li>
                          Shipping{' '}
                          <span>
                            {shipping === 0 ? (
                              <span className="text-success">Free</span>
                            ) : (
                              `$${shipping.toFixed(2)}`
                            )}
                          </span>
                        </li>
                      </ul>
                      <ul className="booking-fee">
                        {tax > 0 && (
                          <li>
                            Tax <span>${tax.toFixed(2)}</span>
                          </li>
                        )}
                      </ul>
                      <div className="booking-total">
                        <ul className="booking-total-list">
                          <li>
                            <span>Total</span>
                            <span className="total-cost">${total.toFixed(2)}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductCheckout
