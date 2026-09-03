from fastapi import Response, status, Request
from fastapi.responses import JSONResponse
from ..config.conexao_banco import obter_conexao

router = None

def listar_professor_materia_controoler():
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute('''
            SELECT pm.id, p.nome_completo, m.nome as materia_nome
            FROM professor_materia pm
            JOIN professores p ON pm.professor_id = p.id
            JOIN materias m ON pm.materia_id = m.id
        ''')
        dados = cursor.fetchall()
    finally:
        conexao.close()
    return {'sucesso': True, 'dados': dados}

def cadastrar_professor_materia_controller(payload: dict):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            'INSERT INTO professor_materia (professor_id, materia_id) VALUES (?, ?)',
            (payload['professor_id'], payload['materia_id'])
        )
        conexao.commit()
    finally:
        conexao.close()
    return JSONResponse(status_code=status.HTTP_201_CREATED, content={'sucesso': True, 'mensagem': 'Relação professor-disciplina criada.'})

def remover_professor_materia_controller(payload: dict):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            'DELETE FROM professor_materia WHERE professor_id = ? AND materia_id = ?',
            (payload['professor_id'], payload['materia_id'])
        )
        conexao.commit()
    finally:
        conexao.close()
    return JSONResponse(status_code=status.HTTP_200_OK, content={'sucesso': True, 'mensagem': 'Relação removida.'})