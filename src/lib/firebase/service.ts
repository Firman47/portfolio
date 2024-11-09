import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
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

// crete data
export async function createData(collectionName: string, data: object) {
  const docRef = await addDoc(collection(firestore, collectionName), data);
  return { id: docRef.id, ...data };
}

// update data
export async function updateData(
  collectionName: string,
  id: string,
  data: object
) {
  const docRef = doc(firestore, collectionName, id);
  await updateDoc(docRef, data);
  return { id, ...data };
}

// delete data
export async function deleteData(collectionName: string, id: string) {
  const docRef = doc(firestore, collectionName, id);
  await deleteDoc(docRef);
  return { id };
}
