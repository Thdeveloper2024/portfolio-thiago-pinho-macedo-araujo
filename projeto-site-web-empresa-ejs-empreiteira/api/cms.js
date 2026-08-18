import { isAuthenticated } from '../lib/auth.js';
import { readState, writeState } from '../lib/cms.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') {
    const state = await readState();
    return res.status(200).json(state);
  }
  if (req.method === 'PUT') {
    if (!isAuthenticated(req)) return res.status(401).json({ error: 'Sessão expirada.' });
    try {
      const saved = await writeState(req.body || {});
      return res.status(200).json({ ok: true, state: saved });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Não foi possível salvar os dados no Vercel Blob.' });
    }
  }
  return res.status(405).json({ error: 'Método não permitido.' });
}
