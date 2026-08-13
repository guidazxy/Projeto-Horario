# 🎓 Plano de Projeto — Sistema Acadêmico de Captura de Leads

> Documento de planejamento alinhado à arquitetura definida no [`README.md`](../README.md).

---

## 1. 📌 Objetivo Geral

Desenvolver um **Sistema Acadêmico de Captura e Gestão de Leads** demonstrando a integração de ponta a ponta entre uma interface web reativa em **React 18** e uma API RESTful em **Python (FastAPI)**, com persistência relacional em **SQLite**.

## 2. 🎯 Objetivos Específicos

- Construir um formulário reativo de captura de leads com validação e máscaras dinâmicas.
- Expor uma API RESTful segura com sanitização de dados contra ataques XSS.
- Permitir a consulta em tempo real dos leads gravados no SQLite via modal interativo.
- Oferecer estética **Dark Glassmorphism** com design moderno e responsivo.

## 3. 🛠️ Arquitetura e Tecnologias

### Frontend
| Tecnologia | Função |
|---|---|
| **React 18** | Biblioteca declarativa e baseada em componentes reativos |
| **Vite** | Build e Hot Module Replacement (HMR) |
| **Tailwind CSS v3** | Estilização utilitária, responsiva e elegante |
| **JSX & React Hooks** | Gerenciamento de estado (`useState`, `useEffect`) e chamadas assíncronas via `fetch` |

### Backend
| Tecnologia | Função |
|---|---|
| **Python 3.13** | Linguagem principal do backend |
| **FastAPI** | Framework web para construção de APIs RESTful |
| **Uvicorn** | Servidor ASGI de execução (Porta 3000) |
| **Pydantic & Validadores** | Sanitização contra XSS, validação de e-mails/telefones e tratamento de erros |
| **SQLite (sqlite3)** | Banco relacional embutido com *Prepared Statements* e modo WAL |
| **CORS Middleware** | Controle de requisições Cross-Origin entre React e Python |

### Camadas do Backend
- `src/config/conexao_banco.py` — conexão SQLite (`row_factory=dict`, WAL mode).
- `src/controladores/lead_controlador.py` — lógica de negócio (cadastrar e listar leads).
- `src/rotas/lead_rotas.py` — endpoints HTTP da aplicação (`/api/leads`).
- `src/utilitarios/validadores.py` — funções de sanitização e validação.
- `src/app.py` — criação do app FastAPI, CORS, arquivos estáticos e fallback SPA.

## 4. 🖥️ Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/` | Servidor estático da aplicação React (`frontend/dist`) |
| `GET` | `/api/health` | Health Check do servidor Python |
| `POST` | `/api/leads` | Cadastrar novo lead no banco SQLite |
| `GET` | `/api/leads` | Listar leads cadastrados no SQLite (paginado) |

## 5. 📁 Estrutura do Projeto

```text
projeto_horario/
├── api/                          # Backend API RESTful em Python
│   ├── db/                       # Banco de dados SQLite (criado em runtime)
│   │   └── landing.db            # Arquivo da base de dados local
│   ├── src/
│   │   ├── config/
│   │   │   └── conexao_banco.py  # Conexão SQLite (row_factory dict, WAL mode)
│   │   ├── controladores/
│   │   │   └── lead_controlador.py  # Lógica de negócio (cadastrar e listar leads)
│   │   ├── rotas/
│   │   │   └── lead_rotas.py     # Endpoints HTTP da aplicação (/api/leads)
│   │   ├── utilitarios/
│   │   │   └── validadores.py    # Funções de sanitização e validação
│   │   └── app.py                # FastAPI app, CORS, estáticos e fallback SPA
│   ├── .env                      # Variáveis de ambiente (PORT=3000, ORIGEM_PERMITIDA=*)
│   ├── iniciar_banco.py          # Criação da tabela de leads e índices SQLite
│   ├── main.py                   # Ponto de entrada do servidor Uvicorn (Porta 3000)
│   ├── package.json              # Atalho para scripts de desenvolvimento
│   └── requirements.txt          # Dependências do Python (FastAPI, Uvicorn, etc.)
├── frontend/                     # Frontend reativo em React 18 + Vite
│   ├── src/
│   │   ├── components/           # Componentes React modulares
│   │   │   ├── Header.jsx        # Navbar fixa com marca AcademiStack e status
│   │   │   ├── Hero.jsx          # Banner principal com visualizador de código
│   │   │   ├── Beneficios.jsx    # Cards da arquitetura (Python, React, SQLite, Segurança)
│   │   │   ├── FormularioLead.jsx# Formulário reativo com máscara e validação
│   │   │   ├── ModalLeads.jsx    # Modal de consulta em tempo real aos leads do SQLite
│   │   │   ├── Toast.jsx         # Componente de notificação flutuante
│   │   │   └── Footer.jsx        # Rodapé acadêmico com atalhos de sistema
│   │   ├── App.jsx               # Componente raiz da aplicação
│   │   ├── main.jsx              # Ponto de entrada do React (ReactDOM)
│   │   └── index.css             # Estilos globais, fontes e animações glassmorphic
│   ├── index.html                # Ponto de montagem HTML com Google Fonts
│   ├── vite.config.js            # Configuração do Vite e proxy da API (/api -> 3000)
│   ├── tailwind.config.js        # Configuração do Tailwind CSS
│   ├── postcss.config.js         # Configuração PostCSS
│   └── package.json              # Dependências do React e scripts Vite
├── doc/                          # Documentação técnica do projeto
│   ├── escopo_do_projeto.md      # Escopo, objetivos e delimitações do projeto
│   ├── requisitos_usuario.md     # Requisitos funcionais e não funcionais coletados
│   └── plano_projeto.md          # Plano de projeto, cronograma e riscos
├── .gitignore                    # Arquivos ignorados pelo Git (.venv, node_modules, dist, db)
└── README.md                     # Documentação oficial do projeto
```

## 6. 🧩 Requisitos Funcionais Principais

- RF01 — Exibir landing page com visual futurista (Dark Glassmorphism).
- RF02 — Capturar leads por meio de formulário com máscara e validação.
- RF03 — Gravar os leads no SQLite via `POST /api/leads`.
- RF04 — Consultar leads em tempo real via `GET /api/leads` no modal interativo.
- RF05 — Apresentar abas interativas com amostras de código do backend e frontend.

## 7. 🔒 Requisitos Não Funcionais

- RNF01 — Sanitização estrita dos dados no servidor contra ataques XSS.
- RNF02 — Alta performance com Uvicorn e ASGI (asyncio).
- RNF03 — Banco com *Prepared Statements* e modo WAL para integridade e concorrência.
- RNF04 — Interface responsiva e acessível em diferentes dispositivos.

## 8. ⏱️ Cronograma Sugerido

| Fase | Atividade | Duração Estimada |
|---|---|---|
| 1 | Definição de escopo, requisitos e arquitetura | 1 semana |
| 2 | Backend: setup FastAPI, banco SQLite e endpoints | 1 semana |
| 3 | Frontend: componentes React, Tailwind e integração via `fetch` | 2 semanas |
| 4 | Validação, sanitização e teste dos fluxos de cadastro/consulta | 1 semana |
| 5 | Build de produção, documentação e apresentação | 1 semana |

## 9. ⚠️ Riscos e Mitigações

| Risco | Mitigação |
|---|---|
| Incompatibilidade de versões Python/Node | Isolamento com `.venv` e `package-lock.json` |
| Injeção XSS no formulário | Sanitização com `html.escape` e validação no backend |
| Conflitos de porta (3000/5173) | Uso de `npx kill-port` e configuração via `.env` |
| Atraso na integração frontend/backend | Testes contínuos do fluxo de dados via `GET /api/health` |