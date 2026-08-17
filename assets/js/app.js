const defaults={settings:{whatsapp:'5511999999999',instagram:'https://instagram.com/',facebook:'https://facebook.com/',cnpj:'Não informado'},works:[
{id:'obra-1',title:'Residência contemporânea fictícia',desc:'Conceito visual demonstrativo com fachada moderna, iluminação arquitetônica e acabamento sofisticado.',cover:'assets/img/hero-stages/07-resultado-final.webp',gallery:['assets/img/hero-stages/07-resultado-final.webp']},
{id:'obra-2',title:'Projeto interno contemporâneo',desc:'Ambiente renovado com materiais de visual sofisticado e iluminação valorizada.',cover:'assets/img/hero-ejs.webp',gallery:['assets/img/hero-ejs.webp']},
{id:'obra-3',title:'Acabamentos e manutenção',desc:'Soluções sob medida para renovar, corrigir e finalizar ambientes.',cover:'assets/img/logo-ejs.webp',gallery:['assets/img/logo-ejs.webp']}
]};
function getData(){return {settings:{...defaults.settings,...JSON.parse(localStorage.getItem('ejsSettings')||'{}')},works:JSON.parse(localStorage.getItem('ejsWorks')||'null')||defaults.works}}
const data=getData();

// Apresentação progressiva: cada recorte entra girando da esquerda para a direita.
// Os recortes já formam uma única imagem panorâmica; os anteriores permanecem visíveis.
const buildPanels=[...document.querySelectorAll('.build-panel')];
const buildPause=document.getElementById('buildPause');
const buildNext=document.getElementById('buildNext');
const buildRestart=document.getElementById('buildRestart');
const buildCarousel=document.getElementById('buildCarousel');
const buildFinalMessage=document.getElementById('buildFinalMessage');
let buildVisible=0;
let buildPlaying=true;
let buildTimer=null;
const BUILD_DELAY=820;

function preloadBuildImages(){
  buildPanels.forEach(panel=>{
    const img=panel.querySelector('img');
    const ready=()=>panel.classList.add('image-ready');
    if(img.complete&&img.naturalWidth>0) ready();
    else {
      img.addEventListener('load',ready,{once:true});
      img.addEventListener('error',()=>panel.classList.remove('image-ready'),{once:true});
    }
  });
}
function clearBuildTimer(){clearTimeout(buildTimer);buildTimer=null;}
function scheduleBuild(){
  clearBuildTimer();
  if(!buildPlaying||buildVisible>=buildPanels.length)return;
  buildTimer=setTimeout(()=>revealNextPanel(),BUILD_DELAY);
}
function showBuildFinalMessage(){
  buildCarousel?.classList.add('is-complete');
  if(buildFinalMessage){
    buildFinalMessage.classList.add('show');
    buildFinalMessage.setAttribute('aria-hidden','false');
  }
}
function hideBuildFinalMessage(){
  buildCarousel?.classList.remove('is-complete');
  if(buildFinalMessage){
    buildFinalMessage.classList.remove('show');
    buildFinalMessage.setAttribute('aria-hidden','true');
  }
}
function revealNextPanel(){
  if(buildVisible>=buildPanels.length){clearBuildTimer();showBuildFinalMessage();return;}
  const panel=buildPanels[buildVisible];
  panel.classList.add('visible','turning-in');
  window.setTimeout(()=>panel.classList.remove('turning-in'),700);
  buildVisible++;
  if(buildVisible>=buildPanels.length){
    clearBuildTimer();
    window.setTimeout(showBuildFinalMessage,420);
    return;
  }
  scheduleBuild();
}
function restartBuild(){
  clearBuildTimer();
  hideBuildFinalMessage();
  buildPanels.forEach(panel=>panel.classList.remove('visible','turning-in'));
  buildVisible=0;
  buildPlaying=true;
  if(buildPause){buildPause.textContent='❚❚';buildPause.setAttribute('aria-label','Pausar apresentação');}
  // A primeira entra imediatamente e as demais entram em sequência.
  requestAnimationFrame(()=>revealNextPanel());
}
preloadBuildImages();
buildPause?.addEventListener('click',()=>{
  buildPlaying=!buildPlaying;
  buildPause.textContent=buildPlaying?'❚❚':'▶';
  buildPause.setAttribute('aria-label',buildPlaying?'Pausar apresentação':'Continuar apresentação');
  if(buildPlaying)scheduleBuild();else clearBuildTimer();
});
buildNext?.addEventListener('click',()=>{clearBuildTimer();revealNextPanel();});
buildRestart?.addEventListener('click',restartBuild);
document.getElementById('buildFinalClose')?.addEventListener('click',()=>{
  buildFinalMessage?.classList.remove('show');
  buildFinalMessage?.setAttribute('aria-hidden','true');
});
restartBuild();

const evolutionModal=document.getElementById('evolutionModal');
const openEvolution=document.getElementById('openEvolution');
const closeEvolution=document.getElementById('closeEvolution');
function setEvolution(open){
  if(!evolutionModal)return;
  evolutionModal.classList.toggle('open',open);
  evolutionModal.setAttribute('aria-hidden',String(!open));
  document.body.style.overflow=open?'hidden':'';
}
openEvolution?.addEventListener('click',()=>setEvolution(true));
closeEvolution?.addEventListener('click',()=>setEvolution(false));
evolutionModal?.addEventListener('click',e=>{if(e.target===evolutionModal)setEvolution(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')setEvolution(false)});

const menuToggle=document.getElementById('menuToggle'),menu=document.getElementById('menu');
menuToggle?.addEventListener('click',()=>{const o=menu.classList.toggle('open');menuToggle.setAttribute('aria-expanded',o)});
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));
function waLink(){const n=(data.settings.whatsapp||'').replace(/\D/g,'');const msg=encodeURIComponent('Olá! Gostaria de solicitar um orçamento com a EJS Empreiteira.');return `https://wa.me/${n}?text=${msg}`}
document.querySelectorAll('[data-whatsapp]').forEach(el=>el.addEventListener('click',()=>window.open(waLink(),'_blank')));
document.getElementById('menuInstagram').href=data.settings.instagram||'#';
document.getElementById('menuFacebook').href=data.settings.facebook||'#';
document.getElementById('footerWhatsapp').href=waLink();
document.getElementById('footerInstagram').href=data.settings.instagram||'#';
document.getElementById('footerCnpj').textContent='CNPJ: '+(data.settings.cnpj||'Não informado');
document.getElementById('year').textContent=new Date().getFullYear();

const carousel=document.getElementById('workCarousel'),dots=document.getElementById('carouselDots');
data.works.forEach((w,i)=>{const card=document.createElement('article');card.className='work-card';card.innerHTML=`<img src="${w.cover}" alt="${w.title}" loading="lazy" decoding="async"><div class="work-overlay"><div><h3>${w.title}</h3><p>${w.desc||''}</p><a href="obra.html?id=${encodeURIComponent(w.id)}">Ver mais</a></div></div>`;carousel.appendChild(card);const d=document.createElement('button');d.setAttribute('aria-label',`Ir para obra ${i+1}`);if(i===0)d.classList.add('active');d.onclick=()=>card.scrollIntoView({behavior:'smooth',inline:'start',block:'nearest'});dots.appendChild(d)});
document.getElementById('prevWork').onclick=()=>carousel.scrollBy({left:-carousel.clientWidth*.72,behavior:'smooth'});
document.getElementById('nextWork').onclick=()=>carousel.scrollBy({left:carousel.clientWidth*.72,behavior:'smooth'});
carousel.addEventListener('scroll',()=>{const idx=Math.round(carousel.scrollLeft/(carousel.scrollWidth/data.works.length));[...dots.children].forEach((d,i)=>d.classList.toggle('active',i===idx))});
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));


// V13 — portfólio com arraste natural, snap e leve giro 3D dos cards.
function updateWorkCardRotation(){
  if(!carousel) return;
  const center=carousel.scrollLeft + carousel.clientWidth/2;
  [...carousel.children].forEach(card=>{
    const cardCenter=card.offsetLeft + card.offsetWidth/2;
    const delta=(cardCenter-center)/Math.max(carousel.clientWidth,1);
    const rotate=Math.max(-9,Math.min(9,delta*13));
    const scale=1-Math.min(.035,Math.abs(delta)*.04);
    card.style.transform=`perspective(1100px) rotateY(${rotate}deg) scale(${scale})`;
  });
}
carousel?.addEventListener('scroll',()=>requestAnimationFrame(updateWorkCardRotation),{passive:true});
window.addEventListener('resize',updateWorkCardRotation,{passive:true});
requestAnimationFrame(updateWorkCardRotation);
