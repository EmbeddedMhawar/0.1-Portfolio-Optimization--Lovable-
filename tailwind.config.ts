import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
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
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;