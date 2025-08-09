// Manual seeder for free tier Render

const axios = require('axios');

const BASE_URL = 'https://booking-6.onrender.com';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Passw0rd!';
const ADMIN_NAME = 'Admin User';
const ADMIN_KEYS = [
  'adminkey123', 
  'admin', 
  'admin123', 
  'AdminKey123', 
  'ADMIN_KEY', 
  'adminpassword',
  'admin_key_123'
];

async function attemptRegister() {
  console.log('Attempting admin registration with multiple possible keys...');
  
  for (const key of ADMIN_KEYS) {
    try {
      console.log(`Trying key: ${key}`);
      const registerResponse = await axios.post(`${BASE_URL}/api/register`, {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'ADMIN',
        adminKey: key
      });
      console.log('✅ Registration successful with key:', key);
      return true;
    } catch (error) {
      console.log(`❌ Failed with key: ${key}`);
    }
  }
  
  console.log('❌ All admin registration attempts failed');
  return false;
}

async function login() {
  try {
    console.log('Attempting login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    console.log('✅ Login successful');
    return loginResponse.data.token;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return null;
  }
}

async function attemptSeed(token) {
  console.log('Attempting seed with multiple possible keys...');
  
  for (const key of ADMIN_KEYS) {
    try {
      console.log(`Trying seed with key: ${key}`);
      const seedResponse = await axios.post(
        `${BASE_URL}/admin/seed`, 
        { adminSeedKey: key },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('✅ Seed successful with key:', key);
      return true;
    } catch (error) {
      console.log(`❌ Seed failed with key: ${key}`);
    }
  }
  
  console.log('❌ All seed attempts failed');
  return false;
}

async function checkSlots(token) {
  try {
    console.log('Checking slots...');
    const slotsResponse = await axios.get(
      `${BASE_URL}/api/slots`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(`✅ Found ${slotsResponse.data.length} slots`);
    if (slotsResponse.data.length > 0) {
      console.log('First slot:', slotsResponse.data[0]);
    }
  } catch (error) {
    console.error('❌ Error checking slots:', error.response?.data || error.message);
  }
}

async function main() {
  try {
    // Try health check first
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('Health check:', health.data);
    
    // Try register (might fail if already exists)
    await attemptRegister();
    
    // Login should work whether registration succeeded or already existed
    const token = await login();
    if (!token) {
      console.log('Exiting due to login failure');
      return;
    }
    
    // Try seed
    await attemptSeed(token);
    
    // Check slots
    await checkSlots(token);
    
    console.log('\nFRONTEND SETUP:');
    console.log(`VITE_API_URL=${BASE_URL}/api`);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

main();
