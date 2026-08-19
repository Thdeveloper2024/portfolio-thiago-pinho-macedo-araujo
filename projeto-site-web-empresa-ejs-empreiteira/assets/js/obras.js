const { getData, esc, initNavigation, getServices, serviceIcon, initAdaptiveMedia } = window.EJSCommon;

let pageData = { settings: {}, works: [] };
let currentFilter = 'Todos';

function workMatches(work, filter) {
  if (filter === 'Todos') return true;
  return String(work.category || '').toLocaleLowerCase('pt-BR') === filter.toLocaleLowerCase('pt-BR')
    || (Array.isArray(work.services) && work.services.some(s => String(s).toLocaleLowerCase('pt-BR') === filter.toLocaleLowerCase('pt-BR')));
}

function featuredTemplate(work) {
  if (!work) return '';
  const facts = [
    work.area ? `<div class="featured-fact"><span>▥</span><div><strong>${esc(work.area)}</strong><small>Área da obra</small></div></div>` : '',
    work.duration ? `<div class="featured-fact"><span>◷</span><div><strong>${esc(work.duration)}</strong><small>Prazo de execução</small></div></div>` : '',
    work.year ? `<div class="featured-fact"><span>▣</span><div><strong>${esc(work.year)}</strong><small>Ano de conclusão</small></div></div>` : ''
  ].filter(Boolean).join('');

  return `
    <div class="portfolio-featured-image" data-adaptive-media>
      <span class="featured-ribbon">DESTAQUE</span>
      <img src="${esc(work.cover || 'assets/img/hero-ejs.webp')}" alt="${esc(work.title)}" decoding="async" fetchpriority="high">
    </div>
    <div class="portfolio-featured-copy">
      <span class="section-kicker">Obra em destaque</span>
      <h2>${esc(work.title)}</h2>
      <div class="featured-meta">
        ${work.location ? `<span>● ${esc(work.location)}</span>` : ''}
        ${work.type ? `<span>▦ ${esc(work.type)}</span>` : ''}
        ${work.status ? `<span>✓ ${esc(work.status)}</span>` : ''}
      </div>
      <p>${esc(work.desc || 'Projeto executado pela EJS Empreiteira.')}</p>
      <div class="featured-facts">${facts}</div>
      <a class="btn btn-primary" href="obra.html?id=${encodeURIComponent(work.id)}">Ver detalhes →</a>
    </div>`;
}

function cardTemplate(work) {
  return `
    <article class="portfolio-card">
      <a class="portfolio-card-media" data-adaptive-media href="obra.html?id=${encodeURIComponent(work.id)}">
        <span>${esc(String(work.category || 'Projeto').toUpperCase())}</span>
        <img src="${esc(work.cover || 'assets/img/hero-ejs.webp')}" alt="${esc(work.title)}" loading="lazy" decoding="async">
      </a>
      <div class="portfolio-card-body">
        <h3>${esc(work.title)}</h3>
        ${work.location ? `<div class="portfolio-location">● ${esc(work.location)}</div>` : ''}
        <p>${esc(work.desc || 'Projeto executado pela EJS Empreiteira.')}</p>
        <a class="portfolio-details-link" href="obra.html?id=${encodeURIComponent(work.id)}">Ver detalhes <span>→</span></a>
      </div>
    </article>`;
}

function renderPortfolio() {
  const filtered = pageData.works.filter(work => workMatches(work, currentFilter));
  const featuredHost = document.getElementById('portfolioFeatured');
  const grid = document.getElementById('portfolioGrid');
  const empty = document.getElementById('portfolioEmpty');

  if (!filtered.length) {
    featuredHost.innerHTML = '';
    featuredHost.hidden = true;
    grid.innerHTML = '';
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  featuredHost.hidden = false;

  const featured = currentFilter === 'Todos'
    ? (filtered.find(work => work.featured) || filtered[0])
    : (filtered.find(work => work.featured) || filtered[0]);

  featuredHost.innerHTML = featuredTemplate(featured);

  const rest = filtered.filter(work => work.id !== featured.id);
  grid.innerHTML = rest.map(cardTemplate).join('');
  initAdaptiveMedia(document);
}

function initFilters() {
  const host = document.getElementById('portfolioFilters');
  const services = getServices(pageData.settings);
  host.innerHTML = `<button class="active" type="button" data-filter="Todos"><span>▦</span>Todos</button>` + services.map(service =>
    `<button type="button" data-filter="${esc(service.name)}"><span>${esc(serviceIcon(service))}</span>${esc(service.name)}</button>`
  ).join('');
  const buttons = [...host.querySelectorAll('[data-filter]')];
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      currentFilter = button.dataset.filter || 'Todos';
      buttons.forEach(b => b.classList.toggle('active', b === button));
      renderPortfolio();
    });
  });
}

(async () => {
  pageData = await getData();
  initNavigation(pageData.settings);
  initFilters();
  renderPortfolio();
})();