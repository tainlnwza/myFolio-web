import React from "react";
import * as Icons from "lucide-react";

/**
 * PlaceholderImage Component
 * แสดงรูปภาพจริงหากมี URL หรือแสดงโครงสร้าง Placeholder แบบโมเดิร์น
 * หากยังไม่มีรูปภาพ พร้อมระบุคำแนะนำขนาดและประเภทไฟล์
 */
export default function PlaceholderImage({
  src,
  alt = "Placeholder",
  aspect = "16/9", // "16/9", "1/1", "4/3", "4/5"
  icon = "Image",
  label = "[ เว้นสำหรับใส่รูปภาพ ]",
  hint = "PNG, JPG, WEBP",
  className = "",
  onClick = null,
  isPdf = false
}) {
  const IconComponent = Icons[icon] || Icons.Image;

  // คำนวณ aspect-ratio class
  const aspectClass = {
    "16/9": "aspect-16-9",
    "1/1": "aspect-1-1",
    "4/3": "aspect-4-3",
    "4/5": "aspect-4-5"
  }[aspect] || "aspect-16-9";

  if (src) {
    if (isPdf) {
      return (
        <div 
          className={`placeholder-img-wrapper ${aspectClass} pdf-preview-container ${className}`}
          onClick={onClick}
          style={{ cursor: onClick ? "pointer" : "default" }}
        >
          <div className="pdf-thumbnail-fallback">
            <Icons.FileText size={48} className="pdf-thumbnail-icon" />
            <span className="pdf-badge">PDF DOCUMENT</span>
            <span className="pdf-click-tip">คลิกเพื่อเปิดดูเอกสาร</span>
          </div>
        </div>
      );
    }

    return (
      <div 
        className={`placeholder-img-wrapper ${aspectClass} ${className}`}
        onClick={onClick}
        style={{ cursor: onClick ? "pointer" : "default" }}
      >
        <img src={src} alt={alt} className="placeholder-actual-img" loading="lazy" />
      </div>
    );
  }

  return (
    <div 
      className={`placeholder-box ${aspectClass} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="placeholder-content">
        <div className="placeholder-icon-ring">
          <IconComponent size={28} className="placeholder-icon" />
        </div>
        <span className="placeholder-label">{label}</span>
        {hint && <span className="placeholder-hint">{hint}</span>}
      </div>
    </div>
  );
}
