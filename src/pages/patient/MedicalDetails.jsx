const MedicalDetails = () => {
  const vitals = [
    { icon: 'fa-syringe', label: 'Blood Pressure', value: '100 mg/dl', color: 'icon-red' },
    { icon: 'fa-heart', label: 'Heart Rate', value: '140 Bpm', color: 'icon-orange' },
    { icon: 'fa-notes-medical', label: 'Glucose Level', value: '70 - 90', color: 'icon-dark-blue' },
    { icon: 'fa-temperature-high', label: 'Body Temprature', value: '37.5 C', color: 'icon-amber' },
    { icon: 'fa-user-pen', label: 'BMI', value: '20.1 kg/m2', color: 'icon-purple' },
    { icon: 'fa-highlighter', label: 'SPo2', value: '96%', color: 'icon-blue' }
  ]

  const vitalsHistory = [
    { id: '#MD1236', patient: 'Hendrita Kearns', patientImg: '/assets/img/doctors-dashboard/profile-06.jpg', bmi: '23.5', heartRate: '89', fbcStatus: '140', weight: '74Kg', date: '22 Mar 2024' }
  ]

  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* PatientSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            <div className="dashboard-header">
              <h3>Vitals</h3>
            </div>
            <div className="dashboard-card w-100 medical-details-item">
              <div className="dashboard-card-head medical-detail-head">
                <div className="header-title">
                  <h6>Latest Updated Vitals</h6>
                </div>
                <div className="latest-update">
                  <p><i className="isax isax-calendar-tick5 me-2"></i>Last update on : 24Mar 2023</p>
                </div>
              </div>
              <div className="dashboard-card-body">
                <div className="row row-gap-3">
                  {vitals.map((vital, index) => (
                    <div key={index} className="col-xl-2 col-lg-4 col-md-6">
                      <div className={`health-records ${vital.color} mb-0`}>
                        <span><i className={`fa-solid ${vital.icon}`}></i>{vital.label}</span>
                        <h3>{vital.value}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="dashboard-header border-0 m-0">
              <ul className="header-list-btns">
                <li>
                  <div className="input-block dash-search-input">
                    <input type="text" className="form-control" placeholder="Search" />
                    <span className="search-icon"><i className="isax isax-search-normal"></i></span>
                  </div>
                </li>
              </ul>
              <a href="#add-med-record" className="btn btn-md btn-primary-gradient rounded-pill" data-bs-toggle="modal">Add Vitals</a>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="custom-table">
                  <div className="table-responsive">
                    <table className="table table-center mb-0">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Patient Name</th>
                          <th>BMI</th>
                          <th>Heart Rate</th>
                          <th>FBC Status</th>
                          <th>Weight</th>
                          <th>Added on</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vitalsHistory.map((item, index) => (
                          <tr key={index}>
                            <td><a className="link-primary" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#med-detail">{item.id}</a></td>
                            <td>
                              <h2 className="table-avatar">
                                <a href="/patient-profile" className="avatar avatar-sm me-2">
                                  <img className="avatar-img rounded-3" src={item.patientImg} alt="User Image" />
                                </a>
                                <a href="/doctor-profile">{item.patient}</a>
                              </h2>
                            </td>
                            <td>{item.bmi}</td>
                            <td>{item.heartRate}</td>
                            <td>{item.fbcStatus}</td>
                            <td>{item.weight}</td>
                            <td>{item.date}</td>
                            <td>
                              <div className="action-item">
                                <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#med-detail">
                                  <i className="isax isax-link-2"></i>
                                </a>
                                <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#edit-med-record">
                                  <i className="isax isax-edit-2"></i>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicalDetails

