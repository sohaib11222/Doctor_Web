import { Link } from 'react-router-dom'
import { useState } from 'react'

const MedicalRecords = () => {
  const [activeTab, setActiveTab] = useState('medical')

  const prescriptions = [
    { id: '#P1236', name: 'Prescription', date: '24 Mar 2024, 10:30 AM', doctor: 'Edalin Hendry', doctorImg: '/assets/img/doctors/doctor-thumb-02.jpg' },
    { id: '#P3656', name: 'Prescription', date: '27 Mar 2024, 11:15 AM', doctor: 'John Homes', doctorImg: '/assets/img/doctors/doctor-thumb-05.jpg' },
    { id: '#P1246', name: 'Prescription', date: '11 Apr 2024, 09:00 AM', doctor: 'Shanta Neill', doctorImg: '/assets/img/doctors/doctor-thumb-03.jpg' },
    { id: '#P6985', name: 'Prescription', date: '15 Apr 2024, 02:30 PM', doctor: 'Anthony Tran', doctorImg: '/assets/img/doctors/doctor-thumb-08.jpg' },
    { id: '#P3659', name: 'Prescription', date: '23 Apr 2024, 06:40 PM', doctor: 'Susan Lingo', doctorImg: '/assets/img/doctors/doctor-thumb-01.jpg' }
  ]

  const medicalRecords = [
    { id: '#MR1236', name: 'Electro cardiography', date: '24 Mar 2024', patient: 'Hendrita Clark', patientImg: '/assets/img/doctors-dashboard/profile-06.jpg', comments: 'Take Good Rest' },
    { id: '#MR3656', name: 'Complete Blood Count', date: '27 Mar 2024', patient: 'Laura Stewart', patientImg: '/assets/img/doctors-dashboard/profile-05.jpg', comments: 'Stable, no change' },
    { id: '#MR1246', name: 'Blood Glucose Test', date: '10 Apr 2024', patient: 'Mathew Charles', patientImg: '/assets/img/doctors-dashboard/profile-02.jpg', comments: 'All Clear' },
    { id: '#MR6985', name: 'Liver Function Tests', date: '19 Apr 2024', patient: 'Christopher Joseph', patientImg: '/assets/img/doctors-dashboard/profile-03.jpg', comments: 'Stable, no change' },
    { id: '#MR3659', name: 'Blood Cultures', date: '27 Apr 2024', patient: 'Elisa Salcedo', patientImg: '/assets/img/doctors-dashboard/profile-08.jpg', comments: 'Take Good Rest' }
  ]

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
                    <a href="#" className={`nav-link ${activeTab === 'medical' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('medical') }} data-bs-toggle="tab" data-bs-target="#medical">Medical Records</a>
                  </li>
                  <li>
                    <a href="#" className={`nav-link ${activeTab === 'prescription' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('prescription') }} data-bs-toggle="tab" data-bs-target="#prescription">Prescriptions</a>
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
                        <input type="text" className="form-control" placeholder="Search" />
                        <span className="search-icon"><i className="isax isax-search-normal"></i></span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="custom-table">
                  <div className="table-responsive">
                    <table className="table table-center mb-0">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Created Date</th>
                          <th>Prescriped By</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prescriptions.map((prescription, index) => (
                          <tr key={index}>
                            <td><a className="link-primary" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#view_prescription">{prescription.id}</a></td>
                            <td>
                              <a href="javascript:void(0);" className="lab-icon prescription">Prescription</a>
                            </td>
                            <td>{prescription.date}</td>
                            <td>
                              <h2 className="table-avatar">
                                <Link to="/doctor-profile" className="avatar avatar-sm me-2">
                                  <img className="avatar-img rounded-3" src={prescription.doctorImg} alt="User Image" />
                                </Link>
                                <Link to="/doctor-profile">{prescription.doctor}</Link>
                              </h2>
                            </td>
                            <td>
                              <div className="action-item">
                                <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#view_prescription">
                                  <i className="isax isax-link-2"></i>
                                </a>
                                <a href="javascript:void(0);">
                                  <i className="isax isax-import"></i>
                                </a>
                                <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal">
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
                <div className="pagination dashboard-pagination">
                  <ul>
                    <li><a href="#" className="page-link prev">Prev</a></li>
                    <li><a href="#" className="page-link">1</a></li>
                    <li><a href="#" className="page-link active">2</a></li>
                    <li><a href="#" className="page-link">3</a></li>
                    <li><a href="#" className="page-link">4</a></li>
                    <li><a href="#" className="page-link next">Next</a></li>
                  </ul>
                </div>
                {/* /Pagination */}
              </div>
              {/* /Prescription Tab */}

              {/* Medical Records Tab */}
              <div className={`tab-pane fade ${activeTab === 'medical' ? 'show active' : ''}`} id="medical">
                <div className="dashboard-header border-0 m-0">
                  <ul className="header-list-btns">
                    <li>
                      <div className="input-block dash-search-input">
                        <input type="text" className="form-control" placeholder="Search" />
                        <span className="search-icon"><i className="isax isax-search-normal"></i></span>
                      </div>
                    </li>
                  </ul>
                  <a href="#" className="btn btn-md btn-primary-gradient rounded-pill" data-bs-toggle="modal" data-bs-target="#add_medical_records">Add Medical Record</a>
                </div>

                <div className="custom-table">
                  <div className="table-responsive">
                    <table className="table table-center mb-0">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Date</th>
                          <th>Record For</th>
                          <th>Comments</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {medicalRecords.map((record, index) => (
                          <tr key={index}>
                            <td><a className="link-primary" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#view_report">{record.id}</a></td>
                            <td>
                              <a href="javascript:void(0);" className="lab-icon">{record.name}</a>
                            </td>
                            <td>{record.date}</td>
                            <td>
                              <h2 className="table-avatar">
                                <Link to="/patient-details" className="avatar avatar-sm me-2">
                                  <img className="avatar-img rounded-3" src={record.patientImg} alt="User Image" />
                                </Link>
                                <Link to="/patient-details">{record.patient}</Link>
                              </h2>
                            </td>
                            <td>{record.comments}</td>
                            <td>
                              <div className="action-item">
                                <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#view_report">
                                  <i className="isax isax-link-2"></i>
                                </a>
                                <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#edit_medical_records">
                                  <i className="isax isax-edit-2"></i>
                                </a>
                                <a href="javascript:void(0);">
                                  <i className="isax isax-import"></i>
                                </a>
                                <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal">
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
                <div className="pagination dashboard-pagination">
                  <ul>
                    <li><a href="#" className="page-link prev">Prev</a></li>
                    <li><a href="#" className="page-link">1</a></li>
                    <li><a href="#" className="page-link active">2</a></li>
                    <li><a href="#" className="page-link">3</a></li>
                    <li><a href="#" className="page-link">4</a></li>
                    <li><a href="#" className="page-link next">Next</a></li>
                  </ul>
                </div>
                {/* /Pagination */}
              </div>
              {/* /Medical Records Tab */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicalRecords

