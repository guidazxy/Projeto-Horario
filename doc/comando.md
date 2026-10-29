Atue como um desenvolvedor Sênior em React 18 e i18n (Internacionalização).

Preciso adicionar um componente de seletor de idiomas no menu superior (Header) da minha aplicação React. O sistema deve traduzir APENAS o frontend dinamicamente para dois novos idiomas ao clicar em bandeirinhas:

1. Requisitos de Layout e UX:
   - Inserir um seletor discreto e elegante no menu superior contendo duas bandeiras em formato de ícone ou emoji:
     - 🇺🇸 Bandeira dos Estados Unidos (para Inglês Norte-Americano).
     - 🇪🇸 Bandeira da Espanha (para Espanhol).
   - Opcional: Adicionar um estado visual para indicar qual idioma está ativo no momento.

2. Requisitos Técnicos (Frontend Only):
   - Utilize uma biblioteca leve de i18n para React (como 'react-i18next' ou uma abordagem simples baseada em dicionários/contexto em arquivos JSON/JS locais para evitar alterações no backend/SQLite).
   - Crie um arquivo de traduções contendo as chaves para o Português (padrão), Inglês (en-US) e Espanhol (es) cobrindo os textos da interface (títulos, botões, labels de formulários e tabelas).
   - Garanta que ao clicar na bandeirinha correspondente, o estado global da linguagem mude instantaneamente e atualize os textos do frontend sem recarregar a página.

Por favor, forneça o código dos arquivos necessários (como o componente de tradução/contexto e a alteração no Header.jsx) prontos para integração.