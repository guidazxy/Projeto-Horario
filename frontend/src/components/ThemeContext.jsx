import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    html.style.colorScheme = isDark ? "dark" : "light";
  }, [isDark]);

  useEffect(() => {
    if (localStorage.getItem("theme")) return undefined;

    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = (event) => setIsDark(event.matches);
    preference.addEventListener("change", updateTheme);
    return () => preference.removeEventListener("change", updateTheme);
  }, []);

  const toggleTheme = () => {
    setIsDark((previous) => {
      const next = !previous;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

export const useTheme = () => useContext(ThemeContext);
