import { Link } from 'react-router-dom'

const PharmacyIndex = () => {
  const deals = [
    { id: 1, name: 'Diabetes', image: '/assets/img/deals/deals-01.png' },
    { id: 2, name: 'Cardiac Care', image: '/assets/img/deals/deals-02.png' },
    { id: 3, name: 'Stomach Care', image: '/assets/img/deals/deals-03.png' },
    { id: 4, name: 'Ayurvedic', image: '/assets/img/deals/deals-04.png' },
    { id: 5, name: 'Homeopathy', image: '/assets/img/deals/deals-05.png' },
    { id: 6, name: 'Fitness', image: '/assets/img/deals/deals-06.png' },
    { id: 7, name: 'Mom & Baby', image: '/assets/img/deals/deals-07.png' },
    { id: 8, name: 'Devices', image: '/assets/img/deals/deals-08.png' },
  ]

  const categories = [
    { id: 1, name: 'Ayush', products: '400 Products', image: '/assets/img/category/categorie-01.png' },
    { id: 2, name: 'Covid Essentials', products: '924 Products', image: '/assets/img/category/categorie-02.png' },
    { id: 3, name: 'Devices', products: '450 Products', image: '/assets/img/category/categorie-03.png' },
    { id: 4, name: 'Fitness', products: '350 Products', image: '/assets/img/category/categorie-04.png' },
    { id: 5, name: 'Mom & Baby', products: '280 Products', image: '/assets/img/category/categorie-05.png' },
    { id: 6, name: 'Personal Care', products: '520 Products', image: '/assets/img/category/categorie-06.png' },
  ]

  const products = [
    { id: 1, name: 'Benzaxapine Croplex', price: '$19.00', originalPrice: '$45.00', image: '/assets/img/products/product.jpg' },
    { id: 2, name: 'Rapalac Neuronium', price: '$16.00', image: '/assets/img/products/product13.jpg' },
    { id: 3, name: 'Ombinazol Bonibamol', price: '$22.00', image: '/assets/img/products/product1.jpg' },
    { id: 4, name: 'Dantotate Dantodazole', price: '$10.00', originalPrice: '$12.00', image: '/assets/img/products/product2.jpg' },
  ]

  return (
    <>
      {/* Pharmacy Banner */}
      <section className="section pharmacy-banner">
        <div className="pharmacy-shapes">
          <div className="pharmacy-shape-left">
            <img src="/assets/img/shapes/shape-5.png" className="aos" data-aos="zoom-in" alt="Img" />
            <img src="/assets/img/shapes/shape-6.png" className="shape-six aos" data-aos="zoom-in" alt="Img" />
          </div>
          <div className="pharmacy-shape-right">
            <img src="/assets/img/shapes/shape-8.png" className="shape-eight aos" data-aos="fade-down" alt="Img" />
            <img src="/assets/img/shapes/shape-7.png" className="shape-seven aos" data-aos="fade-down" alt="Img" />
          </div>
        </div>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12">
              <div className="pharmacy-content aos" data-aos="fade-up">
                <h1>From the Leading Online Pharmacy</h1>
                <h4>& Healthcare Platform Company</h4>
                <p>Essentials Nutrition & Supplements from all over the suppliers around the World</p>
              </div>
              <div className="pharmacy-btn aos" data-aos="fade-up">
                <Link to="/pharmacy-search" className="btn">Shop Now</Link>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 aos" data-aos="fade-up">
              <div className="pharmacy-banner-img">
                <img src="/assets/img/pharmacy-img.png" className="img-fluid" alt="Pharmacy Img" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Pharmacy Banner */}

      {/* Welcome Section */}
      <section className="section welcome-section">
        <div className="container">
          <div className="welcome-grid aos" data-aos="fade-up">
            <div className="row align-items-center">
              <div className="col-md-8">
                <div className="welcome-info">
                  <div className="welcome-icon">
                    <img src="/assets/img/welcome-icon.png" alt="Welcome Icon" />
                  </div>
                  <div className="welcome-content">
                    <h5>Welcome to Doccure</h5>
                    <p>Download the app get free medicine & 50% off on your first order</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="welcome-btn">
                  <a href="javascript:void(0);" className="btn">Download App</a>
                </div>
                <div className="welcome-shapes">
                  <div className="welcome-shape-top">
                    <img src="/assets/img/shapes/shape-9.png" alt="Shape Img" />
                  </div>
                  <div className="welcome-shape-bottom">
                    <img src="/assets/img/shapes/shape-10.png" alt="Shape Img" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 d-flex aos" data-aos="fade-up">
              <div className="shop-card suppliment-card">
                <div className="row align-items-center">
                  <div className="col-md-7">
                    <div className="shop-content">
                      <h5>10% Cashback on Dietary <span>Suppliments</span></h5>
                      <p>Code: CARE12</p>
                      <Link to="/product-all" className="btn">Shop Now</Link>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="shop-img">
                      <img src="/assets/img/products/product-16.png" alt="Product Img" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 d-flex aos" data-aos="fade-up">
              <div className="shop-card freshner-card">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="shop-content">
                      <h5><span>Say yes</span> to New Throat Freshner</h5>
                      <h6>Refresh your day the fruity way</h6>
                      <Link to="/product-all" className="btn">Shop Now</Link>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="shop-img">
                      <img src="/assets/img/products/product-17.png" alt="Product Img" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 d-flex aos" data-aos="fade-up">
              <div className="shop-card product-worth-card">
                <div className="row align-items-center">
                  <div className="col-md-7">
                    <div className="shop-content">
                      <h5>Get a Product Worth <span>1000</span> in a Pack</h5>
                      <p>Code: CARE12</p>
                      <Link to="/product-all" className="btn">Shop Now</Link>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="shop-img">
                      <img src="/assets/img/products/product-18.png" alt="Product Img" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Welcome Section */}

      {/* Deals Section */}
      <section className="section deals-section">
        <div className="container">
          <div className="pharmacy-section-header aos" data-aos="fade-up">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="pharmacy-title">
                  <h4>Great deals on top picks</h4>
                </div>
              </div>
              <div className="col-md-6">
                <div className="pharmacy-title-link">
                  <Link to="/product-all">View All <i className="fa-solid fa-arrow-right"></i></Link>
                </div>
              </div>
            </div>
          </div>
          <div className="deals-list">
            <ul className="nav">
              {deals.map((deal) => (
                <li key={deal.id}>
                  <div className="deals-grid aos" data-aos="fade-up">
                    <div className="deals-box">
                      <img src={deal.image} alt="Deals Img" />
                    </div>
                    <div className="deals-content">
                      <Link to="/product-all">{deal.name}</Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      {/* /Deals Section */}

      {/* Categories Section */}
      <section className="section categorie-section">
        <div className="container">
          <div className="pharmacy-section-header aos" data-aos="fade-up">
            <div className="row">
              <div className="col-md-12">
                <div className="pharmacy-title mb-0">
                  <h4>Shop Popular Categories</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="categorie-info">
            <div className="row">
              {categories.map((category) => (
                <div key={category.id} className="col-xl-2 col-lg-3 col-md-4 d-flex aos" data-aos="fade-up">
                  <div className="categorie-grid flex-fill">
                    <div className="categorie-img">
                      <Link to="/product-all">
                        <img src={category.image} alt="Categorie Img" />
                      </Link>
                    </div>
                    <div className="categorie-content">
                      <h5>
                        <Link to="/product-all">{category.name}</Link>
                      </h5>
                      <p>{category.products}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* /Categories Section */}

      {/* Products Section */}
      <section className="section product-section">
        <div className="container">
          <div className="pharmacy-section-header aos" data-aos="fade-up">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="pharmacy-title">
                  <h4>Featured Products</h4>
                </div>
              </div>
              <div className="col-md-6">
                <div className="pharmacy-title-link">
                  <Link to="/product-all">View All <i className="fa-solid fa-arrow-right"></i></Link>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {products.map((product) => (
              <div key={product.id} className="col-md-12 col-lg-3 col-xl-3 product-custom">
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
      </section>
      {/* /Products Section */}
    </>
  )
}

export default PharmacyIndex

