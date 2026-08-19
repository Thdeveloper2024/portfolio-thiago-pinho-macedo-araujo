const { getData, esc, initNavigation } = window.EJSCommon;

function mediaPreview(work) {
  const gallery = Array.isArray(work.gallery) ? work.gallery.filter(Boolean) : [];
  const first = gallery[0] || work.cover || 'assets/img/hero-ejs.webp';
  const second = gallery[1];

  if (second) {
    return `
      <div class="home-project-media home-project-media-split">
        <div><span>ANTES</span><img src="${esc(first)}" alt="${esc(work.title)} - imagem 1" loading="lazy" decoding="async"></div>
        <div><span class="after">DEPOIS</span><img src="${esc(second)}" alt="${esc(work.title)} - imagem 2" loading="lazy" decoding="async"></div>
      </div>`;
  }
  return `
    <div class="home-project-media">
      <span class="project-category-tag">${esc(work.category || 'Projeto')}</span>
      <img src="${esc(first)}" alt="${esc(work.title)}" loading="lazy" decoding="async">
    </div>`;
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
  renderHomeProjects(data.works);

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