import { Link } from 'react-router-dom'

const DoctorAwardsSettings = () => {
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
                    <Link className="nav-link active" to="/doctor-awards-settings">Awards</Link>
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
              <h3>Awards</h3>
              <ul>
                <li>
                  <a href="#" className="btn btn-primary prime-btn add-awrads">Add New Award</a>
                </li>
              </ul>
            </div>

            <form action="/doctor-awards-settings">
              <div className="accordions awrad-infos" id="list-accord">
                {/* Awards Item */}
                <div className="user-accordion-item">
                  <a href="#" className="accordion-wrap" data-bs-toggle="collapse" data-bs-target="#award1">Awards<span>Delete</span></a>
                  <div className="accordion-collapse collapse show" id="award1" data-bs-parent="#list-accord">
                    <div className="content-collapse">
                      <div className="add-service-info">
                        <div className="add-info">
                          <div className="row align-items-center">
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Award Name</label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Year <span className="text-danger">*</span></label>
                                <div className="form-icon">
                                  <input type="text" className="form-control datetimepicker" />
                                  <span className="icon"><i className="fa-regular fa-calendar-days"></i></span>
                                </div>
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
                {/* /Awards Item */}

                {/* Awards Item 2 */}
                <div className="user-accordion-item">
                  <a href="#" className="collapsed accordion-wrap" data-bs-toggle="collapse" data-bs-target="#award2">Best Surgeon<span>Delete</span></a>
                  <div className="accordion-collapse collapse" id="award2" data-bs-parent="#list-accord">
                    <div className="content-collapse">
                      <div className="add-service-info">
                        <div className="add-info">
                          <div className="row align-items-center">
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Award Name</label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Year <span className="text-danger">*</span></label>
                                <div className="form-icon">
                                  <input type="text" className="form-control datetimepicker" />
                                  <span className="icon"><i className="fa-regular fa-calendar-days"></i></span>
                                </div>
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
                {/* /Awards Item 2 */}
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

export default DoctorAwardsSettings

