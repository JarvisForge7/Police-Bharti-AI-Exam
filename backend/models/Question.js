const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }], // ४ पर्याय
  correctOptionIndex: { type: Number, required: true }, // ० ते ३ पैकी एक
  subject: { type: String, required: true }, // मराठी, गणित, बुद्धिमत्ता, चालू घडामोडी
  district: { type: String, default: 'General' }, // पुणे, ठाणे, इ.
  year: { type: Number }, // २०२६, २०२४ इ.
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  questionType: { type: String, default: 'MCQ' }
});

module.exports = mongoose.model('Question', QuestionSchema);