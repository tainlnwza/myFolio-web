import React, { useState, useEffect } from "react";
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  DEFAULT_HERO,
  DEFAULT_CATEGORIES,
  DEFAULT_ITEMS,
  DEFAULT_CONTACTS,
  DEFAULT_TECH_STACK,
  DEFAULT_SUBTITLES,
  DEFAULT_GALLERY,
  DEFAULT_CERTS_AND_AWARDS,
  DEFAULT_ACTIVITIES,
  DEFAULT_CERTIFICATES, 
  DEFAULT_AWARDS,
  getHeroData, 
  updateHeroData, 
  getCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory, 
  getPortfolioItems, 
  addPortfolioItem, 
  updatePortfolioItem, 
  deletePortfolioItem, 
  getContactData, 
  updateContactData, 
  uploadImage,
  uploadMedia,
  uploadCertAwardFile,
  uploadActivityFile,
  uploadProjectFile,
  uploadGalleryFile,
  isSupabaseConfigured,
  setSupabaseAnonKey,
  getSupabaseAnonKey,
  testSupabaseConnection,
  SUPABASE_PROJECT_ID,
  SUPABASE_BUCKET_NAME,
  isVideoMedia,
  getYouTubeId,
  getVimeoId,
  getCustomCss,
  updateCustomCss
} from "./dbService";
import { isFirebaseConfigured } from "./firebase";
import * as Icons from "lucide-react";

// Import New Eka Wahyu UX/UI Components
import AmbientBackground from "./components/AmbientBackground";
import FloatingNavbar from "./components/FloatingNavbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import PortfolioSection from "./components/PortfolioSection";
import CoverflowCarousel from "./components/CoverflowCarousel";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import ProjectDetailView from "./components/ProjectDetailView";

// Helper สำหรับดึง Lucide Icon ตามชื่อสตริง
const DynamicIcon = ({ name, size = 20, className = "" }) => {
  const IconComponent = Icons[name] || Icons.HelpCircle;
  return <IconComponent size={size} className={className} />;
};

/* ==========================================================================
   PUBLIC PAGE COMPONENT (โครงสร้างเว็บไซต์ตามสไตล์ Eka Wahyu Portfolio)
   ========================================================================== */
const PublicPage = () => {
  // เริ่มต้นด้วยโครงสร้าง Default Skeleton ทันที เพื่อให้แสดงผลทันทีโดยไม่ต้องรอโหลด
  const [hero, setHero] = useState(DEFAULT_HERO);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [contacts, setContacts] = useState(DEFAULT_CONTACTS);
  const [activeSection, setActiveSection] = useState("home");
  const [selectedProject, setSelectedProject] = useState(null);

  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const loadAllData = async () => {
      try {
        const [heroData, catData, itemData, contactData] = await Promise.all([
          getHeroData(),
          getCategories(),
          getPortfolioItems(),
          getContactData()
        ]);
        if (isMounted) {
          if (heroData) setHero(heroData);
          if (catData && catData.length > 0) setCategories(catData);
          if (itemData && itemData.length > 0) setItems(itemData);
          if (contactData && contactData.length > 0) setContacts(contactData);
        }
      } catch (err) {
        console.error("Error loading portfolio data:", err);
      }
    };
    loadAllData();
    document.title = "MyFolio";
    return () => { isMounted = false; };
  }, [location.pathname]);

  // Scroll-Spy: อัปเดตแท็บใน Navbar อัตโนมัติตามตำแหน่งการเลื่อนหน้าจอ
  useEffect(() => {
    const sections = ["home", "about", "portfolio", "contact"];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 280;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll Reveal Observer: เพิ่มอนิเมชั่นเข้าเล็กน้อยเมื่อเลื่อนลงมาในแต่ละ Section หรือหัวข้อ
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    const revealElements = document.querySelectorAll(".scroll-reveal");
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [hero, items, categories, selectedProject]);

  if (!hero) {
    return (
      <div className="portfolio-loading-screen">
        <div className="loading-spinner-ring"></div>
        <p className="loading-text">⚡ LOADING PORTFOLIO STRUCTURE...</p>
      </div>
    );
  }

  // เมื่อผู้ใช้กดดูรายละเอียดของโปรเจกต์ ให้แสดงผลเป็นหน้าเพจแยกเดี่ยวๆ (ไม่มี Hero, About, Coverflow, Contact หรือ Navbar ทับ) ตามข้อ 2
  if (selectedProject) {
    return (
      <div className="portfolio-app-root project-detail-standalone-page">
        <AmbientBackground />
        <main className="portfolio-main-content standalone-detail-main">
          <ProjectDetailView 
            project={selectedProject} 
            onBack={() => {
              setSelectedProject(null);
              window.scrollTo({ top: 0, behavior: "instant" });
              setTimeout(() => {
                const el = document.getElementById("portfolio");
                if (el) {
                  const yOffset = -90;
                  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
                }
                // กระตุ้นให้อนิเมชั่น scroll-reveal แสดงผลองค์ประกอบที่อยู่ในหน้าจอทันที
                document.querySelectorAll(".scroll-reveal").forEach((elem) => {
                  const rect = elem.getBoundingClientRect();
                  if (rect.top < window.innerHeight + 100) {
                    elem.classList.add("revealed");
                  }
                });
              }, 60);
            }} 
          />
        </main>
      </div>
    );
  }

  return (
    <div className="portfolio-app-root">
      {/* 1. Ambient Background (Aurora Mesh & Cyber Grid Glow) */}
      <AmbientBackground />

      {/* 2. Floating Pill Navbar */}
      <FloatingNavbar 
        activeSection={activeSection} 
        onNavClick={setActiveSection} 
      />

      {/* Main Content Sections */}
      <main className="portfolio-main-content">
        {/* 3. Hero Section (เว้นสำหรับใส่พาดหัว แนะนำตัว และรูปโปรไฟล์) */}
        <HeroSection hero={hero} contacts={contacts} />

        {/* 4. About Section (เว้นสำหรับใส่ประวัติส่วนตัว สถิติ และไทม์ไลน์) */}
        <AboutSection hero={hero} items={items} />

        {/* 5. Portfolio Section (4 แท็บ: Projects, Certificates & Awards, Activities, Tech Stack) */}
        <PortfolioSection 
          items={items} 
          categories={categories} 
          techStack={hero.techStack} 
          certsAndAwards={hero.certsAndAwards}
          activities={hero.activities}
          certificates={hero.certificates}
          awards={hero.awards}
          onSelectProject={(proj) => {
            setSelectedProject(proj);
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
        />

        {/* 6. Coverflow Carousel (3D Carousel สำหรับรูปภาพไฮไลท์ผลงาน/กิจกรรม) */}
        <CoverflowCarousel gallery={hero.gallery} items={items} />

        {/* 7. Contact Section (การ์ดติดต่อ และฟอร์มส่งข้อความ) */}
        <ContactSection contacts={contacts} />
      </main>
    </div>
  );
};

/* ==========================================================================
   ADMIN PAGE COMPONENT (LOCAL-ONLY CONTROL CENTER)
   ยังคงระบบจัดการหลังบ้านครบถ้วน สำหรับเจ้าของเว็บกรอกข้อมูล/อัปโหลดรูปภาพ
   ========================================================================== */
const AdminPage = ({ setGlobalCustomCss }) => {
  const [activeTab, setActiveTab] = useState("hero");
  const [toastMsg, setToastMsg] = useState("");
  
  // Data States
  const [hero, setHero] = useState({ 
    name: "", 
    title: "", 
    subtitles: [],
    headline: "",
    status: "",
    bio: "", 
    heroImageUrl: "",
    aboutImageUrl: "",
    imageUrl: "",
    yearsExp: "",
    projectsCount: "",
    awardsCount: "",
    resumeUrl: "",
    education: [],
    experience: [],
    techStack: [],
    gallery: []
  });
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [cssCode, setCssCode] = useState("");

  // Subtitle Loop Animation states
  const [newSubtitleInput, setNewSubtitleInput] = useState("");
  
  // Modals / Editing States for Portfolio Items
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({ 
    title: "", 
    description: "", 
    detailDescription: "",
    categoryId: "", 
    imageUrl: "", 
    detailImages: [],
    tags: "", 
    demoUrl: "", 
    githubUrl: "", 
    file: null 
  });

  // Timeline (Education & Experience) states
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [timelineType, setTimelineType] = useState("education"); // "education" | "experience"
  const [editingTimelineId, setEditingTimelineId] = useState(null);
  const [timelineForm, setTimelineForm] = useState({
    title: "",
    subtitle: "",
    period: "",
    icon: "GraduationCap",
    imageUrl: ""
  });

  // Tech Stack states & presets
  const [showTechModal, setShowTechModal] = useState(false);
  const [editingTechId, setEditingTechId] = useState(null);
  const [techForm, setTechForm] = useState({
    name: "",
    imageUrl: "",
    icon: "Code2"
  });

  // Highlight Gallery (3D Coverflow) states
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    imageUrl: "",
    file: null
  });

  // Certificates & Awards (รวม Certificates & Awards เข้าด้วยกัน - เพิ่มได้เฉพาะรูปภาพเกียรติบัตร)
  const [certAwardImageUrl, setCertAwardImageUrl] = useState("");
  const [showCertAwardModal, setShowCertAwardModal] = useState(false);

  // Activities (เพิ่มได้ทั้งคลิปทั้งภาพ)
  const [activityForm, setActivityForm] = useState({
    type: "image", // 'image' | 'video'
    url: "",
    thumbnailUrl: ""
  });
  const [showActivityModal, setShowActivityModal] = useState(false);
  
  // Supabase Storage configuration states
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(getSupabaseAnonKey() || "");
  const [supabaseTesting, setSupabaseTesting] = useState(false);
  const [supabaseStatusMsg, setSupabaseStatusMsg] = useState("");

  const TECH_PRESETS = [
    { name: "HTML", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg", icon: "Layout" },
    { name: "CSS", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg", icon: "Palette" },
    { name: "JavaScript", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg", icon: "FileCode" },
    { name: "TypeScript", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg", icon: "Code" },
    { name: "React", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg", icon: "Atom" },
    { name: "Next.js", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg", icon: "Layers" },
    { name: "Vue.js", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original.svg", icon: "Compass" },
    { name: "Tailwind", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg", icon: "Wind" },
    { name: "Node.js", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg", icon: "Server" },
    { name: "Python", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg", icon: "Terminal" },
    { name: "Flutter", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/flutter/flutter-original.svg", icon: "Smartphone" },
    { name: "Docker", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg", icon: "Box" },
    { name: "PostgreSQL", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg", icon: "Database" },
    { name: "MongoDB", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg", icon: "Database" },
    { name: "Firebase", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-plain.svg", icon: "Flame" },
    { name: "Git", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg", icon: "GitBranch" },
    { name: "Figma", imageUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/figma/figma-original.svg", icon: "Figma" }
  ];
  
  const [newCatName, setNewCatName] = useState("");
  const [editingCatId, setEditingCatId] = useState(null);
  const [editingCatName, setEditingCatName] = useState("");

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    const heroData = await getHeroData();
    const catData = await getCategories();
    const itemData = await getPortfolioItems();
    const contactData = await getContactData();
    const cssData = await getCustomCss();
    
    setHero(heroData);
    setCategories(catData);
    setItems(itemData);
    setContacts(contactData);
    setCssCode(cssData);

    // ตรวจสอบและบีบอัดโลโก้เดิมที่เคยบันทึกไว้เกินขนาด (ป้องกันปัญหาเอกสาร Firestore เต็ม)
    if (heroData) {
      let needsOptimization = false;
      if (Array.isArray(heroData.education) && heroData.education.some(e => e.imageUrl && e.imageUrl.length > 35000)) {
        needsOptimization = true;
      }
      if (Array.isArray(heroData.experience) && heroData.experience.some(e => e.imageUrl && e.imageUrl.length > 35000)) {
        needsOptimization = true;
      }
      if (needsOptimization) {
        updateHeroData(heroData).catch(err => console.warn("Auto-optimizing legacy logos:", err));
      }
    }
  };

  // 1. Save Hero
  const handleSaveHero = async (e) => {
    e.preventDefault();
    try {
      const heroToSave = {
        ...hero,
        homeBio: hero.homeBio !== undefined ? hero.homeBio : (hero.bio || ""),
        aboutBio: hero.aboutBio !== undefined ? hero.aboutBio : (hero.bio || "")
      };
      await updateHeroData(heroToSave);
      setHero(heroToSave);
      triggerToast("💾 บันทึกข้อมูลแนะนำตัวเรียบร้อยแล้ว!");
    } catch (e) {
      console.error(e);
      triggerToast("❌ เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  // Upload separate Hero Section Image
  const handleHeroImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      triggerToast("⏳ กำลังอัปโหลดรูปภาพโปรไฟล์ Hero...");
      try {
        const url = await uploadImage(file, false);
        setHero(prev => ({ ...prev, heroImageUrl: url }));
        triggerToast("✅ อัปโหลดรูปภาพโปรไฟล์ Hero เสร็จสิ้น!");
      } catch (e) {
        console.error(e);
        triggerToast("❌ อัปโหลดรูปภาพไม่สำเร็จ");
      }
    }
  };

  // Upload separate About Section Image
  const handleAboutImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      triggerToast("⏳ กำลังอัปโหลดรูปภาพ About Me...");
      try {
        const url = await uploadImage(file);
        setHero(prev => ({ ...prev, aboutImageUrl: url }));
        triggerToast("✅ อัปโหลดรูปภาพ About Me เสร็จสิ้น!");
      } catch (e) {
        console.error(e);
        triggerToast("❌ อัปโหลดรูปภาพไม่สำเร็จ");
      }
    }
  };

  // 1.0 Subtitles Add & Delete Handlers (Typewriter Loop Animation)
  const handleAddSubtitle = () => {
    const trimmed = newSubtitleInput.trim();
    if (!trimmed) return;
    const currentSubs = Array.isArray(hero.subtitles) && hero.subtitles.length > 0
      ? [...hero.subtitles]
      : (hero.title ? [hero.title] : [...DEFAULT_SUBTITLES]);
    if (currentSubs.includes(trimmed)) {
      triggerToast("⚠️ ตำแหน่งนี้มีอยู่ในรายการแล้ว");
      return;
    }
    const updated = [...currentSubs, trimmed];
    const updatedHero = {
      ...hero,
      subtitles: updated,
      title: updated.join(" | ")
    };
    setHero(updatedHero);
    setNewSubtitleInput("");
    triggerToast("➕ เพิ่มตำแหน่งบทบาทใหม่เรียบร้อย!");
  };

  const handleDeleteSubtitle = (indexToDelete) => {
    const currentSubs = Array.isArray(hero.subtitles) && hero.subtitles.length > 0
      ? [...hero.subtitles]
      : (hero.title ? [hero.title] : [...DEFAULT_SUBTITLES]);
    const updated = currentSubs.filter((_, idx) => idx !== indexToDelete);
    const updatedHero = {
      ...hero,
      subtitles: updated,
      title: updated.join(" | ")
    };
    setHero(updatedHero);
    triggerToast("🗑️ ลบตำแหน่งเรียบร้อย!");
  };

  // 1.0.1 Highlight Gallery (3D Coverflow) Handlers
  const openAddGallery = () => {
    setEditingGalleryId(null);
    setGalleryForm({
      title: "",
      imageUrl: "",
      file: null
    });
    setShowGalleryModal(true);
  };

  const openEditGallery = (item) => {
    setEditingGalleryId(item.id);
    setGalleryForm({
      title: item.title || "",
      imageUrl: item.imageUrl || item.src || "",
      file: null
    });
    setShowGalleryModal(true);
  };

  const handleGalleryImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!isSupabaseConfigured()) {
        triggerToast("⚠️ ยังไม่ได้เชื่อมต่อ Supabase! กำลังนำคุณไปยังแท็บ 'ตั้งค่า Supabase Storage' เพื่อกรอก Anon Key");
        setActiveTab("supabase");
        return;
      }
      triggerToast("⏳ กำลังอัปโหลดรูปภาพแกลเลอรีเข้า Supabase Storage (gallery pic)...");
      try {
        const url = await uploadGalleryFile(file);
        setGalleryForm(prev => ({ ...prev, imageUrl: url, file: null }));
        triggerToast("🎉 อัปโหลดรูปภาพเข้า Supabase เรียบร้อย!");
      } catch (err) {
        console.error(err);
        triggerToast(`❌ ${err.message || "อัปโหลดรูปภาพไม่สำเร็จ"}`);
      }
    }
  };

  const handleSaveGallery = async (e) => {
    e.preventDefault();
    if (!galleryForm.imageUrl) {
      triggerToast("⚠️ กรุณาอัปโหลดรูปภาพหรือใส่ URL");
      return;
    }

    const currentGallery = Array.isArray(hero.gallery) && hero.gallery.length > 0
      ? [...hero.gallery]
      : [...DEFAULT_GALLERY];

    let updatedGallery;
    if (editingGalleryId) {
      updatedGallery = currentGallery.map(item =>
        item.id === editingGalleryId
          ? { ...item, title: galleryForm.title, imageUrl: galleryForm.imageUrl }
          : item
      );
    } else {
      const newItem = {
        id: `gal-${Date.now()}`,
        title: galleryForm.title || `Gallery Image ${currentGallery.length + 1}`,
        imageUrl: galleryForm.imageUrl
      };
      updatedGallery = [...currentGallery, newItem];
    }

    const updatedHero = { ...hero, gallery: updatedGallery };
    setHero(updatedHero);
    try {
      await updateHeroData(updatedHero);
      setShowGalleryModal(false);
      triggerToast(editingGalleryId ? "💾 แก้ไขรูปภาพเรียบร้อย!" : "➕ เพิ่มรูปภาพในแกลเลอรีเรียบร้อย!");
    } catch (err) {
      console.error(err);
      triggerToast("❌ เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm("คุณต้องการลบรูปภาพนี้ออกจาก Coverflow Carousel ใช่หรือไม่?")) return;
    const currentGallery = Array.isArray(hero.gallery) && hero.gallery.length > 0
      ? [...hero.gallery]
      : [...DEFAULT_GALLERY];
    const updatedGallery = currentGallery.filter(item => item.id !== id);
    const updatedHero = { ...hero, gallery: updatedGallery };
    setHero(updatedHero);
    try {
      await updateHeroData(updatedHero);
      triggerToast("🗑️ ลบรูปภาพเรียบร้อย!");
    } catch (err) {
      console.error(err);
      triggerToast("❌ เกิดข้อผิดพลาดในการลบ");
    }
  };

  const handleMoveGallery = async (index, direction) => {
    const currentGallery = Array.isArray(hero.gallery) && hero.gallery.length > 0
      ? [...hero.gallery]
      : [...DEFAULT_GALLERY];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentGallery.length) return;

    const updated = [...currentGallery];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const updatedHero = { ...hero, gallery: updated };
    setHero(updatedHero);
    try {
      await updateHeroData(updatedHero);
      triggerToast("🔄 สลับลำดับรูปภาพเรียบร้อย!");
    } catch (err) {
      console.error(err);
    }
  };

  // 1.1 Education & Experience CRUD handlers
  const openAddTimeline = (type) => {
    setTimelineType(type);
    setEditingTimelineId(null);
    setTimelineForm({
      title: "",
      subtitle: "",
      period: "",
      icon: type === "education" ? "GraduationCap" : "Briefcase",
      imageUrl: ""
    });
    setShowTimelineModal(true);
  };

  const openEditTimeline = (type, item) => {
    setTimelineType(type);
    setEditingTimelineId(item.id);
    setTimelineForm({
      title: type === "education" ? (item.institution || "") : (item.company || ""),
      subtitle: type === "education" ? (item.degree || "") : (item.role || ""),
      period: item.period || "",
      icon: item.icon || (type === "education" ? "GraduationCap" : "Briefcase"),
      imageUrl: item.imageUrl || ""
    });
    setShowTimelineModal(true);
  };

  const handleTimelineImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      triggerToast("⏳ กำลังอัปโหลดรูปภาพ/โลโก้...");
      try {
        const url = await uploadImage(file, true);
        setTimelineForm(prev => ({ ...prev, imageUrl: url }));
        triggerToast("✅ อัปโหลดรูปภาพ/โลโก้เสร็จสิ้น!");
      } catch (err) {
        console.error(err);
        triggerToast("❌ ไม่สามารถอัปโหลดรูปภาพได้");
      }
    }
  };

  const handleDeleteTimeline = async (type, id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?")) return;
    const currentList = hero[type] || [];
    const updatedList = currentList.filter(item => item.id !== id);
    const updatedHero = { ...hero, [type]: updatedList };
    setHero(updatedHero);
    try {
      await updateHeroData(updatedHero);
      triggerToast("🗑️ ลบรายการเรียบร้อยแล้ว!");
    } catch (err) {
      console.error(err);
      triggerToast("❌ เกิดข้อผิดพลาดในการลบ");
    }
  };

  const handleSaveTimeline = async (e) => {
    e.preventDefault();
    if (!timelineForm.title.trim()) {
      triggerToast("⚠️ กรุณาระบุชื่อสถาบันหรือองค์กร");
      return;
    }
    const currentList = [...(hero[timelineType] || [])];
    const newItemData = {
      id: editingTimelineId || `${timelineType === "education" ? "edu" : "exp"}-${Date.now()}`,
      ...(timelineType === "education" ? {
        institution: timelineForm.title,
        degree: timelineForm.subtitle
      } : {
        company: timelineForm.title,
        role: timelineForm.subtitle
      }),
      period: timelineForm.period,
      icon: timelineForm.icon,
      imageUrl: timelineForm.imageUrl || ""
    };

    let updatedList;
    if (editingTimelineId) {
      updatedList = currentList.map(item => item.id === editingTimelineId ? newItemData : item);
    } else {
      updatedList = [...currentList, newItemData];
    }

    const updatedHero = { ...hero, [timelineType]: updatedList };
    setHero(updatedHero);
    try {
      await updateHeroData(updatedHero);
      setShowTimelineModal(false);
      triggerToast(editingTimelineId ? "💾 บันทึกการแก้ไขเรียบร้อยแล้ว!" : "➕ เพิ่มรายการเรียบร้อยแล้ว!");
    } catch (err) {
      console.error("Save timeline error:", err);
      triggerToast(`❌ เกิดข้อผิดพลาดในการบันทึก: ${err.message || ""}`);
    }
  };

  // 1.2 Tech Stack CRUD Actions
  const openAddTech = () => {
    setEditingTechId(null);
    setTechForm({
      name: "",
      imageUrl: "",
      icon: "Code2"
    });
    setShowTechModal(true);
  };

  const openEditTech = (item) => {
    setEditingTechId(item.id);
    setTechForm({
      name: item.name || "",
      imageUrl: item.imageUrl || "",
      icon: item.icon || "Code2"
    });
    setShowTechModal(true);
  };

  const handleTechImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      triggerToast("⏳ กำลังอัปโหลดโลโก้...");
      try {
        const url = await uploadImage(file, true);
        setTechForm(prev => ({ ...prev, imageUrl: url }));
        triggerToast("✅ อัปโหลดโลโก้เสร็จสิ้น!");
      } catch (err) {
        console.error(err);
        triggerToast("❌ อัปโหลดรูปภาพไม่สำเร็จ");
      }
    }
  };

  const handleSaveTech = async (e) => {
    e.preventDefault();
    if (!techForm.name.trim()) {
      triggerToast("⚠️ กรุณาระบุชื่อเทคโนโลยี / ทักษะ");
      return;
    }

    const currentList = Array.isArray(hero.techStack) && hero.techStack.length > 0 
      ? [...hero.techStack] 
      : [...DEFAULT_TECH_STACK];

    let updatedList;
    if (editingTechId) {
      updatedList = currentList.map(item => 
        item.id === editingTechId 
          ? { ...item, name: techForm.name, imageUrl: techForm.imageUrl, icon: techForm.icon }
          : item
      );
    } else {
      const newItem = {
        id: `tech-${Date.now()}`,
        name: techForm.name,
        imageUrl: techForm.imageUrl,
        icon: techForm.icon || "Code2"
      };
      updatedList = [...currentList, newItem];
    }

    const updatedHero = { ...hero, techStack: updatedList };
    setHero(updatedHero);
    try {
      await updateHeroData(updatedHero);
      setShowTechModal(false);
      triggerToast(editingTechId ? "💾 แก้ไข Tech Stack เรียบร้อย!" : "➕ เพิ่ม Tech Stack ใหม่เรียบร้อย!");
    } catch (err) {
      console.error(err);
      triggerToast("❌ เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  const handleDeleteTech = async (id, name) => {
    if (window.confirm(`🚨 ต้องการลบ "${name}" ออกจาก Tech Stack ใช่ไหม?`)) {
      const currentList = Array.isArray(hero.techStack) && hero.techStack.length > 0 
        ? [...hero.techStack] 
        : [...DEFAULT_TECH_STACK];
      const updatedList = currentList.filter(item => item.id !== id);
      const updatedHero = { ...hero, techStack: updatedList };
      setHero(updatedHero);
      try {
        await updateHeroData(updatedHero);
        triggerToast(`🗑️ ลบ "${name}" เรียบร้อยแล้ว!`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleResetTechStack = async () => {
    if (window.confirm("🔄 ต้องการรีเซ็ต Tech Stack กลับเป็นค่าเริ่มต้นใช่ไหม?")) {
      const updatedHero = { ...hero, techStack: DEFAULT_TECH_STACK };
      setHero(updatedHero);
      try {
        await updateHeroData(updatedHero);
        triggerToast("🔄 รีเซ็ต Tech Stack เรียบร้อย!");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleQuickAddPreset = async (preset) => {
    const currentList = Array.isArray(hero.techStack) && hero.techStack.length > 0 
      ? [...hero.techStack] 
      : [...DEFAULT_TECH_STACK];

    if (currentList.some(item => item.name.toLowerCase() === preset.name.toLowerCase())) {
      triggerToast(`ℹ️ มี "${preset.name}" อยู่ในรายการแล้ว`);
      return;
    }

    const newItem = {
      id: `tech-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: preset.name,
      imageUrl: preset.imageUrl,
      icon: preset.icon || "Code2"
    };

    const updatedList = [...currentList, newItem];
    const updatedHero = { ...hero, techStack: updatedList };
    setHero(updatedHero);
    try {
      await updateHeroData(updatedHero);
      triggerToast(`✨ เพิ่ม "${preset.name}" สำเร็จ!`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveTech = async (index, direction) => {
    const currentList = Array.isArray(hero.techStack) && hero.techStack.length > 0 
      ? [...hero.techStack] 
      : [...DEFAULT_TECH_STACK];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;

    const updatedList = [...currentList];
    const [moved] = updatedList.splice(index, 1);
    updatedList.splice(targetIndex, 0, moved);

    const updatedHero = { ...hero, techStack: updatedList };
    setHero(updatedHero);
    try {
      await updateHeroData(updatedHero);
    } catch (err) {
      console.error(err);
    }
  };

  // 1.3 Certificates & Awards Actions (รวม cer & award เข้าด้วยกัน - เพิ่มได้เฉพาะรูปภาพเกียรติบัตร)
  const handleUploadCertAwardImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!isSupabaseConfigured()) {
        triggerToast("⚠️ ยังไม่ได้เชื่อมต่อ Supabase! กำลังนำคุณไปยังแท็บ 'ตั้งค่า Supabase Storage' เพื่อกรอก Anon Key");
        setActiveTab("supabase");
        return;
      }
      triggerToast("⏳ กำลังอัปโหลดรูปภาพเกียรติบัตรขึ้น Supabase Storage (cer & award)...");
      try {
        const url = await uploadCertAwardFile(file);
        setCertAwardImageUrl(url);
        triggerToast("🎉 อัปโหลดรูปภาพขึ้น Supabase สำเร็จ!");
      } catch (err) {
        console.error(err);
        triggerToast(`❌ ${err.message || "อัปโหลดไม่สำเร็จ"}`);
      }
    }
  };

  const handleSaveCertAward = async (e) => {
    e.preventDefault();
    if (!certAwardImageUrl.trim()) {
      triggerToast("⚠️ กรุณาเลือกไฟล์หรือใส่ URL รูปภาพเกียรติบัตร/รางวัล");
      return;
    }
    const currentCertsAwards = Array.isArray(hero.certsAndAwards) && hero.certsAndAwards.length > 0
      ? [...hero.certsAndAwards]
      : (
          ((Array.isArray(hero.certificates) && hero.certificates.length > 0) || (Array.isArray(hero.awards) && hero.awards.length > 0))
            ? [
                ...(Array.isArray(hero.certificates) ? hero.certificates : []),
                ...(Array.isArray(hero.awards) ? hero.awards : [])
              ]
            : [...DEFAULT_CERTS_AND_AWARDS]
        );
    const newCertAward = {
      id: `cert-award-${Date.now()}`,
      imageUrl: certAwardImageUrl.trim()
    };
    const updated = [...currentCertsAwards, newCertAward];
    const updatedHero = { ...hero, certsAndAwards: updated };
    setHero(updatedHero);
    try {
      await updateHeroData(updatedHero);
      setCertAwardImageUrl("");
      setShowCertAwardModal(false);
      triggerToast("🎉 เพิ่มรูปภาพเกียรติบัตร & รางวัลเรียบร้อย!");
    } catch (err) {
      console.error(err);
      triggerToast("❌ เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  const handleDeleteCertAward = async (id) => {
    if (!window.confirm("ต้องการลบรูปภาพเกียรติบัตร/รางวัลนี้ใช่ไหม?")) return;
    const currentCertsAwards = Array.isArray(hero.certsAndAwards) && hero.certsAndAwards.length > 0
      ? [...hero.certsAndAwards]
      : (
          ((Array.isArray(hero.certificates) && hero.certificates.length > 0) || (Array.isArray(hero.awards) && hero.awards.length > 0))
            ? [
                ...(Array.isArray(hero.certificates) ? hero.certificates : []),
                ...(Array.isArray(hero.awards) ? hero.awards.map(a => ({ id: a.id, type: "image", url: a.imageUrl || a.url || a.src })) : [])
              ]
            : [...DEFAULT_CERTS_AND_AWARDS]
        );
    const updated = currentCertsAwards.filter(c => c.id !== id);
    const updatedHero = { ...hero, certsAndAwards: updated };
    setHero(updatedHero);
    try {
      await updateHeroData(updatedHero);
      triggerToast("🗑️ ลบรูปภาพเกียรติบัตร/รางวัลเรียบร้อยแล้ว!");
    } catch (err) {
      console.error(err);
    }
  };

  // 1.4 Activities Actions (เพิ่มได้ทั้งภาพและคลิปวิดีโอ)
  const handleUploadActivityMedia = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!isSupabaseConfigured()) {
        triggerToast("⚠️ ยังไม่ได้เชื่อมต่อ Supabase! กำลังนำคุณไปยังแท็บ 'ตั้งค่า Supabase Storage' เพื่อกรอก Anon Key");
        setActiveTab("supabase");
        return;
      }
      const isVideo = file.type?.startsWith("video/") || /\.(mp4|webm|mov|ogg)$/i.test(file.name);
      triggerToast(isVideo ? "⏳ กำลังอัปโหลดไฟล์วิดีโอขึ้น Supabase (activity pic&clip)..." : "⏳ กำลังอัปโหลดรูปภาพขึ้น Supabase (activity pic&clip)...");
      try {
        const url = await uploadActivityFile(file);
        setActivityForm(prev => ({
          ...prev,
          url,
          type: isVideo ? "video" : "image"
        }));
        triggerToast("🎉 อัปโหลดไฟล์ขึ้น Supabase Storage สำเร็จ!");
      } catch (err) {
        console.error(err);
        triggerToast(`❌ ${err.message || "อัปโหลดไม่สำเร็จ"}`);
      }
    }
  };

  const handleUploadActivityThumbnail = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!isSupabaseConfigured()) {
        triggerToast("⚠️ ยังไม่ได้เชื่อมต่อ Supabase! กำลังนำคุณไปยังแท็บ 'ตั้งค่า Supabase Storage' เพื่อกรอก Anon Key");
        setActiveTab("supabase");
        return;
      }
      triggerToast("⏳ กำลังอัปโหลดภาพปกวิดีโอขึ้น Supabase...");
      try {
        const url = await uploadActivityFile(file);
        setActivityForm(prev => ({ ...prev, thumbnailUrl: url }));
        triggerToast("✅ อัปโหลดภาพปกขึ้น Supabase เรียบร้อย!");
      } catch (err) {
        console.error(err);
        triggerToast(`❌ ${err.message || "อัปโหลดภาพปกไม่สำเร็จ"}`);
      }
    }
  };

  const handleSaveActivity = async (e) => {
    e.preventDefault();
    if (!activityForm.url.trim()) {
      triggerToast("⚠️ กรุณาเลือกไฟล์หรือใส่ URL ภาพ/วิดีโอ");
      return;
    }
    const currentActivities = Array.isArray(hero.activities) && hero.activities.length > 0
      ? [...hero.activities]
      : (
          ((Array.isArray(hero.certificates) && hero.certificates.length > 0) || (Array.isArray(hero.awards) && hero.awards.length > 0))
            ? [
                ...(Array.isArray(hero.certificates) ? hero.certificates.map(c => ({ id: c.id, type: "image", url: c.imageUrl || c.url || c.src })) : []),
                ...(Array.isArray(hero.awards) ? hero.awards.map(a => ({ id: a.id, type: "image", url: a.imageUrl || a.url || a.src })) : [])
              ]
            : [...DEFAULT_ACTIVITIES]
        );

    const isVid = activityForm.type === "video" || isVideoMedia(activityForm.url);
    const newAct = {
      id: `act-${Date.now()}`,
      type: isVid ? "video" : "image",
      url: activityForm.url.trim(),
      thumbnailUrl: activityForm.thumbnailUrl ? activityForm.thumbnailUrl.trim() : ""
    };
    const updated = [...currentActivities, newAct];
    const updatedHero = { ...hero, activities: updated };
    setHero(updatedHero);
    try {
      await updateHeroData(updatedHero);
      setActivityForm({ type: "image", url: "", thumbnailUrl: "" });
      setShowActivityModal(false);
      triggerToast("🎉 เพิ่มผลงาน Activities เรียบร้อย!");
    } catch (err) {
      console.error(err);
      triggerToast("❌ เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  const handleDeleteActivity = async (id) => {
    if (!window.confirm("ต้องการลบผลงาน Activities นี้ใช่ไหม?")) return;
    const currentActivities = Array.isArray(hero.activities) && hero.activities.length > 0
      ? [...hero.activities]
      : (
          ((Array.isArray(hero.certificates) && hero.certificates.length > 0) || (Array.isArray(hero.awards) && hero.awards.length > 0))
            ? [
                ...(Array.isArray(hero.certificates) ? hero.certificates.map(c => ({ id: c.id, type: "image", url: c.imageUrl || c.url || c.src })) : []),
                ...(Array.isArray(hero.awards) ? hero.awards.map(a => ({ id: a.id, type: "image", url: a.imageUrl || a.url || a.src })) : [])
              ]
            : [...DEFAULT_ACTIVITIES]
        );
    const updated = currentActivities.filter(a => a.id !== id);
    const updatedHero = { ...hero, activities: updated };
    setHero(updatedHero);
    try {
      await updateHeroData(updatedHero);
      triggerToast("🗑️ ลบผลงาน Activities เรียบร้อยแล้ว!");
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Category Actions
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await addCategory(newCatName);
      setNewCatName("");
      await loadAllData();
      triggerToast("➕ เพิ่มหมวดหมู่ใหม่เรียบร้อย!");
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartEditCat = (cat) => {
    setEditingCatId(cat.id);
    setEditingCatName(cat.name);
  };

  const handleSaveEditCat = async (id) => {
    if (!editingCatName.trim()) return;
    try {
      await updateCategory(id, editingCatName);
      setEditingCatId(null);
      await loadAllData();
      triggerToast("✏️ แก้ไขชื่อหมวดหมู่เรียบร้อย!");
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("🚨 คุณแน่ใจใช่ไหมที่จะลบหมวดหมู่นี้?")) {
      try {
        await deleteCategory(id);
        await loadAllData();
        triggerToast("🗑️ ลบหมวดหมู่เรียบร้อย!");
      } catch (e) {
        console.error(e);
      }
    }
  };

  // 3. Portfolio Item Actions
  const handleOpenItemModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setItemForm({
        title: item.title || "",
        description: item.description || "",
        detailDescription: item.detailDescription || item.description || "",
        categoryId: item.categoryId || categories[0]?.id || "",
        imageUrl: item.imageUrl || "",
        detailImages: Array.isArray(item.detailImages) ? [...item.detailImages] : [],
        tags: Array.isArray(item.tags) ? item.tags.join(", ") : (item.tags || ""),
        demoUrl: item.demoUrl || "",
        githubUrl: item.githubUrl || "",
        file: null
      });
    } else {
      setEditingItem(null);
      setItemForm({
        title: "",
        description: "",
        detailDescription: "",
        categoryId: categories[0]?.id || "",
        imageUrl: "",
        detailImages: [],
        tags: "",
        demoUrl: "",
        githubUrl: "",
        file: null
      });
    }
    setShowItemModal(true);
  };

  const handleItemFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (isSupabaseConfigured()) {
        triggerToast("⏳ กำลังอัปโหลดรูปภาพผลงานเข้า Supabase Storage (project pic)...");
        try {
          const url = await uploadProjectFile(file);
          setItemForm(prev => ({ ...prev, imageUrl: url, file: null }));
          triggerToast("🎉 อัปโหลดรูปภาพผลงานเข้า Supabase สำเร็จ!");
        } catch (err) {
          console.error(err);
          triggerToast(`❌ ${err.message || "อัปโหลดไม่สำเร็จ"}`);
        }
      } else {
        setItemForm(prev => ({ ...prev, file }));
        const reader = new FileReader();
        reader.onloadend = () => {
          setItemForm(prev => ({ ...prev, imageUrl: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    triggerToast("⏳ กำลังบันทึกข้อมูลผลงาน...");
    
    try {
      let finalImageUrl = itemForm.imageUrl;
      if (itemForm.file) {
        if (isSupabaseConfigured()) {
          finalImageUrl = await uploadProjectFile(itemForm.file);
        } else {
          finalImageUrl = await uploadImage(itemForm.file);
        }
      }
      
      const tagsArray = itemForm.tags
        ? itemForm.tags.split(",").map(t => t.trim()).filter(Boolean)
        : [];

      const payload = {
        title: itemForm.title,
        description: itemForm.description,
        detailDescription: itemForm.detailDescription || itemForm.description,
        categoryId: itemForm.categoryId,
        imageUrl: finalImageUrl,
        detailImages: itemForm.detailImages || [],
        tags: tagsArray,
        demoUrl: itemForm.demoUrl,
        githubUrl: itemForm.githubUrl
      };

      if (editingItem) {
        await updatePortfolioItem(editingItem.id, payload);
        triggerToast("✅ อัปเดตผลงานเรียบร้อย!");
      } else {
        await addPortfolioItem(payload);
        triggerToast("✅ เพิ่มผลงานชิ้นใหม่เรียบร้อย!");
      }
      
      setShowItemModal(false);
      await loadAllData();
    } catch (error) {
      console.error(error);
      triggerToast("❌ เกิดข้อผิดพลาดในการบันทึกผลงาน");
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("🚨 ต้องการลบผลงาน/เกียรติบัตรนี้ใช่หรือไม่?")) {
      try {
        await deletePortfolioItem(id);
        await loadAllData();
        triggerToast("🗑️ ลบผลงานเรียบร้อย!");
      } catch (e) {
        console.error(e);
      }
    }
  };

  // 4. Contacts Save
  const handleContactChange = (index, value) => {
    const updated = [...contacts];
    updated[index].value = value;
    setContacts(updated);
  };

  const handleSaveContacts = async (e) => {
    e.preventDefault();
    try {
      await updateContactData(contacts);
      triggerToast("💾 บันทึกช่องทางการติดต่อเรียบร้อย!");
    } catch (e) {
      console.error(e);
      triggerToast("❌ เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  // 5. Custom CSS Save
  const handleSaveCss = async (e) => {
    e.preventDefault();
    try {
      await updateCustomCss(cssCode);
      setGlobalCustomCss(cssCode);
      triggerToast("🎨 บันทึกและฉีดโค้ด CSS สำเร็จ!");
    } catch (e) {
      console.error(e);
      triggerToast("❌ ไม่สามารถบันทึก CSS ได้");
    }
  };

  return (
    <div className="admin-container">
      {/* Toast Notification */}
      {toastMsg && <div className="toast"><DynamicIcon name="Info" size={20} /> {toastMsg}</div>}

      <div className="admin-header-row">
        <div>
          <h1 className="admin-title">
            <span>⚙️</span> CONTROL CENTER
          </h1>
          <p className="admin-subtitle">
            Firebase Database: {" "}
            {isFirebaseConfigured ? (
              <span style={{ color: "#10b981", fontWeight: "bold" }}>🔥 เชื่อมต่อแล้ว</span>
            ) : (
              <span style={{ color: "#f59e0b", fontWeight: "bold" }}>⚠️ LocalStorage</span>
            )}
            {" | "}
            Supabase Storage: {" "}
            {isSupabaseConfigured() ? (
              <span style={{ color: "#10b981", fontWeight: "bold" }}>⚡ พร้อมใช้งาน</span>
            ) : (
              <span style={{ color: "#f87171", fontWeight: "bold" }}>⚠️ ยังไม่ระบุ Anon Key</span>
            )}
          </p>
        </div>
        <Link to="/" className="btn btn-secondary">
          <DynamicIcon name="ExternalLink" size={16} /> กลับสู่หน้าเว็บหลัก
        </Link>
      </div>

      <div className="admin-grid">
        {/* Sidebar Menu */}
        <div className="admin-sidebar">
          <button className={`admin-menu-item ${activeTab === "hero" ? "active" : ""}`} onClick={() => setActiveTab("hero")}>
            <DynamicIcon name="User" size={18} /> ข้อมูลแนะนำตัว & Hero
          </button>
          <button className={`admin-menu-item ${activeTab === "timeline" ? "active" : ""}`} onClick={() => setActiveTab("timeline")}>
            <DynamicIcon name="GraduationCap" size={18} /> Education & Experience
          </button>
          <button className={`admin-menu-item ${activeTab === "techstack" ? "active" : ""}`} onClick={() => setActiveTab("techstack")}>
            <DynamicIcon name="Boxes" size={18} /> จัดการ Tech Stack
          </button>
          <button className={`admin-menu-item ${activeTab === "gallery" ? "active" : ""}`} onClick={() => setActiveTab("gallery")}>
            <DynamicIcon name="Image" size={18} /> ภาพแกลเลอรี (Coverflow)
          </button>
          <button className={`admin-menu-item ${activeTab === "categories" ? "active" : ""}`} onClick={() => setActiveTab("categories")}>
            <DynamicIcon name="FolderOpen" size={18} /> จัดการหมวดหมู่
          </button>
          <button className={`admin-menu-item ${activeTab === "items" ? "active" : ""}`} onClick={() => setActiveTab("items")}>
            <DynamicIcon name="Code2" size={18} /> จัดการผลงานโปรเจกต์ (Projects)
          </button>
          <button className={`admin-menu-item ${activeTab === "certs-awards" ? "active" : ""}`} onClick={() => setActiveTab("certs-awards")}>
            <DynamicIcon name="Award" size={18} /> จัดการเกียรติบัตร & รางวัล (Certificates & Awards)
          </button>
          <button className={`admin-menu-item ${activeTab === "activities" ? "active" : ""}`} onClick={() => setActiveTab("activities")}>
            <DynamicIcon name="Sparkles" size={18} /> กิจกรรม / ผลงานเวลาว่าง (Activities)
          </button>
          <button className={`admin-menu-item ${activeTab === "contacts" ? "active" : ""}`} onClick={() => setActiveTab("contacts")}>
            <DynamicIcon name="Share2" size={18} /> ช่องทางการติดต่อ
          </button>
          <button className={`admin-menu-item ${activeTab === "css" ? "active" : ""}`} onClick={() => setActiveTab("css")}>
            <DynamicIcon name="Palette" size={18} /> ปรับแต่ง CSS ตกแต่งเว็บ
          </button>
          <button className={`admin-menu-item ${activeTab === "supabase" ? "active" : ""}`} onClick={() => setActiveTab("supabase")}>
            <DynamicIcon name="HardDrive" size={18} /> ตั้งค่า Supabase Storage
          </button>
          <button className={`admin-menu-item ${activeTab === "firebase" ? "active" : ""}`} onClick={() => setActiveTab("firebase")}>
            <DynamicIcon name="Database" size={18} /> ข้อมูล Firebase
          </button>
        </div>

        {/* Content Area */}
        <div className="admin-content">
          {/* TAB 1: HERO */}
          {activeTab === "hero" && (
            <div>
              <div className="admin-section-header">
                <h2>แก้ไขข้อมูลแนะนำตัว (Hero & About)</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0.25rem 0 0 0" }}>
                  สามารถอัปโหลดรูปภาพแยกกันระหว่างส่วน Hero และ About Me ได้อย่างอิสระ
                </p>
              </div>
              <form onSubmit={handleSaveHero}>
                
                {/* ช่องอัปโหลดรูปภาพแยกกันระหว่าง Hero และ About Me */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                  {/* 1. Hero Image */}
                  <div className="form-group" style={{ margin: 0, padding: "1.25rem", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <label style={{ fontWeight: 600, color: "#38bdf8", marginBottom: "0.75rem", display: "block" }}>
                      🖼️ รูปภาพโปรไฟล์ส่วน Hero
                    </label>
                    <div className="image-upload-wrapper">
                      <div className="image-preview-box">
                        {hero.heroImageUrl || hero.imageUrl ? (
                          <img src={hero.heroImageUrl || hero.imageUrl} alt="Hero Preview" />
                        ) : (
                          <div style={{ color: "#94a3b8", textAlign: "center", fontSize: "0.8rem", padding: "1rem" }}>
                            [ เว้นว่าง ]
                          </div>
                        )}
                      </div>
                      <div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="hero-file-input" 
                          style={{ display: "none" }} 
                          onChange={handleHeroImageChange} 
                        />
                        <button 
                          type="button" 
                          className="btn btn-secondary" 
                          onClick={() => document.getElementById("hero-file-input").click()}
                        >
                          <DynamicIcon name="UploadCloud" size={16} /> อัปโหลดรูป Hero
                        </button>
                        {(hero.heroImageUrl || hero.imageUrl) && (
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ marginLeft: "0.5rem", color: "#f87171" }}
                            onClick={() => setHero(prev => ({ ...prev, heroImageUrl: "", imageUrl: "" }))}
                          >
                            ลบรูป
                          </button>
                        )}
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                          รองรับไฟล์ PNG โปร่งใส, JPG, WEBP — ปรับขนาดตามภาพที่แนบจริงอัตโนมัติ
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2. About Me Image */}
                  <div className="form-group" style={{ margin: 0, padding: "1.25rem", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <label style={{ fontWeight: 600, color: "#a855f7", marginBottom: "0.75rem", display: "block" }}>
                      🖼️ รูปภาพโปรไฟล์ส่วน About Me
                    </label>
                    <div className="image-upload-wrapper">
                      <div className="image-preview-box">
                        {hero.aboutImageUrl || hero.imageUrl ? (
                          <img src={hero.aboutImageUrl || hero.imageUrl} alt="About Preview" />
                        ) : (
                          <div style={{ color: "#94a3b8", textAlign: "center", fontSize: "0.8rem", padding: "1rem" }}>
                            [ เว้นว่าง ]
                          </div>
                        )}
                      </div>
                      <div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="about-file-input" 
                          style={{ display: "none" }} 
                          onChange={handleAboutImageChange} 
                        />
                        <button 
                          type="button" 
                          className="btn btn-secondary" 
                          onClick={() => document.getElementById("about-file-input").click()}
                        >
                          <DynamicIcon name="UploadCloud" size={16} /> อัปโหลดรูป About
                        </button>
                        {(hero.aboutImageUrl || hero.imageUrl) && (
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ marginLeft: "0.5rem", color: "#f87171" }}
                            onClick={() => setHero(prev => ({ ...prev, aboutImageUrl: "" }))}
                          >
                            ลบรูป
                          </button>
                        )}
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                          รองรับไฟล์ PNG โปร่งใส, JPG, WEBP — ปรับขนาดตามภาพที่แนบจริงอัตโนมัติ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>ชื่อ - นามสกุล</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={hero.name || ""} 
                    onChange={e => setHero(prev => ({ ...prev, name: e.target.value }))} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>พาดหัวหลัก (Main Headline)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={hero.headline || ""} 
                    placeholder="เช่น Turning Ideas Into Reality"
                    onChange={e => setHero(prev => ({ ...prev, headline: e.target.value }))} 
                  />
                </div>

                {/* ตำแหน่ง / บทบาทความเชี่ยวชาญ (Subtitles แบบเพิ่ม-ลดได้ และแสดง Typewriter Loop) */}
                <div className="form-group" style={{ padding: "1.25rem", borderRadius: "14px", background: "rgba(56, 189, 248, 0.04)", border: "1px solid rgba(56, 189, 248, 0.2)", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <label style={{ fontWeight: 600, color: "#38bdf8", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <DynamicIcon name="Type" size={18} /> ตำแหน่ง / บทบาทความเชี่ยวชาญ (Subtitles วน Loop)
                    </label>
                    <span style={{ fontSize: "0.75rem", color: "#38bdf8", background: "rgba(56, 189, 248, 0.15)", padding: "2px 8px", borderRadius: "12px" }}>
                      อนิเมชั่นพิมพ์ (Typewriter Loop)
                    </span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                    สามารถเพิ่ม-ลดบทบาทได้ตามต้องการ ข้อความจะแสดงแบบพิมพ์ทีละตัว (Typewriter) วน Loop บนหน้าแรก โดยเว้น 2.5 วินาทีในแต่ละข้อความ
                  </p>

                  {/* แสดงรายการบทบาทความเชี่ยวชาญปัจจุบัน */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                    {(Array.isArray(hero.subtitles) && hero.subtitles.length > 0 ? hero.subtitles : DEFAULT_SUBTITLES).map((sub, idx) => (
                      <div 
                        key={idx} 
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          background: "rgba(15, 23, 42, 0.8)",
                          border: "1px solid rgba(56, 189, 248, 0.4)",
                          color: "#f0f9ff",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "20px",
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                        }}
                      >
                        <span style={{ color: "#38bdf8", fontSize: "0.75rem" }}>#{idx + 1}</span>
                        <span>{sub}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubtitle(idx)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#f87171",
                            cursor: "pointer",
                            padding: "2px",
                            display: "flex",
                            alignItems: "center"
                          }}
                          title="ลบตำแหน่งนี้"
                        >
                          <DynamicIcon name="X" size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* ช่องพิมพ์เพิ่มตำแหน่งใหม่ */}
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="พิมพ์ตำแหน่งใหม่ เช่น Cloud Architect, Tech Creator แล้วกดเพิ่ม..."
                      value={newSubtitleInput}
                      onChange={(e) => setNewSubtitleInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSubtitle();
                        }
                      }}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleAddSubtitle}
                      style={{ display: "flex", alignItems: "center", gap: "0.35rem", whiteSpace: "nowrap" }}
                    >
                      <DynamicIcon name="Plus" size={16} /> เพิ่มตำแหน่ง
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>สถานะการทำงาน (Status Badge)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={hero.status || ""} 
                    placeholder="เช่น พร้อมรับงาน / Open for Opportunities"
                    onChange={e => setHero(prev => ({ ...prev, status: e.target.value }))} 
                  />
                </div>

                {/* แยกประวัติย่อหน้าแรก (Home Bio) และรายละเอียดประวัติเพิ่มเติม (About Me Bio) ตามข้อ 2 */}
                <div className="form-group" style={{ padding: "1.25rem", borderRadius: "14px", background: "rgba(56, 189, 248, 0.04)", border: "1px solid rgba(56, 189, 248, 0.25)", marginBottom: "1.25rem" }}>
                  <label style={{ fontWeight: 600, color: "#38bdf8", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <DynamicIcon name="Home" size={18} /> 1. ประวัติย่อสำหรับหน้าแรก (Home Section Bio)
                  </label>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                    ข้อความแนะนำตัวสั้นๆ และเป้าหมาย จะแสดงอยู่ใต้หัวข้อและบทบาทในส่วนหน้าแรก (Home)
                  </p>
                  <textarea 
                    className="form-control" 
                    rows={3}
                    value={hero.homeBio !== undefined ? hero.homeBio : (hero.bio || "")} 
                    placeholder="ยินดีต้อนรับเข้าสู่ว็บไซต์พอร์ตโฟลิโอ... (แสดงเฉพาะหน้าแรก)"
                    onChange={e => setHero(prev => ({ ...prev, homeBio: e.target.value }))} 
                  />
                </div>

                <div className="form-group" style={{ padding: "1.25rem", borderRadius: "14px", background: "rgba(168, 85, 247, 0.04)", border: "1px solid rgba(168, 85, 247, 0.25)", marginBottom: "1.25rem" }}>
                  <label style={{ fontWeight: 600, color: "#a855f7", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <DynamicIcon name="User" size={18} /> 2. รายละเอียดประวัติเพิ่มเติม (About Me Section Bio)
                  </label>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                    ข้อความเล่าเรื่องราว ความเชี่ยวชาญ และความมุ่งมั่นเชิงลึก จะแสดงอยู่ทางขวาของรูปโปรไฟล์ในหน้า About Me
                  </p>
                  <textarea 
                    className="form-control" 
                    rows={4}
                    value={hero.aboutBio !== undefined ? hero.aboutBio : (hero.bio || "")} 
                    placeholder="เล่าประวัติเพิ่มเติม ความสนใจเฉพาะด้าน ผลงานและความเชี่ยวชาญ... (แสดงเฉพาะหน้า About Me)"
                    onChange={e => setHero(prev => ({ ...prev, aboutBio: e.target.value }))} 
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label>ปีประสบการณ์</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={hero.yearsExp || ""} 
                      placeholder="เช่น 1+"
                      onChange={e => setHero(prev => ({ ...prev, yearsExp: e.target.value }))} 
                    />
                  </div>
                  <div className="form-group">
                    <label>จำนวนโปรเจกต์</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={hero.projectsCount || ""} 
                      placeholder="เช่น 10+"
                      onChange={e => setHero(prev => ({ ...prev, projectsCount: e.target.value }))} 
                    />
                  </div>
                  <div className="form-group">
                    <label>จำนวนรางวัล/เกียรติบัตร</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={hero.awardsCount || ""} 
                      placeholder="เช่น 5+"
                      onChange={e => setHero(prev => ({ ...prev, awardsCount: e.target.value }))} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>ลิงก์เรซูเม่ (Resume Link)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={hero.resumeUrl || ""} 
                    placeholder="https://drive.google.com/..."
                    onChange={e => setHero(prev => ({ ...prev, resumeUrl: e.target.value }))} 
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  <DynamicIcon name="Save" size={16} /> บันทึกการเปลี่ยนแปลง
                </button>
              </form>
            </div>
          )}

          {/* TAB: EDUCATION & EXPERIENCE (เพิ่ม-ลด และใส่รูปหน้าข้อความได้ตามต้องการ) */}
          {activeTab === "timeline" && (
            <div>
              <div className="admin-section-header">
                <h2>จัดการข้อมูลการศึกษา & ประสบการณ์ (Education & Experience)</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0.25rem 0 0 0" }}>
                  สามารถเพิ่ม-ลดข้อมูลได้อย่างอิสระ พร้อมอัปโหลดรูปภาพ/โลโก้แสดงหน้าข้อความ
                </p>
              </div>

              {/* 1. Education Section */}
              <div style={{ marginBottom: "2.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.15rem", margin: 0, color: "#93c5fd" }}>
                    <DynamicIcon name="GraduationCap" size={20} /> ประวัติการศึกษา (Education)
                  </h3>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => openAddTimeline("education")}
                  >
                    <DynamicIcon name="Plus" size={16} /> เพิ่มข้อมูลการศึกษา
                  </button>
                </div>

                <div className="admin-items-grid">
                  {(hero.education || []).map((edu, idx) => (
                    <div key={edu.id || idx} className="admin-item-card">
                      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "0.75rem" }}>
                        <div style={{ 
                          width: "48px", 
                          height: "48px", 
                          borderRadius: "12px", 
                          background: "rgba(37, 99, 235, 0.2)", 
                          border: "1px solid rgba(59, 130, 246, 0.4)",
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          overflow: "hidden",
                          flexShrink: 0
                        }}>
                          {edu.imageUrl ? (
                            <img src={edu.imageUrl} alt={edu.institution} style={{ width: "100%", height: "100%", maxWidth: "38px", maxHeight: "38px", objectFit: "contain" }} />
                          ) : (
                            <DynamicIcon name={edu.icon || "GraduationCap"} size={22} />
                          )}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <h4 style={{ margin: "0 0 0.25rem 0", color: "#fff", fontSize: "1rem", fontWeight: "600" }}>{edu.institution}</h4>
                          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.85rem" }}>{edu.degree}</p>
                          <span style={{ fontSize: "0.75rem", color: "#38bdf8" }}>{edu.period}</span>
                        </div>
                      </div>
                      <div className="item-card-actions">
                        <button className="btn btn-secondary" onClick={() => openEditTimeline("education", edu)}>
                          <DynamicIcon name="Edit" size={14} /> แก้ไข
                        </button>
                        <button className="btn btn-secondary" style={{ color: "#f87171" }} onClick={() => handleDeleteTimeline("education", edu.id)}>
                          <DynamicIcon name="Trash2" size={14} /> ลบ
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!hero.education || hero.education.length === 0) && (
                    <p style={{ color: "var(--text-muted)", gridColumn: "1 / -1" }}>ยังไม่มีข้อมูลการศึกษา คลิกปุ่มเพิ่มด้านบนได้เลย</p>
                  )}
                </div>
              </div>

              {/* 2. Experience Section */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.15rem", margin: 0, color: "#67e8f9" }}>
                    <DynamicIcon name="Briefcase" size={20} /> ประสบการณ์ (Experience)
                  </h3>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => openAddTimeline("experience")}
                  >
                    <DynamicIcon name="Plus" size={16} /> เพิ่มประสบการณ์
                  </button>
                </div>

                <div className="admin-items-grid">
                  {(hero.experience || []).map((exp, idx) => (
                    <div key={exp.id || idx} className="admin-item-card">
                      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "0.75rem" }}>
                        <div style={{ 
                          width: "48px", 
                          height: "48px", 
                          borderRadius: "12px", 
                          background: "rgba(6, 182, 212, 0.2)", 
                          border: "1px solid rgba(6, 182, 212, 0.4)",
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          overflow: "hidden",
                          flexShrink: 0
                        }}>
                          {exp.imageUrl ? (
                            <img src={exp.imageUrl} alt={exp.company} style={{ width: "100%", height: "100%", maxWidth: "38px", maxHeight: "38px", objectFit: "contain" }} />
                          ) : (
                            <DynamicIcon name={exp.icon || "Briefcase"} size={22} />
                          )}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <h4 style={{ margin: "0 0 0.25rem 0", color: "#fff", fontSize: "1rem", fontWeight: "600" }}>{exp.company}</h4>
                          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.85rem" }}>{exp.role}</p>
                          <span style={{ fontSize: "0.75rem", color: "#38bdf8" }}>{exp.period}</span>
                        </div>
                      </div>
                      <div className="item-card-actions">
                        <button className="btn btn-secondary" onClick={() => openEditTimeline("experience", exp)}>
                          <DynamicIcon name="Edit" size={14} /> แก้ไข
                        </button>
                        <button className="btn btn-secondary" style={{ color: "#f87171" }} onClick={() => handleDeleteTimeline("experience", exp.id)}>
                          <DynamicIcon name="Trash2" size={14} /> ลบ
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!hero.experience || hero.experience.length === 0) && (
                    <p style={{ color: "var(--text-muted)", gridColumn: "1 / -1" }}>ยังไม่มีข้อมูลประสบการณ์ คลิกปุ่มเพิ่มด้านบนได้เลย</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: TECH STACK (จัดการทักษะและความเชี่ยวชาญ สไตล์ภาพแนบที่ 4) */}
          {activeTab === "techstack" && (
            <div>
              <div className="admin-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h2>💻 จัดการ Tech Stack & ทักษะ (สไตล์ภาพแนบที่ 4)</h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0.25rem 0 0 0" }}>
                    สามารถเพิ่ม-ลดข้อมูลได้อย่างอิสระ โดยเมื่อเพิ่มจะแสดงเป็นการ์ดสีดำลึก โลโก้ด้านบนและชื่อข้อความหนาด้านล่างตามภาพแนบที่ 4
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <button type="button" className="btn btn-secondary" onClick={handleResetTechStack}>
                    <DynamicIcon name="RotateCcw" size={16} /> รีเซ็ตเป็นค่าเริ่มต้น
                  </button>
                  <button type="button" className="btn btn-primary" onClick={openAddTech}>
                    <DynamicIcon name="Plus" size={16} /> + เพิ่ม Tech Stack ใหม่
                  </button>
                </div>
              </div>

              {/* Quick Preset Bar */}
              <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", padding: "1.25rem", marginBottom: "2rem" }}>
                <h4 style={{ margin: "0 0 0.85rem 0", fontSize: "0.95rem", color: "#38bdf8", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <DynamicIcon name="Sparkles" size={16} /> เพิ่มด่วนจากชุดโลโก้มาตรฐาน (Quick Preset 1-Click):
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {TECH_PRESETS.map((preset, pIdx) => {
                    const alreadyExists = (hero.techStack || DEFAULT_TECH_STACK).some(
                      t => t.name.toLowerCase() === preset.name.toLowerCase()
                    );
                    return (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleQuickAddPreset(preset)}
                        disabled={alreadyExists}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.45rem",
                          padding: "0.35rem 0.75rem",
                          borderRadius: "8px",
                          background: alreadyExists ? "rgba(255, 255, 255, 0.05)" : "rgba(37, 99, 235, 0.15)",
                          border: alreadyExists ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(59, 130, 246, 0.3)",
                          color: alreadyExists ? "#64748b" : "#e2e8f0",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          cursor: alreadyExists ? "not-allowed" : "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <img src={preset.imageUrl} alt={preset.name} style={{ width: "16px", height: "16px", objectFit: "contain" }} />
                        <span>{preset.name}</span>
                        {alreadyExists && <span style={{ fontSize: "0.7rem", color: "#10b981", marginLeft: "2px" }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Tech Stack Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1.25rem" }}>
                {(hero.techStack && hero.techStack.length > 0 ? hero.techStack : DEFAULT_TECH_STACK).map((tech, idx) => (
                  <div
                    key={tech.id || idx}
                    style={{
                      background: "rgba(15, 23, 42, 0.7)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "16px",
                      padding: "1.25rem 1rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.85rem",
                      position: "relative"
                    }}
                  >
                    {/* Move Up/Down Controls */}
                    <div style={{ position: "absolute", top: "8px", right: "8px", display: "flex", gap: "2px" }}>
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveTech(idx, -1)}
                          style={{ background: "rgba(255, 255, 255, 0.08)", border: "none", color: "#94a3b8", borderRadius: "4px", padding: "2px 5px", cursor: "pointer", fontSize: "0.7rem" }}
                          title="เลื่อนขึ้น"
                        >
                          ▲
                        </button>
                      )}
                      {idx < (hero.techStack || DEFAULT_TECH_STACK).length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMoveTech(idx, 1)}
                          style={{ background: "rgba(255, 255, 255, 0.08)", border: "none", color: "#94a3b8", borderRadius: "4px", padding: "2px 5px", cursor: "pointer", fontSize: "0.7rem" }}
                          title="เลื่อนลง"
                        >
                          ▼
                        </button>
                      )}
                    </div>

                    <div style={{ width: "52px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "0.5rem" }}>
                      {tech.imageUrl ? (
                        <img src={tech.imageUrl} alt={tech.name} style={{ width: "48px", height: "48px", objectFit: "contain" }} />
                      ) : (
                        <DynamicIcon name={tech.icon || "Code2"} size={36} style={{ color: "#38bdf8" }} />
                      )}
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#ffffff" }}>{tech.name}</h4>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", width: "100%", marginTop: "0.25rem" }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ flex: 1, padding: "0.4rem 0.6rem", fontSize: "0.75rem", justifyContent: "center" }}
                        onClick={() => openEditTech(tech)}
                      >
                        <DynamicIcon name="Edit" size={13} /> แก้ไข
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: "0.4rem 0.6rem", fontSize: "0.75rem", color: "#f87171", justifyContent: "center" }}
                        onClick={() => handleDeleteTech(tech.id, tech.name)}
                      >
                        <DynamicIcon name="Trash2" size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: GALLERY (จัดการภาพแกลเลอรี 3D Coverflow ตามภาพแนบที่ 1 สามารถเพิ่ม-ลดได้) */}
          {activeTab === "gallery" && (
            <div>
              <div className="admin-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2>จัดการภาพแกลเลอรี (Highlight 3D Coverflow)</h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0.25rem 0 0 0" }}>
                    เพิ่ม-ลดรูปภาพ และจัดเรียงสไลด์ 3D แผ่ขยายจากขอบด้านหนึ่งไปสุดอีกขอบหนึ่ง หมุนวนลูปไม่รู้จบ
                  </p>
                </div>
                <button type="button" className="btn btn-primary" onClick={openAddGallery}>
                  <DynamicIcon name="Plus" size={16} /> เพิ่มรูปภาพใหม่
                </button>
              </div>

              <div className="admin-gallery-grid">
                {(Array.isArray(hero.gallery) && hero.gallery.length > 0 ? hero.gallery : DEFAULT_GALLERY).map((item, idx) => (
                  <div key={item.id || idx} className="admin-gallery-card">
                    <img 
                      src={item.imageUrl || item.src} 
                      alt={item.title || "Gallery"} 
                      className="admin-gallery-thumb"
                    />
                    <div className="admin-gallery-info">
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                          <span style={{ fontSize: "0.75rem", color: "#38bdf8", fontWeight: 600 }}>#{idx + 1}</span>
                          <div style={{ display: "flex", gap: "2px" }}>
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMoveGallery(idx, -1)}
                                style={{ background: "rgba(255, 255, 255, 0.08)", border: "none", color: "#94a3b8", borderRadius: "4px", padding: "2px 6px", cursor: "pointer", fontSize: "0.7rem" }}
                                title="เลื่อนไปซ้าย/ก่อนหน้า"
                              >
                                ◀
                              </button>
                            )}
                            {idx < (hero.gallery || DEFAULT_GALLERY).length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveGallery(idx, 1)}
                                style={{ background: "rgba(255, 255, 255, 0.08)", border: "none", color: "#94a3b8", borderRadius: "4px", padding: "2px 6px", cursor: "pointer", fontSize: "0.7rem" }}
                                title="เลื่อนไปขวา/ถัดไป"
                              >
                                ▶
                              </button>
                            )}
                          </div>
                        </div>
                        <h4 className="admin-gallery-title" title={item.title}>{item.title || "ไม่มีชื่อภาพ"}</h4>
                      </div>

                      <div className="admin-gallery-actions">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ flex: 1, padding: "0.35rem 0.5rem", fontSize: "0.75rem", justifyContent: "center" }}
                          onClick={() => openEditGallery(item)}
                        >
                          <DynamicIcon name="Edit" size={13} /> แก้ไข
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: "0.35rem 0.5rem", fontSize: "0.75rem", color: "#f87171", justifyContent: "center" }}
                          onClick={() => handleDeleteGallery(item.id)}
                          title="ลบรูปภาพนี้"
                        >
                          <DynamicIcon name="Trash2" size={13} /> ลบ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CATEGORIES */}
          {activeTab === "categories" && (
            <div>
              <div className="admin-section-header">
                <h2>จัดการหมวดหมู่ผลงาน</h2>
              </div>
              
              <form onSubmit={handleAddCategory} style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="ชื่อหมวดหมู่ใหม่..." 
                  value={newCatName} 
                  onChange={e => setNewCatName(e.target.value)} 
                  required 
                />
                <button type="submit" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
                  <DynamicIcon name="Plus" size={16} /> เพิ่มหมวดหมู่
                </button>
              </form>

              <div className="category-list">
                {categories.map(cat => (
                  <div key={cat.id} className="category-item-row">
                    {editingCatId === cat.id ? (
                      <div style={{ display: "flex", gap: "0.5rem", flex: 1 }}>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={editingCatName} 
                          onChange={e => setEditingCatName(e.target.value)} 
                          autoFocus
                        />
                        <button type="button" className="btn btn-primary" onClick={() => handleSaveEditCat(cat.id)}>
                          บันทึก
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => setEditingCatId(null)}>
                          ยกเลิก
                        </button>
                      </div>
                    ) : (
                      <>
                        <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{cat.name}</span>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button type="button" className="btn-icon" onClick={() => handleStartEditCat(cat)} title="แก้ไข">
                            <DynamicIcon name="Edit2" size={16} />
                          </button>
                          <button type="button" className="btn-icon btn-danger" onClick={() => handleDeleteCategory(cat.id)} title="ลบ">
                            <DynamicIcon name="Trash2" size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PORTFOLIO ITEMS */}
          {activeTab === "items" && (
            <div>
              <div className="admin-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>จัดการผลงาน & เกียรติบัตร</h2>
                <button type="button" className="btn btn-primary" onClick={() => handleOpenItemModal()}>
                  <DynamicIcon name="Plus" size={16} /> เพิ่มผลงานชิ้นใหม่
                </button>
              </div>

              <div className="items-table-wrapper">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>รูปภาพ/ไฟล์</th>
                      <th>ชื่อผลงาน/หัวข้อ</th>
                      <th>หมวดหมู่</th>
                      <th>รายละเอียด</th>
                      <th style={{ textAlign: "right" }}>การกระทำ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => {
                      const cat = categories.find(c => c.id === item.categoryId);
                      const isItemPdf = item.imageUrl?.toLowerCase().endsWith(".pdf") || item.imageUrl?.startsWith("data:application/pdf");
                      return (
                        <tr key={item.id}>
                          <td style={{ width: "80px" }}>
                            {item.imageUrl ? (
                              isItemPdf ? (
                                <div style={{ background: "#1e293b", padding: "6px", borderRadius: "6px", textAlign: "center", color: "#f87171" }}>
                                  <DynamicIcon name="FileText" size={20} />
                                </div>
                              ) : (
                                <img src={item.imageUrl} alt="" style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "6px" }} />
                              )
                            ) : (
                              <div style={{ width: "60px", height: "40px", background: "#1e293b", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "#94a3b8" }}>
                                ว่าง
                              </div>
                            )}
                          </td>
                          <td style={{ fontWeight: 600 }}>{item.title}</td>
                          <td><span className="badge">{cat?.name || "ไม่ระบุ"}</span></td>
                          <td style={{ maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.description}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button type="button" className="btn-icon" onClick={() => handleOpenItemModal(item)} style={{ marginRight: "0.5rem" }}>
                              <DynamicIcon name="Edit2" size={16} />
                            </button>
                            <button type="button" className="btn-icon btn-danger" onClick={() => handleDeleteItem(item.id)}>
                              <DynamicIcon name="Trash2" size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CERTIFICATES & AWARDS (รวม Certificates & Awards เข้าด้วยกัน - เพิ่มได้เฉพาะรูปภาพเกียรติบัตร) */}
          {activeTab === "certs-awards" && (
            <div>
              <div className="admin-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2>จัดการเกียรติบัตร & รางวัล (Certificates & Awards)</h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0.25rem 0 0 0" }}>
                    รวมรูปภาพเกียรติบัตรและรางวัลเข้าด้วยกัน (เพิ่มได้เฉพาะรูปภาพเกียรติบัตร แสดงเฉพาะภาพและกดขยายเพื่อดูได้)
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => { 
                    setCertAwardImageUrl(""); 
                    setShowCertAwardModal(true); 
                  }}
                >
                  <DynamicIcon name="Plus" size={16} /> เพิ่มภาพเกียรติบัตร/รางวัล
                </button>
              </div>

              <div className="admin-gallery-grid">
                {(Array.isArray(hero.certsAndAwards) && hero.certsAndAwards.length > 0 
                  ? hero.certsAndAwards 
                  : (
                      ((Array.isArray(hero.certificates) && hero.certificates.length > 0) || (Array.isArray(hero.awards) && hero.awards.length > 0))
                        ? [
                            ...(Array.isArray(hero.certificates) ? hero.certificates : []),
                            ...(Array.isArray(hero.awards) ? hero.awards : [])
                          ]
                        : DEFAULT_CERTS_AND_AWARDS
                    )
                ).map((cert, idx) => (
                  <div key={cert.id || idx} className="admin-gallery-card">
                    <img src={cert.imageUrl || cert.url || cert.src} alt="Certificate / Award" className="admin-gallery-thumb" />
                    <div className="admin-gallery-info">
                      <div className="admin-gallery-title" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <DynamicIcon name="Award" size={14} style={{ color: "#eab308" }} />
                        <span>เกียรติบัตร/รางวัล #{idx + 1}</span>
                      </div>
                      <div className="admin-gallery-actions">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: "0.35rem 0.5rem", fontSize: "0.75rem", color: "#f87171", width: "100%", justifyContent: "center" }}
                          onClick={() => handleDeleteCertAward(cert.id)}
                        >
                          <DynamicIcon name="Trash2" size={13} /> ลบรูปภาพนี้
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ACTIVITIES (ผลงานเวลาว่าง เช่น อนิเมชั่น คลิปวิดีโอ หรือภาพ รองรับทั้งคลิปทั้งภาพ) */}
          {activeTab === "activities" && (
            <div>
              <div className="admin-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2>จัดการกิจกรรมและผลงานเวลาว่าง (Activities)</h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0.25rem 0 0 0" }}>
                    ใส่ผลงานที่ทำขึ้นเวลาว่าง เช่น อนิเมชั่น คลิปวิดีโอ หรือรูปภาพ (แสดงเฉพาะภาพหรือวิดีโอ และกดขยายเพื่อดูได้)
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => { 
                    setActivityForm({ type: "image", url: "", thumbnailUrl: "" }); 
                    setShowActivityModal(true); 
                  }}
                >
                  <DynamicIcon name="Plus" size={16} /> เพิ่มภาพ/วิดีโอ Activities
                </button>
              </div>

              <div className="admin-gallery-grid">
                {(Array.isArray(hero.activities) && hero.activities.length > 0 
                  ? hero.activities 
                  : (
                      ((Array.isArray(hero.certificates) && hero.certificates.length > 0) || (Array.isArray(hero.awards) && hero.awards.length > 0))
                        ? [
                            ...(Array.isArray(hero.certificates) ? hero.certificates.map(c => ({ id: c.id, type: "image", url: c.imageUrl || c.url || c.src })) : []),
                            ...(Array.isArray(hero.awards) ? hero.awards.map(a => ({ id: a.id, type: "image", url: a.imageUrl || a.url || a.src })) : [])
                          ]
                        : DEFAULT_ACTIVITIES
                    )
                ).map((act, idx) => {
                  const isVid = act.type === "video" || isVideoMedia(act);
                  const ytId = isVid ? getYouTubeId(act.url) : null;
                  const thumb = act.thumbnailUrl || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null);

                  return (
                    <div key={act.id || idx} className="admin-gallery-card">
                      {isVid ? (
                        thumb ? (
                          <img src={thumb} alt="Activity Video Thumbnail" className="admin-gallery-thumb" />
                        ) : (
                          <div style={{ width: "100%", height: "130px", background: "#050b1a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "#38bdf8" }}>
                            <DynamicIcon name="Video" size={32} />
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>วิดีโอ / อนิเมชั่น</span>
                          </div>
                        )
                      ) : (
                        <img src={act.url || act.imageUrl} alt="Activity Media" className="admin-gallery-thumb" />
                      )}
                      <div className="admin-gallery-info">
                        <div className="admin-gallery-title" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <DynamicIcon name={isVid ? "Video" : "Image"} size={14} style={{ color: "#38bdf8" }} />
                          <span>{isVid ? "วิดีโอ / คลิป" : "รูปภาพ"} #{idx + 1}</span>
                        </div>
                        <div className="admin-gallery-actions">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ padding: "0.35rem 0.5rem", fontSize: "0.75rem", color: "#f87171", width: "100%", justifyContent: "center" }}
                            onClick={() => handleDeleteActivity(act.id)}
                          >
                            <DynamicIcon name="Trash2" size={13} /> ลบรายการนี้
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: CONTACTS */}
          {activeTab === "contacts" && (
            <div>
              <div className="admin-section-header">
                <h2>แก้ไขช่องทางการติดต่อ</h2>
              </div>
              <form onSubmit={handleSaveContacts}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {contacts.map((contact, index) => (
                    <div key={contact.id} className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <DynamicIcon name={contact.icon} size={16} /> {contact.label}
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={contact.value || ""} 
                        onChange={e => handleContactChange(index, e.target.value)} 
                        required 
                      />
                    </div>
                  ))}
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>
                  <DynamicIcon name="Save" size={16} /> บันทึกข้อมูลการติดต่อ
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: CUSTOM CSS */}
          {activeTab === "css" && (
            <div>
              <div className="admin-section-header">
                <h2>ปรับแต่งสไตล์ด้วย CSS แบบเรียลไทม์</h2>
              </div>
              <form onSubmit={handleSaveCss}>
                <div className="form-group">
                  <label>โค้ด CSS สำหรับปรับแต่งตกแต่งเว็บไซต์</label>
                  <textarea 
                    className="form-control" 
                    rows={12} 
                    style={{ fontFamily: "monospace", fontSize: "0.9rem" }}
                    placeholder="เช่น body { background: #000; }"
                    value={cssCode} 
                    onChange={e => setCssCode(e.target.value)} 
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  <DynamicIcon name="Save" size={16} /> บันทึกและฉีด CSS
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: SUPABASE STORAGE SETTINGS */}
          {activeTab === "supabase" && (
            <div>
              <div className="admin-section-header">
                <h2>ตั้งค่า Supabase Storage (เก็บรูปภาพ & วิดีโอ)</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0.25rem 0 0 0" }}>
                  แก้ปัญหาติดเพดาน 1MB ของ Firestore และปลดล็อคการอัปโหลดรูปภาพเกียรติบัตรและคลิปวิดีโอเข้า Supabase Storage
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* 1. Status & Info Card */}
                <div style={{ background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem", borderRadius: "12px", lineHeight: 1.8 }}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <DynamicIcon name="HardDrive" size={20} style={{ color: "#38bdf8" }} />
                    ข้อมูล Bucket & โฟลเดอร์ Supabase
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "0.5rem", fontSize: "0.9rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Project ID:</span>
                    <span style={{ fontFamily: "monospace", color: "#38bdf8" }}>{SUPABASE_PROJECT_ID}</span>

                    <span style={{ color: "var(--text-muted)" }}>Bucket Name:</span>
                    <span style={{ fontFamily: "monospace", color: "#eab308" }}>{SUPABASE_BUCKET_NAME}</span>

                    <span style={{ color: "var(--text-muted)" }}>Project Pic Folder:</span>
                    <span style={{ fontFamily: "monospace", color: "#38bdf8" }}>database myfolio/project pic/</span>

                    <span style={{ color: "var(--text-muted)" }}>Gallery Pic Folder:</span>
                    <span style={{ fontFamily: "monospace", color: "#ec4899" }}>database myfolio/gallery pic/</span>

                    <span style={{ color: "var(--text-muted)" }}>Cer & Award Folder:</span>
                    <span style={{ fontFamily: "monospace", color: "#10b981" }}>database myfolio/cer & award/</span>

                    <span style={{ color: "var(--text-muted)" }}>Activity Folder:</span>
                    <span style={{ fontFamily: "monospace", color: "#a855f7" }}>database myfolio/activity pic&clip/</span>

                    <span style={{ color: "var(--text-muted)" }}>สถานะการเชื่อมต่อ:</span>
                    <span>
                      {isSupabaseConfigured() ? (
                        <span style={{ color: "#10b981", fontWeight: "bold" }}>✅ กำหนด Anon Key แล้ว (พร้อมอัปโหลด)</span>
                      ) : (
                        <span style={{ color: "#f87171", fontWeight: "bold" }}>❌ ยังไม่ได้กำหนด Anon Key</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* 2. Key Input Form */}
                <div style={{ background: "rgba(30, 41, 59, 0.35)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem", borderRadius: "12px" }}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                    🔑 กำหนดค่า Supabase Anon (Public) Key
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                    สามารถคัดลอกได้จาก:{" "}
                    <a 
                      href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/settings/api`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: "#38bdf8", textDecoration: "underline" }}
                    >
                      Supabase Project Settings &gt; API &gt; anon public key
                    </a>
                  </p>

                  <div className="form-group" style={{ marginBottom: "1rem" }}>
                    <label>Supabase Anon Key (JWT format เริ่มต้นด้วย eyJhbGci...)</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      style={{ fontFamily: "monospace", fontSize: "0.85rem", wordBreak: "break-all" }}
                      placeholder="วาง anon public key ที่ได้จาก Supabase ที่นี่..."
                      value={supabaseKeyInput}
                      onChange={e => setSupabaseKeyInput(e.target.value)}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        const trimmed = supabaseKeyInput.trim();
                        setSupabaseAnonKey(trimmed);
                        triggerToast(trimmed ? "💾 บันทึก Supabase Anon Key เรียบร้อยแล้ว!" : "🗑️ ลบ Anon Key เรียบร้อยแล้ว");
                      }}
                    >
                      <DynamicIcon name="Save" size={16} /> บันทึก Anon Key
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={supabaseTesting}
                      onClick={async () => {
                        setSupabaseTesting(true);
                        setSupabaseStatusMsg("⏳ กำลังทดสอบการเชื่อมต่อกับ Supabase Storage...");
                        const res = await testSupabaseConnection();
                        setSupabaseTesting(false);
                        setSupabaseStatusMsg(res.message);
                        triggerToast(res.success ? "✅ " + res.message : "❌ " + res.message);
                      }}
                    >
                      <DynamicIcon name="RefreshCw" size={16} /> ทดสอบการเชื่อมต่อ Bucket
                    </button>
                  </div>

                  {supabaseStatusMsg && (
                    <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", borderRadius: "8px", background: "rgba(0,0,0,0.3)", fontSize: "0.85rem", color: supabaseStatusMsg.includes("สำเร็จ") ? "#10b981" : "#f87171" }}>
                      {supabaseStatusMsg}
                    </div>
                  )}
                </div>

                {/* 3. Instructions */}
                <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px dashed rgba(56, 189, 248, 0.3)", padding: "1.25rem", borderRadius: "12px", fontSize: "0.85rem", lineHeight: 1.7 }}>
                  <h4 style={{ color: "#38bdf8", marginBottom: "0.5rem" }}>📌 คำแนะนำการตั้งค่าใน Supabase Dashboard:</h4>
                  <ol style={{ paddingLeft: "1.25rem", margin: 0, color: "var(--text-muted)" }}>
                    <li>
                      ไปที่หน้า <b>Storage &gt; Configuration &gt; Buckets</b> ใน Supabase และตรวจสอบว่า Bucket <b><code>{SUPABASE_BUCKET_NAME}</code></b> ถูกเลือกเป็น <b>Public Bucket</b>
                    </li>
                    <li>
                      หากมีเปิดใช้งาน <b>Row Level Security (RLS)</b> ให้เพิ่ม Policy เพื่ออนุญาตให้ <b>INSERT (Upload)</b> และ <b>SELECT (Read)</b> สำหรับบทบาท <code>anon</code> / <code>public</code>
                    </li>
                    <li>
                      คัดลอกค่า <b>anon public key</b> จากหน้า <b>Settings &gt; API</b> มาวางในช่องด้านบนแล้วกด "บันทึก Anon Key"
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: FIREBASE */}
          {activeTab === "firebase" && (
            <div>
              <div className="admin-section-header">
                <h2>ข้อมูลสถานะ Firebase Backend</h2>
              </div>
              <div style={{ background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem", borderRadius: "12px", lineHeight: 1.8 }}>
                <p><strong>สถานะปัจจุบัน:</strong> {isFirebaseConfigured ? "🔥 เชื่อมต่อกับ Firebase เรียบร้อย" : "⚠️ ทำงานในโหมด LocalStorage"}</p>
                <p style={{ marginTop: "0.5rem", color: "var(--text-secondary)" }}>
                  หากคุณต้องการซิงก์ข้อมูลขึ้น Firebase Firestore แบบเรียลไทม์ สามารถใส่ข้อมูล config ได้ที่ไฟล์ <code>src/firebase.js</code>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: ADD / EDIT ITEM */}
      {showItemModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingItem ? "แก้ไขผลงาน/เกียรติบัตร" : "เพิ่มผลงานชิ้นใหม่"}</h3>
              <button type="button" className="btn-icon" onClick={() => setShowItemModal(false)}>
                <DynamicIcon name="X" size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveItem}>
              <div className="modal-body">
                {isSupabaseConfigured() ? (
                  <div style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#6ee7b7", fontSize: "0.8rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <DynamicIcon name="CheckCircle" size={15} />
                    <span>รูปภาพปกและรูปภาพรายละเอียดจะถูกบันทึกเข้า Supabase Storage (<code>database myfolio/project pic/</code>)</span>
                  </div>
                ) : (
                  <div style={{ padding: "0.6rem 0.75rem", borderRadius: "8px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#fca5a5", fontSize: "0.8rem", marginBottom: "1rem" }}>
                    ⚠️ <b>ยังไม่ได้เชื่อมต่อ Supabase Storage:</b> รูปภาพจะถูกบีบอัดเก็บในฐานข้อมูลปกติ
                  </div>
                )}
                <div className="form-group">
                  <label>หมวดหมู่</label>
                  <select 
                    className="form-control" 
                    value={itemForm.categoryId} 
                    onChange={e => setItemForm(prev => ({ ...prev, categoryId: e.target.value }))}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>ชื่อผลงาน / ใบรับรอง</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={itemForm.title} 
                    onChange={e => setItemForm(prev => ({ ...prev, title: e.target.value }))} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>เทคโนโลยีที่ใช้ (คั่นด้วยจุลภาค เช่น React, Tailwind, Node.js)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="React, Tailwind CSS, TypeScript"
                    value={itemForm.tags} 
                    onChange={e => setItemForm(prev => ({ ...prev, tags: e.target.value }))} 
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label>ลิงก์ Live Demo</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="https://..."
                      value={itemForm.demoUrl} 
                      onChange={e => setItemForm(prev => ({ ...prev, demoUrl: e.target.value }))} 
                    />
                  </div>
                  <div className="form-group">
                    <label>ลิงก์ GitHub</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="https://github.com/..."
                      value={itemForm.githubUrl} 
                      onChange={e => setItemForm(prev => ({ ...prev, githubUrl: e.target.value }))} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>รูปภาพผลงาน หรือ เอกสาร PDF</label>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <input 
                      type="file" 
                      accept="image/*,application/pdf" 
                      onChange={handleItemFileChange} 
                    />
                    {itemForm.imageUrl && (
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        style={{ color: "#f87171" }}
                        onClick={() => setItemForm(prev => ({ ...prev, imageUrl: "", file: null }))}
                      >
                        ลบไฟล์ (ใช้ Placeholder)
                      </button>
                    )}
                  </div>
                </div>

                {/* รูปภาพสำหรับหน้ารายละเอียดโปรเจกต์ (Detail Images) - เพิ่ม/ลดได้หลายรูป ต่างจากรูปหน้าแรก */}
                <div className="form-group">
                  <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>🖼️ รูปภาพสำหรับหน้ารายละเอียด (Detail Images - เพิ่ม/ลดได้หลายรูป)</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>ต่างจากรูปปกหน้าแรก</span>
                  </label>
                  
                  {/* แสดงรายการรูปภาพในหน้ารายละเอียดที่เพิ่มไว้ */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    {(itemForm.detailImages || []).map((imgUrl, dIdx) => (
                      <div key={dIdx} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", height: "70px", border: "1px solid rgba(255,255,255,0.15)" }}>
                        <img src={imgUrl} alt={`Detail ${dIdx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button
                          type="button"
                          onClick={() => {
                            setItemForm(prev => ({
                              ...prev,
                              detailImages: prev.detailImages.filter((_, i) => i !== dIdx)
                            }));
                          }}
                          style={{ position: "absolute", top: "2px", right: "2px", background: "rgba(239,68,68,0.85)", border: "none", color: "#fff", borderRadius: "4px", padding: "2px 5px", fontSize: "11px", cursor: "pointer" }}
                          title="ลบรูปนี้"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* ปุ่มอัปโหลดรูปภาพหน้ารายละเอียด และช่องใส่ URL */}
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      id="detail-img-file-input" 
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (!isSupabaseConfigured()) {
                            triggerToast("⚠️ ยังไม่ได้เชื่อมต่อ Supabase Storage");
                            return;
                          }
                          triggerToast("⏳ กำลังอัปโหลดรูปภาพหน้ารายละเอียดเข้า Supabase (project pic)...");
                          try {
                            const url = await uploadProjectFile(file);
                            setItemForm(prev => ({ ...prev, detailImages: [...(prev.detailImages || []), url] }));
                            triggerToast("✅ เพิ่มรูปภาพหน้ารายละเอียดแล้ว!");
                          } catch (err) {
                            triggerToast(`❌ ${err.message || "อัปโหลดรูปภาพไม่สำเร็จ"}`);
                          }
                          e.target.value = "";
                        }
                      }} 
                    />
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => document.getElementById("detail-img-file-input").click()}
                      style={{ fontSize: "0.85rem" }}
                    >
                      <DynamicIcon name="UploadCloud" size={14} /> อัปโหลดไฟล์ภาพ
                    </button>

                    <div style={{ display: "flex", gap: "0.4rem", flex: 1, minWidth: "220px" }}>
                      <input 
                        type="url" 
                        id="detail-img-url-input"
                        className="form-control" 
                        placeholder="หรือวาง URL รูปภาพ (https://...)" 
                        style={{ fontSize: "0.85rem", padding: "0.4rem 0.6rem" }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = e.target.value.trim();
                            if (val) {
                              setItemForm(prev => ({ ...prev, detailImages: [...(prev.detailImages || []), val] }));
                              e.target.value = "";
                              triggerToast("✅ เพิ่มรูปภาพหน้ารายละเอียดแล้ว!");
                            }
                          }
                        }}
                      />
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}
                        onClick={() => {
                          const inputEl = document.getElementById("detail-img-url-input");
                          const val = inputEl ? inputEl.value.trim() : "";
                          if (val) {
                            setItemForm(prev => ({ ...prev, detailImages: [...(prev.detailImages || []), val] }));
                            inputEl.value = "";
                            triggerToast("✅ เพิ่มรูปภาพหน้ารายละเอียดแล้ว!");
                          } else {
                            triggerToast("⚠️ กรุณาวาง URL รูปภาพก่อนกดเพิ่ม");
                          }
                        }}
                      >
                        + เพิ่มด้วย URL
                      </button>
                    </div>
                  </div>
                </div>

                {/* คำอธิบายสั้นสำหรับแสดงบนการ์ดหน้าแรก (ข้อ 2 ตามภาพแนบที่ 2) */}
                <div className="form-group">
                  <label>คำอธิบายสั้น (แสดงที่การ์ดหน้าแรก)</label>
                  <textarea 
                    className="form-control" 
                    rows={2}
                    placeholder="คำอธิบายสรุปสั้นๆ สำหรับแสดงบนการ์ดผลงานในหน้าแรก..."
                    value={itemForm.description} 
                    onChange={e => setItemForm(prev => ({ ...prev, description: e.target.value }))} 
                    required 
                  />
                </div>

                {/* คำอธิบายรายละเอียดเพิ่มเติมสำหรับแสดงในหน้ารายละเอียด (ข้อ 2 ตามภาพแนบที่ 2) */}
                <div className="form-group">
                  <label>คำอธิบายรายละเอียดเพิ่มเติม (แสดงในหน้ารายละเอียด)</label>
                  <textarea 
                    className="form-control" 
                    rows={5}
                    placeholder="คำอธิบายเชิงลึก รายละเอียดฟังก์ชัน หรือกระบวนการพัฒนาสำหรับแสดงในหน้ารายละเอียดโปรเจกต์..."
                    value={itemForm.detailDescription} 
                    onChange={e => setItemForm(prev => ({ ...prev, detailDescription: e.target.value }))} 
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowItemModal(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary">
                  <DynamicIcon name="Check" size={16} /> บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT TIMELINE (EDUCATION & EXPERIENCE) */}
      {showTimelineModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {editingTimelineId ? "✏️ แก้ไขข้อมูล" : "➕ เพิ่มข้อมูลใหม่"}: {" "}
                {timelineType === "education" ? "ประวัติการศึกษา (Education)" : "ประสบการณ์ (Experience)"}
              </h3>
              <button type="button" className="btn-icon" onClick={() => setShowTimelineModal(false)}>
                <DynamicIcon name="X" size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveTimeline}>
              <div className="modal-body">
                <div className="form-group">
                  <label>{timelineType === "education" ? "ชื่อสถาบันการศึกษา / มหาวิทยาลัย" : "ชื่อบริษัท / องค์กร"}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={timelineForm.title} 
                    placeholder={timelineType === "education" ? "เช่น Universitas Brawijaya" : "เช่น Google Indonesia"}
                    onChange={e => setTimelineForm(prev => ({ ...prev, title: e.target.value }))} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>{timelineType === "education" ? "สาขาวิชา / คณะ / วุฒิการศึกษา" : "ตำแหน่ง / บทบาทหน้าที่"}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={timelineForm.subtitle} 
                    placeholder={timelineType === "education" ? "เช่น JT Edu | Faculty of Computer Science" : "เช่น Google Student Ambassador"}
                    onChange={e => setTimelineForm(prev => ({ ...prev, subtitle: e.target.value }))} 
                  />
                </div>

                <div className="form-group">
                  <label>ระยะเวลา / ปีที่ศึกษาหรือทำงาน</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={timelineForm.period} 
                    placeholder="เช่น 2025 – Present หรือ 2021 – 2024"
                    onChange={e => setTimelineForm(prev => ({ ...prev, period: e.target.value }))} 
                  />
                </div>

                <div className="form-group">
                  <label>เลือกไอคอนสัญลักษณ์ (แสดงเมื่อไม่มีการอัปโหลดรูปภาพ)</label>
                  <select 
                    className="form-control" 
                    value={timelineForm.icon} 
                    onChange={e => setTimelineForm(prev => ({ ...prev, icon: e.target.value }))}
                  >
                    <option value="GraduationCap">🎓 GraduationCap (หมวกรับปริญญา)</option>
                    <option value="School">🏫 School (โรงเรียน/สถาบัน)</option>
                    <option value="BookOpen">📖 BookOpen (หนังสือ)</option>
                    <option value="Briefcase">💼 Briefcase (กระเป๋าทำงาน)</option>
                    <option value="Sparkles">✨ Sparkles (ประกายวิบวับ)</option>
                    <option value="Users">👥 Users (กลุ่มคน/ชมรม)</option>
                    <option value="Layers">📑 Layers (เลเยอร์)</option>
                    <option value="Trophy">🏆 Trophy (ถ้วยรางวัล)</option>
                    <option value="Code2">💻 Code2 (โค้ด/ไอที)</option>
                    <option value="Award">🎖️ Award (เกียรติบัตร)</option>
                  </select>
                </div>

                {/* อัปโหลดรูปภาพ/โลโก้หน้าข้อความ */}
                <div className="form-group">
                  <label>รูปภาพ / โลโก้หน้าข้อความ (Custom Image/Logo)</label>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <div style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "12px",
                      border: "1px dashed rgba(255, 255, 255, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      background: "rgba(0, 0, 0, 0.4)",
                      flexShrink: 0
                    }}>
                      {timelineForm.imageUrl ? (
                        <img src={timelineForm.imageUrl} alt="Logo" style={{ width: "100%", height: "100%", maxWidth: "42px", maxHeight: "42px", objectFit: "contain" }} />
                      ) : (
                        <DynamicIcon name={timelineForm.icon || "HelpCircle"} size={24} style={{ color: "var(--text-muted)" }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="timeline-image-input" 
                        style={{ display: "none" }}
                        onChange={handleTimelineImageUpload} 
                      />
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => document.getElementById("timeline-image-input").click()}
                      >
                        <DynamicIcon name="UploadCloud" size={16} /> อัปโหลดรูปโลโก้
                      </button>
                      {timelineForm.imageUrl && (
                        <button 
                          type="button" 
                          className="btn btn-secondary" 
                          style={{ marginLeft: "0.5rem", color: "#f87171" }}
                          onClick={() => setTimelineForm(prev => ({ ...prev, imageUrl: "" }))}
                        >
                          ลบรูป (ใช้ไอคอน)
                        </button>
                      )}
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0.35rem 0 0 0" }}>
                        ระบบบีบอัดภาพให้อัตโนมัติ (บันทึกเข้าฐานข้อมูลได้ทันทีโดยไม่ต้องเชื่อมต่อ Supabase)
                      </p>
                    </div>
                  </div>

                  <div style={{ marginTop: "0.75rem" }}>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.25rem", display: "block" }}>
                      หรือวางลิงก์ URL รูปภาพโลโก้โดยตรง:
                    </label>
                    <input 
                      type="url" 
                      className="form-control" 
                      placeholder="https://.../logo.png" 
                      value={timelineForm.imageUrl && !timelineForm.imageUrl.startsWith("data:") ? timelineForm.imageUrl : ""} 
                      onChange={e => setTimelineForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                      style={{ fontSize: "0.85rem", padding: "0.4rem 0.6rem" }}
                    />
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTimelineModal(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary">
                  <DynamicIcon name="Check" size={16} /> บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT TECH STACK ITEM */}
      {showTechModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: "520px" }}>
            <div className="modal-header">
              <h3>{editingTechId ? "แก้ไขข้อมูล Tech Stack" : "เพิ่ม Tech Stack ใหม่"}</h3>
              <button type="button" className="btn-icon" onClick={() => setShowTechModal(false)}>
                <DynamicIcon name="X" size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveTech}>
              <div className="modal-body">
                <div className="form-group">
                  <label>ชื่อเทคโนโลยี / ทักษะ (Tech Name) *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="เช่น HTML, React, Docker, Python..."
                    value={techForm.name}
                    onChange={e => setTechForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                {/* Upload or Preset Logo */}
                <div className="form-group">
                  <label>รูปภาพโลโก้ (Logo Image / SVG)</label>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "0.75rem" }}>
                    <div style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "14px",
                      border: "1px dashed rgba(255, 255, 255, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      background: "rgba(0, 0, 0, 0.5)",
                      flexShrink: 0
                    }}>
                      {techForm.imageUrl ? (
                        <img src={techForm.imageUrl} alt="Tech Logo" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
                      ) : (
                        <DynamicIcon name={techForm.icon || "Code2"} size={28} style={{ color: "var(--text-muted)" }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        type="file"
                        accept="image/*"
                        id="tech-logo-file-input"
                        style={{ display: "none" }}
                        onChange={handleTechImageUpload}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => document.getElementById("tech-logo-file-input").click()}
                      >
                        <DynamicIcon name="UploadCloud" size={16} /> อัปโหลดไฟล์โลโก้
                      </button>
                      {techForm.imageUrl && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ marginLeft: "0.5rem", color: "#f87171" }}
                          onClick={() => setTechForm(prev => ({ ...prev, imageUrl: "" }))}
                        >
                          ลบรูป
                        </button>
                      )}
                      <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: "0.35rem 0 0 0" }}>
                        รองรับ PNG, SVG, JPG (แนะนำไฟล์พื้นหลังโปร่งใส Transparent)
                      </p>
                    </div>
                  </div>

                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.25rem", display: "block" }}>
                    หรือใส่ลิงก์ URL รูปภาพโลโก้โดยตรง:
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://raw.githubusercontent.com/.../logo.svg"
                    value={techForm.imageUrl}
                    onChange={e => setTechForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>ไอคอนสำรอง (Fallback Icon หากไม่มีรูปภาพ)</label>
                  <select
                    className="form-control"
                    value={techForm.icon}
                    onChange={e => setTechForm(prev => ({ ...prev, icon: e.target.value }))}
                  >
                    <option value="Code2">💻 Code2 (โค้ด/โปรแกรมมิ่ง)</option>
                    <option value="Cpu">🧠 Cpu (โปรเซสเซอร์/ฮาร์ดแวร์)</option>
                    <option value="Layout">📐 Layout (โครงสร้าง/HTML)</option>
                    <option value="Palette">🎨 Palette (ดีไซน์/CSS)</option>
                    <option value="FileCode">📄 FileCode (ไฟล์ซอร์สโค้ด)</option>
                    <option value="Database">🗄️ Database (ฐานข้อมูล)</option>
                    <option value="Server">🖥️ Server (แบ็กเอนด์/เซิร์ฟเวอร์)</option>
                    <option value="Terminal">⌨️ Terminal (คอมมานด์ไลน์)</option>
                    <option value="Flame">🔥 Flame (Firebase)</option>
                    <option value="GitBranch">🌿 GitBranch (Git Version Control)</option>
                    <option value="Boxes">📦 Boxes (แพ็กเกจ/เครื่องมือ)</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTechModal(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary">
                  <DynamicIcon name="Check" size={16} /> {editingTechId ? "บันทึกการแก้ไข" : "เพิ่ม Tech Stack"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal เพิ่ม/แก้ไขภาพแกลเลอรี Coverflow */}
      {showGalleryModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editingGalleryId ? "✏️ แก้ไขรูปภาพแกลเลอรี" : "➕ เพิ่มรูปภาพแกลเลอรีใหม่"}</h3>
              <button type="button" className="btn-close" onClick={() => setShowGalleryModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveGallery}>
              <div className="modal-body">
                {isSupabaseConfigured() ? (
                  <div style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#6ee7b7", fontSize: "0.8rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <DynamicIcon name="CheckCircle" size={15} />
                    <span>รูปภาพจะถูกบันทึกเข้า Supabase Storage (<code>database myfolio/gallery pic/</code>)</span>
                  </div>
                ) : (
                  <div style={{ padding: "0.6rem 0.75rem", borderRadius: "8px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#fca5a5", fontSize: "0.8rem", marginBottom: "1rem" }}>
                    ⚠️ <b>ยังไม่ได้เชื่อมต่อ Supabase Storage:</b>{" "}
                    <button 
                      type="button" 
                      onClick={() => { setShowGalleryModal(false); setActiveTab("supabase"); }}
                      style={{ background: "none", border: "none", color: "#38bdf8", textDecoration: "underline", cursor: "pointer", padding: 0, fontWeight: "bold" }}
                    >
                      คลิกที่นี่เพื่อไปใส่ Supabase Anon Key
                    </button>
                  </div>
                )}
                <div className="form-group">
                  <label>ชื่อคำอธิบายภาพ (Title / Caption)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="เช่น กิจกรรมการประกวด Hackathon..."
                    value={galleryForm.title}
                    onChange={e => setGalleryForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>รูปภาพ (แนะนำอัตราส่วน 4:5 หรือ 3:4)</label>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "0.75rem" }}>
                    <div style={{
                      width: "80px",
                      height: "100px",
                      borderRadius: "10px",
                      border: "1px dashed rgba(255, 255, 255, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      background: "rgba(0, 0, 0, 0.5)",
                      flexShrink: 0
                    }}>
                      {galleryForm.imageUrl ? (
                        <img src={galleryForm.imageUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <DynamicIcon name="Image" size={28} style={{ color: "var(--text-muted)" }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        type="file"
                        accept="image/*"
                        id="gallery-file-input"
                        style={{ display: "none" }}
                        onChange={handleGalleryImageUpload}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => document.getElementById("gallery-file-input").click()}
                      >
                        <DynamicIcon name="UploadCloud" size={16} /> อัปโหลดรูปภาพ
                      </button>
                      {galleryForm.imageUrl && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ marginLeft: "0.5rem", color: "#f87171" }}
                          onClick={() => setGalleryForm(prev => ({ ...prev, imageUrl: "" }))}
                        >
                          ลบรูป
                        </button>
                      )}
                      <p style={{ fontSize: "0.75rem", color: "#10b981", margin: "0.35rem 0 0 0" }}>
                        ☁️ บันทึกรูปภาพลง Supabase Storage (โฟลเดอร์ gallery pic) อัตโนมัติ
                      </p>
                    </div>
                  </div>

                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.25rem", display: "block" }}>
                    หรือใส่ลิงก์ URL รูปภาพโดยตรง:
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={galleryForm.imageUrl}
                    onChange={e => setGalleryForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowGalleryModal(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary">
                  <DynamicIcon name="Check" size={16} /> {editingGalleryId ? "บันทึกการแก้ไข" : "เพิ่มในแกลเลอรี"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: เพิ่มรูปภาพเกียรติบัตร & รางวัล (Certificates & Awards - ภาพเท่านั้น) */}
      {showCertAwardModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: "480px" }}>
            <div className="modal-header">
              <h3>เพิ่มรูปภาพเกียรติบัตร & รางวัล</h3>
              <button type="button" className="btn-icon" onClick={() => setShowCertAwardModal(false)}>
                <DynamicIcon name="X" size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveCertAward}>
              <div className="modal-body">
                {isSupabaseConfigured() ? (
                  <div style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#6ee7b7", fontSize: "0.8rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <DynamicIcon name="CheckCircle" size={15} />
                    <span>อัปโหลดเข้า Supabase Storage (<code>database myfolio/cer & award/</code>)</span>
                  </div>
                ) : (
                  <div style={{ padding: "0.6rem 0.75rem", borderRadius: "8px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#fca5a5", fontSize: "0.8rem", marginBottom: "1rem" }}>
                    ⚠️ <b>ยังไม่ได้เชื่อมต่อ Supabase Storage:</b>{" "}
                    <button 
                      type="button" 
                      onClick={() => { setShowCertAwardModal(false); setActiveTab("supabase"); }}
                      style={{ background: "none", border: "none", color: "#38bdf8", textDecoration: "underline", cursor: "pointer", padding: 0, fontWeight: "bold" }}
                    >
                      คลิกที่นี่เพื่อไปใส่ Supabase Anon Key
                    </button>
                  </div>
                )}
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                  ส่วนนี้รองรับเฉพาะรูปภาพเกียรติบัตรหรือภาพรางวัล (ภาพเท่านั้น)
                </p>
                <div className="form-group">
                  <label>เลือกไฟล์รูปภาพเกียรติบัตร (PNG, JPG, WebP) *</label>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "0.85rem" }}>
                    <div style={{ width: "96px", height: "70px", borderRadius: "8px", overflow: "hidden", background: "#000", border: "1px dashed rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {certAwardImageUrl ? (
                        <img src={certAwardImageUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <DynamicIcon name="Award" size={26} style={{ color: "var(--text-muted)" }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="cert-award-file-input" 
                        style={{ display: "none" }}
                        onChange={handleUploadCertAwardImage} 
                      />
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => document.getElementById("cert-award-file-input").click()}
                      >
                        <DynamicIcon name="UploadCloud" size={16} /> อัปโหลดรูปภาพเกียรติบัตร
                      </button>
                    </div>
                  </div>

                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.25rem", display: "block" }}>
                    หรือใส่ลิงก์ URL รูปภาพโดยตรง:
                  </label>
                  <input 
                    type="url" 
                    className="form-control" 
                    placeholder="https://..." 
                    value={certAwardImageUrl} 
                    onChange={e => setCertAwardImageUrl(e.target.value)} 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCertAwardModal(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary">
                  <DynamicIcon name="Check" size={16} /> บันทึกรูปภาพเกียรติบัตร
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: เพิ่มผลงาน Activities (กิจกรรม/ผลงานเวลาว่าง รองรับทั้งภาพและวิดีโอ) */}
      {showActivityModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: "520px" }}>
            <div className="modal-header">
              <h3>เพิ่มผลงาน Activities (รูปภาพ / วิดีโอ)</h3>
              <button type="button" className="btn-icon" onClick={() => setShowActivityModal(false)}>
                <DynamicIcon name="X" size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveActivity}>
              <div className="modal-body">
                {isSupabaseConfigured() ? (
                  <div style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#6ee7b7", fontSize: "0.8rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <DynamicIcon name="CheckCircle" size={15} />
                    <span>อัปโหลดเข้า Supabase Storage (<code>database myfolio/activity pic&clip/</code>)</span>
                  </div>
                ) : (
                  <div style={{ padding: "0.6rem 0.75rem", borderRadius: "8px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#fca5a5", fontSize: "0.8rem", marginBottom: "1rem" }}>
                    ⚠️ <b>ยังไม่ได้เชื่อมต่อ Supabase Storage:</b>{" "}
                    <button 
                      type="button" 
                      onClick={() => { setShowActivityModal(false); setActiveTab("supabase"); }}
                      style={{ background: "none", border: "none", color: "#38bdf8", textDecoration: "underline", cursor: "pointer", padding: 0, fontWeight: "bold" }}
                    >
                      คลิกที่นี่เพื่อไปใส่ Supabase Anon Key
                    </button>
                  </div>
                )}

                {/* 1. สลับประเภท: รูปภาพ หรือ วิดีโอ */}
                <div className="form-group">
                  <label>ประเภทของสื่อ (Media Type) *</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    <button
                      type="button"
                      className={`btn ${activityForm.type === "image" ? "btn-primary" : "btn-secondary"}`}
                      style={{ justifyContent: "center" }}
                      onClick={() => setActivityForm(prev => ({ ...prev, type: "image" }))}
                    >
                      <DynamicIcon name="Image" size={16} /> รูปภาพ (Image)
                    </button>
                    <button
                      type="button"
                      className={`btn ${activityForm.type === "video" ? "btn-primary" : "btn-secondary"}`}
                      style={{ justifyContent: "center" }}
                      onClick={() => setActivityForm(prev => ({ ...prev, type: "video" }))}
                    >
                      <DynamicIcon name="Video" size={16} /> วิดีโอ / คลิป (Video)
                    </button>
                  </div>
                </div>

                {/* 2. เลือกหรืออัปโหลดไฟล์ */}
                <div className="form-group">
                  <label>
                    {activityForm.type === "video" 
                      ? "อัปโหลดไฟล์วิดีโอ (MP4, WebM, MOV) เข้า Supabase หรือใส่ลิงก์ URL ด้านล่าง *" 
                      : "เลือกไฟล์รูปภาพ (PNG, JPG, WebP) เข้า Supabase *"}
                  </label>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "0.85rem" }}>
                    <div style={{ width: "96px", height: "70px", borderRadius: "8px", overflow: "hidden", background: "#000", border: "1px dashed rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {activityForm.url ? (
                        activityForm.type === "video" ? (
                          activityForm.thumbnailUrl ? (
                            <img src={activityForm.thumbnailUrl} alt="Thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <video src={activityForm.url} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          )
                        ) : (
                          <img src={activityForm.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        )
                      ) : (
                        <DynamicIcon name={activityForm.type === "video" ? "Video" : "Sparkles"} size={26} style={{ color: "var(--text-muted)" }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <input 
                        type="file" 
                        accept={activityForm.type === "video" ? "video/*,image/*" : "image/*"} 
                        id="activity-file-input" 
                        style={{ display: "none" }}
                        onChange={handleUploadActivityMedia} 
                      />
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => document.getElementById("activity-file-input").click()}
                      >
                        <DynamicIcon name="UploadCloud" size={16} /> {activityForm.type === "video" ? "อัปโหลดไฟล์วิดีโอ/ภาพ" : "อัปโหลดรูปภาพ"}
                      </button>
                    </div>
                  </div>

                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.25rem", display: "block" }}>
                    {activityForm.type === "video" 
                      ? "หรือใส่ลิงก์ URL วิดีโอ (รองรับ YouTube, Vimeo หรือ Direct MP4 URL):" 
                      : "หรือใส่ลิงก์ URL รูปภาพโดยตรง:"}
                  </label>
                  <input 
                    type="url" 
                    className="form-control" 
                    placeholder={activityForm.type === "video" ? "https://www.youtube.com/watch?v=... หรือ https://...mp4" : "https://..."} 
                    value={activityForm.url} 
                    onChange={e => {
                      const val = e.target.value;
                      const isVid = isVideoMedia(val);
                      setActivityForm(prev => ({ 
                        ...prev, 
                        url: val,
                        type: isVid ? "video" : prev.type
                      }));
                    }} 
                  />
                </div>

                {/* 3. สำหรับวิดีโอ: สามารถใส่รูปภาพปก (Thumbnail) ได้ */}
                {activityForm.type === "video" && (
                  <div className="form-group" style={{ marginTop: "1rem", paddingTop: "0.85rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    <label style={{ fontSize: "0.85rem" }}>รูปภาพหน้าปกวิดีโอ (Thumbnail - ตัวเลือกเสริม)</label>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="activity-thumb-input" 
                        style={{ display: "none" }}
                        onChange={handleUploadActivityThumbnail} 
                      />
                      <input 
                        type="url" 
                        className="form-control" 
                        placeholder="https://... (URL รูปภาพปก)" 
                        value={activityForm.thumbnailUrl} 
                        onChange={e => setActivityForm(prev => ({ ...prev, thumbnailUrl: e.target.value }))} 
                        style={{ flex: 1 }}
                      />
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => document.getElementById("activity-thumb-input").click()}
                        title="อัปโหลดรูปภาพหน้าปก"
                      >
                        <DynamicIcon name="Image" size={16} /> อัปโหลดปก
                      </button>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem", display: "block" }}>
                      * หากเป็นคลิป YouTube ระบบจะดึงรูปภาพปกให้อัตโนมัติ
                    </span>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowActivityModal(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary">
                  <DynamicIcon name="Check" size={16} /> บันทึก Activities
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   APP SHELL WITH LOCAL ROUTING GUARANTEE
   ========================================================================== */
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [globalCustomCss, setGlobalCustomCss] = useState("");

  const isLocal = window.location.hostname === "localhost" || 
                  window.location.hostname === "127.0.0.1" || 
                  window.location.hostname.startsWith("192.168.");

  useEffect(() => {
    const loadCss = async () => {
      const css = await getCustomCss();
      setGlobalCustomCss(css);
    };
    loadCss();
  }, [location]);

  useEffect(() => {
    if (location.pathname === "/admin" && !isLocal) {
      navigate("/", { replace: true });
    }
  }, [location, isLocal, navigate]);

  return (
    <>
      {globalCustomCss && <style id="custom-user-css">{globalCustomCss}</style>}

      {isLocal && (
        <div className="local-dev-banner">
          <span>🛠️ โหมดนักพัฒนา (Local Development): เข้าสู่</span>
          <Link to="/admin" className="banner-admin-link">
            ⚙️ ระบบหลังบ้าน (Admin Portal)
          </Link>
          <span>เพื่อจัดการข้อมูลและรูปภาพ</span>
        </div>
      )}
      
      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route path="/admin" element={isLocal ? <AdminPage setGlobalCustomCss={setGlobalCustomCss} /> : <PublicPage />} />
        <Route path="*" element={<PublicPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
