// eslint-disable-next-line import/no-unresolved
const mongoose = require('mongoose');

const { Schema } = mongoose;

const PassphraseSchema = new Schema({

  passphrase: {
    type: String, required: true,
  },
});

// Export model.
module.exports = mongoose.model('passphrase', PassphraseSchema);
