import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb'

const Cart = () => {
  const cartItems = [
    { id: 1, name: 'Benzaxapine Croplex', sku: '26565', price: '$19', quantity: 10, total: '$19', image: '/assets/img/products/product.jpg' },
    { id: 2, name: 'Ombinazol Bonibamol', sku: '865727', price: '$22', quantity: 10, total: '$22', image: '/assets/img/products/product1.jpg' },
    { id: 3, name: 'Dantotate Dantodazole', sku: '978656', price: '$10', quantity: 10, total: '$10', image: '/assets/img/products/product2.jpg' },
    { id: 4, name: 'Alispirox Aerorenone', sku: '543252', price: '$26', quantity: 10, total: '$26', image: '/assets/img/products/product3.jpg' },
  ]

  return (
    <>
      <Breadcrumb title="Pharmacy" li1="Cart" li2="Cart" />
      <div className="content">
        <div className="container">
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
                      <tr key={item.id}>
                        <td>
                          <h2 className="table-avatar">
                            <Link to="/product-description" className="avatar avatar-sm me-2">
                              <img className="avatar-img" src={item.image} alt="User Image" />
                            </Link>
                          </h2>
                          <Link to="/product-description">{item.name}</Link>
                        </td>
                        <td>{item.sku}</td>
                        <td>{item.price}</td>
                        <td className="text-center">
                          <div className="custom-increment cart">
                            <div className="input-group1">
                              <span className="input-group-btn">
                                <button type="button" className="quantity-left-minus btn btn-danger btn-number" data-type="minus" data-field="">
                                  <span><i className="fas fa-minus"></i></span>
                                </button>
                              </span>
                              <input type="text" id={`quantity${item.id}`} name={`quantity${item.id}`} className="input-number" defaultValue={item.quantity} />
                              <span className="input-group-btn">
                                <button type="button" className="quantity-right-plus btn btn-success btn-number" data-type="plus" data-field="">
                                  <span><i className="fas fa-plus"></i></span>
                                </button>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>{item.total}</td>
                        <td>
                          <div className="table-action">
                            <a href="javascript:void(0);" className="btn btn-sm bg-danger-light">
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
          <div className="row">
            <div className="col-md-7 col-lg-6">
              <div className="terms-accept">
                <div className="custom-checkbox">
                  <input type="checkbox" id="terms_accept" />
                  <label htmlFor="terms_accept">I have read and accept the Terms & Conditions</label>
                </div>
              </div>
            </div>
            <div className="col-md-5 col-lg-6">
              <div className="booking-total">
                <ul className="booking-total-list">
                  <li>
                    <span>Subtotal</span>
                    <span className="total-cost">$77.00</span>
                  </li>
                  <li>
                    <span>Total</span>
                    <span className="total-cost">$77.00</span>
                  </li>
                </ul>
              </div>
              <div className="submit-section">
                <Link to="/product-checkout" className="btn btn-primary submit-btn">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart

