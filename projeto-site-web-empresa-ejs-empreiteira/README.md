# EJS Empreiteira — V22 Online (Vercel Blob + OIDC)

Projeto HTML/CSS/JS pronto para Vercel, com painel administrativo e persistência online.

## O que mudou nesta versão
- O painel não usa mais `localStorage` para obras e configurações.
- Obras, CNPJ, WhatsApp, Instagram e contador são salvos online no Vercel Blob.
- Imagens cadastradas pelo ADM são enviadas ao Blob privado e servidas ao site por `/api/media`.
- O site público e `obra.html` carregam os mesmos dados em qualquer dispositivo.
- Login administrativo usa cookie HttpOnly e rotas de API.
- O Blob conectado via OIDC funciona sem `BLOB_READ_WRITE_TOKEN` fixo quando o projeto está conectado ao Store na Vercel.

## Estrutura nova
- `/api/login.js` — autenticação ADM.
- `/api/logout.js` — encerra sessão.
- `/api/session.js` — valida sessão.
- `/api/cms.js` — lê/salva configurações e obras.
- `/api/upload.js` — envia imagens ao Blob privado.
- `/api/media.js` — entrega as imagens privadas no site público.
- `/lib/auth.js` e `/lib/cms.js` — lógica do servidor.
- `package.json` — dependência `@vercel/blob`.

## Vercel Blob / OIDC
O Store Blob precisa estar conectado ao MESMO projeto Vercel que hospeda este site. A conexão OIDC atual cria `BLOB_STORE_ID` e fornece credenciais temporárias automaticamente às Functions. Não exponha tokens no JavaScript do navegador.

Depois de enviar esta versão ao GitHub, faça um novo deploy na Vercel.

## Credenciais administrativas
Para maior segurança, crie estas variáveis em Vercel > Project Settings > Environment Variables:
- `ADMIN_USER`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET` (uma sequência longa e aleatória)

Se essas variáveis ainda não existirem, esta versão mantém temporariamente as credenciais que já estavam no projeto enviado:
- usuário: `barriga@123456`
- senha: `ejs@2026`

Recomenda-se configurar as três variáveis antes de usar o painel em produção.

## Rotas
- Site: `/index.html`
- Login: `/admin/login.html`
- Painel: `/admin/index.html`

## Teste de sincronização
1. Faça deploy.
2. Entre em `/admin/login.html`.
3. Em Configurações, altere o CNPJ ou WhatsApp e salve.
4. Abra o site em outro celular ou janela anônima.
5. O novo valor deve aparecer.
6. Cadastre uma obra com imagem e confirme que ela aparece também em outro dispositivo.

## Observação
O Blob criado pelo usuário está em modo privado. Por isso as imagens cadastradas no painel não são usadas por URL direta do Blob; o site as entrega através da Function `/api/media`.

## Atualização V24 — mídia das obras
- Página individual da obra agora exibe fotos e vídeos em um carrossel horizontal, com arraste por toque/mouse, setas e indicadores.
- Painel ADM aceita vídeos MP4/WebM/MOV além de fotos.
- Vídeos são armazenados no Vercel Blob privado e exibidos ao cliente através de `/api/media`.
- Página individual da obra recebeu rodapé completo da EJS, mantendo o mesmo padrão do site principal.

## Atualização V26
- Rodapé desktop voltou ao layout horizontal original: marca à esquerda, links sociais à direita e copyright centralizado abaixo.
- Rodapé mobile permanece centralizado.
- WhatsApp flutuante permanece fixo durante toda a rolagem e foi reposicionado para não encostar/cortar na lateral da viewport.
- Ícone do WhatsApp centralizado dentro do círculo.
- Em celulares, a mensagem exibida ao concluir o carrossel agora aparece abaixo da imagem, com texto maior, mantendo o panorama totalmente visível.


## V27 — ajustes finais mobile
- Recarregar/atualizar a página inicial sempre volta ao topo e reinicia o carrossel.
- Card institucional final corrigido no mobile e posicionado abaixo da imagem, sem cobrir o panorama.
- WhatsApp flutuante movido para fora do rodapé, acompanha a viewport durante a rolagem e aparece somente em telas de até 620px.
- Botão flutuante removido do desktop.
