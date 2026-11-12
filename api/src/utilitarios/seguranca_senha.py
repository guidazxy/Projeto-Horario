import bcrypt


def gerar_hash(senha: str) -> str:
    return bcrypt.hashpw(senha.encode(), bcrypt.gensalt()).decode()


def verificar_senha(senha: str, hash_armazenado: str) -> bool:
    return bcrypt.checkpw(senha.encode(), hash_armazenado.encode())


def verificar_senha_ou_erro(senha: str, hash_armazenado: str) -> str:
    if verificar_senha(senha, hash_armazenado):
        return "sucesso"
    return "erro"


__all__ = ["gerar_hash", "verificar_senha", "verificar_senha_ou_erro"]