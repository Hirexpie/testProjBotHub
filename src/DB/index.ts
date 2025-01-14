import { Pool } from 'pg';
import { postgreaSQL } from '../config/config';

const pool = new Pool({
  user: postgreaSQL.user,
  host: postgreaSQL.host,           
  database: postgreaSQL.database,   
  password: postgreaSQL.password, 
  port: postgreaSQL.port,                 
});

pool.connect().then(client => {
    console.log('Connected to PostgreSQL');
    client.release(); 
  }).catch(err => console.error('Connection error', err.stack));

export default pool;
