import { Link } from 'react-router-dom'

const DoctorEducationSettings = () => {
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
                    <Link className="nav-link active" to="/doctor-education-settings">Education</Link>
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

            <div className="dashboard-header border-0 mb-0">
              <h3>Education</h3>
              <ul>
                <li>
                  <a href="#" className="btn btn-primary prime-btn add-educations">Add New Education</a>
                </li>
              </ul>
            </div>

            <form action="/doctor-education-settings">
              <div className="accordions education-infos" id="list-accord">
                {/* Education Item */}
                <div className="user-accordion-item">
                  <a href="#" className="accordion-wrap" data-bs-toggle="collapse" data-bs-target="#education1">Education<span>Delete</span></a>
                  <div className="accordion-collapse collapse show" id="education1" data-bs-parent="#list-accord">
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
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Name of the institution</label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Course</label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Start Date <span className="text-danger">*</span></label>
                                <div className="form-icon">
                                  <input type="text" className="form-control datetimepicker" />
                                  <span className="icon"><i className="fa-regular fa-calendar-days"></i></span>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">End Date <span className="text-danger">*</span></label>
                                <div className="form-icon">
                                  <input type="text" className="form-control datetimepicker" />
                                  <span className="icon"><i className="fa-regular fa-calendar-days"></i></span>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">No of Years <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="form-wrap">
                                <label className="col-form-label">Description <span className="text-danger">*</span></label>
                                <textarea className="form-control" rows="3"></textarea>
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
                {/* /Education Item */}

                {/* Education Item 2 */}
                <div className="user-accordion-item">
                  <a href="#" className="collapsed accordion-wrap" data-bs-toggle="collapse" data-bs-target="#education2">Cambridge (MBBS)<span>Delete</span></a>
                  <div className="accordion-collapse collapse" id="education2" data-bs-parent="#list-accord">
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
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Name of the institution</label>
                                <input type="text" className="form-control" defaultValue="Cambridge" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Course</label>
                                <input type="text" className="form-control" defaultValue="MBBS" />
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Start Date <span className="text-danger">*</span></label>
                                <div className="form-icon">
                                  <input type="text" className="form-control datetimepicker" defaultValue="12-6-2000" />
                                  <span className="icon"><i className="fa-regular fa-calendar-days"></i></span>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">End Date <span className="text-danger">*</span></label>
                                <div className="form-icon">
                                  <input type="text" className="form-control datetimepicker" defaultValue="09-05-2005" />
                                  <span className="icon"><i className="fa-regular fa-calendar-days"></i></span>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">No of Years <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" defaultValue="5" />
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="form-wrap">
                                <label className="col-form-label">Description <span className="text-danger">*</span></label>
                                <textarea className="form-control" rows="3"></textarea>
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
                {/* /Education Item 2 */}
              </div>
              
              <div className="modal-btn text-end">
                <a href="#" className="btn btn-gray">Cancel</a>
                <button className="btn btn-primary prime-btn">Save Changes</button>
              </div>
            </form>
            {/* /Profile Settings */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorEducationSettings

