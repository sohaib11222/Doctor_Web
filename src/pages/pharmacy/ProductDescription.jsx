import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Breadcrumb from '../../components/common/Breadcrumb'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import * as productApi from '../../api/product'
import * as prescriptionApi from '../../api/productPrescriptionRequest'
import api from '../../api/axios'
import { getImageUrl } from '../../utils/imageUtils'
import { useLanguage } from '../../contexts/LanguageContext'

const unwrap = (response) => { const outer = response?.data ?? response; return outer?.data ?? outer }
const detail = (label, value, tr) => value ? <div className="col-md-6 mb-3" key={label}><div className="small text-muted">{tr(label)}</div><div style={{ whiteSpace: 'pre-line' }}>{value}</div></div> : null
const variantLabel = (variant, tr) => variant?.name || [variant?.strengthValue && `${variant.strengthValue} ${variant.strengthUnit || ''}`.trim(), variant?.dosageForm, variant?.unitsPerPack && `${variant.unitsPerPack} ${variant.unitLabel || tr('units')}`].filter(Boolean).join(' · ') || tr('Default option')

const ProductDescription = () => {
  const { translateText: tr } = useLanguage()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const productId = searchParams.get('id')
  const requestedVariantId = searchParams.get('variantId')
  const fileRef = useRef(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariantId, setSelectedVariantId] = useState(requestedVariantId || '')
  const [uploading, setUploading] = useState(false)

  const productQuery = useQuery({ queryKey: ['product', productId], queryFn: () => productApi.getProductById(productId), enabled: Boolean(productId) })
  const product = unwrap(productQuery.data)
  const variants = Array.isArray(product?.variants) && product.variants.length ? product.variants.filter((variant) => variant.isActive !== false) : []
  const selectedVariant = variants.find((variant) => String(variant._id) === String(selectedVariantId)) || variants.find((variant) => variant.isDefault) || variants[0] || null
  useEffect(() => { if (selectedVariant && String(selectedVariantId) !== String(selectedVariant._id)) setSelectedVariantId(String(selectedVariant._id)) }, [selectedVariant, selectedVariantId])
  const patient = String(user?.role || '').toUpperCase() === 'PATIENT'
  const eligibilityQuery = useQuery({
    queryKey: ['product-prescription-eligibility', productId, selectedVariant?._id],
    queryFn: () => prescriptionApi.getProductPrescriptionEligibility(productId, selectedVariant?._id),
    enabled: Boolean(product?.requiresPrescription && patient && productId),
    refetchInterval: product?.requiresPrescription && patient ? 10000 : false,
  })
  const eligibility = unwrap(eligibilityQuery.data) || { requiresPrescription: Boolean(product?.requiresPrescription), canPurchase: !product?.requiresPrescription, status: product?.requiresPrescription ? 'NOT_SUBMITTED' : 'NOT_REQUIRED' }
  const purchasePrice = selectedVariant?.discountPrice ?? selectedVariant?.price ?? product?.discountPrice ?? product?.price ?? 0
  const originalPrice = selectedVariant?.discountPrice ? selectedVariant.price : product?.discountPrice ? product.price : null
  const stock = selectedVariant?.stock ?? product?.stock ?? 0
  const canPurchase = !product?.requiresPrescription || (patient && eligibility.canPurchase)

  useEffect(() => { if (quantity > stock) setQuantity(Math.max(1, stock || 1)) }, [stock, quantity])
  const submitPrescription = useMutation({
    mutationFn: prescriptionApi.submitProductPrescriptionRequest,
    onSuccess: () => { toast.success(tr('Prescription submitted for review. We will notify you once it is approved.')); queryClient.invalidateQueries({ queryKey: ['product-prescription-eligibility', productId] }) },
    onError: (error) => toast.error(tr(error.response?.data?.message || error.message || 'Unable to submit prescription')),
  })
  const uploadPrescription = async (event) => {
    const file = event.target.files?.[0]; if (!file) return
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp']
    const extension = String(file.name || '').split('.').pop()?.toLowerCase()
    if (file.size > 15 * 1024 * 1024) { toast.error(tr('Prescription files must be 15 MB or smaller.')); event.target.value = ''; return }
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)) { toast.error(tr('Upload a PDF, JPG, PNG, or WebP prescription file.')); event.target.value = ''; return }
    try {
      setUploading(true)
      const data = new FormData(); data.append('file', file, file.name)
      const response = await api.post('/upload/prescription', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      const upload = unwrap(response)
      await submitPrescription.mutateAsync({ productId, variantId: selectedVariant?._id || null, prescriptionUrl: upload?.url, originalName: file.name, mimeType: file.type })
    } catch (error) { toast.error(tr(error.response?.data?.message || error.message || 'Prescription upload failed')) } finally { setUploading(false); event.target.value = '' }
  }
  const add = (buyNow) => {
    if (!user) { toast.info(tr('Please sign in to purchase products.')); navigate('/login'); return }
    if (!patient) { toast.error(tr('Only patient accounts can purchase products.')); return }
    if (stock < 1) { toast.error(tr('This option is out of stock.')); return }
    if (!canPurchase) { toast.info(tr(product.requiresPrescription ? 'Upload an approved prescription before purchasing this product.' : 'This product is not available for purchase.')); return }
    addToCart(product, quantity, selectedVariant)
    toast.success(`${quantity} × ${product.name} ${tr('added to your cart')}`)
    if (buyNow) navigate('/product-checkout')
  }
  if (productQuery.isLoading) return <><Breadcrumb title="Pharmacy" li1="Product" li2="Loading" /><div className="content"><div className="container text-center py-5"><span className="spinner-border text-primary" /></div></div></>
  if (productQuery.isError || !product) return <><Breadcrumb title="Pharmacy" li1="Product" li2="Not found" /><div className="content"><div className="container"><div className="alert alert-danger">{tr('This product is unavailable.')} <Link to="/product-all">{tr('Browse products')}</Link></div></div></div></>
  const generalDetails = product.productType === 'PHARMACY_MEDICINE' ? product.medicineDetails : product.parapharmacyDetails
  const statusMessage = { NOT_SUBMITTED: tr('A prescription is required before this product can be purchased.'), PENDING: tr('Your prescription is under review by the seller.'), REJECTED: eligibility.request?.reviewNotes || tr('Your prescription was not approved. Please upload another copy.'), APPROVED: tr('Your prescription is approved. This product is ready to purchase.') }[eligibility.status]

  return <>
    <Breadcrumb title="Pharmacy" li1="Product details" li2={product.name} />
    <div className="content"><div className="container"><div className="row">
      <div className="col-lg-8"><div className="card"><div className="card-body"><div className="row"><div className="col-md-5"><img className="img-fluid rounded-3 w-100" style={{ maxHeight: 390, objectFit: 'cover' }} src={getImageUrl(product.images?.[0], '/assets/img/products/product.jpg')} alt={product.name} /><div className="d-flex gap-2 mt-2 flex-wrap">{product.images?.slice(1).map((image) => <img key={image} src={getImageUrl(image)} alt="" style={{ width: 58, height: 58, borderRadius: 7, objectFit: 'cover' }} />)}</div></div><div className="col-md-7"><span className="badge bg-light text-dark mb-2">{tr(product.productType === 'PHARMACY_MEDICINE' ? 'Pharmacy medicine' : 'Parapharmacy product')}</span><h2>{product.name}</h2>{product.brand && <p className="text-muted mb-2">{product.brand}{product.manufacturer ? ` · ${product.manufacturer}` : ''}</p>}<p style={{ whiteSpace: 'pre-line' }}>{product.description || tr('No description provided.')}</p>{product.tags?.length > 0 && <div className="d-flex flex-wrap gap-1">{product.tags.map((tag) => <span key={tag} className="badge bg-light text-dark border">{tag}</span>)}</div>}</div></div></div></div>
      <div className="card"><div className="card-body"><h4>{tr('Product information')}</h4><div className="row mt-3">{detail('Category', [product.category, product.subCategory].filter(Boolean).join(' · '), tr)}{detail('Active ingredients', generalDetails?.activeIngredients || generalDetails?.ingredients, tr)}{detail('How to use', generalDetails?.dosageInstructions || generalDetails?.usageInstructions, tr)}{detail('Warnings', generalDetails?.warnings, tr)}{detail('Storage', generalDetails?.storageInstructions, tr)}{detail('Allergens', generalDetails?.allergens, tr)}{detail('Authorization holder', generalDetails?.authorizationHolder, tr)}{detail('Registration number', generalDetails?.registrationNumber, tr)}</div>{generalDetails?.indications && <div className="mt-2"><div className="small text-muted">{tr('Indications')}</div><p style={{ whiteSpace: 'pre-line' }}>{generalDetails.indications}</p></div>}{generalDetails?.leafletUrl && <a className="btn btn-sm btn-outline-primary" target="_blank" rel="noreferrer" href={generalDetails.leafletUrl}>{tr('View product leaflet')}</a>}</div></div>
      </div>
      <div className="col-lg-4"><div className="card search-filter"><div className="card-body"><div className="d-flex align-items-end gap-2"><h2 className="mb-0">€{Number(purchasePrice).toFixed(2)}</h2>{originalPrice && <del className="text-muted">€{Number(originalPrice).toFixed(2)}</del>}</div>{variants.length > 1 && <div className="mt-3"><label className="form-label fw-semibold">{tr('Choose an option')}</label><select className="form-select" value={selectedVariant?._id || ''} onChange={(event) => setSelectedVariantId(event.target.value)}>{variants.map((variant) => <option key={variant._id} value={variant._id}>{variantLabel(variant, tr)} — €{Number(variant.discountPrice ?? variant.price).toFixed(2)}</option>)}</select></div>}<div className="mt-3 d-flex justify-content-between"><span className={`badge ${stock ? 'bg-success' : 'bg-danger'}`}>{stock ? `${stock} ${tr('in stock')}` : tr('Out of stock')}</span>{selectedVariant?.packageDescription && <small className="text-muted text-end">{selectedVariant.packageDescription}</small>}</div>
        <div className="alert alert-light border mt-3 mb-0"><div><i className="fa-solid fa-truck me-2 text-primary" />{tr('Order-specific shipping')}</div><small className="text-muted">{tr('The seller confirms the shipping fee and delivery commitment after receiving your order request, before payment.')}</small></div>
        {product.requiresPrescription && <div className={`alert mt-3 mb-0 ${eligibility.status === 'APPROVED' ? 'alert-success' : eligibility.status === 'REJECTED' ? 'alert-danger' : 'alert-warning'}`}><strong><i className="fa-solid fa-file-prescription me-2" />{tr('Prescription required')}</strong><div className="small mt-1">{patient ? statusMessage : tr('Sign in with a patient account to submit a prescription.')}</div>{patient && eligibility.status !== 'APPROVED' && <><input ref={fileRef} className="d-none" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" onChange={uploadPrescription} /><button type="button" className="btn btn-sm btn-primary mt-2" disabled={uploading || submitPrescription.isPending || eligibility.status === 'PENDING'} onClick={() => fileRef.current?.click()}>{uploading ? tr('Uploading…') : eligibility.status === 'PENDING' ? tr('Awaiting review') : eligibility.status === 'REJECTED' ? tr('Upload a new prescription') : tr('Upload prescription')}</button></>}</div>}
        <div className="input-group mt-4" style={{ maxWidth: 170 }}><button className="btn btn-outline-secondary" type="button" disabled={quantity <= 1} onClick={() => setQuantity((value) => value - 1)}>−</button><input className="form-control text-center" value={quantity} readOnly /><button className="btn btn-outline-secondary" type="button" disabled={quantity >= stock} onClick={() => setQuantity((value) => value + 1)}>+</button></div><div className="d-grid gap-2 mt-3"><button className="btn btn-outline-primary" disabled={!stock || !canPurchase} onClick={() => add(false)}><i className="fa-solid fa-cart-plus me-2" />{tr('Add to cart')}</button><button className="btn btn-primary" disabled={!stock || !canPurchase} onClick={() => add(true)}><i className="fa-solid fa-bag-shopping me-2" />{tr('Buy now')}</button></div><ul className="list-group list-group-flush mt-3"><li className="list-group-item px-0">{tr('SKU')} <span className="float-end">{selectedVariant?.sku || product.sku || '—'}</span></li>{selectedVariant?.packageType && <li className="list-group-item px-0">{tr('Package')} <span className="float-end">{selectedVariant.packageType}</span></li>}</ul></div></div></div>
    </div></div></div>
  </>
}

export default ProductDescription
