import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as profileApi from '../../api/profile'
import api from '../../api/axios'

const DoctorProfileSettings = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Form state for user profile (fullName, phone, profileImage)
  const [userProfileData, setUserProfileData] = useState({
    fullName: '',
    phone: '',
    profileImage: ''
  })

  // Form state for doctor profile (title, biography, memberships)
  const [doctorProfileData, setDoctorProfileData] = useState({
    title: '',
    biography: '',
    memberships: []
  })

  // Profile image file
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [profileImagePreview, setProfileImagePreview] = useState('')

  // Fetch user profile
  const { data: userProfile, isLoading: userProfileLoading } = useQuery({
    queryKey: ['userProfile', user?._id],
    queryFn: () => profileApi.getUserProfile(user._id),
    enabled: !!user?._id
  })

  // Fetch doctor profile
  const { data: doctorProfile, isLoading: doctorProfileLoading } = useQuery({
    queryKey: ['doctorProfile'],
    queryFn: () => profileApi.getDoctorProfile(),
    enabled: !!user
  })

  // Update user profile mutation
  const updateUserProfileMutation = useMutation({
    mutationFn: (data) => profileApi.updateUserProfile(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['userProfile', user?._id])
      queryClient.invalidateQueries(['doctorProfile'])
      // Update AuthContext user
      if (response.data) {
        // Update user in context if needed
      }
      toast.success('Profile updated successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile'
      toast.error(errorMessage)
    }
  })

  // Update doctor profile mutation
  const updateDoctorProfileMutation = useMutation({
    mutationFn: (data) => profileApi.updateDoctorProfile(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['doctorProfile'])
      queryClient.invalidateQueries(['userProfile', user?._id])
      toast.success('Doctor profile updated successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update doctor profile'
      toast.error(errorMessage)
    }
  })

  // Upload profile image mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      const response = await api.post('/upload/profile', formData)
      return response.data
    },
    onSuccess: (response) => {
      const relativeUrl = response.data?.url || response.url
      // Convert relative URL to full URL for validation
      // Base URL from env might include /api, so we need to remove it for image URLs
      const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      const baseURL = apiBaseURL.replace('/api', '')
      const imageUrl = relativeUrl.startsWith('http') ? relativeUrl : `${baseURL}${relativeUrl}`
      setUserProfileData(prev => ({ ...prev, profileImage: imageUrl }))
      // For preview, use relative URL (works with frontend)
      setProfileImagePreview(relativeUrl)
      toast.success('Image uploaded successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload image'
      toast.error(errorMessage)
    }
  })

  // Initialize form data when profiles are loaded
  useEffect(() => {
    if (userProfile?.data) {
      const user = userProfile.data
      setUserProfileData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        profileImage: user.profileImage || ''
      })
      setProfileImagePreview(user.profileImage || '')
    }
  }, [userProfile])

  useEffect(() => {
    if (doctorProfile?.data) {
      const profile = doctorProfile.data
      setDoctorProfileData({
        title: profile.title || '',
        biography: profile.biography || '',
        memberships: profile.memberships || []
      })
    }
  }, [doctorProfile])

  const handleUserProfileChange = (e) => {
    const { name, value } = e.target
    setUserProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDoctorProfileChange = (e) => {
    const { name, value } = e.target
    setDoctorProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (4 MB)
      if (file.size > 4 * 1024 * 1024) {
        toast.error('Image size must be less than 4 MB')
        return
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml']
      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload jpg, png, or svg file')
        return
      }

      setProfileImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Upload image
      uploadImageMutation.mutate(file)
    }
  }

  const handleRemoveImage = () => {
    setProfileImageFile(null)
    setProfileImagePreview('')
    setUserProfileData(prev => ({ ...prev, profileImage: '' }))
  }

  const handleMembershipChange = (index, field, value) => {
    setDoctorProfileData(prev => {
      const newMemberships = [...prev.memberships]
      if (!newMemberships[index]) {
        newMemberships[index] = { name: '' }
      }
      newMemberships[index][field] = value
      return {
        ...prev,
        memberships: newMemberships
      }
    })
  }

  const handleAddMembership = () => {
    setDoctorProfileData(prev => ({
      ...prev,
      memberships: [...prev.memberships, { name: '' }]
    }))
  }

  const handleRemoveMembership = (index) => {
    setDoctorProfileData(prev => ({
      ...prev,
      memberships: prev.memberships.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    if (!userProfileData.fullName || !userProfileData.phone) {
      toast.error('Please fill in all required fields (First Name, Last Name, Phone)')
      return
    }

    // Prepare user profile data - only include fields that have values
    const userUpdateData = {}
    if (userProfileData.fullName) userUpdateData.fullName = userProfileData.fullName
    if (userProfileData.phone) userUpdateData.phone = userProfileData.phone
    // Only include profileImage if it's a valid URL
    // Backend validator requires a valid URL format, so we need to ensure it's a full URL
    if (userProfileData.profileImage && userProfileData.profileImage.trim()) {
      // If it's already a full URL, use it as is
      if (userProfileData.profileImage.startsWith('http://') || userProfileData.profileImage.startsWith('https://')) {
        userUpdateData.profileImage = userProfileData.profileImage
      } else if (userProfileData.profileImage.startsWith('/uploads')) {
        // Convert relative path to full URL
        // Base URL from env might include /api, so we need to remove it for image URLs
        const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
        const baseURL = apiBaseURL.replace('/api', '')
        userUpdateData.profileImage = `${baseURL}${userProfileData.profileImage}`
      }
      // If it doesn't match either pattern, don't include it (invalid format)
    }

    // Prepare doctor profile data - only include fields that have values
    const doctorUpdateData = {}
    if (doctorProfileData.title) doctorUpdateData.title = doctorProfileData.title
    if (doctorProfileData.biography) doctorUpdateData.biography = doctorProfileData.biography
    if (doctorProfileData.memberships && doctorProfileData.memberships.length > 0) {
      // Filter out empty memberships
      doctorUpdateData.memberships = doctorProfileData.memberships.filter(m => m.name && m.name.trim())
    }

    // Update user profile
    if (Object.keys(userUpdateData).length > 0) {
      updateUserProfileMutation.mutate(userUpdateData)
    }

    // Update doctor profile
    if (Object.keys(doctorUpdateData).length > 0) {
      updateDoctorProfileMutation.mutate(doctorUpdateData)
    }

    // If no data to update, show message
    if (Object.keys(userUpdateData).length === 0 && Object.keys(doctorUpdateData).length === 0) {
      toast.info('No changes to save')
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  // Split fullName into firstName and lastName for display
  const nameParts = userProfileData.fullName ? userProfileData.fullName.split(' ') : ['', '']
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''

  const handleNameChange = (field, value) => {
    if (field === 'firstName') {
      setUserProfileData(prev => ({
        ...prev,
        fullName: `${value} ${lastName}`.trim()
      }))
    } else if (field === 'lastName') {
      setUserProfileData(prev => ({
        ...prev,
        fullName: `${firstName} ${value}`.trim()
      }))
    }
  }

  if (userProfileLoading || doctorProfileLoading) {
    return (
      <div className="content doctor-content">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    )
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
                    <Link className="nav-link active" to="/doctor-profile-settings">Basic Details</Link>
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
                    <Link className="nav-link" to="/doctor-business-settings">Business Hours</Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* /Settings List */}

            <form onSubmit={handleSubmit}>
              <div className="setting-title">
                <h5>Profile</h5>
              </div>

              <div className="setting-card">
                <div className="change-avatar img-upload">
                  <div className="profile-img">
                    {profileImagePreview ? (
                      <img src={profileImagePreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                      <i className="fa-solid fa-file-image"></i>
                    )}
                  </div>
                  <div className="upload-img">
                    <h5>Profile Image</h5>
                    <div className="imgs-load d-flex align-items-center">
                      <div className="change-photo">
                        Upload New
                        <input
                          type="file"
                          className="upload"
                          accept="image/jpeg,image/jpg,image/png,image/svg+xml"
                          onChange={handleImageChange}
                          disabled={uploadImageMutation.isLoading}
                        />
                      </div>
                      {profileImagePreview && (
                        <a
                          href="#"
                          className="upload-remove"
                          onClick={(e) => {
                            e.preventDefault()
                            handleRemoveImage()
                          }}
                        >
                          Remove
                        </a>
                      )}
                    </div>
                    <p className="form-text">Your Image should Below 4 MB, Accepted format jpg,png,svg</p>
                    {uploadImageMutation.isLoading && (
                      <small className="text-muted">Uploading image...</small>
                    )}
                  </div>
                </div>
              </div>

              <div className="setting-title">
                <h5>Information</h5>
              </div>
              <div className="setting-card">
                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="form-wrap">
                      <label className="form-label">First Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={firstName}
                        onChange={(e) => handleNameChange('firstName', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="form-wrap">
                      <label className="form-label">Last Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={lastName}
                        onChange={(e) => handleNameChange('lastName', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="form-wrap">
                      <label className="form-label">Display Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={userProfileData.fullName}
                        onChange={(e) => handleUserProfileChange({ target: { name: 'fullName', value: e.target.value } })}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="form-wrap">
                      <label className="form-label">Designation <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={doctorProfileData.title}
                        onChange={handleDoctorProfileChange}
                        placeholder="e.g., MD, MBBS, etc."
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="form-wrap">
                      <label className="form-label">Phone Numbers <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="phone"
                        value={userProfileData.phone}
                        onChange={handleUserProfileChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-wrap">
                      <label className="form-label">Biography <span className="text-danger">*</span></label>
                      <textarea
                        className="form-control"
                        name="biography"
                        value={doctorProfileData.biography}
                        onChange={handleDoctorProfileChange}
                        placeholder="Enter your biography, professional background, and expertise..."
                        rows="5"
                      />
                      <small className="form-text text-muted">This information will be displayed on your profile page</small>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="form-wrap">
                      <label className="form-label">Email Address <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={user?.email || userProfile?.data?.email || ''}
                        disabled
                        style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                      />
                      <small className="form-text text-muted">Email cannot be changed</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="setting-title">
                <h5>Memberships</h5>
              </div>
              <div className="setting-card">
                {doctorProfileData.memberships.length > 0 ? (
                  <div className="add-info membership-infos">
                    {doctorProfileData.memberships.map((membership, index) => (
                      <div key={index} className="row membership-content" style={{ marginBottom: '15px' }}>
                        <div className="col-lg-12">
                          <div className="d-flex align-items-center">
                            <div className="form-wrap w-100">
                              <label className="form-label">Membership Name</label>
                              <input
                                type="text"
                                className="form-control"
                                value={membership.name || ''}
                                onChange={(e) => handleMembershipChange(index, 'name', e.target.value)}
                                placeholder="Enter membership name"
                              />
                            </div>
                            <div className="form-wrap ms-2">
                              <label className="col-form-label d-block">&nbsp;</label>
                              <a
                                href="#"
                                className="trash-icon trash"
                                onClick={(e) => {
                                  e.preventDefault()
                                  handleRemoveMembership(index)
                                }}
                              >
                                Delete
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No memberships added yet</p>
                )}
                <div className="text-end">
                  <a
                    href="#"
                    className="add-membership-info more-item"
                    onClick={(e) => {
                      e.preventDefault()
                      handleAddMembership()
                    }}
                  >
                    Add New
                  </a>
                </div>
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
                  disabled={updateUserProfileMutation.isLoading || updateDoctorProfileMutation.isLoading}
                >
                  {updateUserProfileMutation.isLoading || updateDoctorProfileMutation.isLoading ? (
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

export default DoctorProfileSettings
