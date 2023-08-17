// eslint-disable-next-line import/no-unresolved
const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const MessageSchema = new Schema({
  title: {
    type: String, required: true, minLength: 3, maxLength: 100,
  },
  content: {
    type: String, required: true, minLength: 3, maxLength: 300,
  },
  user: {
    type: Schema.ObjectId, ref: 'manufacturer', required: true,
  },
  timestamp: {
    type: Timestamp, required: true,
  },
});

// Export model.
module.exports = mongoose.model('message', MessageSchema);
