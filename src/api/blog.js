import axios from './axios'

/**
 * Get list of blog posts
 * @param {Object} params - Query parameters (authorId, isPublished, tags, search, page, limit)
 * @returns {Promise<Object>} Blog posts and pagination info
 */
export const listBlogPosts = async (params = {}) => {
  const response = await axios.get('/blog', { params })
  return response.data
}

/**
 * Get blog post by ID
 * @param {string} id - Blog post ID
 * @returns {Promise<Object>} Blog post details
 */
export const getBlogPostById = async (id) => {
  const response = await axios.get(`/blog/${id}`)
  return response.data
}

/**
 * Create blog post
 * @param {Object} data - Blog post data (title, content, slug, coverImage, tags, isPublished, publishedAt)
 * @returns {Promise<Object>} Created blog post
 */
export const createBlogPost = async (data) => {
  const response = await axios.post('/blog', data)
  return response.data
}

/**
 * Update blog post
 * @param {string} id - Blog post ID
 * @param {Object} data - Update data (title, content, slug, coverImage, tags, isPublished, publishedAt)
 * @returns {Promise<Object>} Updated blog post
 */
export const updateBlogPost = async (id, data) => {
  const response = await axios.put(`/blog/${id}`, data)
  return response.data
}

/**
 * Delete blog post
 * @param {string} id - Blog post ID
 * @returns {Promise<Object>} Success response
 */
export const deleteBlogPost = async (id) => {
  const response = await axios.delete(`/blog/${id}`)
  return response.data
}

