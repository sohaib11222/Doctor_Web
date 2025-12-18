import { Link } from 'react-router-dom'

const Dependent = () => {
  const dependents = [
    { id: 1, name: 'Laura', relation: 'Mother', gender: 'Female', age: '58 years 20 days', bloodGroup: 'AB+ve', img: '/assets/img/dependent/dependent-01.jpg', checked: true },
    { id: 2, name: 'Mathew', relation: 'Father', gender: 'Male', age: '59 years 15 days', bloodGroup: 'AB+ve', img: '/assets/img/dependent/dependent-02.jpg', checked: true },
    { id: 3, name: 'Christopher', relation: 'Brother', gender: 'Male', age: '32 years 6 Months', bloodGroup: 'A+ve', img: '/assets/img/dependent/dependent-03.jpg', checked: true },
    { id: 4, name: 'Elisa', relation: 'Sister', gender: 'Female', age: '28 years 4 Months', bloodGroup: 'B+ve', img: '/assets/img/dependent/dependent-04.jpg', checked: false }
  ]

  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* PatientSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            <div className="dashboard-header">
              <h3>Dependants</h3>
            </div>

            <div className="dashboard-header border-0 m-0">
              <ul className="header-list-btns">
                <li>
                  <div className="input-block dash-search-input">
                    <input type="text" className="form-control" placeholder="Search" />
                    <span className="search-icon"><i className="isax isax-search-normal"></i></span>
                  </div>
                </li>
              </ul>
              <a href="#" className="btn btn-md btn-primary-gradient rounded-pill" data-bs-toggle="modal" data-bs-target="#add_dependent">Add Dependants</a>
            </div>

            {dependents.map((dependent) => (
              <div key={dependent.id} className="dependent-wrap">
                <div className="dependent-info">
                  <div className="patinet-information">
                    <Link to="/patient-profile">
                      <img src={dependent.img} alt="User Image" />
                    </Link>
                    <div className="patient-info">
                      <h5>{dependent.name}</h5>
                      <ul>
                        <li>{dependent.relation}</li>
                        <li>{dependent.gender}</li>
                        <li>{dependent.age}</li>
                      </ul>
                    </div>
                  </div>
                  <div className="blood-info">
                    <p>Blood Group</p>
                    <h6>{dependent.bloodGroup}</h6>
                  </div>
                </div>
                <div className="dependent-status">
                  <div className={`status-toggle ${dependent.checked ? '' : 'checked'}`}>
                    <input type="checkbox" id={`status_${dependent.id}`} className="check" defaultChecked={dependent.checked} />
                    <label htmlFor={`status_${dependent.id}`} className="checktoggle">checkbox</label>
                  </div>
                  <a href="javascript:void(0);" className="edit-icon me-2" data-bs-toggle="modal" data-bs-target="#edit_dependent"><i className="isax isax-edit-2"></i></a>
                  <a href="javascript:void(0);" className="edit-icon" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash"></i></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dependent

