const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const Gatepass = require('../models/Gatepass.js');
const { authMiddleware, requireRole } = require('../middleware/auth.js');

// Create student account
router.post('/students', authMiddleware, requireRole('admin'), async (req, res) => {
  const { name, studentId, password, department, address } = req.body;
  if (!studentId || !password || !name) return res.status(400).json({ message: 'Missing fields' });
  const existing = await User.findOne({ studentId });
  if (existing) return res.status(400).json({ message: 'Student ID already exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  const student = await User.create({ name, studentId, passwordHash, role: 'student', department, address });
  res.json({ student });
});

// Get all students
router.get('/students', authMiddleware, requireRole('admin'), async (req, res) => {
  const students = await User.find({ role: 'student' }).select('-passwordHash');
  res.json({ students });
});

// Get pending gatepasses
router.get('/gatepasses/pending', authMiddleware, requireRole('admin'), async (req, res) => {
  const pending = await Gatepass.find({ status: 'pending' }).populate('student', 'name studentId department address');
  res.json({ pending });
});

// Approve or reject
router.post('/gatepasses/:id/decide', authMiddleware, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { action, remarks } = req.body; // action: 'approve' or 'reject'
  if (!['approve','reject'].includes(action)) return res.status(400).json({ message: 'Invalid action' });
  const gp = await Gatepass.findById(id);
  if (!gp) return res.status(404).json({ message: 'Not found' });
  gp.status = action === 'approve' ? 'approved' : 'rejected';
  gp.adminRemarks = remarks;
  await gp.save();
  res.json({ gatepass: gp });
});

module.exports = router;
