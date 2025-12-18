import { Link } from 'react-router-dom'

const DoctorBusinessSettings = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const activeDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

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
                    <Link className="nav-link" to="/doctor-clinics-settings">Clinics</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active" to="/doctor-business-settings">Business Hours</Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* /Settings List */}

            <div className="dashboard-header border-0 mb-0">
              <h3>Business Hours</h3>
            </div>

            <form action="/doctor-business-settings">
              <div className="business-wrap">
                <h4>Select Business days</h4>
                <ul className="business-nav">
                  {days.map((day) => (
                    <li key={day}>
                      <a className={`tab-link ${activeDays.includes(day) ? 'active' : ''}`} data-tab={`day-${day.toLowerCase()}`}>{day}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="accordions business-info" id="list-accord">
                {days.map((day, index) => {
                  const dayId = day.toLowerCase()
                  const isActive = activeDays.includes(day)
                  const isFirst = index === 0
                  
                  return (
                    <div key={day} className={`user-accordion-item tab-items ${isActive ? 'active' : ''}`} id={`day-${dayId}`}>
                      <a href="#" className={`accordion-wrap ${isFirst ? '' : 'collapsed'}`} data-bs-toggle="collapse" data-bs-target={`#${dayId}`}>
                        {day}<span className="edit">Edit</span>
                      </a>
                      <div className={`accordion-collapse collapse ${isFirst ? 'show' : ''}`} id={dayId} data-bs-parent="#list-accord">
                        <div className="content-collapse pb-0">
                          <div className="row align-items-center">
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">From <span className="text-danger">*</span></label>
                                <div className="form-icon">
                                  <input type="text" className="form-control timepicker1" />
                                  <span className="icon"><i className="fa-solid fa-clock"></i></span>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">To <span className="text-danger">*</span></label>
                                <div className="form-icon">
                                  <input type="text" className="form-control timepicker1" />
                                  <span className="icon"><i className="fa-solid fa-clock"></i></span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
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

export default DoctorBusinessSettings

