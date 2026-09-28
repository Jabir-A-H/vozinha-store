/* =====================================================================
   VOZINHA.STORE.CV — Main JavaScript Controller
   1. Procedural Canvas Smoke Engine
   2. Comments Storm Physics Engine (Drifting Leaves)
   3. 3D Vault Orbit Engine (Saves vs Messi, Ronaldo, Neymar)
   4. T-Shirt Front/Back Switcher
   5. Accessible Modal Dialog with Light-Dismiss
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===================================================================
  // 1. PROCEDURAL CANVAS SMOKE ENGINE
  // ===================================================================
  const canvas = document.getElementById('smokeCanvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let cw, ch;
    const puffs = [];
    const puffCount = window.innerWidth < 768 ? 10 : 20;

    // Offscreen radial gradient puff sprite
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 256;
    const sg = sprite.getContext('2d');
    const grad = sg.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, 'rgba(26, 77, 128, 0.45)');
    grad.addColorStop(0.5, 'rgba(12, 38, 69, 0.2)');
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
        alpha: 0.12 + Math.random() * 0.18,
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
          p.x += p.vx;
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
  // 2. COMMENTS STORM PHYSICS ENGINE (Drifting Social Proof)
  // ===================================================================
  const stormField = document.getElementById('stormField');
  if (stormField && !reduceMotion) {
    const commentData = [
      { file: 'comment-1.svg', title: 'Casimiro on CazéTV', desc: '"SIGAM O HOMEM IMEDIATAMENTE! O Vozinha é um monstro sagrado!"' },
      { file: 'comment-2.svg', title: 'Rodrigo Silva', desc: 'Cheguei pelo Cazé e virei fã incondicional. Vozinha lenda absoluta!' },
      { file: 'comment-3.svg', title: 'Madrid Sports Review', desc: 'Spain threw everything. Vozinha stopped everything. Masterclass.' },
      { file: 'comment-4.svg', title: 'São Vicente TV', desc: 'Orgulho infinito de Mindelo! Nosso capitão brilhando pro mundo inteiro.' },
      { file: 'comment-5.svg', title: 'Gabriel Santos', desc: 'Messi, Ronaldo, Neymar... nobody is scoring on Vozinha on his night.' },
      { file: 'comment-6.svg', title: 'FIFA World Daily', desc: 'Official Player of the Match: Josimar Dias VOZINHA.' },
      { file: 'comment-7.svg', title: 'Lucas Moura Fan', desc: 'O Brasil inteiro parou pra torcer pelo Vozinha. 29M+ reach.' },
      { file: 'comment-8.svg', title: 'Tubarões Azuis Army', desc: '12 years defending this nation. True captain forever in history.' }
    ];

    let fieldWidth = stormField.clientWidth;
    let fieldHeight = stormField.clientHeight;
    const maxAlive = window.innerWidth < 768 ? 4 : 7;
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
      el.innerHTML = `<img src="assets/images/${item.file}" alt="${item.title}" loading="lazy" width="340" height="150">`;
      stormField.appendChild(el);

      const leaf = {
        el,
        item,
        x: initial ? Math.random() * (fieldWidth - 340) : fieldWidth + 20,
        y: Math.random() * (fieldHeight - 160),
        vx: -(0.75 + Math.random() * 0.65),
        vy: (Math.random() - 0.5) * 0.2,
        rot: (Math.random() - 0.5) * 12,
        phase: Math.random() * Math.PI * 2,
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

    // Pre-populate field
    for (let i = 0; i < maxAlive; i++) {
      spawnLeaf(true);
    }

    let lastTick = performance.now();
    const tickStorm = (now) => {
      const dt = Math.min(32, now - lastTick) / 16.7;
      lastTick = now;

      if (activeLeaves.length < maxAlive && Math.random() < 0.035) {
        spawnLeaf(false);
      }

      for (let i = activeLeaves.length - 1; i >= 0; i--) {
        const L = activeLeaves[i];
        if (!L.held) {
          L.phase += 0.015 * dt;
          L.x += L.vx * dt;
          L.y += (L.vy + Math.sin(L.phase) * 0.35) * dt;

          L.el.style.transform = `translate3d(${L.x}px, ${L.y + Math.sin(L.phase * 0.8) * 12}px, 0) rotate(${L.rot}deg)`;
        }

        // Remove offscreen
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
  // 3. 3D VAULT ORBIT ENGINE (Saves vs Messi, Ronaldo, Neymar)
  // ===================================================================
  const vaultStage = document.getElementById('vaultStage');
  const orbitCards = document.querySelectorAll('.orbit-card');
  if (vaultStage && orbitCards.length > 0 && !reduceMotion) {
    let angle = 0;
    let isOrbitPaused = false;
    const speed = 0.007;

    vaultStage.addEventListener('mouseenter', () => { isOrbitPaused = true; });
    vaultStage.addEventListener('mouseleave', () => { isOrbitPaused = false; });

    const total = orbitCards.length;
    const step = (Math.PI * 2) / total;

    const renderOrbit = () => {
      if (!isOrbitPaused) {
        angle += speed;
      }

      const stageWidth = vaultStage.clientWidth;
      const rx = Math.min(stageWidth * 0.42, 420); // Horizontal ellipse radius
      const ry = 80;                               // Vertical ellipse depth

      orbitCards.forEach((card, index) => {
        const theta = angle + index * step;
        const x = Math.cos(theta) * rx;
        const y = Math.sin(theta) * ry;
        const z = Math.sin(theta); // -1 (back) to +1 (front)

        // Scale between 0.75 and 1.15 based on z-depth
        const scale = 0.8 + (z + 1) * 0.2;
        // Dynamic z-index: front cards pass OVER center goalkeeper (z: 10), back cards pass BEHIND (z: 5)
        const zIndex = z > 0 ? 25 : 5;
        // Slight opacity drop at back
        const opacity = 0.65 + (z + 1) * 0.18;

        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        card.style.zIndex = zIndex;
        card.style.opacity = opacity;
      });

      requestAnimationFrame(renderOrbit);
    };
    requestAnimationFrame(renderOrbit);

    // Orbit card click
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
  // 4. T-SHIRT FRONT / BACK SWITCHER
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
  // 5. ACCESSIBLE MODAL DIALOG (Compliant with Modern Web Guidance)
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

    // Modern Web Guidance: Light-dismiss fallback for browsers without native closedby support
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
