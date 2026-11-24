import { Moon, Sun } from "lucide-react";
import { useI18n } from "../locales/I18nContext";
import { useTheme } from "./ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme } = useTheme();
  const { translate: t } = useI18n();
  const Icon = isDark ? Sun : Moon;
  const label = t(isDark ? "theme.lightMode" : "theme.darkMode");

  return (
    <button
      type="button"
      className={`icon-button ${className}`}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
    </button>
  );
}