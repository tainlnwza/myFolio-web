import { db, isFirebaseConfigured } from "./firebase";
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";

// ข้อมูลตั้งต้นสำหรับโหมดทดสอบ (Mock Data)
const DEFAULT_HERO = {
  name: "สมชาย รักดี (Somchai Rakdee)",
  title: "Computer Science Student & Software Developer",
  bio: "ยินดีต้อนรับเข้าสู่เว็บไซต์พอร์ตโฟลิโอและคลังเกียรติบัตรออนไลน์ของผม! ผมมีความสนใจเกี่ยวกับการพัฒนาเว็บแอปพลิเคชัน วิทยาการข้อมูล และเทคโนโลยีความปลอดภัย เว็บนี้รวบรวมผลงาน เกียรติบัตร และรางวัลที่ผมได้รับจากการเข้าร่วมแข่งขันและทำกิจกรรมต่าง ๆ",
  imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80"
};

const DEFAULT_CATEGORIES = [
  { id: "cat-1", name: "🏆 รางวัลและการแข่งขัน (Awards)" },
  { id: "cat-2", name: "💻 คอร์สและการอบรม (Certificates)" },
  { id: "cat-3", name: "🤝 กิจกรรมและจิตอาสา (Activities)" }
];

const DEFAULT_ITEMS = [
  {
    id: "item-1",
    categoryId: "cat-1",
    title: "ชนะเลิศการประกวด Hackathon ระดับประเทศ",
    description: "ได้รับรางวัลชนะเลิศอันดับ 1 ในหัวข้อ Smart City Innovation โดยพัฒนาเว็บแอปพลิเคชันช่วยบริหารจัดการพลังงานในชุมชนร่วมกับทีม",
    imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "item-2",
    categoryId: "cat-1",
    title: "รองชนะเลิศการตอบปัญหาวิทยาการคอมพิวเตอร์",
    description: "รางวัลรองชนะเลิศอันดับ 2 ในงานสัปดาห์วิทยาศาสตร์แห่งชาติ ครอบคลุมวิชา Algorithm, Data Structures และ Network Security",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "item-3",
    categoryId: "cat-2",
    title: "Full-Stack Web Development Course",
    description: "เกียรติติดบัตรสำเร็จการศึกษาหลักสูตรเรียนเขียนโปรแกรมพัฒนาเว็บแอปพลิเคชัน 120 ชั่วโมง เรียนรู้ React, Node.js และ MongoDB",
    imageUrl: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "item-4",
    categoryId: "cat-3",
    title: "วิทยากรค่ายคอมพิวเตอร์พี่ย่อยสอนน้อง",
    description: "ทำหน้าที่เป็นผู้ช่วยสอนและวิทยากรแนะนำความรู้พื้นฐานเกี่ยวกับการเขียนโปรแกรมเบื้องต้น (Scratch, Python) ให้แก่เยาวชน",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80"
  }
];

const DEFAULT_CONTACTS = [
  { id: "c-1", icon: "Mail", label: "Email", value: "somchai.rakdee@example.com", color: "#00d2ff" },
  { id: "c-2", icon: "Phone", label: "Phone", value: "089-123-4567", color: "#0055ff" },
  { id: "c-3", icon: "Github", label: "GitHub", value: "github.com/somchairakdee", color: "#6e5494" },
  { id: "c-4", icon: "Facebook", label: "Facebook", value: "facebook.com/somchairakdee", color: "#1877F2" },
  { id: "c-5", icon: "MessageCircle", label: "Line ID", value: "somchai_line", color: "#06C755" },
  { id: "c-6", icon: "Instagram", label: "Instagram", value: "@somchairakdee", color: "#E1306C" }
];

// Helper สำหรับ LocalStorage
const getLocal = (key, fallback) => {
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : fallback;
};

const setLocal = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

/* ==========================================================================
   ฟังก์ชันตรวจเช็คและสร้างข้อมูลเริ่มต้น (Database Seeding)
   ป้องกันปัญหาระบบเขียนข้อมูล Mock ทับหลังจากกดลบออกจนเกลี้ยง
   ========================================================================== */
const ensureInitialized = async () => {
  if (isFirebaseConfigured) {
    try {
      const initDoc = await getDoc(doc(db, "settings", "initialized"));
      if (!initDoc.exists()) {
        // อัปโหลดชุดเริ่มต้นขึ้นคลาวด์เพียงครั้งแรกครั้งเดียว
        await setDoc(doc(db, "settings", "hero"), DEFAULT_HERO);
        for (const cat of DEFAULT_CATEGORIES) {
          await setDoc(doc(db, "categories", cat.id), { name: cat.name });
        }
        for (const item of DEFAULT_ITEMS) {
          await setDoc(doc(db, "portfolio_items", item.id), {
            categoryId: item.categoryId,
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl
          });
        }
        for (const contact of DEFAULT_CONTACTS) {
          await setDoc(doc(db, "contacts", contact.id), {
            icon: contact.icon,
            label: contact.label,
            value: contact.value,
            color: contact.color
          });
        }
        // บันทึกแฟล็กระบุว่าเตรียมข้อมูลเริ่มต้นแล้ว
        await setDoc(doc(db, "settings", "initialized"), { initialized: true });
        console.log("🔥 Firebase initialized with mock data!");
      }
    } catch (e) {
      console.error("Firebase initialization failed:", e);
    }
  } else {
    if (!localStorage.getItem("folio_initialized")) {
      setLocal("folio_hero", DEFAULT_HERO);
      setLocal("folio_categories", DEFAULT_CATEGORIES);
      setLocal("folio_items", DEFAULT_ITEMS);
      setLocal("folio_contacts", DEFAULT_CONTACTS);
      localStorage.setItem("folio_initialized", "true");
      console.log("⚠️ LocalStorage initialized with mock data!");
    }
  }
};

/* ==========================================================================
   ฟังก์ชันช่วยบีบอัดรูปภาพฝั่ง Client (HTML5 Canvas)
   เพื่อลดขนาดภาพเหลือไม่เกิน 100KB-150KB ทำให้สามารถเก็บลงใน Firestore ได้ฟรี 100%
   ========================================================================== */
const compressImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.65);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

/* ==========================================================================
   1. HERO SECTION FUNCTIONS
   ========================================================================== */
export const getHeroData = async () => {
  await ensureInitialized();
  if (isFirebaseConfigured) {
    try {
      const snap = await getDoc(doc(db, "settings", "hero"));
      if (snap.exists()) return snap.data();
      return DEFAULT_HERO;
    } catch (e) {
      console.error(e);
      return DEFAULT_HERO;
    }
  } else {
    return getLocal("folio_hero", DEFAULT_HERO);
  }
};

export const updateHeroData = async (data) => {
  if (isFirebaseConfigured) {
    await setDoc(doc(db, "settings", "hero"), data);
  } else {
    setLocal("folio_hero", data);
  }
};

/* ==========================================================================
   2. CATEGORIES FUNCTIONS
   ========================================================================== */
export const getCategories = async () => {
  await ensureInitialized();
  if (isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, "categories"));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.error(e);
      return [];
    }
  } else {
    return getLocal("folio_categories", []);
  }
};

export const addCategory = async (name) => {
  const newId = "cat-" + Date.now();
  if (isFirebaseConfigured) {
    await setDoc(doc(db, "categories", newId), { name });
  } else {
    const list = getLocal("folio_categories", []);
    list.push({ id: newId, name });
    setLocal("folio_categories", list);
  }
  return newId;
};

export const updateCategory = async (id, name) => {
  if (isFirebaseConfigured) {
    await updateDoc(doc(db, "categories", id), { name });
  } else {
    const list = getLocal("folio_categories", []);
    const index = list.findIndex(c => c.id === id);
    if (index !== -1) {
      list[index].name = name;
      setLocal("folio_categories", list);
    }
  }
};

export const deleteCategory = async (id) => {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, "categories", id));
  } else {
    const list = getLocal("folio_categories", []);
    const filtered = list.filter(c => c.id !== id);
    setLocal("folio_categories", filtered);
  }
};

/* ==========================================================================
   3. PORTFOLIO ITEMS FUNCTIONS
   ========================================================================== */
export const getPortfolioItems = async () => {
  await ensureInitialized();
  if (isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, "portfolio_items"));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.error(e);
      return [];
    }
  } else {
    return getLocal("folio_items", []);
  }
};

export const addPortfolioItem = async (item) => {
  const newId = "item-" + Date.now();
  const itemData = {
    categoryId: item.categoryId,
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl || ""
  };
  
  if (isFirebaseConfigured) {
    await setDoc(doc(db, "portfolio_items", newId), itemData);
  } else {
    const list = getLocal("folio_items", []);
    list.push({ id: newId, ...itemData });
    setLocal("folio_items", list);
  }
  return newId;
};

export const updatePortfolioItem = async (id, item) => {
  const itemData = {
    categoryId: item.categoryId,
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl
  };
  
  if (isFirebaseConfigured) {
    await updateDoc(doc(db, "portfolio_items", id), itemData);
  } else {
    const list = getLocal("folio_items", []);
    const index = list.findIndex(i => i.id === id);
    if (index !== -1) {
      list[index] = { id, ...itemData };
      setLocal("folio_items", list);
    }
  }
};

export const deletePortfolioItem = async (id) => {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, "portfolio_items", id));
  } else {
    const list = getLocal("folio_items", []);
    const filtered = list.filter(i => i.id !== id);
    setLocal("folio_items", filtered);
  }
};

/* ==========================================================================
   4. CONTACT SECTION FUNCTIONS
   ========================================================================== */
export const getContactData = async () => {
  await ensureInitialized();
  if (isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, "contacts"));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return list.sort((a, b) => a.id.localeCompare(b.id));
    } catch (e) {
      console.error(e);
      return [];
    }
  } else {
    return getLocal("folio_contacts", []);
  }
};

export const updateContactData = async (contacts) => {
  if (isFirebaseConfigured) {
    for (const c of contacts) {
      await setDoc(doc(db, "contacts", c.id), {
        icon: c.icon,
        label: c.label,
        value: c.value,
        color: c.color || "#00d2ff"
      });
    }
  } else {
    setLocal("folio_contacts", contacts);
  }
};

/* ==========================================================================
   5. CUSTOM CSS STORAGE FUNCTIONS
   ========================================================================== */
export const getCustomCss = async () => {
  if (isFirebaseConfigured) {
    try {
      const snap = await getDoc(doc(db, "settings", "custom_css"));
      if (snap.exists()) return snap.data().css || "";
      return "";
    } catch (e) {
      console.error("Error reading custom CSS:", e);
      return "";
    }
  } else {
    return localStorage.getItem("folio_custom_css") || "";
  }
};

export const updateCustomCss = async (css) => {
  if (isFirebaseConfigured) {
    await setDoc(doc(db, "settings", "custom_css"), { css });
  } else {
    localStorage.setItem("folio_custom_css", css);
  }
};

/* ==========================================================================
   6. FILE UPLOAD FUNCTION (Supports images & PDF files as Base64)
   ========================================================================== */
export const uploadImage = async (file) => {
  if (file) {
    try {
      // ตรวจสอบว่าเป็นไฟล์ PDF หรือไม่
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result); // ส่งคืน Raw Base64 string ของ PDF
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      
      // กรณีรูปภาพ ให้ผ่านระบบบีบอัดรูปภาพฝั่งเบราว์เซอร์เพื่อลดขนาดพื้นที่
      const base64Image = await compressImageToBase64(file);
      return base64Image;
    } catch (error) {
      console.error("Error uploading/compressing file:", error);
      throw error;
    }
  }
  return "";
};
