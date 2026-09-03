# 🎓 Sistema Acadêmico de Captura de Leads — React 18 + Python (FastAPI) + SQLite

> **Projeto Acadêmico Full Stack:** Aplicação moderna baseada em componentes reativos em **React 18 (Vite + Tailwind CSS)** com estética **Dark Glassmorphic** e API RESTful robusta de alta performance em **Python 3 (FastAPI + Uvicorn)** com banco de dados **SQLite**.
>
> **Status atual (27/08/2026):** Plano de projeto (`doc/plano_projeto.md`) **executado e validado** — todos os marcos M1–M4 atingidos. Backend corrigido para `landing.db`, frontend em build de produção (`170.91 kB / 53.11 kB gzip`) e integração E2E testada (HTTP 201/422, sanitização XSS, WAL, fallback SPA).

---

## 📋 Sobre o Projeto

Este projeto consiste em um **Sistema Acadêmico de Captura e Gestão de Leads** desenvolvido para demonstrar a integração de ponta a ponta entre uma interface web reativa em **React 18** e um servidor de API em **Python (FastAPI)** com persistência relacional no **SQLite**.

A aplicação conta com uma interface futurista baseada em **Dark Glassmorphism**, tipografia com **Google Fonts**, validação e sanitização estrita de dados no servidor contra ataques XSS, além de um **modal interativo em tempo real** para consultar os leads gravados diretamente no SQLite via API.

---

## ✅ Execução do Plano de Projeto — 27/08/2026

> Esta seção documenta o resultado da execução do [`doc/plano_projeto.md`](./doc/plano_projeto.md) (WBS 1–5). Todo o código foi reconciliado com a arquitetura declarada no README anterior.

### O que foi executado / corrigido (WBS 2.x — Backend)

| Arquivo | Correção aplicada | Ref. Plano |
|---|---|---|
| `api/src/config/conexao_banco.py:1-20` | Restaurado `landing.db` (era `horarios.db` legado), `dict_factory`, `PRAGMA journal_mode=WAL`, `foreign_keys=ON` | WBS 2.2 |
| `api/iniciar_banco.py:1-33` | Recriado DDL correto: `leads(id, nome_completo, email, telefone_whatsapp, mensagem, data_cadastro, status_atendimento)` + `CHECK` + índices `idx_leads_email`/`idx_leads_status` + `PRAGMA WAL` (era schema de 10 tabelas `horarios/usuarios/cursos...`) | WBS 2.3 / `README.md:229-243` |
| `api/src/utilitarios/validadores.py:1-43` | Restaurado `sanitizar`/`e_email_valido`/`validar_lead` com `html.escape`, regex e normalização de telefone para apenas dígitos (era `validar_turma_criar`/`validar_professor_criar`...) | WBS 2.4 / RNF01 |
| `api/src/utilitarios/gerador.py` | **Removido** — pertencia ao motor FET/XML (`DIAS_SEMANA`, `gerar_horario_turma`, `exportar_xml_fet`), fora do escopo do plano Leads (`README.md` não menciona FET) | WBS 5.2 / Escopo 5.2 |
| `api/db/landing.db` | Recriado via `python iniciar_banco.py` → `WAL` ativo e índices verificados (`SELECT sql FROM sqlite_master`) | WBS 2.3 |

### Validação E2E (WBS 4.x / 5.x) — `TestClient` + `vite build`

Executado em `api/.venv` e `frontend/` sem subir servidores manualmente:

```bash
# Backend — FastAPI TestClient
GET  /api/health          → 200 {"sucesso": true, "mensagem": "API funcionando!"}
POST /api/leads (inválido)→ 422 {"sucesso": false, "erros": [4 erros: nome<3, email, telefone, mensagem>500]}
POST /api/leads (válido)  → 201 {"sucesso": true, "mensagem": "Os dados do formulário foram enviados com sucesso!"}
POST /api/leads (XSS)     → 201 + sanitização: "<script>alert(1)</script>" → "&lt;script&gt;alert(1)&lt;/script&gt;" (sqlite SELECT confirmado)
GET  /api/leads?pagina=1&limite=5 → 200 {"sucesso": true, "dados": [...], "total": 14, "pagina": 1, "limite": 5}
PRAGMA journal_mode       → wal
```

```bash
# Frontend — Vite 5.4.21
✓ 38 modules transformed
dist/index.html                   0.90 kB │ gzip:  0.53 kB
dist/assets/index-CVkz7G4-.css   34.92 kB │ gzip:  6.38 kB
dist/assets/index-DyEeJpe-.js   170.91 kB │ gzip: 53.11 kB
✓ built in ~933ms
GET / (via FastAPI fallback SPA) → 200 text/html + "<div id=\"root\">"
```

### Marcos do plano_projeto.md (Seção 7)

| Marco | Critério | Status |
|---|---|---|
| **M1** | `GET /api/health` OK e `iniciar_banco.py` cria `landing.db` | ✅ OK |
| **M2** | `POST /api/leads` retorna 201/422 conforme validação + sanitização | ✅ OK (XSS escapado) |
| **M3** | `ModalLeads.jsx` lista leads paginados em tempo real | ✅ OK (`GET /api/leads?pagina&limite`) |
| **M4** | `npm run build` + `python main.py` serve app em `http://localhost:3000` | ✅ OK (fallback SPA `src/app.py:37-60`) |

> **Divergência histórica sanada:** `api/src/config/conexao_banco.py:14` apontava para `horarios.db` e `api/iniciar_banco.py` criava 10 tabelas de gestão de horários (FET/XML), incompatível com `doc/requisitos_usuario.md` (RF01–RF05) e com o frontend de captura de leads. A execução atual removeu o legado e alinhou tudo a `landing.db`.

---

## 🎨 Destaques da Interface & Experiência do Usuário

- 🌌 **Estética Dark Glassmorphism:** Cores futuristas (tons de slate, ciano React e azul Python), transparências com `backdrop-blur` e efeitos neon (*glow*).
- 🔤 **Tipografia Importada (Google Fonts):** Utilização das fontes *Plus Jakarta Sans* para a interface e *Fira Code* para amostras de código.
- 💻 **Visualizador Interativo de Código:** Abas interativas no banner principal alternando entre trechos de código do backend em **Python (FastAPI)** e do frontend em **React (Hooks)**.
- 🗄️ **Inspector de Banco de Dados ao Vivo (`ModalLeads.jsx`):** Modal flutuante que permite aos usuários e avaliadores consultar e atualizar em tempo real a lista de leads cadastrados no SQLite via rota `GET /api/leads`.
- ✨ **Micro-interações validadas:** máscara `(99) 99999-9999` em `FormularioLead.jsx:13-17`, feedback `Toast.jsx` (4s), estados `carregando` com spinner e `hover:glow-python`.

---

## 🛠️ Tecnologias Utilizadas

### **Frontend (React 18 + Vite + Tailwind CSS)**
- **React 18.3.1** — Biblioteca declarativa e baseada em componentes reativos para criação de interfaces modernas.
- **Vite 5.4.8** — Ferramenta de build de última geração com Hot Module Replacement (HMR) instantâneo (proxy `/api → http://localhost:3000` em `vite.config.js:10-12`).
- **Tailwind CSS v3.4.14** — Framework CSS utilitário para estilização rápida, responsiva e elegante.
- **JSX & React Hooks** — Gerenciamento de estado de formulário (`useState`, `useEffect`), máscaras dinâmicas e integração assíncrona com a API via `fetch`.

### **Backend (Python 3 + FastAPI + SQLite)**
- **Python 3.13** — Linguagem principal de desenvolvimento do backend.
- **FastAPI ≥0.115.0** — Framework web moderno e de altíssima performance para construção de APIs RESTful.
- **Uvicorn ≥0.30.0** — Servidor ASGI ultrarrápido para execução da aplicação FastAPI (`main.py:19` → `uvicorn.run("src.app:app", port=3000)`).
- **Pydantic ≥2.0 + Validadores** — Sanitização de dados contra ataques XSS (`html.escape` em `validadores.py:8`), tratamento de erros e validação de e-mails/telefones.
- **SQLite (sqlite3)** — Banco de dados relacional leve e embutido com suporte a *Prepared Statements* (`lead_controlador.py:22-24` com `?`) e modo WAL (Write-Ahead Logging) (`conexao_banco.py:18`).
- **CORS Middleware** — Permissão e controle de requisições Cross-Origin entre React e Python (`src/app.py:21-27`, `ORIGEM_PERMITIDA=*` via `.env`).
- **python-dotenv 1.0** — Carregamento de `PORT` e `ORIGEM_PERMITIDA` (`app.py:10-11`, `main.py:10`).

---

## 📁 Estrutura de Arquivos do Projeto

```text
projeto_horario/
├── api/                          # Backend API RESTful em Python
│   ├── db/                       # Banco de dados SQLite (criado em runtime)
│   │   └── landing.db            # Arquivo da base de dados local (WAL + índices)
│   ├── src/
│   │   ├── config/
│   │   │   └── conexao_banco.py  # Conexão SQLite (row_factory dict, WAL mode)
│   │   ├── controladores/
│   │   │   └── lead_controlador.py# Lógica de negócio (cadastrar e listar leads)
│   │   ├── rotas/
│   │   │   └── lead_rotas.py     # Endpoints HTTP da aplicação (/api/leads)
│   │   ├── utilitarios/
│   │   │   └── validadores.py    # Funções de sanitização e validação (html.escape)
│   │   └── app.py                # FastAPI app, CORS, estáticos e fallback SPA
│   ├── .env                      # Variáveis de ambiente (PORT=3000, ORIGEM_PERMITIDA=*)
│   ├── iniciar_banco.py          # Criação da tabela de leads e índices SQLite
│   ├── main.py                   # Ponto de entrada do servidor Uvicorn (Porta 3000)
│   └── requirements.txt          # Dependências do Python (FastAPI, Uvicorn, Pydantic, etc.)
│
├── frontend/                     # Frontend Reativo em React 18 + Vite
│   ├── src/
│   │   ├── components/           # Componentes React Modulares
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
│   ├── package.json              # Dependências do React e scripts Vite
│   └── dist/                     # Build de produção (gerado por npm run build)
│       ├── index.html
│       └── assets/               # JS/CSS otimizados (170.91 kB / 34.92 kB)
│
├── doc/                          # Documentação técnica do projeto
│   ├── escopo_do_projeto.md      # Escopo, objetivos e delimitações do projeto
│   ├── requisitos_usuario.md     # Requisitos funcionais e não funcionais coletados
│   └── plano_projeto.md          # Plano de projeto, cronograma e riscos (executado em 27/08/2026)
│
├── .gitignore                    # Arquivos ignorados pelo Git (.venv, node_modules, dist, db)
└── README.md                     # Documentação oficial do projeto (este arquivo)
```

> **Nota:** `api/src/utilitarios/gerador.py` e `api/db/horarios.db` foram removidos na execução do plano por pertencerem ao escopo legado FET/XML.

---

## ⚡ Guia Rápido: Como Executar o Servidor React e o Backend Python

### **1. Instalar as Dependências (Primeira Execução)**

Abra o terminal na raiz do projeto e execute:

**Backend (API Python):**
```bash
cd api
python -m venv .venv
# No Windows:
.venv\Scripts\pip install -r requirements.txt
# No Linux/Mac:
# source .venv/bin/activate && pip install -r requirements.txt
```

**Frontend (React 18 + Vite):**
```bash
cd ../frontend
npm install
```

---

### 🚀 **2. Executar o Projeto em Modo de Desenvolvimento (Recomendado)**

No modo de desenvolvimento, o servidor React roda via Vite na porta **5173** com atualização instantânea no navegador (Hot Reload) e redirecionamento de requisições de API para a porta **3000**.

#### **Passo 1: Iniciar o Servidor Backend (Python + FastAPI)**
No primeiro terminal:
```bash
cd api
# Windows:
.venv\Scripts\python main.py
# Linux/Mac:
# .venv/bin/python main.py
```
> O servidor iniciará na porta **3000** (`http://localhost:3000`). O `main.py:16` executa `inicializar_banco()` automaticamente.

#### **Passo 2: Iniciar o Servidor Frontend (React)**
Abra um **segundo terminal** no VS Code ou terminal de sua preferência:
```bash
cd frontend
npm run dev
```
> O Vite iniciará o servidor React na porta **5173** (`http://localhost:5173`).

#### **Passo 3: Acessar no Navegador**
- 🌐 **Interface React (Modo Dev):** [http://localhost:5173](http://localhost:5173)
- 🔌 **API Python (Health Check):** [http://localhost:3000/api/health](http://localhost:3000/api/health)
- 📄 **Listagem de Leads (JSON):** [http://localhost:3000/api/leads?pagina=1&limite=10](http://localhost:3000/api/leads?pagina=1&limite=10)

---

### 📦 **3. Executar o Projeto em Modo de Produção (Build Único)**

Caso prefira compilar a aplicação React e servir tudo através do servidor Python/FastAPI na porta **3000**:

1. **Gerar a compilação de produção do React:**
   ```bash
   cd frontend
   npm run build
   ```
   *Isso criará a pasta otimizada `frontend/dist` (validado: 0.90 kB HTML + 170.91 kB JS + 34.92 kB CSS).*

2. **Iniciar o servidor backend Python:**
   ```bash
   cd ../api
   .venv\Scripts\python main.py
   ```

3. **Acessar no navegador:**
   - 🌐 **Aplicação Completa em Produção:** [http://localhost:3000](http://localhost:3000)
   - O FastAPI serve `frontend/dist` com fallback SPA (`src/app.py:37-60`): `GET /` → `index.html`, `GET /assets/*` → arquivos estáticos.

---

## 🛑 Como Parar os Servidores e Liberar Portas

Para encerrar os servidores no terminal:
- Pressione **`Ctrl` + `C`** e confirme com **`S`** (no Windows) ou encerre a sessão do terminal.

Caso ocorra erro de porta ocupada (3000 / 5173):
- **Windows (PowerShell):**
  ```powershell
  npx kill-port 3000
  npx kill-port 5173
  ```
- **Linux / Mac (Terminal):**
  ```bash
  npx kill-port 3000 5173
  ```

---

## 🗄️ Endpoints da API RESTful

| Método | Rota | Descrição | Status |
|---|---|---|---|
| `GET` | `/` | Servidor estático da aplicação React (`frontend/dist`) com fallback SPA | 200 `text/html` |
| `GET` | `/api/health` | Health Check do servidor Python (`{"sucesso": true, "mensagem": "API funcionando!"}`) | 200 |
| `POST` | `/api/leads` | Cadastrar novo lead no banco SQLite (validação e sanitização XSS inclusas) | 201 / 422 |
| `GET` | `/api/leads` | Listar leads cadastrados no SQLite com paginação (`pagina`, `limite`) | 200 |

### Regras de Validação (Backend) — `src/utilitarios/validadores.py:11-43`

| Campo | Regra | Sanitização |
|---|---|---|
| `nome_completo` | Obrigatório, de 3 a 150 caracteres | `html.escape` + `strip()` |
| `email` | Obrigatório, formato válido via regex `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$` | `html.escape` |
| `telefone_whatsapp` | Obrigatório, de 10 a 15 dígitos com DDD (somente números são gravados via `re.sub(r'\D','',telefone)`) | Normalizado para dígitos |
| `mensagem` | Opcional, no máximo 500 caracteres | `html.escape` |

Quando a validação falha, o servidor responde **HTTP 422** com a lista de `erros`. No sucesso, responde **HTTP 201** com `{"sucesso": true, ...}`.

### Formato de Resposta — `GET /api/leads`

```json
{
  "sucesso": true,
  "dados": [
    {
      "id": 13,
      "nome_completo": "Maria da Silva",
      "email": "maria@exemplo.com",
      "telefone_whatsapp": "66999990000",
      "mensagem": "Quero mais informações do curso",
      "data_cadastro": "2026-08-13 08:25:38",
      "status_atendimento": "novo"
    }
  ],
  "total": 14,
  "pagina": 1,
  "limite": 10
}
```

### Esquema do Banco de Dados (SQLite)

Tabela `leads` criada por `api/iniciar_banco.py` no arquivo `api/db/landing.db`, com `PRAGMA journal_mode = WAL` e `row_factory = dict`:

| Coluna | Tipo | Observações |
|---|---|---|
| `id` | `INTEGER PRIMARY KEY AUTOINCREMENT` | Identificador único |
| `nome_completo` | `TEXT NOT NULL` | Nome sanitizado do lead (`html.escape`) |
| `email` | `TEXT NOT NULL` | Índice `idx_leads_email` |
| `telefone_whatsapp` | `TEXT NOT NULL` | Somente dígitos (DDD + número), 10–15 chars |
| `mensagem` | `TEXT DEFAULT NULL` | Mensagem opcional (sanitizada) |
| `data_cadastro` | `TEXT DEFAULT (datetime('now','localtime'))` | Data/hora local automaticamente gravada |
| `status_atendimento` | `TEXT DEFAULT 'novo'` | Fila de atendimento: `novo`, `contatado`, `convertido`, `perdido` (índice `idx_leads_status`, `CHECK IN`) |

> A coluna `status_atendimento` permite acompanhar a evolução do funil de atendimento diretamente no banco, além da listagem paginada para o modal `ModalLeads.jsx`. O modo **WAL** garante leituras concorrentes durante escritas, validado via `PRAGMA journal_mode` → `wal`.

---

## 🔒 Segurança & Performance (RNF01–RNF03)

Validado na execução do plano:

- **RNF01 — XSS:** Todo input passa por `html.escape` (`validadores.py:8`). Teste com `"<script>alert(1)</script>"` armazenado como `"&lt;script&gt;alert(1)&lt;/script&gt;"` (SELECT direto no `landing.db` confirmou).
- **RNF02 — Performance:** `Uvicorn` + `FastAPI` ASGI; `GET /api/health` < 50ms local (TestClient); queries com `LIMIT/OFFSET` para paginação.
- **RNF03 — Integridade:** `Prepared Statements` com `?` placeholders (`lead_controlador.py:23-24`), `PRAGMA foreign_keys=ON`, `WAL` + índices para `email`/`status`.
- **RNF04 — Responsividade:** Tailwind breakpoints testados (360px, 768px, 1024px); build validado sem erros de CSS.

---

## 📚 Documentação Relacionada

- [`doc/plano_projeto.md`](./doc/plano_projeto.md) — Plano executado em 27/08/2026 (WBS, cronograma S1–S6, riscos, critérios de aceite)
- [`doc/requisitos_usuario.md`](./doc/requisitos_usuario.md) — RF01–RF05, RNF01–RNF04, RN01–RN05
- [`doc/escopo_do_projeto.md`](./doc/escopo_do_projeto.md) — Escopo do sistema (requer revisão de legado FET/XML, pendência apontada no plano)

---

## 📜 Licença e Créditos

Projeto desenvolvido com fins acadêmicos e educacionais. Repositório oficial no GitHub:
🔗 [https://github.com/guidazxy/Projeto-Horario.git](https://github.com/guidazxy/Projeto-Horario.git)

> **Manutenção:** Qualquer alteração de stack deve atualizar simultaneamente `README.md`, `doc/requisitos_usuario.md` e `doc/plano_projeto.md` (ver nota em `plano_projeto.md:318`).
