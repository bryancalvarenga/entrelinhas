# API Reference

**Base URL:** `http://localhost:3001/api`

Todas as rotas protegidas exigem o header:
```
Authorization: Bearer <accessToken>
```

---

## Auth

### POST `/auth/register`

Cria conta, perfil e configurações de bem-estar atomicamente.

**Body:**
```json
{ "email": "string", "password": "string (min 8)" }
```

**Response 201:**
```json
{ "accessToken": "string", "profileId": "uuid" }
```

**Erros:** `409` e-mail já cadastrado.

---

### POST `/auth/login`

**Body:**
```json
{ "email": "string", "password": "string" }
```

**Response 200:**
```json
{ "accessToken": "string", "profileId": "uuid", "onboardingDone": boolean }
```

**Erros:** `401` credenciais inválidas.

---

### DELETE `/auth/account` `JWT`

Exclui a conta e todos os dados associados (cascade completo via Prisma).

**Response 200:**
```json
{ "deleted": true }
```

---

## Onboarding

### POST `/onboarding` `JWT`

Operação de uso único. Lança erro se `onboardingDone` já for `true`.

**Body:**
```json
{
  "name": "string (min 2)",
  "username": "string (min 3, [a-z0-9_])",
  "bio": "string? (max 200)",
  "interests": ["reflexao", "emocoes", ...],
  "intentions": ["registrar", "compartilhar", ...]
}
```

**Interests válidos:** `reflexao`, `rotina`, `criatividade`, `emocoes`, `silencio`, `arte`, `memorias`, `crescimento`

**Intentions válidas:** `registrar`, `compartilhar`, `observar`, `desabafar`, `conectar`

**Response 201:**
```json
{ "onboardingDone": true }
```

---

## Profiles

### GET `/profiles/me` `JWT`

Retorna perfil próprio com `onboardingDone`, interesses e intenções.

**Response 200:**
```json
{
  "id": "uuid",
  "name": "string",
  "username": "string",
  "bio": "string | null",
  "avatarInitial": "string",
  "avatarUrl": "string | null",
  "joinedAt": "ISO date",
  "onboardingDone": true,
  "interests": [{ "interest": "reflexao" }],
  "intentions": [{ "intention": "registrar" }]
}
```

---

### PATCH `/profiles/me` `JWT`

**Body (todos opcionais):**
```json
{
  "name": "string",
  "bio": "string | null",
  "avatarUrl": "string | null"
}
```

**Response 200:** perfil público atualizado.

---

### GET `/profiles/me/posts` `JWT`

Lista posts do usuário autenticado, ordenados por data decrescente.

**Response 200:** `Post[]`

---

### GET `/profiles/:username`

Perfil público. Não inclui `followersCount` nem `followingCount`.

**Response 200:**
```json
{
  "id": "uuid",
  "name": "string",
  "username": "string",
  "bio": "string | null",
  "avatarInitial": "string",
  "avatarUrl": "string | null",
  "joinedAt": "ISO date",
  "interests": [{ "interest": "string" }]
}
```

---

### GET `/profiles/:username/posts`

Posts públicos de um perfil, ordenados por data decrescente.

---

### GET `/profiles/search?q=`

Busca perfis por nome ou username. Retorna array vazio se `q` estiver ausente.

---

## Posts

### POST `/posts` `JWT`

**Body:**
```json
{
  "content": "string (min 1, max 2000)",
  "intention": "registrar | compartilhar | desabafar | refletir"
}
```

**Response 201:** post criado com dados do autor.

---

### GET `/posts/:id`

Post público. Não inclui contagem de touches.

**Response 200:**
```json
{
  "id": "uuid",
  "content": "string",
  "intention": "string",
  "createdAt": "ISO date",
  "author": {
    "id": "uuid",
    "name": "string",
    "username": "string",
    "avatarInitial": "string",
    "avatarUrl": "string | null"
  },
  "_count": { "replies": number }
}
```

---

### DELETE `/posts/:id` `JWT`

Somente o autor pode excluir. **Erros:** `403` se não for o autor, `404` se não existir.

**Response 200:** `{ "deleted": true }`

---

### GET `/posts/search?q=`

Busca posts por conteúdo (full-text simples). Retorna array vazio se `q` estiver ausente.

---

## Replies

### GET `/posts/:postId/replies`

Lista todas as respostas de um post, ordenadas por data crescente.

**Response 200:**
```json
[{
  "id": "uuid",
  "content": "string",
  "createdAt": "ISO date",
  "author": { "id", "name", "username", "avatarInitial", "avatarUrl" }
}]
```

---

### POST `/posts/:postId/replies` `JWT`

**Body:**
```json
{ "content": "string (min 5)" }
```

Dispara notificação `new_reply` para o autor do post (exceto se o autor for o próprio usuário).

**Response 201:** reply criado.

---

### DELETE `/posts/:postId/replies/:replyId` `JWT`

Somente o autor da reply pode excluir. **Erros:** `403`, `404`.

**Response 200:** `{ "deleted": true }`

---

## Touch

Todos os endpoints são protegidos. Touch é sempre privado — nenhum contador é retornado.

### GET `/posts/:postId/touch` `JWT`

**Response 200:** `{ "touched": boolean }`

### POST `/posts/:postId/touch` `JWT`

**Response 200:** `{ "touched": true }`

### DELETE `/posts/:postId/touch` `JWT`

**Response 200:** `{ "touched": false }`

---

## Saved Posts

### GET `/posts/:postId/save` `JWT`

**Response 200:** `{ "saved": boolean }`

### POST `/posts/:postId/save` `JWT`

**Response 200:** `{ "saved": true }`

### DELETE `/posts/:postId/save` `JWT`

**Response 200:** `{ "saved": false }`

### GET `/saved` `JWT`

Lista todos os posts salvos pelo usuário, ordenados por data de salvamento decrescente.

**Response 200:** `Post[]`

---

## Feed

### GET `/feed` `JWT`

Retorna o feed personalizado. Ver [como o feed funciona](../README.md#como-o-feed-funciona) para detalhes da composição.

**Response 200:**
```json
{
  "posts": [
    {
      "id": "uuid",
      "content": "string",
      "intention": "string",
      "createdAt": "ISO date",
      "author": { "id", "name", "username", "avatarInitial", "avatarUrl" },
      "_count": { "replies": number },
      "touched": boolean,
      "saved": boolean
    }
  ],
  "total": number
}
```

`touched` e `saved` são privados do usuário autenticado — nunca expostos a terceiros.

---

## Follows

### GET `/profiles/:username/following-status` `JWT`

**Response 200:** `{ "following": boolean }`

### POST `/profiles/:username/follow` `JWT`

Dispara notificação `new_follower` para o perfil seguido. **Erros:** `409` já segue, `400` auto-follow.

**Response 200:** `{ "following": true }`

### DELETE `/profiles/:username/follow` `JWT`

**Response 200:** `{ "following": false }`

---

## Notifications

### GET `/notifications` `JWT`

Lista notificações não lidas do usuário.

**Response 200:**
```json
[{
  "id": "uuid",
  "type": "new_reply | new_follower",
  "referenceId": "uuid | null",
  "read": false,
  "createdAt": "ISO date"
}]
```

**Tipos disponíveis:** `new_reply` (referenceId = postId), `new_follower` (referenceId = profileId do seguidor).
Touch não gera notificação — por decisão de produto.

### PATCH `/notifications/read` `JWT`

Marca todas as notificações do usuário como lidas.

**Response 200:** `{ "updated": number }`

### PATCH `/notifications/:id/read` `JWT`

Marca uma notificação específica como lida.

**Response 200:** notificação atualizada.

---

## Wellbeing

### GET `/wellbeing` `JWT`

**Response 200:**
```json
{
  "reducedNotifications": true,
  "hideInteractions": false,
  "limitedFeed": true,
  "silentMode": false,
  "darkMode": false
}
```

### PATCH `/wellbeing` `JWT`

Aceita qualquer subconjunto dos campos booleanos acima.

**Body:**
```json
{ "darkMode": true }
```

**Response 200:** configurações completas atualizadas.

---

## Stats

### GET `/stats`

Endpoint público. Usado pela landing page.

**Response 200:**
```json
{ "users": number, "posts": number }
```

`users` = perfis com `onboardingDone=true`. `posts` = total de publicações.

---

## Códigos de erro comuns

| Código | Situação                                         |
|--------|--------------------------------------------------|
| 400    | Dados inválidos no body                          |
| 401    | Token ausente, inválido ou usuário deletado      |
| 403    | Operação não permitida (ex: deletar post alheio) |
| 404    | Recurso não encontrado                           |
| 409    | Conflito (ex: e-mail já cadastrado, já segue)    |
