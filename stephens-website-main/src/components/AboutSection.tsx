import { useEffect, useRef, useState } from "react";

function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, v };
}

const expertise = [
  { name: "M&A advisory", cat: "Strategic" },
  { name: "Corporate governance", cat: "Leadership" },
  { name: "Digital banking", cat: "Technology" },
  { name: "Risk management", cat: "Operations" },
  { name: "Turnaround execution", cat: "Strategic" },
  { name: "Blockchain & crypto", cat: "Technology" },
  { name: "Regulatory compliance", cat: "Operations" },
  { name: "Capital markets", cat: "Strategic" },
];

const PROFILE_IMAGE = "/stephen.jpg";

export default function AboutSection() {
  const { ref: sRef, v: sV } = useReveal(.04);
  const { ref: iRef, v: iV } = useReveal(.1);
  const { ref: tRef, v: tV } = useReveal(.06);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [cardHovered, setCardHovered] = useState(false);

  // 3D tilt
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const onMove = (e: MouseEvent) => {
      if (isFlipped) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
      card.style.transform = `perspective(1200px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(16px) scale3d(1.01,1.01,1.01)`;
    };
    const onLeave = () => {
      if (isFlipped) return;
      card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1,1,1)";
      setMousePos({ x: 0.5, y: 0.5 });
    };
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => { card.removeEventListener("mousemove", onMove); card.removeEventListener("mouseleave", onLeave); };
  }, [isFlipped]);

  return (
    <section id="about" ref={sRef} style={{
      background: "var(--bg-section)",
      padding: "clamp(80px,12vh,140px) clamp(24px,6vw,96px)",
      position: "relative", overflow: "hidden",
      borderTop: "1px solid var(--border)",
    }}>
      {/* Section label */}
      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        marginBottom: "clamp(48px,8vh,88px)",
        opacity: sV ? 1 : 0, transform: sV ? "translateY(0)" : "translateY(16px)",
        transition: "opacity .8s ease, transform .8s ease",
      }}>
        <div style={{ width: "32px", height: "2px", background: "var(--primary)", borderRadius: "1px", transform: sV ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform .8s ease .2s" }} />
        <span className="section-tag">About</span>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,7vw,100px)", alignItems: "start" }} className="about-grid">

        {/* LEFT - Text */}
        <div ref={tRef} style={{ maxWidth: "820px" }}>
          <h2 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "clamp(36px,5vw,48px)", fontWeight: 700,
            lineHeight: 1.15, letterSpacing: "-.02em",
            color: "var(--headline)", marginBottom: "32px",
            transform: tV ? "translateY(0)" : "translateY(24px)",
            opacity: tV ? 1 : 0, transition: "transform .8s ease, opacity .8s ease",
          }}>
            Transformational leadership for complex challenges
          </h2>

          {[
            "Strategic, people-centered executive with a track record of driving innovation, complex transformations, and business growth across financial institutions and fintech ventures.",
            "Trusted by ultra-high-net-worth clients, family offices, and stakeholders for discretion and results. Combines a challenger mindset with deep regulatory fluency to unlock value, optimize operations, and modernize legacy platforms.",
            "Proven success in board governance, M&A, risk, technology, and turnaround execution. Partnered extensively with top law, technology, accounting, consulting firms and investment banks.",
          ].map((para, idx) => (
            <p key={idx} style={{
              fontSize: "17px", lineHeight: 1.8, color: "var(--body)", fontWeight: 400,
              marginBottom: idx < 2 ? "20px" : "40px",
              transform: tV ? "translateY(0)" : "translateY(20px)",
              opacity: tV ? 1 : 0,
              transition: `transform .8s ease ${.2 + idx * .1}s, opacity .8s ease ${.2 + idx * .1}s`,
            }}>{para}</p>
          ))}

          {/* Expertise */}
          <div style={{
            marginBottom: "40px",
            transform: tV ? "translateY(0)" : "translateY(20px)",
            opacity: tV ? 1 : 0, transition: "transform .8s ease .5s, opacity .8s ease .5s",
          }}>
            <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>Areas of expertise</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {expertise.map((sk, idx) => (
                <span key={sk.name} style={{
                  fontSize: "13px", fontWeight: 500, color: "var(--body)",
                  background: "var(--bg-card)", border: "1px solid var(--border)",
                  padding: "8px 16px", borderRadius: "8px",
                  boxShadow: "var(--shadow-sm)", transition: "all .3s ease",
                  transform: tV ? "translateY(0)" : "translateY(12px)",
                  opacity: tV ? 1 : 0, transitionDelay: `${.6 + idx * .04}s`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "var(--primary)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--body)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >{sk.name}</span>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div style={{
            display: "flex", gap: "16px", alignItems: "center",
            transform: tV ? "translateY(0)" : "translateY(20px)",
            opacity: tV ? 1 : 0, transition: "transform .8s ease .8s, opacity .8s ease .8s",
          }}>
            <a href="#contact" className="btn btn-primary">Get in touch</a>
            <a href="#experience" className="btn btn-outline">View experience →</a>
          </div>
        </div>

        {/* RIGHT – Image Card ONLY (No stats below) */}
        <div ref={iRef} style={{ position: "sticky", top: "100px" }}>
          <div style={{ perspective: "1400px" }}>
            <div ref={cardRef} style={{
              position: "relative", borderRadius: "20px",
              aspectRatio: "3/4",
              transformStyle: "preserve-3d",
              transition: "transform 0.8s cubic-bezier(.16,1,.3,1)",
              transform: isFlipped ? "perspective(1400px) rotateY(180deg)" : "perspective(1400px) rotateY(0deg)",
              willChange: "transform",
            }}
              onMouseEnter={() => setCardHovered(true)}
              onMouseLeave={() => setCardHovered(false)}
            >
              {/* ═══ FRONT FACE ═══ */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "20px", overflow: "hidden",
                background: "var(--bg-card)", border: "1px solid var(--border)",
                backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                boxShadow: cardHovered && !isFlipped ? "0 32px 80px rgba(0,0,0,0.12), 0 12px 32px rgba(0,0,0,0.06)" : "var(--shadow-lg)",
                transition: "box-shadow .4s ease",
                clipPath: iV ? "inset(0% 0% 0% 0% round 20px)" : "inset(0% 0% 100% 0% round 20px)",
                transitionProperty: "clip-path, box-shadow",
                transitionDuration: "1.2s, 0.4s",
                transitionTimingFunction: "cubic-bezier(.16,1,.3,1), ease",
                transitionDelay: "0.2s, 0s",
              }}>
                {/* Image */}
                <div style={{ position: "absolute", inset: 0, background: "var(--bg-section)" }}>
                  <img src={PROFILE_IMAGE} alt="Stephen K. Curry"
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    style={{
                      width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top",
                      opacity: imageLoaded ? 1 : 0,
                      transition: "opacity .6s ease, transform .3s ease",
                      transform: `scale(1.03) translate(${(mousePos.x - 0.5) * -6}px, ${(mousePos.y - 0.5) * -6}px)`,
                    }}
                  />
                  {!imageLoaded && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(145deg, var(--bg-card) 0%, var(--bg-section) 100%)" }}>
                      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)", backgroundSize: "32px 32px", opacity: 0.3 }} />
                      <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(80px,12vw,140px)", fontWeight: 700, color: "var(--border)", letterSpacing: "-.04em" }}>SKC</span>
                      <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted)", marginTop: "16px" }}>Executive leadership</p>
                    </div>
                  )}
                </div>

                {/* Overlays */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(to top, rgba(27,31,35,0.88) 0%, rgba(27,31,35,0.5) 40%, transparent 100%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "25%", background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 100%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.08) 0%, transparent 50%)`, opacity: cardHovered ? 1 : 0, transition: "opacity .3s ease", pointerEvents: "none" }} />

                {/* Top bar */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "var(--primary)", zIndex: 10, transform: iV ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 1s ease 1s" }} />

                {/* Corners */}
                {[
                  { top: "16px", left: "16px", borderTop: "2px solid rgba(255,255,255,0.4)", borderLeft: "2px solid rgba(255,255,255,0.4)" },
                  { top: "16px", right: "16px", borderTop: "2px solid rgba(255,255,255,0.2)", borderRight: "2px solid rgba(255,255,255,0.2)" },
                  { bottom: "16px", left: "16px", borderBottom: "2px solid rgba(255,255,255,0.3)", borderLeft: "2px solid rgba(255,255,255,0.3)" },
                  { bottom: "16px", right: "16px", borderBottom: "2px solid rgba(255,255,255,0.2)", borderRight: "2px solid rgba(255,255,255,0.2)" },
                ].map((s, idx) => (
                  <div key={idx} style={{ position: "absolute", width: "24px", height: "24px", ...s, opacity: iV ? 1 : 0, transition: `opacity .6s ease ${1.4 + idx * .1}s`, zIndex: 10 }} />
                ))}

                {/* Content */}
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "clamp(20px,3vw,32px)", zIndex: 5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", opacity: iV ? 1 : 0, transform: iV ? "translateY(0)" : "translateY(-16px)", transition: "all .6s ease 1.2s" }}>
                    <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: "8px", padding: "8px 16px", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
                      <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.5)", animation: "pulse 2s ease infinite" }} />
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--headline)" }}>Available for roles</span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: "8px", padding: "6px 14px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: ".1em", color: "var(--primary)" }}>EST. 1986</span>
                    </div>
                  </div>

                  <div style={{ opacity: iV ? 1 : 0, transform: iV ? "translateY(0)" : "translateY(24px)", transition: "all .8s ease 1.4s" }}>
                    <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "8px" }}>Transformational executive</p>
                    <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4.5vw,40px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.1, marginBottom: "16px" }}>Stephen K. Curry</h3>
                    <div style={{ height: "1px", background: "rgba(255,255,255,0.2)", margin: "0 0 16px 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <div>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "2px" }}>Based in</p>
                        <p style={{ fontSize: "15px", fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>Dallas, Texas</p>
                      </div>
                      <button onClick={() => setIsFlipped(f => !f)} style={{
                        fontSize: "12px", fontWeight: 600, color: "#FFFFFF",
                        background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
                        borderRadius: "8px", padding: "10px 20px",
                        display: "flex", alignItems: "center", gap: "8px",
                        transition: "all .3s ease", backdropFilter: "blur(12px)",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
                      >View details <span style={{ fontSize: "14px" }}>↻</span></button>
                    </div>
                  </div>
                </div>

                {/* Grain */}
                <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", pointerEvents: "none", zIndex: 7 }} />
              </div>

              {/* ═══ BACK FACE ═══ */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "20px", overflow: "hidden",
                background: "var(--bg-card)", border: "1px solid var(--border)",
                backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)", boxShadow: "var(--shadow-xl)",
                display: "flex", flexDirection: "column", justifyContent: "center",
                padding: "clamp(28px,4vw,48px)",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "var(--primary)" }} />
                <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, var(--border) 0.5px, transparent 0.5px)", backgroundSize: "24px 24px", opacity: 0.3, pointerEvents: "none" }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ width: "40px", height: "3px", background: "var(--primary)", borderRadius: "2px", marginBottom: "24px" }} />
                  <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--primary)", marginBottom: "20px" }}>Executive profile</p>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,4.5vw,44px)", fontWeight: 700, color: "var(--headline)", lineHeight: 1.1, marginBottom: "24px" }}>Stephen K. Curry</h3>
                  <div style={{ height: "1px", background: "var(--border)", marginBottom: "24px" }} />
                  <p style={{ fontSize: "16px", lineHeight: 1.7, color: "var(--body)", marginBottom: "32px" }}>35+ years transforming financial institutions through strategic leadership, M&A execution, and digital innovation.</p>

                  {[
                    { label: "Focus areas", val: "Banking, fintech, M&A" },
                    { label: "Location", val: "Dallas, Texas" },
                    { label: "Experience", val: "35+ years" },
                    { label: "Status", val: "Open for opportunities" },
                  ].map(({ label, val }, idx) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: idx < 3 ? "1px solid var(--border-light)" : "none" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</span>
                      <span style={{ fontSize: "15px", fontWeight: 500, color: idx === 3 ? "var(--primary)" : "var(--body)" }}>{val}</span>
                    </div>
                  ))}

                  <div style={{ marginTop: "24px", padding: "16px", background: "var(--bg-section)", borderRadius: "12px", border: "1px solid var(--border)" }}>
                    <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px" }}>Credentials</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "13px", color: "var(--body)" }}>• Six Sigma Green Belt</span>
                      <span style={{ fontSize: "13px", color: "var(--body)" }}>• Series 7 & 63 Licenses</span>
                      <span style={{ fontSize: "13px", color: "var(--body)" }}>• University of Oklahoma</span>
                    </div>
                  </div>

                  <button onClick={() => setIsFlipped(f => !f)} className="btn btn-outline" style={{ marginTop: "24px", alignSelf: "flex-start" }}>↻ Back to photo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){.about-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}