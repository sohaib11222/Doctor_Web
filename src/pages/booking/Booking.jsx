import { Link } from 'react-router-dom'

const Booking = () => {
  return (
    <>
      <div className="doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-9 mx-auto">
              <div className="booking-wizard">
                <ul className="form-wizard-steps d-sm-flex align-items-center justify-content-center" id="progressbar2">
                  <li className="progress-active">
                    <div className="profile-step">
                      <span className="multi-steps">1</span>
                      <div className="step-section">
                        <h6>Specialty</h6>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="profile-step">
                      <span className="multi-steps">2</span>
                      <div className="step-section">
                        <h6>Appointment Type</h6>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="profile-step">
                      <span className="multi-steps">3</span>
                      <div className="step-section">
                        <h6>Date & Time</h6>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="profile-step">
                      <span className="multi-steps">4</span>
                      <div className="step-section">
                        <h6>Basic Information</h6>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="profile-step">
                      <span className="multi-steps">5</span>
                      <div className="step-section">
                        <h6>Payment</h6>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="profile-step">
                      <span className="multi-steps">6</span>
                      <div className="step-section">
                        <h6>Confirmation</h6>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="booking-widget multistep-form mb-5">
                <fieldset id="first">
                  <div className="card booking-card mb-0">
                    <div className="card-header">
                      <div className="booking-header pb-0">
                        <div className="card mb-0">
                          <div className="card-body">
                            <div className="d-flex align-items-center flex-wrap rpw-gap-2 row-gap-2">
                              <span className="avatar avatar-xxxl avatar-rounded me-2 flex-shrink-0">
                                <img src="/assets/img/clients/client-15.jpg" alt="" />
                              </span>
                              <div>
                                <h4 className="mb-1">
                                  Dr. Michael Brown <span className="badge bg-orange fs-12">
                                    <i className="fa-solid fa-star me-1"></i>5.0
                                  </span>
                                </h4>
                                <p className="text-indigo mb-3 fw-medium">Psychologist</p>
                                <p className="mb-0">
                                  <i className="isax isax-location me-2"></i>5th Street - 1011 W 5th St, Suite 120, Austin, TX 78703
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body booking-body">
                      <div className="card mb-0">
                        <div className="card-body pb-1">
                          <div className="mb-4 pb-4 border-bottom">
                            <label className="form-label">Select Speciality</label>
                            <select className="select">
                              <option>Cardiology</option>
                              <option>Neurology</option>
                              <option>Urology</option>
                            </select>
                          </div>
                          <h6 className="mb-3">Services</h6>
                          <div className="row">
                            {[
                              { id: 'service1', title: 'Echocardiograms', price: '$310', checked: true },
                              { id: 'service2', title: 'Stress tests', price: '$754' },
                              { id: 'service3', title: 'Stress tests', price: '$754' },
                              { id: 'service4', title: 'Heart Catheterization', price: '$150' },
                              { id: 'service5', title: 'Echocardiograms', price: '$200' },
                              { id: 'service6', title: 'Echocardiograms', price: '$200' },
                            ].map((service) => (
                              <div key={service.id} className="col-lg-4 col-md-6">
                                <div className={`service-item ${service.checked ? 'active' : ''}`}>
                                  <input className="form-check-input ms-0 mt-0" name="service1" type="checkbox" id={service.id} defaultChecked={service.checked} />
                                  <label className="form-check-label ms-2" htmlFor={service.id}>
                                    <span className="service-title d-block mb-1">{service.title}</span>
                                    <span className="fs-14 d-block">{service.price}</span>
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                        <a href="javascript:void(0);" className="btn btn-md btn-dark prev_btns inline-flex align-items-center rounded-pill">
                          <i className="isax isax-arrow-left-2 me-1"></i>
                          Back
                        </a>
                        <a href="javascript:void(0);" className="btn btn-md btn-primary-gradient next_btns inline-flex align-items-center rounded-pill">
                          Select Appointment Type
                          <i className="isax isax-arrow-right-3 ms-1"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </fieldset>
                {/* Additional fieldset steps would be added here for the multi-step form */}
              </div>
              <div className="text-center">
                <p className="mb-0">Copyright © {new Date().getFullYear()}. All Rights Reserved, Doccure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Booking

