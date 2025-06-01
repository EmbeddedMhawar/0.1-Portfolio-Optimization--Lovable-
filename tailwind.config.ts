import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: '#2e4328',
        input: '#2e4328',
        ring: '#426039',
        background: '#162013',
        foreground: '#ffffff',
        primary: {
          DEFAULT: '#2e4328',
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#21301c',
          foreground: '#ffffff'
        },
        muted: {
          DEFAULT: '#21301c',
          foreground: '#a2c398'
        },
        accent: {
          DEFAULT: '#21301c',
          foreground: '#ffffff'
        },
        destructive: {
          DEFAULT: '#991b1b',
          foreground: '#ffffff'
        },
        popover: {
          DEFAULT: '#162013',
          foreground: '#ffffff'
        },
        card: {
          DEFAULT: '#162013',
          foreground: '#ffffff'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'sans-serif']
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;