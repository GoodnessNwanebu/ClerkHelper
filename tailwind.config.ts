import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Medical theme colors
        medical: {
          primary: "#2563eb", // Blue - professional medical color
          secondary: "#64748b", // Slate - neutral
          success: "#16a34a", // Green
          warning: "#ea580c", // Orange
          danger: "#dc2626", // Red
        },
        // Theme-aware colors using CSS variables
        'theme-bg': {
          DEFAULT: 'rgb(var(--background))',
          secondary: 'rgb(var(--background-secondary))',
          tertiary: 'rgb(var(--background-tertiary))',
        },
        'theme-fg': {
          DEFAULT: 'rgb(var(--foreground))',
          secondary: 'rgb(var(--foreground-secondary))',
          muted: 'rgb(var(--foreground-muted))',
        },
        'theme-border': {
          DEFAULT: 'rgb(var(--border))',
          secondary: 'rgb(var(--border-secondary))',
        },
        'theme-accent': {
          DEFAULT: 'rgb(var(--accent))',
          secondary: 'rgb(var(--accent-secondary))',
        },
        'theme-glass': {
          bg: 'rgb(var(--glass-bg))',
          border: 'rgb(var(--glass-border))',
        },
        'theme-bg-secondary': 'rgb(241 245 249)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Text', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'fluid-xs': 'clamp(0.625rem, 2.5vw, 0.75rem)',
        'fluid-sm': 'clamp(0.75rem, 3vw, 0.875rem)',
        'fluid-base': 'clamp(0.875rem, 4vw, 1rem)',
        'fluid-lg': 'clamp(1rem, 4vw, 1.125rem)',
        'fluid-xl': 'clamp(1.125rem, 5vw, 1.25rem)',
        'fluid-2xl': 'clamp(1.25rem, 6vw, 1.5rem)',
        'fluid-3xl': 'clamp(1.5rem, 7vw, 1.875rem)',
        'fluid-4xl': 'clamp(1.875rem, 8vw, 2.25rem)',
        'fluid-5xl': 'clamp(2.25rem, 10vw, 3rem)',
        'fluid-6xl': 'clamp(2.5rem, 12vw, 4rem)',
      },
      spacing: {
        'fluid-1': 'clamp(0.25rem, 1vw, 0.5rem)',
        'fluid-2': 'clamp(0.5rem, 2vw, 1rem)',
        'fluid-3': 'clamp(0.75rem, 3vw, 1.5rem)',
        'fluid-4': 'clamp(1rem, 4vw, 2rem)',
        'fluid-6': 'clamp(1.5rem, 6vw, 3rem)',
        'fluid-8': 'clamp(2rem, 8vw, 4rem)',
        'fluid-12': 'clamp(3rem, 12vw, 6rem)',
        'fluid-16': 'clamp(4rem, 16vw, 8rem)',
      },
      screens: {
        'xs': '375px',      // iPhone SE and similar small devices
        'sm': '640px',      // Small tablets
        'md': '768px',      // Tablets
        'lg': '1024px',     // Small laptops
        'xl': '1280px',     // Laptops
        '2xl': '1536px',    // Large screens
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config 