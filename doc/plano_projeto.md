# Escopo do Projeto: Sistema Escolar de Gestão de Horários

**Projeto Integrador — 3º Bimestre**  
**Formato do Grupo:** Dupla  
**Integrantes:** *[Nome do Aluno 1]* e *[Nome do Aluno 2]*  
**Linguagem & Tecnologias:** Python | FET (Free Timetabling Software) | XML | Código Aberto (Open Source)

---

## 1. Apresentação do Projeto
O **Sistema Escolar de Gestão de Horários** é uma solução de software completa voltada para resolver um dos desafios mais burocráticos das instituições de ensino: a montagem, ajuste e disponibilização de grades horárias acadêmicas sem conflito de horários, professores ou salas.

A aplicação combina uma **interface intuitiva em Python** para inserção de dados e consulta com o **motor de otimização automatizado FET**, conectado por meio da estruturação e troca de dados em arquivos **XML**.

Por ser um projeto de **Código Aberto (Open Source)**, o sistema garante transparência, segurança, ausência de custos de licenciamento e alta capacidade de adaptação para diferentes instituições de ensino.

---

## 2. Objetivos do Sistema
* **Eliminação de Conflitos:** Garantir que nenhum professor ou sala de aula seja alocado em duplicidade no mesmo horário.
* **Automação Inteligente:** Reduzir o tempo de criação de horários de dias para poucos segundos através do algoritmo de otimização do FET.
* **Acesso Segmentado:** Oferecer visões claras e específicas para cada perfil de usuário (Funcionários e Alunos).
* **Flexibilidade de Ajuste:** Permitir alterações pontuais em horários já existentes sem a necessidade de reprocessar a grade inteira.

---

## 3. Descrição Detalhada dos Módulos e Telas (Conforme Apresentação)

### 3.1. Interface 1: Módulo de Autenticação (Login)
A tela de login é o ponto de entrada da aplicação, projetada para garantir segurança e praticidade ao separar os acessos:
* **Seleção de Perfil:** Alternância visual e funcional entre os perfis **Funcionário** e **Aluno**.
* **Credenciais de Acesso:** Campos para preenchimento de *E-mail* e *Senha*.
* **Recuperação de Acesso:** Botão/link de suporte *"Esqueceu sua senha? Clique aqui"*.
* **Direcionamento Dinâmico:** Cada tipo de usuário é redirecionado exclusivamente para o seu painel correspondente, mantendo a interface limpa e segura.

---

### 3.2. Interface 2: Painel do Funcionário (Gestão e Administração)
O painel do funcionário é uma ferramenta completa de administração e controle da grade escolar, permitindo:

1. **Cadastros de Base:**
   * Cadastro e gestão de **Professores**, **Matérias (Disciplinas)**, **Turmas**, **Cursos** e **Salas/Laboratórios**.
2. **Módulo "+ Criar Horário":**
   * **Informações Gerais:** Definição de Curso, Turma, Semestre, Ano Letivo e Período.
   * **Matérias e Professores:** Inclusão de cada disciplina acompanhada do respectivo professor responsável.
   * **Distribuição de Horários:** Configuração do Dia da Semana, Horário (slot) e Carga Horária Semanal (quantidade de aulas por semana).
3. **Módulo "Modificar Horário Existente":**
   * Permite selecionar um horário já gerado e alterar aulas específicas (Dia da Semana, Horário Atual vs. Novo Horário, Matéria Atual vs. Nova Matéria).
   * **Registro do Motivo:** Campo obrigatório para justificativa da alteração (ex: "Readequação de indisponibilidade do professor").
   * Opção de salvar modificações pontuais ou optar por recriar o horário completo.
4. **Aplicação de Restrições:**
   * Definição de preferências de horários e dias de indisponibilidade de professores.
   * Configuração de limites de capacidade de turmas e salas.
5. **Visualização Prévia:**
   * Validação visual das grades geradas antes da publicação e confirmação oficial.

---

### 3.3. Interface 2: Painel do Aluno (Consulta Prática)
O painel do aluno é voltado estritamente para consulta rápida, visual e despoluída, apresentando:

1. **Cabeçalho de Informações Acadêmicas:**
   * Exibição dos dados do estudante: Nome Completo, Número de Matrícula, Curso (ex: *Informática*), Turma (ex: *2A*) e Período Letivo (ex: *2º Semestre 2024*).
2. **Visualização "Grade Semanal":**
   * Tabela organizada por horários (ex: *07:00-07:50*, *07:50-08:40*) e por dias da semana (Segunda a Sexta).
   * Exibição clara dentro de cada célula: **Matéria**, **Professor** e **Sala/Laboratório** (ex: *Matemática - Prof. João Silva - Sala 101*).
   * Exibição do resumo total de aulas (ex: *25 aulas/semana*).
3. **Visualização "Por Matéria":**
   * Listagem detalhada por disciplina com contadores de aulas por semana (ex: *13 matérias*, *3 aulas/semana*).
   * Exibição do professor responsável, dias da semana, horários específicos e sala/laboratório de cada aula.

---

### 3.4. Arquitetura Tecnológica e Integração (Python + FET)
A arquitetura do sistema funciona através da integração direta entre Python e o motor FET:

1. **Camada de Aplicação (Python):**
   * Coleta, valida e gerencia as informações cadastradas pelo funcionário no banco de dados.
   * Converte o conjunto de dados (professores, matérias, salas, turmas e restrições) em um arquivo formatado em **XML**.
2. **Motor de Otimização (FET):**
   * Software livre de criação de horários que utiliza algoritmos heurísticos e de busca para resolver o problema de alocação.
   * Lê o arquivo XML gerado pelo Python e executa o processamento para encontrar uma combinação sem nenhum conflito.
3. **Retorno e Exibição:**
   * O FET exporta a solução em XML.
   * O Python faz a leitura (*parser*) desse retorno, atualiza a base do sistema e exibe as grades prontas no Painel do Funcionário e no Portal do Aluno.

---

## 4. Diferenciais do Projeto
* **Código Aberto (Open Source):** Solução livre que pode ser personalizada, auditada e adaptada para diferentes instituições sem custos com licenças.
* **Agilidade na Gestão:** Economia expressiva de tempo e esforço para secretarias e coordenações pedagógicas.
* **Alta Satisfação:** Redução do estresse e insatisfação de professores e alunos decorrentes de choques de horários ou salas incorretas.
* **Potencial de Replicabilidade:** Estrutura modular permitindo fácil implantação em outras escolas, faculdades ou cursos técnicos.

---

## 5. Estrutura Analítica do Projeto (EAP / WBS)

```text
Sistema Escolar de Gestão de Horários
├── 1. Mapeamento de Requisitos & Regras de Negócio
│   ├── 1.1 Levantamento de restrições (professores, salas, turmas)
│   └── 1.2 Definição de fluxos e permissões de acesso (Funcionário vs Aluno)
├── 2. Módulo de Integração Python + FET
│   ├── 2.1 Módulo gerador de XML a partir das restrições em Python
│   ├── 2.2 Automação da execução do motor FET via linha de comando
│   └── 2.3 Módulo leitor (parser) de retorno do XML gerado pelo FET
├── 3. Desenvolvimento de Interfaces Gráficas
│   ├── 3.1 Interface de Login (Seleção Funcionário / Aluno)
│   ├── 3.2 Painel do Funcionário (Cadastros, Criar e Modificar Horários)
│   └── 3.3 Painel do Aluno (Visão Grade Semanal e Visão Por Matéria)
├── 4. Testes de Validação & Homologação
│   ├── 4.1 Simulação de cenários complexos de conflito
│   └── 4.2 Testes de usabilidade e navegação
└── 5. Documentação & Entrega
    ├── 5.1 Repositório de código aberto no GitHub
    └── 5.2 Relatório técnico e apresentação final para o professor
```

---

## 6. Divisão de Tarefas para a Dupla

| Integrante | Função Principal | Atividades e Entregáveis |
| :--- | :--- | :--- |
| **Integrante 1** | **Backend & Integração FET** | • Modelagem do banco/estrutura de dados.<br>• Desenvolvimento dos scripts Python para geração do arquivo XML.<br>• Integração e execução automatizada do engine FET.<br>• Leitura e gravação do retorno dos horários no sistema. |
| **Integrante 2** | **Frontend & UI/UX** | • Desenvolvimento da Tela de Login com seleção de perfis.<br>• Construção do Painel do Funcionário (Formulários de criação/modificação).<br>• Construção do Portal do Aluno (Tabelas de Grade Semanal e Por Matéria).<br>• Validação de usabilidade, layout e despoluição visual. |
