import React, { useState, useEffect, useRef } from "react";
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { 
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
  getCustomCss,
  updateCustomCss
} from "./dbService";
import { isFirebaseConfigured } from "./firebase";
import * as Icons from "lucide-react";

// Helper สำหรับดึง Lucide Icon ตามชื่อสตริง
const DynamicIcon = ({ name, size = 24, className = "" }) => {
  const IconComponent = Icons[name] || Icons.HelpCircle;
  return <IconComponent size={size} className={className} />;
};

// Helper สำหรับตรวจสอบว่าไฟล์ที่อัปโหลดเป็น PDF หรือไม่
const isPdf = (url) => {
  if (!url) return false;
  return url.startsWith("data:application/pdf") || url.toLowerCase().endsWith(".pdf");
};

/* ==========================================================================
   PUBLIC PAGE COMPONENT
   ========================================================================== */
const PublicPage = () => {
  const [hero, setHero] = useState(null);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => {
    const loadAllData = async () => {
      const heroData = await getHeroData();
      const catData = await getCategories();
      const itemData = await getPortfolioItems();
      const contactData = await getContactData();
      
      setHero(heroData);
      setCategories(catData);
      setItems(itemData);
      setContacts(contactData);
    };
    loadAllData();
  }, []);

  // กรองเฉพาะรูปภาพสำหรับทำภาพวิ่งเลื่อน (ไม่รวมไฟล์ PDF เพราะแสดงผลเป็นรูปภาพไม่ได้)
  const allImages = items.map(item => item.imageUrl).filter(url => url && !isPdf(url));
  // เบิ้ลรูปภาพเพื่อให้รันสไลด์ได้ลื่นไหลแบบไม่รู้จบ
  const duplicatedImages = [...allImages, ...allImages, ...allImages, ...allImages];

  const handleCardClick = (item) => {
    if (isPdf(item.imageUrl)) {
      window.open(item.imageUrl, '_blank');
    }
  };

  if (!hero) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#00e5ff", background: "#0a0e17" }}>
        <div style={{ fontSize: "1.5rem", fontFamily: "sans-serif" }}>🚀 LOADING PORTFOLIO...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* 1. Header Navbar */}
      <nav className="navbar">
        <a href="#/" className="nav-logo">
          <span className="logo-glow">⚡</span> MY<span>FOLIO</span>
        </a>
        <div className="nav-links">
          <a 
            href="#home" 
            className={`nav-link ${activeNav === "home" ? "active" : ""}`}
            onClick={() => setActiveNav("home")}
          >
            แนะนำตัว
          </a>
          <a 
            href="#portfolio" 
            className={`nav-link ${activeNav === "portfolio" ? "active" : ""}`}
            onClick={() => setActiveNav("portfolio")}
          >
            ผลงาน & เกียรติบัตร
          </a>
          <a 
            href="#contact" 
            className={`nav-link ${activeNav === "contact" ? "active" : ""}`}
            onClick={() => setActiveNav("contact")}
          >
            ช่องทางการติดต่อ
          </a>
        </div>
      </nav>

      {/* 2. Hero Section (แนะนำตัว) */}
      <section id="home" style={{ marginTop: "3rem" }}>
        <div className="hero-wrapper">
          <div className="hero-img-container">
            <img src={hero.imageUrl} alt="Profile" className="hero-img" />
          </div>
          <div className="hero-content">
            <h1 className="hero-name">{hero.name}</h1>
            <p className="hero-subtitle">{hero.title}</p>
            <div className="hero-bio-quote">
              <p>{hero.bio}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Portfolio & Certificates Section */}
      <section id="portfolio">
        <h2 className="section-title">PORTFOLIO & CERTIFICATES</h2>
        
        {categories.map(cat => {
          const catItems = items.filter(item => item.categoryId === cat.id);
          return (
            <div key={cat.id} className="category-block">
              <h3 className="category-title">
                <span>{cat.name}</span>
              </h3>
              
              <div className="portfolio-grid">
                {catItems.length > 0 ? (
                  catItems.map(item => {
                    const isItemPdf = isPdf(item.imageUrl);
                    return (
                      <div 
                        key={item.id} 
                        className={`portfolio-card ${isItemPdf ? "pdf-card" : ""}`}
                        onClick={() => handleCardClick(item)}
                        style={{ cursor: isItemPdf ? "pointer" : "default" }}
                      >
                        <div className="card-img-wrapper">
                          {item.imageUrl ? (
                            isItemPdf ? (
                              <div className="pdf-thumbnail-fallback">
                                <DynamicIcon name="FileText" size={48} className="pdf-thumbnail-icon" />
                                <span className="pdf-badge">PDF DOCUMENT</span>
                                <span className="pdf-click-tip">คลิกเพื่อเปิดดูเอกสาร</span>
                              </div>
                            ) : (
                              <img src={item.imageUrl} alt={item.title} className="card-img" />
                            )
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1b2336", color: "#64748b" }}>
                              ไม่มีรูปภาพผลงาน
                            </div>
                          )}
                        </div>
                        <div className="card-body">
                          <h4 className="card-title">{item.title}</h4>
                          <p className="card-desc">{item.description}</p>
                          {isItemPdf && (
                            <span className="pdf-link-btn">
                              <DynamicIcon name="ExternalLink" size={14} /> เปิดไฟล์ PDF
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-state">ยังไม่มีข้อมูลผลงานในหมวดหมู่นี้</div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* 4. Infinite Scrolling Carousel (ภาพผลงานเลื่อนซ้าย) */}
      {allImages.length > 0 && (
        <div className="carousel-section">
          <h3 className="carousel-title">🏆 GALLERY & CERTIFICATE ARCHIVE</h3>
          <div className="carousel-container">
            <div className="carousel-track">
              {duplicatedImages.map((imgUrl, index) => (
                <div key={index} className="carousel-img-card">
                  <img src={imgUrl} alt={`Certificate ${index}`} className="carousel-img" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Contact Section (Footer) */}
      <footer id="contact" className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-logo">
              <span style={{ color: "var(--color-cyan)" }}>⚡</span> MYFOLIO
            </h3>
            <p className="footer-desc">
              ระบบสะสมผลงานและเกียรติติดบัตรดิจิทัล ข้อมูลอัปเดตแบบเรียลไทม์ผ่าน Firebase
            </p>
          </div>
          
          <div className="contact-grid">
            {contacts.map(c => (
              <div key={c.id} className="contact-card">
                <div 
                  className="contact-logo-wrapper" 
                  style={{ borderColor: c.color }}
                >
                  <DynamicIcon name={c.icon} size={24} />
                </div>
                <div className="contact-details">
                  <span className="contact-label">{c.label}</span>
                  <span className="contact-val">{c.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {hero.name.split(" (")[0]}. All Rights Reserved. Powered by Firebase.</p>
        </div>
      </footer>
    </div>
  );
};

/* ==========================================================================
   ADMIN PAGE COMPONENT (LOCAL-ONLY)
   ========================================================================== */
const AdminPage = ({ setGlobalCustomCss }) => {
  const [activeTab, setActiveTab] = useState("hero");
  const [toastMsg, setToastMsg] = useState("");
  
  // Data States
  const [hero, setHero] = useState({ name: "", title: "", bio: "", imageUrl: "" });
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [cssCode, setCssCode] = useState("");
  
  // Modals / Editing States
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null = add, {...} = edit
  const [itemForm, setItemForm] = useState({ title: "", description: "", categoryId: "", imageUrl: "", file: null });
  
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
  };

  // 1. Save Hero
  const handleSaveHero = async (e) => {
    e.preventDefault();
    try {
      await updateHeroData(hero);
      triggerToast("💾 บันทึกข้อมูลแนะนำตัวเรียบร้อยแล้ว!");
    } catch (e) {
      console.error(e);
      triggerToast("❌ เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  const handleHeroImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      triggerToast("⏳ กำลังอัปโหลดรูปภาพโปรไฟล์...");
      try {
        const url = await uploadImage(file);
        setHero(prev => ({ ...prev, imageUrl: url }));
        triggerToast("✅ อัปโหลดรูปภาพโปรไฟล์เสร็จสิ้น!");
      } catch (e) {
        console.error(e);
        triggerToast("❌ อัปโหลดรูปภาพไม่สำเร็จ");
      }
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
    if (window.confirm("🚨 คุณแน่ใจใช่ไหมที่จะลบหมวดหมู่นี้? (ผลงานทั้งหมดในหมวดหมู่นี้จะไม่แสดงผลในหน้านั้น)")) {
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
        title: item.title,
        description: item.description,
        categoryId: item.categoryId,
        imageUrl: item.imageUrl,
        file: null
      });
    } else {
      setEditingItem(null);
      setItemForm({
        title: "",
        description: "",
        categoryId: categories[0]?.id || "",
        imageUrl: "",
        file: null
      });
    }
    setShowItemModal(true);
  };

  const handleItemFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setItemForm(prev => ({ ...prev, file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setItemForm(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    triggerToast("⏳ กำลังบันทึกข้อมูลผลงาน...");
    
    try {
      let finalImageUrl = itemForm.imageUrl;
      if (itemForm.file) {
        finalImageUrl = await uploadImage(itemForm.file);
      }
      
      const payload = {
        title: itemForm.title,
        description: itemForm.description,
        categoryId: itemForm.categoryId,
        imageUrl: finalImageUrl
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
    }
  };

  // 5. Save Custom CSS Customizer
  const handleSaveCss = async (e) => {
    e.preventDefault();
    try {
      await updateCustomCss(cssCode);
      setGlobalCustomCss(cssCode); // อัปเดตให้มีผลทันทีโดยไม่ต้องรีเฟรชหน้าเว็บ!
      triggerToast("💾 บันทึกและเปิดใช้ Custom CSS สำเร็จ!");
    } catch (e) {
      console.error(e);
      triggerToast("❌ ไม่สามารถบันทึก CSS ได้");
    }
  };

  return (
    <div className="admin-container">
      {/* Toast Notification */}
      {toastMsg && <div className="toast"><DynamicIcon name="Info" size={20} /> {toastMsg}</div>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid rgba(0,229,255,0.15)", paddingBottom: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-en)", fontWeight: 800, fontSize: "2.2rem" }}>
            <span style={{ color: "var(--color-cyan)" }}>⚙️</span> CONTROL CENTER
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            โหมดจัดการข้อมูลแบบ Local | สถานะการเชื่อมต่อ Firebase: {" "}
            {isFirebaseConfigured ? (
              <span style={{ color: "#10b981", fontWeight: "bold" }}>🔥 เชื่อมต่อแล้ว (ใช้งานจริง)</span>
            ) : (
              <span style={{ color: "#f59e0b", fontWeight: "bold" }}>⚠️ จำลองระบบ (LocalStorage Fallback)</span>
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
            <DynamicIcon name="User" size={18} /> ข้อมูลแนะนำตัว
          </button>
          <button className={`admin-menu-item ${activeTab === "categories" ? "active" : ""}`} onClick={() => setActiveTab("categories")}>
            <DynamicIcon name="FolderOpen" size={18} /> จัดการหมวดหมู่
          </button>
          <button className={`admin-menu-item ${activeTab === "items" ? "active" : ""}`} onClick={() => setActiveTab("items")}>
            <DynamicIcon name="Award" size={18} /> จัดการผลงาน/เกียรติบัตร
          </button>
          <button className={`admin-menu-item ${activeTab === "contacts" ? "active" : ""}`} onClick={() => setActiveTab("contacts")}>
            <DynamicIcon name="Share2" size={18} /> ช่องทางการติดต่อ
          </button>
          <button className={`admin-menu-item ${activeTab === "css" ? "active" : ""}`} onClick={() => setActiveTab("css")}>
            <DynamicIcon name="Palette" size={18} /> ปรับแต่ง CSS ตกแต่งเว็บ
          </button>
          <button className={`admin-menu-item ${activeTab === "firebase" ? "active" : ""}`} onClick={() => setActiveTab("firebase")}>
            <DynamicIcon name="Database" size={18} /> เชื่อมต่อ Firebase
          </button>
        </div>

        {/* Content Area */}
        <div className="admin-content">
          {/* TAB 1: HERO */}
          {activeTab === "hero" && (
            <div>
              <div className="admin-section-header">
                <h2>แก้ไขข้อมูลแนะนำตัว</h2>
              </div>
              <form onSubmit={handleSaveHero}>
                <div className="form-group">
                  <label>รูปภาพโปรไฟล์</label>
                  <div className="image-upload-wrapper">
                    <div className="image-preview-box">
                      <img src={hero.imageUrl || "https://via.placeholder.com/150"} alt="Preview" />
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
                        <DynamicIcon name="UploadCloud" size={16} /> อัปโหลดรูปภาพใหม่
                      </button>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                        แนะนำรูปภาพอัตราส่วน 1:1 ขนาดไม่เกิน 2MB
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>ชื่อ - นามสกุล (แนะนำภาษาไทยพ่วงอังกฤษ)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={hero.name} 
                    onChange={e => setHero(prev => ({ ...prev, name: e.target.value }))} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>ตำแหน่ง / คำแนะนำสั้น ๆ (Subtitle)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={hero.title} 
                    onChange={e => setHero(prev => ({ ...prev, title: e.target.value }))} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>ประวัติย่อ / รายละเอียดเพิ่มเติม (Bio)</label>
                  <textarea 
                    className="form-control" 
                    value={hero.bio} 
                    onChange={e => setHero(prev => ({ ...prev, bio: e.target.value }))} 
                    required 
                  />
                </div>
                
                <button type="submit" className="btn btn-primary">
                  <DynamicIcon name="Save" size={16} /> บันทึกการเปลี่ยนแปลง
                </button>
              </form>
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
                  placeholder="ชื่อหมวดหมู่ใหม่ เช่น 🏆 วิชาการ..." 
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
                  <DynamicIcon name="Plus" size={16} /> เพิ่มหมวดหมู่
                </button>
              </form>

              <div className="admin-list">
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <div key={cat.id} className="admin-list-item">
                      {editingCatId === cat.id ? (
                        <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={editingCatName}
                            onChange={e => setEditingCatName(e.target.value)}
                            required
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
                          <span style={{ fontSize: "1.1rem", fontWeight: 500 }}>{cat.name}</span>
                          <div className="admin-item-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => handleStartEditCat(cat)}>
                              <DynamicIcon name="Edit" size={14} /> แก้ไขชื่อ
                            </button>
                            <button type="button" className="btn btn-danger" onClick={() => handleDeleteCategory(cat.id)}>
                              <DynamicIcon name="Trash2" size={14} /> ลบ
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="empty-state">ยังไม่มีข้อมูลหมวดหมู่</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PORTFOLIO ITEMS */}
          {activeTab === "items" && (
            <div>
              <div className="admin-section-header">
                <h2>จัดการผลงาน & เกียรติบัตร</h2>
                <button type="button" className="btn btn-primary" onClick={() => handleOpenItemModal()}>
                  <DynamicIcon name="Plus" size={16} /> เพิ่มเกียรติบัตรใหม่
                </button>
              </div>

              <div className="admin-list">
                {items.length > 0 ? (
                  items.map(item => {
                    const cat = categories.find(c => c.id === item.categoryId);
                    const isItemPdf = isPdf(item.imageUrl);
                    return (
                      <div key={item.id} className="admin-list-item">
                        <div className="admin-item-info">
                          {isItemPdf ? (
                            <div className="admin-item-thumb-pdf">
                              <DynamicIcon name="FileText" size={24} />
                            </div>
                          ) : (
                            <img src={item.imageUrl || "https://via.placeholder.com/50"} alt="" className="admin-item-thumb" />
                          )}
                          <div className="admin-item-meta">
                            <h4>{item.title}</h4>
                            <p>หมวดหมู่: <span style={{ color: "var(--color-cyan)" }}>{cat ? cat.name : "ไม่ระบุหมวดหมู่"}</span></p>
                          </div>
                        </div>
                        <div className="admin-item-actions">
                          <button type="button" className="btn btn-secondary" onClick={() => handleOpenItemModal(item)}>
                            <DynamicIcon name="Edit" size={14} /> แก้ไข
                          </button>
                          <button type="button" className="btn btn-danger" onClick={() => handleDeleteItem(item.id)}>
                            <DynamicIcon name="Trash2" size={14} /> ลบ
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-state">ยังไม่มีข้อมูลผลงาน กรุณาเพิ่มผลงานโดยการคลิกปุ่มด้านบน</div>
                )}
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
                {contacts.map((c, index) => (
                  <div key={c.id} className="form-group" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <div className="contact-logo-wrapper" style={{ borderColor: c.color || "rgba(0,229,255,0.2)" }}>
                      <DynamicIcon name={c.icon} size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>{c.label} (ใช้ไอคอน: {c.icon})</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={c.value} 
                        onChange={e => handleContactChange(index, e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                ))}
                
                <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem" }}>
                  <DynamicIcon name="Save" size={16} /> บันทึกช่องทางการติดต่อ
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: CUSTOM CSS CUSTOMIZER */}
          {activeTab === "css" && (
            <div>
              <div className="admin-section-header">
                <h2>ปรับแต่ง CSS ตกแต่งเว็บไซต์</h2>
              </div>
              <form onSubmit={handleSaveCss}>
                <div className="form-group">
                  <label>โค้ด CSS ของคุณ (จะแสดงผลทับดีไซน์เริ่มต้นทันที)</label>
                  <textarea 
                    className="form-control" 
                    style={{ fontFamily: "monospace", minHeight: "250px", fontSize: "0.88rem" }}
                    placeholder={`/* ตัวอย่างการปรับแต่ง */\nbody {\n  background-color: #05070a; /* เปลี่ยนสีพื้นหลังเว็บ */\n}\n\n.hero-name {\n  font-size: 3rem; /* ขยายขนาดชื่อตัวหนังสือแนะนำตัว */\n}`}
                    value={cssCode} 
                    onChange={e => setCssCode(e.target.value)} 
                  />
                </div>
                
                <div style={{ background: "var(--bg-tertiary)", padding: "1.25rem", borderRadius: "12px", border: "1px solid var(--border-color)", marginBottom: "1.5rem", fontSize: "0.85rem", lineHeight: "1.7" }}>
                  <h4 style={{ color: "var(--color-cyan)", marginBottom: "0.5rem" }}>💡 ไกด์ไลน์คลาสสำคัญเพื่อการตกแต่งเว็บด้วยตนเอง:</h4>
                  <ul style={{ paddingLeft: "1.25rem", color: "var(--text-secondary)" }}>
                    <li><code>.navbar</code> : แถบเมนูด้านบนสุด</li>
                    <li><code>.nav-logo</code> : โลโก้แบรนด์ MYFOLIO</li>
                    <li><code>.nav-link</code> : ลิงก์ปุ่มเมนูบนแถบนำทาง</li>
                    <li><code>.hero-name</code> : ชื่อ-นามสกุลในส่วนแนะนำตัว</li>
                    <li><code>.hero-subtitle</code> : ตำแหน่ง/Subtitle แนะนำตัว</li>
                    <li><code>.hero-bio-quote</code> : กล่องคำพูดรายละเอียด Bio ประวัติตนเอง</li>
                    <li><code>.portfolio-card</code> : กล่องการ์ดเกียรติติดบัตร (รวมกรอบและพื้นหลังการ์ด)</li>
                    <li><code>.card-title</code> : ชื่อรางวัลบนการ์ดเกียรติบัตร</li>
                    <li><code>.footer</code> : แถบข้อมูลติดต่อด้านล่างสุดของเว็บ</li>
                  </ul>
                </div>

                <button type="submit" className="btn btn-primary">
                  <DynamicIcon name="Save" size={16} /> บันทึกและใช้งาน CSS
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: FIREBASE SETUP INFO */}
          {activeTab === "firebase" && (
            <div style={{ lineHeight: "1.8" }}>
              <div className="admin-section-header">
                <h2>🔥 วิธีการเชื่อมต่อฐานข้อมูล Firebase</h2>
              </div>
              <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                ฐานข้อมูลปัจจุบันกำลังทำงานในเครื่องคอมพิวเตอร์ของคุณเท่านั้น หากต้องการอัปโหลดขึ้นอินเทอร์เน็ตจริง และใช้ข้อมูลที่แก้ไขนี้แบบออนไลน์ ให้ปฏิบัติตามขั้นตอนต่อไปนี้ (ฟรี 100%):
              </p>
              <ol style={{ paddingLeft: "1.25rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <li>
                  <strong>สมัครและสร้างโปรเจกต์ Firebase:</strong>
                  <br />ไปที่ <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" style={{ color: "var(--color-cyan)" }}>Firebase Console</a> จากนั้นล็อกอินด้วย Google Account และกด <strong>"Add Project"</strong> เพื่อสร้างโปรเจกต์ใหม่ (เช่น `my-folio-web`)
                </li>
                <li>
                  <strong>สร้าง Firestore Database (ฐานข้อมูลเก็บข้อความ):</strong>
                  <br />คลิกเมนู <strong>"Firestore Database"</strong> ที่แถบซ้ายมือ กด <strong>"Create Database"</strong> เลือกโซนใกล้ประเทศไทย (เช่น `asia-southeast1` หรือ `asia-northeast1`) และเลือกโหมด <strong>"Start in Test Mode"</strong> (หลังจากเปิดใช้งาน สามารถตั้งกฎ Firestore Rules ตามคำแนะนำด้านล่างเพื่อให้ปลอดภัยยิ่งขึ้น)
                </li>
                <li>
                  <strong>เพิ่ม Web App เพื่อเอาคีย์เชื่อมต่อ:</strong>
                  <br />กลับมาที่หน้า Project Overview คลิกที่ไอคอน Web <code>&lt;/&gt;</code> ตั้งชื่อเว็บ และทำตามขั้นตอน ระบบจะแสดงค่าติดตั้ง <code>firebaseConfig</code> โค้ดจะมีหน้าตาแบบนี้:
                  <pre style={{ background: "var(--bg-tertiary)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--border-color)", margin: "0.5rem 0", color: "#fff", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem" }}>
{`const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};`}
                  </pre>
                </li>
                <li>
                  <strong>นำคีย์มาใส่ในโปรเจกต์นี้:</strong>
                  <br />เปิดไฟล์โปรเจกต์ <code>src/firebase.js</code> ในโปรแกรมเขียนโค้ดของคุณ แล้วนำค่า <code>firebaseConfig</code> ที่ได้จากหน้าเว็บ Firebase มาวางทับส่วนเก่าในไฟล์ จากนั้นระบบจะเชื่อมต่อเข้ากับฐานข้อมูล Firebase ในระบบคลาวด์โดยอัตโนมัติ!
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* PORTFOLIO ITEM ADD/EDIT MODAL */}
      {showItemModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingItem ? "✏️ แก้ไขข้อมูลผลงาน" : "➕ เพิ่มผลงาน/เกียรติบัตรชิ้นใหม่"}</h3>
              <button 
                className="btn btn-secondary" 
                style={{ padding: "0.25rem 0.5rem", borderRadius: "50%" }}
                onClick={() => setShowItemModal(false)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSaveItem}>
              <div className="modal-body">
                <div className="form-group">
                  <label>เลือกหมวดหมู่</label>
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
                  <label>ไฟล์ผลงาน / เกียรติบัตร (รองรับทั้งรูปภาพและไฟล์ PDF)</label>
                  <div className="image-upload-wrapper">
                    <div className="image-preview-box" style={{ width: "120px", height: "90px" }}>
                      {itemForm.imageUrl ? (
                        isPdf(itemForm.imageUrl) ? (
                          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f87171", color: "#fff", fontSize: "0.7rem", fontWeight: "bold", gap: "0.25rem" }}>
                            <DynamicIcon name="FileText" size={24} />
                            <span>เอกสาร PDF</span>
                          </div>
                        ) : (
                          <img src={itemForm.imageUrl} alt="Preview" />
                        )
                      ) : (
                        <img src="https://via.placeholder.com/120x90" alt="Preview" />
                      )}
                    </div>
                    <div>
                      <input 
                        type="file" 
                        accept="image/*,application/pdf" 
                        id="item-file-input" 
                        style={{ display: "none" }} 
                        onChange={handleItemFileChange} 
                      />
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => document.getElementById("item-file-input").click()}
                      >
                        <DynamicIcon name="UploadCloud" size={16} /> เลือกรูปภาพหรือไฟล์ PDF
                      </button>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                        รองรับ JPEG, PNG (บีบอัดอัตโนมัติ) และไฟล์เอกสาร PDF
                      </p>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>หัวข้อใหญ่ (ชื่อรางวัล / เกียรติบัตร)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={itemForm.title} 
                    onChange={e => setItemForm(prev => ({ ...prev, title: e.target.value }))} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>รายละเอียดรางวัล</label>
                  <textarea 
                    className="form-control" 
                    value={itemForm.description} 
                    onChange={e => setItemForm(prev => ({ ...prev, description: e.target.value }))} 
                    required 
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
    </div>
  );
};

/* ==========================================================================
   APP SHELL WITH LOCAL-ONLY ROUTING GUARANTEE
   ========================================================================== */
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [globalCustomCss, setGlobalCustomCss] = useState("");

  // ตรวจสอบว่าแอปพลิเคชันกำลังทำงานในเครื่อง Local ของเจ้าของเว็บจริงหรือไม่
  const isLocal = window.location.hostname === "localhost" || 
                  window.location.hostname === "127.0.0.1" || 
                  window.location.hostname.startsWith("192.168.");

  // โหลดโค้ด CSS สำหรับฉีดลงเว็บไซต์แบบเรียลไทม์
  useEffect(() => {
    const loadCss = async () => {
      const css = await getCustomCss();
      setGlobalCustomCss(css);
    };
    loadCss();
  }, [location]);

  // หากเป็นเวอร์ชันออนไลน์ที่คนนอกเปิดอ่าน และพยายามพิมพ์ url ไปที่ admin
  // จะถูกเปลี่ยนเส้นทางกลับสู่หน้าหลักทันทีเพื่อความปลอดภัยสูงสุด
  useEffect(() => {
    if (location.pathname === "/admin" && !isLocal) {
      navigate("/", { replace: true });
    }
  }, [location, isLocal, navigate]);

  return (
    <>
      {/* แทรกโค้ด CSS จากระบบปรับแต่งด้วยสไตล์ไดนามิก */}
      {globalCustomCss && <style id="custom-user-css">{globalCustomCss}</style>}

      {/* แจ้งเตือนสถานะการรัน Local Admin สำหรับเจ้าของโปรเจกต์ */}
      {isLocal && (
        <div className="local-banner">
          🛠️ คุณอยู่ในโหมดนักพัฒนาเครื่องเครื่อง Local: สามารถแก้ไขข้อมูลผ่าน{" "}
          <Link to="/admin" style={{ color: "#00e5ff", fontWeight: "bold", textDecoration: "underline" }}>
            ระบบหลังบ้าน (Admin Page)
          </Link>{" "}
          ได้ทันที
        </div>
      )}
      
      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route path="/admin" element={isLocal ? <AdminPage setGlobalCustomCss={setGlobalCustomCss} /> : <PublicPage />} />
        {/* Fallback routing */}
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
