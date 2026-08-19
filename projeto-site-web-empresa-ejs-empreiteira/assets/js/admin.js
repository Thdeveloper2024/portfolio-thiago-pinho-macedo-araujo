const $ = id => document.getElementById(id);

let state = {
  settings: {
    whatsapp: '5511999999999',
    phone: '(11) 3456-7890',
    instagram: 'https://instagram.com/',
    cnpj: 'Não informado',
    serviceArea: 'São Paulo e Região',
    businessHours: 'Seg a Sex das 8h às 18h',
    experienceYears: 6,
    satisfactionRate: 98,
    completedBase: 0,
    completedAdded: 0,
    services: [{"id": "demolicao", "name": "Demolição", "description": "Remoção segura e planejada, com organização e descarte responsável.", "icon": "demolition"}, {"id": "alvenaria", "name": "Alvenaria", "description": "Levantamento de paredes, adequações e estruturas com qualidade.", "icon": "masonry"}, {"id": "pintura", "name": "Pintura", "description": "Pintura interna e externa com preparação e acabamento cuidadoso.", "icon": "painting"}, {"id": "eletrica", "name": "Elétrica", "description": "Instalações, adequações e manutenções elétricas com segurança.", "icon": "electrical"}, {"id": "gesso", "name": "Gesso", "description": "Forros, sancas, divisórias e acabamentos em gesso para valorizar o ambiente.", "icon": "plaster"}, {"id": "hidraulica", "name": "Hidráulica", "description": "Instalações e manutenção hidráulica residencial e comercial.", "icon": "plumbing"}]
  },
  works: []
};
let editingIndex = -1;
let editingServiceIndex = -1;

async function api(url, options = {}) {
  const response = await fetch(url, { cache: 'no-store', ...options });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) {
    window.location.replace('/admin/login.html');
    throw new Error('Sessão expirada.');
  }
  if (!response.ok) throw new Error(data.error || 'Erro de comunicação com o servidor.');
  return data;
}

async function ensureSession() {
  const response = await fetch('/api/session', { cache: 'no-store' });
  if (!response.ok) {
    window.location.replace('/admin/login.html');
    return false;
  }
  return true;
}

function setStatus(message, type = 'ok') {
  const el = $('globalStatus');
  if (!el) return;
  el.textContent = message;
  el.dataset.type = type;
  clearTimeout(setStatus.timer);
  setStatus.timer = setTimeout(() => { el.textContent = ''; }, 5000);
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[c]));
}

function parseServices(value = '') {
  return [...new Set(String(value).split(',').map(s => s.trim()).filter(Boolean))].slice(0, 20);
}

const SERVICE_ICON_OPTIONS = (window.EJSIcons?.catalog || [
  { key:'tools', label:'Ferramentas / geral' },
  { key:'demolition', label:'Demolição' },
  { key:'masonry', label:'Alvenaria' },
  { key:'painting', label:'Pintura' },
  { key:'electrical', label:'Elétrica' },
  { key:'plaster', label:'Gesso' },
  { key:'plumbing', label:'Hidráulica' }
]);

function iconSvg(name, className = 'ui-icon') {
  if (window.EJSIcons?.svg) return window.EJSIcons.svg(name || 'tools', className);
  return `<span class="${className}">⚒</span>`;
}

function companyServices() {
  return Array.isArray(state.settings?.services) ? state.settings.services : [];
}

function slugService(value = '') {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `servico-${Date.now()}`;
}

function refreshWorkServiceControls(selected = []) {
  const category = $('workCategory');
  if (category) {
    const current = category.value || 'Reforma';
    category.innerHTML = '<option value="Reforma">Reforma completa</option>' + companyServices().map(service =>
      `<option value="${escapeHtml(service.name)}">${escapeHtml(service.name)}</option>`
    ).join('');
    if (![...category.options].some(option => option.value === current) && current) {
      category.insertAdjacentHTML('beforeend', `<option value="${escapeHtml(current)}">${escapeHtml(current)}</option>`);
    }
    category.value = current;
  }

  const host = $('workServiceOptions');
  if (!host) return;
  const selectedSet = new Set((selected || []).map(String));
  host.innerHTML = companyServices().map((service, index) => {
    const id = `workService_${index}`;
    return `<label class="admin-service-choice" for="${id}"><input id="${id}" type="checkbox" value="${escapeHtml(service.name)}" ${selectedSet.has(service.name) ? 'checked' : ''}><span class="admin-service-choice-icon">${iconSvg(service.icon || 'tools', 'admin-inline-svg')}</span><strong>${escapeHtml(service.name)}</strong></label>`;
  }).join('') || '<p class="small-note">Cadastre os serviços da empresa na aba Serviços.</p>';
}

function selectedWorkServices() {
  return [...document.querySelectorAll('#workServiceOptions input[type="checkbox"]:checked')].map(input => input.value);
}

function renderServiceIconPalette(selected = $('serviceIcon')?.value || 'tools') {
  const select = $('serviceIcon');
  const host = $('serviceIconPalette');
  const safeSelected = SERVICE_ICON_OPTIONS.some(option => option.key === selected) ? selected : 'tools';
  if (select) {
    select.innerHTML = SERVICE_ICON_OPTIONS.map(option => `<option value="${escapeHtml(option.key)}">${escapeHtml(option.label)}</option>`).join('');
    select.value = safeSelected;
  }
  if (!host) return;
  host.innerHTML = SERVICE_ICON_OPTIONS.map(option => `<button class="admin-icon-chip ${safeSelected === option.key ? 'active' : ''}" data-icon-choice="${escapeHtml(option.key)}" type="button" title="${escapeHtml(option.label)}" aria-selected="${safeSelected === option.key}">${iconSvg(option.key, 'admin-icon-svg')}<span>${escapeHtml(option.label)}</span></button>`).join('');
  host.querySelectorAll('[data-icon-choice]').forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.iconChoice || 'tools';
      setValue('serviceIcon', key);
      renderServiceIconPalette(key);
    });
  });
}

function setValue(id, value = '') {
  const el = $(id);
  if (el) el.value = value ?? '';
}

function setChecked(id, checked = false) {
  const el = $(id);
  if (el) el.checked = Boolean(checked);
}

async function loadState() {
  state = await api('/api/cms');

  [
    'whatsapp', 'phone', 'instagram', 'cnpj', 'serviceArea', 'businessHours',
    'experienceYears', 'satisfactionRate', 'completedBase'
  ].forEach(key => setValue(key, state.settings?.[key] ?? ''));

  refreshWorkServiceControls();
  renderServices();
  renderServiceIconPalette();
  updateDashboard();
  renderWorks();
}

async function saveState(message = 'Alterações salvas.') {
  const data = await api('/api/cms', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state)
  });
  state = data.state;
  updateDashboard();
  setStatus(message);
}

async function optimizeImage(file) {
  if (!file || !String(file.type || '').startsWith('image/')) return file;
  if (file.type === 'image/svg+xml' || file.size < 450 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const maxSide = 2200;
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.86));
    if (!blob || blob.size >= file.size) return file;

    const base = file.name.replace(/\.[^.]+$/, '') || 'imagem';
    return new File([blob], `${base}.webp`, {
      type: 'image/webp',
      lastModified: Date.now()
    });
  } catch {
    return file;
  }
}

async function uploadFile(file) {
  if (!file) return null;
  file = await optimizeImage(file);

  const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
    method: 'POST',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file
  });

  const data = await response.json().catch(() => ({}));
  if (response.status === 401) {
    window.location.replace('/admin/login.html');
    throw new Error('Sessão expirada.');
  }
  if (!response.ok) throw new Error(data.error || 'Falha no upload do arquivo.');
  return data;
}

$('saveSettings')?.addEventListener('click', async () => {
  const btn = $('saveSettings');
  btn.disabled = true;

  try {
    state.settings = {
      ...state.settings,
      whatsapp: $('whatsapp').value.trim(),
      phone: $('phone').value.trim(),
      instagram: $('instagram').value.trim(),
      cnpj: $('cnpj').value.trim(),
      serviceArea: $('serviceArea').value.trim(),
      businessHours: $('businessHours').value.trim(),
      experienceYears: Math.max(0, parseInt($('experienceYears').value || '0', 10) || 0),
      satisfactionRate: Math.max(0, Math.min(100, parseInt($('satisfactionRate').value || '0', 10) || 0)),
      completedBase: Math.max(0, parseInt($('completedBase').value || '0', 10) || 0)
    };

    await saveState('Configurações salvas online.');
    $('settingsMsg').textContent = 'Dados salvos e sincronizados com o Vercel Blob.';
  } catch (error) {
    $('settingsMsg').textContent = error.message;
    setStatus(error.message, 'error');
  } finally {
    btn.disabled = false;
  }
});

function resetForm() {
  editingIndex = -1;
  $('workFormTitle').textContent = 'Cadastrar nova obra';
  $('addWork').textContent = 'Publicar obra';
  $('cancelEdit').hidden = true;

  setValue('workTitle');
  setValue('workCategory', 'Reforma');
  setValue('workType');
  setValue('workLocation');
  setValue('workDesc');
  setValue('workArea');
  setValue('workDuration');
  setValue('workYear', new Date().getFullYear());
  setValue('workStatus', 'Concluída');
  refreshWorkServiceControls([]);
  setChecked('workFeatured', false);

  ['workImage', 'workGallery', 'workVideos', 'workAppendGallery', 'workAppendVideos'].forEach(id => {
    const el = $(id);
    if (el) el.value = '';
  });

  if ($('editAppendMedia')) $('editAppendMedia').hidden = true;
  if ($('editExistingMedia')) $('editExistingMedia').innerHTML = '';
}

$('cancelEdit').onclick = () => {
  resetForm();
  showView('works');
};

function getFormPayload() {
  return {
    title: $('workTitle').value.trim(),
    category: $('workCategory').value,
    type: $('workType').value.trim(),
    location: $('workLocation').value.trim(),
    desc: $('workDesc').value.trim(),
    area: $('workArea').value.trim(),
    duration: $('workDuration').value.trim(),
    year: $('workYear').value.trim(),
    status: $('workStatus').value,
    services: selectedWorkServices(),
    featured: $('workFeatured').checked
  };
}

function enforceFeatured(selectedIndex) {
  state.works.forEach((work, index) => {
    if (index !== selectedIndex) work.featured = false;
  });
}

$('addWork')?.addEventListener('click', async () => {
  const fields = getFormPayload();

  if (!fields.title) return alert('Informe o título da obra.');
  if (!fields.category) return alert('Selecione a categoria principal.');
  if (editingIndex < 0 && !$('workImage').files[0]) return alert('Informe a imagem principal.');

  const btn = $('addWork');
  btn.disabled = true;
  btn.textContent = editingIndex >= 0 ? 'Salvando...' : 'Publicando...';

  try {
    if (editingIndex >= 0) {
      const current = { ...state.works[editingIndex] };
      let cover = current.cover;
      let coverPath = current.coverPath || '';
      let gallery = [...(current.gallery || [])];
      let galleryPaths = [...(current.galleryPaths || [])];
      let videos = [...(current.videos || [])];
      let videoPaths = [...(current.videoPaths || [])];

      const main = $('workImage').files[0];
      if (main) {
        const up = await uploadFile(main);
        const oldCover = cover;
        cover = up.url;
        coverPath = up.pathname;

        gallery = [cover, ...gallery.filter(src => src !== oldCover && src !== cover)];
        galleryPaths = [coverPath, ...galleryPaths.filter(path => path !== current.coverPath && path !== coverPath)];
      }

      for (const file of $('workGallery').files) {
        const up = await uploadFile(file);
        gallery.push(up.url);
        galleryPaths.push(up.pathname);
      }

      for (const file of $('workVideos').files) {
        const up = await uploadFile(file);
        videos.push(up.url);
        videoPaths.push(up.pathname);
      }

      if ($('workAppendGallery')?.files.length) {
        for (const file of $('workAppendGallery').files) {
          const up = await uploadFile(file);
          gallery.push(up.url);
          galleryPaths.push(up.pathname);
        }
      }

      if ($('workAppendVideos')?.files.length) {
        for (const file of $('workAppendVideos').files) {
          const up = await uploadFile(file);
          videos.push(up.url);
          videoPaths.push(up.pathname);
        }
      }

      let counted = Boolean(current.counted);
      if (!current.builtin) {
        const shouldCount = fields.status === 'Concluída';
        if (!counted && shouldCount) state.settings.completedAdded = (Number(state.settings.completedAdded) || 0) + 1;
        if (counted && !shouldCount) state.settings.completedAdded = Math.max(0, (Number(state.settings.completedAdded) || 0) - 1);
        counted = shouldCount;
      }

      state.works[editingIndex] = {
        ...current,
        ...fields,
        cover,
        coverPath,
        gallery,
        galleryPaths,
        videos,
        videoPaths,
        counted
      };

      if (fields.featured) enforceFeatured(editingIndex);
      await saveState('Obra atualizada online.');
    } else {
      const main = await uploadFile($('workImage').files[0]);
      const gallery = [main.url];
      const galleryPaths = [main.pathname];
      const videos = [];
      const videoPaths = [];

      for (const file of $('workGallery').files) {
        const up = await uploadFile(file);
        gallery.push(up.url);
        galleryPaths.push(up.pathname);
      }

      for (const file of $('workVideos').files) {
        const up = await uploadFile(file);
        videos.push(up.url);
        videoPaths.push(up.pathname);
      }

      state.works.push({
        id: `obra-${Date.now()}`,
        ...fields,
        cover: main.url,
        coverPath: main.pathname,
        gallery,
        galleryPaths,
        videos,
        videoPaths,
        counted: fields.status === 'Concluída',
        builtin: false
      });

      const newIndex = state.works.length - 1;
      if (fields.featured || state.works.length === 1) {
        state.works[newIndex].featured = true;
        enforceFeatured(newIndex);
      }

      if (state.works[newIndex].counted) state.settings.completedAdded = (Number(state.settings.completedAdded) || 0) + 1;
      await saveState('Nova obra publicada e salva online.');
    }

    resetForm();
    renderWorks();
    updateDashboard();
    showView('works');
  } catch (error) {
    setStatus(error.message, 'error');
    alert(error.message);
  } finally {
    btn.disabled = false;
    btn.textContent = editingIndex >= 0 ? 'Salvar alterações' : 'Publicar obra';
  }
});

function renderEditMedia() {
  const host = $('editExistingMedia');
  if (!host || editingIndex < 0) {
    if (host) host.innerHTML = '';
    return;
  }

  const work = state.works[editingIndex];
  const photos = Array.isArray(work.gallery) ? work.gallery : [];
  const videos = Array.isArray(work.videos) ? work.videos : [];
  host.innerHTML = '';

  if (!photos.length && !videos.length) {
    host.innerHTML = '<p class="small-note">Nenhuma mídia cadastrada nesta obra.</p>';
    return;
  }

  photos.forEach((src, index) => {
    const card = document.createElement('article');
    card.className = 'admin-media-item';
    card.innerHTML = `
      <div class="admin-media-preview"><img src="${escapeHtml(src)}" alt="Foto ${index + 1}" loading="lazy"></div>
      <div><strong>${index === 0 ? 'Imagem principal' : `Foto ${index + 1}`}</strong><button type="button" class="remove-media">Excluir foto</button></div>`;
    card.querySelector('.remove-media').onclick = () => removeMedia('image', index);
    host.appendChild(card);
  });

  videos.forEach((src, index) => {
    const card = document.createElement('article');
    card.className = 'admin-media-item';
    card.innerHTML = `
      <div class="admin-media-preview admin-video-preview"><span>▶</span></div>
      <div><strong>Vídeo ${index + 1}</strong><button type="button" class="remove-media">Excluir vídeo</button></div>`;
    card.querySelector('.remove-media').onclick = () => removeMedia('video', index);
    host.appendChild(card);
  });
}

async function removeMedia(type, index) {
  if (editingIndex < 0) return;

  const work = { ...state.works[editingIndex] };
  const label = type === 'video' ? 'vídeo' : 'foto';
  if (!confirm(`Excluir esta ${label} da obra?`)) return;

  if (type === 'video') {
    const videos = [...(work.videos || [])];
    const paths = [...(work.videoPaths || [])];
    videos.splice(index, 1);
    paths.splice(index, 1);
    work.videos = videos;
    work.videoPaths = paths;
  } else {
    const gallery = [...(work.gallery || [])];
    const paths = [...(work.galleryPaths || [])];
    gallery.splice(index, 1);
    paths.splice(index, 1);

    work.gallery = gallery;
    work.galleryPaths = paths;

    if (work.cover && !gallery.includes(work.cover)) {
      work.cover = gallery[0] || 'assets/img/logo-ejs.webp';
      work.coverPath = paths[0] || '';
    }
  }

  state.works[editingIndex] = work;

  try {
    await saveState(`${label[0].toUpperCase() + label.slice(1)} excluído(a) da obra.`);
    renderEditMedia();
    renderWorks();
    updateDashboard();
  } catch (error) {
    setStatus(error.message, 'error');
    await loadState();
  }
}

function startEdit(index) {
  editingIndex = index;
  const work = state.works[index];

  $('workFormTitle').textContent = 'Editar obra';
  $('addWork').textContent = 'Salvar alterações';
  $('cancelEdit').hidden = false;

  setValue('workTitle', work.title || '');
  setValue('workCategory', work.category || 'Reforma');
  setValue('workType', work.type || '');
  setValue('workLocation', work.location || '');
  setValue('workDesc', work.desc || '');
  setValue('workArea', work.area || '');
  setValue('workDuration', work.duration || '');
  setValue('workYear', work.year || '');
  setValue('workStatus', work.status || 'Concluída');
  refreshWorkServiceControls(Array.isArray(work.services) ? work.services : []);
  if (![...$('workCategory').options].some(option => option.value === (work.category || 'Reforma'))) {
    $('workCategory').insertAdjacentHTML('beforeend', `<option value="${escapeHtml(work.category || 'Reforma')}">${escapeHtml(work.category || 'Reforma')}</option>`);
  }
  $('workCategory').value = work.category || 'Reforma';
  setChecked('workFeatured', work.featured);

  ['workImage', 'workGallery', 'workVideos', 'workAppendGallery', 'workAppendVideos'].forEach(id => {
    if ($(id)) $(id).value = '';
  });

  $('editAppendMedia').hidden = false;
  renderEditMedia();
  showView('new');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function removeWork(index) {
  const work = state.works[index];
  if (!confirm(`Excluir a obra "${work.title}"?`)) return;

  state.works.splice(index, 1);
  if (work.counted) {
    state.settings.completedAdded = Math.max(0, (Number(state.settings.completedAdded) || 0) - 1);
  }

  if (work.featured && state.works.length) state.works[0].featured = true;

  try {
    await saveState('Obra excluída do portfólio.');
    renderWorks();
    updateDashboard();
  } catch (error) {
    setStatus(error.message, 'error');
    await loadState();
  }
}

function renderWorks() {
  const host = $('adminWorks');
  host.innerHTML = '';

  if (!state.works.length) {
    host.innerHTML = '<div class="admin-empty">Nenhuma obra cadastrada.</div>';
    return;
  }

  state.works.forEach((work, index) => {
    const row = document.createElement('article');
    row.className = 'admin-work';
    row.innerHTML = `
      <img src="${escapeHtml(work.cover || '../assets/img/logo-ejs.webp')}" alt="">
      <div class="admin-work-copy">
        <div class="admin-work-tags">
          <span>${escapeHtml(work.category || 'Reforma')}</span>
          <span>${escapeHtml(work.status || 'Concluída')}</span>
          ${work.featured ? '<span class="featured">Destaque</span>' : ''}
        </div>
        <strong>${escapeHtml(work.title)}</strong>
        <p>${escapeHtml(work.desc || '')}</p>
        <small>${escapeHtml(work.location || 'Local não informado')} · ${(work.gallery || []).length} foto(s) · ${(work.videos || []).length} vídeo(s)</small>
      </div>
      <div class="admin-work-actions">
        <button class="edit-work" type="button">Editar</button>
        <button class="delete-work" type="button">Excluir</button>
      </div>`;

    row.querySelector('.edit-work').onclick = () => startEdit(index);
    row.querySelector('.delete-work').onclick = () => removeWork(index);
    host.appendChild(row);
  });
}


function resetServiceForm() {
  editingServiceIndex = -1;
  if ($('serviceFormTitle')) $('serviceFormTitle').textContent = 'Novo serviço';
  if ($('saveService')) $('saveService').textContent = 'Cadastrar serviço';
  if ($('cancelServiceEdit')) $('cancelServiceEdit').hidden = true;
  setValue('serviceName');
  setValue('serviceDescription');
  setValue('serviceIcon', 'tools');
  renderServiceIconPalette('tools');
}

function renderServices() {
  const host = $('adminServices');
  if (!host) return;
  const services = companyServices();
  if (!services.length) {
    host.innerHTML = '<div class="admin-empty">Nenhum serviço cadastrado.</div>';
    return;
  }
  host.innerHTML = services.map((service, index) => `
    <article class="admin-service-row">
      <span class="admin-service-row-icon">${iconSvg(service.icon || 'tools', 'admin-icon-svg')}</span>
      <div><strong>${escapeHtml(service.name)}</strong><p>${escapeHtml(service.description || 'Sem descrição.')}</p></div>
      <div class="admin-work-actions"><button class="edit-service" data-index="${index}" type="button">Editar</button><button class="delete-work delete-service" data-index="${index}" type="button">Excluir</button></div>
    </article>`).join('');
  host.querySelectorAll('.edit-service').forEach(button => button.addEventListener('click', () => startServiceEdit(Number(button.dataset.index))));
  host.querySelectorAll('.delete-service').forEach(button => button.addEventListener('click', () => removeService(Number(button.dataset.index))));
}

function startServiceEdit(index) {
  const service = companyServices()[index];
  if (!service) return;
  editingServiceIndex = index;
  $('serviceFormTitle').textContent = 'Editar serviço';
  $('saveService').textContent = 'Salvar alterações';
  $('cancelServiceEdit').hidden = false;
  setValue('serviceName', service.name);
  setValue('serviceDescription', service.description);
  setValue('serviceIcon', service.icon || 'tools');
  renderServiceIconPalette(service.icon || 'tools');
  showView('services');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$('cancelServiceEdit')?.addEventListener('click', resetServiceForm);
$('serviceIcon')?.addEventListener('change', event => renderServiceIconPalette(event.target.value || 'tools'));

$('saveService')?.addEventListener('click', async () => {
  const name = $('serviceName').value.trim();
  const description = $('serviceDescription').value.trim();
  const icon = $('serviceIcon').value || 'tools';
  if (!name) return alert('Informe o nome do serviço.');

  const duplicate = companyServices().some((service, index) => index !== editingServiceIndex && service.name.toLocaleLowerCase('pt-BR') === name.toLocaleLowerCase('pt-BR'));
  if (duplicate) return alert('Já existe um serviço com esse nome.');

  const previousName = editingServiceIndex >= 0 ? companyServices()[editingServiceIndex]?.name : '';
  const item = {
    id: editingServiceIndex >= 0 ? companyServices()[editingServiceIndex].id : slugService(name),
    name,
    description,
    icon
  };

  if (!Array.isArray(state.settings.services)) state.settings.services = [];
  if (editingServiceIndex >= 0) {
    state.settings.services[editingServiceIndex] = item;
    if (previousName && previousName !== name) {
      state.works = state.works.map(work => ({
        ...work,
        category: work.category === previousName ? name : work.category,
        services: Array.isArray(work.services) ? work.services.map(service => service === previousName ? name : service) : []
      }));
    }
  } else state.settings.services.push(item);

  try {
    await saveState(editingServiceIndex >= 0 ? 'Serviço atualizado.' : 'Serviço cadastrado.');
    resetServiceForm();
    renderServices();
    refreshWorkServiceControls();
  } catch (error) {
    setStatus(error.message, 'error');
  }
});

async function removeService(index) {
  const service = companyServices()[index];
  if (!service) return;
  const used = state.works.filter(work => work.category === service.name || (Array.isArray(work.services) && work.services.includes(service.name))).length;
  const message = used
    ? `O serviço "${service.name}" é usado em ${used} obra(s). Excluir do catálogo da empresa? As obras existentes continuarão com o nome salvo.`
    : `Excluir o serviço "${service.name}"?`;
  if (!confirm(message)) return;
  state.settings.services.splice(index, 1);
  try {
    await saveState('Serviço excluído.');
    resetServiceForm();
    renderServices();
    refreshWorkServiceControls();
  } catch (error) {
    setStatus(error.message, 'error');
    await loadState();
  }
}

function updateDashboard() {
  $('dashProjects').textContent = state.works.length;
  $('dashCompleted').textContent = (Number(state.settings.completedBase) || 0) + (Number(state.settings.completedAdded) || 0);
  $('dashSync').textContent = 'Online';

  const preview = $('recentWorks');
  preview.innerHTML = '';

  state.works.slice(-4).reverse().forEach(work => {
    const el = document.createElement('div');
    el.className = 'recent-work';
    el.innerHTML = `
      <img src="${escapeHtml(work.cover || '../assets/img/logo-ejs.webp')}" alt="">
      <div>
        <strong>${escapeHtml(work.title)}</strong>
        <span>${escapeHtml(work.category || 'Reforma')} · ${escapeHtml(work.location || 'Local não informado')}</span>
      </div>`;
    preview.appendChild(el);
  });
}

function showView(name) {
  document.querySelectorAll('[data-admin-view]').forEach(el => {
    el.hidden = el.dataset.adminView !== name;
  });
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.classList.toggle('active', el.dataset.nav === name);
  });
  if (name === 'works') renderWorks();
  if (name === 'services') renderServices();
  document.body.classList.remove('admin-menu-open');
}

document.querySelectorAll('[data-nav]').forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.nav === 'new' && !button.closest('.admin-work')) resetForm();
    showView(button.dataset.nav);
  });
});

$('adminMenuToggle')?.addEventListener('click', () => document.body.classList.toggle('admin-menu-open'));

$('logout').onclick = async () => {
  try {
    await fetch('/api/logout', { method: 'POST' });
  } finally {
    window.location.replace('/admin/login.html');
  }
};

(async () => {
  if (await ensureSession()) {
    try {
      await loadState();
      resetForm();
      resetServiceForm();
      showView('home');
    } catch (error) {
      setStatus(error.message, 'error');
    }
  }
})();