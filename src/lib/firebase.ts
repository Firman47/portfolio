import * as admin from "firebase-admin";
import * as fireorm from "fireorm";
import serviceAccount from "../../firestore.creds.json";

let isInitialized = false;

function initializeFirebase() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as object),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
    });
    console.log("Firebase Admin initialized.");
  }

  const firestore = admin.firestore();

  if (!isInitialized) {
    fireorm.initialize(firestore);
    isInitialized = true;
    console.log("FireORM initialized.");
  }

  return firestore;
}

export const firestore = initializeFirebase();
