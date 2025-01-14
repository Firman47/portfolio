import * as admin from "firebase-admin";
import * as fireorm from "fireorm";
import serviceAccount from "../../firestore.creds.json";

let isInitialized = false;

if (!admin.apps.length) {
  admin.initializeApp({
    // credential: admin.credential.cert(serviceAccount as object),
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  });
  console.log("Firebase Admin initialized.");
}

const firestore = admin.firestore();
const database = admin.database();

if (!isInitialized) {
  fireorm.initialize(firestore);
  isInitialized = true;
  console.log("FireORM initialized.");
}

export { firestore, database };
