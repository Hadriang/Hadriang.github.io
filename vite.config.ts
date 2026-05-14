import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

function normalizeBasePath(value: string | undefined): string {
  if (!value || value === "./") {
    return value ?? "/";
  }

  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export default defineConfig({
  base: normalizeBasePath(process.env.VITE_BASE_PATH),
  plugins: [react()],
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"]
  }
});
