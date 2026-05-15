import { useEffect, useRef, useState } from "react";

function useReveal(t = 0.05) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: t });
    obs.observe(el); return () => obs.disconnect();
  }, [t]);
  return { ref, v };
}

const boardRoles = [
  { company: "OneTrust Home Loans", role: "Senior advisor & board member", period: "2020–2023" },
  { company: "GuideIT (Perot company)", role: "Senior advisor & board member", period: "2018–2021" },
  { company: "Tulsa Youth Symphony", role: "Chairman", period: "2012–2018" },
  { company: "Indian Nations Boy Scouts", role: "Executive board member", period: "2018–2025" },
];

const associations = [
  "Mid-Sized Bank Coalition",
  "Texas Business Leadership Council",
  "Texas Blockchain Council",
  "Turnaround Management Association",
  "Association for Corporate Growth",
];

export default function ContactSection() {
  const { ref: sRef, v: sV } = useReveal(.04);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <section id="contact" ref={sRef} style={{
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
      }}>
        {/* Header area */}
        <div style={{ padding: "clamp(80px,12vh,140px) clamp(24px,6vw,96px) clamp(48px,7vh,80px)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            marginBottom: "clamp(24px,4vh,40px)",
            opacity: sV ? 1 : 0, transform: sV ? "translateY(0)" : "translateY(16px)",
            transition: "opacity .8s ease, transform .8s ease",
          }}>
            <div style={{ width: "32px", height: "2px", background: "var(--primary)", borderRadius: "1px" }} />
            <span className="section-tag">Contact</span>
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "clamp(36px,6vw,56px)",
            fontWeight: 700, lineHeight: 1.1,
            color: "var(--headline)",
            marginBottom: "24px",
            maxWidth: "600px",
            transform: sV ? "translateY(0)" : "translateY(24px)",
            opacity: sV ? 1 : 0,
            transition: "transform .8s ease .1s, opacity .8s ease .1s",
          }}>
            Let's discuss your next opportunity
          </h2>

          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: "20px",
            opacity: sV ? 1 : 0, transition: "opacity .8s ease .3s",
          }}>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: "4px" }}>Direct line</p>
              <a href="tel:+19174393905" style={{
                fontFamily: "'Playfair Display',serif", fontStyle: "italic",
                fontSize: "clamp(20px,3vw,28px)", color: "var(--primary)", textDecoration: "none",
                transition: "color .3s ease",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--secondary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--primary)")}
              >(917) 439-3905</a>
            </div>
            <a href="#contact-form" className="btn btn-primary">Send a message</a>
          </div>
        </div>

        <div style={{ height: "1px", marginLeft: "clamp(24px,6vw,96px)", marginRight: "clamp(24px,6vw,96px)", background: "var(--border)" }} />

        {/* Form + Info */}
        <div id="contact-form" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr" }} className="c-grid">
          {/* Form */}
          <div style={{
            padding: "clamp(40px,6vh,72px) clamp(24px,6vw,96px)",
            borderRight: "1px solid var(--border)",
            opacity: sV ? 1 : 0, transition: "opacity .8s ease .4s",
          }}>
            <p style={{ fontSize: "13px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "32px" }}>Send a message</p>

            {sent ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "320px", gap: "16px", textAlign: "center" }}>
                <div style={{
                  width: "64px", height: "64px", borderRadius: "50%",
                  background: "var(--primary-05)", border: "2px solid var(--primary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "24px", color: "var(--primary)",
                  animation: "scaleIn .4s ease",
                }}>✓</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "32px", color: "var(--headline)" }}>Message sent</h3>
                <p style={{ fontSize: "16px", color: "var(--muted)", maxWidth: "280px" }}>Thank you for reaching out. I'll respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 28px" }} className="f-row">
                  {[{ k: "name", l: "Your name", p: "John Smith" }, { k: "email", l: "Email address", p: "john@company.com" }].map(({ k, l, p }) => (
                    <Field key={k} fk={k} label={l} ph={p} val={form[k as keyof typeof form]} focused={focused} setFocused={setFocused} onChange={v => setForm(f => ({ ...f, [k]: v }))} />
                  ))}
                </div>
                <div style={{
                  marginBottom: "32px",
                  borderBottom: `2px solid ${focused === "message" ? "var(--primary)" : "var(--border)"}`,
                  transition: "border-color .3s ease",
                }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: focused === "message" ? "var(--primary)" : "var(--muted)", paddingTop: "20px", transition: "color .3s ease" }}>Message</label>
                  <textarea placeholder="Tell me about the opportunity..." rows={4}
                    value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    onFocus={() => setFocused("message")} onBlur={() => setFocused(null)} required
                    style={{ width: "100%", background: "transparent", border: "none", outline: "none", resize: "none", color: "var(--headline)", fontSize: "16px", padding: "12px 0 16px", lineHeight: 1.6 }} />
                </div>
                <button type="submit" className="btn btn-primary">Send message →</button>
              </form>
            )}
          </div>

          {/* Info */}
          <div style={{
            padding: "clamp(40px,6vh,72px) clamp(24px,4vw,56px)",
            display: "flex", flexDirection: "column", gap: "28px",
            opacity: sV ? 1 : 0, transition: "opacity .8s ease .6s",
          }}>
            {/* Info cards */}
            {[
              { label: "Location", val: "Dallas, Texas", sub: "Available worldwide", icon: "◎" },
              { label: "Response", val: "Within 24 hours", sub: "Mon–Fri, 9am–6pm CST", icon: "◌" },
              { label: "Status", val: "Open for opportunities", sub: "Board, advisory & executive", icon: "✦", dot: true },
            ].map(({ label, val, sub, icon, dot }) => (
              <div key={label} className="card" style={{ padding: "20px 24px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0, background: "var(--primary-05)", border: "1px solid var(--primary-10)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "var(--primary)" }}>{icon}</div>
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "4px" }}>{label}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                      {dot && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", animation: "pulse 2s ease infinite" }} />}
                      <p style={{ fontSize: "16px", fontWeight: 500, color: "var(--headline)" }}>{val}</p>
                    </div>
                    <p style={{ fontSize: "13px", color: "var(--muted)" }}>{sub}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Board roles */}
            <div>
              <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "12px" }}>Board memberships</p>
              <div className="card" style={{ overflow: "hidden", padding: 0 }}>
                {boardRoles.map(({ company, role, period }, si) => (
                  <div key={company} style={{ padding: "14px 20px", borderBottom: si < boardRoles.length - 1 ? "1px solid var(--border-light)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--headline)", marginBottom: "2px" }}>{company}</p>
                      <p style={{ fontSize: "12px", color: "var(--muted)" }}>{role}</p>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--primary)" }}>{period}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Associations */}
            <div>
              <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "12px" }}>Associations</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {associations.map(name => (
                  <span key={name} style={{
                    fontSize: "13px", fontWeight: 500, color: "var(--body)",
                    background: "var(--bg-card)", border: "1px solid var(--border)",
                    padding: "6px 14px", borderRadius: "8px",
                    transition: "all .3s ease",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "var(--primary)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--body)"; }}
                  >{name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`@media(max-width:768px){.c-grid{grid-template-columns:1fr!important;}.f-row{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* Footer */}
      <footer style={{
        background: "var(--bg-section)",
        borderTop: "1px solid var(--border)",
        padding: "clamp(32px,5vh,56px) clamp(24px,6vw,96px)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "24px" }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "22px", fontWeight: 700, color: "var(--headline)" }}>
            Stephen<span style={{ color: "var(--secondary)" }}>.</span>
          </span>
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            {["About", "Experience", "Competencies", "Contact"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{
                fontSize: "13px", fontWeight: 500, color: "var(--muted)",
                textDecoration: "none", transition: "color .3s ease",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
              >{item}</a>
            ))}
          </div>
          <p style={{ fontSize: "13px", color: "var(--faint)" }}>© 2025 Stephen K. Curry</p>
        </div>
        <div style={{ paddingTop: "20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "12px", color: "var(--faint)" }}>Transformational executive leadership — Dallas, Texas</p>
          <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: "14px", color: "var(--faint)" }}>"Excellence in execution, integrity in action."</p>
        </div>
      </footer>
    </>
  );
}

function Field({ fk, label, ph, val, focused, setFocused, onChange }: { fk: string; label: string; ph: string; val: string; focused: string | null; setFocused: (s: string | null) => void; onChange: (v: string) => void }) {
  const isF = focused === fk;
  return (
    <div style={{
      borderBottom: `2px solid ${isF ? "var(--primary)" : "var(--border)"}`,
      transition: "border-color .3s ease", marginBottom: "8px",
    }}>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: isF ? "var(--primary)" : "var(--muted)", paddingTop: "20px", transition: "color .3s ease" }}>{label}</label>
      <input type="text" placeholder={ph} value={val}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(fk)} onBlur={() => setFocused(null)} required
        style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "var(--headline)", fontSize: "16px", padding: "12px 0 16px" }} />
    </div>
  );
}