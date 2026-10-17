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

  const defaultContacts = contacts.length > 0 ? contacts : [
    {
      id: "c-1",
      icon: "Mail",
      label: "EMAIL",
      value: "somchai.rakdee@example.com",
      link: "mailto:somchai.rakdee@example.com",
      color: "#00e5ff"
    },
    {
      id: "c-2",
      icon: "Phone",
      label: "PHONE",
      value: "089-123-4567",
      link: "tel:0891234567",
      color: "#3b82f6"
    },
    {
      id: "c-3",
      icon: "Github",
      label: "GITHUB",
      value: "github.com/somchairakdee",
      link: "https://github.com/somchairakdee",
      color: "#a855f7"
    },
    {
      id: "c-4",
      icon: "Facebook",
      label: "FACEBOOK",
      value: "facebook.com/somchairakdee",
      link: "https://facebook.com/somchairakdee",
      color: "#3b82f6"
    },
    {
      id: "c-5",
      icon: "MessageCircle",
      label: "LINE ID",
      value: "somchai_line",
      link: "#",
      color: "#10b981"
    },
    {
      id: "c-6",
      icon: "Instagram",
      label: "INSTAGRAM",
      value: "@somchairakdee",
      link: "https://instagram.com/somchairakdee",
      color: "#ec4899"
    }
  ];

  return (
    <section id="contact" className="contact-section">
      
      {/* Section Header: ลบ CONTACT & CONNECT และคำอธิบายย่อยตามภาพแนบที่ 4 */}
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
            {defaultContacts.map((contact) => {
              return (
                <a
                  key={contact.id}
                  href={contact.value?.startsWith("http") ? contact.value : contact.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-info-card group"
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
