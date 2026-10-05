import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5000,
    // File-change events don't cross the Windows -> container bind mount, so poll for edits.
    watch: { usePolling: true, interval: 300 },
  },
});
