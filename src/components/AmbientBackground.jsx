import React, { useEffect, useRef } from "react";

/**
 * AmbientBackground Component
 * พื้นหลังอวกาศและดวงดาว (Starfield Space Background)
 * - โทนสีดำลึกสนิทมีเปอร์เซ็นต์ส่วนใหญ่ (90%+) ลดสีน้ำเงินลงให้เหลือเพียงประกายคอสมิกแผ่วเบา
 * - ปรับลดขนาดดวงดาวให้เล็กลง ละเอียด ละมุนตา ไม่กวนสายตา
 * - ปรับลดจำนวนดวงดาวให้พอดี สบายตา (ไม่หนาแน่นจนเกินไป)
 * - ลดความเร็วของอนิเมชั่นการลอยขึ้นของดวงดาวให้ช้าลง นุ่มนวล สงบนิ่ง
 * - สุ่มเกิดดาวตก (Shooting stars / Meteors) นานๆ ครั้งอย่างสมจริง
 * - ตอบสนองต่อ Cursor เคลื่อนไหวตามเมาส์เบาๆ (Parallax)
 */
export default function AmbientBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse Parallax State with smooth lerp
    const mouse = {
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0
    };

    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouse.targetX = (e.clientX - centerX) / centerX;
      mouse.targetY = (e.clientY - centerY) / centerY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize);

    // ลดจำนวนดวงดาว (Star Count) ให้โปร่งสบายตา ไม่รก (100 - 130 ดวง)
    const STAR_COUNT = Math.min(125, Math.floor((width * height) / 9500));
    let stars = [];

    function initStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        const layerRand = Math.random();
        let layer = 0;
        // ลดขนาดดวงดาว (Star Radius) ให้เล็กลง ละเอียดเหมือนละอองดาวจริง
        let radius = 0.35 + Math.random() * 0.35; // 0.35px - 0.7px
        // ลดความเร็วอนิเมชั่น (Speed) ให้ช้าลง นุ่มนวล สงบ
        let speed = 0.03 + Math.random() * 0.04;
        let parallax = 6;
        let baseAlpha = 0.25 + Math.random() * 0.35;

        if (layerRand > 0.82) {
          layer = 2;
          radius = 0.85 + Math.random() * 0.45; // 0.85px - 1.3px
          speed = 0.08 + Math.random() * 0.05;
          parallax = 18;
          baseAlpha = 0.7 + Math.random() * 0.3;
        } else if (layerRand > 0.5) {
          layer = 1;
          radius = 0.55 + Math.random() * 0.35; // 0.55px - 0.9px
          speed = 0.05 + Math.random() * 0.04;
          parallax = 12;
          baseAlpha = 0.45 + Math.random() * 0.3;
        }

        // โทนสีดาว: ขาวสว่างประกายเงิน มีประกายฟ้าไอซ์บลูแซมเล็กน้อย
        let color = "#ffffff";
        const colorRand = Math.random();
        if (colorRand > 0.85) {
          color = "#cbd5e1"; // Platinum silver
        } else if (colorRand > 0.7) {
          color = "#bfdbfe"; // Soft ice tint
        }

        stars.push({
          x: Math.random() * (width + 40) - 20,
          y: Math.random() * (height + 40) - 20,
          radius,
          speed,
          baseAlpha,
          alpha: baseAlpha,
          twinkleSpeed: 0.008 + Math.random() * 0.02,
          twinklePhase: Math.random() * Math.PI * 2,
          layer,
          parallax,
          color
        });
      }
    }

    initStars();

    // Shooting Stars System (ดาวตก นานๆ สุ่มที 6-12 วินาที)
    let shootingStars = [];
    let lastShootingStarTime = Date.now() - 2000;
    let nextShootingStarDelay = 4000; // เริ่มต้นดวงแรกใน ~4 วินาที

    function spawnShootingStar() {
      const startX = Math.random() * width * 0.8 + width * 0.1;
      const startY = Math.random() * (height * 0.3);
      const direction = Math.random() > 0.3 ? -1 : 1;
      const angle = direction === -1 
        ? (Math.PI * 0.72) + (Math.random() * 0.15 - 0.075) 
        : (Math.PI * 0.28) + (Math.random() * 0.15 - 0.075);
      
      const speed = 15 + Math.random() * 8;
      const length = 90 + Math.random() * 70;
      const maxLife = 40 + Math.random() * 15;

      shootingStars.push({
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        length,
        life: 0,
        maxLife,
        tailAngle: angle,
        thickness: 1.4 + Math.random() * 0.6
      });

      lastShootingStarTime = Date.now();
      // ครั้งต่อไปใน 6 ถึง 12 วินาที
      nextShootingStarDelay = 6000 + Math.random() * 6000;
    }

    function render() {
      animationFrameId = requestAnimationFrame(render);

      // Lerp mouse parallax position smoothly
      mouse.currentX += (mouse.targetX * 16 - mouse.currentX) * 0.04;
      mouse.currentY += (mouse.targetY * 16 - mouse.currentY) * 0.04;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Deep Space Background with subtle cosmic blue presence (ลด % สีน้ำเงินลงอีกนิดนึงตามที่ต้องการ)
      const bgGradient = ctx.createRadialGradient(
        width * 0.5 - mouse.currentX * 1.2,
        height * 0.35 - mouse.currentY * 1.2,
        25,
        width * 0.5,
        height * 0.4,
        Math.max(width, height) * 0.62
      );
      // โทนสีน้ำเงินเข้มลึกสนิท ลด % ของสีน้ำเงินลงให้มืดลึก คมชัด สบายตา
      bgGradient.addColorStop(0, "#05132d"); // Dark midnight navy core
      bgGradient.addColorStop(0.18, "#030c1e"); // Deep muted dark navy
      bgGradient.addColorStop(0.4, "#020713"); // Pitch blue-black body
      bgGradient.addColorStop(0.7, "#01030a"); // Near true cosmic black
      bgGradient.addColorStop(1, "#000104"); // Pitch black

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Render & Update Stars (ลอยขึ้นช้าๆ นุ่มนวล)
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // เคลื่อนที่ขึ้นอย่างช้าๆ
        star.y -= star.speed;
        if (star.y < -10) {
          star.y = height + 10;
          star.x = Math.random() * (width + 40) - 20;
        }

        // Twinkle calculation
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = 0.75 + 0.25 * Math.sin(star.twinklePhase);
        const currentAlpha = Math.max(0.1, Math.min(1, star.baseAlpha * twinkle));

        // Parallax position offset
        const pFactor = (star.parallax / 16);
        const drawX = star.x - mouse.currentX * pFactor;
        const drawY = star.y - mouse.currentY * pFactor;

        // Draw star core
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        ctx.fill();

        // Subtle soft halo on near stars
        if (star.layer === 2) {
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(191, 219, 254, 0.15)";
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // 3. Update & Render Shooting Stars (ดาวตก)
      const nowMs = Date.now();
      if (nowMs - lastShootingStarTime > nextShootingStarDelay) {
        spawnShootingStar();
      }

      for (let j = shootingStars.length - 1; j >= 0; j--) {
        const s = shootingStars[j];
        s.life++;
        s.x += s.dx;
        s.y += s.dy;

        const progress = s.life / s.maxLife;
        let alpha = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8;
        alpha = Math.max(0, Math.min(1, alpha));

        const tailX = s.x - Math.cos(s.tailAngle) * s.length;
        const tailY = s.y - Math.sin(s.tailAngle) * s.length;

        const tailGrad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        tailGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        tailGrad.addColorStop(0.2, `rgba(186, 230, 253, ${alpha * 0.85})`);
        tailGrad.addColorStop(0.6, `rgba(56, 189, 248, ${alpha * 0.3})`);
        tailGrad.addColorStop(1, "rgba(56, 189, 248, 0)");

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = s.thickness;
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.thickness * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        if (s.life >= s.maxLife || s.x < -80 || s.x > width + 80 || s.y > height + 80) {
          shootingStars.splice(j, 1);
        }
      }
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="ambient-background" aria-hidden="true">
      <canvas ref={canvasRef} className="space-starfield-canvas" />
      <div className="space-vignette-overlay" />
    </div>
  );
}
