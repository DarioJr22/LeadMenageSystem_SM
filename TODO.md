# TODO - Funcionalidades e Endpoints Faltantes

Este arquivo documenta as funcionalidades e endpoints que ainda não foram implementados no projeto, mas que existem na API conforme a documentação Swagger.

## ✅ ATUALIZAÇÃO CONCLUÍDA (06/01/2026)

**Todos os componentes da UI foram adequados ao Swagger!**

### Alterações Realizadas:

#### **API Services** (api.ts e portfolioApi.ts)
- ✅ Tipos atualizados conforme Swagger
- ✅ Endpoints ajustados para corresponder exatamente à API
- ✅ Removidos endpoints que não existem no backend

#### **Componentes de Leads**
- ✅ `NewLeadModal.tsx` - Adicionado campo obrigatório `servicos[]`, campos opcionais de orçamento, prioridade e mensagem
- ✅ `LeadModal.tsx` - Removida funcionalidade de edição completa (não existe PUT /leads/{id}), mantido apenas visualização e exclusão
- ✅ `LeadCard.tsx` - Atualizado campo `dataCriacao` para `createdAt`

#### **Componentes de Agendamentos**
- ✅ `NewAgendamentoModal.tsx` - Completamente refeito para usar `AgendamentoRequest` com campos do Swagger
- ✅ `AgendamentoModal.tsx` - Convertido para apenas visualização (sem editar/excluir)
- ✅ `Agendamentos.tsx` - Ajustado para remover parâmetros de update/delete

#### **Componentes de Portfolio**
- ✅ `PortfolioFormModal.tsx` - Atualizado para usar `CATEGORIAS_SWAGGER`, ajustado `createComImagens` para query params
- ✅ `PortfolioCard.tsx` - Alterado `imagemPrincipal` para `imagemCapa`, id de string para number
- ✅ `PortfolioGrid.tsx` - Tipo de id atualizado para number
- ✅ `PortfolioDetailModal.tsx` - Tipo de id atualizado para number

---

## ✅ Endpoints Implementados e Adequados ao Swagger

### Leads
- ✅ `GET /api/leads` - Listar todos os leads
- ✅ `GET /api/leads/{id}` - Buscar lead por ID
- ✅ `POST /api/leads` - Criar lead
- ✅ `DELETE /api/leads/{id}` - Deletar lead
- ✅ `PATCH /api/leads/{id}/status` - Atualizar status do lead
- ✅ `GET /api/leads/status/{status}` - Buscar leads por status
- ✅ `GET /api/leads/prioridade/{prioridade}` - Buscar leads por prioridade

### Agendamentos
- ✅ `GET /api/agendamentos` - Listar todos os agendamentos
- ✅ `GET /api/agendamentos/{id}` - Buscar agendamento por ID
- ✅ `POST /api/agendamentos/agendar` - Agendar consultoria

### Portfólio
- ✅ `GET /api/portfolio` - Listar todos os itens do portfólio
- ✅ `GET /api/portfolio/{slug}` - Buscar item por slug
- ✅ `GET /api/portfolio/destaques` - Listar itens em destaque
- ✅ `GET /api/portfolio/categoria/{categoria}` - Listar por categoria
- ✅ `POST /api/portfolio` - Criar novo item
- ✅ `POST /api/portfolio/com-imagens` - Criar item com URLs de imagens

---

## ❌ Endpoints Faltantes (Não existem no Swagger)

### Leads
- ❌ `PUT /api/leads/{id}` - Atualizar lead completo (não existe no Swagger, apenas PATCH para status)
- ❌ `GET /api/leads/por-status` - Retornar leads agrupados por status (formato diferente do Swagger)

### Agendamentos
- ❌ `POST /api/agendamentos` - Criar agendamento genérico (Swagger só tem `/agendar`)
- ❌ `PUT /api/agendamentos/{id}` - Atualizar agendamento
- ❌ `DELETE /api/agendamentos/{id}` - Deletar agendamento
- ❌ `GET /api/agendamentos/proximos` - Buscar próximos agendamentos
- ❌ `GET /api/agendamentos/por-periodo` - Buscar agendamentos por período

### Dashboard
- ❌ `GET /api/dashboard/estatisticas` - Obter estatísticas do dashboard (não existe no Swagger)

### Portfólio
- ❌ `PUT /api/portfolio/{id}` - Atualizar item do portfólio
- ❌ `PUT /api/portfolio/{id}/com-imagens` - Atualizar item com imagens
- ❌ `DELETE /api/portfolio/{id}` - Deletar item do portfólio

---

## 🔧 Ajustes Necessários nos Componentes

### 1. Componentes de Leads
**Arquivos afetados:**
- `src/components/kanban/LeadModal.tsx`
- `src/components/kanban/NewLeadModal.tsx`
- `src/components/kanban/LeadCard.tsx`

**Mudanças necessárias:**
- Adicionar campo obrigatório `servicos: string[]` nos formulários
- Campos opcionais: `orcamentoMin`, `orcamentoMax`, `mensagem`, `prioridade`
- Remover campos que não existem no backend: `responsavel`, `ultimaInteracao`
- Ajustar tipos de status (agora é `string` genérica, não enum)
- Campo `telefone` é opcional
- Remover uso de `leadsApi.update()` - usar apenas `updateStatus()` para status

### 2. Componentes de Agendamentos
**Arquivos afetados:**
- `src/components/agendamentos/AgendamentoModal.tsx`
- `src/components/agendamentos/NewAgendamentoModal.tsx`
- `src/components/agendamentos/AgendamentosList.tsx`

**Mudanças necessárias:**
- Usar `agendamentosApi.agendar()` em vez de `create()`
- Ajustar interface para `AgendamentoRequest` com campos:
  - `nome`, `email` (obrigatórios)
  - `servicos: string[]` (obrigatório)
  - `dataAgendamento` (formato: yyyy-MM-dd)
  - `horario` (formato: HH:mm)
  - `preferencia` (whatsapp ou meet)
- Remover funcionalidades de: update, delete, getProximos, getByPeriodo
- Campos removidos do modelo: `leadId`, `leadNome`, tipo enum `REUNIAO|LIGACAO|etc`

### 3. Componentes de Portfólio
**Arquivos afetados:**
- `src/components/portfolio/PortfolioFormModal.tsx`
- `src/components/portfolio/CategoryFilter.tsx`
- `src/components/portfolio/PortfolioCard.tsx`

**Mudanças necessárias:**
- Atualizar categorias para usar `CATEGORIAS_SWAGGER`:
  - `SOCIAL_MEDIA`
  - `DESIGN`
  - `AUDIOVISUAL`
  - `TRAFEGO`
- Ajustar tipo de `id` de `string` para `number`
- Campos do modelo alterados:
  - `imagemCapa` em vez de `imagemPrincipal`
  - `imagensGaleria` em vez de `imagens`
  - `url` (array) em vez de `linkExterno`
  - `ativo` (boolean) em vez de `status: 'ativo' | 'inativo'`
  - Remover: `cliente.id`, `dataRealizacao`, `criadoEm`, `atualizadoEm`
- Remover funcionalidades de: update, delete (não existem no Swagger)
- Ajustar `createComImagens` para usar query params em vez de body

### 4. Dashboard
**Arquivos afetados:**
- `src/components/Dashboard.tsx`
- `src/components/dashboard/*`

**Mudanças necessárias:**
- O endpoint `/dashboard/estatisticas` não existe no Swagger
- Considerar implementar cálculos locais ou solicitar criação do endpoint no backend
- Alternativa: usar os endpoints de leads e agendamentos para calcular estatísticas no frontend

---

## 📋 Prioridades de Implementação

### Prioridade Alta (Bloqueadores)
1. ⚠️ Ajustar formulários de Lead para incluir campo obrigatório `servicos`
2. ⚠️ Ajustar formulários de Agendamento para novo formato `AgendamentoRequest`
3. ⚠️ Atualizar componentes de Portfólio para novas categorias do Swagger
4. ⚠️ Remover chamadas a endpoints que não existem (update agendamentos, etc)

### Prioridade Média
5. 🔄 Implementar fallback para Dashboard (calcular estatísticas localmente)
6. 🔄 Atualizar validações de formulários conforme novos tipos
7. 🔄 Ajustar filtros e buscas para usar novos endpoints

### Prioridade Baixa
8. 📝 Solicitar ao backend implementação de endpoints faltantes (se necessário)
9. 📝 Revisar UX para remover funcionalidades não suportadas pelo backend
10. 📝 Atualizar documentação do projeto

---

## 🔍 Observações Importantes

### Mudanças Críticas de Tipo
1. **Lead.id**: `number` (antes poderia ser string em alguns lugares)
2. **PortfolioItem.id**: `number` (antes era `string`)
3. **Lead.status**: `string` genérica (antes era enum específico)
4. **Lead.servicos**: agora é obrigatório (array de strings)
5. **Agendamento**: estrutura completamente diferente

### Endpoints Deprecados
- Todos os endpoints de UPDATE (PUT) não existem no Swagger atual
- Endpoints de DELETE só existem para Leads
- Filtros e buscas específicas foram limitados

### Recomendações
1. Considerar solicitar ao time de backend a implementação de endpoints CRUD completos
2. Implementar cache local para compensar falta de alguns endpoints
3. Revisar fluxos de usuário que dependem de funcionalidades não disponíveis
4. Adicionar tratamento de erros para endpoints que podem falhar

---

## 📅 Última Atualização
Data: 06/01/2026
Versão da API: 1.0.0
Base URL: https://seumarketing-api-production.up.railway.app/api
