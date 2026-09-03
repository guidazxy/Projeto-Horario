# Requisitos — Sistema Acadêmico de Captura de Leads

> Requisitos funcionais e não funcionais coletados e alinhados ao [`plano_projeto.md`](./plano_projeto.md) e ao [`README.md`](../README.md).

---

## Requisitos Funcionais (RF)

| Código | Requisito |
|---|---|
| RF01 | Exibir landing page com visual futurista **Dark Glassmorphism**. |
| RF02 | Capturar leads por meio de formulário reativo com máscara de telefone e validação de campos. |
| RF03 | Gravar os leads no SQLite via `POST /api/leads`. |
| RF04 | Consultar leads em tempo real via `GET /api/leads` no modal interativo (`ModalLeads.jsx`). |
| RF05 | Apresentar abas interativas com amostras de código do backend (Python/FastAPI) e frontend (React). |

## Requisitos Não Funcionais (RNF)

| Código | Requisito |
|---|---|
| RNF01 | Sanitização estrita dos dados no servidor contra ataques XSS (`html.escape`). |
| RNF02 | Alta performance com Uvicorn e ASGI (asyncio). |
| RNF03 | Banco com *Prepared Statements* e modo WAL para integridade e concorrência. |
| RNF04 | Interface responsiva e acessível em diferentes dispositivos. |

## Regras de Negócio (RN)

| Código | Regra |
|---|---|
| RN01 | `nome_completo` obrigatório, de 3 a 150 caracteres (sanitizado). |
| RN02 | `email` obrigatório e válido via regex (sanitizado). |
| RN03 | `telefone_whatsapp` obrigatório, de 10 a 15 dígitos com DDD (somente números gravados). |
| RN04 | `mensagem` opcional, no máximo 500 caracteres (sanitizada). |
| RN05 | `status_atendimento` controla o funil: `novo`, `contatado`, `convertido`, `perdido` (padrão `novo`). |