import { Link } from 'react-router-dom'
import { useState } from 'react'

const PatientRegisterStep2 = () => {
  const currentYear = new Date().getFullYear()
  const [isPregnant, setIsPregnant] = useState(false)
  const [hasConditions, setHasConditions] = useState(false)
  const [hasMedication, setHasMedication] = useState(false)

  return (
    <div className="content login-page pt-0">
      <div className="container-fluid">
        {/* Register Content */}
        <div className="account-content">
          <div className="d-flex align-items-center">
            <div className="login-right">
              <div className="inner-right-login">
                <div className="login-header">
                  <div className="logo-icon">
                    <img src="/assets/img/logo.png" alt="doccure-logo" />
                  </div>
                  <div className="step-list">
                    <ul>
                      <li><a href="javascript:;" className="active-done">1</a></li>
                      <li><a href="javascript:;" className="active">2</a></li>
                      <li><a href="javascript:;">3</a></li>
                      <li><a href="javascript:;">4</a></li>
                      <li><a href="javascript:;">5</a></li>
                    </ul>
                  </div>
                  <form id="personal_details" encType="multipart/form-data">
                    <div className="text-start mt-2">
                      <h4 className="mt-3">Select Your Gender</h4>
                    </div>
                    <div className="select-gender-col">
                      <div className="row">
                        <div className="col-6 pe-2">
                          <input type="radio" id="test1" name="gender" value="Male" />
                          <label htmlFor="test1">
                            <span className="gender-icon"><img src="/assets/img/icons/male.png" alt="male-icon" /></span>
                            <span>Male</span>
                          </label>
                        </div>
                        <div className="col-6 ps-2">
                          <input type="radio" id="test2" name="gender" value="Female" />
                          <label htmlFor="test2">
                            <span className="gender-icon"><img src="/assets/img/icons/female.png" alt="female-icon" /></span>
                            <span>Female</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="pregnant-col pt-4">
                      <div>
                        <div className="remember-me-col d-flex justify-content-between">
                          <span className="mt-1">Are you Pregnant</span>
                          <label className="custom_check">
                            <input type="checkbox" className="" id="is_registered" name="pregnant" value="1" onChange={(e) => setIsPregnant(e.target.checked)} />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="step-process-col mt-4">
                      <div className="mb-3" id="preg_div" style={{ display: isPregnant ? 'block' : 'none' }}>
                        <label className="mb-2">Pregnancy Term</label>
                        <select className="form-select form-control select" id="preg_term" name="preg_term">
                          <option value="">Select Your Pregnancy Month</option>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="mb-2">Your Weight</label>
                        <div className="row">
                          <div className="col-7 pe-2">
                            <input type="text" className="form-control" name="weight" value="" id="weight" />
                          </div>
                          <div className="col-5 ps-2">
                            <select className="form-select form-control select" id="weight_unit" name="weight_unit">
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
                            <select className="form-select form-control select" id="height_unit" name="height_unit">
                              <option value="cm">cm</option>
                              <option value="ft">ft</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="mb-2">Your Age</label>
                        <input type="text" name="age" value="" className="form-control" id="age" />
                      </div>
                      <div className="mb-3">
                        <label className="mb-2">Blood Type</label>
                        <select className="form-select form-control select" id="blood_group" name="blood_group">
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
                      <div className="mb-3">
                        <label className="mb-2">Heart Rate</label>
                        <select className="form-select form-control select" id="heart_rate" name="heart_rate">
                          <option value="">Select Your Heart Rate</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="mb-2">Blood Pressure</label>
                        <select className="form-select form-control select" id="bp" name="bp">
                          <option value="">Select Your Blood Pressure</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="mb-2">Glucose Level</label>
                        <select className="form-select form-control select" id="glucose" name="glucose">
                          <option value="">Select Your Glucose Level</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="mb-2">Allergies</label>
                        <input type="text" className="form-control" value="" id="allergies" name="allergies" />
                      </div>
                      <div className="checklist-col pregnant-col">
                        <div className="remember-me-col d-flex justify-content-between">
                          <span className="mt-1">Do you have any pre-exisiting conditions?</span>
                          <label className="custom_check mb-3">
                            <input type="checkbox" className="" name="cancer" id="cancer" value="1" onChange={(e) => setHasConditions(e.target.checked)} />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                        <div className="remember-me-col" id="cancer_div" style={{ display: hasConditions ? 'block' : 'none' }}>
                          <div className="condition_input">
                            <input type="text" id="conditions" name="conditions[]" className="form-control" placeholder="" />
                          </div>
                          <a href="javascript:void(0);" className="add_condition"><i className="fa fa-plus"></i></a>
                        </div>
                        <div className="remember-me-col d-flex justify-content-between">
                          <span className="mt-1">Are you currently taking any medication</span>
                          <label className="custom_check mb-3">
                            <input type="checkbox" className="" name="medicine" id="medicine" value="1" onChange={(e) => setHasMedication(e.target.checked)} />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                        <div className="remember-me-col" id="medicine_div" style={{ display: hasMedication ? 'block' : 'none' }}>
                          <div className="medicine_input">
                            <input type="text" id="medicine_name" name="medicine_name[]" value="" className="form-control" placeholder="Enter medicine_name" />
                            <input type="text" value="" id="dosage" name="dosage[]" className="form-control" placeholder="Enter dosage" />
                          </div>
                          <a href="javascript:void(0);" className="add_medicine"><i className="fa fa-plus"></i></a>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5">
                      <Link to="/patient-register-step3" className="btn btn-primary w-100 btn-lg login-btn step2_submit">Continue</Link>
                    </div>
                  </form>
                </div>
              </div>
              <div className="login-bottom-copyright">
                <span>© {currentYear} Doccure. All rights reserved.</span>
              </div>
            </div>
          </div>
        </div>
        {/* /Register Content */}
      </div>
    </div>
  )
}

export default PatientRegisterStep2

