// API test script for booking system
// This will help diagnose registration issues

const fetch = require('node-fetch');

const BASE_URL = 'https://booking-6.onrender.com';
const API_URL = `${BASE_URL}/api`;

async function testHealth() {
  try {
    console.log('Testing health endpoint...');
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log('Health status:', data);
    return data.ok === true;
  } catch (error) {
    console.error('Health check failed:', error.message);
    return false;
  }
}

async function testRegister() {
  try {
    console.log('\nTesting registration...');
    // Generate a unique email to avoid conflicts
    const uniqueEmail = `test${Date.now()}@example.com`;
    console.log(`Using email: ${uniqueEmail}`);
    
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: uniqueEmail,
        password: 'Passw0rd!',
        role: 'PATIENT'
      })
    });
    
    console.log('Registration status:', response.status);
    
    if (response.status === 201) {
      const data = await response.json();
      console.log('Registration successful:', data);
      return { success: true, email: uniqueEmail };
    } else {
      const errorData = await response.json();
      console.error('Registration failed:', errorData);
      return { success: false, error: errorData };
    }
  } catch (error) {
    console.error('Registration test error:', error.message);
    return { success: false, error: error.message };
  }
}

async function testLogin(email) {
  try {
    console.log('\nTesting login...');
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: 'Passw0rd!'
      })
    });
    
    console.log('Login status:', response.status);
    
    if (response.status === 200) {
      const data = await response.json();
      console.log('Login successful. Token received.');
      return { success: true, token: data.token };
    } else {
      const errorData = await response.json();
      console.error('Login failed:', errorData);
      return { success: false, error: errorData };
    }
  } catch (error) {
    console.error('Login test error:', error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('TESTING BOOKING API');
  console.log('===================');
  
  // Step 1: Test health endpoint
  const healthOk = await testHealth();
  if (!healthOk) {
    console.error('\nAPI appears to be down or unreachable. Please check:');
    console.error('1. Is the backend service running?');
    console.error('2. Is the URL correct?');
    console.error('3. Are there any network issues?');
    return;
  }
  
  // Step 2: Test registration
  const registerResult = await testRegister();
  if (!registerResult.success) {
    console.error('\nRegistration failed. Possible issues:');
    console.error('1. Email validation errors');
    console.error('2. Database connection issues');
    console.error('3. Backend validation errors');
    console.error('4. Check your backend logs for more details');
  } else {
    // Step 3: Test login if registration was successful
    const loginResult = await testLogin(registerResult.email);
    if (!loginResult.success) {
      console.error('\nLogin failed despite successful registration.');
      console.error('This suggests an issue with authentication or token generation.');
    }
  }
  
  console.log('\nTesting complete.');
}

runTests();
