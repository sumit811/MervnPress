const express = require('express');
const Post = require('../models/Post');

const router = express.Router();

router.patch('/', async (req, res) => {
  const body = req.body || {};
  const oldName = typeof body.oldName === 'string' ? body.oldName.trim() : '';
  const newName = typeof body.newName === 'string' ? body.newName.trim() : '';

  if (!oldName || !newName) {
    return res.status(400).json({ error: 'oldName and newName are required' });
  }

  if (oldName === newName) {
    return res.status(400).json({ error: 'newName must be different from oldName' });
  }

  try {
    const result = await Post.updateMany({ category: oldName }, { $set: { category: newName } });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ oldName, newName, updatedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;