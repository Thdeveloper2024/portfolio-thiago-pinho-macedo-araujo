import { get, put } from '@vercel/blob';

const STATE_PATH = 'ejs-cms/state.json';

export const defaultState = {
  settings: {
    whatsapp: '5511999999999',
    instagram: 'https://instagram.com/',
    cnpj: 'Não informado',
    completedBase: 0,
    completedAdded: 0
  },
  works: [
    {
      id: 'obra-1',
      title: 'Residência contemporânea fictícia',
      desc: 'Conceito visual demonstrativo com fachada moderna, iluminação arquitetônica e acabamento sofisticado.',
      cover: 'assets/img/hero-stages/07.webp',
      gallery: ['assets/img/hero-stages/07.webp'],
      counted: false,
      builtin: true
    },
    {
      id: 'obra-2',
      title: 'Projeto interno contemporâneo',
      desc: 'Ambiente renovado com materiais de visual sofisticado e iluminação valorizada.',
      cover: 'assets/img/hero-ejs.webp',
      gallery: ['assets/img/hero-ejs.webp'],
      counted: false,
      builtin: true
    },
    {
      id: 'obra-3',
      title: 'Acabamentos e manutenção',
      desc: 'Soluções sob medida para renovar, corrigir e finalizar ambientes.',
      cover: 'assets/img/logo-ejs.webp',
      gallery: ['assets/img/logo-ejs.webp'],
      counted: false,
      builtin: true
    }
  ]
};

function cleanState(input) {
  const settings = input?.settings && typeof input.settings === 'object' ? input.settings : {};
  const works = Array.isArray(input?.works) ? input.works : [];
  return {
    settings: {
      ...defaultState.settings,
      ...settings,
      completedBase: Math.max(0, Number(settings.completedBase) || 0),
      completedAdded: Math.max(0, Number(settings.completedAdded) || 0)
    },
    works: works.map((w, i) => ({
      id: String(w.id || `obra-${Date.now()}-${i}`),
      title: String(w.title || 'Obra sem título').slice(0, 160),
      desc: String(w.desc || '').slice(0, 1200),
      cover: String(w.cover || ''),
      gallery: Array.isArray(w.gallery) ? w.gallery.map(String).slice(0, 30) : [],
      coverPath: w.coverPath ? String(w.coverPath) : '',
      galleryPaths: Array.isArray(w.galleryPaths) ? w.galleryPaths.map(String).slice(0, 30) : [],
      videos: Array.isArray(w.videos) ? w.videos.map(String).slice(0, 20) : [],
      videoPaths: Array.isArray(w.videoPaths) ? w.videoPaths.map(String).slice(0, 20) : [],
      counted: Boolean(w.counted),
      builtin: Boolean(w.builtin)
    }))
  };
}

export async function readState() {
  try {
    const result = await get(STATE_PATH, { access: 'private' });
    if (!result || result.statusCode !== 200 || !result.stream) return structuredClone(defaultState);
    const text = await new Response(result.stream).text();
    return cleanState(JSON.parse(text));
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
