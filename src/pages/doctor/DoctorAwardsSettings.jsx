import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as profileApi from '../../api/profile'

const DoctorAwardsSettings = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const awardCounterRef = useRef(0)

  // Awards state: array of {title, year}
  const [awards, setAwards] = useState([])

  // Fetch doctor profile
  const { data: doctorProfile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['doctorProfile'],
    queryFn: () => profileApi.getDoctorProfile(),
    enabled: !!user,
    retry: 1
  })

  // Initialize awards from profile
  useEffect(() => {
    console.log('DoctorProfile Data:', doctorProfile)
    if (doctorProfile) {
      // Axios interceptor returns response.data, so doctorProfile is already { success, message, data }
      const profileData = doctorProfile.data || doctorProfile
      console.log('Profile Data:', profileData)
      console.log('Awards Data:', profileData.awards)
      
      // Handle null or array
      const awardsArray = profileData.awards
      if (awardsArray && Array.isArray(awardsArray) && awardsArray.length > 0) {
        setAwards(awardsArray.map((award, idx) => ({
          _id: award._id || `award-${Date.now()}-${idx}`,
          title: award.title || '',
          year: award.year || ''
        })))
      } else {
        setAwards([])
      }
    }
  }, [doctorProfile])

  // Update doctor profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data) => profileApi.updateDoctorProfile(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['doctorProfile'])
      toast.success('Awards updated successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update awards'
      toast.error(errorMessage)
    }
  })

  // Handle add new award
  const handleAddAward = (e) => {
    e.preventDefault()
    const newId = `award-${Date.now()}-${awardCounterRef.current++}`
    setAwards([...awards, {
      _id: newId,
      title: '',
      year: ''
    }])
  }

  // Handle award change
  const handleAwardChange = (index, field, value) => {
    const newAwards = [...awards]
    if (!newAwards[index]) {
      newAwards[index] = { title: '', year: '' }
    }
    newAwards[index][field] = value
    setAwards(newAwards)
  }

  // Handle remove award
  const handleRemoveAward = (index) => {
    if (window.confirm('Are you sure you want to remove this award?')) {
      setAwards(awards.filter((_, i) => i !== index))
    }
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Filter out empty awards
    const validAwards = awards.filter(award => 
      award.title && award.title.trim()
    )

    // Prepare update data - only include fields with values
    const updateData = {
      awards: validAwards.map(award => {
        const awardData = {}
        if (award.title?.trim()) awardData.title = award.title.trim()
        if (award.year?.trim()) awardData.year = award.year.trim()
        return awardData
      })
    }

    updateProfileMutation.mutate(updateData)
  }

  // Handle cancel
  const handleCancel = () => {
    if (doctorProfile) {
      const profileData = doctorProfile.data || doctorProfile
      const awardsArray = profileData.awards
      if (awardsArray && Array.isArray(awardsArray) && awardsArray.length > 0) {
        setAwards(awardsArray.map((award, idx) => ({
          _id: award._id || `award-${Date.now()}-${idx}`,
          title: award.title || '',
          year: award.year || ''
        })))
      } else {
        setAwards([])
      }
    } else {
      setAwards([])
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
                    <Link className="nav-link active" to="/doctor-awards-settings">Awards</Link>
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
              <h3>Awards</h3>
              <ul>
                <li>
                  <a 
                    href="#" 
                    className="btn btn-primary prime-btn add-awrads"
                    onClick={handleAddAward}
                  >
                    Add New Award
                  </a>
                </li>
              </ul>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="accordions awrad-infos" id="list-accord">
                {awards.length > 0 ? (
                  awards.map((award, index) => {
                    const accordionId = `award${index + 1}`
                    const isFirst = index === 0
                    const displayText = award.title || 'Awards'

                    return (
                      <div key={award._id || index} className="user-accordion-item">
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
                              handleRemoveAward(index)
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
                                      <label className="col-form-label">Award Name <span className="text-danger">*</span></label>
                                      <input 
                                        type="text" 
                                        className="form-control"
                                        value={award.title || ''}
                                        onChange={(e) => handleAwardChange(index, 'title', e.target.value)}
                                        placeholder="Award title"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-wrap">
                                      <label className="col-form-label">Year <span className="text-danger">*</span></label>
                                      <input 
                                        type="text" 
                                        className="form-control"
                                        value={award.year || ''}
                                        onChange={(e) => handleAwardChange(index, 'year', e.target.value)}
                                        placeholder="e.g., 2020"
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
                                    handleRemoveAward(index)
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
                    <p className="text-muted">No awards added yet. Click "Add New Award" to add one.</p>
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

export default DoctorAwardsSettings
