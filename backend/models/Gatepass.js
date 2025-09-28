const mongoose = require('mongoose');

const gatepassSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  outDate: { type: Date, required: true },
  inDate: { type: Date }, // optional expected return
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  adminRemarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Gatepass', gatepassSchema);
