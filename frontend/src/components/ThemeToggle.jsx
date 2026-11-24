import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme } = useTheme();
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      className={`icon-button ${className}`}
      onClick={toggleTheme}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      title={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
    </button>
  );
}