import { Link } from 'react-router-dom'

const PatientDependantDetails = () => {
  return (
    <>
      <div className="left-panel">
        <div className="onboarding-logo text-center">
          <Link to="/"><img src="/assets/img/onboard-img/onb-logo.png" className="img-fluid" alt="doccure-logo" /></Link>
        </div>
        <div className="onboard-img">
          <img src="/assets/img/onboard-img/onb-slide-img.png" className="img-fluid" alt="onboard-slider" />
        </div>
        <div className="onboarding-slider">
          <div id="onboard-slider" className="owl-carousel owl-theme onboard-slider slider">
            {[1, 2, 3].map((i) => (
              <div key={i} className="onboard-item text-center">
                <div className="onboard-content">
                  <h3>Welcome to Doccure</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="right-panel">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 p-0">
            <div className="right-panel-title text-center">
              <Link to="/"><img src="/assets/img/onboard-img/onb-logo.png" alt="doccure-logo" /></Link>
            </div>
          </div>
          <div className="col-lg-4 col-md-12">
            <div className="on-board-wizard">
              <ul>
                <li>
                  <Link to="/patient-email">
                    <div className="onboarding-progress active">
                      <span>1</span>
                    </div>
                    <div className="onboarding-list">
                      <h6>Registration</h6>
                      <p>Enter Details for Register</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/patient-Personalize">
                    <div className="onboarding-progress active">
                      <span>2</span>
                    </div>
                    <div className="onboarding-list">
                      <h6>Profile Picture</h6>
                      <p>Upload Profile picture</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/patient-details">
                    <div className="onboarding-progress active">
                      <span>3</span>
                    </div>
                    <div className="onboarding-list">
                      <h6>Personal Details</h6>
                      <p>Enter your Personal Details</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/patient-family-details">
                    <div className="onboarding-progress active">
                      <span>4</span>
                    </div>
                    <div className="onboarding-list">
                      <h6>Select Members</h6>
                      <p>Enter Details for Register</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/patient-dependant-details">
                    <div className="onboarding-progress active">
                      <span>5</span>
                    </div>
                    <div className="onboarding-list">
                      <h6>Dependant details</h6>
                      <p>Dependants Profile</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/patient-other-details">
                    <div className="onboarding-progress">
                      <span>6</span>
                    </div>
                    <div className="onboarding-list">
                      <h6>Other Detail</h6>
                      <p>More information</p>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-8 col-md-12">
            <div className="onboarding-content-box content-wrap">
              <div className="onborad-set">
                <div className="onboarding-title">
                  <h2>Dependant details<span>*</span></h2>
                  <h6>Add age & Photo of the each members</h6>
                </div>
                <div className="onboarding-content passcode-wrap mail-box">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="accordion" id="accordionPanelsStayOpenExample">
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                              Child
                            </button>
                          </h2>
                          <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                            <div className="accordion-body">
                              <div className="row">
                                <div className="col-lg-12">
                                  <div className="mb-3">
                                    <div className="passcode-wrap input-placeholder form-focus">
                                      <label className="focus-label">Name</label>
                                      <input type="text" className="form-control floating" required="" />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-12">
                                  <div className="mb-3">
                                    <div className="passcode-wrap input-placeholder form-focus">
                                      <label className="focus-label">Age <span>*</span></label>
                                      <input type="text" className="form-control floating" required="" />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-12">
                                  <div className="mb-3">
                                    <div className="relative-form">
                                      <span>Upload Photo</span>
                                      <label className="relative-file-upload">
                                        File Upload <input type="file" />
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                              Spouse
                            </button>
                          </h2>
                          <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
                            <div className="accordion-body">
                              <div className="row">
                                <div className="col-lg-12">
                                  <div className="mb-3">
                                    <div className="passcode-wrap input-placeholder form-focus">
                                      <label className="focus-label">Name</label>
                                      <input type="text" className="form-control floating" required="" />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-12">
                                  <div className="mb-3">
                                    <div className="passcode-wrap input-placeholder form-focus">
                                      <label className="focus-label">Age <span>*</span></label>
                                      <input type="text" className="form-control floating" required="" />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-12">
                                  <div className="mb-3">
                                    <div className="relative-form">
                                      <span>Upload Photo</span>
                                      <label className="relative-file-upload">
                                        File Upload <input type="file" />
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="panelsStayOpen-headingThree">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                              Father
                            </button>
                          </h2>
                          <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingThree">
                            <div className="accordion-body">
                              <div className="row">
                                <div className="col-lg-12">
                                  <div className="mb-3">
                                    <div className="passcode-wrap input-placeholder form-focus">
                                      <label className="focus-label">Name</label>
                                      <input type="text" className="form-control floating" required="" />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-12">
                                  <div className="mb-3">
                                    <div className="passcode-wrap input-placeholder form-focus">
                                      <label className="focus-label">Age <span>*</span></label>
                                      <input type="text" className="form-control floating" required="" />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-12">
                                  <div className="mb-3">
                                    <div className="relative-form">
                                      <span>Upload Photo</span>
                                      <label className="relative-file-upload">
                                        File Upload <input type="file" />
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="panelsStayOpen-headingfour">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapsefour" aria-expanded="false" aria-controls="panelsStayOpen-collapsefour">
                              Mother
                            </button>
                          </h2>
                          <div id="panelsStayOpen-collapsefour" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingfour">
                            <div className="accordion-body">
                              <div className="row">
                                <div className="col-lg-12">
                                  <div className="mb-3">
                                    <div className="passcode-wrap input-placeholder form-focus">
                                      <label className="focus-label">Name</label>
                                      <input type="text" className="form-control floating" required="" />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-12">
                                  <div className="mb-3">
                                    <div className="passcode-wrap input-placeholder form-focus">
                                      <label className="focus-label">Age <span>*</span></label>
                                      <input type="text" className="form-control floating" required="" />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-12">
                                  <div className="mb-3">
                                    <div className="relative-form">
                                      <span>Upload Photo</span>
                                      <label className="relative-file-upload">
                                        File Upload <input type="file" />
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="onboarding-btn">
                <Link to="/patient-other-details">Continue</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default PatientDependantDetails

