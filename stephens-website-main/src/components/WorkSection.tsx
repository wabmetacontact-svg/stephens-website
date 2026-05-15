import { useRef, useState, useEffect } from "react";

const experiences = [
  {
    company: "Beal Bank Texas & Beal Bank USA",
    role: "President",
    period: "Oct 2023 – Sep 2025",
    desc: "Successfully managed $23 billion banks through the complex regulatory environment following the collapse of SVB and Signature Bank.",
    achievements: [
      "Managed $23B banks through post-SVB regulatory challenges",
      "Revamped governance and board structure",
      "Launched digital banking under 'Better by Beal'",
      "Explored stablecoins, BTC lending & custody",
      "Completed divestiture and transition into Monet Bank",
      "Achieved all regulatory and shareholder goals",
    ],
  },
  {
    company: "Endurance Advisory Partners",
    role: "Founder & CEO",
    period: "Jan 2009 – Present",
    desc: "Built boutique consultancy of 12 senior consultants delivering strategic, regulatory, and operational advice with $30M+ revenue since formation.",
    achievements: [
      "Advised over 70 clients including banks and fintechs",
      "Led community bank M&A transactions",
      "Authored articles on digital banking, AI, and blockchain",
      "Partnered with leading national law firms",
    ],
  },
  {
    company: "Gateway First Bank",
    role: "Chief Executive Officer",
    period: "Jan 2018 – May 2020",
    desc: "Led 2.5-year transformation converting top-100 national mortgage platform into a $2 billion state-chartered bank with $107M annual earnings — 4× the mortgage company's peak.",
    achievements: [
      "Acquired and integrated $300M community bank",
      "Doubled mortgage origination to $12B annually",
      "Completed capital raise with Piper Sandler & EJF Capital",
      "Launched digital banking during COVID in 48 hours",
      "Restructured governance with former FDIC Chairman on board",
    ],
  },
  {
    company: "Bank of America",
    role: "Various Executive Roles",
    period: "1986 – 2008",
    desc: "22 years in leadership across Wealth Management, Corporate & Investment Banking, Finance, Technology & Corporate M&A as bank grew from $25B to $1 trillion in assets.",
    achievements: [
      "Led M&A for Fleet, US Trust, LaSalle, Merrill Lynch acquisitions",
      "COO of Corporate & Investment Banking — grew revenue $1.3B+",
      "Launched Private Client Group for advisory services",
      "Developed M&A integration playbook used for all acquisitions",
      "CFO & COO of Corporate Banking — built client management model",
    ],
  },
];

export default function WorkSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(false);
  const totalCards = experiences.length;

  // Header reveal
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setHeaderVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.02 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Scroll handler — section pinned, cards move up
  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const windowH = window.innerHeight;

      // How far we've scrolled through the section
      // Section is tall (totalCards * 100vh), so we track progress through it
      const scrolled = -rect.top;
      const scrollableDistance = sectionHeight - windowH;

      if (scrollableDistance <= 0) return;

      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      setScrollProgress(progress);

      // Which card should be active based on progress
      const cardIndex = Math.min(
        totalCards - 1,
        Math.floor(progress * totalCards)
      );
      setActiveCard(cardIndex);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [totalCards]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      style={{
        // ═══ KEY: Section is very tall so user scrolls through it
        // Each card gets 100vh of scroll space
        height: `${totalCards * 100}vh`,
        position: "relative",
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
      }}
    >
      {/* ═══ STICKY CONTAINER — Stays fixed while scrolling ═══ */}
      <div
        ref={containerRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: "clamp(24px,4vh,40px) clamp(24px,6vw,96px)",
        }}
      >
        {/* ═══ HEADER (fixed at top) ═══ */}
        <div style={{
          flexShrink: 0,
          marginBottom: "clamp(24px,3vh,40px)",
        }}>
          {/* Section tag */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity .8s ease, transform .8s ease",
          }}>
            <div style={{
              width: "32px", height: "2px",
              background: "var(--primary)", borderRadius: "1px",
              transform: headerVisible ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left",
              transition: "transform .8s ease .2s",
            }} />
            <span className="section-tag">Experience</span>
          </div>

          {/* Title row */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "16px",
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(32px,4.5vw,44px)",
              fontWeight: 700,
              lineHeight: 1.15,
              color: "var(--headline)",
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity .8s ease .1s, transform .8s ease .1s",
            }}>
              Career highlights
            </h2>

            {/* Counter + Progress */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              opacity: headerVisible ? 1 : 0,
              transition: "opacity .8s ease .3s",
            }}>
              {/* Card counter */}
              <div style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "18px",
              }}>
                <span style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "var(--primary)",
                  transition: "all .3s ease",
                }}>
                  {String(activeCard + 1).padStart(2, "0")}
                </span>
                <span style={{ color: "var(--border)", margin: "0 8px" }}>/</span>
                <span style={{ color: "var(--muted)" }}>
                  {String(totalCards).padStart(2, "0")}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{
                width: "120px",
                height: "3px",
                background: "var(--border)",
                borderRadius: "2px",
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  background: "var(--primary)",
                  borderRadius: "2px",
                  width: `${scrollProgress * 100}%`,
                  transition: "width .1s linear",
                }} />
              </div>

              {/* Dot indicators */}
              <div style={{
                display: "flex",
                gap: "6px",
              }}>
                {experiences.map((_, idx) => (
                  <div key={idx} style={{
                    width: idx === activeCard ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    background: idx === activeCard
                      ? "var(--primary)"
                      : idx < activeCard
                        ? "var(--secondary)"
                        : "var(--border)",
                    transition: "all .4s cubic-bezier(.16,1,.3,1)",
                    opacity: idx <= activeCard ? 1 : 0.4,
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ CARD AREA — Cards stack and animate here ═══ */}
        <div style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
        }}>
          {experiences.map((exp, i) => {
            // Calculate each card's position based on scroll
            const cardProgress = scrollProgress * totalCards - i;

            // Card states:
            // cardProgress < 0: Below (waiting)
            // cardProgress 0-1: Currently active (sliding up)
            // cardProgress > 1: Above (already passed)

            let translateY = 0;
            let opacity = 0;
            let scale = 1;
            let zIndex = 1;

            if (cardProgress < 0) {
              // Waiting below
              translateY = 100;
              opacity = 0;
              scale = 0.92;
              zIndex = 1;
            } else if (cardProgress >= 0 && cardProgress < 1) {
              // Active — sliding into view
              translateY = Math.max(0, (1 - cardProgress) * 60);
              opacity = Math.min(1, cardProgress * 3);
              scale = 0.95 + cardProgress * 0.05;
              zIndex = 10;
            } else {
              // Passed — slide up and fade
              const exitProgress = cardProgress - 1;
              translateY = -exitProgress * 40;
              opacity = Math.max(0, 1 - exitProgress * 2);
              scale = 1 - exitProgress * 0.05;
              zIndex = 5;
            }

            return (
              <ExperienceCard
                key={exp.company}
                exp={exp}
                index={i}
                translateY={translateY}
                opacity={opacity}
                scale={scale}
                zIndex={zIndex}
                isActive={i === activeCard}
                cardProgress={Math.max(0, Math.min(1, cardProgress))}
              />
            );
          })}
        </div>

        {/* ═══ SCROLL HINT (bottom) ═══ */}
        <div style={{
          flexShrink: 0,
          display: "flex",
          justifyContent: "center",
          padding: "16px 0 8px",
          opacity: activeCard < totalCards - 1 ? 1 : 0,
          transition: "opacity .5s ease",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <div style={{
              width: "24px",
              height: "38px",
              borderRadius: "12px",
              border: "2px solid var(--border)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "6px",
            }}>
              <div style={{
                width: "3px",
                height: "6px",
                borderRadius: "2px",
                background: "var(--primary)",
                animation: "scrollDot 1.5s ease infinite",
              }} />
            </div>
            <span style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}>
              Keep scrolling
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// EXPERIENCE CARD
// ═══════════════════════════════════════════════════════════
function ExperienceCard({
  exp,
  index,
  translateY,
  opacity,
  scale,
  zIndex,
  isActive,
  cardProgress,
}: {
  exp: typeof experiences[0];
  index: number;
  translateY: number;
  opacity: number;
  scale: number;
  zIndex: number;
  isActive: boolean;
  cardProgress: number;
}) {
  const [hov, setHov] = useState(false);

  // Inner elements animate based on cardProgress
  const contentVisible = cardProgress > 0.15;

  return (
    <div style={{
      position: "absolute",
      inset: "0 0 0 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      // ═══ MAIN ANIMATION ═══
      opacity,
      transform: `
        translateY(${translateY}%)
        scale(${scale})
      `,
      transition: "transform .15s linear, opacity .15s linear",
      zIndex,
      pointerEvents: isActive ? "auto" : "none",
    }}>
      <div
        className="card"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width: "100%",
          maxWidth: "860px",
          maxHeight: "calc(100vh - 220px)",
          overflow: "auto",
          padding: "clamp(28px,4vw,44px)",
          position: "relative",
          // Hover effects
          borderColor: hov ? "var(--primary)" : "var(--border)",
          boxShadow: isActive
            ? (hov ? "var(--shadow-xl)" : "var(--shadow-lg)")
            : "var(--shadow-sm)",
          transition: "border-color .3s ease, box-shadow .4s ease",
        }}
      >
        {/* Top accent bar */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "var(--primary)",
          borderRadius: "0 0 2px 2px",
          transform: contentVisible ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 1s cubic-bezier(.16,1,.3,1) .1s",
        }} />

        {/* Left accent on hover */}
        <div style={{
          position: "absolute",
          left: 0,
          top: "12%",
          bottom: "12%",
          width: "3px",
          background: "var(--primary)",
          borderRadius: "0 3px 3px 0",
          opacity: hov ? 1 : 0,
          transform: hov ? "scaleY(1)" : "scaleY(0)",
          transformOrigin: "top",
          transition: "all .4s cubic-bezier(.16,1,.3,1)",
        }} />

        {/* ═══ CARD GRID LAYOUT ═══ */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "clamp(20px,3vw,36px)",
          alignItems: "start",
        }} className="exp-card-grid">

          {/* LEFT: Number */}
          <div style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.8)",
            transition: "all .6s cubic-bezier(.16,1,.3,1) .15s",
          }}>
            <div style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(56px,8vw,80px)",
              fontWeight: 700,
              color: hov ? "var(--primary)" : "var(--border)",
              lineHeight: 1,
              letterSpacing: "-.04em",
              transition: "color .4s ease",
              userSelect: "none",
            }}>
              {String(index + 1).padStart(2, "0")}
            </div>
          </div>

          {/* RIGHT: Content */}
          <div>
            {/* Role + Period */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "16px",
            }}>
              <div>
                {/* Role badge */}
                <span style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "var(--primary)",
                  background: "var(--primary-05)",
                  border: "1px solid var(--primary-10)",
                  padding: "5px 14px",
                  borderRadius: "6px",
                  display: "inline-block",
                  marginBottom: "12px",
                  opacity: contentVisible ? 1 : 0,
                  transform: contentVisible ? "translateY(0)" : "translateY(10px)",
                  transition: "all .5s ease .2s",
                }}>
                  {exp.role}
                </span>

                {/* Company */}
                <h3 style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "clamp(24px,3.5vw,32px)",
                  fontWeight: 700,
                  color: hov ? "var(--primary)" : "var(--headline)",
                  lineHeight: 1.15,
                  transition: "color .3s ease",
                  opacity: contentVisible ? 1 : 0,
                  transform: contentVisible ? "translateY(0)" : "translateY(14px)",
                  transitionProperty: "color, opacity, transform",
                  transitionDuration: ".3s, .6s, .6s",
                  transitionDelay: "0s, .25s, .25s",
                }}>
                  {exp.company}
                </h3>
              </div>

              {/* Period */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: contentVisible ? 1 : 0,
                transform: contentVisible ? "translateX(0)" : "translateX(20px)",
                transition: "all .5s ease .3s",
              }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: exp.period.includes("Present") ? "#22c55e" : "var(--border)",
                  boxShadow: exp.period.includes("Present") ? "0 0 8px rgba(34,197,94,0.4)" : "none",
                  animation: exp.period.includes("Present") ? "pulse 2s ease infinite" : "none",
                }} />
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--muted)" }}>
                  {exp.period}
                </span>
              </div>
            </div>

            {/* Description */}
            <p style={{
              fontSize: "17px",
              lineHeight: 1.75,
              color: "var(--body)",
              marginBottom: "24px",
              maxWidth: "640px",
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? "translateY(0)" : "translateY(16px)",
              transition: "all .6s ease .35s",
            }}>
              {exp.desc}
            </p>

            {/* Divider */}
            <div style={{
              height: "1px",
              background: "var(--border)",
              marginBottom: "20px",
              transform: contentVisible ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left",
              transition: "transform 1s cubic-bezier(.16,1,.3,1) .4s",
            }} />

            {/* Achievements */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px 16px",
            }} className="ach-grid">
              {exp.achievements.map((ach, j) => (
                <AchievementItem
                  key={j}
                  text={ach}
                  index={j}
                  isVisible={contentVisible}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ACHIEVEMENT ITEM
// ═══════════════════════════════════════════════════════════
function AchievementItem({ text, index, isVisible }: {
  text: string;
  index: number;
  isVisible: boolean;
}) {
  const [hov, setHov] = useState(false);
  const delay = 0.45 + index * 0.08;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        padding: "8px 10px",
        borderRadius: "8px",
        background: hov ? "var(--primary-05)" : "transparent",
        transition: "background .25s ease",
        // Stagger animation
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : "translateX(-20px)",
        transitionProperty: "opacity, transform, background",
        transitionDuration: "0.5s, 0.6s, 0.25s",
        transitionDelay: `${delay}s, ${delay}s, 0s`,
        transitionTimingFunction: "ease, cubic-bezier(.16,1,.3,1), ease",
      }}
    >
      {/* Check */}
      <div style={{
        width: "18px",
        height: "18px",
        borderRadius: "5px",
        background: hov ? "var(--primary)" : "var(--primary-05)",
        border: `1.5px solid ${hov ? "var(--primary)" : "var(--primary-10)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginTop: "2px",
        transition: "all .25s ease",
        transform: isVisible ? "scale(1)" : "scale(0)",
        transitionProperty: "transform, background, border-color",
        transitionDuration: "0.4s, 0.25s, 0.25s",
        transitionDelay: `${delay + 0.05}s, 0s, 0s`,
      }}>
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: `opacity .3s ease ${delay + 0.12}s`,
          }}
        >
          <path d="M2 5L4.5 7.5L8 3"
            stroke={hov ? "#fff" : "var(--primary)"}
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <span style={{
        fontSize: "14px",
        color: hov ? "var(--headline)" : "var(--body)",
        lineHeight: 1.55,
        fontWeight: hov ? 500 : 400,
        transition: "color .25s ease, font-weight .25s ease",
      }}>{text}</span>
    </div>
  );
}