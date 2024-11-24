/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
import daisyUIClasses from "./daisyui_classes"
export default {
	content: {
    files: [], // This ensures no files are scanned for classes
  },
  safelist: daisyUIClasses,
  plugins: [daisyui],
}