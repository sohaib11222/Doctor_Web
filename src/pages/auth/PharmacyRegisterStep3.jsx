import { Link } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'

const PharmacyRegisterStep3 = () => {
  return (
    <AuthLayout>
      <div className="content login-page pt-0">
        <div className="container-fluid">
          <div className="account-content">
            <div className="d-flex align-items-center justify-content-center">
              <div className="login-right">
                <div className="inner-right-login">
                  <div className="login-header">
                    <div className="logo-icon">
                      <img src="/assets/img/logo.png" alt="doccure-logo" />
                    </div>
                    <div className="step-list">
                      <ul>
                        <li>
                          <a href="javascript:;" className="active-done">
                            1
                          </a>
                        </li>
                        <li>
                          <a href="javascript:;" className="active-done">
                            2
                          </a>
                        </li>
                        <li>
                          <a href="javascript:;" className="active">
                            3
                          </a>
                        </li>
                      </ul>
                    </div>
                    <form id="personal_details" encType="multipart/form-data">
                      <div className="pregnant-col pt-4">
                        <div>
                          <div className="remember-me-col d-flex justify-content-between">
                            <span className="mt-1">Are you Registered</span>
                            <label className="custom_check">
                              <input type="checkbox" id="is_registered" name="pregnant" value="1" />
                              <span className="checkmark"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="step-process-col mt-4">
                        <div className="mb-3" id="preg_div" style={{ display: 'none' }}>
                          <label className="mb-2">How Many Years you have been Registered?</label>
                          <select className="form-select form-control select" id="preg_term" name="preg_term">
                            <option value="">Select year</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="mb-2">Address line 1</label>
                          <input type="text" placeholder="Address line 1" className="form-control" id="address1" defaultValue="" name="address1" />
                        </div>
                        <div className="mb-3">
                          <label className="mb-2">Address line 2</label>
                          <input type="text" placeholder="Address line 2" className="form-control" id="address2" defaultValue="" name="address2" />
                        </div>
                        <div className="mb-3">
                          <label className="mb-2">Postal/Zip code</label>
                          <input type="text" placeholder="Postal/Zip code" className="form-control" id="postal" defaultValue="" name="postal" />
                        </div>
                        <div className="mb-3">
                          <label className="mb-2">Certification and Employer</label>
                          <div className="row justify-content-center">
                            <div className="profile-pic-upload d-flex flex-wrap justify-content-center">
                              <div className="cam-col">
                                <img src="/assets/img/icons/camera.svg" alt="camera-image" />
                              </div>
                              <span className="text-center">Upload Rigth To sell Certigifcate</span>
                              <input type="file" id="right_to_sell" name="right_to_sell" />
                            </div>
                            <div className="profile-pic-upload d-flex flex-wrap justify-content-center">
                              <div className="cam-col">
                                <img src="/assets/img/icons/camera.svg" alt="camera-image" />
                              </div>
                              <span className="text-center">Upload Photo ID</span>
                              <input type="file" id="photo_id" name="photo_id" />
                            </div>
                            <div className="profile-pic-upload d-flex flex-wrap justify-content-center">
                              <div className="cam-col">
                                <img src="/assets/img/icons/camera.svg" alt="camera-image" />
                              </div>
                              <span className="text-center">Upload Clinical employment</span>
                              <input type="file" id="c_employment" name="c_employment" />
                            </div>
                          </div>
                        </div>
                        <div className="checklist-col pregnant-col">
                          <div className="remember-me-col d-flex justify-content-between">
                            <span className="mt-1">Do you Deliver?</span>
                            <label className="custom_check mb-3">
                              <input type="checkbox" name="deliver" id="deliver" value="1" />
                              <span className="checkmark"></span>
                            </label>
                          </div>
                          <div className="remember-me-col d-flex justify-content-between">
                            <span className="mt-1">Do you Offer appoinment?</span>
                            <label className="custom_check mb-3">
                              <input type="checkbox" name="appoinment" id="appoinment" value="1" />
                              <span className="checkmark"></span>
                            </label>
                          </div>
                          <div className="remember-me-col d-flex justify-content-between">
                            <span className="mt-1">Do you honour free prescription?</span>
                            <label className="custom_check mb-3">
                              <input type="checkbox" name="prescription" id="prescription" value="1" />
                              <span className="checkmark"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5">
                        <Link to="/pharmacy-index" className="btn btn-primary w-100 btn-lg login-btn step2_submit" id="step2_button">
                          Continue
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="login-bottom-copyright">
                  <span>© {new Date().getFullYear()} Doccure. All rights reserved.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default PharmacyRegisterStep3

