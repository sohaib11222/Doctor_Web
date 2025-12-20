import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import AuthLayout from '../../layouts/AuthLayout'
import { toast } from 'react-toastify'

const schema = yup.object({
  medicalCouncilNumber: yup.string().required('Medical council registration number is required'),
  specialization: yup.string().required('Area of specialization is required'),
  registrationCertificate: yup.mixed().required('Registration certificate is required'),
  goodStandingCertificate: yup.mixed().required('Certificate of good standing is required'),
  cv: yup.mixed().required('Curriculum Vitae is required'),
  specialistRegistration: yup.mixed().notRequired(),
  digitalSignature: yup.mixed().notRequired(),
})

const DoctorVerificationUpload = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [filePreviews, setFilePreviews] = useState({})

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: yupResolver(schema)
  })

  const handleFileChange = (fieldName, event) => {
    const file = event.target.files[0]
    if (file) {
      setValue(fieldName, file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreviews(prev => ({
          ...prev,
          [fieldName]: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Create FormData for file uploads
      const formData = new FormData()
      formData.append('medical_council_number', data.medicalCouncilNumber)
      formData.append('specialization', data.specialization)
      formData.append('registration_certificate', data.registrationCertificate)
      formData.append('good_standing_certificate', data.goodStandingCertificate)
      formData.append('cv', data.cv)
      if (data.specialistRegistration) {
        formData.append('specialist_registration', data.specialistRegistration)
      }
      if (data.digitalSignature) {
        formData.append('digital_signature', data.digitalSignature)
      }

      // TODO: Replace with actual API call
      // const response = await axios.post('/api/doctors/verification', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      toast.success('Verification documents uploaded successfully!')
      navigate('/pending-approval')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload documents. Please try again.')
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
                      <p className="text-muted mb-4">Please provide the details below and attach copies for your verification documents.</p>

                      {/* Required Documents List */}
                      <div className="verify-box mb-4">
                        <ul className="verify-list">
                          <li className="verify-item">Certificate of Registration with the Medical Council</li>
                          <li className="verify-item">Certificate of Good Standing (valid for 3 months from date of issue)</li>
                          <li className="verify-item">Curriculum Vitae</li>
                          <li className="verify-item">Specialist Registration Certificate (if applicable)</li>
                          <li className="verify-item">Digital signature: copy of the signature and registration number (if applicable)</li>
                        </ul>
                      </div>

                      {/* Medical Council Registration Number */}
                      <div className="mb-3">
                        <label className="mb-2">
                          Medical council registration number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.medicalCouncilNumber ? 'is-invalid' : ''}`}
                          placeholder="Enter your medical council registration number"
                          {...register('medicalCouncilNumber')}
                        />
                        {errors.medicalCouncilNumber && (
                          <div className="invalid-feedback">{errors.medicalCouncilNumber.message}</div>
                        )}
                      </div>

                      {/* Area of Specialization */}
                      <div className="mb-3">
                        <label className="mb-2">
                          Area of Specialisation <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select form-control ${errors.specialization ? 'is-invalid' : ''}`}
                          {...register('specialization')}
                        >
                          <option value="">Select Area of Specialisation</option>
                          <option value="surgery">Surgery</option>
                          <option value="cardiology">Cardiology</option>
                          <option value="orthopedics">Orthopedics</option>
                          <option value="pediatrics">Pediatrics</option>
                          <option value="dermatology">Dermatology</option>
                          <option value="neurology">Neurology</option>
                          <option value="oncology">Oncology</option>
                          <option value="psychiatry">Psychiatry</option>
                          <option value="general">General Practice</option>
                        </select>
                        {errors.specialization && (
                          <div className="invalid-feedback">{errors.specialization.message}</div>
                        )}
                      </div>

                      {/* Registration Certificate */}
                      <div className="mb-3">
                        <label className="mb-2">
                          Certificate of Registration <span className="text-danger">*</span>
                        </label>
                        <div className="call-option file-option">
                          <input
                            type="file"
                            id="registrationCertificate"
                            className="option-radio"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange('registrationCertificate', e)}
                          />
                          <label htmlFor="registrationCertificate" className="call-lable verify-lable verify-file">
                            <img src="/assets/img/icons/file.png" alt="file-icon" />
                            {filePreviews.registrationCertificate ? 'File Selected' : 'Upload Registration Certificate'}
                          </label>
                        </div>
                        {errors.registrationCertificate && (
                          <div className="text-danger small mt-1">{errors.registrationCertificate.message}</div>
                        )}
                      </div>

                      {/* Good Standing Certificate */}
                      <div className="mb-3">
                        <label className="mb-2">
                          Certificate of Good Standing <span className="text-danger">*</span>
                        </label>
                        <div className="call-option file-option">
                          <input
                            type="file"
                            id="goodStandingCertificate"
                            className="option-radio"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange('goodStandingCertificate', e)}
                          />
                          <label htmlFor="goodStandingCertificate" className="call-lable verify-lable verify-file">
                            <img src="/assets/img/icons/file.png" alt="file-icon" />
                            {filePreviews.goodStandingCertificate ? 'File Selected' : 'Upload Good Standing Certificate'}
                          </label>
                        </div>
                        {errors.goodStandingCertificate && (
                          <div className="text-danger small mt-1">{errors.goodStandingCertificate.message}</div>
                        )}
                      </div>

                      {/* Curriculum Vitae */}
                      <div className="mb-3">
                        <label className="mb-2">
                          Curriculum Vitae (CV) <span className="text-danger">*</span>
                        </label>
                        <div className="call-option file-option">
                          <input
                            type="file"
                            id="cv"
                            className="option-radio"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileChange('cv', e)}
                          />
                          <label htmlFor="cv" className="call-lable verify-lable verify-file">
                            <img src="/assets/img/icons/file.png" alt="file-icon" />
                            {filePreviews.cv ? 'File Selected' : 'Upload Curriculum Vitae'}
                          </label>
                        </div>
                        {errors.cv && (
                          <div className="text-danger small mt-1">{errors.cv.message}</div>
                        )}
                      </div>

                      {/* Specialist Registration Certificate (Optional) */}
                      <div className="mb-3">
                        <label className="mb-2">Specialist Registration Certificate (Optional)</label>
                        <div className="call-option file-option">
                          <input
                            type="file"
                            id="specialistRegistration"
                            className="option-radio"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange('specialistRegistration', e)}
                          />
                          <label htmlFor="specialistRegistration" className="call-lable verify-lable verify-file">
                            <img src="/assets/img/icons/file.png" alt="file-icon" />
                            {filePreviews.specialistRegistration ? 'File Selected' : 'Upload Specialist Registration'}
                          </label>
                        </div>
                      </div>

                      {/* Digital Signature (Optional) */}
                      <div className="mb-3">
                        <label className="mb-2">Digital Signature (Optional)</label>
                        <div className="call-option file-option">
                          <input
                            type="file"
                            id="digitalSignature"
                            className="option-radio"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange('digitalSignature', e)}
                          />
                          <label htmlFor="digitalSignature" className="call-lable verify-lable verify-file">
                            <img src="/assets/img/icons/file.png" alt="file-icon" />
                            {filePreviews.digitalSignature ? 'File Selected' : 'Upload Digital Signature'}
                          </label>
                        </div>
                      </div>

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

