// eslint-disable-next-line import/no-unresolved
const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  first_name: {
    type: String, required: true, minLength: 2, maxLength: 16,
  },
  last_name: {
    type: String, required: true, minLength: 2, maxLength: 16,
  },
  username: {
    type: String, required: true, minLength: 8, maxLength: 32,
  },
  password: {
    type: String, required: true,
  },
  member_status: {
    type: Boolean, required: true,
  },
  isAdmin: {
    type: Boolean,
  },
});

// Export model.
module.exports = mongoose.model('user', UserSchema);
