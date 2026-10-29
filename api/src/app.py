import os
from pathlib import Path
from fastapi import FastAPI, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

# Carrega variáveis de ambiente do arquivo .env da pasta api
caminho_env = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=caminho_env)

from src.rotas.auth_rotas import router as auth_router
from src.rotas.lead_rotas import router as lead_router

app = FastAPI(title="Sistema de Gestão de Horários Escolares - Python")

# Configuração de CORS
origem_permitida = os.getenv("ORIGEM_PERMITIDA", "*")
origens = [origem_permitida] if origem_permitida != "*" else ["*"]

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