import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import * as pharmacyApi from '../../api/pharmacy'

const PharmacyDashboard = () => {
  const { user } = useAuth()

  const { data: myPharmacyResponse, isLoading } = useQuery({
    queryKey: ['my-pharmacy'],
    queryFn: () => pharmacyApi.getMyPharmacy(),
    enabled: !!user
  })

  const myPharmacy = useMemo(() => {
    if (!myPharmacyResponse) return null
    const responseData = myPharmacyResponse.data || myPharmacyResponse
    return responseData.data || responseData
  }, [myPharmacyResponse])

  const status = user?.status?.toUpperCase()

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="dashboard-header">
        <h3>Pharmacy Dashboard</h3>
        <p className="text-muted mb-0">Manage your pharmacy profile, products and orders</p>
      </div>

      {status === 'PENDING' && (
        <div className="alert alert-warning">
          Your account is pending admin approval. You can complete your pharmacy profile, but you cannot sell products until approved.
        </div>
      )}

      {!myPharmacy ? (
        <div className="card">
          <div className="card-body">
            <h5 className="mb-2">Create your pharmacy profile</h5>
            <p className="text-muted mb-3">You need to create your pharmacy profile before you can manage products.</p>
            <Link className="btn btn-primary" to="/pharmacy/profile">Go to Pharmacy Profile</Link>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-1">{myPharmacy.name || 'My Pharmacy'}</h5>
                <p className="text-muted mb-3">{myPharmacy.address?.city || '—'}</p>
                <Link className="btn btn-outline-primary" to="/pharmacy/profile">Edit Profile</Link>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-2">Quick Links</h5>
                <div className="d-flex gap-2 flex-wrap">
                  <Link className="btn btn-outline-secondary" to="/pharmacy/products">Products</Link>
                  <Link className="btn btn-outline-secondary" to="/pharmacy/orders">Orders</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PharmacyDashboard
