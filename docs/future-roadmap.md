# Future Roadmap — Entrelinhas

Este documento reúne ideias, melhorias e evoluções futuras do Entrelinhas.

O objetivo é preservar a direção do produto: uma rede social calma, intencional, sem comparação, sem pressa e sem padrões agressivos de retenção.

---

## Princípios para futuras implementações

Toda nova funcionalidade deve respeitar estes princípios:

- evitar métricas públicas de vaidade
- reduzir ansiedade e impulsividade
- privilegiar clareza e silêncio visual
- manter a experiência humana e contemplativa
- evitar transformar o produto em uma rede social tradicional
- priorizar qualidade de interação, não volume

---

## 1. Mensagens privadas com limite por ciclo

### Objetivo

Tornar as conversas mais lentas, intencionais e menos impulsivas.

### Regra proposta

- cada usuário pode enviar no máximo 3 mensagens por ciclo
- após enviar 3 mensagens, precisa aguardar resposta da outra pessoa
- a outra pessoa, ao responder, também pode enviar no máximo 3 mensagens
- após isso, um novo ciclo só pode continuar depois de 3 horas
- esse padrão se repete sucessivamente

### Exemplo de fluxo

- usuário A envia 3 mensagens
- usuário A fica bloqueado
- usuário B pode responder com até 3 mensagens
- após isso, a conversa entra em espera por 3 horas
- depois do período, um novo ciclo pode começar

### Regras importantes

- a validação deve acontecer no backend
- a interface deve mostrar com clareza quando a conversa está em espera
- o bloqueio deve ser explicado com linguagem humana, não punitiva
- o sistema deve evitar sensação de urgência

### UX sugerida

Mensagens como:

- "Essa conversa está em pausa por enquanto."
- "Você poderá responder novamente em breve."
- "Nem toda conversa precisa acontecer com pressa."

---

## 2. Notificações de mensagens

### Objetivo

Tornar mensagens privadas mais claras sem gerar excesso de estímulo.

### Requisitos

- mostrar um ponto vermelho discreto na aba de mensagens quando houver mensagens não lidas
- mostrar um ponto vermelho discreto no sino quando houver notificações novas
- diferenciar, se necessário, notificações gerais e mensagens não lidas
- manter o indicador simples, sem contadores exagerados

### Regras

- sem números grandes chamativos
- sem animações agressivas
- respeitar `silentMode`
- respeitar `reducedNotifications`

### Comportamento esperado

- mensagem nova → ponto vermelho em mensagens
- resposta ao post → ponto vermelho no sino
- modo silencioso → indicadores mais discretos

---

## 3. Melhorias futuras recomendadas

### 3.1. Rascunhos de post

Permitir salvar um texto como rascunho antes de publicar.

**Valor:**

- reduz pressão
- favorece reflexão
- combina com o conceito do produto

---

### 3.2. Agendamento de publicação

Permitir que um post seja publicado em outro momento.

**Valor:**

- reforça intencionalidade
- evita postagem impulsiva
- melhora experiência de escrita

---

### 3.3. Edição com histórico leve

Permitir editar posts e respostas, com marcação discreta de edição.

**Valor:**

- melhora correção de texto
- evita culpa por pequenos erros
- preserva transparência

---

### 3.4. Arquivo pessoal / diário privado

Criar uma área privada para textos não publicados.

**Valor:**

- reforça introspecção
- amplia utilidade do app além da exposição pública
- aproxima o produto de um espaço de escrita real

---

### 3.5. Coleções temáticas

Permitir agrupar posts salvos em coleções:

- silêncio
- rotina
- memórias
- arte
- reflexões

**Valor:**

- melhora organização
- estimula releitura
- mantém tom calmo

---

### 3.6. Busca melhor

Melhorar busca de:

- pessoas
- textos
- temas
- intenções

**Valor:**

- aumenta usabilidade
- facilita descoberta sem precisar de algoritmo agressivo

---

### 3.7. Moderação e segurança

Adicionar melhorias como:

- bloqueio de usuário
- denúncia de conteúdo
- filtro básico contra abuso
- rate limit para spam

**Valor:**

- protege a comunidade
- fortalece estabilidade do produto

---

### 3.8. Sessões de leitura

Criar modo de leitura com menos distração:

- esconder navegação secundária
- foco total no texto
- interface ainda mais limpa

**Valor:**

- reforça contemplação
- diferencia ainda mais o produto

---

### 3.9. Onboarding mais sensível

Refinar onboarding com perguntas melhores sobre:

- intenção de uso
- ritmo desejado
- temas preferidos
- preferências de notificação

**Valor:**

- melhora personalização
- aumenta coerência com bem-estar digital

---

### 3.10. Feed com descoberta suave por afinidade

Hoje o feed é simples e cronológico. No futuro, pode usar afinidade de forma leve.

### Direção

- priorizar próprios posts e seguidos
- usar interesses apenas como critério secundário
- nunca usar popularidade como ranking
- manter limite por sessão

**Valor:**

- descoberta melhor
- sem cair em lógica viciante

---

### 3.11. Página de perfil mais rica

Melhorias possíveis:

- seção “sobre mim” mais elaborada
- temas favoritos
- textos em destaque
- registros recentes
- coleções públicas opcionais

---

### 3.12. Mensagens com estados melhores

Evoluções possíveis para inbox:

- mensagem editada
- mensagem apagada
- indicador de lida
- estado de espera entre ciclos
- aviso de tempo restante até próxima resposta

---

## 4. Melhorias técnicas futuras

### Backend

- paginação consistente nas listas
- jobs/cron para limpeza e manutenção
- auditoria de ações sensíveis
- testes automatizados de regras de negócio
- política melhor de rate limit

### Frontend

- melhor tratamento de erros
- skeletons e estados vazios mais consistentes
- revalidação de dados entre páginas
- redução de flicker
- melhorias de acessibilidade

### Infra

- storage para avatar
- logs mais estruturados
- monitoramento
- ambiente de staging
- pipeline de deploy mais robusto

---

## 5. Prioridades sugeridas

### Alta prioridade

- limite de mensagens por ciclo
- notificações de mensagens com ponto vermelho
- melhor comportamento de notificações no sino
- testes das regras de inbox

### Média prioridade

- rascunhos
- diário privado
- busca melhor
- moderação básica

### Baixa prioridade

- coleções temáticas
- agendamento de post
- leitura imersiva
- perfil mais rico

---

## 6. Observações finais

O Entrelinhas não deve crescer em direção a:

- competição
- urgência
- vício
- excesso de gamificação
- métricas de performance social

Toda evolução futura deve fortalecer a proposta central:
um espaço digital mais calmo, humano e intencional.
