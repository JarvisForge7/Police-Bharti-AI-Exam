import { Pool } from 'pg';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// IPv6 एरर टाळण्यासाठी फक्त IPv4 वापरणे
dns.setDefaultResultOrder('ipv4first');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 20000,
  idleTimeoutMillis: 30000,
  max: 10
});

export const testDbConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('🛡️ PostgreSQL Database Connected Successfully!');
    client.release();
  } catch (err) {
    console.error('❌ Database Connection Error:', err);
  }
};

// बदल: 'export default pool;' खालीलप्रमाणे सुटसुटीत लिहा
export default pool;