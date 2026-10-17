import React, { useState, useEffect, useRef } from "react";
import * as Icons from "lucide-react";
import PixelHandCursor from "./PixelHandCursor";

export default function FloatingNavbar({ activeSection, onNavClick }) {
  const [hoveredTab, setHoveredTab] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [cursorX, setCursorX] = useState(null);
  const [isSwitching, setIsSwitching] = useState(false);

  const navRef = useRef(null);
  const tabRefs = useRef({});

  const navItems = [
    { id: "home", label: "Home", href: "#home", icon: "Home" },
    { id: "about", label: "About", href: "#about", icon: "User" },
    { id: "portfolio", label: "Portfolio", href: "#portfolio", icon: "Briefcase" },
    { id: "contact", label: "Contact", href: "#contact", icon: "Mail" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update animated cursor position whenever activeSection changes or window resizes
  useEffect(() => {
    const updateCursorPosition = () => {
      const activeEl = tabRefs.current[activeSection];
      const navContainer = navRef.current;
      if (activeEl && navContainer) {
        const navRect = navContainer.getBoundingClientRect();
        const tabRect = activeEl.getBoundingClientRect();
        // คำนวณตำแหน่งมุมขวาบนของหัวข้อ (Top-Right Corner Offset)
        const rightCornerOffset = tabRect.left - navRect.left + tabRect.width - 6;
        setCursorX(rightCornerOffset);
        setIsSwitching(true);
        const timer = setTimeout(() => setIsSwitching(false), 380);
        return () => clearTimeout(timer);
      }
    };

    updateCursorPosition();
    window.addEventListener("resize", updateCursorPosition);
    return () => window.removeEventListener("resize", updateCursorPosition);
  }, [activeSection]);

  const handleClick = (e, item) => {
    e.preventDefault();
    if (onNavClick) {
      onNavClick(item.id);
    }
    const target = document.querySelector(item.href);
    if (target) {
      const topOffset = 100;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <header className="floating-navbar-container">
      <nav 
        ref={navRef}
        className={`floating-navbar-pill ${scrolled ? "scrolled" : ""}`}
      >
        {/* Animated Pixel Hand Cursor Indicator (อยู่มุมขวาบนของหัวข้อ ในลักษณะเอียงเล็กน้อย) */}
        {cursorX !== null && (
          <div 
            className={`active-cursor-pointer-track ${isSwitching ? "switching" : ""}`}
            style={{ left: `${cursorX}px` }}
            aria-hidden="true"
          >
            <div className="cursor-bob-wrapper">
              <PixelHandCursor direction="tilted-down" size={30} />
            </div>
          </div>
        )}

        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const isHovered = hoveredTab === item.id;
          const Icon = Icons[item.icon] || Icons.Circle;

          return (
            <a
              key={item.id}
              ref={(el) => (tabRefs.current[item.id] = el)}
              href={item.href}
              onClick={(e) => handleClick(e, item)}
              onMouseEnter={() => setHoveredTab(item.id)}
              onMouseLeave={() => setHoveredTab(null)}
              className={`nav-pill-item ${isActive ? "active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active Tab Glow Capsule */}
              {isActive && (
                <div className="active-pill-glow">
                  <div className="glow-blur-inner"></div>
                  <div className="glow-blur-outer"></div>
                  <div className="glow-shine-sweep"></div>
                </div>
              )}

              {/* Hover Highlight (if not active) */}
              {isHovered && !isActive && (
                <div className="hover-pill-highlight"></div>
              )}

              <span className="nav-pill-content">
                <Icon size={19} className="nav-pill-icon" />
                <span className="nav-pill-text">{item.label}</span>
              </span>
            </a>
          );
        })}
      </nav>
    </header>
  );
}
