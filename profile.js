// Update footer year automatically
document.getElementById("year").textContent = new Date().getFullYear();

// Smooth scroll for links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

// Starfield canvas animation
(function() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w = canvas.width = canvas.offsetWidth;
  let h = canvas.height = canvas.offsetHeight;
  const DPR = window.devicePixelRatio || 1;
  canvas.width = w * DPR;
  canvas.height = h * DPR;
  ctx.scale(DPR, DPR);

  // configurable
  const STAR_COUNT = Math.floor((w * h) / 6000); // density tweak
  const MAX_RADIUS = 1.6;
  const MIN_RADIUS = 0.3;
  const stars = [];
  let mouseX = w / 2, mouseY = h / 2;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  // Create stars with depth
  for (let i = 0; i < STAR_COUNT; i++) {
    const depth = Math.random(); // 0..1 (closer = brighter, bigger)
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      baseX: 0,
      baseY: 0,
      radius: rand(MIN_RADIUS, MAX_RADIUS) * (0.5 + depth),
      alpha: 0.3 + depth * 0.9,
      twinkleSpeed: rand(0.002, 0.01),
      twinklePhase: Math.random() * Math.PI * 2,
      depth
    });
  }

  // resize handling
  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    canvas.width = w * DPR;
    canvas.height = h * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);

  // optional parallax on mouse
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) || w / 2;
    mouseY = (e.clientY - rect.top) || h / 2;
  });

  let last = performance.now();
  function frame(now) {
    const dt = now - last;
    last = now;

    ctx.clearRect(0, 0, w, h);

    // draw background subtle gradient (optional)
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(10,12,20,0.95)'); // adjust to match hero
    g.addColorStop(1, 'rgba(18,18,28,0.95)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // draw stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      // parallax offset relative to center and depth
      const dx = (mouseX - w / 2) * (s.depth - 0.5) * 0.02;
      const dy = (mouseY - h / 2) * (s.depth - 0.5) * 0.02;

      // twinkle: sinusoidal alpha oscillation
      s.twinklePhase += s.twinkleSpeed * dt;
      const alpha = s.alpha * (0.75 + 0.25 * Math.sin(s.twinklePhase));

      // gentle drift for realism
      s.x += Math.sin(now * 0.0001 + i) * 0.02 * (s.depth + 0.2);
      s.y += Math.cos(now * 0.00008 + i) * 0.01 * (s.depth + 0.2);

      // wrap around edges
      if (s.x < -10) s.x = w + 10;
      if (s.x > w + 10) s.x = -10;
      if (s.y < -10) s.y = h + 10;
      if (s.y > h + 10) s.y = -10;

      ctx.beginPath();
      const r = s.radius * (1 + 0.2 * Math.sin(s.twinklePhase));
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      // draw small soft glow
      ctx.shadowBlur = 6 * (s.depth + 0.2);
      ctx.shadowColor = `rgba(200,220,255,${alpha})`;
      ctx.arc(s.x + dx, s.y + dy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
