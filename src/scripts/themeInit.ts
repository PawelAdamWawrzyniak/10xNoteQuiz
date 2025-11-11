/**
 * Theme initialization script
 * Prevents flash of unstyled content (FOUC) by applying theme before page render
 * This script must be inlined and run synchronously in the <head>
 */

export const themeInitScript = `
  const getThemePreference = () => {
    if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
      return localStorage.getItem("theme");
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };
  const isDark = getThemePreference() === "dark";
  document.documentElement.classList[isDark ? "add" : "remove"]("dark");
`;
