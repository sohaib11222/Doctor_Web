import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as profileApi from '../../api/profile'

const SocialMedia = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Social links state: {facebook, instagram, linkedin, twitter, website}
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    website: ''
  })

  // Fetch doctor profile
  const { data: doctorProfile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['doctorProfile'],
    queryFn: () => profileApi.getDoctorProfile(),
    enabled: !!user,
    retry: 1
  })

  // Initialize social links from profile
  useEffect(() => {
    console.log('DoctorProfile Data:', doctorProfile)
    if (doctorProfile) {
      // Axios interceptor returns response.data, so doctorProfile is already { success, message, data }
      const profileData = doctorProfile.data || doctorProfile
      console.log('Profile Data:', profileData)
      console.log('Social Links Data:', profileData.socialLinks)
      
      if (profileData.socialLinks) {
        setSocialLinks({
          facebook: profileData.socialLinks.facebook || '',
          instagram: profileData.socialLinks.instagram || '',
          linkedin: profileData.socialLinks.linkedin || '',
          twitter: profileData.socialLinks.twitter || '',
          website: profileData.socialLinks.website || ''
        })
      } else {
        setSocialLinks({
          facebook: '',
          instagram: '',
          linkedin: '',
          twitter: '',
          website: ''
        })
      }
    }
  }, [doctorProfile])

  // Update doctor profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data) => profileApi.updateDoctorProfile(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['doctorProfile'])
      toast.success('Social media links updated successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update social media links'
      toast.error(errorMessage)
    }
  })

  // Handle social link change
  const handleLinkChange = (platform, value) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value
    }))
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Prepare update data - only include non-empty URLs, validate URLs
    const socialLinksData = {}
    
    // Validate and add URLs only if they're not empty
    if (socialLinks.facebook?.trim()) {
      try {
        new URL(socialLinks.facebook.trim())
        socialLinksData.facebook = socialLinks.facebook.trim()
      } catch {
        toast.error('Invalid Facebook URL')
        return
      }
    }
    
    if (socialLinks.instagram?.trim()) {
      try {
        new URL(socialLinks.instagram.trim())
        socialLinksData.instagram = socialLinks.instagram.trim()
      } catch {
        toast.error('Invalid Instagram URL')
        return
      }
    }
    
    if (socialLinks.linkedin?.trim()) {
      try {
        new URL(socialLinks.linkedin.trim())
        socialLinksData.linkedin = socialLinks.linkedin.trim()
      } catch {
        toast.error('Invalid LinkedIn URL')
        return
      }
    }
    
    if (socialLinks.twitter?.trim()) {
      try {
        new URL(socialLinks.twitter.trim())
        socialLinksData.twitter = socialLinks.twitter.trim()
      } catch {
        toast.error('Invalid Twitter URL')
        return
      }
    }
    
    if (socialLinks.website?.trim()) {
      try {
        new URL(socialLinks.website.trim())
        socialLinksData.website = socialLinks.website.trim()
      } catch {
        toast.error('Invalid Website URL')
        return
      }
    }

    const updateData = {
      socialLinks: socialLinksData
    }

    updateProfileMutation.mutate(updateData)
  }

  // Handle cancel
  const handleCancel = () => {
    if (doctorProfile) {
      const profileData = doctorProfile.data || doctorProfile
      if (profileData.socialLinks) {
        setSocialLinks({
          facebook: profileData.socialLinks.facebook || '',
          instagram: profileData.socialLinks.instagram || '',
          linkedin: profileData.socialLinks.linkedin || '',
          twitter: profileData.socialLinks.twitter || '',
          website: profileData.socialLinks.website || ''
        })
      } else {
        setSocialLinks({
          facebook: '',
          instagram: '',
          linkedin: '',
          twitter: '',
          website: ''
        })
      }
    } else {
      setSocialLinks({
        facebook: '',
        instagram: '',
        linkedin: '',
        twitter: '',
        website: ''
      })
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

  const socialPlatforms = [
    { key: 'facebook', label: 'Facebook' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'twitter', label: 'Twitter' },
    { key: 'website', label: 'Website' }
  ]

  return (
    <div className="content doctor">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* DoctorSidebar will be rendered by DashboardLayout */}
          </div>
          
          <div className="col-lg-12 col-xl-12">
            <div className="dashboard-header">
              <h3>Social Media</h3>
            </div>
            <form onSubmit={handleSubmit} className="social-media-form">
              {socialPlatforms.map((platform) => (
                <div key={platform.key} className="social-media-links d-flex align-items-center mb-3">
                  <div className="input-block input-block-new select-social-link me-3" style={{ minWidth: '150px' }}>
                    <label className="form-label">{platform.label}</label>
                  </div>
                  <div className="input-block input-block-new flex-fill">
                    <input 
                      type="url" 
                      className="form-control" 
                      placeholder={`Add ${platform.label} URL`}
                      value={socialLinks[platform.key] || ''}
                      onChange={(e) => handleLinkChange(platform.key, e.target.value)}
                    />
                  </div>
                </div>
              ))}
              
              <div className="modal-btn text-end mt-4">
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialMedia
