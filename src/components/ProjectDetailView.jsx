import React, { useState } from "react";
import * as Icons from "lucide-react";

// Safe SVG Icons for GitHub and External Link
const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function ProjectDetailView({ project, onBack }) {
  // Detail images สำหรับแสดงในหน้ารายละเอียด (ต่างจากรูปหน้าแรก สามารถเพิ่ม-ลดได้)
  const detailImages = Array.isArray(project.detailImages) && project.detailImages.length > 0
    ? project.detailImages
    : (project.imageUrl ? [project.imageUrl] : []);

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!project) return null;

  // รายการ Tags / Technologies Used
  const tagsList = Array.isArray(project.tags) && project.tags.length > 0
    ? project.tags
    : ["[ HTML ]", "[ CSS ]", "[ JavaScript ]", "[ React ]"];

  return (
    <div className="project-detail-page-container">
      {/* Top Bar: Back Button & Breadcrumbs */}
      <div className="project-detail-top-nav">
        <button 
          type="button" 
          className="project-back-btn" 
          onClick={onBack}
          id="project-back-button"
        >
          <Icons.ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="project-breadcrumb">
          <span className="breadcrumb-root">Projects</span>
          <Icons.ChevronRight size={14} className="breadcrumb-separator" />
          <span className="breadcrumb-current">{project.title}</span>
        </div>
      </div>

      {/* Main 2-Column Content Layout (ตามตัวอย่างในภาพแนบที่ 2) */}
      <div className="project-detail-grid">
        
        {/* Left Column: Project Title, Description, Tech Stack & Action Links */}
        <div className="project-detail-info-col">
          <h1 className="project-detail-title">{project.title}</h1>

          <p className="project-detail-description">
            {project.description || "รายละเอียดผลงานโปรเจกต์..."}
          </p>

          {/* Technologies Used Section */}
          <div className="project-detail-tech-section">
            <h3 className="project-tech-header">
              <span className="tech-code-icon">&lt;/&gt;</span> Technologies Used
            </h3>
            
            <div className="project-detail-tech-badges">
              {tagsList.map((tag, idx) => {
                const cleanTag = tag.replace(/^\[\s*|\s*\]$/g, "");
                return (
                  <span key={idx} className="project-detail-tech-pill">
                    <span className="pill-code-sym">&lt;&gt;</span>
                    <span>{cleanTag}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Action Links (Live Demo & GitHub) */}
          <div className="project-detail-actions">
            {project.demoUrl && project.demoUrl !== "#" && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta-primary"
              >
                <Icons.ExternalLink size={16} />
                <span>Live Demo</span>
              </a>
            )}

            {project.githubUrl && project.githubUrl !== "#" && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta-secondary"
              >
                <GithubIcon size={16} />
                <span>GitHub Repository</span>
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Project Detail Images Showcase (สามารถสลับดูหลายภาพได้) */}
        <div className="project-detail-visual-col">
          <div className="project-detail-card-frame">
            {detailImages.length > 0 ? (
              <div className="detail-image-showcase">
                <div className="detail-main-image-wrap">
                  <img
                    src={detailImages[activeImageIdx] || detailImages[0]}
                    alt={`${project.title} screenshot ${activeImageIdx + 1}`}
                    className="detail-main-img"
                  />
                </div>

                {/* Thumbnail switcher if multiple detail images exist */}
                {detailImages.length > 1 && (
                  <div className="detail-thumbnails-row">
                    {detailImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`detail-thumb-btn ${activeImageIdx === idx ? "active" : ""}`}
                        onClick={() => setActiveImageIdx(idx)}
                      >
                        <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="detail-image-placeholder">
                <Icons.Image size={48} className="placeholder-icon" />
                <p>ยังไม่มีรูปภาพสำหรับหน้ารายละเอียด</p>
                <span className="placeholder-hint">สามารถเพิ่มรูปภาพในระบบหลังบ้าน (Admin) ได้</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
