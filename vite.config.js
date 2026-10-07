import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// vite reads this file when you run `npm run dev` or `npm run build`.
// the react plugin lets vite understand JSX (the HTML-looking code in .jsx files).
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // put the 3D library in its own file, separate from our code.
        // when we change our code and redeploy, returning visitors only
        // re-download our small file. the big 3D file stays in their cache.
        manualChunks: {
          three: ["three", "@react-three/fiber", "@react-three/drei"],
        },
      },
    },
    // the 3D library is over vite's default 500 KB warning size on its own.
    // that's expected, so raise the limit (in KB) to stop the warning.
    chunkSizeWarningLimit: 1500,
  },
});
