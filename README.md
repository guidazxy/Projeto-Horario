# 🎓 Sistema Acadêmico de Captura de Leads — React 18 + Python (FastAPI) + SQLite

> **Projeto Acadêmico Full Stack:** Aplicação moderna baseada em componentes reativos em **React 18 (Vite + Tailwind CSS)** com estética **Dark Glassmorphic** e API RESTful robusta de alta performance em **Python 3 (FastAPI + Uvicorn)** com banco de dados **SQLite**.

---

## 📋 Sobre o Projeto

Este projeto consiste em um **Sistema Acadêmico de Captura e Gestão de Leads** desenvolvido para demonstrar a integração de ponta a ponta entre uma interface web reativa em **React 18** e um servidor de API em **Python (FastAPI)** com persistência relacional no **SQLite**.

A aplicação conta com uma interface futurista baseada em **Dark Glassmorphism**, tipografia com **Google Fonts**, validação e sanitização estrita de dados no servidor contra ataques XSS, além de um **modal interativo em tempo real** para consultar os leads gravados diretamente no SQLite via API.

---

## 🎨 Destaques da Interface & Experiência do Usuário

- 🌌 **Estética Dark Glassmorphism:** Cores futuristas (tons de slate, ciano React e azul Python), transparências com `backdrop-blur` e efeitos neon (*glow*).
- 🔤 **Tipografia Importada (Google Fonts):** Utilização das fontes *Plus Jakarta Sans* para a interface e *Fira Code* para amostras de código.
- 💻 **Visualizador Interativo de Código:** Abas interativas no banner principal alternando entre trechos de código do backend em **Python (FastAPI)** e do frontend em **React (Hooks)**.
- 🗄️ **Inspector de Banco de Dados ao Vivo (`ModalLeads.jsx`):** Modal flutuante que permite aos usuários e avaliadores consultar e atualizar em tempo real a lista de leads cadastrados no SQLite via rota `GET /api/leads`.

---

## 🛠️ Tecnologias Utilizadas

### **Frontend (React 18 + Vite + Tailwind CSS)**
- **React 18** — Biblioteca declarativa e baseada em componentes reativos para criação de interfaces modernas.
- **Vite** — Ferramenta de build de última geração com Hot Module Replacement (HMR) instantâneo.
- **Tailwind CSS v3** — Framework CSS utilitário para estilização rápida, responsiva e elegante.
- **JSX & React Hooks** — Gerenciamento de estado de formulário (`useState`, `useEffect`), máscaras dinâmicas e integração assíncrona com a API via `fetch`.

### **Backend (Python 3 + FastAPI + SQLite)**
- **Python 3.13** — Linguagem principal de desenvolvimento do backend.
- **FastAPI** — Framework web moderno e de altíssima performance para construção de APIs RESTful.
- **Uvicorn** — Servidor ASGI ultrarrápido para execução da aplicação FastAPI.
- **Pydantic & Validadores** — Sanitização de dados contra ataques XSS (`html.escape`), tratamento de erros e validação de e-mails/telefones.
- **SQLite (sqlite3)** — Banco de dados relacional leve e embutido com suporte a *Prepared Statements* e modo WAL (Write-Ahead Logging).
- **CORS Middleware** — Permissão e controle de requisições Cross-Origin entre React e Python.

---

## 📁 Estrutura de Arquivos do Projeto

```text
projeto_horario/
├── api/                          # Backend API RESTful em Python
│   ├── db/                       # Banco de dados SQLite (criado em runtime)
│   │   └── landing.db            # Arquivo da base de dados local
│   ├── src/
│   │   ├── config/
│   │   │   └── conexao_banco.py  # Conexão SQLite (row_factory dict, WAL mode)
│   │   ├── controladores/
│   │   │   └── lead_controlador.py# Lógica de negócio (cadastrar e listar leads)
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
│   └── package.json              # Dependências do React e scripts Vite
│
├── doc/                          # Documentação técnica do projeto
│   ├── escopo_do_projeto.md      # Escopo, objetivos e delimitações do projeto
│   ├── requisitos_usuario.md     # Requisitos funcionais e não funcionais coletados
│   └── plano_projeto.md          # Plano de projeto, cronograma e riscos
│
├── .gitignore                    # Arquivos ignorados pelo Git (.venv, node_modules, dist, db)
└── README.md                     # Documentação oficial do projeto
```

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
> O servidor iniciará na porta **3000** (`http://localhost:3000`).

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

---

### 📦 **3. Executar o Projeto em Modo de Produção (Build Único)**

Caso prefira compilar a aplicação React e servir tudo através do servidor Python/FastAPI na porta **3000**:

1. **Gerar a compilação de produção do React:**
   ```bash
   cd frontend
   npm run build
   ```
   *Isso criará a pasta otimizada `frontend/dist`.*

2. **Iniciar o servidor backend Python:**
   ```bash
   cd ../api
   .venv\Scripts\python main.py
   ```

3. **Acessar no navegador:**
   - 🌐 **Aplicação Completa em Produção:** [http://localhost:3000](http://localhost:3000)

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

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/` | Servidor estático da aplicação React (`frontend/dist`) |
| `GET` | `/api/health` | Health Check do servidor Python (`{"sucesso": true, "mensagem": "API funcionando!"}`) |
| `POST` | `/api/leads` | Cadastrar novo lead no banco SQLite (validação e sanitização XSS inclusas) |
| `GET` | `/api/leads` | Listar leads cadastrados no SQLite com paginação (`pagina`, `limite`) |

### Regras de Validação (Backend)

| Campo | Regra |
|---|---|
| `nome_completo` | Obrigatório, de 3 a 150 caracteres (sanitizado com `html.escape`) |
| `email` | Obrigatório, formato válido via regex (sanitizado) |
| `telefone_whatsapp` | Obrigatório, de 10 a 15 dígitos com DDD (somente números são gravados) |
| `mensagem` | Opcional, no máximo 500 caracteres (sanitizada) |

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
  "total": 12,
  "pagina": 1,
  "limite": 10
}
```

### Esquema do Banco de Dados (SQLite)

Tabela `leads` criada por `api/iniciar_banco.py` no arquivo `api/db/landing.db`, com `PRAGMA journal_mode = WAL` e `row_factory = dict`:

| Coluna | Tipo | Observações |
|---|---|---|
| `id` | `INTEGER PRIMARY KEY AUTOINCREMENT` | Identificador único |
| `nome_completo` | `TEXT NOT NULL` | Nome sanitizado do lead |
| `email` | `TEXT NOT NULL` | Índice `idx_leads_email` |
| `telefone_whatsapp` | `TEXT NOT NULL` | Somente dígitos (DDD + número) |
| `mensagem` | `TEXT DEFAULT NULL` | Mensagem opcional |
| `data_cadastro` | `TEXT DEFAULT (datetime('now','localtime'))` | Data/hora local automaticamente gravada |
| `status_atendimento` | `TEXT DEFAULT 'novo'` | Fila de atendimento: `novo`, `contatado`, `convertido`, `perdido` (índice `idx_leads_status`) |

> A coluna `status_atendimento` permite acompanhar a evolução do funil de atendimento diretamente no banco, além da listagem paginada para o modal `ModalLeads.jsx`.

---

## 📜 Licença e Créditos

Projeto desenvolvido com fins acadêmicos e educacionais. Repositório oficial no GitHub:
🔗 [https://github.com/guidazxy/Projeto-Horario.git](https://github.com/guidazxy/Projeto-Horario.git)
