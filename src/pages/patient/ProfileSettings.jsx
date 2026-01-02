import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as profileApi from '../../api/profile'
import api from '../../api/axios'

const ProfileSettings = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    gender: '',
    dob: '',
    bloodGroup: '',
    profileImage: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      country: '',
      zip: ''
    },
    emergencyContact: {
      name: '',
      phone: '',
      relation: ''
    }
  })

  // Profile image file
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [profileImagePreview, setProfileImagePreview] = useState('')

  // Fetch user profile
  const { data: userProfileResponse, isLoading: userProfileLoading } = useQuery({
    queryKey: ['userProfile', user?._id],
    queryFn: () => profileApi.getUserProfile(user._id),
    enabled: !!user?._id
  })

  // Extract user profile data
  const userProfile = userProfileResponse?.data || userProfileResponse

  // Populate form when profile loads
  useEffect(() => {
    if (userProfile) {
      const dob = userProfile.dob ? new Date(userProfile.dob).toISOString().split('T')[0] : ''
      
      setFormData({
        fullName: userProfile.fullName || '',
        phone: userProfile.phone || '',
        gender: userProfile.gender || '',
        dob: dob,
        bloodGroup: userProfile.bloodGroup || '',
        profileImage: userProfile.profileImage || '',
        address: {
          line1: userProfile.address?.line1 || '',
          line2: userProfile.address?.line2 || '',
          city: userProfile.address?.city || '',
          state: userProfile.address?.state || '',
          country: userProfile.address?.country || '',
          zip: userProfile.address?.zip || ''
        },
        emergencyContact: {
          name: userProfile.emergencyContact?.name || '',
          phone: userProfile.emergencyContact?.phone || '',
          relation: userProfile.emergencyContact?.relation || ''
        }
      })

      if (userProfile.profileImage) {
        setProfileImagePreview(userProfile.profileImage)
      }
    }
  }, [userProfile])

  // Update user profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data) => profileApi.updateUserProfile(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['userProfile', user?._id])
      toast.success('Profile updated successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile'
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
      const apiBaseURL = import.meta.env.VITE_API_URL || 'http://157.180.108.156:4001/api'
      const baseURL = apiBaseURL.replace('/api', '')
      const imageUrl = relativeUrl.startsWith('http') ? relativeUrl : `${baseURL}${relativeUrl}`
      setFormData(prev => ({ ...prev, profileImage: imageUrl }))
      setProfileImagePreview(relativeUrl)
      toast.success('Image uploaded successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload image'
      toast.error(errorMessage)
    }
  })

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error('Image size should be below 4 MB')
        return
      }
      setProfileImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      uploadImageMutation.mutate(file)
    }
  }

  // Handle remove image
  const handleRemoveImage = (e) => {
    e.preventDefault()
    setProfileImageFile(null)
    setProfileImagePreview('')
    setFormData(prev => ({ ...prev, profileImage: '' }))
  }

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }))
    } else if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        emergencyContact: { ...prev.emergencyContact, [field]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Prepare data for API
    const updateData = {
      fullName: formData.fullName,
      phone: formData.phone,
      gender: formData.gender || undefined,
      dob: formData.dob || undefined,
      bloodGroup: formData.bloodGroup || undefined,
      profileImage: formData.profileImage || undefined,
      address: {
        line1: formData.address.line1 || null,
        line2: formData.address.line2 || null,
        city: formData.address.city || null,
        state: formData.address.state || null,
        country: formData.address.country || null,
        zip: formData.address.zip || null
      },
      emergencyContact: {
        name: formData.emergencyContact.name || null,
        phone: formData.emergencyContact.phone || null,
        relation: formData.emergencyContact.relation || null
      }
    }

    // Filter out empty strings
    Object.keys(updateData.address).forEach(key => {
      if (updateData.address[key] === '') {
        updateData.address[key] = null
      }
    })
    Object.keys(updateData.emergencyContact).forEach(key => {
      if (updateData.emergencyContact[key] === '') {
        updateData.emergencyContact[key] = null
      }
    })

    updateProfileMutation.mutate(updateData)
  }

  if (userProfileLoading) {
    return (
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              {/* PatientSidebar will be rendered by DashboardLayout */}
            </div>
            <div className="col-lg-12 col-xl-12">
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-2">Loading profile...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* PatientSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            <nav className="settings-tab mb-1">
              <ul className="nav nav-tabs-bottom" role="tablist">
                <li className="nav-item" role="presentation">
                  <Link className="nav-link active" to="/profile-settings">Profile</Link>
                </li>
                <li className="nav-item" role="presentation">
                  <Link className="nav-link" to="/change-password">Change Password</Link>
                </li>
                <li className="nav-item" role="presentation">
                  <Link className="nav-link" to="/two-factor-authentication">2 Factor Authentication</Link>
                </li>
                <li className="nav-item" role="presentation">
                  <Link className="nav-link" to="/delete-account">Delete Account</Link>
                </li>
              </ul>
            </nav>
            <div className="card">
              <div className="card-body">
                <div className="border-bottom pb-3 mb-3">
                  <h5>Profile Settings</h5>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="setting-card">
                    <label className="form-label mb-2">Profile Photo</label>
                    <div className="change-avatar img-upload">
                      <div className="profile-img">
                        {profileImagePreview ? (
                          <img src={profileImagePreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                        ) : (
                          <i className="fa-solid fa-file-image"></i>
                        )}
                      </div>
                      <div className="upload-img">
                        <div className="imgs-load d-flex align-items-center">
                          <div className="change-photo">
                            Upload New 
                            <input 
                              type="file" 
                              className="upload" 
                              accept="image/jpeg,image/png,image/svg+xml"
                              onChange={handleImageChange}
                              disabled={uploadImageMutation.isLoading}
                            />
                          </div>
                          {profileImagePreview && (
                            <a href="#" className="upload-remove" onClick={handleRemoveImage}>Remove</a>
                          )}
                        </div>
                        <p>Your Image should Below 4 MB, Accepted format jpg,png,svg</p>
                      </div>
                    </div>
                  </div>
                  <div className="setting-title">
                    <h6>Information</h6>
                  </div>
                  <div className="setting-card">
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Full Name</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Date of Birth</label>
                          <input 
                            type="date" 
                            className="form-control" 
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Gender</label>
                          <select 
                            className="select" 
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                          >
                            <option value="">Select</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Phone Number</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Email Address</label>
                          <input 
                            type="email" 
                            className="form-control" 
                            value={userProfile?.email || ''}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Blood Group</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleChange}
                            placeholder="e.g., O+ve, A-ve"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="setting-title">
                    <h6>Address</h6>
                  </div>
                  <div className="setting-card">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="form-label">Address Line 1</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="address.line1"
                            value={formData.address.line1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="form-label">Address Line 2</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="address.line2"
                            value={formData.address.line2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">City</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">State</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Country</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="address.country"
                            value={formData.address.country}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">ZIP Code</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="address.zip"
                            value={formData.address.zip}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="setting-title">
                    <h6>Emergency Contact</h6>
                  </div>
                  <div className="setting-card">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">Name</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="emergencyContact.name"
                            value={formData.emergencyContact.name}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">Phone</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="emergencyContact.phone"
                            value={formData.emergencyContact.phone}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">Relation</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="emergencyContact.relation"
                            value={formData.emergencyContact.relation}
                            onChange={handleChange}
                            placeholder="e.g., Spouse, Parent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-btn text-end">
                    <button 
                      type="button" 
                      className="btn btn-md btn-light rounded-pill"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-md btn-primary-gradient rounded-pill"
                      disabled={updateProfileMutation.isLoading}
                    >
                      {updateProfileMutation.isLoading ? 'Saving...' : 'Save Changes'}
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

export default ProfileSettings

