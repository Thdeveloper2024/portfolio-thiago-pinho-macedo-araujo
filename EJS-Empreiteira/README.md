# EJS Empreiteira — site HTML/CSS/JS

Projeto estático pronto para publicar na Vercel.

## Estrutura
- `index.html`: site principal + animação de construção.
- `obra.html`: página dinâmica de cada obra.
- `admin/login.html`: login simples do painel.
- `admin/index.html`: painel para contatos e obras.
- `assets/css/style.css`: layout responsivo.
- `assets/js/*.js`: interação, carrossel, intro e painel.

## Login inicial do painel
- Usuário: `admin`
- Senha: `EJS@2026`

> Troque essas credenciais em `assets/js/admin-login.js` antes de publicar.

## Importante sobre o painel ADM
Esta versão é 100% HTML/CSS/JS, por isso os dados e imagens adicionados pelo painel são gravados no `localStorage` do navegador. Isso funciona para demonstração e para edição no mesmo navegador, mas NÃO sincroniza alterações entre celulares/computadores.

Para transformar o painel em um CMS real na Vercel, use Supabase/Firebase/Vercel Blob para persistir imagens e dados, além de autenticação segura no servidor.

## Publicar na Vercel
1. Descompacte o projeto.
2. Envie a pasta para um repositório GitHub ou use o upload/import da Vercel.
3. Framework preset: `Other`.
4. Build command: deixe vazio.
5. Output directory: deixe vazio / raiz do projeto.
6. Deploy.

## Personalização rápida
Edite os contatos padrão em `assets/js/app.js` e/ou use o painel local.

## Atualização de acessibilidade e visual
- Controle de tema com 4 opções: Cimento claro, Areia, Escuro e Alto contraste.
- Controle de tamanho do texto: normal, A+ e A++.
- Preferências ficam salvas no navegador do visitante.
- Link “Pular para o conteúdo principal” para navegação por teclado.
- Estados de foco visíveis em botões e links.
- Nova abertura animada simulando uma obra corporativa: terreno, estrutura, lajes, fachada, vidros, acabamentos e paisagismo.
- Tema padrão agora é claro/cimento, reduzindo o uso de grandes blocos pretos e melhorando a leitura do conteúdo.


## Atualização V3
- Tema inicial definido como **Escuro** em cada nova sessão, mantendo as opções de acessibilidade disponíveis durante a navegação.
- Nova abertura com transformação de fachada em antes/depois, usando a foto final fornecida como resultado da reforma.
- O efeito é controlado em JavaScript com etapas, progresso e revelação gradual da fachada final.

## Atualização V5 — abertura em formato time-lapse vertical
A apresentação inicial foi reajustada para o formato 9:16, inspirado em vídeos de evolução de obra: terreno vazio, fundação, estrutura, alvenaria, acabamento, fachada, paisagismo e resultado final. O conteúdo é fictício e desenhado em HTML/CSS com controle por JavaScript, sem utilizar o vídeo de referência dentro do site.

## Atualização V6 — carrossel de evolução da obra
- A capa fixa foi removida da página inicial.
- O topo do site agora inicia sempre na etapa 01 e percorre automaticamente 7 imagens: terreno, fundação, estrutura, alvenaria, acabamentos, fachada e resultado final.
- O visitante pode avançar/voltar, escolher uma etapa pelos indicadores e pausar a rotação automática.
- O cabeçalho agora mostra também o texto: “Construindo sonhos. Entregando excelência.”

## Atualização V7
- Cabeçalho redesenhado em estilo escuro premium, mantendo **a mesma logo original** do projeto.
- Nome centralizado em caixa alta com maior espaçamento e subtítulo “Construindo sonhos. Entregando excelência.”.
- Botão MENU em formato retangular no desktop e compacto no celular.
- O carrossel principal continua exibindo as 7 etapas automaticamente, agora usando elementos `<img>` para maior compatibilidade em hospedagem.
- Barra superior com as 7 etapas da obra e destaque automático da etapa atual.
- A imagem de evolução completa fornecida foi incluída no projeto e pode ser aberta pelo botão “Ver evolução completa” no resultado final.
- Tema escuro volta a ser o padrão em todo novo carregamento do site; os controles de acessibilidade continuam disponíveis durante a navegação.

## Atualização V8
- Cabeçalho corrigido sem alterar o arquivo da logo EJS.
- O cabeçalho, menu e botão de acessibilidade passam a acompanhar Cimento Claro, Areia, Escuro e Alto Contraste.
- O tema padrão de uma nova sessão continua sendo Escuro; alterações de acessibilidade permanecem durante a navegação da sessão.
- Carrossel principal com entrada 3D: cada foto entra girando da esquerda para a direita e a anterior sai para a direita.
- Fundo de segurança usa a cor atual do tema enquanto uma foto ainda não carregou ou se houver falha no arquivo.


## Atualização V9
- Removidas todas as legendas e textos sobre o carrossel inicial.
- O carrossel usa as 7 imagens já ajustadas em `assets/img/hero-stages/`.
- As fotos entram sequencialmente da esquerda para a direita com rotação 3D, uma atrás da outra.
- Ao chegar à sétima imagem, o carrossel permanece no resultado final.
- Se alguma imagem ainda não tiver carregado, o fundo mantém a cor do tema atual do site.

## Atualização V11
- Botão do cabeçalho mostra apenas a palavra `Menu`, sem ícone hambúrguer.
- A apresentação principal usa os 7 recortes fotográficos em sequência progressiva.
- Cada nova foto entra girando da esquerda para a direita e permanece na tela.
- Ao final, as 7 fotos ficam visíveis juntas, formando o panorama completo.
- Não há margem lateral no carrossel: a primeira e a última imagem encostam nas laterais da página.
- Legendas e títulos sobre as imagens foram removidos.

## Atualização V12
- Cabeçalho responsivo para celulares e telas pequenas.
- Botão MENU sem a linha herdada do antigo ícone hambúrguer e com texto centralizado.
- Recortes 01 a 07 processados para remover bordas brancas externas e frestas entre as etapas.
- Sequência visual mais rápida (aprox. 1,05 s entre novas fotos).
- Ao concluir as sete etapas, uma mensagem institucional aparece com os botões “Fazer orçamento” e “Ver mais”.

## Atualização V13
- Imagens críticas convertidas para WebP e reduzidas para acelerar o carregamento inicial.
- Primeira etapa da apresentação com preload/fetchpriority alto; demais imagens usam decodificação assíncrona.
- Seções abaixo da dobra usam content-visibility para reduzir trabalho de renderização inicial.
- Em telas menores, o cabeçalho fica mais alto e o botão MENU vira apenas um ícone hambúrguer.
- Portfólio permite arrastar horizontalmente com scroll-snap, leve rotação 3D e setas anterior/próximo.
- Card final da apresentação recebeu botão X para fechar.
