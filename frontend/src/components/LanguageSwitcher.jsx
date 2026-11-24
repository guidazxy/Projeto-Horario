import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Languages } from "lucide-react";
import { useI18n } from "../locales/I18nContext";

const languages = [
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇬🇧" },
];

export default function LanguageSwitcher({ className = "" }) {
  const { locale, setLocale, translate } = useI18n();
  const [open, setOpen] = useState(false);
  const switcherRef = useRef(null);
  const currentLanguage = languages.find((language) => language.code === locale) || languages[0];

  useEffect(() => {
    if (!open) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!switcherRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const changeLanguage = (code) => {
    setLocale(code);
    setOpen(false);
  };

  return (
    <div className={`language-switcher ${className}`} ref={switcherRef}>
      <button
        type="button"
        className="icon-button language-trigger"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-label={`${translate("language.label")}: ${translate(`language.${locale}`)}`}
        aria-haspopup="menu"
        aria-expanded={open}
        title={`${translate("language.label")}: ${translate(`language.${locale}`)}`}
      >
        <Languages aria-hidden="true" size={17} strokeWidth={1.8} />
        <span className="language-code">{currentLanguage.code.toUpperCase()}</span>
        <ChevronDown aria-hidden="true" className="language-chevron" size={12} />
      </button>

      {open && (
        <div className="language-menu" role="menu" aria-label={translate("language.label")}>
          <span className="language-menu-title">{translate("language.label")}</span>
          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              className={`language-option${language.code === locale ? " is-selected" : ""}`}
              onClick={() => changeLanguage(language.code)}
              role="menuitemradio"
              aria-checked={language.code === locale}
            >
              <span className="language-flag" aria-hidden="true">{language.flag}</span>
              <span>{language.name}</span>
              {language.code === locale && <Check aria-hidden="true" className="language-check" size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}