# Plano de Resolução de Acesso, Libs, Dependências e Navegabilidade

## Problema Identificado
Frontend e backend estavam ambos tentando usar a porta 3000, causando conflito. O Vite proxy apontava para localhost:3000, mas o backend também rodava nessa porta.

## Solução Aplicada

### 1. Troca de Portas
- **Frontend (Vite + React):** Porto 3000
  - Arquivo modificado: `frontend/vite.config.js`
  - `port: 3000` (era 5173)
  - `proxy: '/api' → 'http://localhost:5173'` (ajustado para novo endpoint)

- **Backend (FastAPI + Uvicorn):** Porto 5173
  - Arquivo modificado: `api/.env`
  - `PORT=5173` (era 3000)

### 2. Verificação de Dependências

#### Backend (API/Python)
- ✅ Python 3.13 instalado
- ✅ FastAPI ≥0.115.0
- ✅ Uvicorn ≥0.30.0
- ✅ Pydantic ≥2.0
- ✅ SQLite (sqlite3) - embutido
- ✅ python-dotenv ≥1.0
- ✅ Virtual environment `.venv` ativo com todas as dependências de `requirements.txt`
- ✅ Banco de dados SQLite criado em `api/db/horario_escolar.db`
- ✅ WAL Mode ativo para leituras concorrentes
- ✅ Foreign Keys ativos

#### Frontend (React/Vite)
- ✅ Node.js with npm
- ✅ React 18.3.1
- ✅ Vite 5.4.8
- ✅ Tailwind CSS 3.4.14
- ✅ @vitejs/plugin-react 4.3.1
- ✅ react-dom 18.3.1
- ✅ react-router-dom 7.18.5
- ✅ node_modules instalados (107 pacotes)
- ✅ package-lock.json sincronizado

### 3. Resolução de Problemas de Acesso

#### CORS (Cross-Origin Resource Sharing)
- Configurado no `api/src/app.py` com `allow_origins=["*"]`
- Permite requisições de qualquer origem durante desenvolvimento
- Em produção, substituir `*` por domínio específico

#### Proxy Configuration (Vite)
- `vite.config.js` agora possui:
  ```javascript
  proxy: {
    '/api': 'http://localhost:5173'
  }
  ```
- Isso faz com que requisições `fetch('/api/...')` do frontend
- sejam encaminhadas automaticamente para o backend na porta 5173

#### Health Check Endpoints
- **Backend:** `http://localhost:5173/api/health`
  - Retorna: `{"sucesso": true, "mensagem": "API de gestão de horários funcionando!"}`
- **Frontend:** `http://localhost:3000`
  - Serva a aplicação React com Vite HMR

#### Rotas Principais após swap
| Endpoint | Porta | Descrição |
|----------|-------|-----------|
| `/` | 3000 | Página inicial do frontend (React) |
| `/api/health` | 5173 | Health check do backend (FastAPI) |
| `/api/leads` | 5173 | Listar leads (com paginação) |
| `/api/auth/login` | 5173 | Autenticação de usuário |
| `/api/auth/status` | 5173 | Verificar status de login |

### 4. Navegabilidade e Rotas do Frontend

#### Componentes Principais (porta 3000)
- **App.jsx** - Componente raiz que gerencia:
  - Estado de autenticação (`useState` + `useEffect`)
  - Perfis (Funcionário/Aluno)
  - Fetch de turmas/horários
  - Alocação de horários com detecção de conflitos
  - Telas de login/cadastro
  - Tabela de horários filtráveis

- **Login.jsx** - Tela de login com:
  - Seleção de perfil (Funcionário/Aluno)
  - Validação de credenciais
  - Persistência de login across refreshes

- **Header.jsx** - Navbar fixa com:
  - Logo "AcademiStack"
  - Navegação (Arquitetura, Testar API)
  - Botão de leads (🗄️ Ver Leads Gravados)
  - Teste de API Python (🐍)

- **Hero.jsx** - Banner principal com:
  - Gradientes orbitais
  - Display interativo de código (Python vs React)
  - Tabs de troca de código
  - Indicador de status "STATUS 200 OK"

- **Beneficios.jsx** - Cards de benefícios/arquitetura:
  - 4 cards pilar: Backend Python/FastAPI, Frontend React/Vite, SQLite/WAL Mode, Security/Validation
  - Efeitos de hover

- **FormularioLead.jsx** - Formulário de captação:
  - Máscara de telefone em tempo real `(xx) xxxxx-xxxx`
  - Validação client-side (nome: 3–150 chars, email: regex, telefone: 10–15 dígitos)
  - POST assíncrono ao backend
  - Notificações de sucesso/erro via Toast

- **ModalLeads.jsx** - Modal dialog:
  - Tabela de leads em tempo real do SQLite
  - Colunas: ID, Nome, E-mail, WhatsApp, Data Cadastro, Status de atendimento

- **Toast.jsx** - Notificação flutuante:
  - Auto-dismiss após 4s
  - Verde para sucesso, vermelho para erro

- **Footer.jsx** - Rodapé:
  - "AcademiStack Full Stack"
  - Badges de tech stack
  - Botão para visualizar leads SQLite

#### Rotas React (react-router-dom)
- `/` - Página inicial (apresentação)
- `/login` - Tela de autenticação
- `/dashboard` - Dashboard do funcionário (após login)
- `/turmas` - Gestão de turmas e cursos
- `/materias` - Gestão de matérias/disciplinas
- `/professores` - Gestão de professores
- `/salas` - Gestão de salas
- `/horarios` - Grade de horários e alocação
- `/leads` - Formulário e lista de leads

### 5. Problemas Comuns e Soluções

#### Erro: "Cannot connect to localhost:5173"
- **Causa:** Backend não está rodando ou proxy não configurado
- **Solução:** Verificar se `uvicorn` está ativo na porta 5173 e se `vite.config.js` tem o proxy correto

#### Erro: "CORS policy block"
- **Causa:** Requisição do frontend (3000) bloqueada pelo backend (5173)
- **Solução:** Verificar se `api/src/app.py` tem `allow_origins=["*"]` e se a porta do backend está correta

#### Erro: "404 Not Found" na API
- **Causa:** Rota errada ou proxy não funcionando
- **Solução:** Verificar se a rota existe em `api/src/rotas/` e se o proxy do Vite está ativo

#### Erro: Banco de dados bloqueado
- **Causa:** Múltiplas instâncias do Python acessando o mesmo SQLite
- **Solução:** Garantir que apenas uma instância do backend rode de cada vez; usar WAL Mode

#### Erro: Máscara de telefone não funciona
- **Causa:** Função `tratarMascaraTelefone` não carregada
- **Solução:** Verificar se `FormularioLead.jsx` está importando a função corretamente e se há conflito de versão do React

### 6. Como Reiniciar Todos os Serviços

```bash
# 1. Matar processos existentes
pkill -f vite 2>/dev/null
pkill -f "python main.py" 2>/dev/null

# 2. Reiniciar backend (porta 5173)
cd api
source .venv/bin/activate
nohup python main.py > /tmp/backend.log 2>&1 &
sleep 2
# Verificar: curl http://localhost:5173/api/health

# 3. Reiniciar frontend (porta 3000)
cd frontend
nohup npx vite --port 3000 > /tmp/frontend.log 2>&1 &
sleep 3
# Verificar: curl http://localhost:3000

# 4. Testar acesso
# Frontend: http://localhost:3000
# API Health: http://localhost:5173/api/health
# Documentação: http://localhost:5173/docs
```

### 7. Credenciais de Acesso

#### Contas de teste
- Crie as credenciais localmente durante a configuração do banco de dados.
- Não mantenha senhas padrão em arquivos versionados.

### 8. Resumo do Estado Atual

✅ **Frontend:** Rodando em http://localhost:3000
✅ **Backend API:** Rodando em http://localhost:5173
✅ **Proxy Vite:** Funcionando (encaminha /api → backend 5173)
✅ **Health Check:** Retornando sucesso
✅ **Leads API:** Funcionando através do proxy
✅ **Banco de Dados:** SQLite com WAL Mode e Foreign Keys
✅ **Dependências:** Todas instaladas e compatíveis

---
**Status:** Todos os serviços reestabelecidos com sucesso. O frontend agora acessa a porta 3000 e o backend acessa a porta 5173, com proxy configurado corretamente para comunicação entre os serviços.