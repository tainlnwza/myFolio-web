import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// ค่าติดตั้ง Firebase (หากผู้ใช้สร้างเสร็จแล้ว ให้เอาคีย์ที่ได้จาก Firebase Console มาใส่แทนที่ตรงนี้)
const firebaseConfig = {
  apiKey: "AIzaSyBCPqFJIM08MfMiQrPx3nP0HgigNsUsivk",
  authDomain: "myfolio-website.firebaseapp.com",
  databaseURL: "https://myfolio-website-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "myfolio-website",
  storageBucket: "myfolio-website.firebasestorage.app",
  messagingSenderId: "768163368469",
  appId: "1:768163368469:web:9b29b950222b2f7372c81c",
  measurementId: "G-0JJTBGKGYE"
};

// ตรวจสอบว่าคีย์เป็นของจริงหรือไม่ (ถ้าเป็นค่าเริ่มต้นจะถือว่ายังไม่ได้เชื่อมต่อ)
const isFirebaseConfigured =
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "YOUR_PROJECT_ID";

let app;
let db = null;
let analytics = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app); // ใช้เฉพาะ Cloud Firestore (ฟรี 100% ไม่ต้องกรอกบัตรเครดิต)
    analytics = getAnalytics(app);
    console.log("🔥 Connected to Firebase Firestore and Analytics successfully!");
  } catch (error) {
    console.error("❌ Firebase initialization error:", error);
  }
} else {
  console.warn("⚠️ Firebase is not configured yet. Using LocalStorage fallback for demo mode.");
}

export { db, isFirebaseConfigured, analytics };
