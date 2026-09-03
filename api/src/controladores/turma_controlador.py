from fastapi import Response, status, Request
from fastapi.responses import JSONResponse
from ..config.conexao_banco import obter_conexao

def listar_cursos_controller():
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute('SELECT id, nome, descricao FROM cursos ORDER BY nome')
        dados = cursor.fetchall()
    finally:
        conexao.close()
    return {'sucesso': True, 'dados': dados}

def cadastrar_curso_controller(payload: dict):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            'INSERT INTO cursos (nome, descricao) VALUES (?, ?)',
            (payload['nome'], payload.get('descricao'))
        )
        conexao.commit()
    finally:
        conexao.close()
    return JSONResponse(status_code=status.HTTP_201_CREATED, content={'sucesso': True, 'mensagem': 'Curso criado.'})

def remover_curso_controller(payload: dict):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute('DELETE FROM cursos WHERE id = ?', (payload['id'],))
        conexao.commit()
    finally:
        conexao.close()
    return JSONResponse(status_code=status.HTTP_200_OK, content={'sucesso': True, 'mensagem': 'Curso removido.'})

def listar_turmas_controller():
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute('''
            SELECT t.id, t.nome, t.ano_letivo, t.periodo_letivo, c.nome as curso_nome
            FROM turmas t
            LEFT JOIN cursos c ON t.curso_id = c.id
            ORDER BY t.nome
        ''')
        dados = cursor.fetchall()
    finally:
        conexao.close()
    return {'sucesso': True, 'dados': dados}

def cadastrar_turma_controller(payload: dict):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            'INSERT INTO turmas (nome, curso_id, ano_letivo, periodo_letivo) VALUES (?, ?, ?, ?)',
            (payload['nome'], payload.get('curso_id'), payload.get('ano_letivo'), payload.get('periodo_letivo'))
        )
        conexao.commit()
    finally:
        conexao.close()
    return JSONResponse(status_code=status.HTTP_201_CREATED, content={'sucesso': True, 'mensagem': 'Turma criada.'})

def remover_turma_controller(payload: dict):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute('DELETE FROM turmas WHERE id = ?', (payload['id'],))
        conexao.commit()
    finally:
        conexao.close()
    return JSONResponse(status_code=status.HTTP_200_OK, content={'sucesso': True, 'mensagem': 'Turma removida.'})