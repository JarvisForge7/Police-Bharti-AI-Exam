const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // युझर ट्रॅक करण्यासाठी
  paperId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paper', required: true },
  timeLeftSeconds: { type: Number, required: true }, // Resume करण्यासाठी शिल्लक वेळ
  questionsOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }], // रँडम ऑर्डर सेव्ह ठेवण्यासाठी
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selectedOption: { type: Number, default: null }, // युझरने निवडलेले उत्तर
    status: { type: String, enum: ['Skipped', 'Answered', 'MarkForReview'], default: 'Skipped' },
    isBookmarked: { type: Boolean, default: false }
  }],
  isSubmitted: { type: Boolean, default: false },
  finalScore: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Progress', ProgressSchema);