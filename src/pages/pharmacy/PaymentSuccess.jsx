import Breadcrumb from '../../components/common/Breadcrumb'

const PaymentSuccess = () => {
  return (
    <>
      <Breadcrumb title="Pharmacy" li1="Payment" li2="Payment" />
      <div className="content success-page-cont">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card success-card">
                <div className="card-body">
                  <div className="success-cont">
                    <i className="fas fa-check"></i>
                    <h3>Payment Successfully!</h3>
                    <p className="mb-0">Product ID: 245468</p>
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

export default PaymentSuccess

