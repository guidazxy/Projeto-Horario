from fastapi import APIRouter, Body
from fastapi.responses import JSONResponse
from starlette import status
from ..config.conexao_banco import obter_conexao

router = APIRouter()

@router.post("/login")
def login_rota(payload: dict = Body(...)):
    email = payload.get('email', '')
    senha = payload.get('senha', '')
    perfil = payload.get('perfil', '')

    if not email or not senha or not perfil:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={'sucesso': False, 'mensagem': 'Email, senha e perfil são obrigatórios'}
        )

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
                content={'sucesso': True, 'perfil': perfil, 'nome': usuario['nome_completo']}
            )

        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={'sucesso': False, 'mensagem': 'Credenciais inválidas'}
        )
    finally:
        conexao.close()

@router.get("/status")
def status_rota():
    return {'sucesso': True, 'autenticado': False, 'perfil': None}
