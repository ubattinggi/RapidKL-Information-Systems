/* NEW interactive nav behavior + keep existing page interactions */
/* Overwrite scripts.js with this code. It adds the moving blob nav-track */
/* and keeps tabs, flip-cards, countups and recommendation builder working. */

document.addEventListener('DOMContentLoaded', function(){

  /* ---------- NAV moving blob and active link ---------- */
  (function navBlob(){
    const nav = document.querySelector('.fun-nav');
    if(!nav) return;
    const track = nav.querySelector('.nav-track');
    const links = Array.from(nav.querySelectorAll('.nav-link'));

    // helper: position blob under a link
    function moveBlobTo(link, instant){
      const r = link.getBoundingClientRect();
      const nr = nav.getBoundingClientRect();
      const left = r.left - nr.left;
      const width = r.width;
      track.style.transform = `translateX(${left}px)`;
      track.style.width = `${width}px`;
      if(instant) track.style.transition = 'none';
      else track.style.transition = 'all 280ms cubic-bezier(.2,.9,.22,1)';
      // set active class
      links.forEach(l=>l.classList.remove('active'));
      link.classList.add('active');
    }

    // initial activation: try to find link matching the current page filename
    const current = window.location.pathname.split('/').pop() || 'index.html';
    let startLink = links.find(l => l.getAttribute('href') === current) || links[0];
    // ensure track has size instantly
    requestAnimationFrame(()=> moveBlobTo(startLink, true));

    // move blob on hover and on focus for keyboard
    links.forEach(link=>{
      link.addEventListener('mouseenter', ()=> moveBlobTo(link,false));
      link.addEventListener('focus', ()=> moveBlobTo(link,false));
      // return to page link on mouseleave from nav
      nav.addEventListener('mouseleave', ()=> moveBlobTo(startLink,false));
      // clicking sets new "startLink" after short delay (for CSS click effect)
      link.addEventListener('click', (e)=>{
        startLink = link;
        setTimeout(()=> moveBlobTo(startLink,false), 100);
      });
    });

    // keyboard nav shortcuts: use number keys 1..6 to jump to pages quickly
    document.addEventListener('keydown', (e)=>{
      if(document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
      const key = e.key;
      if(key >= '1' && key <= '6'){
        const idx = Number(key)-1;
        if(links[idx]) links[idx].click();
      }
    });

    // responsive: reposition on resize
    window.addEventListener('resize', ()=> moveBlobTo(startLink,true));
  })();

  /* ---------- existing interactions: count-ups, tabs, decision toggle, rec builder, flip-cards ---------- */

  // small helper: count-up for elements with .count or .stat-num
  (function countUp(){
    document.querySelectorAll('.count, .stat-num').forEach(el=>{
      const target = +el.dataset.target || 0;
      let n = 0;
      const step = Math.max(1, Math.round(target / 60));
      const id = setInterval(()=>{
        n += step;
        if(n >= target){ n = target; clearInterval(id); }
        el.textContent = n;
      }, 16);
    });
  })();

  // tabs
  (function tabs(){
    document.querySelectorAll('.tab').forEach(btn=>{
      btn.addEventListener('click', ()=> {
        document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tc=>tc.classList.remove('active'));
        btn.classList.add('active');
        const id = btn.dataset.tab;
        const tabEl = document.getElementById(id);
        if(tabEl) tabEl.classList.add('active');
      });
    });
  })();

  // decision toggle (if present)
  (function decisionToggle(){
    const decOut = document.getElementById('decision-output');
    if(!decOut) return;
    document.querySelectorAll('input[name="level"]').forEach(r=>{
      r.addEventListener('change', ()=>{
        const v = document.querySelector('input[name="level"]:checked').value;
        if(v === 'operational'){
          decOut.querySelector('h4').textContent = 'Operational Decision';
          decOut.querySelector('p').textContent = 'Dispatch maintenance using the TPS fault alert — immediate action.';
        } else if(v === 'managerial'){
          decOut.querySelector('h4').textContent = 'Managerial Decision';
          decOut.querySelector('p').textContent = 'Adjust train frequency using MIS passenger load insights.';
        } else {
          decOut.querySelector('h4').textContent = 'Strategic Decision';
          decOut.querySelector('p').textContent = 'Plan 3-year investment in predictive maintenance & automation.';
        }
      });
    });
  })();

  // recommendation builder (if present)
  (function recBuilder(){
    const recOutput = document.getElementById('rec-output');
    if(!recOutput) return;
    function updateRecs(){
      const checked = Array.from(document.querySelectorAll('.recommendations input[type="checkbox"]:checked')).map(i=>i.dataset.key);
      const lines = [];
      if(checked.includes('security')){
        lines.push('<li>Run security audits, encrypt payment flows and enable monitoring/alerts.</li>');
      }
      if(checked.includes('integration')){
        lines.push('<li>Use middleware to phase legacy systems into ERP & BI; pilot one corridor first.</li>');
      }
      if(checked.includes('training')){
        lines.push('<li>Create micro-training modules and station pilots to boost adoption.</li>');
      }
      if(checked.includes('analytics')){
        lines.push('<li>Deploy BI dashboards for ops & maintenance with simple KPIs to start.</li>');
      }
      recOutput.innerHTML = lines.length ? '<ul>'+lines.join('')+'</ul>' : '<em>No priorities selected — toggle options above.</em>';
    }
    document.querySelectorAll('.recommendations input[type="checkbox"]').forEach(cb=>{
      cb.addEventListener('change', updateRecs);
    });
    updateRecs();
  })();

  // accessible flip-cards (keyboard)
  document.querySelectorAll('.flip-card').forEach(fc=>{
    fc.addEventListener('keydown', e=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        const inner = fc.querySelector('.flip-inner');
        if(inner.style.transform) inner.style.transform = '';
        else inner.style.transform = 'rotateY(180deg)';
      }
    });
  });

  // date for cover
  (function coverDate(){
    const el = document.getElementById('date');
    if(!el) return;
    const d = new Date();
    el.textContent = d.toLocaleDateString('en-GB');
  })();

});
