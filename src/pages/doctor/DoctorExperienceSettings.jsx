import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as profileApi from '../../api/profile'

const DoctorExperienceSettings = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const experienceCounterRef = useRef(0)

  // Experience state: array of {hospital, fromYear, toYear, designation}
  const [experiences, setExperiences] = useState([])

  // Fetch doctor profile
  const { data: doctorProfile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['doctorProfile'],
    queryFn: () => profileApi.getDoctorProfile(),
    enabled: !!user,
    retry: 1
  })

  // Initialize experiences from profile
  useEffect(() => {
    console.log('DoctorProfile Data:', doctorProfile)
    if (doctorProfile) {
      // Axios interceptor returns response.data, so doctorProfile is already { success, message, data }
      const profileData = doctorProfile.data || doctorProfile
      console.log('Profile Data:', profileData)
      console.log('Experience Data:', profileData.experience)
      
      // Handle null or array
      const experienceArray = profileData.experience
      if (experienceArray && Array.isArray(experienceArray) && experienceArray.length > 0) {
        setExperiences(experienceArray.map((exp, idx) => ({
          _id: exp._id || `exp-${Date.now()}-${idx}`,
          hospital: exp.hospital || '',
          fromYear: exp.fromYear || '',
          toYear: exp.toYear || '',
          designation: exp.designation || ''
        })))
      } else {
        setExperiences([])
      }
    }
  }, [doctorProfile])

  // Update doctor profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data) => profileApi.updateDoctorProfile(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['doctorProfile'])
      toast.success('Experience updated successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update experience'
      toast.error(errorMessage)
    }
  })

  // Handle add new experience
  const handleAddExperience = (e) => {
    e.preventDefault()
    const newId = `exp-${Date.now()}-${experienceCounterRef.current++}`
    setExperiences([...experiences, {
      _id: newId,
      hospital: '',
      fromYear: '',
      toYear: '',
      designation: ''
    }])
  }

  // Handle experience change
  const handleExperienceChange = (index, field, value) => {
    const newExperiences = [...experiences]
    if (!newExperiences[index]) {
      newExperiences[index] = { hospital: '', fromYear: '', toYear: '', designation: '' }
    }
    newExperiences[index][field] = value
    setExperiences(newExperiences)
  }

  // Handle remove experience
  const handleRemoveExperience = (index) => {
    if (window.confirm('Are you sure you want to remove this experience?')) {
      setExperiences(experiences.filter((_, i) => i !== index))
    }
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Filter out empty experiences
    const validExperiences = experiences.filter(exp => 
      exp.hospital && exp.hospital.trim()
    )

    // Prepare update data - only include fields with values
    const updateData = {
      experience: validExperiences.map(exp => {
        const expData = {}
        if (exp.hospital?.trim()) expData.hospital = exp.hospital.trim()
        if (exp.fromYear?.trim()) expData.fromYear = exp.fromYear.trim()
        if (exp.toYear?.trim()) expData.toYear = exp.toYear.trim()
        if (exp.designation?.trim()) expData.designation = exp.designation.trim()
        return expData
      })
    }

    updateProfileMutation.mutate(updateData)
  }

  // Handle cancel
  const handleCancel = () => {
    if (doctorProfile) {
      const profileData = doctorProfile.data || doctorProfile
      const experienceArray = profileData.experience
      if (experienceArray && Array.isArray(experienceArray) && experienceArray.length > 0) {
        setExperiences(experienceArray.map((exp, idx) => ({
          _id: exp._id || `exp-${Date.now()}-${idx}`,
          hospital: exp.hospital || '',
          fromYear: exp.fromYear || '',
          toYear: exp.toYear || '',
          designation: exp.designation || ''
        })))
      } else {
        setExperiences([])
      }
    } else {
      setExperiences([])
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
                    <Link className="nav-link active" to="/doctor-experience-settings">Experience</Link>
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
                    <Link className="nav-link" to="/doctor-clinics-settings">Clinics</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/doctor-business-settings">Business Hours</Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* /Settings List */}

            <div className="dashboard-header border-0 mb-0">
              <h3>Experience</h3>
              <ul>
                <li>
                  <a 
                    href="#" 
                    className="btn btn-primary prime-btn add-experiences"
                    onClick={handleAddExperience}
                  >
                    Add New Experience
                  </a>
                </li>
              </ul>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="accordions experience-infos" id="list-accord">
                {experiences.length > 0 ? (
                  experiences.map((experience, index) => {
                    const accordionId = `experience${index + 1}`
                    const isFirst = index === 0
                    const displayText = experience.hospital 
                      ? `${experience.hospital}${experience.fromYear && experience.toYear ? ` (${experience.fromYear} - ${experience.toYear})` : ''}`
                      : 'Experience'

                    return (
                      <div key={experience._id || index} className="user-accordion-item">
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
                              handleRemoveExperience(index)
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
                                  <div className="col-lg-4 col-md-6">
                                    <div className="form-wrap">
                                      <label className="col-form-label">Designation/Title</label>
                                      <input 
                                        type="text" 
                                        className="form-control"
                                        value={experience.designation || ''}
                                        onChange={(e) => handleExperienceChange(index, 'designation', e.target.value)}
                                        placeholder="e.g., Senior Surgeon"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-4 col-md-6">
                                    <div className="form-wrap">
                                      <label className="col-form-label">Hospital <span className="text-danger">*</span></label>
                                      <input 
                                        type="text" 
                                        className="form-control"
                                        value={experience.hospital || ''}
                                        onChange={(e) => handleExperienceChange(index, 'hospital', e.target.value)}
                                        placeholder="Hospital name"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-4 col-md-6">
                                    <div className="form-wrap">
                                      <label className="col-form-label">From Year <span className="text-danger">*</span></label>
                                      <input 
                                        type="text" 
                                        className="form-control"
                                        value={experience.fromYear || ''}
                                        onChange={(e) => handleExperienceChange(index, 'fromYear', e.target.value)}
                                        placeholder="e.g., 2020"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-4 col-md-6">
                                    <div className="form-wrap">
                                      <label className="col-form-label">To Year <span className="text-danger">*</span></label>
                                      <input 
                                        type="text" 
                                        className="form-control"
                                        value={experience.toYear || ''}
                                        onChange={(e) => handleExperienceChange(index, 'toYear', e.target.value)}
                                        placeholder="e.g., 2023 or Present"
                                      />
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
                                    handleRemoveExperience(index)
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
                    <p className="text-muted">No experiences added yet. Click "Add New Experience" to add one.</p>
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
            {/* /Profile Settings */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorExperienceSettings
