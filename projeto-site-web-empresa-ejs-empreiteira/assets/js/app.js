const { getData, esc, initNavigation, getServices, serviceIcon, initAdaptiveMedia } = window.EJSCommon;

function mediaPreview(work) {
  const gallery = Array.isArray(work.gallery) ? work.gallery.filter(Boolean) : [];
  const first = gallery[0] || work.cover || 'assets/img/hero-ejs.webp';
  const second = gallery[1];

  if (second) {
    return `
      <div class="home-project-media home-project-media-split">
        <div data-adaptive-media><span>ANTES</span><img src="${esc(first)}" alt="${esc(work.title)} - imagem 1" loading="lazy" decoding="async"></div>
        <div data-adaptive-media><span class="after">DEPOIS</span><img src="${esc(second)}" alt="${esc(work.title)} - imagem 2" loading="lazy" decoding="async"></div>
      </div>`;
  }
  return `
    <div class="home-project-media" data-adaptive-media>
      <span class="project-category-tag">${esc(work.category || 'Projeto')}</span>
      <img src="${esc(first)}" alt="${esc(work.title)}" loading="lazy" decoding="async">
    </div>`;
}


function renderServices(settings) {
  const host = document.getElementById('servicesGrid');
  if (!host) return;
  const services = getServices(settings);
  host.innerHTML = services.map(service => `
    <article class="service-mini-card">
      <div class="service-line-icon" aria-hidden="true">${esc(serviceIcon(service))}</div>
      <h3>${esc(service.name)}</h3>
      <p>${esc(service.description || 'Serviço executado com planejamento, qualidade e atenção aos detalhes.')}</p>
    </article>`).join('');
}

function renderHomeProjects(works) {
  const host = document.getElementById('homeProjects');
  if (!host) return;
  const list = works.slice(0, 3);
  if (!list.length) {
    host.innerHTML = '<div class="public-empty">As próximas obras cadastradas aparecerão aqui.</div>';
    return;
  }

  host.innerHTML = list.map(work => `
    <article class="home-project-card">
      ${mediaPreview(work)}
      <div class="home-project-copy">
        <h3>${esc(work.title)}</h3>
        <p>${esc(work.location || work.type || 'Projeto EJS')}</p>
        <a href="obra.html?id=${encodeURIComponent(work.id)}">Ver detalhes →</a>
      </div>
    </article>
  `).join('');
}

(async () => {
  const data = await getData();
  initNavigation(data.settings);
  renderServices(data.settings);
  renderHomeProjects(data.works);
  initAdaptiveMedia(document);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.service-mini-card,.home-project-card,.testimonial-card,.about-grid').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
})();