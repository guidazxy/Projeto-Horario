# 🚀 PLANO DE EXECUÇÃO E DESENVOLVIMENTO (OPENCODE)

---

## 1. Identificação do Projeto
* **Nome do Projeto:** Sistema de Gestão de Horários Escolares
* **Desenvolvedores:** Lara Guida Carvalho & Carlos Alexandre Dias da Silva[cite: 1]

---

## 2. Arquitetura e Diretrizes Tecnológicas
O desenvolvimento deve respeitar estritamente a arquitetura existente:
* **Back-end:** Python (Gerenciamento de regras de negócio, dados e integração).
* **Motor de Cálculo / Otimização:** FET (Free Timetabling Software) via geração e leitura de arquivos XML.
* **Front-end:** Interface limpa e intuitiva para administração e consulta.
* **Filosofia:** Código Aberto (Open Source).

---

## 3. Plano de Implementação Modular (Instruções para o OpenCode)

### 🔹 Módulo 1: Estruturação do Back-end & Banco de Dados (Python)
1. **Modelagem de Dados:**
   * Criar entidades para `Professores`, `Turmas`, `Matérias`, `Salas/Laboratórios` e `Restrições de Horário`.
   * Implementar rotas/funções de CRUD completas para alimentação do cadastro base.

2. **Gerador XML (Integração Python + FET):**
   * Criar um módulo responsável por ler os dados do banco e formatar o arquivo `.xml` no padrão aceito pelo FET.
   * Implementar a chamada de execução do motor FET via terminal/subprocesso Python.
   * Criar o parser de retorno para ler a solução gerada pelo FET e salvar a grade no banco de dados.

---

### 🔹 Módulo 2: Interface Administrativa / Funcionário (Front-end + Back-end)
1. **Painel de Controle:**
   * Criar telas para cadastro rápido de turmas, docentes e restrições.
   * Implementar a funcionalidade de acionar a **Geração Inteligente** da grade horária.

2. **Validação Prévia de Horários:**
   * Desenvolver interface para visualização prévia da grade gerada antes da confirmação oficial, prevenindo choques de horários.

---

### 🔹 Módulo 3: Portal de Consulta do Aluno (Front-end)
1. **Interface de Leitura:**
   * Desenvolver uma visualização limpa e direta da grade semanal do estudante.
   * Permitir filtragem e alternância de visualização por **dia da semana** ou por **matéria/disciplina**.

---

## 4. Requisitos Não Funcionais & Critérios de Aceite
* **Confiabilidade:** O sistema deve garantir a ausência total de conflitos de horário (dois professores na mesma sala ou mesmo professor em duas turmas).
* **Eficiência:** A geração automatizada pelo FET deve reduzir o tempo de montagem da grade para poucos minutos.
* **Escalabilidade:** O código deve ser modular para permitir aplicação em diferentes instituições de ensino.