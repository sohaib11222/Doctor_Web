import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as prescriptionApi from '../../api/productPrescriptionRequest'
import { getImageUrl } from '../../utils/imageUtils'
import { useLanguage } from '../../contexts/LanguageContext'

const unwrap = (response) => {
  const outer = response?.data ?? response
  return outer?.data ?? outer ?? {}
}

const PharmacyPrescriptionRequests = () => {
  const { translateText: tr, formatDate, language } = useLanguage()
  const client = useQueryClient()
  const [filter, setFilter] = useState('PENDING')
  const [reviewing, setReviewing] = useState(null)
  const [notes, setNotes] = useState('')
  const query = useQuery({ queryKey: ['seller-product-prescription-requests', filter, language], queryFn: () => prescriptionApi.getSellerProductPrescriptionRequests({ status: filter }), refetchInterval: 8000 })
  const requests = Array.isArray(unwrap(query.data)?.requests) ? unwrap(query.data).requests : []
  const review = useMutation({
    mutationFn: ({ id, status }) => prescriptionApi.reviewProductPrescriptionRequest(id, { status, reviewNotes: notes }),
    onSuccess: () => {
      toast.success(tr('Prescription request reviewed'))
      setReviewing(null)
      setNotes('')
      client.invalidateQueries({ queryKey: ['seller-product-prescription-requests'] })
      client.invalidateQueries({ queryKey: ['pending-product-prescriptions'] })
    },
    onError: (error) => toast.error(tr(error.response?.data?.message || error.message || 'Review failed')),
  })

  return <div>
    <div className="dashboard-header d-flex align-items-center justify-content-between flex-wrap gap-2"><div><h3>{tr('Prescription requests')}</h3><p className="text-muted mb-0">{tr('Review prescription-required product purchases before patients can check out.')}</p></div><select className="form-select" style={{ width: 'auto' }} value={filter} onChange={(event) => setFilter(event.target.value)} aria-label={tr('Status')}><option value="PENDING">{tr('PENDING')}</option><option value="APPROVED">{tr('APPROVED')}</option><option value="REJECTED">{tr('REJECTED')}</option><option value="ALL">{tr('All')}</option></select></div>
    <div className="card"><div className="card-body p-0"><div className="table-responsive"><table className="table align-middle mb-0"><thead><tr><th>{tr('Patient')}</th><th>{tr('Product')}</th><th>{tr('Prescription')}</th><th>{tr('Status')}</th><th>{tr('Submitted')}</th><th /></tr></thead><tbody>{query.isLoading ? <tr><td colSpan="6" className="text-center py-4"><span className="spinner-border spinner-border-sm" /></td></tr> : !requests.length ? <tr><td colSpan="6" className="text-center text-muted py-4">{tr('No prescription requests.')}</td></tr> : requests.map((request) => <tr key={request._id}><td><strong>{request.patientId?.fullName || tr('Patient')}</strong><div className="small text-muted">{request.patientId?.email}</div></td><td><div className="d-flex align-items-center gap-2"><img src={getImageUrl(request.productId?.images?.[0], '/assets/img/products/product.jpg')} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} /><div>{request.productId?.name || tr('Product')}{request.productId?.selectedVariant?.name && <div className="small text-muted">{request.productId.selectedVariant.name}</div>}</div></div></td><td><a className="btn btn-sm btn-outline-primary" target="_blank" rel="noreferrer" href={getImageUrl(request.prescriptionUrl)}>{tr('View file')}</a></td><td><span className={`badge ${request.status === 'APPROVED' ? 'bg-success' : request.status === 'REJECTED' ? 'bg-danger' : 'bg-warning text-dark'}`}>{tr(request.status)}</span></td><td>{formatDate(request.createdAt)}</td><td>{request.status === 'PENDING' && <button className="btn btn-sm btn-primary" onClick={() => { setReviewing(request); setNotes('') }}>{tr('Review')}</button>}</td></tr>)}</tbody></table></div></div></div>
    {reviewing && <><div className="modal-backdrop fade show" /><div className="modal fade show d-block" role="dialog" aria-modal="true" aria-label={tr('Review prescription')}><div className="modal-dialog modal-dialog-centered"><div className="modal-content"><div className="modal-header"><h5 className="modal-title">{tr('Review prescription')}</h5><button className="btn-close" aria-label={tr('Close')} onClick={() => setReviewing(null)} /></div><div className="modal-body"><p>{tr('Review the submitted prescription for')} <strong>{reviewing.productId?.name || tr('Product')}</strong>.</p><label className="form-label">{tr('Notes for patient (required when rejecting)')}</label><textarea className="form-control" rows="3" value={notes} onChange={(event) => setNotes(event.target.value)} /></div><div className="modal-footer"><button className="btn btn-outline-danger" disabled={review.isPending} onClick={() => { if (!notes.trim()) { toast.error(tr('Please explain why the prescription was not approved.')); return } review.mutate({ id: reviewing._id, status: 'REJECTED' }) }}>{tr('Reject')}</button><button className="btn btn-success" disabled={review.isPending} onClick={() => review.mutate({ id: reviewing._id, status: 'APPROVED' })}>{tr('Approve purchase')}</button></div></div></div></div></>}
  </div>
}

export default PharmacyPrescriptionRequests
