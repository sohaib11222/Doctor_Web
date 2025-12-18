import { Link } from 'react-router-dom'
import { useState } from 'react'
import AuthLayout from '../../layouts/AuthLayout'

const DoctorSignup = () => {
  const [currentStep, setCurrentStep] = useState(1)

  const nextStep = () => {
    setCurrentStep(2)
  }

  return (
    <AuthLayout>
      <div className="login-content-info">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-6">
              <div className="account-content">
                <div className="login-shapes">
                  <div className="shape-img-left">
                    <img src="/assets/img/shape-01.png" alt="shape-image" />
                  </div>
                  <div className="shape-img-right">
                    <img src="/assets/img/shape-02.png" alt="shape-image" />
                  </div>
                </div>
                <div className="widget-set">
                  <div className="account-info">
                    <div className="widget-content multistep-form">
                      {currentStep === 1 && (
                        <fieldset id="first">
                          <div className="login-title">
                            <h3>Doctor Signup</h3>
                            <p className="mb-0">Welcome back! Please enter your details.</p>
                          </div>
                          <div className="widget-setcount">
                            <ul id="progressbar">
                              <li className="progress-active">
                                <div className="step-box">
                                  <div className="step-icon">
                                    <span>
                                      <i className="isax isax-user"></i>
                                    </span>
                                  </div>
                                  <div className="step-content">
                                    <p>Step 1</p>
                                    <h4>Create Account</h4>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="step-box">
                                  <div className="step-icon">
                                    <span>
                                      <i className="isax isax-lock"></i>
                                    </span>
                                  </div>
                                  <div className="step-content">
                                    <p>Step 2</p>
                                    <h4>Verify Account</h4>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                          <form action="#">
                            <div className="mb-3">
                              <label className="form-label">Name</label>
                              <input type="text" className="form-control" />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Email</label>
                              <input type="text" className="form-control" />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Phone Number</label>
                              <input className="form-control form-control-lg group_formcontrol form-control-phone" id="phone" name="phone" type="text" />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Password</label>
                              <div className="pass-group">
                                <input type="password" className="form-control pass-input-sub" />
                                <span className="feather-eye-off toggle-password-sub"></span>
                              </div>
                            </div>
                          </form>
                          <div className="widget-btn">
                            <button className="btn btn-primary-gradient btn-xl w-100 next_btn" onClick={nextStep}>
                              Next
                            </button>
                          </div>
                        </fieldset>
                      )}

                      {currentStep === 2 && (
                        <fieldset className="field-card">
                          <div className="login-title">
                            <h3>Security Verification</h3>
                            <p className="mb-0">To Secure your Account create complete the following verify request.</p>
                          </div>
                          <div className="widget-setcount">
                            <ul id="progressbar1">
                              <li className="progress-active">
                                <div className="step-box">
                                  <div className="step-icon">
                                    <span>
                                      <i className="isax isax-user"></i>
                                    </span>
                                  </div>
                                  <div className="step-content">
                                    <h4>Create Account</h4>
                                    <p>Step 1</p>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="step-box">
                                  <div className="step-icon">
                                    <span>
                                      <i className="isax isax-lock"></i>
                                    </span>
                                  </div>
                                  <div className="step-content">
                                    <h4>Verify Account</h4>
                                    <p>Step 2</p>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                          <form action="/signup-success" className="signup-verfication-form">
                            <div className="mb-3">
                              <div className="form-group-flex">
                                <label className="form-label">Phone</label>
                                <a href="javascript:void(0);" className="forgot-link">
                                  Get Code
                                </a>
                              </div>
                              <div className="pass-group">
                                <input className="form-control form-control-lg group_formcontrol form-control-phone" id="phone-number" name="phone-number" type="text" />
                              </div>
                              <p className="signup-code">Enter the 6 digit code sent to 98****4578</p>
                            </div>
                            <div className="mb-3">
                              <div className="form-group-flex">
                                <label className="form-label">Email</label>
                                <a href="javascript:void(0);" className="forgot-link">
                                  Get Code
                                </a>
                              </div>
                              <div className="pass-group">
                                <input type="text" className="form-control form-control-phone" />
                              </div>
                              <p className="signup-code">Enter the 6 digit code sent to ex****@gmail.com</p>
                            </div>
                            <div className="mb-0">
                              <button className="btn btn-primary-gradient w-100" type="submit">
                                Submit
                              </button>
                            </div>
                          </form>
                        </fieldset>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default DoctorSignup

