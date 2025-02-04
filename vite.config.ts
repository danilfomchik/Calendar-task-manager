import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

import { resolve } from "path";

const outDir = resolve(__dirname, "dist");

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    build: {
        outDir,
    },
});
