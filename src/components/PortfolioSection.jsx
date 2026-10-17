import React, { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";
import { GithubIcon } from "./SocialIcons";
import { DEFAULT_TECH_STACK, DEFAULT_CERTIFICATES, DEFAULT_AWARDS } from "../dbService";
import ProjectDetailView from "./ProjectDetailView";

export default function PortfolioSection({ 
  items = [], 
  categories = [], 
  techStack = [], 
  certificates = [], 
  awards = [] 
}) {
  const [activeTab, setActiveTab] = useState("projects");
  const [selectedProject, setSelectedProject] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  // ปิด Lightbox เมื่อกดปุ่ม Escape บนคีย์บอร์ด
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setLightboxImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // แท็บ 4 หมวดหมู่ตามภาพแนบที่ 3: ไอคอนอยู่บน ข้อความอยู่ล่าง
  const tabs = [
    { id: "projects", label: "Projects", icon: "Code2" },
    { id: "certificates", label: "Certificates", icon: "Award" },
    { id: "awards", label: "Awards", icon: "Trophy" },
    { id: "techstack", label: "Tech Stack", icon: "Boxes" }
  ];

  // กรองข้อมูลโปรเจกต์
  const projectItems = items.filter(
    (item) => item.categoryId === "cat-projects" || item.category === "projects" || (!item.categoryId?.includes("cert") && !item.categoryId?.includes("award"))
  );

  const placeholderProjects = projectItems.length > 0 ? projectItems : [
    {
      id: "p-1",
      title: "[ ชื่อผลงานโปรเจกต์ที่ 1 ]",
      description: "[ คำอธิบายรายละเอียดโปรเจกต์ ปัญหาที่ระบบเข้ามาช่วยแก้ไข และเทคโนโลยีหลักที่ใช้ในการพัฒนา ]",
      tags: ["[ React ]", "[ Tailwind CSS ]", "[ Node.js ]"],
      demoUrl: "#",
      githubUrl: "#",
      imageUrl: "",
      detailImages: []
    },
    {
      id: "p-2",
      title: "[ ชื่อผลงานโปรเจกต์ที่ 2 ]",
      description: "[ คำอธิบายรายละเอียดโปรเจกต์ สรุปภาพรวมของสถาปัตยกรรมระบบ และผลลัพธ์การใช้งานจริง ]",
      tags: ["[ Next.js ]", "[ TypeScript ]", "[ PostgreSQL ]"],
      demoUrl: "#",
      githubUrl: "#",
      imageUrl: "",
      detailImages: []
    },
    {
      id: "p-3",
      title: "[ ชื่อผลงานโปรเจกต์ที่ 3 ]",
      description: "[ คำอธิบายรายละเอียดโปรเจกต์ สรุปภาพรวมของสถาปัตยกรรมระบบ และผลลัพธ์การใช้งานจริง ]",
      tags: ["[ Mobile App ]", "[ Flutter ]", "[ Firebase ]"],
      demoUrl: "#",
      githubUrl: "#",
      imageUrl: "",
      detailImages: []
    }
  ];

  const sanitizeImg = (url) => {
    if (!url) return "";
    if (url.includes("photo-1589330694653")) {
      return "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=900&q=80";
    }
    return url;
  };

  // รวมรายการ Certificates (ดึงจาก hero.certificates หรือ items ที่อัปโหลด)
  const uploadedCerts = items.filter(
    (item) => (item.categoryId === "cat-certificates" || item.category === "certificates") && item.imageUrl
  );
  const combinedCerts = [
    ...(Array.isArray(certificates) ? certificates : []),
    ...uploadedCerts
  ];
  const displayCertificates = (combinedCerts.length > 0 ? combinedCerts : DEFAULT_CERTIFICATES).map(c => ({
    ...c,
    imageUrl: sanitizeImg(c.imageUrl || c.src || c.url)
  }));

  // รวมรายการ Awards (ดึงจาก hero.awards หรือ items ที่อัปโหลด)
  const uploadedAwards = items.filter(
    (item) => (item.categoryId === "cat-awards" || item.category === "awards") && item.imageUrl
  );
  const combinedAwards = [
    ...(Array.isArray(awards) ? awards : []),
    ...uploadedAwards
  ];
  const displayAwards = (combinedAwards.length > 0 ? combinedAwards : DEFAULT_AWARDS).map(a => ({
    ...a,
    imageUrl: sanitizeImg(a.imageUrl || a.src || a.url)
  }));

  // Tech Stack Items (ดึงจาก Firestore/LocalStorage หรือใช้ค่าตั้งต้น)
  const displayTechStack = techStack && techStack.length > 0 ? techStack : DEFAULT_TECH_STACK;

  // เมื่อผู้ใช้เลือกดูรายละเอียดโปรเจกต์ (เปิดหน้า Detail ตามภาพแนบที่ 2)
  if (selectedProject) {
    return (
      <section id="portfolio" className="portfolio-section">
        <ProjectDetailView 
          project={selectedProject} 
          onBack={() => {
            setSelectedProject(null);
            setTimeout(() => {
              const el = document.getElementById("portfolio");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 50);
          }} 
        />
      </section>
    );
  }

  return (
    <section id="portfolio" className="portfolio-section">
      
      {/* Section Header */}
      <div className="section-header-block portfolio-header-block scroll-reveal">
        <h2 className="section-main-title portfolio-main-title">
          ผลงานและ<span className="headline-gradient">ความสำเร็จ</span>
        </h2>
      </div>

      {/* Filter Tabs Navigation (ภาพแนบที่ 3) */}
      <div className="portfolio-tabs-container scroll-reveal">
        <div className="portfolio-tabs-nav-modern">
          {tabs.map((tab) => {
            const IconComp = Icons[tab.icon] || Icons.Circle;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`portfolio-tab-pill-btn ${isActive ? "active" : ""}`}
                id={`portfolio-tab-${tab.id}`}
              >
                <div className="tab-pill-icon-wrap">
                  <IconComp size={20} />
                </div>
                <span className="tab-pill-label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Projects Showcase Grid (ลบ [ Tech Stack 1 ] , [ Tech Stack 2 ] ออกตามข้อ 2) */}
      {activeTab === "projects" && (
        <div className="tab-content-wrapper">
          <div className="projects-cards-grid">
            {placeholderProjects.map((proj, idx) => (
              <div 
                key={proj.id || idx} 
                className="project-card group"
              >
                {/* Thumbnail Image / Placeholder */}
                <div 
                  className="project-thumb-container"
                  onClick={() => setSelectedProject(proj)}
                  style={{ cursor: "pointer" }}
                >
                  <PlaceholderImage
                    src={proj.imageUrl}
                    aspect="16/9"
                    icon="Code2"
                    label="[ รูปภาพผลงานโปรเจกต์ ]"
                    hint="แนะนำอัตราส่วน 16:9"
                    className="project-thumb-img"
                  />
                  <div className="thumb-hover-overlay">
                    <button 
                      type="button" 
                      className="view-details-tag"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(proj);
                      }}
                    >
                      <Icons.Eye size={14} /> ดูรายละเอียด
                    </button>
                  </div>
                </div>

                {/* Project Card Body (ลบ [ Tech Stack 1 ], [ Tech Stack 2 ] ตามคำสั่งข้อ 2) */}
                <div className="project-card-body">
                  {/* Title & Description */}
                  <h3 
                    className="project-card-title clickable-title"
                    onClick={() => setSelectedProject(proj)}
                    style={{ cursor: "pointer" }}
                  >
                    {proj.title}
                  </h3>
                  <p className="project-card-desc">{proj.description}</p>

                  {/* Action Links */}
                  <div className="project-actions-row">
                    {proj.demoUrl && proj.demoUrl !== "#" ? (
                      <a
                        href={proj.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-action-link live-demo"
                      >
                        <Icons.ExternalLink size={14} />
                        <span>Live Demo</span>
                      </a>
                    ) : (
                      <span className="project-action-link live-demo disabled">
                        <Icons.ExternalLink size={14} />
                        <span>Live Demo</span>
                      </span>
                    )}

                    {proj.githubUrl && proj.githubUrl !== "#" ? (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-action-link github-code"
                      >
                        <GithubIcon size={14} />
                        <span>GitHub</span>
                      </a>
                    ) : (
                      <span className="project-action-link github-code disabled">
                        <GithubIcon size={14} />
                        <span>GitHub</span>
                      </span>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Certificates Showcase Grid (แสดงเฉพาะรูปภาพที่แนบไฟล์เข้าไป ตามภาพแนบที่ 4) */}
      {activeTab === "certificates" && (
        <div className="tab-content-wrapper">
          <div className="pure-media-cards-grid">
            {displayCertificates.map((cert, idx) => {
              const imgUrl = cert.imageUrl || cert.src || cert.url;
              if (!imgUrl) return null;
              return (
                <div 
                  key={cert.id || idx} 
                  className="pure-media-card group"
                  onClick={() => setLightboxImage(imgUrl)}
                  title="คลิกเพื่อดูภาพขยาย"
                >
                  <div className="pure-media-inner">
                    <img 
                      src={imgUrl} 
                      alt="Certificate" 
                      className="pure-media-img" 
                      loading="lazy" 
                    />
                    <div className="pure-media-hover-overlay">
                      <span className="media-zoom-btn">
                        <Icons.Maximize2 size={16} /> ดูภาพขยาย
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Awards Showcase Grid (แสดงเฉพาะรูปภาพที่แนบไฟล์เข้าไป ตามภาพแนบที่ 4) */}
      {activeTab === "awards" && (
        <div className="tab-content-wrapper">
          <div className="pure-media-cards-grid">
            {displayAwards.map((award, idx) => {
              const imgUrl = award.imageUrl || award.src || award.url;
              if (!imgUrl) return null;
              return (
                <div 
                  key={award.id || idx} 
                  className="pure-media-card group"
                  onClick={() => setLightboxImage(imgUrl)}
                  title="คลิกเพื่อดูภาพขยาย"
                >
                  <div className="pure-media-inner">
                    <img 
                      src={imgUrl} 
                      alt="Award" 
                      className="pure-media-img" 
                      loading="lazy" 
                    />
                    <div className="pure-media-hover-overlay">
                      <span className="media-zoom-btn">
                        <Icons.Maximize2 size={16} /> ดูภาพขยาย
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Tech Stack Showcase (การ์ดสไตล์ภาพแนบที่ 4) */}
      {activeTab === "techstack" && (
        <div className="tab-content-wrapper">
          <div className="tech-cards-grid">
            {displayTechStack.map((tech, idx) => {
              const TechIcon = Icons[tech.icon] || Icons.Cpu;
              return (
                <div key={tech.id || idx} className="tech-stack-card group">
                  <div className="tech-card-logo-wrap">
                    {tech.imageUrl ? (
                      <img 
                        src={tech.imageUrl} 
                        alt={tech.name} 
                        className="tech-card-logo-img" 
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = "none";
                          const fallback = e.target.parentElement.querySelector(".tech-card-fallback-wrap");
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div className="tech-card-fallback-wrap" style={{ display: tech.imageUrl ? "none" : "flex" }}>
                      <TechIcon size={42} className="tech-card-fallback-icon" />
                    </div>
                  </div>
                  <span className="tech-card-name">{tech.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox Modal: ดูภาพขยาย กด x บริเวณมุมขวา เพื่อกลับสู่ขนาดปกติ (ตามภาพแนบที่ 5) */}
      {lightboxImage && (
        <div 
          className="lightbox-backdrop" 
          onClick={() => setLightboxImage(null)}
          role="dialog"
          aria-modal="true"
        >
          {/* ปุ่มปิด X มุมขวาบน */}
          <button 
            type="button" 
            className="lightbox-close-btn" 
            onClick={(e) => {
              e.stopPropagation();
              setLightboxImage(null);
            }}
            title="ปิดภาพขยาย (หรือกด Esc)"
            id="lightbox-close-button"
          >
            <Icons.X size={26} />
          </button>

          {/* กล่องแสดงภาพขยายขนาดใหญ่ */}
          <div 
            className="lightbox-image-container"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={lightboxImage} 
              alt="Enlarged Certificate or Award" 
              className="lightbox-enlarged-img" 
            />
          </div>
        </div>
      )}

    </section>
  );
}
