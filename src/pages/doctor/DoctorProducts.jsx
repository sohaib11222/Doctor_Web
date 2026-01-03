import { useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import * as productApi from '../../api/product'
import * as pharmacyApi from '../../api/pharmacy'
import api from '../../api/axios'

const DoctorProducts = () => {
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchFilter, setSearchFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    sku: '',
    discountPrice: '',
    category: '',
    subCategory: '',
    tags: '',
    isActive: true,
    images: []
  })
  const [imageFiles, setImageFiles] = useState([])
  const [showPharmacyModal, setShowPharmacyModal] = useState(false)
  const [pharmacyFormData, setPharmacyFormData] = useState({
    name: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      country: '',
      zip: ''
    },
    location: {
      lat: '',
      lng: ''
    }
  })

  // Fetch doctor's pharmacy (if exists)
  const { data: doctorPharmacyResponse, refetch: refetchPharmacy } = useQuery({
    queryKey: ['doctor-pharmacy', user?._id],
    queryFn: () => pharmacyApi.listPharmacies({ ownerId: user?._id, limit: 1 }),
    enabled: !!user?._id
  })
  const doctorPharmacy = useMemo(() => {
    if (!doctorPharmacyResponse) return null
    const responseData = doctorPharmacyResponse.data || doctorPharmacyResponse
    const pharmacies = Array.isArray(responseData) ? responseData : (responseData.pharmacies || [])
    return pharmacies.length > 0 ? pharmacies[0] : null
  }, [doctorPharmacyResponse])

  // Build query params - show only this doctor's products
  // Doctor products are linked to their pharmacy with sellerId = pharmacy.ownerId (which is doctor's userId)
  const queryParams = useMemo(() => {
    const params = {
      sellerType: 'PHARMACY', // Doctor products have sellerType = 'PHARMACY'
      sellerId: user?._id // Filter by doctor's userId (which is the pharmacy's ownerId)
    }
    if (searchFilter) params.search = searchFilter
    if (categoryFilter) params.category = categoryFilter
    return params
  }, [user?._id, searchFilter, categoryFilter])

  // Fetch products for this doctor
  const { data: productsResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['doctor-products', queryParams],
    queryFn: () => productApi.listProducts(queryParams),
    enabled: !!user?._id
  })

  // Extract products data
  const products = useMemo(() => {
    if (!productsResponse) return []
    const responseData = productsResponse.data || productsResponse
    return Array.isArray(responseData) ? responseData : (responseData.products || [])
  }, [productsResponse])

  // Extract pagination data
  const pagination = useMemo(() => {
    if (!productsResponse) return null
    const responseData = productsResponse.data || productsResponse
    return responseData.pagination || null
  }, [productsResponse])

  // Handle create
  const handleCreate = () => {
    // Check if doctor has a pharmacy
    if (!doctorPharmacy) {
      toast.error('Please create a pharmacy first before adding products')
      setShowPharmacyModal(true)
      return
    }
    
    setEditingProduct(null)
    setFormData({
      name: '',
      price: '',
      stock: '',
      description: '',
      sku: '',
      discountPrice: '',
      category: '',
      subCategory: '',
      tags: '',
      isActive: true,
      images: []
    })
    setImageFiles([])
    setShowModal(true)
  }

  // Handle pharmacy creation
  const handleCreatePharmacy = async () => {
    try {
      if (!pharmacyFormData.name.trim()) {
        toast.error('Please enter pharmacy name')
        return
      }

      // Clean up the data - remove empty strings and convert to proper types
      const cleanedData = {
        name: pharmacyFormData.name.trim()
      }

      // Add phone if provided
      if (pharmacyFormData.phone && pharmacyFormData.phone.trim()) {
        cleanedData.phone = pharmacyFormData.phone.trim()
      }

      // Clean address - only include non-empty fields
      const addressFields = {}
      if (pharmacyFormData.address.line1?.trim()) addressFields.line1 = pharmacyFormData.address.line1.trim()
      if (pharmacyFormData.address.line2?.trim()) addressFields.line2 = pharmacyFormData.address.line2.trim()
      if (pharmacyFormData.address.city?.trim()) addressFields.city = pharmacyFormData.address.city.trim()
      if (pharmacyFormData.address.state?.trim()) addressFields.state = pharmacyFormData.address.state.trim()
      if (pharmacyFormData.address.country?.trim()) addressFields.country = pharmacyFormData.address.country.trim()
      if (pharmacyFormData.address.zip?.trim()) addressFields.zip = pharmacyFormData.address.zip.trim()
      
      if (Object.keys(addressFields).length > 0) {
        cleanedData.address = addressFields
      }

      // Clean location - only include if both lat and lng are valid numbers
      if (pharmacyFormData.location.lat && pharmacyFormData.location.lng) {
        const lat = parseFloat(pharmacyFormData.location.lat)
        const lng = parseFloat(pharmacyFormData.location.lng)
        if (!isNaN(lat) && !isNaN(lng)) {
          cleanedData.location = { lat, lng }
        }
      }

      await pharmacyApi.createPharmacy(cleanedData)
      toast.success('Pharmacy created successfully!')
      setShowPharmacyModal(false)
      setPharmacyFormData({
        name: '',
        phone: '',
        address: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          country: '',
          zip: ''
        },
        location: {
          lat: '',
          lng: ''
        }
      })
      refetchPharmacy()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to create pharmacy'
      toast.error(errorMessage)
      console.error('Pharmacy creation error:', error.response?.data || error)
    }
  }

  // Handle edit
  const handleEdit = (product) => {
    console.log('Editing product:', product)
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      price: product.price !== undefined && product.price !== null ? String(product.price) : '',
      stock: product.stock !== undefined && product.stock !== null ? String(product.stock) : '',
      description: product.description || '',
      sku: product.sku || '',
      discountPrice: product.discountPrice !== undefined && product.discountPrice !== null ? String(product.discountPrice) : '',
      category: product.category || '',
      subCategory: product.subCategory || '',
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''),
      isActive: product.isActive !== undefined ? product.isActive : true,
      images: Array.isArray(product.images) ? product.images : []
    })
    setImageFiles([])
    setShowModal(true)
  }

  // Handle delete
  const handleDelete = (product) => {
    setEditingProduct(product)
    setShowDeleteModal(true)
  }

  // Handle image upload
  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return []
    
    try {
      // Use /upload/product route which supports multiple files
      const formData = new FormData()
      Array.from(files).forEach(file => {
        formData.append('files', file) // Note: field name is 'files' (plural) for multiple uploads
      })
      
      const response = await api.post('/upload/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // Response structure: { success: true, data: { urls: [...] } }
      const responseData = response?.data || response
      if (responseData?.urls && Array.isArray(responseData.urls)) {
        return responseData.urls
      }
      
      // Fallback: if single url returned
      if (responseData?.url) {
        return [responseData.url]
      }
      
      return []
    } catch (error) {
      console.error('Image upload error:', error)
      // If product upload route is not accessible, fallback to /upload/general (single file only)
      if (error.response?.status === 403 || error.response?.status === 401) {
        console.warn('Product upload route not accessible, falling back to general upload (single file only)')
        // Upload files one by one using general route
        const uploadPromises = Array.from(files).map(async (file) => {
          const singleFormData = new FormData()
          singleFormData.append('file', file)
          const response = await api.post('/upload/general', singleFormData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          const responseData = response?.data || response
          return responseData?.url || responseData?.data?.url
        })
        
        const uploadedUrls = await Promise.all(uploadPromises)
        return uploadedUrls.filter(url => url)
      }
      throw error
    }
  }

  // Handle save
  const handleSave = async () => {
    console.log('handleSave called, editingProduct:', editingProduct)
    console.log('Form data:', formData)
    
    // Check if doctor has a pharmacy (only for new products)
    if (!editingProduct && !doctorPharmacy) {
      toast.error('Please create a pharmacy first before adding products')
      setShowPharmacyModal(true)
      return
    }
    
    if (!formData.name || !formData.name.trim()) {
      toast.error('Please enter product name')
      return
    }

    // Validate price
    const price = formData.price ? parseFloat(formData.price) : null
    if (price === null || isNaN(price) || price < 0) {
      toast.error('Please enter a valid price (must be a number >= 0)')
      return
    }

    // Validate stock if provided
    let stock = 0
    if (formData.stock !== undefined && formData.stock !== null && formData.stock !== '') {
      const stockValue = typeof formData.stock === 'string' ? formData.stock.trim() : String(formData.stock)
      if (stockValue !== '') {
        stock = parseInt(stockValue)
        if (isNaN(stock) || stock < 0) {
          toast.error('Stock must be a non-negative integer')
          return
        }
      }
    }

    // Validate discount price if provided
    let discountPrice = null
    if (formData.discountPrice !== undefined && formData.discountPrice !== null && formData.discountPrice !== '') {
      const discountValue = typeof formData.discountPrice === 'string' ? formData.discountPrice.trim() : String(formData.discountPrice)
      if (discountValue !== '') {
        discountPrice = parseFloat(discountValue)
        if (isNaN(discountPrice) || discountPrice < 0) {
          toast.error('Discount price must be a non-negative number')
          return
        }
        if (discountPrice >= price) {
          toast.error('Discount price must be less than regular price')
          return
        }
      }
    }

    try {
      let imageUrls = [...formData.images]

      // Upload new images if files selected
      if (imageFiles.length > 0) {
        const uploadedUrls = await handleImageUpload(imageFiles)
        imageUrls = [...imageUrls, ...uploadedUrls]
      }

      // Convert relative image URLs to full URLs if needed
      const apiBaseUrl = import.meta.env.VITE_API_URL || '/api'
      const serverBaseUrl = apiBaseUrl.replace('/api', '')
      const fullImageUrls = imageUrls.map(url => {
        if (!url || typeof url !== 'string') return null
        if (url.startsWith('http://') || url.startsWith('https://')) {
          return url
        }
        const cleanUrl = url.startsWith('/') ? url : '/' + url
        return `${serverBaseUrl}${cleanUrl}`
      }).filter(url => url !== null && url !== '')

      const shouldIncludeImages = editingProduct 
        ? (fullImageUrls.length > 0 || imageFiles.length > 0)
        : (fullImageUrls.length > 0)

      // Parse tags
      const tags = formData.tags && formData.tags.trim()
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : []

      // Build product data
      // Backend will automatically link to doctor's pharmacy
      const productData = {
        name: formData.name.trim(),
        price: Number(price),
        stock: Number(stock),
        isActive: Boolean(formData.isActive)
      }
      
      // Add optional fields only if they have values
      if (formData.description && formData.description.trim()) {
        productData.description = formData.description.trim()
      }
      if (formData.sku && formData.sku.trim()) {
        productData.sku = formData.sku.trim()
      }
      if (discountPrice !== null && !isNaN(discountPrice)) {
        productData.discountPrice = Number(discountPrice)
      }
      if (formData.category && formData.category.trim()) {
        productData.category = formData.category.trim()
      }
      if (formData.subCategory && formData.subCategory.trim()) {
        productData.subCategory = formData.subCategory.trim()
      }
      if (tags.length > 0) {
        productData.tags = tags
      }
      if (shouldIncludeImages && fullImageUrls.length > 0) {
        productData.images = fullImageUrls
      }
      
      console.log('Sending product data:', JSON.stringify(productData, null, 2))

      // Note: sellerId and sellerType are automatically set by backend from authenticated user
      if (editingProduct) {
        await productApi.updateProduct(editingProduct._id, productData)
        toast.success('Product updated successfully!')
      } else {
        await productApi.createProduct(productData)
        toast.success('Product created successfully!')
      }

      setShowModal(false)
      setEditingProduct(null)
      setImageFiles([])
      refetch()
    } catch (error) {
      let errorMessage = 'Failed to save product'
      let isSubscriptionError = false
      
      // Handle 403 Forbidden - Subscription related errors
      if (error.response?.status === 403) {
        const errorData = error.response.data || {}
        
        // Extract error message from backend response
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.error) {
          errorMessage = errorData.error
        } else {
          errorMessage = 'You need an active FULL subscription plan to create products. Please upgrade your subscription plan.'
        }
        
        // Check if this is a subscription-related error
        const subscriptionKeywords = ['subscription', 'plan', 'upgrade', 'expired', 'renew', 'full']
        isSubscriptionError = subscriptionKeywords.some(keyword => 
          errorMessage.toLowerCase().includes(keyword)
        )
        
        // Add helpful message for subscription errors
        if (isSubscriptionError) {
          errorMessage += ' Visit Subscription Plans page to upgrade.'
        }
        
        // Show error with longer duration for subscription errors
        toast.error(errorMessage, {
          autoClose: isSubscriptionError ? 8000 : 5000,
        })
      } else if (error.response?.data) {
        const errorData = error.response.data
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          errorMessage = errorData.errors.map(err => {
            const field = err.field ? `${err.field}: ` : ''
            return `${field}${err.message || err.msg}`
          }).join(', ')
        } else if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.error) {
          errorMessage = errorData.error
        }
        toast.error(errorMessage)
      } else if (error.message) {
        errorMessage = error.message
        toast.error(errorMessage)
      } else {
        toast.error(errorMessage)
      }
      
      console.error('Product save error:', {
        error,
        response: error.response?.data,
        status: error.response?.status,
        errorMessage,
        isSubscriptionError
      })
    }
  }

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!editingProduct) return

    try {
      await productApi.deleteProduct(editingProduct._id)
      toast.success('Product deleted successfully!')
      setShowDeleteModal(false)
      setEditingProduct(null)
      refetch()
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete product'
      toast.error(errorMessage)
    }
  }

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price || 0)
  }

  // Calculate discount percentage
  const getDiscountPercent = (price, discountPrice) => {
    if (!price || !discountPrice || discountPrice >= price) return 0
    return Math.round(((price - discountPrice) / price) * 100)
  }

  // Clear all filters
  const handleClearFilters = () => {
    setSearchFilter('')
    setCategoryFilter('')
  }

  // Check if any filters are active
  const hasActiveFilters = searchFilter || categoryFilter

  return (
    <>
      <div className="page-header">
        <div className="row">
          <div className="col-sm-12">
            <h3 className="page-title">My Products</h3>
            {/* Pharmacy Info Section */}
            {doctorPharmacy ? (
              <div className="alert alert-success mt-3 mb-0">
                <strong>Your Pharmacy:</strong> {doctorPharmacy.name}
                {doctorPharmacy.address?.city && ` - ${doctorPharmacy.address.city}`}
                {doctorPharmacy.phone && ` | Phone: ${doctorPharmacy.phone}`}
                <br />
                <small>All products you create will be automatically linked to this pharmacy</small>
              </div>
            ) : (
              <div className="alert alert-warning mt-3 mb-0">
                <strong>No Pharmacy Found</strong>
                <br />
                <small>You need to create a pharmacy before adding products. 
                  <button 
                    type="button" 
                    className="btn btn-sm btn-primary ms-2"
                    onClick={() => setShowPharmacyModal(true)}
                  >
                    Create Pharmacy
                  </button>
                </small>
              </div>
            )}
            <ul className="breadcrumb">
              <li className="breadcrumb-item"><a href="/doctor/dashboard">Dashboard</a></li>
              <li className="breadcrumb-item active">Products</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="mb-2">Search</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name or description"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="mb-2">Category</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Filter by category"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group d-flex align-items-end gap-2">
                    {hasActiveFilters && (
                      <button 
                        className="btn btn-secondary" 
                        onClick={handleClearFilters}
                        title="Clear all filters"
                      >
                        <i className="fe fe-x me-1"></i>
                        Clear
                      </button>
                    )}
                    <button className="btn btn-primary flex-grow-1" onClick={handleCreate}>
                      <i className="fe fe-plus me-2"></i>
                      Add Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="datatable table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p className="mt-2 mb-0">Loading products...</p>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <p className="text-danger">Error loading products: {error.message || 'Unknown error'}</p>
                          <button className="btn btn-sm btn-primary" onClick={() => refetch()}>Retry</button>
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <p className="text-muted">No products found</p>
                          <button className="btn btn-sm btn-primary mt-2" onClick={handleCreate}>Add First Product</button>
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product._id}>
                          <td>
                            <h2 className="table-avatar">
                              {product.images && product.images.length > 0 && (
                                <a href="#" className="avatar avatar-sm me-2">
                                  <img
                                    className="avatar-img rounded"
                                    src={product.images[0]}
                                    alt={product.name}
                                    onError={(e) => {
                                      e.target.style.display = 'none'
                                    }}
                                  />
                                </a>
                              )}
                              <a href="#">{product.name}</a>
                            </h2>
                            {product.sku && (
                              <small className="text-muted">SKU: {product.sku}</small>
                            )}
                          </td>
                          <td>
                            {product.category && (
                              <div>
                                <span>{product.category}</span>
                                {product.subCategory && (
                                  <small className="d-block text-muted">{product.subCategory}</small>
                                )}
                              </div>
                            )}
                            {!product.category && <span className="text-muted">N/A</span>}
                          </td>
                          <td>
                            <div>
                              {product.discountPrice && product.discountPrice < product.price ? (
                                <>
                                  <span className="text-decoration-line-through text-muted me-2">
                                    {formatPrice(product.price)}
                                  </span>
                                  <span className="text-primary fw-bold">
                                    {formatPrice(product.discountPrice)}
                                  </span>
                                  <br />
                                  <small className="text-success">
                                    {getDiscountPercent(product.price, product.discountPrice)}% OFF
                                  </small>
                                </>
                              ) : (
                                <span className="fw-bold">{formatPrice(product.price)}</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className={product.stock > 0 ? 'text-success' : 'text-danger'}>
                              {product.stock || 0}
                            </span>
                          </td>
                          <td>
                            {product.isActive ? (
                              <span className="badge bg-success-light">Active</span>
                            ) : (
                              <span className="badge bg-danger-light">Inactive</span>
                            )}
                          </td>
                          <td>
                            <div className="actions">
                              <button
                                className="btn btn-sm bg-success-light me-2"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleEdit(product)
                                }}
                                title="Edit"
                                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                              >
                                <i className="feather-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm bg-danger-light"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleDelete(product)
                                }}
                                title="Delete"
                                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                              >
                                <i className="feather-trash-2"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    <p className="text-muted mb-0">
                      Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() => {
              setShowModal(false)
              setEditingProduct(null)
            }}
            style={{ zIndex: 1040 }}
          ></div>
          <div
            className="modal fade show"
            style={{ display: 'block', zIndex: 1050 }}
            onClick={(e) => {
              if (e.target.classList.contains('modal')) {
                setShowModal(false)
                setEditingProduct(null)
              }
            }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document" onClick={(e) => e.stopPropagation()} style={{ pointerEvents: 'auto' }}>
              <div className="modal-content" style={{ position: 'relative', zIndex: 1051, pointerEvents: 'auto' }}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowModal(false)
                      setEditingProduct(null)
                    }}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Note: Product will be automatically linked to doctor's pharmacy
                      - sellerId = pharmacy.ownerId (doctor's userId)
                      - sellerType = "PHARMACY" */}
                  {doctorPharmacy ? (
                    <div className="alert alert-info mb-3">
                      <strong>Your Pharmacy:</strong> {doctorPharmacy.name}
                      {doctorPharmacy.address?.city && ` - ${doctorPharmacy.address.city}`}
                      <br />
                      <small>Products will be automatically linked to this pharmacy</small>
                    </div>
                  ) : (
                    <div className="alert alert-warning mb-3">
                      <strong>No Pharmacy Found</strong>
                      <br />
                      <small>Please create a pharmacy first to add products</small>
                    </div>
                  )}
                  <div className="row">
                    <div className="col-md-8 mb-3">
                      <label className="form-label">
                        Product Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">SKU</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        placeholder="Product SKU"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">
                        Price <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Discount Price</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        value={formData.discountPrice}
                        onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Product category"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Sub Category</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.subCategory}
                        onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                        placeholder="Product sub category"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Product description"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tags (comma-separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Product Images</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      multiple
                      onChange={(e) => setImageFiles(Array.from(e.target.files))}
                    />
                    {imageFiles.length > 0 && (
                      <small className="text-muted d-block mt-1">
                        {imageFiles.length} file(s) selected
                      </small>
                    )}
                    {formData.images && formData.images.length > 0 && (
                      <div className="mt-2">
                        <small className="text-muted d-block mb-2">Current Images:</small>
                        <div className="d-flex flex-wrap gap-2">
                          {formData.images.map((img, idx) => (
                            <div key={idx} className="position-relative" style={{ width: '80px', height: '80px' }}>
                              <img
                                src={img}
                                alt={`Product ${idx + 1}`}
                                className="img-thumbnail"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                style={{ transform: 'translate(50%, -50%)' }}
                                onClick={() => {
                                  const newImages = formData.images.filter((_, i) => i !== idx)
                                  setFormData({ ...formData, images: newImages })
                                }}
                              >
                                <i className="fe fe-x"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="isActive">
                        Active
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false)
                      setEditingProduct(null)
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleSave()
                    }}
                    style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                  >
                    <i className="fe fe-save me-2"></i>
                    {editingProduct ? 'Update' : 'Create'} Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && editingProduct && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() => {
              setShowDeleteModal(false)
              setEditingProduct(null)
            }}
            style={{ zIndex: 1040 }}
          ></div>
          <div
            className="modal fade show"
            style={{ display: 'block', zIndex: 1050 }}
            onClick={(e) => {
              if (e.target.classList.contains('modal')) {
                setShowDeleteModal(false)
                setEditingProduct(null)
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content" style={{ position: 'relative', zIndex: 1051 }}>
                <div className="modal-body">
                  <div className="form-content p-2">
                    <h4 className="modal-title">Delete Product</h4>
                    <p className="mb-4">
                      Are you sure you want to delete <strong>{editingProduct.name}</strong>? 
                      This action cannot be undone.
                    </p>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowDeleteModal(false)
                          setEditingProduct(null)
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={handleDeleteConfirm}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Pharmacy Creation Modal */}
      {showPharmacyModal && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() => setShowPharmacyModal(false)}
            style={{ zIndex: 1040 }}
          ></div>
          <div
            className="modal fade show"
            style={{ display: 'block', zIndex: 1050 }}
            onClick={(e) => {
              if (e.target.classList.contains('modal')) {
                setShowPharmacyModal(false)
              }
            }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create Your Pharmacy</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowPharmacyModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="alert alert-info">
                    <small>You need to create a pharmacy before adding products. All your products will be automatically linked to this pharmacy.</small>
                  </div>
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="form-label">
                        Pharmacy Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={pharmacyFormData.name}
                        onChange={(e) => setPharmacyFormData({ ...pharmacyFormData, name: e.target.value })}
                        placeholder="Enter pharmacy name"
                        required
                      />
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        value={pharmacyFormData.phone}
                        onChange={(e) => setPharmacyFormData({ ...pharmacyFormData, phone: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Address Line 1</label>
                      <input
                        type="text"
                        className="form-control"
                        value={pharmacyFormData.address.line1}
                        onChange={(e) => setPharmacyFormData({
                          ...pharmacyFormData,
                          address: { ...pharmacyFormData.address, line1: e.target.value }
                        })}
                        placeholder="Street address"
                      />
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Address Line 2</label>
                      <input
                        type="text"
                        className="form-control"
                        value={pharmacyFormData.address.line2}
                        onChange={(e) => setPharmacyFormData({
                          ...pharmacyFormData,
                          address: { ...pharmacyFormData.address, line2: e.target.value }
                        })}
                        placeholder="Apartment, suite, etc."
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        value={pharmacyFormData.address.city}
                        onChange={(e) => setPharmacyFormData({
                          ...pharmacyFormData,
                          address: { ...pharmacyFormData.address, city: e.target.value }
                        })}
                        placeholder="City"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        value={pharmacyFormData.address.state}
                        onChange={(e) => setPharmacyFormData({
                          ...pharmacyFormData,
                          address: { ...pharmacyFormData.address, state: e.target.value }
                        })}
                        placeholder="State"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        value={pharmacyFormData.address.country}
                        onChange={(e) => setPharmacyFormData({
                          ...pharmacyFormData,
                          address: { ...pharmacyFormData.address, country: e.target.value }
                        })}
                        placeholder="Country"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">ZIP Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={pharmacyFormData.address.zip}
                        onChange={(e) => setPharmacyFormData({
                          ...pharmacyFormData,
                          address: { ...pharmacyFormData.address, zip: e.target.value }
                        })}
                        placeholder="ZIP code"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowPharmacyModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleCreatePharmacy}
                  >
                    Create Pharmacy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default DoctorProducts

