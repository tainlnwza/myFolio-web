import React, { useState } from "react";
import * as Icons from "lucide-react";
import SafeIcon from "./SocialIcons";

export default function ContactSection({ contacts = [] }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  const defaultContactsFallback = [
    {
      id: "c-github",
      icon: "Github",
      label: "GITHUB",
      value: "https://github.com/tainlnwza",
      link: "https://github.com/tainlnwza",
      color: "#6e5494"
    },
    {
      id: "c-facebook",
      icon: "Facebook",
      label: "FACEBOOK",
      value: "https://www.facebook.com/metichai.boonma",
      link: "https://www.facebook.com/metichai.boonma",
      color: "#1877F2"
    },
    {
      id: "c-instagram",
      icon: "Instagram",
      label: "INSTAGRAM",
      value: "cxptxinn._",
      link: "https://instagram.com/cxptxinn._",
      color: "#E1306C"
    },
    {
      id: "c-email",
      icon: "Mail",
      label: "EMAIL",
      value: "metichaiboonma0007@gmail.com",
      link: "mailto:metichaiboonma0007@gmail.com",
      color: "#00d2ff"
    },
    {
      id: "c-phone",
      icon: "Phone",
      label: "PHONE",
      value: "098-032-2142",
      link: "tel:0980322142",
      color: "#0055ff"
    },
    {
      id: "c-line",
      icon: "MessageCircle",
      label: "LINE ID",
      value: "captain0007",
      link: "#",
      color: "#06C755"
    }
  ];

  const getContactType = (c) => {
    if (!c) return "other";
    const str = `${c.icon || ""} ${c.label || ""} ${c.id || ""}`.toLowerCase();
    if (str.includes("github")) return "github";
    if (str.includes("facebook")) return "facebook";
    if (str.includes("instagram") || str.includes("ig")) return "instagram";
    if (str.includes("email") || str.includes("mail")) return "email";
    if (str.includes("phone") || str.includes("tel")) return "phone";
    if (str.includes("line")) return "lineid";
    return "other";
  };

  // ลำดับที่ผู้ใช้กำหนด: github facebook ig email phone lineid
  const ORDERED_TYPES = ["github", "facebook", "instagram", "email", "phone", "lineid"];

  const rawList = contacts.length > 0 ? contacts : defaultContactsFallback;
  const sortedContacts = [...rawList].sort((a, b) => {
    const idxA = ORDERED_TYPES.indexOf(getContactType(a));
    const idxB = ORDERED_TYPES.indexOf(getContactType(b));
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  });

  const getExternalLink = (contact) => {
    const val = (contact.value || "").trim();
    const link = (contact.link || "").trim();
    if (link && link.startsWith("http")) return link;
    if (val.startsWith("http://") || val.startsWith("https://")) return val;
    const type = getContactType(contact);
    if (type === "github") return `https://github.com/${val.replace(/^@/, "")}`;
    if (type === "facebook") return val.startsWith("www.") ? `https://${val}` : `https://facebook.com/${val}`;
    if (type === "instagram") return `https://instagram.com/${val.replace(/^@/, "")}`;
    return link || "#";
  };

  return (
    <section id="contact" className="contact-section">
      
      {/* Section Header */}
      <div className="section-header-block scroll-reveal">
        <h2 className="section-main-title">
          ช่องทาง<span>การติดต่อ</span>
        </h2>
      </div>

      <div className="contact-unified-glass-card scroll-reveal">
        
        {/* Left Column: FIND ME & SOCIALS */}
        <div className="contact-left-column">
          <h3 className="contact-column-heading">
            <Icons.Radio size={20} className="text-cyan-400" />
            <span>FIND ME & SOCIALS</span>
          </h3>

          <div className="contact-cards-list">
            {sortedContacts.map((contact) => {
              const type = getContactType(contact);
              // ลิงก์ที่กดแล้วไปยังเว็บได้เหลือแค่ github, facebook, ig ส่วนอันอื่นแค่แสดงไว้
              const isClickable = type === "github" || type === "facebook" || type === "instagram";
              const targetUrl = isClickable ? getExternalLink(contact) : null;

              if (isClickable) {
                return (
                  <a
                    key={contact.id}
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-info-card is-link group"
                    style={{ "--card-accent": contact.color || "#00e5ff" }}
                  >
                    <div className="contact-card-icon-box">
                      <SafeIcon name={contact.icon || contact.label} size={22} />
                    </div>
                    <div className="contact-card-text">
                      <span className="contact-card-label">{contact.label}</span>
                      <span className="contact-card-value">{contact.value}</span>
                    </div>
                    <Icons.ArrowUpRight size={16} className="contact-card-arrow" />
                  </a>
                );
              }

              return (
                <div
                  key={contact.id}
                  className="contact-info-card is-display-only"
                  style={{ "--card-accent": contact.color || "#00e5ff" }}
                >
                  <div className="contact-card-icon-box">
                    <SafeIcon name={contact.icon || contact.label} size={22} />
                  </div>
                  <div className="contact-card-text">
                    <span className="contact-card-label">{contact.label}</span>
                    <span className="contact-card-value">{contact.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: SEND A MESSAGE (อยู่ในกล่องและระดับเดียวกัน) */}
        <div className="contact-right-column">
          <h3 className="contact-column-heading">
            <Icons.Send size={20} className="text-blue-400" />
            <span>SEND A MESSAGE</span>
          </h3>

          {submitted && (
            <div className="contact-success-alert">
              <Icons.CheckCircle2 size={20} />
              <span>ข้อความของคุณถูกจำลองการส่งเรียบร้อยแล้ว! (Demo Form)</span>
            </div>
          )}

            <form onSubmit={handleSubmit} className="contact-form-layout">
              <div className="form-field-group">
                <label className="form-label" htmlFor="contact-name">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="กรอกชื่อ-นามสกุลของคุณ..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="contact-input-field"
                />
              </div>

              <div className="form-field-group">
                <label className="form-label" htmlFor="contact-email">
                  Your Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="example@mail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="contact-input-field"
                />
              </div>

              <div className="form-field-group">
                <label className="form-label" htmlFor="contact-subject">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="เช่น ปรึกษาโปรเจกต์, สมัครงาน, สอบถามข้อมูล..."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="contact-input-field"
                />
              </div>

              <div className="form-field-group">
                <label className="form-label" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows="4"
                  placeholder="พิมพ์ข้อความของคุณที่นี่..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="contact-textarea-field"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn-send-message group"
              >
                {sending ? (
                  <>
                    <Icons.Loader2 size={18} className="animate-spin" />
                    <span>กำลังส่งข้อความ...</span>
                  </>
                ) : (
                  <>
                    <Icons.Send size={18} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
        </div>

      </div>
    </section>
  );
}
