const data = window.APP_DATA;
const view = document.querySelector("#view");
const menuToggle = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");
const toast = document.querySelector("#toast");
const completionKey = "tilBridgeLessonProgress";
const diagnosticKey = "tilBridgeLatestDiagnostic";
const profileKey = "tilBridgeProfile";

const appState = { diagnostic: null, toastTimer: null };

document.querySelector("#year").textContent = new Date().getFullYear();
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
window.addEventListener("hashchange", renderRoute);
document.addEventListener("click", handleAction);
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
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
  else if (route === "register") renderRegistration();
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
  const total = countLessons("kk");
  shell(`
    <section class="home-hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">Қытай тілді оқушыларға арналған</span>
          <h1>Әріптен бастап <em>дұрыс сөйлемге</em> дейін</h1>
          <p>Til Bridge қазақ және орыс тілдерін бірізді үйретеді. Үш модуль, қысқа теория, мысалдар және әр сабақтан кейін бірден тексеру.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#path">Курсты көру <span>→</span></a>
            <a class="btn btn-secondary" href="#diagnostics">Деңгейді анықтау</a>
          </div>
          <p class="hero-registration-link"><a href="#register">Алғаш рет кірдің бе? Профиль жасап, прогресті сақта →</a></p>
          <div class="hero-proof">
            <span><i></i> 3 негізгі модуль</span>
            <span><i></i> 2 тілдік бағыт</span>
            <span><i></i> 中文 көмекші аударма</span>
          </div>
        </div>
        <aside class="hero-panel course-map-card" aria-label="Курс құрылымы">
          <span class="badge demo">Курс құрылымы</span>
          <h2>3 қадамдық оқу жолы</h2>
          <div class="mini-course-flow">
            ${data.stages.map((stage, index) => `
              <a href="#stage/kk/${stage.id}" class="mini-course-step">
                <span class="step-number">${stage.number}</span>
                <span><strong>${stage.titleKk}</strong><small>${stage.subtitleKk}</small></span>
                ${index < data.stages.length - 1 ? `<b>↓</b>` : `<b>✓</b>`}
              </a>`).join("")}
          </div>
          <div class="panel-stats">
            <div class="panel-stat"><strong>${total}</strong><span>сабақ</span></div>
            <div class="panel-stat"><strong>3</strong><span>модуль</span></div>
            <div class="panel-stat"><strong>8</strong><span>диагностика</span></div>
          </div>
        </aside>
      </div>
    </section>

    <section class="section white">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow">Толық оқу бағдарламасы</span>
          <h2>Қарапайымнан күрделіге</h2>
          <p>Әр модуль алдыңғы білімге сүйенеді: алдымен дыбысты танимыз, кейін сөз құраймыз, соңында ойын толық сөйлеммен жеткіземіз.</p>
        </div>
        <div class="stage-grid home-stage-grid">${data.stages.map(stage => stageCard("kk", stage)).join("")}</div>
      </div>
    </section>

    <section class="language-band">
      <div class="container language-grid">
        <div><span class="eyebrow">Екі тіл — бір жүйе</span><h2>Өзіңе қажетті бағытты таңда</h2><p>Қазақ және орыс тілі бірдей үш модульмен құрылған. Сабақ нәтижесі браузерде автоматты түрде сақталады.</p></div>
        <div class="language-cards">
          <a class="language-card" href="#course/kk"><span class="big-letter">Ә</span><strong>Қазақ тілі</strong><small>${countLessons("kk")} сабақ · курсты ашу →</small></a>
          <a class="language-card" href="#course/ru"><span class="big-letter">Я</span><strong>Русский язык</strong><small>${countLessons("ru")} уроков · открыть курс →</small></a>
        </div>
      </div>
    </section>

    <section class="section white">
      <div class="container">
        <div class="section-head"><span class="eyebrow">Оқу құралдары</span><h2>Тек сабақ емес — толық тренажёр</h2></div>
        <div class="feature-grid">
          <a class="feature-card" href="#diagnostics"><span class="feature-icon">✓</span><h3>Диагностика</h3><p>8 тапсырма арқылы әріп, сөз және сөйлем деңгейін анықтайды.</p></a>
          <a class="feature-card" href="#translator"><span class="feature-icon">译</span><h3>Үш тілді аудармашы</h3><p>Қытайша, қазақша және орысша оқу сөздерін жылдам аударады.</p></a>
          <a class="feature-card" href="#project"><span class="feature-icon">i</span><h3>Оқыту әдістемесі</h3><p>Курстың құрылымы мен әр модульдің мақсатын түсіндіреді.</p></a>
        </div>
      </div>
    </section>
  `, "home-page");
}

function renderPath() {
  shell(`
    ${pageBanner("Толық курс", "Үш модуль — бір жүйелі нәтиже", "Оқушы әріпті танудан бастайды, тақырыптық сөздерді меңгереді және сол сөздермен дұрыс сөйлем құрауға көшеді.", "3 модуль")}
    <section class="section">
      <div class="container">
        <div class="section-head center"><span class="eyebrow">Оқу картасы</span><h2>Курстың толық құрылымы</h2><p>Модульдерді ретімен өтуге немесе қажетті бөлімді бірден таңдауға болады.</p></div>
        <div class="curriculum-list">
          ${data.stages.map((stage, index) => curriculumModule(stage, index)).join("")}
        </div>
      </div>
    </section>
    <section class="section white">
      <div class="container course-choice">
        <div class="section-head center"><span class="eyebrow">Бағытты таңда</span><h2>Қай тілден бастаймыз?</h2></div>
        <div class="language-cards course-choice-cards">
          <a class="language-card" href="#course/kk"><span class="big-letter">Ә</span><strong>Қазақ тілі курсы</strong><small>Әріптер → Сөздер → Сөйлемдер</small></a>
          <a class="language-card" href="#course/ru"><span class="big-letter">Я</span><strong>Курс русского языка</strong><small>Буквы → Слова → Предложения</small></a>
        </div>
      </div>
    </section>
  `, "path-page");
}

function curriculumModule(stage, index) {
  const lessonCount = data.lessons.kk[stage.id].length;
  const outcomes = {
    letters: ["дыбыстарды ажыратады", "әріпті сөз ішінен табады", "дұрыс айтуға жаттығады"],
    words: ["тақырыптық сөздерді үйренеді", "қытайша мағынасымен байланыстырады", "сөз тіркесін құрайды"],
    sentences: ["сөз тәртібін түсінеді", "етістікті дұрыс қолданады", "сұрақ пен жауап құрайды"]
  };
  return `
    <article class="curriculum-module">
      <div class="curriculum-number">${stage.number}</div>
      <div class="curriculum-main">
        <span class="badge">${lessonCount} сабақ</span>
        <h2>${stage.titleKk} <small>· ${stage.titleRu}</small></h2>
        <p>${stage.subtitleKk}. ${stage.subtitleRu}.</p>
        <ul>${outcomes[stage.id].map(item => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="curriculum-actions">
        <a class="btn btn-primary btn-small" href="#stage/kk/${stage.id}">Қазақша</a>
        <a class="btn btn-secondary btn-small" href="#stage/ru/${stage.id}">По-русски</a>
      </div>
      ${index < data.stages.length - 1 ? `<span class="curriculum-arrow">↓</span>` : ""}
    </article>`;
}

function renderCourse(lang) {
  lang = normalizeLanguage(lang);
  const isKk = lang === "kk";
  const completed = countCompleted(lang);
  const total = countLessons(lang);
  const progress = Math.round(completed / total * 100);
  const title = isKk ? "Қазақ тілі" : "Русский язык";
  const heading = isKk ? "Үш модульден тұратын толық курс" : "Полный курс из трёх модулей";
  const description = isKk
    ? "Әріптерді танып, сөздік қорды кеңейтіп, дұрыс сөйлем құруға дейінгі жүйелі бағдарлама."
    : "Последовательная программа: от знакомства с буквами до словарного запаса и правильных предложений.";
  shell(`
    ${pageBanner(title, heading, description, `${total} ${isKk ? "сабақ" : "уроков"}`)}
    <section class="section">
      <div class="container">
        <div class="course-summary">
          <article class="summary-card"><h3>${isKk ? "Жалпы прогресс" : "Общий прогресс"}</h3><p>${isKk ? "Аяқталған сабақтар осы браузерде сақталады." : "Завершённые уроки сохраняются в этом браузере."}</p><div class="progress-line"><span style="width:${progress}%"></span></div></article>
          <article class="summary-card summary-score"><div><h3>${isKk ? "Аяқталды" : "Завершено"}</h3><p>${completed} / ${total}</p></div><strong>${progress}%</strong></article>
        </div>
        <div class="section-head"><span class="eyebrow">${isKk ? "Курс модульдері" : "Модули курса"}</span><h2>${isKk ? "Ретімен оқып, нәтижеңді сақта" : "Проходи по порядку и сохраняй результат"}</h2></div>
        <div class="stage-grid">${data.stages.map(stage => stageCard(lang, stage)).join("")}</div>
        <div class="hero-actions"><a class="btn btn-secondary" href="#diagnostics">${isKk ? "Диагностикадан өту" : "Пройти диагностику"}</a><a class="btn btn-soft" href="#translator">${isKk ? "Аудармашыны ашу" : "Открыть переводчик"}</a></div>
      </div>
    </section>
  `, "course-page");
}

function renderRegistration() {
  const profile = readJson(profileKey, null);
  const selectedCourse = profile?.course || "kk";
  const chosenCourse = selectedCourse === "both" ? "Екі тіл" : selectedCourse === "ru" ? "Русский язык" : "Қазақ тілі";
  const progressCards = selectedCourse === "both" ? ["kk", "ru"] : [selectedCourse === "ru" ? "ru" : "kk"];
  shell(`
    ${pageBanner(profile ? "Жергілікті профиль" : "Бір минутта тіркел", profile ? `Қайта келдің, ${profile.name}` : "Оқуыңды өз браузеріңде сақта", "Аты-жөнің мен оқу бағытын енгіз. Аккаунт, құпиясөз және сервер қажет емес — мәліметтер тек осы құрылғыда сақталады.", "Тек осы браузерде")}
    <section class="section">
      <div class="container registration-layout">
        <form class="registration-card" id="registration-form">
          <span class="eyebrow">${profile ? "Профильді өзгерту" : "Оқушы профилі"}</span>
          <label for="learner-name">Атың</label>
          <input id="learner-name" name="name" type="text" maxlength="40" autocomplete="given-name" placeholder="Мысалы, Айдана" value="${profile ? escapeAttr(profile.name) : ""}" required>
          <label for="learner-course">Қай тілді үйренесің?</label>
          <select id="learner-course" name="course" required>
            <option value="kk" ${selectedCourse === "kk" ? "selected" : ""}>Қазақ тілі</option>
            <option value="ru" ${selectedCourse === "ru" ? "selected" : ""}>Русский язык</option>
            <option value="both" ${selectedCourse === "both" ? "selected" : ""}>Екеуі де</option>
          </select>
          <button class="btn btn-primary registration-submit" type="submit">${profile ? "Сақтау және жалғастыру" : "Тіркелу және бастау"} <span>→</span></button>
          <p class="local-note"><span>🔒</span> Профиль мен прогресс осы браузерде ғана сақталады. Басқа құрылғыда көрінбейді.</p>
        </form>
        <aside class="registration-side">
          <span class="badge">${profile ? "Профиль сақталған" : "Қарапайым бастау"}</span>
          <h2>${profile ? `Сәлем, ${escapeHtml(profile.name)}!` : "Аккаунт ашудың қажеті жоқ"}</h2>
          <p>${profile ? `Оқу бағыты: ${chosenCourse}. Жалғастырған сабақтарың осы құрылғыда сақталады.` : "Тіркелгеннен кейін аяқтаған сабақтарың браузерде автоматты түрде белгіленіп, курс бетінде прогресс ретінде көрінеді."}</p>
          ${profile ? `<div class="profile-progress-list">${progressCards.map(lang => {
            const done = countCompleted(lang);
            const total = countLessons(lang);
            const title = lang === "kk" ? "Қазақ тілі" : "Русский язык";
            return `<a href="#course/${lang}" class="profile-progress-item"><span><strong>${title}</strong><small>${done} / ${total} сабақ</small></span><span class="progress-mini"><i style="width:${Math.round(done / total * 100)}%"></i></span></a>`;
          }).join("")}</div>` : `<ol class="registration-points"><li><span>1</span> Атыңды енгіз</li><li><span>2</span> Тіл бағытын таңда</li><li><span>3</span> Бірінші модульді баста</li></ol>`}
          <a class="text-link" href="#path">Курстың үш модулін көру →</a>
        </aside>
      </div>
    </section>
  `, "registration-page");

  document.querySelector("#registration-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const course = String(form.get("course") || "kk");
    if (!name) return;
    localStorage.setItem(profileKey, JSON.stringify({ name, course, updatedAt: new Date().toISOString() }));
    showToast("Профиль осы браузерде сақталды");
    location.hash = course === "both" ? "#path" : `#course/${course}`;
  });
}

function renderStage(lang, stageId) {
  lang = normalizeLanguage(lang);
  const isKk = lang === "kk";
  const stage = data.stages.find(item => item.id === stageId) || data.stages[0];
  const lessons = data.lessons[lang][stage.id];
  const completedIds = readProgress();
  shell(`
    ${pageBanner(isKk ? stage.titleKk : stage.titleRu, `${stage.number} · ${isKk ? "модуль" : "модуль"}`, isKk ? stage.subtitleKk : stage.subtitleRu, `${lessons.length} ${isKk ? "сабақ" : "уроков"}`)}
    <section class="section">
      <div class="container">
        <div class="breadcrumbs"><a href="#course/${lang}">${isKk ? "Толық курс" : "Весь курс"}</a><span>→</span><span>${isKk ? stage.titleKk : stage.titleRu}</span></div>
        <div class="lesson-list">
          ${lessons.map((item, index) => lessonCard(lang, stage, item, index, completedIds)).join("")}
        </div>
      </div>
    </section>
  `, "stage-page");
}

function renderLesson(lang, stageId, number) {
  lang = normalizeLanguage(lang);
  const isKk = lang === "kk";
  const stage = data.stages.find(item => item.id === stageId) || data.stages[0];
  const lessons = data.lessons[lang][stage.id];
  const safeNumber = Math.min(Math.max(number, 1), lessons.length);
  const current = lessons[safeNumber - 1];
  const nextHref = safeNumber < lessons.length
    ? `#lesson/${lang}/${stage.id}/${safeNumber + 1}`
    : nextStageHref(lang, stage.id);
  shell(`
    <section class="lesson-hero">
      <div class="container">
        <div class="breadcrumbs light"><a href="#course/${lang}">${isKk ? "Курс" : "Курс"}</a><span>→</span><a href="#stage/${lang}/${stage.id}">${isKk ? stage.titleKk : stage.titleRu}</a></div>
        <span class="badge">${stage.number} · ${safeNumber}/${lessons.length}</span>
        <h1>${escapeHtml(current.title)}</h1>
        <p>${escapeHtml(current.summary)}</p>
      </div>
    </section>
    <section class="section">
      <div class="container lesson-layout">
        <article class="lesson-content-card">
          <span class="eyebrow">${isKk ? "Қысқа теория" : "Короткая теория"}</span>
          <h2>${isKk ? "Есте сақта" : "Запомни"}</h2>
          <p class="lesson-theory">${escapeHtml(current.theory)}</p>
          <div class="example-grid">
            ${current.examples.map(example => `<div class="example-card"><strong>${escapeHtml(example[0])}</strong><span class="han">${escapeHtml(example[1])}</span><button class="speak-button" type="button" data-action="speak" data-text="${escapeAttr(example[0])}" data-lang="${lang}">🔊</button></div>`).join("")}
          </div>
          <p class="audio-note">Аудио құрылғыда орнатылған дауыс арқылы оқылады. Қажетті тілдің дауысы болмаса, сайт қате дыбыстаудың орнына дыбысты қоспайды.</p>
        </article>
        <article class="quiz-card" data-quiz data-lang="${lang}" data-stage="${stage.id}" data-lesson="${safeNumber}">
          <span class="eyebrow">${isKk ? "Өзіңді тексер" : "Проверь себя"}</span>
          <h2>${escapeHtml(current.quiz.question)}</h2>
          <div class="quiz-options">${current.quiz.options.map(option => `<button class="quiz-option" type="button" data-action="quiz-answer" data-answer="${escapeAttr(option)}">${escapeHtml(option)}</button>`).join("")}</div>
          <div class="quiz-feedback" data-feedback aria-live="polite"></div>
          <a class="btn btn-primary lesson-next" data-next href="${nextHref}">${isKk ? "Келесі сабақ" : "Следующий урок"} →</a>
        </article>
      </div>
    </section>
  `, "lesson-page");
}

function renderTranslator() {
  shell(`
    ${pageBanner("Үш тілді аудармашы", "中文 · Қазақша · Русский", "Курс ішінде кездесетін негізгі сөздер мен сөйлемдерді үш тіл арасында аударуға арналған оқу құралы.", "3 тіл")}
    <section class="section">
      <div class="container">
        <div class="translator-layout">
          <div class="translator-panel">
            <label for="source-lang">Бастапқы тіл</label>
            <select id="source-lang"><option value="zh">中文</option><option value="kk">Қазақша</option><option value="ru">Русский</option></select>
            <textarea id="source-text" class="han" placeholder="Сөз немесе сөйлем жазыңыз">学校</textarea>
            <div class="translator-actions"><span class="badge">${data.dictionary.length} оқу үлгісі</span><button class="btn btn-primary btn-small" type="button" data-action="translate">Аудару</button></div>
          </div>
          <button class="swap-button" type="button" data-action="swap-languages" aria-label="Тілдерді ауыстыру">⇄</button>
          <div class="translator-panel">
            <label for="target-lang">Аударма тілі</label>
            <select id="target-lang"><option value="kk">Қазақша</option><option value="ru">Русский</option><option value="zh">中文</option></select>
            <div class="translation-result" id="translation-result"><span class="translation-placeholder">Аударма осы жерде шығады</span></div>
            <div class="translator-actions"><span id="translation-note" class="badge demo">Оқу сөздігі</span><button class="btn btn-soft btn-small" type="button" data-action="speak-translation">🔊 Тыңдау</button></div>
          </div>
        </div>
        <div class="dictionary-chips">${data.dictionary.slice(0, 12).map(item => `<button class="dictionary-chip han" type="button" data-action="dictionary-chip" data-value="${escapeAttr(item.zh)}">${escapeHtml(item.zh)} · ${escapeHtml(item.kk)}</button>`).join("")}</div>
        <div class="research-note" style="margin-top:24px"><strong>Ескерту:</strong> бұл оқу сөздігі курс тақырыптарындағы сөздер мен сөйлемдерге арналған. Еркін мәтін үшін сыртқы аударма сервисі қажет.</div>
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
    ${pageBanner("Диагностика", "8 тапсырма арқылы деңгейіңді анықта", "Әріп, сөз, сөйлем және аударма бойынша қысқа тексеру. Жауаптан кейін ғана дұрыс нұсқа көрсетіледі.", "8 тапсырма")}
    <section class="section"><div class="container diagnostic-shell"><div class="diagnostic-card result-hero">
      <span class="badge">Жеке нәтиже осы браузерде сақталады</span>
      <h2>Қай модульден бастау керегін біл</h2>
      <p>Тест шамамен 3 минут алады. Әр сұрақта бір дұрыс жауап бар.</p>
      ${latest ? `<div class="result-score">${latest.percent}%</div><p>Соңғы нәтиже: ${escapeHtml(latest.date)}</p>` : `<div class="result-score">8</div><p>қысқа тапсырма</p>`}
      <div class="hero-actions" style="justify-content:center"><button class="btn btn-primary" type="button" data-action="start-diagnostic">Диагностиканы бастау</button><a class="btn btn-secondary" href="#path">Курс құрылымын көру</a></div>
    </div></div></section>
  `, "diagnostics-page");
}

function renderDiagnosticQuestion() {
  const session = appState.diagnostic;
  const item = data.diagnostics[session.index];
  const progress = Math.round(session.index / data.diagnostics.length * 100);
  shell(`<section class="section"><div class="container diagnostic-shell"><div class="diagnostic-card" data-diagnostic>
    <div class="diagnostic-top"><p>Диагностика · ${session.index + 1}/${data.diagnostics.length}</p><div class="diagnostic-progress"><span style="width:${progress}%"></span></div></div>
    <div class="diagnostic-type"><span class="badge">${escapeHtml(item.type)}</span></div>
    <h2>${escapeHtml(item.question)}</h2>
    <div class="diagnostic-options">${item.options.map(option => `<button class="diagnostic-answer" type="button" data-action="diagnostic-answer" data-answer="${escapeAttr(option)}">${escapeHtml(option)}</button>`).join("")}</div>
  </div></div></section>`, "diagnostic-active");
}

function renderDiagnosticResult() {
  const session = appState.diagnostic;
  const percent = Math.round(session.correct / data.diagnostics.length * 100);
  const recommendation = percent < 50 ? "01 · Әріптер модулінен баста" : percent < 80 ? "02 · Сөздер модулінен баста" : "03 · Сөйлемдер модуліне дайынсың";
  shell(`<section class="section"><div class="container diagnostic-shell"><div class="diagnostic-card result-hero">
    <span class="badge success">Диагностика аяқталды</span><div class="result-score">${percent}%</div>
    <h2>${session.correct}/${data.diagnostics.length} дұрыс жауап</h2><p>${recommendation}</p>
    <div class="hero-actions" style="justify-content:center"><a class="btn btn-primary" href="#path">Курсқа өту</a><button class="btn btn-secondary" type="button" data-action="restart-diagnostic">Қайта өту</button></div>
  </div></div></section>`, "diagnostic-result");
}

function renderProject() {
  shell(`
    ${pageBanner("Жоба туралы", "Til Bridge қалай оқытады?", "Платформа қытай тілді оқушыға жаңа тілді шағын, түсінікті қадамдармен меңгеруге көмектеседі.", "Оқу әдістемесі")}
    <section class="section"><div class="container">
      <div class="section-head center"><span class="eyebrow">Негізгі қағида</span><h2>Көру → қайталау → қолдану → тексеру</h2><p>Әр сабақ бір дағдыға бағытталады және бірден шағын тапсырмамен бекітіледі.</p></div>
      <div class="feature-grid">
        <article class="feature-card"><span class="feature-icon">01</span><h3>Әріптер</h3><p>Дыбысты есту, әріпті тану және қазақ немесе орыс тілінің ерекшелігін дұрыс айту.</p></article>
        <article class="feature-card"><span class="feature-icon">02</span><h3>Сөздер</h3><p>Отбасы, мектеп, түс және күнделікті әрекеттер арқылы негізгі сөздік қор құру.</p></article>
        <article class="feature-card"><span class="feature-icon">03</span><h3>Сөйлемдер</h3><p>Сөз тәртібін түсініп, өз ойын қысқа әрі грамматикалық дұрыс сөйлеммен жеткізу.</p></article>
      </div>
      <div class="research-note"><strong>Деректер туралы:</strong> сайт жеке оқушының мәліметтерін жинамайды. Сабақ прогресі мен соңғы диагностика нәтижесі тек пайдаланушының браузерінде сақталады.</div>
      <div class="hero-actions"><a class="btn btn-primary" href="#path">Курсты ашу</a><a class="btn btn-secondary" href="#diagnostics">Диагностикадан өту</a></div>
    </div></section>
  `, "project-page");
}

function renderNotFound() {
  shell(`<section class="section"><div class="container diagnostic-shell"><div class="diagnostic-card result-hero"><div class="result-score">404</div><h2>Бет табылмады</h2><p>Қажетті бөлімге басты мәзір арқылы өтіңіз.</p><a class="btn btn-primary" href="#home">Басты бетке қайту</a></div></div></section>`);
}

function stageCard(lang, stage) {
  const isKk = lang === "kk";
  const lessons = data.lessons[lang][stage.id];
  const completed = lessons.filter((_, index) => isCompleted(lang, stage.id, index + 1)).length;
  return `<a class="stage-card ${stage.accent}" href="#stage/${lang}/${stage.id}">
    <div class="stage-card-top"><span class="stage-icon">${stage.icon}</span><span class="stage-number">${stage.number}</span></div>
    <h3>${isKk ? stage.titleKk : stage.titleRu}</h3><p>${isKk ? stage.subtitleKk : stage.subtitleRu}</p>
    <div class="stage-meta"><span>${lessons.length} ${isKk ? "сабақ" : "уроков"}</span><span>${completed}/${lessons.length}</span></div>
    <div class="progress-line"><span style="width:${Math.round(completed / lessons.length * 100)}%"></span></div>
  </a>`;
}

function lessonCard(lang, stage, item, index, completedIds) {
  const id = lessonId(lang, stage.id, index + 1);
  const done = completedIds.includes(id);
  return `<a class="lesson-card ${done ? "completed" : ""}" href="#lesson/${lang}/${stage.id}/${index + 1}">
    <span class="lesson-number">${String(index + 1).padStart(2, "0")}</span>
    <span class="lesson-card-copy"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.summary)}</small></span>
    <span class="lesson-status">${done ? "✓" : "→"}</span>
  </a>`;
}

function pageBanner(kicker, title, description, meta) {
  return `<section class="page-banner"><div class="container"><span class="eyebrow">${escapeHtml(kicker)}</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><span class="page-meta">${escapeHtml(meta)}</span></div></section>`;
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
}

function answerLessonQuiz(button) {
  const quiz = button.closest("[data-quiz]");
  if (!quiz || quiz.dataset.answered === "true") return;
  const { lang, stage } = quiz.dataset;
  const number = Number(quiz.dataset.lesson);
  const item = data.lessons[lang][stage][number - 1];
  const correct = button.dataset.answer === item.quiz.answer;
  quiz.dataset.answered = "true";
  quiz.querySelectorAll(".quiz-option").forEach(option => {
    option.disabled = true;
    if (option.dataset.answer === item.quiz.answer) option.classList.add("correct");
    else if (option === button) option.classList.add("wrong");
  });
  quiz.querySelector("[data-feedback]").textContent = `${correct ? "✓" : "✕"} ${item.quiz.explanation}`;
  if (correct) {
    markLessonCompleted(lang, stage, number);
    showToast(lang === "kk" ? "Сабақ аяқталды — нәтиже сақталды" : "Урок завершён — результат сохранён");
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
    else if (button.dataset.answer === answer) button.style.cssText = "border-color:#d64c4c;background:#fff0f0;color:#a73232";
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
  const source = document.querySelector("#source-lang");
  const target = document.querySelector("#target-lang");
  const input = document.querySelector("#source-text");
  const output = document.querySelector("#translation-result");
  const note = document.querySelector("#translation-note");
  if (!source || !target || !input || !output) return;
  const query = input.value.trim().toLocaleLowerCase();
  if (!query) {
    output.innerHTML = `<span class="translation-placeholder">Аударма осы жерде шығады</span>`;
    return;
  }
  const exact = data.dictionary.find(item => String(item[source.value]).toLocaleLowerCase() === query);
  if (exact) {
    output.textContent = exact[target.value];
    output.classList.toggle("han", target.value === "zh");
    note.textContent = "Сөздіктен табылды";
    return;
  }
  const parts = query.split(/\s+/);
  const translated = parts.map(part => {
    const entry = data.dictionary.find(item => String(item[source.value]).toLocaleLowerCase() === part.replace(/[.,!?]/g, ""));
    return entry ? entry[target.value] : part;
  }).join(" ");
  output.textContent = translated === query ? "Оқу сөздігінде табылмады" : translated;
  output.classList.toggle("han", target.value === "zh");
  note.textContent = translated === query ? "Сөздікті толықтыру қажет" : "Сөздер бойынша аударылды";
}

function swapLanguages() {
  const source = document.querySelector("#source-lang");
  const target = document.querySelector("#target-lang");
  const input = document.querySelector("#source-text");
  const output = document.querySelector("#translation-result");
  if (!source || !target || !input || !output) return;
  const oldSource = source.value;
  source.value = target.value;
  target.value = oldSource;
  if (!output.querySelector(".translation-placeholder")) input.value = output.textContent.trim();
  translateCurrent();
}

function useDictionaryChip(value) {
  const input = document.querySelector("#source-text");
  const source = document.querySelector("#source-lang");
  if (!input || !source) return;
  source.value = "zh";
  input.value = value;
  translateCurrent();
}

function speakTranslation() {
  const target = document.querySelector("#target-lang");
  const output = document.querySelector("#translation-result");
  if (target && output) speak(output.textContent.trim(), target.value);
}

function speak(text, lang) {
  if (!("speechSynthesis" in window) || !text) return showToast("Бұл браузерде дыбыстау қолжетімсіз.");
  const locale = lang === "zh" ? "zh-CN" : lang === "ru" ? "ru-RU" : "kk-KZ";
  const prefix = locale.slice(0, 2).toLowerCase();
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  const voice = voices.find(item => item.lang.toLowerCase() === locale.toLowerCase())
    || voices.find(item => item.lang.toLowerCase().startsWith(prefix));
  if (!voice) {
    const languageName = lang === "kk" ? "қазақша" : lang === "ru" ? "орысша" : "қытайша";
    return showToast(`Бұл құрылғыда ${languageName} дауыс жоқ. Қате дыбыстау болмас үшін аудио қосылмады.`);
  }
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.lang = voice.lang;
  utterance.rate = 0.78;
  synth.speak(utterance);
}

function nextStageHref(lang, stageId) {
  const index = data.stages.findIndex(stage => stage.id === stageId);
  return index < data.stages.length - 1 ? `#stage/${lang}/${data.stages[index + 1].id}` : `#course/${lang}`;
}

function countLessons(lang) {
  return data.stages.reduce((sum, stage) => sum + data.lessons[lang][stage.id].length, 0);
}

function countCompleted(lang) {
  const progress = readProgress();
  return data.stages.reduce((sum, stage) => sum + data.lessons[lang][stage.id].filter((_, index) => progress.includes(lessonId(lang, stage.id, index + 1))).length, 0);
}

function lessonId(lang, stage, number) {
  return `${lang}:${stage}:${number}`;
}

function isCompleted(lang, stage, number) {
  return readProgress().includes(lessonId(lang, stage, number));
}

function markLessonCompleted(lang, stage, number) {
  const progress = readProgress();
  const id = lessonId(lang, stage, number);
  if (!progress.includes(id)) {
    progress.push(id);
    localStorage.setItem(completionKey, JSON.stringify(progress));
  }
}

function readProgress() {
  return readJson(completionKey, []);
}

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch (_) {
    return fallback;
  }
}

function normalizeLanguage(lang) {
  return lang === "ru" ? "ru" : "kk";
}

function showToast(message) {
  clearTimeout(appState.toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  appState.toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

if (!location.hash) location.hash = "#home";
renderRoute();
