import { test, expect } from "@playwright/test";
import fs from "node:fs";

const BASE = "http://localhost:4322";
const SIM = "http://localhost:4401";
const manifest = JSON.parse(fs.readFileSync("dist/manifest.json", "utf8"));

test.describe("every page renders cleanly", () => {
  for (const p of manifest.pages) {
    test(p.id, async ({ page }) => {
      const errors = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(`${BASE}/${p.path}`);
      await expect(page.locator("h1")).toHaveText(p.title);
      for (const name of new Set(p.widgets)) {
        const tag = `lx-${name}`;
        if (!(await page.locator(tag).count())) continue; // static block
        await expect(page.locator(tag).first()).toHaveJSProperty("_failed", null);
        expect(await page.locator(tag).first().evaluate((el) => !!el.shadowRoot)).toBe(true);
      }
      expect(errors).toEqual([]);
    });
  }
});

test("widget catalog shows every widget", async ({ page }) => {
  await page.goto(`${BASE}/widgets/`);
  for (const name of Object.keys(manifest.widgets)) await expect(page.locator(`#${name}`)).toBeVisible();
});

test("graded page reports to Moodle with the plugin's message format", async ({ page }) => {
  await page.goto(`${BASE}/__moodle/?url=/getting-started/what-is-codex/&uid=1&cid=1`);
  const frame = page.frameLocator("#extpage-iframe");
  const quiz = frame.locator("lx-quiz");
  // answers in content: 1, 2, 0
  for (const [qi, oi] of [[0, 1], [1, 2], [2, 0]]) {
    const q = quiz.locator(".q").nth(qi);
    await q.locator("label.opt").nth(oi).click();
    await q.getByRole("button", { name: "Check answer" }).click();
  }
  await expect.poll(() => page.evaluate(() => window.__messages.filter((m) => m.type === "moodleSubmitGrade"))).toEqual([
    { type: "moodleSubmitGrade", score: 3, maxScore: 3 },
  ]);
  const resizes = await page.evaluate(() => window.__messages.filter((m) => m.type === "moodleIframeResize").length);
  expect(resizes).toBeGreaterThan(0);
  // embedded mode hides the site chrome
  await expect(frame.locator(".lx-sidebar")).toBeHidden();
});

test("inside Moodle, links to other course pages open in a new tab", async ({ page }) => {
  await page.goto(`${BASE}/__moodle/?url=/getting-started/lab-first-session/&uid=1&cid=1`);
  const link = page.frameLocator("#extpage-iframe").locator(".lx-callout a", { hasText: "Your first session, safely" });
  await expect(link).toHaveAttribute("target", "_blank");
});

test("answers survive a reload", async ({ page }) => {
  await page.goto(`${BASE}/getting-started/what-is-codex/`);
  const q = page.locator("lx-quiz .q").first();
  await q.locator("label.opt").nth(1).click();
  await q.getByRole("button", { name: "Check answer" }).click();
  await page.reload();
  await expect(page.locator("lx-quiz .q").first().locator(".feedback.ok")).toBeVisible();
});

test.describe("version pinning", () => {
  const P = "/codex-navigator/latest/getting-started/what-is-codex/";
  const cases = [
    ["cohort pin (course 7 → 1.0)", "?uid=42&cid=7", "1.0.1"],
    ["learner pin (user 99 → 1.0.0)", "?uid=99&cid=7", "1.0.0"],
    ["no pin stays on latest", "?uid=5&cid=8", "1.1.0"],
    ["explicit ?v= override", "?uid=5&cid=8&v=1.0.0", "1.0.0"],
  ];
  for (const [name, q, want] of cases) {
    test(name, async ({ page }) => {
      await page.goto(SIM + P + q);
      await expect.poll(() => page.evaluate(() => window.LX && window.LX.version).catch(() => null)).toBe(want);
    });
  }

  test("learner keeps the version they started on after latest moves", async ({ page }) => {
    await page.goto(SIM + "/codex-navigator/versions/");
    await page.evaluate(() => localStorage.setItem("lx:codex-navigator:pin:8:77", "1.0"));
    await page.goto(SIM + P + "?uid=77&cid=8");
    await expect.poll(() => page.evaluate(() => window.LX && window.LX.version).catch(() => null)).toBe("1.0.1");
  });
});
