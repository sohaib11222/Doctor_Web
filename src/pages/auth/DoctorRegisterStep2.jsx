import { Link } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'

const DoctorRegisterStep2 = () => {
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
                          <a href="#" className="active-done">
                            1
                          </a>
                        </li>
                        <li>
                          <a href="#" className="active">
                            2
                          </a>
                        </li>
                        <li>
                          <a href="#">3</a>
                        </li>
                      </ul>
                    </div>
                    <form id="personal_details" encType="multipart/form-data">
                      <div className="text-start mt-2">
                        <h4 className="mt-3">Select Your Gender</h4>
                      </div>
                      <div className="select-gender-col">
                        <div className="row">
                          <div className="col-6 pe-2">
                            <input type="radio" id="test1" name="gender" defaultChecked value="Male" />
                            <label htmlFor="test1">
                              <span className="gender-icon">
                                <img src="/assets/img/icons/male.png" alt="male-icon" />
                              </span>
                              <span>Male</span>
                            </label>
                          </div>
                          <div className="col-6 ps-2">
                            <input type="radio" id="test2" name="gender" value="Female" />
                            <label htmlFor="test2">
                              <span className="gender-icon">
                                <img src="/assets/img/icons/female.png" alt="female-icon" />
                              </span>
                              <span>Female</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="pregnant-col pt-4">
                        <div>
                          <div className="remember-me-col d-flex justify-content-between">
                            <span className="mt-1">Are you Registered?</span>
                            <label className="custom_check">
                              <input type="checkbox" className="form-control" id="is_registered" name="isregistered" value="1" />
                              <span className="checkmark"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="step-process-col mt-4">
                        <div className="mb-3" id="preg_div" style={{ display: 'none' }}>
                          <label className="mb-2">How many years have you been registered?</label>
                          <select className="form-select form-control" id="register_years" name="register_years">
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
                            <option value="10+">10+</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="mb-2">Registered Clinic address</label>
                          <input type="text" name="address" className="form-control" id="address" />
                        </div>
                        <div className="mb-3">
                          <label className="mb-2">Address 2</label>
                          <input type="text" name="address2" className="form-control" id="address2" />
                        </div>
                        <div className="mb-3">
                          <label className="mb-2">Pincode / Zipcoode</label>
                          <input type="text" name="zipcode" className="form-control" id="zipcode" />
                        </div>
                        <div className="mb-3">
                          <label className="mb-2">Certification and Employer</label>
                          <div className="row justify-content-center">
                            <div className="col-12 col-md-6 d-flex">
                              <div className="profile-pic-upload d-flex flex-wrap justify-content-center">
                                <div className="cam-col">
                                  <img src="/assets/img/icons/camera.svg" alt="camera-image" />
                                </div>
                                <span className="text-center">Upload Rigth To sell Certigifcate</span>
                                <input type="file" id="quali_certificate" name="quali_certificate" />
                              </div>
                            </div>
                            <div className="col-12 col-md-6 d-flex">
                              <div className="profile-pic-upload d-flex flex-wrap justify-content-center">
                                <div className="cam-col">
                                  <img src="/assets/img/icons/camera.svg" alt="camera-image" />
                                </div>
                                <span className="text-center">Upload Photo ID</span>
                                <input type="file" id="photo_id" name="photo_id" />
                              </div>
                            </div>
                            <div className="col-12 col-md-6 d-flex">
                              <div className="profile-pic-upload d-flex flex-wrap justify-content-center">
                                <div className="cam-col">
                                  <img src="/assets/img/icons/camera.svg" alt="camera-image" />
                                </div>
                                <span className="text-center">Upload Clinical employment</span>
                                <input type="file" id="clinical_employment" name="clinical_employment" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="mb-2">Your Weight</label>
                          <div className="row">
                            <div className="col-7 pe-2">
                              <input type="text" className="form-control" name="weight" id="weight" />
                            </div>
                            <div className="col-5 ps-2">
                              <select className="form-select form-control" id="weight_unit" name="weight_unit">
                                <option value="kg">Kg</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="mb-2">Your Height</label>
                          <div className="row">
                            <div className="col-7 pe-2">
                              <input type="text" className="form-control" id="height" />
                            </div>
                            <div className="col-5 ps-2">
                              <select className="form-select form-control" id="height_unit" name="height_unit">
                                <option value="cm">cm</option>
                                <option value="ft">ft</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="mb-2">Your Age</label>
                          <input type="text" name="age" className="form-control" id="age" />
                        </div>
                        <div className="mb-3">
                          <label className="mb-2">Blood Type</label>
                          <select className="form-select form-control" id="blood_group" name="blood_group">
                            <option value="">Select your blood group</option>
                            <option value="A-">A-</option>
                            <option value="A+">A+</option>
                            <option value="B-">B-</option>
                            <option value="B+">B+</option>
                            <option value="AB-">AB-</option>
                            <option value="AB+">AB+</option>
                            <option value="O-">O-</option>
                            <option value="O+">O+</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-5">
                        <Link to="/doctor-register-step3" className="btn btn-primary w-100 btn-lg login-btn step2_submit">
                          continue
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="login-bottom-copyright">
                  <span>© 2024 Doccure. All rights reserved.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default DoctorRegisterStep2

