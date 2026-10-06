import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// vite reads this file when you run `npm run dev` or `npm run build`.
// the react plugin lets vite understand JSX (the HTML-looking code in .jsx files).
export default defineConfig({
  plugins: [react()],
});
