const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('../db/index');
const authenticateToken = require('../middleware/auth');

// Endpoint to get all courses
router.get('/', async (req, res) => {
  try {
    const results = await new Promise((resolve, reject) => {
      getCourses((err, results) => {
        if (err) {
          console.error("Database Query Error: ", err);
          return reject(err);
        }
        resolve(results);
      });
    });
    res.json(results);
  } catch (err) {
    console.error("Error retrieving courses: ", err);
    res.status(500).send('Error retrieving courses from database!');
  }
});

// Endpoint to get a single course by ID /courses/:id
router.get('/:id', async (req, res) => {
  const courseId = req.params.id;
  try {
    const results = await new Promise((resolve, reject) => {
      getCourseById(courseId, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
    if (results.length === 0) {
      return res.status(404).send('Course not found');
    }
    res.json(results[0]);
  } catch (err) {
    console.error("Error retrieving course: ", err);
    res.status(500).send('Error retrieving course from database');
  }
});

// Endpoint to create a new course (protected)
router.post('/', authenticateToken, async (req, res) => {
  const courseData = req.body;
  try {
    const results = await new Promise((resolve, reject) => {
      createCourse(courseData, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
    res.status(201).json({ message: 'Course created successfully', id: results.insertId });
  } catch (err) {
    console.error("Error creating course: ", err);
    res.status(500).send('Error creating course');
  }
});

// Endpoint to update an existing course by ID (protected)
router.put('/:id', authenticateToken, async (req, res) => {
  const courseId = req.params.id;
  const courseData = req.body;

  try {
    console.log('Update request received for course ID:', courseId);
    console.log('Course data:', courseData);

    const results = await new Promise((resolve, reject) => {
      updateCourse(courseId, courseData, (err, results) => {
        if (err) {
          console.error('Error updating course:', err);
          return reject(err);
        }
        resolve(results);
      });
    });

    if (results.affectedRows === 0) {
      console.error('Course not found for ID:', courseId);
      return res.status(404).send('Course not found');
    }

    res.json({ message: 'Course updated successfully' });
  } catch (err) {
    console.error('Internal server error:', err);
    res.status(500).send('Internal server error');
  }
});

// Endpoint to delete a course by ID (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  const courseId = req.params.id;
  try {
    const results = await new Promise((resolve, reject) => {
      deleteCourse(courseId, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
    if (results.affectedRows === 0) {
      return res.status(404).send('Course not found');
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error("Error deleting course: ", err);
    res.status(500).send('Error deleting course');
  }
});

module.exports = router;
