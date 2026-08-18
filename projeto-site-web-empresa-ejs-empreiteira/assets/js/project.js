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
    ? `<article class="project-media-slide project-video-slide" data-media-index="${i}"><span class="project-media-type">Vídeo</span><video src="${esc(m.src)}" controls playsinline preload="metadata" aria-label="Vídeo da obra ${esc(work.title)}"></video></article>`
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
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M20.5 11.6a8.4 8.4 0 0 1-12.4 7.4L3.5 20.2l1.2-4.4A8.4 8.4 0 1 1 20.5 11.6Z"/><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M8.1 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.9c.1.3.1.5-.1.7l-.7.8c-.2.2-.2.4 0 .7.7 1.2 1.7 2.2 3 2.9.3.2.5.1.7-.1l.9-1c.2-.2.4-.3.7-.2l1.9.9c.3.1.4.3.4.6 0 .5-.2 1.4-.8 2-.6.6-1.5.9-2.4.7-1.4-.2-3.3-1-5.2-2.7-2.1-1.9-3.2-4.2-3.5-5.7-.2-.8.1-1.7.7-2.3.5-.5 1.2-.8 1.9-.8Z"/></svg>
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
