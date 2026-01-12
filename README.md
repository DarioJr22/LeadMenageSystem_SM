# 🎯 Lead Management System - Seu Marketing

<div align="center">

![Lead Management](https://img.shields.io/badge/Lead-Management-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

**Sistema completo de gerenciamento de leads, agendamentos e portfólio para agências de marketing digital.**

[🚀 Demo](#) • [📖 Documentação](#documentação) • [🐛 Issues](https://github.com/DarioJr22/LeadMenageSystem_SM/issues)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API](#api)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## 🎨 Sobre o Projeto

O **Lead Management System** é uma solução completa desenvolvida para agências de marketing digital gerenciarem todo o ciclo de vida dos seus clientes - desde o primeiro contato até a conversão. O sistema oferece uma interface intuitiva e moderna para:

- 📊 **Dashboard Analítico**: Visualização em tempo real de métricas e KPIs
- 🎯 **Kanban de Leads**: Gestão visual do funil de vendas
- 📅 **Sistema de Agendamentos**: Consultoria e reuniões organizadas
- 🎨 **Portfólio Dinâmico**: Showcase de projetos realizados

### 🎯 Design Original

Baseado no design profissional disponível no [Figma](https://www.figma.com/design/HqTKfHGKY9CsYf1cg9yZzo/Lead-Management-System).

---

## ⚡ Funcionalidades

### 🔹 Gestão de Leads

- ✅ Criação e exclusão de leads
- ✅ Visualização em formato Kanban (drag & drop)
- ✅ Campos customizados: serviços, orçamento, prioridade
- ✅ Status dinâmico e personalizável
- ✅ Busca por status e prioridade
- ✅ Ações rápidas: ligar, email, WhatsApp

### 🔹 Agendamentos

- ✅ Criar consultorias gratuitas
- ✅ Formulário integrado com dados do lead
- ✅ Campos de serviços e preferência de contato
- ✅ Listagem e visualização de agendamentos
- ✅ Calendário de agendamentos

### 🔹 Portfólio

- ✅ Showcase de projetos realizados
- ✅ Categorias: Social Media, Design, Audiovisual, Tráfego
- ✅ Sistema de destaques
- ✅ Galeria de imagens
- ✅ Tags e filtros por categoria
- ✅ Criação com URLs de imagens

### 🔹 Dashboard

- ✅ Estatísticas em tempo real
- ✅ Gráficos interativos (Recharts)
- ✅ Cards de métricas principais
- ✅ Visualização de tendências

---

## 🛠️ Tecnologias

### Frontend

- **React 18.3.1** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultrarrápido
- **TailwindCSS** - Framework CSS utility-first
- **Shadcn/ui** - Componentes UI de alta qualidade

### Bibliotecas Principais

- **@dnd-kit/core** - Drag and drop para Kanban
- **Axios** - Cliente HTTP
- **React Hook Form** - Gerenciamento de formulários
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones modernos
- **Sonner** - Toast notifications
- **React Day Picker** - Calendário e datas

### UI Components (Radix UI)

- Dialog, Dropdown, Popover, Select
- Accordion, Tabs, Tooltip
- Progress, Slider, Switch
- E muitos outros...

---

## 📋 Pré-requisitos

- **Node.js** >= 16.x
- **npm** ou **yarn** ou **pnpm**
- **Git**

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/DarioJr22/LeadMenageSystem_SM.git
cd "Lead Management System"
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=https://seumarketing-api-production.up.railway.app/api
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

---

## 📖 Uso

### Desenvolvimento

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Gera build de produção
npm run preview      # Preview do build de produção
npm run lint         # Executa o linter
```

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

---

## 📁 Estrutura do Projeto

```
Lead Management System/
├── src/
│   ├── components/           # Componentes React
│   │   ├── ui/              # Componentes base (shadcn/ui)
│   │   ├── dashboard/       # Componentes do Dashboard
│   │   ├── kanban/          # Componentes do Kanban
│   │   ├── agendamentos/    # Componentes de Agendamentos
│   │   └── portfolio/       # Componentes do Portfólio
│   ├── services/            # Serviços e APIs
│   │   ├── api.ts          # API de Leads e Agendamentos
│   │   └── portfolioApi.ts # API do Portfólio
│   ├── styles/             # Estilos globais
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Entry point
├── public/                 # Arquivos estáticos
├── index.html             # HTML principal
├── package.json           # Dependências
├── vite.config.ts        # Configuração Vite
├── tailwind.config.js    # Configuração Tailwind
├── tsconfig.json         # Configuração TypeScript
├── TODO.md               # Tarefas e endpoints faltantes
└── README.md             # Este arquivo
```

---

## 🔌 API

O sistema está integrado com a API REST disponível em:

**Base URL**: `https://seumarketing-api-production.up.railway.app/api`

### Endpoints Principais

#### Leads
- `GET /leads` - Listar todos os leads
- `GET /leads/{id}` - Buscar lead por ID
- `POST /leads` - Criar novo lead
- `DELETE /leads/{id}` - Deletar lead
- `PATCH /leads/{id}/status` - Atualizar status
- `GET /leads/status/{status}` - Buscar por status
- `GET /leads/prioridade/{prioridade}` - Buscar por prioridade

#### Agendamentos
- `GET /agendamentos` - Listar agendamentos
- `GET /agendamentos/{id}` - Buscar por ID
- `POST /agendamentos/agendar` - Agendar consultoria

#### Portfólio
- `GET /portfolio` - Listar projetos
- `GET /portfolio/{slug}` - Buscar por slug
- `GET /portfolio/destaques` - Projetos em destaque
- `GET /portfolio/categoria/{categoria}` - Filtrar por categoria
- `POST /portfolio` - Criar projeto
- `POST /portfolio/com-imagens` - Criar com imagens

### Documentação Completa

Acesse a documentação Swagger em:
`https://seumarketing-api-production.up.railway.app/swagger-ui/index.html`

---

## 🎨 Componentes UI

O projeto utiliza componentes do **shadcn/ui**, altamente customizáveis e acessíveis:

- **Accordion** - Conteúdo expansível
- **Alert Dialog** - Diálogos de confirmação
- **Avatar** - Imagens de perfil
- **Badge** - Etiquetas e tags
- **Button** - Botões customizados
- **Calendar** - Seletor de datas
- **Card** - Containers de conteúdo
- **Chart** - Gráficos com Recharts
- **Dialog** - Modais e diálogos
- **Form** - Formulários validados
- **Select** - Dropdowns elegantes
- **Table** - Tabelas responsivas
- **Tabs** - Navegação por abas
- **Toast** - Notificações
- E muitos outros...

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona NovaFeature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

### Diretrizes

- Mantenha o código limpo e bem documentado
- Siga os padrões de código TypeScript
- Teste suas mudanças antes de submeter
- Atualize a documentação quando necessário

---

## 📝 To-Do

Consulte o arquivo [TODO.md](./TODO.md) para ver:
- ✅ Funcionalidades implementadas
- ❌ Endpoints faltantes no backend
- 🔧 Ajustes necessários nos componentes
- 📋 Prioridades de implementação

---

## 🐛 Problemas Conhecidos

- O endpoint `/dashboard/estatisticas` não existe no backend (ver TODO.md)
- Funcionalidades de edição e exclusão limitadas em agendamentos e portfólio
- Algumas funcionalidades aguardam implementação no backend

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Dario Jr**

- GitHub: [@DarioJr22](https://github.com/DarioJr22)
- Projeto: [LeadMenageSystem_SM](https://github.com/DarioJr22/LeadMenageSystem_SM)

---

## 🙏 Agradecimentos

- Design original disponível no [Figma](https://www.figma.com/design/HqTKfHGKY9CsYf1cg9yZzo/Lead-Management-System)
- [Shadcn/ui](https://ui.shadcn.com/) pelos componentes incríveis
- [Radix UI](https://www.radix-ui.com/) pela base de componentes acessíveis
- Comunidade React e TypeScript

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela!**

Made with ❤️ by [Dario Jr](https://github.com/DarioJr22)

</div>