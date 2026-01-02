import { useState, useEffect, useRef } from 'react'
import { useNearbyClinics } from '../../queries/mappingQueries'

/**
 * Component to display nearby clinics on Google Maps
 * @param {number} lat - User's latitude
 * @param {number} lng - User's longitude
 * @param {number} radius - Search radius in km (default: 10)
 * @param {Function} onClinicClick - Callback when clinic marker is clicked
 */
const NearbyClinicsMap = ({ lat, lng, radius = 10, onClinicClick }) => {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  // Fetch nearby clinics
  const { data: clinicsData, isLoading } = useNearbyClinics(lat, lng, radius)
  const clinics = clinicsData?.data || clinicsData || []

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

      const center = lat && lng ? { lat, lng } : { lat: 40.7128, lng: -74.0060 }
      
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: lat && lng ? 12 : 10,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true
      })

      mapInstanceRef.current = mapInstance
      setMap(mapInstance)

      // Add user location marker if available
      if (lat && lng) {
        new window.google.maps.Marker({
          position: { lat, lng },
          map: mapInstance,
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
      }
    }

    loadGoogleMaps()
  }, [lat, lng])

  // Update markers when clinics data changes
  useEffect(() => {
    if (!map || !window.google || !window.google.maps) return
    if (isLoading) return

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))
    const newMarkers = []

    // Add markers for each clinic
    clinics.forEach((clinic, index) => {
      if (!clinic.coordinates?.lat || !clinic.coordinates?.lng) return

      const marker = new window.google.maps.Marker({
        position: {
          lat: clinic.coordinates.lat,
          lng: clinic.coordinates.lng
        },
        map: map,
        title: clinic.clinicName || clinic.name,
        icon: {
          url: '/assets/img/icons/map-marker.png',
          scaledSize: new window.google.maps.Size(40, 40)
        },
        animation: window.google.maps.Animation.DROP
      })

      // Create info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; min-width: 200px;">
            <h6 style="margin: 0 0 5px 0; font-weight: 600; color: #333;">${clinic.clinicName || clinic.name}</h6>
            <p style="margin: 0; font-size: 13px; color: #666;">${clinic.doctorName || ''}</p>
            <p style="margin: 5px 0; font-size: 13px; color: #666;">${clinic.address || ''}, ${clinic.city || ''}</p>
            ${clinic.phone ? `<p style="margin: 5px 0; font-size: 13px; color: #666;"><i class="fas fa-phone"></i> ${clinic.phone}</p>` : ''}
            <p style="margin: 5px 0; font-size: 12px; color: #0d6efd; font-weight: 600;">
              <i class="fas fa-route"></i> ${clinic.distance?.toFixed(2) || 'N/A'} km away
            </p>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${clinic.coordinates.lat},${clinic.coordinates.lng}" 
               target="_blank" 
               style="display: inline-block; margin-top: 8px; padding: 6px 12px; background: #0d6efd; color: white; text-decoration: none; border-radius: 4px; font-size: 12px;">
              Get Directions
            </a>
          </div>
        `
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
        if (onClinicClick) {
          onClinicClick(clinic)
        }
      })

      newMarkers.push(marker)
    })

    setMarkers(newMarkers)

    // Fit bounds to show all clinics
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      
      // Add user location to bounds if available
      if (lat && lng) {
        bounds.extend({ lat, lng })
      }
      
      // Add all clinic markers to bounds
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition())
      })
      
      map.fitBounds(bounds)
      
      // Don't zoom in too much if only one clinic
      if (newMarkers.length === 1 && lat && lng) {
        map.setZoom(13)
      }
    }
  }, [map, clinics, isLoading, onClinicClick, lat, lng])

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
      {(!mapLoaded || isLoading) && (
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
            <p className="text-muted mb-0">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default NearbyClinicsMap

