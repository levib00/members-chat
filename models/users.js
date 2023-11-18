// eslint-disable-next-line import/no-unresolved
const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: {
    type: String, required: true, minLength: 2, maxLength: 16,
  },
  lastName: {
    type: String, required: true, minLength: 2, maxLength: 16,
  },
  username: {
    type: String, required: true, minLength: 8, maxLength: 32,
  },
  password: {
    type: String, required: true,
  },
  isAdmin: {
    type: Boolean,
  },
  chatrooms: [{
    type: Schema.ObjectId, ref: 'user', required: true,
  }],
});

// Export model.
module.exports = mongoose.model('user', UserSchema);
