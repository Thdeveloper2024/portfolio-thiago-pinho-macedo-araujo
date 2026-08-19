# EJS Empreiteira — V31 Novo Visual + Portfólio Completo

## Visão geral

Esta versão recria o visual público da EJS Empreiteira com base no layout de referência aprovado, mantendo a paleta atual do projeto:

- carvão / preto;
- branco / marfim;
- café / marrom;
- areia;
- dourado EJS (`#d9a441`).

O projeto continua preparado para Vercel, Vercel Blob privado, painel administrativo e cadastro de fotos/vídeos.

## Principais mudanças da V31

### Site público

- novo cabeçalho desktop e mobile;
- hero principal voltado para construção e reforma;
- serviços de Demolição, Alvenaria, Pintura, Elétrica, Gesso e Hidráulica;
- indicadores de obras, satisfação, experiência e qualidade;
- seção de obras em destaque;
- depoimento;
- seção institucional;
- faixa de contato;
- novo rodapé;
- botão flutuante de WhatsApp;
- barra fixa de WhatsApp/Orçamento no celular.

### Nova página `obras.html`

A página de portfólio agora possui:

- banner “Nossas Obras”;
- filtros por categoria;
- obra em destaque;
- cards com foto, categoria, localização e descrição;
- página responsiva para desktop, tablet e celular;
- acesso à página detalhada de cada obra.

### Nova página detalhada da obra

`obra.html` exibe:

- título;
- categoria;
- tipo do projeto;
- localização;
- status;
- área;
- prazo;
- ano;
- descrição;
- serviços executados;
- galeria completa;
- vídeos;
- orçamento via WhatsApp.

O manipulador responsivo de mídia foi preservado. Fotos verticais, quadradas e horizontais continuam sendo exibidas sem deformação.

## Novos campos no cadastro de obras

No painel ADM foram adicionados:

- Título da obra
- Categoria principal
- Tipo de projeto
- Localização
- Descrição completa
- Área
- Prazo de execução
- Ano de conclusão
- Status
- Serviços executados
- Marcação “Obra em destaque”
- Imagem principal
- Fotos adicionais
- Vídeos

Os novos campos são salvos no mesmo CMS online e permanecem compatíveis com obras cadastradas em versões anteriores.

## Novas configurações da empresa

Também foram incluídos no ADM:

- WhatsApp
- Telefone
- Instagram
- CNPJ
- Área de atendimento
- Horário de atendimento
- Anos de experiência
- Índice de satisfação
- Contagem inicial de obras finalizadas

## Estrutura principal

```text
/
├── index.html
├── obras.html
├── obra.html
├── login.html
├── package.json
├── vercel.json
├── admin/
│   ├── index.html
│   └── login.html
├── api/
│   ├── cms.js
│   ├── login.js
│   ├── logout.js
│   ├── media.js
│   ├── session.js
│   └── upload.js
├── lib/
│   ├── auth.js
│   └── cms.js
└── assets/
    ├── css/
    │   └── style.css
    ├── img/
    └── js/
        ├── accessibility.js
        ├── admin-login.js
        ├── admin.js
        ├── app.js
        ├── obras.js
        ├── project.js
        └── site-common.js
```

## Persistência e compatibilidade

O estado continua armazenado em:

```text
ejs-cms/state.json
```

As obras antigas continuam sendo aceitas. Quando campos novos não existem em um projeto anterior, o CMS aplica valores padrão sem quebrar o site.

## Mídia responsiva

A página da obra detecta automaticamente a proporção real de imagens e vídeos.

- `object-fit: contain` preserva a mídia original;
- fotos não são esticadas;
- fotos não são cortadas;
- imagens verticais recebem fundo visual no desktop para aproveitar o espaço;
- no mobile a mídia ocupa uma área adaptada à tela;
- vídeos usam a mesma lógica de proporção.

## Deploy

1. Envie todos os arquivos para o mesmo projeto na Vercel.
2. Mantenha o Vercel Blob conectado.
3. Configure as variáveis administrativas já usadas pelo projeto:
   - `ADMIN_USER`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
4. Faça um novo deploy.
5. Acesse `/admin/login.html`.
6. Edite as obras antigas para preencher os novos campos quando desejar.

## Rotas

```text
/               → página inicial
/obras.html     → portfólio
/obra.html?id=  → detalhes da obra
/admin          → login administrativo
/admin/index.html
/api/cms
/api/upload
/api/media
```

Também foram adicionados atalhos `/obras` e `/obra` no `vercel.json`.

## Versão

**EJS Empreiteira V31 — Novo Visual + Portfólio Completo**
