/* =====================================================================
   VOZINHA.STORE.CV — Master JavaScript Engine
   1. Procedural Web Audio API (Wind, Thunder, Sub-bass)
   2. Canvas 2D Smoke Engine with Gust Physics
   3. GSAP Lightning Engine with SVG Bolt Strikes
   4. Comments Storm Engine (Drifting Leaves)
   5. Clothesline Darkroom Engine (Sagging Cords, Clothespins, Hang Sway)
   6. 3D Vault Orbit Engine (Saves vs Messi, Ronaldo, Neymar)
   7. T-Shirt Front/Back Switcher
   8. Fullscreen Lightbox Modal Controller
   ===================================================================== */

(function () {
  'use strict';

  const root = document.getElementById('stb-storm');
  if (!root) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 900px)').matches;

  // ===================================================================
  // 1. PROCEDURAL WEB AUDIO API (Wind Synthesis & Thunder)
  // ===================================================================
  let ac = null, master = null, windGain = null;
  let soundOn = false;

  function ensureAudio() {
    if (ac) {
      if (ac.state === 'suspended') ac.resume();
      return;
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    ac = new AudioContext();
    master = ac.createGain();
    master.gain.value = 0.6;
    master.connect(ac.destination);

    // Procedural Brownian Wind Noise Buffer (Seamless, no MP3 loop)
    const len = ac.sampleRate * 4;
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      d[i] = last * 3.2;
    }

    const src = ac.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    const lp = ac.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 240;
    lp.Q.value = 0.7;

    windGain = ac.createGain();
    windGain.gain.value = 0.45;

    // LFO 1: Swell volume at 0.07Hz
    const lfo1 = ac.createOscillator();
    lfo1.frequency.value = 0.07;
    const lfo1G = ac.createGain();
    lfo1G.gain.value = 0.22;
    lfo1.connect(lfo1G);
    lfo1G.connect(windGain.gain);
    lfo1.start();

    // LFO 2: Modulate cutoff frequency at 0.11Hz
    const lfo2 = ac.createOscillator();
    lfo2.frequency.value = 0.11;
    const lfo2G = ac.createGain();
    lfo2G.gain.value = 85;
    lfo2.connect(lfo2G);
    lfo2G.connect(lp.frequency);
    lfo2.start();

    src.connect(lp);
    lp.connect(windGain);
    windGain.connect(master);
    src.start();

    // 42Hz Sub-bass rumble
    const sub = ac.createOscillator();
    sub.type = 'sine';
    sub.frequency.value = 42;
    const subG = ac.createGain();
    subG.gain.value = 0.05;
    sub.connect(subG);
    subG.connect(master);
    sub.start();

    soundOn = true;
  }

  // Synthesized Sub-Drop Thunder Kick
  function thunder(strength = 1) {
    if (!ac || !master) return;
    const t = ac.currentTime + 0.05;
    const o = ac.createOscillator();
    const g = ac.createGain();

    o.type = 'sine';
    o.frequency.setValueAtTime(50, t);
    o.frequency.exponentialRampToValueAtTime(28, t + 2.8);

    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.4 * strength, t + 0.12);
    g.gain.exponentialRampToValueAtTime(0.001, t + 3.8);

    o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + 4.0);
  }

  // First interaction unlocks sound
  window.addEventListener('pointerdown', () => ensureAudio(), { once: true });
  window.addEventListener('keydown', () => ensureAudio(), { once: true });

  // ===================================================================
  // 2. GSAP LIGHTNING ENGINE & GUST PHYSICS
  // ===================================================================
  let gust = 1.0;
  const flash = root.querySelector('.fx-flash');
  const boltPaths = root.querySelectorAll('.gate-bolt path');

  boltPaths.forEach((p) => {
    const L = p.getTotalLength();
    p.style.strokeDasharray = L;
    p.style.strokeDashoffset = L;
  });

  function strike(withBolt = true, strength = 1) {
    if (reduce) return;
    if (window.gsap && flash) {
      window.gsap.timeline()
        .to(flash, { opacity: 0.85 * strength, duration: 0.05 })
        .to(flash, { opacity: 0.15, duration: 0.08 })
        .to(flash, { opacity: 0.7 * strength, duration: 0.05 })
        .to(flash, { opacity: 0, duration: 0.55, ease: 'power2.out' });
    }

    if (withBolt && window.gsap) {
      boltPaths.forEach((p, i) => {
        window.gsap.fromTo(p,
          { strokeDashoffset: p.getTotalLength(), opacity: 1 },
          {
            strokeDashoffset: 0,
            duration: 0.18,
            delay: i * 0.04,
            ease: 'power1.in',
            onComplete: () => {
              window.gsap.to(p, { opacity: 0, duration: 0.45, delay: 0.08, ease: 'power2.out' });
            }
          }
        );
      });
    }

    setTimeout(() => { thunder(strength); }, 250 + Math.random() * 400);

    // Wind gust surge: accelerates smoke & floating leaves
    gust = 4.2;
    setTimeout(() => { gust = 2.0; }, 900);
    setTimeout(() => { gust = 1.0; }, 2600);
  }

  // Periodic atmospheric lightning strikes
  function scheduleLightning() {
    const delay = 8000 + Math.random() * 9000;
    setTimeout(() => {
      strike(true, 0.7 + Math.random() * 0.3);
      scheduleLightning();
    }, delay);
  }
  scheduleLightning();

  // ===================================================================
  // 3. CANVAS 2D PROCEDURAL SMOKE ENGINE
  // ===================================================================
  const canvas = root.querySelector('.fx-smoke');
  if (canvas && !reduce) {
    const ctx = canvas.getContext('2d');
    const puffs = [];
    const N = isMobile ? 12 : 24;
    let cw, ch;

    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 256;
    const sg = sprite.getContext('2d');
    const g = sg.createRadialGradient(128, 128, 10, 128, 128, 128);
    g.addColorStop(0, 'rgba(160, 200, 185, 0.48)');
    g.addColorStop(0.4, 'rgba(120, 170, 150, 0.2)');
    g.addColorStop(1, 'rgba(90, 140, 120, 0)');
    sg.fillStyle = g;
    sg.fillRect(0, 0, 256, 256);

    const resize = () => {
      cw = canvas.width = window.innerWidth;
      ch = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const newPuff = (any = false) => {
      const r = 160 + Math.random() * 280;
      return {
        x: Math.random() * cw,
        y: any ? Math.random() * ch : ch + r,
        r: r,
        vx: -(0.06 + Math.random() * 0.22),
        vy: -(0.07 + Math.random() * 0.18),
        a: 0.08 + Math.random() * 0.14,
        rot: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 0.002
      };
    };

    for (let i = 0; i < N; i++) puffs.push(newPuff(true));

    let last = 0;
    function frameSmoke(t) {
      if (t - last > 33) {
        last = t;
        ctx.clearRect(0, 0, cw, ch);
        for (let i = 0; i < puffs.length; i++) {
          const p = puffs[i];
          p.x += p.vx * gust;
          p.y += p.vy;
          p.rot += p.vr;

          if (p.y < -p.r) puffs[i] = newPuff(false);
          if (p.x < -p.r) p.x = cw + p.r;

          ctx.save();
          ctx.globalAlpha = p.a;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.drawImage(sprite, -p.r, -p.r * 0.7, p.r * 2, p.r * 1.4);
          ctx.restore();
        }
      }
      requestAnimationFrame(frameSmoke);
    }
    requestAnimationFrame(frameSmoke);
  }

  // ===================================================================
  // 4. COMMENTS STORM ENGINE (Authentic Leaves Particle Vortex)
  // ===================================================================
  const commentsPool = [
    { src: 'assets/images/comment-1.svg', w: 360, h: 160, title: 'Casimiro Miguel • CazéTV' },
    { src: 'assets/images/comment-2.svg', w: 360, h: 160, title: 'Rodrigo Silva • Fan' },
    { src: 'assets/images/comment-3.svg', w: 360, h: 160, title: 'Madrid Sports Review' },
    { src: 'assets/images/comment-4.svg', w: 360, h: 160, title: 'São Vicente TV • Mindelo' },
    { src: 'assets/images/comment-5.svg', w: 360, h: 160, title: 'Gabriel Santos • Football Digest' },
    { src: 'assets/images/comment-6.svg', w: 360, h: 160, title: 'FIFA World Daily Highlights' },
    { src: 'assets/images/comment-7.svg', w: 360, h: 160, title: 'Lucas Moura Fan • Brazil' },
    { src: 'assets/images/comment-8.svg', w: 360, h: 160, title: 'Tubarões Azuis Army' }
  ];

  function initStormField(field) {
    if (!field || reduce) return;
    let fw = field.clientWidth, fh = field.clientHeight;
    let alive = [];
    const MAX = isMobile ? 5 : 8;
    let next = 0;

    const measure = () => {
      fw = field.clientWidth;
      fh = field.clientHeight;
    };
    window.addEventListener('resize', measure, { passive: true });

    function spawn(initial = false) {
      const item = commentsPool[next++ % commentsPool.length];
      const el = document.createElement('a');
      el.className = 'leaf';
      el.href = '#';

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.title;
      img.loading = 'lazy';
      img.width = item.w;
      img.height = item.h;
      el.appendChild(img);
      field.appendChild(el);

      const lh = 120 * (isMobile ? 0.75 : 1.0);
      const lw = lh * (item.w / item.h);

      const L = {
        el,
        x: initial ? Math.random() * (fw - lw) : fw + 30,
        y: initial ? Math.random() * (fh - lh) : Math.random() * (fh - lh),
        vx: -(0.85 + Math.random() * 0.75),
        vy: (Math.random() - 0.5) * 0.3,
        rot: (Math.random() - 0.5) * 22,
        vr: (Math.random() - 0.5) * 0.2,
        ph: Math.random() * 6.28,
        sway: 16 + Math.random() * 20,
        held: false,
        w: lw,
        h: lh,
        z: Math.random()
      };

      el.style.zIndex = Math.round(L.z * 10);

      el.addEventListener('mouseenter', () => {
        L.held = true;
        el.classList.add('held');
        el.style.transform = `translate3d(${L.x}px, ${L.y}px, 0) scale(1.35) rotate(0deg)`;
      });

      el.addEventListener('mouseleave', () => {
        L.held = false;
        el.classList.remove('held');
      });

      el.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(item.src, item.title);
      });

      alive.push(L);
    }

    for (let i = 0; i < MAX; i++) spawn(true);

    let lastT = performance.now();
    function tick(now) {
      const dt = Math.min(40, now - lastT) / 16.7;
      lastT = now;

      if (!reduce && !document.hidden) {
        if (alive.length < MAX && Math.random() < 0.04) spawn(false);

        for (let i = alive.length - 1; i >= 0; i--) {
          const L = alive[i];
          if (!L.held) {
            L.ph += 0.014 * dt;
            L.x += L.vx * gust * dt * (isMobile ? 1.1 : 1.4);
            L.y += (L.vy + Math.sin(L.ph) * 0.3) * dt;
            L.rot += L.vr * dt * gust * 1.5;
            L.el.style.transform = `translate3d(${L.x + Math.sin(L.ph * 0.7) * L.sway}px, ${L.y}px, 0) rotate(${L.rot}deg) scale(${0.88 + L.z * 0.22})`;
          }

          if (L.x < -L.w - 50) {
            L.el.remove();
            alive.splice(i, 1);
          }
        }
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const stormContainer = document.getElementById('commentsStorm');
  if (stormContainer) initStormField(stormContainer);

  // ===================================================================
  // 5. THE 3D VAULT ORBIT ENGINE (Vozinha & Top Saves)
  // ===================================================================
  const vaultStage = document.getElementById('vaultStage');
  const orbitCards = document.querySelectorAll('.vault-orbit-card');
  if (vaultStage && orbitCards.length > 0 && !reduce) {
    let angle = 0;
    let isPaused = false;
    const speed = 0.0065;
    const total = orbitCards.length;
    const step = (Math.PI * 2) / total;

    vaultStage.addEventListener('mouseenter', () => { isPaused = true; });
    vaultStage.addEventListener('mouseleave', () => { isPaused = false; });

    function renderOrbit() {
      if (!isPaused) angle += speed;

      const stageW = vaultStage.clientWidth;
      const rx = Math.min(stageW * 0.44, 460);
      const ry = 90;

      orbitCards.forEach((card, index) => {
        const theta = angle + index * step;
        const x = Math.cos(theta) * rx;
        const y = Math.sin(theta) * ry;
        const z = Math.sin(theta); // -1 (back) to +1 (front)

        const scale = 0.78 + (z + 1) * 0.22;
        // Front cards pass in front of goalkeeper cutout (z: 10), back cards pass behind
        const zIndex = z > 0 ? 25 : 5;
        const opacity = 0.65 + (z + 1) * 0.18;

        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        card.style.zIndex = zIndex;
        card.style.opacity = opacity;
      });

      requestAnimationFrame(renderOrbit);
    }
    requestAnimationFrame(renderOrbit);

    orbitCards.forEach((card) => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        const cap = card.querySelector('.vault-card-caption');
        if (img) openLightbox(img.src, cap ? cap.textContent : 'Legendary Save');
      });
    });
  }

  // ===================================================================
  // 6. DARKROOM CLOTHESLINE LIGHTBOX HOOKS
  // ===================================================================
  const darkroomCards = document.querySelectorAll('.pile .card');
  darkroomCards.forEach((c) => {
    c.addEventListener('click', () => {
      const img = c.querySelector('img');
      if (img) openLightbox(img.src, img.alt || 'Cabo Verde vs Spain Match Action');
    });
  });

  // ===================================================================
  // 7. T-SHIRT FRONT / BACK SWITCHER
  // ===================================================================
  const teeFront = document.getElementById('teeFront');
  const teeBack = document.getElementById('teeBack');
  const btnFront = document.getElementById('btnFront');
  const btnBack = document.getElementById('btnBack');

  if (teeFront && teeBack && btnFront && btnBack) {
    btnFront.addEventListener('click', () => {
      teeFront.classList.remove('hidden');
      teeBack.classList.add('hidden');
      btnFront.classList.add('active');
      btnBack.classList.remove('active');
    });

    btnBack.addEventListener('click', () => {
      teeBack.classList.remove('hidden');
      teeFront.classList.add('hidden');
      btnBack.classList.add('active');
      btnFront.classList.remove('active');
    });
  }

  // ===================================================================
  // 8. LIGHTBOX MODAL CONTROLLER
  // ===================================================================
  const lightbox = document.getElementById('lb');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  const lbCap = document.getElementById('lbCap');

  function openLightbox(src, title = '') {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    if (lbCap) lbCap.textContent = title;
    lightbox.classList.add('show');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lbClose) {
        closeLightbox();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('show')) {
        closeLightbox();
      }
    });
  }

})();
