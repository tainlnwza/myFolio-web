import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import * as Icons from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";
import { GithubIcon } from "./SocialIcons";
import { 
  DEFAULT_TECH_STACK, 
  DEFAULT_CERTS_AND_AWARDS,
  DEFAULT_ACTIVITIES,
  DEFAULT_CERTIFICATES, 
  DEFAULT_AWARDS,
  getYouTubeId,
  getVimeoId,
  isVideoMedia
} from "../dbService";
import ProjectDetailView from "./ProjectDetailView";

export default function PortfolioSection({ 
  items = [], 
  categories = [], 
  techStack = [], 
  certsAndAwards = [],
  activities = [],
  certificates = [], 
  awards = [],
  onSelectProject
}) {
  const [activeTab, setActiveTab] = useState("projects");
  const [selectedProject, setSelectedProject] = useState(null);
  const [lightboxMedia, setLightboxMedia] = useState(null);

  // ปิด Lightbox เมื่อกดปุ่ม Escape บนคีย์บอร์ด
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setLightboxMedia(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ล็อค Scroll ของหน้าจอเมื่อเปิด Lightbox ขยายสื่อ
  useEffect(() => {
    if (lightboxMedia) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxMedia]);

  // 4 หมวดหมู่: Projects, Certificates & Awards (เฉพาะภาพ), Activities (ภาพและคลิป), Tech Stack
  const tabs = [
    { id: "projects", label: "Projects", icon: "Code2" },
    { id: "certs-awards", label: "Certificates & Awards", icon: "Award" },
    { id: "activities", label: "Activities", icon: "Sparkles" },
    { id: "techstack", label: "Tech Stack", icon: "Boxes" }
  ];

  // เปิดดูรายละเอียดโปรเจกต์ (แจ้งเตือนไปยัง Parent ให้เปิดหน้าแยก)
  const handleOpenProject = (proj) => {
    if (onSelectProject) {
      onSelectProject(proj);
    } else {
      setSelectedProject(proj);
    }
  };

  // กรองข้อมูลโปรเจกต์
  const projectItems = items.filter(
    (item) => item.categoryId === "cat-projects" || item.category === "projects" || (!item.categoryId?.includes("cert") && !item.categoryId?.includes("award") && !item.categoryId?.includes("act"))
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

  // 1. รวมรายการ Certificates & Awards เข้าด้วยกัน (เพิ่มได้เฉพาะรูปภาพเกียรติบัตร/รางวัล)
  const uploadedCertsAwards = items.filter(
    (item) => (item.categoryId === "cat-certs-awards" || item.categoryId === "cat-certificates" || item.categoryId === "cat-awards" || item.category === "certificates" || item.category === "awards") && (item.imageUrl || item.url)
  );
  const heroCertsAwards = Array.isArray(certsAndAwards) && certsAndAwards.length > 0
    ? certsAndAwards
    : (
        ((Array.isArray(certificates) && certificates.length > 0) || (Array.isArray(awards) && awards.length > 0))
          ? [
              ...(Array.isArray(certificates) ? certificates : []),
              ...(Array.isArray(awards) ? awards : [])
            ]
          : DEFAULT_CERTS_AND_AWARDS
      );
  const combinedCertsAwards = [
    ...(heroCertsAwards.length > 0 ? heroCertsAwards : DEFAULT_CERTS_AND_AWARDS),
    ...uploadedCertsAwards
  ];
  const displayCertsAwards = combinedCertsAwards.map(c => ({
    ...c,
    imageUrl: sanitizeImg(c.imageUrl || c.src || c.url)
  })).filter(c => Boolean(c.imageUrl));

  // 2. รายการ Activities (ผลงานยามว่าง เพิ่มได้ทั้งภาพและคลิปวิดีโอ)
  const uploadedActivities = items.filter(
    (item) => (item.categoryId === "cat-activities" || item.category === "activities") && (item.imageUrl || item.url || item.videoUrl)
  ).map(item => ({
    id: item.id,
    type: item.type || (isVideoMedia(item.videoUrl || item.imageUrl || item.url) ? "video" : "image"),
    url: item.videoUrl || item.imageUrl || item.url,
    thumbnailUrl: item.thumbnailUrl
  }));

  const heroActivities = Array.isArray(activities) && activities.length > 0
    ? activities
    : DEFAULT_ACTIVITIES;

  const combinedActivities = [
    ...heroActivities,
    ...uploadedActivities
  ];

  const displayActivities = (combinedActivities.length > 0 ? combinedActivities : DEFAULT_ACTIVITIES).map(act => {
    const rawUrl = act.url || act.imageUrl || act.src || "";
    const isVid = act.type === "video" || isVideoMedia(act);
    return {
      ...act,
      type: isVid ? "video" : "image",
      url: sanitizeImg(rawUrl),
      thumbnailUrl: act.thumbnailUrl ? sanitizeImg(act.thumbnailUrl) : ""
    };
  }).filter(act => Boolean(act.url));

  // Tech Stack Items (ดึงจาก Firestore/LocalStorage หรือใช้ค่าตั้งต้น)
  const displayTechStack = techStack && techStack.length > 0 ? techStack : DEFAULT_TECH_STACK;

  // Fallback เมื่อไม่ได้ส่ง onSelectProject มาจาก Parent
  if (selectedProject) {
    return (
      <section id="portfolio" className="portfolio-section">
        <ProjectDetailView 
          project={selectedProject} 
          onBack={() => {
            setSelectedProject(null);
            setTimeout(() => {
              const el = document.getElementById("portfolio");
              if (el) {
                const yOffset = -90;
                const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
              }
            }, 50);
          }} 
        />
      </section>
    );
  }

  return (
    <section id="portfolio" className="portfolio-section">
      
      {/* Section Header */}
      <div className="section-header-block portfolio-header-block">
        <h2 className="section-main-title portfolio-main-title">
          ผลงานและ<span className="headline-gradient">ความสำเร็จ</span>
        </h2>
      </div>

      {/* Filter Tabs Navigation (แถบ 4 ช่องเท่ากัน กระจายเต็มความกว้างตามภาพแนบที่ 2) */}
      <div className="portfolio-tabs-container">
        <div className="portfolio-tabs-nav-modern">
          {tabs.map((tab) => {
            const IconComp = Icons[tab.icon] || Icons.Circle;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`portfolio-tab-btn-modern ${isActive ? "active" : ""}`}
                id={`portfolio-tab-${tab.id}`}
              >
                <div className="tab-modern-icon">
                  <IconComp size={20} />
                </div>
                <span className="tab-modern-label">{tab.label}</span>
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
                  onClick={() => handleOpenProject(proj)}
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
                        handleOpenProject(proj);
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
                    onClick={() => handleOpenProject(proj)}
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

      {/* Tab 2: Certificates & Awards Showcase Grid (รวม Certificates & Awards เข้าด้วยกัน แสดงเฉพาะรูปภาพเกียรติบัตร) */}
      {activeTab === "certs-awards" && (
        <div className="tab-content-wrapper">
          <div className="pure-media-cards-grid">
            {displayCertsAwards.map((item, idx) => {
              const imgUrl = item.imageUrl || item.src || item.url;
              if (!imgUrl) return null;
              return (
                <div 
                  key={item.id || idx} 
                  className="pure-media-card group"
                  onClick={() => setLightboxMedia({ type: "image", url: imgUrl })}
                  title="คลิกเพื่อดูภาพขยาย"
                >
                  <div className="pure-media-inner">
                    <img 
                      src={imgUrl} 
                      alt="Certificate or Award" 
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

      {/* Tab 3: Activities Showcase Grid (เพิ่มได้ทั้งภาพและคลิปวิดีโอ แสดงเฉพาะสื่อและขยายเพื่อดูได้) */}
      {activeTab === "activities" && (
        <div className="tab-content-wrapper">
          <div className="pure-media-cards-grid">
            {displayActivities.map((act, idx) => {
              const isVid = act.type === "video" || isVideoMedia(act);
              const mediaUrl = act.url || act.imageUrl || act.src;
              if (!mediaUrl) return null;

              const ytId = isVid ? getYouTubeId(mediaUrl) : null;
              const vimeoId = isVid ? getVimeoId(mediaUrl) : null;
              const thumbnail = act.thumbnailUrl || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null);

              return (
                <div 
                  key={act.id || idx} 
                  className="pure-media-card group"
                  onClick={() => setLightboxMedia({ type: isVid ? "video" : "image", url: mediaUrl, thumbnailUrl: thumbnail })}
                  title={isVid ? "คลิกขยายเพื่อดูวิดีโอ" : "คลิกเพื่อดูภาพขยาย"}
                >
                  <div className="pure-media-inner">
                    {isVid ? (
                      <>
                        {thumbnail ? (
                          <img 
                            src={thumbnail} 
                            alt="Activity Video Thumbnail" 
                            className="pure-media-img" 
                            loading="lazy" 
                          />
                        ) : (
                          <video 
                            src={mediaUrl} 
                            preload="metadata" 
                            muted 
                            playsInline 
                            className="pure-media-video-preview" 
                          />
                        )}
                        {/* ป้ายแสดงประเภท Video */}
                        <div className="media-video-badge">
                          <Icons.Play size={11} fill="currentColor" />
                          <span>Video</span>
                        </div>
                        {/* ปุ่ม Play แสดงตรงกลางเพื่อให้รู้ว่าเป็นคลิป/อนิเมชัน และต้องกดขยายเพื่อดูเท่านั้น */}
                        <div className="media-play-icon-circle">
                          <Icons.Play size={22} fill="currentColor" style={{ marginLeft: "2px" }} />
                        </div>
                      </>
                    ) : (
                      <img 
                        src={mediaUrl} 
                        alt="Activity Media" 
                        className="pure-media-img" 
                        loading="lazy" 
                      />
                    )}

                    {/* Hover Overlay แนะนำการกดขยาย */}
                    <div className="pure-media-hover-overlay">
                      <span className="media-zoom-btn">
                        {isVid ? <Icons.Play size={16} fill="currentColor" /> : <Icons.Maximize2 size={16} />}
                        {isVid ? "ขยายเพื่อดูวิดีโอ" : "ดูภาพขยาย"}
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

      {/* Lightbox Modal: อยู่ Layer หน้าสุด (Portal to document.body) ขยายดูภาพและเล่นวิดีโอ มีปุ่ม X ปิดเท่านั้น */}
      {lightboxMedia && typeof document !== "undefined" && createPortal(
        <div 
          className="lightbox-backdrop" 
          onClick={() => setLightboxMedia(null)}
          role="dialog"
          aria-modal="true"
        >
          {/* ปุ่มปิด X มุมขวาบน */}
          <button 
            type="button" 
            className="lightbox-close-btn" 
            onClick={(e) => {
              e.stopPropagation();
              setLightboxMedia(null);
            }}
            title="ปิด (Esc)"
            id="lightbox-close-button"
            aria-label="Close"
          >
            <Icons.X size={32} />
          </button>

          {/* กล่องแสดงภาพหรือวิดีโอขยายขนาดใหญ่ */}
          <div 
            className="lightbox-image-container"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxMedia.type === "video" ? (
              (() => {
                const ytId = getYouTubeId(lightboxMedia.url);
                const vimeoId = getVimeoId(lightboxMedia.url);
                if (ytId) {
                  return (
                    <div className="lightbox-iframe-wrapper">
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                        title="Video Player"
                        className="lightbox-iframe"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  );
                }
                if (vimeoId) {
                  return (
                    <div className="lightbox-iframe-wrapper">
                      <iframe
                        src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
                        title="Video Player"
                        className="lightbox-iframe"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  );
                }
                return (
                  <video 
                    src={lightboxMedia.url} 
                    controls 
                    autoPlay 
                    playsInline 
                    className="lightbox-enlarged-video"
                  />
                );
              })()
            ) : (
              <img 
                src={lightboxMedia.url} 
                alt="Enlarged Media" 
                className="lightbox-enlarged-img" 
              />
            )}
          </div>
        </div>,
        document.body
      )}

    </section>
  );
}
