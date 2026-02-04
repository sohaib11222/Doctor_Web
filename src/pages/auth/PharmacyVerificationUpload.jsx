import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import { toast } from 'react-toastify'
import api from '../../api/axios'

const inferDocTypeLabel = (docType) => {
  if (docType === 'PHARMACY_LICENSE') return 'Pharmacy License'
  if (docType === 'PHARMACY_DEGREE') return 'Pharmacy Degree'
  return 'Document'
}

const PharmacyVerificationUpload = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [licenseFile, setLicenseFile] = useState(null)
  const [degreeFile, setDegreeFile] = useState(null)

  const canSubmit = useMemo(() => Boolean(licenseFile && degreeFile), [licenseFile, degreeFile])

  const handleFileChange = (kind, event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (kind === 'license') setLicenseFile(file)
    if (kind === 'degree') setDegreeFile(file)
  }

  const uploadSingle = async (file, docType) => {
    const formData = new FormData()

    // Backend multer middleware expects field name 'files' for multi-file uploads
    formData.append('files', file)

    // Backend stores req.body.docType as documentUploads.type
    formData.append('docType', docType)

    return api.post('/upload/pharmacy-docs', formData)
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!canSubmit) {
      toast.error('Please upload both license and degree documents')
      return
    }

    setLoading(true)
    try {
      await uploadSingle(licenseFile, 'PHARMACY_LICENSE')
      await uploadSingle(degreeFile, 'PHARMACY_DEGREE')

      localStorage.setItem('pharmacy_documents_submitted', 'true')

      toast.success('Documents uploaded successfully! Your account is under review.')
      navigate('/pending-approval')
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || error?.data?.message || 'Failed to upload documents'
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
                      <img
                        src="/assets/img/doctor_final.png"
                        alt="mydoctor-logo"
                        style={{ maxHeight: '60px', height: 'auto', width: 'auto' }}
                      />
                    </div>

                    <form onSubmit={onSubmit} encType="multipart/form-data">
                      <h3 className="my-4">Pharmacy Verification</h3>
                      <p className="text-muted mb-4">
                        Upload the required documents to get your pharmacy account approved.
                      </p>

                      <div className="verify-box mb-4">
                        <h5 className="mb-3">Required Documents:</h5>
                        <ul className="verify-list">
                          <li className="verify-item">Pharmacy License</li>
                          <li className="verify-item">Pharmacy Degree</li>
                        </ul>
                      </div>

                      <div className="mb-3">
                        <label className="mb-2">
                          {inferDocTypeLabel('PHARMACY_LICENSE')} <span className="text-danger">*</span>
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*,application/pdf"
                          onChange={(e) => handleFileChange('license', e)}
                        />
                        {licenseFile && (
                          <small className="text-muted d-block mt-1">Selected: {licenseFile.name}</small>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="mb-2">
                          {inferDocTypeLabel('PHARMACY_DEGREE')} <span className="text-danger">*</span>
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*,application/pdf"
                          onChange={(e) => handleFileChange('degree', e)}
                        />
                        {degreeFile && (
                          <small className="text-muted d-block mt-1">Selected: {degreeFile.name}</small>
                        )}
                      </div>

                      <div className="mt-4">
                        <button
                          type="submit"
                          className="btn btn-primary w-100 btn-lg login-btn"
                          disabled={loading || !canSubmit}
                        >
                          {loading ? 'Uploading...' : 'Submit for Verification'}
                        </button>
                      </div>

                      <div className="text-center mt-3">
                        <Link to="/pending-approval" className="text-muted">
                          Go to Pending Approval
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="login-bottom-copyright">
                  <span>© {new Date().getFullYear()} Mydoctor+. All rights reserved.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default PharmacyVerificationUpload
