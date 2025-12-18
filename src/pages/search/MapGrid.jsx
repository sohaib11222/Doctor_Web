import { Link } from 'react-router-dom'

const MapGrid = () => {
  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb-bar overflow-visible">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/"><i className="isax isax-home-15"></i></Link></li>
                  <li className="breadcrumb-item">Doctor</li>
                  <li className="breadcrumb-item active">Doctor List</li>
                </ol>
                <h2 className="breadcrumb-title">Doctor List</h2>
              </nav>
            </div>
          </div>
          <div className="bg-primary-gradient rounded-pill doctors-search-box">
            <div className="search-box-one rounded-pill">
              <form action="/search-2">
                <div className="search-input search-line">
                  <i className="isax isax-hospital5 bficon"></i>
                  <div className="mb-0">
                    <input type="text" className="form-control" placeholder="Search for Doctors, Hospitals, Clinics" />
                  </div>
                </div>
                <div className="search-input search-map-line">
                  <i className="isax isax-location5"></i>
                  <div className="mb-0">
                    <input type="text" className="form-control" placeholder="Location" />
                  </div>
                </div>
                <div className="search-input search-calendar-line">
                  <i className="isax isax-calendar-tick5"></i>
                  <div className="mb-0">
                    <input type="text" className="form-control datetimepicker" placeholder="Date" />
                  </div>
                </div>
                <div className="form-search-btn">
                  <button className="btn btn-primary d-inline-flex align-items-center rounded-pill" type="submit">
                    <i className="isax isax-search-normal-15 me-2"></i>Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="breadcrumb-bg">
          <img src="/assets/img/bg/breadcrumb-bg-01.png" alt="img" className="breadcrumb-bg-01" />
          <img src="/assets/img/bg/breadcrumb-bg-02.png" alt="img" className="breadcrumb-bg-02" />
          <img src="/assets/img/bg/breadcrumb-icon.png" alt="img" className="breadcrumb-bg-03" />
          <img src="/assets/img/bg/breadcrumb-icon.png" alt="img" className="breadcrumb-bg-04" />
        </div>
      </div>
      {/* /Breadcrumb */}

      <div className="content mt-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="mb-4">
                <h3>Showing <span className="text-secondary">450</span> Doctors For You</h3>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center justify-content-end mb-4">
                <div className="dropdown header-dropdown me-2">
                  <a className="dropdown-toggle sort-dropdown" data-bs-toggle="dropdown" href="javascript:void(0);" aria-expanded="false">
                    <span>Sort By</span>Price (Low to High)
                  </a>
                  <div className="dropdown-menu dropdown-menu-end">
                    <a href="javascript:void(0);" className="dropdown-item">Price (Low to High)</a>
                    <a href="javascript:void(0);" className="dropdown-item">Price (High to Low)</a>
                  </div>
                </div>
                <Link to="/doctor-grid" className="btn btn-sm head-icon me-2">
                  <i className="isax isax-grid-7"></i>
                </Link>
                <Link to="/search-2" className="btn btn-sm head-icon me-2">
                  <i className="isax isax-row-vertical"></i>
                </Link>
                <Link to="/map-list" className="btn btn-sm head-icon active">
                  <i className="isax isax-location"></i>
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9">
              <div className="row align-items-center mb-4">
                <div className="col-md-10">
                  <div className="row">
                    <div className="col-sm-4 col-6">
                      <div className="mb-4">
                        <select className="select form-control">
                          <option>Specialities</option>
                          <option>Urology</option>
                          <option>Psychiatry</option>
                          <option>Cardiology</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-sm-4 col-6">
                      <div className="mb-4">
                        <select className="select form-control">
                          <option>Hospitals</option>
                          <option>Cleveland Clinic</option>
                          <option>Apollo Hospital</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-sm-4 col-6">
                      <div className="mb-4">
                        <select className="select form-control">
                          <option>Doctors</option>
                          <option>Dr. Michael Brown</option>
                          <option>Dr. Nicholas Tello</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="text-end">
                    <a href="#" className="fw-medium text-secondary text-decoration-underline">Clear All</a>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div id="map" style={{ height: '600px' }}>
                    {/* Map would be rendered here */}
                    <div className="text-center p-5">
                      <i className="isax isax-location text-primary" style={{ fontSize: '48px' }}></i>
                      <p className="mt-3">Map View - Interactive map would be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="card filter-lists">
                <div className="card-header">
                  <div className="d-flex align-items-center filter-head justify-content-between">
                    <h4>Filter</h4>
                    <a href="#" className="text-secondary text-decoration-underline">Clear All</a>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="accordion-item border-bottom">
                    <div className="accordion-header" id="heading1">
                      <div className="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-controls="collapse1" role="button">
                        <div className="d-flex align-items-center w-100">
                          <h5>Specialities</h5>
                          <div className="ms-auto">
                            <span><i className="fas fa-chevron-down"></i></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="collapse1" className="accordion-collapse show" aria-labelledby="heading1">
                      <div className="accordion-body pt-3">
                        {['Urology', 'Psychiatry', 'Cardiology'].map((spec, idx) => (
                          <div key={idx} className="d-flex align-items-center justify-content-between mb-2">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" id={`checkbox-sm${idx + 2}`} defaultChecked={idx === 0} />
                              <label className="form-check-label" htmlFor={`checkbox-sm${idx + 2}`}>{spec}</label>
                            </div>
                            <span className="filter-badge">21</span>
                          </div>
                        ))}
                      </div>
                    </div>
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

export default MapGrid

