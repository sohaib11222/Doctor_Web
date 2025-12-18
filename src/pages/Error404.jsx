import { Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

const Error404 = () => {
  return (
    <MainLayout>
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <div className="error-page">
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>The page you are looking for doesn't exist.</p>
                <Link to="/" className="btn btn-primary">Go to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Error404

