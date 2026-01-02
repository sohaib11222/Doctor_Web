import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Breadcrumb from '../../components/common/Breadcrumb'
import * as productApi from '../../api/product'
import { useCart } from '../../contexts/CartContext'
import { toast } from 'react-toastify'

const ProductAll = () => {
  const { addToCart } = useCart()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Get filters from URL params
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const sellerId = searchParams.get('sellerId') || ''
  const sellerType = searchParams.get('sellerType') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 12

  // State for filters
  const [searchTerm, setSearchTerm] = useState(search)
  const [selectedCategory, setSelectedCategory] = useState(category)

  // Fetch products with filters
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products', { search, category, sellerId, sellerType, page, limit }],
    queryFn: () => {
      const params = { search, category, page, limit }
      if (sellerId) params.sellerId = sellerId
      if (sellerType) params.sellerType = sellerType
      return productApi.listProducts(params)
    }
  })

  const products = productsData?.data?.products || []
  const pagination = productsData?.data?.pagination || { page: 1, limit, total: 0, pages: 1 }

  // Get unique categories from products
  const categories = useMemo(() => {
    const categorySet = new Set()
    products.forEach(product => {
      if (product.category) categorySet.add(product.category)
    })
    return Array.from(categorySet).sort()
  }, [products])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (searchTerm) {
      params.set('search', searchTerm)
    } else {
      params.delete('search')
    }
    params.set('page', '1')
    setSearchParams(params)
  }

  const handleCategoryChange = (cat) => {
    const params = new URLSearchParams(searchParams)
    if (cat && cat !== selectedCategory) {
      params.set('category', cat)
      setSelectedCategory(cat)
    } else {
      params.delete('category')
      setSelectedCategory('')
    }
    params.set('page', '1')
    setSearchParams(params)
  }

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddToCart = (e, product) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <>
      <Breadcrumb title="Pharmacy" li1="Products" li2="All Products" />
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-md-5 col-lg-3 col-xl-3 theiaStickySidebar">
              <div className="card search-filter">
                <div className="card-header">
                  <h4 className="card-title mb-0">Filter</h4>
                </div>
                <div className="card-body">
                  <div className="filter-widget mb-4">
                    <h4>Search</h4>
                    <form onSubmit={handleSearch}>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search products..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">
                          <i className="fas fa-search"></i>
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="filter-widget">
                    <h4>Categories</h4>
                    <div>
                      <label className="custom_check">
                        <input
                          type="checkbox"
                          checked={!selectedCategory}
                          onChange={() => handleCategoryChange('')}
                        />
                        <span className="checkmark"></span> All Categories
                      </label>
                    </div>
                    {categories.map((cat, idx) => (
                      <div key={idx}>
                        <label className="custom_check">
                          <input
                            type="checkbox"
                            checked={selectedCategory === cat}
                            onChange={() => handleCategoryChange(cat)}
                          />
                          <span className="checkmark"></span> {cat}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="btn-search mt-3">
                    <button
                      type="button"
                      className="btn w-100"
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedCategory('')
                        // Preserve sellerId and sellerType if they exist (for pharmacy-specific product views)
                        const params = new URLSearchParams()
                        if (sellerId) params.set('sellerId', sellerId)
                        if (sellerType) params.set('sellerType', sellerType)
                        setSearchParams(params)
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-7 col-lg-9 col-xl-9">
              <div className="row align-items-center pb-3">
                <div className="col-md-4 col-12 d-md-block d-none custom-short-by">
                  <h3 className="title pharmacy-title">
                    {sellerId && sellerType === 'PHARMACY' ? 'Pharmacy Products' : 'All Products'}
                  </h3>
                  <span className="sort-title">
                    Showing {products.length} of {pagination.total} products
                    {sellerId && sellerType && ' from this seller'}
                  </span>
                </div>
                <div className="col-md-8 col-12 d-md-block d-none custom-short-by">
                  <div className="sort-by pb-3">
                    <span className="sort-title">Sort by</span>
                    <span className="sortby-fliter">
                      <select className="form-select">
                        <option>Latest</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Name: A to Z</option>
                      </select>
                    </span>
                  </div>
                </div>
              </div>

              {productsLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">No products found. Try adjusting your filters.</p>
                </div>
              ) : (
                <>
                  <div className="row">
                    {products.map((product) => {
                      const productPrice = product.discountPrice || product.price
                      const originalPrice = product.discountPrice ? product.price : null
                      const productImage = product.images?.[0] || '/assets/img/products/product.jpg'
                      
                      return (
                        <div key={product._id} className="col-md-12 col-lg-4 col-xl-4 product-custom mb-4">
                          <div className="profile-widget" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <div className="doc-img" style={{ height: '250px', overflow: 'hidden', position: 'relative' }}>
                              <Link to={`/product-description?id=${product._id}`} tabIndex="-1" style={{ display: 'block', height: '100%' }}>
                                <img 
                                  className="img-fluid" 
                                  alt={product.name} 
                                  src={productImage}
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                    objectPosition: 'center'
                                  }}
                                  onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = '/assets/img/products/product.jpg'
                                  }}
                                />
                              </Link>
                              <a href="javascript:void(0)" className="fav-btn" tabIndex="-1">
                                <i className="far fa-bookmark"></i>
                              </a>
                            </div>
                            <div className="pro-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                              <h3 className="title pb-4" style={{ flex: 1 }}>
                                <Link to={`/product-description?id=${product._id}`} tabIndex="-1">{product.name}</Link>
                              </h3>
                              <div className="row align-items-center">
                                <div className="col-lg-6">
                                  <span className="price">${productPrice.toFixed(2)}</span>
                                  {originalPrice && <span className="price-strike">${originalPrice.toFixed(2)}</span>}
                                </div>
                                <div className="col-lg-6 text-end">
                                  <a
                                    href="#"
                                    className="cart-icon"
                                    onClick={(e) => handleAddToCart(e, product)}
                                    title="Add to Cart"
                                  >
                                    <i className="fas fa-shopping-cart"></i>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="row mt-4">
                      <div className="col-md-12">
                        <nav>
                          <ul className="pagination justify-content-center">
                            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                              >
                                Previous
                              </button>
                            </li>
                            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                              <li key={pageNum} className={`page-item ${page === pageNum ? 'active' : ''}`}>
                                <button
                                  className="page-link"
                                  onClick={() => handlePageChange(pageNum)}
                                >
                                  {pageNum}
                                </button>
                              </li>
                            ))}
                            <li className={`page-item ${page === pagination.pages ? 'disabled' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === pagination.pages}
                              >
                                Next
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductAll
