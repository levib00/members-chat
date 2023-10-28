const mongoose = require('mongoose');

const { Schema } = mongoose;

const MessageSchema = new Schema({
  title: {
    type: String, required: true, minLength: 1, maxLength: 100,
  },
  content: {
    type: String, required: true, minLength: 1, maxLength: 300,
  },
  username: {
    type: Schema.ObjectId, ref: 'user', required: true,
  },
  timestamp: {
    type: Date, required: true,
  },
  roomId: {
    type: Schema.ObjectId, ref: 'chatroom', required: true,
  },
});

// Export model.
module.exports = mongoose.model('message', MessageSchema);
