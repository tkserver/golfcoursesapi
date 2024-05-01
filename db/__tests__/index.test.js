const mysql = require('mysql2');
const { connection, getCourses, getCourseById } = require('../index');

// Override the default behavior for the duration of the tests
jest.mock('mysql2', () => {
  const mQuery = jest.fn();
  const mConnection = {
    connect: jest.fn().mockImplementation((cb) => cb(null)),
    query: mQuery,
    end: jest.fn()
  };
  return { createConnection: jest.fn(() => mConnection) };
});

// create test for database connection
describe('Database Connection', () => {
  it('should connect to the database without error', done => {
    connection.connect(err => {
      expect(err).toBeNull();
      done();
    });
  });

  it('should handle connection errors', done => {
    // Force the mock to trigger an error
    mysql.createConnection().connect.mockImplementationOnce(cb => cb(new Error('Connection failed')));

    connection.connect(err => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('Connection failed');
      done();
    });
  });
});

describe('Database Operations', () => {
  // Set up before each test
  beforeEach(() => {
    // Resetting the default behavior for the query method
    mysql.createConnection().query.mockImplementation((sql, params, callback) => {
      if (typeof params === 'function') {
        callback = params; // Handles the no parameters case
      }
      // Check for a specific condition to trigger an error
      if (sql.includes('trigger_error')) {
        callback(new Error('Failed to fetch data'), null);
      } else {
        callback(null, [{ id: 1, name: 'Golf 101' }]);
      }
    });
  });

  afterEach(() => {
    // Ensure mocks are cleared to prevent test interference
    jest.clearAllMocks();
  });

  describe('getCourses', () => {
    it('should fetch all courses without error', done => {
      getCourses((err, results) => {
        expect(err).toBeNull();
        expect(results).toEqual([{ id: 1, name: 'Golf 101' }]);
        done();
      });
    });

    it('should handle errors', done => {
      // Force the mock to trigger an error
      mysql.createConnection().query.mockImplementationOnce((sql, params, callback) => {
        if (typeof params === 'function') {
          callback = params;
        }
        callback(new Error('Failed to fetch data'), null);
      });

      getCourses((err, results) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('Failed to fetch data');
        expect(results).toBeNull();
        done();
      });
    });
  });

  describe('getCourseById', () => {
    it('should fetch course by ID without error', done => {
      getCourseById(1, (err, results) => {
        expect(err).toBeNull();
        expect(results).toEqual([{ id: 1, name: 'Golf 101' }]);
        done();
      });
    });

    it('should handle errors', done => {
      // Force the mock to trigger an error
      mysql.createConnection().query.mockImplementationOnce((sql, params, callback) => {
        if (typeof params === 'function') {
          callback = params;
        }
        callback(new Error('Failed to fetch data'), null);
      });

      getCourseById(1, (err, results) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('Failed to fetch data');
        expect(results).toBeNull();
        done();
      });
    });
  });
});
