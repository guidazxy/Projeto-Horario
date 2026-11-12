from repositories.base_repositorio import BaseRepositorio
from models.entidades import Curso, Turma, Disciplina, Aluno


class AcademicoRepositorio(BaseRepositorio):
    def listar_cursos(self) -> List[Curso]:
        rows = self._query("SELECT id, nome, descricao FROM cursos ORDER BY nome")
        return [Curso.from_db_row(r) for r in rows]

    def listar_turmas(self, curso_id: int = None) -> List[Turma]:
        if curso_id:
            rows = self._query(
                "SELECT t.id, t.nome, t.curso_id, t.ano_letivo, t.periodo_letivo, c.nome "
                "FROM turmas t LEFT JOIN cursos c ON t.curso_id = c.id WHERE t.curso_id = ? ORDER BY t.nome",
                (curso_id,)
            )
        else:
            rows = self._query(
                "SELECT t.id, t.nome, t.curso_id, t.ano_letivo, t.periodo_letivo, c.nome "
                "FROM turmas t LEFT JOIN cursos c ON t.curso_id = c.id ORDER BY t.nome"
            )
        return [Turma.from_db_row(r) for r in rows]

    def listar_disciplinas(self) -> List[Disciplina]:
        rows = self._query("SELECT id, nome, carga_horaria_semanal, descricao FROM materias ORDER BY nome")
        return [Disciplina.from_db_row(r) for r in rows]

    def listar_alunos_por_turma(self, turma_id: int) -> List[Dict[str, Any]]:
        rows = self._query(
            "SELECT a.id, u.nome_completo, a.matricula, a.status_matricula, u.role "
            "FROM alunos a "
            "JOIN usuarios u ON a.usuario_id = u.id "
            "WHERE a.turma_id = ? ORDER BY u.nome_completo",
            (turma_id,)
        )
        return [
            {
                "id": r[0], "nome": r[1], "matricula": r[2],
                "status": r[3], "role": r[4]
            }
            for r in rows
        ]

    def listar_turma_materia(self, turma_id: int) -> List[Dict[str, Any]]:
        rows = self._query(
            "SELECT tm.id, m.nome as materia_nome, p.nome_completo as professor_nome "
            "FROM turma_materia tm "
            "JOIN materias m ON tm.materia_id = m.id "
            "LEFT JOIN professores p ON tm.professor_id = p.id "
            "WHERE tm.turma_id = ? ORDER BY m.nome",
            (turma_id,)
        )
        return [
            {"id": r[0], "materia": r[1], "professor": r[2]}
            for r in rows
        ]