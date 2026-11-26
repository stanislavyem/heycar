/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',

  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      'xxl': '1536px',
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',

        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',

        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',

        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',

        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',

        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',

        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',

        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',

        success: 'var(--success)',
        'success-foreground': 'var(--success-foreground)',

        warning: 'var(--warning)',
        'warning-foreground': 'var(--warning-foreground)',

        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',

        surface: 'var(--surface)',
        'surface-elevated': 'var(--surface-elevated)',

        'on-image': 'var(--on-image)',
        'on-image-muted': 'var(--on-image-muted)',
        night: 'var(--night)',

        button: 'var(--btn-bg)',
        'button-foreground': 'var(--btn-fg)',
        'btn-hover': 'var(--btn-hover-bg)',
        'btn-hover-secondary': 'var(--btn-hover-bg-secondary)',
      },

      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-sans)'],
      },

      borderRadius: {
        btn: 'var(--btn-radius)',
        badge: 'var(--badge-radius)',
        card: 'var(--card-radius)',
        input: 'var(--input-radius)',
      },

      spacing: {
        'btn-h': 'var(--btn-h)',
        'btn-h-xs': 'calc(var(--btn-h) - 0.75rem)',
        'btn-h-sm': 'calc(var(--btn-h) - 0.25rem)',
        'btn-h-lg': 'calc(var(--btn-h) + 0.25rem)',
        'btn-px': 'var(--btn-px)',
        'btn-px-xs': 'calc(var(--btn-px) - 0.5rem)',
        'btn-px-sm': 'calc(var(--btn-px) - 0.25rem)',
        'btn-px-lg': 'calc(var(--btn-px) + 0.5rem)',
        'badge-px': 'var(--badge-px)',
        'input-h': 'var(--input-h)',
      },

      fontSize: {
        btn: ['var(--btn-fs)', {
          lineHeight: 'var(--btn-leading)',
        }],
        'btn-xs': ['calc(var(--btn-fs) - 0.125rem)', {
          lineHeight: 'var(--btn-leading)',
        }],
        badge: ['var(--badge-fs)', {
          lineHeight: 'var(--badge-leading)',
        }],
      },

      fontWeight: {
        btn: 'var(--btn-weight)',
        badge: 'var(--badge-weight)',
      },

      letterSpacing: {
        btn: 'var(--btn-tracking)',
        badge: 'var(--badge-tracking)',
      },

      boxShadow: {
        card: 'var(--card-shadow)',
        input: 'var(--input-shadow)',
      },
    },
  },

  plugins: [],
};
