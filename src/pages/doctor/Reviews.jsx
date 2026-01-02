import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import * as reviewsApi from '../../api/reviews'
import * as profileApi from '../../api/profile'

const Reviews = () => {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const limit = 10

  // Fetch doctor profile for overall rating
  const { data: doctorProfile } = useQuery({
    queryKey: ['doctorProfile'],
    queryFn: () => profileApi.getDoctorProfile(),
    enabled: !!user
  })

  // Fetch reviews
  const { data: reviewsData, isLoading: reviewsLoading, error: reviewsError } = useQuery({
    queryKey: ['doctorReviews', page],
    queryFn: () => reviewsApi.getDoctorReviews({ page, limit }),
    enabled: !!user
  })

  // Extract reviews and pagination from response
  // API function returns: { reviews: [...], pagination: {...} }
  // Handle both structures in case response format differs
  const reviews = reviewsData?.reviews || reviewsData?.data?.reviews || []
  const pagination = reviewsData?.pagination || reviewsData?.data?.pagination || { page: 1, limit: 10, total: 0, pages: 1 }

  // Debug logging
  useEffect(() => {
    if (reviewsData) {
      console.log('Reviews Data:', reviewsData)
      console.log('Reviews:', reviews)
      console.log('Pagination:', pagination)
    }
    if (reviewsError) {
      console.error('Reviews Error:', reviewsError)
    }
  }, [reviewsData, reviewsError, reviews, pagination])
  const overallRating = doctorProfile?.data?.ratingAvg || 0
  const ratingCount = doctorProfile?.data?.ratingCount || 0

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Render stars
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<i key={i} className="fa-solid fa-star filled"></i>)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<i key={i} className="fa-solid fa-star-half filled"></i>)
      } else {
        stars.push(<i key={i} className="fa-solid fa-star"></i>)
      }
    }
    return stars
  }

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const totalPages = pagination.pages
    const currentPage = pagination.page

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first page, last page, current page, and pages around current
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push('...')
      }
      
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...')
      }
      
      pages.push(totalPages)
    }
    
    return pages
  }

  return (
    <>
      <div className="doc-review">
        <div className="dashboard-header">
          <div className="header-back">
            <h3>Reviews</h3>
          </div>
        </div>

        {/* Review Listing */}
        <ul className="comments-list">
          <li className="over-all-review">
            <div className="review-content">
              <div className="review-rate">
                <h5>Overall Rating</h5>
                <div className="star-rated">
                  <span>{overallRating.toFixed(1)}</span>
                  {renderStars(overallRating)}
                  <span className="ms-2 text-muted">({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})</span>
                </div>
              </div>
            </div>
          </li>

          {reviewsLoading ? (
            <li>
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading reviews...</span>
                </div>
              </div>
            </li>
          ) : reviewsError ? (
            <li>
              <div className="text-center py-5 text-danger">
                <p>Error loading reviews</p>
                <small>{reviewsError.response?.data?.message || reviewsError.message || 'Failed to load reviews'}</small>
              </div>
            </li>
          ) : reviews.length === 0 ? (
            <li>
              <div className="text-center py-5 text-muted">
                <p>No reviews yet</p>
                <small>Reviews from patients will appear here</small>
              </div>
            </li>
          ) : (
            reviews.map((review) => (
              <li key={review._id}>
                <div className="comments">
                  <div className="comment-head">
                    <div className="patinet-information">
                      <a href="javascript:void(0);">
                        <img 
                          src={review.patientId?.profileImage || '/assets/img/doctors-dashboard/profile-01.jpg'} 
                          alt={review.patientId?.fullName || 'Patient'} 
                          onError={(e) => {
                            e.target.src = '/assets/img/doctors-dashboard/profile-01.jpg'
                          }}
                        />
                      </a>
                      <div className="patient-info">
                        <h6>
                          <a href="javascript:void(0);">
                            {review.patientId?.fullName || 'Anonymous'}
                          </a>
                        </h6>
                        <span>{formatDate(review.createdAt)}</span>
                        {review.reviewType === 'APPOINTMENT' && (
                          <small className="d-block text-muted">Appointment Review</small>
                        )}
                      </div>
                    </div>
                    <div className="star-rated">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <div className="review-info">
                    {review.reviewText ? (
                      <p>{review.reviewText}</p>
                    ) : (
                      <p className="text-muted fst-italic">No comment provided</p>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
        {/* /Comment List */}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="pagination dashboard-pagination">
            <ul>
              <li>
                <a 
                  href="#" 
                  className={`page-link ${pagination.page === 1 ? 'disabled' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    if (pagination.page > 1) {
                      handlePageChange(pagination.page - 1)
                    }
                  }}
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </a>
              </li>
              {getPageNumbers().map((pageNum, index) => (
                <li key={index}>
                  {pageNum === '...' ? (
                    <a href="#" className="page-link">...</a>
                  ) : (
                    <a
                      href="#"
                      className={`page-link ${pagination.page === pageNum ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(pageNum)
                      }}
                    >
                      {pageNum}
                    </a>
                  )}
                </li>
              ))}
              <li>
                <a
                  href="#"
                  className={`page-link ${pagination.page === pagination.pages ? 'disabled' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    if (pagination.page < pagination.pages) {
                      handlePageChange(pagination.page + 1)
                    }
                  }}
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </a>
              </li>
            </ul>
          </div>
        )}
        {/* /Pagination */}
      </div>
    </>
  )
}

export default Reviews
