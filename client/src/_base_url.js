import Constants from "expo-constants";

/** @type {string} */
let BASE_URL;

BASE_URL = process.env.EXPO_PUBLIC_DIGITALOCEAN || "http://localhost:2500";

/*
try {
  // Try to extract host from any possible field
  const debuggerHost =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.host ||
    Constants.manifest?.debuggerHost;

  if (debuggerHost) {
    const host = debuggerHost.split(":").shift();
    BASE_URL = `http://${host}:5000`; 
  } else {
    // Fallback if still undefined
    BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "http://localhost:3500";
  }
} catch (e) {
  BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "http://localhost:4000";
}
*/


console.warn("BASE_URL set to:", BASE_URL);
export default BASE_URL;
