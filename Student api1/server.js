const express    = require('express');
const bodyParser = require('body-parser');
const app        = express();

app.use(bodyParser.json());

// ── In-memory Database ──────────────────────────────────────
let students = [
  { id: 1, name: 'Aditya Kumar',   company: 'TCS',    cgpa: 8.7 },
  { id: 2, name: 'Priya Ramesh',   company: 'Zoho',   cgpa: 9.1 },
  { id: 3, name: 'Karthik Selvam', company: 'Amazon', cgpa: 8.4 },
];
let nextId = 4;

// ── Simulate async DB delay ─────────────────────────────────
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ── HOME ────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🎓 Student Records API is running!',
    routes: {
      'GET    /students':     'Get all students',
      'GET    /students/:id': 'Get student by ID',
      'POST   /students':     'Add a new student',
      'PUT    /students/:id': 'Update a student',
      'DELETE /students/:id': 'Delete a student',
    },
  });
});

// ── GET all students ────────────────────────────────────────
app.get('/students', async (req, res) => {
  await delay(100);
  res.json({ success: true, count: students.length, data: students });
});

// ── GET single student ──────────────────────────────────────
app.get('/students/:id', async (req, res) => {
  await delay(100);
  const student = students.find((s) => s.id === parseInt(req.params.id));
  if (!student)
    return res.status(404).json({ success: false, message: 'Student not found' });
  res.json({ success: true, data: student });
});

// ── POST add student ────────────────────────────────────────
app.post('/students', async (req, res) => {
  await delay(100);
  const { name, company, cgpa } = req.body;
  if (!name || !company || !cgpa)
    return res.status(400).json({ success: false, message: 'name, company and cgpa are required' });
  const newStudent = { id: nextId++, name, company, cgpa };
  students.push(newStudent);
  res.status(201).json({ success: true, message: 'Student added successfully', data: newStudent });
});

// ── PUT update student ──────────────────────────────────────
app.put('/students/:id', async (req, res) => {
  await delay(100);
  const idx = students.findIndex((s) => s.id === parseInt(req.params.id));
  if (idx === -1)
    return res.status(404).json({ success: false, message: 'Student not found' });
  students[idx] = { id: students[idx].id, ...req.body };
  res.json({ success: true, message: 'Student updated successfully', data: students[idx] });
});

// ── DELETE student ──────────────────────────────────────────
app.delete('/students/:id', async (req, res) => {
  await delay(100);
  const idx = students.findIndex((s) => s.id === parseInt(req.params.id));
  if (idx === -1)
    return res.status(404).json({ success: false, message: 'Student not found' });
  const deleted = students.splice(idx, 1)[0];
  res.json({ success: true, message: `${deleted.name} deleted successfully`, data: deleted });
});

// ── Start Server ────────────────────────────────────────────
app.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
  console.log('📋 Students list : http://localhost:3000/students');
});