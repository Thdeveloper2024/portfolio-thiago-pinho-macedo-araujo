import { createSessionCookie, validCredentials } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });
  const { user = '', password = '' } = req.body || {};
  if (!validCredentials(String(user).trim(), String(password))) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
  }
  res.setHeader('Set-Cookie', createSessionCookie());
  return res.status(200).json({ ok: true });
}
