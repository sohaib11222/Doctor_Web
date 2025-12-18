import { Link } from 'react-router-dom'

const AddDependent = () => {
  return (
    <>
      <div className="content doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              {/* PatientSidebar component would go here */}
            </div>
            <div className="col-lg-12 col-xl-12">
              <div className="dashboard-header">
                <h3>Add Dependent</h3>
              </div>
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="mb-2">Name</label>
                          <input type="text" className="form-control" placeholder="Enter Name" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="mb-2">Relationship</label>
                          <select className="select form-control">
                            <option>Select Relationship</option>
                            <option>Father</option>
                            <option>Mother</option>
                            <option>Son</option>
                            <option>Daughter</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="mb-2">Gender</label>
                          <select className="select form-control">
                            <option>Select Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="mb-2">Date of Birth</label>
                          <input type="text" className="form-control datetimepicker" placeholder="DD-MM-YYYY" />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="mb-2">Profile Picture</label>
                          <div className="upload-pic">
                            <img src="/assets/img/icons/up-img-1.svg" alt="img" id="blah" />
                            <h6>Upload Photo</h6>
                            <div className="upload-pics">
                              <a className="btn-profile"><img src="/assets/img/icons/edit.svg" alt="edit-icon" /></a>
                              <input type="file" id="imgInp" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12 text-end">
                        <button type="submit" className="btn btn-primary">Add Dependent</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddDependent

