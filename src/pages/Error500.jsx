import { Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

const Error500 = () => {
  return (
    <MainLayout>
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <div className="error-page">
                <h1>500</h1>
                <h2>Internal Server Error</h2>
                <p>Something went wrong on our end.</p>
                <Link to="/" className="btn btn-primary">Go to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Error500

