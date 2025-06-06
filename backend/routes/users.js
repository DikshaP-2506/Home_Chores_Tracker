const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const auth = require('../middleware/auth');
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password) VALUES($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );
    const payload = {
      user: {
        id: newUser.rows[0].user_id
      }
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    const user = userCheck.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    const payload = {
      user: {
        id: user.user_id
      }
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
router.get('/me', auth, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT user_id, username, email, is_admin FROM users WHERE user_id = $1',
      [req.user.id]
    );
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router; 