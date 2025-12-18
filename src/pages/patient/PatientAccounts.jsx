const PatientAccounts = () => {
  const transactions = [
    { id: '#AC1234', accountNo: '5396 5250 1908 XXXX', reason: 'Appointment', date: '26 Mar 2024', amount: '$300', status: 'Completed' },
    { id: '#AC3656', accountNo: '6372 4902 4902 XXXX', reason: 'Appointment', date: '28 Mar 2024', amount: '$480', status: 'Completed' },
    { id: '#AC1246', accountNo: '4892 0204 4924 XXXX', reason: 'Appointment', date: '11 Apr 2024', amount: '$250', status: 'Completed' },
    { id: '#AC6985', accountNo: '5730 4892 0492 XXXX', reason: 'Refund', date: '18 Apr 2024', amount: '$220', status: 'Pending' },
    { id: '#AC3659', accountNo: '7922 9024 5824 XXXX', reason: 'Appointment', date: '29 Apr 2024', amount: '$350', status: 'Completed' }
  ]

  const getStatusBadge = (status) => {
    if (status === 'Completed') {
      return <span className="badge badge-success-transparent inline-flex align-items-center"><i className="fa-solid fa-circle me-1 fs-5"></i>Completed</span>
    }
    return <span className="badge badge-warning-transparent inline-flex align-items-center"><i className="fa-solid fa-circle me-1 fs-5"></i>Pending</span>
  }

  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* PatientSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            <div className="accunts-sec">
              <div className="dashboard-header">
                <div className="header-back">
                  <h3>Wallet</h3>
                </div>
              </div>
              <div className="account-details-box">
                <div className="row">
                  <div className="col-xxl-7 col-lg-7">
                    <div className="account-payment-info">
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <div className="payment-amount">
                            <h6><i className="isa isax-wallet-25 text-warning"></i>Total Balance</h6>
                            <span>$1200</span>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="payment-amount">
                            <h6><i className="isax isax-document5 text-success"></i>Total Transaction</h6>
                            <span>$2300</span>
                          </div>
                        </div>
                      </div>
                      <div className="payment-request">
                        <span>Last Payment request : 24 Mar 2023</span>
                        <a href="#payment_request" className="btn btn-md btn-primary-gradient rounded-pill" data-bs-toggle="modal">Add Payment</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-5 col-lg-5">
                    <div className="bank-details-info">
                      <h3>Bank Details</h3>
                      <ul>
                        <li>
                          <h6>Bank Name</h6>
                          <h5>Citi Bank Inc</h5>
                        </li>
                        <li>
                          <h6>Account Number</h6>
                          <h5>5396 5250 1908 XXXX</h5>
                        </li>
                        <li>
                          <h6>Branch Name</h6>
                          <h5>London</h5>
                        </li>
                        <li>
                          <h6>Account Name</h6>
                          <h5>Darren</h5>
                        </li>
                      </ul>
                      <div className="edit-detail-link d-flex align-items-center justify-content-between w-100">
                        <div>
                          <a href="#edit_card" data-bs-toggle="modal">Edit Details</a>
                          <a href="#add_card" data-bs-toggle="modal">Add Cards</a>
                        </div>
                        <a href="#other_accounts" data-bs-toggle="modal">Other Accounts</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <div className="account-detail-table">
                  <div className="custom-new-table">
                    <div className="table-responsive">
                      <table className="table table-center mb-0">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Account No</th>
                            <th>Reason</th>
                            <th>Debited / Credited On</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((transaction, index) => (
                            <tr key={index}>
                              <td>
                                <a href="javascript:void(0);" className="link-primary">{transaction.id}</a>
                              </td>
                              <td className="text-gray-9">{transaction.accountNo}</td>
                              <td>{transaction.reason}</td>
                              <td>{transaction.date}</td>
                              <td>{transaction.amount}</td>
                              <td>
                                {getStatusBadge(transaction.status)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientAccounts

