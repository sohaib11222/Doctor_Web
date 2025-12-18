import { Link } from 'react-router-dom'

const Breadcrumb = ({ title, li1, li2 }) => {
  return (
    <div className="breadcrumb-bar">
      <div className="container">
        <div className="row align-items-center inner-banner">
          <div className="col-md-12 col-12 text-center">
            <nav aria-label="breadcrumb" className="page-breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/index">
                    <i className="isax isax-home-15"></i>
                  </Link>
                </li>
                {title && (
                  <li className="breadcrumb-item" aria-current="page">
                    {title}
                  </li>
                )}
                {li1 && (
                  <li className="breadcrumb-item active">{li1}</li>
                )}
              </ol>
              {li2 && <h2 className="breadcrumb-title">{li2}</h2>}
            </nav>
          </div>
        </div>
      </div>
      <div className="breadcrumb-bg">
        <img src="/public/assets/img/bg/breadcrumb-bg-01.png" alt="img" className="breadcrumb-bg-01" />
        <img src="/public/assets/img/bg/breadcrumb-bg-02.png" alt="img" className="breadcrumb-bg-02" />
        <img src="/public/assets/img/bg/breadcrumb-icon.png" alt="img" className="breadcrumb-bg-03" />
        <img src="/public/assets/img/bg/breadcrumb-icon.png" alt="img" className="breadcrumb-bg-04" />
      </div>
    </div>
  )
}

export default Breadcrumb

