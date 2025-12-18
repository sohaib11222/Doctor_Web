import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb'

const ProductCheckout = () => {
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
                  <form action="/payment-success">
                    <div className="info-widget">
                      <h4 className="card-title">Personal Information</h4>
                      <div className="row">
                        <div className="col-md-6 col-sm-12">
                          <div className="mb-3 card-label">
                            <label className="mb-2">First Name</label>
                            <input className="form-control" type="text" />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <div className="mb-3 card-label">
                            <label className="mb-2">Last Name</label>
                            <input className="form-control" type="text" />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <div className="mb-3 card-label">
                            <label className="mb-2">Email</label>
                            <input className="form-control" type="email" />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <div className="mb-3 card-label">
                            <label className="mb-2">Phone</label>
                            <input className="form-control" type="text" />
                          </div>
                        </div>
                      </div>
                      <div className="exist-customer">
                        Existing Customer? <a href="javascript:;">Click here to login</a>
                      </div>
                    </div>

                    <div className="info-widget">
                      <h4 className="card-title">Shipping Details</h4>
                      <div className="terms-accept">
                        <div className="custom-checkbox">
                          <input type="checkbox" id="terms_accept" />
                          <label htmlFor="terms_accept">Ship to a different address?</label>
                        </div>
                      </div>
                      <div className="mb-3 card-label">
                        <label className="ps-0 ms-0 mb-2">Order notes (Optional)</label>
                        <textarea rows="5" className="form-control" name="shipping"></textarea>
                      </div>
                    </div>

                    <div className="payment-widget">
                      <h4 className="card-title">Payment Method</h4>

                      <div className="payment-list">
                        <label className="payment-radio credit-card-option">
                          <input type="radio" name="radio" defaultChecked />
                          <span className="checkmark"></span>
                          Credit card
                        </label>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3 card-label">
                              <label htmlFor="card_name">Name on Card</label>
                              <input className="form-control" id="card_name" type="text" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3 card-label">
                              <label htmlFor="card_number">Card Number</label>
                              <input className="form-control" id="card_number" placeholder="1234  5678  9876  5432" type="text" />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3 card-label">
                              <label htmlFor="expiry_month">Expiry Month</label>
                              <input className="form-control" id="expiry_month" placeholder="MM" type="text" />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3 card-label">
                              <label htmlFor="expiry_year">Expiry Year</label>
                              <input className="form-control" id="expiry_year" placeholder="YY" type="text" />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3 card-label">
                              <label htmlFor="cvv">CVV</label>
                              <input className="form-control" id="cvv" type="text" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="payment-list">
                        <label className="payment-radio paypal-option">
                          <input type="radio" name="radio" />
                          <span className="checkmark"></span>
                          Paypal
                        </label>
                      </div>

                      <div className="terms-accept">
                        <div className="custom-checkbox">
                          <input type="checkbox" id="terms_accept1" />
                          <label htmlFor="terms_accept1">
                            I have read and accept <Link to="/terms-condition">Terms & Conditions</Link>
                          </label>
                        </div>
                      </div>

                      <div className="submit-section mt-4">
                        <button type="submit" className="btn btn-primary submit-btn">
                          Confirm and Pay
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
                        <tr>
                          <td>Safi Natural Blood Purifier Syrup 200 ml Manufactured By Hamdard (Wakf) Laboratories</td>
                          <td className="text-end">$200</td>
                        </tr>
                        <tr>
                          <td>Safi Natural Blood Purifier Syrup 200 ml</td>
                          <td className="text-end">$200</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="booking-summary pt-5">
                    <div className="booking-item-wrap">
                      <ul className="booking-date d-block pb-0">
                        <li>
                          Subtotal <span>$5,877.00</span>
                        </li>
                        <li>
                          Shipping <span>$25.00</span>
                        </li>
                      </ul>
                      <ul className="booking-fee">
                        <li>
                          Tax <span>$0.00</span>
                        </li>
                      </ul>
                      <div className="booking-total">
                        <ul className="booking-total-list">
                          <li>
                            <span>Total</span>
                            <span className="total-cost">$160</span>
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

