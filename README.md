# Projeto Horario — Sistema de Gestão de Horários Escolares

## Instituto Federal de Mato Grosso — Campus de Barra do Garças (IFMT)

**Disciplina:** Programação Web  
**Turma:** Terceiro Ano B — Ano 2026  
**Acadêmicos:** Carlos Alexandre Dias da Silva e Lara Guida Carvalho  
**Professor:** Carlos David Rocha de Souza

---

## Sobre o Projeto

Sistema acadêmico full stack para **gestão de horários escolares**, desenvolvido com **React 18 (Vite + Tailwind CSS)** no frontend e **Python 3 (FastAPI + Uvicorn)** no backend, utilizando **SQLite** como banco de dados relacional.

O sistema permite o cadastro e gerenciamento de cursos, turmas, professores, matérias, salas, horários e alocações de horários, além de um formulário de captação de leads e sistema de autenticação.

---

## Tecnologias Utilizadas

### Frontend
- **React 18.3.1** — Biblioteca de interfaces baseada em componentes
- **Vite 5.4.8** — Build tool com Hot Module Replacement (HMR)
- **Tailwind CSS 3.4.14** — Framework CSS utilitário

### Backend
- **Python 3.13** — Linguagem de programação
- **FastAPI ≥0.115.0** — Framework web para APIs RESTful
- **Uvicorn ≥0.30.0** — Servidor ASGI de alta performance
- **Pydantic ≥2.0** — Validação e serialização de dados
- **SQLite (sqlite3)** — Banco de dados relacional leve e embutido
- **python-dotenv ≥1.0** — Carregamento de variáveis de ambiente

---

## Estrutura do Projeto

```
projeto_horario/
├── api/                                # Backend API RESTful
│   ├── db/                             # Banco de dados SQLite (criado em runtime)
│   │   └── horario_escolar.db          # Arquivo do banco de dados
│   ├── src/
│   │   ├── __init__.py
│   │   ├── app.py                      # FastAPI app, CORS, rotas
│   │   ├── config/
│   │   │   └── conexao_banco.py        # Conexão SQLite (dict_factory, WAL, foreign_keys)
│   │   ├── controladores/
│   │   │   ├── lead_controlador.py     # CRUD de leads
│   │   │   ├── materia_controlador.py  # CRUD de matérias e professores
│   │   │   ├── professor_materia_controlador.py  # Relação N:N professor-matéria
│   │   │   ├── restricoes_controlador.py  # Restrições de alocação
│   │   │   ├── sala_controlador.py     # CRUD de salas e horários
│   │   │   ├── turma_controlador.py    # CRUD de cursos e turmas
│   │   │   ├── turma_materia_controlador.py  # Relação N:N turma-matéria
│   │   │   └── horarios_alocados_controlador.py  # Alocação de horários
│   │   ├── rotas/
│   │   │   ├── __init__.py
│   │   │   ├── auth_rotas.py           # Rotas de autenticação
│   │   │   └── lead_rotas.py           # Rotas de leads
│   │   └── utilitarios/
│   │       └── validadores.py          # Validação e sanitização de dados
│   ├── .env                            # Variáveis de ambiente (não versionado)
│   ├── iniciar_banco.py                # Script de criação do banco de dados
│   ├── main.py                         # Ponto de entrada do servidor
│   └── requirements.txt                # Dependências Python
│
├── frontend/                           # Frontend React
│   ├── src/
│   │   ├── main.jsx                    # Ponto de entrada do React
│   │   ├── App.jsx                     # Componente raiz (autenticação, rotas)
│   │   ├── index.css                   # Estilos globais e animações
│   │   └── components/
│   │       ├── Header.jsx              # Navbar com logo e botões
│   │       ├── Hero.jsx                # Banner principal
│   │       ├── Beneficios.jsx          # Cards de benefícios
│   │       ├── FormularioLead.jsx      # Formulário de captação de leads
│   │       ├── ModalLeads.jsx          # Modal de listagem de leads
│   │       ├── Login.jsx               # Tela de autenticação
│   │       ├── Toast.jsx               # Notificações flutuantes
│   │       └── Footer.jsx              # Rodapé
│   ├── index.html                      # Ponto de montagem HTML
│   ├── vite.config.js                  # Configuração do Vite e proxy da API
│   ├── tailwind.config.js              # Configuração do Tailwind CSS
│   ├── postcss.config.js               # Configuração PostCSS
│   └── package.json                    # Dependências e scripts
│
├── doc/                                # Documentação do projeto
│   ├── escopo_do_projeto.md
│   ├── plano_projeto.md
│   └── requisitos_usuario.md
│
├── .gitignore
└── README.md
```

---

## Banco de Dados (SQLite)

Banco de dados relacional com **10 tabelas** e **9 índices** para performance. Criado automaticamente via `api/iniciar_banco.py` na primeira execução.

### Diagrama de Tabelas

| Tabela | Descrição |
|--------|-----------|
| `cursos` | Cursos disponíveis na instituição |
| `turmas` | Turmas vinculadas a cursos |
| `professores` | Professores da instituição |
| `materias` | Matérias/disciplinas |
| `professor_materia` | Relação N:N entre professores e matérias |
| `salas` | Salas de aula com capacidade e tipo |
| `horarios` | Slots de horário (dia da semana + hora início/fim) |
| `turma_materia` | Relação N:N entre turmas e matérias (com professor) |
| `horarios_alocados` | Alocações de horários por turma-matéria-sala |
| `restricoes` | Restrições de alocação (professor, sala, turma) |
| `leads` | Formulário de captação de contatos |

### Detalhamento das Tabelas

#### cursos
| Coluna | Tipo | Restrição |
|--------|------|-----------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `nome` | TEXT | NOT NULL UNIQUE |
| `descricao` | TEXT | — |

#### turmas
| Coluna | Tipo | Restrição |
|--------|------|-----------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `nome` | TEXT | NOT NULL |
| `curso_id` | INTEGER | FK → cursos(id) |
| `ano_letivo` | TEXT | — |
| `periodo_letivo` | TEXT | — |

#### professores
| Coluna | Tipo | Restrição |
|--------|------|-----------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `nome_completo` | TEXT | NOT NULL |
| `email` | TEXT | NOT NULL UNIQUE |
| `disciplina_favorita` | TEXT | — |

#### materias
| Coluna | Tipo | Restrição |
|--------|------|-----------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `nome` | TEXT | NOT NULL UNIQUE |
| `carga_horaria_semanal` | INTEGER | DEFAULT 0 |
| `descricao` | TEXT | — |

#### professor_materia (Relação N:N)
| Coluna | Tipo | Restrição |
|--------|------|-----------|
| `professor_id` | INTEGER | PK, FK → professores(id) ON DELETE CASCADE |
| `materia_id` | INTEGER | PK, FK → materias(id) ON DELETE CASCADE |

#### salas
| Coluna | Tipo | Restrição |
|--------|------|-----------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `nome` | TEXT | NOT NULL UNIQUE |
| `capacidade` | INTEGER | DEFAULT 50 |
| `tipo` | TEXT | DEFAULT 'sala' |

#### horarios
| Coluna | Tipo | Restrição |
|--------|------|-----------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `dia_semana` | TEXT | NOT NULL |
| `hora_inicio` | TEXT | NOT NULL |
| `hora_fim` | TEXT | NOT NULL |
| `slot` | TEXT | GENERATED ALWAYS AS (concat(hora_inicio, '-', hora_fim)) STORED |

#### turma_materia (Relação N:N)
| Coluna | Tipo | Restrição |
|--------|------|-----------|
| `turma_id` | INTEGER | PK, FK → turmas(id) ON DELETE CASCADE |
| `materia_id` | INTEGER | PK, FK → materias(id) ON DELETE CASCADE |
| `professor_id` | INTEGER | FK → professores(id) ON DELETE SET NULL |

#### horarios_alocados
| Coluna | Tipo | Restrição |
|--------|------|-----------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `turma_materia_id` | INTEGER | NOT NULL, FK → turma_materia(id) ON DELETE CASCADE |
| `dia_semana` | TEXT | NOT NULL |
| `horario_id` | INTEGER | NOT NULL, FK → horarios(id) |
| `sala_id` | INTEGER | FK → salas(id) ON DELETE SET NULL |
| `status` | TEXT | DEFAULT 'pendente', CHECK IN ('pendente','confirmado','cancelado') |

#### restricoes
| Coluna | Tipo | Restrição |
|--------|------|-----------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `tipo` | TEXT | NOT NULL, CHECK IN ('professor','sala','turma') |
| `descricao` | TEXT | NOT NULL |
| `valor` | TEXT | — |
| `ativa` | INTEGER | DEFAULT 1 |

#### leads
| Coluna | Tipo | Restrição |
|--------|------|-----------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `nome_completo` | TEXT | NOT NULL |
| `email` | TEXT | NOT NULL UNIQUE |
| `telefone_whatsapp` | TEXT | NOT NULL |
| `mensagem` | TEXT | — |
| `data_cadastro` | TEXT | DEFAULT datetime('now','localtime') |
| `status_atendimento` | TEXT | DEFAULT 'novo', CHECK IN ('novo','atendido','cancelado') |

### Índices

```sql
idx_cursos_nome                     ON cursos(nome)
idx_turmas_curso                    ON turmas(curso_id)
idx_professor_materia_prof          ON professor_materia(professor_id)
idx_professor_materia_materia       ON professor_materia(materia_id)
idx_turma_materia_turma             ON turma_materia(turma_id)
idx_turma_materia_materia           ON turma_materia(materia_id)
idx_horarios_alocados_turma_materia ON horarios_alocados(turma_materia_id)
idx_horarios_alocados_sala          ON horarios_alocados(sala_id)
idx_horarios_alocados_status        ON horarios_alocados(status)
```

---

## Endpoints da API

| Método | Rota | Descrição | Status |
|--------|------|-----------|--------|
| `GET` | `/api/health` | Health check do servidor | 200 |
| `POST` | `/api/auth/login` | Autenticação de usuário | 200 / 401 |
| `GET` | `/api/auth/status` | Verificar status de autenticação | 200 |
| `POST` | `/api/leads` | Cadastrar novo lead | 201 / 422 |
| `GET` | `/api/leads` | Listar leads (paginação: `pagina`, `limite`) | 200 |

### Validações (Backend)

| Campo | Regra | Sanitização |
|-------|-------|-------------|
| `nome_completo` | Obrigatório, 3–150 caracteres | `html.escape` + `strip()` |
| `email` | Obrigatório, formato válido | `html.escape` |
| `telefone_whatsapp` | Obrigatório, 10–15 dígitos | Somente dígitos |
| `mensagem` | Opcional, máx. 500 caracteres | `html.escape` |

---

## Componentes React

| Componente | Descrição |
|------------|-----------|
| `App.jsx` | Componente raiz — gerencia autenticação e rotas |
| `Login.jsx` | Tela de login com seleção de perfil (funcionário/aluno) |
| `Header.jsx` | Navbar fixa com logo e botões de ação |
| `Hero.jsx` | Banner principal com visualizador de código interativo |
| `Beneficios.jsx` | Cards descritivos da arquitetura |
| `FormularioLead.jsx` | Formulário de captação com máscara de telefone |
| `ModalLeads.jsx` | Modal com listagem de leads em tempo real |
| `Toast.jsx` | Notificação flutuante (auto-dismiss 4s) |
| `Footer.jsx` | Rodapé com informações do projeto |

---

## Como Executar

### 1. Instalar Dependências

**Backend:**
```bash
cd api
python -m venv .venv
# Linux/Mac:
source .venv/bin/activate && pip install -r requirements.txt
# Windows:
.venv\Scripts\pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Iniciar o Servidor

**Terminal 1 — Backend (porta 3000):**
```bash
cd api
# Linux/Mac:
.venv/bin/python main.py
# Windows:
.venv\Scripts\python main.py
```

**Terminal 2 — Frontend (porta 5173):**
```bash
cd frontend
npm run dev
```

### 3. Acessar

- **Frontend:** http://localhost:5173
- **API Health:** http://localhost:3000/api/health

### 4. Modo Produção

```bash
cd frontend
npm run build
cd ../api
# Linux/Mac:
.venv/bin/python main.py
# Windows:
.venv\Scripts\python main.py
```

Acesse: http://localhost:3000

---

## Segurança

- **Sanitização XSS:** Todos os inputs passam por `html.escape`
- **Prepared Statements:** Queries SQLite com placeholders `?`
- **WAL Mode:** Write-Ahead Logging para leituras concorrentes
- **Foreign Keys:** Integridade referencial com `PRAGMA foreign_keys=ON`
- **CORS:** Controle de requisições Cross-Origin configurável via `.env`

---

## Documentação

- [`doc/escopo_do_projeto.md`](./doc/escopo_do_projeto.md) — Escopo e objetivos do projeto
- [`doc/requisitos_usuario.md`](./doc/requisitos_usuario.md) — Requisitos funcionais e não funcionais
- [`doc/plano_projeto.md`](./doc/plano_projeto.md) — Plano de projeto e cronograma

---

## Créditos

Projeto acadêmico desenvolvido no curso de **Programação Web** do **Instituto Federal de Mato Grosso — Campus de Barra do Garças (IFMT)**.

**Acadêmicos:** Carlos Alexandre Dias da Silva e Lara Guida Carvalho  
**Professor:** Carlos David Rocha de Souza

Repositório: https://github.com/guidazxy/Projeto-Horario
