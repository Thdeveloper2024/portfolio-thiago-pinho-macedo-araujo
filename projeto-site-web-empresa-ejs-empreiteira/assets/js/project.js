const { getData, esc, initNavigation, waLink, whatsappIcon, uiIcon, getServices, serviceIcon } = window.EJSCommon;

function classifyMedia(slide, media, width, height) {
  if (!slide || !media || !width || !height) return;
  const ratio = width / height;
  let shape = 'square';
  if (ratio >= 2) shape = 'ultrawide';
  else if (ratio > 1.08) shape = 'landscape';
  else if (ratio < .62) shape = 'tall';
  else if (ratio < .92) shape = 'portrait';

  slide.dataset.mediaShape = shape;
  slide.dataset.mediaRatio = String(ratio);
  slide.classList.remove('media-landscape','media-portrait','media-square','media-ultrawide','media-tall');
  slide.classList.add(`media-${shape}`);

  if (media.tagName === 'IMG') {
    const src = media.currentSrc || media.src;
    if (src) {
      slide.classList.add('has-image-backdrop');
      slide.style.setProperty('--media-backdrop', `url("${String(src).replace(/"/g, '\\"')}")`);
    }
  }
  slide.dispatchEvent(new CustomEvent('ejsmediaclassified', { bubbles: true }));
}

function installMediaManipulator(slide, media) {
  if (!slide || !media) return;
  const apply = () => media.tagName === 'IMG'
    ? classifyMedia(slide, media, media.naturalWidth, media.naturalHeight)
    : classifyMedia(slide, media, media.videoWidth, media.videoHeight);
  if (media.tagName === 'IMG') {
    if (media.complete && media.naturalWidth) apply();
    else media.addEventListener('load', apply, { once: true });
  } else {
    if (media.readyState >= 1 && media.videoWidth) apply();
    else media.addEventListener('loadedmetadata', apply, { once: true });
  }
}

function fact(icon, label, value, extra = '') {
  if (!value) return '';
  return `<article class="project-fact-inline ${extra}"><span>${icon}</span><div><small>${label}</small><strong>${esc(value)}</strong></div></article>`;
}

function serviceSummaryHtml(work, settings) {
  const services = Array.isArray(work.services) ? work.services : [];
  const catalog = getServices(settings);
  return services.map(name => {
    const service = catalog.find(item => String(item.name).toLocaleLowerCase('pt-BR') === String(name).toLocaleLowerCase('pt-BR'));
    return `<span class="project-service-chip">${service ? serviceIcon(service, 'service-chip-svg') : uiIcon('tools','service-chip-svg')}<b>${esc(name)}</b></span>`;
  }).join('');
}

function footerHtml(data, work, whatsapp) {
  const services = getServices(data.settings).slice(0, 8);
  return `
    <footer class="site-footer project-site-footer">
    <section class="trust-strip footer-trust-strip" aria-label="Indicadores da EJS Empreiteira">
      <div class="container trust-grid">
        <article><span class="trust-icon">${uiIcon('users','trust-svg')}</span><div><strong id="completedProjectsCount">0+</strong><small>Obras entregues</small></div></article>
        <article><span class="trust-icon">${uiIcon('star','trust-svg')}</span><div><strong id="satisfactionRate">98%</strong><small>Clientes satisfeitos</small></div></article>
        <article><span class="trust-icon">${uiIcon('shield','trust-svg')}</span><div><strong id="experienceYears">6+</strong><small>Anos de experiência</small></div></article>
        <article><span class="trust-icon">${uiIcon('helmet','trust-svg')}</span><div><strong>100%</strong><small>Compromisso e qualidade</small></div></article>
      </div>
    </section>
      <div class="container footer-grid">
        <div class="footer-company"><a class="site-brand footer-logo" href="index.html"><img src="assets/img/logo-ejs.webp" alt="Logo EJS Empreiteira"><span><strong>EJS</strong><small>EMPREITEIRA</small></span></a><p>Construímos, reformamos e transformamos seu espaço com qualidade, organização e compromisso em cada detalhe.</p><span id="footerCnpj">CNPJ: ${esc(data.settings.cnpj || 'Não informado')}</span></div>
        <div class="footer-column"><strong>Navegação</strong><a href="index.html">Início</a><a href="obras.html">Obras</a><a href="index.html#servicos">Serviços</a><a href="index.html#depoimentos">Depoimentos</a></div>
        <div class="footer-column" id="footerServices"><strong>Serviços</strong>${services.map(s => `<span>${esc(s.name)}</span>`).join('')}</div>
        <div class="footer-column"><strong>Contato</strong><a id="footerWhatsapp" href="${whatsapp}" target="_blank" rel="noopener">WhatsApp</a><a id="footerInstagram" href="${esc(data.settings.instagram || '#')}" target="_blank" rel="noopener">Instagram</a></div>
      </div>
      <section class="contact-strip footer-contact-strip" id="contato">
        <div class="container contact-strip-grid">
          <a id="contactWhatsapp" href="${whatsapp}" target="_blank" rel="noopener"><span class="contact-circle contact-circle-wa">${whatsappIcon('assets')}</span><div><small>WhatsApp</small><strong id="contactWhatsappText">Fale conosco</strong><span>Resposta rápida</span></div></a>
          <div><span class="contact-circle">${uiIcon('phone','contact-svg')}</span><div><small>Telefone</small><strong id="contactPhone">${esc(data.settings.phone || 'Não informado')}</strong><span id="contactHours">${esc(data.settings.businessHours || 'Atendimento comercial')}</span></div></div>
          <div><span class="contact-circle">${uiIcon('location','contact-svg')}</span><div><small>Atendimento</small><strong id="contactArea">${esc(data.settings.serviceArea || 'São Paulo e Região')}</strong><span>Consulte disponibilidade</span></div></div>
          <a href="${whatsapp}" target="_blank" rel="noopener"><span class="contact-circle">${uiIcon('calendar','contact-svg')}</span><div><small>Orçamento</small><strong>Gratuito e sem compromisso</strong><span>Solicite agora</span></div></a>
        </div>
      </section>
      <div class="container footer-bottom">© ${new Date().getFullYear()} EJS Empreiteira. Todos os direitos reservados.</div>
    </footer>`;
}

async function loadProject() {
  const data = await getData();
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const work = data.works.find(item => item.id === id) || data.works[0];
  const main = document.getElementById('projectMain');

  if (!work) {
    main.innerHTML = `<section class="project-not-found"><h1>Obra não encontrada</h1><p>O projeto pode ter sido removido ou ainda não está disponível.</p><a class="btn btn-primary" href="obras.html">Voltar para obras</a></section>`;
    initNavigation(data.settings);
    return;
  }

  document.title = `${work.title} | EJS Empreiteira`;

  const gallery = (Array.isArray(work.gallery) && work.gallery.length ? work.gallery : [work.cover]).filter(Boolean);
  const videos = (Array.isArray(work.videos) ? work.videos : []).filter(Boolean);
  const mediaItems = [...gallery.map(src => ({ type: 'image', src })), ...videos.map(src => ({ type: 'video', src }))];
  const mediaHtml = mediaItems.map((item, index) => item.type === 'video'
    ? `<article class="project-media-slide project-video-slide" data-media-index="${index}"><span class="project-media-type">VÍDEO</span><video ${index === 0 ? `src="${esc(item.src)}"` : `data-src="${esc(item.src)}"`} controls playsinline preload="metadata" aria-label="Vídeo da obra ${esc(work.title)}"></video></article>`
    : `<article class="project-media-slide project-image-slide" data-media-index="${index}"><img ${index === 0 ? `src="${esc(item.src)}" fetchpriority="high"` : `data-src="${esc(item.src)}"`} alt="${esc(work.title)}" decoding="async"></article>`
  ).join('');

  const services = Array.isArray(work.services) ? work.services : [];
  const serviceSummary = services.length ? services.join(', ') : (work.category || 'Serviços EJS');
  const whatsapp = waLink(data.settings, `Olá! Gostaria de solicitar um orçamento e falar sobre o projeto "${work.title}".`);

  main.innerHTML = `
    <section class="project-showcase">
      <div class="container project-showcase-head"><h1>${esc(work.title)}</h1></div>
      <div class="container project-detail-grid">
        <div class="project-gallery-column">
          <section class="project-gallery-shell" id="projectGalleryShell" data-active-shape="landscape" aria-label="Galeria da obra">
            <div class="project-counter"><span id="projectCurrent">1</span> / <span>${Math.max(mediaItems.length, 1)}</span></div>
            <button class="project-media-btn prev" id="projectMediaPrev" type="button" aria-label="Mídia anterior">‹</button>
            <div class="project-media-track" id="projectMediaTrack">${mediaHtml || `<article class="project-media-slide media-square"><img src="assets/img/logo-ejs.webp" alt="EJS Empreiteira"></article>`}</div>
            <button class="project-media-btn next" id="projectMediaNext" type="button" aria-label="Próxima mídia">›</button>
          </section>
          <div class="project-media-dots" id="projectMediaDots"></div>
        </div>

        <aside class="project-info-panel">
          <div class="project-about-copy"><span class="section-kicker">Sobre o projeto</span><h2>${esc(work.title)}</h2><p>${esc(work.desc || 'Projeto executado pela EJS Empreiteira.')}</p></div>
          <div class="project-facts-stack">
            ${fact(uiIcon('location','fact-svg'), 'Endereço / localização', work.location)}
            ${fact(uiIcon('time','fact-svg'), 'Prazo', work.duration)}
            ${fact(uiIcon('area','fact-svg'), 'Área', work.area)}
            ${fact(uiIcon('calendar','fact-svg'), 'Ano', work.year)}
            ${fact(uiIcon('status','fact-svg'), 'Status', work.status)}
            ${fact(uiIcon('home','fact-svg'), 'Tipo de projeto', work.type)}
            ${fact(uiIcon('tools','fact-svg'), 'Serviços', serviceSummary, 'project-services-fact')}
          </div>
          ${services.length ? `<div class="project-service-tags">${serviceSummaryHtml(work, data.settings)}</div>` : ''}
          <div class="project-inline-actions">
            <a class="btn project-wa-button" href="${whatsapp}" target="_blank" rel="noopener">${whatsappIcon('assets')}<span><strong>WhatsApp</strong><small>Fale com a EJS</small></span></a>
            <a class="btn btn-primary project-budget-button" href="${whatsapp}" target="_blank" rel="noopener">${uiIcon('calendar','budget-svg')}<span><strong>Orçamento</strong><small>Gratuito e rápido</small></span></a>
          </div>
        </aside>
      </div>
    </section>

    <section class="project-more-section"><div class="container project-more-grid"><div><span class="section-kicker">EJS Empreiteira</span><h2>Quer transformar seu espaço?</h2><p>Conte o que precisa e receba orientação para sua obra, reforma ou manutenção.</p></div><div class="project-more-actions"><a class="btn btn-primary" href="${whatsapp}" target="_blank" rel="noopener">${uiIcon('calendar','button-svg')} Solicitar orçamento</a><a class="btn btn-secondary" href="obras.html">Ver outras obras</a></div></div></section>

    ${footerHtml(data, work, whatsapp)}
    <a class="floating-whatsapp" href="${whatsapp}" target="_blank" rel="noopener" aria-label="Falar com a EJS pelo WhatsApp">${whatsappIcon('assets')}</a>
    <div class="mobile-bottom-cta"><a class="mobile-wa" href="${whatsapp}" target="_blank" rel="noopener">${whatsappIcon('assets')} WhatsApp</a><a class="mobile-budget" href="${whatsapp}" target="_blank" rel="noopener">${uiIcon('calendar','mobile-cta-svg')} Orçamento</a></div>`;

  initNavigation(data.settings);

  const track = document.getElementById('projectMediaTrack');
  const galleryShell = document.getElementById('projectGalleryShell');
  const slides = [...track.children];
  const dots = document.getElementById('projectMediaDots');
  const current = document.getElementById('projectCurrent');
  let index = 0;

  function prepareSlide(i) {
    if (i < 0 || i >= slides.length) return;
    const slide = slides[i];
    const media = slide.querySelector('img,video');
    if (!media) return;
    if (media.dataset.src) {
      media.src = media.dataset.src;
      media.removeAttribute('data-src');
      if (media.tagName === 'VIDEO') media.load();
    }
    if (!slide.dataset.manipulatorInstalled) {
      installMediaManipulator(slide, media);
      slide.dataset.manipulatorInstalled = '1';
    }
  }

  function hydrate(i) { [i - 1, i, i + 1].forEach(prepareSlide); }

  slides.forEach((_, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Ver mídia ${i + 1}`);
    button.addEventListener('click', () => go(i));
    dots.appendChild(button);
  });
  const dotButtons = [...dots.children];

  function update() {
    dotButtons.forEach((dot, i) => dot.classList.toggle('active', i === index));
    if (current) current.textContent = String(index + 1);
    const slide = slides[index];
    if (slide) galleryShell.dataset.activeShape = slide.dataset.mediaShape || 'landscape';
  }

  function go(nextIndex) {
    if (!slides.length) return;
    index = (nextIndex + slides.length) % slides.length;
    hydrate(index);
    track.scrollTo({ left: track.clientWidth * index, behavior: 'smooth' });
    update();
  }

  document.getElementById('projectMediaPrev')?.addEventListener('click', () => go(index - 1));
  document.getElementById('projectMediaNext')?.addEventListener('click', () => go(index + 1));
  galleryShell.addEventListener('ejsmediaclassified', event => { if (event.target === slides[index]) update(); });

  let scrollTimer;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const width = track.clientWidth || 1;
      index = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / width)));
      hydrate(index);
      update();
    }, 90);
  }, { passive: true });

  window.addEventListener('resize', () => { track.scrollLeft = track.clientWidth * index; }, { passive: true });
  hydrate(0);
  update();
}

loadProject();
