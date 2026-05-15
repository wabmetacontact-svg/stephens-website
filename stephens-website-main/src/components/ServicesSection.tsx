import { useRef, useState, useEffect } from "react";

function useReveal(t = 0.06) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: t });
    obs.observe(el); return () => obs.disconnect();
  }, [t]);
  return { ref, v };
}

// ✅ YAHAN APNI IMAGES KE PATH DALO
const competencies = [
  {
    title: "Corporate leadership",
    subtitle: "Governance & turnaround",
    desc: "Board relations, corporate governance, organizational turnaround. Expert in navigating complex stakeholder dynamics and driving accountability at the highest levels of enterprise leadership.",
    tags: ["Board relations", "Governance", "Turnaround", "Stakeholder management"],
    image: "/images/corporate-leadership.jpg",
    stats: { label: "Board seats held", value: "6+" },
  },
  {
    title: "Strategic growth",
    subtitle: "M&A & capital markets",
    desc: "M&A advisory, capital markets, business planning, sales expansion. Proven track record in identifying opportunities, structuring complex deals, and executing growth strategies across financial services.",
    tags: ["M&A", "Capital markets", "Business planning", "Due diligence"],
    image: "/images/strategic-growth.jpg",
    stats: { label: "Deals executed", value: "20+" },
  },
  {
    title: "Operational excellence",
    subtitle: "P&L & risk management",
    desc: "P&L management, process reengineering, risk & compliance. Driving efficiency, reducing operational costs, and ensuring regulatory compliance across complex multi-state banking operations.",
    tags: ["P&L management", "Process engineering", "Risk", "Compliance"],
    image: "/images/operational-excellence.jpg",
    stats: { label: "Cost savings driven", value: "$50M+" },
  },
  {
    title: "Technology leadership",
    subtitle: "Digital banking & blockchain",
    desc: "Digital banking, data governance, blockchain, product development. Leading digital transformation initiatives, modernizing legacy platforms, and exploring emerging technologies including AI and crypto.",
    tags: ["Digital banking", "Blockchain", "Data governance", "AI/ML", "Product dev"],
    image: "/images/technology-leadership.jpg",
    stats: { label: "Digital launches", value: "8+" },
  },
  {
    title: "Financial acumen",
    subtitle: "Financial strategy & IR",
    desc: "Financial management, pricing strategy, investor relations. Deep expertise in financial planning, capital allocation, stakeholder communications, and driving profitability across business units.",
    tags: ["Financial management", "Pricing strategy", "Investor relations", "Capital allocation"],
    image: "/images/financial-acumen.jpg",
    stats: { label: "Assets managed", value: "$23B+" },
  },
  {
    title: "People & culture",
    subtitle: "Team building & mentorship",
    desc: "Team building, mentorship, executive recruitment, change management. Building high-performance teams, driving cultural transformation, and developing next-generation leadership across organizations.",
    tags: ["Team building", "Mentorship", "Executive recruiting", "Change management"],
    image: "/images/people-culture.jpg",
    stats: { label: "Leaders developed", value: "100+" },
  },
];

export default function ServicesSection() {
  const { ref: sRef, v: sV } = useReveal(.04);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = competencies.length;

  // Navigate
  const goTo = (index: number, dir: "next" | "prev") => {
    if (isAnimating || index === active) return;
    setDirection(dir);
    setIsAnimating(true);

    setTimeout(() => {
      setActive(index);
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 400);
  };

  const goNext = () => {
    const next = (active + 1) % total;
    goTo(next, "next");
  };

  const goPrev = () => {
    const prev = (active - 1 + total) % total;
    goTo(prev, "prev");
  };

  // Auto play (optional — remove if not needed)
  useEffect(() => {
    autoPlayRef.current = setTimeout(goNext, 6000);
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [active, isAnimating]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, isAnimating]);

  // 3D tilt on card
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
      card.style.transform = `perspective(1200px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateZ(10px)`;
    };

    const onLeave = () => {
      card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
      setMousePos({ x: 0.5, y: 0.5 });
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, [active]);

  const c = competencies[active];

  return (
    <section id="competencies" ref={sRef} style={{
      background: "var(--bg-section)",
      padding: "clamp(80px,12vh,140px) clamp(24px,6vw,96px)",
      borderTop: "1px solid var(--border)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "clamp(24px,4vh,40px)",
        opacity: sV ? 1 : 0,
        transform: sV ? "translateY(0)" : "translateY(16px)",
        transition: "opacity .8s ease, transform .8s ease",
      }}>
        <div style={{
          width: "32px", height: "2px",
          background: "var(--primary)", borderRadius: "1px",
          transform: sV ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform .8s ease .2s",
        }} />
        <span className="section-tag">Core competencies</span>
      </div>

      {/* Title + Navigation */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: "clamp(40px,6vh,64px)",
        flexWrap: "wrap",
        gap: "24px",
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "clamp(36px,5vw,48px)",
          fontWeight: 700,
          lineHeight: 1.15,
          color: "var(--headline)",
          maxWidth: "500px",
          transform: sV ? "translateY(0)" : "translateY(24px)",
          opacity: sV ? 1 : 0,
          transition: "transform .8s ease .1s, opacity .8s ease .1s",
        }}>
          Areas of expertise
        </h2>

        {/* Navigation controls */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          opacity: sV ? 1 : 0,
          transition: "opacity .8s ease .3s",
        }}>
          {/* Counter */}
          <div style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "18px",
            color: "var(--muted)",
            minWidth: "60px",
            textAlign: "center",
          }}>
            <span style={{ color: "var(--primary)", fontWeight: 700, fontSize: "24px" }}>
              {String(active + 1).padStart(2, "0")}
            </span>
            <span style={{ margin: "0 6px", color: "var(--border)" }}>/</span>
            <span>{String(total).padStart(2, "0")}</span>
          </div>

          {/* Prev button */}
          <button
            onClick={goPrev}
            disabled={isAnimating}
            style={{
              width: "48px", height: "48px",
              borderRadius: "12px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: isAnimating ? "not-allowed" : "pointer",
              transition: "all .3s ease",
              boxShadow: "var(--shadow-sm)",
              opacity: isAnimating ? 0.5 : 1,
            }}
            onMouseEnter={e => {
              if (!isAnimating) {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 15L7 10L12 5" stroke="var(--headline)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Next button */}
          <button
            onClick={goNext}
            disabled={isAnimating}
            style={{
              width: "48px", height: "48px",
              borderRadius: "12px",
              background: "var(--primary)",
              border: "1px solid var(--primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: isAnimating ? "not-allowed" : "pointer",
              transition: "all .3s ease",
              boxShadow: "var(--shadow-sm)",
              opacity: isAnimating ? 0.5 : 1,
            }}
            onMouseEnter={e => {
              if (!isAnimating) {
                e.currentTarget.style.background = "#1e2d3d";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "var(--primary)";
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M8 5L13 10L8 15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ═══════════════ MAIN CONTENT AREA ═══════════════ */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(28px,4vw,56px)",
        alignItems: "start",
      }} className="comp-main-grid">

        {/* ═══════ LEFT: IMAGE CARD ═══════ */}
        <div
          ref={cardRef}
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg)",
            position: "relative",
            aspectRatio: "4/3",
            transformStyle: "preserve-3d",
            transition: "transform 0.15s ease, box-shadow .4s ease",
            willChange: "transform",
          }}
        >
          {/* Image with slide animation */}
          <div style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
          }}>
            {competencies.map((comp, idx) => (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: idx === active ? (isAnimating ? 0 : 1) : 0,
                  transform: idx === active
                    ? (isAnimating
                      ? `translateX(${direction === "next" ? "40px" : "-40px"}) scale(1.05)`
                      : "translateX(0) scale(1.03)")
                    : `translateX(${direction === "next" ? "-40px" : "40px"}) scale(0.95)`,
                  transition: "all .6s cubic-bezier(.16,1,.3,1)",
                  zIndex: idx === active ? 2 : 1,
                }}
              >
                {/* Actual image */}
                <img
                  src={comp.image}
                  alt={comp.title}
                  onLoad={() => setImageLoaded(prev => ({ ...prev, [idx]: true }))}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    opacity: imageLoaded[idx] ? 1 : 0,
                    transition: "opacity .5s ease, transform .3s ease",
                    transform: idx === active
                      ? `translate(${(mousePos.x - 0.5) * -8}px, ${(mousePos.y - 0.5) * -8}px) scale(1.05)`
                      : "scale(1)",
                  }}
                />

                {/* Placeholder */}
                {!imageLoaded[idx] && (
                  <ImagePlaceholder index={idx} title={comp.title} />
                )}
              </div>
            ))}
          </div>

          {/* Overlay gradients */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 3,
            background: "linear-gradient(to top, rgba(27,31,35,0.7) 0%, rgba(27,31,35,0.2) 40%, transparent 100%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", inset: 0, zIndex: 3,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 30%)",
            pointerEvents: "none",
          }} />

          {/* Mouse glow */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 3,
            background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            pointerEvents: "none",
            opacity: 0.8,
          }} />

          {/* Top accent bar */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: "3px", background: "var(--primary)", zIndex: 5,
          }} />

          {/* Content overlay */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 4,
            display: "flex", flexDirection: "column",
            justifyContent: "space-between",
            padding: "clamp(20px,3vw,32px)",
          }}>
            {/* Top badge */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            }}>
              <div style={{
                background: "rgba(255,255,255,0.95)",
                borderRadius: "8px", padding: "8px 16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                opacity: isAnimating ? 0 : 1,
                transform: isAnimating ? "translateY(-10px)" : "translateY(0)",
                transition: "all .5s ease .2s",
              }}>
                <span style={{
                  fontSize: "12px", fontWeight: 700,
                  color: "var(--primary)",
                  letterSpacing: ".1em", textTransform: "uppercase",
                }}>
                  {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
              </div>

              {/* Stat badge */}
              <div style={{
                background: "rgba(255,255,255,0.95)",
                borderRadius: "8px", padding: "8px 16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                textAlign: "right",
                opacity: isAnimating ? 0 : 1,
                transform: isAnimating ? "translateY(-10px)" : "translateY(0)",
                transition: "all .5s ease .25s",
              }}>
                <p style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase" }}>{c.stats.label}</p>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--primary)", fontFamily: "'Playfair Display',serif" }}>{c.stats.value}</p>
              </div>
            </div>

            {/* Bottom title */}
            <div style={{
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? "translateY(20px)" : "translateY(0)",
              transition: "all .5s ease .15s",
            }}>
              <p style={{
                fontSize: "11px", fontWeight: 600, letterSpacing: ".15em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "6px",
              }}>{c.subtitle}</p>
              <h3 style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "clamp(24px,3.5vw,36px)",
                fontWeight: 700, color: "#FFFFFF",
                lineHeight: 1.15, letterSpacing: "-.01em",
              }}>{c.title}</h3>
            </div>
          </div>

          {/* Corner accents */}
          {[
            { top: "12px", left: "12px", borderTop: "2px solid rgba(255,255,255,0.3)", borderLeft: "2px solid rgba(255,255,255,0.3)" },
            { top: "12px", right: "12px", borderTop: "2px solid rgba(255,255,255,0.2)", borderRight: "2px solid rgba(255,255,255,0.2)" },
            { bottom: "12px", left: "12px", borderBottom: "2px solid rgba(255,255,255,0.2)", borderLeft: "2px solid rgba(255,255,255,0.2)" },
            { bottom: "12px", right: "12px", borderBottom: "2px solid rgba(255,255,255,0.2)", borderRight: "2px solid rgba(255,255,255,0.2)" },
          ].map((s, idx) => (
            <div key={idx} style={{
              position: "absolute", width: "20px", height: "20px",
              ...s, zIndex: 5,
            }} />
          ))}
        </div>

        {/* ═══════ RIGHT: DETAILS ═══════ */}
        <div style={{ position: "sticky", top: "100px" }}>

          {/* Animated content */}
          <div style={{
            opacity: isAnimating ? 0 : 1,
            transform: isAnimating
              ? `translateX(${direction === "next" ? "30px" : "-30px"})`
              : "translateX(0)",
            transition: "all .5s cubic-bezier(.16,1,.3,1)",
          }}>
            {/* Category label */}
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              marginBottom: "20px",
            }}>
              <div style={{
                width: "28px", height: "2px",
                background: "var(--primary)", borderRadius: "1px",
              }} />
              <span style={{
                fontSize: "12px", fontWeight: 600,
                letterSpacing: ".15em", textTransform: "uppercase",
                color: "var(--primary)",
              }}>{c.subtitle}</span>
            </div>

            {/* Title */}
            <h3 style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(28px,4vw,36px)",
              fontWeight: 700,
              color: "var(--headline)",
              lineHeight: 1.15,
              letterSpacing: "-.02em",
              marginBottom: "20px",
            }}>{c.title}</h3>

            {/* Divider */}
            <div style={{
              height: "2px", width: "48px",
              background: "var(--primary)", borderRadius: "1px",
              marginBottom: "24px",
            }} />

            {/* Description */}
            <p style={{
              fontSize: "17px",
              lineHeight: 1.8,
              color: "var(--body)",
              marginBottom: "32px",
              maxWidth: "520px",
            }}>{c.desc}</p>

            {/* Tags */}
            <div style={{
              display: "flex", flexWrap: "wrap", gap: "8px",
              marginBottom: "36px",
            }}>
              {c.tags.map((tag, i) => (
                <span key={tag} style={{
                  fontSize: "13px", fontWeight: 500,
                  color: "var(--primary)",
                  background: "var(--primary-05)",
                  border: "1px solid var(--primary-10)",
                  padding: "6px 16px", borderRadius: "8px",
                  transition: "all .3s ease",
                  opacity: isAnimating ? 0 : 1,
                  transform: isAnimating ? "translateY(8px)" : "translateY(0)",
                  transitionDelay: `${0.1 + i * 0.05}s`,
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "var(--primary)";
                    e.currentTarget.style.color = "#FFFFFF";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "var(--primary-05)";
                    e.currentTarget.style.color = "var(--primary)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >{tag}</span>
              ))}
            </div>

            {/* Stat card */}
            <div className="card" style={{
              padding: "20px 24px",
              display: "flex", alignItems: "center", gap: "20px",
              marginBottom: "32px",
            }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "14px",
                background: "var(--primary-05)",
                border: "1px solid var(--primary-10)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "20px", fontWeight: 700,
                  color: "var(--primary)",
                }}>{c.stats.value.replace(/[^0-9$]/g, "").slice(0, 3)}</span>
              </div>
              <div>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "2px" }}>{c.stats.label}</p>
                <p style={{ fontSize: "22px", fontWeight: 700, color: "var(--primary)", fontFamily: "'Playfair Display',serif" }}>{c.stats.value}</p>
              </div>
            </div>

            {/* CTA */}
            <a href="#contact" className="btn btn-primary">
              Discuss further →
            </a>
          </div>

          {/* Dot indicators */}
          <div style={{
            display: "flex", gap: "8px",
            marginTop: "40px",
          }}>
            {competencies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx, idx > active ? "next" : "prev")}
                style={{
                  width: idx === active ? "32px" : "10px",
                  height: "10px",
                  borderRadius: "5px",
                  background: idx === active ? "var(--primary)" : "var(--border)",
                  border: "none",
                  transition: "all .4s cubic-bezier(.16,1,.3,1)",
                  cursor: "pointer",
                  opacity: idx === active ? 1 : 0.6,
                }}
                onMouseEnter={e => {
                  if (idx !== active) {
                    e.currentTarget.style.background = "var(--secondary)";
                    e.currentTarget.style.opacity = "0.8";
                    e.currentTarget.style.width = "16px";
                  }
                }}
                onMouseLeave={e => {
                  if (idx !== active) {
                    e.currentTarget.style.background = "var(--border)";
                    e.currentTarget.style.opacity = "0.6";
                    e.currentTarget.style.width = "10px";
                  }
                }}
              />
            ))}
          </div>

          {/* Mini card navigation */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "8px",
            marginTop: "24px",
          }}>
            {competencies.map((comp, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx, idx > active ? "next" : "prev")}
                style={{
                  padding: "12px 10px",
                  borderRadius: "10px",
                  background: idx === active ? "var(--primary-05)" : "var(--bg-card)",
                  border: `1.5px solid ${idx === active ? "var(--primary)" : "var(--border)"}`,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all .3s ease",
                  boxShadow: idx === active ? "var(--shadow-sm)" : "none",
                }}
                onMouseEnter={e => {
                  if (idx !== active) {
                    e.currentTarget.style.borderColor = "var(--secondary)";
                    e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={e => {
                  if (idx !== active) {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                <span style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: idx === active ? "var(--primary)" : "var(--muted)",
                  letterSpacing: ".08em",
                  display: "block",
                  marginBottom: "2px",
                }}>{String(idx + 1).padStart(2, "0")}</span>
                <span style={{
                  fontSize: "12px",
                  fontWeight: idx === active ? 600 : 500,
                  color: idx === active ? "var(--headline)" : "var(--muted)",
                  lineHeight: 1.3,
                  display: "block",
                }}>{comp.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="comp-mobile-nav" style={{
        display: "none",
        justifyContent: "center",
        gap: "12px",
        marginTop: "32px",
      }}>
        <button onClick={goPrev} disabled={isAnimating} className="btn btn-outline" style={{ padding: "12px 24px" }}>
          ← Previous
        </button>
        <button onClick={goNext} disabled={isAnimating} className="btn btn-primary" style={{ padding: "12px 24px" }}>
          Next →
        </button>
      </div>

      <style>{`
        @media(max-width:768px){
          .comp-main-grid{grid-template-columns:1fr!important;}
          .comp-mobile-nav{display:flex!important;}
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════
// IMAGE PLACEHOLDER
// ═══════════════════════════════════════════════════
function ImagePlaceholder({ index, title }: { index: number; title: string }) {
  const colors = [
    { bg: "linear-gradient(135deg, #2C3E55 0%, #4F6D8A 100%)", text: "rgba(255,255,255,0.15)" },
    { bg: "linear-gradient(135deg, #4F6D8A 0%, #6B8CAE 100%)", text: "rgba(255,255,255,0.12)" },
    { bg: "linear-gradient(135deg, #3A5068 0%, #2C3E55 100%)", text: "rgba(255,255,255,0.15)" },
    { bg: "linear-gradient(135deg, #2C3E55 0%, #1e2d3d 100%)", text: "rgba(255,255,255,0.12)" },
    { bg: "linear-gradient(135deg, #4F6D8A 0%, #3A5068 100%)", text: "rgba(255,255,255,0.15)" },
    { bg: "linear-gradient(135deg, #1e2d3d 0%, #4F6D8A 100%)", text: "rgba(255,255,255,0.12)" },
  ];

  const c = colors[index % colors.length];
  const icons = ["◆", "◈", "○", "◎", "□", "✦"];

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: c.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>
      {/* Pattern */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />

      {/* Decorative circles */}
      <div style={{
        position: "absolute", top: "15%", right: "10%",
        width: "150px", height: "150px", borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.08)",
      }} />
      <div style={{
        position: "absolute", bottom: "20%", left: "8%",
        width: "100px", height: "100px", borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.06)",
      }} />

      {/* Icon */}
      <div style={{
        fontSize: "64px",
        color: c.text,
        marginBottom: "16px",
        animation: "floatY 4s ease infinite",
      }}>{icons[index]}</div>

      {/* Title */}
      <p style={{
        fontSize: "14px",
        fontWeight: 600,
        color: "rgba(255,255,255,0.3)",
        letterSpacing: ".1em",
        textTransform: "uppercase",
        textAlign: "center",
        padding: "0 20px",
      }}>{title}</p>
    </div>
  );
}