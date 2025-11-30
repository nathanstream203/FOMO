// client/src/tokenStorage.js
import * as SecureStore from "expo-secure-store";
import BASE_URL from './_base_url.js';

/**
 * --------------------------
 * SAVE TOKENS TO SECURE STORAGE
 * --------------------------
 */
export async function saveAToken(accessToken) {
  await SecureStore.setItemAsync("accessToken", accessToken);
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
        console.log("Access token not found!");
        return null;
    }

    return aToken;
}

/**
 * --------------------------
 * CLEAR ALL TOKENS FROM SECURE STORAGE
 * --------------------------
 */
export async function clearAToken() {
  await SecureStore.deleteItemAsync("accessToken");
  console.log("Access token cleared");
}

/**
 * --------------------------
 * VERIFY TOKENS FROM SECURE STORAGE
 * --------------------------
 */
export async function verifyToken() {
    const token = await getAToken();

    const res = await fetch(`${BASE_URL}/auth/verify`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await res.json();
    return data;
}