/* === Atomic Design 2026 — Hero canvas + scroll === */
(function () {
  // Animated atomic node network
  const canvas = document.getElementById("hero-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes = [];
    let mouse = { x: -1000, y: -1000 };

    const ORANGE = "#ff6b1a";

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      const count = Math.min(70, Math.floor((w * h) / 22000));
      nodes = new Array(count).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.6,
        accent: Math.random() < 0.18,
        pulse: Math.random() * Math.PI * 2,
      }));
    }

    function step() {
      ctx.clearRect(0, 0, w, h);

      // background radial wash
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, Math.max(w, h) * 0.6);
      grad.addColorStop(0, "rgba(255, 107, 26, 0.06)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // update + draw nodes
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        // mouse repulsion
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const md = Math.sqrt(dx*dx + dy*dy);
        if (md < 140) {
          const f = (140 - md) / 140 * 0.6;
          n.x += (dx / (md || 1)) * f;
          n.y += (dy / (md || 1)) * f;
        }
        n.pulse += 0.02;
      }

      // links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 130) {
            const op = (1 - d / 130);
            const isAccent = a.accent || b.accent;
            ctx.strokeStyle = isAccent
              ? `rgba(255, 107, 26, ${op * 0.5})`
              : `rgba(255, 255, 255, ${op * 0.08})`;
            ctx.lineWidth = isAccent ? 1 : 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // draw nodes
      for (const n of nodes) {
        if (n.accent) {
          const glow = 8 + Math.sin(n.pulse) * 3;
          ctx.shadowBlur = glow * 2;
          ctx.shadowColor = ORANGE;
          ctx.fillStyle = ORANGE;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = "rgba(255,255,255,0.55)";
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
    step();
  }

  // Scroll reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Counter animation for stats
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        const dur = 1600;
        const start = performance.now();
        function tick(now) {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          const v = target * eased;
          el.textContent = v.toFixed(decimals) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        cio.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));

  // Nav background shift on scroll
  const nav = document.querySelector(".nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  });
})();
