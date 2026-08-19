# EJS Empreiteira --- Documentação do Projeto

## 1. Visão geral

O projeto **EJS Empreiteira** é um site institucional responsivo para
apresentação da empresa, serviços, portfólio de obras e contato com
clientes. O projeto também possui um **painel administrativo (ADM)**
para cadastrar e atualizar obras, fotos, vídeos e informações
institucionais.

A aplicação foi preparada para publicação na **Vercel**, utilizando
HTML, CSS e JavaScript no front-end, funções serverless em JavaScript no
back-end e **Vercel Blob privado** para persistência de dados e arquivos
de mídia.

A versão atual inclui um sistema de **mídia responsiva automática**,
capaz de adaptar fotos e vídeos conforme a proporção original do arquivo
e o aparelho utilizado, sem cortar ou deformar o conteúdo principal.

------------------------------------------------------------------------

## 2. Principais recursos

### Site público

-   Página inicial institucional da EJS Empreiteira.
-   Apresentação visual da evolução de uma obra.
-   Seção de resultados e informações da empresa.
-   Portfólio de obras.
-   Página individual para cada obra.
-   Galeria com fotos e vídeos.
-   Serviços oferecidos.
-   Botões de orçamento via WhatsApp.
-   Instagram configurável.
-   CNPJ configurável.
-   Rodapé responsivo.
-   Botão flutuante de WhatsApp no mobile.
-   Layout adaptado para desktop, tablet e celular.
-   Recursos básicos de acessibilidade.

### Painel administrativo

O painel ADM permite administrar o conteúdo exibido no site sem editar
manualmente o HTML.

Entre os recursos estão:

-   Login administrativo.
-   Sessão protegida por cookie HttpOnly.
-   Cadastro de obras.
-   Edição das informações das obras.
-   Upload de imagens.
-   Upload de vídeos.
-   Configuração de WhatsApp.
-   Configuração de Instagram.
-   Configuração de CNPJ.
-   Controle das informações persistidas pelo CMS.
-   Sincronização dos dados entre dispositivos através da Vercel.

------------------------------------------------------------------------

## 3. Estrutura do projeto

``` text
/
├── index.html
├── obra.html
├── login.html
├── package.json
├── vercel.json
│
├── admin/
│   ├── index.html
│   └── login.html
│
├── api/
│   ├── cms.js
│   ├── login.js
│   ├── logout.js
│   ├── media.js
│   ├── session.js
│   └── upload.js
│
├── lib/
│   ├── auth.js
│   └── cms.js
│
└── assets/
    ├── css/
    │   └── style.css
    │
    ├── js/
    │   ├── accessibility.js
    │   ├── admin-login.js
    │   ├── admin.js
    │   ├── app.js
    │   └── project.js
    │
    └── img/
        ├── logo-ejs.webp
        ├── hero-ejs.webp
        ├── fachada-ficticia.svg
        └── hero-stages/
```

------------------------------------------------------------------------

## 4. Arquivos principais

### `index.html`

Página principal do site. Contém a estrutura institucional, apresentação
da empresa, portfólio, serviços, chamada para orçamento e rodapé.

### `obra.html`

Página utilizada para apresentar uma obra individual e sua galeria
completa de fotos e vídeos.

### `admin/index.html`

Interface principal do painel administrativo.

### `admin/login.html`

Tela de autenticação do administrador.

### `assets/css/style.css`

Arquivo central de estilos do projeto. Controla:

-   layout;
-   responsividade;
-   animações;
-   carrosséis;
-   página das obras;
-   painel visual;
-   rodapé;
-   WhatsApp flutuante;
-   comportamento da galeria;
-   adaptação de imagens e vídeos.

### `assets/js/app.js`

Controla o comportamento geral do site público, carregamento de dados,
elementos interativos e integração das informações configuradas pelo
CMS.

### `assets/js/project.js`

Controla a página individual da obra e sua galeria.

Nesta versão, esse arquivo também contém o **manipulador automático de
mídia**, responsável por identificar a proporção real de fotos e vídeos.

### `assets/js/admin.js`

Controla as funcionalidades do painel administrativo, incluindo cadastro
e gerenciamento de obras e envio de mídias.

### `assets/js/admin-login.js`

Controla o processo de autenticação do painel.

### `assets/js/accessibility.js`

Contém comportamentos auxiliares relacionados à acessibilidade.

------------------------------------------------------------------------

## 5. Sistema de mídia responsiva automática

Um dos principais recursos da versão atual é o tratamento automático das
fotos e vídeos cadastrados pelo ADM.

O objetivo é permitir que uma mídia enviada por celular, notebook ou
computador seja apresentada corretamente em qualquer aparelho.

### Classificação automática

Depois que uma imagem ou vídeo é carregado, o sistema identifica suas
dimensões reais e calcula sua proporção.

A mídia pode ser classificada como:

-   ultrawide;
-   horizontal;
-   quadrada;
-   retrato;
-   retrato alto.

Essa classificação é aplicada automaticamente pela função presente em
`assets/js/project.js`.

### Regra principal: não cortar a mídia

A mídia principal utiliza:

``` css
object-fit: contain;
```

Isso significa que a foto ou o vídeo é exibido integralmente.

O sistema não deve:

-   cortar partes da foto;
-   esticar a imagem;
-   achatar a imagem;
-   alterar sua proporção original.

### Exibição no desktop

No desktop, a galeria utiliza uma área horizontal responsiva,
priorizando uma apresentação próxima ao formato 16:9.

Quando uma imagem originalmente vertical é exibida em uma tela
horizontal, ela continua inteira no centro.

Para aproveitar melhor o espaço lateral sem deformar a fotografia, o
sistema pode utilizar uma versão ampliada e desfocada da própria imagem
como fundo visual.

Assim, a foto original permanece preservada.

### Exibição no celular

No mobile, o quadro da galeria se adapta à proporção real da mídia.

Uma foto vertical pode utilizar uma área mais alta, enquanto uma foto
horizontal recebe uma área mais larga.

Isso evita obrigar todas as fotos a utilizarem o mesmo formato.

### Vídeos

Os vídeos utilizam o mesmo princípio de adaptação.

O sistema consulta `videoWidth` e `videoHeight` após o carregamento dos
metadados e classifica o vídeo conforme sua proporção.

Os vídeos são exibidos com controles nativos e `playsinline`,
facilitando a reprodução em dispositivos móveis.

------------------------------------------------------------------------

## 6. Galeria das obras

A página individual da obra possui um carrossel de mídia.

Recursos:

-   fotos;
-   vídeos;
-   navegação anterior/próxima;
-   indicadores;
-   arraste/toque;
-   carregamento progressivo das mídias;
-   detecção automática da proporção;
-   adaptação para desktop e mobile.

A primeira mídia recebe prioridade de carregamento. As demais podem
utilizar carregamento posterior para reduzir o peso inicial da página.

------------------------------------------------------------------------

## 7. CMS e persistência dos dados

O projeto utiliza um pequeno CMS próprio.

O estado principal é armazenado no Vercel Blob no caminho interno:

``` text
ejs-cms/state.json
```

A estrutura inclui principalmente:

``` text
settings
works
```

### `settings`

Armazena configurações gerais, como:

-   WhatsApp;
-   Instagram;
-   CNPJ;
-   contadores utilizados pelo site.

### `works`

Armazena as obras cadastradas.

Cada obra pode possuir dados como:

-   ID;
-   título;
-   descrição;
-   capa;
-   galeria;
-   caminhos das imagens;
-   vídeos;
-   caminhos dos vídeos;
-   informações auxiliares de controle.

O arquivo `lib/cms.js` é responsável por validar, limpar, carregar e
salvar esse estado.

------------------------------------------------------------------------

## 8. Vercel Blob

O projeto utiliza `@vercel/blob`.

Dependência declarada em `package.json`:

``` json
{
  "dependencies": {
    "@vercel/blob": "^2.3.0"
  }
}
```

As imagens, vídeos e dados do CMS são armazenados no Blob.

Os arquivos enviados pelo administrador são mantidos com acesso privado.

Por isso, o site não precisa expor diretamente a URL privada do arquivo.

------------------------------------------------------------------------

## 9. Entrega das mídias privadas

A rota:

``` text
/api/media
```

atua como intermediária para entregar ao site as mídias armazenadas no
Blob privado.

Esse modelo evita depender de URLs públicas diretas do armazenamento.

------------------------------------------------------------------------

## 10. Upload de arquivos

A rota:

``` text
/api/upload
```

é responsável pelo envio das mídias cadastradas pelo administrador.

Ela aceita:

-   imagens;
-   vídeos.

Limites implementados atualmente:

-   imagens: até **12 MB**;
-   vídeos: até **80 MB**.

O endpoint exige uma sessão administrativa válida.

Os nomes dos arquivos são normalizados antes do armazenamento.

------------------------------------------------------------------------

## 11. Autenticação administrativa

A autenticação está implementada em:

``` text
lib/auth.js
api/login.js
api/logout.js
api/session.js
```

Depois do login, o servidor cria um cookie de sessão.

Características do cookie:

-   `HttpOnly`;
-   `Secure`;
-   `SameSite=Lax`;
-   duração aproximada de 8 horas.

A assinatura da sessão utiliza HMAC SHA-256.

### Variáveis de ambiente recomendadas

Configure na Vercel:

``` text
ADMIN_USER
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
```

O `ADMIN_SESSION_SECRET` deve ser uma sequência longa, aleatória e
exclusiva do projeto.

> Importante: o código atual possui valores de compatibilidade/fallback
> para ambientes ainda não configurados. Para produção, configure as
> variáveis acima e remova credenciais fixas do código-fonte.

------------------------------------------------------------------------

## 12. Rotas da aplicação

### Site público

``` text
/
index.html
obra.html
```

### Administração

``` text
/admin/login.html
/admin/index.html
```

O `vercel.json` também contém redirecionamentos para facilitar o acesso
ao login administrativo.

### API

``` text
/api/login
/api/logout
/api/session
/api/cms
/api/upload
/api/media
```

------------------------------------------------------------------------

## 13. Deploy na Vercel

### Requisitos

-   projeto hospedado na Vercel;
-   Node.js compatível com as Functions da Vercel;
-   Vercel Blob conectado ao projeto;
-   variáveis administrativas configuradas.

### Procedimento recomendado

1.  Envie o projeto para um repositório Git.
2.  Importe o repositório na Vercel.
3.  Conecte um Vercel Blob Store ao mesmo projeto.
4.  Configure `ADMIN_USER`.
5.  Configure `ADMIN_PASSWORD`.
6.  Configure `ADMIN_SESSION_SECRET`.
7.  Faça um novo deploy.
8.  Abra o site público.
9.  Acesse o painel ADM.
10. Cadastre uma obra de teste.
11. Envie uma imagem.
12. Envie um vídeo, se necessário.
13. Abra a obra em desktop e celular.
14. Confirme a sincronização dos dados.

------------------------------------------------------------------------

## 14. Teste recomendado da mídia responsiva

Para validar o manipulador automático, cadastre mídias com proporções
diferentes.

Teste pelo menos:

-   foto horizontal tirada por notebook/computador;
-   foto horizontal tirada por celular;
-   foto vertical de celular;
-   foto quadrada;
-   foto panorâmica;
-   vídeo horizontal;
-   vídeo vertical.

Depois abra a mesma obra em:

-   monitor desktop;
-   notebook;
-   tablet;
-   celular em modo retrato;
-   celular em modo paisagem.

### Resultado esperado

Em todos os casos:

-   a mídia deve aparecer inteira;
-   nenhuma parte importante deve ser cortada;
-   não deve haver deformação;
-   fotos verticais devem permanecer verticais;
-   fotos horizontais devem aproveitar melhor o desktop;
-   a área da galeria deve se adaptar ao dispositivo;
-   os controles do carrossel devem permanecer acessíveis.

------------------------------------------------------------------------

## 15. Responsividade

O projeto foi desenvolvido para trabalhar com diferentes tamanhos de
tela.

Os principais pontos responsivos incluem:

-   menu;
-   hero;
-   portfólio;
-   cards;
-   serviços;
-   galeria das obras;
-   rodapé;
-   botões;
-   WhatsApp flutuante;
-   imagens;
-   vídeos.

Ao alterar o CSS, é importante testar tanto o desktop quanto o mobile
para evitar que uma correção em uma resolução cause regressão em outra.

------------------------------------------------------------------------

## 16. Segurança

Para produção, recomenda-se:

-   nunca publicar senhas administrativas em repositórios;
-   utilizar variáveis de ambiente;
-   utilizar um `ADMIN_SESSION_SECRET` forte;
-   manter o Blob privado;
-   não colocar tokens da Vercel no JavaScript do navegador;
-   manter dependências atualizadas;
-   validar os tipos e tamanhos dos arquivos enviados;
-   utilizar HTTPS;
-   revisar permissões do projeto na Vercel;
-   alterar imediatamente qualquer credencial que tenha sido publicada
    anteriormente.

------------------------------------------------------------------------

## 17. Manutenção do projeto

Ao realizar novas alterações, preserve principalmente:

1.  a estrutura do CMS;
2.  as rotas da API;
3.  o armazenamento privado;
4.  a autenticação administrativa;
5.  o manipulador responsivo de mídia;
6.  `object-fit: contain` na mídia principal;
7.  a compatibilidade desktop/mobile;
8.  a sincronização dos dados entre aparelhos.

Evite substituir o comportamento da galeria por `object-fit: cover` na
mídia principal, pois isso pode voltar a cortar fotografias verticais ou
horizontais.

------------------------------------------------------------------------

## 18. Arquivos mais importantes para futuras correções

Para alterações no visual geral:

``` text
assets/css/style.css
```

Para alterações na página inicial:

``` text
index.html
assets/js/app.js
```

Para alterações na galeria e mídia responsiva:

``` text
obra.html
assets/js/project.js
assets/css/style.css
```

Para alterações no painel:

``` text
admin/index.html
assets/js/admin.js
```

Para alterações no login:

``` text
admin/login.html
assets/js/admin-login.js
api/login.js
lib/auth.js
```

Para alterações no CMS:

``` text
api/cms.js
lib/cms.js
```

Para upload e armazenamento:

``` text
api/upload.js
api/media.js
```

------------------------------------------------------------------------

## 19. Histórico funcional resumido

A evolução recente do projeto incluiu:

-   migração da persistência local para armazenamento online;
-   integração com Vercel Blob;
-   painel administrativo online;
-   imagens privadas;
-   suporte a vídeos;
-   galeria horizontal;
-   melhorias no rodapé;
-   melhorias no WhatsApp flutuante;
-   ajustes específicos para mobile;
-   reinicialização correta da experiência ao recarregar a página;
-   adaptação automática das mídias;
-   preservação integral de fotos e vídeos sem cortes;
-   melhoria da apresentação de fotos verticais no desktop.

------------------------------------------------------------------------

## 20. Versão documentada

Este README documenta a versão:

**EJS Empreiteira V30 --- Mídias Responsivas**

Principais características desta versão:

-   mídia responsiva automática;
-   imagens sem corte;
-   vídeos sem deformação;
-   detecção da proporção real;
-   layout específico para desktop;
-   layout específico para mobile;
-   fundo visual para mídia vertical no desktop;
-   CMS online;
-   Vercel Blob privado;
-   painel administrativo;
-   autenticação por sessão.

------------------------------------------------------------------------

## 21. Observação para futuros desenvolvedores

Antes de modificar a galeria, leia `assets/js/project.js` e as regras
correspondentes em `assets/css/style.css`.

A intenção do sistema é simples:

> **preservar a mídia original e adaptar o espaço de exibição ao
> aparelho --- nunca deformar a mídia para obrigá-la a preencher a
> tela.**

Essa regra deve continuar sendo respeitada em futuras versões do
projeto.
