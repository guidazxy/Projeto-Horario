import os
import sqlite3

def inicializar_banco():
    caminho_base = os.path.dirname(os.path.abspath(__file__))
    pasta_db = os.path.join(caminho_base, 'db')
    os.makedirs(pasta_db, exist_ok=True)
    caminho_banco = os.path.join(pasta_db, 'horario_escolar.db')

    conexao = sqlite3.connect(caminho_banco)
    cursor = conexao.cursor()

    cursor.executescript('''
        CREATE TABLE IF NOT EXISTS cursos (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            nome                TEXT    NOT NULL UNIQUE,
            descricao           TEXT
        );

        CREATE TABLE IF NOT EXISTS turmas (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            nome                TEXT    NOT NULL,
            curso_id            INTEGER,
            ano_letivo          TEXT,
            periodo_letivo      TEXT,
            FOREIGN KEY (curso_id) REFERENCES cursos(id)
        );

        CREATE TABLE IF NOT EXISTS professores (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_completo       TEXT    NOT NULL,
            email               TEXT    NOT NULL UNIQUE,
            senha               TEXT    DEFAULT 'admin123',
            disciplina_favorita TEXT
        );

        CREATE TABLE IF NOT EXISTS materias (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            nome                TEXT    NOT NULL UNIQUE,
            carga_horaria_semanal INTEGER DEFAULT 0,
            descricao           TEXT
        );

        CREATE TABLE IF NOT EXISTS professor_materia (
            professor_id        INTEGER NOT NULL,
            materia_id          INTEGER NOT NULL,
            PRIMARY KEY (professor_id, materia_id),
            FOREIGN KEY (professor_id) REFERENCES professores(id) ON DELETE CASCADE,
            FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS salas (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            nome                TEXT    NOT NULL UNIQUE,
            capacidade          INTEGER DEFAULT 50,
            tipo                TEXT DEFAULT 'sala'
        );

        CREATE TABLE IF NOT EXISTS horarios (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            dia_semana          TEXT    NOT NULL,
            hora_inicio         TEXT    NOT NULL,
            hora_fim            TEXT    NOT NULL,
            slot                TEXT    GENERATED ALWAYS AS (concat(hora_inicio, '-', hora_fim)) STORED
        );

        CREATE TABLE IF NOT EXISTS turma_materia (
            turma_id            INTEGER NOT NULL,
            materia_id          INTEGER NOT NULL,
            professor_id        INTEGER,
            PRIMARY KEY (turma_id, materia_id),
            FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
            FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
            FOREIGN KEY (professor_id) REFERENCES professores(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS horarios_alocados (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            turma_materia_id    INTEGER NOT NULL,
            dia_semana          TEXT    NOT NULL,
            horario_id          INTEGER NOT NULL,
            sala_id             INTEGER,
            status              TEXT    DEFAULT 'pendente'
                                CHECK(status IN ('pendente','confirmado','cancelado')),
            FOREIGN KEY (turma_materia_id) REFERENCES turma_materia(id) ON DELETE CASCADE,
            FOREIGN KEY (dia_semana, horario_id) REFERENCES horarios(dia_semana, id) ON DELETE CASCADE,
            FOREIGN KEY (sala_id) REFERENCES salas(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS restriccoes (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo                TEXT    NOT NULL
                                CHECK(tipo IN ('professor','sala','turma')),
            descricao           TEXT NOT NULL,
            valor               TEXT,
            ativa               INTEGER DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS leads (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_completo       TEXT    NOT NULL,
            email               TEXT    NOT NULL,
            telefone_whatsapp   TEXT    NOT NULL,
            mensagem            TEXT,
            data_cadastro       TEXT    DEFAULT (datetime('now','localtime')),
            status_atendimento  TEXT    DEFAULT 'novo'
                            CHECK(status_atendimento IN ('novo','atendido','cancelado')),
            UNIQUE(email)
        );

        CREATE INDEX IF NOT EXISTS idx_cursos_nome ON cursos(nome);
        CREATE INDEX IF NOT EXISTS idx_turmas_curso ON turmas(curso_id);
        CREATE INDEX IF NOT EXISTS idx_professor_materia_prof ON professor_materia(professor_id);
        CREATE INDEX IF NOT EXISTS idx_professor_materia_materia ON professor_materia(materia_id);
        CREATE INDEX IF NOT EXISTS idx_turma_materia_turma ON turma_materia(turma_id);
        CREATE INDEX IF NOT EXISTS idx_turma_materia_materia ON turma_materia(materia_id);
        CREATE INDEX IF NOT EXISTS idx_horarios_alocados_turma_materia ON horarios_alocados(turma_materia_id);
        CREATE INDEX IF NOT EXISTS idx_horarios_alocados_sala ON horarios_alocados(sala_id);
        CREATE INDEX IF NOT EXISTS idx_horarios_alocados_status ON horarios_alocados(status);
    ''')

    conexao.commit()

    cursor.execute("SELECT id FROM professores WHERE email = 'admin@escola.edu'")
    if not cursor.fetchone():
        cursor.execute(
            "INSERT INTO professores (nome_completo, email, senha) VALUES (?, ?, ?)",
            ('Administrador', 'admin@escola.edu', 'admin123')
        )
        conexao.commit()
        print("Usuário padrão criado: admin@escola.edu / admin123")

    conexao.close()
    print("Banco de dados de horário escolar criado/verificado com sucesso no SQLite (Python).")

if __name__ == "__main__":
    inicializar_banco()
