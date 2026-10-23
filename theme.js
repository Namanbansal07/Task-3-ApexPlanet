const THEME_KEY = "skillspark-theme";

export function initTheme() {
  const toggle = document.querySelector(".theme-toggle");
  const root = document.documentElement;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (!toggle) return;

  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem(THEME_KEY);
  } catch (error) {
    console.warn("SkillSpark could not read the saved theme; using the system preference.", error);
  }
  const initialTheme = savedTheme === "dark" || savedTheme === "light"
    ? savedTheme
    : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const isDark = theme === "dark";
    if (themeColor) themeColor.content = isDark ? "#101827" : "#f5f7fb";
    toggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    toggle.title = isDark ? "Switch to light theme" : "Switch to dark theme";
    const icon = toggle.querySelector(".theme-icon");
    if (icon) icon.textContent = isDark ? "☀" : "☾";
  }

  applyTheme(initialTheme);
  toggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try {
      localStorage.setItem(THEME_KEY, nextTheme);
    } catch (error) {
      console.warn("SkillSpark could not save the theme preference.", error);
    }
  });
}
