const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const app        = express();

app.use(bodyParser.json());

// ── Connect to MongoDB ──────────────────────────────────────
mongoose.connect('mongodb://localhost:27017/studentDB')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ Error:', err));

// ── Student Schema & Model ──────────────────────────────────
const Student = mongoose.model('Student', new mongoose.Schema({
  name:    { type: String, required: true },
  company: { type: String, required: true },
  cgpa:    { type: Number, required: true },
  year:    { type: Number, default: 2025  },
}));

// ── Routes ──────────────────────────────────────────────────

// Home
app.get('/', (req, res) => res.json({ message: '🎓 Student Placement DB API' }));

// GET all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json({ success: true, count: students.length, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single student
app.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST add student
app.post('/students', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ success: true, message: 'Student added', data: student });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update student
app.put('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student updated', data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE student
app.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: `${student.name} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Start Server ─────────────────────────────────────────────
app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
  console.log('📋 Students      : http://localhost:3000/students');
});
