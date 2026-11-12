import os
import sys
import sqlite3

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from src.utilitarios.seguranca_senha import gerar_hash, verificar_senha
except ImportError:
    import bcrypt
    def gerar_hash(senha):
        return bcrypt.hashpw(senha.encode(), bcrypt.gensalt()).decode()
    def verificar_senha(senha, hash_):
        return bcrypt.checkpw(senha.encode(), hash_.encode())


def inicializar_banco():
    caminho_base = os.path.dirname(os.path.abspath(__file__))
    pasta_db = os.path.join(caminho_base, "db")
    os.makedirs(pasta_db, exist_ok=True)
    caminho_banco = os.path.join(pasta_db, "horario_escolar.db")

    # Remove banco existente para garantir schema limpo
    if os.path.exists(caminho_banco):
        os.remove(caminho_banco)

    conexao = sqlite3.connect(caminho_banco)
    cursor = conexao.cursor()

    # === Remoção de tabelas existentes (ordem reversa por FK) ===
    ordem_dropar = [
        "frequencias", "notas", "aulas", "sessoes", "alunos",
        "usuarios", "leads", "restricoes", "horarios_alocados",
        "horarios", "turma_materia", "turmas", "materias",
        "professores", "cursos"
    ]
    for t in ordem_dropar:
        cursor.execute(f"DROP TABLE IF EXISTS {t}")
    conexao.commit()

    # === Criação de tabelas ===
    cursor.execute("""CREATE TABLE cursos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE,
        descricao TEXT
    )""")
    cursor.execute("""CREATE TABLE professores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_completo TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha TEXT DEFAULT 'admin123',
        disciplina_favorita TEXT,
        usuario_id INTEGER
    )""")
    cursor.execute("""CREATE TABLE materias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE,
        carga_horaria_semanal INTEGER DEFAULT 0,
        descricao TEXT
    )""")
    cursor.execute("""CREATE TABLE turmas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        curso_id INTEGER,
        ano_letivo TEXT,
        periodo_letivo TEXT,
        FOREIGN KEY (curso_id) REFERENCES cursos(id)
    )""")
    cursor.execute("""CREATE TABLE turma_materia (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        turma_id INTEGER NOT NULL,
        materia_id INTEGER NOT NULL,
        professor_id INTEGER,
        UNIQUE(turma_id, materia_id),
        FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
        FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
        FOREIGN KEY (professor_id) REFERENCES professores(id) ON DELETE SET NULL
    )""")
    cursor.execute("""CREATE TABLE salas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE,
        capacidade INTEGER DEFAULT 50,
        tipo TEXT DEFAULT 'sala'
    )""")
    cursor.execute("""CREATE TABLE horarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dia_semana TEXT NOT NULL,
        hora_inicio TEXT NOT NULL,
        hora_fim TEXT NOT NULL,
        slot TEXT GENERATED ALWAYS AS (concat(hora_inicio, '-', hora_fim)) STORED
    )""")
    cursor.execute("""CREATE TABLE horarios_alocados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        turma_materia_id INTEGER NOT NULL,
        dia_semana TEXT NOT NULL,
        horario_id INTEGER NOT NULL,
        sala_id INTEGER,
        status TEXT DEFAULT 'pendente'
            CHECK(status IN ('pendente','confirmado','cancelado')),
        FOREIGN KEY (turma_materia_id) REFERENCES turma_materia(id) ON DELETE CASCADE,
        FOREIGN KEY (dia_semana, horario_id) REFERENCES horarios(dia_semana, id) ON DELETE CASCADE,
        FOREIGN KEY (sala_id) REFERENCES salas(id) ON DELETE SET NULL
    )""")
    cursor.execute("""CREATE TABLE restriccoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT NOT NULL
            CHECK(tipo IN ('professor','sala','turma')),
        descricao TEXT NOT NULL,
        valor TEXT,
        ativa INTEGER DEFAULT 1
    )""")
    cursor.execute("""CREATE TABLE leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_completo TEXT NOT NULL,
        email TEXT NOT NULL,
        telefone_whatsapp TEXT NOT NULL,
        mensagem TEXT,
        data_cadastro TEXT DEFAULT (datetime('now','localtime')),
        status_atendimento TEXT DEFAULT 'novo'
            CHECK(status_atendimento IN ('novo','atendido','cancelado')),
        UNIQUE(email)
    )""")
    cursor.execute("""CREATE TABLE usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_completo TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('professor','aluno')),
        ativo INTEGER DEFAULT 1,
        criado_em TEXT DEFAULT (datetime('now','localtime'))
    )""")
    cursor.execute("""CREATE TABLE alunos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER UNIQUE NOT NULL,
        matricula TEXT NOT NULL UNIQUE,
        turma_id INTEGER,
        status_matricula TEXT DEFAULT 'matriculado'
            CHECK(status_matricula IN ('matriculado','em_andamento','formado')),
        criado_em TEXT DEFAULT (datetime('now','localtime')),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL
    )""")
    cursor.execute("""CREATE TABLE sessoes (
        token TEXT PRIMARY KEY,
        usuario_id INTEGER UNIQUE NOT NULL,
        criado_em TEXT DEFAULT (datetime('now','localtime')),
        expira_em TEXT NOT NULL
    )""")
    cursor.execute("""CREATE TABLE aulas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        turma_materia_id INTEGER NOT NULL,
        data TEXT NOT NULL,
        quantidade_aulas INTEGER DEFAULT 1,
        conteudo TEXT,
        observacoes TEXT,
        criado_em TEXT DEFAULT (datetime('now','localtime')),
        FOREIGN KEY (turma_materia_id) REFERENCES turma_materia(id) ON DELETE CASCADE
    )""")
    cursor.execute("""CREATE TABLE frequencias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        aula_id INTEGER NOT NULL,
        aluno_id INTEGER NOT NULL,
        status TEXT CHECK(status IN ('P','F','FJ')),
        justificativa TEXT,
        criado_em TEXT DEFAULT (datetime('now','localtime')),
        unique(aula_id, aluno_id)
    )""")
    cursor.execute("""CREATE TABLE notas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        aluno_id INTEGER NOT NULL,
        turma_materia_id INTEGER NOT NULL,
        bimestre INTEGER NOT NULL CHECK(bimestre BETWEEN 1 AND 4),
        tipo TEXT NOT NULL CHECK(tipo IN ('prova','trabalho','seminario','recuperacao')),
        descricao TEXT,
        valor REAL,
        criado_em TEXT DEFAULT (datetime('now','localtime'))
    )""")

    conexao.commit()

    # === Sementes ===
    # 1. Cursos
    for nome in ["Informática", "Agropecuária", "Administração"]:
        cursor.execute("INSERT INTO cursos (nome, descricao) VALUES (?, ?)", (nome, f"Curso de {nome}"))

    # 2. Turmas: 2 por curso (A e B) - IDs 1 a 6
    turmas_nomes = [
        ("1º Ano A", 1, "Ensino Médio", "Matutino"),
        ("1º Ano B", 1, "Ensino Médio", "Vespertino"),
        ("2º Ano A", 2, "Ensino Médio", "Matutino"),
        ("2º Ano B", 2, "Ensino Médio", "Vespertino"),
        ("3º Ano A", 3, "Ensino Médio", "Matutino"),
        ("3º Ano B", 3, "Ensino Médio", "Vespertino"),
    ]
    for tnome, cid, ao, per in turmas_nomes:
        cursor.execute("INSERT INTO turmas (nome, curso_id, ano_letivo, periodo_letivo) VALUES (?, ?, ?, ?)", (tnome, cid, ao, per))

    # 3. Materias
    for nome in ["Matemática", "Português", "História", "Biologia", "Física"]:
        cursor.execute("INSERT INTO materias (nome, carga_horaria_semanal) VALUES (?, ?)", (nome, 8))

    # 4. Professores + Usuarios
    profs = [
        ("Prof. Carlos", "carlos@ifmt.edu.br", "Matemática"),
        ("Profª Ana", "ana@ifmt.edu.br", "Português"),
        ("Prof. João", "joao@ifmt.edu.br", "História"),
        ("Profª Maria", "maria@ifmt.edu.br", "Biologia"),
        ("Prof. Pedro", "pedro@ifmt.edu.br", "Física"),
    ]
    professor_ids = []
    for nome, email, disc in profs:
        senha_hash = gerar_hash("admin123")
        cursor.execute("INSERT INTO usuarios (nome_completo, email, senha_hash, role) VALUES (?, ?, ?, ?)",
                       (nome, email, senha_hash, "professor"))
        uid = cursor.execute("SELECT id FROM usuarios WHERE email = ?", (email,)).fetchone()[0]
        professor_ids.append(uid)
        cursor.execute("INSERT INTO professores (nome_completo, email, disciplina_favorita, usuario_id) VALUES (?, ?, ?, ?)",
                       (nome, email, disc, uid))

    # 5. Materia-professor links: cada professor com uma materia, turma_id sequencial
    materias_ids = [1, 2, 3, 4, 5]  # IDs das 5 matérias
    for i, pid in enumerate(professor_ids):
        cursor.execute("INSERT INTO turma_materia (turma_id, materia_id, professor_id) VALUES (?, ?, ?)",
                       (i + 1, materias_ids[i], pid))

    # 6. Alunos: 6 alunos distribuídos nas turmas (IDs 1 a 6)
    matriculas = [f"2024{str(i).zfill(5)}" for i in range(1, 7)]
    for i, (mat, tm_id) in enumerate(zip(matriculas, range(1, 7))):
        email_aluno = f"aluno{i+1}@ifmt.edu.br"
        senha_hash_aluno = gerar_hash("aluno123")
        cursor.execute("INSERT INTO usuarios (nome_completo, email, senha_hash, role) VALUES (?, ?, ?, ?)",
                       (f"Aluno {i+1}", email_aluno, senha_hash_aluno, "aluno"))
        uid_al = cursor.execute("SELECT id FROM usuarios WHERE email = ?", (email_aluno,)).fetchone()[0]
        cursor.execute("INSERT INTO alunos (usuario_id, matricula, turma_id, status_matricula) VALUES (?, ?, ?, ?)",
                       (uid_al, mat, tm_id, "matriculado"))

    # 7. Horarios: 5 slots fixos
    horarios_dados = [
        ("Segunda", "07:30", "08:20"),
        ("Terça", "07:30", "08:20"),
        ("Quarta", "07:30", "08:20"),
        ("Quinta", "07:30", "08:20"),
        ("Sexta", "07:30", "08:20"),
    ]
    for dia, hi, hf in horarios_dados:
        cursor.execute("INSERT INTO horarios (dia_semana, hora_inicio, hora_fim) VALUES (?, ?, ?)", (dia, hi, hf))

    # 8. Horarios alocados exemplo: 3 alocações
    # turma_materia IDs: 1 a 6; horario IDs: 1 a 5; sala_id 1
    for i in range(3):
        tm_id = i + 1  # turma_materia ID
        ha_id = i + 1  # horario ID
        cursor.execute("INSERT INTO horarios_alocados (turma_materia_id, dia_semana, horario_id, sala_id, status) VALUES (?, ?, ?, ?, ?)",
                       (tm_id, ["Segunda", "Terça", "Quarta"][i], ha_id, 1, "confirmado"))

    # 7. leads existente
    cursor.execute("""INSERT INTO leads (nome_completo, email, telefone_whatsapp, mensagem)
        VALUES ('João Silva', 'joao@email.com', '61999998888', 'Interesse em matéria de Informática')""")

    conexao.commit()
    print("Banco de dados inicializado com dados de exemplo.")
    conexao.close()
    print("Banco de dados de horário escolar criado/verificado com sucesso.")


if __name__ == "__main__":
    inicializar_banco()