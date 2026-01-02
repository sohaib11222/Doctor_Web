import { useState, useEffect } from 'react'
import { useLocation, Link, useSearchParams } from 'react-router-dom'
import { useClinicLocation, useRoute } from '../../queries/mappingQueries'
import RouteMap from '../../components/maps/RouteMap'

const ClinicNavigation = () => {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const clinicId = searchParams.get('clinicId') || location.state?.clinicId
  
  // Fetch clinic location from backend
  const { data: clinicData, isLoading: clinicLoading } = useClinicLocation(clinicId, {
    enabled: !!clinicId
  })
  
  const [userLocation, setUserLocation] = useState(null)
  const [routeInfo, setRouteInfo] = useState(null)

  // Get clinic info from API or fallback to location state
  const clinicInfo = clinicData?.data || location.state?.clinic || {
    name: 'Bright Smiles Dental Clinic',
    address: '123 Main Street, New York, NY 10001',
    phone: '+1 234 567 8900',
    coordinates: { lat: 40.7128, lng: -74.0060 }
  }

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Error getting user location:', error)
        }
      )
    }
  }, [])

  // Fetch route information when both locations are available
  const clinicCoords = clinicInfo.coordinates || { lat: clinicInfo.lat, lng: clinicInfo.lng }
  const { data: routeData } = useRoute(
    userLocation,
    clinicCoords,
    { enabled: !!(userLocation?.lat && userLocation?.lng && clinicCoords?.lat && clinicCoords?.lng) }
  )

  useEffect(() => {
    if (routeData?.data) {
      setRouteInfo(routeData.data)
    }
  }, [routeData])

  const clinicCoordsForMap = clinicInfo.coordinates || { lat: clinicInfo.lat, lng: clinicInfo.lng }

  const handleGetDirections = () => {
    const coords = clinicInfo.coordinates || { lat: clinicInfo.lat, lng: clinicInfo.lng }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`
    window.open(url, '_blank')
  }

  if (clinicLoading) {
    return (
      <div className="content">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading clinic information...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* PatientSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-8 col-xl-9">
            <div className="dashboard-header">
              <div className="header-back">
                <Link to="/patient-appointments" className="back-arrow">
                  <i className="fa-solid fa-arrow-left"></i>
                </Link>
                <h3>Clinic Navigation</h3>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                {/* Clinic Information */}
                <div className="clinic-info mb-4">
                  <h4 className="mb-3">{clinicInfo.clinicName || clinicInfo.name}</h4>
                  {clinicInfo.doctorName && (
                    <p className="text-muted mb-3">Dr. {clinicInfo.doctorName}</p>
                  )}
                  <div className="clinic-details">
                    <div className="d-flex align-items-start mb-3">
                      <i className="fe fe-map-pin me-2 mt-1" style={{ color: '#0d6efd' }}></i>
                      <div>
                        <h6 className="mb-1">Address</h6>
                        <p className="text-muted mb-0">
                          {clinicInfo.address || 'Address not available'}
                          {clinicInfo.city && `, ${clinicInfo.city}`}
                          {clinicInfo.state && `, ${clinicInfo.state}`}
                        </p>
                      </div>
                    </div>
                    {clinicInfo.phone && (
                      <div className="d-flex align-items-start mb-3">
                        <i className="fe fe-phone me-2 mt-1" style={{ color: '#0d6efd' }}></i>
                        <div>
                          <h6 className="mb-1">Phone</h6>
                          <p className="text-muted mb-0">
                            <a href={`tel:${clinicInfo.phone}`}>{clinicInfo.phone}</a>
                          </p>
                        </div>
                      </div>
                    )}
                    {routeInfo && (
                      <div className="d-flex align-items-start mb-3">
                        <i className="fe fe-navigation me-2 mt-1" style={{ color: '#0d6efd' }}></i>
                        <div>
                          <h6 className="mb-1">Route Information</h6>
                          <p className="text-muted mb-0">
                            Distance: <strong>{routeInfo.distance} {routeInfo.distanceUnit}</strong>
                            <br />
                            Estimated Time: <strong>{routeInfo.estimatedTime} {routeInfo.estimatedTimeUnit}</strong>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Google Maps with Route */}
                <div className="map-container mb-4">
                  <div style={{ height: '500px' }}>
                    <RouteMap
                      from={userLocation}
                      to={clinicCoordsForMap}
                      clinicInfo={{
                        name: clinicInfo.clinicName || clinicInfo.name,
                        address: clinicInfo.address,
                        phone: clinicInfo.phone
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2 d-md-flex">
                  <button
                    className="btn btn-primary"
                    onClick={handleGetDirections}
                  >
                    <i className="fe fe-navigation me-2"></i>
                    Get Directions
                  </button>
                  <a
                    href={`tel:${clinicInfo.phone}`}
                    className="btn btn-outline-primary"
                  >
                    <i className="fe fe-phone me-2"></i>
                    Call Clinic
                  </a>
                  <Link
                    to="/patient-appointments"
                    className="btn btn-outline-secondary"
                  >
                    <i className="fe fe-arrow-left me-2"></i>
                    Back to Appointments
                  </Link>
                </div>

                {/* Directions Info */}
                <div className="alert alert-info mt-4">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <i className="fe fe-info"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="alert-heading">Getting There</h6>
                      <p className="mb-0 small">
                        Click "Get Directions" to open Google Maps with turn-by-turn navigation. 
                        Make sure to arrive 10-15 minutes before your appointment time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClinicNavigation

