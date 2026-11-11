import { test, expect } from "@playwright/test";
import { showSlide } from "./helpers.js";

const BASE = "http://localhost:4322";
const LAB1 = `${BASE}/getting-started/lab-first-session/`;
const LAB2 = `${BASE}/practical-workflows/lab-review/`;

const choose = (w, text) => w.locator(".choice", { hasText: text }).click();
const cont = (w) => w.locator(".actions .btn-primary").click();

test("level 1 scenario: optimal path scores 100% and unlocks level 2", async ({ page }) => {
  await page.goto(LAB1);
  const l1 = page.locator("#lab1-l1"), l2 = page.locator("#lab1-l2");
  await showSlide(page, "#lab1-l2");
  await expect(l2.locator(".locked")).toBeVisible();
  await showSlide(page, "#lab1-l1");
  await l1.getByRole("button", { name: "Start scenario" }).click();
  await choose(l1, "Commit or stash my changes");
  await expect(l1.locator(".pending .rating")).toHaveText("optimal"); // level 1 = feedback each step
  await cont(l1);
  await choose(l1, "approve this one request");
  await cont(l1);
  await choose(l1, "ask Codex why it changed the deploy workflow");
  await cont(l1);
  await l1.getByRole("button", { name: "See results" }).click();
  await expect(l1.locator(".score b")).toHaveText("100%");
  await showSlide(page, "#lab1-l2");
  await expect(l2.locator(".locked")).toHaveCount(0);
  await expect(l2.getByRole("button", { name: "Start scenario" })).toBeVisible();
});

test("critical decision caps the score at 30%", async ({ page }) => {
  await page.goto(LAB1);
  const l1 = page.locator("#lab1-l1");
  await showSlide(page, "#lab1-l1");
  await l1.getByRole("button", { name: "Start scenario" }).click();
  await choose(l1, "Commit or stash my changes");
  await cont(l1);
  await choose(l1, "Switch to full access");
  await cont(l1);
  await expect(l1.locator(".score b")).toHaveText("30%");
  await expect(l1.locator(".cap")).toBeVisible();
  await showSlide(page, "#lab1-l2");
  await expect(page.locator("#lab1-l2 .locked")).toBeVisible(); // below 70% → still locked
});

test("level 3: acting without evidence is downgraded; stopping the agent on time is optimal", async ({ page }) => {
  await page.goto(LAB1);
  await page.evaluate(() => {
    // pretend level 2 is passed
    const k = Object.keys(localStorage).find((x) => x.includes(":lab1-l2:")) || "";
    const key = k || `lx:codex-navigator:0.0:getting-started/lab-first-session:lab1-l2:anon`;
    localStorage.setItem(key, JSON.stringify({ best: 1, attemptsUsed: 1 }));
  });
  await page.reload();
  const l3 = page.locator("#lab1-l3");
  await showSlide(page, "#lab1-l3");
  await l3.getByRole("button", { name: "Start scenario" }).click();
  await l3.locator(".ev-btn", { hasText: "git diff --stat" }).click();
  await expect(l3.locator(".budget")).toContainText("2 left");
  // choose the right fix WITHOUT opening the config diff → downgraded
  await choose(l3, "restore the lint rule");
  // stream (autoplay on level 3): wait for the red line, then stop
  await expect(l3.locator(".stream .ln")).toHaveCount(5, { timeout: 15_000 });
  await l3.getByRole("button", { name: /Stop the agent/ }).click();
  await cont(l3);
  await l3.getByRole("button", { name: "See results" }).click();
  await expect(l3.locator(".path li").first()).toContainText("downgraded");
  await expect(l3.locator(".path li").nth(1).locator(".rating")).toHaveText("optimal");
  await expect(l3.getByRole("button", { name: "Try again" })).toBeVisible(); // any practice can be retaken
});

test("spot level 2: severity is required and graded; decoys explained", async ({ page }) => {
  await page.goto(LAB2);
  await page.evaluate(() => localStorage.setItem("lx:codex-navigator:0.0:practical-workflows/lab-review:lab2-l1:anon", JSON.stringify({ best: 1, attemptsUsed: 1 })));
  await page.reload();
  const s = page.locator("#lab2-l2");
  await showSlide(page, "#lab2-l2");
  await s.locator(".ln").nth(3).click(); // line 4
  await s.locator(".ln").nth(10).click(); // line 11 (inside the skipped block)
  await expect(s.getByRole("button", { name: "Submit review" })).toBeDisabled(); // severities missing
  await s.getByLabel("Severity for line 4").selectOption("critical");
  await s.getByLabel("Severity for line 11").selectOption("minor"); // wrong severity
  await s.locator(".ln").nth(15).click(); // line 16: decoy
  await s.getByLabel("Severity for line 16").selectOption("minor");
  await s.getByRole("button", { name: "Submit review" }).click();
  // (1 + 0.6 - 0.34) / 2 = 0.63
  await expect(s.locator(".score b")).toHaveText("63%");
  await expect(s.locator(".report")).toContainText("harmless style change");
});

test("lab page reports one combined grade to Moodle", async ({ page }) => {
  await page.goto(`${BASE}/__moodle/?url=/getting-started/lab-first-session/&uid=3&cid=3`);
  const f = page.frameLocator("#extpage-iframe");
  // mark levels 2 and 3 as done via storage, then finish level 1 → page complete
  await f.locator("#lab1-l1").waitFor({ state: "attached" });
  await page.evaluate(() => {
    const w = document.getElementById("extpage-iframe").contentWindow;
    const base = "lx:codex-navigator:0.0:getting-started/lab-first-session:";
    w.localStorage.setItem(base + "lab1-l2:3", JSON.stringify({ best: 0.5, attemptsUsed: 2, exhausted: true }));
    w.localStorage.setItem(base + "lab1-l3:3", JSON.stringify({ best: 1, attemptsUsed: 1, exhausted: true }));
    w.location.reload();
  });
  const l1 = f.locator("#lab1-l1");
  await showSlide(f, "#lab1-l1");
  await l1.getByRole("button", { name: "Start scenario" }).click();
  await choose(l1, "Commit or stash my changes"); await cont(l1);
  await choose(l1, "approve this one request"); await cont(l1);
  await choose(l1, "ask Codex why it changed the deploy workflow"); await cont(l1);
  await l1.getByRole("button", { name: "See results" }).click();
  // L1 1/1 + L2 0.5*2 + L3 1*3 = 5 of 6
  await expect.poll(() => page.evaluate(() => window.__messages.filter((m) => m.type === "moodleSubmitGrade").pop())).toEqual({ type: "moodleSubmitGrade", score: 5, maxScore: 6 });
});

test("retakes: best result is kept, and the next level opens after two tries", async ({ page }) => {
  await page.goto(LAB1);
  const l1 = page.locator("#lab1-l1");
  await showSlide(page, "#lab1-l1");
  const lowRun = async () => {
    await l1.getByRole("button", { name: /Start scenario|Try again/ }).click();
    await choose(l1, "Commit or stash my changes"); await cont(l1);
    await choose(l1, "Switch to full access"); await cont(l1); // critical -> capped at 30%
  };
  await lowRun();
  await expect(l1.locator(".score b")).toHaveText("30%");
  await showSlide(page, "#lab1-l2");
  await expect(page.locator("#lab1-l2 .locked")).toBeVisible();
  await showSlide(page, "#lab1-l1");
  await lowRun();
  await showSlide(page, "#lab1-l2");
  await expect(page.locator("#lab1-l2 .locked")).toHaveCount(0); // two tries -> unlocked
  // a better retake raises the best score
  await showSlide(page, "#lab1-l1");
  await l1.getByRole("button", { name: "Try again" }).click();
  await choose(l1, "Commit or stash my changes"); await cont(l1);
  await choose(l1, "approve this one request"); await cont(l1);
  await choose(l1, "ask Codex why it changed the deploy workflow"); await cont(l1);
  await l1.getByRole("button", { name: "See results" }).click();
  await expect(l1.locator(".score .muted")).toContainText("best 100%");
});
