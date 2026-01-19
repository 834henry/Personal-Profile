// Update footer year automatically
document.getElementById("year").textContent = new Date().getFullYear();

// Smooth scroll for links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document
      .querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

// Animate sections on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Apply fade-in animation to sections
document.querySelectorAll("section").forEach((section) => {
  section.style.opacity = "0";
  section.style.transform = "translateY(30px)";
  section.style.transition = "opacity 0.8s ease, transform 0.8s ease";
  observer.observe(section);
});

// Animate publication cards on scroll
const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 100);
      }
    });
  },
  { threshold: 0.1 },
);

document
  .querySelectorAll(".publication-card, .card, .skill-category")
  .forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    cardObserver.observe(card);
  });

// Animate specialty tags on scroll
const tagObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const tags = entry.target.querySelectorAll(".tag");
        tags.forEach((tag, i) => {
          setTimeout(() => {
            tag.style.opacity = "1";
            tag.style.transform = "scale(1)";
          }, i * 50);
        });
      }
    });
  },
  { threshold: 0.2 },
);

const specialtySection = document.querySelector(".writing-specialties");
if (specialtySection) {
  document.querySelectorAll(".tag").forEach((tag) => {
    tag.style.opacity = "0";
    tag.style.transform = "scale(0.8)";
    tag.style.transition = "opacity 0.4s ease, transform 0.4s ease";
  });
  tagObserver.observe(specialtySection);
}

// Add typing effect to hero subtitle
const heroSubtitle = document.querySelector(".hero-subtitle");
if (heroSubtitle) {
  const originalText = heroSubtitle.textContent;
  heroSubtitle.textContent = "";
  let charIndex = 0;

  function typeWriter() {
    if (charIndex < originalText.length) {
      heroSubtitle.textContent += originalText.charAt(charIndex);
      charIndex++;
      setTimeout(typeWriter, 50);
    }
  }

  // Start typing after a short delay
  setTimeout(typeWriter, 500);
}

// Add hover effect to experience items
document.querySelectorAll(".experience li").forEach((item) => {
  item.addEventListener("mouseenter", function () {
    this.style.borderLeftColor = "#ffd700";
    this.style.paddingLeft = "25px";
  });

  item.addEventListener("mouseleave", function () {
    this.style.borderLeftColor = "rgba(225, 126, 5, 0.986)";
    this.style.paddingLeft = "15px";
  });

  item.style.transition = "all 0.3s ease";
});

// Counter animation for stats (if you want to add numerical stats later)
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);

  function updateCounter() {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  }

  updateCounter();
}

// Starfield canvas animation
(function () {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let w = (canvas.width = canvas.offsetWidth);
  let h = (canvas.height = canvas.offsetHeight);
  const DPR = window.devicePixelRatio || 1;
  canvas.width = w * DPR;
  canvas.height = h * DPR;
  ctx.scale(DPR, DPR);

  // configurable
  const STAR_COUNT = Math.floor((w * h) / 6000);
  const MAX_RADIUS = 1.6;
  const MIN_RADIUS = 0.3;
  const stars = [];
  let mouseX = w / 2,
    mouseY = h / 2;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

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
      depth,
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
  window.addEventListener("resize", resize);

  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left || w / 2;
    mouseY = e.clientY - rect.top || h / 2;
  });

  let last = performance.now();
  function frame(now) {
    const dt = now - last;
    last = now;

    ctx.clearRect(0, 0, w, h);

    // draw background subtle gradient
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "rgba(10,12,20,0.95)");
    g.addColorStop(1, "rgba(18,18,28,0.95)");
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

// Add smooth reveal for profile picture
window.addEventListener("load", () => {
  const profilePic = document.querySelector(".pics");
  if (profilePic) {
    profilePic.style.opacity = "0";
    profilePic.style.transform = "scale(0.8)";
    profilePic.style.transition = "opacity 1s ease, transform 1s ease";

    setTimeout(() => {
      profilePic.style.opacity = "1";
      profilePic.style.transform = "scale(1)";
    }, 300);
  }
});

// Add active navigation highlight on scroll
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll('a[href^="#"]');

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Console Easter egg for developers
console.log(
  "%cHey there, fellow developer! 👋",
  "color: #ffd700; font-size: 20px; font-weight: bold;",
);
console.log(
  "%cInterested in collaboration? Reach out at messiahhenry07@gmail.com",
  "color: rgba(225, 126, 5, 0.986); font-size: 14px;",
);
console.log(
  "%cCheck out my GitHub: https://github.com/834henry",
  "color: #fff; font-size: 12px;",
);
