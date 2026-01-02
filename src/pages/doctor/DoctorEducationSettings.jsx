import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as profileApi from '../../api/profile'

const DoctorEducationSettings = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const educationCounterRef = useRef(0)

  // Education state: array of {degree, college, year}
  const [educations, setEducations] = useState([])

  // Fetch doctor profile
  const { data: doctorProfile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['doctorProfile'],
    queryFn: () => profileApi.getDoctorProfile(),
    enabled: !!user,
    retry: 1
  })

  // Initialize educations from profile
  useEffect(() => {
    console.log('DoctorProfile Data:', doctorProfile)
    if (doctorProfile) {
      // Axios interceptor returns response.data, so doctorProfile is already { success, message, data }
      const profileData = doctorProfile.data || doctorProfile
      console.log('Profile Data:', profileData)
      console.log('Education Data:', profileData.education)
      
      // Handle null or array
      const educationArray = profileData.education
      if (educationArray && Array.isArray(educationArray) && educationArray.length > 0) {
        setEducations(educationArray.map((edu, idx) => ({
          _id: edu._id || `edu-${Date.now()}-${idx}`,
          degree: edu.degree || '',
          college: edu.college || '',
          year: edu.year || ''
        })))
      } else {
        setEducations([])
      }
    }
  }, [doctorProfile])

  // Update doctor profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data) => profileApi.updateDoctorProfile(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['doctorProfile'])
      toast.success('Education updated successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update education'
      toast.error(errorMessage)
    }
  })

  // Handle add new education
  const handleAddEducation = (e) => {
    e.preventDefault()
    const newId = `edu-${Date.now()}-${educationCounterRef.current++}`
    setEducations([...educations, {
      _id: newId,
      degree: '',
      college: '',
      year: ''
    }])
  }

  // Handle education change
  const handleEducationChange = (index, field, value) => {
    const newEducations = [...educations]
    if (!newEducations[index]) {
      newEducations[index] = { degree: '', college: '', year: '' }
    }
    newEducations[index][field] = value
    setEducations(newEducations)
  }

  // Handle remove education
  const handleRemoveEducation = (index) => {
    if (window.confirm('Are you sure you want to remove this education?')) {
      setEducations(educations.filter((_, i) => i !== index))
    }
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Filter out empty educations
    const validEducations = educations.filter(edu => 
      edu.degree && edu.degree.trim() && edu.college && edu.college.trim()
    )

    // Prepare update data - only include fields with values
    const updateData = {
      education: validEducations.map(edu => {
        const eduData = {}
        if (edu.degree?.trim()) eduData.degree = edu.degree.trim()
        if (edu.college?.trim()) eduData.college = edu.college.trim()
        if (edu.year?.trim()) eduData.year = edu.year.trim()
        return eduData
      })
    }

    updateProfileMutation.mutate(updateData)
  }

  // Handle cancel
  const handleCancel = () => {
    if (doctorProfile) {
      const profileData = doctorProfile.data || doctorProfile
      const educationArray = profileData.education
      if (educationArray && Array.isArray(educationArray) && educationArray.length > 0) {
        setEducations(educationArray.map((edu, idx) => ({
          _id: edu._id || `edu-${Date.now()}-${idx}`,
          degree: edu.degree || '',
          college: edu.college || '',
          year: edu.year || ''
        })))
      } else {
        setEducations([])
      }
    } else {
      setEducations([])
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
                    <Link className="nav-link active" to="/doctor-education-settings">Education</Link>
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
              <h3>Education</h3>
              <ul>
                <li>
                  <a 
                    href="#" 
                    className="btn btn-primary prime-btn add-educations"
                    onClick={handleAddEducation}
                  >
                    Add New Education
                  </a>
                </li>
              </ul>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="accordions education-infos" id="list-accord">
                {educations.length > 0 ? (
                  educations.map((education, index) => {
                    const accordionId = `education${index + 1}`
                    const isFirst = index === 0
                    const displayText = education.college && education.degree
                      ? `${education.college} (${education.degree})`
                      : 'Education'

                    return (
                      <div key={education._id || index} className="user-accordion-item">
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
                              handleRemoveEducation(index)
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
                                  <div className="col-md-6">
                                    <div className="form-wrap">
                                      <label className="col-form-label">Name of the institution <span className="text-danger">*</span></label>
                                      <input 
                                        type="text" 
                                        className="form-control"
                                        value={education.college || ''}
                                        onChange={(e) => handleEducationChange(index, 'college', e.target.value)}
                                        placeholder="College/University name"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-wrap">
                                      <label className="col-form-label">Course/Degree <span className="text-danger">*</span></label>
                                      <input 
                                        type="text" 
                                        className="form-control"
                                        value={education.degree || ''}
                                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                        placeholder="e.g., MBBS, MD"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-4 col-md-6">
                                    <div className="form-wrap">
                                      <label className="col-form-label">Year <span className="text-danger">*</span></label>
                                      <input 
                                        type="text" 
                                        className="form-control"
                                        value={education.year || ''}
                                        onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                                        placeholder="e.g., 2015"
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
                                    handleRemoveEducation(index)
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
                    <p className="text-muted">No education added yet. Click "Add New Education" to add one.</p>
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

export default DoctorEducationSettings
