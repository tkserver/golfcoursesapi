const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('../db/index');
const authenticateToken = require('../middleware/auth');

// Endpoint to get all courses
router.get('/', (req, res) => {
  getCourses((err, results) => {
    if (err) {
      console.error("Error retrieving courses: ", err);
      return res.status(500).send('Error retrieving courses from database!');
    }
    res.json(results);
  });
});

// Endpoint to get a single course by ID /courses/:id
router.get('/:id', (req, res) => {
  const courseId = req.params.id;
  getCourseById(courseId, (err, results) => {
    if (err) {
      console.error("Error retrieving course: ", err);
      return res.status(500).send('Error retrieving course from database');
    }
    if (results.length === 0) {
      // No course found with the provided ID
      return res.status(404).send('Course not found');
    }
    // If a course is found, send the course data
    res.json(results[0]); // Sending only the first result assuming ID is unique
  });
});

// Endpoint to create a new course (protected)
router.post('/', authenticateToken, (req, res) => {
  const courseData = req.body;
  createCourse(courseData, (err, results) => {
    if (err) {
      console.error("Error creating course: ", err);
      return res.status(500).send('Error creating course');
    }
    res.status(201).json({ message: 'Course created successfully', id: results.insertId });
  });
});

// Endpoint to update an existing course by ID (protected)
router.put('/:id', authenticateToken, (req, res) => {
  const courseId = req.params.id;
  const courseData = req.body;
  updateCourse(courseId, courseData, (err, results) => {
    if (err) {
      console.error("Error updating course: ", err);
      return res.status(500).send('Error updating course');
    }
    if (results.affectedRows === 0) {
      // No course found with the provided ID
      return res.status(404).send('Course not found');
    }
    res.json({ message: 'Course updated successfully' });
  });
});

// Endpoint to delete a course by ID (protected)
router.delete('/:id', authenticateToken, (req, res) => {
  const courseId = req.params.id;
  deleteCourse(courseId, (err, results) => {
    if (err) {
      console.error("Error deleting course: ", err);
      return res.status(500).send('Error deleting course');
    }
    if (results.affectedRows === 0) {
      // No course found with the provided ID
      return res.status(404).send('Course not found');
    }
    res.json({ message: 'Course deleted successfully' });
  });
});

module.exports = router;
