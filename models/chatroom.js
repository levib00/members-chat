const mongoose = require('mongoose');

const { Schema } = mongoose;

const ChatroomSchema = new Schema({

  roomName: {
    type: String, required: true, minLength: 3, maxLength: 64,
  },
  isPublic: {
    type: Boolean, required: true,
  },
  password: {
    type: String, minLength: 8, maxLength: 64,
  },
  createdBy: {
    type: Schema.ObjectId, ref: 'user', required: true,
  },
});

// Export model.
module.exports = mongoose.model('chatroom', ChatroomSchema);
