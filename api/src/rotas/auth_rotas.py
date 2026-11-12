from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.responses import JSONResponse
from starlette import status
from src.config.conexao_banco import obter_conexao
from src.models.entidades import Usuario
from src.utilitarios.seguranca_senha import gerar_hash, verificar_senha
import secrets
import bcrypt

router = APIRouter()

@router.post("/login")
def login(payload: dict = Body(...)):
    email = payload.get('email', '')
    senha = payload.get('senha', '')
    perfil = payload.get('perfil', '')

    if not email or not senha or not perfil:
        return JSONResponse(status_code=422, content={"erro": "Email, senha e perfil são obrigatórios"})

    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("SELECT id, nome_completo, email, senha_hash, role FROM usuarios WHERE email = ?", (email,))
        usuario = cursor.fetchone()

        if usuario and verificar_senha(senha, usuario['senha_hash']):
            # Criar sessão
            token = secrets.token_hex(32)
            cursor.execute("INSERT INTO sessoes (token, usuario_id, expira_em) VALUES (?, ?, datetime('now', '+8 hours'))", (token, usuario['id']))
            conexao.commit()
            return {"sucesso": True, "token": token, "user": {"id": usuario['id'], "nome": usuario['nome_completo'], "email": usuario['email'], "role": usuario['role']}}
        else:
            return JSONResponse(status_code=401, content={"sucesso": False, "mensagem": "Credenciais inválidas"})
    finally:
        conexao.close()

@router.post("/cadastro")
def cadastro(payload: dict = Body(...)):
    nome = payload.get('nome', '')
    email = payload.get('email', '')
    senha = payload.get('senha', '')
    role = payload.get('role', '')

    if not nome or not email or not senha or not role:
        return JSONResponse(status_code=422, content={"erro": "Preencha todos os campos"})

    # Verificar se email já existe
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("SELECT id FROM usuarios WHERE email = ?", (email,))
        if cursor.fetchone():
            return JSONResponse(status_code=409, content={"erro": "E-mail já cadastrado"})

        senha_hash = gerar_hash(senha)
        cursor.execute("INSERT INTO usuarios (nome_completo, email, senha_hash, role, ativo, criado_em) VALUES (?, ?, ?, ?, 1, datetime('now'))",
                       (nome, email, senha_hash, role))
        usuario_id = cursor.lastrowid

        # Se for aluno, também criar registro em alunos
        if role == "aluno":
            # Gerar matrícula e atribuir turma
            matricula = f"2024{usuario_id}"  # gerar sequencial
            # Obter primeira turma disponível
            cursor.execute("SELECT id FROM turmas LIMIT 1")
            turma_row = cursor.fetchone()
            turma_id = turma_row[0] if turma_row else 1
            cursor.execute("INSERT INTO alunos (usuario_id, matricula, turma_id, status_matricula) VALUES (?, ?, ?, ?)",
                           (usuario_id, matricula, turma_id, "matriculado"))

        conexao.commit()
        token = secrets.token_hex(32)
        cursor.execute("INSERT INTO sessoes (token, usuario_id, expira_em) VALUES (?, ?, datetime('now', '+8 hours'))", (token, usuario_id))
        conexao.commit()
        return {"sucesso": True, "token": token, "user": {"id": usuario_id, "nome": nome, "email": email, "role": role}}
    finally:
        conexao.close()

@router.get("/me")
def me(credentials: str = ...):  # simplificado
    # Em produção, usar Depends(HTTPBearer)
    token = credentials  # simplificado
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("SELECT id, nome_completo, email, role, ativo FROM usuarios WHERE id = (SELECT usuario_id FROM sessoes WHERE token = ?)", (token,))
        row = cursor.fetchone()
        if row:
            return {"sucesso": True, "user": {"id": row['id'], "nome": row['nome_completo'], "email": row['email'], "role": row['role']}}
        return JSONResponse(status_code=401, content={"erro": "Não autenticado"})
    finally:
        conexao.close()
    conexao.close()