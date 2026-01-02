import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import AuthLayout from '../../layouts/AuthLayout'
import { toast } from 'react-toastify'
import api from '../../api/axios'

// Backend expects: files[] (array of files, max 5)
// File types: image/jpeg, image/jpg, image/png, image/webp
// Max file size: 5MB per file
const schema = yup.object({
  files: yup
    .array()
    .of(yup.mixed())
    .min(1, 'Please upload at least one document')
    .max(5, 'Maximum 5 files allowed')
    .required('Please upload verification documents'),
})

const DoctorVerificationUpload = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [filePreviews, setFilePreviews] = useState([])

  const { handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema)
  })

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files)
    
    // Validate file count (max 5)
    if (files.length > 5) {
      toast.error('Maximum 5 files allowed')
      return
    }

    // Validate file types and sizes
    const validFiles = []
    const invalidFiles = []

    files.forEach(file => {
      // Check file type (only images: jpeg, jpg, png, webp)
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        invalidFiles.push(`${file.name}: Invalid file type. Only JPEG, PNG, and WebP images are allowed.`)
        return
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name}: File size must be less than 5MB`)
        return
      }

      validFiles.push(file)
    })

    if (invalidFiles.length > 0) {
      invalidFiles.forEach(msg => toast.error(msg))
    }

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles)
      setValue('files', validFiles)

      // Create previews
      const previews = []
      validFiles.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          previews.push(reader.result)
          if (previews.length === validFiles.length) {
            setFilePreviews(previews)
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newPreviews = filePreviews.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    setFilePreviews(newPreviews)
    setValue('files', newFiles)
  }

  const onSubmit = async (data) => {
    if (!data.files || data.files.length === 0) {
      toast.error('Please select at least one file to upload')
      return
    }

    setLoading(true)
    try {
      // Create FormData - backend expects field name 'files' as array
      const formData = new FormData()
      
      // Append all files with field name 'files'
      data.files.forEach((file) => {
        formData.append('files', file)
      })

      // Upload using API
      // axios will automatically set Content-Type with boundary for FormData
      // Backend returns: { success: true, message: 'Files uploaded', data: { urls: [...] } }
      // axios interceptor returns response.data, so we get: { success, message, data }
      const response = await api.post('/upload/doctor-docs', formData)

      // Check response
      if (response.success || response.data?.urls) {
        toast.success('Verification documents uploaded successfully! Your documents are under review.')
        navigate('/pending-approval')
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      // Error handling - axios interceptor already extracts response.data
      const errorMessage = error.response?.data?.message || error.message || error.data?.message || 'Failed to upload documents. Please try again.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="content login-page pt-0">
        <div className="container-fluid">
          <div className="account-content">
            <div className="d-flex align-items-center justify-content-center">
              <div className="login-right">
                <div className="inner-right-login">
                  <div className="login-header">
                    <div className="logo-icon">
                      <img src="/assets/img/logo.png" alt="mydoctor-logo" />
                    </div>
                    <div className="step-list">
                      <ul>
                        <li>
                          <a href="#" className="active-done">1</a>
                        </li>
                        <li>
                          <a href="#" className="active-done">2</a>
                        </li>
                        <li>
                          <a href="#" className="active-done">3</a>
                        </li>
                        <li>
                          <a href="#" className="active">4</a>
                        </li>
                      </ul>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                      <h3 className="my-4">Doctor Verification</h3>
                      <p className="text-muted mb-4">
                        Please upload your verification documents. You can upload up to 5 files.
                        <br />
                        <small>Accepted formats: JPEG, PNG, WebP (Max 5MB per file)</small>
                      </p>

                      {/* Required Documents List */}
                      <div className="verify-box mb-4">
                        <h5 className="mb-3">Required Documents:</h5>
                        <ul className="verify-list">
                          <li className="verify-item">Certificate of Registration with the Medical Council</li>
                          <li className="verify-item">Certificate of Good Standing (valid for 3 months from date of issue)</li>
                          <li className="verify-item">Curriculum Vitae</li>
                          <li className="verify-item">Specialist Registration Certificate (if applicable)</li>
                          <li className="verify-item">Digital signature: copy of the signature and registration number (if applicable)</li>
                        </ul>
                      </div>

                      {/* File Upload */}
                      <div className="mb-3">
                        <label className="mb-2">
                          Upload Verification Documents <span className="text-danger">*</span>
                          <small className="text-muted d-block">(Select multiple files - Max 5 files, 5MB each)</small>
                        </label>
                        <div className="call-option file-option">
                          <input
                            type="file"
                            id="files"
                            className="option-radio"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            multiple
                            onChange={handleFileChange}
                          />
                          <label htmlFor="files" className="call-lable verify-lable verify-file">
                            <img src="/assets/img/icons/file.png" alt="file-icon" />
                            {selectedFiles.length > 0 
                              ? `${selectedFiles.length} file(s) selected` 
                              : 'Click to select files (JPEG, PNG, WebP)'}
                          </label>
                        </div>
                        {errors.files && (
                          <div className="text-danger small mt-1">{errors.files.message}</div>
                        )}
                      </div>

                      {/* Selected Files Preview */}
                      {selectedFiles.length > 0 && (
                        <div className="mb-3">
                          <label className="mb-2">Selected Files:</label>
                          <div className="list-group">
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  {filePreviews[index] && (
                                    <img 
                                      src={filePreviews[index]} 
                                      alt="preview" 
                                      style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                                    />
                                  )}
                                  <div>
                                    <div className="fw-bold">{file.name}</div>
                                    <small className="text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</small>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => removeFile(index)}
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-5">
                        <button
                          type="submit"
                          className="btn btn-primary w-100 btn-lg login-btn"
                          disabled={loading}
                        >
                          {loading ? 'Uploading...' : 'Submit for Verification'}
                        </button>
                      </div>

                      <div className="text-center mt-3">
                        <Link to="/doctor-register-step3" className="text-muted">
                          ← Back to Previous Step
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="login-bottom-copyright">
                  <span>© {new Date().getFullYear()} myDoctor. All rights reserved.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default DoctorVerificationUpload

