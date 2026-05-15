import { useEffect, useRef } from "react";

function throttle<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let lastCall = 0;
  return ((...args: any[]) => {
    const now = Date.now();
    if (now - lastCall >= delay) { lastCall = now; func(...args); }
  }) as T;
}

export function FloatingParticles({ count = 40, color = "75,30,120" }: { count?: number; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H, z: Math.random() * 800 + 200,
      vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2, vz: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
    }));
    let mouseX = W / 2, mouseY = H / 2, animId: number;
    const onMouseMove = throttle((e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouseX = e.clientX - r.left; mouseY = e.clientY - r.top; }, 16);
    window.addEventListener("mousemove", onMouseMove);
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      const fl = 600;
      particles.forEach((p, idx) => {
        p.x += p.vx + (mouseX - W / 2) * 0.0002; p.y += p.vy + (mouseY - H / 2) * 0.0002; p.z += p.vz;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        if (p.z < 100) p.z = 1000; if (p.z > 1000) p.z = 100;
        const scale = fl / (fl + p.z);
        const px = (p.x - W / 2) * scale + W / 2, py = (p.y - H / 2) * scale + H / 2;
        const size = p.size * scale, alpha = scale * 0.4;
        ctx.beginPath(); ctx.arc(px, py, Math.max(0.1, size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${alpha})`; ctx.fill();
        for (let j = idx + 1; j < Math.min(idx + 6, particles.length); j++) {
          const p2 = particles[j]; const s2 = fl / (fl + p2.z);
          const px2 = (p2.x - W / 2) * s2 + W / 2, py2 = (p2.y - H / 2) * s2 + H / 2;
          const dist = Math.sqrt((px - px2) ** 2 + (py - py2) ** 2);
          if (dist < 80) { ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px2, py2); ctx.strokeStyle = `rgba(${color},${(1 - dist / 80) * 0.06})`; ctx.lineWidth = 0.5; ctx.stroke(); }
        }
      });
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    const onResize = throttle(() => { W = canvas.offsetWidth; H = canvas.offsetHeight; canvas.width = W; canvas.height = H; }, 200);
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("resize", onResize); };
  }, [count, color]);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

export function WireframeSphere({ size = 280 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    canvas.width = size; canvas.height = size;
    const cx = size / 2, cy = size / 2, r = size * 0.42;
    let rotX = 0, rotY = 0, mouseX = 0, mouseY = 0, animId: number;
    const onMM = throttle((e: MouseEvent) => { const rect = canvas.getBoundingClientRect(); mouseX = ((e.clientX - rect.left) / size - 0.5) * 0.5; mouseY = ((e.clientY - rect.top) / size - 0.5) * 0.5; }, 16);
    window.addEventListener("mousemove", onMM);
    const project = (x: number, y: number, z: number) => { const fl = 600; const sc = fl / (fl + z + r); return { x: cx + x * sc, y: cy + y * sc, alpha: (z + r) / (2 * r) }; };
    const animate = () => {
      ctx.clearRect(0, 0, size, size);
      rotX += (mouseY * 0.02 - rotX) * 0.05 + 0.003; rotY += (mouseX * 0.02 - rotY) * 0.05 + 0.005;
      for (let i = 0; i <= 10; i++) {
        const phi = (i / 10) * Math.PI; const pts: any[] = [];
        for (let j = 0; j <= 64; j++) {
          const th = (j / 64) * Math.PI * 2;
          let x = r * Math.sin(phi) * Math.cos(th), y = r * Math.cos(phi), z = r * Math.sin(phi) * Math.sin(th);
          const y1 = y * Math.cos(rotX) - z * Math.sin(rotX), z1 = y * Math.sin(rotX) + z * Math.cos(rotX);
          const x2 = x * Math.cos(rotY) + z1 * Math.sin(rotY);
          pts.push(project(x2, y1, -x * Math.sin(rotY) + z1 * Math.cos(rotY)));
        }
        for (let j = 0; j < pts.length - 1; j++) { ctx.beginPath(); ctx.moveTo(pts[j].x, pts[j].y); ctx.lineTo(pts[j + 1].x, pts[j + 1].y); ctx.strokeStyle = `rgba(75,30,120,${pts[j].alpha * 0.12})`; ctx.lineWidth = 0.6; ctx.stroke(); }
      }
      for (let i = 0; i < 16; i++) {
        const th = (i / 16) * Math.PI * 2; const pts: any[] = [];
        for (let j = 0; j <= 64; j++) {
          const phi = (j / 64) * Math.PI;
          let x = r * Math.sin(phi) * Math.cos(th), y = r * Math.cos(phi), z = r * Math.sin(phi) * Math.sin(th);
          const y1 = y * Math.cos(rotX) - z * Math.sin(rotX), z1 = y * Math.sin(rotX) + z * Math.cos(rotX);
          const x2 = x * Math.cos(rotY) + z1 * Math.sin(rotY);
          pts.push(project(x2, y1, -x * Math.sin(rotY) + z1 * Math.cos(rotY)));
        }
        for (let j = 0; j < pts.length - 1; j++) { ctx.beginPath(); ctx.moveTo(pts[j].x, pts[j].y); ctx.lineTo(pts[j + 1].x, pts[j + 1].y); ctx.strokeStyle = `rgba(75,30,120,${pts[j].alpha * 0.08})`; ctx.lineWidth = 0.5; ctx.stroke(); }
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("mousemove", onMM); };
  }, [size]);
  return <canvas ref={canvasRef} style={{ width: size, height: size, pointerEvents: "none" }} />;
}

export function Cube3D({ size = 60, color = "#4b1e78", speed = 1 }: { size?: number; color?: string; speed?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const s = size; canvas.width = s; canvas.height = s;
    let rX = 0.5, rY = 0.3, animId: number;
    const h = s * 0.3;
    const verts = [[-h, -h, -h], [h, -h, -h], [h, h, -h], [-h, h, -h], [-h, -h, h], [h, -h, h], [h, h, h], [-h, h, h]];
    const edges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    const proj = (x: number, y: number, z: number) => { const fl = 300; const sc = fl / (fl + z); return { x: s / 2 + x * sc, y: s / 2 + y * sc }; };
    const animate = () => {
      ctx.clearRect(0, 0, s, s); rX += 0.008 * speed; rY += 0.012 * speed;
      const p = verts.map(([vx, vy, vz]) => { const y1 = vy * Math.cos(rX) - vz * Math.sin(rX); const z1 = vy * Math.sin(rX) + vz * Math.cos(rX); return proj(vx * Math.cos(rY) + z1 * Math.sin(rY), y1, -vx * Math.sin(rY) + z1 * Math.cos(rY)); });
      edges.forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(p[a].x, p[a].y); ctx.lineTo(p[b].x, p[b].y); ctx.strokeStyle = color; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.5; ctx.stroke(); });
      p.forEach(pt => { ctx.beginPath(); ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2); ctx.fillStyle = color; ctx.globalAlpha = 0.8; ctx.fill(); });
      ctx.globalAlpha = 1; animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [size, color, speed]);
  return <canvas ref={canvasRef} style={{ width: size, height: size }} />;
}

export function use3DTilt(intensity = 15) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const onMove = throttle((e: MouseEvent) => { const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5; const y = (e.clientY - r.top) / r.height - 0.5; el.style.transform = `perspective(1000px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) translateZ(8px) scale3d(1.01,1.01,1.01)`; }, 16);
    const onLeave = () => { el.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale3d(1,1,1)"; };
    el.style.transition = "transform 0.1s ease";
    el.addEventListener("mousemove", onMove); el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [intensity]);
  return ref;
}

export function Ring3D({ size = 200, color = "75,30,120" }: { size?: number; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    canvas.width = size; canvas.height = size; let angle = 0, animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, size, size); angle += 0.01;
      const cx = size / 2, cy = size / 2, r = size * 0.38;
      for (let i = 0; i < 80; i++) { const t = (i / 80) * Math.PI * 2 + angle; const x = cx + Math.cos(t) * r; const y = cy + Math.sin(t) * (r * 0.35); const alpha = (Math.sin(t) + 1) / 2; ctx.beginPath(); ctx.arc(x, y, 1.5 + alpha * 2, 0, Math.PI * 2); ctx.fillStyle = `rgba(${color},${alpha * 0.5})`; ctx.fill(); }
      const gx = cx + Math.cos(angle) * r, gy = cy + Math.sin(angle) * (r * 0.35);
      const grd = ctx.createRadialGradient(gx, gy, 0, gx, gy, 10);
      grd.addColorStop(0, `rgba(${color},0.8)`); grd.addColorStop(1, `rgba(${color},0)`);
      ctx.beginPath(); ctx.arc(gx, gy, 10, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [size, color]);
  return <canvas ref={canvasRef} style={{ width: size, height: size, pointerEvents: "none" }} />;
}