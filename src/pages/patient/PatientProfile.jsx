import { Link } from 'react-router-dom'

const PatientProfile = () => {
  const appointments = [
    { id: '#Apt123', doctor: 'Edalin Hendry', doctorImg: '/assets/img/doctors/doctor-thumb-02.jpg', apptDate: '24 Mar 2024', bookingDate: '21 Mar 2024', amount: '$300', status: 'Upcoming' },
    { id: '#Apt124', doctor: 'John Homes', doctorImg: '/assets/img/doctors/doctor-thumb-05.jpg', apptDate: '17 Mar 2024', bookingDate: '14 Mar 2024', amount: '$450', status: 'Upcoming' },
    { id: '#Apt125', doctor: 'Shanta Neill', doctorImg: '/assets/img/doctors/doctor-thumb-03.jpg', apptDate: '11 Mar 2024', bookingDate: '07 Mar 2024', amount: '$250', status: 'Upcoming' },
    { id: '#Apt128', doctor: 'Joseph Boyd', doctorImg: '/assets/img/doctors/doctor-thumb-09.jpg', apptDate: '10 Feb 2024', bookingDate: '07 Feb 2024', amount: '$260', status: 'Cancelled' },
    { id: '#Apt129', doctor: 'Juliet Gabriel', doctorImg: '/assets/img/doctors/doctor-thumb-07.jpg', apptDate: '28 Jan 2024', bookingDate: '25 Jan 2024', amount: '$350', status: 'Completed' }
  ]

  const prescriptions = [
    { id: '#Apt123', doctor: 'Edalin Hendry', doctorImg: '/assets/img/doctors/doctor-thumb-02.jpg', type: 'Visit', date: '25 Jan 2024' },
    { id: '#Apt124', doctor: 'John Homes', doctorImg: '/assets/img/doctors/doctor-thumb-05.jpg', type: 'Visit', date: '28 Jan 2024' },
    { id: '#Apt125', doctor: 'Shanta Neill', doctorImg: '/assets/img/doctors/doctor-thumb-03.jpg', type: 'Visit', date: '11 Feb 2024' }
  ]

  const medicalRecords = [
    { name: 'Lab Report', date: '24 Mar 2024', description: 'Glucose Test V12' },
    { name: 'Lab Report', date: '27 Mar 2024', description: 'Complete Blood Count(CBC)' },
    { name: 'Lab Report', date: '10 Apr 2024', description: 'Echocardiogram' }
  ]

  const billing = [
    { date: '24 Mar 2024', amount: '$300', status: 'Paid' },
    { date: '28 Mar 2024', amount: '$350', status: 'Paid' },
    { date: '10 Apr 2024', amount: '$400', status: 'Paid' }
  ]

  const getStatusBadge = (status) => {
    const classes = {
      'Upcoming': 'badge-yellow',
      'Completed': 'badge-green',
      'Cancelled': 'badge-danger',
      'Paid': 'badge-green',
      'Unpaid': 'badge-danger'
    }
    return <span className={`badge ${classes[status] || 'badge-yellow'} status-badge`}>{status}</span>
  }

  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* DoctorSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            <div className="appointment-patient">
              <div className="dashboard-header">
                <h3><Link to="/my-patients"><i className="fa-solid fa-arrow-left"></i> Patient Details</Link></h3>
              </div>

              <div className="patient-wrap">
                <div className="patient-info">
                  <img src="/assets/img/doctors-dashboard/profile-01.jpg" alt="img" />
                  <div className="user-patient">
                    <h6>#P0016</h6>
                    <h5>Adrian Marshall</h5>
                    <ul>
                      <li>Age : 42</li>
                      <li>Male</li>
                      <li>AB+ve</li>
                    </ul>
                  </div>
                </div>
                <div className="patient-book">
                  <p><i className="fa-solid fa-calendar-days"></i>Last Booking</p>
                  <p>24 Mar 2024</p>
                </div>
              </div>

              {/* Appointment Tabs */}
              <div className="appointment-tabs user-tab">
                <ul className="nav">
                  <li className="nav-item">
                    <a className="nav-link active" href="#pat_appointments" data-bs-toggle="tab">Appointments</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#prescription" data-bs-toggle="tab">Prescription</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#medical" data-bs-toggle="tab">Medical Records</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#billing" data-bs-toggle="tab">Billing</a>
                  </li>
                </ul>
              </div>
              {/* /Appointment Tabs */}

              <div className="tab-content pt-0">
                {/* Appointment Tab */}
                <div id="pat_appointments" className="tab-pane fade show active">
                  <div className="search-header">
                    <div className="search-field">
                      <input type="text" className="form-control" placeholder="Search" />
                      <span className="search-icon"><i className="fa-solid fa-magnifying-glass"></i></span>
                    </div>
                  </div>

                  <div className="custom-table">
                    <div className="table-responsive">
                      <table className="table table-center mb-0">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Doctor</th>
                            <th>Appt Date</th>
                            <th>Booking Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.map((apt, index) => (
                            <tr key={index}>
                              <td><Link className="text-blue-600" to="/patient-upcoming-appointment">{apt.id}</Link></td>
                              <td>
                                <h2 className="table-avatar">
                                  <Link to="/doctor-profile" className="avatar avatar-sm me-2">
                                    <img className="avatar-img rounded-3" src={apt.doctorImg} alt="User Image" />
                                  </Link>
                                  <Link to="/doctor-profile">{apt.doctor}</Link>
                                </h2>
                              </td>
                              <td>{apt.apptDate}</td>
                              <td>{apt.bookingDate}</td>
                              <td>{apt.amount}</td>
                              <td>{getStatusBadge(apt.status)}</td>
                              <td>
                                <div className="action-item">
                                  <Link to="/patient-upcoming-appointment">
                                    <i className="fa-solid fa-link"></i>
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {/* /Appointment Tab */}

                {/* Prescription Tab */}
                <div className="tab-pane fade" id="prescription">
                  <div className="search-header">
                    <div className="search-field">
                      <input type="text" className="form-control" placeholder="Search" />
                      <span className="search-icon"><i className="fa-solid fa-magnifying-glass"></i></span>
                    </div>
                    <div>
                      <a href="#" className="btn btn-primary prime-btn" data-bs-toggle="modal" data-bs-target="#add_prescription">Add New Prescription</a>
                    </div>
                  </div>

                  <div className="custom-table">
                    <div className="table-responsive">
                      <table className="table table-center mb-0">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Prescriped By</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {prescriptions.map((pres, index) => (
                            <tr key={index}>
                              <td><a href="javascript:void(0);" className="text-blue-600" data-bs-toggle="modal" data-bs-target="#view_prescription">{pres.id}</a></td>
                              <td>
                                <h2 className="table-avatar">
                                  <Link to="/doctor-profile" className="avatar avatar-sm me-2">
                                    <img className="avatar-img rounded-3" src={pres.doctorImg} alt="User Image" />
                                  </Link>
                                  <Link to="/doctor-profile">{pres.doctor}</Link>
                                </h2>
                              </td>
                              <td>{pres.type}</td>
                              <td>{pres.date}</td>
                              <td>
                                <div className="action-item">
                                  <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#view_prescription">
                                    <i className="fa-solid fa-link"></i>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {/* /Prescription Tab */}

                {/* Medical Records Tab */}
                <div className="tab-pane fade" id="medical">
                  <div className="search-header">
                    <div className="search-field">
                      <input type="text" className="form-control" placeholder="Search" />
                      <span className="search-icon"><i className="fa-solid fa-magnifying-glass"></i></span>
                    </div>
                    <div>
                      <a href="#" data-bs-toggle="modal" data-bs-target="#add_medical_records" className="btn btn-primary prime-btn">Add Medical Record</a>
                    </div>
                  </div>

                  <div className="custom-table">
                    <div className="table-responsive">
                      <table className="table table-center mb-0">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {medicalRecords.map((record, index) => (
                            <tr key={index}>
                              <td>
                                <a href="javascript:void(0);" className="lab-icon">
                                  <span><i className="fa-solid fa-paperclip"></i></span>{record.name}
                                </a>
                              </td>
                              <td>{record.date}</td>
                              <td>{record.description}</td>
                              <td>
                                <div className="action-item">
                                  <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#edit_medical_records">
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </a>
                                  <a href="javascript:void(0);">
                                    <i className="fa-solid fa-download"></i>
                                  </a>
                                  <a href="javascript:void(0);">
                                    <i className="fa-solid fa-trash-can"></i>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {/* /Medical Records Tab */}

                {/* Billing Tab */}
                <div className="tab-pane" id="billing">
                  <div className="search-header">
                    <div className="search-field">
                      <input type="text" className="form-control" placeholder="Search" />
                      <span className="search-icon"><i className="fa-solid fa-magnifying-glass"></i></span>
                    </div>
                    <div>
                      <a href="#" className="btn btn-primary prime-btn" data-bs-toggle="modal" data-bs-target="#add_billing">Add New Billing</a>
                    </div>
                  </div>

                  <div className="custom-table">
                    <div className="table-responsive">
                      <table className="table table-center mb-0">
                        <thead>
                          <tr>
                            <th>Billing Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {billing.map((bill, index) => (
                            <tr key={index}>
                              <td>{bill.date}</td>
                              <td>{bill.amount}</td>
                              <td>{getStatusBadge(bill.status)}</td>
                              <td>
                                <div className="action-item">
                                  <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#view_bill">
                                    <i className="fa-solid fa-link"></i>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {/* /Billing Tab */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientProfile

