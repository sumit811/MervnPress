const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  }, // e.g., 'hello-world' or 'about-us'
  
  content: { 
    type: String, 
    required: true 
  },
  
  type: { 
    type: String, 
    enum: ['post', 'page'], 
    default: 'post',
    required: true 
  }, // Differentiates a blog post from a static page
  
  category: { 
    type: String, 
    default: 'Uncategorized' 
  }, // Relevant for posts, optional for pages
  
  status: { 
    type: String, 
    enum: ['publish', 'draft', 'trash'], 
    default: 'draft' 
  },
  
  // WordPress-style meta custom fields storage
  meta: [{
    key: String,
    value: String
  }]

}, { 
  timestamps: true // Automatically manages createdAt and updatedAt fields
});

// Indexing for rapid lookups
postSchema.index({ slug: 1, type: 1 });

module.exports = mongoose.model('Post', postSchema);