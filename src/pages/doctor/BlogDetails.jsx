import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import * as blogApi from '../../api/blog'

const BlogDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Fetch blog post
  const { data: blogData, isLoading, error } = useQuery({
    queryKey: ['blogPost', id],
    queryFn: () => blogApi.getBlogPostById(id)
  })

  // Extract blog from response
  const blog = blogData?.data || blogData

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="content doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              {/* DoctorSidebar will be rendered by DashboardLayout */}
            </div>
            <div className="col-lg-12 col-xl-12">
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="content doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              {/* DoctorSidebar will be rendered by DashboardLayout */}
            </div>
            <div className="col-lg-12 col-xl-12">
              <div className="card">
                <div className="card-body text-center py-5">
                  <i className="fe fe-alert-circle" style={{ fontSize: '64px', color: '#dee2e6' }}></i>
                  <h5 className="mt-3">Blog post not found</h5>
                  <p className="text-muted">The blog post you're looking for doesn't exist or has been deleted.</p>
                  <Link to="/blog" className="btn btn-primary mt-3">
                    Back to Blog Posts
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const author = blog.authorId

  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* DoctorSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            {/* Back Button */}
            <div className="mb-3">
              <Link to="/blog" className="btn btn-outline-secondary">
                <i className="fe fe-arrow-left me-2"></i>
                Back to Blog Posts
              </Link>
            </div>

            {/* Blog Post */}
            <article className="card">
              {blog.coverImage && (
                <img
                  src={blog.coverImage}
                  className="card-img-top"
                  alt={blog.title}
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                {/* Header */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h1 className="card-title mb-2">{blog.title}</h1>
                      <div className="d-flex align-items-center gap-3 text-muted">
                        {author && (
                          <div className="d-flex align-items-center">
                            <img
                              src={author.profileImage || '/assets/img/doctors/doctor-thumb-01.jpg'}
                              alt={author.fullName}
                              className="rounded-circle me-2"
                              style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = '/assets/img/doctors/doctor-thumb-01.jpg'
                              }}
                            />
                            <span>{author.fullName}</span>
                          </div>
                        )}
                        <span>•</span>
                        <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                        {blog.isPublished && (
                          <>
                            <span>•</span>
                            <span className="badge badge-success">Published</span>
                          </>
                        )}
                        {!blog.isPublished && (
                          <>
                            <span>•</span>
                            <span className="badge badge-warning">Draft</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <Link
                        to={`/blog/edit/${blog._id}`}
                        className="btn btn-outline-primary"
                      >
                        <i className="fe fe-edit me-2"></i>
                        Edit
                      </Link>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="mb-3">
                      {blog.tags.map((tag, idx) => (
                        <span key={idx} className="badge badge-info me-2">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="blog-content">
                  <div
                    dangerouslySetInnerHTML={{ __html: blog.content?.replace(/\n/g, '<br />') }}
                  />
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-top">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted small">
                      Created: {formatDate(blog.createdAt)}
                      {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                        <> • Updated: {formatDate(blog.updatedAt)}</>
                      )}
                    </div>
                    <div>
                      <Link to="/blog" className="btn btn-outline-secondary btn-sm me-2">
                        Back to List
                      </Link>
                      <Link
                        to={`/blog/edit/${blog._id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Edit Post
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetails

