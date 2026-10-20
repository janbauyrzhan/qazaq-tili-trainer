const categories = ["�?��? �?�", "���", "�?����", "��?��� ���", "�?�?��? �?�"];

const initialTasks = [
  { type: "�?��? �?�", question: "�?��� �?��? �?��", word: "?����", options: ["?����", "?�����"], answer: "?����" },
  { type: "�?��? �?�", question: "�?��� �?��? �?��", word: "������", options: ["���⥯", "���⥡"], answer: "���⥯" },
  { type: "���", question: "�?��� ��뭤� �?��", word: "?�", options: ["?�", "��"], answer: "?�" },
  { type: "���", question: "�?��� ��뭤� �?��", word: "?��", options: ["?-��", "�-��"], answer: "?-��" },
  { type: "�?����", question: "�?��� �?�����? �?��", word: "��� ���⥯�� ��ࠬ�.", options: ["��� ���⥯�� ��ࠬ�.", "��� ���⥯�� ��ࠤ�."], answer: "��� ���⥯�� ��ࠬ�." },
  { type: "�?����", question: "�?��� �?�����? �?��", word: "��� �?⠯ �?���.", options: ["��� �?⠯ �?���.", "��� �?⠯ �?���."], answer: "��� �?⠯ �?���." },
  { type: "��?��� ���", question: "�?��? ��?�� �?�� ���", word: "���⥯", answer: "���⥯" },
  { type: "��?��� ���", question: "�?��? ��?�� �?�� ���", word: "�??��?�", answer: "�??��?�" },
  { type: "�?�?��? �?�", text: "���?? ��� - ��.\n��� ���?��? ���� �?���.\n���?? ���⥡?� ?����.", question: "�� ���?��? ���� �?���?", options: ["5-����", "7-����", "8-����"], answer: "7-����" },
  { type: "�?�?��? �?�", text: "��� �?���? ���⥯�� ����.\n�� �?����?�� �?⠡� �?�� �?���?� ᠫ��.", question: "��� ?���� ����?", options: ["���⥯��", "�?�����", "��??�"], answer: "���⥯��" }
];

const finalTasks = [
  { type: "�?��? �?�", question: "�?��� �?��? �?��", word: "�?����", options: ["�?���", "�?����"], answer: "�?���" },
  { type: "�?��? �?�", question: "�?��� �?��? �?��", word: "�??��?�", options: ["�??��?�", "��?��?�"], answer: "�??��?�" },
  { type: "���", question: "�?��� ��뭤� �?��", word: "?�", options: ["?�", "��"], answer: "?�" },
  { type: "���", question: "�?��� ��뭤� �?��", word: "?�", options: ["?�", "��"], answer: "?�" },
  { type: "�?����", question: "�?��� �?�����? �?��", word: "��� �?⠯堭�?� ��ࠬ�.", options: ["��� �?⠯堭�?� ��ࠬ�.", "��� �?⠯堭�?� ��ࠤ�."], answer: "��� �?⠯堭�?� ��ࠬ�." },
  { type: "�?����", question: "�?��� �?�����? �?��", word: "�� ���⥯� �?���.", options: ["�� ���⥯� �?���.", "�� ���⥯� �?���."], answer: "�� ���⥯� �?���." },
  { type: "��?��� ���", question: "�?��? ��?�� �?�� ���", word: "�?���", answer: "�?���" },
  { type: "��?��� ���", question: "�?��? ��?�� �?�� ���", word: "�??��?�", answer: "�??��?�" },
  { type: "�?�?��? �?�", text: "���?? ��� - ����.\n��� ���?��? ���� �?���.\n��� �?⠯ �?�?���� ��?�� �?६?�.", question: "���� ���?��? ���� �?���?", options: ["5-����", "7-����", "8-����"], answer: "7-����" },
  { type: "�?�?��? �?�", text: "�?㫥 ���⥯�� ��� ����?.\n�� �?⠯��� �?����?�� ᠫ��.", question: "�?㫥 ?���� ����??", options: ["���⥯��", "�?�����", "���?�"], answer: "���⥯��" }
];

const practiceBank = {
  "�?��? �?�": [
    { type: "�?��? �?�", question: "�?��� �?��? �?��", word: "���", options: ["���", "����"], answer: "���" },
    { type: "�?��? �?�", question: "�?��� �?��? �?��", word: "??�", options: ["??�", "�?�"], answer: "??�" }
  ],
  "���": [
    { type: "���", question: "�?��� ��뭤� �?��", word: "�?", options: ["�?", "��"], answer: "�?" },
    { type: "���", question: "�?��� ��뭤� �?��", word: "�?�", options: ["�-?�", "?-��"], answer: "�-?�" }
  ],
  "�?����": [
    { type: "�?����", question: "�?��� �?�����? �?��", word: "�� �?⠯ �?���.", options: ["�� �?⠯ �?���.", "�� �?⠯ �?���."], answer: "�� �?⠯ �?���." },
    { type: "�?����", question: "�?��� �?�����? �?��", word: "��� ���묬�� �������.", options: ["��� ���묬�� �������.", "��� ���묬�� �������."], answer: "��� ���묬�� �������." }
  ],
  "��?��� ���": [
    { type: "��?��� ���", question: "�?��? ��?�� �?�� ���", word: "?����", answer: "?����" },
    { type: "��?��� ���", question: "�?��? ��?�� �?�� ���", word: "�?⠯", answer: "�?⠯" }
  ],
  "�?�?��? �?�": [
    { type: "�?�?��? �?�", text: "�?ૠ� �?⠯堭�?� ����.\n�� ?���? �?�?����? �?⠯�� ����.", question: "�?ૠ� ?���� ����?", options: ["�?⠯堭�?�", "�?�����"], answer: "�?⠯堭�?�" },
    { type: "�?�?��? �?�", text: "?��� ���⥯�� ��� ����?.\n�� ᠡ�?뭠 ���뭤����.", question: "?��� ���⥯�� ?�蠭 ����??", options: ["���", "���"], answer: "���" }
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
      <div class="app-topline"><p>${session.mode === "practice" ? "���� �����?�" : session.mode === "final" ? "?����뭤� �������⨪�" : "���⠯?� �������⨪�"} � ${session.index + 1}/${session.tasks.length}</p><div class="app-progress"><span style="width:${progress}%"></span></div></div>
      <span class="task-badge">${task.type}</span>
      ${task.text ? `<div class="reading-text">${escapeHtml(task.text)}</div>` : ""}
      <h2 class="task-title">${escapeHtml(task.question)}</h2>
      ${task.word && task.type !== "��?��� ���" ? `<div class="task-word">${escapeHtml(task.word)}</div>` : ""}
      ${task.type === "��?��� ���" ? writingTemplate(task) : optionsTemplate(task)}
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
  return `<form class="listen-row" id="writing-form"><button class="listen-button" id="listen" type="button">?? ��?���</button><input class="answer-input" name="answer" autocomplete="off" placeholder="���?��� �?�??�? ���" aria-label="��㠯"><button class="button button-primary" type="submit">������</button></form>`;
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
    feedback.textContent = "? �?���! ��ࠩ��?!";
  } else {
    selectedButton?.classList.add("wrong");
    feedback.className = "feedback bad";
    feedback.textContent = `?��. �?��� ��㠯: ${task.answer}`;
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
    <span class="task-badge">�?⨦� ����</span>
    <h2 class="task-title">${session.mode === "final" ? "?����뭤� �������⨪� ��?⠫��" : `��ࠩ��?, ${escapeHtml(session.name)}!`}</h2>
    <div class="result-grid"><div class="metric"><small>����� �?⨦�</small><strong>${percent}%</strong></div><div class="metric"><small>�?��� ��㠯</small><strong>${session.correct}</strong></div><div class="metric"><small>?�� ��㠯</small><strong>${session.tasks.length - session.correct}</strong></div></div>
    <div class="category-list">${categoryRows(session.stats)}</div>
    <div class="recommendation">${weak.length ? `<strong>�����?��� ��?��:</strong> ${weak.join(", ")}.` : "��६�� �?⨦�! ���?��? ��?�뫠� ��?�� ?�����?��."}</div>
    <div class="hero-actions">${session.mode === "initial" && weak.length ? `<button class="button button-primary" data-action="practice">���� �����?�</button>` : ""}${session.mode === "final" ? `<button class="button button-primary" data-action="open-results">�?⨦����? ᠫ������</button>` : ""}<button class="button button-secondary" data-action="home">����� ��⪥</button></div>
  </div>`;
}

function startPractice() {
  const weak = categories.filter(category => session.stats[category].total && categoryPercent(session.stats[category]) < 70);
  const chosen = weak[0] || categories[0];
  session = { ...session, mode: "practice", practiceCategory: chosen, tasks: practiceBank[chosen], index: 0, correct: 0, stats: blankStats() };
  renderTask();
}

function showPracticeResult(percent) {
  app.innerHTML = `<div class="app-panel"><span class="task-badge">���� �����?�</span><h2 class="task-title">${escapeHtml(session.practiceCategory)} ��?��� ��?⠫��</h2><div class="result-grid"><div class="metric"><small>�?⨦�</small><strong>${percent}%</strong></div><div class="metric"><small>�?���</small><strong>${session.correct}/${session.tasks.length}</strong></div></div><div class="recommendation">${percent >= 70 ? "��?�� �?���! ���? ?����뭤� �������⨪���� ?�?�??�? ⥪��." : "�?� ��?��� �?� �� ?��⠫��?� ������. ?����뭤� �������⨪�?� ���� ����?, ���?�����."}</div><div class="hero-actions"><button class="button button-primary" data-action="final">?����뭤� �������⨪�</button><button class="button button-secondary" data-action="home">����� ��⪥</button></div></div>`;
}

function showResearchLog() {
  const log = getLog();
  app.innerHTML = `<div class="app-panel"><span class="task-badge">������ ��ୠ��</span><h2 class="task-title">�?��뫠� �?⨦����?</h2>${log.length ? `<div class="table-wrap"><table class="research-table"><thead><tr><th>�</th><th>�?���</th><th>�?�?</th><th>���⠯?�</th><th>?����뭤�</th><th>?����?�</th></tr></thead><tbody>${log.map((item, index) => `<tr><td>${index + 1}</td><td>${escapeHtml(item.name)}</td><td>${item.date}</td><td>${item.initial}%</td><td>${item.final ?? "-"}${item.final !== undefined ? "%" : ""}</td><td>${item.final !== undefined ? signed(item.final - item.initial) + "%" : "-"}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty-state">?�?ࣥ �?⠫?�� �?⨦� ��?.</div>`}<div class="hero-actions"><button class="button button-secondary" data-action="home">����� ��⪥</button></div></div>`;
  app.scrollIntoView({ behavior: "smooth", block: "center" });
}

function showResearchSummary() {
  const complete = getLog().filter(item => item.final !== undefined);
  if (!complete.length) {
    app.innerHTML = `<div class="app-panel"><span class="task-badge">������ �?⨦����?</span><h2 class="task-title">���������?� ��४ ���?�?��?�</h2><div class="recommendation">���묥� ���⠯?� �?�� ?����뭤� �������⨪��� ��?�� ?����.</div><button class="button button-secondary" data-action="home">����� ��⪥</button></div>`;
  } else {
    const initial = Math.round(complete.reduce((sum, item) => sum + item.initial, 0) / complete.length);
    const final = Math.round(complete.reduce((sum, item) => sum + item.final, 0) / complete.length);
    app.innerHTML = `<div class="app-panel"><span class="task-badge">������ �?⨦����?</span><h2 class="task-title">���� �?⨦� ����������</h2><div class="result-grid"><div class="metric"><small>���⠯?�</small><strong>${initial}%</strong></div><div class="metric"><small>?����뭤�</small><strong>${final}%</strong></div><div class="metric"><small>?����?�</small><strong>${signed(final - initial)}%</strong></div></div><div class="recommendation">��������� ${complete.length} ⮫�? ��?⠫?�� �������⨪� ���?�?��� ��ᠫ��.</div><div class="hero-actions"><button class="button button-secondary" data-action="open-log">��ୠ��� ���</button><button class="button button-secondary" data-action="home">����� ��⪥</button></div></div>`;
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
function speak(word) { if (!("speechSynthesis" in window)) return alert("�?� ��㧥थ ������ ?�����?��?�."); const utterance = new SpeechSynthesisUtterance(word); utterance.lang = "kk-KZ"; utterance.rate = .8; speechSynthesis.cancel(); speechSynthesis.speak(utterance); }
function escapeHtml(value) { return String(value).replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]); }
function escapeAttr(value) { return escapeHtml(value).replace(/'/g, "&#39;"); }

