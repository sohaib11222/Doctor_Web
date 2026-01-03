import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as profileApi from '../../api/profile'
import api from '../../api/axios'

const DoctorClinicsSettings = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const clinicCounterRef = useRef(0)

  // Clinics state: array of {name, address, city, state, country, phone, lat, lng, images, timings}
  const [clinics, setClinics] = useState([])

  // Fetch doctor profile
  const { data: doctorProfile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['doctorProfile'],
    queryFn: () => profileApi.getDoctorProfile(),
    enabled: !!user,
    retry: 1
  })

  // Initialize clinics from profile
  useEffect(() => {
    console.log('DoctorProfile Data:', doctorProfile)
    if (doctorProfile) {
      // Axios interceptor returns response.data, so doctorProfile is already { success, message, data }
      const profileData = doctorProfile.data || doctorProfile
      console.log('Profile Data:', profileData)
      console.log('Clinics Data:', profileData.clinics)
      
      // Handle null or array
      const clinicsArray = profileData.clinics
      if (clinicsArray && Array.isArray(clinicsArray) && clinicsArray.length > 0) {
        // Ensure all clinic fields are properly initialized
        setClinics(clinicsArray.map((clinic, idx) => ({
          _id: clinic._id || `clinic-${Date.now()}-${idx}`,
          name: clinic.name || '',
          address: clinic.address || '',
          city: clinic.city || '',
          state: clinic.state || '',
          country: clinic.country || '',
          phone: clinic.phone || '',
          lat: clinic.lat || null,
          lng: clinic.lng || null,
          images: Array.isArray(clinic.images) ? clinic.images : [],
          timings: Array.isArray(clinic.timings) ? clinic.timings : []
        })))
      } else {
        setClinics([])
      }
    }
  }, [doctorProfile])

  // Update doctor profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data) => profileApi.updateDoctorProfile(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['doctorProfile'])
      toast.success('Clinics updated successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update clinics'
      toast.error(errorMessage)
    }
  })

  // Upload clinic images mutation
  const uploadClinicImagesMutation = useMutation({
    mutationFn: async ({ clinicIndex, files }) => {
      const formData = new FormData()
      Array.from(files).forEach(file => {
        formData.append('files', file)
      })
      const response = await api.post('/upload/clinic', formData)
      return response.data
    },
    onSuccess: (response, variables) => {
      const uploadedUrls = response.data?.urls || []
      const newClinics = [...clinics]
      if (newClinics[variables.clinicIndex]) {
        newClinics[variables.clinicIndex].images = [
          ...(newClinics[variables.clinicIndex].images || []),
          ...uploadedUrls
        ]
        setClinics(newClinics)
      }
      toast.success('Images uploaded successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload images')
    }
  })

  // Handle add new clinic
  const handleAddClinic = (e) => {
    e.preventDefault()
    const newId = `clinic-${Date.now()}-${clinicCounterRef.current++}`
    setClinics([...clinics, {
      _id: newId,
      name: '',
      address: '',
      city: '',
      state: '',
      country: '',
      phone: '',
      lat: null,
      lng: null,
      images: [],
      timings: []
    }])
  }

  // Handle clinic change
  const handleClinicChange = (index, field, value) => {
    const newClinics = [...clinics]
    if (!newClinics[index]) {
      newClinics[index] = { name: '', address: '', city: '', state: '', country: '', phone: '', images: [], timings: [] }
    }
    newClinics[index][field] = value
    setClinics(newClinics)
  }

  // Handle image upload
  const handleImageUpload = (clinicIndex, files) => {
    uploadClinicImagesMutation.mutate({ clinicIndex, files })
  }

  // Handle remove image
  const handleRemoveImage = (clinicIndex, imageIndex) => {
    const newClinics = [...clinics]
    if (newClinics[clinicIndex]?.images) {
      newClinics[clinicIndex].images = newClinics[clinicIndex].images.filter((_, i) => i !== imageIndex)
      setClinics(newClinics)
    }
  }

  // Handle remove clinic
  const handleRemoveClinic = (index) => {
    if (window.confirm('Are you sure you want to remove this clinic?')) {
      setClinics(clinics.filter((_, i) => i !== index))
    }
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Filter out empty clinics
    const validClinics = clinics.filter(clinic => 
      clinic.name && clinic.name.trim()
    )

    if (validClinics.length === 0) {
      toast.error('Please add at least one clinic with a name')
      return
    }

    // Prepare update data - use null/undefined for empty optional fields instead of empty strings
    const updateData = {
      clinics: validClinics.map(clinic => {
        const clinicData = {}
        
        // Required field
        if (clinic.name?.trim()) {
          clinicData.name = clinic.name.trim()
        }
        
        // Optional fields - only include if they have values
        if (clinic.address?.trim()) clinicData.address = clinic.address.trim()
        if (clinic.city?.trim()) clinicData.city = clinic.city.trim()
        if (clinic.state?.trim()) clinicData.state = clinic.state.trim()
        if (clinic.country?.trim()) clinicData.country = clinic.country.trim()
        if (clinic.phone?.trim()) clinicData.phone = clinic.phone.trim()
        if (clinic.lat !== null && clinic.lat !== undefined) clinicData.lat = clinic.lat
        if (clinic.lng !== null && clinic.lng !== undefined) clinicData.lng = clinic.lng
        if (Array.isArray(clinic.images) && clinic.images.length > 0) clinicData.images = clinic.images
        if (Array.isArray(clinic.timings) && clinic.timings.length > 0) clinicData.timings = clinic.timings
        
        return clinicData
      })
    }

    updateProfileMutation.mutate(updateData)
  }

  // Handle cancel
  const handleCancel = () => {
    if (doctorProfile) {
      const profileData = doctorProfile.data || doctorProfile
      const clinicsArray = profileData.clinics
      if (clinicsArray && Array.isArray(clinicsArray) && clinicsArray.length > 0) {
        setClinics(clinicsArray.map((clinic, idx) => ({
          _id: clinic._id || `clinic-${Date.now()}-${idx}`,
          name: clinic.name || '',
          address: clinic.address || '',
          city: clinic.city || '',
          state: clinic.state || '',
          country: clinic.country || '',
          phone: clinic.phone || '',
          lat: clinic.lat || null,
          lng: clinic.lng || null,
          images: Array.isArray(clinic.images) ? clinic.images : [],
          timings: Array.isArray(clinic.timings) ? clinic.timings : []
        })))
      } else {
        setClinics([])
      }
    } else {
      setClinics([])
    }
  }

  if (profileLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (profileError) {
    console.error('Error loading profile:', profileError)
  }

  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* DoctorSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            {/* Profile Settings */}
            <div className="dashboard-header">
              <h3>Profile Settings</h3>
            </div>

            {/* Settings List */}
            <div className="setting-tab">
              <div className="appointment-tabs">
                <ul className="nav">
                  <li className="nav-item">
                    <Link className="nav-link" to="/doctor-profile-settings">Basic Details</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/doctor-experience-settings">Experience</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/doctor-education-settings">Education</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/doctor-awards-settings">Awards</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/doctor-insurance-settings">Insurances</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active" to="/doctor-clinics-settings">Clinics</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/doctor-business-settings">Business Hours</Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* /Settings List */}

            <div className="dashboard-header border-0 mb-0">
              <h3>Clinics</h3>
              <ul>
                <li>
                  <a 
                    href="#" 
                    className="btn btn-primary prime-btn add-clinics"
                    onClick={handleAddClinic}
                  >
                    Add New Clinic
                  </a>
                </li>
              </ul>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="accordions clinic-infos" id="list-accord">
                {clinics.length > 0 ? (
                  clinics.map((clinic, index) => {
                    const accordionId = `clinic${index + 1}`
                    const isFirst = index === 0
                    const displayText = clinic.name || 'Clinic'
                    const apiBaseURL = import.meta.env.VITE_API_URL || '/api'
                    const baseURL = apiBaseURL.replace('/api', '')

                    return (
                      <div key={clinic._id || index} className="user-accordion-item">
                        <a 
                          href="#" 
                          className={`accordion-wrap ${isFirst ? '' : 'collapsed'}`}
                          onClick={(e) => {
                            e.preventDefault()
                            const target = document.getElementById(accordionId)
                            if (target) {
                              const bsCollapse = new window.bootstrap.Collapse(target, { toggle: true })
                            }
                          }}
                        >
                          {displayText}
                          <span 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveClinic(index)
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            Delete
                          </span>
                        </a>
                        <div 
                          className={`accordion-collapse collapse ${isFirst ? 'show' : ''}`} 
                          id={accordionId} 
                          data-bs-parent="#list-accord"
                        >
                          <div className="content-collapse">
                            <div className="add-service-info">
                              <div className="add-info">
                                <div className="row align-items-center">
                                  <div className="col-md-12">
                                    <div className="form-wrap">
                                      <label className="col-form-label">Clinic Name <span className="text-danger">*</span></label>
                                      <input 
                                        type="text" 
                                        className="form-control"
                                        value={clinic.name || ''}
                                        onChange={(e) => handleClinicChange(index, 'name', e.target.value)}
                                        placeholder="Clinic name"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-wrap">
                                      <label className="col-form-label">City</label>
                                      <input 
                                        type="text" 
                                        className="form-control"
                                        value={clinic.city || ''}
                                        onChange={(e) => handleClinicChange(index, 'city', e.target.value)}
                                        placeholder="City"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-wrap">
                                      <label className="col-form-label">State</label>
                                      <input 
                                        type="text" 
                                        className="form-control"
                                        value={clinic.state || ''}
                                        onChange={(e) => handleClinicChange(index, 'state', e.target.value)}
                                        placeholder="State"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-wrap">
                                      <label className="col-form-label">Country</label>
                                      <input 
                                        type="text" 
                                        className="form-control"
                                        value={clinic.country || ''}
                                        onChange={(e) => handleClinicChange(index, 'country', e.target.value)}
                                        placeholder="Country"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-wrap">
                                      <label className="col-form-label">Phone</label>
                                      <input 
                                        type="text" 
                                        className="form-control"
                                        value={clinic.phone || ''}
                                        onChange={(e) => handleClinicChange(index, 'phone', e.target.value)}
                                        placeholder="Phone number"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-12">
                                    <div className="form-wrap">
                                      <label className="col-form-label">Address</label>
                                      <input 
                                        type="text" 
                                        className="form-control"
                                        value={clinic.address || ''}
                                        onChange={(e) => handleClinicChange(index, 'address', e.target.value)}
                                        placeholder="Full address"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-12">
                                    <div className="form-wrap">
                                      <label className="col-form-label">Gallery</label>
                                      <div className="drop-file">
                                        <p>Drop files or Click to upload</p>
                                        <input 
                                          type="file" 
                                          multiple
                                          accept="image/*"
                                          onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                              handleImageUpload(index, e.target.files)
                                            }
                                          }}
                                          disabled={uploadClinicImagesMutation.isLoading}
                                        />
                                      </div>
                                      {clinic.images && clinic.images.length > 0 && (
                                        <div className="view-imgs">
                                          {clinic.images.map((imageUrl, imgIndex) => {
                                            const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${baseURL}${imageUrl}`
                                            return (
                                              <div key={imgIndex} className="view-img">
                                                <img src={fullUrl} alt={`Clinic ${index + 1}`} />
                                                <a 
                                                  href="javascript:void(0);"
                                                  onClick={() => handleRemoveImage(index, imgIndex)}
                                                >
                                                  Remove
                                                </a>
                                              </div>
                                            )
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-end">
                                <a 
                                  href="#" 
                                  className="reset more-item"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleRemoveClinic(index)
                                  }}
                                >
                                  Remove
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">No clinics added yet. Click "Add New Clinic" to add one.</p>
                  </div>
                )}
              </div>
              
              <div className="modal-btn text-end">
                <a 
                  href="#" 
                  className="btn btn-gray"
                  onClick={(e) => {
                    e.preventDefault()
                    handleCancel()
                  }}
                >
                  Cancel
                </a>
                <button 
                  type="submit" 
                  className="btn btn-primary prime-btn"
                  disabled={updateProfileMutation.isLoading || uploadClinicImagesMutation.isLoading}
                >
                  {updateProfileMutation.isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
            {/* /Profile Settings */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorClinicsSettings
