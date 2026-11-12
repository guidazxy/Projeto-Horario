# 🤖 Prompt de Engenharia de Software para OpenCode: Sistema Acadêmico (Inspiração SUAP)

> **Instrução para o Agente (OpenCode):** Leia atentamente toda esta especificação antes de modificar qualquer arquivo. Siga rigorosamente a etapa de auditoria inicial antes de escrever código.

---

## 1. Diretriz Primária: Auditoria Prévia e Preservação Arquitetural

Antes de implementar ou reescrever qualquer funcionalidade, **inspecione toda a base de código atual** (`api/` e `frontend/`) para verificar o que já existe, evitando duplicação de código ou quebra de funcionalidades operacionais.

Você deve **respeitar integralmente**:
* **Stack Tecnológica:** Backend em **Python 3 (FastAPI + Uvicorn)** com **SQLite** (modo WAL e *Prepared Statements*) e Frontend em **React 18 (Vite + Tailwind CSS)**.
* **Identidade Visual & Design System:** Paleta baseada em **Amarelo Manteiga (*Butter Yellow*)** e **Azul**, com suporte completo a **Dark Mode / Light Mode**, tipografia *Plus Jakarta Sans* e *Fira Code*, e micro-interações fluidas.
* **Segurança da Informação:** Hashing de senhas com `bcrypt` (`passlib`), sanitização contra XSS (`html.escape`), validação rigorosa via `Pydantic`, proteção contra SQL Injection e controle de acesso baseado em papéis (**RBAC**).
* **Paradigma de Programação (POO):** Toda a lógica de negócio e entidades no backend (`api/src/`) deve ser estruturada utilizando **Programação Orientada a Objetos (POO)** limpa (Classes, Encapsulamento, Herança/Polimorfismo onde aplicável, Modelos de Domínio e Repositórios/Controladores).

---

## 2. Referência de Domínio: Padrão SUAP (Institutos Federais)

Modele as regras de negócio, nomenclaturas e fluxos inspirando-se no **SUAP (Sistema Unificado de Administração Pública)** utilizado pelos Institutos Federais Brasileiros (como o **IFMT — Campus Barra do Garças**):
* **Estrutura Acadêmica:** Ensino Médio Integrado ao Técnico (1º ao 3º Ano, Turmas A e B) nos cursos de **Informática**, **Agropecuária** e **Administração**.
* **Organização Bimestral:** Avaliação dividida em 4 bimestres, cálculo automático de média bimestral/anual e apuração de frequência mínima obrigatória (75% conforme LDB).

---

## 3. Especificação das Funcionalidades Obrigatórias

### 3.1. Módulo de Controle de Acesso e Autenticação (RBAC)
* **Tela Inicial / Portal de Acesso:**
  * Seletor explícito de perfil antes/durante a autenticação: **Professor (Servidor/Docente)** ou **Aluno (Discente)**.
  * Fluxo seguro de Login e Cadastro com validação de credenciais no backend (`bcrypt`).
  * Redirecionamento automático e proteção de rotas no frontend e endpoints no backend de acordo com o papel (`role`) autenticado.

### 3.2. Módulo do Professor (Diário Eletrônico Completo)
Ao autenticar como **Professor**, o sistema deve disponibilizar um painel completo de gestão pedagógica com as seguintes telas/funcionalidades:

1. **Seleção de Contexto (Diário de Classe):**
   * Filtro hierárquico para escolha de **Curso** (Informática, Agropecuária, Administração), **Turma** (1º A/B, 2º A/B, 3º A/B) e **Disciplina** vinculada ao docente.
2. **Gestão e Geração de Aulas (Cronograma & Conteúdo):**
   * Visualização e geração da grade de horários semanal (evitando conflitos de horário, professor e sala).
   * Registro de aulas ministradas (Data, Quantidade de Aulas, Conteúdo Programático/Ministrado e Observações).
3. **Controle de Frequência (Chamada Digital):**
   * Lista de chamada vinculada à aula gerada/selecionada.
   * Marcação rápida por aluno: **Presente (P)**, **Falta (F)** ou **Falta Justificada (FJ)**.
   * Cálculo automático em tempo real do percentual de faltas e alerta visual (em Amarelo Manteiga / Vermelho) para alunos em risco de reprovação por falta (< 75% de presença).
4. **Controle de Notas e Avaliações:**
   * Lançamento de notas por bimestre (1º ao 4º Bimestre), avaliações parciais (Provas, Trabalhos, Seminários) e Recuperação.
   * Cálculo automático da Média Final e exibição do status acadêmico do aluno (*Aprovado*, *Em Exame/Recuperação*, *Reprovado*).
5. **Controle de Alunos (Gestão Discente da Turma):**
   * Cadastro, listagem, busca e visualização do perfil acadêmico dos alunos matriculados na turma (Matrícula/RA, Nome Completo, E-mail institucional, Status da Matrícula, Histórico de Frequência e Boletim resumido).

### 3.3. Módulo do Aluno (Portal Discente)
Ao autenticar como **Aluno**, o sistema deve restringir ações de escrita (somente leitura) e exibir:
* **Grade de Horários:** Visualização das aulas da sua turma por dia da semana, professor e sala/laboratório.
* **Boletim Escolar:** Consulta das notas lançadas por disciplina e bimestre.
* **Extrato de Frequência:** Acompanhamento da porcentagem de presença e faltas por disciplina.

---

## 4. Modelagem Orientada a Objetos & Banco de Dados (Backend)

Refatore/organize `api/src/` aplicando POO:
* **Entidades / Modelos (`models/`):** Classes representando `Usuario` (classe base), `Professor(Usuario)`, `Aluno(Usuario)`, `Curso`, `Turma`, `Disciplina`, `Aula`, `Frequencia` e `Nota`.
* **Camada de Persistência (`repositories/` ou `controladores/`):** Classes responsáveis pelas operações CRUD no SQLite (`PRAGMA foreign_keys = ON`, `PRAGMA journal_mode = WAL`) utilizando *Prepared Statements*.
* **Camada de Serviço (`services/`):** Regras de negócio (cálculo de médias, verificação de conflito de horários, apuração de frequência mínima).

---

## 5. Plano de Execução Solicitado ao OpenCode

1. **Auditoria:** Liste brevemente os arquivos existentes e aponte o que será reaproveitado e o que será criado.
2. **Banco de Dados & POO (Backend):** Atualize o schema do SQLite (`iniciar_banco.py`) e implemente as classes POO, serviços e endpoints RESTful no FastAPI.
3. **Interface Reativa (Frontend):** Implemente as telas de seleção de perfil, o Diário Eletrônico do Professor (Aulas, Frequência, Notas e Alunos) e o Portal do Aluno, mantendo o tema **Amarelo Manteiga & Azul** com **Dark/Light Mode**.
4. **Validação:** Garanta que o servidor backend (`uvicorn`) e o build do frontend (`vite build`) executem sem erros de sintaxe, importação ou tipagem.