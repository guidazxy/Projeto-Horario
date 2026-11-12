import sqlite3
from typing import List, Optional, Any


class BaseRepositorio:
    def __init__(self, conexao: sqlite3.Connection):
        self._conexao = conexao
        self._conexao.execute("PRAGMA journal_mode = WAL")
        self._conexao.execute("PRAGMA foreign_keys = ON")

    def _executar(self, sql: str, params: tuple = None) -> None:
        if params:
            self._conexao.execute(sql, params)
        else:
            self._conexao.execute(sql)
        self._conexao.commit()

    def _query(self, sql: str, params: tuple = None) -> List[tuple]:
        if params:
            cursor = self._conexao.execute(sql, params)
        else:
            cursor = self._conexao.execute(sql)
        return cursor.fetchall()

    def _query_one(self, sql: str, params: tuple = None) -> Optional[tuple]:
        cursor = self._conexao.execute(sql, params) if params else self._conexao.execute(sql)
        return cursor.fetchone()