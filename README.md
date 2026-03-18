# Entrelinhas

Rede social focada em bem-estar digital. Sem likes públicos, sem contadores de seguidores, sem feed infinito, sem ranking de popularidade. Um espaço para escrita, reflexão e conexão genuína.

---

## Visão do produto

Redes sociais tradicionais são projetadas para maximizar engajamento, não bem-estar. Entrelinhas parte de uma premissa inversa: e se o design digital favorecesse presença e calma em vez de ansiedade e comparação?

**Pilares:**

- Texto como formato principal — não imagens, não vídeos
- Intenção explícita em cada publicação (registro, reflexão, desabafo, compartilhamento)
- Interações privadas — "Isso me tocou" nunca expõe contador ao autor
- Feed limitado e cronológico — sem algoritmo de engajamento
- Perfis sem métricas de vaidade — sem contagem pública de seguidores ou likes

**Público:** pessoas que escrevem, refletem e buscam conexões mais profundas e menos performáticas.

---

## Arquitetura do monorepo

```
entrelinhas/
├── apps/
│   ├── api/          # Backend NestJS
│   └── web/          # Frontend Next.js
└── docs/             # Documentação de produto e arquitetura
```

Não há workspace manager na raiz. Cada app tem seu próprio `package.json` e é gerenciado de forma independente.

---

## Stack

| Camada       | Tecnologia                                      |
|--------------|-------------------------------------------------|
| Frontend     | Next.js 15 (App Router), React 19, TypeScript   |
| Estilo       | Tailwind CSS, shadcn/ui (New York), Lucide icons |
| Backend      | NestJS, TypeScript                              |
| ORM          | Prisma                                          |
| Banco        | PostgreSQL 16                                   |
| Auth         | JWT stateless (passport-jwt, bcrypt)            |
| Infra local  | Docker Compose (PostgreSQL na porta 5433)       |

---

## Como rodar localmente

### Pré-requisitos

- Node.js 20+
- Docker e Docker Compose

### 1. Banco de dados

```bash
docker compose up -d
```

PostgreSQL sobe na porta `5433` (evita conflito com instâncias locais na 5432).

### 2. Backend

```bash
cd apps/api
cp .env.example .env
# Editar .env: DATABASE_URL e JWT_SECRET
npm install
npm run db:migrate
npm run dev
```

API disponível em `http://localhost:3001/api`.

### 3. Frontend

```bash
cd apps/web
npm install
npm run dev
```

App disponível em `http://localhost:3000`.

> A variável `NEXT_PUBLIC_API_URL` no frontend aponta por padrão para `http://localhost:3001/api`. Pode ser sobrescrita via `.env.local`.

---

## Estrutura das apps

### Backend — `apps/api/src/`

| Módulo          | Responsabilidade                                                                 |
|-----------------|----------------------------------------------------------------------------------|
| `auth`          | Registro, login, exclusão de conta. Cria User + Profile + WellbeingSettings atomicamente no registro. |
| `onboarding`    | POST único para definir nome, username, bio, interesses e intenções. Bloqueado após conclusão. |
| `profiles`      | Perfil público por username (sem contagem de seguidores). PATCH do perfil próprio. |
| `posts`         | Criar, buscar, excluir (somente autor). Endpoint público não inclui contagem de touches. |
| `replies`       | Listar (público), criar e excluir (somente autor). Dispara notificação `new_reply`. |
| `touches`       | Interação "Isso me tocou". Retorna apenas `{ touched: boolean }`. Nenhum contador exposto. |
| `saved-posts`   | Coleção pessoal. Salvar, remover, listar. Completamente privado. |
| `follows`       | Seguir/deixar de seguir por username. Retorna `{ following: boolean }`. Dispara `new_follower`. |
| `feed`          | Posts do próprio usuário + seguidos + complemento recente. Teto hard-coded por sessão. |
| `notifications` | Tipos: `new_reply` e `new_follower` apenas. Listar não lidas, marcar como lidas. |
| `wellbeing`     | Configurações de bem-estar: notificações, interações, feed limitado, modo silencioso, dark mode. |
| `stats`         | Contagem pública de membros e publicações (homepage). |
| `database`      | `PrismaService` global injetado em todos os módulos. |

**JWT payload:** `{ sub: userId, profileId }` — ambos disponíveis em `req.user` em rotas protegidas.

### Frontend — `apps/web/app/`

```
app/
├── page.tsx                    # Landing page (server component, busca stats reais)
├── login/page.tsx              # Login
├── onboarding/page.tsx         # Wizard de cadastro (4 etapas)
└── (app)/                      # Rotas protegidas (AuthGuard)
    ├── feed/page.tsx
    ├── new/page.tsx            # Criar publicação
    ├── post/[id]/page.tsx      # Post individual + respostas
    ├── profile/page.tsx        # Perfil próprio + coleção salva
    ├── profile/[username]/     # Perfil público
    ├── search/page.tsx         # Busca de posts e perfis
    └── settings/page.tsx       # Configurações de bem-estar + conta
```

**Convenções:**

- Alias `@/*` → `apps/web/*`
- Tipos centralizados em `lib/types.ts`
- Chamadas de API centralizadas em `lib/posts.ts` e `lib/api.ts`
- Tokens JWT armazenados em `localStorage`, enviados como `Bearer` em cada requisição
- Dark mode: classe `.dark` no `<html>`, aplicada por script inline no `<body>` antes da hidratação React

---

## Principais rotas da API

Documentação completa em [`docs/api-reference.md`](docs/api-reference.md).

**Base URL:** `http://localhost:3001/api`

| Método   | Rota                                  | Auth | Descrição                              |
|----------|---------------------------------------|------|----------------------------------------|
| POST     | `/auth/register`                      | —    | Criar conta                            |
| POST     | `/auth/login`                         | —    | Autenticar                             |
| DELETE   | `/auth/account`                       | JWT  | Excluir conta (cascade completo)       |
| POST     | `/onboarding`                         | JWT  | Concluir onboarding (uso único)        |
| GET      | `/profiles/me`                        | JWT  | Perfil próprio                         |
| PATCH    | `/profiles/me`                        | JWT  | Atualizar nome, bio, avatarUrl         |
| GET      | `/profiles/me/posts`                  | JWT  | Posts do usuário autenticado           |
| GET      | `/profiles/:username`                 | —    | Perfil público                         |
| GET      | `/profiles/:username/posts`           | —    | Posts públicos de um perfil            |
| GET      | `/profiles/search?q=`                 | —    | Buscar perfis por nome/username        |
| POST     | `/posts`                              | JWT  | Criar publicação                       |
| GET      | `/posts/:id`                          | —    | Buscar post (sem contagem de touches)  |
| DELETE   | `/posts/:id`                          | JWT  | Excluir post (somente autor)           |
| GET      | `/posts/search?q=`                    | —    | Buscar posts por conteúdo              |
| GET      | `/posts/:postId/replies`              | —    | Listar respostas                       |
| POST     | `/posts/:postId/replies`              | JWT  | Criar resposta                         |
| DELETE   | `/posts/:postId/replies/:replyId`     | JWT  | Excluir resposta (somente autor)       |
| GET      | `/posts/:postId/touch`                | JWT  | Status de touch                        |
| POST     | `/posts/:postId/touch`                | JWT  | Registrar touch                        |
| DELETE   | `/posts/:postId/touch`                | JWT  | Remover touch                          |
| GET      | `/posts/:postId/save`                 | JWT  | Status de salvamento                   |
| POST     | `/posts/:postId/save`                 | JWT  | Salvar post                            |
| DELETE   | `/posts/:postId/save`                 | JWT  | Remover dos salvos                     |
| GET      | `/saved`                              | JWT  | Listar posts salvos                    |
| GET      | `/feed`                               | JWT  | Feed personalizado                     |
| GET      | `/profiles/:username/following-status`| JWT  | Status de follow                       |
| POST     | `/profiles/:username/follow`          | JWT  | Seguir perfil                          |
| DELETE   | `/profiles/:username/follow`          | JWT  | Deixar de seguir                       |
| GET      | `/notifications`                      | JWT  | Notificações não lidas                 |
| PATCH    | `/notifications/read`                 | JWT  | Marcar todas como lidas                |
| PATCH    | `/notifications/:id/read`             | JWT  | Marcar uma como lida                   |
| GET      | `/wellbeing`                          | JWT  | Configurações de bem-estar             |
| PATCH    | `/wellbeing`                          | JWT  | Atualizar configurações                |
| GET      | `/stats`                              | —    | Contagem de membros e publicações      |

---

## Fluxo de autenticação e onboarding

### Registro

```
POST /auth/register { email, password }
  └─ Cria atomicamente:
       User (email + passwordHash)
       Profile (name="", username=user_<timestamp>, avatarInitial="?")
       WellbeingSettings (defaults: reducedNotifications=true, limitedFeed=true)
  └─ Retorna: { accessToken, profileId }
```

O token JWT contém `{ sub: userId, profileId }`. Não há sessão no servidor — o token é validado em cada requisição consultando o banco (`jwt.strategy.ts` faz `findUnique` no User pelo `sub`; usuário deletado resulta em 401 imediato).

### Onboarding

Após o registro, o perfil tem `onboardingDone=false`. O frontend redireciona para `/onboarding` (etapas 2, 3 e 4 do wizard — a etapa 1 é a criação da conta).

```
POST /onboarding { name, username, bio?, interests[], intentions[] }
  └─ Atualiza Profile: name, username, avatarInitial, bio
  └─ Insere UserInterest[] e UserOnboardingIntention[]
  └─ Define onboardingDone=true
  └─ Operação idempotente-negativa: lança erro se onboardingDone já for true
```

### Login

```
POST /auth/login { email, password }
  └─ Verifica senha com bcrypt
  └─ Retorna: { accessToken, profileId, onboardingDone }
```

O frontend usa `onboardingDone` para decidir o redirecionamento: `true` → `/feed`, `false` → `/onboarding`.

### Inicialização no cliente

O `AuthContext` lê o token do `localStorage` apenas em `useEffect` (evita mismatch de hidratação SSR). O estado `initialized` é setado após a leitura. `AuthGuard` e a página de login aguardam `initialized=true` antes de tomar decisões de redirecionamento — evita flash de tela errada.

---

## Como o feed funciona

O feed é construído em três etapas, todas ordenadas por `createdAt DESC` (mais recentes primeiro), sem nenhum fator de popularidade:

**1. Posts primários**
Busca posts do próprio usuário + posts de quem o usuário segue. Limite: `12` se `limitedFeed=true`, `20` se `false`.

**2. Complemento de descoberta**
Se a etapa 1 retornar menos posts que o limite, o restante é preenchido com posts recentes de outros usuários (excluindo os já incluídos e os autores já na lista primária).

**3. Status privado por post**
Para cada post no resultado, são consultados em batch os registros de `Touch` e `SavedPost` do usuário autenticado. Cada post recebe `touched: boolean` e `saved: boolean` — campos privados, nunca expostos a outros usuários.

**Resposta:**
```json
{
  "posts": [
    {
      "id": "...",
      "content": "...",
      "intention": "registrar",
      "createdAt": "...",
      "author": { "id", "name", "username", "avatarInitial", "avatarUrl" },
      "_count": { "replies": 3 },
      "touched": false,
      "saved": true
    }
  ],
  "total": 12
}
```

O campo `touched` nunca aparece em endpoints públicos. `_count.replies` é derivado via Prisma `_count` — nunca armazenado.

---

## Decisões importantes de produto

### Touch é radicalmente privado

"Isso me tocou" é a única interação do tipo like. Nenhum endpoint expõe contagem de touches — nem ao próprio autor, nem a terceiros. A tabela `Touch` nunca é incluída em selects públicos. Esta decisão elimina a principal fonte de ansiedade por validação das redes tradicionais.

### Sem contagem de seguidores

`Follow` existe no banco e alimenta o feed, mas nenhum endpoint de perfil público retorna `followersCount` ou `followingCount`. O perfil não transmite popularidade — apenas identidade.

### Feed com teto por sessão

O feed retorna no máximo 20 posts (12 com `limitedFeed` ativo). Não há paginação, não há scroll infinito, não há "carregar mais". A sessão encerra quando o teto é atingido. Isso é intencional — não é uma limitação técnica.

### Notificações intencionalmente limitadas

Apenas dois tipos de notificação existem: `new_reply` e `new_follower`. Touch não gera notificação. O autor nunca sabe que alguém foi tocado pelo seu texto. Isso não é omissão — é política de produto.

### Separação User / Profile

`User` armazena apenas credenciais de autenticação (email, hash de senha). `Profile` armazena a identidade pública (name, username, bio, avatar, interesses). Essa separação permite que dados de autenticação e dados de apresentação evoluam de forma independente.

### JWT com validação no banco

O `JwtStrategy` faz `findUnique` no banco a cada requisição autenticada. Isso garante invalidação imediata ao deletar uma conta — sem necessidade de lista negra de tokens ou expiração antecipada. A troca de desempenho é aceitável para o volume esperado.

### WellbeingSettings criado no registro

As configurações de bem-estar são criadas atomicamente com a conta, com defaults conservadores (`reducedNotifications=true`, `limitedFeed=true`). O usuário começa com a experiência mais calma e pode expandir se quiser — não o contrário.

### Dark mode sem flash

Um script inline no início do `<body>` lê o `localStorage` antes da hidratação do React e aplica a classe `.dark` ao `<html>`. O elemento `<html>` usa `suppressHydrationWarning` para evitar erros de hidratação quando o estado do servidor (sem classe) difere do cliente (com classe). O estado é persistido no banco via `PATCH /wellbeing` a cada toggle.
