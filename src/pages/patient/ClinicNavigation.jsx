import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'

const ClinicNavigation = () => {
  const location = useLocation()
  const [mapLoaded, setMapLoaded] = useState(false)

  // Get clinic info from location state or use defaults
  const clinicInfo = location.state?.clinic || {
    name: 'Bright Smiles Dental Clinic',
    address: '123 Main Street, New York, NY 10001',
    phone: '+1 234 567 8900',
    lat: 40.7128,
    lng: -74.0060
  }

  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initMap()
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        setMapLoaded(true)
        initMap()
      }
      document.head.appendChild(script)
    }

    const initMap = () => {
      if (!window.google || !window.google.maps) return

      const mapElement = document.getElementById('clinic-map')
      if (!mapElement) return

      const clinicLocation = { lat: clinicInfo.lat, lng: clinicInfo.lng }

      const map = new window.google.maps.Map(mapElement, {
        center: clinicLocation,
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true
      })

      // Add marker for clinic
      const marker = new window.google.maps.Marker({
        position: clinicLocation,
        map: map,
        title: clinicInfo.name,
        icon: {
          url: '/assets/img/icons/map-marker.png',
          scaledSize: new window.google.maps.Size(40, 40)
        }
      })

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <h6 style="margin: 0 0 5px 0; font-weight: 600;">${clinicInfo.name}</h6>
            <p style="margin: 0; font-size: 14px; color: #666;">${clinicInfo.address}</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">${clinicInfo.phone}</p>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${clinicInfo.lat},${clinicInfo.lng}" 
               target="_blank" 
               style="display: inline-block; margin-top: 10px; padding: 5px 10px; background: #0d6efd; color: white; text-decoration: none; border-radius: 4px; font-size: 12px;">
              Get Directions
            </a>
          </div>
        `
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
      })

      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }

            // Add user location marker
            new window.google.maps.Marker({
              position: userLocation,
              map: map,
              title: 'Your Location',
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2
              }
            })

            // Draw route
            const directionsService = new window.google.maps.DirectionsService()
            const directionsRenderer = new window.google.maps.DirectionsRenderer()
            directionsRenderer.setMap(map)

            directionsService.route(
              {
                origin: userLocation,
                destination: clinicLocation,
                travelMode: window.google.maps.TravelMode.DRIVING
              },
              (result, status) => {
                if (status === 'OK') {
                  directionsRenderer.setDirections(result)
                }
              }
            )
          },
          (error) => {
            console.log('Error getting user location:', error)
          }
        )
      }
    }

    loadGoogleMaps()
  }, [clinicInfo])

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${clinicInfo.lat},${clinicInfo.lng}`
    window.open(url, '_blank')
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
                  <h4 className="mb-3">{clinicInfo.name}</h4>
                  <div className="clinic-details">
                    <div className="d-flex align-items-start mb-3">
                      <i className="fe fe-map-pin me-2 mt-1" style={{ color: '#0d6efd' }}></i>
                      <div>
                        <h6 className="mb-1">Address</h6>
                        <p className="text-muted mb-0">{clinicInfo.address}</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-start mb-3">
                      <i className="fe fe-phone me-2 mt-1" style={{ color: '#0d6efd' }}></i>
                      <div>
                        <h6 className="mb-1">Phone</h6>
                        <p className="text-muted mb-0">
                          <a href={`tel:${clinicInfo.phone}`}>{clinicInfo.phone}</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Google Maps */}
                <div className="map-container mb-4">
                  <div
                    id="clinic-map"
                    style={{
                      width: '100%',
                      height: '400px',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  ></div>
                  {!mapLoaded && (
                    <div className="map-loading" style={{
                      width: '100%',
                      height: '400px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f8f9fa',
                      borderRadius: '8px'
                    }}>
                      <div className="text-center">
                        <div className="spinner-border text-primary mb-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted">Loading map...</p>
                      </div>
                    </div>
                  )}
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

