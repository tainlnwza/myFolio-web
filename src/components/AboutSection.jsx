import React from "react";
import * as Icons from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";
import { DEFAULT_EDUCATION, DEFAULT_EXPERIENCE } from "../dbService";

export default function AboutSection({ hero, items = [] }) {
  const name = hero?.name || "Eka Wahyu Maulidan";
  const bio = hero?.aboutBio || hero?.bio || "ยินดีต้อนรับเข้าสู่ว็บไซต์พอร์ตโฟลิโอและคลังเกียรติบัตรออนไลน์ของผม! ผมมีความสนใจเกี่ยวกับการพัฒนาเว็บแอปพลิเคชัน วิทยาการข้อมูล และเทคโนโลยีความปลอดภัย เว็บนี้รวบรวมผลงาน เกียรติบัตร และรางวัลที่ผมได้รับจากการเข้าร่วมแข่งขันและทำกิจกรรมต่าง ๆ";
  const resumeUrl = hero?.resumeUrl || "#";
  const imageUrl = hero?.aboutImageUrl || hero?.imageUrl || "";

  // คำนวณจำนวนผลงานจากข้อมูลที่เพิ่มเข้าไปจริงๆ (อ้างอิงจากรายการจริงในระบบ)
  const projectItems = items.filter(
    (item) => item.categoryId === "cat-projects" || item.category === "projects" || (!item.categoryId?.includes("act") && !item.categoryId?.includes("cert") && !item.categoryId?.includes("award"))
  );
  const projCount = projectItems.length;

  const uploadedActs = items.filter(
    (item) => (item.categoryId === "cat-activities" || item.category === "activities") && (item.imageUrl || item.url || item.videoUrl)
  );
  const heroActs = Array.isArray(hero?.activities) 
    ? hero.activities.filter(a => a.url || a.imageUrl || a.src) 
    : [
        ...(Array.isArray(hero?.certificates) ? hero.certificates.filter(c => c.imageUrl || c.src || c.url) : []),
        ...(Array.isArray(hero?.awards) ? hero.awards.filter(a => a.imageUrl || a.src || a.url) : [])
      ];
  const actCount = uploadedActs.length + heroActs.length;

  const techCount = Array.isArray(hero?.techStack) ? hero.techStack.length : 0;

  // แบ่งบรรทัดชื่อแบบสวยงามตามสไตล์ภาพแนบที่ 4
  const nameParts = name.trim().split(" ");
  const firstName = nameParts.slice(0, Math.ceil(nameParts.length / 2)).join(" ");
  const lastName = nameParts.slice(Math.ceil(nameParts.length / 2)).join(" ");

  // ข้อมูลการศึกษาแบบไดนามิก (Education) ที่สามารถเพิ่ม-ลดได้
  const educationList = hero?.education && hero.education.length > 0 
    ? hero.education 
    : DEFAULT_EDUCATION;

  // ข้อมูลประสบการณ์แบบไดนามิก (Experience) ที่สามารถเพิ่ม-ลดได้
  const experienceList = hero?.experience && hero.experience.length > 0 
    ? hero.experience 
    : DEFAULT_EXPERIENCE;

  return (
    <section id="about" className="about-section">
      
      {/* 1. Section Header: ขยายขนาด About Me ให้ใหญ่ขึ้น ลบ Badge และข้อความย่อยออกตามภาพแนบ 3 */}
      <div className="section-header-block about-header-block scroll-reveal">
        <h2 className="section-main-title about-main-title">
          About <span className="headline-gradient">Me</span>
        </h2>
      </div>

      <div className="about-layout-container">
        
        {/* 2. Top Block: 3 คอลัมน์ (Left: ชื่อ + Resume | Center: รูปถ่ายโปรไฟล์ | Right: คำแนะนำตัว + Projects) */}
        <div className="about-hero-row scroll-reveal">
          
          {/* Left Column: Hi, I'm + Name + View Resume */}
          <div className="about-hero-name-col">
            <span className="about-greeting-badge">Hi, I'm</span>
            <h3 className="about-hero-fullname">
              <span className="block">{firstName || "Eka Wahyu"}</span>
              {lastName && <span className="block text-white">{lastName}</span>}
            </h3>
            <div className="about-resume-btn-wrap">
              <a 
                href={resumeUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-view-resume"
              >
                <Icons.FileText size={18} />
                <span>View Resume</span>
              </a>
            </div>
          </div>

          {/* Center Column: Portrait Image Showcase (ปรับขนาดตามภาพจริง และรองรับ PNG โปร่งใส) */}
          <div className="about-hero-photo-col">
            <div className={`about-portrait-card-frame ${imageUrl ? "about-has-image" : "about-is-placeholder"}`}>
              <PlaceholderImage
                src={imageUrl}
                aspect="auto"
                icon="User"
                label="[ รูปภาพโปรไฟล์ของคุณ ]"
                hint="รองรับไฟล์ PNG โปร่งใส หรือ JPG"
                className="about-portrait-img"
              />
            </div>
          </div>

          {/* Right Column: Bio Paragraph + View Projects */}
          <div className="about-hero-bio-col">
            <p className="about-bio-text">
              {bio}
            </p>
            <div className="about-projects-btn-wrap">
              <a href="#portfolio" className="btn-view-projects-outline">
                <Icons.Code2 size={18} />
                <span>View Projects</span>
              </a>
            </div>
          </div>

        </div>

        {/* 3. Middle Block: 2 Columns (Left: Education | Right: Experience) */}
        <div className="about-timeline-row scroll-reveal">
          
          {/* Left: Education Column */}
          <div className="about-timeline-col">
            <h4 className="about-col-heading">Education</h4>
            <div className="about-cards-stack">
              {educationList.map((edu, idx) => {
                const EduIcon = Icons[edu.icon] || Icons.GraduationCap;
                return (
                  <div key={edu.id || idx} className="about-entry-card">
                    <div className="about-entry-icon-box edu-icon-box">
                      {edu.imageUrl ? (
                        <img 
                          src={edu.imageUrl} 
                          alt={edu.institution} 
                          className="about-entry-custom-img" 
                          style={{ width: "100%", height: "100%", maxWidth: "38px", maxHeight: "38px", objectFit: "contain" }}
                        />
                      ) : (
                        <EduIcon size={22} />
                      )}
                    </div>
                    <div className="about-entry-content">
                      <h5 className="about-entry-title">{edu.institution}</h5>
                      <p className="about-entry-subtitle">{edu.degree}</p>
                      <span className="about-entry-period">{edu.period}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Experience Column */}
          <div className="about-timeline-col">
            <h4 className="about-col-heading">Experience</h4>
            <div className="about-cards-stack">
              {experienceList.map((exp, idx) => {
                const ExpIcon = Icons[exp.icon] || Icons.Briefcase;
                return (
                  <div key={exp.id || idx} className="about-entry-card">
                    <div className="about-entry-icon-box exp-icon-box">
                      {exp.imageUrl ? (
                        <img 
                          src={exp.imageUrl} 
                          alt={exp.company} 
                          className="about-entry-custom-img" 
                          style={{ width: "100%", height: "100%", maxWidth: "38px", maxHeight: "38px", objectFit: "contain" }}
                        />
                      ) : (
                        <ExpIcon size={22} />
                      )}
                    </div>
                    <div className="about-entry-content">
                      <h5 className="about-entry-title">{exp.company}</h5>
                      <p className="about-entry-subtitle">{exp.role}</p>
                      <span className="about-entry-period">{exp.period}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* 4. Bottom Block: 3 Highlight Stat Cards - ขยายขนาดตามข้อ 1 และนับจำนวนจากจริง */}
        <div className="about-stats-row scroll-reveal">
          
          {/* Card 1: Projects */}
          <a href="#portfolio" className="about-stat-banner-card" title="คลิกเพื่อไปยังส่วนผลงาน Projects">
            <div className="stat-banner-left">
              <div className="stat-banner-tag">
                <Icons.Code2 size={22} className="stat-banner-tag-icon" />
                <span>PROJECTS</span>
              </div>
              <p className="stat-banner-desc">innovative solutions crafted</p>
            </div>
            <div className="stat-banner-right">
              <span className="stat-banner-number">{projCount}</span>
              <Icons.ArrowUpRight size={22} className="stat-banner-arrow" />
            </div>
          </a>

          {/* Card 2: Activities */}
          <a href="#portfolio" className="about-stat-banner-card" title="คลิกเพื่อไปยังส่วน Activities">
            <div className="stat-banner-left">
              <div className="stat-banner-tag">
                <Icons.Sparkles size={22} className="stat-banner-tag-icon" />
                <span>ACTIVITIES</span>
              </div>
              <p className="stat-banner-desc">creative leisure works & clips</p>
            </div>
            <div className="stat-banner-right">
              <span className="stat-banner-number">{actCount}</span>
              <Icons.ArrowUpRight size={22} className="stat-banner-arrow" />
            </div>
          </a>

          {/* Card 3: Tech Stack */}
          <a href="#portfolio" className="about-stat-banner-card" title="คลิกเพื่อไปยังส่วน Tech Stack">
            <div className="stat-banner-left">
              <div className="stat-banner-tag">
                <Icons.Boxes size={22} className="stat-banner-tag-icon" />
                <span>TECH STACK</span>
              </div>
              <p className="stat-banner-desc">technologies & tools mastered</p>
            </div>
            <div className="stat-banner-right">
              <span className="stat-banner-number">{techCount}</span>
              <Icons.ArrowUpRight size={22} className="stat-banner-arrow" />
            </div>
          </a>

        </div>

      </div>
    </section>
  );
}
