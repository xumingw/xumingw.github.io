/* ============================================================
   Mingwang Xu — Homepage  ·  behavior
   ============================================================ */
(async function(){
  const D = window.SITE_DATA, P = D.profile;
  const $ = s => document.querySelector(s);
  // Enable animated (hidden->shown) states only once JS is confirmed running.
  document.documentElement.classList.add('js-anim');
  const authors = p => {
    const equalCount = p.equalContribution || 0;
    const names = p.authors.map((a, i) => {
      const name = a===P.name ? `<span class="me">${a}</span>` : a;
      return i < equalCount ? `${name}<sup>*</sup>` : name;
    }).join(", ");
    return equalCount ? `${names} <span class="equal-note">* Equal contribution</span>` : names;
  };
  const METRICS = await loadMetrics();

  async function loadMetrics(){
    try{
      const res = await fetch("shared/metrics.json", { cache: "no-store" });
      if(!res.ok) throw new Error(`metrics ${res.status}`);
      const data = await res.json();
      return data && data.papers ? data : { papers: {} };
    }catch(_){
      return { papers: {} };
    }
  }

  function metricFor(p){
    return (p && p.id && METRICS.papers && METRICS.papers[p.id]) ? METRICS.papers[p.id] : {};
  }

  function compactNumber(n){
    if(typeof n !== "number" || !Number.isFinite(n)) return "";
    if(n >= 1000) return (n/1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/,"") + "k";
    return String(Math.round(n));
  }

  /* ---- sidebar ---- */
  if(P.photo){ $('#portrait').innerHTML = `<img src="${P.photo}" alt="${P.name}">`; }
  $('#m-name').textContent = P.name;
  $('#m-role').textContent = P.role;
  $('#m-aff').innerHTML = `${P.affiliation}<br>${P.advisor}`;
  $('#m-contact').innerHTML = D.social.map(s=>`<a href="${s.href}">${s.label}<span class="arr">↗</span></a>`).join("");

  /* ---- hero ---- */
  // split tagline-ish headline into animated words
  const headline = P.tagline;
  // emphasize key research phrases
  const emPhrases = ["vision-language-action models","video generation"];
  let hl = headline;
  emPhrases.forEach(ph=>{ hl = hl.replace(ph, `§${ph}§`); });
  const segs = hl.split("§");
  const h1 = $('#hero-h1');
  let wordIdx = 0;
  segs.forEach((seg,i)=>{
    if(!seg) return;
    const isEm = emPhrases.includes(seg);
    seg.split(/(\s+)/).forEach(tok=>{
      if(tok.trim()===""){ h1.appendChild(document.createTextNode(tok)); return; }
      const span = document.createElement('span');
      span.className = 'word' + (isEm ? ' em' : '');
      span.textContent = tok;
      span.style.transitionDelay = (wordIdx*55)+'ms';
      h1.appendChild(span);
      wordIdx++;
    });
  });
  // animate words in
  requestAnimationFrame(()=>{ setTimeout(()=>{ document.querySelectorAll('.hero h1 .word').forEach(w=>w.classList.add('in')); }, 120); });

  $('#hero-sub').textContent = P.about[0];

  /* ---- venue marquee ---- */
  const venues = [...new Set(D.publications.map(p=>`${p.venue} ${p.year}`))];
  const seq = venues.map(v=>`<span class="v">${v}</span>`).join("");
  $('#marquee-track').innerHTML = seq + seq; // duplicate for seamless loop

  /* ---- stats ---- */
  const pubCount = D.publications.length;
  const ccfa = D.publications.filter(p=>p.award==="CCF-A").length;
  let stars = D.publications.reduce((sum,p)=>sum + (metricFor(p).stars || 0), 0);
  if(!stars){
    D.publications.forEach(p=>{ const m=(p.award||"").match(/([\d.]+)k/i); if(m) stars=Math.max(stars, parseFloat(m[1])*1000); });
  }
  const statData = [
    { n: pubCount, suf:"+", t:"Publications" },
    { n: ccfa, suf:"", t:"CCF-A Papers" },
    { n: stars, suf:"", t:"GitHub Stars", k:true }
  ];
  $('#stats').innerHTML = statData.map((s,i)=>
    `<div class="stat"><div class="n" data-target="${s.n}" data-k="${s.k?1:0}" data-suf="${s.suf}">0</div><div class="t">${s.t}</div></div>`
  ).join("");

  function animateCount(el){
    const target = +el.dataset.target;
    const isK = el.dataset.k==="1";
    const suf = el.dataset.suf || "";
    const dur = 1300; const start = performance.now();
    function fmt(v){
      if(isK){ return (v/1000).toFixed(1).replace(/\.0$/,'')+'<span class="suf">k</span>'; }
      return Math.round(v)+(suf?`<span class="suf">${suf}</span>`:"");
    }
    function tick(now){
      const t = Math.min(1,(now-start)/dur);
      const e = 1-Math.pow(1-t,3);
      el.innerHTML = fmt(target*e);
      if(t<1) requestAnimationFrame(tick); else el.innerHTML = fmt(target);
    }
    requestAnimationFrame(tick);
  }
  let statsDone = false;
  function fireStats(){
    if(statsDone) return; statsDone = true;
    document.querySelectorAll('.stat .n').forEach(el=>animateCount(el));
  }

  /* ---- about ---- */
  const aboutRest = P.about.slice(1).map(p=>{
    // emphasize project names
    let t = p.replace(/(Hallo4|OpenHumanVid|WAM-Diff|Hallo)/g, '<span class="em">$1</span>');
    return `<p>${t}</p>`;
  }).join("");
  $('#about-body').innerHTML = `<p>${P.about[0]}</p>` + aboutRest;
  $('#about-interests').innerHTML = P.interests.map(i=>`<span>${i}</span>`).join("");

  /* ---- publications ---- */
  const pubs = D.publications;
  const years = [...new Set(pubs.map(p=>p.year))].sort((a,b)=>b-a);
  const linkOrder = [["arxiv","arXiv"],["code","Code"],["project","Project"],["video","Video"]];

  function badgeFor(p){
    if(!p.award) return "";
    if(/star/i.test(p.award) && metricFor(p).stars) return "";
    const isStar = /star/i.test(p.award);
    return `<span class="badge${isStar?' star':''}">${isStar?'★ ':''}${p.award}</span>`;
  }
  function metricBadgesFor(p){
    const m = metricFor(p);
    const badges = [];
    if(typeof m.citations === "number"){
      badges.push(`<span class="badge metric">${compactNumber(m.citations)} Citations</span>`);
    }
    if(typeof m.stars === "number"){
      badges.push(`<span class="badge star">★ ${compactNumber(m.stars)} GitHub Stars</span>`);
    }
    return badges.join("");
  }
  function linksFor(p){
    return linkOrder.filter(([k])=>p.links&&p.links[k]).map(([k,l])=>`<a href="${p.links[k]}" target="_blank" rel="noopener">${l}</a>`).join("");
  }

  // featured list removed — All Publications only
  let activeTopic="All", activeYear="All";
  function mkChip(text,kind){
    const b=document.createElement('button');
    b.className='chip'+(text==='All'?' active':''); b.textContent=text;
    b.dataset.kind=kind; b.dataset.val=text;
    b.addEventListener('click',()=>{
      if(kind==='topic') activeTopic=text; else activeYear=text;
      document.querySelectorAll(`.chip[data-kind="${kind}"]`).forEach(c=>c.classList.toggle('active',c.dataset.val===text));
      renderAll();
    });
    return b;
  }
  const tw=$('#topic-filters'), yw=$('#year-filters');
  ["All",...D.topics].forEach(t=>tw.appendChild(mkChip(t,'topic')));
  ["All",...years].forEach(y=>yw.appendChild(mkChip(String(y),'year')));

  function pubHTML(p){
    return `<article class="pub">
      <div class="ptop2"><span class="v">${p.venue} · ${p.year}</span>${badgeFor(p)}${metricBadgesFor(p)}</div>
      <div class="ptitle">${p.title}</div>
      <div class="authors">${authors(p)}</div>
      <div class="plinks">${linksFor(p)}</div>
    </article>`;
  }
  function renderAll(){
    const list=$('#pub-list');
    const f=pubs.filter(p=>(activeTopic==="All"||p.topics.includes(activeTopic))&&(activeYear==="All"||String(p.year)===activeYear));
    if(!f.length){ list.innerHTML=`<div class="pub-empty">No publications match this filter.</div>`; return; }
    const g={}; f.forEach(p=>{(g[p.year]=g[p.year]||[]).push(p);});
    list.innerHTML = Object.keys(g).sort((a,b)=>b-a).map(yr=>
      `<div class="pub-group"><div class="pub-year-label">${yr}</div>${g[yr].map(pubHTML).join("")}</div>`).join("");
  }
  renderAll();

  /* ---- awards ---- */
  $('#awards-list').innerHTML = D.awards.map(a=>
    `<div class="award-row"><div class="rtitle">${a.title}</div><div class="org">${a.note}</div></div>`).join("");

  /* ---- education / experience ---- */
  $('#edu-list').innerHTML = D.education.map(e=>
    `<div class="row"><div class="when">${e.period}</div><div class="rtitle">${e.title}</div><div class="rorg">${e.org}</div><div class="rnote">${e.note}</div></div>`).join("");
  $('#exp-list').innerHTML = D.experience.map(e=>
    `<div class="row"><div class="when">${e.period}</div><div class="rtitle">${e.title}</div><div class="rorg">${e.org}</div><div class="rnote">${e.note}</div></div>`).join("");

  /* ---- contact ---- */
  $('#m-email').textContent = P.email;
  $('#m-email').href = "mailto:"+P.email;
  $('#m-flinks').innerHTML = D.social.filter(s=>s.label!=="Email").map(s=>`<a href="${s.href}" target="_blank" rel="noopener">${s.label}</a>`).join("");

  /* ---- scroll progress ---- */
  const prog = $('#progress');
  function onScroll(){
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (h>0 ? (scrollY/h*100) : 0) + "%";
  }
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* ---- scroll-spy nav (scroll-position based, no IO dependency) ---- */
  const links=[...document.querySelectorAll('nav.jump a')];
  const map={}; links.forEach(a=>{ map[a.getAttribute('href').slice(1)]=a; });
  const sections=[...document.querySelectorAll('main section[id]')];
  function updateSpy(){
    const mark = scrollY + innerHeight*0.32;
    let current = sections[0];
    for(const s of sections){ if(s.offsetTop <= mark) current = s; }
    links.forEach(l=>l.classList.remove('active'));
    if(current && map[current.id]) map[current.id].classList.add('active');
  }

  /* ---- reveal (scroll-position based + safety fallback) ---- */
  const revealEls = [...document.querySelectorAll('.reveal')];
  function revealCheck(){
    const trigger = scrollY + innerHeight*0.92;
    revealEls.forEach(el=>{
      if(!el.classList.contains('in') && el.offsetTop < trigger){
        el.classList.add('in');
        if(el.querySelector && el.querySelector('#stats')) fireStats();
      }
    });
    if(document.getElementById('stats') && scrollY + innerHeight > document.getElementById('stats').offsetTop) fireStats();
  }
  function onTick(){ revealCheck(); updateSpy(); onScroll(); }
  addEventListener('scroll', onTick, {passive:true});
  addEventListener('resize', onTick);
  updateSpy();
  // Defer the first reveal past a committed paint so the opacity transition
  // actually runs (adding .in in the same frame as first paint strands it at 0).
  requestAnimationFrame(()=>requestAnimationFrame(revealCheck));
  // Safety net: nice transitions run in real browsers during the first moment;
  // after that, hard-force static visible styles (transition/animation cleared,
  // opacity:1) which provably computes to 1 in any engine -> never blank.
  setTimeout(()=>{
    fireStats();
    const force = el=>{ el.style.transition='none'; el.style.animation='none'; el.style.opacity='1'; el.style.transform='none'; };
    revealEls.forEach(force);
    document.querySelectorAll('.hero h1 .word').forEach(force);
    // guarantee final stat values even if rAF count-up never ran
    document.querySelectorAll('.stat .n').forEach(el=>{
      const target=+el.dataset.target, isK=el.dataset.k==='1', suf=el.dataset.suf||'';
      el.innerHTML = isK
        ? (target/1000).toFixed(1).replace(/\.0$/,'')+'<span class="suf">k</span>'
        : Math.round(target)+(suf?'<span class="suf">'+suf+'</span>':'');
    });
    document.documentElement.classList.remove('js-anim');
  }, 1100);
})();
