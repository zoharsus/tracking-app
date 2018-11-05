const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  seller: { type: String, required: true },
  tracking: { type: String, required: true },
  status: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  expectedDate: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true}
});

module.exports = mongoose.model('Post', postSchema);
