// server/seedTags.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tag = require('./models/Tag');

dotenv.config();

const predefinedTags = [
  'Football',
  'Study',
  'Coffee',
  'Gaming',
  'Walk',
  'Music',
  'Art',
  'Coding',
  'Movies',
  'Hiking'
];

const seedTags = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Using findOneAndUpdate with upsert prevents creating duplicates
    for (const tagName of predefinedTags) {
      await Tag.findOneAndUpdate(
        { name: tagName },
        { $setOnInsert: { name: tagName } },
        { upsert: true }
      );
    }

    console.log('✅ Tags have been successfully seeded!');
  } catch (error) {
    console.error('Error seeding tags:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

seedTags();