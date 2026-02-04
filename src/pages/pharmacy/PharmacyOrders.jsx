import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import PharmacyOrders from '../doctor/PharmacyOrders'
import * as pharmacyApi from '../../api/pharmacy'
import { useAuth } from '../../contexts/AuthContext'

const PharmacyOrdersPage = () => {
  const { user } = useAuth()
  const userRole = user?.role?.toUpperCase()
  const isParapharmacy = userRole === 'PARAPHARMACY'

  const { data: subscriptionResponse, isLoading } = useQuery({
    queryKey: ['my-pharmacy-subscription'],
    queryFn: () => pharmacyApi.getMyPharmacySubscription(),
    enabled: !isParapharmacy,
  })

  const subscriptionData = subscriptionResponse?.data || subscriptionResponse
  const hasActiveSubscription = isParapharmacy ? true : Boolean(subscriptionData?.hasActiveSubscription)

  if (isLoading && !isParapharmacy) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!hasActiveSubscription) {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="mb-2">Subscription required</h5>
          <p className="text-muted mb-3">You need an active subscription to manage orders.</p>
          <Link className="btn btn-primary" to="/pharmacy/subscription-plans">View Subscription Plans</Link>
        </div>
      </div>
    )
  }

  return <PharmacyOrders />
}

export default PharmacyOrdersPage
