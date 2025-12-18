import DashboardLayout from '../../layouts/DashboardLayout'

const Components = () => {
  return (
    <DashboardLayout>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">Components</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item active">Components</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="comp-sec-wrapper">
            {/* Avatar */}
            <section className="comp-section">
              <div className="section-header">
                <h3 className="section-title">Avatar</h3>
                <div className="line"></div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header">
                      <h4 className="card-title">Sizing</h4>
                    </div>
                    <div className="card-body">
                      <div className="avatar avatar-xxl">
                        <img className="avatar-img rounded-circle" alt="User Image" src="/assets_admin/img/profiles/avatar-02.jpg" />
                      </div>
                      <div className="avatar avatar-xl">
                        <img className="avatar-img rounded-circle" alt="User Image" src="/assets_admin/img/profiles/avatar-02.jpg" />
                      </div>
                      <div className="avatar avatar-lg">
                        <img className="avatar-img rounded-circle" alt="User Image" src="/assets_admin/img/profiles/avatar-02.jpg" />
                      </div>
                      <div className="avatar">
                        <img className="avatar-img rounded-circle" alt="User Image" src="/assets_admin/img/profiles/avatar-02.jpg" />
                      </div>
                      <div className="avatar avatar-sm">
                        <img className="avatar-img rounded-circle" alt="User Image" src="/assets_admin/img/profiles/avatar-02.jpg" />
                      </div>
                      <div className="avatar avatar-xs">
                        <img className="avatar-img rounded-circle" alt="User Image" src="/assets_admin/img/profiles/avatar-02.jpg" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header">
                      <h4 className="card-title">Avatar With Status</h4>
                    </div>
                    <div className="card-body">
                      <div className="avatar avatar-online">
                        <img className="avatar-img rounded-circle" alt="User Image" src="/assets_admin/img/profiles/avatar-02.jpg" />
                      </div>
                      <div className="avatar avatar-offline">
                        <img className="avatar-img rounded-circle" alt="User Image" src="/assets_admin/img/profiles/avatar-02.jpg" />
                      </div>
                      <div className="avatar avatar-away">
                        <img className="avatar-img rounded-circle" alt="User Image" src="/assets_admin/img/profiles/avatar-02.jpg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Alerts */}
            <section className="comp-section">
              <div className="section-header">
                <h3 className="section-title">Alerts</h3>
                <div className="line"></div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="alert alert-primary alert-dismissible fade show" role="alert">
                    <strong>Holy guacamole!</strong> You should check in on some of those fields below.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>
                  <div className="alert alert-secondary alert-dismissible fade show" role="alert">
                    <strong>Holy guacamole!</strong> You should check in on some of those fields below.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Success!</strong> Your <a href="javascript:;" className="alert-link">message</a> has been sent successfully.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>
                  <div className="alert alert-danger alert-dismissible fade show mb-0" role="alert">
                    <strong>Error!</strong> A <a href="javascript:;" className="alert-link">problem</a> has been occurred while submitting your data.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>
                </div>
              </div>
            </section>

            {/* Buttons */}
            <section className="comp-section comp-buttons">
              <div className="section-header">
                <h3 className="section-title">Buttons</h3>
                <div className="line"></div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Default Button</h4>
                  <button type="button" className="btn btn-primary">Primary</button>
                  <button type="button" className="btn btn-secondary">Secondary</button>
                  <button type="button" className="btn btn-success">Success</button>
                  <button type="button" className="btn btn-danger">Danger</button>
                  <button type="button" className="btn btn-warning">Warning</button>
                  <button type="button" className="btn btn-info">Info</button>
                  <button type="button" className="btn btn-light">Light</button>
                  <button type="button" className="btn btn-dark">Dark</button>
                  <hr />
                  <h4 className="card-title">Button Sizes</h4>
                  <p>
                    <button type="button" className="btn btn-primary btn-lg">Primary</button>
                    <button type="button" className="btn btn-secondary btn-lg">Secondary</button>
                    <button type="button" className="btn btn-success btn-lg">Success</button>
                  </p>
                  <p>
                    <button type="button" className="btn btn-primary">Primary</button>
                    <button type="button" className="btn btn-secondary">Secondary</button>
                    <button type="button" className="btn btn-success">Success</button>
                  </p>
                  <p>
                    <button type="button" className="btn btn-primary btn-sm">Primary</button>
                    <button type="button" className="btn btn-secondary btn-sm">Secondary</button>
                    <button type="button" className="btn btn-success btn-sm">Success</button>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Components

