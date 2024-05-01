const request = require('supertest');
const express = require('express');
const coursesRoutes = require('../courses');
jest.mock('../../db/index', () => ({
  getCourses: jest.fn().mockImplementation((cb) => {
    cb(null, [{ id: 1, name: 'Introduction to Testing' }]);
  })
}));

const app = express();
app.use(express.json());
app.use('/', coursesRoutes);

describe('GET /', () => {

  let originalConsoleError;

  // Mock console.error before all tests in this describe block
  beforeAll(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  // Restore console.error after all tests in this describe block
  afterAll(() => {
    console.error = originalConsoleError;
  });
  
  test('responds with json containing a list of all courses', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: 'Introduction to Testing' }]);
    expect(response.header['content-type']).toMatch(/json/);
  });

  test('responds with an error if the database call fails', async () => {
    require('../../db/index').getCourses.mockImplementationOnce((cb) => {
      cb(new Error('Database error'), null);
    });
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(500);
    expect(response.text).toEqual('Error retrieving courses from database');
  });
});

// get course by id
jest.mock('../../db/index', () => ({
  getCourses: jest.fn().mockImplementation((cb) => {
    cb(null, [{ id: 1, name: 'Introduction to Testing' }]);
  }),
  getCourseById: jest.fn() // Mock implementation to be defined in each test
}));

describe('GET /:id', () => {

  test('responds with 404 for a non-existent course', async () => {
    // Override the getCourseById mock to simulate no results found
    require('../../db/index').getCourseById.mockImplementation((id, cb) => {
      cb(null, []); // Returns an empty array, simulating no results found
    });
    const response = await request(app).get('/nonexistentid');
    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual('Course not found');
  });  

test('responds with json containing a single course', async () => {
  require('../../db/index').getCourseById.mockImplementation((id, cb) => {
    cb(null, [{ id: 1, name: 'Advanced Testing' }]); // Mock data as an array
  });
  const response = await request(app).get('/1');
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({ id: 1, name: 'Advanced Testing' }); // Expecting a single object, not an array
  expect(response.header['content-type']).toMatch(/json/);
});

  test('responds with json containing a single course', async () => {
    require('../../db/index').getCourseById.mockImplementation((id, cb) => {
      cb(null, [{ id: 1, name: 'Advanced Testing' }]); // Mock data as an array, but will use only the first item
    });
    const response = await request(app).get('/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: 1, name: 'Advanced Testing' }); // Corrected expectation: expecting a single object
    expect(response.header['content-type']).toMatch(/json/);
  });
  

  test('responds with an error if the database call fails', async () => {
    require('../../db/index').getCourseById.mockImplementationOnce((id, cb) => {
      cb(new Error('Database error'), null);
    });
    const response = await request(app).get('/1');
    expect(response.statusCode).toBe(500);
    expect(response.text).toEqual('Error retrieving course from database');
  });
});