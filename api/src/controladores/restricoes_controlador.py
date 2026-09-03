from fastapi import Response, status, Request
from fastapi.responses import JSONResponse
from ..config.conexao_banco import obter_conexao

def listar_restricoes_controller():
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute('SELECT id, tipo, descricao, valor, ativa FROM restriccoes ORDER BY tipo, descricao')
        dados = cursor.fetchall()
    finally:
        conexao.close()
    return {'sucesso': True, 'dados': dados}

def cadastrar_restricao_controller(payload: dict):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            'INSERT INTO restriccoes (tipo, descricao, valor, ativa) VALUES (?, ?, ?, ?)',
            (payload['tipo'], payload['descricao'], payload.get('valor'), payload.get('ativa', 1))
        )
        conexao.commit()
    finally:
        conexao.close()
    return JSONResponse(status_code=status.HTTP_201_CREATED, content={'sucesso': True, 'mensagem': 'Restrição criada.'})

def remover_restricao_controller(payload: dict):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute('DELETE FROM restriccoes WHERE id = ?', (payload['id'],))
        conexao.commit()
    finally:
        conexao.close()
    return JSONResponse(status_code=status.HTTP_200_OK, content={'sucesso': True, 'mensagem': 'Restrição removida.'})