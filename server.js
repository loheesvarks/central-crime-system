const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // your MySQL username
  password: 'Priya@07', // your MySQL password
  database: 'crime_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ MySQL Connected!');
});

// ✅ Create table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    crime VARCHAR(100),
    born_date DATE,
    crime_date DATE,
    age INT
  )
`);

// ✅ Get all records (with optional filters)
app.get('/records', (req, res) => {
  const { name, crime, age } = req.query;
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

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ✅ Add new record
app.post('/add', (req, res) => {
  const { name, crime, born_date, crime_date, age } = req.body;
  const sql = 'INSERT INTO records (name, crime, born_date, crime_date, age) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, crime, born_date, crime_date, age], err => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: '✅ Record added successfully!' });
  });
});

// ✅ Update record
app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { name, crime, born_date, crime_date, age } = req.body;
  const sql = 'UPDATE records SET name=?, crime=?, born_date=?, crime_date=?, age=? WHERE id=?';
  db.query(sql, [name, crime, born_date, crime_date, age, id], err => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: '✅ Record updated successfully!' });
  });
});

// ✅ Delete single record
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM records WHERE id = ?', [id], err => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: '🗑️ Record deleted successfully!' });
  });
});

// ✅ Delete all records + reset auto increment
app.delete('/delete-all', (req, res) => {
  const deleteSQL = 'DELETE FROM records';
  const resetSQL = 'ALTER TABLE records AUTO_INCREMENT = 1';

  db.query(deleteSQL, err => {
    if (err) return res.status(500).json({ error: err });

    db.query(resetSQL, err2 => {
      if (err2) return res.status(500).json({ error: err2 });
      res.json({ message: '🧹 All records deleted and ID reset to 1 successfully!' });
    });
  });
});




// ✅ Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
