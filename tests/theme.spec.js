import { test, expect } from "@playwright/test";

const BASE = "http://localhost:4322";
const theme = (target) => target.locator("html").getAttribute("data-theme");

test("follows the system colour scheme by default", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto(`${BASE}/getting-started/what-is-codex/`);
  expect(await theme(page)).toBe("dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect.poll(() => theme(page)).toBe("light"); // live switch, no reload
});

test("standalone toggle cycles system → light → dark and is remembered", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto(`${BASE}/`);
  const btn = page.locator("[data-lx-theme-toggle]");
  await expect(btn).toHaveAttribute("aria-label", "Colour theme: system");
  await btn.click(); // light
  await btn.click(); // dark
  expect(await theme(page)).toBe("dark");
  await page.reload();
  expect(await theme(page)).toBe("dark");
  await expect(btn).toHaveAttribute("aria-label", "Colour theme: dark");
});

test("inside Moodle: page follows the theme Moodle sends, live", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto(`${BASE}/__moodle/?url=/getting-started/what-is-codex/&uid=1&cid=1`);
  const frame = page.frameLocator("#extpage-iframe");
  await frame.locator("h1").waitFor();
  await page.evaluate(() => window.__setMoodleTheme("dark"));
  await expect.poll(() => theme(frame)).toBe("dark");
  // background matches Moodle's dark page colour (#0F1220)
  await expect.poll(() => frame.locator("body").evaluate((b) => getComputedStyle(b).backgroundColor)).toBe("rgb(15, 18, 32)");
  await page.evaluate(() => window.__setMoodleTheme("light"));
  await expect.poll(() => theme(frame)).toBe("light");
});

test("?theme= overrides everything", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto(`${BASE}/getting-started/what-is-codex/?theme=dark`);
  expect(await theme(page)).toBe("dark");
});
