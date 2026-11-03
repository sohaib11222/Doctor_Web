import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Breadcrumb from '../../components/common/Breadcrumb'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import * as orderApi from '../../api/order'
import * as profileApi from '../../api/profile'
import { getUserProfile } from '../../api/profile'

const normalise = (address = {}) => ({ line1: String(address.line1 || '').trim(), line2: String(address.line2 || '').trim(), city: String(address.city || '').trim(), state: String(address.state || '').trim(), country: String(address.country || '').trim(), zip: String(address.zip || '').trim() })
const validAddress = (address) => Boolean(address.line1 && address.city && address.state && address.country && address.zip)
const unwrap = (response) => { const outer = response?.data ?? response; return outer?.data ?? outer }

const ProductCheckout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const userId = user?._id || user?.id
  const [useNewAddress, setUseNewAddress] = useState(false)
  const [address, setAddress] = useState({ line1: '', line2: '', city: '', state: '', country: '', zip: '' })
  const [termsAccepted, setTermsAccepted] = useState(false)
  const { data: userResponse } = useQuery({ queryKey: ['user', userId], queryFn: () => getUserProfile(userId), enabled: Boolean(userId) })
  const profile = unwrap(userResponse) || user
  const savedAddress = useMemo(() => normalise(profile?.address || user?.address), [profile?.address, user?.address])
  const subtotal = getCartTotal()
  const shippingGroups = useMemo(() => {
    const groups = new Map()
    cartItems.forEach((item) => {
      const key = item.sellerId?._id || item.sellerId || item._id
      if (!groups.has(String(key))) groups.set(String(key), { fee: Number(item.shippingSettings?.fee || 0), deliveryDays: item.shippingSettings?.deliveryDays || null })
    })
    return [...groups.values()]
  }, [cartItems])
  const shipping = shippingGroups.reduce((total, group) => total + group.fee, 0)
  const total = subtotal + shipping

  useEffect(() => { if (!cartItems.length) { toast.warning('Your cart is empty'); navigate('/product-all') } }, [cartItems.length, navigate])
  useEffect(() => { if (validAddress(savedAddress) && !useNewAddress) setAddress(savedAddress) }, [savedAddress, useNewAddress])
  const setField = (field, value) => setAddress((current) => ({ ...current, [field]: value }))
  const submit = async (event) => {
    event.preventDefault()
    if (!user) { toast.error('Please sign in before checkout'); navigate('/login'); return }
    if (String(user.role || '').toUpperCase() !== 'PATIENT') { toast.error('Only patient accounts can complete product checkout'); return }
    if (!termsAccepted) { toast.error('Please accept the Terms & Conditions'); return }
    const mustUseEnteredAddress = useNewAddress || !validAddress(savedAddress)
    const deliveryAddress = mustUseEnteredAddress ? normalise(address) : savedAddress
    if (!validAddress(deliveryAddress)) { toast.error('Add a complete delivery address before continuing'); return }
    try {
      if (mustUseEnteredAddress) await profileApi.updateUserProfile({ address: deliveryAddress })
      const response = await orderApi.createOrder({ items: cartItems.map((item) => ({ productId: item._id, variantId: item.variantId || undefined, quantity: item.quantity })), shippingAddress: deliveryAddress, paymentMethod: 'STRIPE' })
      const result = unwrap(response)
      const orders = Array.isArray(result?.orders) ? result.orders : result ? [result] : []
      clearCart()
      toast.success(orders.length > 1 ? `${orders.length} orders created. Review and pay each order.` : 'Order created. Review your delivery details and complete payment.')
      if (orders.length === 1 && orders[0]?._id) navigate(`/order-details/${orders[0]._id}`)
      else navigate('/order-history')
    } catch (error) { toast.error(error.response?.data?.message || error.message || 'Checkout failed') }
  }
  if (!cartItems.length) return null
  return <>
    <Breadcrumb title="Pharmacy" li1="Checkout" li2="Checkout" />
    <div className="content"><div className="container"><div className="row"><div className="col-lg-7"><form className="card" onSubmit={submit}><div className="card-header"><h3 className="card-title mb-0">Delivery address</h3></div><div className="card-body">
      {!validAddress(savedAddress) && !useNewAddress && <div className="alert alert-warning d-flex justify-content-between align-items-center flex-wrap gap-2"><span>A delivery address is required before checkout.</span><Link to="/profile-settings" className="btn btn-sm btn-primary">Add delivery address</Link></div>}
      {validAddress(savedAddress) && !useNewAddress && <div className="border rounded-3 p-3 bg-light mb-3"><div className="d-flex justify-content-between"><strong>Saved delivery address</strong><button type="button" className="btn btn-link btn-sm p-0" onClick={() => setUseNewAddress(true)}>Use a different address</button></div><div className="mt-2">{savedAddress.line1}{savedAddress.line2 ? `, ${savedAddress.line2}` : ''}<br />{savedAddress.city}, {savedAddress.state} {savedAddress.zip}<br />{savedAddress.country}</div></div>}
      {(useNewAddress || !validAddress(savedAddress)) && <><div className="d-flex justify-content-between align-items-center mb-3"><h5 className="mb-0">{validAddress(savedAddress) ? 'Different delivery address' : 'Add delivery address'}</h5>{validAddress(savedAddress) && <button type="button" className="btn btn-link btn-sm" onClick={() => { setUseNewAddress(false); setAddress(savedAddress) }}>Use saved address</button>}</div><div className="row"><div className="col-12 mb-3"><label className="form-label">Address line 1 *</label><input required className="form-control" value={address.line1} onChange={(e) => setField('line1', e.target.value)} /></div><div className="col-12 mb-3"><label className="form-label">Address line 2</label><input className="form-control" value={address.line2} onChange={(e) => setField('line2', e.target.value)} /></div><div className="col-md-6 mb-3"><label className="form-label">City *</label><input required className="form-control" value={address.city} onChange={(e) => setField('city', e.target.value)} /></div><div className="col-md-6 mb-3"><label className="form-label">State / region *</label><input required className="form-control" value={address.state} onChange={(e) => setField('state', e.target.value)} /></div><div className="col-md-6 mb-3"><label className="form-label">Postcode *</label><input required className="form-control" value={address.zip} onChange={(e) => setField('zip', e.target.value)} /></div><div className="col-md-6 mb-3"><label className="form-label">Country *</label><input required className="form-control" value={address.country} onChange={(e) => setField('country', e.target.value)} /></div></div><small className="text-muted">This address will be saved securely to your patient profile and attached to your order.</small></>}
      <hr className="my-4" /><h4>Payment</h4><div className="alert alert-light border"><i className="fa-solid fa-lock me-2 text-success" />Secure card payment is completed after you confirm the order details.</div><label className="form-check mt-3"><input className="form-check-input me-2" type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} />I accept the <Link to="/terms-condition">Terms &amp; Conditions</Link>.</label><button className="btn btn-primary w-100 mt-4" type="submit">Place order · €{total.toFixed(2)}</button>
    </div></form></div><div className="col-lg-5"><div className="card booking-card"><div className="card-header"><h3 className="card-title mb-0">Order summary</h3></div><div className="card-body"><div className="list-group list-group-flush">{cartItems.map((item) => <div className="list-group-item px-0 d-flex justify-content-between" key={item.cartItemId || `${item._id}:${item.variantId || ''}`}><div><strong>{item.name}</strong>{item.variantName && <div className="small text-muted">{item.variantName}</div>}<small className="text-muted">Quantity: {item.quantity}</small></div><span>€{(Number(item.price) * item.quantity).toFixed(2)}</span></div>)}</div><hr /><div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span>€{subtotal.toFixed(2)}</span></div><div className="d-flex justify-content-between mb-2"><span>Delivery</span><span>€{shipping.toFixed(2)}</span></div>{shippingGroups.some((group) => group.deliveryDays) && <div className="small text-muted mb-2"><i className="fa-solid fa-truck me-1" />Estimated delivery: {shippingGroups.filter((group) => group.deliveryDays).map((group) => `${group.deliveryDays} day${group.deliveryDays === 1 ? '' : 's'}`).join(', ')}.</div>}<hr /><div className="d-flex justify-content-between fs-5"><strong>Total</strong><strong>€{total.toFixed(2)}</strong></div></div></div></div></div></div></div>
  </>
}

export default ProductCheckout
