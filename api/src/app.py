import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.rotas.auth_rotas import router as auth_router
from src.rotas.lead_rotas import router as lead_router
from src.rotas.professor_rotas import router as professor_router
from src.rotas.aluno_rotas import router as aluno_router

app = FastAPI(title="Sistema de Gestão de Horários Escolares - Python")

# Configuração de CORS
origens = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origens,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/api/health")
def health_check():
    return {"sucesso": True, "mensagem": "API de gestão de horários funcionando!"}

# Registra rotas da API
app.include_router(auth_router, prefix="/api/auth")
app.include_router(lead_router, prefix="/api")
app.include_router(professor_router, prefix="/api/professor")
app.include_router(aluno_router, prefix="/api/aluno")