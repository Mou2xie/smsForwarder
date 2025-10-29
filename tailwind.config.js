/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Include all files under `app/` (Expo Router) and other common locations
  // so Tailwind can scan for class names used by NativeWind.
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './App.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
}