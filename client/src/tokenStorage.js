// client/src/tokenStorage.js
// Utility functions to save, retrieve, and clear tokens from secure storage
// Stores the JWT + refresh token securely on the device using Expo SecureStore.

import * as SecureStore from "expo-secure-store";

/**
 * --------------------------
 * SAVE TOKENS TO SECURE STORAGE WITH EXPIRATION
 * --------------------------
 */
export async function saveAToken(accessToken) {
  await SecureStore.setItemAsync("accessToken", accessToken.token);
  console.log("Access token saved");
}

export async function saveRToken(refreshToken) {
  await SecureStore.setItemAsync("refreshToken", refreshToken.token);
  console.log("Refresh token saved");
}

/**
 * --------------------------
 * GET TOKENS FROM SECURE STORAGE
 * --------------------------
 */
export async function getAToken() {
    let aToken = await SecureStore.getItemAsync("accessToken");

    // Check if token exists
    if (!aToken) {
        console.log("Access token not found! Please log in again.");
        return null;
    }

    // TOKEN VERIFICATION
    /*
    try {
      const decoded = verifyToken(aToken);
      console.log("Token valid:", decoded);
    } catch (err) {
      console.log("Token invalid or expired:", err.name);
      return null;
    }
      */
    // Return token if valid
    return aToken;
}

export async function clearAToken() {
  await SecureStore.deleteItemAsync("accessToken");
  console.log("Access token cleared");
}