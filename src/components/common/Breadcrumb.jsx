import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'

const Breadcrumb = ({ title, li1, li2 }) => {
  const { translateText: tr } = useLanguage()

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
                    {tr(title)}
                  </li>
                )}
                {li1 && (
                  <li className="breadcrumb-item active">{tr(li1)}</li>
                )}
              </ol>
              {li2 && <h2 className="breadcrumb-title">{tr(li2)}</h2>}
            </nav>
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
  )
}

export default Breadcrumb

