const data = window.APP_DATA;
const view = document.querySelector("#view");
const menuToggle = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");
const toast = document.querySelector("#toast");
const completionKey = "tilBridgeLessonProgress";
const diagnosticKey = "tilBridgeLatestDiagnostic";

const appState = {
  diagnostic: null,
  toastTimer: null,
};

document.querySelector("#year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

window.addEventListener("hashchange", renderRoute);
document.addEventListener("click", handleAction);
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && mainNav.classList.contains("open")) closeMenu();
});

function closeMenu() {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function routeParts() {
  return (location.hash.replace(/^#\/?/, "") || "home").split("/").filter(Boolean);
}

function renderRoute() {
  const parts = routeParts();
  const route = parts[0];
  closeMenu();
  setActiveNav(route);

  if (route === "home") renderHome();
  else if (route === "path") renderPath();
  else if (route === "course") renderCourse(parts[1] || "kk");
  else if (route === "stage") renderStage(parts[1] || "kk", parts[2] || "letters");
  else if (route === "lesson") renderLesson(parts[1] || "kk", parts[2] || "letters", Number(parts[3] || 1));
  else if (route === "translator") renderTranslator();
  else if (route === "diagnostics") renderDiagnostics();
  else if (route === "student") renderStudent();
  else if (route === "project") renderProject();
  else renderNotFound();

  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(() => view.focus({ preventScroll: true }), 0);
}

function setActiveNav(route) {
  const active = ["stage", "lesson"].includes(route) ? "course" : route;
  document.querySelectorAll("[data-nav]").forEach(link => {
    link.classList.toggle("active", link.dataset.nav === active);
  });
}

function shell(content, className = "") {
  view.innerHTML = `<div class="page ${className}">${content}</div>`;
}

function renderHome() {
  const totalLessons = countLessons("kk");
  shell(`
    <section class="home-hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">Ғылыми жоба · 2026</span>
          <h1>Әріптен бастап <em>еркін сөйлеуге</em> дейін</h1>
          <p>Til Bridge қытай тілді оқушыға қазақ және орыс тілдерін түсінікті кезеңдермен үйретеді. Жүйе әр сабақтың нәтижесін сақтап, оқу динамикасын көрсетеді.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#path">Рауанның оқу жолын көру <span>→</span></a>
            <a class="btn btn-secondary" href="#diagnostics">Диагностиканы бастау</a>
          </div>
          <div class="hero-proof">
            <span><i></i> 4 оқу деңгейі</span>
            <span><i></i> Қазақ және орыс тілі</span>
            <span><i></i> Қытайша түсіндірме</span>
          </div>
        </div>
        <aside class="hero-panel" aria-label="Рауанның нәтижесі">
          <div class="profile-mini">
            <span class="avatar">R</span>
            <div><strong>Рауан</strong><small>Қытай тілді оқушы · демонстрациялық профиль</small></div>
            <span class="badge success">Аяқталды</span>
          </div>
          <div class="progress-orbit">
            <svg viewBox="0 0 184 184" aria-hidden="true"><circle class="track" cx="92" cy="92" r="80"></circle><circle class="value" cx="92" cy="92" r="80"></circle></svg>
            <div><strong>87%</strong><span>қорытынды нәтиже</span></div>
          </div>
          <div class="panel-stats">
            <div class="panel-stat"><strong>${totalLessons}</strong><span>сабақ аяқталды</span></div>
            <div class="panel-stat"><strong>+67</strong><span>пайыздық өсім</span></div>
            <div class="panel-stat"><strong>4</strong><span>деңгей меңгерілді</span></div>
          </div>
        </aside>
      </div>
    </section>

    <section class="section white">
      <div class="container">
        <div class="metric-grid">
          <article class="metric-card"><small>Бастапқы диагностика</small><strong>20%</strong><p>Наурызда әріптерді тану деңгейі</p></article>
          <article class="metric-card"><small>Әріптік деңгей</small><strong>90%</strong><p>6 сабақтан кейінгі нәтиже</p></article>
          <article class="metric-card"><small>Сөз және сөйлем</small><strong>90%</strong><p>Тақырыптық тапсырмалар қорытындысы</p></article>
          <article class="metric-card"><small>Қорытынды диагностика</small><strong>87%</strong><p>Қазанда алынған жалпы нәтиже</p></article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head center"><span class="eyebrow">Платформа мүмкіндіктері</span><h2>Бір сайтта толық оқу жүйесі</h2><p>Тренажёр тек сұрақ қоймайды: оқушының бағытын, қателерін және кезеңдік өсімін көрсетеді.</p></div>
        <div class="feature-grid">
          <a class="feature-card" href="#course/kk"><span class="feature-icon">Ә</span><h3>Қазақ тілі</h3><p>Әріп, сөз, сөйлем және мәтін деңгейлері. Қытайша мағына мен дыбыстау қолжетімді.</p></a>
          <a class="feature-card" href="#course/ru"><span class="feature-icon">Я</span><h3>Русский язык</h3><p>Буквы, слова, предложения и чтение по той же понятной системе.</p></a>
          <a class="feature-card" href="#translator"><span class="feature-icon">译</span><h3>Үш тілдік аудармашы</h3><p>Қытайша, қазақша және орысша оқу сөздері мен қысқа сөйлемдерді аударады.</p></a>
        </div>
      </div>
    </section>

    <section class="language-band">
      <div class="container language-grid">
        <div><span class="eyebrow">Екі оқу бағыты</span><h2>Бір әдіс — екі жаңа тіл</h2><p>Оқушы таныс құрылымды қайта үйренбейді. Қазақ және орыс тілдеріндегі сабақтардың логикасы бірдей.</p></div>
        <div class="language-cards">
          <a class="language-card" href="#course/kk"><span class="big-letter">Ә</span><strong>Қазақ тілі</strong><small>${countLessons("kk")} сабақ · негізгі бағдарлама аяқталды →</small></a>
          <a class="language-card" href="#course/ru"><span class="big-letter">Я</span><strong>Русский язык</strong><small>${countLessons("ru")} уроков · новое направление →</small></a>
        </div>
      </div>
    </section>

    <section class="section white">
      <div class="container">
        <div class="section-head"><span class="eyebrow">Зерттеу логикасы</span><h2>Нәтиже қалай өлшенеді</h2><p>Әр кезеңде тапсырма орындалып, нәтиже журналға түседі. Бастапқы және қорытынды көрсеткіштер салыстырылады.</p></div>
        <div class="feature-grid">
          <article class="feature-card"><span class="feature-icon">01</span><h3>Диагностика</h3><p>Оқушының бастапқы деңгейі мен қиындықтары анықталады.</p></article>
          <article class="feature-card"><span class="feature-icon">02</span><h3>Жеке маршрут</h3><p>Әріптен сөзге, кейін сөйлем мен мәтінге біртіндеп өтеді.</p></article>
          <article class="feature-card"><span class="feature-icon">03</span><h3>Динамика</h3><p>Сабақтар, ұпайлар және қателер бір журналда салыстырылады.</p></article>
        </div>
        <div class="hero-actions"><a class="btn btn-primary" href="#project">Ғылыми жоба туралы</a><a class="btn btn-secondary" href="#student">Рауанның журналын ашу</a></div>
      </div>
    </section>
  `, "home-page");
}

function renderPath() {
  shell(`
    ${pageBanner("Оқу жолы", "Рауанның наурыздан қазанға дейінгі кезеңдік дамуы", "Алдымен әріптер, кейін сөздер, сөйлемдер және қысқа мәтіндер. Әр келесі деңгей алдыңғы дағдыға сүйенеді.", "Демонстрациялық профиль")}
    <section class="section">
      <div class="container">
        <div class="course-summary">
          <article class="summary-card"><h3>Негізгі бағдарлама</h3><p>Қазақ тіліндегі барлық 19 сабақ аяқталды. Қорытынды нәтиже — 87%.</p><div class="progress-line"><span style="width:100%"></span></div></article>
          <article class="summary-card summary-score"><div><h3>Жалпы өсім</h3><p>Бастапқы диагностикамен салыстырғанда</p></div><strong>+67%</strong></article>
        </div>
        <div class="section-head"><span class="eyebrow">Деңгейлер</span><h2>Қазақ тілі бойынша маршрут</h2><p>Әр бөлімді ашып, Рауан орындаған сабақтарды қайта көруге болады.</p></div>
        <div class="stage-grid">${data.stages.map(stage => stageCard("kk", stage)).join("")}</div>
      </div>
    </section>
    <section class="section white">
      <div class="container">
        <div class="section-head"><span class="eyebrow">Уақыт сызығы</span><h2>Оқу кезеңдері</h2></div>
        <div class="path-timeline">
          ${data.milestones.map(item => `<article class="path-step"><span class="path-dot">✓</span><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></div><span class="path-date">${escapeHtml(item.month)} · ${item.score}%</span></article>`).join("")}
        </div>
        <div class="hero-actions"><a class="btn btn-primary" href="#student">Толық диагностикалық журнал</a><a class="btn btn-secondary" href="#course/ru">Орыс тілін бастау</a></div>
      </div>
    </section>
  `, "path-page");
}

function renderCourse(lang) {
  lang = normalizeLanguage(lang);
  const isKk = lang === "kk";
  const completed = countCompleted(lang);
  const total = countLessons(lang);
  const progress = Math.round(completed / total * 100);
  const title = isKk ? "Қазақ тілі" : "Русский язык";
  const description = isKk
    ? "Әріптерді танудан бастап қысқа мәтінді түсінуге дейінгі толық оқу бағдарламасы."
    : "Пошаговый курс от знакомства с буквами до понимания короткого текста.";
  shell(`
    ${pageBanner(title, isKk ? "Төрт деңгейден тұратын оқу бағдарламасы" : "Четыре уровня последовательного обучения", description, `${total} ${isKk ? "сабақ" : "уроков"}`)}
    <section class="section">
      <div class="container">
        <div class="course-summary">
          <article class="summary-card"><h3>${isKk ? "Курс барысы" : "Прогресс курса"}</h3><p>${isKk ? "Рауан негізгі қазақ тілі бағдарламасын аяқтады." : "Новое направление можно проходить в собственном темпе."}</p><div class="progress-line"><span style="width:${progress}%"></span></div></article>
          <article class="summary-card summary-score"><div><h3>${isKk ? "Аяқталған сабақ" : "Пройдено уроков"}</h3><p>${completed} / ${total}</p></div><strong>${progress}%</strong></article>
        </div>
        <div class="section-head"><span class="eyebrow">${isKk ? "Оқу деңгейлері" : "Уровни курса"}</span><h2>${isKk ? "Келесі деңгейді таңда" : "Выберите следующий уровень"}</h2></div>
        <div class="stage-grid">${data.stages.map(stage => stageCard(lang, stage)).join("")}</div>
        <div class="hero-actions"><a class="btn btn-secondary" href="#diagnostics">${isKk ? "Диагностикадан өту" : "Пройти диагностику"}</a><a class="btn btn-soft" href="#translator">${isKk ? "Аудармашыны ашу" : "Открыть переводчик"}</a></div>
      </div>
    </section>
  `, "course-page");
}

function renderStage(lang, stageId) {
  lang = normalizeLanguage(lang);
  const stage = data.stages.find(item => item.id === stageId) || data.stages[0];
  const lessons = data.lessons[lang][stage.id];
  const isKk = lang === "kk";
  const title = isKk ? stage.titleKk : stage.titleRu;
  const subtitle = isKk ? stage.subtitleKk : stage.subtitleRu;
  const completed = lessons.filter((_, index) => isLessonCompleted(lang, stage.id, index + 1)).length;
  shell(`
    <section class="page-banner">
      <div class="container">
        ${breadcrumbs([[isKk ? "Қазақ тілі" : "Русский язык", `#course/${lang}`], [title]])}
        <div class="page-banner-grid"><div><span class="eyebrow">${lessons.length} ${isKk ? "сабақ" : "уроков"}</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div><span class="badge ${completed === lessons.length ? "success" : ""}">${completed}/${lessons.length} ${isKk ? "аяқталды" : "пройдено"}</span></div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="lesson-list">
          ${lessons.map((item, index) => lessonRow(lang, stage.id, item, index + 1)).join("")}
        </div>
        <div class="hero-actions"><a class="btn btn-secondary" href="#course/${lang}">← ${isKk ? "Барлық деңгей" : "Все уровни"}</a></div>
      </div>
    </section>
  `, "stage-page");
}

function renderLesson(lang, stageId, lessonNumber) {
  lang = normalizeLanguage(lang);
  const stage = data.stages.find(item => item.id === stageId) || data.stages[0];
  const lessons = data.lessons[lang][stage.id];
  const index = Math.min(Math.max((Number.isFinite(lessonNumber) ? lessonNumber : 1) - 1, 0), lessons.length - 1);
  const current = lessons[index];
  const isKk = lang === "kk";
  const stageTitle = isKk ? stage.titleKk : stage.titleRu;
  const completed = isLessonCompleted(lang, stage.id, index + 1);
  shell(`
    <section class="lesson-shell">
      <div class="container">
        ${breadcrumbs([[isKk ? "Қазақ тілі" : "Русский язык", `#course/${lang}`], [stageTitle, `#stage/${lang}/${stage.id}`], [`${index + 1}-${isKk ? "сабақ" : "урок"}`]])}
        <div class="lesson-layout">
          <div class="lesson-main">
            <article class="content-card">
              <span class="badge ${completed ? "success" : ""}">${completed ? "✓ " : ""}${index + 1}-${isKk ? "сабақ" : "урок"}</span>
              <h1>${escapeHtml(current.title)}</h1>
              <p class="lesson-lead">${escapeHtml(current.summary)}</p>
              <div class="hero-actions"><button class="btn btn-soft btn-small" type="button" data-action="speak" data-text="${escapeAttr(current.title)}" data-lang="${lang}">🔊 ${isKk ? "Тыңдау" : "Прослушать"}</button></div>
            </article>
            <article class="content-card">
              <h2>${isKk ? "Ереже және түсіндірме" : "Правило и объяснение"}</h2>
              <p>${escapeHtml(current.theory)}</p>
              <div class="example-grid">${current.examples.map(([word, meaning]) => `<div class="example-item"><strong>${escapeHtml(word)}</strong><span class="han">${escapeHtml(meaning)}</span></div>`).join("")}</div>
            </article>
            <article class="quiz-card" data-quiz data-lang="${lang}" data-stage="${stage.id}" data-lesson="${index + 1}">
              <span class="badge">${isKk ? "Бекіту тапсырмасы" : "Задание для закрепления"}</span>
              <h2>${escapeHtml(current.quiz.question)}</h2>
              <div class="quiz-options">${current.quiz.options.map(option => `<button class="quiz-option" type="button" data-action="quiz-answer" data-answer="${escapeAttr(option)}">${escapeHtml(option)}</button>`).join("")}</div>
              <p class="quiz-feedback" data-feedback>${completed ? (isKk ? "Бұл сабақ бұрын аяқталған. Қайта тексеруге болады." : "Этот урок уже пройден. Можно проверить себя ещё раз.") : ""}</p>
            </article>
          </div>
          <aside class="lesson-sidebar">
            <div class="sidebar-card">
              <h3>${isKk ? "Сабақ туралы" : "Об уроке"}</h3>
              <div class="sidebar-meta"><div><span>${isKk ? "Деңгей" : "Уровень"}</span><strong>${escapeHtml(stageTitle)}</strong></div><div><span>${isKk ? "Ұзақтығы" : "Длительность"}</span><strong>8–12 мин</strong></div><div><span>${isKk ? "Мәртебе" : "Статус"}</span><strong>${completed ? (isKk ? "Аяқталды" : "Пройден") : (isKk ? "Жаңа" : "Новый")}</strong></div></div>
              <div class="lesson-nav">
                ${index > 0 ? `<a class="btn btn-secondary btn-small" href="#lesson/${lang}/${stage.id}/${index}">←</a>` : `<button class="btn btn-secondary btn-small" disabled>←</button>`}
                ${index < lessons.length - 1 ? `<a class="btn btn-primary btn-small" href="#lesson/${lang}/${stage.id}/${index + 2}">→</a>` : `<a class="btn btn-primary btn-small" href="#course/${lang}">✓</a>`}
              </div>
            </div>
            <div class="research-note"><strong>${isKk ? "Жүйе жазбасы:" : "Запись системы:"}</strong> ${isKk ? "тапсырма аяқталғаннан кейін нәтиже осы браузерде сақталады." : "после выполнения результат сохраняется в этом браузере."}</div>
          </aside>
        </div>
      </div>
    </section>
  `, "lesson-page");
}

function renderTranslator() {
  shell(`
    ${pageBanner("Үш тілдік аудармашы", "Қытайша · Қазақша · Русский", "Оқу бағдарламасындағы негізгі сөздер мен қысқа сөйлемдерді үш бағытта аударады және дыбыстайды.", "Оқу сөздігі")}
    <section class="section">
      <div class="container">
        <div class="translator-layout">
          <div class="translator-panel">
            <label for="source-lang">Қай тілден</label>
            <select id="source-lang"><option value="zh">中文</option><option value="kk">Қазақша</option><option value="ru">Русский</option></select>
            <textarea id="source-text" class="han" placeholder="Сөз немесе қысқа сөйлем жазыңыз">学校</textarea>
            <div class="translator-actions"><span class="badge">${data.dictionary.length} сөз және сөйлем</span><button class="btn btn-primary btn-small" type="button" data-action="translate">Аудару</button></div>
          </div>
          <button class="swap-button" type="button" data-action="swap-languages" aria-label="Тілдерді ауыстыру">⇄</button>
          <div class="translator-panel">
            <label for="target-lang">Қай тілге</label>
            <select id="target-lang"><option value="kk">Қазақша</option><option value="ru">Русский</option><option value="zh">中文</option></select>
            <div class="translation-result" id="translation-result"><span class="translation-placeholder">Аударма осы жерде көрсетіледі</span></div>
            <div class="translator-actions"><span id="translation-note" class="badge demo">Тақырыптық сөздік</span><button class="btn btn-soft btn-small" type="button" data-action="speak-translation">🔊 Тыңдау</button></div>
          </div>
        </div>
        <div class="dictionary-chips">
          ${data.dictionary.slice(0, 12).map(item => `<button class="dictionary-chip han" type="button" data-action="dictionary-chip" data-value="${escapeAttr(item.zh)}">${escapeHtml(item.zh)} · ${escapeHtml(item.kk)}</button>`).join("")}
        </div>
        <div class="research-note" style="margin-top:24px"><strong>Бұл нұсқа туралы:</strong> аудармашы оқу бағдарламасына енгізілген тексерілген сөздер мен сөйлемдерді қолданады. Кез келген еркін мәтінді аудару үшін кейін серверлік аударма API қосылады.</div>
      </div>
    </section>
  `, "translator-page");
  translateCurrent();
}

function renderDiagnostics() {
  if (appState.diagnostic?.finished) return renderDiagnosticResult();
  if (appState.diagnostic) return renderDiagnosticQuestion();
  const latest = readJson(diagnosticKey, null);
  shell(`
    ${pageBanner("Диагностика", "Оқу деңгейін 8 тапсырмамен тексеру", "Әріп, сөз, сөйлем, аударма және мәтінді түсіну дағдылары бір тестте бағаланады.", "8 тапсырма")}
    <section class="section">
      <div class="container diagnostic-shell">
        <div class="diagnostic-card result-hero">
          <span class="badge">Бастапқы немесе қорытынды тексеру</span>
          <h2>Диагностиканы бастауға дайынсың ба?</h2>
          <p>Жауаптар осы құрылғыда ғана сақталады. Нәтижеде жалпы пайыз және келесі оқу бағыты көрсетіледі.</p>
          ${latest ? `<div class="result-score">${latest.percent}%</div><p>Соңғы нәтиже: ${escapeHtml(latest.date)}</p>` : `<div class="result-score">8</div><p>қысқа тапсырма</p>`}
          <div class="hero-actions" style="justify-content:center"><button class="btn btn-primary" type="button" data-action="start-diagnostic">Диагностиканы бастау</button><a class="btn btn-secondary" href="#student">Рауанның нәтижесін көру</a></div>
        </div>
      </div>
    </section>
  `, "diagnostics-page");
}

function renderDiagnosticQuestion() {
  const session = appState.diagnostic;
  const item = data.diagnostics[session.index];
  const progress = Math.round(session.index / data.diagnostics.length * 100);
  shell(`
    <section class="section">
      <div class="container diagnostic-shell">
        <div class="diagnostic-card" data-diagnostic>
          <div class="diagnostic-top"><p>Диагностика · ${session.index + 1}/${data.diagnostics.length}</p><div class="diagnostic-progress"><span style="width:${progress}%"></span></div></div>
          <div class="diagnostic-type"><span class="badge">${escapeHtml(item.type)}</span></div>
          <h2>${escapeHtml(item.question)}</h2>
          <div class="diagnostic-options">${item.options.map(option => `<button class="diagnostic-answer" type="button" data-action="diagnostic-answer" data-answer="${escapeAttr(option)}">${escapeHtml(option)}</button>`).join("")}</div>
        </div>
      </div>
    </section>
  `, "diagnostic-active");
}

function renderDiagnosticResult() {
  const session = appState.diagnostic;
  const percent = Math.round(session.correct / data.diagnostics.length * 100);
  const message = percent >= 80 ? "Жоғары деңгей. Мәтінмен және еркін сөйлеумен жұмыс істеуге болады." : percent >= 55 ? "Орта деңгей. Сөйлем мен сөздік қорды бекіту ұсынылады." : "Бастапқы деңгей. Әріптер мен негізгі сөздерден бастаған дұрыс.";
  shell(`
    <section class="section">
      <div class="container diagnostic-shell">
        <div class="diagnostic-card result-hero">
          <span class="badge success">Диагностика аяқталды</span>
          <div class="result-score">${percent}%</div>
          <h2>${session.correct}/${data.diagnostics.length} дұрыс жауап</h2>
          <p>${message}</p>
          <div class="hero-actions" style="justify-content:center"><button class="btn btn-primary" type="button" data-action="restart-diagnostic">Қайта өту</button><a class="btn btn-secondary" href="#path">Оқу жолын таңдау</a></div>
        </div>
      </div>
    </section>
  `, "diagnostic-result");
}

function renderStudent() {
  const chart = [20, 40, 50, 70, 90, 60, 90, 70, 90, 87];
  const labels = ["05.03", "12.03", "19.03", "26.03", "09.04", "30.04", "21.05", "02.07", "17.09", "15.10"];
  shell(`
    <section class="profile-banner">
      <div class="container profile-banner-grid">
        <div class="student-head"><span class="avatar">R</span><div><span class="badge demo">Демонстрациялық профиль</span><h1>Рауан</h1><p>${escapeHtml(data.student.origin)} · ${escapeHtml(data.student.period)}</p></div></div>
        <div class="profile-score"><strong>${data.student.final}%</strong><span>ҚОРЫТЫНДЫ НӘТИЖЕ</span></div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="metric-grid">
          <article class="metric-card"><small>Бастапқы нәтиже</small><strong>${data.student.initial}%</strong><p>5 наурыздағы диагностика</p></article>
          <article class="metric-card"><small>Қорытынды нәтиже</small><strong>${data.student.final}%</strong><p>15 қазандағы диагностика</p></article>
          <article class="metric-card"><small>Оқу өсімі</small><strong>+67%</strong><p>Бақылау кезеңіндегі айырма</p></article>
          <article class="metric-card"><small>Аяқталған сабақ</small><strong>${countLessons("kk")}</strong><p>4 деңгей толық аяқталды</p></article>
        </div>
        <div class="dashboard-grid" style="margin-top:20px">
          <article class="dashboard-card"><h2>Нәтиже динамикасы</h2><p>Наурыздан қазанға дейінгі негізгі бақылау нүктелері</p><div class="bar-chart">${chart.map((value, index) => `<div class="bar-item"><strong>${value}%</strong><div class="bar" style="height:${value}%"></div><span>${labels[index]}</span></div>`).join("")}</div></article>
          <article class="dashboard-card"><h2>Дағдылар картасы</h2><p>Қорытынды тапсырмалар бойынша</p><div class="skill-list">${skillRow("Әріптер", 90)}${skillRow("Сөздер", 90)}${skillRow("Сөйлемдер", 90)}${skillRow("Мәтінді оқу", 80)}${skillRow("Жалпы нәтиже", 87)}</div></article>
        </div>
        <div class="research-note" style="margin-top:20px"><strong>Деректер мәртебесі:</strong> бұл профиль сайт мүмкіндігін көрсетуге арналған демонстрациялық үлгі. Ғылыми жұмысқа енгізілетін нәтижелер мұғалімнің нақты журналы және орындалған жұмыстармен расталуы керек.</div>
      </div>
    </section>
    <section class="section white">
      <div class="container">
        <div class="section-head"><span class="eyebrow">Диагностикалық журнал</span><h2>Сабақтарды өту тарихы</h2><p>Күні, кезеңі, тапсырмасы, нәтижесі және байқалған қиындықтар.</p></div>
        <div class="table-wrap"><table class="data-table"><thead><tr><th>Күні</th><th>Кезең</th><th>Сабақ немесе тапсырма</th><th>Нәтиже</th><th>Бақыланған қиындық</th></tr></thead><tbody>${data.logs.map(row => `<tr><td>${escapeHtml(row[0])}</td><td>${escapeHtml(row[1])}</td><td>${escapeHtml(row[2])}</td><td><span class="score-pill">${escapeHtml(row[3])}</span></td><td>${escapeHtml(row[4])}</td></tr>`).join("")}</tbody></table></div>
        <div class="hero-actions"><button class="btn btn-primary" type="button" data-action="download-log">Журналды CSV форматында жүктеу</button><a class="btn btn-secondary" href="#project">Зерттеу әдістемесі</a></div>
      </div>
    </section>
  `, "student-page");
}

function renderProject() {
  shell(`
    ${pageBanner("Ғылыми жоба", "Қытай тілді оқушыға тіл үйретудің цифрлық моделі", "Жоба бір оқушының оқу динамикасын кезеңдік диагностика және интерактивті жаттығулар арқылы бақылауды ұсынады.", "Зерттеу моделі")}
    <section class="section">
      <div class="container project-grid">
        <article class="project-card"><span class="eyebrow">Мәселе</span><h2>Тілдік кедергі</h2><p>Қытай тілінің дыбыстық және грамматикалық жүйесі қазақ және орыс тілдерінен ерекшеленеді. Сондықтан оқушыға бірден күрделі мәтін емес, дыбыс пен мағынаға негізделген қысқа кезеңдер қажет.</p></article>
        <article class="project-card"><span class="eyebrow">Мақсат</span><h2>Жеке оқу маршруты</h2><p>Әріптен сөзге, сөзден сөйлемге, сөйлемнен мәтінге өтетін түсінікті бағдар құрып, әр кезеңдегі нәтижені автоматты түрде тіркеу.</p></article>
        <article class="project-card"><span class="eyebrow">Гипотеза</span><h2>Жүйелі қайталау нәтиже береді</h2><p>Егер тапсырмалар оқушының ана тілімен байланыстырылып, деңгейлер біртіндеп күрделенсе, оқу және түсіну нәтижесі тұрақты өседі.</p></article>
        <article class="project-card"><span class="eyebrow">Нәтиже</span><h2>20%-дан 87%-ға дейін</h2><p>Демонстрациялық модель Рауанның әріптік кезеңнен қысқа мәтінді түсіну деңгейіне дейінгі қозғалысын көрсетеді.</p></article>
        <article class="project-card wide"><span class="eyebrow">Зерттеу кезеңдері</span><h2>Әдістеме</h2><div class="method-steps"><div class="method-step"><span>01</span><strong>Бастапқы диагностика</strong></div><div class="method-step"><span>02</span><strong>Деңгейлік сабақтар</strong></div><div class="method-step"><span>03</span><strong>Аралық бақылау</strong></div><div class="method-step"><span>04</span><strong>Қорытынды салыстыру</strong></div></div></article>
        <article class="project-card wide"><span class="eyebrow">Өлшенетін көрсеткіштер</span><h2>Жүйе қандай дерек жинайды</h2><ul><li>тапсырманың орындалған күні мен деңгейі;</li><li>дұрыс жауаптар пайызы және әрекет саны;</li><li>қайталанатын қателер мен қиындықтар;</li><li>бастапқы және қорытынды диагностика айырмасы;</li><li>оқушыға ұсынылатын келесі оқу бағыты.</li></ul></article>
      </div>
    </section>
  `, "project-page");
}

function renderNotFound() {
  shell(`<section class="section"><div class="container"><div class="empty-state"><h1>Бет табылмады</h1><p>Сілтемені тексеріңіз немесе басты бетке оралыңыз.</p><a class="btn btn-primary" href="#home">Басты бет</a></div></div></section>`);
}

function pageBanner(kicker, title, description, badge) {
  return `<section class="page-banner"><div class="container page-banner-grid"><div><span class="eyebrow">${escapeHtml(kicker)}</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></div><span class="badge">${escapeHtml(badge)}</span></div></section>`;
}

function breadcrumbs(items) {
  return `<nav class="breadcrumb" aria-label="Навигациялық жол"><a href="#home">Басты бет</a>${items.map(([label, href]) => `<span>${href ? `<a href="${href}">${escapeHtml(label)}</a>` : escapeHtml(label)}</span>`).join("")}</nav>`;
}

function stageCard(lang, stage) {
  const lessons = data.lessons[lang][stage.id];
  const completed = lessons.filter((_, index) => isLessonCompleted(lang, stage.id, index + 1)).length;
  const progress = Math.round(completed / lessons.length * 100);
  const isKk = lang === "kk";
  return `<a class="stage-card ${stage.accent}" href="#stage/${lang}/${stage.id}"><span class="stage-icon">${escapeHtml(stage.icon)}</span><div><h3>${escapeHtml(isKk ? stage.titleKk : stage.titleRu)}</h3><p>${escapeHtml(isKk ? stage.subtitleKk : stage.subtitleRu)}</p><div class="stage-meta"><span>${lessons.length} ${isKk ? "сабақ" : "уроков"}</span><span>·</span><span>${completed}/${lessons.length} ${isKk ? "аяқталды" : "пройдено"}</span></div><div class="progress-line"><span style="width:${progress}%"></span></div></div><span class="stage-arrow">→</span></a>`;
}

function lessonRow(lang, stageId, item, number) {
  const done = isLessonCompleted(lang, stageId, number);
  const isKk = lang === "kk";
  return `<a class="lesson-row ${done ? "done" : ""}" href="#lesson/${lang}/${stageId}/${number}"><span class="lesson-number">${done ? "✓" : String(number).padStart(2, "0")}</span><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p></div><span class="lesson-state">${done ? (isKk ? "Аяқталды" : "Пройден") : (isKk ? "Бастау →" : "Начать →")}</span></a>`;
}

function skillRow(label, value) {
  return `<div class="skill-row"><header><span>${escapeHtml(label)}</span><span>${value}%</span></header><div class="progress-line"><span style="width:${value}%"></span></div></div>`;
}

function handleAction(event) {
  const trigger = event.target.closest("[data-action]");
  if (!trigger) return;
  const action = trigger.dataset.action;
  if (action === "quiz-answer") answerLessonQuiz(trigger);
  else if (action === "speak") speak(trigger.dataset.text || "", trigger.dataset.lang || "kk");
  else if (action === "start-diagnostic" || action === "restart-diagnostic") startDiagnostic();
  else if (action === "diagnostic-answer") answerDiagnostic(trigger.dataset.answer);
  else if (action === "translate") translateCurrent();
  else if (action === "swap-languages") swapLanguages();
  else if (action === "dictionary-chip") useDictionaryChip(trigger.dataset.value);
  else if (action === "speak-translation") speakTranslation();
  else if (action === "download-log") downloadLog();
}

function answerLessonQuiz(button) {
  const quiz = button.closest("[data-quiz]");
  if (!quiz || quiz.dataset.answered === "true") return;
  const lang = quiz.dataset.lang;
  const stageId = quiz.dataset.stage;
  const number = Number(quiz.dataset.lesson);
  const item = data.lessons[lang][stageId][number - 1];
  const value = button.dataset.answer;
  const isCorrect = value === item.quiz.answer;
  quiz.dataset.answered = "true";
  quiz.querySelectorAll(".quiz-option").forEach(option => {
    option.disabled = true;
    if (option.dataset.answer === item.quiz.answer) option.classList.add("correct");
    else if (option === button && !isCorrect) option.classList.add("wrong");
  });
  const feedback = quiz.querySelector("[data-feedback]");
  feedback.textContent = `${isCorrect ? "✓" : "✕"} ${item.quiz.explanation}`;
  if (isCorrect) {
    markLessonCompleted(lang, stageId, number);
    showToast(lang === "kk" ? "Сабақ аяқталды және нәтиже сақталды" : "Урок пройден, результат сохранён");
  }
}

function startDiagnostic() {
  appState.diagnostic = { index: 0, correct: 0, answers: [], finished: false };
  renderDiagnosticQuestion();
}

function answerDiagnostic(answer) {
  const session = appState.diagnostic;
  if (!session) return;
  const current = data.diagnostics[session.index];
  const correct = answer === current.answer;
  session.answers.push({ answer, correct });
  if (correct) session.correct += 1;
  document.querySelectorAll(".diagnostic-answer").forEach(button => {
    button.disabled = true;
    if (button.dataset.answer === current.answer) button.style.cssText = "border-color:#2c9b68;background:#e5f7ee;color:#18784d";
    else if (button.dataset.answer === answer && !correct) button.style.cssText = "border-color:#d64c4c;background:#fff0f0;color:#a73232";
  });
  setTimeout(() => {
    session.index += 1;
    if (session.index >= data.diagnostics.length) {
      session.finished = true;
      const result = { percent: Math.round(session.correct / data.diagnostics.length * 100), correct: session.correct, date: new Date().toLocaleDateString("kk-KZ") };
      localStorage.setItem(diagnosticKey, JSON.stringify(result));
      renderDiagnosticResult();
    } else renderDiagnosticQuestion();
  }, 650);
}

function translateCurrent() {
  const sourceSelect = document.querySelector("#source-lang");
  const targetSelect = document.querySelector("#target-lang");
  const input = document.querySelector("#source-text");
  const result = document.querySelector("#translation-result");
  if (!sourceSelect || !targetSelect || !input || !result) return;
  const from = sourceSelect.value;
  const to = targetSelect.value;
  const query = input.value.trim();
  if (!query) {
    result.innerHTML = `<span class="translation-placeholder">Аудару үшін мәтін енгізіңіз</span>`;
    result.dataset.value = "";
    return;
  }
  if (from === to) {
    result.textContent = query;
    result.dataset.value = query;
    return;
  }
  const normalized = normalizeText(query);
  const exact = data.dictionary.find(item => normalizeText(item[from]) === normalized);
  let translated = exact?.[to] || "";
  if (!translated && /\s/.test(query)) {
    const words = query.split(/\s+/);
    const mapped = words.map(word => data.dictionary.find(item => normalizeText(item[from]) === normalizeText(word))?.[to]);
    if (mapped.every(Boolean)) translated = mapped.join(" ");
  }
  if (translated) {
    result.textContent = translated;
    result.dataset.value = translated;
    result.classList.toggle("han", to === "zh");
    document.querySelector("#translation-note").textContent = "Сөздіктен табылды";
  } else {
    result.innerHTML = `<span class="translation-placeholder">Бұл сөз оқу сөздігінде әзірге жоқ. Қысқа сөз немесе дайын сөйлем қолданып көріңіз.</span>`;
    result.dataset.value = "";
    document.querySelector("#translation-note").textContent = "Сөз табылмады";
  }
  input.classList.toggle("han", from === "zh");
}

function swapLanguages() {
  const source = document.querySelector("#source-lang");
  const target = document.querySelector("#target-lang");
  const input = document.querySelector("#source-text");
  const result = document.querySelector("#translation-result");
  if (!source || !target || !input || !result) return;
  const oldSource = source.value;
  source.value = target.value;
  target.value = oldSource;
  if (result.dataset.value) input.value = result.dataset.value;
  translateCurrent();
}

function useDictionaryChip(value) {
  const source = document.querySelector("#source-lang");
  const input = document.querySelector("#source-text");
  if (!source || !input) return;
  source.value = "zh";
  input.value = value;
  translateCurrent();
}

function speakTranslation() {
  const target = document.querySelector("#target-lang");
  const result = document.querySelector("#translation-result");
  if (!target || !result?.dataset.value) return showToast("Алдымен аударма жасаңыз");
  speak(result.dataset.value, target.value);
}

function speak(text, lang) {
  if (!("speechSynthesis" in window)) return showToast("Бұл браузерде дыбыстау қолжетімсіз");
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === "zh" ? "zh-CN" : lang === "ru" ? "ru-RU" : "kk-KZ";
  utterance.rate = .82;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

function downloadLog() {
  const headers = ["Күні", "Кезең", "Сабақ немесе тапсырма", "Нәтиже", "Бақыланған қиындық"];
  const rows = [headers, ...data.logs];
  const csv = "\uFEFF" + rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(";")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Rauan_diagnostikalyk_zhurnaly.csv";
  link.click();
  URL.revokeObjectURL(url);
  showToast("Журнал жүктелді");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(appState.toastTimer);
  appState.toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function completionSet() {
  return new Set(readJson(completionKey, []));
}

function isLessonCompleted(lang, stage, number) {
  if (lang === "kk") return true;
  return completionSet().has(`${lang}:${stage}:${number}`);
}

function markLessonCompleted(lang, stage, number) {
  const set = completionSet();
  set.add(`${lang}:${stage}:${number}`);
  localStorage.setItem(completionKey, JSON.stringify([...set]));
}

function countLessons(lang) {
  return data.stages.reduce((sum, stage) => sum + data.lessons[lang][stage.id].length, 0);
}

function countCompleted(lang) {
  return data.stages.reduce((sum, stage) => sum + data.lessons[lang][stage.id].filter((_, index) => isLessonCompleted(lang, stage.id, index + 1)).length, 0);
}

function normalizeLanguage(lang) {
  return lang === "ru" ? "ru" : "kk";
}

function normalizeText(value) {
  return String(value).trim().toLocaleLowerCase().replace(/[.!?。！？]+$/g, "").replace(/\s+/g, " ");
}

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

if (!location.hash) location.hash = "#home";
else renderRoute();
