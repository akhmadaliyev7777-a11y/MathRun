function initQuiz() {
  const gradeId = getQueryParam("sinf");
  const subjectId = getQueryParam("fan");
  const topicId = getQueryParam("mavzu");
  const key = gradeId + "|" + subjectId + "|" + topicId;

  const grade = findGrade(gradeId);
  const subject = grade ? findSubject(grade, subjectId) : null;
  const topic = subject ? findTopic(subject, topicId) : null;

  const backLink = document.getElementById("quiz-back-link");
  if (topic) backLink.href = topicHref(gradeId, subjectId, topicId);

  const questions = QUIZ_DATA[key];
  const card = document.getElementById("quiz-card");
  const progressEl = document.getElementById("quiz-progress");

  if (!questions || questions.length === 0) {
    progressEl.innerHTML = "";
    card.innerHTML = '<div class="placeholder">🚧 Bu mavzu uchun test hali tayyor emas</div>';
    return;
  }

  let current = 0;
  let score = 0;
  let answered = false;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function renderProgress() {
    progressEl.innerHTML = questions.map(function (_, i) {
      let cls = "dot";
      if (i < current) cls += " done";
      else if (i === current) cls += " active";
      return '<span class="' + cls + '"></span>';
    }).join("");
  }

  function renderQuestion() {
    answered = false;
    renderProgress();
    const q = questions[current];
    const shuffledOptions = shuffle(q.options);

    card.innerHTML =
      '<div class="quiz-level">Daraja ' + q.level + ' / 10</div>' +
      '<h2 class="quiz-question">' + q.question + '</h2>' +
      '<div class="quiz-options">' +
        shuffledOptions.map(function (opt, i) {
          return '<button class="quiz-option" data-i="' + i + '">' + opt + '</button>';
        }).join("") +
      '</div>' +
      '<div class="quiz-feedback" id="quiz-feedback"></div>';

    const buttons = Array.prototype.slice.call(card.querySelectorAll(".quiz-option"));
    buttons.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        if (answered) return;
        answered = true;
        const chosen = shuffledOptions[i];
        const isCorrect = chosen === q.answer;
        if (isCorrect) score++;

        buttons.forEach(function (b, j) {
          if (shuffledOptions[j] === q.answer) b.classList.add("correct");
          else if (j === i) b.classList.add("wrong");
          b.disabled = true;
        });

        const feedback = document.getElementById("quiz-feedback");
        feedback.innerHTML =
          '<div class="feedback-text ' + (isCorrect ? "correct-text" : "wrong-text") + '">' +
            (isCorrect ? "✓ To'g'ri!" : "✗ Noto'g'ri. To'g'ri javob: " + q.answer) +
          '</div>' +
          '<button class="quiz-next" id="quiz-next-btn">' +
            (current === questions.length - 1 ? "Yakunlash" : "Keyingi savol →") +
          '</button>';

        document.getElementById("quiz-next-btn").addEventListener("click", function () {
          current++;
          if (current < questions.length) renderQuestion();
          else renderResult();
        });
      });
    });
  }

  function renderResult() {
    current = questions.length;
    renderProgress();
    const percent = Math.round((score / questions.length) * 100);
    let message = "Yaxshi urinish! Yana mashq qiling.";
    if (percent === 100) message = "Ajoyib! Barcha savollarga to'g'ri javob berdingiz! \u{1F389}";
    else if (percent >= 70) message = "Zo'r natija! \u{1F44F}";

    card.innerHTML =
      '<div class="quiz-result">' +
        '<div class="quiz-result-score">' + score + ' / ' + questions.length + '</div>' +
        '<p class="quiz-result-message">' + message + '</p>' +
        '<div class="quiz-result-actions">' +
          '<button class="quiz-next" id="quiz-restart-btn">Qayta boshlash</button>' +
          (topic ? '<a class="quiz-back-btn" href="' + topicHref(gradeId, subjectId, topicId) + '">Mavzuga qaytish</a>' : "") +
        '</div>' +
      '</div>';

    document.getElementById("quiz-restart-btn").addEventListener("click", function () {
      current = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
}
