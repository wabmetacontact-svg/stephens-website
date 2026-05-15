import { useEffect, useRef, useState } from "react";
import { FloatingParticles, WireframeSphere } from "./Scene3D";

function SplitText({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span>
      {text.split("").map((c, i) => (
        <span key={i} className="char">
          <span className="char-inner" style={{ animationDelay: `${delay + i * 0.03}s` }}>
            {c === " " ? "\u00A0" : c}
          </span>
        </span>
      ))}
    </span>
  );
}

const roles = [
  "Transformational executive",
  "Banking & fintech leader",
  "M&A strategist",
  "Board advisor",
  "Turnaround specialist"
];

function CountUp({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [n, setN] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let s = 0;
    const step = end / (1800 / 16);
    const t = setInterval(() => {
      s += step;
      if (s >= end) { setN(end); clearInterval(t); }
      else setN(Math.floor(s));
    }, 16);
    return () => clearInterval(t);
  }, [started, end]);

  return <span ref={ref}>{prefix}{n}{suffix}</span>;
}

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const [role, setRole] = useState(0);
  const [txt, setTxt] = useState(roles[0]);
  const [del, setDel] = useState(false);
  const [cnt, setCnt] = useState(roles[0].length);

  // Typewriter
  useEffect(() => {
    const cur = roles[role];
    let t: ReturnType<typeof setTimeout>;
    if (!del && cnt < cur.length)
      t = setTimeout(() => { setTxt(cur.slice(0, cnt + 1)); setCnt(c => c + 1); }, 72);
    else if (!del && cnt === cur.length)
      t = setTimeout(() => setDel(true), 2400);
    else if (del && cnt > 0)
      t = setTimeout(() => { setTxt(cur.slice(0, cnt - 1)); setCnt(c => c - 1); }, 36);
    else if (del && cnt === 0) {
      setDel(false);
      setRole(r => (r + 1) % roles.length);
    }
    return () => clearTimeout(t);
  }, [cnt, del, role]);

  // Parallax
  useEffect(() => {
    const onScroll = () => {
      heroRef.current?.querySelectorAll<HTMLElement>("[data-d]").forEach(el => {
        el.style.transform = `translateY(${window.scrollY * parseFloat(el.dataset.d || "0")}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <section ref={heroRef} id="home" style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      padding: "0 clamp(24px,6vw,96px)",
      paddingTop: "120px",
      paddingBottom: "80px",
      background: "var(--bg)",
    }}>
      {/* 3D Particles */}
      <FloatingParticles count={40} color="75,30,120" />

      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(75,30,120,0.07) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        maskImage: "radial-gradient(ellipse at 30% 50%, black 15%, transparent 65%)",
        WebkitMaskImage: "radial-gradient(ellipse at 30% 50%, black 15%, transparent 65%)",
      }} />

      {/* ═══════════════ MAIN GRID LAYOUT ═══════════════ */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr",
        gap: "clamp(40px,6vw,80px)",
        alignItems: "center",
        position: "relative",
        zIndex: 2,
      }} className="hero-grid">

        {/* ═══════ LEFT: TEXT CONTENT ═══════ */}
        <div style={{ maxWidth: "720px" }}>
          {/* Status badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            marginBottom: "clamp(32px,5vh,56px)",
          }}>
            <div className="fade-up" style={{
              animationDelay: ".5s",
              padding: "8px 20px",
              display: "flex", alignItems: "center", gap: "10px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "100px",
              boxShadow: "var(--shadow-sm)",
            }}>
              <div style={{ position: "relative", width: "8px", height: "8px" }}>
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: "#22c55e", animation: "pulse 2.5s ease infinite",
                }} />
                <div style={{
                  position: "absolute", inset: "-3px", borderRadius: "50%",
                  border: "1px solid #22c55e", animation: "pulseRing 2.5s ease infinite",
                }} />
              </div>
              <span style={{
                fontSize: "13px", fontWeight: 500, color: "var(--muted)",
              }}>Open for board & advisory roles</span>
            </div>
          </div>

          {/* Name */}
          <h1 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "clamp(48px,8vw,64px)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-.02em",
            color: "var(--headline)",
            marginBottom: "clamp(16px,2vh,24px)",
          }}>
            <SplitText text="Stephen K. Curry" delay={.6} />
          </h1>

          {/* Typewriter */}
          <div className="fade-up" style={{
            animationDelay: "1.4s",
            display: "flex", alignItems: "center", gap: "12px",
            marginBottom: "clamp(20px,3vh,32px)",
          }}>
            <div style={{
              width: "32px", height: "2px",
              background: "var(--primary)", borderRadius: "1px",
            }} />
            <span style={{
              fontSize: "18px", fontWeight: 400, color: "var(--secondary)",
            }}>
              {txt}
              <span style={{
                color: "var(--primary)", marginLeft: "2px",
                animation: "blink 1.1s step-end infinite",
              }}>|</span>
            </span>
          </div>

          {/* Description */}
          <p className="fade-up" style={{
            animationDelay: "1.6s",
            fontSize: "18px",
            lineHeight: 1.8,
            color: "var(--body)",
            maxWidth: "560px",
            marginBottom: "clamp(28px,4vh,44px)",
            fontWeight: 400,
          }}>
            Strategic, people-centered executive with a track record of driving innovation,
            complex transformations, and business growth across financial institutions and fintech ventures.
          </p>

          {/* Divider */}
          <div style={{
            height: "2px",
            background: "linear-gradient(90deg, var(--primary), var(--secondary), transparent)",
            marginBottom: "clamp(24px,3vh,36px)",
            transformOrigin: "left",
            transform: "scaleX(0)",
            animation: "lineGrow 1.2s cubic-bezier(.16,1,.3,1) 1.8s forwards",
            borderRadius: "1px",
          }} />

          {/* CTAs */}
          <div style={{
            display: "flex", gap: "16px", alignItems: "center",
            flexWrap: "wrap",
          }}>
            <a href="#experience" className="btn btn-primary fade-up" style={{ animationDelay: "2s" }}>
              View experience
            </a>
            <a href="#contact" className="btn btn-outline fade-up" style={{ animationDelay: "2.1s" }}>
              Get in touch
            </a>
          </div>

          {/* Phone */}
          <div className="fade-up" style={{
            animationDelay: "2.3s",
            marginTop: "clamp(24px,3vh,36px)",
            display: "flex", alignItems: "center", gap: "10px",
          }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "var(--primary-05)",
              border: "1px solid var(--primary-10)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", color: "var(--primary)",
            }}>✆</div>
            <a href="tel:+19174393905" style={{
              fontSize: "15px", fontWeight: 500,
              color: "var(--muted)", textDecoration: "none",
              transition: "color .3s ease",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
            >(917) 439-3905</a>
          </div>
        </div>

        {/* ═══════ RIGHT: SPHERE + STATS ═══════ */}
        <div className="hero-right" style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "500px",
        }}>

          {/* Wireframe Sphere */}
          <div data-d="0.04" style={{
            position: "relative",
            zIndex: 1,
            opacity: 0.6,
            pointerEvents: "none",
          }}>
            <WireframeSphere size={320} />

            {/* Orbiting ring */}
            <div style={{
              position: "absolute", inset: "-24px",
              animation: "rotateSlow 28s linear infinite",
              borderRadius: "50%",
              border: "1px solid rgba(44,62,85,0.1)",
            }}>
              <div style={{
                position: "absolute", top: "-4px", left: "50%",
                width: "8px", height: "8px", borderRadius: "50%",
                background: "var(--primary)", transform: "translateX(-50%)",
                boxShadow: "0 0 12px rgba(44,62,85,0.4)",
              }} />
            </div>

            {/* Inner ring */}
            <div style={{
              position: "absolute", inset: "50px",
              animation: "rotateRev 20s linear infinite",
              borderRadius: "50%",
              border: "1px solid rgba(44,62,85,0.06)",
            }}>
              <div style={{
                position: "absolute", bottom: "-3px", right: "30%",
                width: "6px", height: "6px", borderRadius: "50%",
                background: "var(--secondary)",
                boxShadow: "0 0 10px rgba(79,109,138,0.4)",
              }} />
            </div>
          </div>

          {/* ═══════ STATS CARDS — Floating around sphere ═══════ */}

          {/* Stat 1: $23B+ — Top right */}
          <div className="fade-up" style={{
            animationDelay: "2.2s",
            position: "absolute",
            top: "clamp(20px,5%,60px)",
            right: "clamp(-10px,2%,20px)",
            zIndex: 3,
          }}>
            <StatCard
              end={23}
              prefix="$"
              suffix="B+"
              label="Assets managed"
              index={0}
            />
          </div>

          {/* Stat 2: 35+ — Left middle */}
          <div className="fade-up" style={{
            animationDelay: "2.35s",
            position: "absolute",
            top: "50%",
            left: "clamp(-20px,-2%,0px)",
            transform: "translateY(-50%)",
            zIndex: 3,
          }}>
            <StatCard
              end={35}
              suffix="+"
              label="Years experience"
              index={1}
            />
          </div>

          {/* Stat 3: 70+ — Bottom right */}
          <div className="fade-up" style={{
            animationDelay: "2.5s",
            position: "absolute",
            bottom: "clamp(20px,5%,60px)",
            right: "clamp(10px,8%,40px)",
            zIndex: 3,
          }}>
            <StatCard
              end={70}
              suffix="+"
              label="Clients advised"
              index={2}
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="fade-up" style={{
        animationDelay: "2.6s",
        position: "absolute",
        bottom: "40px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        zIndex: 2,
      }}>
        <div style={{
          width: "28px", height: "44px", borderRadius: "14px",
          border: "2px solid var(--border)",
          display: "flex", alignItems: "flex-start", justifyContent: "center",
          padding: "8px",
        }}>
          <div style={{
            width: "3px", height: "8px", borderRadius: "2px",
            background: "var(--primary)",
            animation: "scrollDot 1.6s ease infinite",
          }} />
        </div>
        <span style={{
          fontSize: "11px", letterSpacing: ".15em",
          textTransform: "uppercase", color: "var(--muted)",
        }}>Scroll</span>
      </div>

      <style>{`
        @media(max-width:900px){
          .hero-grid{
            grid-template-columns:1fr!important;
          }
          .hero-right{
            min-height:400px!important;
            margin-top:40px;
          }
        }
        @media(max-width:600px){
          .hero-right{
            display:none!important;
          }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════
// STAT CARD COMPONENT
// ═══════════════════════════════════════════════════
function StatCard({ end, prefix = "", suffix, label, index }: {
  end: number;
  prefix?: string;
  suffix: string;
  label: string;
  index: number;
}) {
  const [hov, setHov] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `
        perspective(600px)
        rotateX(${-y * 12}deg)
        rotateY(${x * 12}deg)
        translateZ(8px)
        scale(1.02)
      `;
    };

    const onLeave = () => {
      el.style.transform = "perspective(600px) rotateX(0) rotateY(0) translateZ(0) scale(1)";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "var(--bg-card)",
        border: `1.5px solid ${hov ? "var(--primary)" : "var(--border)"}`,
        borderRadius: "16px",
        padding: "clamp(16px,2vw,24px) clamp(20px,2.5vw,32px)",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        boxShadow: hov ? "var(--shadow-lg)" : "var(--shadow-md)",
        transition: "border-color .3s ease, box-shadow .3s ease, transform .15s ease",
        transformStyle: "preserve-3d",
        willChange: "transform",
        animation: `floatY ${3 + index * 0.5}s ease infinite`,
        animationDelay: `${index * 0.3}s`,
        backdropFilter: "blur(12px)",
        minWidth: "180px",
      }}
    >
      {/* Left accent */}
      <div style={{
        position: "absolute",
        left: 0,
        top: "20%",
        bottom: "20%",
        width: "3px",
        borderRadius: "0 3px 3px 0",
        background: hov ? "var(--primary)" : "transparent",
        transition: "background .3s ease",
      }} />

      {/* Icon container */}
      <div style={{
        width: "44px",
        height: "44px",
        borderRadius: "12px",
        background: hov ? "var(--primary)" : "var(--primary-05)",
        border: `1px solid ${hov ? "var(--primary)" : "var(--primary-10)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "all .3s ease",
      }}>
        <span style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "16px",
          fontWeight: 700,
          color: hov ? "#FFFFFF" : "var(--primary)",
          transition: "color .3s ease",
        }}>
          {index === 0 ? "$" : index === 1 ? "Y" : "#"}
        </span>
      </div>

      {/* Content */}
      <div style={{ position: "relative" }}>
        <div style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "clamp(24px,3vw,32px)",
          fontWeight: 700,
          color: "var(--primary)",
          lineHeight: 1,
          marginBottom: "2px",
        }}>
          <CountUp end={end} prefix={prefix} suffix={suffix} />
        </div>
        <div style={{
          fontSize: "12px",
          fontWeight: 500,
          color: "var(--muted)",
          letterSpacing: ".02em",
        }}>{label}</div>
      </div>
    </div>
  );
}