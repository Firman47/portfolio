import * as admin from "firebase-admin";
import * as fireorm from "fireorm";
import serviceAccount from "../../firestore.creds.json";

let isFireORMInitialized = false; // Gunakan flag untuk mencegah inisialisasi ganda

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as object),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  });
  console.log("Firebase Admin initialized.");
}

const firestore = admin.firestore();

if (!isFireORMInitialized) {
  // Pastikan hanya diinisialisasi sekali
  fireorm.initialize(firestore);
  isFireORMInitialized = true;
  console.log("FireORM initialized.");
}

export { firestore };
