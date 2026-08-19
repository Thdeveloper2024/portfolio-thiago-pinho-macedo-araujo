import { get, put } from '@vercel/blob';

const STATE_PATH = 'ejs-cms/state.json';

export const defaultState = {
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
  works: [
    {
      id: 'obra-1',
      title: 'Reforma completa residencial',
      desc: 'Reforma completa com modernização dos ambientes, revisão das instalações e novos acabamentos.',
      category: 'Reforma',
      type: 'Reforma Residencial',
      location: 'São Paulo/SP',
      area: '120 m²',
      duration: '45 dias',
      year: new Date().getFullYear(),
      status: 'Concluída',
      services: ['Alvenaria', 'Elétrica', 'Hidráulica', 'Pintura', 'Gesso'],
      featured: true,
      cover: 'assets/img/hero-stages/08-todas.webp',
      gallery: ['assets/img/hero-stages/01.webp', 'assets/img/hero-stages/07.webp', 'assets/img/hero-stages/08-todas.webp'],
      videos: [],
      counted: false,
      builtin: true
    },
    {
      id: 'obra-2',
      title: 'Construção e alvenaria',
      desc: 'Execução de etapas de alvenaria, adequações e acabamento de ambiente residencial.',
      category: 'Alvenaria',
      type: 'Construção Residencial',
      location: 'São Paulo/SP',
      area: '85 m²',
      duration: '30 dias',
      year: new Date().getFullYear(),
      status: 'Concluída',
      services: ['Alvenaria'],
      featured: false,
      cover: 'assets/img/hero-stages/04.webp',
      gallery: ['assets/img/hero-stages/04.webp', 'assets/img/hero-stages/05.webp'],
      videos: [],
      counted: false,
      builtin: true
    },
    {
      id: 'obra-3',
      title: 'Pintura e acabamento residencial',
      desc: 'Preparação de superfícies, correções e pintura para renovação completa do ambiente.',
      category: 'Pintura',
      type: 'Pintura Residencial',
      location: 'São Paulo/SP',
      area: '',
      duration: '12 dias',
      year: new Date().getFullYear(),
      status: 'Concluída',
      services: ['Pintura', 'Acabamentos'],
      featured: false,
      cover: 'assets/img/hero-stages/07.webp',
      gallery: ['assets/img/hero-stages/07.webp'],
      videos: [],
      counted: false,
      builtin: true
    }
  ]
};

const text = (value, max = 400) => String(value ?? '').trim().slice(0, max);
const num = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
};

function normalizeServices(value) {
  const list = Array.isArray(value)
    ? value
    : String(value || '').split(',');
  return [...new Set(list.map(v => text(v, 80)).filter(Boolean))].slice(0, 20);
}

function slugService(value = '') {
  return text(value, 90).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `servico-${Date.now()}`;
}

function cleanCompanyServices(value) {
  const source = Array.isArray(value) ? value : defaultState.settings.services;
  const seen = new Set();
  return source.map((item, index) => {
    const name = text(item?.name || item, 80);
    if (!name) return null;
    let id = text(item?.id || slugService(name), 100);
    if (seen.has(id)) id = `${id}-${index + 1}`;
    seen.add(id);
    return {
      id,
      name,
      description: text(item?.description || '', 360),
      icon: text(item?.icon || 'tools', 40)
    };
  }).filter(Boolean).slice(0, 24);
}

function cleanWork(w, i) {
  const category = text(w?.category || 'Reforma', 50) || 'Reforma';
  const gallery = Array.isArray(w?.gallery) ? w.gallery.map(String).filter(Boolean).slice(0, 40) : [];
  const cover = text(w?.cover || gallery[0] || '', 1200);
  if (cover && !gallery.includes(cover)) gallery.unshift(cover);

  return {
    id: text(w?.id || `obra-${Date.now()}-${i}`, 180),
    title: text(w?.title || 'Obra sem título', 160),
    desc: text(w?.desc || '', 1800),
    category,
    type: text(w?.type || (category === 'Reforma' ? 'Reforma' : category), 100),
    location: text(w?.location || '', 140),
    area: text(w?.area || '', 40),
    duration: text(w?.duration || '', 60),
    year: text(w?.year || '', 4),
    status: text(w?.status || 'Concluída', 40),
    services: normalizeServices(w?.services),
    featured: Boolean(w?.featured),
    cover,
    gallery,
    coverPath: text(w?.coverPath || '', 1200),
    galleryPaths: Array.isArray(w?.galleryPaths) ? w.galleryPaths.map(String).filter(Boolean).slice(0, 40) : [],
    videos: Array.isArray(w?.videos) ? w.videos.map(String).filter(Boolean).slice(0, 20) : [],
    videoPaths: Array.isArray(w?.videoPaths) ? w.videoPaths.map(String).filter(Boolean).slice(0, 20) : [],
    counted: Boolean(w?.counted),
    builtin: Boolean(w?.builtin)
  };
}

function cleanState(input) {
  const settings = input?.settings && typeof input.settings === 'object' ? input.settings : {};
  const works = Array.isArray(input?.works) ? input.works : defaultState.works;
  const cleanedWorks = works.map(cleanWork);

  // Mantém somente uma obra como destaque principal. Se houver mais de uma,
  // a primeira continua marcada; se nenhuma estiver marcada, a primeira vira destaque.
  let foundFeatured = false;
  cleanedWorks.forEach((work, i) => {
    if (work.featured && !foundFeatured) foundFeatured = true;
    else if (work.featured && foundFeatured) work.featured = false;
    if (!foundFeatured && i === cleanedWorks.length - 1 && cleanedWorks.length) {
      cleanedWorks[0].featured = true;
    }
  });

  return {
    settings: {
      ...defaultState.settings,
      ...settings,
      whatsapp: text(settings.whatsapp || defaultState.settings.whatsapp, 40),
      phone: text(settings.phone || defaultState.settings.phone, 50),
      instagram: text(settings.instagram || defaultState.settings.instagram, 400),
      cnpj: text(settings.cnpj || defaultState.settings.cnpj, 40),
      serviceArea: text(settings.serviceArea || defaultState.settings.serviceArea, 120),
      businessHours: text(settings.businessHours || defaultState.settings.businessHours, 120),
      experienceYears: num(settings.experienceYears ?? defaultState.settings.experienceYears, 0, 100),
      satisfactionRate: num(settings.satisfactionRate ?? defaultState.settings.satisfactionRate, 0, 100),
      completedBase: num(settings.completedBase, 0),
      completedAdded: num(settings.completedAdded, 0),
      services: cleanCompanyServices(settings.services)
    },
    works: cleanedWorks
  };
}

export async function readState() {
  try {
    const result = await get(STATE_PATH, { access: 'private' });
    if (!result || result.statusCode !== 200 || !result.stream) return structuredClone(defaultState);
    const payload = await new Response(result.stream).text();
    return cleanState(JSON.parse(payload));
  } catch (error) {
    if (String(error?.message || '').toLowerCase().includes('not found')) return structuredClone(defaultState);
    console.error('readState error', error);
    return structuredClone(defaultState);
  }
}

export async function writeState(state) {
  const clean = cleanState(state);
  await put(STATE_PATH, JSON.stringify(clean), {
    access: 'private',
    contentType: 'application/json; charset=utf-8',
    allowOverwrite: true,
    addRandomSuffix: false,
    cacheControlMaxAge: 0
  });
  return clean;
}
