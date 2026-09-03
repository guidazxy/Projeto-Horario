from fastapi import Response, status, Request
from fastapi.responses import JSONResponse
from ..config.conexao_banco import obter_conexao

def listar_horarios_alocados_controller():
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute('''
            SELECT ha.id, tm.id as turma_materia_id, t.nome as turma_nome, m.nome as materia_nome,
                   p.nome_completo as professor_nome, h.dia_semana, h.hora_inicio, h.hora_fim,
                   s.nome as sala_nome, ha.status
            FROM horarios_alocados ha
            JOIN turma_materia tm ON ha.turma_materia_id = tm.id
            JOIN turmas t ON tm.turma_id = t.id
            JOIN materias m ON tm.materia_id = m.id
            LEFT JOIN professores p ON tm.professor_id = p.id
            JOIN horarios h ON ha.horario_id = h.id
            LEFT JOIN salas s ON ha.sala_id = s.id
        ''')
        dados = cursor.fetchall()
    finally:
        conexao.close()
    return {'sucesso': True, 'dados': dados}

def cadastrar_horario_alocado_controller(payload: dict):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            '''INSERT INTO horarios_alocados (turma_materia_id, dia_semana, horario_id, sala_id, status) 
               VALUES (?, ?, ?, ?, ?)''',
            (payload['turma_materia_id'], payload['dia_semana'], payload['horario_id'],
             payload.get('sala_id'), payload.get('status', 'pendente'))
        )
        conexao.commit()
    finally:
        conexao.close()
    return JSONResponse(status_code=status.HTTP_201_CREATED, content={'sucesso': True, 'mensagem': 'Horário alocado.'})

def remover_horario_alocado_controller(payload: dict):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            'DELETE FROM horarios_alocados WHERE id = ?', (payload['id'],)
        )
        conexao.commit()
    finally:
        conexao.close()
    return JSONResponse(status_code=status.HTTP_200_OK, content={'sucesso': True, 'mensagem': 'Horário removido.'})