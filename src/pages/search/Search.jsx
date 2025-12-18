import { Link } from 'react-router-dom'

const Search = () => {
  const doctors = [
    { id: 1, name: 'Dr. Michael Brown', specialty: 'Psychologist', rating: 5.0, location: 'Minneapolis, MN', duration: '30 Min', fee: 650, available: true, image: '/assets/img/doctor-grid/doctor-grid-01.jpg', colorClass: 'text-indigo' },
    { id: 2, name: 'Dr. Nicholas Tello', specialty: 'Pediatrician', rating: 4.6, location: 'Ogden, IA', duration: '60 Min', fee: 400, available: true, image: '/assets/img/doctor-grid/doctor-grid-02.jpg', colorClass: 'text-pink' },
    { id: 3, name: 'Dr. Harold Bryant', specialty: 'Neurologist', rating: 4.8, location: 'Winona, MS', duration: '30 Min', fee: 500, available: true, image: '/assets/img/doctor-grid/doctor-grid-03.jpg', colorClass: 'text-teal' },
    { id: 4, name: 'Dr. Sandra Jones', specialty: 'Cardiologist', rating: 4.8, location: 'Beckley, WV', duration: '30 Min', fee: 550, available: true, image: '/assets/img/doctor-grid/doctor-grid-04.jpg', colorClass: 'text-info' },
    { id: 5, name: 'Dr. Charles Scott', specialty: 'Neurologist', rating: 4.2, location: 'Hamshire, TX', duration: '30 Min', fee: 600, available: true, image: '/assets/img/doctor-grid/doctor-grid-05.jpg', colorClass: 'text-teal' },
    { id: 6, name: 'Dr. Robert Thomas', specialty: 'Cardiologist', rating: 4.2, location: 'Oakland, CA', duration: '30 Min', fee: 450, available: true, image: '/assets/img/doctor-grid/doctor-grid-06.jpg', colorClass: 'text-info' },
    { id: 7, name: 'Dr. Margaret Koller', specialty: 'Psychologist', rating: 4.7, location: 'Killeen, TX', duration: '30 Min', fee: 450, available: true, image: '/assets/img/doctor-grid/doctor-grid-07.jpg', colorClass: 'text-indigo' },
    { id: 8, name: 'Dr. Cath Busick', specialty: 'Pediatrician', rating: 4.7, location: 'Schenectady, NY', duration: '30 Min', fee: 750, available: false, image: '/assets/img/doctor-grid/doctor-grid-08.jpg', colorClass: 'text-pink' },
    { id: 9, name: 'Dr. Travis Barton', specialty: 'Psychologist', rating: 4.9, location: 'Metairie, LA', duration: '60 Min', fee: 480, available: true, image: '/assets/img/doctor-grid/doctor-grid-09.jpg', colorClass: 'text-indigo' },
    { id: 10, name: 'Dr. Daisy Malcolm', specialty: 'Gastroenterology', rating: 5.0, location: 'Lexington, KY', duration: '60 Min', fee: 520, available: true, image: '/assets/img/doctor-grid/doctor-grid-10.jpg', colorClass: 'text-danger' },
    { id: 11, name: 'Dr. Tyrone Patrick', specialty: 'Cardiologist', rating: 4.4, location: 'Clark Fork, ID', duration: '30 Min', fee: 360, available: false, image: '/assets/img/doctor-grid/doctor-grid-11.jpg', colorClass: 'text-info' },
    { id: 12, name: 'Dr. Ann Bell', specialty: 'Pediatrician', rating: 4.2, location: 'Minneapolis, MN', duration: '30 Min', fee: 630, available: false, image: '/assets/img/doctor-grid/doctor-grid-12.jpg', colorClass: 'text-pink' },
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
                  <li className="breadcrumb-item active">Doctor Grid Full Width</li>
                </ol>
                <h2 className="breadcrumb-title">Doctor Grid Full Width</h2>
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

      {/* Page Content */}
      <div className="content mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-4">
                <h3>Showing <span className="text-secondary">450</span> Doctors For You</h3>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center justify-content-end mb-4">
                <div className="doctor-filter-availability me-3">
                  <p>Availability</p>
                  <div className="status-toggle status-tog">
                    <input type="checkbox" id="status_6" className="check" />
                    <label htmlFor="status_6" className="checktoggle">checkbox</label>
                  </div>
                </div>
                <a href="javascript:void(0);" className="btn btn-sm head-icon me-3" id="filter_search">
                  <i className="isax isax-sort"></i>
                </a>
                <div className="dropdown header-dropdown">
                  <a className="dropdown-toggle sort-dropdown" data-bs-toggle="dropdown" href="javascript:void(0);" aria-expanded="false">
                    <span>Sort By</span>Price (Low to High)
                  </a>
                  <div className="dropdown-menu dropdown-menu-end">
                    <a href="javascript:void(0);" className="dropdown-item">Price (Low to High)</a>
                    <a href="javascript:void(0);" className="dropdown-item">Price (High to Low)</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="filter_inputs">
            <div className="row align-items-center gy-3">
              <div className="col-lg-9 mb-4">
                <div className="row gx-3">
                  <div className="col-md col-sm-4 col-6">
                    <select className="select form-control">
                      <option>Specialities</option>
                      <option>Urology</option>
                      <option>Psychiatry</option>
                      <option>Cardiology</option>
                    </select>
                  </div>
                  <div className="col-md col-sm-4 col-6">
                    <select className="select form-control">
                      <option>Hospitals</option>
                      <option>Cleveland Clinic</option>
                      <option>Apollo Hospital</option>
                    </select>
                  </div>
                  <div className="col-md col-sm-4 col-6">
                    <select className="select form-control">
                      <option>Doctors</option>
                      <option>Dr. Michael Brown</option>
                      <option>Dr. Nicholas Tello</option>
                      <option>Dr. Harold Bryant</option>
                    </select>
                  </div>
                  <div className="col-md col-sm-4 col-6">
                    <select className="select form-control">
                      <option>Reviews</option>
                      <option>5 Star</option>
                      <option>4 Star</option>
                      <option>3 Star</option>
                    </select>
                  </div>
                  <div className="col-md col-sm-4 col-6">
                    <select className="select form-control">
                      <option>Clinic</option>
                      <option>Bright Smiles Dental Clinic</option>
                      <option>Family Care Clinic</option>
                      <option>Express Health Clinic</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 mb-4">
                <div className="text-end">
                  <a href="#" className="fw-medium text-secondary text-decoration-underline">Clear All</a>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="col-xxl-3 col-lg-4 col-md-6">
                <div className="card">
                  <div className="card-img card-img-hover">
                    <Link to="/doctor-profile"><img src={doctor.image} alt={doctor.name} /></Link>
                    <div className="grid-overlay-item d-flex align-items-center justify-content-between">
                      <span className="badge bg-orange">
                        <i className="fa-solid fa-star me-1"></i>{doctor.rating}
                      </span>
                      <a href="javascript:void(0)" className="fav-icon">
                        <i className="fa fa-heart"></i>
                      </a>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <div className={`d-flex active-bar ${doctor.colorClass.includes('indigo') ? '' : doctor.colorClass.includes('pink') ? 'active-bar-pink' : doctor.colorClass.includes('teal') ? 'active-bar-teal' : doctor.colorClass.includes('info') ? 'active-bar-info' : doctor.colorClass.includes('danger') ? 'active-bar-danger' : ''} align-items-center justify-content-between p-3`}>
                      <a href="#" className={`${doctor.colorClass} fw-medium fs-14`}>{doctor.specialty}</a>
                      <span className={`badge ${doctor.available ? 'bg-success-light' : 'bg-danger-light'} d-inline-flex align-items-center`}>
                        <i className="fa-solid fa-circle fs-5 me-1"></i>
                        {doctor.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <div className="p-3 pt-0">
                      <div className="doctor-info-detail mb-3 pb-3">
                        <h3 className="mb-1"><Link to="/doctor-profile">{doctor.name}</Link></h3>
                        <div className="d-flex align-items-center">
                          <p className="d-flex align-items-center mb-0 fs-14">
                            <i className="isax isax-location me-2"></i>{doctor.location}
                          </p>
                          <i className="fa-solid fa-circle fs-5 text-primary mx-2 me-1"></i>
                          <span className="fs-14 fw-medium">{doctor.duration}</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <p className="mb-1">Consultation Fees</p>
                          <h3 className="text-orange">${doctor.fee}</h3>
                        </div>
                        <Link to="/booking" className="btn btn-md btn-dark inline-flex align-items-center rounded-pill">
                          <i className="isax isax-calendar-1 me-2"></i>
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-md-12">
              <div className="text-center mb-4">
                <Link to="/login" className="btn btn-md btn-primary-gradient inline-flex align-items-center rounded-pill">
                  <i className="isax isax-d-cube-scan5 me-2"></i>
                  Load More 425 Doctors
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
    </>
  )
}

export default Search

