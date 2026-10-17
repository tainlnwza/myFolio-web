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

// ข้อมูลการศึกษาเริ่มต้น (Default Education)
export const DEFAULT_EDUCATION = [
  {
    id: "edu-1",
    institution: "Universitas Brawijaya",
    degree: "JT Edu | Faculty of Computer Science",
    period: "2025 – Present",
    icon: "GraduationCap",
    imageUrl: "" // รูปภาพ/โลโก้หน้าข้อความ
  },
  {
    id: "edu-2",
    institution: "SMKN WINONGAN",
    degree: "Teknik Komputer dan Jaringan",
    period: "2021 – 2024",
    icon: "School",
    imageUrl: ""
  }
];

// ข้อมูลประสบการณ์เริ่มต้น (Default Experience)
export const DEFAULT_EXPERIENCE = [
  {
    id: "exp-1",
    company: "Google Indonesia",
    role: "Google Student Ambassador",
    period: "2026",
    icon: "Sparkles",
    imageUrl: "" // รูปภาพ/โลโก้หน้าข้อความ
  },
  {
    id: "exp-2",
    company: "Google Developer Groups (GDGs) on Campus Brawijaya University",
    role: "Member",
    period: "2025 – 2026",
    icon: "Users",
    imageUrl: ""
  },
  {
    id: "exp-3",
    company: "Hology 9.0",
    role: "Staff Technology | UI/UX Designer",
    period: "2024",
    icon: "Layers",
    imageUrl: ""
  }
];

// ข้อมูล Tech Stack เริ่มต้น (Default Tech Stack Cards สไตล์ภาพแนบที่ 4)
export const DEFAULT_TECH_STACK = [
  { id: "tech-1", name: "HTML", icon: "Layout", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg" },
  { id: "tech-2", name: "CSS", icon: "Palette", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" },
  { id: "tech-3", name: "JavaScript", icon: "FileCode", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" },
  { id: "tech-4", name: "TypeScript", icon: "Code", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" },
  { id: "tech-5", name: "React", icon: "Atom", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" },
  { id: "tech-6", name: "Next.js", icon: "Layers", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg" },
  { id: "tech-7", name: "Tailwind", icon: "Wind", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" },
  { id: "tech-8", name: "Node.js", icon: "Server", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" },
  { id: "tech-9", name: "PostgreSQL", icon: "Database", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" },
  { id: "tech-10", name: "Firebase", icon: "Flame", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-plain.svg" },
  { id: "tech-11", name: "Git", icon: "GitBranch", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg" },
  { id: "tech-12", name: "Figma", icon: "Figma", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/figma/figma-original.svg" }
];

// ตำแหน่ง/บทบาทความเชี่ยวชาญเริ่มต้น (สำหรับ Typewriter Loop Animation)
export const DEFAULT_SUBTITLES = [
  "Full-Stack Developer",
  "Software Engineer",
  "UI/UX Designer",
  "Tech Enthusiast"
];

// รูปภาพแกลเลอรีเริ่มต้น (Highlight Gallery ภาพบรรยากาศ & รางวัล)
export const DEFAULT_GALLERY = [
  {
    id: "gal-1",
    title: "University Contest & Activity",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "gal-2",
    title: "Campus Achievement & Pride",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "gal-3",
    title: "Student Project & Celebration",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "gal-4",
    title: "Team Developer Community",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "gal-5",
    title: "Tech Presentation & Seminar",
    imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "gal-6",
    title: "Award Certificate Ceremony",
    imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "gal-7",
    title: "Medal & Hackathon Winners",
    imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=80"
  }
];

export const DEFAULT_CERTIFICATES = [
  { id: "cert-1", imageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=900&q=80" },
  { id: "cert-2", imageUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=900&q=80" },
  { id: "cert-3", imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80" }
];

export const DEFAULT_AWARDS = [
  { id: "award-1", imageUrl: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=900&q=80" },
  { id: "award-2", imageUrl: "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=900&q=80" }
];

// ข้อมูลตั้งต้นสำหรับโครงสร้างเว็บไซต์และช่องเว้นสำหรับใส่เนื้อหา (Skeleton & Placeholders)
export const DEFAULT_HERO = {
  name: "[ ชื่อ-นามสกุลของคุณ ]",
  title: "[ ตำแหน่ง เช่น Full-Stack Developer | Software Engineer ]",
  subtitles: DEFAULT_SUBTITLES,
  headline: "[ Turning Ideas Into Reality ]",
  status: "[ พร้อมรับงาน / Open for Opportunities ]",
  bio: "[ ข้อความแนะนำตัวและคำอธิบายเป้าหมายของคุณ เล่าถึงความสนใจและสิ่งที่กำลังทำ เว้นไว้สำหรับใส่เนื้อหา ]",
  heroImageUrl: "", // รูปภาพโปรไฟล์ส่วนแรก (Hero)
  aboutImageUrl: "", // รูปภาพโปรไฟล์ส่วน About Me
  imageUrl: "", // Legacy fallback
  yearsExp: "[ 1+ ]",
  projectsCount: "[ 10+ ]",
  awardsCount: "[ 5+ ]",
  resumeUrl: "#",
  education: DEFAULT_EDUCATION,
  experience: DEFAULT_EXPERIENCE,
  techStack: DEFAULT_TECH_STACK,
  gallery: DEFAULT_GALLERY,
  certificates: DEFAULT_CERTIFICATES,
  awards: DEFAULT_AWARDS
};

export const DEFAULT_CATEGORIES = [
  { id: "cat-projects", name: "💻 ผลงานโปรเจกต์ (Projects)" },
  { id: "cat-certificates", name: "📜 เกียรติบัตร & วุฒิบัตร (Certificates)" },
  { id: "cat-awards", name: "🏆 รางวัลและการแข่งขัน (Awards)" }
];

export const DEFAULT_ITEMS = [
  {
    id: "item-1",
    categoryId: "cat-projects",
    title: "[ ชื่อผลงานโปรเจกต์ที่ 1 ]",
    description: "[ คำอธิบายสั้นของโปรเจกต์สำหรับแสดงบนการ์ดหน้าแรก ]",
    detailDescription: "[ คำอธิบายรายละเอียดโปรเจกต์เชิงลึก ปัญหาที่ระบบเข้ามาช่วยแก้ไข สถาปัตยกรรม และฟังก์ชันการทำงานทั้งหมดสำหรับแสดงในหน้ารายละเอียด ]",
    tags: ["[ React ]", "[ Tailwind CSS ]", "[ Node.js ]"],
    demoUrl: "https://example.com",
    githubUrl: "https://github.com",
    imageUrl: "", // เว้นว่างไว้สำหรับใส่รูปภาพผลงาน
    detailImages: []
  },
  {
    id: "item-2",
    categoryId: "cat-projects",
    title: "[ ชื่อผลงานโปรเจกต์ที่ 2 ]",
    description: "[ คำอธิบายสั้นของโปรเจกต์สำหรับแสดงบนการ์ดหน้าแรก ]",
    detailDescription: "[ คำอธิบายรายละเอียดโปรเจกต์เชิงลึก สรุปภาพรวมของสถาปัตยกรรมระบบ และผลลัพธ์การใช้งานจริง ]",
    tags: ["[ Next.js ]", "[ TypeScript ]", "[ PostgreSQL ]"],
    demoUrl: "https://example.com",
    githubUrl: "https://github.com",
    imageUrl: "",
    detailImages: []
  },
  {
    id: "item-3",
    categoryId: "cat-certificates",
    title: "[ ชื่อใบรับรอง / เกียรติบัตรที่ 1 ]",
    description: "[ สถาบันหรือองค์กรผู้ออกเกียรติบัตร เช่น Google / Coursera / สถาบันการศึกษา ]",
    tags: ["[ Certificate ]", "[ Online Course ]"],
    demoUrl: "",
    githubUrl: "",
    imageUrl: ""
  },
  {
    id: "item-4",
    categoryId: "cat-certificates",
    title: "[ ชื่อใบรับรอง / เกียรติบัตรที่ 2 ]",
    description: "[ สถาบันหรือองค์กรผู้ออกเกียรติบัตร พร้อมระบุทักษะที่ผ่านการอบรม ]",
    tags: ["[ Certificate ]", "[ Professional ]"],
    demoUrl: "",
    githubUrl: "",
    imageUrl: ""
  },
  {
    id: "item-5",
    categoryId: "cat-awards",
    title: "[ ชื่อรางวัล / การแข่งขันที่ 1 ]",
    description: "[ ชื่องานแข่งขันหรือการประกวด พร้อมระบุรางวัลที่ได้รับ เช่น รางวัลชนะเลิศอันดับ 1 ]",
    tags: ["[ Hackathon ]", "[ Award ]"],
    demoUrl: "",
    githubUrl: "",
    imageUrl: ""
  }
];

export const DEFAULT_CONTACTS = [
  { id: "c-1", icon: "Mail", label: "Email Address", value: "[ your.email@example.com ]", link: "mailto:your.email@example.com", color: "#00e5ff" },
  { id: "c-2", icon: "Github", label: "GitHub Profile", value: "[ github.com/yourusername ]", link: "https://github.com", color: "#a855f7" },
  { id: "c-3", icon: "Linkedin", label: "LinkedIn Profile", value: "[ linkedin.com/in/yourname ]", link: "https://linkedin.com", color: "#3b82f6" },
  { id: "c-4", icon: "Instagram", label: "Instagram", value: "[ @your_instagram ]", link: "https://instagram.com", color: "#ec4899" },
  { id: "c-5", icon: "MapPin", label: "Location", value: "[ กรุงเทพมหานคร, ประเทศไทย ]", link: "#", color: "#10b981" }
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
let initPromise = null;
const ensureInitialized = () => {
  if (initPromise) return initPromise;

  initPromise = (async () => {
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
            detailDescription: item.detailDescription || item.description,
            imageUrl: item.imageUrl || "",
            tags: item.tags || []
          });
        }
        for (const contact of DEFAULT_CONTACTS) {
          await setDoc(doc(db, "contacts", contact.id), {
            icon: contact.icon,
            label: contact.label,
            value: contact.value,
            color: contact.color,
            link: contact.link || ""
          });
        }
        // บันทึกแฟล็กระบุว่าเตรียมข้อมูลเริ่มต้นแล้ว
        await setDoc(doc(db, "settings", "initialized"), { initialized: true });
        console.log("🔥 Firebase initialized with skeleton data!");
      }
    } catch (e) {
      console.error("Firebase initialization failed:", e);
    }
  } else {
    // ใช้คีย์ v2 สำหรับ skeleton placeholders โครงสร้างใหม่
    if (!localStorage.getItem("folio_v2_initialized")) {
      setLocal("folio_hero", DEFAULT_HERO);
      setLocal("folio_categories", DEFAULT_CATEGORIES);
      setLocal("folio_items", DEFAULT_ITEMS);
      setLocal("folio_contacts", DEFAULT_CONTACTS);
      localStorage.setItem("folio_v2_initialized", "true");
      console.log("⚠️ LocalStorage initialized with skeleton placeholders!");
    }
  }
})();

  return initPromise;
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
        // ปรับความละเอียดภาพให้คมชัดระดับ Full HD (สูงสุด 1600px) ไม่ลดทอนจนเบลอ
        const MAX_DIMENSION = 1600;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // บันทึกด้วยคุณภาพสูง 88% (0.88) เพื่อให้ภาพคมชัดระดับ HD และขนาดไฟล์ยังกะทัดรัด
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.88);
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
  let rawData = null;
  if (isFirebaseConfigured) {
    try {
      const snap = await getDoc(doc(db, "settings", "hero"));
      if (snap.exists()) rawData = snap.data();
    } catch (e) {
      console.error(e);
    }
  } else {
    rawData = getLocal("folio_hero", null);
  }

  if (!rawData) rawData = { ...DEFAULT_HERO };

  // ผสานข้อมูลเริ่มต้นเพื่อรองรับรูปภาพแยกส่วน (Hero & About) และรายการการศึกษา/ประสบการณ์
  return {
    ...DEFAULT_HERO,
    ...rawData,
    heroImageUrl: rawData.heroImageUrl || rawData.imageUrl || "",
    aboutImageUrl: rawData.aboutImageUrl || rawData.imageUrl || "",
    education: Array.isArray(rawData.education) && rawData.education.length > 0 
      ? rawData.education 
      : DEFAULT_EDUCATION,
    experience: Array.isArray(rawData.experience) && rawData.experience.length > 0 
      ? rawData.experience 
      : DEFAULT_EXPERIENCE,
    techStack: Array.isArray(rawData.techStack) && rawData.techStack.length > 0
      ? rawData.techStack
      : DEFAULT_TECH_STACK,
    subtitles: Array.isArray(rawData.subtitles) && rawData.subtitles.length > 0
      ? rawData.subtitles
      : (rawData.title ? [rawData.title] : DEFAULT_SUBTITLES),
    gallery: Array.isArray(rawData.gallery) && rawData.gallery.length > 0
      ? rawData.gallery
      : DEFAULT_GALLERY
  };
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
    categoryId: item.categoryId || "cat-projects",
    title: item.title || "",
    description: item.description || "",
    detailDescription: item.detailDescription !== undefined ? item.detailDescription : (item.description || ""),
    imageUrl: item.imageUrl || "",
    detailImages: Array.isArray(item.detailImages) ? item.detailImages : [],
    tags: Array.isArray(item.tags) ? item.tags : [],
    demoUrl: item.demoUrl || "",
    githubUrl: item.githubUrl || ""
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
    categoryId: item.categoryId || "cat-projects",
    title: item.title || "",
    description: item.description || "",
    detailDescription: item.detailDescription !== undefined ? item.detailDescription : (item.description || ""),
    imageUrl: item.imageUrl || "",
    detailImages: Array.isArray(item.detailImages) ? item.detailImages : [],
    tags: Array.isArray(item.tags) ? item.tags : [],
    demoUrl: item.demoUrl || "",
    githubUrl: item.githubUrl || ""
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
