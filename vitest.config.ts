import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // jsdom-rendertester (t.ex. MajSpelmodell) kan svältas förbi vitests
    // 5s-default när hela sviten körs parallellt och environment-setup tar
    // ~40s. Höjd timeout eliminerar lastberoende falska timeouts utan att
    // dölja äkta hängningar (genuint hängd test failar fortfarande, vid 15s).
    testTimeout: 15000,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
