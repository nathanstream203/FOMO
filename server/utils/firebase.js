import admin from "../firebase/admin.js";

export async function verifyFirebaseToken(idToken) {
  return await admin.auth().verifyIdToken(idToken);
}