import { Link } from 'react-router-dom'

const DoctorExperienceSettings = () => {
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
                    <Link className="nav-link active" to="/doctor-experience-settings">Experience</Link>
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

            <div className="dashboard-header border-0 mb-0">
              <h3>Experience</h3>
              <ul>
                <li>
                  <a href="#" className="btn btn-primary prime-btn add-experiences">Add New Experience</a>
                </li>
              </ul>
            </div>

            <form action="/doctor-experience-settings">
              <div className="accordions experience-infos" id="list-accord">
                {/* Experience1 Item */}
                <div className="user-accordion-item">
                  <a href="#" className="accordion-wrap" data-bs-toggle="collapse" data-bs-target="#experience1">Experience<span>Delete</span></a>
                  <div className="accordion-collapse collapse show" id="experience1" data-bs-parent="#list-accord">
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
                                    <h5>Hospital Logo</h5>
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
                            <div className="col-lg-4 col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Title</label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Hospital <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Year of Experience <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Location <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Employement</label>
                                <select className="select">
                                  <option>Full Time</option>
                                  <option>Part Time</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="form-wrap">
                                <label className="col-form-label">Job Description <span className="text-danger">*</span></label>
                                <textarea className="form-control" rows="3"></textarea>
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
                                <label className="col-form-label">&nbsp;</label>
                                <div className="form-check">
                                  <label className="form-check-label">
                                    <input className="form-check-input" type="checkbox" /> I Currently Working Here
                                  </label>
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
                {/* /Experience1 Item */}

                {/* Experience2 Item */}
                <div className="user-accordion-item">
                  <a href="#" className="collapsed accordion-wrap" data-bs-toggle="collapse" data-bs-target="#experience2">Hill Medical Hospital, Newcastle (15  Mar 2021 - 24 Jan 2023 )<span>Delete</span></a>
                  <div className="accordion-collapse collapse" id="experience2" data-bs-parent="#list-accord">
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
                                    <h5>Hospital Logo</h5>
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
                            <div className="col-lg-4 col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Title</label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Hospital <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Year of Experience <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Location <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Employement</label>
                                <select className="select">
                                  <option>Full Time</option>
                                  <option>Part Time</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="form-wrap">
                                <label className="col-form-label">Job Description <span className="text-danger">*</span></label>
                                <textarea className="form-control" rows="3"></textarea>
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
                                <label className="col-form-label">&nbsp;</label>
                                <div className="form-check">
                                  <label className="form-check-label">
                                    <input className="form-check-input" type="checkbox" /> I Currently Working Here
                                  </label>
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
                {/* /Experience2 Item */}
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

export default DoctorExperienceSettings

