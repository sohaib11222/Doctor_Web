import { Link } from 'react-router-dom'

const ProfileSettings = () => {
  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* PatientSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            <nav className="settings-tab mb-1">
              <ul className="nav nav-tabs-bottom" role="tablist">
                <li className="nav-item" role="presentation">
                  <Link className="nav-link active" to="/profile-settings">Profile</Link>
                </li>
                <li className="nav-item" role="presentation">
                  <Link className="nav-link" to="/change-password">Change Password</Link>
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
                  <h5>Profile Settings</h5>
                </div>
                <form action="/profile-settings">
                  <div className="setting-card">
                    <label className="form-label mb-2">Profile Photo</label>
                    <div className="change-avatar img-upload">
                      <div className="profile-img">
                        <i className="fa-solid fa-file-image"></i>
                      </div>
                      <div className="upload-img">
                        <div className="imgs-load d-flex align-items-center">
                          <div className="change-photo">
                            Upload New 
                            <input type="file" className="upload" />
                          </div>
                          <a href="#" className="upload-remove">Remove</a>
                        </div>
                        <p>Your Image should Below 4 MB, Accepted format jpg,png,svg</p>
                      </div>
                    </div>
                  </div>
                  <div className="setting-title">
                    <h6>Information</h6>
                  </div>
                  <div className="setting-card">
                    <div className="row">
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">First Name <span className="text-danger">*</span></label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Last Name <span className="text-danger">*</span></label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Date of Birth <span className="text-danger">*</span></label>
                          <div className="form-icon">
                            <input type="text" className="form-control datetimepicker" placeholder="dd/mm/yyyy" />
                            <span className="icon"><i className="isax isax-calendar-1"></i></span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Email Address <span className="text-danger">*</span></label>
                          <input type="email" className="form-control" />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Blood Group <span className="text-danger">*</span></label>
                          <select className="select">
                            <option>Select</option>
                            <option>B+ve</option>
                            <option>AB+ve</option>
                            <option>B-ve</option>
                            <option>O+ve</option>
                            <option>O-ve</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="setting-title">
                    <h6>Address</h6>
                  </div>
                  <div className="setting-card">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="form-label">Address <span className="text-danger">*</span></label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">City <span className="text-danger">*</span></label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">State <span className="text-danger">*</span></label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Country <span className="text-danger">*</span></label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Pincode <span className="text-danger">*</span></label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-btn text-end">
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

export default ProfileSettings

