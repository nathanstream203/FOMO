// databaseOperations.js
// Centralized API helper for your React Native frontend

<<<<<<< HEAD:client/app/api/databaseOperations.js
import BASE_URL from "../../_base_url.js";
=======
import BASE_URL from '../../src/_base_url.js';
>>>>>>> 8a1bf70ca7be1c7d90a066eb05538a76f482e973:client/src/api/databaseOperations.js

/**
 * --------------------------
 * CONNECTION TEST
 * --------------------------
 */

//Tests if the backend server is reachable. Returns true if connection succeeds, false otherwise.
export const testConnection = async () => {
  try {
    console.log("Testing connection to:", BASE_URL);
    const response = await fetch(`${BASE_URL}/user`);

    if (response.ok) {
      console.log("Connection successful:", BASE_URL);
      return true;
    } else {
      console.warn(
        "Server responded but some problems were found:",
        response.status
      );
      return false;
    }
  } catch (error) {
    console.error("Cannot connect to server:", error.message);
    return false;
  }
};

/**
 * --------------------------
 * FEED/POSTS
 * --------------------------
 */

// Create new post in database
export const postNewPost = async (firebase_id, bar_id, content, timestamp) => {
  try {
    const response = await fetch(`${BASE_URL}/post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firebase_id,
        bar_id,
        content,
        timestamp,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.Error || "Failed to create user");
    return data;
  } catch (error) {
    console.error("Error posting new post in database:", error);
    throw error;
  }
};

// Get all posts
export const getAllPosts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/post`);
    if (!response.ok)
      throw new Error(`Failed to fetch users: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Get posts for a specific bar
export const getPostsByBarId = async (bar_id) => {
  try {
    const response = await fetch(`${BASE_URL}/post`);
    const posts = await response.json();
    return posts.filter((post) => post.bar_id === bar_id);
  } catch (error) {
    console.error(`Error fetching posts for bar ${bar_id}:`, error);
    throw error;
  }
};

/**
 * --------------------------
 * USERS
 * --------------------------
 */

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/user`);
    if (!response.ok)
      throw new Error(`Failed to fetch users: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Get a single user profile by Firebase UID
export const getUserByFirebaseId = async (firebase_id) => {
  try {
    console.log(BASE_URL);
    const response = await fetch(`${BASE_URL}/user`);
    const users = await response.json();
    return users.find((u) => u.firebase_id === firebase_id) || null;
  } catch (error) {
    console.error("Error fetching user by Firebase ID:", error);
    throw error;
  }
};

// Create new user in
export const postNewUser = async (
  firebase_id,
  first_name,
  last_name,
  birth_date,
  role_id = 1
) => {
  try {
    const response = await fetch(`${BASE_URL}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firebase_id,
        first_name,
        last_name,
        birth_date,
        role_id,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.Error || "Failed to create user");
    return data;
  } catch (error) {
    console.error("Error posting new user:", error);
    throw error;
  }
};

// Update existing user
export const updateUser = async (firebase_id, updates) => {
  try {
    const response = await fetch(`${BASE_URL}/users/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firebase_id, updates }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.Error || "Failed to update user");
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

/**
 * --------------------------
 * LOCATIONS / MARKERS
 * --------------------------
 */

// Create new party location in database
export const postNewParty = async ({
  name,
  description,
  address,
  start_time,
  end_time,
  user_id,
  longitude,
  latitude,
}) => {
  try {
    console.log("Sending POST request to:", `${BASE_URL}/location/party`);
    console.log(
      "Request body:",
      JSON.stringify(
        {
          name,
          description,
          address,
          start_time,
          end_time,
          user_id,
          longitude,
          latitude,
        },
        null,
        2
      )
    );

    const response = await fetch(`${BASE_URL}/location/party`, {
      // Changed from /party to /location/party
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        address,
        start_time,
        end_time,
        user_id,
        longitude,
        latitude,
      }),
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `Failed to create party: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Success response:", data);
    return data;
  } catch (error) {
    console.error("postNewParty error:", error);
    throw error;
  }
};

// Get a single bar location by id
export const getBars = async () => {
  try {
    const response = await fetch(`${BASE_URL}/location/bar`);
    const bars = await response.json();
    return bars || null;
  } catch (error) {
    console.error("Error fetching bars", error);
    throw error;
  }
};

// Get a single bar location by id
export const getParties = async () => {
  try {
    const response = await fetch(`${BASE_URL}/location/party`);
    const parties = await response.json();
    return parties || null;
  } catch (error) {
    console.error("Error fetching parties", error);
    throw error;
  }
};
