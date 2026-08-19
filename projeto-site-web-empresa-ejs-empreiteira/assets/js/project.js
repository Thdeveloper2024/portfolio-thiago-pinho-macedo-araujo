const { getData, esc, initNavigation, waLink, whatsappIcon } = window.EJSCommon;

function classifyMedia(slide, media, width, height) {
  if (!slide || !media || !width || !height) return;
  const ratio = width / height;
  let shape = 'square';
  if (ratio >= 2) shape = 'ultrawide';
  else if (ratio > 1.08) shape = 'landscape';
  else if (ratio < 0.62) shape = 'tall';
  else if (ratio < 0.92) shape = 'portrait';

  slide.classList.remove('media-landscape', 'media-portrait', 'media-square', 'media-ultrawide', 'media-tall');
  slide.classList.add(`media-${shape}`);
  slide.dataset.mediaShape = shape;
  slide.dataset.mediaRatio = String(ratio);

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
  const apply = () => {
    if (media.tagName === 'IMG') classifyMedia(slide, media, media.naturalWidth, media.naturalHeight);
    else classifyMedia(slide, media, media.videoWidth, media.videoHeight);
  };

  if (media.tagName === 'IMG') {
    if (media.complete && media.naturalWidth) apply();
    else media.addEventListener('load', apply, { once: true });
  } else {
    if (media.readyState >= 1 && media.videoWidth) apply();
    else media.addEventListener('loadedmetadata', apply, { once: true });
  }
}

function fact(icon, label, value, extraClass = '') {
  if (!value) return '';
  return `<article class="project-fact-inline ${extraClass}"><span>${icon}</span><div><small>${label}</small><strong>${esc(value)}</strong></div></article>`;
}

async function loadProject() {
  const data = await getData();
  initNavigation(data.settings);

  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const work = data.works.find(item => item.id === id) || data.works[0];
  const main = document.getElementById('projectMain');

  if (!work) {
    main.innerHTML = `<section class="project-not-found"><h1>Obra não encontrada</h1><p>O projeto pode ter sido removido ou ainda não está disponível.</p><a class="btn btn-primary" href="obras.html">Voltar para obras</a></section>`;
    return;
  }

  document.title = `${work.title} | EJS Empreiteira`;

  const gallery = (Array.isArray(work.gallery) && work.gallery.length ? work.gallery : [work.cover]).filter(Boolean);
  const videos = (Array.isArray(work.videos) ? work.videos : []).filter(Boolean);
  const mediaItems = [
    ...gallery.map(src => ({ type: 'image', src })),
    ...videos.map(src => ({ type: 'video', src }))
  ];

  const mediaHtml = mediaItems.map((item, index) => item.type === 'video'
    ? `<article class="project-media-slide project-video-slide" data-media-index="${index}"><span class="project-media-type">VÍDEO</span><video ${index === 0 ? `src="${esc(item.src)}"` : `data-src="${esc(item.src)}"`} controls playsinline preload="metadata" aria-label="Vídeo da obra ${esc(work.title)}"></video></article>`
    : `<article class="project-media-slide project-image-slide" data-media-index="${index}"><img ${index === 0 ? `src="${esc(item.src)}" fetchpriority="high"` : `data-src="${esc(item.src)}"`} alt="${esc(work.title)}" decoding="async"></article>`
  ).join('');

  const services = Array.isArray(work.services) ? work.services : [];
  const whatsapp = waLink(data.settings, `Olá! Gostaria de solicitar um orçamento e falar sobre o projeto "${work.title}".`);
  const serviceSummary = services.length ? services.join(', ') : (work.category || 'Serviços EJS');

  main.innerHTML = `
    <section class="project-showcase">
      <div class="container project-showcase-head">
        <div class="breadcrumbs project-breadcrumbs"><a href="index.html">Início</a><span>›</span><a href="obras.html">Obras</a><span>›</span><strong>${esc(work.title)}</strong></div>
        <span class="section-kicker">${work.featured ? 'Obra em destaque' : esc(work.category || 'Projeto EJS')}</span>
        <h1>${esc(work.title)}</h1>
        <div class="project-location-line">${work.location ? `<span>⌖ ${esc(work.location)}</span>` : ''}${work.type ? `<span>• ${esc(work.type)}</span>` : ''}</div>
      </div>

      <div class="container project-gallery-wrap">
        <section class="project-gallery-shell" id="projectGalleryShell" data-active-shape="landscape" aria-label="Galeria da obra">
          <div class="project-counter"><span id="projectCurrent">1</span> / <span>${Math.max(mediaItems.length, 1)}</span></div>
          <button class="project-media-btn prev" id="projectMediaPrev" type="button" aria-label="Mídia anterior">‹</button>
          <div class="project-media-track" id="projectMediaTrack">${mediaHtml || `<article class="project-media-slide media-square"><img src="assets/img/logo-ejs.webp" alt="EJS Empreiteira"></article>`}</div>
          <button class="project-media-btn next" id="projectMediaNext" type="button" aria-label="Próxima mídia">›</button>
        </section>
        <div class="project-media-dots" id="projectMediaDots"></div>
      </div>

      <div class="container project-info-panel">
        <div class="project-about-copy">
          <span class="section-kicker">Sobre o projeto</span>
          <h2>${esc(work.title)}</h2>
          <p>${esc(work.desc || 'Projeto executado pela EJS Empreiteira.')}</p>
        </div>

        <div class="project-facts-inline">
          ${fact('▣', 'Prazo', work.duration)}
          ${fact('▥', 'Área', work.area)}
          ${fact('⚒', 'Serviços', serviceSummary, 'project-services-fact')}
        </div>

        <div class="project-extra-meta">
          ${work.year ? `<span><small>Ano</small><strong>${esc(work.year)}</strong></span>` : ''}
          ${work.status ? `<span><small>Status</small><strong>${esc(work.status)}</strong></span>` : ''}
          ${work.type ? `<span><small>Tipo</small><strong>${esc(work.type)}</strong></span>` : ''}
        </div>

        ${services.length ? `<div class="project-service-tags">${services.map(service => `<span>${esc(service)}</span>`).join('')}</div>` : ''}

        <div class="project-inline-actions">
          <a class="btn project-wa-button" href="${whatsapp}" target="_blank" rel="noopener">${whatsappIcon('assets')}<span><strong>WhatsApp</strong><small>${esc(data.settings.whatsapp ? 'Fale com a EJS' : 'Solicitar orçamento')}</small></span></a>
          <a class="btn btn-primary project-budget-button" href="${whatsapp}" target="_blank" rel="noopener"><span class="budget-icon">▣</span><span><strong>Orçamento</strong><small>Gratuito e rápido</small></span></a>
        </div>
      </div>
    </section>

    <section class="project-more-section">
      <div class="container project-more-grid">
        <div><span class="section-kicker">EJS Empreiteira</span><h2>Quer transformar seu espaço?</h2><p>Conte o que precisa e receba orientação para sua obra, reforma ou manutenção.</p></div>
        <div class="project-more-actions"><a class="btn btn-primary" href="${whatsapp}" target="_blank" rel="noopener">Solicitar orçamento</a><a class="btn btn-secondary" href="obras.html">Ver outras obras</a></div>
      </div>
    </section>

    <footer class="site-footer project-site-footer">
      <div class="container footer-grid">
        <div class="footer-company"><a class="site-brand footer-logo" href="index.html"><img src="assets/img/logo-ejs.webp" alt="Logo EJS Empreiteira"><span><strong>EJS</strong><small>EMPREITEIRA</small></span></a><p>Construímos, reformamos e transformamos seu espaço com qualidade, organização e compromisso em cada detalhe.</p><span>CNPJ: ${esc(data.settings.cnpj || 'Não informado')}</span></div>
        <div class="footer-column"><strong>Navegação</strong><a href="index.html">Início</a><a href="obras.html">Obras</a><a href="index.html#servicos">Serviços</a><a href="index.html#contato">Contato</a></div>
        <div class="footer-column"><strong>Projeto</strong><span>${esc(work.category || 'Reforma')}</span><span>${esc(work.status || 'Concluída')}</span>${work.location ? `<span>${esc(work.location)}</span>` : ''}</div>
        <div class="footer-column"><strong>Contato</strong><a href="${whatsapp}" target="_blank" rel="noopener">WhatsApp</a><a href="${esc(data.settings.instagram || '#')}" target="_blank" rel="noopener">Instagram</a></div>
      </div>
      <div class="container footer-bottom">© ${new Date().getFullYear()} EJS Empreiteira. Todos os direitos reservados.</div>
    </footer>

    <a class="floating-whatsapp" href="${whatsapp}" target="_blank" rel="noopener" aria-label="Falar com a EJS pelo WhatsApp">${whatsappIcon('assets')}</a>
    <div class="mobile-bottom-cta"><a class="mobile-wa" href="${whatsapp}" target="_blank" rel="noopener">${whatsappIcon('assets')} WhatsApp</a><a class="mobile-budget" href="${whatsapp}" target="_blank" rel="noopener">▣ Orçamento</a></div>`;

  const track = document.getElementById('projectMediaTrack');
  const galleryShell = document.getElementById('projectGalleryShell');
  const slides = [...track.children];
  const dots = document.getElementById('projectMediaDots');
  const current = document.getElementById('projectCurrent');
  let index = 0;

  function syncFrameShape() {
    const slide = slides[index];
    if (!slide) return;
    const shape = slide.dataset.mediaShape || 'landscape';
    const ratio = Number(slide.dataset.mediaRatio || 16 / 9);
    galleryShell.dataset.activeShape = shape;
    if (shape === 'landscape' || shape === 'ultrawide') {
      galleryShell.style.setProperty('--desktop-media-ratio', String(Math.max(1.35, Math.min(ratio, 1.95))));
    } else {
      galleryShell.style.setProperty('--desktop-media-ratio', String(16 / 9));
    }
  }

  function prepareSlide(i) {
    if (i < 0 || i >= slides.length) return;
    const slide = slides[i];
    const mediaEl = slide.querySelector('img,video');
    if (!mediaEl) return;
    const deferred = mediaEl.dataset.src;
    if (deferred) {
      mediaEl.src = deferred;
      mediaEl.removeAttribute('data-src');
      if (mediaEl.tagName === 'VIDEO') mediaEl.load();
    }
    if (!slide.dataset.manipulatorInstalled) {
      installMediaManipulator(slide, mediaEl);
      slide.dataset.manipulatorInstalled = '1';
    }
  }

  function hydrate(i) {
    [i - 1, i, i + 1].forEach(prepareSlide);
  }

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
    syncFrameShape();
  }

  function go(nextIndex) {
    if (!slides.length) return;
    index = (nextIndex + slides.length) % slides.length;
    hydrate(index);
    track.scrollTo({ left: track.clientWidth * index, behavior: 'smooth' });
    update();
  }

  galleryShell.addEventListener('ejsmediaclassified', event => {
    if (event.target === slides[index]) syncFrameShape();
  });

  document.getElementById('projectMediaPrev')?.addEventListener('click', () => go(index - 1));
  document.getElementById('projectMediaNext')?.addEventListener('click', () => go(index + 1));

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

  window.addEventListener('resize', () => {
    track.scrollLeft = track.clientWidth * index;
    syncFrameShape();
  }, { passive: true });

  hydrate(0);
  update();
}

loadProject();
