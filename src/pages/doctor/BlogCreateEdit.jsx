import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as blogApi from '../../api/blog'
import api from '../../api/axios'

const BlogCreateEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const isEdit = !!id

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slug: '',
    coverImage: '',
    tags: [],
    isPublished: false,
    publishedAt: ''
  })
  const [tagInput, setTagInput] = useState('')
  const [coverImageFile, setCoverImageFile] = useState(null)
  const [coverImagePreview, setCoverImagePreview] = useState('')

  // Fetch blog post if editing
  const { data: blogData, isLoading: blogLoading } = useQuery({
    queryKey: ['blogPost', id],
    queryFn: () => blogApi.getBlogPostById(id),
    enabled: isEdit
  })

  // Initialize form data
  useEffect(() => {
    if (isEdit && blogData) {
      const blog = blogData.data || blogData
      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        slug: blog.slug || '',
        coverImage: blog.coverImage || '',
        tags: blog.tags || [],
        isPublished: blog.isPublished || false,
        publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString().split('T')[0] : ''
      })
      setCoverImagePreview(blog.coverImage || '')
    }
  }, [isEdit, blogData])

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEdit && formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title, isEdit])

  // Create/Update mutation
  const saveBlogMutation = useMutation({
    mutationFn: async (data) => {
      if (isEdit) {
        return blogApi.updateBlogPost(id, data)
      } else {
        return blogApi.createBlogPost(data)
      }
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries(['blogPosts'])
      queryClient.invalidateQueries(['blogPost', id])
      toast.success(isEdit ? 'Blog post updated successfully' : 'Blog post created successfully')
      navigate('/blog')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || `Failed to ${isEdit ? 'update' : 'create'} blog post`
      toast.error(errorMessage)
    }
  })

  // Handle cover image upload
  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (5 MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5 MB')
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      setCoverImageFile(file)
      setCoverImagePreview(URL.createObjectURL(file))

      try {
        // Upload image
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        uploadFormData.append('type', 'blog')

        const uploadResponse = await api.post('/upload/blog', uploadFormData)
        const responseData = uploadResponse.data || uploadResponse
        const relativeUrl = responseData.data?.url || responseData.url || responseData
        // Convert relative URL to full URL
        const apiBaseURL = import.meta.env.VITE_API_URL || 'http://157.180.108.156:4001/api'
        const baseURL = apiBaseURL.replace('/api', '')
        const imageUrl = relativeUrl.startsWith('http') ? relativeUrl : `${baseURL}${relativeUrl}`
        setFormData(prev => ({ ...prev, coverImage: imageUrl }))
        toast.success('Image uploaded successfully')
      } catch (error) {
        console.error('Error uploading image:', error)
        toast.error('Failed to upload image')
      }
    }
  }

  // Handle tag input
  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }))
      }
      setTagInput('')
    }
  }

  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }

    if (!formData.content.trim()) {
      toast.error('Content is required')
      return
    }

    if (formData.content.trim().length < 10) {
      toast.error('Content must be at least 10 characters')
      return
    }

    // Prepare data
    const submitData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      slug: formData.slug.trim() || undefined,
      coverImage: formData.coverImage || undefined,
      tags: formData.tags,
      isPublished: formData.isPublished,
      ...(formData.isPublished && formData.publishedAt
        ? { publishedAt: new Date(formData.publishedAt).toISOString() }
        : {})
    }

    saveBlogMutation.mutate(submitData)
  }

  if (isEdit && blogLoading) {
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
                  <h3>{isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}</h3>
                  <p className="text-muted mb-0">
                    {isEdit ? 'Update your blog post' : 'Share your knowledge with the community'}
                  </p>
                </div>
                <Link to="/blog" className="btn btn-outline-secondary">
                  <i className="fe fe-arrow-left me-2"></i>
                  Back to List
                </Link>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="card">
                <div className="card-body">
                  {/* Title */}
                  <div className="form-group mb-3">
                    <label className="form-label">Title <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter blog post title"
                      required
                    />
                  </div>

                  {/* Slug */}
                  <div className="form-group mb-3">
                    <label className="form-label">Slug</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="blog-post-slug (auto-generated from title)"
                    />
                    <small className="form-text text-muted">
                      URL-friendly version of the title (leave empty to auto-generate)
                    </small>
                  </div>

                  {/* Cover Image */}
                  <div className="form-group mb-3">
                    <label className="form-label">Cover Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                    />
                    {coverImagePreview && (
                      <div className="mt-2">
                        <img
                          src={coverImagePreview}
                          alt="Cover preview"
                          className="img-thumbnail"
                          style={{ maxHeight: '200px' }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger ms-2"
                          onClick={() => {
                            setCoverImagePreview('')
                            setFormData(prev => ({ ...prev, coverImage: '' }))
                            setCoverImageFile(null)
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="form-group mb-3">
                    <label className="form-label">Content <span className="text-danger">*</span></label>
                    <textarea
                      className="form-control"
                      rows="15"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your blog post content here..."
                      required
                    />
                    <small className="form-text text-muted">
                      Minimum 10 characters required
                    </small>
                  </div>

                  {/* Tags */}
                  <div className="form-group mb-3">
                    <label className="form-label">Tags</label>
                    <input
                      type="text"
                      className="form-control"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagInputKeyPress}
                      placeholder="Type a tag and press Enter"
                    />
                    {formData.tags.length > 0 && (
                      <div className="mt-2">
                        {formData.tags.map((tag, idx) => (
                          <span key={idx} className="badge badge-info me-2 mb-2">
                            {tag}
                            <button
                              type="button"
                              className="btn-close btn-close-white ms-2"
                              onClick={() => handleRemoveTag(tag)}
                              style={{ fontSize: '0.7em' }}
                            ></button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Publish Options */}
                  <div className="form-group mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="isPublished"
                        checked={formData.isPublished}
                        onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                      />
                      <label className="form-check-label" htmlFor="isPublished">
                        Publish this post
                      </label>
                    </div>
                    {formData.isPublished && (
                      <div className="mt-2">
                        <label className="form-label">Publish Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.publishedAt}
                          onChange={(e) => setFormData(prev => ({ ...prev, publishedAt: e.target.value }))}
                        />
                      </div>
                    )}
                  </div>

                  {/* Submit Buttons */}
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saveBlogMutation.isLoading}
                    >
                      {saveBlogMutation.isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          {isEdit ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        <>
                          <i className="fe fe-save me-2"></i>
                          {isEdit ? 'Update Post' : 'Create Post'}
                        </>
                      )}
                    </button>
                    <Link to="/blog" className="btn btn-outline-secondary">
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogCreateEdit

