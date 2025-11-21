// client/src/tokenStorage.js
// Utility functions to save, retrieve, and clear tokens from secure storage
// Stores the JWT + refresh token securely on the device using Expo SecureStore.

import * as SecureStore from "expo-secure-store";

export async function saveATokenWithDate(accessToken) {
  const tokenTimeout = Number(process.env.EXPO_PUBLIC_A_TOKEN_TIMEOUT_TEST); // 15m in milliseconds
  const expiresAt = Date.now() + tokenTimeout;

  await SecureStore.setItemAsync("accessToken", accessToken.token);
  await SecureStore.setItemAsync("accessTokenExpiresAt", expiresAt.toString());

  console.log("Access token and expiration saved");
}

export async function getAToken() {
    let aToken = await SecureStore.getItemAsync("accessToken");
    let aExpiresAtString = await SecureStore.getItemAsync("accessTokenExpiresAt");

    // Check if token exists
    if (!aToken || !aExpiresAtString) {
        console.log("Access token or access token date not found! Please log in again.");
        return null;
    }

    // Check if token is expired      
    const expiresAt = Number(aExpiresAtString);
    const timeNow = Date.now();
    const timeRemaining = (expiresAt - timeNow) / 1000 / 60; // in minutes

    if (timeNow >= expiresAt) {
        console.log("Access token is no longer valid : Expired token");
        return null;
    } else {
        console.log("Access token is valid : ", timeRemaining, " minutes remaining.");
    }

    // Return token if valid
    return aToken;
}

export async function clearAToken() {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("accessTokenExpiresAt");
  console.log("Access token and token expiration cleared");
}