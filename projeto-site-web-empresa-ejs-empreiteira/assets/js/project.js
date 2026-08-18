const fallback=[{id:'obra-1',title:'Residência contemporânea fictícia',desc:'Conceito visual demonstrativo com fachada moderna.',cover:'assets/img/hero-stages/07.webp',gallery:['assets/img/hero-stages/07.webp'],videos:[]}];

function esc(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

async function load(){
  let works=fallback, settings={cnpj:'não informado',whatsapp:'',instagram:''};
  try{const r=await fetch('/api/cms',{cache:'no-store'});if(r.ok){const d=await r.json();if(Array.isArray(d.works)&&d.works.length)works=d.works;settings=d.settings||settings;}}catch{}
  const id=new URLSearchParams(location.search).get('id');
  const work=works.find(w=>w.id===id)||works[0];
  document.title=`${work.title} | EJS Empreiteira`;
  const gallery=(work.gallery?.length?work.gallery:[work.cover]);
  const videos=Array.isArray(work.videos)?work.videos:[];
  const media=[...gallery.map(src=>({type:'image',src})),...videos.map(src=>({type:'video',src}))];
  const mediaHtml=media.map((m,i)=>m.type==='video'
    ? `<article class="project-media-slide" data-media-index="${i}"><video src="${esc(m.src)}" controls playsinline preload="metadata" aria-label="Vídeo da obra ${esc(work.title)}"></video></article>`
    : `<article class="project-media-slide" data-media-index="${i}"><img src="${esc(m.src)}" alt="${esc(work.title)}" loading="${i===0?'eager':'lazy'}"></article>`).join('');

  const wa=(settings.whatsapp||'').replace(/\D/g,'');
  const ig=settings.instagram||'#';
  document.getElementById('projectMain').innerHTML=`
    <section class="project-hero"><span class="eyebrow">OBRA EJS</span><h1>${esc(work.title)}</h1><p>${esc(work.desc||'')}</p></section>
    <section class="project-media-section" aria-label="Galeria da obra">
      <button class="project-media-btn prev" id="projectMediaPrev" type="button" aria-label="Mídia anterior">‹</button>
      <div class="project-media-track" id="projectMediaTrack">${mediaHtml}</div>
      <button class="project-media-btn next" id="projectMediaNext" type="button" aria-label="Próxima mídia">›</button>
      <div class="project-media-dots" id="projectMediaDots"></div>
    </section>
    <footer class="footer project-footer footer-centered">
      <div class="footer-brand footer-brand-centered"><img src="assets/img/logo-ejs.webp" alt="Logo EJS"><div><strong>EJS Empreiteira</strong><span>CNPJ: ${esc(settings.cnpj||'não informado')}</span><span>Mais de 6 anos de atuação</span></div></div>
      <nav class="footer-social footer-text-links" aria-label="Redes sociais">
        <a href="${wa?`https://wa.me/${wa}`:'#'}" target="_blank" rel="noopener">WhatsApp</a>
        <span aria-hidden="true">|</span>
        <a href="${esc(ig)}" target="_blank" rel="noopener">Instagram</a>
      </nav>
      <div class="footer-copy">© ${new Date().getFullYear()} EJS Empreiteira. Todos os direitos reservados.</div>
    </footer>
    <a class="floating-whatsapp" href="${wa?`https://wa.me/${wa}`:'#'}" target="_blank" rel="noopener" aria-label="Falar com a EJS pelo WhatsApp">
      <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M19.11 17.56c-.45-.23-2.67-1.32-3.08-1.47-.41-.15-.71-.23-1.01.23-.3.45-1.16 1.47-1.42 1.77-.26.3-.52.34-.97.11-.45-.23-1.9-.7-3.62-2.24-1.34-1.19-2.24-2.66-2.5-3.11-.26-.45-.03-.69.2-.92.2-.2.45-.52.67-.79.23-.26.3-.45.45-.75.15-.3.08-.56-.04-.79-.11-.23-1.01-2.44-1.38-3.34-.36-.87-.73-.75-1.01-.76h-.86c-.3 0-.79.11-1.2.56-.41.45-1.57 1.54-1.57 3.75s1.61 4.35 1.84 4.65c.23.3 3.17 4.84 7.68 6.79 1.07.46 1.91.74 2.56.95 1.08.34 2.06.29 2.84.18.87-.13 2.67-1.09 3.05-2.14.38-1.05.38-1.95.26-2.14-.11-.19-.41-.3-.86-.52Z"/><path fill="currentColor" d="M16.03 2.67c-7.35 0-13.32 5.97-13.32 13.32 0 2.35.61 4.64 1.77 6.65L2.6 29.5l7.02-1.84a13.3 13.3 0 0 0 6.4 1.63h.01c7.35 0 13.32-5.97 13.32-13.32S23.38 2.67 16.03 2.67Zm0 24.37h-.01a11.06 11.06 0 0 1-5.64-1.54l-.4-.24-4.17 1.09 1.11-4.06-.26-.42a11.04 11.04 0 1 1 9.37 5.17Z"/></svg>
    </a>`;

  const track=document.getElementById('projectMediaTrack');
  const dots=document.getElementById('projectMediaDots');
  const slides=[...track.children];
  let index=0;
  slides.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`Ver mídia ${i+1}`);b.onclick=()=>go(i);dots.appendChild(b);});
  const dotButtons=[...dots.children];
  function go(i){index=(i+slides.length)%slides.length;slides[index].scrollIntoView({behavior:'smooth',inline:'start',block:'nearest'});updateDots();}
  function updateDots(){dotButtons.forEach((d,i)=>d.classList.toggle('active',i===index));}
  document.getElementById('projectMediaPrev').onclick=()=>go(index-1);
  document.getElementById('projectMediaNext').onclick=()=>go(index+1);
  let scrollTimer;
  track.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{const w=track.clientWidth||1;index=Math.round(track.scrollLeft/w);updateDots();},80);},{passive:true});
  updateDots();
}
load();
