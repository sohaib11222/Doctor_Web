import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as specializationApi from '../../api/specialization'
import * as profileApi from '../../api/profile'

const DoctorSpecialities = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Form state
  const [selectedSpecializationId, setSelectedSpecializationId] = useState('')
  const [services, setServices] = useState([])

  // Fetch all specializations
  const { data: specializationsData, isLoading: specializationsLoading, error: specializationsError } = useQuery({
    queryKey: ['specializations'],
    queryFn: () => specializationApi.getAllSpecializations(),
    enabled: !!user
  })

  // Fetch doctor profile
  const { data: doctorProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['doctorProfile'],
    queryFn: () => profileApi.getDoctorProfile(),
    enabled: !!user
  })

  // Initialize form data when profile loads
  useEffect(() => {
    if (doctorProfile?.data) {
      const profile = doctorProfile.data
      setSelectedSpecializationId(profile.specialization?._id || profile.specialization || '')
      setServices(profile.services || [])
    }
  }, [doctorProfile])

  // Update doctor profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data) => profileApi.updateDoctorProfile(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['doctorProfile'])
      toast.success('Specialization and services updated successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update'
      toast.error(errorMessage)
    }
  })

  // Extract specializations from response
  // API function returns: [...] (array of specializations)
  // Handle both structures in case response format differs
  const specializations = Array.isArray(specializationsData) 
    ? specializationsData 
    : specializationsData?.data || []

  // Debug logging
  useEffect(() => {
    if (specializationsData) {
      console.log('Specializations Data:', specializationsData)
      console.log('Specializations:', specializations)
    }
  }, [specializationsData, specializations])

  const handleSpecializationChange = (e) => {
    setSelectedSpecializationId(e.target.value)
  }

  const handleServiceChange = (index, field, value) => {
    const newServices = [...services]
    if (!newServices[index]) {
      newServices[index] = { name: '', price: 0 }
    }
    newServices[index][field] = field === 'price' ? parseFloat(value) || 0 : value
    setServices(newServices)
  }

  const handleAddService = () => {
    setServices([...services, { name: '', price: 0 }])
  }

  const handleRemoveService = (index) => {
    setServices(services.filter((_, i) => i !== index))
  }

  const handleSave = async (e) => {
    e.preventDefault()

    // Validate specialization
    if (!selectedSpecializationId) {
      toast.error('Please select a specialization')
      return
    }

    // Validate services
    const validServices = services.filter(s => s.name && s.name.trim() && s.price > 0)
    if (validServices.length === 0) {
      toast.error('Please add at least one service')
      return
    }

    // Prepare update data
    const updateData = {
      specializationId: selectedSpecializationId,
      services: validServices.map(s => ({
        name: s.name.trim(),
        price: parseFloat(s.price) || 0
      }))
    }

    updateProfileMutation.mutate(updateData)
  }

  const handleCancel = () => {
    // Reset to original values
    if (doctorProfile?.data) {
      const profile = doctorProfile.data
      setSelectedSpecializationId(profile.specialization?._id || profile.specialization || '')
      setServices(profile.services || [])
    }
  }

  const currentSpecialization = specializations.find(s => s._id === selectedSpecializationId)

  if (specializationsLoading || profileLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (specializationsError) {
    return (
      <div className="text-center py-5 text-danger">
        <p>Error loading specializations</p>
        <small>{specializationsError.response?.data?.message || specializationsError.message || 'Failed to load specializations'}</small>
      </div>
    )
  }

  return (
    <>
      <div className="dashboard-header">
        <h3>Speciality & Services</h3>
      </div>

      <form onSubmit={handleSave}>
        <div className="accordions" id="list-accord">
          {/* Speciality Item */}
          <div className="user-accordion-item">
            <a 
              href="#" 
              className="accordion-wrap"
              onClick={(e) => {
                e.preventDefault()
                const target = document.getElementById('specialization-collapse')
                if (target) {
                  const bsCollapse = new window.bootstrap.Collapse(target, { toggle: true })
                }
              }}
            >
              {currentSpecialization?.name || 'Select Specialization'}
              {currentSpecialization && (
                <span 
                  onClick={(e) => {
                    e.stopPropagation()
                    if (window.confirm('Are you sure you want to remove this specialization? This will also remove all services.')) {
                      setSelectedSpecializationId('')
                      setServices([])
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  Remove
                </span>
              )}
            </a>
            <div className="accordion-collapse collapse show" id="specialization-collapse" data-bs-parent="#list-accord">
              <div className="content-collapse">
                <div className="add-service-info">
                  <div className="add-info">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-wrap">
                          <label className="form-label">Speciality <span className="text-danger">*</span></label>
                          <select 
                            className="select form-control"
                            value={selectedSpecializationId}
                            onChange={handleSpecializationChange}
                            required
                          >
                            <option value="">Select Specialization</option>
                            {specializations.length > 0 ? (
                              specializations.map((spec) => (
                                <option key={spec._id} value={spec._id}>
                                  {spec.name}
                                </option>
                              ))
                            ) : (
                              <option disabled>No specializations available</option>
                            )}
                          </select>
                          {specializations.length === 0 && (
                            <small className="form-text text-muted">
                              No specializations found. Please contact admin to add specializations.
                            </small>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Services List */}
                    {selectedSpecializationId && (
                      <>
                        <div className="row service-cont mt-3">
                          <div className="col-12">
                            <h6 className="mb-3">Services</h6>
                          </div>
                        </div>
                        {services.length > 0 ? (
                          services.map((service, index) => (
                            <div key={index} className="row service-cont">
                              <div className="col-md-3">
                                <div className="form-wrap">
                                  <label className="form-label">Service <span className="text-danger">*</span></label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={service.name || ''}
                                    onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                                    placeholder="Service name"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-wrap">
                                  <label className="form-label">Price ($) <span className="text-danger">*</span></label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={service.price || ''}
                                    onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-7">
                                <div className="d-flex align-items-end">
                                  <div className="form-wrap w-100">
                                    <label className="col-form-label d-block">&nbsp;</label>
                                    <a
                                      href="#"
                                      className="trash-icon trash"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        handleRemoveService(index)
                                      }}
                                    >
                                      Delete
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="row">
                            <div className="col-12">
                              <p className="text-muted">No services added yet. Click "Add New Service" to add one.</p>
                            </div>
                          </div>
                        )}
                        <div className="text-end mt-3">
                          <a
                            href="#"
                            className="add-serv more-item mb-0"
                            onClick={(e) => {
                              e.preventDefault()
                              handleAddService()
                            }}
                          >
                            Add New Service
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Speciality Item */}
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
            disabled={updateProfileMutation.isLoading}
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
    </>
  )
}

export default DoctorSpecialities
