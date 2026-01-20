import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as profileApi from '../../api/profile'
import * as insuranceApi from '../../api/insurance'
import { PROFILE_SETTINGS_TABS } from '../../utils/profileSettingsTabs'
import { normalizeImageUrl } from '../../utils/imageUtils'

const DoctorInsuranceSettings = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [convenzionato, setConvenzionato] = useState(false)
  const [selectedInsuranceIds, setSelectedInsuranceIds] = useState([])

  // Fetch doctor profile
  const { data: doctorProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['doctorProfile'],
    queryFn: () => profileApi.getDoctorProfile(),
    enabled: !!user
  })

  // Fetch active insurance companies (always fetch so doctor can see options)
  const { data: insuranceCompaniesData, isLoading: insuranceLoading, error: insuranceError } = useQuery({
    queryKey: ['activeInsuranceCompanies'],
    queryFn: () => insuranceApi.getActiveInsuranceCompanies(),
    enabled: !!user // Always fetch when user is logged in
  })

  // Extract insurance companies - handle both direct array and wrapped response
  const insuranceCompanies = useMemo(() => {
    if (!insuranceCompaniesData) {
      console.log('🔍 DoctorInsuranceSettings - No insuranceCompaniesData')
      return []
    }
    
    console.log('🔍 DoctorInsuranceSettings - insuranceCompaniesData:', insuranceCompaniesData)
    
    // Axios interceptor returns response.data, so we get { success: true, data: [...] }
    // If it's already an array, return it
    if (Array.isArray(insuranceCompaniesData)) {
      console.log('🔍 DoctorInsuranceSettings - Data is array, length:', insuranceCompaniesData.length)
      return insuranceCompaniesData
    }
    
    // If it has a data property, extract it
    if (insuranceCompaniesData.data) {
      const companies = Array.isArray(insuranceCompaniesData.data) ? insuranceCompaniesData.data : []
      console.log('🔍 DoctorInsuranceSettings - Extracted from data property, length:', companies.length)
      return companies
    }
    
    console.log('🔍 DoctorInsuranceSettings - No valid data structure found')
    return []
  }, [insuranceCompaniesData])

  // Initialize form data from profile
  useEffect(() => {
    if (doctorProfile) {
      const profileData = doctorProfile.data || doctorProfile
      const isConvenzionato = profileData.convenzionato === true
      setConvenzionato(isConvenzionato)
      
      // Extract insurance company IDs
      if (profileData.insuranceCompanies && Array.isArray(profileData.insuranceCompanies)) {
        const ids = profileData.insuranceCompanies
          .map(ins => {
            if (typeof ins === 'object' && ins !== null) {
              return ins._id || ins.id
            }
            return ins
          })
          .filter(Boolean)
        setSelectedInsuranceIds(ids)
      } else {
        setSelectedInsuranceIds([])
      }
    }
  }, [doctorProfile])

  // Update doctor profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data) => profileApi.updateDoctorProfile(data),
    onSuccess: async (response) => {
      queryClient.invalidateQueries(['doctorProfile'])
      toast.success('Insurance settings updated successfully!')
      
      // Check if profile is still incomplete and navigate to next tab
      try {
        const updatedProfile = await queryClient.fetchQuery({
          queryKey: ['doctorProfile'],
          queryFn: () => profileApi.getDoctorProfile(),
        })
        const profileData = updatedProfile?.data || updatedProfile
        const isProfileCompleted = profileData?.profileCompleted === true
        
        if (!isProfileCompleted) {
          const nextTabPath = getNextTabPath(location.pathname)
          if (nextTabPath) {
            setTimeout(() => {
              navigate(nextTabPath)
            }, 500)
          }
        }
      } catch (error) {
        console.error('Error checking profile completion:', error)
      }
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update insurance settings'
      toast.error(errorMessage)
    }
  })

  // Handle convenzionato toggle
  const handleConvenzionatoChange = (e) => {
    const isEnabled = e.target.checked
    setConvenzionato(isEnabled)
    
    // If disabling, clear selected insurance companies
    if (!isEnabled) {
      setSelectedInsuranceIds([])
    }
  }

  // Handle insurance company selection
  const handleInsuranceToggle = (insuranceId) => {
    setSelectedInsuranceIds(prev => {
      if (prev.includes(insuranceId)) {
        return prev.filter(id => id !== insuranceId)
      } else {
        return [...prev, insuranceId]
      }
    })
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // If convenzionato is enabled but no insurance selected, show warning
    if (convenzionato && selectedInsuranceIds.length === 0) {
      toast.warning('Please select at least one insurance company if you accept insurance')
      return
    }

    const updateData = {
      convenzionato: convenzionato === true,
      insuranceCompanies: convenzionato ? selectedInsuranceIds : []
    }

    console.log('🔍 DoctorInsuranceSettings - Submitting data:', updateData)
    console.log('🔍 DoctorInsuranceSettings - Selected IDs:', selectedInsuranceIds)
    console.log('🔍 DoctorInsuranceSettings - Convenzionato:', convenzionato)

    updateProfileMutation.mutate(updateData)
  }

  // Get next tab path helper
  const getNextTabPath = (currentPath) => {
    const currentIndex = PROFILE_SETTINGS_TABS.findIndex(tab => tab.path === currentPath)
    if (currentIndex === -1 || currentIndex === PROFILE_SETTINGS_TABS.length - 1) {
      return null
    }
    return PROFILE_SETTINGS_TABS[currentIndex + 1].path
  }

  // Check if current tab is active
  const isActive = (path) => location.pathname === path

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
                  {PROFILE_SETTINGS_TABS.map((tab) => (
                    <li className="nav-item" key={tab.key}>
                      <Link 
                        className={`nav-link ${isActive(tab.path) ? 'active' : ''}`} 
                        to={tab.path}
                      >
                        {tab.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* /Settings List */}

            <div className="dashboard-header border-0 mb-0">
              <h3>Insurance Settings</h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="setting-title">
                <h5>Convenzionato (Insurance Partner)</h5>
              </div>

              <div className="setting-card">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label className="form-label">
                        Do you accept insurance? <span className="text-danger">*</span>
                      </label>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="convenzionato"
                          checked={convenzionato}
                          onChange={handleConvenzionatoChange}
                          disabled={updateProfileMutation.isPending || profileLoading}
                        />
                        <label className="form-check-label" htmlFor="convenzionato">
                          {convenzionato ? 'Yes, I accept insurance' : 'No, I do not accept insurance'}
                        </label>
                      </div>
                      <small className="form-text text-muted">
                        Enable this if you are partnered with insurance companies and accept insurance payments
                      </small>
                    </div>
                  </div>
                </div>

                {convenzionato && (
                  <div className="row mt-4">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="form-label mb-3">
                          Select Insurance Companies <span className="text-danger">*</span>
                        </label>
                        {insuranceLoading ? (
                          <div className="text-center py-4">
                            <div className="spinner-border spinner-border-sm" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2 mb-0">Loading insurance companies...</p>
                          </div>
                        ) : insuranceCompanies.length === 0 ? (
                          <div className="alert alert-warning">
                            <i className="fa-solid fa-exclamation-triangle me-2"></i>
                            No active insurance companies available. Please contact admin to add insurance companies.
                          </div>
                        ) : (
                          <div className="row">
                            {insuranceCompanies.map((insurance) => {
                              const insuranceId = insurance._id || insurance.id
                              const isSelected = selectedInsuranceIds.includes(insuranceId)
                              const logoUrl = normalizeImageUrl(insurance.logo)
                              
                              return (
                                <div key={insuranceId} className="col-md-4 col-lg-3 mb-3">
                                  <div
                                    className={`card insurance-company-card ${isSelected ? 'border-primary' : ''}`}
                                    style={{
                                      cursor: 'pointer',
                                      border: isSelected ? '2px solid #007bff' : '1px solid #dee2e6',
                                      transition: 'all 0.2s'
                                    }}
                                    onClick={() => handleInsuranceToggle(insuranceId)}
                                  >
                                    <div className="card-body text-center p-3">
                                      {logoUrl ? (
                                        <img
                                          src={logoUrl}
                                          alt={insurance.name}
                                          style={{
                                            maxWidth: '100%',
                                            maxHeight: '60px',
                                            objectFit: 'contain',
                                            marginBottom: '10px'
                                          }}
                                          onError={(e) => {
                                            e.target.style.display = 'none'
                                            e.target.nextSibling.style.display = 'flex'
                                          }}
                                        />
                                      ) : null}
                                      <div
                                        className="insurance-placeholder"
                                        style={{
                                          display: logoUrl ? 'none' : 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          height: '60px',
                                          marginBottom: '10px',
                                          backgroundColor: '#f8f9fa',
                                          borderRadius: '4px'
                                        }}
                                      >
                                        <i className="fa-solid fa-shield-halved fa-2x text-muted"></i>
                                      </div>
                                      <h6 className="mb-0" style={{ fontSize: '14px' }}>
                                        {insurance.name}
                                      </h6>
                                      <div className="mt-2">
                                        {isSelected ? (
                                          <i className="fa-solid fa-check-circle text-primary"></i>
                                        ) : (
                                          <i className="fa-regular fa-circle text-muted"></i>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                        {convenzionato && selectedInsuranceIds.length === 0 && insuranceCompanies.length > 0 && (
                          <div className="alert alert-info mt-3">
                            <i className="fa-solid fa-info-circle me-2"></i>
                            Please select at least one insurance company
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-btn text-end mt-4">
                <Link to="/doctor/dashboard" className="btn btn-gray me-2">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary prime-btn"
                  disabled={updateProfileMutation.isPending || profileLoading || (convenzionato && insuranceLoading)}
                >
                  {updateProfileMutation.isPending ? (
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorInsuranceSettings
