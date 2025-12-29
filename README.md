# Etecfy - Documento tecnico-funcional (frontend)

Este documento descreve as funcionalidades do sistema para permitir a implementacao completa do front-end sem acesso ao back-end.

Escopo:
- Exclui a funcionalidade de criacao de musica.
- Inclui todas as demais funcionalidades visiveis ao usuario final.

Referencia visual obrigatoria:
- Projeto base para layout, cores, tipografia, espacos, componentes, responsividade, animacoes e transicoes:
  https://github.com/Joaopdiasventura/chat-client

---

## Design system (referencia)

Baseado em `https://github.com/Joaopdiasventura/chat-client`.

### Tipografia
- Fonte base: Quicksand.
- Titulos e botoes: Azonix.
- Tamanhos definidos por tokens (ex.: `--text-xxs`, `--text-base`, `--text-lg`, `--text-xl`, `--text-2xl`).

### Cores e tema
- Tokens principais: `--color-bg-app`, `--color-bg-surface`, `--color-text-primary`, `--color-text-secondary`,
  `--color-accent`, `--color-danger`, `--color-border-subtle`, `--color-shadow-1/2`.
- Tema escuro via classe `dark` no `html`.
- Botao de alternancia de tema deve persistir no `localStorage`.

### Componentes e estilo
- Cards com bordas suaves, fundo `--card` e sombra leve.
- Inputs com foco por `--ring` e bordas sutis.
- Botoes com hover de elevacao (translateY(-1px)).
- Icones SVG monocromaticos, 16-20px, dentro de botoes arredondados.

### Animacoes
- `fadeIn`, `fadeInUp`, `skeleton-shimmer`, `spin`, `pulse`.
- Preferir transicoes suaves em hover e mudancas de estado.

### Responsividade
- Breakpoints usados na referencia: 500px, 768px, 900px, 1024px.
- Mobile-first com `100dvh` e `env(safe-area-inset-*)`.

---

## Funcionalidades

### 1) Cadastro de usuario
**Objetivo**
Criar conta com email, nome e senha forte.

**Fluxo de navegacao**
`/user/access` -> aba "Criar conta" -> submit -> sucesso -> redirect `/`.

**Estados de UI**
- Loading: botao "Criando conta..." com spinner; inputs desabilitados.
- Erro: alerta com mensagem do backend + erros de campo inline.
- Vazio: campos vazios, botao desabilitado.
- Sucesso: redireciona para home com sessao ativa.

**Dados exibidos e interacoes**
- Campos: nome, email, senha.
- Toggle de visibilidade da senha.
- Tabs "Entrar" e "Criar conta".

**Regras de negocio (front-end)**
- Email obrigatorio e valido.
- Nome obrigatorio (min 2 caracteres).
- Senha forte: minimo 8, 1 minuscula, 1 maiuscula, 1 numero, 1 simbolo.
- Submit somente se valido e nao loading.

**API**
- `POST /user`
- Body: `{ name, email, password }`
- Response: `User` (cookie `auth_token` setado pelo backend).

---

### 2) Login
**Objetivo**
Autenticar usuario existente.

**Fluxo de navegacao**
`/user/access` -> aba "Entrar" -> submit -> sucesso -> `/`.

**Estados de UI**
- Loading: botao "Entrando...".
- Erro: alerta (ex.: "Conta nao encontrada", "Senha incorreta").
- Vazio: campos vazios, botao desabilitado.
- Sucesso: redireciona para home.

**Dados exibidos e interacoes**
- Campos: email, senha.
- Toggle de visibilidade da senha.

**Regras de negocio (front-end)**
- Email valido.
- Senha forte (mesma regra do cadastro).
- Submit somente se valido e nao loading.

**API**
- `POST /user/login`
- Body: `{ email, password }`
- Response: `User` (cookie `auth_token` setado).

---

### 3) Sessao atual (auto-login)
**Objetivo**
Validar sessao via cookie ao iniciar o app.

**Fluxo de navegacao**
Ao carregar `/` -> `GET /user` -> se sucesso, segue; se falha, redirect `/user/access`.

**Estados de UI**
- Loading global (opcional overlay/skeleton).
- Erro: redireciona para acesso.
- Sucesso: UI principal carregada.

**Dados exibidos**
- `User` (id, name, email, createdAt, updatedAt).

**Regras de negocio**
- Backend usa cookie `auth_token` httpOnly.
- Em cross-origin, requisicoes devem enviar cookie (`withCredentials`).

**API**
- `GET /user`
- Response: `User`.

---

### 4) Atualizar conta
**Objetivo**
Editar dados do usuario (nome, email, senha).

**Fluxo de navegacao**
Home -> "Minha conta" (novo painel/perfil) -> editar -> salvar.

**Estados de UI**
- Loading: botao salvar desabilitado.
- Erro: alertas e erros de campo.
- Sucesso: feedback "Conta atualizada".
- Vazio: campos preenchidos com dados atuais.

**Dados exibidos e interacoes**
- Campos editaveis: nome, email, senha.
- Botao "Salvar alteracoes".

**Regras de negocio (front-end)**
- Mesmas validacoes de email e senha forte.
- Se email mudar, backend valida unicidade.

**API**
- `PATCH /user`
- Body: `{ name?, email?, password? }`
- Response: `{ message }`.

---

### 5) Excluir conta
**Objetivo**
Remover conta do usuario.

**Fluxo de navegacao**
Perfil -> botao "Excluir conta" -> confirmacao -> sucesso -> logout/redirect.

**Estados de UI**
- Loading no botao de confirmacao.
- Erro: mensagem de falha.
- Sucesso: sessao encerrada e redirect `/user/access`.

**Dados exibidos e interacoes**
- Modal de confirmacao com texto de risco.

**Regras de negocio**
- Acao irreversivel, exigir confirmacao explicita.

**API**
- `DELETE /user`
- Response: `{ message }`.

---

### 6) Catalogo de musicas (listar)
**Objetivo**
Exibir lista pesquisavel/ordenavel de musicas.

**Fluxo de navegacao**
Home -> lista principal -> selecionar musica -> detalhe.

**Estados de UI**
- Loading: skeletons na lista.
- Vazio: "Nenhuma musica encontrada".
- Erro: banner com erro e retry.
- Sucesso: lista paginada.

**Dados exibidos e interacoes**
- Card por musica com `title`, `artist`, `duration`.
- Busca por titulo/artista; filtros e ordenacao.
- Scroll para paginacao (lazy load).

**Regras de negocio (front-end)**
- `orderBy` permitido: `title`, `artist`, `duration` com `asc|desc`.
- Paginacao: `limit` e `page` (assumir page 1-based).
- Campo `description` no DTO nao e aplicado no repository.

**API**
- `GET /song?title=&artist=&orderBy=&limit=&page=`
- Response: `Song[]` com `id`, `title`, `artist`, `duration`.

---

### 7) Detalhe da musica
**Objetivo**
Apresentar metadados completos e iniciar reproducao.

**Fluxo de navegacao**
Clique na musica -> tela de detalhe -> player.

**Estados de UI**
- Loading: skeleton no cabecalho + conteudo.
- Erro: "Musica nao encontrada" + voltar.
- Sucesso: exibe detalhes.

**Dados exibidos e interacoes**
- `title`, `artist`, `description`, `lyrics`, `duration`, `thumbnail`.
- Botoes: play/pause, avancar/retroceder, barra de progresso.

**Regras de negocio**
- Exigir `id` valido; se 404, retornar a lista.

**API**
- `GET /song/:id`
- Response: `Song` completo.

---

### 8) Reproducao por chunks
**Objetivo**
Streaming segmentado da musica.

**Fluxo de navegacao**
Detalhe -> iniciar play -> carregar chunks -> reproducao continua.

**Estados de UI**
- Loading inicial: "Carregando audio...".
- Erro: "Nao foi possivel carregar a musica".
- Sucesso: reproducao sequencial.

**Dados exibidos e interacoes**
- Lista de chunks: `{ url, duration }` em ordem crescente.
- Progress bar usa soma das duracoes.
- Permitir pular/seek por indice de chunk aproximado.

**Regras de negocio (front-end)**
- Chunks retornam ordenados por `createdAt ASC`.
- `duration` em segundos.

**API**
- `GET /song-chunk/:song`
- Response: `SongChunk[]` com `url`, `duration`.

---

## Padroes de UX e layout (espelhar referencia)

- Layout principal: painel esquerdo com lista (catalogo) e painel direito com detalhes/player.
- Mobile: lista e detalhe nao aparecem juntos; botao "voltar" no topo.
- Inputs com icone na esquerda (estilo search).
- Botoes primarios solidos (accent), secundarios em versao "tint".
- Feedback: skeleton shimmer em listas, spinner em botoes, alertas para erro.
- Suporte a tema claro/escuro com toggle persistido.

---

## Notas tecnicas

- Autenticacao via cookie `auth_token` httpOnly (nao armazenar token no front-end).
- CORS permite origens configuradas; usar `withCredentials` quando necessario.
- Endpoint de criacao de musica (`POST /song`) existe no backend, mas esta fora do escopo.
