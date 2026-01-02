import { useState, useEffect, useRef } from 'react'
import { useRoute } from '../../queries/mappingQueries'

/**
 * Component to display route from user location to clinic on Google Maps
 * @param {Object} from - { lat: number, lng: number } - User's location
 * @param {Object} to - { lat: number, lng: number } - Clinic location
 * @param {Object} clinicInfo - Clinic information for display
 */
const RouteMap = ({ from, to, clinicInfo = {} }) => {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [userLocation, setUserLocation] = useState(from)
  const mapRef = useRef(null)
  const directionsRendererRef = useRef(null)

  // Fetch route data from backend
  const { data: routeData, isLoading: routeLoading } = useRoute(
    userLocation,
    to,
    { enabled: !!(userLocation?.lat && userLocation?.lng && to?.lat && to?.lng) }
  )

  useEffect(() => {
    // Try to get user's current location if not provided
    if (!userLocation && navigator.geolocation) {
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
  }, [userLocation])

  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initMap()
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=places,directions`
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
      if (!mapRef.current) return

      const center = to || { lat: 40.7128, lng: -74.0060 }
      
      const map = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true
      })

      // Add clinic marker
      if (to?.lat && to?.lng) {
        const clinicMarker = new window.google.maps.Marker({
          position: to,
          map: map,
          title: clinicInfo.name || 'Clinic',
          icon: {
            url: '/assets/img/icons/map-marker.png',
            scaledSize: new window.google.maps.Size(40, 40)
          }
        })

        // Add info window for clinic
        const clinicInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px;">
              <h6 style="margin: 0 0 5px 0; font-weight: 600;">${clinicInfo.name || 'Clinic'}</h6>
              ${clinicInfo.address ? `<p style="margin: 0; font-size: 14px; color: #666;">${clinicInfo.address}</p>` : ''}
              ${clinicInfo.phone ? `<p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">${clinicInfo.phone}</p>` : ''}
              ${routeData?.data ? `
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">
                  <p style="margin: 0; font-size: 13px; color: #0d6efd;">
                    <i class="fas fa-route"></i> Distance: ${routeData.data.distance} ${routeData.data.distanceUnit}
                  </p>
                  <p style="margin: 5px 0 0 0; font-size: 13px; color: #0d6efd;">
                    <i class="fas fa-clock"></i> Est. Time: ${routeData.data.estimatedTime} ${routeData.data.estimatedTimeUnit}
                  </p>
                </div>
              ` : ''}
            </div>
          `
        })

        clinicMarker.addListener('click', () => {
          clinicInfoWindow.open(map, clinicMarker)
        })
      }

      // Add user location marker and draw route
      if (userLocation?.lat && userLocation?.lng && to?.lat && to?.lng) {
        // Add user location marker
        new window.google.maps.Marker({
          position: userLocation,
          map: map,
          title: 'Your Location',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3
          },
          zIndex: 1000
        })

        // Draw route using Google Maps Directions API
        const directionsService = new window.google.maps.DirectionsService()
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          map: map,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#0d6efd',
            strokeWeight: 4,
            strokeOpacity: 0.8
          }
        })
        directionsRendererRef.current = directionsRenderer

        directionsService.route(
          {
            origin: userLocation,
            destination: to,
            travelMode: window.google.maps.TravelMode.DRIVING
          },
          (result, status) => {
            if (status === 'OK') {
              directionsRenderer.setDirections(result)
              
              // Fit map to show entire route
              const bounds = new window.google.maps.LatLngBounds()
              result.routes[0].legs.forEach(leg => {
                bounds.extend(leg.start_location)
                bounds.extend(leg.end_location)
              })
              map.fitBounds(bounds)
            } else {
              console.error('Directions request failed:', status)
            }
          }
        )
      }
    }

    loadGoogleMaps()
  }, [userLocation, to, clinicInfo, routeData])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '400px',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      />
      {(!mapLoaded || routeLoading) && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(248, 249, 250, 0.9)',
            borderRadius: '8px',
            zIndex: 1
          }}
        >
          <div className="text-center">
            <div className="spinner-border text-primary mb-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mb-0">Loading route...</p>
          </div>
        </div>
      )}
      {routeData?.data && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'white',
            padding: '10px 15px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 2
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '5px' }}>
            <i className="fas fa-route me-2" style={{ color: '#0d6efd' }}></i>
            Route Information
          </div>
          <div style={{ fontSize: '13px', color: '#666' }}>
            <div>Distance: <strong>{routeData.data.distance} {routeData.data.distanceUnit}</strong></div>
            <div>Est. Time: <strong>{routeData.data.estimatedTime} {routeData.data.estimatedTimeUnit}</strong></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RouteMap

