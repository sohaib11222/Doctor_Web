import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as pharmacyApi from '../../api/pharmacy'

const DoctorPharmacy = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Pharmacy state
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
      lat: null,
      lng: null
    },
    isActive: true
  })

  // Fetch doctor's pharmacy
  const { data: pharmacyResponse, isLoading, error } = useQuery({
    queryKey: ['doctorPharmacy', user?._id],
    queryFn: () => pharmacyApi.getPharmacyByOwnerId(user._id),
    enabled: !!user,
    retry: 1
  })

  // Initialize pharmacy data
  useEffect(() => {
    if (pharmacyResponse) {
      const pharmacy = pharmacyResponse
      setPharmacyData({
        name: pharmacy.name || '',
        logo: pharmacy.logo || '',
        phone: pharmacy.phone || '',
        address: {
          line1: pharmacy.address?.line1 || pharmacy.address?.address || '',
          line2: pharmacy.address?.line2 || '',
          city: pharmacy.address?.city || '',
          state: pharmacy.address?.state || '',
          country: pharmacy.address?.country || '',
          zip: pharmacy.address?.zip || ''
        },
        location: {
          lat: pharmacy.location?.lat || null,
          lng: pharmacy.location?.lng || null
        },
        isActive: pharmacy.isActive !== undefined ? pharmacy.isActive : true
      })
    }
  }, [pharmacyResponse])

  // Create pharmacy mutation
  const createPharmacyMutation = useMutation({
    mutationFn: (data) => pharmacyApi.createPharmacy(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctorPharmacy', user?._id])
      toast.success('Pharmacy created successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create pharmacy'
      toast.error(errorMessage)
    }
  })

  // Update pharmacy mutation
  const updatePharmacyMutation = useMutation({
    mutationFn: ({ id, data }) => pharmacyApi.updatePharmacy(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctorPharmacy', user?._id])
      toast.success('Pharmacy updated successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update pharmacy'
      toast.error(errorMessage)
    }
  })

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const field = name.split('.')[1]
      setPharmacyData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }))
    } else if (name.startsWith('location.')) {
      const field = name.split('.')[1]
      setPharmacyData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value ? parseFloat(value) : null
        }
      }))
    } else {
      setPharmacyData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPharmacyData(prev => ({
          ...prev,
          logo: reader.result
        }))
      }
      reader.readAsDataURL(file)
      // TODO: Upload to server and get URL
    }
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!pharmacyData.name.trim()) {
      toast.error('Pharmacy name is required')
      return
    }

    const submitData = {
      name: pharmacyData.name.trim(),
      phone: pharmacyData.phone.trim() || undefined,
      logo: pharmacyData.logo || undefined,
      address: {
        line1: pharmacyData.address.line1.trim() || undefined,
        line2: pharmacyData.address.line2.trim() || undefined,
        city: pharmacyData.address.city.trim() || undefined,
        state: pharmacyData.address.state.trim() || undefined,
        country: pharmacyData.address.country.trim() || undefined,
        zip: pharmacyData.address.zip.trim() || undefined
      },
      location: {
        lat: pharmacyData.location.lat || undefined,
        lng: pharmacyData.location.lng || undefined
      },
      isActive: pharmacyData.isActive
    }

    // Remove undefined values
    Object.keys(submitData.address).forEach(key => {
      if (submitData.address[key] === undefined) delete submitData.address[key]
    })
    Object.keys(submitData.location).forEach(key => {
      if (submitData.location[key] === undefined) delete submitData.location[key]
    })

    if (pharmacyResponse?._id) {
      // Update existing pharmacy
      updatePharmacyMutation.mutate({ id: pharmacyResponse._id, data: submitData })
    } else {
      // Create new pharmacy
      createPharmacyMutation.mutate(submitData)
    }
  }

  if (isLoading) {
    return (
      <div className="content doctor-content">
        <div className="container">
          <div className="row">
           
            <div className="col-lg-12 col-xl-12">
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const hasPharmacy = !!pharmacyResponse?._id

  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* DoctorSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            <div className="dashboard-header">
              <h3>My Pharmacy</h3>
              <p className="text-muted mb-0">
                {hasPharmacy ? 'Manage your pharmacy information' : 'Create and manage your pharmacy'}
              </p>
            </div>

            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Pharmacy Name */}
                  <div className="form-wrap">
                    <label className="form-label">Pharmacy Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={pharmacyData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter pharmacy name"
                    />
                  </div>

                  {/* Phone */}
                  <div className="form-wrap">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={pharmacyData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                  </div>

                  {/* Logo */}
                  <div className="form-wrap">
                    <label className="form-label">Logo</label>
                    {pharmacyData.logo && (
                      <div className="mb-2">
                        <img
                          src={pharmacyData.logo}
                          alt="Pharmacy Logo"
                          style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'contain' }}
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                    <small className="form-text text-muted">Upload pharmacy logo (optional)</small>
                  </div>

                  {/* Address Section */}
                  <div className="setting-title mt-4">
                    <h5>Address</h5>
                  </div>

                  {/* Address Line 1 */}
                  <div className="form-wrap">
                    <label className="form-label">Address Line 1</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address.line1"
                      value={pharmacyData.address.line1}
                      onChange={handleChange}
                      placeholder="Enter street address"
                    />
                  </div>

                  {/* Address Line 2 */}
                  <div className="form-wrap">
                    <label className="form-label">Address Line 2</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address.line2"
                      value={pharmacyData.address.line2}
                      onChange={handleChange}
                      placeholder="Enter apartment, suite, etc. (optional)"
                    />
                  </div>

                  <div className="row">
                    {/* City */}
                    <div className="col-md-6">
                      <div className="form-wrap">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          className="form-control"
                          name="address.city"
                          value={pharmacyData.address.city}
                          onChange={handleChange}
                          placeholder="Enter city"
                        />
                      </div>
                    </div>

                    {/* State */}
                    <div className="col-md-6">
                      <div className="form-wrap">
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          className="form-control"
                          name="address.state"
                          value={pharmacyData.address.state}
                          onChange={handleChange}
                          placeholder="Enter state"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {/* Country */}
                    <div className="col-md-6">
                      <div className="form-wrap">
                        <label className="form-label">Country</label>
                        <input
                          type="text"
                          className="form-control"
                          name="address.country"
                          value={pharmacyData.address.country}
                          onChange={handleChange}
                          placeholder="Enter country"
                        />
                      </div>
                    </div>

                    {/* Zip Code */}
                    <div className="col-md-6">
                      <div className="form-wrap">
                        <label className="form-label">Zip Code</label>
                        <input
                          type="text"
                          className="form-control"
                          name="address.zip"
                          value={pharmacyData.address.zip}
                          onChange={handleChange}
                          placeholder="Enter zip code"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location Section */}
                  <div className="setting-title mt-4">
                    <h5>Location (Coordinates)</h5>
                  </div>

                  <div className="row">
                    {/* Latitude */}
                    <div className="col-md-6">
                      <div className="form-wrap">
                        <label className="form-label">Latitude</label>
                        <input
                          type="number"
                          step="any"
                          className="form-control"
                          name="location.lat"
                          value={pharmacyData.location.lat || ''}
                          onChange={handleChange}
                          placeholder="Enter latitude"
                        />
                      </div>
                    </div>

                    {/* Longitude */}
                    <div className="col-md-6">
                      <div className="form-wrap">
                        <label className="form-label">Longitude</label>
                        <input
                          type="number"
                          step="any"
                          className="form-control"
                          name="location.lng"
                          value={pharmacyData.location.lng || ''}
                          onChange={handleChange}
                          placeholder="Enter longitude"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Active Status */}
                  <div className="form-wrap mt-4">
                    <label className="form-label">Status</label>
                    <select
                      className="form-control"
                      name="isActive"
                      value={pharmacyData.isActive}
                      onChange={(e) => setPharmacyData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                    >
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="submit-section mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary submit-btn"
                      disabled={createPharmacyMutation.isPending || updatePharmacyMutation.isPending}
                    >
                      {createPharmacyMutation.isPending || updatePharmacyMutation.isPending ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {hasPharmacy ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        hasPharmacy ? 'Update Pharmacy' : 'Create Pharmacy'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorPharmacy

