document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio loaded smoothly!");

  // --- NAVBAR SCROLL EFFECT ---
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- HERO PARALLAX ---
  const heroDots = document.querySelector('.hero-bg-dots');
  if (heroDots) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < window.innerHeight * 1.2) {
            heroDots.style.transform = `scale(2) translate(${scrollY * 0.012}px, ${scrollY * 0.02}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // --- MOBILE MENU TOGGLE ---
  const hamburger = document.querySelector(".nav-hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  function toggleMenu() {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.innerHTML = isOpen ? "✕" : "☰";
    document.body.style.overflow = isOpen ? "hidden" : ""; // prevent background scroll
  }

  hamburger.addEventListener("click", toggleMenu);

  // Close menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger.innerHTML = "☰";
      document.body.style.overflow = "";
    });
  });

  // Close menu when clicking directly on the overlay background
  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      mobileMenu.classList.remove("open");
      hamburger.innerHTML = "☰";
      document.body.style.overflow = "";
    }
  });

  // --- ACTIVE LINK TRACKING (IntersectionObserver) ---
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link"); // desktop links

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5 // Trigger when section is 50% in viewport
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove("active"));
        
        // Add active class to corresponding link
        const targetId = entry.target.getAttribute("id");
        const activeLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
        if (activeLink) {
          activeLink.classList.add("active");
        }
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  // --- SECTION FOCUS / APPLE-LIKE DIMMING ---
  // Keep tall sections bright while the viewport is anywhere inside them.
  // Reduced-motion users get no opacity choreography at all.
  const allSections = document.querySelectorAll('section');
  if (!prefersReducedMotion) {
    let focusTicking = false;
    function updateSectionFocus() {
      const viewportCenter = window.innerHeight * 0.50;
      const fadeDistance = window.innerHeight * 0.85;
      allSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const top = rect.top, bottom = rect.bottom;
        const distance = (top <= viewportCenter && bottom >= viewportCenter)
          ? 0
          : Math.min(Math.abs(top - viewportCenter), Math.abs(bottom - viewportCenter));
        const progress = Math.min(distance / fadeDistance, 1);
        const opacity = 1 - (progress * 0.22);
        section.style.opacity = opacity.toFixed(3);
      });
      focusTicking = false;
    }
    function requestFocusUpdate() {
      if (!focusTicking) {
        requestAnimationFrame(updateSectionFocus);
        focusTicking = true;
      }
    }
    window.addEventListener('scroll', requestFocusUpdate, { passive: true });
    window.addEventListener('resize', requestFocusUpdate);
    requestFocusUpdate();
  }

  // --- PROJECTS FILTERING ---
  const filterTabs = document.querySelectorAll(".filter-tab");
  const projectCards = document.querySelectorAll(".project-card");

  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.getAttribute("data-filter");

      projectCards.forEach(card => {
        const matches = filter === "all" || card.getAttribute("data-tag") === filter;
        if (matches) {
          card.classList.remove("is-hidden");
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });

  // --- CARD SCROLL ANIMATION ---
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("is-visible");
        }, prefersReducedMotion ? 0 : i * 80);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  projectCards.forEach(card => cardObserver.observe(card));

  // --- MAGNETIC CARD HOVER ---
  const projectCardEls = document.querySelectorAll('.project-card');
  projectCardEls.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / rect.height) * 6;
      const tiltY = -(x / rect.width) * 6;
      card.style.transform = `translateY(-3px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      setTimeout(() => { card.style.transition = ''; }, 400);
    });
  });

  // --- CONTACT CARD GLOW ---
  const contactCards = document.querySelectorAll('.contact-card');
  contactCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(245,166,35,0.08) 0%, #111827 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  // --- TEXT SPLIT STAGGER ---
  function splitAndAnimate(selector) {
    const els = document.querySelectorAll(selector);
    els.forEach(el => {
      const words = el.textContent.trim().split(' ');
      el.innerHTML = words.map((word, i) =>
        `<span class="word-wrap"><span class="word" style="transition-delay:${i * 0.04}s">${word}</span></span>`
      ).join(' ');
    });
  }
  splitAndAnimate('.hero-name');
  splitAndAnimate('.section-header h2');

  setTimeout(() => {
    document.querySelectorAll('.hero-name .word').forEach(w => {
      w.classList.add('word-visible');
    });
  }, 100);

  // --- SCROLL REVEAL ---
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Trigger word animations inside section headers
        entry.target.querySelectorAll('.word').forEach(w => {
          w.classList.add('word-visible');
        });
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  // --- CUSTOM CURSOR ---
  const cursorDot = document.getElementById("cursor-dot");
  const cursorOutline = document.getElementById("cursor-outline");

  // Only run cursor logic if fine pointer (mouse) is present
  if (window.matchMedia("(pointer: fine)").matches) {
    
   window.addEventListener("mousemove", (e) => {
  const posX = e.clientX;
  const posY = e.clientY;

  cursorDot.style.left = `${posX}px`;
  cursorDot.style.top = `${posY}px`;
  cursorOutline.style.left = `${posX}px`;
  cursorOutline.style.top = `${posY}px`;
  cursorOutline.style.opacity = '1'; 
});

    // Hover effect on links and buttons
    const interactiveElements = document.querySelectorAll("a, button, .filter-tab, .contact-card");
    
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        document.body.classList.add("cursor-hover-state");
      });
      el.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-hover-state");
      });
      
      // Safety reset
      el.addEventListener("click", () => {
         document.body.classList.remove("cursor-hover-state");
      })
    });
  } else {
    // Ensure body cursor isn't hidden on touch devices
    document.body.style.cursor = 'auto';
  }
});


// --- INTERACTIVE ENGINEERING DIGITAL TWIN ---
(() => {
  const canvas = document.getElementById('twin-canvas');
  const viewport = document.getElementById('twin-viewport');
  if (!canvas || !viewport) return;

  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tabs = document.querySelectorAll('[data-twin-mode]');
  const modeLabel = document.getElementById('twin-mode-label');
  const status = document.getElementById('twin-status');
  const readout = document.getElementById('twin-readout');
  const modes = {
    cad: ['CAD / PARAMETRIC VIEW', 'PARAMETRIC GEOMETRY · INTERACTIVE VIEW'],
    fea: ['FEA / STRESS VISUALIZATION', 'ILLUSTRATIVE STRESS FIELD · NOT A MEASURED RESULT'],
    dfam: ['DfAM / LATTICE STUDY', 'LATTICE TOPOLOGY · ADDITIVE MANUFACTURING CONCEPT'],
    robotics: ['ROBOTICS / MOTION VIEW', 'KINEMATICS CONCEPT · INTERACTIVE SYSTEM VIEW']
  };
  let mode='cad', rot=0, tilt=.28, dragging=false, px=0, py=0, raf=0, active=true;

  function resize(){
    const r=viewport.getBoundingClientRect(), d=window.devicePixelRatio||1;
    canvas.width=Math.round(r.width*d); canvas.height=Math.round(r.height*d);
    ctx.setTransform(d,0,0,d,0,0);
    canvas._w=r.width; canvas._h=r.height;
  }
  window.addEventListener('resize', resize); resize();

  tabs.forEach(btn=>btn.addEventListener('click',()=>{
    mode=btn.dataset.twinMode;
    tabs.forEach(b=>{ const active=b.dataset.twinMode===mode; b.classList.toggle('active',active); b.setAttribute('aria-selected',active?'true':'false'); });
    modeLabel.textContent=modes[mode][0]; status.textContent=modes[mode][1];
  }));

  viewport.addEventListener('pointerdown',e=>{dragging=true; px=e.clientX; py=e.clientY; viewport.setPointerCapture?.(e.pointerId);});
  viewport.addEventListener('pointermove',e=>{ if(!dragging)return; rot+=(e.clientX-px)*.009; tilt=Math.max(-.55,Math.min(.75,tilt+(e.clientY-py)*.006)); px=e.clientX; py=e.clientY; });
  viewport.addEventListener('pointerup',()=>dragging=false);
  viewport.addEventListener('pointercancel',()=>dragging=false);

  function project(x,y,z){
    const cy=Math.cos(rot), sy=Math.sin(rot), cx=Math.cos(tilt), sx=Math.sin(tilt);
    const x1=x*cy-z*sy, z1=x*sy+z*cy;
    const y1=y*cx-z1*sx, z2=y*sx+z1*cx;
    const scale=1/(1+z2/520), s=Math.min(canvas._w,canvas._h)*.0036*scale;
    return [canvas._w/2+x1*s, canvas._h*.49+y1*s, z2];
  }
  function line(a,b,stroke,w=1){ const p=project(...a), q=project(...b); ctx.strokeStyle=stroke; ctx.lineWidth=w; ctx.beginPath(); ctx.moveTo(p[0],p[1]); ctx.lineTo(q[0],q[1]); ctx.stroke(); }
  function ring(radius,y,segments=40){
    const pts=[]; for(let i=0;i<=segments;i++){const t=i/segments*Math.PI*2; pts.push([radius*Math.cos(t),y,radius*Math.sin(t)]);} 
    for(let i=1;i<pts.length;i++) line(pts[i-1],pts[i], mode==='fea'?stress(i/segments):'rgba(245,166,35,.72)', mode==='cad'?1.15:1.45);
  }
  function stress(t){ const r=Math.sin(t*Math.PI*6)*.5+.5; return `rgb(${Math.round(245*r+80*(1-r))},${Math.round(80+145*(1-r))},${Math.round(90+130*(1-r))})`; }
  function drawBase(){
    const R=88,H=105,inner=30;
    ring(R,-H/2); ring(R,H/2); ring(inner,-H/2); ring(inner,H/2);
    for(let i=0;i<16;i++){const t=i/16*Math.PI*2; line([R*Math.cos(t),-H/2,R*Math.sin(t)],[R*Math.cos(t),H/2,R*Math.sin(t)],mode==='fea'?stress(i/15):'rgba(148,163,184,.38)');}
    for(let i=0;i<10;i++){const t=i/10*Math.PI*2; line([inner*Math.cos(t),-H/2,inner*Math.sin(t)],[inner*Math.cos(t),H/2,inner*Math.sin(t)],'rgba(148,163,184,.3)');}
    // radial spokes / ribs
    for(let y of [-H*.28,0,H*.28]) for(let i=0;i<8;i++){const t=i/8*Math.PI*2; line([inner*Math.cos(t),y,inner*Math.sin(t)],[R*Math.cos(t+.16),y,R*Math.sin(t+.16)],'rgba(245,166,35,.32)');}
  }
  function drawLattice(){
    const R=96,H=120,N=7;
    for(let y=-H/2;y<=H/2;y+=H/N){ for(let i=0;i<12;i++){ const t=i/12*Math.PI*2; const p=[R*Math.cos(t),y,R*Math.sin(t)]; const t2=t+Math.PI/12; const q=[R*.72*Math.cos(t2),y+H/N*.5,R*.72*Math.sin(t2)]; line(p,q,'rgba(99,230,190,.55)'); } }
    ring(R*.72,-H/2,32); ring(R*.72,H/2,32);
  }
  function drawRobot(){
    const base=90; const joints=[[0,45,0],[0,-5,0],[70,-65,0],[135,-82,0]];
    line([-base,65,0],[base,65,0],'rgba(148,163,184,.6)',2); line([-base,65,0],[-base,35,0],'rgba(148,163,184,.4)'); line([base,65,0],[base,35,0],'rgba(148,163,184,.4)');
    for(let i=0;i<joints.length-1;i++){line(joints[i],joints[i+1],'rgba(245,166,35,.9)',5); const p=project(...joints[i]); ctx.fillStyle='#f5a623'; ctx.beginPath();ctx.arc(p[0],p[1],5,0,Math.PI*2);ctx.fill();}
    line(joints[3],[160,-82,25],'rgba(99,230,190,.85)',3); line(joints[3],[160,-82,-25],'rgba(99,230,190,.85)',3);
  }
  function draw(){
    const w=canvas._w,h=canvas._h; ctx.clearRect(0,0,w,h);
    ctx.strokeStyle='rgba(148,163,184,.06)'; ctx.lineWidth=1;
    for(let x=20;x<w;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
    for(let y=20;y<h;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    ctx.fillStyle='rgba(148,163,184,.45)';ctx.font='10px monospace';ctx.fillText('HARI-L / ENGINEERING VIEW',18,22);
    if(mode==='dfam') drawLattice(); else if(mode==='robotics') drawRobot(); else drawBase();
    if(mode==='fea'){
      ctx.fillStyle='rgba(255,255,255,.65)';ctx.font='9px monospace';ctx.fillText('ILLUSTRATIVE CONTOUR',18,h-30);
      for(let i=0;i<5;i++){ctx.fillStyle=`rgba(${245-i*35},${90+i*25},${110+i*20},.9)`;ctx.fillRect(w-92, h-28-i*10, 12, 8);}
    }
    if(!dragging && !reducedMotion) rot+=.0025;
    if(active) raf=requestAnimationFrame(draw);
  }
  const twinVisibility=new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active&&!raf)draw();},{threshold:.05});
  twinVisibility.observe(viewport);
  draw();
})();

/* ========================= V2 INTERACTIVE ENGINEERING PANELS ========================= */
(function(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const speed = document.getElementById('safety-speed');
  const confidence = document.getElementById('safety-confidence');
  const speedOut = document.getElementById('safety-speed-value');
  const confidenceOut = document.getElementById('safety-confidence-value');
  const stopOut = document.getElementById('safety-stop');
  const safeOut = document.getElementById('safety-safe');
  const ttcOut = document.getElementById('safety-ttc');
  const stateOut = document.getElementById('safety-state');
  const envelope = document.getElementById('safety-envelope');
  if(!speed || !confidence) return;

  function updateSafety(){
    const v = Number(speed.value);
    const c = Number(confidence.value);
    const a = 3.0;
    const reaction = v * 0.18;
    const dStop = (v*v)/(2*a);
    const uncertainty = 0.22 + (1-c)*0.72;
    const dSafe = dStop + reaction + uncertainty;
    const distance = 2.2;
    const ttc = distance / Math.max(v,0.05);
    const risk = ttc < .75 ? 'IMMINENT' : ttc < 1.25 || c < .48 ? 'CRITICAL' : ttc < 1.8 || c < .65 ? 'WARNING' : 'SAFE';
    speedOut.textContent = v.toFixed(1)+' m/s';
    confidenceOut.textContent = c.toFixed(2);
    stopOut.textContent = dStop.toFixed(2)+' m';
    safeOut.textContent = dSafe.toFixed(2)+' m';
    ttcOut.textContent = ttc.toFixed(2)+' s';
    stateOut.textContent = risk;
    stateOut.style.color = risk==='SAFE' ? '#7ee787' : risk==='WARNING' ? '#f5a623' : '#ff7b72';
    const px = Math.min(155, 48 + dSafe*34);
    envelope.style.width = px+'px'; envelope.style.height = px+'px';
    envelope.style.borderColor = risk==='SAFE' ? 'rgba(126,231,135,.75)' : risk==='WARNING' ? 'rgba(245,166,35,.8)' : 'rgba(255,123,114,.85)';
    envelope.style.boxShadow = `0 0 ${risk==='SAFE'?30:50}px ${risk==='SAFE'?'rgba(126,231,135,.08)':risk==='WARNING'?'rgba(245,166,35,.12)':'rgba(255,123,114,.14)'}`;
  }
  speed.addEventListener('input',updateSafety); confidence.addEventListener('input',updateSafety); updateSafety();
})();

(function(){
  const figures=document.querySelectorAll('.case-gallery figure,.evidence-card');
  if(!figures.length) return;
  figures.forEach(fig=>fig.addEventListener('click',()=>{
    const img=fig.querySelector('img'); if(!img) return;
    const modal=document.createElement('div'); modal.className='image-lightbox';
    modal.innerHTML=`<button aria-label="Close image">×</button><img src="${img.src}" alt="${img.alt||''}"><div>${img.alt||''}</div>`;
    document.body.appendChild(modal);
    requestAnimationFrame(()=>modal.classList.add('is-open'));
    const close=()=>{modal.classList.remove('is-open');setTimeout(()=>modal.remove(),220)};
    modal.addEventListener('click',e=>{if(e.target===modal||e.target.tagName==='BUTTON')close()});
    document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){close();document.removeEventListener('keydown',esc)}});
  }));
})();


/* ========================= V3 INTERACTIVE ENGINEERING LAB ========================= */
(() => {
  // Scroll progress + compact section readout.
  const bar=document.createElement('div'); bar.className='scroll-progress'; document.body.appendChild(bar);
  const idx=document.createElement('div'); idx.className='section-index'; idx.innerHTML='<span>SECTION</span> <b id="section-index-value">01</b>'; document.body.appendChild(idx);
  const sections=[...document.querySelectorAll('main > section:not(#hero):not(#snapshot), body > section:not(#hero):not(#snapshot)')];
  const updateProgress=()=>{
    const h=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.width=(h>0 ? (window.scrollY/h)*100 : 0)+'%';
    let active=1;
    sections.forEach((s,i)=>{const r=s.getBoundingClientRect(); if(r.top < window.innerHeight*.45) active=i+1;});
    const out=document.getElementById('section-index-value'); if(out) out.textContent=String(active).padStart(2,'0');
  };
  window.addEventListener('scroll',updateProgress,{passive:true}); window.addEventListener('resize',updateProgress); updateProgress();

  const stage=document.getElementById('sih-stage');
  if(stage){
    const asm=stage.querySelector('.sih-assembly'); const label=document.getElementById('sih-mode-label'); const copy=document.getElementById('sih-mode-copy');
    const modes={
      cad:['PARAMETRIC CAD','Fusion 360 · mechanical assembly concept','translate(-50%,-46%) rotateX(58deg) rotateZ(-9deg)'],
      generative:['GENERATIVE DESIGN','load paths · lightweight geometry study','translate(-50%,-46%) rotateX(58deg) rotateZ(6deg) scale(.92)'],
      fea:['STRUCTURAL FEA','load path visualization · illustrative contour','translate(-50%,-46%) rotateX(58deg) rotateZ(-16deg) scale(1.03)'],
      dfam:['DFAM / FDM','print-aware geometry · 0.25× prototype workflow','translate(-50%,-46%) rotateX(58deg) rotateZ(14deg) scale(.86)']
    };
    document.querySelectorAll('[data-sih-mode]').forEach(btn=>btn.addEventListener('click',()=>{
      const m=modes[btn.dataset.sihMode]; document.querySelectorAll('[data-sih-mode]').forEach(b=>b.classList.toggle('active',b===btn));
      label.textContent=m[0]; copy.textContent=m[1]; asm.style.transform=m[2]; stage.dataset.mode=btn.dataset.sihMode;
    }));
    let down=false,lastX=0; stage.addEventListener('pointerdown',e=>{down=true;lastX=e.clientX;stage.setPointerCapture?.(e.pointerId)});
    stage.addEventListener('pointermove',e=>{if(!down)return; const d=e.clientX-lastX; lastX=e.clientX; asm.style.transform += ` rotateY(${d*.25}deg)`});
    stage.addEventListener('pointerup',()=>down=false); stage.addEventListener('pointercancel',()=>down=false);
  }

  const canvas=document.getElementById('amr-canvas');
  if(canvas){
    const ctx=canvas.getContext('2d'); const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scenarioOut=document.getElementById('amr-scenario'); const transportOut=document.getElementById('amr-transport');
    let scenario='normal',t=0,raf,active=true;
    const visibility=new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active&&!raf)draw();},{threshold:.05});
    visibility.observe(canvas);
    const robots=[{x:.18,y:.72,tx:.72,ty:.25,phase:0},{x:.32,y:.25,tx:.82,ty:.72,phase:1.3},{x:.72,y:.72,tx:.25,ty:.25,phase:2.2},{x:.82,y:.25,tx:.18,ty:.72,phase:3.4}];
    function resize(){const r=canvas.getBoundingClientRect(),d=devicePixelRatio||1;canvas.width=r.width*d;canvas.height=r.height*d;ctx.setTransform(d,0,0,d,0,0);canvas._w=r.width;canvas._h=r.height}
    window.addEventListener('resize',resize); resize();
    document.querySelectorAll('[data-amr-scenario]').forEach(btn=>btn.addEventListener('click',()=>{scenario=btn.dataset.amrScenario;document.querySelectorAll('[data-amr-scenario]').forEach(b=>b.classList.toggle('active',b===btn));scenarioOut.textContent=scenario.replace('_',' ').toUpperCase();transportOut.textContent=scenario==='comm_loss'?'UDP / LOSS':'UDP';}));
    function path(){ctx.strokeStyle='rgba(148,163,184,.08)';ctx.lineWidth=1;for(let x=30;x<canvas._w;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas._h);ctx.stroke()}for(let y=20;y<canvas._h;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas._w,y);ctx.stroke()}ctx.strokeStyle='rgba(245,166,35,.13)';ctx.lineWidth=2;ctx.strokeRect(canvas._w*.08,canvas._h*.12,canvas._w*.84,canvas._h*.76)}
    function drawRobot(x,y,i,failed){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*.9+i)*.05);ctx.fillStyle=failed?'#ff7b72':'#63e6be';ctx.shadowColor=failed?'rgba(255,123,114,.4)':'rgba(99,230,190,.4)';ctx.shadowBlur=14;ctx.beginPath();ctx.roundRect(-9,-7,18,14,4);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#071019';ctx.fillRect(-4,-3,8,4);ctx.restore()}
    function draw(){if(!active){raf=0;return;}ctx.clearRect(0,0,canvas._w,canvas._h);path();const block=scenario==='blockage',stress=scenario==='stress',loss=scenario==='comm_loss',failure=scenario==='failure';robots.forEach((r,i)=>{let q=Math.min(1,(Math.sin(t*.45+r.phase)+1)/2);let x=r.x+(r.tx-r.x)*q,y=r.y+(r.ty-r.y)*q;if(block && i===1){x=.49;y=.50} if(stress){x=.5+.34*Math.cos(t*1.4+r.phase);y=.5+.30*Math.sin(t*1.5+r.phase)} if(loss&&i%2===1 && Math.sin(t*2+i)<0){ctx.globalAlpha=.28} drawRobot(x*canvas._w,y*canvas._h,i,failure&&i===2);ctx.globalAlpha=1;if(loss&&i%2===1){ctx.strokeStyle='rgba(245,166,35,.18)';ctx.setLineDash([3,5]);ctx.beginPath();ctx.moveTo(x*canvas._w,y*canvas._h);ctx.lineTo(canvas._w*.5,canvas._h*.5);ctx.stroke();ctx.setLineDash([])}});ctx.fillStyle='rgba(148,163,184,.55)';ctx.font='9px monospace';ctx.fillText('MULTI-PROCESS EDGE SIMULATION',14,canvas._h-12);t+=reduced?0:.016;raf=requestAnimationFrame(draw)} draw();
  }
})();


/* ========================= V4 — SCROLL STORY + MICRO-INTERACTIONS ========================= */
(function(){
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const steps=[...document.querySelectorAll('[data-reel-step]')];
  const dots=[...document.querySelectorAll('.reel-dot')];
  const image=document.getElementById('reel-image');
  const kicker=document.getElementById('reel-kicker');
  const counter=document.getElementById('reel-counter');
  const title=document.getElementById('reel-title');
  const subtitle=document.getElementById('reel-subtitle');
  const metric=document.getElementById('reel-metric-value');
  const metricLabel=document.getElementById('reel-metric-label');
  if(!steps.length||!image)return;
  const data=[
    {img:'assets/engineering/bevpl/ansys-deformation.jpg',alt:'ANSYS thermal-structural result for pressure-vessel shell',kicker:'CASE 01 · CAE',title:'Welding distortion',subtitle:'Thermal-structural simulation',metric:'80.6%',label:'reported baseline agreement'},
    {img:'assets/engineering/safesense/validation-chart.png',alt:'SafeSense 3D scenario validation chart',kicker:'CASE 02 · SAFETY',title:'Adaptive safety',subtitle:'Uncertainty-aware digital twin',metric:'d_safe',label:'stopping + reaction + uncertainty'},
    {img:'assets/engineering/bevpl/vessel-cad.png',alt:'Engineering CAD model used as visual reference',kicker:'CASE 03 · EDGE',title:'OILIQ',subtitle:'Local equipment health state',metric:'<5 ms',label:'reported classification path'}
  ];
  let current=0, lock=false;
  function setReel(i,animate=true){
    i=Math.max(0,Math.min(data.length-1,i)); current=i;
    steps.forEach((s,n)=>s.classList.toggle('active',n===i)); dots.forEach((d,n)=>{d.classList.toggle('active',n===i);d.setAttribute('aria-current',n===i?'true':'false')});
    const d=data[i];
    if(animate&&!reduce){image.classList.add('reel-image-enter');setTimeout(()=>{image.src=d.img;image.alt=d.alt;kicker.textContent=d.kicker;counter.textContent=`0${i+1} / 03`;title.textContent=d.title;subtitle.textContent=d.subtitle;metric.textContent=d.metric;metricLabel.textContent=d.label;requestAnimationFrame(()=>image.classList.remove('reel-image-enter'))},160)}
    else{image.src=d.img;image.alt=d.alt;kicker.textContent=d.kicker;counter.textContent=`0${i+1} / 03`;title.textContent=d.title;subtitle.textContent=d.subtitle;metric.textContent=d.metric;metricLabel.textContent=d.label}
  }
  dots.forEach((d,i)=>d.addEventListener('click',()=>setReel(i)));
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting&&!lock){const i=steps.indexOf(e.target);if(i>=0)setReel(i)}}),{rootMargin:'-35% 0px -45% 0px',threshold:0});
  steps.forEach(s=>obs.observe(s));
  window.addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select'))return;if(e.key==='1')setReel(0);if(e.key==='2')setReel(1);if(e.key==='3')setReel(2)});
  setReel(0,false);
})();

(function(){
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce)return;
  const targets=document.querySelectorAll('.project-card,.case-card,.achievement-card,.contact-card,.lab-panel');
  targets.forEach(el=>el.addEventListener('pointermove',e=>{
    const r=el.getBoundingClientRect();
    el.style.setProperty('--mx',`${e.clientX-r.left}px`);el.style.setProperty('--my',`${e.clientY-r.top}px`);
  }));
  document.querySelectorAll('.image-depth').forEach(card=>card.addEventListener('pointermove',e=>{
    const img=card.querySelector('img');if(!img)return;const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    img.style.transform=`translate(${x*5}px,${y*5}px) scale(1.025) rotateY(${x*2.5}deg) rotateX(${-y*2.5}deg)`;
  }));
  document.querySelectorAll('.image-depth').forEach(card=>card.addEventListener('pointerleave',()=>{const img=card.querySelector('img');if(img)img.style.transform='translateZ(0) scale(1.001)'}));
})();


/* ========================= V5 — REAL AMR ASSET INTERACTION ========================= */
(function(){
  const img=document.getElementById('amr-v5-image'); if(!img)return;
  const label=document.getElementById('amr-v5-view-label'),copy=document.getElementById('amr-v5-copy');
  const views={
    cad:{src:'assets/engineering/amr/hero-amr-transparent.png',label:'PARAMETRIC CAD',copy:'The actual AMR assembly from the SIH project: a modular mobile platform with the robotic arm and end-effector mounted as one system.'},
    generative:{src:'assets/engineering/amr/image10.png',label:'GENERATIVE DESIGN',copy:'The project’s Fusion 360 generative-design evidence, showing the geometry study used to reduce mass while retaining the required structural interfaces.'},
    fea:{src:'assets/engineering/amr/image8.png',label:'STRUCTURAL FEA',copy:'Fusion validation evidence from the project. Reported values include a 490.5 N load, 0.381 mm displacement and a 2.312 safety factor.'},
    prototype:{src:'assets/engineering/amr/image11.webp',label:'PHYSICAL PROTOTYPE',copy:'A physical build from the project, connecting the digital CAD workflow to a manufactured AMR assembly rather than a purely conceptual render.'}
  };
  document.querySelectorAll('[data-amr-view]').forEach(b=>b.addEventListener('click',()=>{const v=views[b.dataset.amrView];document.querySelectorAll('[data-amr-view]').forEach(x=>x.classList.toggle('active',x===b));img.style.opacity='.15';setTimeout(()=>{img.src=v.src;label.textContent=v.label;copy.textContent=v.copy;img.style.opacity='1'},120)}));
})();

(function(){
  const canvas=document.getElementById('amr-v5-fleet-canvas'); if(!canvas)return;
  const ctx=canvas.getContext('2d'), reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const state=document.getElementById('amr-v5-fleet-state'),transport=document.getElementById('amr-v5-transport');
  const robotImg=new Image(); robotImg.src='assets/engineering/amr/hero-amr-transparent.png';
  let scenario='normal',t=0,active=true,raf=0;
  const robots=[{x:.17,y:.72,tx:.73,ty:.25,p:0},{x:.31,y:.25,tx:.83,ty:.72,p:1.3},{x:.72,y:.72,tx:.25,ty:.25,p:2.2},{x:.83,y:.25,tx:.17,ty:.72,p:3.4}];
  const visibility=new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active&&!raf)draw();},{threshold:.05});
  visibility.observe(canvas);
  function resize(){const r=canvas.getBoundingClientRect(),d=devicePixelRatio||1;canvas.width=r.width*d;canvas.height=r.height*d;ctx.setTransform(d,0,0,d,0,0);canvas._w=r.width;canvas._h=r.height} window.addEventListener('resize',resize);resize();
  document.querySelectorAll('[data-v5-scenario]').forEach(b=>b.addEventListener('click',()=>{scenario=b.dataset.v5Scenario;document.querySelectorAll('[data-v5-scenario]').forEach(x=>x.classList.toggle('active',x===b));state.textContent=b.textContent;transport.textContent=scenario==='comm_loss'?'JSON / UDP / LOSS':'JSON / UDP'}));
  function grid(){ctx.clearRect(0,0,canvas._w,canvas._h);ctx.fillStyle='#050b11';ctx.fillRect(0,0,canvas._w,canvas._h);ctx.strokeStyle='rgba(148,163,184,.055)';ctx.lineWidth=1;for(let x=0;x<canvas._w;x+=34){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas._h);ctx.stroke()}for(let y=0;y<canvas._h;y+=34){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas._w,y);ctx.stroke()}ctx.strokeStyle='rgba(245,166,35,.12)';ctx.lineWidth=2;ctx.strokeRect(canvas._w*.08,canvas._h*.12,canvas._w*.84,canvas._h*.76);}
  function drawRobot(x,y,scale,failed){ctx.save();ctx.translate(x,y);ctx.globalAlpha=failed?.25:1;ctx.shadowColor=failed?'rgba(255,100,100,.35)':'rgba(245,166,35,.3)';ctx.shadowBlur=failed?16:10;if(robotImg.complete&&robotImg.naturalWidth){ctx.drawImage(robotImg,-34*scale,-34*scale,68*scale,68*scale)}else{ctx.fillStyle='#d99a2b';ctx.beginPath();ctx.roundRect(-15,-10,30,20,5);ctx.fill()}ctx.shadowBlur=0;ctx.restore();}
  function draw(){if(!active){raf=0;return;}grid();const block=scenario==='blockage',stress=scenario==='stress',loss=scenario==='comm_loss',failure=scenario==='failure';if(block){ctx.fillStyle='rgba(245,166,35,.16)';ctx.fillRect(canvas._w*.45,canvas._h*.38,canvas._w*.1,canvas._h*.24);ctx.fillStyle='#f5a623';ctx.font='10px ui-monospace,monospace';ctx.fillText('AISLE BLOCKAGE',canvas._w*.45,canvas._h*.35)}robots.forEach((r,i)=>{let q=(Math.sin(t*.45+r.p)+1)/2,x=r.x+(r.tx-r.x)*q,y=r.y+(r.ty-r.y)*q;if(block&&i===1){x=.49;y=.5}if(stress){x=.5+.34*Math.cos(t*1.2+r.p);y=.5+.3*Math.sin(t*1.35+r.p)}if(loss&&i%2===1&&Math.sin(t*2+i)<0){ctx.globalAlpha=.25}drawRobot(x*canvas._w,y*canvas._h,.75,failure&&i===2);ctx.globalAlpha=1;if(loss&&i%2===1){ctx.strokeStyle='rgba(245,166,35,.18)';ctx.setLineDash([4,7]);ctx.beginPath();ctx.moveTo(x*canvas._w,y*canvas._h);ctx.lineTo(canvas._w*.5,canvas._h*.5);ctx.stroke();ctx.setLineDash([])}});ctx.fillStyle='rgba(148,163,184,.55)';ctx.font='9px ui-monospace,monospace';ctx.fillText('ACTUAL AMR MODEL · FLEET SCENARIO VISUALIZATION',16,canvas._h-14);t+=reduce?0:.014;raf=requestAnimationFrame(draw)} robotImg.onload=()=>draw(); if(robotImg.complete)draw();
})();


/* ========================= V6 — HERO ARTIFACT + EVIDENCE SYNC ========================= */
(function(){
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const artifact=document.getElementById('hero-v6-artifact');
  const image=document.getElementById('hero-v6-image');
  const label=document.getElementById('hero-v6-stage-label');
  if(artifact&&image){
    if(!reduce){
      artifact.addEventListener('pointermove',e=>{
        const r=artifact.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        artifact.style.transform=`perspective(1200px) rotateY(${x*2.2}deg) rotateX(${-y*1.6}deg)`;
        image.style.transform=`translate(calc(-50% + ${x*10}px),calc(-50% + ${y*7}px)) scale(1.015)`;
      });
      artifact.addEventListener('pointerleave',()=>{artifact.style.transform='';image.style.transform='translate(-50%,-50%)'});
    }
    const heroViews={
      amr:{src:'assets/engineering/amr/hero-amr-transparent.png',label:'AMR · PARAMETRIC PLATFORM'},
      cae:{src:'assets/engineering/bevpl/ansys-contour.jpg',label:'BEVPL · THERMAL-STRUCTURAL FEA'},
      edge:{src:'assets/engineering/safesense/validation-chart.png',label:'SAFESENSE · VALIDATION STUDY'}
    };
    document.querySelectorAll('[data-hero-art]').forEach(btn=>btn.addEventListener('click',()=>{
      const v=heroViews[btn.dataset.heroArt]; if(!v)return;
      document.querySelectorAll('[data-hero-art]').forEach(b=>b.classList.toggle('active',b===btn));
      image.style.opacity='.12';
      setTimeout(()=>{image.src=v.src;label.textContent=v.label;image.style.opacity='1'},140);
    }));
  }
})();

(function(){
  const img=document.getElementById('amr-v5-image');
  if(!img)return;
  const label=document.getElementById('amr-v5-view-label');
  const copy=document.getElementById('amr-v5-copy');
  const title=document.getElementById('amr-v6-title');
  const proofKicker=document.getElementById('amr-v6-proof-kicker');
  const proofValue=document.getElementById('amr-v6-proof-value');
  const proofNote=document.getElementById('amr-v6-proof-note');
  const ratio=document.getElementById('amr-v6-image-ratio');
  const data={
    cad:{src:'assets/engineering/amr/hero-amr-transparent.png',label:'01 · PARAMETRIC CAD',title:'01 / Parametric CAD',copy:'The actual AMR assembly: a modular mobile platform with the robotic arm and end-effector mounted as one system.',proofKicker:'DIGITAL DESIGN',proofValue:'Fusion 360',proofNote:'Parametric assembly · modular architecture',detail:'Source evidence documents the Fusion 360 assembly workflow; no material / mesh / constraint claim is added here.',ratio:'1042 × 648 · 1.61:1'},
    generative:{src:'assets/engineering/amr/image7.png',label:'02 · GENERATIVE DESIGN',title:'02 / Generative Design',copy:'Fusion evidence showing the optimization workflow and the resulting base geometry used to target a 73.3% reduction in base mass.',proofKicker:'OPTIMIZATION',proofValue:'73.3% MASS REDUCTION',proofNote:'5.98 kg → 1.60 kg base mass study',detail:'Reported base-mass comparison: 5.98 kg → 1.60 kg. The portfolio does not infer additional setup parameters.',ratio:'1302 × 730 · 1.78:1'},
    fea:{src:'assets/engineering/amr/image8.png',label:'03 · STRUCTURAL FEA',title:'03 / Structural FEA',copy:'The project validation view records the structural result for the selected load case, with reported values of 490.5 N, 0.381 mm and a 2.312 safety factor.',proofKicker:'VALIDATION',proofValue:'SF 2.312',proofNote:'490.5 N applied load · 0.381 mm reported displacement',detail:'Reported Fusion result: 490.5 N applied load, 0.381 mm displacement and 2.312 safety factor. Material / mesh / constraint details are not stated in the current source.',ratio:'1910 × 807 · 2.37:1'},
    prototype:{src:'assets/engineering/amr/image11.webp',label:'04 · PHYSICAL PROTOTYPE',title:'04 / Physical Prototype',copy:'A physical build closes the loop from digital model and analysis to additive manufacturing and a tangible prototype.',proofKicker:'MANUFACTURING',proofValue:'0.25× FDM PROTOTYPE',proofNote:'Physical build · project validation',detail:'0.25× FDM prototype fabricated for physical validation; the current source does not claim a production-ready manufacturing process.',ratio:'880 × 1184 · 0.74:1'}
  };
  function setView(key){
    const v=data[key]; if(!v)return;
    document.querySelectorAll('[data-amr-view]').forEach(x=>x.classList.toggle('active',x.dataset.amrView===key));
    img.style.opacity='.08';
    setTimeout(()=>{img.src=v.src;label.textContent=v.label;title.textContent=v.title;copy.textContent=v.copy;proofKicker.textContent=v.proofKicker;proofValue.textContent=v.proofValue;proofNote.textContent=v.proofNote;const detail=document.getElementById('amr-v6-proof-detail');if(detail)detail.textContent=v.detail||'';ratio.textContent=v.ratio;img.style.opacity='1'},120);
  }
  document.querySelectorAll('[data-amr-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.amrView)));
  document.querySelectorAll('[data-evidence-step]').forEach(card=>card.addEventListener('click',()=>setView(card.dataset.evidenceStep)));
})();

/* ========================= V6.2 — ENGINEERING IN MOTION ========================= */
(function(){
  const section=document.getElementById('engineering-motion');
  if(!section)return;
  const img=document.getElementById('motion-image');
  const imgKicker=document.getElementById('motion-visual-kicker');
  const imgIndex=document.getElementById('motion-visual-index');
  const imgTitle=document.getElementById('motion-visual-title');
  const imgSubtitle=document.getElementById('motion-visual-subtitle');
  const stat=document.getElementById('motion-visual-stat');
  const statLabel=document.getElementById('motion-visual-stat-label');
  const oiliq=document.getElementById('motion-oiliq-visual');
  const cards=[...section.querySelectorAll('.motion-story-card')];
  const data={
    bevpl:{src:'assets/engineering/bevpl/ansys-contour.jpg',kicker:'CASE 01 · CAE',index:'01 / 03',title:'Welding distortion',subtitle:'THERMAL-STRUCTURAL SIMULATION',stat:'80.6%',statLabel:'REPORTED BASELINE AGREEMENT'},
    safesense:{src:'assets/engineering/safesense/validation-chart.png',kicker:'CASE 02 · SAFETY',index:'02 / 03',title:'Adaptive safety envelope',subtitle:'DETERMINISTIC PHYSICS SIMULATION',stat:'d_safe',statLabel:'STOP + REACTION + UNCERTAINTY'},
    oiliq:{src:'',kicker:'CASE 03 · SOFTWARE',index:'03 / 03',title:'Local condition decision',subtitle:'SOFTWARE-ONLY PROCESSING PIPELINE',stat:'<5 ms',statLabel:'REPORTED PROCESSING LATENCY'}
  };
  function activate(key){
    const d=data[key]; if(!d)return;
    cards.forEach(c=>c.classList.toggle('is-active',c.dataset.motion===key));
    img.style.opacity='.08';
    setTimeout(()=>{
      if(d.src){img.src=d.src;img.style.display='block';oiliq.classList.remove('active');}
      else{img.style.display='none';oiliq.classList.add('active');}
      imgKicker.textContent=d.kicker;imgIndex.textContent=d.index;imgTitle.textContent=d.title;imgSubtitle.textContent=d.subtitle;stat.textContent=d.stat;statLabel.textContent=d.statLabel;img.style.opacity='1';
    },120);
  }
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting)activate(entry.target.dataset.motion);});
    },{rootMargin:'-38% 0px -38% 0px',threshold:0});
    cards.forEach(c=>io.observe(c));
  }
})();
