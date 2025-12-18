import { useState } from 'react'
import { Link } from 'react-router-dom'

const DocumentsDownload = () => {
  const [filter, setFilter] = useState('all')

  const documents = [
    {
      id: 1,
      type: 'Appointment Confirmation',
      title: 'Appointment #Apt0001 - Dr. Ruby Perrin',
      date: '15 Nov 2024',
      appointmentDate: '20 Nov 2024',
      amount: '$150.00',
      status: 'Confirmed',
      fileUrl: '/documents/appointment-apt0001.pdf'
    },
    {
      id: 2,
      type: 'Payment Receipt',
      title: 'Payment Receipt - Appointment #Apt0001',
      date: '15 Nov 2024',
      appointmentDate: '20 Nov 2024',
      amount: '$150.00',
      status: 'Paid',
      fileUrl: '/documents/receipt-apt0001.pdf'
    },
    {
      id: 3,
      type: 'Appointment Confirmation',
      title: 'Appointment #Apt0002 - Dr. Darren Elder',
      date: '10 Nov 2024',
      appointmentDate: '18 Nov 2024',
      amount: '$200.00',
      status: 'Completed',
      fileUrl: '/documents/appointment-apt0002.pdf'
    },
    {
      id: 4,
      type: 'Payment Receipt',
      title: 'Payment Receipt - Appointment #Apt0002',
      date: '10 Nov 2024',
      appointmentDate: '18 Nov 2024',
      amount: '$200.00',
      status: 'Paid',
      fileUrl: '/documents/receipt-apt0002.pdf'
    },
    {
      id: 5,
      type: 'Medical Report',
      title: 'Lab Report - Blood Test',
      date: '05 Nov 2024',
      appointmentDate: '05 Nov 2024',
      amount: null,
      status: 'Available',
      fileUrl: '/documents/lab-report-001.pdf'
    },
    {
      id: 6,
      type: 'Invoice',
      title: 'Invoice #INV-0010',
      date: '01 Nov 2024',
      appointmentDate: '01 Nov 2024',
      amount: '$300.00',
      status: 'Paid',
      fileUrl: '/documents/invoice-0010.pdf'
    }
  ]

  const getStatusBadge = (status) => {
    const badges = {
      'Confirmed': 'badge-success',
      'Paid': 'badge-success',
      'Completed': 'badge-info',
      'Available': 'badge-primary',
      'Pending': 'badge-warning',
      'Cancelled': 'badge-danger'
    }
    return <span className={`badge ${badges[status] || 'badge-secondary'}`}>{status}</span>
  }

  const getTypeIcon = (type) => {
    const icons = {
      'Appointment Confirmation': 'fe-calendar',
      'Payment Receipt': 'fe-file-text',
      'Medical Report': 'fe-file',
      'Invoice': 'fe-file-text'
    }
    return icons[type] || 'fe-file'
  }

  const filteredDocuments = filter === 'all'
    ? documents
    : documents.filter(doc => doc.type.toLowerCase().includes(filter.toLowerCase()))

  const handleDownload = (doc) => {
    // TODO: Replace with actual download functionality
    // For now, simulate download
    const link = document.createElement('a')
    link.href = doc.fileUrl
    link.download = `${doc.title}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // In production, this would be:
    // window.open(doc.fileUrl, '_blank')
    // or fetch from API and create blob
    console.log('Downloading:', doc.title)
  }

  const documentTypes = ['all', 'Appointment Confirmation', 'Payment Receipt', 'Medical Report', 'Invoice']

  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* PatientSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-8 col-xl-9">
            <div className="dashboard-header">
              <h3>Documents & Receipts</h3>
              <p className="text-muted">Download your appointment confirmations, payment receipts, and medical reports</p>
            </div>

            {/* Filter Tabs */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="document-filter-tabs d-flex flex-wrap gap-2">
                  {documentTypes.map((type) => (
                    <button
                      key={type}
                      className={`btn btn-sm ${filter === type ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setFilter(type)}
                    >
                      {type === 'all' ? 'All Documents' : type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Documents List */}
            <div className="card">
              <div className="card-body">
                {filteredDocuments.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fe fe-folder" style={{ fontSize: '64px', color: '#dee2e6' }}></i>
                    <h5 className="mt-3">No documents found</h5>
                    <p className="text-muted">You don't have any documents yet.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover table-center mb-0">
                      <thead>
                        <tr>
                          <th>Document Type</th>
                          <th>Title</th>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDocuments.map((doc) => (
                          <tr key={doc.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <i className={`fe ${getTypeIcon(doc.type)} me-2`} style={{ fontSize: '20px', color: '#0d6efd' }}></i>
                                <span>{doc.type}</span>
                              </div>
                            </td>
                            <td>
                              <h6 className="mb-0">{doc.title}</h6>
                              {doc.appointmentDate && (
                                <small className="text-muted">Appointment: {doc.appointmentDate}</small>
                              )}
                            </td>
                            <td>{doc.date}</td>
                            <td>
                              {doc.amount ? (
                                <strong>{doc.amount}</strong>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>{getStatusBadge(doc.status)}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleDownload(doc)}
                              >
                                <i className="fe fe-download me-1"></i>
                                Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Info Alert */}
            <div className="alert alert-info mt-4">
              <div className="d-flex">
                <div className="flex-shrink-0">
                  <i className="fe fe-info"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="alert-heading">Document Information</h6>
                  <p className="mb-0 small">
                    All documents are available in PDF format. You can download and save them for your records. 
                    Appointment confirmations and payment receipts are automatically generated after booking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentsDownload

