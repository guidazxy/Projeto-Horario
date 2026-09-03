import html
import re

def sanitizar(texto: str) -> str:
    if not texto:
        return ""
    texto_limpo = str(texto).strip()
    return html.escape(texto_limpo)

def validar_nome(nome: str, min_len: int = 3, max_len: int = 150) -> dict:
    erros = []
    nome_limpo = sanitizar(nome)
    if not nome_limpo:
        erros.append('Nome é obrigatório.')
    elif len(nome_limpo) < min_len:
        erros.append(f'Nome deve ter no mínimo {min_len} caracteres.')
    elif len(nome_limpo) > max_len:
        erros.append(f'Nome deve ter no máximo {max_len} caracteres.')
    return {'valido': len(erros) == 0, 'erros': erros, 'dados': {'nome': nome_limpo}}

def validar_carga_horaria(valor) -> dict:
    erros = []
    try:
        carga = int(valor)
        if carga < 0:
            erros.append('Carga horária deve ser um número não negativo.')
        else:
            return {'valido': True, 'erros': [], 'dados': {'carga_horaria': carga}}
    except (ValueError, TypeError):
        erros.append('Carga horária deve ser um número inteiro.')
    return {'valido': len(erros) == 0, 'erros': erros, 'dados': {}}

def validar_dia_semana(dia: str) -> dict:
    dias_validos = [' Segunda', ' Terça', ' Quarta', ' Quinta', ' Sexta', ' Sábado', ' Domingo']
    erros = []
    if not dia or dia.strip() not in dias_validos:
        erros.append(f'Dia da semana inválido. Use: {", ".join(dias_validos)}.')
    return {'valido': len(erros) == 0, 'erros': erros, 'dados': {'dia': dia.strip() if not erros else None}}

def validar_horario(hora: str) -> dict:
    erros = []
    padrao = r'^([01]\d|2[0-3]):([0-5]\d)$'
    if not re.match(padrao, hora):
        erros.append('Formato de horário inválido. Use HH:MM (24h).')
    return {'valido': len(erros) == 0, 'erros': erros, 'dados': {'hora': hora} if not erros else None}

def validar_lead(payload: dict) -> dict:
    erros = []
    
    # Validar nome_completo
    nome = payload.get('nome_completo', '')
    if not nome or not nome.strip():
        erros.append('Nome completo é obrigatório.')
    elif len(nome.strip()) < 3:
        erros.append('Nome deve ter no mínimo 3 caracteres.')
    elif len(nome.strip()) > 150:
        erros.append('Nome deve ter no máximo 150 caracteres.')
    else:
        nome_limpo = html.escape(nome.strip())
    
    # Validar email
    email = payload.get('email', '')
    import re
    padrao_email = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not email or not re.match(padrao_email, email):
        erros.append('E-mail inválido.')
    else:
        email_limpo = html.escape(email.strip())
    
    # Validar telefone_whatsapp
    telefone = payload.get('telefone_whatsapp', '')
    if not telefone:
        erros.append('Telefone WhatsApp é obrigatório.')
    else:
        telefone_limpo = re.sub(r'\D', '', telefone)
        if len(telefone_limpo) < 10 or len(telefone_limpo) > 15:
            erros.append('Telefone deve ter entre 10 e 15 dígitos com DDD.')
        else:
            telefone_limpo = telefone_limpo
    
    # Validar mensagem (opcional, máximo 500 chars)
    mensagem = payload.get('mensagem', '')
    if mensagem and len(mensagem) > 500:
        erros.append('Mensagem deve ter no máximo 500 caracteres.')
    else:
        mensagem_limpa = html.escape(mensagem) if mensagem else None
    
    if erros:
        return {'valido': False, 'erros': erros, 'dados': {}}
    
    return {
        'valido': True,
        'erros': [],
        'dados': {
            'nome_completo': nome_limpo,
            'email': email_limpo,
            'telefone_whatsapp': telefone_limpo,
            'mensagem': mensagem_limpa
        }
    }
