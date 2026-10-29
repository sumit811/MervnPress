const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

const getTypeFilter = (type) => {
  if (type === undefined) return {};
  if (type === 'post' || type === 'page') return { type };
  return null;
};

// 1. GET all published posts (for the public Blog frontend)
router.get('/posts', async (req, res) => {
  const typeFilter = getTypeFilter(req.query.type);
  if (typeFilter === null) {
    return res.status(400).json({ error: 'type must be either post or page' });
  }

  try {
    const posts = await Post.find({ status: 'publish', ...typeFilter }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET all posts (for the Admin frontend dashboard - including drafts)
router.get('/admin/posts', async (req, res) => {
  const typeFilter = getTypeFilter(req.query.type);
  if (typeFilter === null) {
    return res.status(400).json({ error: 'type must be either post or page' });
  }

  try {
    const posts = await Post.find(typeFilter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST create a new blog post (from Admin dashboard)
router.post('/admin/posts', async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. PUT/PATCH update an existing post or page
const updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

router.put('/admin/posts/:id', updatePost);
router.patch('/admin/posts/:id', updatePost);

router.delete('/admin/posts/:id', async (req, res) => {
  try {
    const post = req.query.force === 'true'
      ? await Post.findByIdAndDelete(req.params.id)
      : await Post.findByIdAndUpdate(req.params.id, { status: 'trash' }, { new: true });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;