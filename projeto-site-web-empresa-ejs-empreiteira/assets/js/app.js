const { getData, esc, initNavigation, getServices, serviceIcon, initAdaptiveMedia, uiIcon } = window.EJSCommon;

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
      <div class="service-line-icon" aria-hidden="true">${serviceIcon(service, 'service-svg')}</div>
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

function testimonialCard(item) {
  const rating = Math.max(1, Math.min(5, Number(item.rating) || 5));
  return `
    <article class="testimonial-item">
      <div class="testimonial-stars" aria-label="${rating} de 5 estrelas">${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</div>
      <div class="quote-mark">“</div>
      <p>${esc(item.message)}</p>
      <div class="testimonial-person">
        <div class="testimonial-avatar">${esc((item.name || 'E').slice(0,1).toUpperCase())}</div>
        <div><strong>${esc(item.name || 'Cliente EJS')}</strong><span>${esc(item.location || item.project || 'Cliente EJS')}</span></div>
      </div>
    </article>`;
}

function renderTestimonials(testimonials = []) {
  const host = document.getElementById('testimonialsList');
  if (!host) return;
  const list = [...testimonials].reverse();
  if (!list.length) {
    host.innerHTML = '<div class="testimonial-empty">Ainda não há depoimentos cadastrados. Seja a primeira pessoa a contar sua experiência.</div>';
    return;
  }
  host.innerHTML = list.map(testimonialCard).join('');
}

function initTestimonialsForm(initialTestimonials = []) {
  let testimonials = Array.isArray(initialTestimonials) ? initialTestimonials : [];
  renderTestimonials(testimonials);
  const form = document.getElementById('testimonialForm');
  if (!form) return;
  const status = document.getElementById('testimonialFormStatus');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    if (status) status.textContent = 'Enviando...';
    const body = {
      name: document.getElementById('testimonialName')?.value || '',
      location: document.getElementById('testimonialLocation')?.value || '',
      project: document.getElementById('testimonialProject')?.value || '',
      message: document.getElementById('testimonialMessage')?.value || '',
      rating: document.getElementById('testimonialRating')?.value || 5,
      website: document.getElementById('testimonialWebsite')?.value || ''
    };
    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Não foi possível enviar o depoimento.');
      if (data.testimonial) testimonials.push(data.testimonial);
      renderTestimonials(testimonials);
      form.reset();
      if (status) status.textContent = 'Depoimento enviado com sucesso. Obrigado!';
      document.getElementById('testimonialsList')?.scrollTo({ left: 0, behavior: 'smooth' });
    } catch (error) {
      if (status) status.textContent = error.message;
    } finally {
      submit.disabled = false;
    }
  });
}

(async () => {
  const data = await getData();
  initNavigation(data.settings);
  renderServices(data.settings);
  renderHomeProjects(data.works);
  initTestimonialsForm(data.testimonials || []);
  initAdaptiveMedia(document);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.service-mini-card,.home-project-card,.testimonial-item,.about-grid').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
})();
