const DoctorPayment = () => {
  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* DoctorSidebar will be rendered by DashboardLayout */}
          </div>

          {/* Payouts */}
          <div className="col-lg-12 col-xl-12">
            <div className="payout-wrap">
              <div className="payout-title">
                <h4>Settings</h4>
                <p>All the earning will be sent to below selected payout method</p>
              </div>
              <div className="stripe-wrapper">
                <div className="stripe-box">
                  <div className="stripe-img">
                    <img src="/assets/img/icons/stripe.svg" alt="img" />
                  </div>
                  <a href="javascript:void(0);" className="btn"><i className="fa-solid fa-gear"></i>Configure</a>
                </div>
                <div className="stripe-box active">
                  <div className="stripe-img">
                    <img src="/assets/img/icons/paypal.svg" alt="img" />
                  </div>
                  <a href="javascript:void(0);" className="btn" data-bs-toggle="modal" data-bs-target="#add_configure"><i className="fa-solid fa-gear"></i>Configure</a>
                </div>
              </div>
            </div>

            <div className="dashboard-header">
              <h3>Payouts</h3>
            </div>

            <div className="search-header">
              <div className="search-field">
                <input type="text" className="form-control" placeholder="Search" />
                <span className="search-icon"><i className="fa-solid fa-magnifying-glass"></i></span>
              </div>
            </div>

            <div className="custom-table">
              <div className="table-responsive">
                <table className="table table-center mb-0">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Payment Method</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>24 Mar 2024</td>
                      <td>Paypal</td>
                      <td>$300</td>
                      <td>
                        <span className="badge badge-green status-badge">Completed</span>
                      </td>
                    </tr>
                    <tr>
                      <td>24 Mar 2024</td>
                      <td>Paypal</td>
                      <td>$200</td>
                      <td>
                        <span className="badge badge-green status-badge">Completed</span>
                      </td>
                    </tr>
                    <tr>
                      <td>25 Mar 2024</td>
                      <td>Paypal</td>
                      <td>$300</td>
                      <td>
                        <span className="badge badge-green status-badge">Completed</span>
                      </td>
                    </tr>
                    <tr>
                      <td>24 Mar 2024</td>
                      <td>Paypal</td>
                      <td>$300</td>
                      <td>
                        <span className="badge badge-green status-badge">Completed</span>
                      </td>
                    </tr>
                    <tr>
                      <td>24 Mar 2024</td>
                      <td>Paypal</td>
                      <td>$300</td>
                      <td>
                        <span className="badge badge-green status-badge">Completed</span>
                      </td>
                    </tr>
                    <tr>
                      <td>24 Mar 2024</td>
                      <td>Paypal</td>
                      <td>$300</td>
                      <td>
                        <span className="badge badge-green status-badge">Completed</span>
                      </td>
                    </tr>
                    <tr>
                      <td>27 Mar 2024</td>
                      <td>Paypal</td>
                      <td>$200</td>
                      <td>
                        <span className="badge badge-green status-badge">Completed</span>
                      </td>
                    </tr>
                    <tr>
                      <td>29 Mar 2024</td>
                      <td>Paypal</td>
                      <td>$350</td>
                      <td>
                        <span className="badge badge-green status-badge">Completed</span>
                      </td>
                    </tr>
                    <tr>
                      <td>24 Mar 2024</td>
                      <td>Paypal</td>
                      <td>$100</td>
                      <td>
                        <span className="badge badge-green status-badge">Completed</span>
                      </td>
                    </tr>
                    <tr>
                      <td>04 Apr 2024</td>
                      <td>Paypal</td>
                      <td>$180</td>
                      <td>
                        <span className="badge badge-green status-badge">Completed</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="pagination dashboard-pagination">
              <ul>
                <li>
                  <a href="#" className="page-link"><i className="fa-solid fa-chevron-left"></i></a>
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
                  <a href="#" className="page-link">...</a>
                </li>
                <li>
                  <a href="#" className="page-link"><i className="fa-solid fa-chevron-right"></i></a>
                </li>
              </ul>
            </div>
            {/* /Pagination */}
          </div>
          {/* /Payouts */}
        </div>
      </div>
    </div>
  )
}

export default DoctorPayment

