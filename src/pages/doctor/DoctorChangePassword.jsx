const DoctorChangePassword = () => {
  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* DoctorSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-8 col-xl-9">
            <div className="dashboard-header">
              <h3>Change Password</h3>
            </div>
            <form action="/doctor-change-password">
              <div className="card pass-card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-block input-block-new">
                        <label className="form-label">Old Password</label>
                        <input type="password" className="form-control" />
                      </div>
                      <div className="input-block input-block-new">
                        <label className="form-label">New Password</label>
                        <div className="pass-group">
                          <input type="password" className="form-control pass-input" />
                          <span className="feather-eye-off toggle-password"></span>
                        </div>
                      </div>
                      <div className="input-block input-block-new mb-0">
                        <label className="form-label">Confirm Password</label>
                        <div className="pass-group">
                          <input type="password" className="form-control pass-input-sub" />
                          <span className="feather-eye-off toggle-password-sub"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-set-button">
                <button className="btn btn-light" type="button">Cancel</button>
                <button className="btn btn-primary" type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorChangePassword

