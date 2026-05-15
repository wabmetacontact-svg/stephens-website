import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(dh > 0 ? (y / dh) * 100 : 0);
      ["home", "about", "experience", "competencies", "contact"].reverse().forEach(id => {
        const el = document.getElementById(id);
        if (el && y >= el.offsetTop - 140) setActive(id);
      });
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["About", "Experience", "Competencies", "Blog", "Contact"];

  return (
    <>
      {/* Progress */}
      <div style={{
        position: "fixed", top: 0, left: 0, height: "2px",
        width: `${progress}%`,
        background: "var(--grad-primary)",
        zIndex: 10001,
        transition: "width .08s linear",
      }} />

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        height: scrolled ? "64px" : "80px",
        padding: "0 clamp(24px,5vw,80px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all .4s ease",
        background: scrolled ? "rgba(248,245,252,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        boxShadow: scrolled ? "var(--shadow-sm)" : "none",
      }}>
        {/* Logo */}
        <a href="#home" className="fade-up" style={{
          animationDelay: ".15s",
          fontFamily: "'Playfair Display',serif",
          fontSize: "24px", fontWeight: 700,
          letterSpacing: "-.01em", textDecoration: "none",
          color: "var(--headline)",
          display: "flex", alignItems: "baseline",
        }}>
          Stephen<span style={{ color: "var(--secondary)", fontSize: "28px", marginLeft: "2px" }}>.</span>
        </a>

        {/* Desktop links */}
        <div id="nav-links" style={{
          display: "flex", alignItems: "center",
          gap: "clamp(28px,4vw,48px)",
        }}>
          {links.map((item, i) => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="nav-link fade-up"
              style={{
                animationDelay: `${.25 + i * .07}s`,
                color: active === item.toLowerCase() ? "var(--primary)" : "var(--muted)",
                fontWeight: active === item.toLowerCase() ? 600 : 500,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--headline)")}
              onMouseLeave={e => (e.currentTarget.style.color =
                active === item.toLowerCase() ? "var(--primary)" : "var(--muted)")}
            >{item}</a>
          ))}
        </div>

        {/* CTA */}
        <a href="#contact" className="btn btn-primary fade-up" id="nav-cta"
          style={{ animationDelay: ".6s", padding: "10px 24px", fontSize: "13px" }}>
          Get in Touch
        </a>

        {/* Hamburger */}
        <button id="hamburger" onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "10px", width: "44px", height: "44px",
            display: "none", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: "5px",
          }}>
          {[0, 1, 2].map(j => (
            <span key={j} style={{
              display: "block", height: "2px", borderRadius: "1px",
              background: j === 1 ? "var(--primary)" : "var(--headline)",
              width: j === 1 ? (menuOpen ? "18px" : "12px") : "18px",
              transition: "all .35s ease",
              transform: j === 0 && menuOpen ? "rotate(45deg) translate(4.5px,4.5px)"
                : j === 2 && menuOpen ? "rotate(-45deg) translate(4.5px,-4.5px)" : "none",
              opacity: j === 1 && menuOpen ? 0 : 1,
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(248,245,252,0.98)",
        backdropFilter: "blur(30px)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        clipPath: menuOpen ? "circle(150% at 95% 5%)" : "circle(0% at 95% 5%)",
        transition: "clip-path .7s cubic-bezier(.16,1,.3,1)",
        pointerEvents: menuOpen ? "all" : "none",
        gap: "8px",
      }}>
        {links.map((item, i) => (
          <a key={item} href={`#${item.toLowerCase()}`}
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(36px,9vw,64px)",
              fontWeight: 600, letterSpacing: "-.02em",
              lineHeight: 1.3, textDecoration: "none",
              color: "var(--muted)",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(-20px)",
              transition: `opacity .4s ease ${.08 + i * .08}s, transform .4s ease ${.08 + i * .08}s, color .3s ease`,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
          >{item}</a>
        ))}
        <a href="tel:+19174393905" style={{
          marginTop: "28px", fontSize: "14px", letterSpacing: ".08em",
          color: "var(--secondary)", textDecoration: "none",
          fontFamily: "'Inter',sans-serif",
          opacity: menuOpen ? 1 : 0, transition: "opacity .4s ease .5s",
        }}>(917) 439-3905</a>
      </div>

      <style>{`
        @media(max-width:768px){
          #nav-links{display:none!important;}
          #nav-cta{display:none!important;}
          #hamburger{display:flex!important;}
        }
      `}</style>
    </>
  );
}