/* === Atomic Design 2026 v2 — Hero canvas + scroll + interactions === */
(function () {
  // ===== Hero atom spark particles =====
  const sparkCanvas = document.getElementById("hero-sparks");
  if (sparkCanvas) {
    const sctx = sparkCanvas.getContext("2d");
    let sw = 0, sh = 0, sdpr = Math.min(window.devicePixelRatio || 1, 2);
    let sparks = [];

    function sresize() {
      const r = sparkCanvas.getBoundingClientRect();
      sw = r.width; sh = r.height;
      sparkCanvas.width = sw * sdpr; sparkCanvas.height = sh * sdpr;
      sctx.setTransform(sdpr, 0, 0, sdpr, 0, 0);
    }

    function spawnSpark() {
      // emit from the bright core area (roughly 56%, 58% of the canvas)
      const cx = sw * 0.56, cy = sh * 0.58;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.4 + Math.random() * 0.9;
      sparks.push({
        x: cx + (Math.random() - 0.5) * 16,
        y: cy + (Math.random() - 0.5) * 16,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.15,
        life: 0,
        max: 80 + Math.random() * 70,
        r: 0.6 + Math.random() * 1.4,
        hue: 18 + Math.random() * 30, // orange to magenta
      });
    }

    function sstep() {
      sctx.clearRect(0, 0, sw, sh);
      if (Math.random() < 0.6) spawnSpark();
      if (Math.random() < 0.25) spawnSpark();

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += 1;
        s.x += s.vx;
        s.y += s.vy;
        s.vy -= 0.005; // gentle float
        s.vx *= 0.995;
        const t = s.life / s.max;
        if (t >= 1) { sparks.splice(i, 1); continue; }
        const alpha = (1 - t) * 0.9;
        sctx.shadowBlur = 8;
        sctx.shadowColor = `hsl(${s.hue}, 100%, 60%)`;
        sctx.fillStyle = `hsla(${s.hue}, 100%, ${65 + t * 20}%, ${alpha})`;
        sctx.beginPath();
        sctx.arc(s.x, s.y, s.r * (1 - t * 0.5), 0, Math.PI * 2);
        sctx.fill();
        sctx.shadowBlur = 0;
      }

      requestAnimationFrame(sstep);
    }

    window.addEventListener("resize", sresize);
    sresize();
    requestAnimationFrame(sstep);
  }

  // ===== Animated atomic node network with energy pulses =====
  const canvas = document.getElementById("hero-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes = [];
    let pulses = [];
    let mouse = { x: -1000, y: -1000 };
    let last = 0;

    const PALETTE = [
      { r: 255, g: 107, b: 26 },   // orange
      { r: 255, g: 61, b: 165 },   // magenta
      { r: 138, g: 61, b: 240 },   // purple
    ];

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      const count = Math.min(95, Math.floor((w * h) / 16000));
      nodes = new Array(count).fill(0).map(() => {
        const accent = Math.random() < 0.28;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.6 + 0.7,
          accent,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          pulse: Math.random() * Math.PI * 2,
        };
      });
    }

    function emitPulse() {
      // emit an energy pulse along a long link
      const accentNodes = nodes.filter(n => n.accent);
      if (accentNodes.length < 2) return;
      const a = accentNodes[Math.floor(Math.random() * accentNodes.length)];
      let best = null, bd = Infinity;
      for (const b of accentNodes) {
        if (b === a) continue;
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 220 && d > 60 && d < bd) { best = b; bd = d; }
      }
      if (best) {
        pulses.push({ a, b: best, t: 0, color: a.color, dur: 60 + Math.random() * 40 });
      }
    }

    function step(now) {
      const dt = Math.min(now - last, 60); last = now;
      ctx.clearRect(0, 0, w, h);

      // gentle radial wash
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.55);
      grad.addColorStop(0, "rgba(138, 61, 240, 0.07)");
      grad.addColorStop(0.5, "rgba(255, 61, 165, 0.04)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // update nodes
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const md = Math.sqrt(dx*dx + dy*dy);
        if (md < 160) {
          const f = (160 - md) / 160 * 0.8;
          n.x += (dx / (md || 1)) * f;
          n.y += (dy / (md || 1)) * f;
        }
        n.pulse += 0.024;
      }

      // links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 150) {
            const op = (1 - d / 150);
            if (a.accent || b.accent) {
              const c = (a.accent ? a.color : b.color);
              ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${op * 0.55})`;
              ctx.lineWidth = 1;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${op * 0.08})`;
              ctx.lineWidth = 0.5;
            }
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += 1;
        const k = p.t / p.dur;
        if (k > 1) { pulses.splice(i, 1); continue; }
        const x = p.a.x + (p.b.x - p.a.x) * k;
        const y = p.a.y + (p.b.y - p.a.y) * k;
        const c = p.color;
        ctx.shadowBlur = 24; ctx.shadowColor = `rgba(${c.r},${c.g},${c.b},1)`;
        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${1 - Math.abs(0.5 - k) * 2 * 0.6})`;
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // draw nodes
      for (const n of nodes) {
        const c = n.color;
        if (n.accent) {
          const glow = 8 + Math.sin(n.pulse) * 4;
          ctx.shadowBlur = glow * 2.4;
          ctx.shadowColor = `rgba(${c.r},${c.g},${c.b},1)`;
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},1)`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 1.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = "rgba(255,255,255,0.6)";
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      requestAnimationFrame(step);
    }

    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener("mouseleave", () => { mouse.x = -1000; mouse.y = -1000; });

    resize();
    requestAnimationFrame(step);
    setInterval(emitPulse, 380);
  }

  // ===== Cursor-tracking glow on cards =====
  document.querySelectorAll(".service, .loc, .review").forEach((card) => {
    if (!card.querySelector(".glow") && card.classList.contains("service")) {
      const g = document.createElement("div");
      g.className = "glow";
      card.prepend(g);
    }
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  // ===== Scroll reveal =====
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // ===== Stat counters =====
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        const format = el.dataset.format || "";
        const dur = 1800;
        const start = performance.now();
        function tick(now) {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          const v = target * eased;
          let txt;
          if (format === "int") {
            txt = Math.round(v).toLocaleString("en-US");
          } else {
            txt = v.toFixed(decimals);
          }
          el.textContent = txt + suffix;
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        cio.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));

  // ===== Nav scroll state =====
  const nav = document.querySelector(".nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  });

  // ===== Parallax for hero conic blob (subtle) =====
  const hero = document.querySelector(".hero");
  if (hero) {
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y < 800) hero.style.setProperty("--py", (y * 0.15) + "px");
    });
  }
})();
