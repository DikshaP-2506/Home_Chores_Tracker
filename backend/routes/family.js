const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');
router.get('/', auth, async (req, res) => {
  try {
    const familyMembers = await pool.query(
      'SELECT * FROM family_members WHERE user_id = $1',
      [req.user.id]
    );
    res.json(familyMembers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  try {
    const newMember = await pool.query(
      'INSERT INTO family_members (name, user_id) VALUES($1, $2) RETURNING *',
      [name, req.user.id]
    );
    res.json(newMember.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
router.put('/:id', auth, async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  try {
    const memberCheck = await pool.query(
      'SELECT * FROM family_members WHERE member_id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (memberCheck.rows.length === 0) {
      return res.status(404).json({ msg: 'Family member not found or not authorized' });
    }
    const updatedMember = await pool.query(
      'UPDATE family_members SET name = $1 WHERE member_id = $2 RETURNING *',
      [name, id]
    );
    res.json(updatedMember.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    console.log(`Delete request received for member ID: ${id} by user: ${req.user.id}`);
    const memberCheck = await pool.query(
      'SELECT * FROM family_members WHERE member_id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (memberCheck.rows.length === 0) {
      console.log('Family member not found or not authorized');
      return res.status(404).json({ msg: 'Family member not found or not authorized' });
    }
    const choresCheck = await pool.query(
      'SELECT COUNT(*) FROM chores WHERE assigned_to = $1',
      [id]
    );
    const choreCount = parseInt(choresCheck.rows[0].count);
    if (choreCount > 0) {
      console.log(`Cannot delete: Family member has ${choreCount} assigned chores`);
      return res.status(400).json({ 
        msg: `This family member has ${choreCount} chores assigned. Please reassign or delete these chores first.` 
      });
    }
    const deleteResult = await pool.query(
      'DELETE FROM family_members WHERE member_id = $1 RETURNING *',
      [id]
    );
    console.log('Family member deleted successfully', deleteResult.rows[0]);
    res.json({ 
      msg: 'Family member removed',
      data: deleteResult.rows[0]
    });
  } catch (err) {
    console.error('Error in delete family member route:', err.message);
    res.status(500).json({ 
      msg: 'Server error', 
      error: err.message 
    });
  }
});
module.exports = router; 