const categories = ["Сөзді оқу", "Буын", "Сөйлем", "Тыңдап жаз", "Мәтінді оқу"];

const initialTasks = [
  { type: "Сөзді оқу", question: "Дұрыс сөзді таңда", word: "ҚАЛАМ", options: ["Қалам", "Қаламм"], answer: "Қалам" },
  { type: "Сөзді оқу", question: "Дұрыс сөзді таңда", word: "МЕКТЕП", options: ["Мектеп", "Мектеб"], answer: "Мектеп" },
  { type: "Буын", question: "Дұрыс буынды таңда", word: "ҚА", options: ["Қа", "Ка"], answer: "Қа" },
  { type: "Буын", question: "Дұрыс буынды таңда", word: "ӘКЕ", options: ["Ә-ке", "А-ке"], answer: "Ә-ке" },
  { type: "Сөйлем", question: "Дұрыс сөйлемді таңда", word: "Мен мектепке барамын.", options: ["Мен мектепке барамын.", "Мен мектепке барады."], answer: "Мен мектепке барамын." },
  { type: "Сөйлем", question: "Дұрыс сөйлемді таңда", word: "Мен кітап оқимын.", options: ["Мен кітап оқимын.", "Мен кітап оқиды."], answer: "Мен кітап оқимын." },
  { type: "Тыңдап жаз", question: "Сөзді тыңда және жаз", word: "мектеп", answer: "мектеп" },
  { type: "Тыңдап жаз", question: "Сөзді тыңда және жаз", word: "мұғалім", answer: "мұғалім" },
  { type: "Мәтінді оқу", text: "Менің атым — Аян.\nМен жетінші сыныпта оқимын.\nМенің мектебім үлкен.", question: "Аян нешінші сыныпта оқиды?", options: ["5-сыныпта", "7-сыныпта", "8-сыныпта"], answer: "7-сыныпта" },
  { type: "Мәтінді оқу", text: "Айша таңертең мектепке барды.\nОл сөмкесіне кітабын және дәптерін салды.", question: "Айша қайда барды?", options: ["Мектепке", "Дүкенге", "Саябаққа"], answer: "Мектепке" }
];

const finalTasks = [
  { type: "Сөзді оқу", question: "Дұрыс сөзді таңда", word: "ДӘПТЕР", options: ["Дәптер", "Дәптерр"], answer: "Дәптер" },
  { type: "Сөзді оқу", question: "Дұрыс сөзді таңда", word: "МҰҒАЛІМ", options: ["Мұғалім", "Муғалім"], answer: "Мұғалім" },
  { type: "Буын", question: "Дұрыс буынды таңда", word: "ҒА", options: ["Ға", "Га"], answer: "Ға" },
  { type: "Буын", question: "Дұрыс буынды таңда", word: "ҮЙ", options: ["Үй", "Уй"], answer: "Үй" },
  { type: "Сөйлем", question: "Дұрыс сөйлемді таңда", word: "Мен кітапханаға барамын.", options: ["Мен кітапханаға барамын.", "Мен кітапханаға барады."], answer: "Мен кітапханаға барамын." },
  { type: "Сөйлем", question: "Дұрыс сөйлемді таңда", word: "Ол мектепте оқиды.", options: ["Ол мектепте оқиды.", "Ол мектепте оқимын."], answer: "Ол мектепте оқиды." },
  { type: "Тыңдап жаз", question: "Сөзді тыңда және жаз", word: "дәптер", answer: "дәптер" },
  { type: "Тыңдап жаз", question: "Сөзді тыңда және жаз", word: "мұғалім", answer: "мұғалім" },
  { type: "Мәтінді оқу", text: "Менің атым — Марат.\nМен жетінші сыныпта оқимын.\nМен кітап оқығанды жақсы көремін.", question: "Марат нешінші сыныпта оқиды?", options: ["5-сыныпта", "7-сыныпта", "8-сыныпта"], answer: "7-сыныпта" },
  { type: "Мәтінді оқу", text: "Сәуле мектепке ерте келді.\nОл кітаптарын сөмкесіне салды.", question: "Сәуле қайда келді?", options: ["Мектепке", "Дүкенге", "Ауылға"], answer: "Мектепке" }
];

const practiceBank = {
  "Сөзді оқу": [
    { type: "Сөзді оқу", question: "Дұрыс сөзді таңда", word: "ДОС", options: ["Дос", "Досс"], answer: "Дос" },
    { type: "Сөзді оқу", question: "Дұрыс сөзді таңда", word: "ҚҰС", options: ["Құс", "Кұс"], answer: "Құс" }
  ],
  "Буын": [
    { type: "Буын", question: "Дұрыс буынды таңда", word: "КҮ", options: ["Кү", "Ку"], answer: "Кү" },
    { type: "Буын", question: "Дұрыс буынды таңда", word: "ОҚУ", options: ["О-қу", "Ө-ку"], answer: "О-қу" }
  ],
  "Сөйлем": [
    { type: "Сөйлем", question: "Дұрыс сөйлемді таңда", word: "Ол кітап оқиды.", options: ["Ол кітап оқиды.", "Ол кітап оқимын."], answer: "Ол кітап оқиды." },
    { type: "Сөйлем", question: "Дұрыс сөйлемді таңда", word: "Мен досыммен ойнаймын.", options: ["Мен досыммен ойнаймын.", "Мен досыммен ойнайды."], answer: "Мен досыммен ойнаймын." }
  ],
  "Тыңдап жаз": [
    { type: "Тыңдап жаз", question: "Сөзді тыңда және жаз", word: "қалам", answer: "қалам" },
    { type: "Тыңдап жаз", question: "Сөзді тыңда және жаз", word: "кітап", answer: "кітап" }
  ],
  "Мәтінді оқу": [
    { type: "Мәтінді оқу", text: "Нұрлан кітапханаға барды.\nОл қазақ тіліндегі кітапты алды.", question: "Нұрлан қайда барды?", options: ["Кітапханаға", "Дүкенге"], answer: "Кітапханаға" },
    { type: "Мәтінді оқу", text: "Әлия мектепке ерте келді.\nОл сабағына дайындалды.", question: "Әлия мектепке қашан келді?", options: ["Ерте", "Кеш"], answer: "Ерте" }
  ]
};

const app = document.querySelector("#app");
const storageKey = "qazaqTiliResearchLog";
let session = null;

document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#start-form").addEventListener("submit", event => {
  event.preventDefault();
  const name = new FormData(event.currentTarget).get("studentName").trim();
  if (name) beginDiagnostic(name, "initial");
});

document.addEventListener("click", event => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;
  if (action === "focus-start") {
    document.querySelector("#start").scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => document.querySelector("#student-name")?.focus(), 450);
  }
  if (action === "open-log") showResearchLog();
  if (action === "open-results") showResearchSummary();
  if (action === "home") location.reload();
  if (action === "practice") startPractice();
  if (action === "final") beginDiagnostic(session.name, "final");
});

function blankStats() {
  return Object.fromEntries(categories.map(category => [category, { correct: 0, total: 0 }]));
}

function beginDiagnostic(name, mode) {
  session = { name, mode, tasks: mode === "final" ? finalTasks : initialTasks, index: 0, correct: 0, stats: blankStats() };
  renderTask();
  app.scrollIntoView({ behavior: "smooth", block: "center" });
}

function renderTask() {
  if (session.index >= session.tasks.length) return finishRound();
  const task = session.tasks[session.index];
  const progress = Math.round((session.index / session.tasks.length) * 100);
  app.innerHTML = `
    <div class="app-panel">
      <div class="app-topline"><p>${session.mode === "practice" ? "Жеке жаттығу" : session.mode === "final" ? "Қорытынды диагностика" : "Бастапқы диагностика"} · ${session.index + 1}/${session.tasks.length}</p><div class="app-progress"><span style="width:${progress}%"></span></div></div>
      <span class="task-badge">${task.type}</span>
      ${task.text ? `<div class="reading-text">${escapeHtml(task.text)}</div>` : ""}
      <h2 class="task-title">${escapeHtml(task.question)}</h2>
      ${task.word && task.type !== "Тыңдап жаз" && task.type !== "Сөйлем" ? `<div class="task-word">${escapeHtml(task.word)}</div>` : ""}
      ${task.type === "Тыңдап жаз" ? writingTemplate(task) : optionsTemplate(task)}
      <p class="feedback" id="feedback" role="status"></p>
    </div>`;

  app.querySelectorAll(".answer").forEach(button => button.addEventListener("click", () => submitAnswer(button.dataset.answer, button)));
  app.querySelector("#listen")?.addEventListener("click", () => speak(task.word));
  app.querySelector("#writing-form")?.addEventListener("submit", event => {
    event.preventDefault();
    const value = event.currentTarget.elements.answer.value.trim();
    if (value) submitAnswer(value);
  });
}

function optionsTemplate(task) {
  return `<div class="answers">${task.options.map(option => `<button class="answer" type="button" data-answer="${escapeAttr(option)}">${escapeHtml(option)}</button>`).join("")}</div>`;
}

function writingTemplate() {
  return `<form class="listen-row" id="writing-form"><button class="listen-button" id="listen" type="button">🔊 Тыңдау</button><input class="answer-input" name="answer" autocomplete="off" placeholder="Естіген сөзіңді жаз" aria-label="Жауап"><button class="button button-primary" type="submit">Тексеру</button></form>`;
}

function submitAnswer(value, selectedButton) {
  const task = session.tasks[session.index];
  const correct = value.toLocaleLowerCase("kk-KZ") === task.answer.toLocaleLowerCase("kk-KZ");
  const feedback = app.querySelector("#feedback");
  session.stats[task.type].total += 1;
  app.querySelectorAll("button, input").forEach(control => control.disabled = true);
  if (correct) {
    session.correct += 1;
    session.stats[task.type].correct += 1;
    selectedButton?.classList.add("correct");
    feedback.className = "feedback good";
    feedback.textContent = "✓ Дұрыс! Жарайсың!";
  } else {
    selectedButton?.classList.add("wrong");
    feedback.className = "feedback bad";
    feedback.textContent = `Қате. Дұрыс жауап: ${task.answer}`;
  }
  setTimeout(() => { session.index += 1; renderTask(); }, 900);
}

function finishRound() {
  const percent = Math.round(session.correct / session.tasks.length * 100);
  if (session.mode === "practice") return showPracticeResult(percent);
  const log = getLog();
  if (session.mode === "initial") {
    log.push({ id: Date.now(), name: session.name, date: new Date().toLocaleDateString("kk-KZ"), initial: percent, initialStats: session.stats });
  } else {
    const record = [...log].reverse().find(item => item.name === session.name && item.final === undefined);
    if (record) { record.final = percent; record.finalStats = session.stats; }
  }
  saveLog(log);
  showRoundResult(percent);
}

function showRoundResult(percent) {
  const weak = categories.filter(category => session.stats[category].total && categoryPercent(session.stats[category]) < 70);
  app.innerHTML = `<div class="app-panel">
    <span class="task-badge">Нәтиже дайын</span>
    <h2 class="task-title">${session.mode === "final" ? "Қорытынды диагностика аяқталды" : `Жарайсың, ${escapeHtml(session.name)}!`}</h2>
    <div class="result-grid"><div class="metric"><small>Жалпы нәтиже</small><strong>${percent}%</strong></div><div class="metric"><small>Дұрыс жауап</small><strong>${session.correct}</strong></div><div class="metric"><small>Қате жауап</small><strong>${session.tasks.length - session.correct}</strong></div></div>
    <div class="category-list">${categoryRows(session.stats)}</div>
    <div class="recommendation">${weak.length ? `<strong>Жаттығатын бағыт:</strong> ${weak.join(", ")}.` : "Керемет нәтиже! Негізгі дағдылар жақсы қалыптасқан."}</div>
    <div class="hero-actions">${session.mode === "initial" && weak.length ? `<button class="button button-primary" data-action="practice">Жеке жаттығу</button>` : ""}${session.mode === "final" ? `<button class="button button-primary" data-action="open-results">Нәтижелерді салыстыру</button>` : ""}<button class="button button-secondary" data-action="home">Басты бетке</button></div>
  </div>`;
}

function startPractice() {
  const weak = categories.filter(category => session.stats[category].total && categoryPercent(session.stats[category]) < 70);
  const chosen = weak[0] || categories[0];
  session = { ...session, mode: "practice", practiceCategory: chosen, tasks: practiceBank[chosen], index: 0, correct: 0, stats: blankStats() };
  renderTask();
}

function showPracticeResult(percent) {
  app.innerHTML = `<div class="app-panel"><span class="task-badge">Жеке жаттығу</span><h2 class="task-title">${escapeHtml(session.practiceCategory)} бағыты аяқталды</h2><div class="result-grid"><div class="metric"><small>Нәтиже</small><strong>${percent}%</strong></div><div class="metric"><small>Дұрыс</small><strong>${session.correct}/${session.tasks.length}</strong></div></div><div class="recommendation">${percent >= 70 ? "Жақсы жұмыс! Енді қорытынды диагностикамен өсіміңді тексер." : "Бұл дағдыны тағы да қайталауға болады. Қорытынды диагностикаға дайын болсаң, жалғастыр."}</div><div class="hero-actions"><button class="button button-primary" data-action="final">Қорытынды диагностика</button><button class="button button-secondary" data-action="home">Басты бетке</button></div></div>`;
}

function showResearchLog() {
  const log = getLog();
  app.innerHTML = `<div class="app-panel"><span class="task-badge">Зерттеу журналы</span><h2 class="task-title">Оқушылар нәтижелері</h2>${log.length ? `<div class="table-wrap"><table class="research-table"><thead><tr><th>№</th><th>Оқушы</th><th>Күні</th><th>Бастапқы</th><th>Қорытынды</th><th>Өзгеріс</th></tr></thead><tbody>${log.map((item, index) => `<tr><td>${index + 1}</td><td>${escapeHtml(item.name)}</td><td>${item.date}</td><td>${item.initial}%</td><td>${item.final ?? "—"}${item.final !== undefined ? "%" : ""}</td><td>${item.final !== undefined ? signed(item.final - item.initial) + "%" : "—"}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty-state">Әзірге сақталған нәтиже жоқ.</div>`}<div class="hero-actions"><button class="button button-secondary" data-action="home">Басты бетке</button></div></div>`;
  app.scrollIntoView({ behavior: "smooth", block: "center" });
}

function showResearchSummary() {
  const complete = getLog().filter(item => item.final !== undefined);
  if (!complete.length) {
    app.innerHTML = `<div class="app-panel"><span class="task-badge">Зерттеу нәтижелері</span><h2 class="task-title">Салыстыруға дерек жеткіліксіз</h2><div class="recommendation">Алдымен бастапқы және қорытынды диагностиканы аяқтау қажет.</div><button class="button button-secondary" data-action="home">Басты бетке</button></div>`;
  } else {
    const initial = Math.round(complete.reduce((sum, item) => sum + item.initial, 0) / complete.length);
    const final = Math.round(complete.reduce((sum, item) => sum + item.final, 0) / complete.length);
    app.innerHTML = `<div class="app-panel"><span class="task-badge">Зерттеу нәтижелері</span><h2 class="task-title">Орташа нәтиже динамикасы</h2><div class="result-grid"><div class="metric"><small>Бастапқы</small><strong>${initial}%</strong></div><div class="metric"><small>Қорытынды</small><strong>${final}%</strong></div><div class="metric"><small>Өзгеріс</small><strong>${signed(final - initial)}%</strong></div></div><div class="recommendation">Салыстыру ${complete.length} толық аяқталған диагностика негізінде жасалды.</div><div class="hero-actions"><button class="button button-secondary" data-action="open-log">Журналды ашу</button><button class="button button-secondary" data-action="home">Басты бетке</button></div></div>`;
  }
  app.scrollIntoView({ behavior: "smooth", block: "center" });
}

function categoryRows(stats) {
  return categories.filter(category => stats[category].total).map(category => { const value = categoryPercent(stats[category]); return `<div class="category-row"><header><span>${category}</span><span>${value}%</span></header><div class="bar"><span style="width:${value}%"></span></div></div>`; }).join("");
}
function categoryPercent(stat) { return Math.round(stat.correct / stat.total * 100); }
function getLog() { try { return JSON.parse(localStorage.getItem(storageKey)) || []; } catch { return []; } }
function saveLog(log) { localStorage.setItem(storageKey, JSON.stringify(log)); }
function signed(value) { return `${value >= 0 ? "+" : ""}${value}`; }
function speak(word) { if (!("speechSynthesis" in window)) return alert("Бұл браузерде дыбыстау қолжетімсіз."); const utterance = new SpeechSynthesisUtterance(word); utterance.lang = "kk-KZ"; utterance.rate = .8; speechSynthesis.cancel(); speechSynthesis.speak(utterance); }
function escapeHtml(value) { return String(value).replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]); }
function escapeAttr(value) { return escapeHtml(value).replace(/'/g, "&#39;"); }
