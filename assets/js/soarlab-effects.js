(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
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

  const setupResearchGame = () => {
    const isZh = document.documentElement.lang === "zh" || window.location.pathname.startsWith("/zh/");
    const text = isZh
      ? {
          title: "飞行通用智能科研通关小游戏",
          kicker: "SOAR Research Gauntlet",
          intro: "驾驶 SOAR 小机器人，把研究难题、论文审稿、代码 bug、毕业压力和终极 publish-or-perish 城堡逐个击破。",
          controls: "操作：WASD / 方向键移动，空格发射，P 暂停，Esc 退出。鼠标或触控也可以拖动机器人。",
          mobileControls: "手机端：点击开始后允许动作传感器，即可倾斜手机控制飞行方向。",
          start: "开始闯关",
          restart: "再来一局",
          close: "退出",
          pause: "暂停",
          resume: "继续",
          score: "Score",
          lives: "Lives",
          wave: "Wave",
          tilt: "Tilt",
          tiltReady: "陀螺仪已启用",
          tiltDenied: "未启用陀螺仪，可用触控拖动",
          gameOver: "科研暂时卡住了",
          win: "通关：今天也推进了飞行通用智能",
        }
      : {
          title: "SOAR Research Gauntlet",
          kicker: "Flying General Intelligence Mini Game",
          intro:
            "Pilot the SOAR robot through research problems, paper reviews, code bugs, graduation pressure, and the final publish-or-perish citadel.",
          controls: "Controls: WASD / arrow keys to move, Space to fire, P to pause, Esc to quit. Mouse or touch drag also works.",
          mobileControls: "Mobile: after tapping Start, allow motion sensors and tilt your phone to steer.",
          start: "Start Mission",
          restart: "Restart",
          close: "Exit",
          pause: "Pause",
          resume: "Resume",
          score: "Score",
          lives: "Lives",
          wave: "Wave",
          tilt: "Tilt",
          tiltReady: "tilt control on",
          tiltDenied: "tilt unavailable; drag to steer",
          gameOver: "Research blocked, for now",
          win: "Cleared: flying general intelligence advanced",
        };

    const spriteFiles = {
      player: "player",
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
      { sprite: "research", en: "Research Question", zh: "研究难题", hp: 1, speed: 72, score: 12, size: 42 },
      { sprite: "paper", en: "Reviewer #2", zh: "论文审稿", hp: 2, speed: 58, score: 18, size: 46 },
      { sprite: "code", en: "Code Bug", zh: "代码 bug", hp: 1, speed: 84, score: 12, size: 40 },
      { sprite: "data", en: "Dataset Chaos", zh: "数据混乱", hp: 2, speed: 52, score: 20, size: 48 },
      { sprite: "deadline", en: "Deadline Meteor", zh: "DDL 陨石", hp: 2, speed: 78, score: 22, size: 50 },
      { sprite: "graduation", en: "Graduation Pressure", zh: "毕业压力", hp: 3, speed: 46, score: 28, size: 50 },
      { sprite: "compute", en: "Server Overheat", zh: "算力过热", hp: 3, speed: 42, score: 30, size: 50 },
      { sprite: "hardware", en: "Hardware Gremlin", zh: "硬件小怪", hp: 2, speed: 70, score: 18, size: 44 },
    ];

    const bosses = [
      { sprite: "reviewer", en: "Mini Boss: Paper Review", zh: "小 Boss：论文审稿", hp: 16, speed: 28, score: 180, size: 84 },
      { sprite: "project", en: "Mini Boss: Project Deadline", zh: "小 Boss：项目节点", hp: 20, speed: 25, score: 220, size: 88 },
      { sprite: "dragon", en: "Boss: Dissertation Dragon", zh: "大 Boss：毕业论文龙", hp: 34, speed: 22, score: 420, size: 104 },
      { sprite: "citadel", en: "Final Boss: Publish-or-Perish", zh: "终极 Boss：Publish-or-Perish", hp: 48, speed: 18, score: 680, size: 112 },
    ];

    let overlay;
    let canvas;
    let context;
    let hud;
    let titleNode;
    let summaryNode;
    let startButton;
    let pauseButton;
    let animationFrame = 0;
    let lastTime = 0;
    let starting = false;
    const keys = new Set();
    const state = {
      mode: "idle",
      width: 390,
      height: 620,
      score: 0,
      lives: 3,
      wave: 1,
      spawnTimer: 0,
      bossIndex: 0,
      bossTimer: 9,
      finalShown: false,
      fireCooldown: 0,
      pointerActive: false,
      pointerX: 195,
      pointerY: 530,
      motionEnabled: false,
      motionSeen: false,
      motionBaseBeta: null,
      motionBaseGamma: null,
      motionX: 0,
      motionY: 0,
      motionStatus: "",
      player: { x: 195, y: 530, size: 46 },
      bullets: [],
      enemies: [],
      particles: [],
    };

    const resetState = () => {
      state.mode = "playing";
      state.score = 0;
      state.lives = 3;
      state.wave = 1;
      state.spawnTimer = 0.75;
      state.bossIndex = 0;
      state.bossTimer = 9;
      state.finalShown = false;
      state.fireCooldown = 0;
      state.pointerActive = false;
      state.motionSeen = false;
      state.motionBaseBeta = null;
      state.motionBaseGamma = null;
      state.motionX = 0;
      state.motionY = 0;
      state.player = { x: 195, y: 530, size: 46 };
      state.bullets = [];
      state.enemies = [];
      state.particles = [];
      lastTime = performance.now();
    };

    const primeOpeningWave = () => {
      const formation = [enemyTypes[0], enemyTypes[2], enemyTypes[4]];
      state.enemies = formation.map((type, index) => ({
        ...type,
        boss: false,
        hp: type.hp,
        maxHp: type.hp,
        x: [92, 195, 298][index],
        y: [70, 132, 96][index],
        vx: [-18, 14, 22][index],
        size: type.size,
      }));
    };

    const createOverlay = () => {
      if (overlay) return;

      overlay = document.createElement("div");
      overlay.className = "soar-game";
      overlay.innerHTML = `
        <div class="soar-game__shell" role="dialog" aria-modal="true" aria-labelledby="soar-game-title">
          <div class="soar-game__topbar">
            <div>
              <p class="soar-game__kicker">${text.kicker}</p>
              <h2 id="soar-game-title">${text.title}</h2>
            </div>
            <button class="soar-game__close" type="button" aria-label="${text.close}">×</button>
          </div>
          <div class="soar-game__stage">
            <canvas class="soar-game__canvas" width="${state.width}" height="${state.height}"></canvas>
            <div class="soar-game__intro">
              <img src="${assetPath("img/soar-game/player.png")}" alt="">
              <h3>${text.title}</h3>
              <p>${text.intro}</p>
              <p>${text.controls}</p>
              <p>${text.mobileControls}</p>
              <button class="btn btn-primary soar-game__start" type="button">${text.start}</button>
            </div>
            <div class="soar-game__message" aria-live="polite">
              <h3></h3>
              <p></p>
              <button class="btn btn-primary soar-game__restart" type="button">${text.restart}</button>
            </div>
          </div>
          <div class="soar-game__hud"></div>
          <div class="soar-game__actions">
            <button class="btn btn-outline-primary soar-game__pause" type="button">${text.pause}</button>
            <button class="btn btn-outline-primary soar-game__exit" type="button">${text.close}</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      canvas = overlay.querySelector(".soar-game__canvas");
      canvas.tabIndex = 0;
      context = canvas.getContext("2d");
      hud = overlay.querySelector(".soar-game__hud");
      titleNode = overlay.querySelector(".soar-game__message h3");
      summaryNode = overlay.querySelector(".soar-game__message p");
      startButton = overlay.querySelector(".soar-game__start");
      pauseButton = overlay.querySelector(".soar-game__pause");

      overlay.querySelector(".soar-game__close").addEventListener("click", closeGame);
      overlay.querySelector(".soar-game__exit").addEventListener("click", closeGame);
      overlay.querySelector(".soar-game__restart").addEventListener("click", startGame);
      startButton.addEventListener("click", startGame);
      pauseButton.addEventListener("click", togglePause);

      canvas.addEventListener("pointermove", (event) => {
        const rect = canvas.getBoundingClientRect();
        state.pointerActive = true;
        state.pointerX = ((event.clientX - rect.left) / rect.width) * state.width;
        state.pointerY = ((event.clientY - rect.top) / rect.height) * state.height;
      });
      canvas.addEventListener("pointerdown", (event) => {
        canvas.setPointerCapture(event.pointerId);
        state.pointerActive = true;
        fire();
      });
      canvas.addEventListener("pointerup", () => {
        state.pointerActive = false;
      });
    };

    const openIntro = () => {
      createOverlay();
      overlay.classList.add("soar-game--active", "soar-game--intro");
      overlay.classList.remove("soar-game--ended");
      document.body.classList.add("soar-game-active");
      setMascotGameMode(true);
      drawBackdrop();
      renderIntroHud();
      startButton.focus({ preventScroll: true });
    };

    const startGame = () => {
      if (starting) return;
      createOverlay();
      overlay.classList.add("soar-game--active");
      overlay.classList.remove("soar-game--intro", "soar-game--ended");
      document.body.classList.add("soar-game-active");
      setMascotGameMode(true);
      hud.innerHTML = isZh ? "正在装载科研难题图标..." : "Loading research obstacle sprites...";
      starting = true;
      const motionReady = window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0 ? enableMotionControl() : Promise.resolve();
      Promise.all([spriteReady, motionReady]).finally(beginGame);
    };

    const beginGame = () => {
      starting = false;
      if (!overlay?.classList.contains("soar-game--active")) return;
      resetState();
      primeOpeningWave();
      updateHud();
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(loop);
      canvas.focus({ preventScroll: true });
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
      overlay.classList.remove("soar-game--active", "soar-game--intro", "soar-game--ended");
      document.body.classList.remove("soar-game-active");
      setMascotGameMode(false);
    }

    function togglePause() {
      if (state.mode === "playing") {
        state.mode = "paused";
        pauseButton.textContent = text.resume;
        showCenteredText(text.pause, text.controls);
      } else if (state.mode === "paused") {
        state.mode = "playing";
        pauseButton.textContent = text.pause;
        lastTime = performance.now();
        animationFrame = requestAnimationFrame(loop);
      }
    }

    const setMascotGameMode = (active) => {
      const mascot = document.querySelector(".soar-mascot");
      if (!mascot) return;
      mascot.classList.toggle("soar-mascot--game", active);
      const image = mascot.querySelector("img");
      if (image) image.src = active ? "/assets/img/soar-game/player.png" : "/assets/img/soarlab-128.png";
    };

    const updateHud = () => {
      if (!hud) return;
      const motion = state.motionStatus ? ` · ${text.tilt}: ${state.motionStatus}` : "";
      hud.textContent = `${text.score}: ${state.score} · ${text.lives}: ${state.lives} · ${text.wave}: ${state.wave}${motion}`;
    };

    const renderIntroHud = () => {
      if (!hud) return;
      const items = isZh
        ? [
            ["research", "普通怪：研究难题、代码 bug、数据混乱"],
            ["reviewer", "小 Boss：论文审稿与项目节点"],
            ["dragon", "大 Boss：毕业论文龙"],
            ["citadel", "终极 Boss：Publish-or-Perish 城堡"],
          ]
        : [
            ["research", "Enemies: research questions, code bugs, dataset chaos"],
            ["reviewer", "Mini bosses: paper reviews and project deadlines"],
            ["dragon", "Boss: dissertation dragon"],
            ["citadel", "Final boss: publish-or-perish citadel"],
          ];
      hud.innerHTML = `
        <strong>${isZh ? "关卡提示" : "Mission Briefing"}</strong>
        <span>${text.controls}</span>
        <div class="soar-game__briefing-list">
          ${items
            .map(
              ([sprite, label]) => `
                <p>
                  <img src="${assetPath(`img/soar-game/${spriteFiles[sprite]}.png`)}" alt="">
                  <span>${label}</span>
                </p>
              `
            )
            .join("")}
        </div>
      `;
    };

    const drawImage = (sprite, x, y, size) => {
      const image = sprites[sprite];
      if (image && image.complete && image.naturalWidth) {
        context.drawImage(image, x - size / 2, y - size / 2, size, size);
      } else {
        context.fillStyle = "#31c6d4";
        context.beginPath();
        context.arc(x, y, size / 2, 0, Math.PI * 2);
        context.fill();
      }
    };

    const drawBackdrop = () => {
      if (!context) return;
      const gradient = context.createLinearGradient(0, 0, 0, state.height);
      gradient.addColorStop(0, "#07192a");
      gradient.addColorStop(0.55, "#0d3b4c");
      gradient.addColorStop(1, "#10201f");
      context.fillStyle = gradient;
      context.fillRect(0, 0, state.width, state.height);
      context.fillStyle = "rgba(255, 255, 255, 0.22)";
      for (let i = 0; i < 42; i += 1) {
        const x = (i * 73) % state.width;
        const y = (i * 127) % state.height;
        context.fillRect(x, y, 2, 2);
      }
    };

    const fire = () => {
      if (state.fireCooldown > 0 || state.mode !== "playing") return;
      state.bullets.push({ x: state.player.x, y: state.player.y - 26, vy: -430, size: 18 });
      state.fireCooldown = 0.16;
    };

    const spawnEnemy = () => {
      const shouldBoss = state.bossTimer <= 0 && state.bossIndex < bosses.length;
      const type = shouldBoss ? bosses[state.bossIndex] : enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      if (shouldBoss) {
        state.bossIndex += 1;
        state.bossTimer = 12 + state.bossIndex * 4;
        state.wave += 1;
      }
      const size = type.size;
      state.enemies.push({
        ...type,
        boss: shouldBoss,
        hp: type.hp + Math.floor(state.wave / 3),
        maxHp: type.hp + Math.floor(state.wave / 3),
        x: shouldBoss ? state.width / 2 : 34 + Math.random() * (state.width - 68),
        y: -size,
        vx: shouldBoss ? 38 : (Math.random() - 0.5) * 36,
        size,
      });
    };

    const addBurst = (x, y, color = "#ff8b3d") => {
      for (let i = 0; i < 8; i += 1) {
        state.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 160,
          vy: (Math.random() - 0.5) * 160,
          life: 0.45,
          color,
        });
      }
    };

    const collide = (a, b) => Math.abs(a.x - b.x) < (a.size + b.size) * 0.42 && Math.abs(a.y - b.y) < (a.size + b.size) * 0.42;

    const update = (delta) => {
      const speed = 260;
      let dx = 0;
      let dy = 0;
      if (keys.has("ArrowLeft") || keys.has("a")) dx -= 1;
      if (keys.has("ArrowRight") || keys.has("d")) dx += 1;
      if (keys.has("ArrowUp") || keys.has("w")) dy -= 1;
      if (keys.has("ArrowDown") || keys.has("s")) dy += 1;

      if (state.pointerActive) {
        state.player.x += (state.pointerX - state.player.x) * Math.min(1, delta * 8);
        state.player.y += (state.pointerY - state.player.y) * Math.min(1, delta * 8);
      } else if (state.motionEnabled && state.motionSeen) {
        state.player.x += state.motionX * speed * 1.25 * delta;
        state.player.y += state.motionY * speed * delta;
      } else {
        state.player.x += dx * speed * delta;
        state.player.y += dy * speed * delta;
      }
      state.player.x = Math.max(26, Math.min(state.width - 26, state.player.x));
      state.player.y = Math.max(80, Math.min(state.height - 36, state.player.y));

      if (keys.has(" ")) fire();
      state.fireCooldown = Math.max(0, state.fireCooldown - delta);
      state.spawnTimer -= delta;
      state.bossTimer -= delta;
      if (state.spawnTimer <= 0) {
        spawnEnemy();
        state.spawnTimer = Math.max(0.45, 1.1 - state.wave * 0.06);
      }

      state.bullets.forEach((bullet) => {
        bullet.y += bullet.vy * delta;
      });
      state.enemies.forEach((enemy) => {
        enemy.y += (enemy.speed + state.wave * 5) * delta;
        enemy.x += Math.sin(enemy.y / 42) * enemy.vx * delta;
        if (enemy.boss) enemy.x = Math.max(enemy.size / 2, Math.min(state.width - enemy.size / 2, enemy.x));
      });
      state.particles.forEach((particle) => {
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        particle.life -= delta;
      });

      state.bullets.forEach((bullet) => {
        state.enemies.forEach((enemy) => {
          if (enemy.dead || bullet.dead || !collide(bullet, enemy)) return;
          bullet.dead = true;
          enemy.hp -= 1;
          addBurst(bullet.x, bullet.y, "#57d8ff");
          if (enemy.hp <= 0) {
            enemy.dead = true;
            state.score += enemy.score;
            addBurst(enemy.x, enemy.y, enemy.boss ? "#ffcf66" : "#ff8b3d");
            if (enemy.sprite === "citadel") finishGame(true);
          }
        });
      });

      state.enemies.forEach((enemy) => {
        if (enemy.dead) return;
        if (collide(state.player, enemy)) {
          enemy.dead = true;
          state.lives -= enemy.boss ? 2 : 1;
          addBurst(state.player.x, state.player.y, "#ff5a45");
          if (state.lives <= 0) finishGame(false);
        } else if (enemy.y > state.height + enemy.size) {
          enemy.dead = true;
          state.lives -= 1;
          if (state.lives <= 0) finishGame(false);
        }
      });

      if (state.score > 900 && !state.finalShown) {
        state.finalShown = true;
        state.bossIndex = Math.max(state.bossIndex, bosses.length - 1);
        state.bossTimer = 0;
      }

      state.bullets = state.bullets.filter((bullet) => !bullet.dead && bullet.y > -30);
      state.enemies = state.enemies.filter((enemy) => !enemy.dead && enemy.y < state.height + 140);
      state.particles = state.particles.filter((particle) => particle.life > 0);
      updateHud();
    };

    const draw = () => {
      drawBackdrop();

      state.bullets.forEach((bullet) => drawImage("bullet", bullet.x, bullet.y, bullet.size));
      state.enemies.forEach((enemy) => {
        drawImage(enemy.sprite, enemy.x, enemy.y, enemy.size);
        const label = isZh ? enemy.zh : enemy.en;
        context.font = enemy.boss ? "700 13px system-ui, sans-serif" : "600 10px system-ui, sans-serif";
        context.textAlign = "center";
        context.fillStyle = "rgba(255, 255, 255, 0.92)";
        context.strokeStyle = "rgba(4, 13, 24, 0.78)";
        context.lineWidth = 3;
        context.strokeText(label, enemy.x, enemy.y + enemy.size / 2 + 14);
        context.fillText(label, enemy.x, enemy.y + enemy.size / 2 + 14);
        if (enemy.boss) {
          const width = 92;
          const left = enemy.x - width / 2;
          context.fillStyle = "rgba(255, 255, 255, 0.22)";
          context.fillRect(left, enemy.y - enemy.size / 2 - 12, width, 5);
          context.fillStyle = "#ff7b3a";
          context.fillRect(left, enemy.y - enemy.size / 2 - 12, width * (enemy.hp / enemy.maxHp), 5);
        }
      });
      state.particles.forEach((particle) => {
        context.globalAlpha = Math.max(0, particle.life / 0.45);
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        context.fill();
      });
      context.globalAlpha = 1;
      drawImage("player", state.player.x, state.player.y, state.player.size);
    };

    const showCenteredText = (title, summary) => {
      draw();
      context.fillStyle = "rgba(4, 13, 24, 0.72)";
      context.fillRect(28, state.height / 2 - 62, state.width - 56, 124);
      context.textAlign = "center";
      context.fillStyle = "#ffffff";
      context.font = "700 22px system-ui, sans-serif";
      context.fillText(title, state.width / 2, state.height / 2 - 14);
      context.font = "500 12px system-ui, sans-serif";
      wrapText(summary, state.width / 2, state.height / 2 + 18, state.width - 86, 18);
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
      titleNode.textContent = won ? text.win : text.gameOver;
      summaryNode.textContent = `${text.score}: ${state.score} · ${text.wave}: ${state.wave}`;
      showCenteredText(titleNode.textContent, summaryNode.textContent);
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
      if (event.key === "Escape" && overlay?.classList.contains("soar-game--active")) closeGame();
      if (event.key.toLowerCase() === "p" && overlay?.classList.contains("soar-game--active")) togglePause();
      if ([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) event.preventDefault();
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
    setupResearchGame();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
