import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Breadcrumb from '../../components/common/Breadcrumb'
import * as pharmacyApi from '../../api/pharmacy'

const PharmacySearch = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Get filters from URL params
  const search = searchParams.get('search') || ''
  const city = searchParams.get('city') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 10

  // State for filters
  const [searchTerm, setSearchTerm] = useState(search)
  const [cityFilter, setCityFilter] = useState(city)

  // Fetch pharmacies with filters
  const { data: pharmaciesData, isLoading: pharmaciesLoading } = useQuery({
    queryKey: ['pharmacies', { search, city, page, limit }],
    queryFn: () => pharmacyApi.listPharmacies({ search, city, page, limit })
  })

  const pharmacies = pharmaciesData?.data?.pharmacies || []
  const pagination = pharmaciesData?.data?.pagination || { page: 1, limit, total: 0, pages: 1 }

  // Get unique cities from pharmacies
  const cities = Array.from(new Set(pharmacies.map(p => p.address?.city).filter(Boolean))).sort()

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (searchTerm) {
      params.set('search', searchTerm)
    } else {
      params.delete('search')
    }
    if (cityFilter) {
      params.set('city', cityFilter)
    } else {
      params.delete('city')
    }
    params.set('page', '1')
    setSearchParams(params)
  }

  const handleCityChange = (selectedCity) => {
    const params = new URLSearchParams(searchParams)
    if (selectedCity && selectedCity !== cityFilter) {
      params.set('city', selectedCity)
      setCityFilter(selectedCity)
    } else {
      params.delete('city')
      setCityFilter('')
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

  const formatPhone = (phone) => {
    return phone || 'Phone not available'
  }

  return (
    <>
      <Breadcrumb title="Pharmacy" li1="Pharmacy Search" li2="Pharmacy Search" />
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-4 col-xl-3 theiaStickySidebar">
              <div className="card search-filter">
                <div className="card-header">
                  <h4 className="card-title mb-0">Search Filter</h4>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSearch}>
                    <div className="filter-widget mb-3">
                      <label className="mb-2">Search</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search pharmacies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="filter-widget mb-3">
                      <label className="mb-2">Location / City</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter city..."
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                      />
                    </div>
                    {cities.length > 0 && (
                      <div className="filter-widget mb-3">
                        <h4>Popular Cities</h4>
                        {cities.slice(0, 5).map((cityName, idx) => (
                          <div key={idx}>
                            <label className="custom_check">
                              <input
                                type="checkbox"
                                checked={cityFilter === cityName}
                                onChange={() => handleCityChange(cityName)}
                              />
                              <span className="checkmark"></span> {cityName}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="btn-search">
                      <button type="submit" className="btn w-100">Search</button>
                    </div>
                    <div className="btn-search mt-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary w-100"
                        onClick={() => {
                          setSearchTerm('')
                          setCityFilter('')
                          setSearchParams({})
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-lg-8 col-xl-9">
              {pharmaciesLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : pharmacies.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">No pharmacies found. Try adjusting your search filters.</p>
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <p className="text-muted">
                      Showing {pharmacies.length} of {pagination.total} pharmacies
                    </p>
                  </div>
                  {pharmacies.map((pharmacy) => {
                    const pharmacyLogo = pharmacy.logo || '/assets/img/medical-img1.jpg'
                    const pharmacyAddress = formatAddress(pharmacy.address)
                    const pharmacyPhone = formatPhone(pharmacy.phone)
                    const ownerName = pharmacy.ownerId && typeof pharmacy.ownerId === 'object' 
                      ? pharmacy.ownerId.fullName 
                      : 'Unknown Owner'
                    // Extract ownerId - handle both populated object and direct ID
                    // If ownerId is populated (object), get _id, otherwise use the value directly
                    const ownerId = pharmacy.ownerId 
                      ? (typeof pharmacy.ownerId === 'object' && pharmacy.ownerId._id 
                          ? pharmacy.ownerId._id 
                          : pharmacy.ownerId)
                      : null

                    return (
                      <div key={pharmacy._id} className="card mb-3">
                        <div className="card-body">
                          <div className="doctor-widget">
                            <div className="doc-info-left">
                              <div className="doctor-img1">
                                <Link to={`/pharmacy-details?id=${pharmacy._id}`}>
                                  <img src={pharmacyLogo} className="img-fluid" alt={pharmacy.name} />
                                </Link>
                              </div>
                              <div className="doc-info-cont">
                                <h4 className="doc-name mb-2">
                                  <Link to={`/pharmacy-details?id=${pharmacy._id}`}>{pharmacy.name}</Link>
                                </h4>
                                {pharmacy.isActive && (
                                  <span className="badge badge-success mb-2">Active</span>
                                )}
                                <div className="clinic-details">
                                  <p className="doc-location mb-2">
                                    <i className="fas fa-user me-1"></i> Owner: {ownerName}
                                  </p>
                                  <p className="doc-location mb-2">
                                    <i className="fas fa-phone-volume me-1"></i> {pharmacyPhone}
                                  </p>
                                  <p className="doc-location mb-2 text-ellipse">
                                    <i className="fas fa-map-marker-alt me-1"></i> {pharmacyAddress}
                                  </p>
                                  {pharmacy.address?.city && (
                                    <p className="doc-location mb-2">
                                      <i className="fas fa-city me-1"></i> {pharmacy.address.city}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="doc-info-right">
                              <div className="clinic-booking">
                                {ownerId ? (
                                  <Link
                                    to={`/product-all?sellerId=${ownerId}&sellerType=PHARMACY`}
                                    className="view-pro-btn"
                                  >
                                    Browse Products
                                  </Link>
                                ) : (
                                  <span className="view-pro-btn disabled" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                    Browse Products
                                  </span>
                                )}
                                {pharmacy.phone && (
                                  <a
                                    className="apt-btn"
                                    href={`tel:${pharmacy.phone}`}
                                  >
                                    Call Now
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}

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

export default PharmacySearch
