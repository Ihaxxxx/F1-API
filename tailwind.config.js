/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",      // 👈 your App‑Router files
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",    // (if you ever add /pages)
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"// shared components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
