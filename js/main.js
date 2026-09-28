/* =====================================================================
   VOZINHA.STORE.CV — Master JavaScript Controller
   1. Procedural Web Audio API (Wind, Thunder, Sub-bass)
   2. Canvas 2D Procedural Smoke Engine
   3. GSAP Lightning Engine & Periodic Strikes
   4. The Comments Storm Physics Engine (Dense 18-Leaf Vortex)
   5. The 3D Vault Orbit Engine (8 Wide Polaroid Cards with Real Photos)
   6. T-Shirt Front/Back Switcher
   7. Accessible Modal Dialog with Light-Dismiss
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  // ===================================================================
  // 1. PROCEDURAL WEB AUDIO API (Wind Synthesis & Thunder)
  // ===================================================================
  let ac = null, master = null, windGain = null;

  function ensureAudio() {
    if (ac) {
      if (ac.state === 'suspended') ac.resume();
      return;
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    ac = new AudioContext();
    master = ac.createGain();
    master.gain.value = 0.55;
    master.connect(ac.destination);

    // Procedural Brownian Wind Noise Buffer (Seamless, zero MP3 loop)
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

    // 42Hz Sub-bass stadium rumble
    const sub = ac.createOscillator();
    sub.type = 'sine';
    sub.frequency.value = 42;
    const subG = ac.createGain();
    subG.gain.value = 0.05;
    sub.connect(subG);
    subG.connect(master);
    sub.start();
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
  // 2. GSAP LIGHTNING ENGINE & BOLT STRIKES
  // ===================================================================
  let gust = 1.0;
  const flash = document.querySelector('.fx-flash');
  const boltPaths = document.querySelectorAll('.gate-bolt path');

  boltPaths.forEach((p) => {
    const L = p.getTotalLength();
    p.style.strokeDasharray = L;
    p.style.strokeDashoffset = L;
  });

  function strike(withBolt = true, strength = 1) {
    if (reduceMotion) return;
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

    // Wind gust surge: accelerates smoke & floating cards
    gust = 3.8;
    setTimeout(() => { gust = 1.8; }, 900);
    setTimeout(() => { gust = 1.0; }, 2600);
  }

  // Periodic atmospheric lightning strikes
  function scheduleLightning() {
    const delay = 9000 + Math.random() * 10000;
    setTimeout(() => {
      strike(true, 0.7 + Math.random() * 0.3);
      scheduleLightning();
    }, delay);
  }
  scheduleLightning();

  // Amulet button click triggers lightning strike & thunder
  const amuletBtn = document.getElementById('amuletBtn');
  if (amuletBtn) {
    amuletBtn.addEventListener('click', (e) => {
      e.preventDefault();
      ensureAudio();
      strike(true, 1.3);
    });
  }

  // ===================================================================
  // 3. CANVAS 2D PROCEDURAL SMOKE ENGINE
  // ===================================================================
  const canvas = document.querySelector('.smoke-canvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let cw, ch;
    const puffs = [];
    const puffCount = isMobile ? 12 : 22;

    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 256;
    const sg = sprite.getContext('2d');
    const grad = sg.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, 'rgba(160, 200, 185, 0.45)');
    grad.addColorStop(0.4, 'rgba(12, 38, 69, 0.2)');
    grad.addColorStop(1, 'rgba(3, 7, 13, 0)');
    sg.fillStyle = grad;
    sg.fillRect(0, 0, 256, 256);

    const resize = () => {
      cw = canvas.width = window.innerWidth;
      ch = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const createPuff = (anywhere = false) => {
      const r = 180 + Math.random() * 260;
      return {
        x: Math.random() * cw,
        y: anywhere ? Math.random() * ch : ch + r * 0.5,
        r: r,
        vx: -(0.08 + Math.random() * 0.18),
        vy: -(0.12 + Math.random() * 0.22),
        alpha: 0.10 + Math.random() * 0.16,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.003
      };
    };

    for (let i = 0; i < puffCount; i++) {
      puffs.push(createPuff(true));
    }

    let lastTime = 0;
    const renderSmoke = (time) => {
      if (time - lastTime > 32) {
        lastTime = time;
        ctx.clearRect(0, 0, cw, ch);
        for (let i = 0; i < puffs.length; i++) {
          const p = puffs[i];
          p.x += p.vx * gust;
          p.y += p.vy;
          p.rot += p.vr;

          if (p.y < -p.r * 1.2) puffs[i] = createPuff(false);
          if (p.x < -p.r * 1.2) p.x = cw + p.r;

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.drawImage(sprite, -p.r, -p.r * 0.7, p.r * 2, p.r * 1.4);
          ctx.restore();
        }
      }
      requestAnimationFrame(renderSmoke);
    };
    requestAnimationFrame(renderSmoke);
  }

  // ===================================================================
  // 4. THE COMMENTS STORM (DENSE, OVERLAPPING STORM MATCHING IMAGE 4)
  // ===================================================================
  const stormField = document.getElementById('stormField');
  if (stormField && !reduceMotion) {
    const commentData = [
      { file: 'comment-1.svg', title: 'Casimiro Miguel • CazéTV', desc: '"SIGAM O HOMEM IMEDIATAMENTE! O Vozinha é um monstro sagrado!"' },
      { file: 'comment-2.svg', title: 'Rodrigo Silva • Fan', desc: 'Cheguei pelo Cazé e virei fã incondicional. Vozinha lenda absoluta!' },
      { file: 'comment-3.svg', title: 'Madrid Sports Review', desc: 'Spain threw everything. Vozinha stopped everything. Masterclass.' },
      { file: 'comment-4.svg', title: 'São Vicente TV • Mindelo', desc: 'Orgulho infinito de Mindelo! Nosso capitão brilhando pro mundo inteiro.' },
      { file: 'comment-5.svg', title: 'Gabriel Santos • Football Digest', desc: 'Messi, Ronaldo, Neymar... nobody is scoring on Vozinha on his night.' },
      { file: 'comment-6.svg', title: 'FIFA World Daily Highlights', desc: 'Official Player of the Match: Josimar Dias VOZINHA.' },
      { file: 'comment-7.svg', title: 'Lucas Moura Fan • Brazil', desc: 'O Brasil inteiro parou pra torcer pelo Vozinha. 29M+ reach.' },
      { file: 'comment-8.svg', title: 'Tubarões Azuis Army', desc: '12 years defending this nation. True captain forever in history.' }
    ];

    let fieldWidth = stormField.clientWidth;
    let fieldHeight = stormField.clientHeight;
    // DENSE STORM: 18 active overlapping cards on desktop, 8 on mobile (matching Image 4)
    const maxAlive = isMobile ? 8 : 18;
    const activeLeaves = [];
    let nextIndex = 0;

    const updateBounds = () => {
      fieldWidth = stormField.clientWidth;
      fieldHeight = stormField.clientHeight;
    };
    window.addEventListener('resize', updateBounds, { passive: true });

    const spawnLeaf = (initial = false) => {
      const item = commentData[nextIndex++ % commentData.length];
      const el = document.createElement('div');
      el.className = 'comment-card';
      el.innerHTML = `<img src="assets/images/${item.file}" alt="${item.title}" loading="lazy" width="320" height="140">`;
      stormField.appendChild(el);

      const leaf = {
        el,
        item,
        x: initial ? Math.random() * (fieldWidth - 320) : fieldWidth + 20,
        y: Math.random() * (fieldHeight - 150),
        vx: -(0.85 + Math.random() * 0.85),
        vy: (Math.random() - 0.5) * 0.35,
        rot: (Math.random() - 0.5) * 22,
        phase: Math.random() * Math.PI * 2,
        swayAmp: 12 + Math.random() * 16,
        held: false
      };

      el.addEventListener('mouseenter', () => {
        leaf.held = true;
        el.classList.add('held');
        el.style.transform = `translate3d(${leaf.x}px, ${leaf.y}px, 0) scale(1.25) rotate(0deg)`;
      });

      el.addEventListener('mouseleave', () => {
        leaf.held = false;
        el.classList.remove('held');
      });

      el.addEventListener('click', () => {
        openModal(`assets/images/${item.file}`, item.title, item.desc);
      });

      activeLeaves.push(leaf);
    };

    // Pre-populate dense storm
    for (let i = 0; i < maxAlive; i++) {
      spawnLeaf(true);
    }

    let lastTick = performance.now();
    const tickStorm = (now) => {
      const dt = Math.min(32, now - lastTick) / 16.7;
      lastTick = now;

      if (activeLeaves.length < maxAlive && Math.random() < 0.08) {
        spawnLeaf(false);
      }

      for (let i = activeLeaves.length - 1; i >= 0; i--) {
        const L = activeLeaves[i];
        if (!L.held) {
          L.phase += 0.016 * dt;
          L.x += L.vx * gust * dt;
          L.y += (L.vy + Math.sin(L.phase) * 0.4) * dt;

          L.el.style.transform = `translate3d(${L.x}px, ${L.y + Math.sin(L.phase * 0.8) * L.swayAmp}px, 0) rotate(${L.rot}deg)`;
        }

        // Recycle offscreen
        if (L.x < -360) {
          L.el.remove();
          activeLeaves.splice(i, 1);
        }
      }
      requestAnimationFrame(tickStorm);
    };
    requestAnimationFrame(tickStorm);
  }

  // ===================================================================
  // 5. THE 3D VAULT ORBIT (WIDE POLAROID ORBIT MATCHING IMAGE 2)
  // ===================================================================
  const vaultStage = document.getElementById('vaultStage');
  const orbitCards = document.querySelectorAll('.orbit-card');
  if (vaultStage && orbitCards.length > 0 && !reduceMotion) {
    let angle = 0;
    let isOrbitPaused = false;
    const speed = 0.0055;

    vaultStage.addEventListener('mouseenter', () => { isOrbitPaused = true; });
    vaultStage.addEventListener('mouseleave', () => { isOrbitPaused = false; });

    const total = orbitCards.length;
    const step = (Math.PI * 2) / total;

    const renderOrbit = () => {
      if (!isOrbitPaused) {
        angle += speed;
      }

      const stageWidth = vaultStage.clientWidth;
      // WIDE SWEEPING 3D ELLIPSE (Matching Image 2)
      const rx = Math.min(stageWidth * 0.46, 520);
      const ry = 80;

      orbitCards.forEach((card, index) => {
        const theta = angle + index * step;
        const x = Math.cos(theta) * rx;
        const y = Math.sin(theta) * ry;
        const z = Math.sin(theta); // -1 (back) to +1 (front)

        // Depth scale between 0.76 (back) and 1.18 (front)
        const scale = 0.78 + (z + 1) * 0.20;
        // Dynamic z-index: front cards pass OVER center goalkeeper (z: 10), back cards pass BEHIND (z: 5)
        const zIndex = z > 0 ? 25 : 5;
        // Natural atmospheric depth opacity
        const opacity = 0.65 + (z + 1) * 0.18;

        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        card.style.zIndex = zIndex;
        card.style.opacity = opacity;
      });

      requestAnimationFrame(renderOrbit);
    };
    requestAnimationFrame(renderOrbit);

    // Orbit card click opens high-res action photo in modal
    orbitCards.forEach((card) => {
      card.addEventListener('click', () => {
        const src = card.getAttribute('data-src');
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-desc');
        openModal(src, title, desc);
      });
    });
  }

  // ===================================================================
  // 6. T-SHIRT FRONT / BACK SWITCHER
  // ===================================================================
  const teeFront = document.getElementById('teeFront');
  const teeBack = document.getElementById('teeBack');
  const btnFront = document.getElementById('btnTeeFront');
  const btnBack = document.getElementById('btnTeeBack');

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
  // 7. ACCESSIBLE MODAL DIALOG
  // ===================================================================
  const dialog = document.getElementById('previewModal');
  const dialogImg = document.getElementById('dialogImg');
  const dialogTitle = document.getElementById('dialogTitle');
  const dialogDesc = document.getElementById('dialogDesc');
  const dialogClose = document.getElementById('dialogClose');

  const openModal = (src, title, desc) => {
    if (!dialog) return;
    if (dialogImg) dialogImg.src = src;
    if (dialogTitle) dialogTitle.textContent = title || 'Moment Preview';
    if (dialogDesc) dialogDesc.textContent = desc || '';
    dialog.showModal();
  };

  if (dialog) {
    if (dialogClose) {
      dialogClose.addEventListener('click', () => dialog.close());
    }

    // Modern Web Guidance: Light-dismiss fallback for outside click
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isDialogContent) {
          dialog.close();
        }
      });
    }
  }
});
