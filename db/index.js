const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function getCourses(callback) {
  const query = `SELECT id, name, coursetype, address, city, phone, region, holes FROM ${process.env.DB_DATABASE}.course_tb_1;`;
  try {
    const [results] = await pool.query(query);
    callback(null, results);
  } catch (err) {
    console.error('Database Query Error: ', err);
    callback(err, null);
  }
}

async function getCourseById(id, callback) {
  const query = `SELECT * FROM course_tb_1 WHERE id = ?;`;
  try {
    const [results] = await pool.query(query, [id]);
    callback(null, results);
  } catch (err) {
    console.error('Database Query Error: ', err);
    callback(err, null);
  }
}

async function createCourse(courseData, callback) {
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

  try {
    const [results] = await pool.query(query, values);
    callback(null, results);
  } catch (err) {
    console.error("Database Query Error: ", err);
    callback(err, null);
  }
}

// async function updateCourse(id, courseData, callback) {
//   const fields = [
//     'name', 'url', 'coursetype', 'address', 'city', 'county', 'state', 'zip', 'country', 'phone', 'web', 'twitter', 'facebook', 'instagram', 'rangeballs', 'tips', 'season', 'cost', 'proshop', 'tees', 'balls', 'instruction', 'locker', 'par', 'yards', 'rating', 'slope', 'architect', 'caddie', 'banquet', 'signaturehole', 'opened', 'greens', 'fairways', 'waterhazards', 'sandbunkers', 'holes', 'yardagemarkers', 'acceptteetimes', 'earliestcallteetime', 'trainingfacilities', 'onsitegolfpro', 'spikes', 'guests', 'access', 'discounts', 'rentals', 'pullcarts', 'walking', 'restaurant', 'bar', 'hours', 'food', 'availableproducts', 'homes', 'latitude', 'longitude', 'description', 'scorecard', 'image', 'region'
//   ];

//   const setFields = fields.map(field => `${field} = ?`).join(', ');
//   const values = fields.map(field => courseData[field] || '');
//   values.push(id); // Add ID at the end for the WHERE clause

//   const query = `UPDATE course_tb_1 SET ${setFields} WHERE id = ?;`;

//   try {
//     const [results] = await pool.query(query, values);
//     callback(null, results);
//   } catch (err) {
//     console.error("Database Query Error: ", err);
//     callback(err, null);
//   }
// }

async function updateCourse(id, courseData, callback) {
  const fields = [
    'name', 'url', 'coursetype', 'address', 'city', 'county', 'state', 'zip', 'country', 'phone', 'web', 'twitter', 'facebook', 'instagram', 'rangeballs', 'tips', 'season', 'cost', 'proshop', 'tees', 'balls', 'instruction', 'locker', 'par', 'yards', 'rating', 'slope', 'architect', 'caddie', 'banquet', 'signaturehole', 'opened', 'greens', 'fairways', 'waterhazards', 'sandbunkers', 'holes', 'yardagemarkers', 'acceptteetimes', 'earliestcallteetime', 'trainingfacilities', 'onsitegolfpro', 'spikes', 'guests', 'access', 'discounts', 'rentals', 'pullcarts', 'walking', 'restaurant', 'bar', 'hours', 'food', 'availableproducts', 'homes', 'latitude', 'longitude', 'description', 'scorecard', 'image', 'region'
  ];

  const setFields = fields.map(field => `${field} = ?`).join(', ');
  const values = fields.map(field => courseData[field] || '');
  values.push(id); // Add ID at the end for the WHERE clause

  const query = `UPDATE course_tb_1 SET ${setFields} WHERE id = ?;`;

  try {
    const [results] = await pool.query(query, values);
    callback(null, results);
  } catch (err) {
    console.error("Database Query Error: ", err);
    callback(err, null);
  }
}


async function deleteCourse(id, callback) {
  const query = `DELETE FROM course_tb_1 WHERE id = ?;`;
  try {
    const [results] = await pool.query(query, [id]);
    callback(null, results);
  } catch (err) {
    console.error("Database Query Error: ", err);
    callback(err, null);
  }
}

async function registerUser(username, hashedPassword, callback) {
  const query = `INSERT INTO users (username, password) VALUES (?, ?);`;
  try {
    const [results] = await pool.query(query, [username, hashedPassword]);
    callback(null, results);
  } catch (err) {
    console.error("Database Query Error: ", err);
    callback(err, null);
  }
}

async function findUserByUsername(username, callback) {
  const query = `SELECT * FROM users WHERE username = ?;`;
  try {
    const [results] = await pool.query(query, [username]);
    callback(null, results[0]);
  } catch (err) {
    console.error('Database Query Error: ', err);
    callback(err, null);
  }
}

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  registerUser,
  findUserByUsername
};
