// databasePostGet.js
// Centralized API helper for your React Native frontend


//const BASE_URL = 'http://localhost:5000'; 

// --- Home ---
//const BASE_URL = 'http://192.168.1.145:5000'; 

// --- Jarvis SW (Classroom) ---
//const BASE_URL = 'http://10.200.120.231:5000';

// --- Sorenson (TechDesk) --- 
const BASE_URL = 'http://10.200.121.114:5000';

/**
 * --------------------------
 * USERS
 * --------------------------
 */

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    if (!response.ok) throw new Error(`Failed to fetch users: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get a single user profile by Firebase UID
export const getUserByFirebaseId = async (firebase_id) => {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    const users = await response.json();
    return users.find((u) => u.firebase_id === firebase_id) || null;
  } catch (error) {
    console.error('Error fetching user by Firebase ID:', error);
    throw error;
  }
};

// Create new user in 
export const postNewUser = async (firebase_id, first_name, last_name, birth_date, role_id = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firebase_id,
        first_name,
        last_name,
        birth_date,
        role_id
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.Error || 'Failed to create user');
    return data;
  } catch (error) {
    console.error('Error posting new user:', error);
    throw error;
  }
};

// Update existing user
export const updateUser = async (firebase_id, updates) => {
  try {
    const response = await fetch(`${BASE_URL}/users/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firebase_id, updates }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.Error || 'Failed to update user');
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * --------------------------
 * LOCATIONS / MARKERS
 * --------------------------
 */

// Post a new location/marker
export const postNewLocation = async (firebase_id, latitude, longitude, name, description) => {
  try {
    const response = await fetch(`${BASE_URL}/locations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firebase_id,
        latitude,
        longitude,
        name,
        description,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.Error || 'Failed to post new location');
    return data;
  } catch (error) {
    console.error('Error posting new location:', error);
    throw error;
  }
};
