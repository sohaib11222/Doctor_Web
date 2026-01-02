import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Breadcrumb from '../../components/common/Breadcrumb'
import * as productApi from '../../api/product'
import { useCart } from '../../contexts/CartContext'
import { toast } from 'react-toastify'

const ProductDescription = () => {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const productId = searchParams.get('id')
  
  const [quantity, setQuantity] = useState(1)

  // Fetch product details
  const { data: productData, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productApi.getProductById(productId),
    enabled: !!productId
  })

  const product = productData?.data || productData

  useEffect(() => {
    if (product?.stock && quantity > product.stock) {
      setQuantity(product.stock)
    }
  }, [product, quantity])

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta
    if (newQuantity < 1) return
    if (product?.stock && newQuantity > product.stock) {
      toast.warning(`Only ${product.stock} items available in stock`)
      return
    }
    setQuantity(newQuantity)
  }

  const handleAddToCart = () => {
    if (!product) return
    if (product.stock === 0) {
      toast.error('Product is out of stock')
      return
    }
    addToCart(product, quantity)
    toast.success(`${quantity} x ${product.name} added to cart!`)
  }

  const handleBuyNow = () => {
    if (!product) return
    if (product.stock === 0) {
      toast.error('Product is out of stock')
      return
    }
    addToCart(product, quantity)
    navigate('/product-checkout')
  }

  if (productLoading) {
    return (
      <>
        <Breadcrumb title="Pharmacy" li1="Product Description" li2="Loading..." />
        <div className="content">
          <div className="container">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (productError || !product) {
    return (
      <>
        <Breadcrumb title="Pharmacy" li1="Product Description" li2="Not Found" />
        <div className="content">
          <div className="container">
            <div className="alert alert-danger">
              <h5>Product Not Found</h5>
              <p>The product you're looking for doesn't exist.</p>
              <Link to="/product-all" className="btn btn-primary">Browse Products</Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  const productPrice = product.discountPrice || product.price
  const originalPrice = product.discountPrice ? product.price : null
  const discountPercent = originalPrice ? Math.round(((originalPrice - productPrice) / originalPrice) * 100) : 0
  const productImage = product.images?.[0] || '/assets/img/products/product.jpg'
  const isInStock = product.stock > 0

  return (
    <>
      <Breadcrumb title="Pharmacy" li1="Product Description" li2={product.name} />
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-md-7 col-lg-9 col-xl-9">
              <div className="card">
                <div className="card-body product-description">
                  <div className="doctor-widget">
                    <div className="doc-info-left">
                      <div className="doctor-img1">
                        <img src={productImage} className="img-fluid" alt={product.name} />
                      </div>
                      <div className="doc-info-cont product-cont">
                        <h4 className="doc-name mb-2">{product.name}</h4>
                        {product.sellerId && typeof product.sellerId === 'object' && (
                          <p>
                            <span className="text-muted">Sold By </span> {product.sellerId.fullName || 'Unknown Seller'}
                          </p>
                        )}
                        <p>{product.description || 'No description available.'}</p>
                        {product.tags && product.tags.length > 0 && (
                          <div className="feature-product pt-4">
                            <span>Tags:</span>
                            <ul>
                              {product.tags.map((tag, idx) => (
                                <li key={idx}>{tag}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body pt-0">
                  <h3 className="pt-4">Product Details</h3>
                  <hr />
                  <div className="tab-content pt-3">
                    <div role="tabpanel" id="doc_overview" className="tab-pane fade show active">
                      <div className="row">
                        <div className="col-md-9">
                          <div className="widget about-widget">
                            <h4 className="widget-title">Description</h4>
                            <p>{product.description || 'No description available for this product.'}</p>
                          </div>

                          {product.category && (
                            <div className="widget awards-widget">
                              <h4 className="widget-title">Category</h4>
                              <div className="experience-box">
                                <ul className="experience-list">
                                  <li>
                                    <div className="experience-user">
                                      <div className="before-circle"></div>
                                    </div>
                                    <div className="experience-content">
                                      <div className="timeline-content">
                                        <p>{product.category}</p>
                                      </div>
                                    </div>
                                  </li>
                                  {product.subCategory && (
                                    <li>
                                      <div className="experience-user">
                                        <div className="before-circle"></div>
                                      </div>
                                      <div className="experience-content">
                                        <div className="timeline-content">
                                          <p>Subcategory: {product.subCategory}</p>
                                        </div>
                                      </div>
                                    </li>
                                  )}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-5 col-lg-3 col-xl-3 theiaStickySidebar">
              <div className="card search-filter">
                <div className="card-body">
                  <div className="clini-infos mt-0">
                    <h2>
                      ${productPrice.toFixed(2)}
                      {originalPrice && (
                        <>
                          {' '}
                          <b className="text-lg strike">${originalPrice.toFixed(2)}</b>
                          {discountPercent > 0 && (
                            <span className="text-lg text-success">
                              {' '}
                              <b>{discountPercent}% off</b>
                            </span>
                          )}
                        </>
                      )}
                    </h2>
                  </div>
                  <span className={`badge ${isInStock ? 'badge-primary' : 'badge-danger'}`}>
                    {isInStock ? `In stock (${product.stock} available)` : 'Out of stock'}
                  </span>
                  <div className="custom-increment pt-4">
                    <div className="input-group1">
                      <span className="input-group-btn float-start">
                        <button
                          type="button"
                          className="quantity-left-minus btn btn-danger btn-number"
                          onClick={() => handleQuantityChange(-1)}
                          disabled={quantity <= 1}
                        >
                          <span><i className="fas fa-minus"></i></span>
                        </button>
                      </span>
                      <input
                        type="text"
                        id="quantity"
                        name="quantity"
                        className="input-number"
                        value={quantity}
                        readOnly
                      />
                      <span className="input-group-btn float-end">
                        <button
                          type="button"
                          className="quantity-right-plus btn btn-success btn-number"
                          onClick={() => handleQuantityChange(1)}
                          disabled={!isInStock || (product.stock && quantity >= product.stock)}
                        >
                          <span><i className="fas fa-plus"></i></span>
                        </button>
                      </span>
                    </div>
                  </div>
                  <div className="clinic-details mt-4">
                    <div className="clinic-booking">
                      <button
                        className="apt-btn w-100 mb-2"
                        onClick={handleAddToCart}
                        disabled={!isInStock}
                      >
                        Add To Cart
                      </button>
                      <button
                        className="apt-btn w-100"
                        onClick={handleBuyNow}
                        disabled={!isInStock}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                  <div className="card flex-fill mt-4 mb-0">
                    <ul className="list-group list-group-flush">
                      {product.sku && (
                        <li className="list-group-item">
                          SKU <span className="float-end">{product.sku}</span>
                        </li>
                      )}
                      <li className="list-group-item">
                        Stock <span className="float-end">{product.stock || 0} units</span>
                      </li>
                      {product.category && (
                        <li className="list-group-item">
                          Category <span className="float-end">{product.category}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card search-filter">
                <div className="card-body">
                  <div className="card flex-fill mt-0 mb-0">
                    <ul className="list-group list-group-flush benifits-col">
                      <li className="list-group-item d-flex align-items-center">
                        <div>
                          <i className="fas fa-shipping-fast"></i>
                        </div>
                        <div>
                          Free Shipping<br />
                          <span className="text-sm">For orders from $50</span>
                        </div>
                      </li>
                      <li className="list-group-item d-flex align-items-center">
                        <div>
                          <i className="far fa-question-circle"></i>
                        </div>
                        <div>
                          Support 24/7<br />
                          <span className="text-sm">Call us anytime</span>
                        </div>
                      </li>
                      <li className="list-group-item d-flex align-items-center">
                        <div>
                          <i className="fas fa-hands"></i>
                        </div>
                        <div>
                          100% Safety<br />
                          <span className="text-sm">Only secure payments</span>
                        </div>
                      </li>
                      <li className="list-group-item d-flex align-items-center">
                        <div>
                          <i className="fas fa-tag"></i>
                        </div>
                        <div>
                          Hot Offers<br />
                          <span className="text-sm">Discounts up to 90%</span>
                        </div>
                      </li>
                    </ul>
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

export default ProductDescription
