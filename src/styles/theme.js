const base = {
  cardRadius: 16,
  purpleGradient: "linear-gradient(135deg, #F0C040 0%, #B8860B 100%)",
  purpleGradientDeep: "linear-gradient(135deg, #D4A017 0%, #7A5C00 100%)",
  purpleGlow: "0 0 20px rgba(201,162,39,0.5), 0 0 40px rgba(201,162,39,0.2)",
  purpleGlowSm: "0 0 12px rgba(201,162,39,0.45)",
  btnPrimaryShadow: "0 0 18px rgba(201,162,39,0.4), 0 4px 12px rgba(100,70,0,0.2)",
  gold: "#B8860B",
  goldBg: "rgba(184,134,11,0.1)",
  goldBorder: "rgba(184,134,11,0.3)",
  success: "#047857",
  successBg: "rgba(4,120,87,0.1)",
  successBorder: "rgba(4,120,87,0.3)",
  danger: "#B91C1C",
  dangerBg: "rgba(185,28,28,0.1)",
  dangerBorder: "rgba(185,28,28,0.3)",
  purple: "#B8860B",
  purpleVibrant: "#D4A017",
  purpleDeep: "#8B6914",
  purpleMid: "#C9A227",
  fontDisplay: "'Playfair Display', 'Plus Jakarta Sans', serif",
  fontBody: "'Inter', system-ui, sans-serif",
  sessionTypes: {
    learn: {
      label: "Learn", icon: "🎓",
      badge:   "#C9A227",
      bg:      "rgba(201,162,39,0.12)",
      border:  "rgba(201,162,39,0.35)",
      glow:    "rgba(201,162,39,0.3)",
      cardBg:  "#FFFFFF",
      panelBg: "#F5F5F5",
    },
    teach: {
      label: "Teach", icon: "📖",
      badge:   "#B91C1C",
      bg:      "rgba(185,28,28,0.09)",
      border:  "rgba(185,28,28,0.28)",
      glow:    "rgba(185,28,28,0.3)",
      cardBg:  "#FFFFFF",
      panelBg: "#F5F5F5",
    },
    collab: {
      label: "Collab", icon: "🤝",
      badge:   "#D97706",
      bg:      "rgba(217,119,6,0.1)",
      border:  "rgba(217,119,6,0.3)",
      glow:    "rgba(217,119,6,0.3)",
      cardBg:  "#FFFFFF",
      panelBg: "#F5F5F5",
    },
  },
};

const light = {
  ...base,
  desktopBg: "#E8D5A3",
  appBg: "#FBF5E6",
  card: "#FFFFFF",
  cardElevated: "#FFF8EC",
  cardBorder: "rgba(180,140,40,0.28)",
  cardBorderBright: "rgba(180,140,40,0.6)",
  cardShadow: "0 0 0 1px rgba(180,140,40,0.2), 0 4px 24px rgba(100,70,0,0.1), 0 1px 4px rgba(100,70,0,0.08)",
  cardGlow: "0 0 0 1px rgba(180,140,40,0.45), 0 0 20px rgba(180,140,40,0.15), 0 4px 24px rgba(100,70,0,0.12)",
  text: "#1A1209",
  textMid: "#5C4020",
  muted: "#9C8060",
  border: "rgba(180,140,40,0.2)",
  surface: "#F5ECD4",
  surfaceHover: "#EDE0BC",
  headerBg: "rgba(251,245,230,0.96)",
  purpleLight: "rgba(201,162,39,0.14)",
  purpleFaint: "rgba(201,162,39,0.07)",
};

const dark = {
  ...base,
  desktopBg: "#0D0A05",
  appBg: "#1A1209",
  card: "#2A1F10",
  cardElevated: "#130E05",
  sessionTypes: {
    learn: {
      label: "Learn", icon: "🎓",
      badge:   "#F0C040",
      bg:      "rgba(240,192,64,0.18)",
      border:  "rgba(240,192,64,0.4)",
      glow:    "rgba(240,192,64,0.3)",
    },
    teach: {
      label: "Teach", icon: "📖",
      badge:   "#F87171",
      bg:      "rgba(248,113,113,0.18)",
      border:  "rgba(248,113,113,0.4)",
      glow:    "rgba(248,113,113,0.3)",
    },
    collab: {
      label: "Collab", icon: "🤝",
      badge:   "#FBBF24",
      bg:      "rgba(251,191,36,0.18)",
      border:  "rgba(251,191,36,0.4)",
      glow:    "rgba(251,191,36,0.3)",
    },
  },
  // Semantic overrides for dark mode
  success: "#34D399",
  successBg: "rgba(52,211,153,0.15)",
  successBorder: "rgba(52,211,153,0.35)",
  danger: "#F87171",
  dangerBg: "rgba(248,113,113,0.15)",
  dangerBorder: "rgba(248,113,113,0.35)",
  gold: "#F0C040",
  goldBg: "rgba(240,192,64,0.15)",
  goldBorder: "rgba(240,192,64,0.35)",
  cardBorder: "rgba(180,140,40,0.22)",
  cardBorderBright: "rgba(180,140,40,0.5)",
  cardShadow: "0 0 0 1px rgba(180,140,40,0.15), 0 4px 24px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)",
  cardGlow: "0 0 0 1px rgba(180,140,40,0.4), 0 0 20px rgba(180,140,40,0.12), 0 4px 24px rgba(0,0,0,0.3)",
  text: "#F5ECD4",
  textMid: "#C9A870",
  muted: "#7A6040",
  border: "rgba(180,140,40,0.18)",
  surface: "#2A1F10",
  surfaceHover: "#352810",
  headerBg: "rgba(26,18,9,0.96)",
  purpleLight: "rgba(201,162,39,0.18)",
  purpleFaint: "rgba(201,162,39,0.1)",
};

let _current = light;

export function setDarkMode(isDark) {
  _current = isDark ? dark : light;
}

export const T = new Proxy({}, {
  get(_, key) {
    const val = _current[key];
    // sessionTypes is a nested object — return a Proxy too so T.sessionTypes.learn.badge works
    if (key === "sessionTypes") {
      return new Proxy({}, {
        get(__, type) {
          return _current.sessionTypes[type];
        }
      });
    }
    return val;
  }
});
