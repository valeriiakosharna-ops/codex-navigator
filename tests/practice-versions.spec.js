import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { compareLabs, bumpType } from "../scripts/check-labs.mjs";

const BASE = "http://localhost:4322";
const LAB1 = `${BASE}/getting-started/lab-first-session/`;
const KEY = "lx:codex-navigator:0.0:getting-started/lab-first-session:lab1-l1:anon";
const manifest = JSON.parse(fs.readFileSync("dist/manifest.json", "utf8"));
const fp = manifest.labs.find((l) => l.id === "lab1-l1").fp;

test("changed practice: unfinished attempt is reset, best score kept, notice shown", async ({ page }) => {
  await page.goto(LAB1);
  await page.evaluate((k) => localStorage.setItem(k, JSON.stringify({
    fp: "0000000000", cv: 1, best: 0.8, attemptsUsed: 1,
    run: { attempt: 1, step: "gone-step", path: [{ step: "gone-step", choice: 7, rating: "optimal" }], evidence: [], flags: [], visited: ["gone-step"], pending: null, shown: 1, stopped: null },
  })), KEY);
  await page.reload();
  const w = page.locator("#lab1-l1");
  await expect(w.locator(".notice")).toContainText("best result (80%) is kept");
  await expect(w.getByRole("button", { name: "Start scenario" })).toBeVisible();
  const st = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), KEY);
  expect(st).toMatchObject({ best: 0.8, carried: true, fp, cv: 1, run: null });
  // the page still counts it as done (grade never drops) and level 2 stays unlocked
  await expect(page.locator("#lab1-l2 .locked")).toHaveCount(0);
  // any action dismisses the notice
  await w.getByRole("button", { name: "Start scenario" }).click();
  await expect(w.locator(".notice")).toHaveCount(0);
});

test("unchanged practice keeps progress; legacy saves (before versioning) are adopted", async ({ page }) => {
  await page.goto(LAB1);
  await page.evaluate((k) => localStorage.setItem(k, JSON.stringify({ best: 1, attemptsUsed: 1, run: null,
    last: { attempt: 0, step: "done", path: [{ step: "setup", choice: 0, rating: "optimal" }], evidence: [], flags: [], visited: ["setup"], final: 1, dims: { decisions: 1, process: 1, efficiency: 1, investigative: false, critical: false } } })), KEY);
  await page.reload();
  const w = page.locator("#lab1-l1");
  await expect(w.locator(".notice")).toHaveCount(0);
  await expect(w.locator(".score b")).toHaveText("100%");
  expect(await page.evaluate((k) => JSON.parse(localStorage.getItem(k)).fp, KEY)).toBe(fp);
});

test("release check: structural change in a patch release is flagged", () => {
  const old = { version: "1.2.0", labs: [{ id: "a", page: "p", version: 1, fp: "x" }, { id: "b", page: "p", version: 1, fp: "y" }] };
  const sameVersion = { version: "1.2.1", labs: [{ id: "a", page: "p", version: 1, fp: "CHANGED" }, { id: "b", page: "p", version: 1, fp: "y" }] };
  const msgs = compareLabs(old, sameVersion, bumpType(old.version, sameVersion.version)).map((f) => f.level + ": " + f.msg);
  expect(msgs.some((m) => m.startsWith("warning") && m.includes("still 1"))).toBe(true); // forgot to bump version
  expect(msgs.some((m) => m.startsWith("warning") && m.includes("PATCH"))).toBe(true);
  const minor = { version: "1.3.0", labs: [{ id: "a", page: "p", version: 2, fp: "CHANGED" }, { id: "b", page: "p", version: 1, fp: "y" }] };
  const m2 = compareLabs(old, minor, bumpType(old.version, minor.version));
  expect(m2.filter((f) => f.level === "warning")).toEqual([]);
  expect(m2[0].msg).toContain("v1 → v2");
  expect(compareLabs(old, { version: "1.2.1", labs: old.labs }, "patch")).toEqual([]);
});

test("/versions/ shows practices by release", async ({ page }) => {
  await page.goto("http://localhost:4401/codex-navigator/versions/");
  await expect(page.getByRole("heading", { name: "Practices by release" })).toBeVisible();
  await expect(page.locator("table.pr")).toContainText("lab2-l3");
});
