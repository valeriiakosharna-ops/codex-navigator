// Pages are split into slides; open the slide that contains `selector` before interacting with it.
export async function showSlide(target, selector) {
  await target.locator(selector).first().evaluate((el) => {
    const slide = el.closest(".lx-slide");
    if (!slide || !slide.hidden) return;
    const all = [...document.querySelectorAll(".lx-slide")];
    document.querySelectorAll(".lx-step")[all.indexOf(slide)].click();
  });
}

// Answer a paged quiz: one question at a time, then "Next question".
export async function answerQuiz(quiz, answers) {
  for (let i = 0; i < answers.length; i++) {
    for (const oi of [].concat(answers[i])) await quiz.locator(".paged label.opt").nth(oi).click();
    await quiz.getByRole("button", { name: "Check answer" }).click();
    if (i < answers.length - 1) await quiz.getByRole("button", { name: /Next question/ }).click();
  }
}
