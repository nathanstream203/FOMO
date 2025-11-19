import admin from "../firebaseConfig/firebaseAdmin.js";

export async function verifyFirebaseToken(idToken) {
  return await admin.auth().verifyIdToken(idToken);
}