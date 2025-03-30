// Theme type definition
export type Theme = "light" | "dark";

/**
 * Gets the initial theme from localStorage or system preference
 * @returns The initial theme ('light' or 'dark')
 */
export const getInitialTheme = (): Theme => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") return "light";

  const savedTheme = localStorage.getItem("theme") as Theme | null;
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

/**
 * Sets the theme in localStorage and updates DOM
 * @param theme The theme to set ('light' or 'dark')
 */
export const setTheme = (theme: Theme): void => {
  localStorage.setItem("theme", theme);
  document.documentElement.classList.toggle("dark", theme === "dark");

  const themeToggle = document.getElementById("themeToggle");
  themeToggle?.classList.toggle("theme-toggle--toggled", theme === "light");
};

/**
 * Initializes the theme from localStorage or system preference
 */
export const initializeTheme = (): void => {
  const savedTheme = localStorage.getItem("theme") as Theme | null;
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setTheme(prefersDark ? "dark" : "light");
  }
};

/**
 * Sets up the theme toggle functionality
 */
export const setupThemeToggle = (): void => {
  // Initialize theme
  initializeTheme();

  // Create audio elements for theme toggle sounds
  const lightToAudio = new Audio("/sounds/light-dark-toggle.mp3");
  const darkToAudio = new Audio("/sounds/light-dark-toggle.mp3");

  // Set default properties for audio elements
  for (const audio of [lightToAudio, darkToAudio]) {
    audio.volume = 0.4;
    audio.preload = "auto";
  }

  // Get theme toggle button
  const themeToggle = document.getElementById("themeToggle");

  // Toggle theme when button is clicked
  themeToggle?.addEventListener("click", () => {
    const currentTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    const soundEnabled = localStorage.getItem("soundEnabled") !== "false";

    if (soundEnabled) {
      const audio = newTheme === "light" ? lightToAudio : darkToAudio;
      audio.play().catch((e) => console.warn("Audio playback failed:", e));
    }

    setTheme(newTheme);
  });

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    });
};
