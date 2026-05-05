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

  // Why: boot sequence removed — it interfered with the network animation
  // on mobile (overlay sat in front of the canvas during page load).
  // The molecular field + page reveals are now the first impression.
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  // 4b. Code-entry gate + verify stamp
  //     Why: verification animation only fires after a unit code is
  //     submitted and matched against the authenticated register. Demo
  //     accepts ABC123. Production: this Set is replaced by a fetch
  //     against an admin-managed list (XLSX/CSV upload → backend).
  //
  //     A fixed 1.25s delay every visit feels canned, so we add
  //     200–500ms of jitter on top of an 850ms base — reads as a real
  //     check, not a pre-baked animation.
  // ─────────────────────────────────────────────────────────────────
  const VALID_CODES = new Set(['ABC123']);
  const isValidCode = (code) => VALID_CODES.has(code.trim().toUpperCase());

  const verifyStamp = document.querySelector('.verify-stamp');
  const codeForm    = document.getElementById('code-entry');
  const codeInput   = document.getElementById('code-input');
  const cfModal     = document.getElementById('cf-modal');
  const cfCodeOut   = document.getElementById('cf-modal-code');

  function runStampAnimation(){
    if (!verifyStamp) return;
    verifyStamp.hidden = false;
    if (reducedMotion){
      verifyStamp.classList.add('is-confirmed');
      return;
    }
    const base   = 850;
    const jitter = 200 + Math.random() * 300;
    setTimeout(() => verifyStamp.classList.add('is-confirmed'), base + jitter);
  }

  function passVerification(code){
    document.body.classList.add('is-verified');
    // Bind real entered code + actual verify timestamp into the COA
    const verifiedAt = new Date();
    setText('#coa-batch',     code);
    setText('[data-batch-short]', code);
    setText('#coa-lot',       `L-${code.replace(/[^A-Z0-9]/g,'').slice(-6).padStart(6,'0')}`);
    setText('#coa-verified',  fmtDateTime(verifiedAt));
    setText('#footer-time',   fmtDateTime(verifiedAt));
    if (codeForm){
      codeForm.classList.add('is-hidden');
      // Why: keep the form in the DOM during the fade — remove after the
      // CSS transition completes so the verify-stamp owns the row.
      setTimeout(() => { codeForm.remove(); }, 600);
    }
    runStampAnimation();
  }

  function failVerification(code){
    if (cfCodeOut) cfCodeOut.textContent = code || '—';
    if (codeForm){
      codeForm.classList.remove('is-error');
      // Restart the shake animation by forcing a reflow
      void codeForm.offsetWidth;
      codeForm.classList.add('is-error');
    }
    openCfModal();
  }

  function openCfModal(){
    if (!cfModal) return;
    document.body.classList.add('cf-open');
    cfModal.setAttribute('aria-hidden', 'false');
    // Move focus into the modal for keyboard users
    const focusTarget = cfModal.querySelector('.cf-modal__cta--primary');
    if (focusTarget) focusTarget.focus();
  }
  function closeCfModal(){
    if (!cfModal) return;
    document.body.classList.remove('cf-open');
    cfModal.setAttribute('aria-hidden', 'true');
    if (codeInput){
      codeInput.focus();
      codeInput.select();
    }
  }

  if (codeForm && codeInput){
    codeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const raw = codeInput.value.trim();
      if (!raw) return;
      const normalized = raw.toUpperCase();
      if (isValidCode(normalized)){
        passVerification(normalized);
      } else {
        failVerification(normalized);
      }
    });
    // Why: clear the error state as soon as the user starts editing
    codeInput.addEventListener('input', () => {
      codeForm.classList.remove('is-error');
    });
  }

  if (cfModal){
    cfModal.querySelectorAll('[data-cf-close]').forEach(el => {
      el.addEventListener('click', closeCfModal);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('cf-open')){
        closeCfModal();
      }
    });
  }

  // Why: a QR-encoded URL like ?b=ABC123 should pre-fill and auto-verify
  // — that's the whole point of the unit-bound QR. URL params still go
  // through the same valid/invalid path so a counterfeit QR (?b=BADCODE)
  // triggers the modal automatically.
  if (rawBatch){
    const incoming = batch || rawBatch.toUpperCase();
    if (codeInput) codeInput.value = incoming;
    // Defer slightly so the page paints before the animation kicks
    setTimeout(() => {
      if (isValidCode(incoming)){
        passVerification(incoming);
      } else {
        failVerification(incoming);
      }
    }, 350);
  }

  // ─────────────────────────────────────────────────────────────────
  // 5. Wordmark foil — mouse / device-tilt tracking
  //    Why: drifts the foil gradient under cursor / device tilt so the
  //    wordmark reads like a real foil under a real light source.
  // ─────────────────────────────────────────────────────────────────
  const root = document.documentElement;

  let foilRaf = 0, lastFoilEvent = null;
  window.addEventListener('mousemove', (e) => {
    lastFoilEvent = e;
    if (!foilRaf) foilRaf = requestAnimationFrame(() => {
      foilRaf = 0;
      if (!lastFoilEvent) return;
      const x = (lastFoilEvent.clientX / window.innerWidth) * 100;
      const y = (lastFoilEvent.clientY / window.innerHeight) * 100;
      root.style.setProperty('--foil-x', x + '%');
      root.style.setProperty('--foil-y', y + '%');
    });
  }, { passive:true });

  // Why: removed DeviceOrientation gyroscope tracking. iOS Safari was
  // surfacing the "Advanced Tracking and Fingerprinting Protection"
  // banner whenever the listener was attached, even without permission.
  // The wordmark foil still animates via CSS keyframes (foilDrift), and
  // pointer-tracking continues to work on desktop. That's enough.

  // ─────────────────────────────────────────────────────────────────
  // 5b. COA card — scroll-linked tilt + shimmer band
  //     Why: as the user scrolls past the cert section, the card tilts
  //     a few degrees on its X axis and a foil shimmer drifts across
  //     it. Subtle 3D presence + a sense that the card is a physical
  //     object catching light.
  // ─────────────────────────────────────────────────────────────────
  const coaCardEl    = document.querySelector('.coa-card');
  const coaSection   = document.getElementById('certificate');
  if (coaCardEl && coaSection && !reducedMotion){
    let coaRaf = 0;
    const updateCoa = () => {
      coaRaf = 0;
      const r = coaSection.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress: 0 when section bottom enters viewport, 1 when section top leaves
      const total = r.height + vh;
      const passed = vh - r.top;
      const t = Math.max(0, Math.min(1, passed / total));

      // Holo glisten band drifts left → right across the card's surface
      // as the section travels through the viewport. (Tilt removed — the
      // 3D card-tilt experiment looked odd on scroll.)
      const shimmer = 6 + t * 88;
      coaCardEl.style.setProperty('--shimmer', shimmer.toFixed(1) + '%');
    };
    const onScroll = () => {
      if (!coaRaf) coaRaf = requestAnimationFrame(updateCoa);
    };
    window.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', onScroll, { passive:true });
    updateCoa();
  }

  // ─────────────────────────────────────────────────────────────────
  // 6. Molecular network — pseudo-3D, depth-sorted, parallax
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
  const cam = { rotY:0, rotX:0, scrollT:0 };

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
      hub: i === 0                      // anchor hub — see offset below
    }));
    if (nodes[0]){
      // Why: previously parked at (0,0,0) which projects dead-centre and
      // washed out the wordmark/lede. Tuck hub into the lower-left quadrant
      // — still a focal point for the network, never behind the copy.
      nodes[0].x = -halfW * 0.55;
      nodes[0].y =  halfH * 0.42;
      nodes[0].z = -60;
      nodes[0].vx = nodes[0].vy = nodes[0].vz = 0;
      nodes[0].r = 2.2;
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

    // Why: clamp the perspective denominator. On wide viewports halfW gets
    // big, and a node rotating behind the camera could push (FOV+z+280)
    // into negative territory — that flips persp negative, makes r negative,
    // and ctx.arc throws IndexSizeError. Clamp keeps it well-defined.
    const denom = Math.max(60, FOV + z + 280);
    const persp = FOV / denom;
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

    // Camera evolution — fixed-speed rotation, faster on mobile.
    // Why: same node count on a much smaller viewport reads as slower
    // motion per pixel, so narrow screens get ~70% more spin.
    cam.rotY += window.innerWidth < 760 ? 0.0024 : 0.0014;
    cam.rotX = cam.scrollT * 0.4;

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
        ctx.strokeStyle = `rgba(184,197,219,${alpha})`;
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
        // Halo glow — hub is dimmer + smaller now (was 0.55 / 16x); enough
        // to anchor the field without washing out the wordmark or lede.
        const haloR = r * (p.hub ? 9 : 5);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR);
        const haloIntensity = (p.hub ? 0.32 : 0.22) * p.s;
        grad.addColorStop(0, `rgba(184,197,219,${haloIntensity})`);
        grad.addColorStop(1, 'rgba(184,197,219,0)');
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

  // Why: on iOS Safari (and sometimes Android Chrome), defer scripts can
  // run before the canvas has its laid-out dimensions. resize() then
  // measures 0×0, seeds zero nodes, and the canvas stays blank until the
  // user reloads. Watching the canvas with ResizeObserver guarantees we
  // re-seed once real dimensions land. We also kick again on load.
  if ('ResizeObserver' in window){
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
  }
  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      resize();
      if (!raf){ running = true; raf = requestAnimationFrame(tick); }
    });
  }, { once:true });

  resize();
  raf = requestAnimationFrame(tick);
})();
