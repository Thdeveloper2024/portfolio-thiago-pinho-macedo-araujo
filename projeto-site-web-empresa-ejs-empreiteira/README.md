# EJS Empreiteira — documentação completa do sistema

Este documento explica a arquitetura, a instalação, a publicação, o painel administrativo, o modelo de dados, as APIs, as regras de negócio e a manutenção do site da **EJS Empreiteira**.

O pacote contém um site institucional responsivo com portfólio de obras, página individual de projeto, catálogo de serviços, depoimentos, contato por WhatsApp, recursos de acessibilidade e painel administrativo conectado ao Vercel Blob.

## Sumário

1. [Visão geral](#1-visão-geral)
2. [Recursos do sistema](#2-recursos-do-sistema)
3. [Tecnologias e arquitetura](#3-tecnologias-e-arquitetura)
4. [Estrutura de arquivos](#4-estrutura-de-arquivos)
5. [Requisitos](#5-requisitos)
6. [Configuração das variáveis de ambiente](#6-configuração-das-variáveis-de-ambiente)
7. [Instalação e execução local](#7-instalação-e-execução-local)
8. [Publicação na Vercel](#8-publicação-na-vercel)
9. [Rotas e páginas](#9-rotas-e-páginas)
10. [Painel administrativo](#10-painel-administrativo)
11. [Fluxos de uso](#11-fluxos-de-uso)
12. [Persistência no Vercel Blob](#12-persistência-no-vercel-blob)
13. [Modelo de dados](#13-modelo-de-dados)
14. [APIs](#14-apis)
15. [Autenticação e segurança](#15-autenticação-e-segurança)
16. [Fotos, vídeos e mídia responsiva](#16-fotos-vídeos-e-mídia-responsiva)
17. [Temas e acessibilidade](#17-temas-e-acessibilidade)
18. [Regras de negócio](#18-regras-de-negócio)
19. [Personalização visual e de conteúdo](#19-personalização-visual-e-de-conteúdo)
20. [Backup, manutenção e limitações](#20-backup-manutenção-e-limitações)
21. [Solução de problemas](#21-solução-de-problemas)
22. [Checklist de testes](#22-checklist-de-testes)
23. [Histórico funcional do pacote](#23-histórico-funcional-do-pacote)

---

## 1. Visão geral

O sistema possui duas áreas principais:

- **Site público:** apresenta a empresa, serviços, obras, depoimentos, indicadores, canais de contato e orçamento via WhatsApp.
- **Painel administrativo:** permite alterar dados da empresa, cadastrar serviços, publicar e editar obras, administrar mídias e gerenciar depoimentos.

O front-end é composto por HTML, CSS e JavaScript sem framework. As operações online são realizadas por funções serverless em `api/`. O conteúdo persistente fica em um arquivo JSON privado no Vercel Blob, e as imagens e vídeos enviados pelo painel também ficam em armazenamento privado.

### Fluxo resumido

```text
Visitante ou administrador
          ↓
Páginas HTML + JavaScript no navegador
          ↓
Funções serverless em /api
          ↓
Vercel Blob privado
  ├── ejs-cms/state.json
  └── ejs-cms/uploads/*
```

---

## 2. Recursos do sistema

### Site público

- Página inicial institucional.
- Hero com chamada para orçamento.
- Catálogo dinâmico de serviços.
- Exibição das três primeiras obras na página inicial.
- Portfólio completo com filtros por serviço ou categoria.
- Uma obra principal em destaque.
- Página individual de cada obra.
- Galeria de fotos e vídeos.
- Identificação automática de mídia horizontal, vertical, quadrada, ultrawide ou retrato alto.
- Links automáticos para WhatsApp com mensagem de orçamento.
- Indicadores de obras entregues, satisfação e experiência.
- Depoimentos cadastrados pelo administrador ou enviados por clientes.
- Rodapé permanentemente escuro.
- Card de contato branco dentro do rodapé escuro.
- Botão flutuante de WhatsApp no desktop.
- Barra fixa de WhatsApp e orçamento no celular.
- Botão **Voltar** apenas nas páginas internas.
- Layout responsivo para desktop, tablet e celular.

### Painel administrativo

- Login protegido por sessão assinada.
- Dashboard com quantidade de projetos, obras finalizadas e depoimentos.
- Cadastro, edição e exclusão de obras.
- Definição da obra em destaque.
- Upload de imagem principal, fotos adicionais e vídeos.
- Inclusão e remoção de mídias durante a edição.
- Cadastro, edição e exclusão de serviços.
- Catálogo visual de ícones para serviços.
- Atualização automática das referências quando um serviço é renomeado.
- Cadastro e exclusão de depoimentos.
- Configuração dos dados da empresa.
- Sincronização online com Vercel Blob.

### Acessibilidade visual

- Link “Pular para o conteúdo principal”.
- Menu acessível por teclado.
- Temas Claro, Areia, Escuro e Contraste.
- Tamanhos de texto normal, grande e extragrande.
- Atributos ARIA em menus, botões, galeria e controles.
- Texto alternativo nas imagens principais.

---

## 3. Tecnologias e arquitetura

| Camada | Tecnologia | Responsabilidade |
|---|---|---|
| Interface | HTML5 | Estrutura das páginas públicas e administrativas |
| Estilo | CSS3 | Layout, temas, responsividade e componentes |
| Front-end | JavaScript puro | Renderização dinâmica, formulários, galeria e integração com APIs |
| Back-end | Funções serverless JavaScript | Login, sessão, CMS, depoimentos, uploads e entrega de mídia |
| Persistência | Vercel Blob privado | Estado JSON, imagens e vídeos |
| Hospedagem | Vercel | Páginas, redirects e funções `/api` |
| Dependência NPM | `@vercel/blob` | Leitura e gravação no armazenamento Blob |
| Fonte | Google Fonts — Montserrat | Tipografia do site e do painel |

### Características importantes

- Não existe banco SQL neste pacote.
- O conteúdo do CMS é centralizado em um único arquivo JSON.
- O site público possui dados de fallback para continuar exibindo conteúdo básico se a API não estiver disponível.
- O painel administrativo depende das APIs e do Vercel Blob para funcionar corretamente.
- Não há etapa de build configurada; os arquivos públicos são servidos diretamente.

---

## 4. Estrutura de arquivos

```text
/
├── index.html                 # Página inicial
├── obras.html                 # Portfólio e filtros
├── obra.html                  # Estrutura da página individual
├── login.html                 # Redirecionado para o login administrativo
├── package.json               # Dependência @vercel/blob
├── vercel.json                # Redirects e atalhos de rota
├── README.md                  # Esta documentação
│
├── admin/
│   ├── index.html             # Painel administrativo
│   └── login.html             # Formulário de login
│
├── api/
│   ├── cms.js                 # Leitura pública e gravação autenticada do estado
│   ├── login.js               # Validação de credenciais e criação da sessão
│   ├── logout.js              # Encerramento da sessão
│   ├── media.js               # Proxy para mídias privadas do Blob
│   ├── session.js             # Verificação da sessão administrativa
│   ├── testimonials.js        # Leitura, envio público e exclusão autenticada
│   └── upload.js              # Upload autenticado de imagens e vídeos
│
├── lib/
│   ├── auth.js                # Cookie, assinatura e credenciais
│   └── cms.js                 # Estado padrão, normalização e persistência
│
└── assets/
    ├── css/
    │   └── style.css          # Todo o estilo público e administrativo
    ├── img/
    │   ├── logo-ejs.webp
    │   ├── hero-ejs.webp
    │   ├── whatsapp.svg
    │   ├── fachada-ficticia.svg
    │   └── hero-stages/       # Imagens locais de demonstração
    └── js/
        ├── accessibility.js   # Temas e tamanho do texto
        ├── admin-login.js     # Login e redirecionamento de sessão
        ├── admin.js           # Toda a gestão do painel
        ├── app.js             # Página inicial
        ├── icons.js           # Catálogo local de ícones SVG
        ├── obras.js           # Portfólio e filtros
        ├── project.js         # Página detalhada e galeria
        └── site-common.js     # Funções compartilhadas do site público
```

---

## 5. Requisitos

Para executar o sistema completo, são necessários:

- Conta na Vercel.
- Projeto hospedado na Vercel.
- Vercel Blob conectado ao projeto.
- Node.js em versão LTS atual.
- NPM.
- Variáveis administrativas configuradas.
- Navegador moderno com suporte a JavaScript, `fetch`, CSS Grid e WebP.

Para apenas visualizar o HTML localmente, um servidor estático é suficiente, mas login, CMS, depoimentos e upload não funcionarão sem as funções serverless.

---

## 6. Configuração das variáveis de ambiente

Configure as seguintes variáveis no projeto da Vercel:

| Variável | Obrigatória | Uso |
|---|---:|---|
| `ADMIN_USER` | Sim | Usuário do painel administrativo |
| `ADMIN_PASSWORD` | Sim | Senha do painel administrativo |
| `ADMIN_SESSION_SECRET` | Sim | Chave usada para assinar o cookie da sessão |
| Credencial do Vercel Blob | Sim | Fornecida pela integração do Blob conectada ao projeto |

Exemplo para desenvolvimento local em `.env.local`:

```env
ADMIN_USER=seu_usuario_administrativo
ADMIN_PASSWORD=uma_senha_forte_e_exclusiva
ADMIN_SESSION_SECRET=uma_chave_aleatoria_longa_e_dificil_de_adivinhar
```

Ao conectar o Vercel Blob, use a credencial disponibilizada pela própria integração no ambiente. Não coloque tokens, senhas ou segredos dentro de arquivos públicos, HTML ou JavaScript do navegador.

### Recomendações

- Use uma senha exclusiva para este painel.
- Use um segredo de sessão longo e aleatório.
- Configure as variáveis separadamente em Production, Preview e Development quando necessário.
- Não confie nos valores de fallback existentes no código para produção.
- Troque as credenciais imediatamente se o pacote tiver sido compartilhado publicamente.

---

## 7. Instalação e execução local

### 7.1 Instalar dependências

Na raiz do projeto:

```bash
npm install
```

### 7.2 Executar o sistema completo

Use o ambiente de desenvolvimento da Vercel para carregar páginas e funções serverless:

```bash
npx vercel dev
```

Depois, abra o endereço informado no terminal.

### 7.3 Apenas visualizar as páginas estáticas

É possível usar qualquer servidor HTTP estático. Nesse modo:

- o site poderá usar os dados de fallback do front-end;
- o painel administrativo não salvará dados;
- o login não funcionará;
- uploads não funcionarão;
- depoimentos não serão enviados.

Evite abrir os arquivos diretamente por `file://`, pois caminhos absolutos como `/api/cms` e algumas regras do navegador não funcionarão corretamente.

---

## 8. Publicação na Vercel

### Opção A — integração com repositório

1. Envie a pasta para um repositório Git.
2. Importe o repositório na Vercel.
3. Conecte um Vercel Blob ao projeto.
4. Configure `ADMIN_USER`, `ADMIN_PASSWORD` e `ADMIN_SESSION_SECRET`.
5. Faça o deploy.
6. Abra `/admin/login.html` e teste o acesso.

### Opção B — Vercel CLI

Na raiz do projeto:

```bash
npx vercel
```

Para publicar em produção:

```bash
npx vercel --prod
```

### Após o deploy

Confirme:

- página inicial carregando;
- portfólio abrindo;
- login administrativo funcionando;
- status “Online” no painel;
- cadastro de uma obra de teste;
- imagem entregue por `/api/media`;
- envio de depoimento;
- links do WhatsApp;
- layout mobile.

---

## 9. Rotas e páginas

| Rota | Acesso | Descrição |
|---|---|---|
| `/` ou `/index.html` | Público | Página inicial |
| `/obras` ou `/obras.html` | Público | Portfólio completo |
| `/obra?id=ID` ou `/obra.html?id=ID` | Público | Página individual da obra |
| `/admin` | Público, redireciona | Login administrativo |
| `/admin/login.html` | Público | Formulário de login |
| `/admin/index.html` | Sessão obrigatória | Painel administrativo |
| `/login` ou `/login.html` | Público, redireciona | Login administrativo |

Os redirects estão definidos em `vercel.json` e não são permanentes.

### Identificação da obra

A página individual recebe o ID pela query string:

```text
/obra.html?id=obra-123456789
```

Se o ID não existir, o código tenta exibir a primeira obra disponível. Se não houver nenhuma obra, apresenta a mensagem “Obra não encontrada”.

---

## 10. Painel administrativo

### 10.1 Início

Exibe:

- total de projetos publicados;
- contagem pública de obras finalizadas;
- total de depoimentos;
- status de sincronização;
- quatro projetos mais recentes.

### 10.2 Cadastrar obras

Campos disponíveis:

| Grupo | Campo | Observação |
|---|---|---|
| Identificação | Título | Obrigatório; até 160 caracteres |
| Identificação | Categoria principal | Reforma ou serviço cadastrado |
| Identificação | Tipo de projeto | Até 100 caracteres |
| Identificação | Localização | Até 140 caracteres |
| Identificação | Descrição | Até 1.800 caracteres |
| Detalhes | Área | Texto livre, por exemplo `120 m²` |
| Detalhes | Prazo | Texto livre, por exemplo `45 dias` |
| Detalhes | Ano | Entre 1990 e 2100 no formulário |
| Detalhes | Status | Concluída, Em andamento ou Planejada |
| Detalhes | Serviços | Seleção múltipla do catálogo |
| Detalhes | Destaque | Define o projeto principal |
| Mídia | Imagem principal | Obrigatória em nova obra |
| Mídia | Fotos adicionais | Seleção múltipla |
| Mídia | Vídeos | MP4, WebM ou MOV no formulário |

Ao publicar, a obra é salva no estado do CMS. Se estiver concluída e não for uma obra interna de demonstração, também entra na contagem automática de obras finalizadas.

### 10.3 Obras cadastradas

Permite:

- visualizar capa, título, categoria, status e localização;
- editar todos os dados;
- trocar a imagem principal;
- adicionar novas fotos e vídeos;
- remover referências de mídias existentes;
- excluir a obra;
- alterar o destaque.

### 10.4 Serviços

Cada serviço possui:

- ID interno;
- nome;
- descrição;
- ícone.

O catálogo possui ícones para ferramentas, demolição, alvenaria, pintura, elétrica, gesso, hidráulica, martelo, furadeira, manutenção, construção, telhado, pisos, revestimentos, impermeabilização, marcenaria, solda, limpeza pós-obra, drywall, grama, paisagismo, concreto, andaime e escadas.

Ao renomear um serviço, o painel atualiza o nome correspondente nas categorias e nas listas de serviços das obras existentes. Ao excluir um serviço, ele sai do catálogo, mas o nome já salvo em obras existentes pode permanecer nessas obras.

### 10.5 Depoimentos

O administrador pode:

- cadastrar nome, localização, projeto, mensagem e avaliação;
- visualizar a origem do depoimento;
- excluir depoimentos enviados pelo cliente ou cadastrados pelo painel.

### 10.6 Configurações

Campos disponíveis:

- WhatsApp;
- telefone;
- Instagram;
- CNPJ;
- área de atendimento;
- horário de atendimento;
- anos de experiência;
- índice de satisfação;
- contagem inicial de obras finalizadas.

O total público de obras é calculado assim:

```text
obras exibidas = completedBase + completedAdded
```

---

## 11. Fluxos de uso

### Publicar uma nova obra

1. Entre em `/admin/login.html`.
2. Abra **Cadastrar obras**.
3. Informe título e categoria.
4. Preencha os detalhes técnicos.
5. Selecione os serviços executados.
6. Marque **Obra em destaque** se necessário.
7. Selecione uma imagem principal.
8. Adicione fotos e vídeos opcionais.
9. Clique em **Publicar obra**.
10. Aguarde a confirmação de sincronização.
11. Confira em `/obras.html` e na página individual.

### Editar uma obra

1. Abra **Obras cadastradas**.
2. Clique em **Editar**.
3. Altere os campos desejados.
4. Para trocar a capa, selecione outra imagem principal.
5. Use os campos adicionais para somar novas mídias.
6. Remova fotos ou vídeos usando os botões da lista de arquivos atuais.
7. Clique em **Salvar alterações**.

### Cadastrar um serviço

1. Abra **Serviços**.
2. Informe nome e descrição.
3. Selecione um ícone.
4. Clique em **Cadastrar serviço**.
5. O serviço aparecerá no site, nos filtros e no cadastro das obras.

### Atualizar dados da empresa

1. Abra **Configurações**.
2. Atualize os dados.
3. Clique em **Salvar configurações**.
4. Confira cabeçalho, indicadores, contatos e rodapé.

---

## 12. Persistência no Vercel Blob

### Estado do CMS

O estado principal é gravado em:

```text
ejs-cms/state.json
```

Esse arquivo contém:

- `settings`: dados da empresa e serviços;
- `works`: obras cadastradas;
- `testimonials`: depoimentos.

O arquivo é salvo como privado, sem sufixo aleatório e com sobrescrita permitida.

### Mídias

Os uploads são salvos abaixo de:

```text
ejs-cms/uploads/
```

Como o Blob é privado, o navegador não recebe diretamente a URL privada. O sistema gera um endereço interno semelhante a:

```text
/api/media?pathname=ejs-cms%2Fuploads%2F...
```

### Fallback

Se `state.json` não existir ou ocorrer erro de leitura, `lib/cms.js` devolve o estado padrão com configurações, serviços e três obras demonstrativas.

O front-end também possui fallback em `assets/js/site-common.js`, útil para manter conteúdo básico quando a API pública não responder.

---

## 13. Modelo de dados

### Estrutura principal

```json
{
  "settings": {},
  "works": [],
  "testimonials": []
}
```

### `settings`

| Campo | Tipo | Descrição |
|---|---|---|
| `whatsapp` | string | Número com código do país e DDD |
| `phone` | string | Telefone exibido |
| `instagram` | string | URL do perfil |
| `cnpj` | string | CNPJ exibido no rodapé |
| `serviceArea` | string | Região atendida |
| `businessHours` | string | Horário de atendimento |
| `experienceYears` | number | Anos de experiência, de 0 a 100 |
| `satisfactionRate` | number | Percentual, de 0 a 100 |
| `completedBase` | number | Contagem manual inicial |
| `completedAdded` | number | Contagem automática do painel |
| `services` | array | Catálogo de serviços |
| `schemaVersion` | number | Versão interna do esquema; atualmente 34 |

### Serviço

```json
{
  "id": "impermeabilizacao",
  "name": "Impermeabilização",
  "description": "Descrição do serviço.",
  "icon": "waterproof"
}
```

Limites aplicados pelo servidor:

- até 24 serviços no catálogo;
- nome com até 80 caracteres;
- descrição com até 360 caracteres;
- chave do ícone com até 40 caracteres.

### Obra

```json
{
  "id": "obra-123456789",
  "title": "Reforma residencial",
  "desc": "Descrição completa.",
  "category": "Reforma",
  "type": "Reforma Residencial",
  "location": "São Paulo/SP",
  "area": "120 m²",
  "duration": "45 dias",
  "year": "2026",
  "status": "Concluída",
  "services": ["Alvenaria", "Pintura"],
  "featured": true,
  "cover": "/api/media?pathname=...",
  "gallery": ["/api/media?pathname=..."],
  "videos": [],
  "coverPath": "ejs-cms/uploads/...",
  "galleryPaths": [],
  "videoPaths": [],
  "counted": true,
  "builtin": false
}
```

Limites principais:

- até 20 serviços relacionados por obra;
- até 40 fotos na galeria;
- até 20 vídeos;
- título até 160 caracteres;
- descrição até 1.800 caracteres;
- categoria até 50 caracteres;
- localização até 140 caracteres.

### Depoimento

```json
{
  "id": "depoimento-123456789-abc123",
  "name": "Cliente EJS",
  "location": "São Paulo/SP",
  "project": "Reforma residencial",
  "message": "Texto do depoimento.",
  "rating": 5,
  "createdAt": "2026-01-01T12:00:00.000Z",
  "source": "cliente"
}
```

Limites:

- máximo de 200 depoimentos mantidos no estado;
- nome até 100 caracteres;
- localização até 120;
- projeto até 140;
- mensagem até 900;
- avaliação de 1 a 5.

---

## 14. APIs

### Resumo

| Endpoint | Método | Autenticação | Função |
|---|---|---:|---|
| `/api/login` | POST | Não | Validar credenciais e criar sessão |
| `/api/logout` | POST | Não | Limpar cookie de sessão |
| `/api/session` | GET | Cookie | Informar se a sessão é válida |
| `/api/cms` | GET | Não | Ler estado público |
| `/api/cms` | PUT | Sim | Salvar o estado completo |
| `/api/upload` | POST | Sim | Enviar imagem ou vídeo |
| `/api/media` | GET/HEAD | Não | Entregar mídia privada autorizada pelo caminho |
| `/api/testimonials` | GET | Não | Listar depoimentos |
| `/api/testimonials` | POST | Não | Receber depoimento público |
| `/api/testimonials?id=...` | DELETE | Sim | Excluir depoimento |

### `/api/login`

Corpo JSON:

```json
{
  "user": "usuario",
  "password": "senha"
}
```

Em caso de sucesso, cria o cookie `ejs_admin_session`.

### `/api/cms`

- `GET`: retorna o estado completo normalizado.
- `PUT`: recebe o estado completo, normaliza os campos e grava `state.json`.
- Respostas usam `Cache-Control: no-store`.
- O método `PUT` exige sessão administrativa.

### `/api/upload`

- Aceita o arquivo bruto no corpo da requisição.
- O `Content-Type` deve começar com `image/` ou `video/`.
- A sessão administrativa é obrigatória.
- O nome original é higienizado.
- A resposta retorna `pathname` e a URL interna de mídia.

Limites:

| Tipo | Limite por arquivo |
|---|---:|
| Imagem | 12 MB |
| Vídeo | 80 MB |

### `/api/media`

- Aceita somente caminhos iniciados por `ejs-cms/uploads/`.
- Suporta `GET` e `HEAD`.
- Define cache público de sete dias para o proxy.
- Suporta requisições `Range`, necessárias para reprodução e avanço em vídeos.
- Retorna 404 quando o arquivo não existe.

### `/api/testimonials`

No envio público:

- nome deve ter pelo menos 2 caracteres;
- mensagem deve ter pelo menos 10 caracteres;
- avaliação é limitada entre 1 e 5;
- o campo oculto `website` funciona como honeypot simples contra robôs;
- o depoimento é gravado com origem `cliente`.

---

## 15. Autenticação e segurança

### Sessão

- Cookie: `ejs_admin_session`.
- Duração: 8 horas.
- Assinatura: HMAC SHA-256.
- Atributos: `HttpOnly`, `SameSite=Lax`, `Secure` e `Path=/`.
- A assinatura usa `ADMIN_SESSION_SECRET`.

### Proteções presentes

- Comparação segura da assinatura do cookie.
- Expiração registrada no token.
- Upload e gravação do CMS exigem sessão.
- Mídias privadas são lidas apenas sob o prefixo autorizado.
- Entradas do CMS são normalizadas e limitadas.
- Conteúdo dinâmico é escapado antes de ser inserido no HTML.
- Upload aceita somente MIME de imagem ou vídeo.
- Depoimentos possuem honeypot simples.

### Cuidados necessários antes da produção

- Configure todas as variáveis administrativas; não use fallbacks.
- Use senha forte e segredo de sessão exclusivo.
- Mantenha o projeto e os tokens do Blob privados.
- Não envie `.env.local` ao Git.
- Considere adicionar rate limit e CAPTCHA ao envio público de depoimentos.
- Revise os depoimentos com frequência, pois o envio público entra no estado sem fila de aprovação.
- Restrinja e monitore custos de upload e armazenamento.
- Faça backup do estado antes de alterações estruturais.

### Limitações de segurança atuais

- Não há recuperação de senha.
- Não há múltiplos usuários ou níveis de permissão.
- Não há rate limit implementado no código.
- Não há CAPTCHA.
- Não há histórico de auditoria das alterações administrativas.
- Não há proteção CSRF dedicada além de `SameSite=Lax`.

---

## 16. Fotos, vídeos e mídia responsiva

### Otimização de imagens no painel

Antes do upload, o navegador tenta otimizar imagens maiores que 450 KB:

- mantém SVG sem conversão;
- limita o maior lado a 2.200 pixels;
- converte para WebP com qualidade aproximada de 86%;
- usa o original se a conversão falhar;
- usa o original se o WebP ficar maior que o arquivo original.

### Exibição responsiva

O sistema classifica a proporção da mídia como:

- `ultrawide`;
- `landscape`;
- `square`;
- `portrait`;
- `tall`.

As imagens usam enquadramento que preserva a proporção original, evitando deformação e corte indevido. Fotos verticais recebem fundo visual derivado da própria imagem quando necessário.

### Galeria da obra

- primeira mídia carregada imediatamente;
- mídias próximas são carregadas sob demanda;
- setas anterior/próxima no desktop;
- rolagem horizontal e contador;
- pontos de navegação no desktop;
- contador numérico no mobile;
- vídeos com controles nativos;
- ajuste automático após redimensionar a janela.

### Observação sobre exclusão

Quando uma mídia ou obra é excluída pelo painel, a referência sai do arquivo `state.json`, mas o arquivo físico correspondente não é apagado automaticamente do Vercel Blob. Arquivos sem referência devem ser revisados e removidos manualmente no armazenamento quando necessário.

---

## 17. Temas e acessibilidade

### Temas

| Nome técnico | Nome exibido | Característica |
|---|---|---|
| `cimento` | Claro | Fundo branco/cinza e texto escuro |
| `areia` | Areia | Tons quentes e claros |
| `escuro` | Escuro | Superfícies carvão e alto contraste |
| `contraste` | Contraste | Preto, branco e amarelo forte |

O tema inicial é `cimento`.

A escolha do tema é salva em `sessionStorage` com a chave `ejsTheme`. Portanto, permanece durante a navegação da sessão atual.

### Tamanho do texto

Opções:

- `normal`;
- `large`;
- `xlarge`.

A escolha é salva em `localStorage` com a chave `ejsTextSize`, permanecendo no navegador em visitas futuras.

### Rodapé

Por decisão visual deste pacote:

- o rodapé permanece escuro em todos os temas;
- a faixa externa de contato também acompanha o fundo escuro;
- somente o bloco interno das informações de contato permanece branco;
- o card de chamada “Quer transformar seu espaço?” não possui moldura ou sombra externa.

---

## 18. Regras de negócio

### Obra em destaque

- O sistema mantém somente uma obra principal em destaque.
- Ao marcar outra obra, as demais são desmarcadas.
- Se nenhuma estiver marcada, o CMS define a primeira como destaque.
- Se a obra destacada for excluída, a primeira obra restante assume o destaque.

### Contagem de obras finalizadas

- `completedBase` é definido manualmente.
- `completedAdded` é atualizado pelo painel.
- Nova obra com status `Concluída` aumenta `completedAdded`.
- Alterar uma obra cadastrada de outro status para `Concluída` aumenta a contagem.
- Retirar o status `Concluída` diminui a contagem.
- Excluir uma obra contabilizada diminui a contagem.
- Obras internas de demonstração não seguem a contagem automática normal.

### Serviços

- A categoria da obra pode ser “Reforma” ou um serviço cadastrado.
- Uma obra pode ter vários serviços executados.
- Os filtros do portfólio verificam tanto a categoria quanto a lista de serviços.
- Os oito primeiros serviços são exibidos no rodapé.

### Página inicial

- Exibe até três obras, na ordem do estado.
- Se uma obra tiver duas ou mais fotos, a prévia inicial pode mostrar as duas primeiras como “Antes” e “Depois”.
- Depoimentos são exibidos do mais recente para o mais antigo.

### Depoimentos

- Depoimentos públicos válidos são gravados imediatamente.
- A lista mantém os 200 itens mais recentes após a normalização.
- O administrador pode cadastrar ou excluir itens.

---

## 19. Personalização visual e de conteúdo

### Cores

As variáveis principais ficam em `assets/css/style.css`. O dourado institucional é representado principalmente por:

```css
--gold: #d9a441;
```

Antes de alterar cores, procure as definições de `:root` e dos quatro temas. Há regras posteriores específicas para contraste, rodapé e página de obra; por isso, faça a alteração em todas as variações relevantes.

### Logo

Substitua:

```text
assets/img/logo-ejs.webp
```

Prefira manter o mesmo nome para evitar alterar vários arquivos.

### Imagem principal

A imagem do hero está em:

```text
assets/img/hero-ejs.webp
```

### WhatsApp

O número é configurado no painel. O sistema remove caracteres não numéricos e monta a URL `https://wa.me/` automaticamente.

Formato recomendado:

```text
5511987654321
```

### Textos institucionais fixos

Alguns textos estão diretamente nos HTMLs e JavaScripts:

- títulos e parágrafos da página inicial: `index.html`;
- banner do portfólio: `obras.html`;
- chamada final e mensagens da página individual: `assets/js/project.js`;
- texto do rodapé dinâmico da página individual: `assets/js/project.js`.

### Ícones

O catálogo SVG local fica em:

```text
assets/js/icons.js
```

Ao adicionar um ícone, inclua:

1. o desenho na coleção `icons`;
2. a chave e o rótulo em `catalog`;
3. a chave desejada no serviço cadastrado.

---

## 20. Backup, manutenção e limitações

### Backup recomendado

Antes de grandes alterações:

1. copie o conteúdo de `ejs-cms/state.json` no armazenamento;
2. registre a versão atual do projeto em Git;
3. mantenha uma cópia das variáveis de ambiente em gerenciador seguro;
4. confirme que as mídias essenciais ainda existem;
5. teste a restauração em ambiente de Preview.

### O que não existe neste pacote

- banco de dados relacional;
- exportação/importação pelo painel;
- backup automático implementado no código;
- exclusão automática do arquivo físico de mídia;
- fluxo de aprovação de depoimentos;
- paginação do portfólio;
- busca textual de obras;
- edição de usuário e senha pelo painel;
- logs administrativos persistentes;
- envio de e-mail;
- formulário próprio de orçamento — o contato é direcionado ao WhatsApp.

### Cuidados ao editar o CMS

O `PUT /api/cms` salva o estado completo. Uma implementação externa que envie apenas parte do objeto poderá substituir informações ausentes pelos padrões ou remover coleções. Sempre leia o estado atual, altere somente o necessário e envie o objeto completo.

---

## 21. Solução de problemas

### O painel volta para o login

Possíveis causas:

- sessão expirada após 8 horas;
- `ADMIN_SESSION_SECRET` diferente entre ambientes;
- cookie seguro bloqueado no ambiente local;
- domínio ou Preview alterado;
- credenciais incorretas.

Solução:

1. saia e entre novamente;
2. confirme as variáveis na Vercel;
3. faça novo deploy após alterar variáveis;
4. teste em URL HTTPS da Vercel.

### “Não foi possível salvar os dados no Vercel Blob”

Verifique:

- Blob conectado ao mesmo projeto;
- credencial do Blob disponível no ambiente;
- permissões do armazenamento;
- logs da função `/api/cms`;
- cota e cobrança do projeto.

### Upload retorna erro 401

A sessão expirou ou não foi enviada. Entre novamente no painel.

### Upload retorna erro 413

O arquivo ultrapassa o limite:

- imagem acima de 12 MB;
- vídeo acima de 80 MB.

Comprima o arquivo e tente novamente.

### Imagem ou vídeo retorna 404

Verifique se:

- o `pathname` começa com `ejs-cms/uploads/`;
- o arquivo ainda existe no Blob;
- o estado contém a URL correta;
- o projeto está conectado ao armazenamento correto.

### Site mostra dados de demonstração

Isso indica que a API ou o Blob não respondeu, ou que `state.json` ainda não existe. Abra `/api/cms` e confira a resposta.

### Obra não aparece no filtro esperado

Confirme:

- categoria principal;
- serviços marcados na obra;
- nome do serviço no catálogo;
- diferença de grafia entre registros antigos e atuais.

### WhatsApp abre número incorreto

No painel, informe país + DDD + número somente com dígitos. Exemplo de estrutura: `55` + `11` + número.

### Alteração visual não aparece

- faça novo deploy;
- limpe o cache do navegador;
- teste em janela anônima;
- confirme se editou o `assets/css/style.css` correto;
- verifique regras posteriores com `!important`.

### Fonte Montserrat não carrega

O site usa Google Fonts. Em bloqueio de rede, o navegador usará a fonte de fallback definida no CSS.

---

## 22. Checklist de testes

### Site público

- [ ] Página inicial sem erros no console.
- [ ] Menu desktop e mobile funcionando.
- [ ] Link “Pular para o conteúdo” funcionando.
- [ ] Quatro temas funcionando.
- [ ] Três tamanhos de texto funcionando.
- [ ] Serviços carregando.
- [ ] Obras da página inicial abrindo.
- [ ] Filtros do portfólio funcionando.
- [ ] Obra em destaque correta.
- [ ] Página individual carregando pelo ID.
- [ ] Galeria anterior/próxima funcionando.
- [ ] Vídeos reproduzindo e avançando.
- [ ] Fotos verticais sem deformação.
- [ ] WhatsApp correto em todos os botões.
- [ ] Depoimento público sendo enviado.
- [ ] Rodapé escuro em todos os temas.
- [ ] Card de contato com apenas o bloco interno branco.
- [ ] Chamada final sem borda externa.

### Painel

- [ ] Login com credenciais corretas.
- [ ] Bloqueio com credenciais incorretas.
- [ ] Logout funcionando.
- [ ] Configurações salvando.
- [ ] Serviço cadastrando, editando e excluindo.
- [ ] Obra cadastrando com imagem principal.
- [ ] Fotos adicionais sendo enviadas.
- [ ] Vídeo sendo enviado.
- [ ] Edição preservando mídias existentes.
- [ ] Troca de capa funcionando.
- [ ] Remoção de mídia funcionando.
- [ ] Exclusão de obra ajustando a contagem.
- [ ] Apenas uma obra permanecendo em destaque.
- [ ] Depoimento administrativo sendo cadastrado e excluído.

### Responsividade

- [ ] Desktop largo.
- [ ] Notebook.
- [ ] Tablet vertical e horizontal.
- [ ] Celular pequeno.
- [ ] Barra fixa mobile sem cobrir conteúdo importante.
- [ ] Rodapé e contato sem overflow horizontal.

---

## 23. Histórico funcional do pacote

### Base do projeto

- Site institucional responsivo.
- Portfólio com obras e página detalhada.
- Painel administrativo.
- Persistência e uploads no Vercel Blob.

### Evolução de serviços e mídia

- Catálogo dinâmico de serviços.
- Ícones SVG locais.
- Serviços ligados às obras e filtros.
- Galeria adaptativa para fotos e vídeos em diferentes proporções.
- Otimização de imagens grandes para WebP.

### Evolução visual

- Temas Claro, Areia, Escuro e Contraste.
- Cabeçalho adaptado ao tema.
- Rodapé permanentemente escuro.
- Contraste reforçado no tema escuro.
- Botão Voltar apenas nas páginas internas.
- Card interno de contato branco sem faixa branca externa.
- Chamada “Quer transformar seu espaço?” sem moldura e sem sombra externas.

### Evolução de conteúdo

- Depoimentos dinâmicos enviados por clientes.
- Cadastro e exclusão de depoimentos pelo painel.
- Novos serviços padrão, como Impermeabilização, Limpeza pós-obra, Drywall e Instalação de grama.

---

## Suporte de manutenção

Ao solicitar alterações futuras, informe:

- página afetada;
- tamanho de tela em que ocorre;
- tema selecionado;
- captura de tela;
- URL ou rota;
- mensagem do console ou da API;
- arquivo e versão do pacote usados.

Essas informações ajudam a localizar rapidamente se o problema está no HTML, CSS, JavaScript, API, sessão ou Vercel Blob.
