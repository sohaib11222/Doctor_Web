import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import { getPharmacySetupStatus } from '../../api/pharmacy'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * A server-backed checklist: it intentionally cannot be dismissed while a
 * required account step is incomplete, and automatically disappears as soon
 * as the persisted profile/subscription state is complete.
 */
const PharmacySetupModal = () => {
  const { user } = useAuth()
  const { translateText: tr } = useLanguage()
  const location = useLocation()
  const role = String(user?.role || '').toUpperCase()
  const enabled = role === 'PHARMACY' || role === 'PARAPHARMACY'
  const { data } = useQuery({
    queryKey: ['pharmacy-setup-status'],
    queryFn: getPharmacySetupStatus,
    enabled,
    refetchInterval: enabled ? 20000 : false,
  })
  const outer = data?.data ?? data
  const setup = outer?.data ?? outer
  // The checklist has to be persistent, but it must not block the very pages
  // that satisfy it. The status query makes it reappear only if a required
  // persisted step is still incomplete after the user leaves those pages.
  const completingProfile = location.pathname === '/pharmacy/profile'
  const completingSubscription = location.pathname === '/pharmacy/subscription-plans'
  if (!enabled || !setup || setup.isSetupComplete || completingProfile || completingSubscription) return null
  const isParapharmacy = role === 'PARAPHARMACY'
  const requirements = Array.isArray(setup.requirements) ? setup.requirements : []

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />
      <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} role="dialog" aria-modal="true" aria-label={tr('Complete setup')}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content border-0 shadow-lg overflow-hidden">
            <div className="p-4 text-white" style={{ background: 'linear-gradient(135deg, #095f78, #148c83)' }}>
              <div className="d-flex align-items-center gap-3">
                <span className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 50, height: 50, background: 'rgba(255,255,255,.16)' }}><i className="fa-solid fa-store" /></span>
                <div><h4 className="mb-1">{tr(isParapharmacy ? 'Finish setting up your Parapharmacy' : 'Finish setting up your Pharmacy')}</h4><div className="small" style={{ opacity: .9 }}>{tr('Complete these secure account steps to begin serving patients.')}</div></div>
              </div>
            </div>
            <div className="modal-body p-4">
              <div className="d-grid gap-3">
                {requirements.map((requirement) => (
                  <div key={requirement.key} className="d-flex align-items-center gap-3 border rounded-3 p-3">
                    <span className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${requirement.complete ? 'bg-success text-white' : 'bg-light text-muted'}`} style={{ width: 38, height: 38 }}><i className={`fa-solid ${requirement.complete ? 'fa-check' : requirement.key === 'subscription' ? 'fa-crown' : 'fa-user-pen'}`} /></span>
                    <div className="flex-grow-1"><div className="fw-semibold">{tr(requirement.label)}</div><div className={`small ${requirement.complete ? 'text-success' : 'text-muted'}`}>{tr(requirement.complete ? 'Completed' : 'Required to activate your account')}</div></div>
                    {!requirement.complete && <Link to={requirement.key === 'subscription' ? '/pharmacy/subscription-plans' : '/pharmacy/profile'} className="btn btn-sm btn-outline-primary">{tr('Open')}</Link>}
                  </div>
                ))}
              </div>
              <div className="alert alert-light border mt-4 mb-0 small"><i className="fa-solid fa-circle-info me-2 text-primary" />{tr(isParapharmacy ? 'Complete your profile to unlock your storefront.' : 'Your storefront unlocks after your profile and subscription are active.')}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PharmacySetupModal
