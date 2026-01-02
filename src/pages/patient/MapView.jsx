import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useNearbyClinics } from '../../queries/mappingQueries'
import { toast } from 'react-toastify'

const MapView = () => {
  const navigate = useNavigate()
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  
  const [userLocation, setUserLocation] = useState(null)
  const [selectedClinic, setSelectedClinic] = useState(null)
  const [showClinicModal, setShowClinicModal] = useState(false)
  const [locationPermission, setLocationPermission] = useState(false)
  const [radius, setRadius] = useState(10) // Default 10km radius
  const [mapLoaded, setMapLoaded] = useState(false)

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(coords)
          setLocationPermission(true)
          
          // Center map on user location
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([coords.lat, coords.lng], 12)
          }
        },
        (error) => {
          console.error('Error getting location:', error)
          setLocationPermission(false)
          toast.error('Location permission denied. Using default location.')
          // Set default location
          const defaultLocation = { lat: 40.7128, lng: -74.0060 } // New York
          setUserLocation(defaultLocation)
          
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([defaultLocation.lat, defaultLocation.lng], 10)
          }
        }
      )
    } else {
      toast.error('Geolocation is not supported by your browser.')
      const defaultLocation = { lat: 40.7128, lng: -74.0060 }
      setUserLocation(defaultLocation)
    }
  }, [])

  // Fetch nearby clinics
  const {
    data: nearbyClinicsData,
    isLoading: isLoadingClinics,
    error: clinicsError,
    refetch: refetchClinics,
  } = useNearbyClinics(userLocation?.lat, userLocation?.lng, radius, {
    enabled: !!userLocation
  })

  // Handle both response.data and direct data
  const nearbyClinics = useMemo(() => {
    if (!nearbyClinicsData) return []
    const data = nearbyClinicsData.data || nearbyClinicsData
    const clinics = Array.isArray(data) ? data : []
    
    // Filter out clinics with invalid coordinates
    return clinics.filter(clinic => {
      const lat = clinic.coordinates?.lat || clinic.lat
      const lng = clinic.coordinates?.lng || clinic.lng
      return lat && lng && !isNaN(lat) && !isNaN(lng) && 
             lat >= -90 && lat <= 90 && 
             lng >= -180 && lng <= 180
    })
  }, [nearbyClinicsData])

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapLoaded) return

    // Load Leaflet CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
    link.crossOrigin = ''
    document.head.appendChild(link)

    // Load Leaflet JS
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
    script.crossOrigin = ''
    script.onload = () => {
      const L = window.L
      if (!L) return

      const center = userLocation || { lat: 40.7128, lng: -74.0060 }
      
      // Validate center coordinates
      const centerLat = center.lat && !isNaN(center.lat) ? center.lat : 40.7128
      const centerLng = center.lng && !isNaN(center.lng) ? center.lng : -74.0060
      
      const map = L.map(mapRef.current).setView([centerLat, centerLng], userLocation ? 12 : 10)

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map)

      mapInstanceRef.current = map
      setMapLoaded(true)
    }
    document.body.appendChild(script)

    return () => {
      // Cleanup
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }
    }
  }, [])

  // Update map markers when clinics change
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || !window.L.map || isLoadingClinics || !mapLoaded) return

    const L = window.L
    const map = mapInstanceRef.current
    
    // Ensure map is initialized
    if (!map || typeof map.setView !== 'function') return

    // Clear existing markers
    markersRef.current.forEach(marker => {
      map.removeLayer(marker)
    })
    markersRef.current = []

    // Add user location marker
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: '<div style="background-color: #4285F4; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })
      
      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('Your Location')
      markersRef.current.push(userMarker)
    }

    // Add clinic markers
    nearbyClinics.forEach((clinic) => {
      // Validate coordinates
      const lat = clinic.coordinates?.lat || clinic.lat
      const lng = clinic.coordinates?.lng || clinic.lng
      
      if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
        console.warn('Invalid coordinates for clinic:', clinic)
        return
      }

      const clinicIcon = L.divIcon({
        className: 'custom-clinic-marker',
        html: `
          <div style="
            background-color: #0d6efd;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
          ">🏥</div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      })

      const marker = L.marker([lat, lng], { icon: clinicIcon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h6 style="margin: 0 0 5px 0; font-weight: 600;">${clinic.clinicName || clinic.name || 'Clinic'}</h6>
            <p style="margin: 0; font-size: 13px; color: #666;">${clinic.doctorName || ''}</p>
            <p style="margin: 5px 0; font-size: 13px; color: #666;">${clinic.address || ''}, ${clinic.city || ''}</p>
            ${clinic.distance ? `<p style="margin: 5px 0; font-size: 12px; color: #0d6efd; font-weight: 600;">${clinic.distance.toFixed(1)} km away</p>` : ''}
          </div>
        `)

      marker.on('click', () => {
        handleMarkerPress(clinic)
      })

      markersRef.current.push(marker)
    })

    // Fit bounds to show all markers (with validation)
    if (markersRef.current.length > 0) {
      try {
        // If only one marker, center on it
        if (markersRef.current.length === 1) {
          const marker = markersRef.current[0]
          const position = marker.getLatLng()
          if (position && position.lat && position.lng && 
              !isNaN(position.lat) && !isNaN(position.lng)) {
            map.setView([position.lat, position.lng], 13)
          }
        } else {
          // Multiple markers - try to fit bounds
          try {
            const group = new L.FeatureGroup(markersRef.current)
            const bounds = group.getBounds()
            
            // Validate bounds - check if bounds exist and have valid coordinates
            if (bounds) {
              const sw = bounds.getSouthWest()
              const ne = bounds.getNorthEast()
              
              // Check if bounds have valid coordinates and are not the same point
              if (sw && ne && 
                  !isNaN(sw.lat) && !isNaN(sw.lng) && 
                  !isNaN(ne.lat) && !isNaN(ne.lng) &&
                  (sw.lat !== ne.lat || sw.lng !== ne.lng)) {
                // Check if bounds span is reasonable (not too small)
                const latSpan = Math.abs(ne.lat - sw.lat)
                const lngSpan = Math.abs(ne.lng - sw.lng)
                
                if (latSpan > 0.0001 || lngSpan > 0.0001) {
                  map.fitBounds(bounds.pad(0.1))
                } else {
                  // Bounds too small, center on first marker
                  const marker = markersRef.current[0]
                  const position = marker.getLatLng()
                  if (position && position.lat && position.lng) {
                    map.setView([position.lat, position.lng], 13)
                  }
                }
              } else {
                // Invalid bounds, center on first marker
                const marker = markersRef.current[0]
                const position = marker.getLatLng()
                if (position && position.lat && position.lng) {
                  map.setView([position.lat, position.lng], 12)
                }
              }
            } else {
              // No bounds, center on first marker
              const marker = markersRef.current[0]
              const position = marker.getLatLng()
              if (position && position.lat && position.lng) {
                map.setView([position.lat, position.lng], 12)
              }
            }
          } catch (boundsError) {
            console.warn('Error calculating bounds:', boundsError)
            // Fallback: center on first marker
            const marker = markersRef.current[0]
            const position = marker.getLatLng()
            if (position && position.lat && position.lng) {
              map.setView([position.lat, position.lng], 12)
            }
          }
        }
      } catch (error) {
        console.error('Error fitting bounds:', error)
        // Fallback: center on user location or first marker
        if (userLocation && userLocation.lat && userLocation.lng) {
          map.setView([userLocation.lat, userLocation.lng], 12)
        } else if (markersRef.current.length > 0) {
          const marker = markersRef.current[0]
          const position = marker.getLatLng()
          if (position && position.lat && position.lng) {
            map.setView([position.lat, position.lng], 13)
          }
        }
      }
    } else if (userLocation && userLocation.lat && userLocation.lng) {
      // No clinics found, center on user location
      map.setView([userLocation.lat, userLocation.lng], 12)
    }
  }, [nearbyClinics, userLocation, isLoadingClinics, mapLoaded])

  // Handle marker press
  const handleMarkerPress = (clinic) => {
    setSelectedClinic(clinic)
    setShowClinicModal(true)
    
    // Center map on clinic
    if (mapInstanceRef.current) {
      const lat = clinic.coordinates?.lat || clinic.lat
      const lng = clinic.coordinates?.lng || clinic.lng
      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        mapInstanceRef.current.setView([lat, lng], 14)
      }
    }
  }

  // Handle view doctor profile
  const handleViewDoctor = (clinic) => {
    setShowClinicModal(false)
    if (clinic.doctorId) {
      navigate(`/doctor-profile?id=${clinic.doctorId}`)
    } else {
      toast.error('Doctor information not available')
    }
  }

  // Handle book appointment
  const handleBookAppointment = (clinic) => {
    setShowClinicModal(false)
    if (clinic.doctorId) {
      navigate(`/booking?doctorId=${clinic.doctorId}`)
    } else {
      toast.error('Doctor information not available')
    }
  }

  // Handle refresh location
  const handleRefreshLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(coords)
          
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([coords.lat, coords.lng], 12)
          }
          
          toast.success('Location updated. Nearby clinics refreshed.')
        },
        (error) => {
          toast.error('Could not update location.')
        }
      )
    }
  }

  return (
    <div className="content">
      <div className="container-fluid p-0">
        <div className="row g-0">
          {/* Map Section */}
          <div className="col-lg-8">
            <div style={{ position: 'relative', height: '100vh', minHeight: '600px' }}>
              {/* Map Container */}
              <div
                ref={mapRef}
                style={{
                  width: '100%',
                  height: '100%',
                  zIndex: 1
                }}
              />

              {/* Map Controls */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <button
                  className="btn btn-light shadow-sm"
                  onClick={handleRefreshLocation}
                  style={{ width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Refresh Location"
                >
                  <i className="fe fe-refresh-cw"></i>
                </button>
                <button
                  className="btn btn-light shadow-sm"
                  onClick={() => {
                    if (userLocation && mapInstanceRef.current) {
                      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 12)
                    }
                  }}
                  style={{ width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Center on My Location"
                >
                  <i className="fe fe-navigation"></i>
                </button>
              </div>

              {/* Radius Selector */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                right: '16px',
                zIndex: 1000,
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <label className="form-label mb-2" style={{ fontSize: '12px', fontWeight: '600' }}>
                  Search Radius: {radius} km
                </label>
                <div className="d-flex gap-2">
                  {[5, 10, 15, 20, 25].map((r) => (
                    <button
                      key={r}
                      className={`btn btn-sm ${radius === r ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setRadius(r)}
                      style={{ flex: 1 }}
                    >
                      {r}km
                    </button>
                  ))}
                </div>
              </div>

              {/* Loading Overlay */}
              {isLoadingClinics && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 500
                }}>
                  <div className="text-center">
                    <div className="spinner-border text-primary mb-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mb-0">Finding nearby clinics...</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {clinicsError && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  right: '16px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <i className="fe fe-alert-circle text-danger"></i>
                  <span className="flex-grow-1 text-danger">Failed to load clinics</span>
                  <button className="btn btn-sm btn-primary" onClick={() => refetchClinics()}>
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Clinics List Section */}
          <div className="col-lg-4" style={{ height: '100vh', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
            <div className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  <span className="text-primary">{nearbyClinics.length}</span> Nearby Clinics
                </h5>
                {!locationPermission && (
                  <span className="badge bg-warning text-dark">
                    <i className="fe fe-alert-circle me-1"></i>
                    Location disabled
                  </span>
                )}
              </div>

              {isLoadingClinics ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mb-0">Loading clinics...</p>
                </div>
              ) : nearbyClinics.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fe fe-map-pin" style={{ fontSize: '48px', color: '#6c757d' }}></i>
                  <p className="mt-3 mb-1 fw-semibold">No clinics found nearby</p>
                  <p className="text-muted small">Try increasing the search radius</p>
                </div>
              ) : (
                <div className="list-group">
                  {nearbyClinics.map((clinic) => (
                    <div
                      key={clinic.clinicId || clinic._id}
                      className="list-group-item list-group-item-action mb-2 border rounded"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleMarkerPress(clinic)}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-semibold">{clinic.clinicName || clinic.name}</h6>
                          <p className="text-muted small mb-1">{clinic.doctorName}</p>
                          <div className="d-flex align-items-center mb-1">
                            <i className="fe fe-map-pin me-1" style={{ fontSize: '12px', color: '#6c757d' }}></i>
                            <span className="text-muted small">
                              {clinic.address}, {clinic.city}
                            </span>
                          </div>
                          {clinic.distance && (
                            <div className="d-flex align-items-center">
                              <i className="fe fe-navigation me-1" style={{ fontSize: '12px', color: '#0d6efd' }}></i>
                              <span className="text-primary small fw-semibold">
                                {clinic.distance.toFixed(1)} km away
                              </span>
                            </div>
                          )}
                        </div>
                        <i className="fe fe-chevron-right text-muted"></i>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Clinic Details Modal */}
      {showClinicModal && selectedClinic && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowClinicModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedClinic.clinicName || selectedClinic.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowClinicModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label small text-muted text-uppercase">Doctor</label>
                  <p className="mb-0">{selectedClinic.doctorName}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted text-uppercase">Address</label>
                  <p className="mb-0">
                    {selectedClinic.address}, {selectedClinic.city}
                  </p>
                </div>
                {selectedClinic.phone && (
                  <div className="mb-3">
                    <label className="form-label small text-muted text-uppercase">Phone</label>
                    <p className="mb-0">
                      <a href={`tel:${selectedClinic.phone}`}>{selectedClinic.phone}</a>
                    </p>
                  </div>
                )}
                {selectedClinic.distance && (
                  <div className="mb-3">
                    <label className="form-label small text-muted text-uppercase">Distance</label>
                    <p className="mb-0">{selectedClinic.distance.toFixed(1)} km away</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => handleViewDoctor(selectedClinic)}
                >
                  <i className="fe fe-user me-2"></i>
                  View Doctor
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleBookAppointment(selectedClinic)}
                >
                  <i className="fe fe-calendar me-2"></i>
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapView

