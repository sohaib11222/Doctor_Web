import { Link } from 'react-router-dom'

const PatientInvoices = () => {
  const invoices = [
    { id: '#INV1236', doctor: 'Edalin Hendry', doctorImg: '/assets/img/doctors/doctor-thumb-21.jpg', apptDate: '24 Mar 2024', bookedOn: '21 Mar 2024', amount: '$300' },
    { id: '#NV3656', doctor: 'John Homes', doctorImg: '/assets/img/doctors/doctor-thumb-13.jpg', apptDate: '17 Mar 2024', bookedOn: '14 Mar 2024', amount: '$450' },
    { id: '#INV1246', doctor: 'Shanta Neill', doctorImg: '/assets/img/doctors/doctor-thumb-03.jpg', apptDate: '11 Mar 2024', bookedOn: '07 Mar 2024', amount: '$250' },
    { id: '#INV6985', doctor: 'Anthony Tran', doctorImg: '/assets/img/doctors/doctor-thumb-08.jpg', apptDate: '26 Feb 2024', bookedOn: '23 Feb 2024', amount: '$320' },
    { id: '#INV3659', doctor: 'Susan Lingo', doctorImg: '/assets/img/doctors/doctor-thumb-01.jpg', apptDate: '18 Feb 2024', bookedOn: '15 Feb 2024', amount: '$480' }
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
              <h3>Invoices</h3>
              <ul className="header-list-btns">
                <li>
                  <div className="input-block dash-search-input">
                    <input type="text" className="form-control" placeholder="Search" />
                    <span className="search-icon"><i className="isax isax-search-normal"></i></span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="custom-table">
              <div className="table-responsive">
                <table className="table table-center mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Doctor</th>
                      <th>Appointment Date</th>
                      <th>Booked on</th>
                      <th>Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice, index) => (
                      <tr key={index}>
                        <td><a href="javascript:void(0);" className="link-primary" data-bs-toggle="modal" data-bs-target="#invoice_view">{invoice.id}</a></td>
                        <td>
                          <h2 className="table-avatar">
                            <Link to="/doctor-profile" className="avatar avatar-sm me-2">
                              <img className="avatar-img rounded-3" src={invoice.doctorImg} alt="User Image" />
                            </Link>
                            <Link to="/doctor-profile">{invoice.doctor}</Link>
                          </h2>
                        </td>
                        <td>{invoice.apptDate}</td>
                        <td>{invoice.bookedOn}</td>
                        <td>{invoice.amount}</td>
                        <td>
                          <div className="action-item">
                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#invoice_view">
                              <i className="isax isax-link-2"></i>
                            </a>
                            <a href="javascript:void(0);">
                              <i className="isax isax-import"></i>
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="pagination dashboard-pagination">
              <ul>
                <li>
                  <a href="#" className="page-link prev">Prev</a>
                </li>
                <li>
                  <a href="#" className="page-link">1</a>
                </li>
                <li>
                  <a href="#" className="page-link active">2</a>
                </li>
                <li>
                  <a href="#" className="page-link">3</a>
                </li>
                <li>
                  <a href="#" className="page-link">4</a>
                </li>
                <li>
                  <a href="#" className="page-link next">Next</a>
                </li>
              </ul>
            </div>
            {/* /Pagination */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientInvoices

