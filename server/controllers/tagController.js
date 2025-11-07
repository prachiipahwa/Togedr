// server/controllers/tagController.js
const Tag = require('../models/Tag');

// @desc    Get all tags
// @route   GET /api/tags
exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find({});
    res.json(tags.map(tag => tag.name));
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a new tag
// @route   POST /api/tags
exports.addTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Tag name is required' });
    }
    
    // Find or create the tag to prevent duplicates
    const tag = await Tag.findOneAndUpdate(
      { name: { $regex: new RegExp(`^${name}$`, 'i') } }, // Case-insensitive find
      { $setOnInsert: { name } }, // Set name only on insert
      { upsert: true, new: true } // Create if it doesn't exist
    );

    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};