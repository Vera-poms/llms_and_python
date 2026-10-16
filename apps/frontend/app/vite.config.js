import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
export default defineConfig({
    plugins: [react()],
    base: '/llms_and_python/',
    server: {
        host: true,
        port: 5000,
        watch: { usePolling: true, interval: 300 },
    },
});
