import { get } from '@vercel/blob';
import { Readable } from 'node:stream';
export default async function handler(req,res){
  if(req.method!=='GET'&&req.method!=='HEAD')return res.status(405).end();
  const pathname=String(req.query.pathname||'');
  if(!pathname.startsWith('ejs-cms/uploads/'))return res.status(400).end('Caminho inválido');
  try{
    const result=await get(pathname,{access:'private'});
    if(!result||result.statusCode!==200||!result.stream)return res.status(404).end('Arquivo não encontrado');
    const type=result.blob.contentType||'application/octet-stream';
    res.setHeader('Content-Type',type);res.setHeader('Accept-Ranges','bytes');
    res.setHeader('Cache-Control','public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400');
    if(result.blob.etag)res.setHeader('ETag',result.blob.etag);
    if(req.method==='HEAD')return res.status(200).end();
    const range=req.headers.range;
    if(!range){Readable.fromWeb(result.stream).pipe(res);return;}
    const buffer=Buffer.from(await new Response(result.stream).arrayBuffer()),total=buffer.length;
    const m=/^bytes=(\d*)-(\d*)$/.exec(range);if(!m){res.setHeader('Content-Length',total);return res.status(200).end(buffer);}
    let start=m[1]?Number(m[1]):0,end=m[2]?Number(m[2]):total-1;
    if(!m[1]&&m[2]){const suffix=Number(m[2]);start=Math.max(0,total-suffix);end=total-1;}
    start=Math.max(0,Math.min(start,total-1));end=Math.max(start,Math.min(end,total-1));
    const chunk=buffer.subarray(start,end+1);res.statusCode=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${total}`);res.setHeader('Content-Length',chunk.length);return res.end(chunk);
  }catch(error){console.error(error);return res.status(404).end('Arquivo não encontrado');}
}
