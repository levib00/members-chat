// eslint-disable-next-line import/no-unresolved
const mongoose = require('mongoose');

const { Schema } = mongoose;

const AdminSchema = new Schema({

  admin: {
    type: String, required: true,
  },
});

// Export model.
module.exports = mongoose.model('admin', AdminSchema);