import { Link } from 'react-router-dom'

const EditDependent = () => {
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
              <h3>Edit Dependant</h3>
            </div>
            <div className="card">
              <div className="card-body">
                <form>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Name <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" defaultValue="Laura" required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Relationship <span className="text-danger">*</span></label>
                        <select className="form-control select" required>
                          <option value="mother" selected>Mother</option>
                          <option value="spouse">Spouse</option>
                          <option value="child">Child</option>
                          <option value="father">Father</option>
                          <option value="brother">Brother</option>
                          <option value="sister">Sister</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Gender <span className="text-danger">*</span></label>
                        <select className="form-control select" required>
                          <option value="female" selected>Female</option>
                          <option value="male">Male</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Date of Birth <span className="text-danger">*</span></label>
                        <input type="date" className="form-control" defaultValue="1965-01-15" required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Blood Group</label>
                        <select className="form-control select">
                          <option value="AB+" selected>AB+</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Profile Picture</label>
                        <input type="file" className="form-control" accept="image/*" />
                        <small className="form-text text-muted">Current: dependent-01.jpg</small>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Medical Conditions (if any)</label>
                        <textarea className="form-control" rows="3" placeholder="Enter any medical conditions"></textarea>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Allergies (if any)</label>
                        <textarea className="form-control" rows="3" placeholder="Enter any allergies"></textarea>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="submit-section">
                        <button type="submit" className="btn btn-primary prime-btn me-2">Update Dependant</button>
                        <Link to="/dependent" className="btn btn-secondary">Cancel</Link>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditDependent

