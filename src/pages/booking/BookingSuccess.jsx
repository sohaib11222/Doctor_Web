import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb'

const BookingSuccess = () => {
  return (
    <>
      <Breadcrumb title="Patient" li1="Booking" li2="Booking" />
      <div className="content success-page-cont">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card success-card">
                <div className="card-body">
                  <div className="success-cont">
                    <i className="fas fa-check"></i>
                    <h3>Appointment booked Successfully!</h3>
                    <p>
                      Appointment booked with <strong>Dr. Darren Elder</strong>
                      <br /> on <strong>12 Nov 2023 5:00PM to 6:00PM</strong>
                    </p>
                    <Link to="/invoice-view" className="btn btn-primary view-inv-btn">
                      View Invoice
                    </Link>
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

export default BookingSuccess

