import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: {
          DEFAULT: '#d4e6d7',
          dark: '#2e4328'
        },
        input: {
          DEFAULT: '#e8f0e9',
          dark: '#2e4328'
        },
        ring: {
          DEFAULT: '#426039',
          dark: '#426039'
        },
        background: {
          DEFAULT: '#f4f7f5',
          dark: '#162013'
        },
        foreground: {
          DEFAULT: '#2e4328',
          dark: '#ffffff'
        },
        primary: {
          DEFAULT: '#2e4328',
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#e8f0e9',
          dark: '#21301c',
          foreground: '#2e4328'
        },
        muted: {
          DEFAULT: '#e8f0e9',
          dark: '#21301c',
          foreground: '#426039'
        },
        accent: {
          DEFAULT: '#e8f0e9',
          dark: '#21301c',
          foreground: '#2e4328'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;