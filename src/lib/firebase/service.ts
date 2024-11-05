import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";

import app from "./init"; // Pastikan app sudah di-inisialisasi dengan benar

const firestore = getFirestore(app);

// Fungsi untuk mengambil semua data dari koleksi
export async function retrieveData(collectionName: string) {
  const snapshot = await getDocs(collection(firestore, collectionName));
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return data;
}

// Fungsi untuk mengambil data berdasarkan ID dari koleksi
export async function retrieveDataById(collectionName: string, id: string) {
  const snapshot = await getDoc(doc(firestore, collectionName, id));
  const data = snapshot.data();

  return data;
}
