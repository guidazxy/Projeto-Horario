# Projeto Horario — Sistema de Gestão de Horários Escolares

## Instituto Federal de Mato Grosso — Campus de Barra do Garças (IFMT)

**Disciplina:** Programação Web  
**Turma:** Terceiro Ano B — Ano 2026  
**Acadêmicos:** Carlos Alexandre Dias da Silva e Lara Guida Carvalho  
**Professor:** Carlos David Rocha de Souza

---

## Sobre o Projeto

Sistema acadêmico full stack para **gestão de horários escolares**, desenvolvido com **React 18 (Vite + Tailwind CSS)** no frontend e **Python 3 (FastAPI + Uvicorn)** no backend, utilizando **SQLite** como banco de dados relacional.

O sistema permite o cadastro e gerenciamento de cursos, turmas, professores, matérias, salas, horários e alocações de horários, além de um formulário de captação de leads e sistema de autenticação. Inclui recursos avançados de detecção de conflitos, validação de dados em tempo real e interface diferenciada por perfil de usuário.

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

## Funcionalidades do Backend

### Endpoints da API

#### Rotas Autenticadas (`/api/auth`)

| Método | Rota | Descrição | Status |
|--------|------|-----------|--------|
| `POST` | `/login` | Autenticação de usuário — valida email, senha e perfil contra tabela `professores` | 200 / 401 |
| `GET` | `/status` | Verificar status de autenticação — retorna status de login | 200 |

#### Rotas de Leads (`/api`)

| Método | Rota | Descrição | Status |
|--------|------|-----------|--------|
| `POST` | `/leads` | Cadastrar novo lead — validação completa com sanitização XSS | 201 / 422 |
| `GET` | `/leads?pagina=1&limite=20` | Listar leads com paginação | 200 |

#### Rotas de Recursos Completo (via Controladores)

As seguintes rotas estão implementadas nos controladores, podendo ser registradas conforme necessidade:

| Método | Rota | Controlador | Descrição |
|--------|------|-------------|-----------|
| `GET` | `/materias` | `materia_controlador` | Listar todas as matérias |
| `POST` | `/materias` | `materia_controlador` | Cadastrar nova matéria |
| `DELETE` | `/materias` | `materia_controlador` | Remover matéria |
| `GET` | `/professores` | `materia_controlador` | Listar todos os professores |
| `POST` | `/professores` | `materia_controlador` | Cadastrar novo professor |
| `DELETE` | `/professores` | `materia_controlador` | Remover professor |
| `GET` | `/salas` | `sala_controlador` | Listar todas as salas |
| `POST` | `/salas` | `sala_controlador` | Cadastrar nova sala/laboratório |
| `DELETE` | `/salas` | `sala_controlador` | Remover sala |
| `GET` | `/horarios` | `sala_controlador` | Listar todos os slots de horário |
| `POST` | `/horarios` | `sala_controlador` | Cadastrar novo slot de horário |
| `DELETE` | `/horarios` | `sala_controlador` | Remover horário |
| `GET` | `/turmas` | `turma_controlador` | Listar todas as turmas com curso |
| `POST` | `/turmas` | `turma_controlador` | Cadastrar nova turma |
| `DELETE` | `/turmas` | `turma_controlador` | Remover turma |
| `GET` | `/turma-materia` | `turma_materia_controlador` | Listar relações turma-matéria |
| `POST` | `/turma-materia` | `turma_materia_controlador` | Cadastrar relação turma-matéria |
| `DELETE` | `/turma-materia` | `turma_materia_controlador` | Remover relação |
| `GET` | `/horarios-alocados` | `horarios_alocados_controlador` | Listar todas as alocações de horário |
| `POST` | `/horarios-alocados` | `horarios_alocados_controlador` | Cadastrar nova alocação de horário |
| `DELETE` | `/horarios-alocados` | `horarios_alocados_controlador` | Remover alocação |
| `GET` | `/restricoes` | `restricoes_controlador` | Listar todas as restrições |

#### Endpoint de Health Check

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/health` | Health check do servidor — retorna `{"sucesso": true, "mensagem": "API de gestão de horários funcionando!"}` |

#### Endpoint Raiz (modo desenvolvimento)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/` | Retorna `{"status": "API de Gestão Escolar Ativa"}` — modo simulação com dados iniciais |

---

### Validações (Backend)

Todos os dados passam por validação rigorosa no backend via `api/src/utilitarios/validadores.py`:

| Campo | Regra de Validação | Sanitização |
|-------|-------------------|-------------|
| `nome_completo` | Obrigatório, 3–150 caracteres | `html.escape` + `strip()` |
| `email` | Obrigatório, formato regex válido | `html.escape` |
| `telefone_whatsapp` | Obrigatório, 10–15 dígitos | Somente dígitos (regex `re.sub(r'\D', '', telefone)`) |
| `mensagem` | Opcional, máximo 500 caracteres | `html.escape` |

Funções de validação específicas:
- `validar_nome()` — valida comprimento e limpeza de nomes
- `validar_carga_horaria()` — valida número inteiro não negativo
- `validar_dia_semana()` — valida dias da semana (Segunda a Domingo)
- `validar_horario()` — valida formato HH:MM em 24h
- `validar_lead()` — validação completa de lead com todas as regras acima

#### Segurança Implementada

- **Sanitização XSS:** Todos os inputs passam por `html.escape` antes de serem armazenados
- **Prepared Statements:** Queries SQLite utilizam placeholders `?` para prevenção de SQL injection
- **WAL Mode:** Write-Ahead Logging ativo para leituras concorrentes via `PRAGMA journal_mode = WAL`
- **Foreign Keys:** Integridade referencial ativa via `PRAGMA foreign_keys = ON`
- **CORS:** Controle de requisições Cross-Origin configurável via `.env` (`ORIGEM_PERMITIDA`)
- **Validação de dados:** Validação completa no backend antes de qualquer operação de banco de dados

---

## Funcionalidades do Frontend

### Componentes React

| Componente | Descrição |
|------------|-----------|
| `App.jsx` | Componente raiz — gerencia autenticação, perfis (Funcionário/Aluno), fetch de turmas/horários, alocação de horários com detecção de conflitos, contém telas de login/cadastro e tabela de horários filtráveis |
| `Login.jsx` | Tela de login com seleção de perfil (funcionário/aluno) — valida credenciais e mantém estado de autenticação |
| `Header.jsx` | Navbar fixa com logo "AcademiStack", navegação (Arquitetura, Testar API), botão de leads (🗄️ Ver Leads Gravados) e teste de API Python (🐍) |
| `Hero.jsx` | Banner principal com gradientes orbitais, display interativo de código (Python vs React), tabs de troca de código, indicador de status "STATUS 200 OK" |
| `Beneficios.jsx` | Seção "Arquitetura da Aplicacao" com 4 cards pilar: Backend Python/FastAPI, Frontend React/Vite, SQLite/WAL Mode, Security/Validation — com efeitos de hover |
| `FormularioLead.jsx` | Formulário de captação com máscara de telefone em tempo real `(xx) xxxxx-xxxx`, validação client-side, POST assíncrono ao backend, notificações de sucesso/erro |
| `ModalLeads.jsx` | Modal dialog com tabela de leads em tempo real do SQLite, atualização manual, colunas: ID, Nome, E-mail, WhatsApp, Data Cadastro, Status de atendimento |
| `Toast.jsx` | Notificação flutuante — auto-dismiss após 4s, verde para sucesso, vermelho para erro |
| `Footer.jsx` | Rodapé com "AcademiStack Full Stack", badges de tech stack (Python/FastAPI, React/Vite, SQLite), botão para visualizar leads SQLite |

### Funcionalidades Principais do Frontend

#### Sistema de Autenticação
- Estado `autenticado` gerenciado com `useState` + `useEffect`
- Persistência de login across refreshes
- Duas profiles disponíveis: `Funcionário` e `Aluno`
- Tela diferente baseada no perfil logado
- Botão de "Sair" que retorna à tela de login

#### Dashboard de Funcionário
- Interface de alocação de disciplinas e professores na grade
- **Detecção de conflitos:** Impede professor ou sala double-booking ao cadastrar horário
- Formulário com campos: dia da semana, disciplina, professor, sala
- Feedback visual: `✅ Horário alocado com sucesso (Sem conflitos)!` ou `⚠️ Erro: conflito detectado`
- Filtro de busca em tempo real por disciplina, professor ou sala
- Tabela responsiva da grade de aulas por dia da semana

#### Formulário de Lead com Máscara
- Máscara dinâmica de telefone WhatsApp: `(xx) xxxxx-xxxx`
- Atualização em tempo real enquanto digita
- Validação de campos (nome: 3–150 chars, email: regex, telefone: 10–15 dígitos)
- Envio assíncrono POST para `/api/leads`
- Notificações de sucesso/error via componente Toast
- Botão para abrir modal e ver leads cadastrados

#### Integração com API
- Proxy Vite: `/api` → `http://localhost:3000` (configurado no `vite.config.js`)
- Requisições assíncronas `fetch()` para todos os endpoints
- Tratamento de erros com mensagens amigáveis
- Loading state durante requisições

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
│   │   │   ├── lead_controlador.py     # CRUD de leads com validação
│   │   │   ├── materia_controlador.py  # CRUD de matérias e professores
│   │   │   ├── professor_materia_controlador.py  # Relação N:N professor-matéria
│   │   │   ├── restricoes_controlador.py  # Restrições de alocação
│   │   │   ├── sala_controlador.py     # CRUD de salas e horários
│   │   │   ├── turma_controlador.py    # CRUD de cursos e turmas
│   │   │   ├── turma_materia_controlador.py  # Relação N:N turma-matéria
│   │   │   └── horarios_alocados_controlador.py  # Alocação de horários
│   │   ├── rotas/
│   │   │   ├── __init__.py
│   │   │   ├── auth_rotas.py           # Rotas de autenticação (login, status)
│   │   │   └── lead_rotas.py           # Rotas de leads (criar, listar)
│   │   └── utilitarios/
│   │       └── validadores.py          # Validação e sanitização de dados
│   ├── .env                            # Variáveis de ambiente (não versionado)
│   ├── iniciar_banco.py                # Script de criação do banco de dados
│   ├── main.py                         # Ponto de entrada do servidor (modo desenvolvimento com conflitos)
│   └── requirements.txt                # Dependências Python
│
├── frontend/                           # Frontend React
│   ├── src/
│   │   ├── main.jsx                    # Ponto de entrada do React
│   │   ├── App.jsx                     # Componente raiz (autenticação, rotas, dashboard)
│   │   ├── index.css                   # Estilos globais e animações
│   │   └── components/
│   │       ├── Header.jsx              # Navbar com logo e botões
│   │       ├── Hero.jsx                # Banner principal com visualizador de código interativo
│   │       ├── Beneficios.jsx          # Cards de benefícios/arquitetura
│   │       ├── FormularioLead.jsx      # Formulário de captação de leads com máscara
│   │       ├── ModalLeads.jsx          # Modal de listagem de leads em tempo real
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

Banco de dados relacional com **10 tabelas** e **9 índices** para performance. Criado automaticamente via `api/iniciar_banco.py` na primeira execução. Utiliza **WAL Mode** (Write-Ahead Logging) e **Foreign Keys** ativos para integridade de dados.

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
| `horarios_alocados` | Alocações de horário por turma-matéria-sala |
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

## Endpoints da API (Resumo Consolidado)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/health` | Health check do servidor |
| `POST` | `/api/auth/login` | Autenticação de usuário |
| `GET` | `/api/auth/status` | Verificar status de autenticação |
| `POST` | `/api/leads` | Cadastrar novo lead com validação |
| `GET` | `/api/leads` | Listar leads (paginação: `pagina`, `limite`) |
| `GET` | `/api/materias` | Listar matérias |
| `POST` | `/api/materias` | Cadastrar matéria |
| `DELETE` | `/api/materias` | Remover matéria |
| `GET` | `/api/professores` | Listar professores |
| `POST` | `/api/professores` | Cadastrar professor |
| `DELETE` | `/api/professores` | Remover professor |
| `GET` | `/api/salas` | Listar salas |
| `POST` | `/api/salas` | Cadastrar sala |
| `DELETE` | `/api/salas` | Remover sala |
| `GET` | `/api/horarios` | Listar horários/slots |
| `POST` | `/api/horarios` | Cadastrar horário com conflito detection |
| `DELETE` | `/api/horarios` | Remover horário |
| `GET` | `/api/turmas` | Listar turmas com curso |
| `POST` | `/api/turmas` | Cadastrar turma |
| `DELETE` | `/api/turmas` | Remover turma |
| `GET` | `/api/turma-materia` | Listar relações turma-matéria |
| `POST` | `/api/turma-materia` | Cadastrar relação turma-matéria |
| `DELETE` | `/api/turma-materia` | Remover relação |
| `GET` | `/api/horarios-alocados` | Listar alocações de horário |
| `POST` | `/api/horarios-alocados` | Cadastrar alocação de horário |
| `DELETE` | `/api/horarios-alocados` | Remover alocação |
| `GET` | `/api/restricoes` | Listar restrições |

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
- **Documentação Automática:** http://localhost:3000/docs (Swagger UI FastAPI)

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

## Funcionalidades Notáveis

### Detecção de Conflitos de Horário
O backend possui validação inteligente que impede o cadastro de horários que causariam conflitos:
- **Conflito de professor:** Impede que o mesmo professor tenha duas aulas no mesmo dia e horário
- **Conflito de sala:** Impede que a mesma sala seja usada por duas turmas no mesmo dia e horário
- Retorna erro 400 com mensagem detalhada quando conflito detectado

### Sistema de Autenticação por Perfil
- Duas profiles disponíveis: `Funcionário` e `Aluno`
- Interface diferente baseada no perfil logado
- Funcionário tem acesso à tela de alocação de horários
- Credenciais válidas: `admin@escola.com` / `admin123` (Funcionário)

### Máscara de Telefone em Tempo Real
- Formato `(xx) xxxxx-xxxx` aplicado automaticamente enquanto o usuário digita
- Apenas dígitos são aceitos, formatação é adicionada dinamicamente
- Implementada no componente `FormularioLead.jsx` com função `tratarMascaraTelefone`

### Validação Completa de Dados
- Validação rigorosa no backend via `validadores.py`
- Sanitização XSS com `html.escape` em todos os inputs
- Validação de formato de email, tamanho de nome, faixa de telefone
- Mensagens de erro claras e específicas retornadas ao frontend

### Interface Responsiva e Acessível
- Layout clean com Tailwind CSS
- Componentes modulares e reutilizáveis
- Feedback visual imediato (Toast notifications, status indicators)
- Filtros e buscas em tempo real

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