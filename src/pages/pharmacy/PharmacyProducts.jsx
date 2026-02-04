import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../api/axios'
import * as productApi from '../../api/product'
import * as pharmacyApi from '../../api/pharmacy'
import { getImageUrl } from '../../utils/imageUtils'

const PharmacyProducts = () => {
  const { user } = useAuth()
  const status = user?.status?.toUpperCase()

  const userRole = user?.role?.toUpperCase()
  const isParapharmacy = userRole === 'PARAPHARMACY'

  const { data: myPharmacyResponse } = useQuery({
    queryKey: ['my-pharmacy'],
    queryFn: () => pharmacyApi.getMyPharmacy(),
    enabled: !!user
  })

  const { data: subscriptionResponse } = useQuery({
    queryKey: ['my-pharmacy-subscription'],
    queryFn: () => pharmacyApi.getMyPharmacySubscription(),
    enabled: !!user && !isParapharmacy
  })

  const subscriptionData = subscriptionResponse?.data || subscriptionResponse
  const hasActiveSubscription = isParapharmacy ? true : Boolean(subscriptionData?.hasActiveSubscription)

  const myPharmacy = useMemo(() => {
    if (!myPharmacyResponse) return null
    const responseData = myPharmacyResponse.data || myPharmacyResponse
    return responseData.data || responseData
  }, [myPharmacyResponse])

  const isProfileComplete = useMemo(() => {
    if (!myPharmacy) return false
    const nameOk = Boolean(String(myPharmacy.name || '').trim())
    const phoneOk = Boolean(String(myPharmacy.phone || '').trim())
    const line1Ok = Boolean(String(myPharmacy.address?.line1 || '').trim())
    const cityOk = Boolean(String(myPharmacy.address?.city || '').trim())
    return nameOk && phoneOk && line1Ok && cityOk
  }, [myPharmacy])

  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const queryParams = useMemo(() => {
    return {
      page,
      limit,
      sellerType: isParapharmacy ? 'PARAPHARMACY' : 'PHARMACY',
      sellerId: user?._id
    }
  }, [page, limit, user?._id, isParapharmacy])

  const { data: productsResponse, isLoading, refetch } = useQuery({
    queryKey: ['pharmacy-products', queryParams],
    queryFn: () => productApi.listProducts(queryParams),
    enabled: !!user?._id
  })

  const products = useMemo(() => {
    if (!productsResponse) return []
    const responseData = productsResponse.data || productsResponse
    return Array.isArray(responseData) ? responseData : (responseData.products || [])
  }, [productsResponse])

  const categoryOptions = useMemo(() => {
    const set = new Set()
    products.forEach((p) => {
      if (p?.category) set.add(String(p.category))
    })
    return Array.from(set).sort()
  }, [products])

  const subCategoryOptions = useMemo(() => {
    const set = new Set()
    products.forEach((p) => {
      if (p?.subCategory) set.add(String(p.subCategory))
    })
    return Array.from(set).sort()
  }, [products])

  const pagination = useMemo(() => {
    if (!productsResponse) return null
    const responseData = productsResponse.data || productsResponse
    return responseData.pagination || null
  }, [productsResponse])

  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    category: '',
    subCategory: '',
    images: []
  })
  const [imageFiles, setImageFiles] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  const canSell = status === 'APPROVED'
  const canManageProducts = canSell && isProfileComplete && hasActiveSubscription

  const uploadImages = async (files) => {
    if (!files || files.length === 0) return []

    const formData = new FormData()
    Array.from(files).forEach((file) => formData.append('files', file))

    const response = await api.post('/upload/product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    const responseData = response?.data || response
    const urls = responseData?.data?.urls || responseData?.urls

    return Array.isArray(urls) ? urls : []
  }

  const handleCreate = () => {
    if (!myPharmacy) {
      toast.error('Please create your pharmacy profile first')
      return
    }

    if (!isProfileComplete) {
      toast.info('Please complete your pharmacy profile first')
      return
    }

    if (!canSell) {
      toast.info('Your account is pending approval. You cannot add products yet.')
      return
    }

    if (!hasActiveSubscription) {
      toast.info('You need an active subscription to manage products.')
      return
    }

    setEditingProduct(null)
    setFormData({ name: '', price: '', stock: '', description: '', category: '', subCategory: '', images: [] })
    setImageFiles([])
    setShowModal(true)
  }

  const handleEdit = (product) => {
    if (!isProfileComplete) {
      toast.info('Please complete your pharmacy profile first')
      return
    }

    if (!hasActiveSubscription) {
      toast.info('You need an active subscription to manage products.')
      return
    }
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      price: product.price !== undefined && product.price !== null ? String(product.price) : '',
      stock: product.stock !== undefined && product.stock !== null ? String(product.stock) : '',
      description: product.description || '',
      category: product.category || '',
      subCategory: product.subCategory || '',
      images: Array.isArray(product.images) ? product.images : []
    })
    setImageFiles([])
    setShowModal(true)
  }

  const handleDelete = async (product) => {
    if (!isProfileComplete) {
      toast.info('Please complete your pharmacy profile first')
      return
    }
    if (!canSell) {
      toast.info('Your account is pending approval. You cannot delete products yet.')
      return
    }

    if (!hasActiveSubscription) {
      toast.info('You need an active subscription to manage products.')
      return
    }

    const confirm = window.confirm('Delete this product?')
    if (!confirm) return

    try {
      await productApi.deleteProduct(product._id)
      toast.success('Product deleted')
      refetch()
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to delete product')
    }
  }

  const handleSave = async () => {
    if (!isProfileComplete) {
      toast.info('Please complete your pharmacy profile first')
      return
    }
    if (!canSell) {
      toast.info('Your account is pending approval. You cannot add products yet.')
      return
    }

    if (!hasActiveSubscription) {
      toast.info('You need an active subscription to manage products.')
      return
    }

    if (!formData.name.trim()) {
      toast.error('Product name is required')
      return
    }

    const price = parseFloat(formData.price)
    const stock = parseInt(formData.stock, 10)

    if (Number.isNaN(price) || price < 0) {
      toast.error('Price must be a valid number')
      return
    }

    if (Number.isNaN(stock) || stock < 0) {
      toast.error('Stock must be a valid number')
      return
    }

    try {
      setIsSaving(true)
      let uploaded = []
      if (imageFiles.length > 0) {
        uploaded = await uploadImages(imageFiles)
      }

      const nextImages = uploaded.length > 0
        ? uploaded
        : (formData.images || [])

      const payload = {
        name: formData.name.trim(),
        price,
        stock,
        description: formData.description?.trim() || undefined,
        category: formData.category?.trim() || undefined,
        subCategory: formData.subCategory?.trim() || undefined,
        images: nextImages
      }

      if (editingProduct?._id) {
        await productApi.updateProduct(editingProduct._id, payload)
        toast.success('Product updated')
      } else {
        await productApi.createProduct(payload)
        toast.success('Product created')
      }

      setShowModal(false)
      setEditingProduct(null)
      setImageFiles([])
      refetch()
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to save product')
    } finally {
      setIsSaving(false)
    }
  }

  if (!myPharmacy) {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="mb-2">Pharmacy profile required</h5>
          <p className="text-muted mb-0">Please create your pharmacy profile before managing products.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="dashboard-header d-flex align-items-center justify-content-between">
        <div>
          <h3>Products</h3>
          <p className="text-muted mb-0">Manage your products</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate} disabled={!canManageProducts}>
          Add Product
        </button>
      </div>

      {status === 'PENDING' && (
        <div className="alert alert-warning">Your account is pending approval. You cannot add or modify products yet.</div>
      )}

      {!isProfileComplete && (
        <div className="alert alert-info">
          <div className="d-flex align-items-center justify-content-between flex-wrap" style={{ gap: 12 }}>
            <div>
              <strong>Complete your profile to add products</strong>
              <div className="small text-muted">Required: name, phone, address line 1, city.</div>
            </div>
            <a className="btn btn-sm btn-primary" href="/pharmacy/profile">Complete Profile</a>
          </div>
        </div>
      )}

      {!hasActiveSubscription && (
        <div className="alert alert-warning">
          <div className="d-flex align-items-center justify-content-between flex-wrap" style={{ gap: 12 }}>
            <div>
              <strong>Subscription required</strong>
              <div className="small text-muted">You need an active subscription to add, edit, or delete products.</div>
            </div>
            <Link className="btn btn-sm btn-primary" to="/pharmacy/subscription-plans">View Plans</Link>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">No products</td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p._id}>
                        <td>
                          <img
                            src={getImageUrl(p.images?.[0], '/assets/img/products/product.jpg')}
                            alt={p.name}
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = '/assets/img/products/product.jpg'
                            }}
                          />
                        </td>
                        <td>{p.name}</td>
                        <td>
                          {p.category ? (
                            <>
                              <div>{p.category}</div>
                              {p.subCategory && <small className="text-muted">{p.subCategory}</small>}
                            </>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td>{p.price}</td>
                        <td>{p.stock}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(p)} disabled={!canManageProducts}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p)} disabled={!canManageProducts}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="d-flex justify-content-between align-items-center">
                <button className="btn btn-outline-secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                  Prev
                </button>
                <div className="text-muted">Page {pagination.page} of {pagination.pages}</div>
                <button className="btn btn-outline-secondary" onClick={() => setPage((p) => p + 1)} disabled={page >= pagination.pages}>
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingProduct ? 'Edit Product' : 'Add Product'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} disabled={isSaving} />
              </div>
              <div className="modal-body">
                <div className="form-group mb-2">
                  <label>Name</label>
                  <input className="form-control" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="form-group mb-2">
                  <label>Price</label>
                  <input className="form-control" value={formData.price} onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))} />
                </div>
                <div className="form-group mb-2">
                  <label>Stock</label>
                  <input className="form-control" value={formData.stock} onChange={(e) => setFormData((p) => ({ ...p, stock: e.target.value }))} />
                </div>
                <div className="form-group mb-2">
                  <label>Description</label>
                  <textarea className="form-control" value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} />
                </div>
                <div className="form-group mb-2">
                  <label>Category</label>
                  <select
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group mb-2">
                  <label>Subcategory</label>
                  <select
                    className="form-control"
                    value={formData.subCategory}
                    onChange={(e) => setFormData((p) => ({ ...p, subCategory: e.target.value }))}
                  >
                    <option value="">Select subcategory</option>
                    {subCategoryOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group mb-2">
                  <label>Images</label>
                  <input type="file" className="form-control" multiple accept="image/*" onChange={(e) => setImageFiles(Array.from(e.target.files || []))} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={isSaving}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PharmacyProducts
