from fastapi import APIRouter, Request, Body
from fastapi.responses import JSONResponse
from ..config.conexao_banco import obter_conexao
import sqlite3

router = APIRouter()

USUARIO_PADRAO_EMAIL = 'admin@escola.edu'
USUARIO_PADRAO_SENHA = 'admin123'

@router.post("/login")
def login_rota(payload: dict = Body(...)):
    email = payload.get('email', '')
    senha = payload.get('senha', '')
    perfil = payload.get('perfil', '')

    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            'SELECT id, nome_completo, email FROM professores WHERE email = ? AND senha = ?',
            (email, senha)
        )
        usuario = cursor.fetchone()
        
        if usuario:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={'sucesso': True, 'perfil': 'funcionario', 'nome': usuario[1]}
            )
        
        return JSONResponse(
            status_code=status.HTTP_401_UNPROCESSABLE_ENTITY,
            content={'sucesso': False, 'mensagem': 'Credenciais inválidas'}
        )
    finally:
        conexao.close()

@router.get("/status")
def status_rota():
    conexao = obter_conexao()
    try:
        # Retorna status básico - em produção haveria sessão/token
        return {'sucesso': True, 'autenticado': True, 'perfil': 'funcionario'}
    finally:
        conexao.close()

@router.get("/status")
def status_rota():
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        # Retorna status básico - em produção haveria sessão/token
        return {'sucesso': True, 'autenticado': True, 'perfil': 'funcionario'}
    finally:
        conexao.close()