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


// Export both the connection and getCourses function
module.exports = { connection, getCourses, getCourseById };
