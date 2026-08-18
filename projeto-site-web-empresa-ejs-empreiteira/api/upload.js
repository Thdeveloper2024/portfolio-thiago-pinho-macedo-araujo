import { put } from '@vercel/blob';
import { isAuthenticated } from '../lib/auth.js';

function safeName(name = 'arquivo.bin') {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]+/g, '-').slice(-100);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Sessão expirada.' });
  const type = req.headers['content-type'] || '';
  const isImage = type.startsWith('image/');
  const isVideo = type.startsWith('video/');
  if (!isImage && !isVideo) return res.status(400).json({ error: 'Envie apenas imagens ou vídeos.' });
  const size = Number(req.headers['content-length'] || 0);
  const limit = isVideo ? 80 * 1024 * 1024 : 12 * 1024 * 1024;
  if (size > limit) return res.status(413).json({ error: isVideo ? 'O vídeo deve ter no máximo 80 MB.' : 'A imagem deve ter no máximo 12 MB.' });
  const original = safeName(String(req.query.filename || 'arquivo.bin'));
  const pathname = `ejs-cms/uploads/${Date.now()}-${original}`;
  try {
    const blob = await put(pathname, req, {
      access: 'private',
      contentType: type,
      addRandomSuffix: true,
      cacheControlMaxAge: 31536000
    });
    const proxyUrl = `/api/media?pathname=${encodeURIComponent(blob.pathname)}`;
    return res.status(200).json({ ok: true, pathname: blob.pathname, url: proxyUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Falha ao enviar o arquivo para o Vercel Blob.' });
  }
}

export const config = { api: { bodyParser: false } };
