## 🎓 Portal de Provas Online — Frontend (React + TypeScript + Vite)

Este repositório contém o **frontend** do **Mini Sistema de Provas Online**, desenvolvido em **React 19**, **TypeScript 5** e **Vite 7**, com foco em **experiência do usuário**, **componentização** e **integração com APIs REST**.

O objetivo é simular a interface de um sistema educacional real, permitindo que **professores** e **alunos** interajam com provas online de forma simples e intuitiva.

---

## 🚀 Visão geral / Objetivo

Este projeto foi pensado para demonstrar:

- **Uso de React moderno** com TypeScript
- **Organização de pastas, componentes e páginas**
- **Integração com backend** via API REST
- **Boas práticas de UX** em sistemas educacionais

O frontend consome um backend responsável por:

- Autenticação (login)
- Aplicação de provas
- Cálculo e exibição de resultados

---

## 🧰 Stack Tecnológica

### Stack atual (implementada neste repositório)

- **React** `^19.2.0`
- **React DOM** `^19.2.0`
- **TypeScript** `~5.9.3`
- **Vite** `^7.3.1`
- **ESLint** (linting baseado em:
  - `@eslint/js`
  - `eslint-plugin-react-hooks`
  - `eslint-plugin-react-refresh`
  - `typescript-eslint`
  - `globals`)

### Ferramentas planejadas (a serem adicionadas)

- **React Router** — controle de rotas protegidas
- **Axios** — consumo de API REST com interceptadores
- **Tailwind CSS** — estilização utilitária e responsiva

> Algumas dessas ferramentas podem ainda não estar instaladas, mas fazem parte da visão de arquitetura do frontend.

---

## 🔧 Pré-requisitos

Para rodar o projeto localmente, você precisa de:

- **Node.js** (versão LTS recomendada)
- **Gerenciador de pacotes**:
  - Preferencialmente **pnpm** (existe `pnpm-lock.yaml` no projeto)
  - Alternativamente: `npm` ou `yarn`

---

## 📦 Instalação e uso

Dentro da pasta do projeto:

### 1. Instalar dependências

Com **pnpm** (recomendado):

```bash
pnpm install
```

Com **npm**:

```bash
npm install
```

### 2. Rodar em ambiente de desenvolvimento

```bash
pnpm dev
```

ou

```bash
npm run dev
```

Aplicação normalmente disponível em: `http://localhost:5173`

### 3. Build para produção

```bash
pnpm build
```

ou

```bash
npm run build
```

### 4. Preview do build

```bash
pnpm preview
```

ou

```bash
npm run preview
```

### 5. Lint

```bash
pnpm lint
```

ou

```bash
npm run lint
```

---

## 📜 Scripts disponíveis (`package.json`)

- **`pnpm dev` / `npm run dev`**: inicia o servidor de desenvolvimento Vite
- **`pnpm build` / `npm run build`**: compila o TypeScript (`tsc -b`) e gera o build de produção com Vite
- **`pnpm preview` / `npm run preview`**: roda um servidor para visualizar o build gerado
- **`pnpm lint` / `npm run lint`**: executa o ESLint em todo o projeto

---

## 🏗️ Estrutura do Projeto

Estrutura proposta para o frontend em React + TypeScript:

```text
/src
├── pages/           # Páginas principais (ex.: Login, Provas, Resultados)
├── components/      # Componentes reutilizáveis (botões, headers, cards, etc.)
├── services/
│   └── api.ts       # Configuração de cliente HTTP (ex.: Axios) e chamadas à API
├── routes/          # Definição de rotas (ex.: rotas públicas e protegidas)
├── hooks/           # Hooks personalizados (ex.: auth, fetch, etc.)
└── assets/          # Imagens, ícones, etc.

/public              # Arquivos estáticos públicos
```

> Mesmo que alguns desses arquivos ainda não existam, essa é a **arquitetura alvo** para organização do frontend.

---

## 📊 Fluxo de Dados

### Persistência (localStorage)

| Chave | Conteúdo | Usado por |
|-------|----------|-----------|
| `portal_provas_token` | Token JWT (mock) | AuthContext, exams (com API real) |
| `portal_provas_user` | `{ id, name, email, role }` | AuthContext, exams.ts |
| `portal_provas_users` | `{ users, nextId }` | users.ts (CRUD admin) |
| `portal_provas_mock_data` | `{ exams, questions, attempts, results }` | exams.ts |

### Fluxo geral da aplicação

```mermaid
flowchart TB
    subgraph App [App]
        Main[main.tsx]
    end
    subgraph Providers [Providers]
        Router[BrowserRouter]
        Auth[AuthProvider]
    end
    subgraph Routes [Routes]
        Public[PublicRoute /login]
        Private[PrivateRoute /]
        PR[RoleRoute professor]
        AR[RoleRoute aluno]
        AR2[RoleRoute admin]
    end
    Main --> Router
    Router --> Auth
    Auth --> Routes
    Public --> LoginPage[LoginPage]
    Private --> HomeRedirect[HomeRedirect]
    Private --> PR
    Private --> AR
    Private --> AR2
    PR --> Layout[Layout]
    AR --> Layout
    AR2 --> Layout
    Layout --> ProfessorPages[Professor Pages]
    Layout --> AlunoPages[Aluno Pages]
    Layout --> AdminPages[Admin Pages]
```

### Fluxo de autenticação

```mermaid
flowchart TD
    subgraph Init [Inicialização]
        A1[App carrega] --> A2[AuthProvider]
        A2 --> A3[loadFromStorage]
        A3 --> A4{Token e User em localStorage?}
        A4 -->|Sim| A5[Estado: user + token]
        A4 -->|Não| A6[Estado: null]
    end
    subgraph Login [Login]
        L1[LoginPage: email + senha] --> L2[api.login]
        L2 --> L3{VITE_API_URL?}
        L3 -->|Sim| L4[POST /api/login]
        L3 -->|Não| L5[mockLogin]
        L5 --> L6[users.getUserByEmail]
        L6 --> L7[portal_provas_users]
        L7 --> L8{Usuário existe e senha OK?}
        L8 -->|Sim| L9[Retorna token + user]
        L8 -->|Não| L10[Erro]
        L9 --> L11[AuthContext.login]
        L11 --> L12[localStorage: token + user]
        L12 --> L13[Redireciona conforme role]
    end
```

### Fluxo Admin — CRUD de usuários

```mermaid
flowchart LR
    subgraph AdminUI [Admin UI]
        Lista[ListaUsuariosPage]
        Novo[NovoUsuarioPage]
        Editar[EditarUsuarioPage]
    end
    subgraph UsersService [users.ts]
        LU[listUsers]
        GU[getUser]
        CU[createUser]
        UU[updateUser]
        GBE[getUserByEmail]
    end
    subgraph Store [localStorage]
        PU[portal_provas_users]
    end
    Lista -->|role filter| LU
    Novo --> CU
    Editar --> GU
    Editar --> UU
    LU --> PU
    GU --> PU
    CU --> PU
    UU --> PU
    GBE --> PU
```

### Fluxo Professor — Provas e questões

```mermaid
flowchart TD
    subgraph ProfessorUI [Professor UI]
        LP[ListaProvasPage]
        NP[NovaProvaPage]
        EP[EditarProvaPage]
        QP[QuestoesPage]
        NQP[NovaQuestaoPage]
        EQP[EditarQuestaoPage]
        RP[ResultadosPage]
        RPP[ResultadosProvaPage]
    end
    subgraph ExamsService [exams.ts]
        LE[listExams]
        GE[getExam]
        CE[createExam]
        UE[updateExam]
        DE[deleteExam]
        CQ[createQuestion]
        UQ[updateQuestion]
        DQ[deleteQuestion]
        LR[listResults]
    end
    subgraph Stores [Storage]
        User[portal_provas_user]
        Mock[portal_provas_mock_data]
    end
    LP --> LE
    NP --> CE
    EP --> GE
    EP --> UE
    QP --> GE
    NQP --> CQ
    EQP --> UQ
    EQP --> GE
    RP --> LE
    RPP --> GE
    RPP --> LR
    LE --> User
    LE --> Mock
    CE --> User
    CE --> Mock
    GE --> Mock
    LR --> Mock
```

### Fluxo Aluno — Provas e tentativas

```mermaid
flowchart TD
    subgraph AlunoUI [Aluno UI]
        PD[ProvasDisponiveisPage]
        FP[FazerProvaPage]
        MT[MinhasTentativasPage]
        Res[ResultadoPage]
    end
    subgraph ExamsService [exams.ts]
        LE2[listExams]
        GE2[getExam]
        SA[startAttempt]
        SubA[submitAttempt]
        GRes[getResult]
        LMA[listMyAttempts]
        GAtt[getAttempt]
    end
    subgraph Stores [Storage]
        User2[portal_provas_user]
        Mock2[portal_provas_mock_data]
    end
    PD --> LE2
    PD --> SA
    FP --> GE2
    FP --> SA
    FP --> SubA
    MT --> LMA
    Res --> GAtt
    Res --> GRes
    Res --> GE2
    LE2 --> Mock2
    SA --> User2
    SA --> Mock2
    SubA --> Mock2
    GRes --> Mock2
    LMA --> User2
    LMA --> Mock2
```

### Integração entre serviços

```mermaid
flowchart TB
    subgraph Pages [Pages]
        LoginPage
        AdminPages
        ProfessorPages
        AlunoPages
    end
    subgraph Services [Services]
        API[api.ts]
        Users[users.ts]
        Exams[exams.ts]
    end
    subgraph Context [Context]
        AuthContext
    end
    subgraph Storage [localStorage]
        token[portal_provas_token]
        user[portal_provas_user]
        users[portal_provas_users]
        mock[portal_provas_mock_data]
    end
    LoginPage --> API
    API --> Users
    API --> AuthContext
    AuthContext --> token
    AuthContext --> user
    AdminPages --> Users
    Users --> users
    ProfessorPages --> Exams
    AlunoPages --> Exams
    Exams --> user
    Exams --> mock
```

### Fluxo por papel após login

```mermaid
flowchart TD
    Login[Login OK] --> Role{"Papel do usuário"}
    Role -->|professor| Prof[professor/provas]
    Role -->|aluno| Aluno[aluno/provas]
    Role -->|admin| Admin[admin/usuarios]
    Prof --> ListaP[Lista Provas]
    Prof --> NovaP[Nova Prova]
    Prof --> Questoes[Questões]
    Prof --> Resultados[Resultados]
    Aluno --> Disponiveis[Provas Disponiveis]
    Aluno --> Fazer[Fazer Prova]
    Aluno --> Tentativas[Minhas Tentativas]
    Aluno --> Resultado[Ver Resultado]
    Admin --> ListaU[Lista Usuarios]
    Admin --> NovoU[Novo Usuario]
    Admin --> EditarU[Editar Usuario]
```

---

## 🔐 Autenticação (visão funcional)

- Tela de login para:
  - Professor
  - Aluno
- Integração com backend que utiliza **JWT**
- Armazenamento seguro do token no frontend
- Rotas protegidas (planejadas) via **React Router**

---

## 🧑‍🏫 Funcionalidades — Professor

Algumas das funcionalidades planejadas/implementadas para o perfil **Professor**:

- Criar provas
- Criar questões de múltipla escolha
- Definir tempo de duração das provas
- Visualizar resultados das provas

> Alguns recursos podem estar em desenvolvimento ou em fase de refinamento.

---

## 🎓 Funcionalidades — Aluno

Para o perfil **Aluno**, o sistema prevê:

- Visualizar provas disponíveis
- Realizar prova com:
  - Cronômetro
  - Navegação entre questões
- Enviar respostas
- Visualizar nota final

---

## 🎨 Interface

- Layout responsivo
- Componentes reutilizáveis
- Feedback visual para:
  - Tempo restante
  - Questões respondidas
  - Finalização da prova

---

## 🌐 Integração com Backend

Integração planejada/esperada:

- Comunicação com API REST (ex.: via Axios)
- Utilização de **token JWT** para autenticação
- Interceptadores para requisições autenticadas
- Tratamento de erros e mensagens amigáveis ao usuário

---

## 🌍 Deploy

- Frontend preparado para deploy em plataformas como **Render**, Vercel, Netlify, etc.
- Processo típico:
  - Geração de build (`pnpm build` / `npm run build`)
  - Publicação da pasta de saída gerada pelo Vite

---

## 🔮 Melhorias Futuras / Roadmap

- Dashboard mais completo (gráficos, estatísticas por prova/questão)
- Melhorias de UX/UI
- Histórico de tentativas por aluno
- Acessibilidade (teclado, leitores de tela, contraste)
- Modo escuro
- Internacionalização (i18n)

---

## 🤝 Considerações Finais

Este frontend foi desenvolvido com foco em **clareza, usabilidade e organização do código**, voltado para avaliação técnica e portfólio.

Feedbacks, sugestões de melhorias e PRs são muito bem-vindos.

