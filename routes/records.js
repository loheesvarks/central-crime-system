const express = require('express');
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all records with filters
router.get('/', authenticateToken, (req, res) => {
  const { name, crime, age, state, status } = req.query;
  let sql = 'SELECT * FROM records WHERE 1=1';
  const params = [];

  if (name) {
    sql += ' AND name LIKE ?';
    params.push('%' + name + '%');
  }
  if (crime) {
    sql += ' AND crime LIKE ?';
    params.push('%' + crime + '%');
  }
  if (age) {
    sql += ' AND age = ?';
    params.push(age);
  }
  if (state) {
    sql += ' AND state = ?';
    params.push(state);
  }
  if (status) {
    sql += ' AND case_status = ?';
    params.push(status);
  }

  sql += ' ORDER BY created_at DESC';

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Get single record with evidences
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.query('SELECT * FROM records WHERE id = ?', [id], (err, records) => {
    if (err) return res.status(500).json({ error: err });
    if (records.length === 0) return res.status(404).json({ error: 'Record not found' });

    db.query('SELECT * FROM evidences WHERE record_id = ?', [id], (err2, evidences) => {
      if (err2) return res.status(500).json({ error: err2 });
      
      res.json({
        ...records[0],
        evidences: evidences
      });
    });
  });
});

// Add new record
router.post('/', authenticateToken, (req, res) => {
  const { name, crime, born_date, crime_date, age, photo_url, sentence_years, sentence_details, case_status, state } = req.body;
  
  console.log('Received POST request to add record:', req.body);
  console.log('User from token:', req.user);
  
  const sql = `INSERT INTO records (name, crime, born_date, crime_date, age, photo_url, sentence_years, 
               sentence_details, case_status, state, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.query(sql, [name, crime, born_date, crime_date, age, photo_url, sentence_years, 
                 sentence_details, case_status, state, req.user.id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message || 'Database error' });
    }
    console.log('Record added successfully, ID:', result.insertId);
    res.json({ message: 'Record added successfully!', id: result.insertId });
  });
});

// Update record
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, crime, born_date, crime_date, age, photo_url, sentence_years, sentence_details, case_status, state } = req.body;
  const sql = `UPDATE records SET name=?, crime=?, born_date=?, crime_date=?, age=?, photo_url=?, 
               sentence_years=?, sentence_details=?, case_status=?, state=? WHERE id=?`;
  
  db.query(sql, [name, crime, born_date, crime_date, age, photo_url, sentence_years, 
                 sentence_details, case_status, state, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Record updated successfully!' });
  });
});

// Delete record
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM records WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Record deleted successfully!' });
  });
});

// Add evidence
router.post('/:id/evidence', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { evidence_type, description, file_url } = req.body;
  
  const sql = 'INSERT INTO evidences (record_id, evidence_type, description, file_url) VALUES (?, ?, ?, ?)';
  db.query(sql, [id, evidence_type, description, file_url], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Evidence added successfully!' });
  });
});

module.exports = router;
