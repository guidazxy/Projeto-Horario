from fastapi import Response, status, Request
from fastapi.responses import JSONResponse
from ..config.conexao_banco import obter_conexao

def listar_turma_materia_controller():
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute('''
            SELECT tm.id, t.nome as turma_nome, m.nome as materia_nome, p.nome_completo as professor_nome
            FROM turma_materia tm
            JOIN turmas t ON tm.turma_id = t.id
            JOIN materias m ON tm.materia_id = m.id
            LEFT JOIN professores p ON tm.professor_id = p.id
        ''')
        dados = cursor.fetchall()
    finally:
        conexao.close()
    return {'sucesso': True, 'dados': dados}

def cadastrar_turma_materia_controller(payload: dict):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            'INSERT INTO turma_materia (turma_id, materia_id, professor_id) VALUES (?, ?, ?)',
            (payload['turma_id'], payload['materia_id'], payload.get('professor_id'))
        )
        conexao.commit()
    finally:
        conexao.close()
    return JSONResponse(status_code=status.HTTP_201_CREATED, content={'sucesso': True, 'mensagem': 'Matéria associada à turma.'})

def remover_turma_materia_controller(payload: dict):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            'DELETE FROM turma_materia WHERE turma_id = ? AND materia_id = ?',
            (payload['turma_id'], payload['materia_id'])
        )
        conexao.commit()
    finally:
        conexao.close()
    return JSONResponse(status_code=status.HTTP_200_OK, content={'sucesso': True, 'mensagem': 'Relação removida.'})