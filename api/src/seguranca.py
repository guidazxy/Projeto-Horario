from fastapi import APIRouter, Body, Depends, Path, Query
from fastapi.responses import JSONResponse
from starlette import status
from repositories.base_repositorio import BaseRepositorio
from repositories.usuario_repositorio import UsuarioRepositorio
from repositories.academico_repositorio import AcademicoRepositorio
from models.entidades import Usuario, Professor, Aluno, Curso, Turma, Disciplina, Aula, Frequencia, Nota
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional
import sqlite3

router = APIRouter()
security = HTTPBearer()

def obter_repositorio(conexao: sqlite3.Connection = Depends(lambda: None)):
    """Depends para injetar repositórios - será conectado na rota"""
    pass

def get_usuario_atual(credentials: HTTPAuthorizationCredentials = Depends(security),
                      repositorio: UsuarioRepositorio = ...):
    """Dependency: verifica token e retorna usuário"""
    token = credentials.credentials
    # Busca sessão
    sessao = repositorio._query_one("SELECT usuario_id, expira_em FROM sessoes WHERE token = ?", (token,))
    if not sessao:
        from fastapi.responses import JSONResponse
        return JSONResponse(status_code=401, content={"erro": "Token inválido ou expirado"})
    # Verifica expiração (formato texto datetime)
    from datetime import datetime
    if datetime.now().strftime("%Y-%m-%d %H:%M:%S") > sessao[1]:
        # Expirado, remover sessão
        repositorio._executar("DELETE FROM sessoes WHERE token = ?", (token,))
        return JSONResponse(status_code=401, content={"erro": "Sessão expirada"})
    usuario = repositorio.buscar_por_id(sessao[0])
    if not usuario or not usuario.ativo:
        return JSONResponse(status_code=401, content={"erro": "Usuário inativo"})
    return usuario

def exigir_professor(usuario: Usuario = ...):
    if usuario.role != "professor":
        from fastapi.responses import JSONResponse
        return JSONResponse(status_code=403, content={"erro": "Acesso apenas para professores"})
    return usuario

def exigir_aluno(usuario: Usuario = ...):
    if usuario.role != "aluno":
        from fastapi.responses import JSONResponse
        return JSONResponse(status_code=403, content={"erro": "Acesso apenas para alunos"})
    return usuario