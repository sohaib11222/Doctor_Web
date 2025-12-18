import { Link } from 'react-router-dom'

const ChangePassword = () => {
  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* PatientSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            <nav className="settings-tab mb-1">
              <ul className="nav nav-tabs-bottom" role="tablist">
                <li className="nav-item" role="presentation">
                  <Link className="nav-link" to="/profile-settings">Profile</Link>
                </li>
                <li className="nav-item" role="presentation">
                  <Link className="nav-link active" to="/change-password">Change Password</Link>
                </li>
                <li className="nav-item" role="presentation">
                  <Link className="nav-link" to="/two-factor-authentication">2 Factor Authentication</Link>
                </li>
                <li className="nav-item" role="presentation">
                  <Link className="nav-link" to="/delete-account">Delete Account</Link>
                </li>
              </ul>
            </nav>
            <div className="card">
              <div className="card-body">
                <div className="border-bottom pb-3 mb-3">
                  <h5>Change Password</h5>
                </div>
                <form action="/change-password">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Current Password <span className="text-danger">*</span></label>
                        <div className="pass-group">
                          <input type="password" className="form-control pass-input-sub" />
                          <span className="feather-eye-off toggle-password-sub"></span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">New Password <span className="text-danger">*</span></label>
                        <div className="pass-group">
                          <input type="password" className="form-control pass-input" />
                          <span className="feather-eye-off toggle-password"></span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Confirm Password <span className="text-danger">*</span></label>
                        <div className="pass-group">
                          <input type="password" className="form-control pass-input-sub" />
                          <span className="feather-eye-off toggle-password-sub"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-btn border-top pt-3 text-end">
                    <a href="#" className="btn btn-md btn-light rounded-pill">Cancel</a>
                    <button type="submit" className="btn btn-md btn-primary-gradient rounded-pill">Save Changes</button>
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

export default ChangePassword

