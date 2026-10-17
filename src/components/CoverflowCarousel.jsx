import React, { useState, useRef, useEffect } from "react";
import { DEFAULT_GALLERY } from "../dbService";

export default function CoverflowCarousel({ gallery, items = [] }) {
  // 1. ดึงภาพจาก Gallery ที่ผู้ใช้จัดการหลังบ้านได้
  let rawList = [];
  if (Array.isArray(gallery) && gallery.length > 0) {
    rawList = gallery.filter((g) => g.imageUrl || g.src);
  } else {
    // Fallback ดึงจาก items ผลงาน หรือใช้ DEFAULT_GALLERY
    const validItems = items
      .filter((item) => item.imageUrl && !item.imageUrl.toLowerCase().endsWith(".pdf"))
      .map((item) => ({ id: item.id, title: item.title, imageUrl: item.imageUrl }));
    rawList = validItems.length >= 3 ? validItems : DEFAULT_GALLERY;
  }

  // เตรียมสไลด์ให้มีอย่างน้อย 7-9 สไลด์เพื่อแผ่ขยายตั้งแต่ขอบซ้ายสุดถึงขอบขวาสุดของจอ
  let slides = rawList.map((item, idx) => ({
    id: item.id || `slide-${idx}`,
    title: item.title || "",
    src: item.imageUrl || item.src
  }));

  if (slides.length > 0 && slides.length < 7) {
    let repeated = [...slides];
    while (repeated.length < 7) {
      repeated = [...repeated, ...slides];
    }
    slides = repeated;
  }

  // ตำแหน่งสไลด์ตรงกลางปัจจุบัน
  const [activeIndex, setActiveIndex] = useState(Math.floor(slides.length / 2));
  const containerRef = useRef(null);
  const touchStartX = useRef(null);

  // คำนวณ Circular Offset วน Loop ซ้าย-ขวา ไม่รู้จบ
  const getOffset = (idx) => {
    let diff = idx - activeIndex;
    const half = slides.length / 2;
    while (diff > half) diff -= slides.length;
    while (diff < -half) diff += slides.length;
    return diff;
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  // การเลื่อนภาพทำได้โดยการกดที่ภาพซ้าย-ขวาของภาพตรงกลาง แล้วจะเลื่อนไปด้านที่กด loop เรื่อยๆ
  const handleCardClick = (offset) => {
    if (offset < 0) {
      prevSlide();
    } else if (offset > 0) {
      nextSlide();
    }
  };

  // Fallback สำหรับคลิกที่บริเวณซ้ายหรือขวาของ Viewport นอกเหนือจากการคลิกโดนการ์ดตรงๆ
  const handleViewportClick = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const centerX = rect.width / 2;
    // เว้นช่วงตรงกลาง (ภาพตรงกลาง)
    if (clickX < centerX - 120) {
      prevSlide();
    } else if (clickX > centerX + 120) {
      nextSlide();
    }
  };

  // จัดการคีย์บอร์ดซ้าย-ขวา
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length]);

  // จัดการ Touch Swipe สำหรับมือถือและแท็บเล็ต
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 40) {
      prevSlide();
    } else if (deltaX < -40) {
      nextSlide();
    }
    touchStartX.current = null;
  };

  return (
    <div className="coverflow-section scroll-reveal">
      <div 
        className="coverflow-viewport" 
        ref={containerRef}
        onClick={handleViewportClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* 3D Stage - ลบลูกศรวงกลมออกตามข้อ 1 เลื่อนภาพโดยกดที่รูปซ้าย-ขวา */}
        <div className="coverflow-stage">
          {slides.map((slide, idx) => {
            const offset = getOffset(idx);
            const absOffset = Math.abs(offset);
            const isActive = offset === 0;

            // 3D Transform กระจายการ์ดจากขอบหน้าจอด้านหนึ่งไปสุดที่ขอบอีกด้านหนึ่ง
            let rotateAngle = offset * -35;
            let zTranslate = isActive ? 100 : -80 * absOffset;
            let scaleVal = isActive ? 1.06 : Math.max(0.7, 1 - absOffset * 0.08);
            let zIndex = 100 - absOffset * 10;
            let opacity = absOffset > 3 ? 0 : (absOffset === 3 ? 0.6 : 1 - absOffset * 0.12);

            return (
              <div
                key={`${slide.id}-${idx}`}
                className={`coverflow-card ${isActive ? "active-card" : ""} ${offset < 0 ? "card-left" : offset > 0 ? "card-right" : "card-center"}`}
                style={{
                  transform: `translateX(calc(${offset} * var(--coverflow-step))) translateZ(${zTranslate}px) rotateY(${rotateAngle}deg) scale(${scaleVal})`,
                  zIndex,
                  opacity,
                  cursor: isActive ? "default" : "pointer"
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(offset);
                }}
                title={offset < 0 ? "คลิกเพื่อเลื่อนไปทางซ้าย" : offset > 0 ? "คลิกเพื่อเลื่อนไปทางขวา" : ""}
              >
                <div className="coverflow-card-inner">
                  <img
                    src={slide.src}
                    alt={slide.title || "Gallery"}
                    className="coverflow-pure-img"
                    loading="lazy"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
