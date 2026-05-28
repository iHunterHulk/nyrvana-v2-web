import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light theme base colors
        'bg': 'oklch(100% 0 0)',
        'bg-surface': 'oklch(98% 0.01 280)',
        'bg-elevated': 'oklch(99% 0.005 280)',
        
        // Text colors
        'text-primary': 'oklch(15% 0.05 280)',
        'text-secondary': 'oklch(40% 0.03 280)',
        'text-tertiary': 'oklch(60% 0.02 280)',
        'text-disabled': 'oklch(75% 0.01 280)',
        
        // Accent colors with subtle/vibrant variants
        'blue-subtle': 'oklch(90% 0.05 240)',
        'blue-vibrant': 'oklch(50% 0.15 240)',
        'green-subtle': 'oklch(90% 0.08 140)',
        'green-vibrant': 'oklch(50% 0.18 140)',
        'orange-subtle': 'oklch(95% 0.1 60)',
        'orange-vibrant': 'oklch(60% 0.15 60)',
        'red-subtle': 'oklch(95% 0.08 25)',
        'red-vibrant': 'oklch(55% 0.18 25)',
        'purple-subtle': 'oklch(93% 0.08 300)',
        'purple-vibrant': 'oklch(55% 0.15 300)',
        
        // Status colors
        'status-healthy': 'oklch(50% 0.18 140)',
        'status-degraded': 'oklch(60% 0.15 60)',
        'status-down': 'oklch(55% 0.18 25)',
        'status-pending': 'oklch(75% 0.01 280)',
        
        // Border and shadow
        'border': 'oklch(90% 0.01 280)',
        'shadow': 'rgba(0, 0, 0, 0.08)',
        
        // Signature electric blue
        'electric-blue': 'oklch(60% 0.21 252)',
      },
      // Spacing scale
      spacing: {
        '0': '0px',
        '2': '2px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
        '64': '64px',
        '96': '96px',
        '128': '128px',
      },
      // Type scale
      fontSize: {
        'xs': '11px',
        'sm': '12px',
        'base': '13px',
        'md': '14px',
        'lg': '15px',
        'xl': '16px',
        '2xl': '18px',
        '3xl': '20px',
        '4xl': '24px',
        '5xl': '30px',
        '6xl': '36px',
        '7xl': '48px',
        '8xl': '60px',
      },
      lineHeight: {
        'xs': '1.2',
        'sm': '1.3',
        'base': '1.4',
        'lg': '1.5',
        'xl': '1.6',
      },
      fontWeight: {
        'regular': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
      // Radius scale
      borderRadius: {
        'none': '0px',
        'xs': '2px',
        'sm': '4px',
        'base': '6px',
        'md': '8px',
        'lg': '10px',
        'xl': '14px',
        '2xl': '24px',
        'full': '9999px',
      },
      // Shadow scale
      boxShadow: {
        'none': 'none',
        'xs': '0 1px 2px 0 var(--color-shadow)',
        'sm': '0 1px 3px 0 var(--color-shadow), 0 1px 2px -1px var(--color-shadow)',
        'md': '0 4px 6px -1px var(--color-shadow), 0 2px 4px -2px var(--color-shadow)',
        'lg': '0 10px 15px -3px var(--color-shadow), 0 4px 6px -4px var(--color-shadow)',
      },
      // Motion durations and easings
      transitionDuration: {
        'fast': '80ms',
        'base': '120ms',
        'slow': '200ms',
        'slower': '300ms',
        'slowest': '500ms',
      },
      transitionTimingFunction: {
        'standard': 'cubic-bezier(0.2, 0, 0, 1)',
        'accelerate': 'cubic-bezier(0.4, 0, 1, 1)',
        'decelerate': 'cubic-bezier(0, 0, 0.2, 1)',
        'emphasized': 'cubic-bezier(0.2, 0, 0, 1)',
        'sharp': 'cubic-bezier(0.3, 0, 0.8, 0.15)',
      },
    },
  },
  plugins: [],
}

export default config