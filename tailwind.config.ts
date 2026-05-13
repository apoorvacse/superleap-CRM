import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Custom Superleap palette
        surface: {
          DEFAULT: "#111118",
          raised: "#1A1A24",
          hover: "#1E1E2A",
        },
        border: {
          DEFAULT: "#2A2A38",
          subtle: "rgba(255, 255, 255, 0.06)",
        },
        accent: {
          DEFAULT: "#6366F1",
          hover: "#818CF8",
          muted: "rgba(99, 102, 241, 0.15)",
        },
        success: {
          DEFAULT: "#10B981",
          muted: "rgba(16, 185, 129, 0.15)",
        },
        warning: {
          DEFAULT: "#F59E0B",
          muted: "rgba(245, 158, 11, 0.15)",
        },
        danger: {
          DEFAULT: "#EF4444",
          muted: "rgba(239, 68, 68, 0.15)",
        },
        text: {
          primary: "#F1F5F9",
          secondary: "#94A3B8",
          muted: "#64748B",
          inverse: "#0A0A0F",
        },
        status: {
          new: "#3B82F6",
          "new-bg": "rgba(59, 130, 246, 0.12)",
          contacted: "#F59E0B",
          "contacted-bg": "rgba(245, 158, 11, 0.12)",
          qualified: "#A855F7",
          "qualified-bg": "rgba(168, 85, 247, 0.12)",
          converted: "#10B981",
          "converted-bg": "rgba(16, 185, 129, 0.12)",
          lost: "#EF4444",
          "lost-bg": "rgba(239, 68, 68, 0.12)",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      animation: {
        "skeleton-pulse": "skeleton-pulse 2s ease-in-out infinite",
        "modal-in": "modal-in 200ms ease-out",
        "modal-out": "modal-out 150ms ease-in",
        "slide-up": "slide-up 300ms ease-out",
        "fade-in": "fade-in 200ms ease-out",
        "badge-pulse": "badge-pulse 600ms ease-in-out",
        "row-lift": "row-lift 150ms ease",
      },
      keyframes: {
        "skeleton-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "modal-in": {
          "0%": { opacity: "0", transform: "scale(0.95) translateY(8px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "modal-out": {
          "0%": { opacity: "1", transform: "scale(1) translateY(0)" },
          "100%": { opacity: "0", transform: "scale(0.95) translateY(8px)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "badge-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "row-lift": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-1px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
export default config;
