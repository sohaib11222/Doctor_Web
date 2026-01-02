import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as profileApi from '../../api/profile'

const DoctorBusinessSettings = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  
  // Business hours state: { [dayOfWeek]: { startTime, endTime } }
  const [businessHours, setBusinessHours] = useState({})

  // Fetch doctor profile
  const { data: doctorProfile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['doctorProfile'],
    queryFn: () => profileApi.getDoctorProfile(),
    enabled: !!user,
    retry: 1
  })

  // Initialize business hours from clinics timings
  useEffect(() => {
    console.log('DoctorProfile Data:', doctorProfile)
    if (doctorProfile) {
      // Axios interceptor returns response.data, so doctorProfile is already { success, message, data }
      const profileData = doctorProfile.data || doctorProfile
      console.log('Profile Data:', profileData)
      console.log('Clinics Data:', profileData.clinics)
      
      if (profileData.clinics && Array.isArray(profileData.clinics) && profileData.clinics.length > 0) {
        // Get timings from first clinic (or merge all clinics' timings)
        const firstClinic = profileData.clinics[0]
        console.log('First Clinic:', firstClinic)
        console.log('Timings:', firstClinic?.timings)
        
        if (firstClinic?.timings && Array.isArray(firstClinic.timings) && firstClinic.timings.length > 0) {
          const hours = {}
          firstClinic.timings.forEach(timing => {
            if (timing.dayOfWeek) {
              hours[timing.dayOfWeek] = {
                startTime: timing.startTime || '',
                endTime: timing.endTime || ''
              }
            }
          })
          console.log('Business Hours:', hours)
          setBusinessHours(hours)
        } else {
          setBusinessHours({})
        }
      } else {
        setBusinessHours({})
      }
    }
  }, [doctorProfile])

  // Update doctor profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data) => profileApi.updateDoctorProfile(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['doctorProfile'])
      toast.success('Business hours updated successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update business hours'
      toast.error(errorMessage)
    }
  })

  // Handle time change
  const handleTimeChange = (day, field, value) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }))
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Convert business hours to clinics timings format
    const timings = Object.keys(businessHours)
      .filter(day => businessHours[day]?.startTime && businessHours[day]?.endTime)
      .map(day => ({
        dayOfWeek: day,
        startTime: businessHours[day].startTime,
        endTime: businessHours[day].endTime
      }))

    // Get existing clinics or create a default one
    const existingClinics = doctorProfile?.data?.clinics || []
    let clinics = existingClinics.length > 0 ? [...existingClinics] : [{ name: 'Main Clinic', timings: [] }]

    // Update timings for first clinic (or all clinics if needed)
    clinics = clinics.map((clinic, index) => {
      if (index === 0) {
        return { ...clinic, timings }
      }
      return clinic
    })

    // Prepare update data
    const updateData = { clinics }

    updateProfileMutation.mutate(updateData)
  }

  // Handle cancel
  const handleCancel = () => {
    if (doctorProfile) {
      const profileData = doctorProfile.data || doctorProfile
      if (profileData.clinics && Array.isArray(profileData.clinics) && profileData.clinics.length > 0) {
        const firstClinic = profileData.clinics[0]
        if (firstClinic?.timings && Array.isArray(firstClinic.timings) && firstClinic.timings.length > 0) {
          const hours = {}
          firstClinic.timings.forEach(timing => {
            if (timing.dayOfWeek) {
              hours[timing.dayOfWeek] = {
                startTime: timing.startTime || '',
                endTime: timing.endTime || ''
              }
            }
          })
          setBusinessHours(hours)
        } else {
          setBusinessHours({})
        }
      } else {
        setBusinessHours({})
      }
    } else {
      setBusinessHours({})
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

  const activeDays = Object.keys(businessHours).filter(day => 
    businessHours[day]?.startTime && businessHours[day]?.endTime
  )

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
                    <Link className="nav-link" to="/doctor-clinics-settings">Clinics</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active" to="/doctor-business-settings">Business Hours</Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* /Settings List */}

            <div className="dashboard-header border-0 mb-0">
              <h3>Business Hours</h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="business-wrap">
                <h4>Select Business days</h4>
                <ul className="business-nav">
                  {days.map((day) => {
                    const dayId = day.toLowerCase()
                    const isActive = activeDays.includes(day)
                    return (
                      <li key={day}>
                        <a 
                          className={`tab-link ${isActive ? 'active' : ''}`} 
                          data-tab={`day-${dayId}`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            // Toggle active state
                            if (!businessHours[day]) {
                              setBusinessHours(prev => ({
                                ...prev,
                                [day]: { startTime: '', endTime: '' }
                              }))
                            } else {
                              const newHours = { ...businessHours }
                              delete newHours[day]
                              setBusinessHours(newHours)
                            }
                          }}
                        >
                          {day}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="accordions business-info" id="list-accord">
                {days.map((day, index) => {
                  const dayId = day.toLowerCase()
                  const isActive = activeDays.includes(day) || businessHours[day]
                  const isFirst = index === 0 && isActive
                  const dayHours = businessHours[day] || { startTime: '', endTime: '' }

                  return (
                    <div 
                      key={day} 
                      className={`user-accordion-item tab-items ${isActive ? 'active' : ''}`} 
                      id={`day-${dayId}`}
                    >
                      <a 
                        href="#" 
                        className={`accordion-wrap ${isFirst ? '' : 'collapsed'}`}
                        onClick={(e) => {
                          e.preventDefault()
                          const target = document.getElementById(dayId)
                          if (target) {
                            const bsCollapse = new window.bootstrap.Collapse(target, { toggle: true })
                          }
                        }}
                      >
                        {day}
                        <span className="edit">Edit</span>
                      </a>
                      <div 
                        className={`accordion-collapse collapse ${isFirst ? 'show' : ''}`} 
                        id={dayId} 
                        data-bs-parent="#list-accord"
                      >
                        <div className="content-collapse pb-0">
                          <div className="row align-items-center">
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">From <span className="text-danger">*</span></label>
                                <div className="form-icon">
                                  <input 
                                    type="time" 
                                    className="form-control timepicker1"
                                    value={dayHours.startTime || ''}
                                    onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                                  />
                                  <span className="icon"><i className="fa-solid fa-clock"></i></span>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">To <span className="text-danger">*</span></label>
                                <div className="form-icon">
                                  <input 
                                    type="time" 
                                    className="form-control timepicker1"
                                    value={dayHours.endTime || ''}
                                    onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                                  />
                                  <span className="icon"><i className="fa-solid fa-clock"></i></span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
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

export default DoctorBusinessSettings
