import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as blogApi from '../../api/blog'

const BlogList = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all') // all, published, draft
  const [page, setPage] = useState(1)
  const limit = 10

  // Fetch blog posts
  const { data: blogsData, isLoading, error } = useQuery({
    queryKey: ['blogPosts', user?._id, filter, searchQuery, page],
    queryFn: () => {
      const params = {
        page,
        limit,
        authorId: user?._id, // Filter by current doctor
        ...(filter === 'published' ? { isPublished: true } : filter === 'draft' ? { isPublished: false } : {}),
        ...(searchQuery ? { search: searchQuery } : {})
      }
      return blogApi.listBlogPosts(params)
    },
    enabled: !!user
  })

  // Delete blog mutation
  const deleteBlogMutation = useMutation({
    mutationFn: (id) => blogApi.deleteBlogPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogPosts'])
      toast.success('Blog post deleted successfully')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete blog post'
      toast.error(errorMessage)
    }
  })

  // Extract blogs from response
  const blogs = useMemo(() => {
    if (!blogsData) return []
    const responseData = blogsData.data || blogsData
    return responseData.blogPosts || []
  }, [blogsData])

  const pagination = useMemo(() => {
    if (!blogsData) return null
    const responseData = blogsData.data || blogsData
    return responseData.pagination || null
  }, [blogsData])

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  // Handle delete
  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteBlogMutation.mutate(id)
    }
  }

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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

  if (error) {
    console.error('Error loading blogs:', error)
  }

  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* DoctorSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            <div className="dashboard-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3>My Blog Posts</h3>
                  <p className="text-muted mb-0">Manage your blog posts</p>
                </div>
                <Link to="/blog/create" className="btn btn-primary">
                  <i className="fe fe-plus me-2"></i>
                  Create New Post
                </Link>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="input-block dash-search-input">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search blog posts..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          setPage(1)
                        }}
                      />
                      <span className="search-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex gap-2">
                      <button
                        className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => {
                          setFilter('all')
                          setPage(1)
                        }}
                      >
                        All
                      </button>
                      <button
                        className={`btn btn-sm ${filter === 'published' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => {
                          setFilter('published')
                          setPage(1)
                        }}
                      >
                        Published
                      </button>
                      <button
                        className={`btn btn-sm ${filter === 'draft' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => {
                          setFilter('draft')
                          setPage(1)
                        }}
                      >
                        Drafts
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Blog Posts List */}
            <div className="row">
              {blogs.length === 0 ? (
                <div className="col-12">
                  <div className="card">
                    <div className="card-body text-center py-5">
                      <i className="fe fe-file-text" style={{ fontSize: '64px', color: '#dee2e6' }}></i>
                      <h5 className="mt-3">No blog posts found</h5>
                      <p className="text-muted">
                        {searchQuery ? 'Try adjusting your search' : 'Create your first blog post to get started'}
                      </p>
                      {!searchQuery && (
                        <Link to="/blog/create" className="btn btn-primary mt-3">
                          <i className="fe fe-plus me-2"></i>
                          Create New Post
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                blogs.map((blog) => (
                  <div key={blog._id} className="col-md-6 col-lg-4 mb-4">
                    <div className="card h-100">
                      {blog.coverImage && (
                        <img
                          src={blog.coverImage}
                          className="card-img-top"
                          alt={blog.title}
                          style={{ height: '200px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      )}
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className={`badge ${blog.isPublished ? 'badge-success' : 'badge-warning'}`}>
                            {blog.isPublished ? 'Published' : 'Draft'}
                          </span>
                          <span className="text-muted small">
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </span>
                        </div>
                        <h5 className="card-title">
                          <Link to={`/blog/${blog._id}`} className="text-dark">
                            {blog.title}
                          </Link>
                        </h5>
                        <p className="card-text text-muted flex-grow-1">
                          {blog.content?.substring(0, 150)}...
                        </p>
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="mb-2">
                            {blog.tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="badge badge-info me-1">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="d-flex gap-2 mt-auto">
                          <Link
                            to={`/blog/${blog._id}`}
                            className="btn btn-sm btn-primary flex-grow-1"
                          >
                            View
                          </Link>
                          <Link
                            to={`/blog/edit/${blog._id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className="fe fe-edit"></i>
                          </Link>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(blog._id, blog.title)}
                            disabled={deleteBlogMutation.isLoading}
                          >
                            <i className="fe fe-trash-2"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <nav>
                  <ul className="pagination">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                      let pageNum
                      if (pagination.pages <= 5) {
                        pageNum = i + 1
                      } else if (page <= 3) {
                        pageNum = i + 1
                      } else if (page >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i
                      } else {
                        pageNum = page - 2 + i
                      }
                      return (
                        <li key={pageNum} className={`page-item ${page === pageNum ? 'active' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </button>
                        </li>
                      )
                    })}
                    {pagination.pages > 5 && page < pagination.pages - 2 && (
                      <li>
                        <span className="page-link">...</span>
                      </li>
                    )}
                    <li className={`page-item ${page === pagination.pages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === pagination.pages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogList

