const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  studentId: { type: String, unique: true, sparse: true }, // only for students
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin','student'], required: true },
  department: { type: String },
  address: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
