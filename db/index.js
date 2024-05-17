const mysql = require('mysql2');
require('dotenv').config();

// Setup the connection using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Successfully connected to the database.');
});

// Function to get all courses
function getCourses(callback) {
  const query = `SELECT id, name, coursetype, address, city, phone, region, holes FROM ${process.env.DB_DATABASE}.course_tb_1;`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Database Query Error: ", err);
      return callback(err, null);
    }
    return callback(null, results);
  });
}

// Function to get a single course by ID
function getCourseById(id, callback) {
  const query = `SELECT * FROM course_tb_1 WHERE id = ?;`;
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Database Query Error: ", err);
      return callback(err, null);
    }
    return callback(null, results);
  });
}

// Function to create a new course
function createCourse(courseData, callback) {
  const requiredFields = ['name', 'url', 'coursetype', 'address', 'city', 'county', 'state', 'zip', 'phone', 'holes', 'region'];
  for (const field of requiredFields) {
    if (!courseData[field]) {
      return callback(new Error(`Missing required field: ${field}`), null);
    }
  }

  const fields = [
    'name', 'url', 'coursetype', 'address', 'city', 'county', 'state', 'zip', 'country', 'phone', 'web', 'twitter', 'facebook', 'instagram', 'rangeballs', 'tips', 'season', 'cost', 'proshop', 'tees', 'balls', 'instruction', 'locker', 'par', 'yards', 'rating', 'slope', 'architect', 'caddie', 'banquet', 'signaturehole', 'opened', 'greens', 'fairways', 'waterhazards', 'sandbunkers', 'holes', 'yardagemarkers', 'acceptteetimes', 'earliestcallteetime', 'trainingfacilities', 'onsitegolfpro', 'spikes', 'guests', 'access', 'discounts', 'rentals', 'pullcarts', 'walking', 'restaurant', 'bar', 'hours', 'food', 'availableproducts', 'homes', 'latitude', 'longitude', 'description', 'scorecard', 'image', 'region'
  ];
  const placeholders = fields.map(() => '?').join(', ');
  const query = `INSERT INTO course_tb_1 (${fields.join(', ')}) VALUES (${placeholders});`;
  const values = fields.map(field => courseData[field] || '');

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error("Database Query Error: ", err);
      return callback(err, null);
    }
    callback(null, results);
  });
}

// Function to update a course by ID
function updateCourse(id, courseData, callback) {
  const fields = [
    'name', 'url', 'coursetype', 'address', 'city', 'county', 'state', 'zip', 'country', 'phone', 'web', 'twitter', 'facebook', 'instagram', 'rangeballs', 'tips', 'season', 'cost', 'proshop', 'tees', 'balls', 'instruction', 'locker', 'par', 'yards', 'rating', 'slope', 'architect', 'caddie', 'banquet', 'signaturehole', 'opened', 'greens', 'fairways', 'waterhazards', 'sandbunkers', 'holes', 'yardagemarkers', 'acceptteetimes', 'earliestcallteetime', 'trainingfacilities', 'onsitegolfpro', 'spikes', 'guests', 'access', 'discounts', 'rentals', 'pullcarts', 'walking', 'restaurant', 'bar', 'hours', 'food', 'availableproducts', 'homes', 'latitude', 'longitude', 'description', 'scorecard', 'image', 'region'
  ];

  const setFields = fields.map(field => `${field} = ?`).join(', ');
  const values = fields.map(field => courseData[field] || '');
  values.push(id); // Add ID at the end for the WHERE clause

  const query = `UPDATE course_tb_1 SET ${setFields} WHERE id = ?;`;

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error("Database Query Error: ", err);
      return callback(err, null);
    }
    callback(null, results);
  });
}

// Function to delete a course by ID
function deleteCourse(id, callback) {
  const query = `DELETE FROM course_tb_1 WHERE id = ?;`;
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Database Query Error: ", err);
      return callback(err, null);
    }
    callback(null, results);
  });
}

// Export functions
module.exports = { connection, getCourses, getCourseById, createCourse, updateCourse, deleteCourse };
