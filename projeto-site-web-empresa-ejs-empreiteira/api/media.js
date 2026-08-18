import { get } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const pathname = String(req.query.pathname || '');
  if (!pathname.startsWith('ejs-cms/uploads/')) return res.status(400).end('Caminho inválido');
  try {
    const result = await get(pathname, { access: 'private' });
    if (!result || result.statusCode !== 200 || !result.stream) return res.status(404).end('Arquivo não encontrado');
    const buffer = Buffer.from(await new Response(result.stream).arrayBuffer());
    res.setHeader('Content-Type', result.blob.contentType || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
    res.setHeader('ETag', result.blob.etag);
    return res.status(200).end(buffer);
  } catch (error) {
    console.error(error);
    return res.status(404).end('Arquivo não encontrado');
  }
}
