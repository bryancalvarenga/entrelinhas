# Arquitetura técnica

## Visão geral

Monorepo com duas apps independentes: backend NestJS (`apps/api`) e frontend Next.js (`apps/web`). Sem workspace manager — cada app tem seu próprio `package.json`.

## Backend — `apps/api`

**Stack:** NestJS · Prisma · PostgreSQL · JWT (passport-jwt) · bcrypt

### Módulos (`src/`)

```
auth/
  auth.service.ts         # register, login, deleteAccount
  auth.controller.ts      # POST /auth/register, POST /auth/login, DELETE /auth/account
  strategies/jwt.strategy.ts  # valida token consultando banco a cada requisição
  guards/jwt-auth.guard.ts

onboarding/               # POST /onboarding — uso único, guarded
profiles/                 # GET|PATCH /profiles/me, GET /profiles/:username
posts/                    # POST|GET|DELETE /posts, GET /posts/search
replies/                  # GET|POST /posts/:id/replies, DELETE .../replies/:id
touches/                  # GET|POST|DELETE /posts/:id/touch
saved-posts/              # GET|POST|DELETE /posts/:id/save, GET /saved
follows/                  # GET|POST|DELETE /profiles/:username/follow
feed/                     # GET /feed
notifications/            # GET|PATCH /notifications
wellbeing/                # GET|PATCH /wellbeing
stats/                    # GET /stats (público)
database/
  prisma.service.ts       # PrismaService global
```

### Modelo de dados

Separação intencional entre `User` (credenciais) e `Profile` (identidade pública):

```
User ──1:1──► Profile ──1:N──► Post ──1:N──► Reply
                │                │
                │                ├──N:M──► Touch    (privado, sem contador)
                │                └──N:M──► SavedPost (privado)
                │
                ├──N:M──► Follow  (sem contagem pública)
                └──1:1──► WellbeingSettings
```

Todas as relações têm `onDelete: Cascade` — `User.delete()` apaga tudo.

**Regras do schema:**
- `Touch` — PK composta `[profileId, postId]`. Nunca incluída em selects públicos. `_count` nunca selecionado.
- `Follow` — PK composta `[followerId, followingId]`. Contagem nunca retornada publicamente.
- `SavedPost` — PK composta `[profileId, postId]`. Acessível apenas pelo dono.
- `Post.repliesCount` — sempre derivado via Prisma `_count.replies`. Não existe coluna armazenada.

### Autenticação

JWT stateless. Payload: `{ sub: userId, profileId }`.

`JwtStrategy.validate()` faz `findUnique` no banco a cada requisição protegida. Conta deletada → `null` → `UnauthorizedException` imediato, sem necessidade de lista negra de tokens.

## Frontend — `apps/web`

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · shadcn/ui

### Organização de rotas

```
app/
├── page.tsx                # Server component — busca /stats com cache: "no-store"
├── login/
├── onboarding/             # Wizard de 4 etapas (etapa 1 = cadastro)
└── (app)/                  # Route group — todas as rotas passam por AuthGuard
    ├── feed/
    ├── new/
    ├── post/[id]/
    ├── profile/
    ├── profile/[username]/
    ├── search/
    └── settings/
```

### Camadas de cliente

```
context/auth-context.tsx    # Estado global de auth: token, profileId, initialized
components/auth-guard.tsx   # Redireciona para /login se não autenticado
lib/api.ts                  # Cliente HTTP base (injeta Bearer token)
lib/posts.ts                # Todas as chamadas de API
lib/types.ts                # Tipos TypeScript centralizados
```

### Dark mode

Script inline no início do `<body>` lê `localStorage` antes da hidratação React e aplica `.dark` ao `<html>`. `<html>` tem `suppressHydrationWarning`. Toggle em `/settings` aplica classe imediatamente + persiste em `localStorage` + sincroniza com `PATCH /wellbeing`.

### Estado de inicialização de auth

`AuthContext` lê `localStorage` em `useEffect` (não durante SSR). Estado `initialized` é `false` até a leitura completar. `AuthGuard` e página de login aguardam `initialized=true` antes de redirecionar — evita flash de tela errada na inicialização.

## Infraestrutura local

```yaml
# docker-compose.yml
postgres:
  image: postgres:16
  port: 5433:5432   # porta externa 5433 evita conflito com instâncias locais
```

**Portas:**
- `3000` — frontend Next.js
- `3001` — backend NestJS (`/api`)
- `5433` — PostgreSQL (docker)
