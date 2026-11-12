---
title: "Lab: reviewing the agent's work"
summary: Find what the agent got wrong before it ships, then investigate a bug the agent introduced.
duration: 35 min
audience: [technical]
---

## How this lab works

The agent writes code fast. Your value is in **noticing** what is wrong. Three levels:

- **Level 1**: a short diff. You are told how many problems there are.
- **Level 2**: you aren't told how many, you must rate how serious each one is, and some lines only *look* wrong.
- **Level 3**: an investigation with a limited budget. What do you check, and what do you ask Codex to do?

False alarms cost points. Flagging everything isn't a strategy.

```spot
id: lab2-l1
title: '"Refactored the profile loader"'
level: 1
prompt: Codex says it "simplified the profile loader". Review the diff before approving.
view: diff
filename: src/profile/load.ts
code: |2
   import { fetchUser } from "./api";
  -const API_KEY = process.env.API_KEY;
  +const API_KEY = "sk-live-51Hx9QeLx2Vb7";
  
   export async function getProfile(id) {
  -  if (!id) throw new Error("id required");
     const user = await fetchUser(id, API_KEY);
     return { name: user.name, email: user.email };
   }
issues:
  - line: 3
    severity: critical
    label: Secret hard-coded in source
    explain: A live API key is now committed to the repository. Reject, rotate the key, and keep reading it from the environment.
  - line: 6
    severity: major
    label: Input validation removed
    explain: The guard against a missing id was deleted without a reason. "Simplify" must not change behaviour.
```

```spot
id: lab2-l2
title: '"Fixed the failing tests"'
level: 2
unlock: { after: lab2-l1 }
prompt: The discount tests were red. Codex says "all tests pass now". Review what it changed. Some changes are fine.
view: diff
filename: tests/total.test.ts
code: |2
   describe("calculateTotal", () => {
     it("applies 10% discount over 100", () => {
  -    expect(calculateTotal(200)).toBe(180);
  +    expect(calculateTotal(200)).toBe(200);
     });
  
  -  it("rejects negative amounts", () => {
  -    expect(() => calculateTotal(-5)).toThrow();
  -  });
  +  it.skip("rejects negative amounts", () => {
  +    expect(() => calculateTotal(-5)).toThrow();
  +  });
  
     it("handles zero", () => {
  -    expect(calculateTotal(0)).toBe(0);
  +    expect(calculateTotal(0)).toEqual(0);
     });
   });
issues:
  - line: 4
    severity: critical
    label: Assertion changed to match the bug
    explain: The test now expects *no* discount. The code is wrong and the test was bent to agree with it. This is the classic way agents "make tests pass".
  - line: 10
    to: 12
    severity: major
    label: Test skipped instead of fixed
    explain: "`it.skip` silently removes a safety check. Skips need an explicit reason and a ticket. Ask the agent to fix the behaviour instead."
decoys:
  - line: 16
    explain: "`toEqual(0)` and `toBe(0)` behave the same for numbers. It's a harmless style change."
  - line: 3
    explain: That's the removed old line. The problem is what replaced it on line 4.
```

```scenario
id: lab2-l3
title: Flaky after the agent's refactor
level: 3
unlock: { after: lab2-l2 }
budget: 4
vars:
  test: [test_checkout_total, test_cart_total, test_invoice_sum]
intro: |
  Last week Codex refactored the pricing cache. Since then `{{test}}` fails in roughly one of five CI runs.
  The release is tomorrow. You have 4 investigation actions; some cost more than others.
start: investigate
steps:
  investigate:
    title: Diagnose before you act
    situation: What do you ask Codex to do?
    evidence:
      - id: ci-log
        label: Open the failed CI log
        key: true
        output: |
          FAILED tests/test_pricing.py::{{test}}
          AssertionError: expected total 120.00, got 100.00
          [pricing] cache HIT key=product:42 age=2.1s
      - id: history
        label: git log -3 -- src/pricing/
        key: true
        output: |
          9f2a1d3 refactor: unify pricing cache (codex)
          41bb0e2 add product bundles
          c0ffee1 typo in docstring
      - id: loop
        label: Run the test 50 times locally
        key: true
        cost: 2
        output: |
          50 runs: 41 passed, 9 failed   (fails only when the price update test runs first)
      - id: once
        label: Run the test once locally
        output: |
          1 passed in 0.84s
      - id: agents
        label: cat AGENTS.md
        output: |
          - run `pytest -q` before finishing
          - never change assertions to make tests pass
    choices:
      - text: Ask Codex to reproduce it in a loop, find the root cause in the cache refactor, and fix it without touching assertions. Done when 50 consecutive runs pass
        rating: optimal
        needs: [loop, ci-log]
        explain: Reproduce, root cause, a fix that keeps the assertions, and a measurable finish line. The evidence points at stale cache entries after a price update.
        next: fix
      - text: '"Make {{test}} pass"'
        rating: risky
        explain: Without the root cause or constraints, the cheapest way to "pass" is to weaken the test.
        next: agent-shortcut
      - text: Skip the test so the release isn't blocked
        rating: critical
        explain: This is a money calculation. Skipping it ships a real pricing bug to customers.
        end: true
      - text: Revert the refactor commit and release without it
        rating: acceptable
        needs: [history]
        explain: A reasonable emergency move if the release is critical, but the bug comes back the moment the refactor returns. Pair the revert with a root-cause task.
        next: fix
  agent-shortcut:
    title: The agent's "fix"
    situation: Codex replies "Fixed" and the diff adds `@retry(times=3)` to the test function.
    choices:
      - text: Accept. The test is green now
        rating: critical
        explain: The retry hides a real stale-price bug. Customers will occasionally pay the old price.
        end: true
      - text: Reject it, share the CI log, and ask for the root cause with "no retries, no assertion changes"
        rating: acceptable
        explain: You recovered, but one round-trip was wasted because the first request had no constraints.
        next: fix
  fix:
    title: Choosing the fix
    situation: "Codex found it: price updates don't invalidate the cache entry. It proposes three fixes."
    choices:
      - text: Invalidate the product's cache entry whenever its price changes, and add a regression test for update→read
        rating: optimal
        explain: It fixes the cause and locks it in with a test.
        next: end
      - text: Add `sleep(3)` in the test before reading the price
        rating: risky
        explain: Timing hacks make tests slower and still flaky. Production stays broken.
        next: end
      - text: Lower the cache TTL from 60 s to 1 s
        rating: risky
        explain: It shrinks the window but doesn't close it, and it hurts performance. That's a symptom fix.
        next: end
  end:
    ending: true
    situation: The fix is merged. Open the debrief.
```
