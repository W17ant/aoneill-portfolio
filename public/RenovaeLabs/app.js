/* Renovae Labs — Authenticity Landing
   Engine: boot sequence, 3D molecular canvas, scroll reveals,
   count-up specs, COA data binding.
   Why: dependency-free for sub-second QR-scan loads on mobile. */

(() => {
  'use strict';

  // ─────────────────────────────────────────────────────────────────
  // 1. URL params + COA data binding
  //    Why: future-proofs ?b=BATCH on QR codes per packaging unit.
  // ─────────────────────────────────────────────────────────────────
  const params = new URLSearchParams(location.search);
  const rawBatch = params.get('b') || params.get('batch') || '';
  const product  = params.get('p') || params.get('product') || '';

  // Sanitise: alphanumeric + dashes, max 24 chars
  const batch = rawBatch.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 24);
  const productClean = product.replace(/[^A-Za-z0-9 .+\-]/g, '').slice(0, 40);

  // Why: when no batch supplied, generate a deterministic-looking placeholder
  // tied to today so the COA never feels empty or templated.
  function mkBatchFallback(){
    const d = new Date();
    const yy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth()+1).padStart(2,'0');
    const seed = (yy * 31 + d.getUTCDate() + d.getUTCHours()) % 9999;
    return `RNV-${yy}-${mm}-${('A1' + seed.toString().padStart(3,'0'))}`;
  }
  const batchFinal = batch || mkBatchFallback();

  // Lot derived deterministically from batch (last 6 chars)
  const lot = `L-${batchFinal.replace(/[^A-Z0-9]/g,'').slice(-6)}`;

  // Manufactured date: today minus a few weeks (plausible)
  // Why: a freshly synthesised unit usually has 1-4 weeks in finishing/QC
  const today = new Date();
  const mfg = new Date(today); mfg.setDate(mfg.getDate() - 21);
  const exp = new Date(today); exp.setFullYear(exp.getFullYear() + 2);

  function fmtDate(d){
    return d.toLocaleDateString('en-GB',
      { day:'2-digit', month:'short', year:'numeric' }).toUpperCase();
  }
  function fmtDateTime(d){
    return d.toLocaleString('en-GB', {
      day:'2-digit', month:'short', year:'numeric',
      hour:'2-digit', minute:'2-digit'
    }).toUpperCase();
  }

  const verifiedNow = new Date();

  // Bind values
  const setText = (sel, val) => {
    document.querySelectorAll(sel).forEach(el => { el.textContent = val; });
  };
  setText('#coa-batch',     batchFinal);
  setText('[data-batch-short]', batchFinal);
  setText('#coa-lot',       lot);
  setText('#coa-mfg',       fmtDate(mfg));
  setText('#coa-exp',       fmtDate(exp));
  setText('#coa-verified',  fmtDateTime(verifiedNow));
  setText('#footer-time',   fmtDateTime(verifiedNow));
  setText('#year',          String(verifiedNow.getFullYear()));
  setText('#coa-product',   productClean || 'Sealed Renovae Labs Unit');

  // ─────────────────────────────────────────────────────────────────
  // 2. Boot sequence
  //    Skip if reduced motion. Cache per-session so refresh is instant.
  // ─────────────────────────────────────────────────────────────────
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const boot = document.getElementById('boot');
  const seenBoot = sessionStorage.getItem('rnv_seen') === '1';

  if (boot){
    if (reducedMotion || seenBoot){
      boot.classList.add('is-done');
      requestAnimationFrame(() => boot.remove());
    } else {
      // Total boot length ~1.55s
      setTimeout(() => {
        boot.classList.add('is-done');
        sessionStorage.setItem('rnv_seen', '1');
        setTimeout(() => boot.remove(), 600);
      }, 1550);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // 3. Reveal-on-scroll
  //    Why: IntersectionObserver is cheap, supported everywhere
  //    that this page targets. Triggers per-element animations
  //    (COA card, spec bars, count-ups) downstream.
  // ─────────────────────────────────────────────────────────────────
  const revealIO = new IntersectionObserver((entries) => {
    for (const e of entries){
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      revealIO.unobserve(e.target);

      // Spec bar fill — set CSS var on entry
      if (e.target.classList.contains('spec')){
        const fillEl = e.target.querySelector('.spec__fill');
        if (fillEl){
          const w = fillEl.getAttribute('data-fill') || '100';
          fillEl.style.setProperty('--w', w + '%');
        }
        // count-ups inside this spec
        e.target.querySelectorAll('[data-count-to]').forEach(countUp);
      }
    }
  }, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

  // Specs are wrapped in their own container's reveal — we also need each
  // tile to trigger its own count + bar fill. Promote each spec to an
  // observed element too.
  const specs = document.querySelectorAll('.spec');
  specs.forEach(s => revealIO.observe(s));

  // Observe the COA card explicitly so its bespoke choreography fires
  // independently of the section-head reveal above it.
  const coaCard = document.querySelector('.coa-card');
  if (coaCard){
    const coaIO = new IntersectionObserver((entries) => {
      for (const e of entries){
        if (e.isIntersecting){
          e.target.classList.add('is-in');
          coaIO.unobserve(e.target);
        }
      }
    }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });
    coaIO.observe(coaCard);
  }

  // ─────────────────────────────────────────────────────────────────
  // 4. Count-up animation
  //    Why: numerical reveals on the spec strip feel "instrumented"
  // ─────────────────────────────────────────────────────────────────
  function countUp(el){
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    const target = parseFloat(el.dataset.countTo);
    const decimals = parseInt(el.dataset.countDecimals || '0', 10);
    const dur = 1300;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);   // easeOutCubic

    function tick(now){
      const t = Math.min(1, (now - start) / dur);
      const v = target * ease(t);
      el.textContent = v.toFixed(decimals);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(tick);
  }

  // ─────────────────────────────────────────────────────────────────
  // 5. Molecular network — pseudo-3D, depth-sorted, parallax
  //    Why: matches packaging artwork and gives the hero genuine theatre
  // ─────────────────────────────────────────────────────────────────
  if (reducedMotion) return;

  const canvas = document.getElementById('molecular');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha:true });

  let W = 0, H = 0, dpr = 1;
  let nodes = [];
  let raf = 0;
  let running = true;

  // Camera-state — auto-rotate around Y, subtly nodded by mouse + scroll
  const cam = { rotY:0, rotX:0, mx:0, my:0, scrollT:0 };

  const NODE_COUNT_TARGET = 90;     // hero density target — capped on small screens
  const LINK_DIST = 200;            // 3D distance for line linking
  const FOV = 600;                  // perspective focal length

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width  = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    seed();
  }

  function rand(min,max){ return Math.random()*(max-min)+min; }

  function seed(){
    // Box dimensions in 3D space — wider than tall so it feels cinematic
    const halfW = Math.max(W*0.7, 380);
    const halfH = Math.max(H*0.55, 280);
    const halfD = 280;

    const target = Math.min(NODE_COUNT_TARGET, Math.round((W*H) / 9000));
    nodes = Array.from({length: target}, (_, i) => ({
      x: rand(-halfW, halfW),
      y: rand(-halfH, halfH),
      z: rand(-halfD, halfD),
      vx: rand(-.06,.06),
      vy: rand(-.06,.06),
      vz: rand(-.05,.05),
      r: rand(0.7, 1.8),
      bright: Math.random() > 0.78,    // ~22% are highlight nodes
      hub: i === 0                      // central hub node — slightly larger
    }));
    if (nodes[0]){
      nodes[0].x = 0; nodes[0].y = 0; nodes[0].z = 0;
      nodes[0].vx = nodes[0].vy = nodes[0].vz = 0;
      nodes[0].r = 2.6;
      nodes[0].bright = true;
      nodes[0].hub = true;
    }
  }

  // Pre-allocate a projection buffer to avoid GC pressure
  let projected = [];

  function project(n){
    // Apply rotation around Y then X
    const cy = Math.cos(cam.rotY), sy = Math.sin(cam.rotY);
    const cx = Math.cos(cam.rotX), sx = Math.sin(cam.rotX);

    let x = n.x * cy + n.z * sy;
    let z = -n.x * sy + n.z * cy;
    let y = n.y * cx - z * sx;
    z = n.y * sx + z * cx;

    const persp = FOV / (FOV + z + 280);  // +280 puts the cluster slightly back
    return {
      x: W*0.5 + x * persp,
      y: H*0.5 + y * persp,
      z: z,
      s: persp,
      bright: n.bright,
      hub: n.hub,
      r: n.r
    };
  }

  function tick(now){
    if (!running){ raf = 0; return; }

    // Camera evolution
    cam.rotY += 0.0014;                          // base spin
    cam.rotY += cam.mx * 0.00006;                // mouse pull
    cam.rotX = cam.my * 0.0006 + cam.scrollT * 0.4;

    // Update nodes (motion in 3D box; wrap on each axis)
    const halfW = Math.max(W*0.7, 380);
    const halfH = Math.max(H*0.55, 280);
    const halfD = 280;

    for (const n of nodes){
      if (n.hub) continue;
      n.x += n.vx; n.y += n.vy; n.z += n.vz;
      if (n.x >  halfW) n.x = -halfW; else if (n.x < -halfW) n.x =  halfW;
      if (n.y >  halfH) n.y = -halfH; else if (n.y < -halfH) n.y =  halfH;
      if (n.z >  halfD) n.z = -halfD; else if (n.z < -halfD) n.z =  halfD;
    }

    // Project all
    projected.length = 0;
    for (let i=0; i<nodes.length; i++){
      projected.push(project(nodes[i]));
    }

    // Depth-sort back-to-front
    projected.sort((a,b) => b.z - a.z);

    ctx.clearRect(0,0,W,H);

    // Lines first
    const linkSq = LINK_DIST * LINK_DIST;
    for (let i=0; i<projected.length; i++){
      const a = projected[i];
      for (let j=i+1; j<projected.length; j++){
        const b = projected[j];
        // Distance in screen-space (after projection) feels right
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx*dx + dy*dy;
        if (d2 > linkSq) continue;

        const dist = Math.sqrt(d2);
        const fade = 1 - dist/LINK_DIST;
        const depth = (a.s + b.s) * 0.5;
        const alpha = fade * 0.35 * depth;
        ctx.strokeStyle = `rgba(207,214,238,${alpha})`;
        ctx.lineWidth = 0.6 * depth;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // Nodes (front to back so highlights pop)
    for (let i=projected.length-1; i>=0; i--){
      const p = projected[i];
      const r = p.r * (0.6 + p.s * 1.1);
      const alpha = 0.45 + p.s * 0.55;

      if (p.bright || p.hub){
        // Halo glow
        const haloR = r * (p.hub ? 16 : 6);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR);
        const haloIntensity = (p.hub ? 0.55 : 0.25) * p.s;
        grad.addColorStop(0, `rgba(207,214,238,${haloIntensity})`);
        grad.addColorStop(1, 'rgba(207,214,238,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, haloR, 0, Math.PI*2);
        ctx.fill();
      }

      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI*2);
      ctx.fill();
    }

    raf = requestAnimationFrame(tick);
  }

  // Mouse parallax (pointer only — phones use scroll)
  window.addEventListener('mousemove', (e) => {
    cam.mx = (e.clientX - window.innerWidth*0.5);
    cam.my = (e.clientY - window.innerHeight*0.5);
  }, { passive:true });

  // Scroll rotation (subtle, only while hero is roughly visible)
  let scrollT = 0;
  window.addEventListener('scroll', () => {
    const max = window.innerHeight;
    const s = Math.min(1, Math.max(0, window.scrollY / max));
    cam.scrollT = s;
  }, { passive:true });

  // Pause when off-screen, resume when back
  const heroIO = new IntersectionObserver((entries) => {
    running = entries[0].isIntersecting;
    if (running && !raf) raf = requestAnimationFrame(tick);
  }, { threshold: 0 });
  heroIO.observe(canvas);

  // Pause on tab hide
  document.addEventListener('visibilitychange', () => {
    if (document.hidden){ running = false; }
    else if (!raf){ running = true; raf = requestAnimationFrame(tick); }
  });

  // Resize debounce
  let rT;
  window.addEventListener('resize', () => {
    clearTimeout(rT);
    rT = setTimeout(resize, 120);
  }, { passive:true });

  resize();
  raf = requestAnimationFrame(tick);
})();
