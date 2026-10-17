import React from "react";
import * as Icons from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";
import { DEFAULT_EDUCATION, DEFAULT_EXPERIENCE } from "../dbService";

export default function AboutSection({ hero, items = [] }) {
  const name = hero?.name || "Eka Wahyu Maulidan";
  const bio = hero?.bio || "Sebagai mahasiswa Fakultas Ilmu Komputer Universitas Brawijaya, Aku berfokus pada pengembangan teknologi yang tidak hanya fungsional, tetapi juga menghadirkan pengalaman digital yang menarik dan berdampak.";
  const resumeUrl = hero?.resumeUrl || "#";
  const imageUrl = hero?.aboutImageUrl || hero?.imageUrl || "";

  // คำนวณจำนวนผลงานจาก items หรือใช้ค่าเริ่มต้นจาก hero
  const projCount = items.length > 0 
    ? items.filter(i => (i.categoryId || "").toLowerCase().includes("proj")).length || hero?.projectsCount || "6"
    : hero?.projectsCount || "6";

  const certCount = items.length > 0 
    ? items.filter(i => (i.categoryId || "").toLowerCase().includes("cert")).length || hero?.certificatesCount || "6"
    : hero?.certificatesCount || "6";

  const awardCount = items.length > 0 
    ? items.filter(i => (i.categoryId || "").toLowerCase().includes("award")).length || hero?.awardsCount || "4"
    : hero?.awardsCount || "4";

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

          {/* Center Column: Portrait Image Showcase */}
          <div className="about-hero-photo-col">
            <div className="about-portrait-card-frame">
              <PlaceholderImage
                src={imageUrl}
                aspect="4/5"
                icon="User"
                label="[ รูปภาพโปรไฟล์ของคุณ ]"
                hint="ขนาดแนะนำ 4:5"
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
                        <img src={edu.imageUrl} alt={edu.institution} className="about-entry-custom-img" />
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
                        <img src={exp.imageUrl} alt={exp.company} className="about-entry-custom-img" />
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

        {/* 4. Bottom Block: 3 Full-Width Highlight Stat Cards (Projects, Certificates, Awards) */}
        <div className="about-stats-row scroll-reveal">
          
          {/* Card 1: Projects */}
          <a href="#portfolio" className="about-stat-banner-card">
            <div className="stat-banner-left">
              <div className="stat-banner-tag">
                <Icons.Code2 size={16} />
                <span>PROJECTS</span>
              </div>
              <p className="stat-banner-desc">innovative solutions crafted</p>
            </div>
            <div className="stat-banner-right">
              <span className="stat-banner-number">{projCount}</span>
              <Icons.ArrowUpRight size={16} className="stat-banner-arrow" />
            </div>
          </a>

          {/* Card 2: Certificates */}
          <a href="#portfolio" className="about-stat-banner-card">
            <div className="stat-banner-left">
              <div className="stat-banner-tag">
                <Icons.Award size={16} />
                <span>CERTIFICATES</span>
              </div>
              <p className="stat-banner-desc">skills validated</p>
            </div>
            <div className="stat-banner-right">
              <span className="stat-banner-number">{certCount}</span>
              <Icons.ArrowUpRight size={16} className="stat-banner-arrow" />
            </div>
          </a>

          {/* Card 3: Awards */}
          <a href="#portfolio" className="about-stat-banner-card">
            <div className="stat-banner-left">
              <div className="stat-banner-tag">
                <Icons.Trophy size={16} />
                <span>AWARDS</span>
              </div>
              <p className="stat-banner-desc">achievements earned</p>
            </div>
            <div className="stat-banner-right">
              <span className="stat-banner-number">{awardCount}</span>
              <Icons.ArrowUpRight size={16} className="stat-banner-arrow" />
            </div>
          </a>

        </div>

      </div>
    </section>
  );
}
