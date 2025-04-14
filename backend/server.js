const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Verify database connection
const verifyDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL database connection successful!');
    client.release();
    return true;
  } catch (err) {
    console.error('PostgreSQL database connection error:', err);
    return false;
  }
};

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/family', require('./routes/family'));
app.use('/api/chores', require('./routes/chores'));

// Basic route
app.get('/', (req, res) => {
  res.send('API Running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

const PORT = process.env.PORT || 5000;

// Start server after verifying database connection
const startServer = async () => {
  const isDatabaseConnected = await verifyDatabaseConnection();
  
  if (isDatabaseConnected) {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } else {
    console.error('Failed to connect to the database. Server not started.');
    process.exit(1);
  }
};

startServer(); 