# 🎨 Plano de Reestruturação de UI/UX — Sistema de Gestão Escolar

## 1. Visão Geral do Redesign
Este plano detalha a reformulação da interface do **Sistema de Gestão de Horários Escolares** (IFMT - Campus Barra do Garças). O objetivo é substituir o esquema de cores antigo por uma paleta vibrante baseada em **Amarelo Manteiga (*Butter Yellow*)** e **Azul**, com suporte completo a **Modo Claro (Light Mode)** e **Modo Escuro (Dark Mode)**, além de micro-interações que aumentam o engajamento e o tempo de permanência do usuário no sistema.

---

## 2. Paleta de Cores e Identidade Visual

### 🎨 Amarelo Manteiga & Azul
A combinação une a energia e acolhimento do amarelo manteiga com a confiabilidade e profissionalismo do azul institucional.

| Elemento | Modo Light (Claro) | Modo Dark (Escuro) | Função no Design |
| :--- | :--- | :--- | :--- |
| **Fundo Principal** | `#FAFAFC` (Off-white neutro) | `#0F172A` (Slate escuro) | Base de contraste confortável para a leitura |
| **Superfície / Cards** | `#FFFFFF` (Branco puro) | `#1E293B` (Slate médio com glassmorphism) | Elevação visual para separar conteúdos |
| **Primária (Ações/Botões)** | `#2563EB` (Azul Royal) | `#38BDF8` (Azul Ciano Vibrante) | Destaque para chamadas de ação (CTAs) |
| **Secundária / Destaque** | `#FEF08A` (Amarelo Manteiga) | `#FDE047` (Amarelo Manteiga Pastel) | Destaque de avisos, badges de turmas e horários |
| **Texto Principal** | `#0F172A` (Slate escuro) | `#F8FAFC` (Branco neve) | Legibilidade máxima alinhada a diretrizes WCAG AAA |
| **Bordas & Divisores** | `#E2E8F0` (Cinza claro) | `#334155` (Slate translúcido) | Definição sutil de componentes |

---

## 3. Módulo Dual Theme (Light & Dark Mode)

### 3.1 Mecanismo de Funcionamento
1. **Ativação via Tailwind CSS:** Configuração da propriedade `darkMode: 'class'` no arquivo `tailwind.config.js`.
2. **Estado Global e Persistência:**
   - Gerenciamento de estado em React via `useState` e `useEffect`.
   - Persistência da preferência do usuário no `localStorage` (`theme: 'light'` ou `theme: 'dark'`).
   - Sincronização automática com as preferências do sistema operacional (`prefers-color-scheme`).
3. **Componente Alternador (`ThemeToggle`):**
   - Botão no cabeçalho com transição fluida entre o ícone de **Sol** ☀️ e **Lua** 🌙 com animação de rotação (`rotate-180 transition-transform duration-500`).

---

## 4. Tipografia, Botões e Micro-interações

### 🔤 Tipografia
- **Títulos e Interface:** *Plus Jakarta Sans* (moderna, limpa, transmite profissionalismo).
- **Dados, Horários e Código:** *Fira Code* (estética técnica para visualização rápida da grade horária).

### 🔘 Sistema de Botões Redesenhado
- **Botão Primário (Ação Principal):** Fundo Azul com brilho e efeito *hover* em elevação (`hover:-translate-y-0.5 shadow-md shadow-blue-500/20`).
- **Botão Secundário / Destaque:** Fundo Amarelo Manteiga com texto escuro para ações secundárias ou destaques de filtros.
- **Efeitos de Foco:** Anel de foco duplo com borda Azul/Amarelo (`focus:ring-2 focus:ring-amber-300`).

---

## 5. Estratégias de Engajamento e Retenção do Usuário (UX)

Para manter o usuário engajado por mais tempo na plataforma:

1. **Barra de Pesquisa Dinâmica com Feedback Visual:**
   - Filtro instantâneo em tempo real para professores, matérias e salas, com animação de entrada dos cards filtrados.
2. **Cards Informativos Reativos:**
   - Efeito *Glassmorphism* em cards de turmas e métricas no modo Dark (`backdrop-blur-md bg-slate-800/60`).
   - Destaque em Amarelo Manteiga ao passar o mouse sobre as aulas alocadas na tabela semanal.
3. **Indicador de Conexão com API ao Vivo:**
   - Pequeno indicador no cabeçalho com pulso animado (`animate-ping`) mostrando que os dados estão sincronizados em tempo real com o banco de dados.
4. **Animações de Transição de Grade:**
   - Alternância suave de turmas (1º ao 3º ano de Informática, Agropecuária e Administração - turmas A e B) sem recarregamento da página.

---

## 6. Roteiro de Implementação no Código

### Passo 1: Configuração das Cores no `tailwind.config.js`
```javascript
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        butter: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a', // Amarelo Manteiga Primário
          300: '#fde047',
        },
        brandBlue: {
          500: '#2563eb',
          600: '#1d4ed8',
          900: '#0f172a',
        }
      }
    }
  }
}
```

### Passo 2: Implementação do Alternador no React (`App.jsx`)
```jsx
const [tema, setTema] = useState(localStorage.getItem('theme') || 'dark');

useEffect(() => {
  const root = window.document.documentElement;
  if (tema === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  localStorage.setItem('theme', tema);
}, [tema]);

const alternarTema = () => {
  setTema(tema === 'dark' ? 'light' : 'dark');
};
```

### Passo 3: Aplicação dos Estilos nos Cards de Grade
- Modo Claro: `bg-white border-slate-200 text-slate-900 hover:bg-yellow-50`
- Modo Escuro: `dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-amber-400/10`