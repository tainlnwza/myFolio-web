import React, { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";
import SafeIcon, { GithubIcon, LinkedinIcon, InstagramIcon } from "./SocialIcons";

export default function HeroSection({ hero, contacts = [] }) {
  // ค่าเริ่มต้นสำหรับโครงสร้างและข้อความ Placeholder
  const statusText = hero?.status || "[ สถานะ เช่น พร้อมรับงาน / Open for Opportunities ]";
  const headline = hero?.headline || "[ Turning Ideas Into Reality ]";
  const bio = hero?.homeBio || hero?.bio || "[ ข้อความแนะนำตัวและคำอธิบายเป้าหมายของคุณ เล่าถึงความสนใจและสิ่งที่กำลังทำ เว้นไว้สำหรับใส่เนื้อหา ]";
  const imageUrl = hero?.heroImageUrl || hero?.imageUrl || "";

  // รายการตำแหน่ง/บทบาท (Subtitles) สำหรับแสดงผลแบบ Typewriter Loop Animation
  const subtitleList = Array.isArray(hero?.subtitles) && hero.subtitles.length > 0
    ? hero.subtitles
    : (hero?.title ? [hero.title] : ["Full-Stack Developer", "Software Engineer", "UI/UX Designer"]);

  const [currentSubIndex, setCurrentSubIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!subtitleList || subtitleList.length === 0) return;

    const fullText = subtitleList[currentSubIndex % subtitleList.length] || "";
    let timer;

    if (!isDeleting) {
      // โหมดพิมพ์ข้อความขึ้นมาทีละตัวอักษร
      if (displayText.length < fullText.length) {
        timer = setTimeout(() => {
          setDisplayText(fullText.substring(0, displayText.length + 1));
        }, 85);
      } else {
        // เมื่อพิมพ์ครบแล้ว ให้เว้น 2.5 วินาที (2-3 วิ) ก่อนเปลี่ยนไปยังข้อความถัดไป
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2500);
      }
    } else {
      // โหมดลบข้อความถอยหลัง
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(fullText.substring(0, displayText.length - 1));
        }, 40);
      } else {
        // ลบครบแล้ว เปลี่ยนไปยังข้อความถัดไปแบบ Loop ไม่รู้จบ
        setIsDeleting(false);
        setCurrentSubIndex((prev) => (prev + 1) % subtitleList.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentSubIndex, subtitleList]);

  return (
    <section id="home" className="hero-section">
      <div className="hero-grid-layout">
        
        {/* Left Column: Headline, Bio & Action Buttons */}
        <div className="hero-left-column">
          
          {/* Main Headline */}
          <h1 className="hero-main-headline">
            <span className="headline-gradient block">{headline}</span>
          </h1>

          {/* Subtitle / Role with Typewriter animation & cursor */}
          <div className="hero-role-wrapper">
            <span className="hero-role-text">{displayText || "\u00A0"}</span>
            <span className="blinking-cursor"></span>
          </div>

          {/* Bio Description Placeholder */}
          <p className="hero-bio-paragraph">
            {bio}
          </p>

          {/* CTA Action Buttons */}
          <div className="hero-cta-group">
            <a href="#portfolio" className="btn-cta-primary">
              <Icons.Briefcase size={18} />
              <span>Project</span>
              <Icons.ArrowUpRight size={16} className="btn-arrow-icon" />
            </a>

            <a href="#contact" className="btn-cta-secondary">
              <Icons.Mail size={18} />
              <span>contact me</span>
            </a>
          </div>

          {/* Social Links Row */}
          <div className="hero-socials-wrapper">
            <span className="socials-label">FIND ME :</span>
            <div className="socials-icons-row">
              {contacts.length > 0 ? (
                contacts.map((contact) => {
                  return (
                    <a
                      key={contact.id}
                      href={contact.value?.startsWith("http") ? contact.value : contact.link || `#contact`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon-btn"
                      title={contact.label}
                      style={{ "--hover-accent": contact.color || "#38bdf8" }}
                    >
                      <SafeIcon name={contact.icon || contact.label} size={18} />
                    </a>
                  );
                })
              ) : (
                <>
                  <a href="#contact" className="social-icon-btn" title="GitHub">
                    <GithubIcon size={18} />
                  </a>
                  <a href="#contact" className="social-icon-btn" title="LinkedIn">
                    <LinkedinIcon size={18} />
                  </a>
                  <a href="#contact" className="social-icon-btn" title="Instagram">
                    <InstagramIcon size={18} />
                  </a>
                  <a href="#contact" className="social-icon-btn" title="Email">
                    <Icons.Mail size={18} />
                  </a>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Hero Visual Showcase (ปรับขนาดตามภาพที่แนบมา และรองรับ PNG โปร่งใส) */}
        <div className="hero-right-column">
          <div className={`hero-card-container ${imageUrl ? "has-image" : "is-empty"}`}>
            
            {/* Glowing Backdrop */}
            <div className="hero-card-glow"></div>

            {/* Card Frame with Profile Image or Placeholder */}
            <div className={`hero-profile-card ${imageUrl ? "hero-has-image" : "hero-is-placeholder"}`}>
              <PlaceholderImage
                src={imageUrl}
                aspect="auto"
                icon="User"
                label="[ รูปภาพโปรไฟล์ของคุณ ]"
                hint="รองรับไฟล์ PNG โปร่งใส, JPG, WEBP"
                className="hero-main-avatar"
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
