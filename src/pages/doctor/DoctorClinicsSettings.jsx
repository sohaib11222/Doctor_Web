import { Link } from 'react-router-dom'

const DoctorClinicsSettings = () => {
  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* DoctorSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-8 col-xl-9">
            {/* Profile Settings */}
            <div className="dashboard-header">
              <h3>Profile Settings</h3>
            </div>

            {/* Settings List */}
            <div className="setting-tab">
              <div className="appointment-tabs">
                <ul className="nav">
                  <li className="nav-item">
                    <Link className="nav-link" to="/doctor-profile-settings">Basic Details</Link>
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
                    <Link className="nav-link active" to="/doctor-clinics-settings">Clinics</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/doctor-business-settings">Business Hours</Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* /Settings List */}

            <div className="dashboard-header border-0 mb-0">
              <h3>Clinics</h3>
              <ul>
                <li>
                  <a href="#" className="btn btn-primary prime-btn add-clinics">Add New Clinic</a>
                </li>
              </ul>
            </div>

            <form action="/doctor-clinics-settings">
              <div className="accordions clinic-infos" id="list-accord">
                {/* Clinic Item */}
                <div className="user-accordion-item">
                  <a href="#" className="accordion-wrap" data-bs-toggle="collapse" data-bs-target="#clinic1">Clinic<span>Delete</span></a>
                  <div className="accordion-collapse collapse show" id="clinic1" data-bs-parent="#list-accord">
                    <div className="content-collapse">
                      <div className="add-service-info">
                        <div className="add-info">
                          <div className="row align-items-center">
                            <div className="col-md-12">
                              <div className="form-wrap mb-2">
                                <div className="change-avatar img-upload">
                                  <div className="profile-img">
                                    <i className="fa-solid fa-file-image"></i>
                                  </div>
                                  <div className="upload-img">
                                    <h5>Logo</h5>
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
                            </div>
                            <div className="col-md-12">
                              <div className="form-wrap">
                                <label className="col-form-label">Clinic Name</label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Location</label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Address</label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form-wrap">
                                <label className="col-form-label">Gallery</label>
                                <div className="drop-file">
                                  <p>Drop files or Click to upload</p>
                                  <input type="file" />
                                </div>
                                <div className="view-imgs">
                                  <div className="view-img">
                                    <img src="/assets/img/doctors-dashboard/clinic-02.jpg" alt="img" />
                                    <a href="javascript:void(0);">Remove</a>
                                  </div>
                                  <div className="view-img">
                                    <img src="/assets/img/doctors-dashboard/clinic-01.jpg" alt="img" />
                                    <a href="javascript:void(0);">Remove</a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-end">
                          <a href="#" className="reset more-item">Reset</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Clinic Item */}

                {/* Clinic Item 2 */}
                <div className="user-accordion-item">
                  <a href="#" className="collapsed accordion-wrap" data-bs-toggle="collapse" data-bs-target="#clinic2">Adrian's Dentistry<span>Delete</span></a>
                  <div className="accordion-collapse collapse" id="clinic2" data-bs-parent="#list-accord">
                    <div className="content-collapse">
                      <div className="add-service-info">
                        <div className="add-info">
                          <div className="row align-items-center">
                            <div className="col-md-12">
                              <div className="form-wrap mb-2">
                                <div className="change-avatar img-upload">
                                  <div className="profile-img">
                                    <i className="fa-solid fa-file-image"></i>
                                  </div>
                                  <div className="upload-img">
                                    <h5>Logo</h5>
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
                            </div>
                            <div className="col-md-12">
                              <div className="form-wrap">
                                <label className="col-form-label">Clinic Name</label>
                                <input type="text" className="form-control" defaultValue="Adrian's Dentistry" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Location</label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Addrerss</label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form-wrap">
                                <label className="col-form-label">Gallery</label>
                                <div className="drop-file">
                                  <p>Drop files or Click to upload</p>
                                  <input type="file" />
                                </div>
                                <div className="view-imgs">
                                  <div className="view-img">
                                    <img src="/assets/img/doctors-dashboard/clinic-02.jpg" alt="img" />
                                    <a href="javascript:void(0);">Remove</a>
                                  </div>
                                  <div className="view-img">
                                    <img src="/assets/img/doctors-dashboard/clinic-01.jpg" alt="img" />
                                    <a href="javascript:void(0);">Remove</a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-end">
                          <a href="#" className="reset more-item">Reset</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Clinic Item 2 */}
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

export default DoctorClinicsSettings

