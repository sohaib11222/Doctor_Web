import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import api from '../../api/axios'
import * as pharmacyApi from '../../api/pharmacy'

const PharmacyProfile = () => {
  const queryClient = useQueryClient()

  const { data: myPharmacyResponse, isLoading } = useQuery({
    queryKey: ['my-pharmacy'],
    queryFn: () => pharmacyApi.getMyPharmacy(),
    retry: 1
  })

  const myPharmacy = useMemo(() => {
    if (!myPharmacyResponse) return null
    const responseData = myPharmacyResponse.data || myPharmacyResponse
    return responseData.data || responseData
  }, [myPharmacyResponse])

  const [pharmacyData, setPharmacyData] = useState({
    name: '',
    logo: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      country: '',
      zip: ''
    },
    location: {
      lat: '',
      lng: ''
    },
    isActive: true
  })

  useEffect(() => {
    if (!myPharmacy) return

    setPharmacyData({
      name: myPharmacy.name || '',
      logo: myPharmacy.logo || '',
      phone: myPharmacy.phone || '',
      address: {
        line1: myPharmacy.address?.line1 || myPharmacy.address?.address || '',
        line2: myPharmacy.address?.line2 || '',
        city: myPharmacy.address?.city || '',
        state: myPharmacy.address?.state || '',
        country: myPharmacy.address?.country || '',
        zip: myPharmacy.address?.zip || ''
      },
      location: {
        lat: myPharmacy.location?.lat !== undefined && myPharmacy.location?.lat !== null ? String(myPharmacy.location.lat) : '',
        lng: myPharmacy.location?.lng !== undefined && myPharmacy.location?.lng !== null ? String(myPharmacy.location.lng) : ''
      },
      isActive: myPharmacy.isActive !== undefined ? myPharmacy.isActive : true
    })
  }, [myPharmacy])

  const createMutation = useMutation({
    mutationFn: (data) => pharmacyApi.createPharmacy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-pharmacy'] })
      toast.success('Pharmacy profile created successfully!')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => pharmacyApi.updatePharmacy(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-pharmacy'] })
      toast.success('Pharmacy profile updated successfully!')
    }
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.startsWith('address.')) {
      const field = name.split('.')[1]
      setPharmacyData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }))
      return
    }

    if (name.startsWith('location.')) {
      const field = name.split('.')[1]
      setPharmacyData((prev) => ({
        ...prev,
        location: { ...prev.location, [field]: value }
      }))
      return
    }

    if (type === 'checkbox') {
      setPharmacyData((prev) => ({ ...prev, [name]: checked }))
      return
    }

    setPharmacyData((prev) => ({ ...prev, [name]: value }))
  }

  const uploadLogo = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/upload/pharmacy', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    const responseData = response?.data || response
    const url = responseData?.data?.url || responseData?.url

    if (!url) {
      throw new Error('Failed to upload logo')
    }

    return url
  }

  const handleLogoFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const url = await uploadLogo(file)
      setPharmacyData((prev) => ({ ...prev, logo: url }))
      toast.success('Logo uploaded')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Logo upload failed')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!pharmacyData.name.trim()) {
      toast.error('Pharmacy name is required')
      return
    }

    const submitData = {
      name: pharmacyData.name.trim(),
      phone: pharmacyData.phone?.trim() || undefined,
      logo: pharmacyData.logo || undefined,
      isActive: pharmacyData.isActive
    }

    const addressFields = {}
    if (pharmacyData.address.line1?.trim()) addressFields.line1 = pharmacyData.address.line1.trim()
    if (pharmacyData.address.line2?.trim()) addressFields.line2 = pharmacyData.address.line2.trim()
    if (pharmacyData.address.city?.trim()) addressFields.city = pharmacyData.address.city.trim()
    if (pharmacyData.address.state?.trim()) addressFields.state = pharmacyData.address.state.trim()
    if (pharmacyData.address.country?.trim()) addressFields.country = pharmacyData.address.country.trim()
    if (pharmacyData.address.zip?.trim()) addressFields.zip = pharmacyData.address.zip.trim()

    if (Object.keys(addressFields).length > 0) {
      submitData.address = addressFields
    }

    const lat = pharmacyData.location.lat ? parseFloat(pharmacyData.location.lat) : null
    const lng = pharmacyData.location.lng ? parseFloat(pharmacyData.location.lng) : null
    if (!Number.isNaN(lat) && !Number.isNaN(lng) && lat !== null && lng !== null) {
      submitData.location = { lat, lng }
    }

    try {
      if (myPharmacy?._id) {
        await updateMutation.mutateAsync({ id: myPharmacy._id, data: submitData })
      } else {
        await createMutation.mutateAsync(submitData)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to save pharmacy profile')
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="dashboard-header">
        <h3>Pharmacy Profile</h3>
        <p className="text-muted mb-0">Create or update your pharmacy profile</p>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-wrap">
              <label className="form-label">Pharmacy Name <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={pharmacyData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-wrap">
              <label className="form-label">Logo</label>
              <input type="file" className="form-control" accept="image/*" onChange={handleLogoFile} />
              {pharmacyData.logo && (
                <div className="mt-2">
                  <img src={pharmacyData.logo} alt="logo" style={{ height: 60, objectFit: 'cover' }} />
                </div>
              )}
            </div>

            <div className="form-wrap">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={pharmacyData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-wrap">
                  <label className="form-label">Address Line 1</label>
                  <input className="form-control" name="address.line1" value={pharmacyData.address.line1} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-wrap">
                  <label className="form-label">Address Line 2</label>
                  <input className="form-control" name="address.line2" value={pharmacyData.address.line2} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <div className="form-wrap">
                  <label className="form-label">City</label>
                  <input className="form-control" name="address.city" value={pharmacyData.address.city} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-wrap">
                  <label className="form-label">State</label>
                  <input className="form-control" name="address.state" value={pharmacyData.address.state} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-wrap">
                  <label className="form-label">Zip</label>
                  <input className="form-control" name="address.zip" value={pharmacyData.address.zip} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-wrap">
                  <label className="form-label">Latitude</label>
                  <input className="form-control" name="location.lat" value={pharmacyData.location.lat} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-wrap">
                  <label className="form-label">Longitude</label>
                  <input className="form-control" name="location.lng" value={pharmacyData.location.lng} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" name="isActive" checked={!!pharmacyData.isActive} onChange={handleChange} />
              <label className="form-check-label">Active</label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={createMutation.isPending || updateMutation.isPending}>
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PharmacyProfile
