import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Breadcrumb from '../../components/common/Breadcrumb'
import * as pharmacyApi from '../../api/pharmacy'
import * as productApi from '../../api/product'

const PharmacyDetails = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const pharmacyId = searchParams.get('id')

  // Fetch pharmacy details
  const { data: pharmacyData, isLoading: pharmacyLoading, error: pharmacyError } = useQuery({
    queryKey: ['pharmacy', pharmacyId],
    queryFn: () => pharmacyApi.getPharmacyById(pharmacyId),
    enabled: !!pharmacyId
  })

  // Fetch products from this pharmacy
  // Extract ownerId - handle both populated object and direct ID
  const ownerId = pharmacyData?.data?.ownerId 
    ? (typeof pharmacyData.data.ownerId === 'object' && pharmacyData.data.ownerId._id 
        ? pharmacyData.data.ownerId._id 
        : pharmacyData.data.ownerId)
    : null
  const { data: productsData } = useQuery({
    queryKey: ['pharmacyProducts', ownerId],
    queryFn: () => productApi.listProducts({ sellerId: ownerId, sellerType: 'PHARMACY', limit: 6 }),
    enabled: !!ownerId
  })

  const pharmacy = pharmacyData?.data || pharmacyData
  const products = productsData?.data?.products || []

  const formatAddress = (address) => {
    if (!address) return 'Address not available'
    const parts = [
      address.line1,
      address.line2,
      address.city,
      address.state,
      address.country,
      address.zip
    ].filter(Boolean)
    return parts.join(', ') || 'Address not available'
  }

  if (pharmacyLoading) {
    return (
      <>
        <Breadcrumb title="Pharmacy" li1="Pharmacy Details" li2="Loading..." />
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

  if (pharmacyError || !pharmacy) {
    return (
      <>
        <Breadcrumb title="Pharmacy" li1="Pharmacy Details" li2="Not Found" />
        <div className="content">
          <div className="container">
            <div className="alert alert-danger">
              <h5>Pharmacy Not Found</h5>
              <p>The pharmacy you're looking for doesn't exist.</p>
              <Link to="/pharmacy-search" className="btn btn-primary">Browse Pharmacies</Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  const pharmacyLogo = pharmacy.logo || '/assets/img/medical-img1.jpg'
  const pharmacyAddress = formatAddress(pharmacy.address)
  const pharmacyPhone = pharmacy.phone || 'Phone not available'
  const ownerName = pharmacy.ownerId && typeof pharmacy.ownerId === 'object'
    ? pharmacy.ownerId.fullName
    : 'Unknown Owner'
  const ownerEmail = pharmacy.ownerId && typeof pharmacy.ownerId === 'object'
    ? pharmacy.ownerId.email
    : null

  return (
    <>
      <Breadcrumb title="Pharmacy" li1="Pharmacy Details" li2={pharmacy.name} />
      <div className="content">
        <div className="container">
          <div className="card">
            <div className="card-body">
              <div className="doctor-widget">
                <div className="doc-info-left">
                  <div className="doctor-img1">
                    <img src={pharmacyLogo} className="img-fluid" alt={pharmacy.name} />
                  </div>
                  <div className="doc-info-cont">
                    <h4 className="doc-name mb-2">{pharmacy.name}</h4>
                    {pharmacy.isActive && (
                      <span className="badge badge-success mb-2">Active</span>
                    )}
                    <div className="clinic-details">
                      <div className="clini-infos pt-3">
                        <p className="doc-location mb-2">
                          <i className="fas fa-user me-1"></i> Owner: {ownerName}
                        </p>
                        {ownerEmail && (
                          <p className="doc-location mb-2">
                            <i className="fas fa-envelope me-1"></i> {ownerEmail}
                          </p>
                        )}
                        <p className="doc-location mb-2">
                          <i className="fas fa-phone-volume me-1"></i> {pharmacyPhone}
                        </p>
                        <p className="doc-location mb-2 text-ellipse">
                          <i className="fas fa-map-marker-alt me-1"></i> {pharmacyAddress}
                        </p>
                        {pharmacy.address?.city && (
                          <p className="doc-location mb-2">
                            <i className="fas fa-city me-1"></i> City: {pharmacy.address.city}
                          </p>
                        )}
                        {pharmacy.address?.state && (
                          <p className="doc-location mb-2">
                            <i className="fas fa-map me-1"></i> State: {pharmacy.address.state}
                          </p>
                        )}
                        {pharmacy.location?.lat && pharmacy.location?.lng && (
                          <p className="doc-location mb-2">
                            <i className="fas fa-location-dot me-1"></i> 
                            Coordinates: {pharmacy.location.lat.toFixed(4)}, {pharmacy.location.lng.toFixed(4)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="doc-info-right d-flex align-items-center justify-content-center">
                  <div className="clinic-booking">
                    <Link
                      to={`/product-all?sellerId=${ownerId}&sellerType=PHARMACY`}
                      className="view-pro-btn"
                    >
                      Browse Products
                    </Link>
                    {pharmacy.phone && (
                      <a className="apt-btn" href={`tel:${pharmacy.phone}`}>
                        Call Now
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body pt-0">
              <nav className="user-tabs mb-4">
                <ul className="nav nav-tabs nav-tabs-bottom nav-justified">
                  <li className="nav-item">
                    <a className="nav-link active" href="#pharmacy_overview" data-bs-toggle="tab">Overview</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#pharmacy_locations" data-bs-toggle="tab">Locations</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#pharmacy_products" data-bs-toggle="tab">Products</a>
                  </li>
                </ul>
              </nav>

              <div className="tab-content pt-0">
                <div role="tabpanel" id="pharmacy_overview" className="tab-pane fade show active">
                  <div className="row">
                    <div className="col-md-9">
                      <div className="widget about-widget">
                        <h4 className="widget-title">About Pharmacy</h4>
                        <p>
                          {pharmacy.name} is a registered pharmacy providing quality healthcare products and services.
                          {pharmacy.address?.city && ` Located in ${pharmacy.address.city}, `}
                          we offer a wide range of medicines, medical equipment, and health supplements.
                        </p>
                        <div className="mt-3">
                          <h5>Contact Information</h5>
                          <ul className="list-unstyled">
                            <li><strong>Name:</strong> {pharmacy.name}</li>
                            <li><strong>Owner:</strong> {ownerName}</li>
                            {ownerEmail && <li><strong>Email:</strong> {ownerEmail}</li>}
                            <li><strong>Phone:</strong> {pharmacyPhone}</li>
                            <li><strong>Address:</strong> {pharmacyAddress}</li>
                            {pharmacy.isActive !== undefined && (
                              <li>
                                <strong>Status:</strong>{' '}
                                <span className={pharmacy.isActive ? 'text-success' : 'text-danger'}>
                                  {pharmacy.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div role="tabpanel" id="pharmacy_locations" className="tab-pane fade">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="widget locations-widget">
                        <h4 className="widget-title">Location Details</h4>
                        <div className="mt-3">
                          <p><strong>Full Address:</strong></p>
                          <p>{pharmacyAddress}</p>
                          {pharmacy.address && (
                            <div className="mt-3">
                              <ul className="list-unstyled">
                                {pharmacy.address.line1 && (
                                  <li><strong>Line 1:</strong> {pharmacy.address.line1}</li>
                                )}
                                {pharmacy.address.line2 && (
                                  <li><strong>Line 2:</strong> {pharmacy.address.line2}</li>
                                )}
                                {pharmacy.address.city && (
                                  <li><strong>City:</strong> {pharmacy.address.city}</li>
                                )}
                                {pharmacy.address.state && (
                                  <li><strong>State:</strong> {pharmacy.address.state}</li>
                                )}
                                {pharmacy.address.country && (
                                  <li><strong>Country:</strong> {pharmacy.address.country}</li>
                                )}
                                {pharmacy.address.zip && (
                                  <li><strong>ZIP Code:</strong> {pharmacy.address.zip}</li>
                                )}
                              </ul>
                            </div>
                          )}
                          {pharmacy.location?.lat && pharmacy.location?.lng && (
                            <div className="mt-3">
                              <p><strong>Coordinates:</strong></p>
                              <p>Latitude: {pharmacy.location.lat}, Longitude: {pharmacy.location.lng}</p>
                              <a
                                href={`https://www.google.com/maps?q=${pharmacy.location.lat},${pharmacy.location.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-primary"
                              >
                                View on Google Maps
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div role="tabpanel" id="pharmacy_products" className="tab-pane fade">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="widget products-widget">
                        <h4 className="widget-title">Products from this Pharmacy</h4>
                        {products.length === 0 ? (
                          <p className="text-muted">No products available from this pharmacy.</p>
                        ) : (
                          <>
                            <div className="row mt-3">
                              {products.map((product) => {
                                const productPrice = product.discountPrice || product.price
                                const productImage = product.images?.[0] || '/assets/img/products/product.jpg'
                                
                                return (
                                  <div key={product._id} className="col-md-6 col-lg-4 mb-3">
                                    <div className="profile-widget">
                                      <div className="doc-img">
                                        <Link to={`/product-description?id=${product._id}`}>
                                          <img className="img-fluid" alt={product.name} src={productImage} />
                                        </Link>
                                      </div>
                                      <div className="pro-content">
                                        <h3 className="title pb-2">
                                          <Link to={`/product-description?id=${product._id}`}>{product.name}</Link>
                                        </h3>
                                        <div className="row align-items-center">
                                          <div className="col-12">
                                            <span className="price">${productPrice.toFixed(2)}</span>
                                            {product.discountPrice && (
                                              <span className="price-strike">${product.price.toFixed(2)}</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                            <div className="mt-3">
                              <Link
                                to={`/product-all?sellerId=${ownerId}&sellerType=PHARMACY`}
                                className="btn btn-primary"
                              >
                                View All Products
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
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

export default PharmacyDetails
