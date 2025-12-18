import { Link } from 'react-router-dom'

const PatientDetails = () => {
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
        <div className="onboarding-content passcode-wrap mail-box">
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
                      <div className="onboarding-progress">
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
                      <div className="onboarding-progress">
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
                <div className="onboarding-title">
                  <h2>What are your personal details? <span>*</span></h2>
                  <h6>Please provide your personal information</h6>
                </div>
                <div className="patient-details-form">
                  <div className="login-header">
                    <form id="personal_details" encType="multipart/form-data">
                      <div className="mb-3">
                        <div className="row select-gender-option">
                          <div className="col-6">
                            <div className="option-set">
                              <input type="radio" id="test1" name="gender" value="Male" />
                              <label htmlFor="test1">
                                <span><i className="fas fa-mars"></i> Male</span>
                              </label>
                            </div>
                          </div>
                          <div className="col-6">
                            <input type="radio" id="test2" name="gender" value="Female" />
                            <label htmlFor="test2">
                              <span><i className="fas fa-venus"></i> Female</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-9">
                          <div className="mb-3">
                            <div className="passcode-wrap input-placeholder form-focus">
                              <label className="focus-label">Your Weight<span>*</span></label>
                              <input type="text" className="form-control floating" required="" />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="mb-3">
                            <select className="select">
                              <option>KG</option>
                              <option>LBS</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-9">
                          <div className="mb-3">
                            <div className="passcode-wrap input-placeholder form-focus">
                              <label className="focus-label">Your Height<span>*</span></label>
                              <input type="text" className="form-control floating" required="" />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="mb-3">
                            <select className="select">
                              <option>CM</option>
                              <option>FEET</option>
                              <option>INCH</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <div className="passcode-wrap input-placeholder form-focus">
                              <label className="focus-label">Age<span>*</span></label>
                              <input type="text" className="form-control floating" required="" />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <select className="select">
                              <option disabled>Blood Type</option>
                              <option>O+ve</option>
                              <option>O-ve</option>
                              <option>B+ve</option>
                              <option>B-ve</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <div className="passcode-wrap input-placeholder form-focus">
                              <label className="focus-label">Heart Rate<span>*</span></label>
                              <input type="text" className="form-control floating" required="" />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <div className="passcode-wrap input-placeholder form-focus">
                              <label className="focus-label">Blood Pressure <span>*</span></label>
                              <input type="text" className="form-control floating" required="" />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <div className="passcode-wrap input-placeholder form-focus">
                              <label className="focus-label">Glucose Level <span>*</span></label>
                              <input type="text" className="form-control floating" required="" />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <div className="passcode-wrap input-placeholder form-focus">
                              <label className="focus-label">Allergies <span>*</span></label>
                              <input type="text" className="form-control floating" required="" />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <div className="pregnant-col pt-4">
                              <div>
                                <div className="remember-me-col d-flex justify-content-between align-items-center">
                                  <span className="mt-1">Are you Pregnant</span>
                                  <label className="custom_check">
                                    <input type="checkbox" className="" id="is_registered" name="pregnant" value="1" />
                                    <span className="checkmark"></span>
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="step-process-col mt-4">
                              <div className="mb-3" id="preg_div" style={{ display: 'none' }}>
                                <select className="select form-control" id="preg_term" name="preg_term">
                                  <option value="">Select Your Pregnancy Month</option>
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                                    <option key={i} value={i}>{i}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <div className="checklist-col">
                              <div className="remember-me-col d-flex justify-content-between align-items-center">
                                <span className="mt-1">Do you have any pre-exisiting conditions?</span>
                                <label className="custom_check">
                                  <input type="checkbox" className="" name="cancer" id="cancer" value="1" />
                                  <span className="checkmark"></span>
                                </label>
                              </div>
                              <div className="remember-me-col" id="cancer_div" style={{ display: 'none' }}>
                                <div className="condition_input">
                                  <input type="text" id="conditions" name="conditions[]" className="form-control" placeholder="" />
                                </div>
                                <a href="javascript:void(0);" className="add_condition"><i className="fa fa-plus"></i></a>
                              </div>
                              <div className="remember-me-col d-flex justify-content-between align-items-center">
                                <span className="mt-1">Are you currently taking any medication</span>
                                <label className="custom_check">
                                  <input type="checkbox" className="" name="medicine" id="medicine" value="1" />
                                  <span className="checkmark"></span>
                                </label>
                              </div>
                              <div className="remember-me-col" id="medicine_div" style={{ display: 'none' }}>
                                <div className="medicine_input">
                                  <input type="text" id="medicine_name" name="medicine_name[]" value="" className="form-control" placeholder="Enter medicine_name" />
                                  <input type="text" value="" id="dosage" name="dosage[]" className="form-control" placeholder="Enter dosage" />
                                </div>
                                <a href="javascript:void(0);" className="add_medicine"><i className="fa fa-plus"></i></a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="onboarding-btn">
                  <Link to="/patient-family-details">Continue</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default PatientDetails

