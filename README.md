#  CardsMarket

> Marketplace de troca de cartas desenvolvido com Vue 3, TypeScript e PrimeVue.

![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)
![PrimeVue](https://img.shields.io/badge/PrimeVue-4.5-00A68A?logo=prime&logoColor=white)

##  Sobre o Projeto

CardsMarket é uma plataforma web para troca de cartas entre jogadores. O sistema permite:

-  **Autenticação completa**: Registro, login e gestão de sessão com token JWT
-  **Marketplace público**: Visualizar trocas disponíveis de outros usuários
-  **Gerenciamento de coleção**: Adicionar, visualizar e organizar suas cartas
-  **Criação de trocas**: Oferecer cartas e solicitar outras em troca
-  **Design responsivo**: Experiência otimizada para desktop e mobile
-  **UX moderna**: Bottom navigation, tooltips, transições suaves e confirmações elegantes

##  Tecnologias

| Categoria | Tecnologias |
|-----------|------------|
| **Frontend** | Vue 3, TypeScript, Vite |
| **UI/UX** | PrimeVue, TailwindCSS, PrimeIcons |
| **Estado** | Pinia (store) |
| **Rotas** | Vue Router 5 |
| **Qualidade** | ESLint, Oxlint, Prettier, vue-tsc |
| **HTTP** | Axios (via httpClient abstraído) |

##  Como Rodar o Projeto

### Pré-requisitos

- Node.js 20+ ou 22+
- npm ou pnpm

### Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Acessar em: http://localhost:5173

# Comandos principais
npm run dev      # Desenvolvimento (hot-reload)
npm run build    # Build para produção
npm run preview  # Preview do build local
npm run lint     # Corrigir código (ESLint + Oxlint)
npm run format   # Formatar com Prettier

# Destaques
 Autenticação JWT com refresh automático
 Design responsivo: Desktop + Mobile (bottom nav)
 Componentes reutilizáveis: CardItem, ButtonItem, LoadingSpinner
 Tipagem TypeScript em todo o projeto
 UX moderna: Tooltips, transições, confirmações elegantes

# Estrutura principal
src/
├── composables/   # Lógica reutilizável (useMarketplace, etc.)
├── modules/       # Features: auth, cards, trades
├── shared/        # Componentes: CardItem, ButtonItem, HeroBanner
├── stores/        # Pinia: auth.store
├── types/         # Tipagem centralizada
└── router/        # Rotas + guards de autenticação

# Deploy 
npm run build
# Deploy a pasta 'dist' em: Vercel, Netlify, Cloudflare Pages, ou servidor estático



