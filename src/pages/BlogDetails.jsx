import { useMemo } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import * as blogApi from '../api/blog'

const BlogDetails = () => {
  const [searchParams] = useSearchParams()
  const blogId = searchParams.get('id')
  const navigate = useNavigate()

  // Fetch blog post
  const { data: blogData, isLoading, error } = useQuery({
    queryKey: ['publicBlogPost', blogId],
    queryFn: () => blogApi.getBlogPostById(blogId),
    enabled: !!blogId,
    retry: 1
  })

  // Extract blog from response
  const blog = blogData?.data || blogData

  // Fetch related blog posts (same author or tags)
  const { data: relatedBlogsData } = useQuery({
    queryKey: ['relatedBlogPosts', blogId, blog?.authorId?._id],
    queryFn: () => {
      if (!blog) return { blogPosts: [] }
      
      const params = {
        page: 1,
        limit: 4, // Get 4 to filter out current one
        isPublished: true,
        ...(blog.authorId ? { authorId: blog.authorId._id || blog.authorId } : {})
      }
      return blogApi.listBlogPosts(params)
    },
    enabled: !!blog && !!blogId && !!blog.authorId
  })

  // Extract related blogs
  const relatedBlogs = useMemo(() => {
    if (!relatedBlogsData) return []
    const responseData = relatedBlogsData.data || relatedBlogsData
    const blogs = responseData.blogPosts || []
    // Filter out current blog
    return blogs.filter(b => b._id !== blogId).slice(0, 3)
  }, [relatedBlogsData, blogId])

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

  // Format content (preserve HTML but sanitize)
  const formatContent = (content) => {
    if (!content) return ''
    // Replace newlines with <br> and preserve basic HTML
    return content.replace(/\n/g, '<br />')
  }

  if (isLoading) {
    return (
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading blog post...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="alert alert-danger">
                <h5>Blog Post Not Found</h5>
                <p>{error?.response?.data?.message || error?.message || 'The blog post you are looking for does not exist or has been removed.'}</p>
                <Link to="/blog-list" className="btn btn-primary mt-3">
                  <i className="fa-solid fa-arrow-left me-2"></i>Back to Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Only show published posts to public
  if (!blog.isPublished) {
    return (
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="alert alert-warning">
                <h5>Blog Post Not Available</h5>
                <p>This blog post is not published yet.</p>
                <Link to="/blog-list" className="btn btn-primary mt-3">
                  <i className="fa-solid fa-arrow-left me-2"></i>Back to Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            {/* Back Button */}
            <div className="mb-3">
              <Link to="/blog-list" className="btn btn-outline-primary">
                <i className="fa-solid fa-arrow-left me-2"></i>Back to Blog
              </Link>
            </div>

            {/* Blog Post */}
            <article className="blog-post">
              {/* Cover Image */}
              {blog.coverImage && (
                <div className="blog-cover-image mb-4">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="img-fluid rounded"
                    style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = '/assets/img/blog/blog-placeholder.jpg'
                    }}
                  />
                </div>
              )}

              {/* Header */}
              <header className="blog-header mb-4">
                <h1 className="blog-title mb-3">{blog.title}</h1>
                <div className="blog-meta d-flex flex-wrap gap-3 align-items-center text-muted">
                  <span>
                    <i className="fa-solid fa-calendar me-2"></i>
                    {formatDate(blog.publishedAt || blog.createdAt)}
                  </span>
                  {blog.authorId && (
                    <span>
                      <i className="fa-solid fa-user me-2"></i>
                      By {blog.authorId.fullName || 'Unknown Author'}
                    </span>
                  )}
                  {blog.authorId?.profileImage && (
                    <img
                      src={blog.authorId.profileImage}
                      alt={blog.authorId.fullName}
                      className="rounded-circle"
                      style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                    />
                  )}
                </div>
              </header>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="blog-tags mb-4">
                  {blog.tags.map((tag, idx) => (
                    <span key={idx} className="badge bg-info me-2 mb-2">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="blog-content">
                <div
                  dangerouslySetInnerHTML={{ __html: formatContent(blog.content) }}
                  style={{ 
                    lineHeight: '1.8',
                    fontSize: '1.1rem'
                  }}
                />
              </div>

              {/* Footer */}
              <div className="blog-footer mt-5 pt-4 border-top">
                <div className="d-flex justify-content-between align-items-center">
                  <Link to="/blog-list" className="btn btn-outline-primary">
                    <i className="fa-solid fa-arrow-left me-2"></i>Back to Blog
                  </Link>
                  <div className="text-muted">
                    <small>Published on {formatDate(blog.publishedAt || blog.createdAt)}</small>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="blog-sidebar">
              {/* Author Info */}
              {blog.authorId && (
                <div className="card mb-4">
                  <div className="card-body text-center">
                    {blog.authorId.profileImage && (
                      <img
                        src={blog.authorId.profileImage}
                        alt={blog.authorId.fullName}
                        className="rounded-circle mb-3"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                    )}
                    <h5>{blog.authorId.fullName || 'Unknown Author'}</h5>
                    {blog.authorId.email && (
                      <p className="text-muted small mb-0">{blog.authorId.email}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Related Posts */}
              {relatedBlogs.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">Related Posts</h5>
                  </div>
                  <div className="card-body">
                    {relatedBlogs.map((relatedBlog) => (
                      <div key={relatedBlog._id} className="mb-3 pb-3 border-bottom">
                        <Link 
                          to={`/blog-details?id=${relatedBlog._id}`}
                          className="text-dark text-decoration-none"
                        >
                          <h6 className="mb-2">{relatedBlog.title}</h6>
                        </Link>
                        <small className="text-muted">
                          {formatDate(relatedBlog.publishedAt || relatedBlog.createdAt)}
                        </small>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetails

