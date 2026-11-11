import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  timeout: 30_000,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: { browserName: "chromium" },
  webServer: [
    { command: "node build/build.mjs && node build/dev.mjs --serve dist --port 4322", url: "http://localhost:4322/", reuseExistingServer: !process.env.CI },
    { command: "node scripts/simulate-versions.mjs", env: { PORT: "4401" }, url: "http://localhost:4401/codex-navigator/versions.json", reuseExistingServer: !process.env.CI, timeout: 120_000 },
  ],
});
