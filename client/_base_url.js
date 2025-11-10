import Constants from "expo-constants";

let BASE_URL;

try {
  // Try to extract host from any possible field
  const debuggerHost =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.host ||
    Constants.manifest?.debuggerHost;

  if (debuggerHost) {
    const host = debuggerHost.split(":").shift();
    BASE_URL = `http://${host}:5000`; // your backend port
  } else {
    // Fallback if still undefined
    BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "http://localhost:3500";
  }
} catch (e) {
  BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "http://localhost:4000";
}

export default BASE_URL;
