import { Link } from 'react-router-dom'

const PatientReports = () => {
  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            <div className="profile-sidebar patient-sidebar profile-sidebar-new">
              <div className="widget-profile pro-widget-content">
                <div className="profile-info-widget">
                  <Link to="/profile-settings" className="booking-doc-img">
                    <img src="/assets/img/doctors-dashboard/profile-06.jpg" alt="User Image" />
                  </Link>
                  <div className="profile-det-info">
                    <h3>
                      <Link to="/profile-settings">Hendrita Hayes</Link>
                    </h3>
                    <div className="patient-details">
                      <h5 className="mb-0">Patient ID : PT254654</h5>
                    </div>
                    <span>Female <i className="fa-solid fa-circle"></i> 32 years 03 Months</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8 col-xl-9">
            <div className="dashboard-header">
              <h3>Medical Reports</h3>
            </div>
            <div className="dashboard-header border-0 m-0">
              <ul className="header-list-btns">
                <li>
                  <div className="input-block dash-search-input">
                    <input type="text" className="form-control" placeholder="Search reports" />
                    <span className="search-icon"><i className="isax isax-search-normal"></i></span>
                  </div>
                </li>
              </ul>
              <a href="javascript:void(0);" className="btn btn-md btn-primary-gradient rounded-pill" data-bs-toggle="modal" data-bs-target="#upload_report">Upload Report</a>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover table-center mb-0">
                    <thead>
                      <tr>
                        <th>Report Name</th>
                        <th>Date</th>
                        <th>Doctor</th>
                        <th>Type</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <a href="javascript:void(0);">Blood Test Report</a>
                        </td>
                        <td>15 Jan 2024</td>
                        <td>Dr. John Doe</td>
                        <td><span className="badge badge-success-bg">Lab Report</span></td>
                        <td>
                          <div className="d-flex align-items-center">
                            <a href="javascript:void(0);" className="btn btn-sm bg-info-light me-2">
                              <i className="isax isax-eye"></i> View
                            </a>
                            <a href="javascript:void(0);" className="btn btn-sm bg-primary-light">
                              <i className="isax isax-document-download"></i> Download
                            </a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <a href="javascript:void(0);">X-Ray Report</a>
                        </td>
                        <td>10 Jan 2024</td>
                        <td>Dr. Sarah Smith</td>
                        <td><span className="badge badge-warning-bg">Imaging</span></td>
                        <td>
                          <div className="d-flex align-items-center">
                            <a href="javascript:void(0);" className="btn btn-sm bg-info-light me-2">
                              <i className="isax isax-eye"></i> View
                            </a>
                            <a href="javascript:void(0);" className="btn btn-sm bg-primary-light">
                              <i className="isax isax-document-download"></i> Download
                            </a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <a href="javascript:void(0);">ECG Report</a>
                        </td>
                        <td>05 Jan 2024</td>
                        <td>Dr. Michael Brown</td>
                        <td><span className="badge badge-success-bg">Lab Report</span></td>
                        <td>
                          <div className="d-flex align-items-center">
                            <a href="javascript:void(0);" className="btn btn-sm bg-info-light me-2">
                              <i className="isax isax-eye"></i> View
                            </a>
                            <a href="javascript:void(0);" className="btn btn-sm bg-primary-light">
                              <i className="isax isax-document-download"></i> Download
                            </a>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientReports

