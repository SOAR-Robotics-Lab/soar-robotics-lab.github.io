(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
  const assetPath = (path) => `${window.location.origin}/assets/${path}`;

  const createMascot = () => {
    if (document.querySelector(".soar-mascot")) return;

    const mascot = document.createElement("button");
    mascot.className = "soar-mascot";
    mascot.type = "button";
    mascot.setAttribute("aria-label", "Open SOARLAB research game");
    mascot.innerHTML = '<img src="/assets/img/soarlab-128.png" alt="">';
    document.body.appendChild(mascot);
  };

  const setupHeroTilt = () => {
    if (reducedMotion) return;

    document.querySelectorAll(".soar-hero, .soar-open-hero").forEach((hero) => {
      hero.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        hero.style.setProperty("--soar-glow-x", `${x * 100}%`);
        hero.style.setProperty("--soar-glow-y", `${y * 100}%`);
        hero.style.setProperty("--soar-tilt-x", `${(0.5 - y) * 3.5}deg`);
        hero.style.setProperty("--soar-tilt-y", `${(x - 0.5) * 4.5}deg`);
      });

      hero.addEventListener("pointerleave", () => {
        hero.style.setProperty("--soar-tilt-x", "0deg");
        hero.style.setProperty("--soar-tilt-y", "0deg");
      });
    });
  };

  const setupCardGlow = () => {
    if (reducedMotion) return;

    document.querySelectorAll(".soar-open-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--card-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--card-y", `${event.clientY - rect.top}px`);
      });
    });
  };

  const setupCursorTrail = () => {
    if (reducedMotion || !finePointer) return;

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

  const setupQRCodeShare = () => {
    const triggers = document.querySelectorAll(".soar-share-button");
    if (!triggers.length) return;

    const isZh = document.documentElement.lang === "zh" || window.location.pathname.startsWith("/zh/");
    const text = isZh
      ? {
          label: "SOARLAB 主页二维码",
          intro: "扫码访问 SOARLAB 课题组主页，也可以下载此二维码放入 PPT。",
          copy: "复制链接",
          copied: "已复制",
          download: "下载 PNG",
          close: "关闭",
        }
      : {
          label: "SOARLAB homepage QR code",
          intro: "Scan to open the SOARLAB homepage, or download this QR code for slides.",
          copy: "Copy link",
          copied: "Copied",
          download: "Download PNG",
          close: "Close",
        };
    const shareUrl = "https://www.soar-lab.org/";
    let dialog;
    let previousFocus;

    const closeDialog = () => {
      if (!dialog) return;
      dialog.classList.remove("soar-qr-share--active");
      document.body.classList.remove("soar-qr-share-active");
      previousFocus?.focus?.({ preventScroll: true });
    };

    const createDialog = () => {
      if (dialog) return;
      dialog = document.createElement("div");
      dialog.className = "soar-qr-share";
      dialog.innerHTML = `
        <div class="soar-qr-share__backdrop" data-soar-qr-close></div>
        <section class="soar-qr-share__card" role="dialog" aria-modal="true" aria-labelledby="soar-qr-share-title">
          <button class="soar-qr-share__close" type="button" aria-label="${text.close}" data-soar-qr-close>×</button>
          <p class="soar-qr-share__kicker">SOARLAB</p>
          <h2 id="soar-qr-share-title">${text.label}</h2>
          <p>${text.intro}</p>
          <div class="soar-qr-share__image">
            <img src="/assets/img/soarlab-home-qr.png" alt="${text.label}">
          </div>
          <code>${shareUrl}</code>
          <div class="soar-qr-share__actions">
            <button class="btn btn-primary soar-qr-share__copy" type="button">${text.copy}</button>
            <a class="btn btn-outline-primary" href="/assets/img/soarlab-home-qr.png" download="soarlab-home-qr.png">${text.download}</a>
          </div>
        </section>
      `;
      document.body.appendChild(dialog);
      dialog.addEventListener("click", (event) => {
        if (event.target.closest("[data-soar-qr-close]")) closeDialog();
      });
      dialog.querySelector(".soar-qr-share__copy").addEventListener("click", async (event) => {
        try {
          await navigator.clipboard.writeText(shareUrl);
          event.currentTarget.textContent = text.copied;
          window.setTimeout(() => {
            event.currentTarget.textContent = text.copy;
          }, 1500);
        } catch (_error) {
          window.prompt(text.copy, shareUrl);
        }
      });
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        createDialog();
        previousFocus = document.activeElement;
        dialog.classList.add("soar-qr-share--active");
        document.body.classList.add("soar-qr-share-active");
        dialog.querySelector(".soar-qr-share__copy")?.focus({ preventScroll: true });
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && dialog?.classList.contains("soar-qr-share--active")) {
        closeDialog();
      }
    });
  };

  const setupResearchGame = () => {
    const isZh = document.documentElement.lang === "zh" || window.location.pathname.startsWith("/zh/");
    const text = isZh
      ? {
          title: "飞行通用智能科研通关",
          subtitle: "键盘控制 SOAR 小机器人，在当前网页里打穿科研难题。",
          start: "开始",
          restart: "重来",
          close: "退出",
          pause: "暂停",
          resume: "继续",
          ready: "按 Enter 开始，或点击开始按钮",
          controls: "WASD / 方向键移动，空格发射，F 或 Shift 切换飞行/行走形态，P 暂停，Esc 退出。",
          mobileControls: "移动端可倾斜手机控制方向，也可拖动角色微调；点击“切换形态”按钮变形。",
          switchForm: "切换形态",
          flight: "飞行",
          walk: "行走",
          flightInfo: "飞行形态：速度快、双发、单发伤害低，可通过空中试飞门。",
          walkInfo: "行走形态：速度慢、重炮、伤害高，可通过地面装配区。",
          airGate: "空中试飞门",
          groundGate: "地面装配区",
          wrongAir: "需要切到飞行形态",
          wrongGround: "需要切到行走形态",
          gateClear: "形态匹配，继续推进",
          gateMiss: "形态不匹配，实验失败",
          score: "Score",
          lives: "Lives",
          wave: "Wave",
          tiltReady: "陀螺仪已启用",
          tiltDenied: "陀螺仪不可用，可触控拖动",
          win: "通关：今天也推进了飞行通用智能",
          lose: "科研暂时卡住了，换个 baseline 再来",
        }
      : {
          title: "SOAR Research Flight",
          subtitle: "Pilot the SOAR robot through research problems directly on this page.",
          start: "Start",
          restart: "Restart",
          close: "Exit",
          pause: "Pause",
          resume: "Resume",
          ready: "Press Enter or click Start",
          controls: "WASD / arrow keys to move, Space to fire, F or Shift to transform, P to pause, Esc to exit.",
          mobileControls: "On mobile, tilt your phone to steer; touch-drag is a fallback. Tap Transform to switch modes.",
          switchForm: "Transform",
          flight: "Flight",
          walk: "Walk",
          flightInfo: "Flight mode: fast movement, twin low-damage shots, clears aerial test gates.",
          walkInfo: "Ground mode: slower movement, heavy high-damage shots, clears ground assembly zones.",
          airGate: "Aerial Test Gate",
          groundGate: "Ground Assembly Zone",
          wrongAir: "Switch to flight mode",
          wrongGround: "Switch to ground mode",
          gateClear: "Form matched; keep pushing",
          gateMiss: "Wrong form; experiment failed",
          score: "Score",
          lives: "Lives",
          wave: "Wave",
          tiltReady: "tilt control on",
          tiltDenied: "tilt unavailable; touch-drag enabled",
          win: "Cleared: flying general intelligence advanced",
          lose: "Research blocked for now; try another baseline",
        };

    const spriteFiles = {
      player: "player",
      playerWalker: "player-walker",
      bullet: "bullet",
      missile: "missile",
      shield: "shield",
      research: "research",
      paper: "paper-review",
      code: "code-bug",
      data: "data-monster",
      deadline: "deadline",
      graduation: "graduation",
      compute: "compute",
      hardware: "hardware-gremlin",
      reviewer: "reviewer-boss",
      project: "project-boss",
      dragon: "dissertation-dragon",
      citadel: "publish-citadel",
    };
    const sprites = {};

    Object.entries(spriteFiles).forEach(([key, file]) => {
      const image = new Image();
      image.src = assetPath(`img/soar-game/${file}.png`);
      sprites[key] = image;
    });

    const spriteReady = Promise.all(
      Object.values(sprites).map(
        (image) =>
          new Promise((resolve) => {
            if (image.complete && image.naturalWidth) {
              resolve();
              return;
            }
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          })
      )
    );

    const enemyTypes = [
      { sprite: "research", en: "Research Knot", zh: "研究难题", hp: 1, speed: 82, score: 12, size: 40, fireRate: 0.012 },
      { sprite: "paper", en: "Reviewer No.2", zh: "审稿意见", hp: 2, speed: 62, score: 20, size: 44, fireRate: 0.018 },
      { sprite: "code", en: "Code Bug", zh: "代码 bug", hp: 1, speed: 92, score: 12, size: 38, fireRate: 0.012 },
      { sprite: "data", en: "Dataset Chaos", zh: "数据混乱", hp: 2, speed: 58, score: 22, size: 46, fireRate: 0.014 },
      { sprite: "deadline", en: "Deadline Meteor", zh: "DDL 陨石", hp: 2, speed: 88, score: 24, size: 46, fireRate: 0.016 },
      { sprite: "hardware", en: "Hardware Gremlin", zh: "硬件妖怪", hp: 2, speed: 72, score: 20, size: 42, fireRate: 0.018 },
      { sprite: "compute", en: "GPU Overheat", zh: "算力过热", hp: 3, speed: 52, score: 30, size: 48, fireRate: 0.022 },
      { sprite: "graduation", en: "Graduation Pressure", zh: "毕业压力", hp: 3, speed: 48, score: 32, size: 50, fireRate: 0.02 },
    ];

    const eliteTypes = [
      { sprite: "reviewer", en: "Revision Storm", zh: "大修风暴", hp: 18, speed: 28, score: 180, size: 78, fireRate: 0.08, elite: true },
      { sprite: "project", en: "Milestone Swarm", zh: "项目节点", hp: 24, speed: 24, score: 240, size: 84, fireRate: 0.09, elite: true },
      { sprite: "dragon", en: "Thesis Dragon", zh: "论文巨龙", hp: 36, speed: 22, score: 420, size: 98, fireRate: 0.11, elite: true },
      {
        sprite: "citadel",
        en: "Publish Citadel",
        zh: "发表城堡",
        hp: 52,
        speed: 18,
        score: 720,
        size: 108,
        fireRate: 0.13,
        elite: true,
        final: true,
      },
    ];

    const formProfiles = {
      flight: {
        sprite: "player",
        label: text.flight,
        speed: 340,
        damage: 1,
        bulletSpeed: -540,
        bulletSize: 18,
        cooldown: 0.12,
        burstColor: "#57d8ff",
      },
      walk: {
        sprite: "playerWalker",
        label: text.walk,
        speed: 210,
        damage: 3,
        bulletSpeed: -395,
        bulletSize: 28,
        cooldown: 0.32,
        burstColor: "#ffb248",
      },
    };

    const gateTypes = [
      {
        requiredForm: "flight",
        en: text.airGate,
        zh: text.airGate,
        speed: 58,
        score: 90,
        size: 104,
      },
      {
        requiredForm: "walk",
        en: text.groundGate,
        zh: text.groundGate,
        speed: 44,
        score: 120,
        size: 112,
      },
    ];

    let overlay;
    let canvas;
    let context;
    let hud;
    let panel;
    let titleNode;
    let summaryNode;
    let startButton;
    let pauseButton;
    let formButton;
    let animationFrame = 0;
    let lastTime = 0;
    let starting = false;
    const keys = new Set();
    const state = {
      mode: "idle",
      width: window.innerWidth,
      height: window.innerHeight,
      score: 0,
      lives: 3,
      wave: 1,
      spawnTimer: 0,
      gateTimer: 6,
      nextGateForm: "flight",
      eliteIndex: 0,
      eliteTimer: 10,
      finalQueued: false,
      fireCooldown: 0,
      invulnerable: 1.2,
      touchActive: false,
      touchX: 0,
      touchY: 0,
      motionEnabled: false,
      motionSeen: false,
      motionBaseBeta: null,
      motionBaseGamma: null,
      motionX: 0,
      motionY: 0,
      motionStatus: "",
      form: "flight",
      formFlash: 0,
      formMessage: "",
      player: { x: 0, y: 0, size: 48 },
      bullets: [],
      enemies: [],
      enemyShots: [],
      particles: [],
      spawners: [],
    };

    const resize = () => {
      if (!canvas) return;
      state.width = Math.max(320, window.innerWidth);
      state.height = Math.max(480, window.innerHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(state.width * dpr);
      canvas.height = Math.round(state.height * dpr);
      canvas.style.width = `${state.width}px`;
      canvas.style.height = `${state.height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      state.player.x = Math.max(28, Math.min(state.width - 28, state.player.x || state.width - 72));
      state.player.y = Math.max(92, Math.min(state.height - 34, state.player.y || state.height - 88));
      collectSpawners();
    };

    const collectSpawners = () => {
      const links = [...document.querySelectorAll(".navbar a.nav-link, .navbar-brand.title")].filter((link) => {
        const textContent = link.textContent.trim().toLowerCase();
        const rect = link.getBoundingClientRect();
        return rect.width > 4 && rect.height > 4 && !textContent.includes("中文") && !textContent.includes("english");
      });

      state.spawners = links.map((link, index) => {
        const rect = link.getBoundingClientRect();
        return {
          element: link,
          label: link.textContent.trim() || "SOARLAB",
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height + 12,
          index,
        };
      });

      if (state.spawners.length < 3) {
        const labels = isZh ? ["研究", "论文", "开源", "组员", "毕业"] : ["Research", "Papers", "Open Source", "People", "Graduation"];
        state.spawners = [
          ...state.spawners,
          ...labels.map((label, index) => ({
            label,
            x: ((index + 1) * state.width) / (labels.length + 1),
            y: 68,
            index,
          })),
        ];
      }
    };

    const getMascotSpawnPoint = () => {
      const mascot = document.querySelector(".soar-mascot");
      if (mascot) {
        const rect = mascot.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };
        }
      }
      return { x: state.width - 64, y: state.height - 72 };
    };

    const createOverlay = () => {
      if (overlay) return;

      overlay = document.createElement("div");
      overlay.className = "soar-game";
      overlay.innerHTML = `
        <canvas class="soar-game__canvas" aria-label="${text.title}"></canvas>
        <div class="soar-game__hud" aria-live="polite"></div>
        <section class="soar-game__panel" role="dialog" aria-modal="false" aria-labelledby="soar-game-title">
          <p class="soar-game__kicker">${isZh ? "SOARLAB 隐藏小游戏" : "SOARLAB hidden mini game"}</p>
          <h2 id="soar-game-title">${text.title}</h2>
          <p class="soar-game__summary">${text.subtitle}</p>
          <p class="soar-game__controls">${text.controls}</p>
          <p class="soar-game__forms"><strong>${text.flight}</strong>: ${text.flightInfo}<br><strong>${text.walk}</strong>: ${text.walkInfo}</p>
          <p class="soar-game__mobile">${text.mobileControls}</p>
          <div class="soar-game__actions">
            <button class="btn btn-primary soar-game__start" type="button">${text.start}</button>
            <button class="btn btn-outline-primary soar-game__form" type="button">${text.switchForm}</button>
            <button class="btn btn-outline-primary soar-game__pause" type="button">${text.pause}</button>
            <button class="btn btn-outline-primary soar-game__exit" type="button">${text.close}</button>
          </div>
        </section>
      `;
      document.body.appendChild(overlay);

      canvas = overlay.querySelector(".soar-game__canvas");
      canvas.tabIndex = 0;
      context = canvas.getContext("2d");
      hud = overlay.querySelector(".soar-game__hud");
      panel = overlay.querySelector(".soar-game__panel");
      titleNode = panel.querySelector("h2");
      summaryNode = panel.querySelector(".soar-game__summary");
      startButton = overlay.querySelector(".soar-game__start");
      pauseButton = overlay.querySelector(".soar-game__pause");
      formButton = overlay.querySelector(".soar-game__form");

      overlay.querySelector(".soar-game__exit").addEventListener("click", closeGame);
      startButton.addEventListener("click", startGame);
      pauseButton.addEventListener("click", togglePause);
      formButton.addEventListener("click", toggleForm);

      if (coarsePointer) {
        canvas.addEventListener("pointerdown", handleTouchMove);
        canvas.addEventListener("pointermove", handleTouchMove);
        canvas.addEventListener("pointerup", () => {
          state.touchActive = false;
        });
      }

      resize();
      window.addEventListener("resize", resize);
    };

    const openIntro = () => {
      createOverlay();
      overlay.classList.add("soar-game--active", "soar-game--intro");
      overlay.classList.remove("soar-game--ended", "soar-game--playing");
      document.body.classList.add("soar-game-active");
      setMascotGameMode(true);
      collectSpawners();
      resetPlayerToMascot();
      draw();
      renderHud(text.ready);
      titleNode.textContent = text.title;
      summaryNode.textContent = text.subtitle;
      startButton.textContent = text.start;
      pauseButton.textContent = text.pause;
      panel.classList.remove("soar-game__panel--result");
      startButton.focus({ preventScroll: true });
    };

    const startGame = () => {
      if (starting) return;
      createOverlay();
      overlay.classList.add("soar-game--active", "soar-game--playing");
      overlay.classList.remove("soar-game--intro", "soar-game--ended");
      document.body.classList.add("soar-game-active");
      panel?.classList.remove("soar-game__panel--result");
      setMascotGameMode(true);
      renderHud(isZh ? "正在装载图标..." : "Loading sprites...");
      starting = true;
      const motionReady = coarsePointer ? enableMotionControl() : Promise.resolve();
      Promise.all([spriteReady, motionReady]).finally(beginGame);
    };

    const beginGame = () => {
      starting = false;
      if (!overlay?.classList.contains("soar-game--active")) return;
      resetState();
      renderHud();
      startButton.textContent = text.restart;
      cancelAnimationFrame(animationFrame);
      lastTime = performance.now();
      animationFrame = requestAnimationFrame(loop);
      canvas.focus({ preventScroll: true });
    };

    const resetPlayerToMascot = () => {
      const spawn = getMascotSpawnPoint();
      state.player = { x: spawn.x, y: spawn.y, size: 48 };
    };

    const resetState = () => {
      collectSpawners();
      resetPlayerToMascot();
      state.mode = "playing";
      state.score = 0;
      state.lives = 3;
      state.wave = 1;
      state.spawnTimer = 0.6;
      state.gateTimer = 4.2;
      state.nextGateForm = "flight";
      state.eliteIndex = 0;
      state.eliteTimer = 8;
      state.finalQueued = false;
      state.fireCooldown = 0;
      state.invulnerable = 1.25;
      state.touchActive = false;
      state.form = "flight";
      state.formFlash = 0.8;
      state.formMessage = text.flightInfo;
      state.bullets = [];
      state.enemies = [];
      state.enemyShots = [];
      state.particles = [];
      primeOpeningWave();
      document.querySelectorAll(".soar-nav-spawner").forEach((link) => link.classList.remove("soar-nav-spawner"));
      state.spawners.forEach((spawner) => spawner.element?.classList.add("soar-nav-spawner"));
      updateFormButton();
    };

    const primeOpeningWave = () => {
      [0, 1, 2].forEach((offset) => spawnEnemy(false, offset));
    };

    const handleTouchMove = (event) => {
      if (state.mode !== "playing") return;
      state.touchActive = true;
      const touch = event.touches ? event.touches[0] : event;
      state.touchX = touch.clientX;
      state.touchY = touch.clientY;
    };

    const handleDeviceOrientation = (event) => {
      if (event.beta == null || event.gamma == null) return;
      if (state.motionBaseBeta == null || state.motionBaseGamma == null) {
        state.motionBaseBeta = event.beta;
        state.motionBaseGamma = event.gamma;
      }
      state.motionSeen = true;
      state.motionX = Math.max(-1, Math.min(1, (event.gamma - state.motionBaseGamma) / 18));
      state.motionY = Math.max(-1, Math.min(1, (event.beta - state.motionBaseBeta) / 18));
    };

    const enableMotionControl = async () => {
      if (!("DeviceOrientationEvent" in window)) {
        state.motionStatus = text.tiltDenied;
        return;
      }

      try {
        if (typeof window.DeviceOrientationEvent.requestPermission === "function") {
          const permission = await window.DeviceOrientationEvent.requestPermission();
          if (permission !== "granted") {
            state.motionStatus = text.tiltDenied;
            return;
          }
        }
        window.addEventListener("deviceorientation", handleDeviceOrientation, true);
        state.motionEnabled = true;
        state.motionStatus = text.tiltReady;
      } catch (_error) {
        state.motionStatus = text.tiltDenied;
      }
    };

    function closeGame() {
      if (!overlay) return;
      state.mode = "idle";
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("deviceorientation", handleDeviceOrientation, true);
      state.motionEnabled = false;
      state.motionStatus = "";
      state.form = "flight";
      updateFormButton();
      overlay.classList.remove("soar-game--active", "soar-game--intro", "soar-game--ended", "soar-game--playing");
      document.body.classList.remove("soar-game-active");
      document.querySelectorAll(".soar-nav-spawner").forEach((link) => link.classList.remove("soar-nav-spawner"));
      setMascotGameMode(false);
    }

    function togglePause() {
      if (state.mode === "playing") {
        state.mode = "paused";
        pauseButton.textContent = text.resume;
        renderHud(isZh ? "暂停中" : "Paused");
        draw();
        drawBanner(text.pause, text.controls);
      } else if (state.mode === "paused") {
        state.mode = "playing";
        pauseButton.textContent = text.pause;
        lastTime = performance.now();
        animationFrame = requestAnimationFrame(loop);
      }
    }

    function toggleForm() {
      if (!overlay?.classList.contains("soar-game--active")) return;
      state.form = state.form === "flight" ? "walk" : "flight";
      const profile = formProfiles[state.form];
      state.formFlash = 0.62;
      state.formMessage = state.form === "flight" ? text.flightInfo : text.walkInfo;
      addBurst(state.player.x, state.player.y, profile.burstColor, 16, 0.48);
      updateFormButton();
      setMascotGameMode(true);
      renderHud();
    }

    const updateFormButton = () => {
      if (!formButton) return;
      formButton.textContent = `${text.switchForm}: ${formProfiles[state.form].label}`;
      formButton.dataset.form = state.form;
    };

    const setMascotGameMode = (active) => {
      const mascot = document.querySelector(".soar-mascot");
      if (!mascot) return;
      mascot.classList.toggle("soar-mascot--game", active);
      const image = mascot.querySelector("img");
      if (image) image.src = active ? `/assets/img/soar-game/${spriteFiles[formProfiles[state.form].sprite]}.png` : "/assets/img/soarlab-128.png";
    };

    const renderHud = (extra = "") => {
      if (!hud) return;
      const motion = state.motionStatus ? ` · ${state.motionStatus}` : "";
      const form = `${text.switchForm}: ${formProfiles[state.form].label}`;
      const message = extra || state.formMessage;
      hud.textContent = `${text.score}: ${state.score} · ${text.lives}: ${state.lives} · ${text.wave}: ${state.wave} · ${form}${motion}${message ? ` · ${message}` : ""}`;
    };

    const drawSprite = (sprite, x, y, size, rotation = 0, alpha = 1) => {
      const image = sprites[sprite];
      context.save();
      context.globalAlpha = alpha;
      context.translate(x, y);
      context.rotate(rotation);
      if (image && image.complete && image.naturalWidth) {
        context.drawImage(image, -size / 2, -size / 2, size, size);
      } else {
        context.fillStyle = "#31c6d4";
        context.beginPath();
        context.arc(0, 0, size / 2, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
    };

    const draw = () => {
      if (!context) return;
      context.clearRect(0, 0, state.width, state.height);
      drawGameAtmosphere();

      state.bullets.forEach((bullet) => drawSprite(bullet.sprite || "bullet", bullet.x, bullet.y, bullet.size, -0.08));
      state.enemyShots.forEach((shot) => drawSprite("missile", shot.x, shot.y, shot.size, Math.atan2(shot.vy, shot.vx) + Math.PI / 2));

      state.enemies.forEach((enemy) => {
        if (enemy.gate) {
          drawGate(enemy);
        } else {
          drawSprite(enemy.sprite, enemy.x, enemy.y, enemy.size, Math.sin(enemy.y / 72) * 0.08);
        }
        const label = isZh ? enemy.zh : enemy.en;
        context.font = enemy.elite ? "700 13px system-ui, sans-serif" : "600 10px system-ui, sans-serif";
        context.textAlign = "center";
        context.fillStyle = "rgba(255, 255, 255, 0.92)";
        context.strokeStyle = "rgba(4, 13, 24, 0.86)";
        context.lineWidth = 3;
        context.strokeText(label, enemy.x, enemy.y + enemy.size / 2 + 14);
        context.fillText(label, enemy.x, enemy.y + enemy.size / 2 + 14);
        if (enemy.elite) drawHpBar(enemy);
      });

      state.particles.forEach((particle) => {
        context.globalAlpha = Math.max(0, particle.life / particle.maxLife);
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      });
      context.globalAlpha = 1;

      const blink = state.invulnerable > 0 && Math.floor(performance.now() / 90) % 2 === 0;
      if (state.invulnerable > 0) drawSprite("shield", state.player.x, state.player.y, state.player.size * 1.35, 0, 0.72);
      const formProfile = formProfiles[state.form];
      const bob = state.form === "flight" ? Math.sin(performance.now() / 110) * 3 : Math.abs(Math.sin(performance.now() / 105)) * 2;
      drawSprite(
        formProfile.sprite,
        state.player.x,
        state.player.y - bob,
        state.player.size,
        state.form === "flight" ? -0.05 : Math.sin(performance.now() / 140) * 0.05,
        blink ? 0.55 : 1
      );
      if (state.formFlash > 0) drawFormRing(formProfile);
    };

    const drawGameAtmosphere = () => {
      const top = document.querySelector("header, .navbar");
      const headerBottom = top ? top.getBoundingClientRect().bottom : 72;
      const gradient = context.createLinearGradient(0, Math.max(0, headerBottom - 80), 0, state.height);
      gradient.addColorStop(0, "rgba(52, 202, 214, 0.13)");
      gradient.addColorStop(0.55, "rgba(255, 122, 36, 0.05)");
      gradient.addColorStop(1, "rgba(6, 21, 32, 0.18)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, state.width, state.height);

      context.fillStyle = "rgba(42, 196, 207, 0.38)";
      state.spawners.forEach((spawner, index) => {
        const pulse = 5 + Math.sin(performance.now() / 280 + index) * 2;
        context.beginPath();
        context.arc(spawner.x, spawner.y, pulse, 0, Math.PI * 2);
        context.fill();
      });
    };

    const drawHpBar = (enemy) => {
      const width = Math.min(130, enemy.size * 1.25);
      const left = enemy.x - width / 2;
      const top = enemy.y - enemy.size / 2 - 13;
      context.fillStyle = "rgba(255, 255, 255, 0.28)";
      context.fillRect(left, top, width, 5);
      context.fillStyle = enemy.final ? "#ff4438" : "#ff9b3d";
      context.fillRect(left, top, width * Math.max(0, enemy.hp / enemy.maxHp), 5);
    };

    const drawGate = (gate) => {
      const correct = gate.requiredForm === state.form;
      context.save();
      context.translate(gate.x, gate.y);
      context.globalAlpha = 0.88;
      context.strokeStyle = gate.requiredForm === "flight" ? "rgba(80, 218, 255, 0.95)" : "rgba(255, 177, 72, 0.95)";
      context.fillStyle = gate.requiredForm === "flight" ? "rgba(80, 218, 255, 0.12)" : "rgba(255, 177, 72, 0.12)";
      context.lineWidth = correct ? 5 : 3;
      if (gate.requiredForm === "flight") {
        context.beginPath();
        context.ellipse(0, 0, gate.size * 0.46, gate.size * 0.28, Math.sin(gate.y / 70) * 0.1, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        drawSprite("player", 0, -2, gate.size * 0.32, 0, 0.38);
      } else {
        context.beginPath();
        context.roundRect(-gate.size * 0.52, -gate.size * 0.23, gate.size * 1.04, gate.size * 0.46, 14);
        context.fill();
        context.stroke();
        for (let i = -2; i <= 2; i += 1) {
          context.beginPath();
          context.arc(i * gate.size * 0.17, gate.size * 0.25, 4, 0, Math.PI * 2);
          context.fill();
        }
        drawSprite("playerWalker", 0, -3, gate.size * 0.34, 0, 0.42);
      }
      context.restore();
    };

    const drawFormRing = (profile) => {
      const alpha = Math.max(0, state.formFlash / 0.62);
      context.save();
      context.globalAlpha = alpha;
      context.strokeStyle = profile.burstColor;
      context.lineWidth = 3;
      context.beginPath();
      context.arc(state.player.x, state.player.y, state.player.size * (1.1 + (1 - alpha) * 0.85), 0, Math.PI * 2);
      context.stroke();
      context.fillStyle = "rgba(4, 13, 24, 0.72)";
      context.font = "700 12px system-ui, sans-serif";
      context.textAlign = "center";
      context.fillText(profile.label, state.player.x, state.player.y + state.player.size * 0.78);
      context.restore();
    };

    const fire = () => {
      if (state.fireCooldown > 0 || state.mode !== "playing") return;
      const profile = formProfiles[state.form];
      if (state.form === "flight") {
        state.bullets.push({
          x: state.player.x - 9,
          y: state.player.y - 25,
          vy: profile.bulletSpeed,
          size: profile.bulletSize,
          damage: profile.damage,
          sprite: "bullet",
        });
        state.bullets.push({
          x: state.player.x + 9,
          y: state.player.y - 25,
          vy: profile.bulletSpeed,
          size: profile.bulletSize,
          damage: profile.damage,
          sprite: "bullet",
        });
      } else {
        state.bullets.push({
          x: state.player.x,
          y: state.player.y - 23,
          vy: profile.bulletSpeed,
          size: profile.bulletSize,
          damage: profile.damage,
          sprite: "missile",
        });
      }
      state.fireCooldown = profile.cooldown;
    };

    const spawnEnemy = (forceElite = false, sourceOffset = 0) => {
      const shouldElite = forceElite || (state.eliteTimer <= 0 && state.eliteIndex < eliteTypes.length);
      const type = shouldElite ? eliteTypes[state.eliteIndex] : enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      if (shouldElite) {
        state.eliteIndex += 1;
        state.eliteTimer = 12 + state.eliteIndex * 4.5;
        state.wave += 1;
      }

      const spawner = state.spawners[(Math.floor(Math.random() * state.spawners.length) + sourceOffset) % state.spawners.length];
      const hp = type.hp + Math.floor(state.wave / 3);
      const size = type.size;
      state.enemies.push({
        ...type,
        hp,
        maxHp: hp,
        x: shouldElite ? state.width / 2 : Math.max(28, Math.min(state.width - 28, spawner.x + (Math.random() - 0.5) * 56)),
        y: shouldElite ? Math.max(86, spawner.y + 26) : spawner.y + 8,
        vx: shouldElite ? 52 : (Math.random() - 0.5) * 58,
        vy: type.speed + state.wave * 5,
        size,
        shootTimer: shouldElite ? 0.65 : 1.2 + Math.random() * 1.4,
        sourceLabel: spawner.label,
      });

      addBurst(spawner.x, spawner.y, "rgba(42, 196, 207, 0.9)", 7, 0.28);
    };

    const spawnGate = () => {
      const type = gateTypes.find((gate) => gate.requiredForm === state.nextGateForm) || gateTypes[0];
      const x = Math.max(type.size / 2 + 18, Math.min(state.width - type.size / 2 - 18, state.width * (0.25 + Math.random() * 0.5)));
      state.enemies.push({
        ...type,
        gate: true,
        hp: 999,
        maxHp: 999,
        x,
        y: 84,
        vx: 0,
        vy: type.speed + state.wave * 2,
        size: type.size,
        shootTimer: 999,
      });
      state.nextGateForm = state.nextGateForm === "flight" ? "walk" : "flight";
      state.gateTimer = 9.5 + Math.random() * 3.5;
      state.formMessage = type.requiredForm === "flight" ? text.flightInfo : text.walkInfo;
      addBurst(x, 84, type.requiredForm === "flight" ? "#57d8ff" : "#ffb248", 14, 0.42);
    };

    const enemyFire = (enemy) => {
      if (enemy.gate) return;
      const angle = Math.atan2(state.player.y - enemy.y, state.player.x - enemy.x);
      const speed = enemy.elite ? 185 : 145;
      const spread = enemy.elite ? [-0.22, 0, 0.22] : [0];
      spread.forEach((offset) => {
        state.enemyShots.push({
          x: enemy.x,
          y: enemy.y + enemy.size * 0.25,
          vx: Math.cos(angle + offset) * speed,
          vy: Math.sin(angle + offset) * speed,
          size: enemy.elite ? 22 : 18,
        });
      });
    };

    const addBurst = (x, y, color = "#ff8b3d", count = 8, maxLife = 0.45) => {
      for (let i = 0; i < count; i += 1) {
        state.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 180,
          vy: (Math.random() - 0.5) * 180,
          life: maxLife,
          maxLife,
          size: 2 + Math.random() * 2.5,
          color,
        });
      }
    };

    const collide = (a, b, ratio = 0.38) => Math.abs(a.x - b.x) < (a.size + b.size) * ratio && Math.abs(a.y - b.y) < (a.size + b.size) * ratio;

    const clearGate = (gate) => {
      gate.dead = true;
      state.score += gate.score;
      state.wave += gate.requiredForm === "walk" ? 1 : 0;
      state.formMessage = `${text.gateClear}: ${formProfiles[state.form].label}`;
      addBurst(gate.x, gate.y, formProfiles[state.form].burstColor, 24, 0.68);
    };

    const failGate = (gate, damage = 1) => {
      gate.dead = true;
      const required = gate.requiredForm === "flight" ? text.wrongAir : text.wrongGround;
      state.formMessage = `${text.gateMiss}: ${required}`;
      addBurst(gate.x, gate.y, "#ff5a45", 18, 0.58);
      hitPlayer(damage, false);
    };

    const update = (delta) => {
      const speed = formProfiles[state.form].speed;
      let dx = 0;
      let dy = 0;
      if (keys.has("ArrowLeft") || keys.has("a")) dx -= 1;
      if (keys.has("ArrowRight") || keys.has("d")) dx += 1;
      if (keys.has("ArrowUp") || keys.has("w")) dy -= 1;
      if (keys.has("ArrowDown") || keys.has("s")) dy += 1;

      if (dx && dy) {
        dx *= 0.707;
        dy *= 0.707;
      }

      if (coarsePointer && state.touchActive) {
        state.player.x += (state.touchX - state.player.x) * Math.min(1, delta * 7);
        state.player.y += (state.touchY - state.player.y) * Math.min(1, delta * 7);
      } else if (coarsePointer && state.motionEnabled && state.motionSeen) {
        state.player.x += state.motionX * speed * 1.25 * delta;
        state.player.y += state.motionY * speed * delta;
      } else {
        state.player.x += dx * speed * delta;
        state.player.y += dy * speed * delta;
      }

      state.player.x = Math.max(28, Math.min(state.width - 28, state.player.x));
      state.player.y = Math.max(88, Math.min(state.height - 34, state.player.y));

      if (keys.has(" ")) fire();
      state.fireCooldown = Math.max(0, state.fireCooldown - delta);
      state.invulnerable = Math.max(0, state.invulnerable - delta);
      state.formFlash = Math.max(0, state.formFlash - delta);
      state.spawnTimer -= delta;
      state.gateTimer -= delta;
      state.eliteTimer -= delta;

      if (state.spawnTimer <= 0) {
        spawnEnemy();
        state.spawnTimer = Math.max(0.42, 1.05 - state.wave * 0.055);
      }

      if (state.gateTimer <= 0) {
        spawnGate();
      }

      if (state.score > 1200 && !state.finalQueued) {
        state.finalQueued = true;
        state.eliteIndex = Math.max(state.eliteIndex, eliteTypes.length - 1);
        state.eliteTimer = 0;
      }

      state.bullets.forEach((bullet) => {
        bullet.y += bullet.vy * delta;
      });

      state.enemyShots.forEach((shot) => {
        shot.x += shot.vx * delta;
        shot.y += shot.vy * delta;
      });

      state.enemies.forEach((enemy) => {
        enemy.y += enemy.vy * delta;
        enemy.x += Math.sin(enemy.y / 50) * enemy.vx * delta;
        if (enemy.elite) {
          enemy.y = Math.min(enemy.y, 170);
          enemy.x = Math.max(enemy.size / 2, Math.min(state.width - enemy.size / 2, enemy.x));
        }
        enemy.shootTimer -= delta;
        if (enemy.shootTimer <= 0) {
          enemyFire(enemy);
          enemy.shootTimer = enemy.elite ? 0.72 + Math.random() * 0.38 : 1.6 + Math.random() * 1.2;
        }
      });

      state.particles.forEach((particle) => {
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        particle.life -= delta;
      });

      state.bullets.forEach((bullet) => {
        state.enemies.forEach((enemy) => {
          if (enemy.gate || enemy.dead || bullet.dead || !collide(bullet, enemy, 0.36)) return;
          bullet.dead = true;
          enemy.hp -= bullet.damage || 1;
          addBurst(bullet.x, bullet.y, formProfiles[state.form].burstColor, 6, 0.34);
          if (enemy.hp <= 0) {
            enemy.dead = true;
            state.score += enemy.score;
            addBurst(enemy.x, enemy.y, enemy.elite ? "#ffcf66" : "#ff8b3d", enemy.elite ? 18 : 9, enemy.elite ? 0.7 : 0.45);
            if (enemy.final) finishGame(true);
          }
        });
      });

      state.enemies.forEach((enemy) => {
        if (!enemy.gate || enemy.dead || !collide(state.player, enemy, 0.34)) return;
        if (enemy.requiredForm === state.form) {
          clearGate(enemy);
        } else {
          failGate(enemy);
        }
      });

      if (state.invulnerable <= 0) {
        state.enemies.forEach((enemy) => {
          if (enemy.gate || enemy.dead || !collide(state.player, enemy, 0.34)) return;
          enemy.dead = true;
          hitPlayer(enemy.elite ? 2 : 1);
        });

        state.enemyShots.forEach((shot) => {
          if (shot.dead || !collide(state.player, shot, 0.34)) return;
          shot.dead = true;
          hitPlayer(1);
        });
      }

      state.enemies.forEach((enemy) => {
        if (enemy.dead) return;
        if (enemy.y > state.height + enemy.size) {
          enemy.dead = true;
          if (enemy.gate) {
            failGate(enemy, 1);
            return;
          }
          hitPlayer(1, false);
        }
      });

      state.bullets = state.bullets.filter((bullet) => !bullet.dead && bullet.y > -40);
      state.enemyShots = state.enemyShots.filter(
        (shot) => !shot.dead && shot.x > -80 && shot.x < state.width + 80 && shot.y > -80 && shot.y < state.height + 80
      );
      state.enemies = state.enemies.filter((enemy) => !enemy.dead && enemy.y < state.height + 140);
      state.particles = state.particles.filter((particle) => particle.life > 0);
      renderHud();
    };

    const hitPlayer = (damage = 1, burst = true) => {
      state.lives -= damage;
      state.invulnerable = 1.15;
      if (burst) addBurst(state.player.x, state.player.y, "#ff5a45", 14, 0.55);
      if (state.lives <= 0) finishGame(false);
    };

    const drawBanner = (title, summary) => {
      context.fillStyle = "rgba(4, 13, 24, 0.72)";
      context.fillRect(Math.max(18, state.width / 2 - 185), state.height / 2 - 58, Math.min(370, state.width - 36), 116);
      context.textAlign = "center";
      context.fillStyle = "#ffffff";
      context.font = "700 21px system-ui, sans-serif";
      context.fillText(title, state.width / 2, state.height / 2 - 15);
      context.font = "500 12px system-ui, sans-serif";
      wrapText(summary, state.width / 2, state.height / 2 + 18, Math.min(320, state.width - 70), 18);
    };

    const wrapText = (content, x, y, maxWidth, lineHeight) => {
      const words = content.split(/\s+/);
      let line = "";
      words.forEach((word, index) => {
        const test = `${line}${word} `;
        if (context.measureText(test).width > maxWidth && index > 0) {
          context.fillText(line, x, y);
          line = `${word} `;
          y += lineHeight;
        } else {
          line = test;
        }
      });
      context.fillText(line, x, y);
    };

    function finishGame(won) {
      state.mode = "ended";
      cancelAnimationFrame(animationFrame);
      overlay.classList.add("soar-game--ended");
      overlay.classList.remove("soar-game--playing");
      titleNode.textContent = won ? text.win : text.lose;
      summaryNode.textContent = `${text.score}: ${state.score} · ${text.wave}: ${state.wave}`;
      startButton.textContent = text.restart;
      draw();
      drawBanner(titleNode.textContent, summaryNode.textContent);
      panel.classList.add("soar-game__panel--result");
    }

    function loop(now) {
      if (state.mode !== "playing") return;
      const delta = Math.min(0.033, (now - lastTime) / 1000 || 0.016);
      lastTime = now;
      update(delta);
      draw();
      animationFrame = requestAnimationFrame(loop);
    }

    document.addEventListener("keydown", (event) => {
      if (!overlay?.classList.contains("soar-game--active")) return;
      if (event.key === "Escape") {
        closeGame();
        return;
      }
      if (event.key === "Enter" && state.mode !== "playing") startGame();
      if (event.key.toLowerCase() === "p") togglePause();
      if ((event.key.toLowerCase() === "f" || event.key === "Shift") && state.mode === "playing") {
        event.preventDefault();
        toggleForm();
        return;
      }
      if ([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Shift"].includes(event.key)) event.preventDefault();
      keys.add(event.key.length === 1 ? event.key.toLowerCase() : event.key);
    });

    document.addEventListener("keyup", (event) => {
      keys.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key);
    });

    document.addEventListener("click", (event) => {
      const trigger = event.target.closest(".soar-hero__logo, .soar-mascot");
      if (!trigger) return;
      event.preventDefault();
      openIntro();
    });

    document.querySelectorAll(".soar-hero__logo").forEach((trigger) => {
      trigger.setAttribute("role", "button");
      trigger.setAttribute("tabindex", "0");
      trigger.setAttribute("title", text.title);
      trigger.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        openIntro();
      });
    });

    const query = new URLSearchParams(window.location.search);
    if (query.get("soar-game") === "1") {
      window.setTimeout(openIntro, 250);
    } else if (query.get("soar-game") === "play") {
      window.setTimeout(startGame, 250);
    }
  };

  const boot = () => {
    createMascot();
    setupHeroTilt();
    setupCardGlow();
    setupCursorTrail();
    setupGitHubStars();
    setupQRCodeShare();
    setupResearchGame();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
