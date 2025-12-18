import { Link } from 'react-router-dom'

const DoctorProfileSettings = () => {
  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* DoctorSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            {/* Profile Settings */}
            <div className="dashboard-header">
              <h3>Profile Settings</h3>
            </div>

            {/* Settings List */}
            <div className="setting-tab">
              <div className="appointment-tabs">
                <ul className="nav">
                  <li className="nav-item">
                    <Link className="nav-link active" to="/doctor-profile-settings">Basic Details</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/doctor-experience-settings">Experience</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/doctor-education-settings">Education</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/doctor-awards-settings">Awards</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/doctor-insurance-settings">Insurances</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/doctor-clinics-settings">Clinics</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/doctor-business-settings">Business Hours</Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* /Settings List */}

            <div className="setting-title">
              <h5>Profile</h5>
            </div>

            <form action="/doctor-profile-settings">
              <div className="setting-card">
                <div className="change-avatar img-upload">
                  <div className="profile-img">
                    <i className="fa-solid fa-file-image"></i>
                  </div>
                  <div className="upload-img">
                    <h5>Profile Image</h5>
                    <div className="imgs-load d-flex align-items-center">
                      <div className="change-photo">
                        Upload New 
                        <input type="file" className="upload" />
                      </div>
                      <a href="#" className="upload-remove">Remove</a>
                    </div>
                    <p className="form-text">Your Image should Below 4 MB, Accepted format jpg,png,svg</p>
                  </div>
                </div>
              </div>
              <div className="setting-title">
                <h5>Information</h5>
              </div>
              <div className="setting-card">
                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="form-wrap">
                      <label className="form-label">First Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="form-wrap">
                      <label className="form-label">Last Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="form-wrap">
                      <label className="form-label">Display Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="form-wrap">
                      <label className="form-label">Designation <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="form-wrap">
                      <label className="form-label">Phone Numbers <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="form-wrap">
                      <label className="form-label">Email Address <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-wrap">
                      <label className="form-label">Known Languages <span className="text-danger">*</span></label>
                      <div className="input-block input-block-new mb-0">
                        <input className="input-tags form-control" id="inputBox3" type="text" data-role="tagsinput" placeholder="Type New" name="Label" defaultValue="English German,Portugese" />
                        <a href="#" className="input-text save-btn">Save</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="setting-title">
                <h5>Memberships</h5>
              </div>
              <div className="setting-card">
                <div className="add-info membership-infos">
                  <div className="row membership-content">
                    <div className="col-lg-3 col-md-6">
                      <div className="form-wrap">
                        <label className="form-label">Title <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" placeholder="Add Title" />
                      </div>
                    </div>
                    <div className="col-lg-9 col-md-6">
                      <div className="d-flex align-items-center">
                        <div className="form-wrap w-100">
                          <label className="form-label">About Membership</label>
                          <input type="text" className="form-control" />
                        </div>
                        <div className="form-wrap ms-2">
                          <label className="col-form-label d-block">&nbsp;</label>
                          <a href="javascript:void(0);" className="trash-icon trash">Delete</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <a href="#" className="add-membership-info more-item">Add New</a>
                </div>
              </div>
            
              <div className="modal-btn text-end">
                <a href="#" className="btn btn-gray">Cancel</a>
                <button type="submit" className="btn btn-primary prime-btn">Save Changes</button>
              </div>
            </form>
            {/* /Profile Settings */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfileSettings

