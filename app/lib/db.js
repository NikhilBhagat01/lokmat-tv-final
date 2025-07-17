// lib/db.js
import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'root',
  database: process.env.DB_NAME || 'dm_videos',
  waitForConnections: true,
  connectionLimit: 10, // ⬅️ max 10 simultaneous connections
  queueLimit: 0, // ⬅️ unlimited queued queries
});
