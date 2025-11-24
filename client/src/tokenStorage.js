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
  await SecureStore.setItemAsync("accessToken", accessToken);
}

export async function saveRToken(refreshToken) {
  await SecureStore.setItemAsync("refreshToken", refreshToken);
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

    return aToken;
}

export async function clearAToken() {
  await SecureStore.deleteItemAsync("accessToken");
  console.log("Access token cleared");
}