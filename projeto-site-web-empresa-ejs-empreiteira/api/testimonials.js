import { isAuthenticated } from '../lib/auth.js';
import { readState, writeState } from '../lib/cms.js';

const clean = (value, max) => String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, max);

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    const state = await readState();
    return res.status(200).json({ testimonials: state.testimonials || [] });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      // honeypot simples para robôs
      if (clean(body.website, 120)) return res.status(200).json({ ok: true });
      const name = clean(body.name, 100);
      const message = clean(body.message, 900);
      const location = clean(body.location, 120);
      const project = clean(body.project, 140);
      const rating = Math.max(1, Math.min(5, Number(body.rating) || 5));
      if (name.length < 2 || message.length < 10) return res.status(400).json({ error: 'Informe seu nome e um depoimento com pelo menos 10 caracteres.' });

      const state = await readState();
      state.testimonials = Array.isArray(state.testimonials) ? state.testimonials : [];
      state.testimonials.push({
        id: `depoimento-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name, location, project, message, rating,
        createdAt: new Date().toISOString(),
        source: 'cliente'
      });
      const saved = await writeState(state);
      return res.status(201).json({ ok: true, testimonial: saved.testimonials[saved.testimonials.length - 1] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Não foi possível enviar o depoimento agora.' });
    }
  }

  if (req.method === 'DELETE') {
    if (!isAuthenticated(req)) return res.status(401).json({ error: 'Sessão expirada.' });
    const id = clean(req.query?.id, 180);
    if (!id) return res.status(400).json({ error: 'Depoimento inválido.' });
    const state = await readState();
    state.testimonials = (state.testimonials || []).filter(item => item.id !== id);
    await writeState(state);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Método não permitido.' });
}
