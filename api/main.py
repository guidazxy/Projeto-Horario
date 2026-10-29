from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Sistema de Gestão de Horários Escolares")

# Liberar acesso para o React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos de Dados
class AlocacaoHorario(BaseModel):
    id: Optional[int] = None
    turma_id: int
    dia_semana: str
    horario: str
    disciplina: str
    professor: str
    sala: str

# Dados Iniciais (Simulação de Turmas e Horários)
turmas_db = [
    {"id": 1, "nome": "1º Ano A", "serie": "Ensino Médio", "turno": "Matutino"},
    {"id": 2, "nome": "2º Ano B", "serie": "Ensino Médio", "turno": "Matutino"},
    {"id": 3, "nome": "3º Ano C", "serie": "Ensino Médio", "turno": "Vespertino"}
]

horarios_db = [
    {"id": 1, "turma_id": 1, "dia_semana": "Segunda-feira", "horario": "07:30 - 08:20", "disciplina": "Matemática", "professor": "Prof. Carlos", "sala": "Sala 101"},
    {"id": 2, "turma_id": 1, "dia_semana": "Terça-feira", "horario": "07:30 - 08:20", "disciplina": "Português", "professor": "Profª Ana", "sala": "Sala 101"},
    {"id": 3, "turma_id": 1, "dia_semana": "Quarta-feira", "horario": "07:30 - 08:20", "disciplina": "História", "professor": "Prof. João", "sala": "Sala 101"},
    {"id": 4, "turma_id": 1, "dia_semana": "Quinta-feira", "horario": "07:30 - 08:20", "disciplina": "Biologia", "professor": "Profª Maria", "sala": "Sala 101"},
    {"id": 5, "turma_id": 1, "dia_semana": "Sexta-feira", "horario": "07:30 - 08:20", "disciplina": "Física", "professor": "Prof. Pedro", "sala": "Sala 101"}
]

@app.get("/")
def home():
    return {"status": "API de Gestão Escolar Ativa"}

@app.get("/api/turmas")
def listar_turmas():
    return turmas_db

@app.get("/api/horarios/{turma_id}")
def listar_horarios_turma(turma_id: int):
    return [h for h in horarios_db if h["turma_id"] == turma_id]

@app.post("/api/horarios", status_code=201)
def criar_horario(alocacao: AlocacaoHorario):
    # Validação Inteligente (Inovação: Evita Conflitos de Horário)
    for h in horarios_db:
        if h["professor"] == alocacao.professor and h["dia_semana"] == alocacao.dia_semana and h["horario"] == alocacao.horario:
            raise HTTPException(status_code=400, detail=f"Conflito: O professor {alocacao.professor} já tem aula neste horário!")
        if h["sala"] == alocacao.sala and h["dia_semana"] == alocacao.dia_semana and h["horario"] == alocacao.horario:
            raise HTTPException(status_code=400, detail=f"Conflito: A sala {alocacao.sala} já está ocupada!")

    alocacao.id = len(horarios_db) + 1
    horarios_db.append(alocacao.dict())
    return {"mensagem": "Horário cadastrado com sucesso!", "dados": alocacao}