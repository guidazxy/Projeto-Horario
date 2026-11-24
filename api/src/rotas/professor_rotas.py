from fastapi import APIRouter, Body, Depends
from fastapi.responses import JSONResponse
from starlette import status
from src.config.conexao_banco import obter_conexao
from src.models.entidades import Usuario

router = APIRouter()

def get_current_professor(token: str = Depends(...)):
    """Simplified - em produção usaria HTTPBearer"""
    pass

@router.get("/contexto")
def professor_contexto():
    """Retorna cursos, turmas e disciplinas para o contexto do professor"""
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        # Cursos
        cursor.execute("SELECT id, nome FROM cursos ORDER BY nome")
        cursos = cursor.fetchall()
        # Turmas
        cursor.execute("""
            SELECT t.id, t.nome, t.curso_id, c.nome AS curso_nome
            FROM turmas t
            LEFT JOIN cursos c ON c.id = t.curso_id
            ORDER BY t.nome
        """)
        turmas = cursor.fetchall()
        # Disciplinas via turma_materia
        cursor.execute("""
            SELECT tm.id, m.nome AS materia_nome, p.nome_completo AS professor_nome,
                   t.nome AS turma_nome, c.nome AS curso_nome
            FROM turma_materia tm
            JOIN materias m ON tm.materia_id = m.id
            JOIN turmas t ON tm.turma_id = t.id
            LEFT JOIN cursos c ON t.curso_id = c.id
            LEFT JOIN professores p ON tm.professor_id = p.id
            ORDER BY m.nome
        """)
        disciplinas = cursor.fetchall()
        return {"sucesso": True, "cursos": cursos, "turmas": turmas, "disciplinas": disciplinas}
    finally:
        conexao.close()

@router.get("/horarios")
def professor_horarios():
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("""
            SELECT ha.id, h.dia_semana, h.hora_inicio, h.hora_fim,
                   t.nome AS turma_nome, m.nome AS materia_nome,
                   p.nome_completo AS professor_nome, s.nome AS sala_nome,
                   ha.status
            FROM horarios_alocados ha
            JOIN turma_materia tm ON tm.id = ha.turma_materia_id
            JOIN turmas t ON t.id = tm.turma_id
            JOIN materias m ON m.id = tm.materia_id
            JOIN horarios h ON h.id = ha.horario_id
            LEFT JOIN professores p ON p.id = tm.professor_id
            LEFT JOIN salas s ON s.id = ha.sala_id
            ORDER BY
                CASE h.dia_semana
                    WHEN 'Segunda' THEN 1
                    WHEN 'Terça' THEN 2
                    WHEN 'Quarta' THEN 3
                    WHEN 'Quinta' THEN 4
                    WHEN 'Sexta' THEN 5
                    ELSE 6
                END,
                h.hora_inicio,
                t.nome
        """)
        return {"sucesso": True, "horarios": cursor.fetchall()}
    finally:
        conexao.close()

@router.get("/turmas/{turma_id}/alunos")
def turma_alunos(turma_id: int):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("""
            SELECT a.id, u.nome_completo, a.matricula, a.status_matricula
            FROM alunos a
            JOIN usuarios u ON a.usuario_id = u.id
            WHERE a.turma_id = ?
            ORDER BY u.nome_completo
        """, (turma_id,))
        alunos = cursor.fetchall()
        return {"sucesso": True, "alunos": [{"id": r[0], "nome": r[1], "matricula": r[2], "status": r[3]} for r in alunos]}
    finally:
        conexao.close()

@router.get("/turma-materia/{tm_id}")
def turma_materia(tm_id: int):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("""
            SELECT tm.id, m.nome as materia_nome, p.nome_completo as professor_nome
            FROM turma_materia tm
            JOIN materias m ON tm.materia_id = m.id
            LEFT JOIN professores p ON tm.professor_id = p.id
            WHERE tm.id = ?
        """, (tm_id,))
        row = cursor.fetchone()
        if row:
            return {"sucesso": True, "materia": row[1], "professor": row[2]}
        return {"sucesso": False, "mensagem": "Relação não encontrada"}
    finally:
        conexao.close()