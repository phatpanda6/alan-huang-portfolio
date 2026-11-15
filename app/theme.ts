// One palette for the portfolio, WebGL scene, and browser chrome.
export const palette = {
  paper: "#f5f5f7",
  white: "#ffffff",
  ink: "#18181d",
  muted: "#55555e",
  accent: "#a91e34",
  red: "#c52d45",
  steel: "#a4a8b4",
  tile: "#9297a4",
  sky: "#cbdced",
  gold: "#ffcc69",
} as const;

export const themeVars = Object.fromEntries(
  Object.entries(palette).map(([name, color]) => [`--${name}`, color]),
);

export const contactEmail = "alan.huang5@gmail.com";
