const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'User must have email'],
  },
  title: {
    type: String,
    required: [true, 'User must have title'],
  },
  notes: {
    type: String,
    required: [true, 'User must have notes'],
  },
});

const Notes = mongoose.model('Notes', noteSchema);

module.exports = Notes;
