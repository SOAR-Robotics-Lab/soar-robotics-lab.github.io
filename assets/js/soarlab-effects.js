(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (reducedMotion) return;

  const createMascot = () => {
    if (document.querySelector(".soar-mascot")) return;

    const mascot = document.createElement("div");
    mascot.className = "soar-mascot";
    mascot.setAttribute("aria-hidden", "true");
    mascot.innerHTML = '<img src="/assets/img/soarlab-128.png" alt="">';
    document.body.appendChild(mascot);
  };

  const setupHeroTilt = () => {
    const heroes = document.querySelectorAll(".soar-hero, .soar-open-hero");

    heroes.forEach((hero) => {
      hero.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const tiltX = (0.5 - y) * 3.5;
        const tiltY = (x - 0.5) * 4.5;

        hero.style.setProperty("--soar-glow-x", `${x * 100}%`);
        hero.style.setProperty("--soar-glow-y", `${y * 100}%`);
        hero.style.setProperty("--soar-tilt-x", `${tiltX}deg`);
        hero.style.setProperty("--soar-tilt-y", `${tiltY}deg`);
      });

      hero.addEventListener("pointerleave", () => {
        hero.style.setProperty("--soar-tilt-x", "0deg");
        hero.style.setProperty("--soar-tilt-y", "0deg");
      });
    });
  };

  const setupCardGlow = () => {
    document.querySelectorAll(".soar-open-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--card-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--card-y", `${event.clientY - rect.top}px`);
      });
    });
  };

  const setupCursorTrail = () => {
    if (!finePointer) return;

    let lastTrail = 0;
    window.addEventListener(
      "pointermove",
      (event) => {
        const now = performance.now();
        if (now - lastTrail < 55) return;
        lastTrail = now;

        const trail = document.createElement("span");
        trail.className = "soar-cursor-trail";
        trail.style.left = `${event.clientX}px`;
        trail.style.top = `${event.clientY}px`;
        document.body.appendChild(trail);
        trail.addEventListener("animationend", () => trail.remove(), { once: true });
      },
      { passive: true }
    );
  };

  const setupGitHubStars = () => {
    document.querySelectorAll("[data-github-repo]").forEach(async (element) => {
      const repo = element.dataset.githubRepo;
      if (!repo) return;

      try {
        const response = await fetch(`https://api.github.com/repos/${repo}`, {
          headers: { Accept: "application/vnd.github+json" },
        });
        if (!response.ok) throw new Error(`GitHub API ${response.status}`);

        const data = await response.json();
        const stars = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(data.stargazers_count || 0);
        const label = element.dataset.starLabel || "stars";
        element.textContent = `★ ${stars} ${label}`;
        element.setAttribute("aria-label", `${data.stargazers_count || 0} GitHub stars`);
      } catch (_error) {
        element.textContent = element.dataset.starFallback || "★ stars unavailable";
      }
    });
  };

  const boot = () => {
    createMascot();
    setupHeroTilt();
    setupCardGlow();
    setupCursorTrail();
    setupGitHubStars();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
