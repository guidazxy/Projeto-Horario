from fastapi import Response, status, Request
from fastapi.responses import JSONResponse
from ..config.conexao_banco import obter_conexao

def listar_materias_controller():
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute('SELECT id, nome, carga_horaria_semanal, descricao FROM materias ORDER BY nome')
        dados = cursor.fetchall()
    finally:
        conexao.close()
    return {'sucesso': True, 'dados': dados}

def cadastrar_materia_controller(payload: dict):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            'INSERT INTO materias (nome, carga_horaria_semanal, descricao) VALUES (?, ?, ?)',
            (payload['nome'], payload.get('carga_horaria_semanal'), payload.get('descricao'))
        )
        conexao.commit()
    finally:
        conexao.close()
    return JSONResponse(status_code=status.HTTP_201_CREATED, content={'sucesso': True, 'mensagem': 'Matéria criada.'})

def remover_materia_controller(payload: dict):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute('DELETE FROM materias WHERE id = ?', (payload['id'],))
        conexao.commit()
    finally:
        conexao.close()
    return JSONResponse(status_code=status.HTTP_200_OK, content={'sucesso': True, 'mensagem': 'Matéria removida.'})

def listar_professores_controller():
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute('SELECT id, nome_completo, email, disciplina_favorita FROM professores ORDER BY nome_completo')
        dados = cursor.fetchall()
    finally:
        conexao.close()
    return {'sucesso': True, 'dados': dados}

def cadastrar_professor_controller(payload: dict):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            'INSERT INTO professores (nome_completo, email, disciplina_favorita) VALUES (?, ?, ?)',
            (payload['nome_completo'], payload['email'], payload.get('disciplina_favorita'))
        )
        conexao.commit()
    finally:
        conexao.close()
    return JSONResponse(status_code=status.HTTP_201_CREATED, content={'sucesso': True, 'mensagem': 'Professor criado.'})

def remover_professor_controller(payload: dict):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute('DELETE FROM professores WHERE id = ?', (payload['id'],))
        conexao.commit()
    finally:
        conexao.close()
    return JSONResponse(status_code=status.HTTP_200_OK, content={'sucesso': True, 'mensagem': 'Professor removido.'})