from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any
from datetime import datetime


@dataclass
class Usuario:
    id: int
    nome_completo: str
    email: str
    role: str  # 'professor' ou 'aluno'
    ativo: bool = True
    criado_em: datetime = field(default_factory=datetime.now)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "nome_completo": self.nome_completo,
            "email": self.email,
            "role": self.role,
            "ativo": self.ativo,
            "criado_em": self.criado_em.isoformat()
        }


@dataclass
class Professor(Usuario):
    titulacao: Optional[str] = None
    disciplina_favorita: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        base = super().to_dict()
        base["titulacao"] = self.titulacao
        base["disciplina_favorita"] = self.disciplina_favorita
        return base


@dataclass
class Aluno(Usuario):
    matricula: str = ""
    turma_id: int = 0
    status_matricula: str = "matriculado"
    turma_nome: str = ""

    def to_dict(self) -> Dict[str, Any]:
        base = super().to_dict()
        base["matricula"] = self.matricula
        base["turma_id"] = self.turma_id
        base["status_matricula"] = self.status_matricula
        base["turma_nome"] = self.turma_nome
        return base


@dataclass
class Curso:
    id: int
    nome: str
    descricao: Optional[str] = None

    @staticmethod
    def from_db_row(row) -> "Curso":
        return Curso(id=row[0], nome=row[1], descricao=row[2])


@dataclass
class Turma:
    id: int
    nome: str
    curso_id: int
    ano_letivo: str
    periodo_letivo: str
    curso_nome: str = ""

    @staticmethod
    def from_db_row(row) -> "Turma":
        return Turma(
            id=row[0], nome=row[1], curso_id=row[2],
            ano_letivo=row[3], periodo_letivo=row[4],
            curso_nome=row[5] if len(row) > 5 else ""
        )


@dataclass
class Disciplina:
    id: int
    nome: str
    carga_horaria_semanal: int = 0
    descricao: Optional[str] = None

    @staticmethod
    def from_db_row(row) -> "Disciplina":
        return Disciplina(id=row[0], nome=row[1], carga_horaria_semanal=row[2], descricao=row[3])


@dataclass
class Aula:
    id: int
    turma_materia_id: int
    data: str  # YYYY-MM-DD
    quantidade_aulas: int = 1
    conteudo: Optional[str] = None
    observacoes: Optional[str] = None
    criado_em: datetime = field(default_factory=datetime.now)

    @staticmethod
    def from_db_row(row) -> "Aula":
        return Aula(
            id=row[0], turma_materia_id=row[1], data=row[2],
            quantidade_aulas=row[3] if row[3] else 1,
            conteudo=row[4], observacoes=row[5],
            criado_em=row[6] if row[6] else datetime.now()
        )


@dataclass
class Frequencia:
    id: int
    aula_id: int
    aluno_id: int
    status: str  # 'P', 'F', 'FJ'
    justificativa: Optional[str] = None
    criado_em: datetime = field(default_factory=datetime.now)

    @staticmethod
    def from_db_row(row) -> "Frequencia":
        return Frequencia(
            id=row[0], aula_id=row[1], aluno_id=row[2],
            status=row[3], justificativa=row[4],
            criado_em=row[5] if row[5] else datetime.now()
        )


@dataclass
class Nota:
    id: int
    aluno_id: int
    turma_materia_id: int
    bimestre: int  # 1-4
    tipo: str  # 'prova', 'trabalho', 'seminario', 'recuperacao'
    descricao: Optional[str] = None
    valor: Optional[float] = None
    criado_em: datetime = field(default_factory=datetime.now)

    @staticmethod
    def from_db_row(row) -> "Nota":
        return Nota(
            id=row[0], aluno_id=row[1], turma_materia_id=row[2],
            bimestre=row[3], tipo=row[4], descricao=row[5],
            valor=row[6], criado_em=row[7] if row[7] else datetime.now()
        )

    @property
    def situacao(self) -> str:
        """Determina situação do aluno baseada na nota."""
        if self.valor is None:
            return "Não lançado"
        if self.valor >= 7.0:
            return "Aprovado"
        if self.valor >= 4.0:
            return "Em Exame/Recuperação"
        return "Reprovado"