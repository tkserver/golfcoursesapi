const express = require('express');
const router = express.Router();
const db = require('../db/index'); // Adjust the path based on your structure
const { getCourses, getCourseById } = require('../db/index'); // Adjust the path as necessary


// Endpoint to get all courses
router.get('/', (req, res) => {
  console.log("Hitting the /courses endpoint");
  getCourses((err, results) => {
    if (err) {
      console.error("Error retrieving courses: ", err);
      return res.status(500).send('Error retrieving courses from database');
    }
    res.json(results);
  });
});

// Endpoint to get a single course by ID /courses/:id
router.get('/:id', (req, res) => {
  const courseId = req.params.id;
  console.log(`Hitting the /courses/${courseId} endpoint`);
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




module.exports = router;