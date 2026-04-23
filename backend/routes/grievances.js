const express = require('express');
const router = express.Router();
const Grievance = require('../models/Grievance');
const { protect } = require('../middleware/auth');

// All routes below are protected
router.use(protect);

// POST /api/grievances → Submit a new grievance
router.post('/', async (req, res) => {
  const { title, description, category } = req.body;
  try {
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description and category are required' });
    }
    const grievance = await Grievance.create({
      student: req.student._id,
      title,
      description,
      category,
    });
    res.status(201).json({ message: 'Grievance submitted successfully', grievance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/grievances/search?title=xyz → Search by title (MUST be before /:id)
router.get('/search', async (req, res) => {
  const { title } = req.query;
  try {
    if (!title) {
      return res.status(400).json({ message: 'Please provide a title to search' });
    }
    const grievances = await Grievance.find({
      student: req.student._id,
      title: { $regex: title, $options: 'i' },
    }).sort({ createdAt: -1 });
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/grievances → View all grievances of logged-in student
router.get('/', async (req, res) => {
  try {
    const grievances = await Grievance.find({ student: req.student._id }).sort({ createdAt: -1 });
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/grievances/:id → View grievance by ID
router.get('/:id', async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    // Ensure student owns this grievance
    if (grievance.student.toString() !== req.student._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this grievance' });
    }
    res.json(grievance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/grievances/:id → Update grievance
router.put('/:id', async (req, res) => {
  const { title, description, category, status } = req.body;
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    if (grievance.student.toString() !== req.student._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this grievance' });
    }

    const updated = await Grievance.findByIdAndUpdate(
      req.params.id,
      { title, description, category, status },
      { new: true, runValidators: true }
    );
    res.json({ message: 'Grievance updated successfully', grievance: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/grievances/:id → Delete grievance
router.delete('/:id', async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    if (grievance.student.toString() !== req.student._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this grievance' });
    }
    await Grievance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Grievance deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
