import React, { createContext, useContext, useState, useEffect } from 'react';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Default to Warm Linen & Alabaster White Mode, or load from localStorage
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('queueflow_theme');
    return saved ? saved : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
      document.body.classList.remove('dark');
    }
    localStorage.setItem('queueflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return { theme: 'light', toggleTheme: () => {}, isDark: false };
  }
  return context;
};
