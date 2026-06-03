import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const getHospitals = async () => {
  const snapshot = await getDocs(
    collection(db, "hospitals")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};