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
import { 
  isSupabaseConfigured, 
  uploadFileToSupabase, 
  setSupabaseAnonKey,
  getSupabaseAnonKey,
  testSupabaseConnection,
  SUPABASE_PROJECT_ID,
  SUPABASE_BUCKET_NAME,
  SUPABASE_FOLDER_CERTS_AWARDS, 
  SUPABASE_FOLDER_ACTIVITIES,
  SUPABASE_FOLDER_PROJECTS,
  SUPABASE_FOLDER_GALLERY
} from "./supabase";

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

// รวม Certificates & Awards เข้าด้วยกันเป็นชุดตั้งต้น (เพิ่มได้เฉพาะรูปภาพ)
export const DEFAULT_CERTS_AND_AWARDS = [
  ...DEFAULT_CERTIFICATES,
  ...DEFAULT_AWARDS
];

// รายการกิจกรรมและผลงานเวลาว่างเริ่มต้น (Activities: รูปภาพ, วิดีโอ, คลิป, อนิเมชัน)
export const DEFAULT_ACTIVITIES = [
  {
    id: "act-1",
    type: "image",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    title: "3D Animation Render"
  },
  {
    id: "act-2",
    type: "video",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80",
    title: "Motion Graphics Loop"
  },
  {
    id: "act-3",
    type: "image",
    url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80",
    title: "Digital Art & Leisure Design"
  },
  {
    id: "act-4",
    type: "video",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1000&q=80",
    title: "Character Animation Clip"
  }
];

// ข้อมูลตั้งต้นสำหรับโครงสร้างเว็บไซต์และช่องเว้นสำหรับใส่เนื้อหา (Skeleton & Placeholders)
export const DEFAULT_HERO = {
  name: "[ ชื่อ-นามสกุลของคุณ ]",
  title: "[ ตำแหน่ง เช่น Full-Stack Developer | Software Engineer ]",
  subtitles: DEFAULT_SUBTITLES,
  headline: "[ Turning Ideas Into Reality ]",
  status: "[ พร้อมรับงาน / Open for Opportunities ]",
  bio: "[ ข้อความแนะนำตัวและคำอธิบายเป้าหมายของคุณ เล่าถึงความสนใจและสิ่งที่กำลังทำ เว้นไว้สำหรับใส่เนื้อหา ]",
  homeBio: "[ ข้อความแนะนำตัวสั้นๆ ประวัติย่อ สำหรับแสดงในหน้าแรก (Home) ]",
  aboutBio: "[ รายละเอียดประวัติเพิ่มเติม เล่าถึงความสนใจ เป้าหมาย และประสบการณ์ สำหรับแสดงในหน้า About Me ]",
  heroImageUrl: "", // รูปภาพโปรไฟล์ส่วนแรก (Hero)
  aboutImageUrl: "", // รูปภาพโปรไฟล์ส่วน About Me
  imageUrl: "", // Legacy fallback
  yearsExp: "1+",
  projectsCount: "0",
  certsAndAwardsCount: "0",
  activitiesCount: "0",
  resumeUrl: "#",
  education: DEFAULT_EDUCATION,
  experience: DEFAULT_EXPERIENCE,
  techStack: DEFAULT_TECH_STACK,
  gallery: DEFAULT_GALLERY,
  certsAndAwards: DEFAULT_CERTS_AND_AWARDS,
  activities: DEFAULT_ACTIVITIES,
  certificates: DEFAULT_CERTIFICATES,
  awards: DEFAULT_AWARDS
};

export const DEFAULT_CATEGORIES = [
  { id: "cat-projects", name: "💻 ผลงานโปรเจกต์ (Projects)" },
  { id: "cat-certs-awards", name: "📜 เกียรติบัตร & รางวัล (Certificates & Awards)" },
  { id: "cat-activities", name: "✨ กิจกรรมและผลงานยามว่าง (Activities)" }
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
  { id: "c-github", icon: "Github", label: "GITHUB", value: "https://github.com/tainlnwza", link: "https://github.com/tainlnwza", color: "#6e5494" },
  { id: "c-facebook", icon: "Facebook", label: "FACEBOOK", value: "https://www.facebook.com/metichai.boonma", link: "https://www.facebook.com/metichai.boonma", color: "#1877F2" },
  { id: "c-instagram", icon: "Instagram", label: "INSTAGRAM", value: "cxptxinn._", link: "https://instagram.com/cxptxinn._", color: "#E1306C" },
  { id: "c-email", icon: "Mail", label: "EMAIL", value: "metichaiboonma0007@gmail.com", link: "mailto:metichaiboonma0007@gmail.com", color: "#00d2ff" },
  { id: "c-phone", icon: "Phone", label: "PHONE", value: "098-032-2142", link: "tel:0980322142", color: "#0055ff" },
  { id: "c-line", icon: "MessageCircle", label: "LINE ID", value: "captain0007", link: "#", color: "#06C755" }
];

export const CONTACT_ORDER = ["github", "facebook", "instagram", "email", "phone", "lineid"];

export const getContactType = (c) => {
  if (!c) return "other";
  const str = `${c.icon || ""} ${c.label || ""} ${c.id || ""}`.toLowerCase();
  if (str.includes("github")) return "github";
  if (str.includes("facebook")) return "facebook";
  if (str.includes("instagram") || str.includes("ig")) return "instagram";
  if (str.includes("email") || str.includes("mail")) return "email";
  if (str.includes("phone") || str.includes("tel")) return "phone";
  if (str.includes("line")) return "lineid";
  return "other";
};

export const sortContacts = (contactsList) => {
  if (!Array.isArray(contactsList)) return [];
  return [...contactsList].sort((a, b) => {
    const idxA = CONTACT_ORDER.indexOf(getContactType(a));
    const idxB = CONTACT_ORDER.indexOf(getContactType(b));
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  });
};

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
   สำหรับโลโก้ (Education/Experience/Tech): จำกัดขนาดที่ 256px ขนาดไฟล์จะเหลือเพียง ~8KB-18KB
   สำหรับภาพทั่วไป (Hero, About, Projects): จำกัดขนาดที่ 1000px คุณภาพ 82%-85%
   ทำให้ประหยัดพื้นที่จัดเก็บใน Firestore ได้มากกว่า 90% และไม่มีปัญหาเกินโควตา 1MB
   ========================================================================== */
export const compressBase64String = (base64Str, maxDim = 256, quality = 0.88) => {
  return new Promise((resolve) => {
    if (!base64Str || typeof base64Str !== "string" || !base64Str.startsWith("data:image/")) {
      return resolve(base64Str);
    }
    // หากขนาดสั้นกว่า 30,000 ตัวอักษร (ประมาณ < 22KB) แสดงว่าขนาดกะทัดรัดอยู่แล้ว
    if (base64Str.length < 30000) {
      return resolve(base64Str);
    }

    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, width, height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const webpData = canvas.toDataURL("image/webp", quality);
          if (webpData.startsWith("data:image/webp") && webpData.length < base64Str.length) {
            return resolve(webpData);
          }
        } catch (e) {
          // fallback
        }

        const pngData = canvas.toDataURL("image/png");
        if (pngData.length < base64Str.length) {
          return resolve(pngData);
        }
        resolve(base64Str);
      } catch (err) {
        resolve(base64Str);
      }
    };
    img.onerror = () => resolve(base64Str);
  });
};

const compressImageToBase64 = (file, isLogo = false) => {
  return new Promise((resolve, reject) => {
    // 1. ตรวจสอบประเภทไฟล์
    const isPng = file.type === "image/png" || file.name?.toLowerCase().endsWith(".png");
    const isWebp = file.type === "image/webp" || file.name?.toLowerCase().endsWith(".webp");
    const isSvg = file.type === "image/svg+xml" || file.name?.toLowerCase().endsWith(".svg");
    const isGif = file.type === "image/gif" || file.name?.toLowerCase().endsWith(".gif");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      // สำหรับ SVG หรือ GIF ให้อ่านเป็น Data URL ตรงๆ เพื่อรักษาเวกเตอร์และความโปร่งใส/แอนิเมชัน
      if (isSvg || isGif) {
        return resolve(event.target.result);
      }

      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        // โลโก้แสดงผลไม่เกิน 48px จึงใช้ 160px เพื่อความคมชัดสูงสุดบนหน้าจอ Retina และไฟล์มีขนาดเพียง ~3-8KB
        // รูปภาพทั่วไปจำกัดที่ 1000px
        const MAX_DIMENSION = isLogo ? 160 : 1000;
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
        // ล้าง Canvas ให้โปร่งใส 100% (Alpha: 0) ก่อนวาด เพื่อไม่ให้พื้นหลังกลายเป็นสีดำ
        ctx.clearRect(0, 0, width, height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // สำหรับโลโก้หรือไฟล์ที่มีความโปร่งใส ให้ลองส่งออกเป็น WebP ก่อนเพื่อขนาดที่เล็กที่สุดแต่คง Alpha
        if (isLogo || isPng || isWebp) {
          try {
            const webpData = canvas.toDataURL("image/webp", isLogo ? 0.90 : 0.85);
            if (webpData.startsWith("data:image/webp")) {
              return resolve(webpData);
            }
          } catch (e) {
            // fallback
          }
          return resolve(canvas.toDataURL("image/png"));
        }

        // กรณีรูปภาพทั่วไป (JPG / JPEG) บันทึกด้วยคุณภาพ 82%
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.82);
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
    homeBio: rawData.homeBio || rawData.bio || DEFAULT_HERO.homeBio,
    aboutBio: rawData.aboutBio || rawData.bio || DEFAULT_HERO.aboutBio,
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
      : DEFAULT_GALLERY,
    certsAndAwards: Array.isArray(rawData.certsAndAwards) && rawData.certsAndAwards.length > 0
      ? rawData.certsAndAwards
      : (
          ((Array.isArray(rawData.certificates) && rawData.certificates.length > 0) || (Array.isArray(rawData.awards) && rawData.awards.length > 0))
            ? [
                ...(Array.isArray(rawData.certificates) ? rawData.certificates : []),
                ...(Array.isArray(rawData.awards) ? rawData.awards : [])
              ].filter(c => c.imageUrl || c.url || c.src)
            : DEFAULT_CERTS_AND_AWARDS
        ),
    activities: Array.isArray(rawData.activities) && rawData.activities.length > 0
      ? rawData.activities
      : DEFAULT_ACTIVITIES
  };
};

export const getYouTubeId = (url) => {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
};

export const getVimeoId = (url) => {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
  return match ? match[1] : null;
};

export const isVideoMedia = (item) => {
  if (!item) return false;
  if (item.type === "video") return true;
  const url = (typeof item === "string" ? item : (item.url || item.imageUrl || item.src || "")).toLowerCase();
  if (url.startsWith("data:video/")) return true;
  if (/\.(mp4|webm|mov|ogg)($|\?)/i.test(url)) return true;
  if (getYouTubeId(url) || getVimeoId(url)) return true;
  return false;
};

export const updateHeroData = async (data) => {
  // 1. ลบฟิลด์ซ้ำซ้อนที่ไม่จำเป็น เช่น imageUrl ซ้ำกับ heroImageUrl เพื่อประหยัดพื้นที่ Firestore
  const mergedData = {
    ...data,
    bio: data.homeBio || data.aboutBio || data.bio || ""
  };
  if (mergedData.heroImageUrl) {
    delete mergedData.imageUrl;
  }
  // ลบฟิลด์เก่าที่ไม่จำเป็น เพื่อประหยัดพื้นที่ Firestore ให้ไม่เกินเพดาน 1MB
  delete mergedData.awards;
  delete mergedData.certificates;

  // 2. ตรวจสอบและลดขนาดโลโก้ใน education, experience และ techStack ไม่ให้เกิน 160px
  if (Array.isArray(mergedData.education)) {
    mergedData.education = await Promise.all(
      mergedData.education.map(async (edu) => {
        if (edu.imageUrl && edu.imageUrl.length > 15000 && edu.imageUrl.startsWith("data:")) {
          const compressed = await compressBase64String(edu.imageUrl, 160, 0.85);
          return { ...edu, imageUrl: compressed };
        }
        return edu;
      })
    );
  }

  if (Array.isArray(mergedData.experience)) {
    mergedData.experience = await Promise.all(
      mergedData.experience.map(async (exp) => {
        if (exp.imageUrl && exp.imageUrl.length > 15000 && exp.imageUrl.startsWith("data:")) {
          const compressed = await compressBase64String(exp.imageUrl, 160, 0.85);
          return { ...exp, imageUrl: compressed };
        }
        return exp;
      })
    );
  }

  if (Array.isArray(mergedData.techStack)) {
    mergedData.techStack = await Promise.all(
      mergedData.techStack.map(async (tech) => {
        if (tech.imageUrl && tech.imageUrl.length > 15000 && tech.imageUrl.startsWith("data:")) {
          const compressed = await compressBase64String(tech.imageUrl, 160, 0.85);
          return { ...tech, imageUrl: compressed };
        }
        return tech;
      })
    );
  }

  if (isFirebaseConfigured) {
    await setDoc(doc(db, "settings", "hero"), mergedData);
  } else {
    setLocal("folio_hero", mergedData);
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
      return sortContacts(list);
    } catch (e) {
      console.error(e);
      return [];
    }
  } else {
    return sortContacts(getLocal("folio_contacts", []));
  }
};

export const updateContactData = async (contacts) => {
  if (isFirebaseConfigured) {
    for (const c of contacts) {
      await setDoc(doc(db, "contacts", c.id), {
        icon: c.icon,
        label: c.label,
        value: c.value,
        color: c.color || "#00d2ff",
        link: c.link || ""
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
export const uploadImage = async (file, isLogo = false) => {
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
      
      // กรณีรูปภาพ ให้ผ่านระบบบีบอัดรูปภาพฝั่งเบราว์เซอร์เพื่อลดขนาดพื้นที่ (โลโก้จำกัดที่ 256px)
      const base64Image = await compressImageToBase64(file, isLogo);
      return base64Image;
    } catch (error) {
      console.error("Error uploading/compressing file:", error);
      throw error;
    }
  }
  return "";
};

/* ==========================================================================
   7. MEDIA UPLOAD (Supports Images and Videos for Activities)
   ========================================================================== */
export const uploadMedia = async (file) => {
  if (!file) return "";
  const isVideo = file.type?.startsWith("video/") || /\.(mp4|webm|mov|ogg)$/i.test(file.name);
  if (isVideo) {
    if (file.size > 850 * 1024) {
      throw new Error("ไฟล์วิดีโอมีขนาดใหญ่เกิน 850KB แนะนำให้ใส่ลิงก์ URL ของวิดีโอ (เช่น YouTube, Vimeo หรือ Direct MP4 URL)");
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  return uploadImage(file, false);
};

/* ==========================================================================
   8. SUPABASE STORAGE INTEGRATION (Folders: cer & award | activity pic&clip)
   ========================================================================== */
export {
  isSupabaseConfigured,
  setSupabaseAnonKey,
  getSupabaseAnonKey,
  testSupabaseConnection,
  SUPABASE_PROJECT_ID,
  SUPABASE_BUCKET_NAME,
  SUPABASE_FOLDER_CERTS_AWARDS,
  SUPABASE_FOLDER_ACTIVITIES,
  SUPABASE_FOLDER_PROJECTS,
  SUPABASE_FOLDER_GALLERY
};

/**
 * อัปโหลดรูปภาพเกียรติบัตร/รางวัลเข้าสู่ Supabase Storage (Folder: 'cer & award')
 * ได้รับ Public URL กลับมา เพื่อนำไปบันทึกใน Firestore โดยไม่ติดเพดาน 1MB
 */
export const uploadCertAwardFile = async (file) => {
  if (!file) return "";
  if (isSupabaseConfigured()) {
    return await uploadFileToSupabase(file, SUPABASE_FOLDER_CERTS_AWARDS);
  }
  // หากยังไม่ได้ใส่ Supabase Key จะส่ง Error ชัดเจนเพื่อแจ้งเตือน
  throw new Error("ยังไม่ได้เชื่อมต่อ Supabase Anon Key! กรุณากรอก Anon Key ในเมนู 'ตั้งค่า Supabase Storage' ของหน้า Control Center หรือใน .env");
};

/**
 * อัปโหลดคลิปวิดีโอหรือรูปภาพกิจกรรมเข้าสู่ Supabase Storage (Folder: 'activity pic&clip')
 * ปลดล็อคขนาดไฟล์วิดีโอและรูปภาพ ไม่ติดเพดาน 850KB อีกต่อไป
 */
export const uploadActivityFile = async (file) => {
  if (!file) return "";
  if (isSupabaseConfigured()) {
    return await uploadFileToSupabase(file, SUPABASE_FOLDER_ACTIVITIES);
  }
  throw new Error("ยังไม่ได้เชื่อมต่อ Supabase Anon Key! กรุณากรอก Anon Key ในเมนู 'ตั้งค่า Supabase Storage' ของหน้า Control Center หรือใน .env");
};

/**
 * อัปโหลดรูปภาพโปรเจกต์ (Cover และ Detail Images) เข้าสู่ Supabase Storage (Folder: 'project pic')
 */
export const uploadProjectFile = async (file) => {
  if (!file) return "";
  if (isSupabaseConfigured()) {
    return await uploadFileToSupabase(file, SUPABASE_FOLDER_PROJECTS);
  }
  throw new Error("ยังไม่ได้เชื่อมต่อ Supabase Anon Key! กรุณากรอก Anon Key ในเมนู 'ตั้งค่า Supabase Storage' ของหน้า Control Center หรือใน .env");
};

/**
 * อัปโหลดรูปภาพแกลเลอรี Coverflow Carousel เข้าสู่ Supabase Storage (Folder: 'gallery pic')
 */
export const uploadGalleryFile = async (file) => {
  if (!file) return "";
  if (isSupabaseConfigured()) {
    return await uploadFileToSupabase(file, SUPABASE_FOLDER_GALLERY);
  }
  throw new Error("ยังไม่ได้เชื่อมต่อ Supabase Anon Key! กรุณากรอก Anon Key ในเมนู 'ตั้งค่า Supabase Storage' ของหน้า Control Center หรือใน .env");
};


