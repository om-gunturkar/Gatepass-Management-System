const express = require('express');
const router = express.Router();
const Gatepass = require('../models/Gatepass.js');
const { authMiddleware, requireRole } = require('../middleware/auth.js');

// Student apply for gatepass
router.post('/apply', authMiddleware, requireRole('student'), async (req, res) => {
  const { reason, outDate, inDate } = req.body;
  if (!reason || !outDate) return res.status(400).json({ message: 'Missing fields' });
  const gp = await Gatepass.create({
    student: req.user._id,
    reason,
    outDate,
    inDate
  });
  res.json({ gatepass: gp });
});

// Student retrieves own gatepasses
router.get('/my', authMiddleware, requireRole('student'), async (req, res) => {
  const passes = await Gatepass.find({ student: req.user._id }).sort({ createdAt: -1 });
  res.json({ passes });
});

module.exports = router;
