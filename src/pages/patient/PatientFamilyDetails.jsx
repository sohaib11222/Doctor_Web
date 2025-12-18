import { Link } from 'react-router-dom'
import { useState } from 'react'

const PatientFamilyDetails = () => {
  const [childCount, setChildCount] = useState(0)

  const incrementChild = () => {
    setChildCount(childCount + 1)
  }

  const decrementChild = () => {
    if (childCount > 0) {
      setChildCount(childCount - 1)
    }
  }

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
              <div className="onborad-set">
                <div className="onboarding-title">
                  <h2>Select Members<span>*</span></h2>
                  <h6>Who all you want to cover in health insurance</h6>
                </div>
                <div className="onboarding-content">
                  <div className="row">
                    <div className="col-lg-12">
                      <form method="post">
                        <div className="checklist-col pregnant-col">
                          <div className="remember-me-col d-flex justify-content-between">
                            <span className="mt-1">Self</span>
                            <label className="custom_check">
                              <input type="checkbox" className="" name="self" id="self" value="1" defaultChecked />
                              <span className="checkmark"></span>
                            </label>
                          </div>
                          <div className="remember-me-col d-flex align-items-center justify-content-between">
                            <span className="mt-1">Spouse</span>
                            <label className="custom_check">
                              <input type="checkbox" className="" name="spouse" id="spouse" value="1" />
                              <span className="checkmark"></span>
                            </label>
                          </div>
                          <div className="remember-me-col d-flex align-items-center justify-content-between">
                            <span className="mt-1">Child</span>
                            <div className="increment-decrement">
                              <div className="input-groups">
                                <input type="button" value="-" id="subs" className="button-minus dec button" onClick={decrementChild} />
                                <input type="text" name="child" id="child" value={childCount} className="quantity-field" readOnly />
                                <input type="button" value="+" id="adds" className="button-plus inc button" onClick={incrementChild} />
                              </div>
                            </div>
                          </div>
                          <div className="remember-me-col d-flex align-items-center justify-content-between">
                            <span className="mt-1">Mother</span>
                            <label className="custom_check">
                              <input type="checkbox" className="" name="mother" id="mother" value="1" />
                              <span className="checkmark"></span>
                            </label>
                          </div>
                          <div className="remember-me-col d-flex align-items-center justify-content-between">
                            <span className="mt-1">Father</span>
                            <label className="custom_check">
                              <input type="checkbox" className="" name="father" id="father" value="1" />
                              <span className="checkmark"></span>
                            </label>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="onboarding-btn">
                <Link to="/patient-dependant-details">Continue</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default PatientFamilyDetails

