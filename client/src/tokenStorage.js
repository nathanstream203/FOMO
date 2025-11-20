// client/src/tokenStorage.js
// Utility functions to save, retrieve, and clear tokens from secure storage
// Stores the JWT + refresh token securely on the device using Expo SecureStore.

import * as SecureStore from "expo-secure-store";

/*
export async function saveTokens(accessToken, refreshToken) {
  await SecureStore.setItemAsync("accessToken", accessToken);
  await SecureStore.setItemAsync("refreshToken", refreshToken);
}

export async function getAccessToken() {
    let result = await SecureStore.getItemAsync("accessToken");
    if (result) {
      return result;
    } else {
        console.log("No access token found");
      return null;
    }
}

export async function getRefreshToken() {
    let result = await SecureStore.getItemAsync("refreshToken");
    if (result) {
      return result;
    } else {
        console.log("No access token found");
      return null;
    }
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
}
  */

export async function saveAToken(accessToken) {
  await SecureStore.setItemAsync("accessToken", accessToken.token);
}

export async function getAToken() {
    let result = await SecureStore.getItemAsync("accessToken");
    if (result) {
      return result;
    } else {
        console.log("No access token found");
      return null;
    }
}