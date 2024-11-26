/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
export default {
	content: [
    "./src/**/*.{svelte,html,astro}"
  ],
	corePlugins: [
    "backgroundColor"
  ],
  plugins: [daisyui],
	daisyui:{
		themes: ["dark"],
	}
}