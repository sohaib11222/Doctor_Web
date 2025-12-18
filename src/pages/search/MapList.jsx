import { Link } from 'react-router-dom'

const MapList = () => {
  const doctors = [
    { id: 1, name: 'Dr. Michael Brown', specialty: 'Psychologist', rating: 5.0, location: 'Minneapolis, MN', fee: 650, available: true, image: '/assets/img/doctors/doctor-01.jpg' },
    { id: 2, name: 'Dr. Nicholas Tello', specialty: 'Pediatrician', rating: 4.6, location: 'Ogden, IA', fee: 400, available: true, image: '/assets/img/doctors/doctor-02.jpg' },
    { id: 3, name: 'Dr. Harold Bryant', specialty: 'Neurologist', rating: 4.8, location: 'Winona, MS', fee: 500, available: true, image: '/assets/img/doctors/doctor-03.jpg' },
  ]

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
              <div className="row">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="col-md-12 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <div className="doctor-widget">
                          <div className="doc-info-left">
                            <div className="doctor-img">
                              <Link to="/doctor-profile">
                                <img src={doctor.image} className="img-fluid" alt={doctor.name} />
                              </Link>
                            </div>
                            <div className="doc-info-cont">
                              <h4 className="doc-name"><Link to="/doctor-profile">{doctor.name}</Link></h4>
                              <p className="doc-speciality">{doctor.specialty}</p>
                              <div className="rating">
                                <i className="fas fa-star filled"></i>
                                <i className="fas fa-star filled"></i>
                                <i className="fas fa-star filled"></i>
                                <i className="fas fa-star filled"></i>
                                <i className="fas fa-star"></i>
                                <span className="d-inline-block average-rating">35</span>
                              </div>
                              <div className="clinic-details">
                                <p className="doc-location"><i className="fas fa-map-marker-alt"></i> {doctor.location}</p>
                              </div>
                            </div>
                          </div>
                          <div className="doc-info-right">
                            <div className="clini-infos">
                              <ul>
                                <li><i className="far fa-thumbs-up"></i> 98%</li>
                                <li><i className="far fa-comment"></i> 35 Feedback</li>
                                <li><i className="fas fa-map-marker-alt"></i> {doctor.location}</li>
                                <li><i className="far fa-clock"></i> Available on Fri, 22 Mar</li>
                              </ul>
                            </div>
                            <div className="clinic-booking">
                              <a className="view-pro-btn" href="/doctor-profile">View Profile</a>
                              <Link className="btn btn-primary" to="/booking">Book Appointment</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div id="map" style={{ height: '600px' }}>
                    {/* Map would be rendered here */}
                    <div className="text-center p-5">
                      <i className="isax isax-location text-primary" style={{ fontSize: '48px' }}></i>
                      <p className="mt-3">Map View</p>
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

export default MapList

