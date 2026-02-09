# 🎓 Portal de Provas Online — Frontend

Este repositório contém o **frontend** do **Mini Sistema de Provas Online**, desenvolvido em **React**, com foco em **experiência do usuário**, **componentização** e **integração com API REST**.

O frontend consome o backend para autenticação, aplicação de provas e exibição de resultados.

---

## 🚀 Objetivo

Demonstrar domínio em:

- React moderno
- Organização de componentes
- Integração com APIs
- Controle de rotas
- Estilização com Tailwind
- Experiência do usuário em sistemas educacionais

---

## 🧰 Stack Tecnológica

- React + Vite
- Tailwind CSS
- Axios
- React Router

---

## 🏗️ Estrutura do Projeto

```
/src
├── pages
├── components
├── services
│ └── api.js
├── routes
└── hooks

/public
```

---

## 🔐 Autenticação

- Tela de login
- Integração com JWT do backend
- Controle de acesso por perfil:
  - Professor
  - Aluno

Rotas protegidas via **React Router**.

---

## 🧑‍🏫 Funcionalidades — Professor

- Criar provas
- Criar questões de múltipla escolha
- Visualizar resultados das provas

---

## 🎓 Funcionalidades — Aluno

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

- Comunicação via Axios
- Consumo de API REST
- Token JWT armazenado no frontend
- Interceptadores para requisições autenticadas

---

## 🌐 Deploy

- Frontend hospedado na **Render**

---

## 🔮 Melhorias Futuras

- Dashboard mais completo
- Melhorias de UX/UI
- Histórico de tentativas
- Acessibilidade
- Modo escuro

---

## 🤝 Considerações Finais

Este frontend foi desenvolvido com foco em **clareza, usabilidade e organização**, simulando a interface de um sistema educacional real.

Feedbacks são muito bem-vindos 🚀
