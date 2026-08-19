# EJS Empreiteira — V32 Projeto Responsivo + Gestão de Serviços

## Visão geral

Esta versão recria o visual público da EJS Empreiteira com base no layout de referência aprovado, mantendo a paleta atual do projeto:

- carvão / preto;
- branco / marfim;
- café / marrom;
- areia;
- dourado EJS (`#d9a441`).

O projeto continua preparado para Vercel, Vercel Blob privado, painel administrativo e cadastro de fotos/vídeos.

## Principais mudanças da V32

- ícone oficial/real do WhatsApp aplicado no cabeçalho, contatos, botão flutuante e barra mobile;
- cabeçalho passa a acompanhar o modo de visualização escolhido pelo visitante;
- cabeçalho mobile reorganizado com logo à esquerda e controles/menu à direita;
- página individual da obra recriada com estrutura de destaque, galeria, descrição, informações técnicas e CTAs inspirados no mockup aprovado;
- galeria responsiva com detecção automática da proporção real de cada imagem ou vídeo;
- mídia principal sempre usa `object-fit: contain`, portanto não é cortada nem deformada;
- fotos horizontais assumem proporção de desktop; fotos verticais recebem enquadramento responsivo com fundo da própria foto, sem esticar a imagem original;
- no celular, o quadro da galeria muda entre horizontal, quadrado, retrato e retrato alto de acordo com a mídia ativa;
- miniaturas de obras também preservam a imagem completa e usam preenchimento visual quando necessário;
- nova área **Serviços** no painel ADM para cadastrar, editar e excluir os serviços prestados;
- serviços cadastrados no ADM alimentam automaticamente a página inicial, filtros do portfólio, rodapé e seleção de serviços no cadastro das obras;
- edição do nome de um serviço atualiza referências nas obras existentes.

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

---

## Atualização V33.1 — tema claro, ícones e portfólio compacto

Esta versão acrescenta:

- cabeçalho branco/cinza quando o tema **Claro (cimento)** está ativo;
- visual geral mais claro, com superfícies brancas e cinzas e dourado como destaque;
- pacote local com mais de 20 ícones de construção em `assets/js/icons.js`;
- seleção visual de ícones no painel ADM para os serviços da empresa;
- ícones específicos para demolição, alvenaria, pintura, elétrica, gesso, hidráulica, piso, telhado, impermeabilização, marcenaria, solda, ferramentas e outros;
- filtros da página de obras usando os ícones cadastrados no ADM;
- ícones lineares de localização, área, prazo e calendário nos cards;
- card de **obra em destaque** mais compacto no desktop, com foto à esquerda e informações à direita;
- correção para fotos verticais, quadradas e horizontais sem corte, usando `object-fit: contain` e fundo adaptativo;
- página individual da obra ajustada para o tema claro, mantendo a galeria responsiva no desktop e no mobile.

### Cadastro de ícone de serviço

No painel, acesse **Serviços**. Ao criar ou editar um serviço, escolha um ícone no campo **Ícone** ou clique diretamente no catálogo visual. O ícone selecionado será utilizado automaticamente nos cards de serviços e nos filtros do portfólio.


## Atualização V34

Esta versão inclui os seguintes ajustes:

- rodapé permanentemente escuro em todos os temas; somente o cabeçalho acompanha a cor escolhida pelo visitante;
- cores de textos, botões e ícones adaptadas ao tema para manter contraste e legibilidade;
- botão pequeno **Voltar** inserido automaticamente nas páginas públicas;
- ícone de calendário padronizado em todos os botões de orçamento;
- página individual da obra com galeria à esquerda e informações à direita no desktop; no mobile o conteúdo é empilhado;
- imagens e vídeos usam `object-fit: contain`, preservando a mídia inteira sem cortes ou deformações, inclusive fotos verticais de celular;
- no mobile, a galeria mostra o contador numérico e oculta os pontos de paginação;
- localização da obra passou para o painel de informações, deixando acima da galeria somente o nome da obra;
- filtros e categorias sem truncamento de nomes longos, inclusive **Impermeabilização**;
- novos serviços padrão: Impermeabilização, Limpeza pós-obra, Drywall e Instalação de grama;
- pacote de ícones ampliado com limpeza, drywall, grama, concreto e andaime;
- seção institucional usa uma imagem profissional de construção civil por URL externa, com fallback para a imagem local anterior;
- indicadores reposicionados no topo do rodapé e o card de contato colocado imediatamente antes do copyright;
- depoimentos dinâmicos: clientes podem enviar pelo site, todos podem rolar a lista e o ADM pode cadastrar ou excluir depoimentos;
- novo endpoint `/api/testimonials` para leitura/envio público e suporte administrativo.

### Observação sobre a imagem institucional

A imagem de equipe da seção institucional está configurada por URL externa e possui fallback automático para `assets/img/hero-stages/04.webp` caso a imagem remota não esteja disponível.
