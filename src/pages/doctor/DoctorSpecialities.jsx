const DoctorSpecialities = () => {
  return (
    <>
      <div className="dashboard-header">
        <h3>Speciality & Services</h3>
        <ul>
          <li>
            <a href="#" className="btn btn-primary prime-btn add-speciality">Add New Speciality</a>
          </li>
        </ul>
      </div>

      <div className="accordions" id="list-accord">
        {/* Speciality Item */}
        <div className="user-accordion-item">
          <a href="#" className="accordion-wrap" data-bs-toggle="collapse" data-bs-target="#cardiology">Cardiology<span>Delete</span></a>
          <div className="accordion-collapse collapse show" id="cardiology" data-bs-parent="#list-accord">
            <div className="content-collapse">
              <div className="add-service-info">
                <div className="add-info">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-wrap">
                        <label className="form-label">Speciality <span className="text-danger">*</span></label>
                        <select className="select">
                          <option>Cardiology</option>
                          <option>Neurology</option>
                          <option>Urology</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row service-cont">
                    <div className="col-md-3">
                      <div className="form-wrap">
                        <label className="form-label">Service <span className="text-danger">*</span></label>
                        <select className="select">
                          <option>Select Service</option>
                          <option>Surgery</option>
                          <option>General Checkup</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-wrap">
                        <label className="form-label">Price ($) <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" placeholder="454" />
                      </div>
                    </div>
                    <div className="col-md-7">
                      <div className="d-flex align-items-center">
                        <div className="form-wrap w-100">
                          <label className="form-label">About Service</label>
                          <input type="text" className="form-control" />
                        </div>
                        <div className="form-wrap ms-2">
                          <label className="col-form-label d-block">&nbsp;</label>
                          <a href="#" className="trash-icon trash">Delete</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <a href="#" className="add-serv more-item mb-0">Add New Service</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Speciality Item */}

        {/* Speciality Item */}
        <div className="user-accordion-item">
          <a href="#" className="accordion-wrap collapsed" data-bs-toggle="collapse" data-bs-target="#neurology">Neurology<span>Delete</span></a>
          <div className="accordion-collapse" id="neurology" data-bs-parent="#list-accord">
            <div className="content-collapse">
              <div className="add-service-info">
                <div className="add-info">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-wrap">
                        <label className="form-label">Speciality <span className="text-danger">*</span></label>
                        <select className="select">
                          <option>Cardiology</option>
                          <option selected>Neurology</option>
                          <option>Urology</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row service-cont">
                    <div className="col-md-3">
                      <div className="form-wrap">
                        <label className="form-label">Service <span className="text-danger">*</span></label>
                        <select className="select">
                          <option>Select Service</option>
                          <option>Surgery</option>
                          <option>General Checkup</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-wrap">
                        <label className="form-label">Price ($) <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" placeholder="454" />
                      </div>
                    </div>
                    <div className="col-md-7">
                      <div className="d-flex align-items-center">
                        <div className="form-wrap w-100">
                          <label className="form-label">About Service</label>
                          <input type="text" className="form-control" />
                        </div>
                        <div className="form-wrap ms-2">
                          <label className="col-form-label d-block">&nbsp;</label>
                          <a href="#" className="trash-icon trash">Delete</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <a href="#" className="add-serv more-item mb-0">Add New Service</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Speciality Item */}

        {/* Speciality Item */}
        <div className="user-accordion-item">
          <a href="#" className="accordion-wrap collapsed" data-bs-toggle="collapse" data-bs-target="#urology">Urology<span>Delete</span></a>
          <div className="accordion-collapse" id="urology" data-bs-parent="#list-accord">
            <div className="content-collapse">
              <div className="add-service-info">
                <div className="add-info">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-wrap">
                        <label className="form-label">Speciality <span className="text-danger">*</span></label>
                        <select className="select">
                          <option>Cardiology</option>
                          <option>Neurology</option>
                          <option selected>Urology</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row service-cont">
                    <div className="col-md-3">
                      <div className="form-wrap">
                        <label className="form-label">Service <span className="text-danger">*</span></label>
                        <select className="select">
                          <option>Select Service</option>
                          <option>Surgery</option>
                          <option>General Checkup</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-wrap">
                        <label className="form-label">Price ($) <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" placeholder="454" />
                      </div>
                    </div>
                    <div className="col-md-7">
                      <div className="d-flex align-items-center">
                        <div className="form-wrap w-100">
                          <label className="form-label">About Service</label>
                          <input type="text" className="form-control" />
                        </div>
                        <div className="form-wrap ms-2">
                          <label className="col-form-label d-block">&nbsp;</label>
                          <a href="#" className="trash-icon trash">Delete</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <a href="#" className="add-serv more-item mb-0">Add New Service</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Speciality Item */}
      </div>

      <div className="modal-btn text-end">
        <a href="#" className="btn btn-gray">Cancel</a>
        <button className="btn btn-primary prime-btn">Save Changes</button>
      </div>
    </>
  )
}

export default DoctorSpecialities

