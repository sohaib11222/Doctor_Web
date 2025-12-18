import { Link } from 'react-router-dom'

const PatientBilling = () => {
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
              <h3>Billing Information</h3>
            </div>
            <div className="card">
              <div className="card-body">
                <form>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Card Holder Name <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Card Number <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" placeholder="4111 1111 1111 1111" required />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Expiry Month <span className="text-danger">*</span></label>
                        <select className="form-control select" required>
                          <option value="">Select Month</option>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Expiry Year <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" placeholder="YYYY" required />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">CVV <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" maxLength="3" required />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Billing Address <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">City <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">State <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Zip Code <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Country <span className="text-danger">*</span></label>
                        <select className="form-control select" required>
                          <option value="">Select Country</option>
                          <option value="US">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="CA">Canada</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="saveCard" />
                        <label className="form-check-label" htmlFor="saveCard">
                          Save this card for future payments
                        </label>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="submit-section">
                        <button type="submit" className="btn btn-primary prime-btn me-2">Save Billing Information</button>
                        <Link to="/patient-accounts" className="btn btn-secondary">Cancel</Link>
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

export default PatientBilling

