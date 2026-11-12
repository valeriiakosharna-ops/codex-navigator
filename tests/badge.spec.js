import { test, expect } from "@playwright/test";

const BASE = "http://localhost:4322";
const PAGE = "/getting-started/badge-get-started/";
const API = "https://api.accredible.com/v1/credential-net/credentials/**";

// Shape of Accredible's public credential record (fields the widget reads).
const record = (over = {}) => ({
  data: {
    id: 81234567, name: "Get Started with Codex", approve: true, private: false, expired: false, revoked_at: null,
    issued_on: "2026-11-10", issuer: { name: "OpenAI" }, recipient: { name: "Olena Koval", email: "o****@n***.com" },
    group: { name: "Get Started with Codex", course_name: "Get Started with Codex" },
    badge_image: { preview: { url: "" } },
    ...over,
  },
});

async function openInMoodle(page, name = "Олена Коваль") {
  await page.goto(`${BASE}/__moodle/?url=${PAGE}&uid=5&cid=9${name ? `&name=${encodeURIComponent(name)}` : ""}`);
  return page.frameLocator("#extpage-iframe").locator("lx-badge");
}
const submit = async (badge, link) => {
  await badge.locator("input").fill(link);
  await badge.getByRole("button", { name: /Check/ }).click();
};
const grades = (page) => page.evaluate(() => window.__messages.filter((m) => m.type === "moodleSubmitGrade"));

test("valid badge for the right learner sends full marks to Moodle", async ({ page }) => {
  let asked = "";
  await page.route(API, (route) => { asked = route.request().url(); return route.fulfill({ json: record() }); });
  const badge = await openInMoodle(page); // Cyrillic Moodle name vs Latin badge name
  await submit(badge, "https://www.credential.net/81234567?key=abc#acc.x");
  await expect(badge.locator(".feedback.ok")).toContainText("Badge confirmed");
  expect(asked).toMatch(/credentials\/81234567$/); // only the credential id leaves the page
  await expect.poll(() => grades(page)).toEqual([{ type: "moodleSubmitGrade", score: 1, maxScore: 1 }]);
});

test("badge for a different course is rejected and nothing is graded", async ({ page }) => {
  await page.route(API, (route) => route.fulfill({ json: record({ name: "AI Foundations", group: { name: "AI Foundations", course_name: "AI Foundations" } }) }));
  const badge = await openInMoodle(page);
  await submit(badge, "https://www.credential.net/81234567");
  await expect(badge.locator(".feedback.bad")).toContainText("doesn't complete this checkpoint");
  expect(await grades(page)).toEqual([]);
});

test("someone else's badge asks for instructor confirmation", async ({ page }) => {
  await page.route(API, (route) => route.fulfill({ json: record({ recipient: { name: "Petro Shevchenko" } }) }));
  const badge = await openInMoodle(page);
  await submit(badge, "d228005c-f018-4f2d-b532-82d8c5be5963");
  await expect(badge.locator(".feedback.bad")).toContainText("issued to someone else");
  expect(await grades(page)).toEqual([]);
});

test("revoked badges, foreign issuers, bad links and private badges are handled", async ({ page }) => {
  const badge = await openInMoodle(page, "");
  await page.route(API, (route) => route.fulfill({ json: record({ revoked_at: "2026-11-11" }) }));
  await submit(badge, "https://www.credential.net/81234567");
  await expect(badge.locator(".feedback.bad")).toContainText("Revoked");
  await page.unroute(API);
  await page.route(API, (route) => route.fulfill({ json: record({ issuer: { name: "Some Bootcamp" } }) }));
  await submit(badge, "https://www.credential.net/81234567");
  await expect(badge.locator(".feedback.bad")).toContainText("Some Bootcamp");
  await submit(badge, "https://example.com/my-certificate");
  await expect(badge.locator(".feedback.bad")).toContainText("doesn't look like a badge link");
  await page.unroute(API);
  await page.route(API, (route) => route.fulfill({ status: 404, body: "" }));
  await submit(badge, "https://www.credential.net/99999999");
  await expect(badge.locator(".feedback.bad")).toContainText("no badge with this link");
  expect(await grades(page)).toEqual([]);
});

test("without a Moodle name the badge still counts, with a note", async ({ page }) => {
  await page.route(API, (route) => route.fulfill({ json: record() }));
  const badge = await openInMoodle(page, "");
  await submit(badge, "https://www.credential.net/81234567");
  await expect(badge.locator(".feedback.ok")).toContainText("name wasn't checked");
  await expect.poll(() => grades(page)).toEqual([{ type: "moodleSubmitGrade", score: 1, maxScore: 1 }]);
});
