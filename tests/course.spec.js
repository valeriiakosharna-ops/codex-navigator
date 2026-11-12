import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { showSlide, answerQuiz } from "./helpers.js";

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
  await showSlide(frame, "lx-quiz");
  await answerQuiz(quiz, [1, 2, 0]); // answers in content
  await quiz.getByRole("button", { name: "See your result" }).click();
  await expect(quiz.locator(".result b")).toHaveText("3 / 3");
  await expect.poll(() => page.evaluate(() => window.__messages.filter((m) => m.type === "moodleSubmitGrade"))).toEqual([
    { type: "moodleSubmitGrade", score: 3, maxScore: 3 },
  ]);
  const resizes = await page.evaluate(() => window.__messages.filter((m) => m.type === "moodleIframeResize").length);
  expect(resizes).toBeGreaterThan(0);
  // embedded mode hides the site chrome
  await expect(frame.locator(".lx-sidebar")).toBeHidden();
});

test("slides: one section at a time, keyboard and buttons navigate", async ({ page }) => {
  await page.goto(`${BASE}/getting-started/what-is-codex/`);
  await expect(page.locator(".lx-slide")).toHaveCount(4);
  await expect(page.locator(".lx-slide:visible")).toHaveCount(1);
  await page.locator("[data-slide-next]").click();
  await expect(page.locator(".lx-slide").nth(1)).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".lx-slide").nth(2)).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".lx-slidenav__count")).toHaveText("2 / 4");
  await page.locator(".lx-step").nth(3).click();
  await expect(page.locator("[data-slide-next]")).toBeDisabled();
});

test("inside Moodle, links to other topics open the matching Moodle activity", async ({ page }) => {
  // moodle.json maps page ids to activity ids for this Moodle site (the simulator) and course 7
  await page.route("**/moodle.json", (route) => route.fulfill({ json: { sites: { [BASE]: { courses: { "7": { "getting-started/first-session": 153 } } } } } }));
  await page.goto(`${BASE}/__moodle/?url=/getting-started/lab-first-session/&uid=1&cid=7`);
  const frame = page.frameLocator("#extpage-iframe");
  const mapped = frame.locator(".lx-callout a", { hasText: "The Codex CLI, sandbox and approvals" });
  await expect(mapped).toHaveAttribute("href", `${BASE}/mod/extpagewithgrades/view.php?id=153`);
  await expect(mapped).toHaveAttribute("target", "_top");
  // no mapping for this page -> the Moodle course page, never the standalone site
  const unmapped = frame.locator(".lx-callout a", { hasText: "Giving Codex context and completion criteria" });
  await expect(unmapped).toHaveAttribute("href", `${BASE}/course/view.php?id=7`);
});

test("a course built with mod_embedcourse links to that plugin's activities", async ({ page }) => {
  await page.route("**/moodle.json", (route) => route.fulfill({ json: { sites: { [BASE]: { plugin: "extpagewithgrades", courses: { "7": { plugin: "embedcourse", "getting-started/first-session": 201 } } } } } }));
  await page.goto(`${BASE}/__moodle/?url=/getting-started/lab-first-session/&uid=1&cid=7`);
  const frame = page.frameLocator("#extpage-iframe");
  const mapped = frame.locator(".lx-callout a", { hasText: "The Codex CLI, sandbox and approvals" });
  await expect(mapped).toHaveAttribute("href", `${BASE}/mod/embedcourse/view.php?id=201`);
});

test("moodle.yaml: only the key plugin takes a module name", async () => {
  const { moodleSchema } = await import("../scripts/root-files.mjs");
  const ok = moodleSchema.parse({ sites: { "https://m.example": { courses: { "10": { plugin: "embedcourse", "a/b": 5 } } } } });
  expect(ok.sites["https://m.example"].plugin).toBe("extpagewithgrades");
  expect(() => moodleSchema.parse({ sites: { "https://m.example": { courses: { "10": { "a/b": "embedcourse" } } } } })).toThrow();
});

test("answers survive a reload", async ({ page }) => {
  await page.goto(`${BASE}/getting-started/what-is-codex/`);
  await showSlide(page, "lx-quiz");
  const quiz = page.locator("lx-quiz");
  await quiz.locator(".paged label.opt").nth(1).click();
  await quiz.getByRole("button", { name: "Check answer" }).click();
  await page.reload(); // stays on the same slide and keeps the answer
  await expect(quiz.locator(".paged .feedback.ok")).toBeVisible();
});

test.describe("version pinning", () => {
  const P = "/codex-navigator/latest/getting-started/what-is-codex/";
  const cases = [
    ["cohort pin (course 7 → 1.0)", "?uid=42&cid=7", "1.0.1"],
    ["learner pin (user 99 → 1.0.0)", "?uid=99&cid=7", "1.0.0"],
    ["no pin stays on latest", "?uid=5&cid=8", "1.1.0"],
    ["explicit ?v= override", "?uid=5&cid=8&v=1.0.0", "1.0.0"],
    ["same course id on another Moodle uses that site's pin", "?uid=42&cid=7&site=https://moodle-b.example", "1.1.0"],
    ["a Moodle without its own pins falls back to the shared course pin", "?uid=42&cid=7&site=https://moodle-c.example", "1.0.1"],
  ];
  for (const [name, q, want] of cases) {
    test(name, async ({ page }) => {
      await page.goto(SIM + P + q);
      // read the version only once the pin decision is made (no redirect pending)
      await expect.poll(() => page.evaluate(() => (document.documentElement.classList.contains("lx-pinning") ? "deciding" : window.LX && window.LX.version)).catch(() => null)).toBe(want);
    });
  }

  test("learner keeps the version they started on after latest moves", async ({ page }) => {
    await page.goto(SIM + "/codex-navigator/versions/");
    await page.evaluate(() => localStorage.setItem("lx:codex-navigator:pin:8:77", "1.0"));
    await page.goto(SIM + P + "?uid=77&cid=8");
    await expect.poll(() => page.evaluate(() => window.LX && window.LX.version).catch(() => null)).toBe("1.0.1");
  });
});
