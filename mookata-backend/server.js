require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// เปิดให้ Angular (Frontend) สามารถส่งข้อมูลเข้ามาได้
app.use(cors());
app.use(express.json());

// ตั้งค่าเชื่อมต่อ TiDB
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

// API สำหรับ "บันทึก" ข้อมูล (ใช้ในหน้ากรอกฟอร์ม)
app.post('/api/bookings', async (req, res) => {
  try {
    const { firstName, lastName, date, time } = req.body;
    const bookingTime = time || '00:00:00'; // ถ้าไม่ได้กรอกเวลามา ให้เป็น 00:00:00

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

// API สำหรับ "ดึง" ข้อมูล (ใช้ในหน้ารายชื่อคนจอง)
app.get('/api/bookings', async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM bookings ORDER BY id DESC');
    
    // แปลงชื่อตัวแปรให้ตรงกับที่ Angular ต้องการ
    const formattedData = rows.map(row => ({
      firstName: row.first_name,
      lastName: row.last_name,
      // แปลงวันที่ให้อยู่ในรูปแบบ YYYY-MM-DD
      date: new Date(row.booking_date).toISOString().split('T')[0] 
    }));
    
    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'ดึงข้อมูลไม่สำเร็จ' });
  }
});

// เริ่มรัน Server
app.listen(port, () => {
  console.log(`🚀 Backend รันแล้วที่ http://localhost:${port}`);
});