require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
// แก้ไข 1: เปลี่ยนมารับ Port จากระบบของ Vercel หรือใช้ 3000 ถ้าทำในเครื่อง
const port = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});
const promisePool = pool.promise();

app.post('/api/bookings', async (req, res) => {
  try {
    const { firstName, lastName, date, time } = req.body;
    const bookingTime = time || '00:00:00'; 

    const [result] = await promisePool.query(
      'INSERT INTO bookings (first_name, last_name, booking_date, booking_time) VALUES (?, ?, ?, ?)',
      [firstName, lastName, date, bookingTime]
    );
    res.status(201).json({ message: 'บันทึกสำเร็จ!', id: result.insertId });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'บันทึกข้อมูลไม่สำเร็จ' });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM bookings ORDER BY id DESC');
    
    const formattedData = rows.map(row => ({
      firstName: row.first_name,
      lastName: row.last_name,
      date: new Date(row.booking_date).toISOString().split('T')[0] 
    }));
    
    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'ดึงข้อมูลไม่สำเร็จ' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Backend รันแล้วที่ http://localhost:${port}`);
});

// แก้ไข 2: เพิ่มบรรทัดนี้ล่างสุด เพื่อบอกให้ Vercel รู้ว่านี่คือตัวแอปพลิเคชัน
module.exports = app;