import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as authApi from '../../api/auth'

const DoctorChangePassword = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  })

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: ({ oldPassword, newPassword }) => authApi.changePassword(oldPassword, newPassword),
    onSuccess: (response) => {
      toast.success(response.data?.message || response.message || 'Password changed successfully!')
      // Reset form
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      // Optionally navigate back or show success message
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to change password'
      toast.error(errorMessage)
    }
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.oldPassword) {
      toast.error('Please enter your current password')
      return
    }

    if (!formData.newPassword) {
      toast.error('Please enter a new password')
      return
    }

    if (formData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New password and confirm password do not match')
      return
    }

    if (formData.oldPassword === formData.newPassword) {
      toast.error('New password must be different from current password')
      return
    }

    // Submit
    changePasswordMutation.mutate({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword
    })
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* DoctorSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-8 col-xl-9">
            <div className="dashboard-header">
              <h3>Change Password</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card pass-card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-block input-block-new">
                        <label className="form-label">Old Password <span className="text-danger">*</span></label>
                        <div className="pass-group">
                          <input
                            type={showPassword.old ? 'text' : 'password'}
                            className="form-control"
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleInputChange}
                            required
                          />
                          <span
                            className={`feather ${showPassword.old ? 'feather-eye' : 'feather-eye-off'} toggle-password`}
                            onClick={() => togglePasswordVisibility('old')}
                            style={{ cursor: 'pointer' }}
                          ></span>
                        </div>
                      </div>
                      <div className="input-block input-block-new">
                        <label className="form-label">New Password <span className="text-danger">*</span></label>
                        <div className="pass-group">
                          <input
                            type={showPassword.new ? 'text' : 'password'}
                            className="form-control pass-input"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            required
                            minLength={6}
                          />
                          <span
                            className={`feather ${showPassword.new ? 'feather-eye' : 'feather-eye-off'} toggle-password`}
                            onClick={() => togglePasswordVisibility('new')}
                            style={{ cursor: 'pointer' }}
                          ></span>
                        </div>
                        <small className="form-text text-muted">Password must be at least 6 characters</small>
                      </div>
                      <div className="input-block input-block-new mb-0">
                        <label className="form-label">Confirm Password <span className="text-danger">*</span></label>
                        <div className="pass-group">
                          <input
                            type={showPassword.confirm ? 'text' : 'password'}
                            className="form-control pass-input-sub"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            minLength={6}
                          />
                          <span
                            className={`feather ${showPassword.confirm ? 'feather-eye' : 'feather-eye-off'} toggle-password-sub`}
                            onClick={() => togglePasswordVisibility('confirm')}
                            style={{ cursor: 'pointer' }}
                          ></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-set-button">
                <button
                  className="btn btn-light"
                  type="button"
                  onClick={handleCancel}
                  disabled={changePasswordMutation.isLoading}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={changePasswordMutation.isLoading}
                >
                  {changePasswordMutation.isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Changing...
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

export default DoctorChangePassword
