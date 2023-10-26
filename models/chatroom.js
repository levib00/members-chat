const mongoose = require('mongoose');

const { Schema } = mongoose;

const AdminSchema = new Schema({

  roomName: {
    type: String, required: true,
  },
  isPublic: {
    type: Boolean, required: true,
  },
  password: {
    type: String, required: true,
  },
});

// Export model.
module.exports = mongoose.model('admin', AdminSchema);
