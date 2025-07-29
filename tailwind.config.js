/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",      // 👈 your App‑Router files
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",    // (if you ever add /pages)
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"// shared components
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			f1: [
  				'F1 Regular',
  				'sans-serif'
  			],
  			f1bold: [
  				'F1 Bold',
  				'sans-serif'
  			],
  			f1black: [
  				'F1 Black',
  				'sans-serif'
  			],
  			f1wide: [
  				'F1 Wide',
  				'sans-serif'
  			],
  			f1italic: [
  				'F1 Italic',
  				'sans-serif'
  			]
  		},
  		colors: {
  			f1red: {
  				'100': '#600000',
  				'200': '#670000',
  				'300': '#740000',
  				'400': '#7c0000',
  				'500': '#7e0707',
  				'600': '#FF1801'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
