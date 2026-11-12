from repositories.base_repositorio import BaseRepositorio
from models.entidades import Usuario, Professor, Aluno


class UsuarioRepositorio(BaseRepositorio):
    def buscar_por_email(self, email: str) -> Optional[Usuario]:
        row = self._query_one(
            "SELECT id, nome_completo, email, role, ativo, criado_em FROM usuarios WHERE email = ?",
            (email,)
        )
        if not row:
            return None
        return Usuario(id=row[0], nome_completo=row[1], email=row[2], role=row[3], ativo=bool(row[4]), criado_em=row[5])

    def buscar_por_id(self, usuario_id: int) -> Optional[Usuario]:
        row = self._query_one(
            "SELECT id, nome_completo, email, role, ativo, criado_em FROM usuarios WHERE id = ?",
            (usuario_id,)
        )
        if not row:
            return None
        return Usuario(id=row[0], nome_completo=row[1], email=row[2], role=row[3], ativo=bool(row[4]), criado_em=row[5])

    def criar(self, nome_completo: str, email: str, senha_hash: str, role: str) -> Usuario:
        cursor = self._conexao.execute(
            "INSERT INTO usuarios (nome_completo, email, senha_hash, role, ativo, criado_em) VALUES (?, ?, ?, ?, 1, datetime('now'))",
            (nome_completo, email, senha_hash, role)
        )
        uid = self._conexao.execute("SELECT last_insert_rowid()").fetchone()[0]
        return Usuario(id=uid, nome_completo=nome_completo, email=email, role=role, criado_em=datetime.now())

    def atualizar_senha(self, usuario_id: int, senha_hash: str) -> None:
        self._executar(
            "UPDATE usuarios SET senha_hash = ? WHERE id = ?",
            (senha_hash, usuario_id)
        )

    def listar_todos(self) -> List[Usuario]:
        rows = self._query("SELECT id, nome_completo, email, role, ativo, criado_em FROM usuarios")
        return [
            Usuario(id=r[0], nome_completo=r[1], email=r[2], role=r[3], ativo=bool(r[4]), criado_em=r[5])
            for r in rows
        ]

    def remover(self, usuario_id: int) -> None:
        self._executar("DELETE FROM usuarios WHERE id = ?", (usuario_id,))