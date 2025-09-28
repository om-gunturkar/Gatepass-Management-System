const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const { JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

// Login route for both admin and students
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // Admin login by default creds
  if (username === ADMIN_USERNAME) {
    if (password !== ADMIN_PASSWORD) return res.status(401).json({ message: 'Invalid admin credentials' });
    // either create admin user in DB or just return token for admin
    // We'll create or find admin in DB and return token
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      const bcryptHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
      admin = await User.create({ name: 'Admin', passwordHash: bcryptHash, role: 'admin' });
    }
    const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: admin._id, name: admin.name, role: 'admin' }});
  }

  // Student login using studentId (username)
  const student = await User.findOne({ studentId: username, role: 'student' });
  if (!student) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, student.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: student._id, role: 'student' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: student._id, name: student.name, role: 'student', studentId: student.studentId }});
});

module.exports = router;
