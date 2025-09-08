import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        'archivo-narrow': 'var(--font-archivo-narrow)',
        archivo: 'var(--font-archivo)',
      },
      fontSize: {
        '3xl': '1.75rem', // 28px
        '4xl': '2rem', // 32px
        '5xl': '2.5rem', // 40px
        '6xl': '3.25rem', // 52px
        '7xl': '3.75rem', // 60px
        '8xl': '4rem', // 64px
        '9xl': '4.5rem', // 72px
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius-xl))',
        xs: 'calc(var(--radius-xs))',
        xxs: 'calc(var(--radius-xxs))',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        warn: {
          DEFAULT: 'hsl(var(--warn))',
          foreground: 'hsl(var(--warn-foreground))',
        },
        border: {
          DEFAULT: 'hsl(var(--border))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        red: {
          DEFAULT: 'hsl(var(--red))',
          foreground: 'hsl(var(--red-foreground))',
        },
        blue: {
          DEFAULT: 'hsl(var(--blue))',
          foreground: 'hsl(var(--blue-foreground))',
        },
        cian: {
          DEFAULT: 'hsl(var(--cian))',
          foreground: 'hsl(var(--cian-foreground))',
        },
        yellow: {
          DEFAULT: 'hsl(var(--yellow))',
          foreground: 'hsl(var(--yellow-foreground))',
        },
        green: {
          DEFAULT: 'hsl(var(--green))',
          foreground: 'hsl(var(--green-foreground))',
        },
        magenta: {
          DEFAULT: 'hsl(var(--magenta))',
          foreground: 'hsl(var(--magenta-foreground))',
        },
        'gray-10': {
          DEFAULT: 'hsl(var(--gray-10))',
          foreground: 'hsl(var(--gray-10-foreground))',
        },
        'gray-30': {
          DEFAULT: 'hsl(var(--gray-30))',
          foreground: 'hsl(var(--gray-30-foreground))',
        },
        'gray-50': {
          DEFAULT: 'hsl(var(--gray-50))',
          foreground: 'hsl(var(--gray-50-foreground))',
        },
        'gray-70': {
          DEFAULT: 'hsl(var(--gray-70))',
          foreground: 'hsl(var(--gray-70-foreground))',
        },
        'neutral-gray': {
          DEFAULT: 'hsl(var(--neutral-gray))',
          foreground: 'hsl(var(--neutral-gray-foreground))',
        },
        'light-gray': {
          DEFAULT: 'hsl(var(--light-gray))',
          foreground: 'hsl(var(--light-gray-foreground))',
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
