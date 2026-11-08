import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../api/axios'
import * as productApi from '../../api/product'
import * as pharmacyApi from '../../api/pharmacy'
import { getImageUrl } from '../../utils/imageUtils'
import { useLanguage } from '../../contexts/LanguageContext'

const makeVariant = (medicine, index = 1) => ({
  name: '', sku: '', barcode: '', strengthValue: '', strengthUnit: 'mg', dosageForm: '', packageType: '', unitsPerPack: '', unitLabel: '', packageDescription: '', price: '', discountPrice: '', stock: '', lowStockThreshold: '', isDefault: index === 1, isActive: true,
})

const emptyForm = (medicine) => ({
  name: '', brand: '', manufacturer: '', barcode: '', sku: '', description: '', category: '', subCategory: '', tags: '', requiresPrescription: false, isActive: true, images: [], lowStockThreshold: '5',
  medicineDetails: { activeIngredients: '', administrationRoute: '', indications: '', dosageInstructions: '', warnings: '', storageInstructions: '', authorizationHolder: '', registrationNumber: '', leafletUrl: '' },
  parapharmacyDetails: { productClass: '', ingredients: '', allergens: '', usageInstructions: '', warnings: '', storageInstructions: '' },
  variants: [makeVariant(medicine)],
})

const nullableNumber = (value) => value === '' || value === null || value === undefined ? null : Number(value)
const optional = (value) => String(value || '').trim() || null
const optionValidationError = (kind, index) => Object.assign(new Error(kind), { kind, optionIndex: index })

const translateProductValidation = (message, tr) => {
  const text = String(message || '')
  const numbered = [
    ['Enter a valid regular price for option', 'Enter a valid regular price for option'],
    ['Enter a whole stock quantity for option', 'Enter a whole stock quantity for option'],
    ['The sale price must be lower than the regular price for option', 'The sale price must be lower than the regular price for option'],
  ]
  for (const [prefix, key] of numbered) {
    if (text.startsWith(prefix)) return `${tr(key)}${text.slice(prefix.length)}`
  }
  return tr(text)
}

// These inputs intentionally live outside of PharmacyProducts. Defining them inside
// the page recreates their component type whenever the form state changes, causing
// React to unmount the focused input after every character.
const ProductFormInput = ({ label, value, onChange, type = 'text', error, ...props }) => {
  const { translateText: tr } = useLanguage()
  return <div className="col-md-6 mb-3">
    <label className="form-label">{tr(label)}</label>
    <input
      className={`form-control${error ? ' is-invalid' : ''}`}
      type={type}
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      {...props}
    />
    {error && <div className="invalid-feedback">{translateProductValidation(error, tr)}</div>}
  </div>
}

const medicineFields = [
  ['activeIngredients', 'Active ingredients *'],
  ['administrationRoute', 'Administration route'],
  ['indications', 'Indications'],
  ['dosageInstructions', 'Dosage / usage instructions'],
  ['warnings', 'Warnings'],
  ['storageInstructions', 'Storage instructions'],
  ['authorizationHolder', 'Authorization holder'],
  ['registrationNumber', 'Registration number'],
  ['leafletUrl', 'Leaflet URL'],
]

const parapharmacyFields = [
  ['productClass', 'Product class'],
  ['ingredients', 'Ingredients'],
  ['allergens', 'Allergens'],
  ['usageInstructions', 'Usage instructions'],
  ['warnings', 'Warnings'],
  ['storageInstructions', 'Storage instructions'],
]

const ProductDetailsFields = ({ fields, details, onChange, errors = {}, group }) => fields.map(([field, label]) => (
  <ProductFormInput
    key={field}
    label={label}
    value={details?.[field]}
    onChange={(value) => onChange(field, value)}
    error={errors[`${group}.${field}`]}
  />
))

const errorPath = (path = '') => String(path)
  .replace(/^body\./, '')
  .replace(/^data\./, '')
  .replace(/\.(\d+)\./g, '.$1.')

const errorFromResponse = (error) => {
  const payload = error?.response?.data || error?.data || {}
  const items = Array.isArray(payload.errors) ? payload.errors : []
  const fields = items.reduce((all, issue) => {
    const path = errorPath(issue?.field)
    if (path && issue?.message && !all[path]) all[path] = issue.message
    return all
  }, {})
  return {
    fields,
    message: payload.message || error?.message || 'Unable to save product',
  }
}

const PharmacyProducts = () => {
  const { user } = useAuth()
  const { translateText: tr, language } = useLanguage()
  const queryClient = useQueryClient()
  const role = String(user?.role || '').toUpperCase()
  const isParapharmacy = role === 'PARAPHARMACY'
  const isMedicine = !isParapharmacy
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState(() => emptyForm(isMedicine))
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const { data: setupResponse } = useQuery({ queryKey: ['pharmacy-setup-status'], queryFn: pharmacyApi.getPharmacySetupStatus, enabled: Boolean(user?._id) })
  const setupOuter = setupResponse?.data ?? setupResponse
  const setup = setupOuter?.data ?? setupOuter
  const canManageProducts = Boolean(setup?.profileCompleted && (!setup?.requiresSubscription || setup?.hasActiveSubscription) && String(user?.status || '').toUpperCase() === 'APPROVED')

  const params = useMemo(() => ({ page, limit: 12, sellerType: isParapharmacy ? 'PARAPHARMACY' : 'PHARMACY', sellerId: user?._id, isActive: 'all' }), [page, user?._id, isParapharmacy])
  const { data: productsResponse, isLoading, refetch } = useQuery({ queryKey: ['pharmacy-products', params, language], queryFn: () => productApi.listProducts(params), enabled: Boolean(user?._id) })
  const inventoryQuery = useQuery({ queryKey: ['pharmacy-inventory-summary'], queryFn: productApi.getInventorySummary, enabled: Boolean(user?._id), refetchInterval: 30000 })
  const payload = productsResponse?.data ?? productsResponse
  const products = payload?.data?.products || payload?.products || []
  const pagination = payload?.data?.pagination || payload?.pagination

  const openCreate = () => {
    if (!canManageProducts) { toast.info(tr('Complete the required account setup before managing products.')); return }
    setEditingProduct(null); setFieldErrors({}); setForm(emptyForm(isMedicine)); setShowModal(true)
  }
  const openEdit = (product) => {
    if (!canManageProducts) { toast.info(tr('Complete the required account setup before managing products.')); return }
    const variants = Array.isArray(product.variants) && product.variants.length ? product.variants : [{ ...makeVariant(isMedicine), name: product.name, sku: product.sku || '', barcode: product.barcode || '', price: product.price ?? '', discountPrice: product.discountPrice ?? '', stock: product.stock ?? '', isDefault: true }]
    setEditingProduct(product)
    setForm({
      ...emptyForm(isMedicine), name: product.name || '', brand: product.brand || '', manufacturer: product.manufacturer || '', barcode: product.barcode || '', sku: product.sku || '', description: product.description || '', category: product.category || '', subCategory: product.subCategory || '', tags: Array.isArray(product.tags) ? product.tags.join(', ') : '', requiresPrescription: Boolean(product.requiresPrescription), isActive: product.isActive !== false, images: product.images || [], lowStockThreshold: product.lowStockThreshold ?? '5',
      medicineDetails: { ...emptyForm(true).medicineDetails, ...(product.medicineDetails || {}) }, parapharmacyDetails: { ...emptyForm(false).parapharmacyDetails, ...(product.parapharmacyDetails || {}) },
      variants: variants.map((variant, index) => ({ ...makeVariant(isMedicine, index + 1), ...variant, price: variant.price ?? '', discountPrice: variant.discountPrice ?? '', stock: variant.stock ?? '', lowStockThreshold: variant.lowStockThreshold ?? '', strengthValue: variant.strengthValue ?? '', unitsPerPack: variant.unitsPerPack ?? '' })),
    })
    setFieldErrors({}); setShowModal(true)
  }
  const clearFieldError = (key) => setFieldErrors((current) => {
    if (!current[key]) return current
    const next = { ...current }
    delete next[key]
    return next
  })
  const change = (key, value) => { clearFieldError(key); setForm((current) => ({ ...current, [key]: value })) }
  const changeDetails = (group, key, value) => { clearFieldError(`${group}.${key}`); setForm((current) => ({ ...current, [group]: { ...current[group], [key]: value } })) }
  const changeVariant = (index, key, value) => { clearFieldError(`variants.${index}.${key}`); setForm((current) => ({ ...current, variants: current.variants.map((variant, i) => i === index ? { ...variant, [key]: value } : variant) })) }
  const setDefaultVariant = (index) => setForm((current) => ({ ...current, variants: current.variants.map((variant, i) => ({ ...variant, isDefault: i === index })) }))
  const removeVariant = (index) => setForm((current) => {
    if (current.variants.length === 1) return current
    const variants = current.variants.filter((_, i) => i !== index)
    if (!variants.some((variant) => variant.isDefault)) variants[0].isDefault = true
    return { ...current, variants }
  })

  const uploadImages = async (files) => {
    if (!files?.length) return
    const imagePattern = /\.(jpe?g|png|webp|gif|avif)$/i
    const allowedTypes = new Set(['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/png', 'image/x-png', 'image/webp', 'image/gif', 'image/avif'])
    const selected = Array.from(files)
    const accepted = selected.filter((file) => allowedTypes.has(String(file.type || '').toLowerCase()) || imagePattern.test(file.name || ''))
    const oversize = accepted.find((file) => file.size > 10 * 1024 * 1024)
    if (accepted.length !== selected.length) toast.error(tr('Unsupported image format. Upload a JPG, PNG, WebP, GIF, or AVIF image.'))
    if (oversize) { toast.error(tr('Each image must be 10 MB or smaller.')); return }
    if (!accepted.length) return
    const data = new FormData(); accepted.slice(0, Math.max(0, 8 - form.images.length)).forEach((file) => data.append('files', file))
    try {
      setIsUploading(true)
      const response = await api.post('/upload/product', data)
      const responsePayload = response?.data ?? response
      const urls = responsePayload?.data?.urls || responsePayload?.urls || []
      if (!urls.length) throw new Error('No images were uploaded')
      setForm((current) => ({ ...current, images: [...current.images, ...urls].slice(0, 8) }))
    } catch (error) {
      const payload = error.response?.data || {}
      const detailed = payload.errors?.[0]?.message
      const message = error.response?.status === 413 ? 'Each image must be 10 MB or smaller.' : detailed || payload.message || error.message || 'Image upload failed'
      toast.error(tr(message))
    } finally { setIsUploading(false) }
  }

  const save = async (event) => {
    event.preventDefault()
    const localErrors = {}
    if (!form.name.trim()) localErrors.name = 'Product name is required'
    if (isMedicine && !form.medicineDetails.activeIngredients.trim()) localErrors['medicineDetails.activeIngredients'] = 'Active ingredients are required for medicines'
    const productThreshold = Number(form.lowStockThreshold)
    if (String(form.lowStockThreshold ?? '').trim() === '' || !Number.isInteger(productThreshold) || productThreshold < 0) localErrors.lowStockThreshold = 'Enter a non-negative whole-number low-stock alert level.'
    if (Object.keys(localErrors).length) {
      setFieldErrors(localErrors)
      toast.error(tr('Please correct the highlighted fields.'))
      return
    }
    let variants
    try {
      variants = form.variants.map((variant, index) => {
        const priceIsBlank = String(variant.price ?? '').trim() === ''; const stockIsBlank = String(variant.stock ?? '').trim() === ''
        const price = Number(variant.price); const stock = Number(variant.stock); const discountPrice = nullableNumber(variant.discountPrice)
        const strengthValue = nullableNumber(variant.strengthValue); const unitsPerPack = nullableNumber(variant.unitsPerPack); const lowStockThreshold = nullableNumber(variant.lowStockThreshold)
        if (priceIsBlank || !Number.isFinite(price) || price < 0) throw optionValidationError('price', index)
        if (stockIsBlank || !Number.isInteger(stock) || stock < 0) throw optionValidationError('stock', index)
        if (discountPrice !== null && (!Number.isFinite(discountPrice) || discountPrice < 0 || discountPrice >= price)) throw optionValidationError('salePrice', index)
        if (strengthValue !== null && (!Number.isFinite(strengthValue) || strengthValue < 0)) throw optionValidationError('strength', index)
        if (unitsPerPack !== null && (!Number.isInteger(unitsPerPack) || unitsPerPack < 0)) throw optionValidationError('packQuantity', index)
        if (lowStockThreshold !== null && (!Number.isInteger(lowStockThreshold) || lowStockThreshold < 0)) throw optionValidationError('lowStock', index)
        return { ...(variant._id ? { _id: variant._id } : {}), name: optional(variant.name) || `Option ${index + 1}`, sku: optional(variant.sku), barcode: optional(variant.barcode), strengthValue, strengthUnit: optional(variant.strengthUnit), dosageForm: optional(variant.dosageForm), packageType: optional(variant.packageType), unitsPerPack, unitLabel: optional(variant.unitLabel), packageDescription: optional(variant.packageDescription), price, discountPrice, stock, lowStockThreshold, isDefault: variant.isDefault || (!form.variants.some((entry) => entry.isDefault) && index === 0), isActive: variant.isActive !== false }
      })
    } catch (error) {
      const optionIndex = Number.isInteger(error.optionIndex) ? error.optionIndex : 0
      const messages = {
        price: 'Enter a valid price for this option.',
        stock: 'Enter a whole stock quantity for this option.',
        salePrice: 'Sale price must be lower than the regular price.',
        strength: 'Strength must be a non-negative number.',
        packQuantity: 'Pack quantity must be a non-negative whole number.',
        lowStock: 'Low-stock alert level must be a non-negative whole number.',
      }
      const message = messages[error.kind] || 'Please correct the option details.'
      const key = error.kind === 'price' ? `variants.${optionIndex}.price`
        : error.kind === 'salePrice' ? `variants.${optionIndex}.discountPrice`
          : error.kind === 'stock' ? `variants.${optionIndex}.stock`
            : error.kind === 'strength' ? `variants.${optionIndex}.strengthValue`
              : error.kind === 'lowStock' ? `variants.${optionIndex}.lowStockThreshold`
                : `variants.${optionIndex}.unitsPerPack`
      setFieldErrors({ [key]: message })
      toast.error(tr(message))
      return
    }
    const payload = {
      name: form.name.trim(), description: optional(form.description), productType: isMedicine ? 'PHARMACY_MEDICINE' : 'PARAPHARMACY_PRODUCT', brand: optional(form.brand), manufacturer: optional(form.manufacturer), barcode: optional(form.barcode), sku: optional(form.sku), category: optional(form.category), subCategory: optional(form.subCategory), tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean), requiresPrescription: Boolean(form.requiresPrescription), isActive: Boolean(form.isActive), images: form.images, variants, lowStockThreshold: productThreshold,
      price: variants[0].price, stock: variants.reduce((sum, variant) => sum + variant.stock, 0), discountPrice: variants[0].discountPrice,
      medicineDetails: isMedicine ? { ...form.medicineDetails, manufacturer: optional(form.manufacturer) } : {},
      parapharmacyDetails: isMedicine ? {} : { ...form.parapharmacyDetails, manufacturer: optional(form.manufacturer) },
    }
    try {
      setIsSaving(true)
      if (editingProduct?._id) await productApi.updateProduct(editingProduct._id, payload)
      else await productApi.createProduct(payload)
      toast.success(tr(editingProduct ? 'Product updated' : 'Product created'))
      setShowModal(false); setEditingProduct(null); queryClient.invalidateQueries({ queryKey: ['products'] }); queryClient.invalidateQueries({ queryKey: ['pharmacy-inventory-summary'] }); refetch()
    } catch (error) {
      const failure = errorFromResponse(error)
      setFieldErrors(failure.fields)
      toast.error(tr(Object.keys(failure.fields).length ? 'Please correct the highlighted fields.' : failure.message))
    } finally { setIsSaving(false) }
  }

  const removeProduct = async (product) => {
    if (!window.confirm(`${tr('Delete')} ${product.name}?`)) return
    try { await productApi.deleteProduct(product._id); toast.success(tr('Product deleted')); refetch() } catch (error) { toast.error(tr(error.response?.data?.message || error.message || 'Unable to delete product')) }
  }

  const stockStatus = (product) => {
    const stock = Number(product.stock || 0)
    const productThreshold = Number(product.lowStockThreshold ?? 5)
    const activeVariants = (product.variants || []).filter((variant) => variant.isActive !== false)
    if (!activeVariants.length) return { stock, isLow: stock <= productThreshold, outOfStock: stock === 0 }
    return {
      stock,
      isLow: activeVariants.some((variant) => Number(variant.stock || 0) <= Number(variant.lowStockThreshold ?? productThreshold)),
      outOfStock: activeVariants.some((variant) => Number(variant.stock || 0) === 0),
    }
  }

  return (
    <div>
      <div className="dashboard-header d-flex align-items-center justify-content-between flex-wrap gap-2"><div><h3>{tr('Products')}</h3><p className="text-muted mb-0">{tr(isParapharmacy ? 'Create detailed, patient-ready parapharmacy listings.' : 'Create detailed, patient-ready pharmacy listings.')}</p></div><button className="btn btn-primary" onClick={openCreate} disabled={!canManageProducts}><i className="fa-solid fa-plus me-2" />{tr('Add product')}</button></div>
      {!canManageProducts && <div className="alert alert-warning d-flex align-items-center justify-content-between flex-wrap gap-2"><span>{tr(setup?.requiresSubscription ? 'Complete your business profile and activate a subscription before managing products.' : 'Complete your business profile before managing products.')}</span><Link className="btn btn-sm btn-outline-dark" to="/pharmacy/profile">{tr('Complete setup')}</Link></div>}
      {inventoryQuery.data && <div className="card border-warning mb-3"><div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-2"><div><strong>{tr('Inventory overview')}</strong><div className="small text-muted">{tr('Units in stock')}: {inventoryQuery.data?.data?.totalUnits ?? inventoryQuery.data?.totalUnits ?? 0} · {tr('Low-stock options')}: {inventoryQuery.data?.data?.lowStockCount ?? inventoryQuery.data?.lowStockCount ?? 0}</div></div><span className="badge bg-warning text-dark">{tr('Alerts use the thresholds set for each product option.')}</span></div></div>}
      <div className="card"><div className="card-body p-0"><div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead><tr><th>{tr('Product')}</th><th>{tr('Type / category')}</th><th>{tr('Options')}</th><th>{tr('Price')}</th><th>{tr('Stock')}</th><th>{tr('Status')}</th><th /></tr></thead><tbody>
        {isLoading ? <tr><td colSpan="7" className="text-center py-4"><span className="spinner-border spinner-border-sm" /></td></tr> : products.length === 0 ? <tr><td colSpan="7" className="text-center py-4 text-muted">{tr('No products yet.')}</td></tr> : products.map((product) => { const inventoryStatus = stockStatus(product); const { stock, isLow, outOfStock } = inventoryStatus; return <tr key={product._id}><td><div className="d-flex align-items-center gap-2"><img src={getImageUrl(product.images?.[0], '/assets/img/products/product.jpg')} alt="" style={{ width: 46, height: 46, objectFit: 'cover', borderRadius: 8 }} /><div><strong>{product.name}</strong>{product.requiresPrescription && <div><span className="badge bg-warning text-dark">{tr('Prescription')}</span></div>}</div></div></td><td><div>{tr(product.productType === 'PHARMACY_MEDICINE' ? 'Medicine' : 'Parapharmacy')}</div><small className="text-muted">{[product.category, product.subCategory].filter(Boolean).join(' · ') || tr('Uncategorized')}</small></td><td>{product.variants?.length || 1}</td><td>{new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-US', { style: 'currency', currency: 'EUR' }).format(Number(product.discountPrice ?? product.price ?? 0))}</td><td><strong className={isLow ? 'text-danger' : ''}>{stock}</strong><div><span className={`badge ${outOfStock ? 'bg-danger' : isLow ? 'bg-warning text-dark' : 'bg-light text-dark border'}`}>{tr(outOfStock ? 'Out of stock' : isLow ? 'Low stock' : 'In stock')}</span></div></td><td><span className={`badge ${product.isActive === false ? 'bg-secondary' : 'bg-success'}`}>{tr(product.isActive === false ? 'Hidden' : 'Active')}</span></td><td className="text-end"><button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEdit(product)}>{tr('Edit')}</button><button className="btn btn-sm btn-outline-danger" onClick={() => removeProduct(product)}>{tr('Delete')}</button></td></tr> })}
      </tbody></table></div>{pagination?.pages > 1 && <div className="p-3 d-flex justify-content-between"><button className="btn btn-sm btn-outline-secondary" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>{tr('Previous')}</button><span className="text-muted small">{tr('Page')} {pagination.page} {tr('of')} {pagination.pages}</span><button className="btn btn-sm btn-outline-secondary" disabled={page >= pagination.pages} onClick={() => setPage((value) => value + 1)}>{tr('Next')}</button></div>}</div></div>
      {showModal && <><div className="modal-backdrop fade show" /><div className="modal fade show d-block" role="dialog" aria-modal="true" aria-label={tr(editingProduct ? 'Edit product' : 'Add product')}><div className="modal-dialog modal-xl modal-dialog-scrollable"><form className="modal-content" onSubmit={save}><div className="modal-header"><div><h5 className="modal-title">{tr(editingProduct ? 'Edit product' : 'Add product')}</h5><small className="text-muted">{tr(isMedicine ? 'Medicine details and patient-safe dispensing options' : 'Product details and selectable options')}</small></div><button type="button" className="btn-close" aria-label={tr('Close')} onClick={() => setShowModal(false)} /></div><div className="modal-body">
        <h6 className="border-bottom pb-2">{tr('Basic information')}</h6><div className="row"><ProductFormInput label="Product name *" value={form.name} onChange={(value) => change('name', value)} error={fieldErrors.name} required /><ProductFormInput label="Brand" value={form.brand} onChange={(value) => change('brand', value)} error={fieldErrors.brand} /><ProductFormInput label="Manufacturer" value={form.manufacturer} onChange={(value) => change('manufacturer', value)} error={fieldErrors.manufacturer} /><ProductFormInput label="Product SKU" value={form.sku} onChange={(value) => change('sku', value)} error={fieldErrors.sku} /><ProductFormInput label="Barcode" value={form.barcode} onChange={(value) => change('barcode', value)} error={fieldErrors.barcode} /><ProductFormInput label="Category" value={form.category} onChange={(value) => change('category', value)} error={fieldErrors.category} /><ProductFormInput label="Subcategory" value={form.subCategory} onChange={(value) => change('subCategory', value)} error={fieldErrors.subCategory} /><ProductFormInput label="Tags (comma separated)" value={form.tags} onChange={(value) => change('tags', value)} error={fieldErrors.tags} /><ProductFormInput label="Low-stock alert at (units) *" type="number" min="0" step="1" value={form.lowStockThreshold} onChange={(value) => change('lowStockThreshold', value)} error={fieldErrors.lowStockThreshold} /><div className="col-12 mb-3"><label className="form-label">{tr('Description')}</label><textarea className={`form-control${fieldErrors.description ? ' is-invalid' : ''}`} rows="3" value={form.description} onChange={(event) => change('description', event.target.value)} />{fieldErrors.description && <div className="invalid-feedback">{tr(fieldErrors.description)}</div>}</div></div>
        <div className="d-flex flex-wrap gap-4 mb-4"><label className="form-check"><input className="form-check-input me-2" type="checkbox" checked={form.requiresPrescription} onChange={(event) => change('requiresPrescription', event.target.checked)} />{tr('Requires a prescription before purchase')}</label><label className="form-check"><input className="form-check-input me-2" type="checkbox" checked={form.isActive} onChange={(event) => change('isActive', event.target.checked)} />{tr('Visible in storefront')}</label></div>
        <h6 className="border-bottom pb-2">{tr('Images')}</h6><div className="mb-4"><input className="form-control" type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,image/avif,.jpg,.jpeg,.png,.webp,.gif,.avif" disabled={isUploading || form.images.length >= 8} onChange={async (event) => { await uploadImages(event.target.files); event.target.value = '' }} /><small className="text-muted">{tr('Up to eight JPG, PNG, WebP, GIF, or AVIF images, 10 MB each. The first image is used in product and order lists.')}</small><div className="d-flex flex-wrap gap-2 mt-2">{form.images.map((url) => <div key={url} className="position-relative"><img src={getImageUrl(url, '/assets/img/products/product.jpg')} alt="" style={{ width: 76, height: 76, objectFit: 'cover', borderRadius: 8 }} /><button type="button" className="btn btn-sm btn-danger position-absolute top-0 end-0" aria-label={tr('Remove image')} onClick={() => change('images', form.images.filter((image) => image !== url))}>×</button></div>)}</div></div>
        <h6 className="border-bottom pb-2">{tr(isMedicine ? 'Medicine information' : 'Product information')}</h6><div className="row mb-3"><ProductDetailsFields fields={isMedicine ? medicineFields : parapharmacyFields} details={isMedicine ? form.medicineDetails : form.parapharmacyDetails} errors={fieldErrors} group={isMedicine ? 'medicineDetails' : 'parapharmacyDetails'} onChange={(field, value) => changeDetails(isMedicine ? 'medicineDetails' : 'parapharmacyDetails', field, value)} /></div>
        <div className="d-flex justify-content-between align-items-center border-bottom pb-2"><h6 className="mb-0">{tr('Options, price & stock')}</h6><button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setForm((current) => ({ ...current, variants: [...current.variants, makeVariant(isMedicine, current.variants.length + 1)] }))}><i className="fa-solid fa-plus me-1" />{tr('Add option')}</button></div>
        {form.variants.map((variant, index) => <div className="border rounded-3 p-3 mt-3" key={variant._id || index}><div className="d-flex justify-content-between align-items-center mb-2"><strong>{tr('Option')} {index + 1}</strong><div className="d-flex gap-2"><label className="form-check small m-0"><input className="form-check-input me-1" type="radio" checked={variant.isDefault} onChange={() => setDefaultVariant(index)} />{tr('Default')}</label><button type="button" className="btn btn-sm btn-outline-danger" disabled={form.variants.length === 1} onClick={() => removeVariant(index)}>{tr('Remove')}</button></div></div><div className="row"><ProductFormInput label="Option name" value={variant.name} onChange={(value) => changeVariant(index, 'name', value)} error={fieldErrors[`variants.${index}.name`]} /><ProductFormInput label="Option SKU" value={variant.sku} onChange={(value) => changeVariant(index, 'sku', value)} error={fieldErrors[`variants.${index}.sku`]} /><ProductFormInput label="Regular price (€) *" type="number" min="0" step="0.01" value={variant.price} onChange={(value) => changeVariant(index, 'price', value)} error={fieldErrors[`variants.${index}.price`]} /><ProductFormInput label="Sale price (€)" type="number" min="0" step="0.01" value={variant.discountPrice} onChange={(value) => changeVariant(index, 'discountPrice', value)} error={fieldErrors[`variants.${index}.discountPrice`]} /><ProductFormInput label="Stock quantity *" type="number" min="0" step="1" value={variant.stock} onChange={(value) => changeVariant(index, 'stock', value)} error={fieldErrors[`variants.${index}.stock`]} /><ProductFormInput label="Option alert level (optional)" type="number" min="0" step="1" value={variant.lowStockThreshold} onChange={(value) => changeVariant(index, 'lowStockThreshold', value)} error={fieldErrors[`variants.${index}.lowStockThreshold`]} placeholder={tr('Uses product level')} /><ProductFormInput label="Barcode" value={variant.barcode} onChange={(value) => changeVariant(index, 'barcode', value)} error={fieldErrors[`variants.${index}.barcode`]} /><ProductFormInput label="Strength" type="number" min="0" step="0.01" value={variant.strengthValue} onChange={(value) => changeVariant(index, 'strengthValue', value)} error={fieldErrors[`variants.${index}.strengthValue`]} /><ProductFormInput label="Strength unit" value={variant.strengthUnit} onChange={(value) => changeVariant(index, 'strengthUnit', value)} error={fieldErrors[`variants.${index}.strengthUnit`]} /><ProductFormInput label="Dosage form" value={variant.dosageForm} onChange={(value) => changeVariant(index, 'dosageForm', value)} error={fieldErrors[`variants.${index}.dosageForm`]} /><ProductFormInput label="Package type" value={variant.packageType} onChange={(value) => changeVariant(index, 'packageType', value)} error={fieldErrors[`variants.${index}.packageType`]} /><ProductFormInput label="Units per pack" type="number" min="0" step="1" value={variant.unitsPerPack} onChange={(value) => changeVariant(index, 'unitsPerPack', value)} error={fieldErrors[`variants.${index}.unitsPerPack`]} /><ProductFormInput label="Unit label" value={variant.unitLabel} onChange={(value) => changeVariant(index, 'unitLabel', value)} error={fieldErrors[`variants.${index}.unitLabel`]} /><div className="col-12"><label className="form-label">{tr('Package description')}</label><input className={`form-control${fieldErrors[`variants.${index}.packageDescription`] ? ' is-invalid' : ''}`} value={variant.packageDescription || ''} onChange={(event) => changeVariant(index, 'packageDescription', event.target.value)} />{fieldErrors[`variants.${index}.packageDescription`] && <div className="invalid-feedback">{tr(fieldErrors[`variants.${index}.packageDescription`])}</div>}</div></div></div>)}
      </div><div className="modal-footer"><button type="button" className="btn btn-light" onClick={() => setShowModal(false)} disabled={isSaving}>{tr('Cancel')}</button><button className="btn btn-primary" type="submit" disabled={isSaving || isUploading}>{tr(isSaving ? 'Saving…' : editingProduct ? 'Save changes' : 'Create product')}</button></div></form></div></div></>}
    </div>
  )
}

export default PharmacyProducts
