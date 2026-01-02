import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as medicalRecordsApi from '../../api/medicalRecords'
import api from '../../api/axios'

const MedicalRecords = () => {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('medical')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteRecordId, setDeleteRecordId] = useState(null)
  const [viewRecord, setViewRecord] = useState(null)
  
  // Form state for adding new record
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    recordType: 'OTHER',
    file: null,
    relatedAppointmentId: '',
    relatedDoctorId: ''
  })
  const [filePreview, setFilePreview] = useState(null)

  // Determine record type filter based on active tab
  const recordTypeFilter = useMemo(() => {
    return activeTab === 'prescription' ? 'PRESCRIPTION' : undefined
  }, [activeTab])

  // Fetch medical records
  const { data: recordsResponse, isLoading, refetch } = useQuery({
    queryKey: ['medicalRecords', recordTypeFilter, currentPage],
    queryFn: () => medicalRecordsApi.getMedicalRecords({
      recordType: recordTypeFilter,
      page: currentPage,
      limit: 20
    }),
    keepPreviousData: true
  })

  // Extract records and pagination
  const recordsData = recordsResponse?.data || recordsResponse
  const records = recordsData?.records || []
  const pagination = recordsData?.pagination || { page: 1, limit: 20, total: 0, pages: 1 }

  // Filter records by search query
  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records
    const query = searchQuery.toLowerCase()
    return records.filter(record => 
      record.title?.toLowerCase().includes(query) ||
      record.description?.toLowerCase().includes(query) ||
      record.fileName?.toLowerCase().includes(query)
    )
  }, [records, searchQuery])

  // Create medical record mutation
  const createRecordMutation = useMutation({
    mutationFn: async (data) => {
      // First upload the file
      if (data.file) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', data.file)
        const uploadResponse = await api.post('/upload/general', uploadFormData)
        
        const fileUrl = uploadResponse.data?.url || uploadResponse.url
        const apiBaseURL = import.meta.env.VITE_API_URL || 'http://157.180.108.156:4001/api'
        const baseURL = apiBaseURL.replace('/api', '')
        const fullFileUrl = fileUrl.startsWith('http') ? fileUrl : `${baseURL}${fileUrl}`
        
        // Then create the medical record
        return medicalRecordsApi.createMedicalRecord({
          title: data.title,
          description: data.description || null,
          recordType: data.recordType,
          fileUrl: fullFileUrl,
          fileName: data.file.name,
          fileSize: data.file.size,
          relatedAppointmentId: data.relatedAppointmentId || null,
          relatedDoctorId: data.relatedDoctorId || null
        })
      } else {
        throw new Error('File is required')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['medicalRecords'])
      setShowAddModal(false)
      setFormData({
        title: '',
        description: '',
        recordType: 'OTHER',
        file: null,
        relatedAppointmentId: '',
        relatedDoctorId: ''
      })
      setFilePreview(null)
      toast.success('Medical record created successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create medical record'
      toast.error(errorMessage)
    }
  })

  // Delete medical record mutation
  const deleteRecordMutation = useMutation({
    mutationFn: (recordId) => medicalRecordsApi.deleteMedicalRecord(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries(['medicalRecords'])
      setDeleteRecordId(null)
      toast.success('Medical record deleted successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete medical record'
      toast.error(errorMessage)
    }
  })

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
    setSearchQuery('')
  }

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (10 MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10 MB')
        return
      }
      setFormData(prev => ({ ...prev, file }))
      
      // Create preview
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFilePreview(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        setFilePreview(null)
      }
    }
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }
    if (!formData.file) {
      toast.error('File is required')
      return
    }
    createRecordMutation.mutate(formData)
  }

  // Handle delete
  const handleDelete = (recordId) => {
    if (window.confirm('Are you sure you want to delete this medical record?')) {
      deleteRecordMutation.mutate(recordId)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get record type badge class
  const getRecordTypeBadge = (type) => {
    const badges = {
      PRESCRIPTION: 'badge-primary',
      LAB_REPORT: 'badge-info',
      TEST_RESULT: 'badge-success',
      IMAGE: 'badge-warning',
      PDF: 'badge-danger',
      OTHER: 'badge-secondary'
    }
    return badges[type] || 'badge-secondary'
  }

  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* PatientSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            <div className="dashboard-header flex-wrap">
              <h3>Records</h3>
              <div className="appointment-tabs">
                <ul className="nav">
                  <li>
                    <a 
                      href="#" 
                      className={`nav-link ${activeTab === 'medical' ? 'active' : ''}`} 
                      onClick={(e) => { e.preventDefault(); handleTabChange('medical') }}
                    >
                      Medical Records
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className={`nav-link ${activeTab === 'prescription' ? 'active' : ''}`} 
                      onClick={(e) => { e.preventDefault(); handleTabChange('prescription') }}
                    >
                      Prescriptions
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="tab-content pt-0">
              {/* Prescription Tab */}
              <div className={`tab-pane fade ${activeTab === 'prescription' ? 'show active' : ''}`} id="prescription">
                <div className="dashboard-header border-0 m-0">
                  <ul className="header-list-btns">
                    <li>
                      <div className="input-block dash-search-input">
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Search prescriptions..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className="search-icon"><i className="isax isax-search-normal"></i></span>
                      </div>
                    </li>
                  </ul>
                </div>

                {isLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : filteredRecords.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted">No prescriptions found</p>
                  </div>
                ) : (
                  <>
                    <div className="custom-table">
                      <div className="table-responsive">
                        <table className="table table-center mb-0">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Title</th>
                              <th>Created Date</th>
                              <th>Prescribed By</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredRecords.map((record) => (
                              <tr key={record._id}>
                                <td>
                                  <a 
                                    className="link-primary" 
                                    href="javascript:void(0);" 
                                    onClick={() => setViewRecord(record)}
                                  >
                                    #{record._id.slice(-6).toUpperCase()}
                                  </a>
                                </td>
                                <td>
                                  <a href="javascript:void(0);" className="lab-icon prescription">
                                    {record.title}
                                  </a>
                                </td>
                                <td>{formatDate(record.uploadedDate || record.createdAt)}</td>
                                <td>
                                  {record.relatedDoctorId ? (
                                    <h2 className="table-avatar">
                                      <span className="avatar avatar-sm me-2">
                                        {typeof record.relatedDoctorId === 'object' && record.relatedDoctorId.profileImage ? (
                                          <img className="avatar-img rounded-3" src={record.relatedDoctorId.profileImage} alt="Doctor" />
                                        ) : (
                                          <span className="avatar-title rounded-3 bg-primary text-white">
                                            {typeof record.relatedDoctorId === 'object' && record.relatedDoctorId.fullName 
                                              ? record.relatedDoctorId.fullName.charAt(0).toUpperCase()
                                              : 'D'}
                                          </span>
                                        )}
                                      </span>
                                      <span>
                                        {typeof record.relatedDoctorId === 'object' 
                                          ? record.relatedDoctorId.fullName || 'Unknown Doctor'
                                          : 'Unknown Doctor'}
                                      </span>
                                    </h2>
                                  ) : (
                                    <span className="text-muted">N/A</span>
                                  )}
                                </td>
                                <td>
                                  <div className="action-item">
                                    <a 
                                      href="javascript:void(0);" 
                                      onClick={() => setViewRecord(record)}
                                      title="View"
                                    >
                                      <i className="isax isax-link-2"></i>
                                    </a>
                                    <a 
                                      href={record.fileUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      title="Download"
                                    >
                                      <i className="isax isax-import"></i>
                                    </a>
                                    <a 
                                      href="javascript:void(0);" 
                                      onClick={() => handleDelete(record._id)}
                                      title="Delete"
                                    >
                                      <i className="isax isax-trash"></i>
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                      <div className="pagination dashboard-pagination">
                        <ul>
                          <li>
                            <a 
                              href="#" 
                              className={`page-link prev ${currentPage === 1 ? 'disabled' : ''}`}
                              onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1) }}
                            >
                              Prev
                            </a>
                          </li>
                          {[...Array(pagination.pages)].map((_, i) => {
                            const page = i + 1
                            if (page === 1 || page === pagination.pages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                              return (
                                <li key={page}>
                                  <a 
                                    href="#" 
                                    className={`page-link ${currentPage === page ? 'active' : ''}`}
                                    onClick={(e) => { e.preventDefault(); setCurrentPage(page) }}
                                  >
                                    {page}
                                  </a>
                                </li>
                              )
                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                              return <li key={page}><span className="page-link">...</span></li>
                            }
                            return null
                          })}
                          <li>
                            <a 
                              href="#" 
                              className={`page-link next ${currentPage === pagination.pages ? 'disabled' : ''}`}
                              onClick={(e) => { e.preventDefault(); if (currentPage < pagination.pages) setCurrentPage(currentPage + 1) }}
                            >
                              Next
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
              {/* /Prescription Tab */}

              {/* Medical Records Tab */}
              <div className={`tab-pane fade ${activeTab === 'medical' ? 'show active' : ''}`} id="medical">
                <div className="dashboard-header border-0 m-0">
                  <ul className="header-list-btns">
                    <li>
                      <div className="input-block dash-search-input">
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Search medical records..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className="search-icon"><i className="isax isax-search-normal"></i></span>
                      </div>
                    </li>
                  </ul>
                  <button 
                    className="btn btn-md btn-primary-gradient rounded-pill" 
                    onClick={() => setShowAddModal(true)}
                  >
                    Add Medical Record
                  </button>
                </div>

                {isLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : filteredRecords.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted">No medical records found</p>
                  </div>
                ) : (
                  <>
                    <div className="custom-table">
                      <div className="table-responsive">
                        <table className="table table-center mb-0">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Title</th>
                              <th>Type</th>
                              <th>Date</th>
                              <th>Related To</th>
                              <th>Description</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredRecords.map((record) => (
                              <tr key={record._id}>
                                <td>
                                  <a 
                                    className="link-primary" 
                                    href="javascript:void(0);" 
                                    onClick={() => setViewRecord(record)}
                                  >
                                    #{record._id.slice(-6).toUpperCase()}
                                  </a>
                                </td>
                                <td>
                                  <a href="javascript:void(0);" className="lab-icon">
                                    {record.title}
                                  </a>
                                </td>
                                <td>
                                  <span className={`badge ${getRecordTypeBadge(record.recordType)}`}>
                                    {record.recordType?.replace('_', ' ') || 'OTHER'}
                                  </span>
                                </td>
                                <td>{formatDate(record.uploadedDate || record.createdAt)}</td>
                                <td>
                                  {record.relatedDoctorId ? (
                                    <span>
                                      {typeof record.relatedDoctorId === 'object' 
                                        ? record.relatedDoctorId.fullName || 'Unknown Doctor'
                                        : 'Unknown Doctor'}
                                    </span>
                                  ) : (
                                    <span className="text-muted">Self</span>
                                  )}
                                </td>
                                <td>
                                  <span className="text-muted" title={record.description}>
                                    {record.description ? (record.description.length > 50 ? record.description.substring(0, 50) + '...' : record.description) : 'N/A'}
                                  </span>
                                </td>
                                <td>
                                  <div className="action-item">
                                    <a 
                                      href="javascript:void(0);" 
                                      onClick={() => setViewRecord(record)}
                                      title="View"
                                    >
                                      <i className="isax isax-link-2"></i>
                                    </a>
                                    <a 
                                      href={record.fileUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      title="Download"
                                    >
                                      <i className="isax isax-import"></i>
                                    </a>
                                    <a 
                                      href="javascript:void(0);" 
                                      onClick={() => handleDelete(record._id)}
                                      title="Delete"
                                    >
                                      <i className="isax isax-trash"></i>
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                      <div className="pagination dashboard-pagination">
                        <ul>
                          <li>
                            <a 
                              href="#" 
                              className={`page-link prev ${currentPage === 1 ? 'disabled' : ''}`}
                              onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1) }}
                            >
                              Prev
                            </a>
                          </li>
                          {[...Array(pagination.pages)].map((_, i) => {
                            const page = i + 1
                            if (page === 1 || page === pagination.pages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                              return (
                                <li key={page}>
                                  <a 
                                    href="#" 
                                    className={`page-link ${currentPage === page ? 'active' : ''}`}
                                    onClick={(e) => { e.preventDefault(); setCurrentPage(page) }}
                                  >
                                    {page}
                                  </a>
                                </li>
                              )
                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                              return <li key={page}><span className="page-link">...</span></li>
                            }
                            return null
                          })}
                          <li>
                            <a 
                              href="#" 
                              className={`page-link next ${currentPage === pagination.pages ? 'disabled' : ''}`}
                              onClick={(e) => { e.preventDefault(); if (currentPage < pagination.pages) setCurrentPage(currentPage + 1) }}
                            >
                              Next
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
              {/* /Medical Records Tab */}
            </div>
          </div>
        </div>
      </div>

      {/* Add Medical Record Modal */}
      {showAddModal && (
        <>
          <div 
            className="modal-backdrop fade show" 
            onClick={() => setShowAddModal(false)}
            style={{ zIndex: 1040 }}
          ></div>
          <div 
            className="modal fade show" 
            style={{ display: 'block', zIndex: 1050 }} 
            id="add_medical_records"
            onClick={(e) => {
              // Close modal if clicking on backdrop (not on modal content)
              if (e.target.id === 'add_medical_records') {
                setShowAddModal(false)
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Medical Record</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Title <span className="text-danger">*</span></label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea 
                        className="form-control" 
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Record Type <span className="text-danger">*</span></label>
                      <select 
                        className="form-select" 
                        value={formData.recordType}
                        onChange={(e) => setFormData(prev => ({ ...prev, recordType: e.target.value }))}
                        required
                      >
                        <option value="PRESCRIPTION">Prescription</option>
                        <option value="LAB_REPORT">Lab Report</option>
                        <option value="TEST_RESULT">Test Result</option>
                        <option value="IMAGE">Image</option>
                        <option value="PDF">PDF</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">File <span className="text-danger">*</span></label>
                      <input 
                        type="file" 
                        className="form-control" 
                        onChange={handleFileChange}
                        accept="image/*,.pdf,.doc,.docx"
                        required
                      />
                    </div>
                    {filePreview && (
                      <div className="mb-3">
                        <img src={filePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '4px' }} />
                      </div>
                    )}
                    {formData.file && !filePreview && (
                      <div className="mb-3">
                        <span className="badge badge-info">{formData.file.name}</span>
                        <small className="text-muted ms-2">({(formData.file.size / 1024 / 1024).toFixed(2)} MB)</small>
                      </div>
                    )}
                    <small className="text-muted">Max file size: 10 MB</small>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={createRecordMutation.isLoading}
                    >
                      {createRecordMutation.isLoading ? 'Uploading...' : 'Add Record'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* View Record Modal */}
      {viewRecord && (
        <>
          <div 
            className="modal-backdrop fade show" 
            onClick={() => setViewRecord(null)}
            style={{ zIndex: 1040 }}
          ></div>
          <div 
            className="modal fade show" 
            style={{ display: 'block', zIndex: 1050 }} 
            id="view_report"
            onClick={(e) => {
              // Close modal if clicking on backdrop (not on modal content)
              if (e.target.id === 'view_report') {
                setViewRecord(null)
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{viewRecord.title}</h5>
                  <button type="button" className="btn-close" onClick={() => setViewRecord(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <strong>Type:</strong> 
                    <span className={`badge ${getRecordTypeBadge(viewRecord.recordType)} ms-2`}>
                      {viewRecord.recordType?.replace('_', ' ') || 'OTHER'}
                    </span>
                  </div>
                  {viewRecord.description && (
                    <div className="mb-3">
                      <strong>Description:</strong>
                      <p>{viewRecord.description}</p>
                    </div>
                  )}
                  <div className="mb-3">
                    <strong>Uploaded Date:</strong> {formatDate(viewRecord.uploadedDate || viewRecord.createdAt)}
                  </div>
                  {viewRecord.fileName && (
                    <div className="mb-3">
                      <strong>File Name:</strong> {viewRecord.fileName}
                    </div>
                  )}
                  {viewRecord.fileUrl && (
                    <div className="mb-3">
                      <a 
                        href={viewRecord.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                      >
                        View/Download File
                      </a>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setViewRecord(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MedicalRecords

