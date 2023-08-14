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
  user_name: {
    type: String, required: true, minLength: 8, maxLength: 32,
  },
  password: { // ! add encryption
    type: String, required: true, minLength: 8, maxLength: 32,
  },
  member_status: { // * Make false by default when posting new users.
    type: Boolean, required: true,
  },
});

// Export model.
module.exports = mongoose.model('user', UserSchema);
