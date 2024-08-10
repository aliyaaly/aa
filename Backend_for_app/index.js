const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // เปลี่ยนเป็นรหัสผ่านของคุณ
  database: 'aliya', // เปลี่ยนเป็นชื่อฐานข้อมูลของคุณ
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// Register endpoint
app.post('/register', (req, res) => {
  const { email,username, password } = req.body;
  const sql = 'INSERT INTO users (email,username, password) VALUES (?,?, ?)';
  db.query(sql, [email,username, password], (err, result) => {
    if (err) return res.status(400).send('Error registering user');
    res.status(201).send('User registered');
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).send('Error fetching user');
    if (results.length === 0) return res.status(400).send('User not found');

    const user = results[0];
    if (password !== user.password) return res.status(400).send('Invalid password');
    
    const token = jwt.sign({ id: user.id }, 'secret_key');
    res.json({ token });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
