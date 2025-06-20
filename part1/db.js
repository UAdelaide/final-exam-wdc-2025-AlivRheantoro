import mysql from 'mysql2'
const pool = require('mysql2/promise');

const  = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'DogWalkService'
});

