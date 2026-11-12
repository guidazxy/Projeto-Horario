from fastapi import APIRouter, Query
from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
from src.config.conexao_banco import obter_conexao

router = APIRouter()

def _get_usuario_id(token: str = Query(...)) -> int:
    """Em produção, viria de HTTPBearer. Aqui recebido via query para testes."""
    # Para desenvolvimento: token 'professor' -> usuario_id 1, 'aluno' -> usuario_id 1
    if token == "professor_prof":
        return 1
    if token == "aluno_aluno":
        return 1
    # Tentar buscar no banco
    conexao = obter_conexao()
    cursor = conexao.cursor()
    cursor.execute("SELECT usuario_id FROM sessoes WHERE token = ?", (token,))
    row = cursor.fetchone()
    conexao.close()
    return row[0] if row else 1

@router.get("/horarios")
def aluno_horarios(usuario_id: int = Depends(_get_usuario_id)):
    """Grade de horários do aluno"""
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("""
            SELECT h.dia_semana, h.hora_inicio, h.hora_fim, s.nome as sala_nome, ha.status
            FROM horarios_alocados ha
            JOIN turma_materia tm ON ha.turma_materia_id = tm.id
            JOIN turmas t ON tm.turma_id = t.id
            JOIN horarios h ON ha.horario_id = h.id
            LEFT JOIN salas s ON ha.sala_id = s.id
            WHERE t.id = 1  -- turma fixa para desenvolvimento
            ORDER BY h.dia_semana, h.hora_inicio
        """)
        horarios = cursor.fetchall()
        return {"sucesso": True, "horarios": [{"dia": r["dia_semana"], "inicio": r["hora_inicio"], "fim": r["hora_fim"], "sala": r.get("sala_nome", ""), "status": r["status"]} for r in horarios]}
    finally:
        conexao.close()

@router.get("/boletim")
def aluno_boletim(usuario_id: int = Depends(_get_usuario_id)):
    """Boletim do aluno com notas por disciplina e bimestre"""
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("""
            SELECT n.bimestre, n.tipo, n.valor, m.nome as materia_nome
            FROM notas n
            JOIN turma_materia tm ON n.turma_materia_id = tm.id
            JOIN materias m ON tm.materia_id = m.id
            WHERE n.aluno_id = 1
        """)
        rows = cursor.fetchall()
        return {"sucesso": True, "notas": [{"bimestre": r[0], "tipo": r[1], "valor": r[2], "materia": r[3]} for r in rows]}
    finally:
        conexao.close()

@router.get("/frequencia")
def aluno_frequencia(usuario_id: int = Depends(_get_usuario_id)):
    """Resumo de frequência do aluno"""
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("""
            SELECT f.status, COUNT(*) as total,
                   SUM(CASE WHEN f.status = 'P' THEN 1 ELSE 0 END) as presentes
            FROM frequencias f
            JOIN aulas a ON f.aula_id = a.id
            JOIN turma_materia tm ON a.turma_materia_id = tm.id
            JOIN turmas t ON tm.turma_id = t.id
            WHERE t.id = 1
            GROUP BY f.status
        """)
        rows = cursor.fetchall()
        presentes = rows[0][2] if rows else 0
        total = rows[0][1] if rows else 0
        percentual = round(presentes / total * 100, 1) if total > 0 else 0
        return {"sucesso": True, "percentual": percentual, "presentes": presentes, "total": total}
    finally:
        conexao.close()