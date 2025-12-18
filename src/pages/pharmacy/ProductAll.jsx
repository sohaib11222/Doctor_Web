import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb'

const ProductAll = () => {
  const products = [
    { id: 1, name: 'Benzaxapine Croplex', price: '$19.00', originalPrice: '$45.00', image: '/assets/img/products/product.jpg' },
    { id: 2, name: 'Rapalac Neuronium', price: '$16.00', image: '/assets/img/products/product13.jpg' },
    { id: 3, name: 'Ombinazol Bonibamol', price: '$22.00', image: '/assets/img/products/product1.jpg' },
    { id: 4, name: 'Dantotate Dantodazole', price: '$10.00', originalPrice: '$12.00', image: '/assets/img/products/product2.jpg' },
    { id: 5, name: 'Acetrace Amionel', price: '$7.00', image: '/assets/img/products/product12.jpg' },
    { id: 6, name: 'Ergorinex Caffeigestin', price: '$15.00', image: '/assets/img/products/product11.jpg' },
    { id: 7, name: 'Alispirox Aerorenone', price: '$26.00', image: '/assets/img/products/product3.jpg' },
    { id: 8, name: 'Product Name 8', price: '$18.00', image: '/assets/img/products/product4.jpg' },
  ]

  const categories = [
    'Family Care',
    'Skin Care',
    'Hair Care',
    'Lip Care',
    "Men's Care",
    "Women's Care",
    'Baby care',
  ]

  return (
    <>
      <Breadcrumb title="Pharmacy" li1="Pain Relief" li2="Pain Relief" />
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-md-5 col-lg-3 col-xl-3 theiaStickySidebar">
              <div className="card search-filter">
                <div className="card-header">
                  <h4 className="card-title mb-0">Filter</h4>
                </div>
                <div className="card-body">
                  <div className="filter-widget">
                    <h4>Categories</h4>
                    {categories.map((category, idx) => (
                      <div key={idx}>
                        <label className="custom_check">
                          <input type="checkbox" name="gender_type" defaultChecked={idx === 0} />
                          <span className="checkmark"></span> {category}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="btn-search">
                    <button type="button" className="btn w-100">Search</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-7 col-lg-9 col-xl-9">
              <div className="row align-items-center pb-3">
                <div className="col-md-4 col-12 d-md-block d-none custom-short-by">
                  <h3 className="title pharmacy-title">Medlife Medical</h3>
                  <p className="doc-location mb-2 text-ellipse pharmacy-location">
                    <i className="fas fa-map-marker-alt me-1"></i> 96 Red Hawk Road Cyrus, MN 56323
                  </p>
                  <span className="sort-title">Showing 6 of 98 products</span>
                </div>
                <div className="col-md-8 col-12 d-md-block d-none custom-short-by">
                  <div className="sort-by pb-3">
                    <span className="sort-title">Sort by</span>
                    <span className="sortby-fliter">
                      <select className="form-select">
                        <option>Select</option>
                        <option className="sorting">Rating</option>
                        <option className="sorting">Popular</option>
                        <option className="sorting">Latest</option>
                        <option className="sorting">Free</option>
                      </select>
                    </span>
                  </div>
                </div>
              </div>

              <div className="row">
                {products.map((product) => (
                  <div key={product.id} className="col-md-12 col-lg-4 col-xl-4 product-custom">
                    <div className="profile-widget">
                      <div className="doc-img">
                        <Link to="/product-description" tabIndex="-1">
                          <img className="img-fluid" alt="Product image" src={product.image} />
                        </Link>
                        <a href="javascript:void(0)" className="fav-btn" tabIndex="-1">
                          <i className="far fa-bookmark"></i>
                        </a>
                      </div>
                      <div className="pro-content">
                        <h3 className="title pb-4">
                          <Link to="/product-description" tabIndex="-1">{product.name}</Link>
                        </h3>
                        <div className="row align-items-center">
                          <div className="col-lg-6">
                            <span className="price">{product.price}</span>
                            {product.originalPrice && <span className="price-strike">{product.originalPrice}</span>}
                          </div>
                          <div className="col-lg-6 text-end">
                            <Link to="/cart" className="cart-icon">
                              <i className="fas fa-shopping-cart"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductAll

