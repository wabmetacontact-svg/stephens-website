export default function MarqueeSection() {
  const r1 = ["Corporate governance", "—", "M&A advisory", "—", "Digital banking", "—", "Board relations", "—", "Turnaround execution", "—", "Risk management", "—", "P&L management", "—", "Capital markets", "—"];
  const r2 = ["Fintech", "—", "Blockchain", "—", "Data governance", "—", "Team building", "—", "Strategic planning", "—", "Regulatory compliance", "—", "Change management", "—", "Investor relations", "—"];

  return (
    <div style={{
      position: "relative", overflow: "hidden",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      background: "var(--bg-section)",
    }}>
      {(["left", "right"] as const).map(s => (
        <div key={s} style={{
          position: "absolute", top: 0, bottom: 0, [s]: 0, width: "120px",
          background: `linear-gradient(${s === "left" ? "90deg" : "270deg"}, var(--bg-section) 0%, transparent 100%)`,
          zIndex: 3, pointerEvents: "none",
        }} />
      ))}

      <div style={{ padding: "24px 0" }}>
        <div style={{ overflow: "hidden", marginBottom: "12px" }}>
          <div style={{
            display: "flex", gap: "48px", whiteSpace: "nowrap",
            width: "max-content", animation: "mqLeft 35s linear infinite",
          }}>
            {[...r1, ...r1].map((t, i) => (
              <span key={i} style={{
                fontFamily: "'Inter',sans-serif",
                fontSize: "13px",
                fontWeight: t === "—" ? 300 : 500,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                flexShrink: 0,
                color: t === "—" ? "var(--primary)" : "var(--muted)",
              }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ overflow: "hidden" }}>
          <div style={{
            display: "flex", gap: "48px", whiteSpace: "nowrap",
            width: "max-content", animation: "mqRight 40s linear infinite",
          }}>
            {[...r2, ...r2].map((t, i) => (
              <span key={i} style={{
                fontFamily: "'Inter',sans-serif",
                fontSize: "13px",
                fontWeight: t === "—" ? 300 : 500,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                flexShrink: 0,
                color: t === "—" ? "var(--secondary)" : "rgba(108,101,129,0.5)",
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}