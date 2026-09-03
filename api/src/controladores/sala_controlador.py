from fastapi import Response, status, Request
from fastapi.responses import JSONResponse
from ..config.conexao_banco import obter_conexao

def listar_salas_controller():
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute('SELECT id, nome, capacidade, tipo FROM salas ORDER BY nome')
        dados = cursor.fetchall()
    finally:
        conexao.close()
    return {'sucesso': True, 'dados': dados}

def cadastrar_sala_controller(payload: dict):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            'INSERT INTO salas (nome, capacidade, tipo) VALUES (?, ?, ?)',
            (payload['nome'], payload.get('capacidade'), payload.get('tipo'))
        )
        conexao.commit()
    finally:
        conexao.close()
    return JSONResponse(status_code=status.HTTP_201_CREATED, content={'sucesso': True, 'mensagem': 'Sala/laboratório criado.'})

def remover_sala_controller(payload: dict):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute('DELETE FROM salas WHERE id = ?', (payload['id'],))
        conexao.commit()
    finally:
        conexao.close()
    return JSONResponse(status_code=status.HTTP_200_OK, content={'sucesso': True, 'mensagem': 'Sala removida.'})

def listar_horarios_controller():
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute('SELECT id, dia_semana, hora_inicio, hora_fim FROM horarios ORDER BY dia_semana, hora_inicio')
        dados = cursor.fetchall()
    finally:
        conexao.close()
    return {'sucesso': True, 'dados': dados}

def cadastrar_horario_controller(payload: dict):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            'INSERT INTO horarios (dia_semana, hora_inicio, hora_fim) VALUES (?, ?, ?)',
            (payload['dia_semana'], payload['hora_inicio'], payload['hora_fim'])
        )
        conexao.commit()
    finally:
        conexao.close()
    return JSONResponse(status_code=status.HTTP_201_CREATED, content={'sucesso': True, 'mensagem': 'Horário/Slot criado.'})

def remover_horario_controller(payload: dict):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute('DELETE FROM horarios WHERE id = ?', (payload['id'],))
        conexao.commit()
    finally:
        conexao.close()
    return JSONResponse(status_code=status.HTTP_200_OK, content={'sucesso': True, 'mensagem': 'Horário removido.'})