const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Please add the text that was converted'],
    trim: true
  },
  characterCount: {
    type: Number,
    required: true
  },
  creditsUsed: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  voiceType: {
    type: String,
    enum: ['standard', 'wavenet'],
    required: true
  },
  audioUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('History', HistorySchema);

