import DashboardLayout from '../../layouts/DashboardLayout'

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-7 col-lg-8 col-xl-9">
              <div className="page-header">
                <h3 className="page-title">Admin Dashboard</h3>
              </div>
              <p>Convert from resources/views/admin/index_admin.blade.php</p>
              <p>Use Index.jsx as a template for conversion.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard

