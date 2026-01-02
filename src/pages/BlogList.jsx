import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import * as blogApi from '../api/blog'

const BlogList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '')
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1)
  const limit = 12

  // Fetch published blog posts
  const { data: blogsData, isLoading, error } = useQuery({
    queryKey: ['publicBlogPosts', searchQuery, selectedTag, page],
    queryFn: async () => {
      const params = {
        page: page.toString(),
        limit: limit.toString(),
        isPublished: 'true', // Backend expects string "true" or "false"
        ...(searchQuery ? { search: searchQuery } : {}),
        ...(selectedTag ? { tags: selectedTag } : {}) // Backend expects comma-separated string
      }
      console.log('Fetching blogs with params:', params)
      const result = await blogApi.listBlogPosts(params)
      console.log('Blog API response:', result)
      return result
    },
    retry: 1
  })

  // Extract blogs and pagination from response
  const blogs = useMemo(() => {
    if (!blogsData) return []
    // Backend returns: { success: true, message: 'OK', data: { blogPosts: [...], pagination: {...} } }
    // API function returns: response.data (which is the above object)
    // So blogsData.data contains the actual data
    const responseData = blogsData.data || blogsData
    const blogPosts = responseData.blogPosts || []
    console.log('Extracted blogs:', blogPosts.length, 'blogs')
    return blogPosts
  }, [blogsData])

  const pagination = useMemo(() => {
    if (!blogsData) return null
    const responseData = blogsData.data || blogsData
    const paginationData = responseData.pagination || null
    console.log('Extracted pagination:', paginationData)
    return paginationData
  }, [blogsData])

  // Get all unique tags from blogs
  const allTags = useMemo(() => {
    const tagSet = new Set()
    blogs.forEach(blog => {
      if (blog.tags && Array.isArray(blog.tags)) {
        blog.tags.forEach(tag => tagSet.add(tag))
      }
    })
    return Array.from(tagSet).sort()
  }, [blogs])

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setSearchParams({ 
      ...(searchQuery ? { search: searchQuery } : {}),
      ...(selectedTag ? { tag: selectedTag } : {})
    })
  }

  // Handle tag filter
  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag)
    setPage(1)
    setSearchParams({ 
      ...(searchQuery ? { search: searchQuery } : {}),
      ...(tag && tag !== selectedTag ? { tag } : {})
    })
  }

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage)
    setSearchParams({ 
      page: newPage.toString(),
      ...(searchQuery ? { search: searchQuery } : {}),
      ...(selectedTag ? { tag: selectedTag } : {})
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Truncate content for preview
  const truncateContent = (content, maxLength = 150) => {
    if (!content) return ''
    const text = content.replace(/<[^>]*>/g, '') // Remove HTML tags
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
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
                <p className="mt-3 text-muted">Loading blog posts...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="alert alert-danger">
                <h5>Error Loading Blog Posts</h5>
                <p>{error.response?.data?.message || error.message || 'Failed to load blog posts'}</p>
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
        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="page-header">
              <h1 className="page-title">Blog</h1>
              <p className="text-muted">Read our latest articles and health tips</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="row mb-4">
          <div className="col-lg-8">
            <form onSubmit={handleSearch} className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                <i className="fa-solid fa-search me-2"></i>Search
              </button>
            </form>
          </div>
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <span className="fw-medium me-2">Filter by tags:</span>
                <button
                  type="button"
                  className={`btn btn-sm ${!selectedTag ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleTagClick('')}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`btn btn-sm ${selectedTag === tag ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="row">
          {blogs.length === 0 ? (
            <div className="col-12">
              <div className="card">
                <div className="card-body text-center py-5">
                  <i className="fa-solid fa-blog" style={{ fontSize: '64px', color: '#dee2e6' }}></i>
                  <h5 className="mt-3">No blog posts found</h5>
                  <p className="text-muted">
                    {searchQuery || selectedTag 
                      ? 'Try adjusting your search or filters' 
                      : 'No blog posts available at the moment'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            blogs.map((blog) => (
              <div key={blog._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 blog-card">
                  {blog.coverImage && (
                    <Link to={`/blog-details?id=${blog._id}`}>
                      <img
                        src={blog.coverImage}
                        className="card-img-top"
                        alt={blog.title}
                        style={{ height: '250px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/assets/img/blog/blog-placeholder.jpg'
                        }}
                      />
                    </Link>
                  )}
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="text-muted small">
                        <i className="fa-solid fa-calendar me-1"></i>
                        {formatDate(blog.publishedAt || blog.createdAt)}
                      </span>
                      {blog.authorId && (
                        <span className="text-muted small">
                          <i className="fa-solid fa-user me-1"></i>
                          {blog.authorId.fullName || 'Unknown Author'}
                        </span>
                      )}
                    </div>
                    <h5 className="card-title">
                      <Link to={`/blog-details?id=${blog._id}`} className="text-dark text-decoration-none">
                        {blog.title}
                      </Link>
                    </h5>
                    <p className="card-text text-muted flex-grow-1">
                      {truncateContent(blog.content, 120)}
                    </p>
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="mb-3">
                        {blog.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="badge bg-info me-1 mb-1">
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="text-muted small">+{blog.tags.length - 3} more</span>
                        )}
                      </div>
                    )}
                    <Link
                      to={`/blog-details?id=${blog._id}`}
                      className="btn btn-primary mt-auto"
                    >
                      Read More <i className="fa-solid fa-arrow-right ms-2"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="row mt-4">
            <div className="col-12">
              <nav aria-label="Blog pagination">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                    <li key={pageNum} className={`page-item ${pagination.page === pageNum ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${pagination.page === pagination.pages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
              <div className="text-center mt-2">
                <small className="text-muted">
                  Showing page {pagination.page} of {pagination.pages} ({pagination.total} total posts)
                </small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogList

