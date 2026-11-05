import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../api/axios'
import * as productApi from '../../api/product'
import * as pharmacyApi from '../../api/pharmacy'
import { getImageUrl } from '../../utils/imageUtils'

const makeVariant = (medicine, index = 1) => ({
  name: `Option ${index}`, sku: '', barcode: '', strengthValue: '', strengthUnit: 'mg', dosageForm: medicine ? 'Tablet' : '', packageType: 'Box', unitsPerPack: '', unitLabel: medicine ? 'tablets' : 'units', packageDescription: '', price: '', discountPrice: '', stock: '', isDefault: index === 1, isActive: true,
})

const emptyForm = (medicine) => ({
  name: '', brand: '', manufacturer: '', barcode: '', sku: '', description: '', category: '', subCategory: '', tags: '', requiresPrescription: false, isActive: true, images: [],
  medicineDetails: { activeIngredients: '', administrationRoute: '', indications: '', dosageInstructions: '', warnings: '', storageInstructions: '', authorizationHolder: '', registrationNumber: '', leafletUrl: '' },
  parapharmacyDetails: { productClass: '', ingredients: '', allergens: '', usageInstructions: '', warnings: '', storageInstructions: '' },
  variants: [makeVariant(medicine)],
})

const nullableNumber = (value) => value === '' || value === null || value === undefined ? null : Number(value)
const optional = (value) => String(value || '').trim() || null

// These inputs intentionally live outside of PharmacyProducts. Defining them inside
// the page recreates their component type whenever the form state changes, causing
// React to unmount the focused input after every character.
const ProductFormInput = ({ label, value, onChange, type = 'text', ...props }) => (
  <div className="col-md-6 mb-3">
    <label className="form-label">{label}</label>
    <input
      className="form-control"
      type={type}
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      {...props}
    />
  </div>
)

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

const ProductDetailsFields = ({ fields, details, onChange }) => fields.map(([field, label]) => (
  <ProductFormInput
    key={field}
    label={label}
    value={details?.[field]}
    onChange={(value) => onChange(field, value)}
  />
))

const PharmacyProducts = () => {
  const { user } = useAuth()
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

  const { data: setupResponse } = useQuery({ queryKey: ['pharmacy-setup-status'], queryFn: pharmacyApi.getPharmacySetupStatus, enabled: Boolean(user?._id) })
  const setupOuter = setupResponse?.data ?? setupResponse
  const setup = setupOuter?.data ?? setupOuter
  const canManageProducts = Boolean(setup?.profileCompleted && (!setup?.requiresSubscription || setup?.hasActiveSubscription) && String(user?.status || '').toUpperCase() === 'APPROVED')

  const params = useMemo(() => ({ page, limit: 12, sellerType: isParapharmacy ? 'PARAPHARMACY' : 'PHARMACY', sellerId: user?._id, isActive: 'all' }), [page, user?._id, isParapharmacy])
  const { data: productsResponse, isLoading, refetch } = useQuery({ queryKey: ['pharmacy-products', params], queryFn: () => productApi.listProducts(params), enabled: Boolean(user?._id) })
  const payload = productsResponse?.data ?? productsResponse
  const products = payload?.data?.products || payload?.products || []
  const pagination = payload?.data?.pagination || payload?.pagination

  const openCreate = () => {
    if (!canManageProducts) { toast.info('Complete the required account setup before managing products.'); return }
    setEditingProduct(null); setForm(emptyForm(isMedicine)); setShowModal(true)
  }
  const openEdit = (product) => {
    if (!canManageProducts) { toast.info('Complete the required account setup before managing products.'); return }
    const variants = Array.isArray(product.variants) && product.variants.length ? product.variants : [{ ...makeVariant(isMedicine), name: product.name, sku: product.sku || '', barcode: product.barcode || '', price: product.price ?? '', discountPrice: product.discountPrice ?? '', stock: product.stock ?? '', isDefault: true }]
    setEditingProduct(product)
    setForm({
      ...emptyForm(isMedicine), name: product.name || '', brand: product.brand || '', manufacturer: product.manufacturer || '', barcode: product.barcode || '', sku: product.sku || '', description: product.description || '', category: product.category || '', subCategory: product.subCategory || '', tags: Array.isArray(product.tags) ? product.tags.join(', ') : '', requiresPrescription: Boolean(product.requiresPrescription), isActive: product.isActive !== false, images: product.images || [],
      medicineDetails: { ...emptyForm(true).medicineDetails, ...(product.medicineDetails || {}) }, parapharmacyDetails: { ...emptyForm(false).parapharmacyDetails, ...(product.parapharmacyDetails || {}) },
      variants: variants.map((variant, index) => ({ ...makeVariant(isMedicine, index + 1), ...variant, price: variant.price ?? '', discountPrice: variant.discountPrice ?? '', stock: variant.stock ?? '', strengthValue: variant.strengthValue ?? '', unitsPerPack: variant.unitsPerPack ?? '' })),
    })
    setShowModal(true)
  }
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const changeDetails = (group, key, value) => setForm((current) => ({ ...current, [group]: { ...current[group], [key]: value } }))
  const changeVariant = (index, key, value) => setForm((current) => ({ ...current, variants: current.variants.map((variant, i) => i === index ? { ...variant, [key]: value } : variant) }))
  const setDefaultVariant = (index) => setForm((current) => ({ ...current, variants: current.variants.map((variant, i) => ({ ...variant, isDefault: i === index })) }))
  const removeVariant = (index) => setForm((current) => {
    if (current.variants.length === 1) return current
    const variants = current.variants.filter((_, i) => i !== index)
    if (!variants.some((variant) => variant.isDefault)) variants[0].isDefault = true
    return { ...current, variants }
  })

  const uploadImages = async (files) => {
    if (!files?.length) return
    const data = new FormData(); Array.from(files).forEach((file) => data.append('files', file))
    try {
      setIsUploading(true)
      const response = await api.post('/upload/product', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      const responsePayload = response?.data ?? response
      const urls = responsePayload?.data?.urls || responsePayload?.urls || []
      if (!urls.length) throw new Error('No images were uploaded')
      setForm((current) => ({ ...current, images: [...current.images, ...urls].slice(0, 8) }))
    } catch (error) { toast.error(error.response?.data?.message || error.message || 'Image upload failed') } finally { setIsUploading(false) }
  }

  const save = async (event) => {
    event.preventDefault()
    if (!form.name.trim()) { toast.error('Product name is required'); return }
    if (isMedicine && !form.medicineDetails.activeIngredients.trim()) { toast.error('Active ingredients are required for medicines'); return }
    let variants
    try {
      variants = form.variants.map((variant, index) => {
        const price = Number(variant.price); const stock = Number(variant.stock); const discountPrice = nullableNumber(variant.discountPrice)
        const strengthValue = nullableNumber(variant.strengthValue); const unitsPerPack = nullableNumber(variant.unitsPerPack)
        if (!Number.isFinite(price) || price < 0) throw new Error(`Enter a valid price for option ${index + 1}`)
        if (!Number.isInteger(stock) || stock < 0) throw new Error(`Enter a whole stock quantity for option ${index + 1}`)
        if (discountPrice !== null && (!Number.isFinite(discountPrice) || discountPrice < 0 || discountPrice >= price)) throw new Error(`Sale price must be lower than regular price for option ${index + 1}`)
        if (strengthValue !== null && (!Number.isFinite(strengthValue) || strengthValue < 0)) throw new Error(`Strength is invalid for option ${index + 1}`)
        if (unitsPerPack !== null && (!Number.isInteger(unitsPerPack) || unitsPerPack < 0)) throw new Error(`Pack quantity is invalid for option ${index + 1}`)
        return { ...(variant._id ? { _id: variant._id } : {}), name: optional(variant.name) || `Option ${index + 1}`, sku: optional(variant.sku), barcode: optional(variant.barcode), strengthValue, strengthUnit: optional(variant.strengthUnit), dosageForm: optional(variant.dosageForm), packageType: optional(variant.packageType), unitsPerPack, unitLabel: optional(variant.unitLabel), packageDescription: optional(variant.packageDescription), price, discountPrice, stock, isDefault: variant.isDefault || (!form.variants.some((entry) => entry.isDefault) && index === 0), isActive: variant.isActive !== false }
      })
    } catch (error) { toast.error(error.message); return }
    const payload = {
      name: form.name.trim(), description: optional(form.description), productType: isMedicine ? 'PHARMACY_MEDICINE' : 'PARAPHARMACY_PRODUCT', brand: optional(form.brand), manufacturer: optional(form.manufacturer), barcode: optional(form.barcode), sku: optional(form.sku), category: optional(form.category), subCategory: optional(form.subCategory), tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean), requiresPrescription: Boolean(form.requiresPrescription), isActive: Boolean(form.isActive), images: form.images, variants,
      price: variants[0].price, stock: variants.reduce((sum, variant) => sum + variant.stock, 0), discountPrice: variants[0].discountPrice,
      medicineDetails: isMedicine ? { ...form.medicineDetails, manufacturer: optional(form.manufacturer) } : {},
      parapharmacyDetails: isMedicine ? {} : { ...form.parapharmacyDetails, manufacturer: optional(form.manufacturer) },
    }
    try {
      setIsSaving(true)
      if (editingProduct?._id) await productApi.updateProduct(editingProduct._id, payload)
      else await productApi.createProduct(payload)
      toast.success(editingProduct ? 'Product updated' : 'Product created')
      setShowModal(false); setEditingProduct(null); queryClient.invalidateQueries({ queryKey: ['products'] }); refetch()
    } catch (error) { toast.error(error.response?.data?.message || error.message || 'Unable to save product') } finally { setIsSaving(false) }
  }

  const removeProduct = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return
    try { await productApi.deleteProduct(product._id); toast.success('Product deleted'); refetch() } catch (error) { toast.error(error.response?.data?.message || error.message || 'Unable to delete product') }
  }

  return (
    <div>
      <div className="dashboard-header d-flex align-items-center justify-content-between flex-wrap gap-2"><div><h3>Products</h3><p className="text-muted mb-0">Create detailed, patient-ready {isParapharmacy ? 'parapharmacy' : 'pharmacy'} listings.</p></div><button className="btn btn-primary" onClick={openCreate} disabled={!canManageProducts}><i className="fa-solid fa-plus me-2" />Add product</button></div>
      {!canManageProducts && <div className="alert alert-warning d-flex align-items-center justify-content-between flex-wrap gap-2"><span>Complete your business profile{setup?.requiresSubscription ? ' and activate a subscription' : ''} before managing products.</span><Link className="btn btn-sm btn-outline-dark" to="/pharmacy/profile">Complete setup</Link></div>}
      <div className="card"><div className="card-body p-0"><div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead><tr><th>Product</th><th>Type / category</th><th>Options</th><th>Price</th><th>Stock</th><th>Status</th><th /></tr></thead><tbody>
        {isLoading ? <tr><td colSpan="7" className="text-center py-4"><span className="spinner-border spinner-border-sm" /></td></tr> : products.length === 0 ? <tr><td colSpan="7" className="text-center py-4 text-muted">No products yet.</td></tr> : products.map((product) => <tr key={product._id}><td><div className="d-flex align-items-center gap-2"><img src={getImageUrl(product.images?.[0], '/assets/img/products/product.jpg')} alt="" style={{ width: 46, height: 46, objectFit: 'cover', borderRadius: 8 }} /><div><strong>{product.name}</strong>{product.requiresPrescription && <div><span className="badge bg-warning text-dark">Prescription</span></div>}</div></div></td><td><div>{product.productType === 'PHARMACY_MEDICINE' ? 'Medicine' : 'Parapharmacy'}</div><small className="text-muted">{[product.category, product.subCategory].filter(Boolean).join(' · ') || 'Uncategorized'}</small></td><td>{product.variants?.length || 1}</td><td>€{Number(product.discountPrice ?? product.price ?? 0).toFixed(2)}</td><td>{product.stock ?? 0}</td><td><span className={`badge ${product.isActive === false ? 'bg-secondary' : 'bg-success'}`}>{product.isActive === false ? 'Hidden' : 'Active'}</span></td><td className="text-end"><button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEdit(product)}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={() => removeProduct(product)}>Delete</button></td></tr>)}
      </tbody></table></div>{pagination?.pages > 1 && <div className="p-3 d-flex justify-content-between"><button className="btn btn-sm btn-outline-secondary" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</button><span className="text-muted small">Page {pagination.page} of {pagination.pages}</span><button className="btn btn-sm btn-outline-secondary" disabled={page >= pagination.pages} onClick={() => setPage((value) => value + 1)}>Next</button></div>}</div></div>
      {showModal && <><div className="modal-backdrop fade show" /><div className="modal fade show d-block" role="dialog" aria-modal="true"><div className="modal-dialog modal-xl modal-dialog-scrollable"><form className="modal-content" onSubmit={save}><div className="modal-header"><div><h5 className="modal-title">{editingProduct ? 'Edit product' : 'Add product'}</h5><small className="text-muted">{isMedicine ? 'Medicine details and patient-safe dispensing options' : 'Product details and selectable options'}</small></div><button type="button" className="btn-close" onClick={() => setShowModal(false)} /></div><div className="modal-body">
        <h6 className="border-bottom pb-2">Basic information</h6><div className="row"><ProductFormInput label="Product name *" value={form.name} onChange={(value) => change('name', value)} required /><ProductFormInput label="Brand" value={form.brand} onChange={(value) => change('brand', value)} /><ProductFormInput label="Manufacturer" value={form.manufacturer} onChange={(value) => change('manufacturer', value)} /><ProductFormInput label="Product SKU" value={form.sku} onChange={(value) => change('sku', value)} /><ProductFormInput label="Barcode" value={form.barcode} onChange={(value) => change('barcode', value)} /><ProductFormInput label="Category" value={form.category} onChange={(value) => change('category', value)} /><ProductFormInput label="Subcategory" value={form.subCategory} onChange={(value) => change('subCategory', value)} /><ProductFormInput label="Tags (comma separated)" value={form.tags} onChange={(value) => change('tags', value)} /><div className="col-12 mb-3"><label className="form-label">Description</label><textarea className="form-control" rows="3" value={form.description} onChange={(event) => change('description', event.target.value)} /></div></div>
        <div className="d-flex flex-wrap gap-4 mb-4"><label className="form-check"><input className="form-check-input me-2" type="checkbox" checked={form.requiresPrescription} onChange={(event) => change('requiresPrescription', event.target.checked)} />Requires a prescription before purchase</label><label className="form-check"><input className="form-check-input me-2" type="checkbox" checked={form.isActive} onChange={(event) => change('isActive', event.target.checked)} />Visible in storefront</label></div>
        <h6 className="border-bottom pb-2">Images</h6><div className="mb-4"><input className="form-control" type="file" multiple accept="image/*" disabled={isUploading || form.images.length >= 8} onChange={(event) => uploadImages(event.target.files)} /><small className="text-muted">Up to eight images. The first image is used in product and order lists.</small><div className="d-flex flex-wrap gap-2 mt-2">{form.images.map((url) => <div key={url} className="position-relative"><img src={getImageUrl(url, '/assets/img/products/product.jpg')} alt="" style={{ width: 76, height: 76, objectFit: 'cover', borderRadius: 8 }} /><button type="button" className="btn btn-sm btn-danger position-absolute top-0 end-0" aria-label="Remove image" onClick={() => change('images', form.images.filter((image) => image !== url))}>×</button></div>)}</div></div>
        <h6 className="border-bottom pb-2">{isMedicine ? 'Medicine information' : 'Product information'}</h6><div className="row mb-3"><ProductDetailsFields fields={isMedicine ? medicineFields : parapharmacyFields} details={isMedicine ? form.medicineDetails : form.parapharmacyDetails} onChange={(field, value) => changeDetails(isMedicine ? 'medicineDetails' : 'parapharmacyDetails', field, value)} /></div>
        <div className="d-flex justify-content-between align-items-center border-bottom pb-2"><h6 className="mb-0">Options, price & stock</h6><button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setForm((current) => ({ ...current, variants: [...current.variants, makeVariant(isMedicine, current.variants.length + 1)] }))}><i className="fa-solid fa-plus me-1" />Add option</button></div>
        {form.variants.map((variant, index) => <div className="border rounded-3 p-3 mt-3" key={variant._id || index}><div className="d-flex justify-content-between align-items-center mb-2"><strong>Option {index + 1}</strong><div className="d-flex gap-2"><label className="form-check small m-0"><input className="form-check-input me-1" type="radio" checked={variant.isDefault} onChange={() => setDefaultVariant(index)} />Default</label><button type="button" className="btn btn-sm btn-outline-danger" disabled={form.variants.length === 1} onClick={() => removeVariant(index)}>Remove</button></div></div><div className="row"><ProductFormInput label="Option name" value={variant.name} onChange={(value) => changeVariant(index, 'name', value)} /><ProductFormInput label="Option SKU" value={variant.sku} onChange={(value) => changeVariant(index, 'sku', value)} /><ProductFormInput label="Regular price (€) *" type="number" min="0" step="0.01" value={variant.price} onChange={(value) => changeVariant(index, 'price', value)} /><ProductFormInput label="Sale price (€)" type="number" min="0" step="0.01" value={variant.discountPrice} onChange={(value) => changeVariant(index, 'discountPrice', value)} /><ProductFormInput label="Stock quantity *" type="number" min="0" step="1" value={variant.stock} onChange={(value) => changeVariant(index, 'stock', value)} /><ProductFormInput label="Barcode" value={variant.barcode} onChange={(value) => changeVariant(index, 'barcode', value)} /><ProductFormInput label="Strength" type="number" min="0" step="0.01" value={variant.strengthValue} onChange={(value) => changeVariant(index, 'strengthValue', value)} /><ProductFormInput label="Strength unit" value={variant.strengthUnit} onChange={(value) => changeVariant(index, 'strengthUnit', value)} /><ProductFormInput label="Dosage form" value={variant.dosageForm} onChange={(value) => changeVariant(index, 'dosageForm', value)} /><ProductFormInput label="Package type" value={variant.packageType} onChange={(value) => changeVariant(index, 'packageType', value)} /><ProductFormInput label="Units per pack" type="number" min="0" step="1" value={variant.unitsPerPack} onChange={(value) => changeVariant(index, 'unitsPerPack', value)} /><ProductFormInput label="Unit label" value={variant.unitLabel} onChange={(value) => changeVariant(index, 'unitLabel', value)} /><div className="col-12"><label className="form-label">Package description</label><input className="form-control" value={variant.packageDescription || ''} onChange={(event) => changeVariant(index, 'packageDescription', event.target.value)} /></div></div></div>)}
      </div><div className="modal-footer"><button type="button" className="btn btn-light" onClick={() => setShowModal(false)} disabled={isSaving}>Cancel</button><button className="btn btn-primary" type="submit" disabled={isSaving || isUploading}>{isSaving ? 'Saving…' : editingProduct ? 'Save changes' : 'Create product'}</button></div></form></div></div></>}
    </div>
  )
}

export default PharmacyProducts
