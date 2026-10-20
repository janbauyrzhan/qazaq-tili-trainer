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
  if (route !== "test") appState.test = null;
  if (route !== "diagnostics") appState.diagnostic = null;
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  document.querySelector(".nav-profile").textContent = getProfile() ? "Профиль" : "Тіркелу";
  setActiveNav(route);

  if (route === "home") renderHome();
  else if (route === "path") renderPath();
  else if (route === "course") renderCourse(parts[1] || "kk");
  else if (route === "stage") renderStage(parts[1] || "kk", parts[2] || "letters");
  else if (route === "lesson") renderLesson(parts[1] || "kk", parts[2] || "letters", Number(parts[3] || 1));
  else if (route === "test") renderLesson(parts[1] || "kk", parts[2] || "letters", Number(parts[3] || 1), true);
  else if (route === "translator") renderTranslator();
  else if (route === "diagnostics") renderDiagnostics();
  else if (route === "register") renderRegistration();
  else if (route === "project") renderProject();
  else renderNotFound();

  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(() => view.focus({ preventScroll: true }), 0);
}

function setActiveNav(route) {
  const active = ["course", "stage", "lesson", "test"].includes(route) ? "path" : route;
  document.querySelectorAll("[data-nav]").forEach(link => {
    link.classList.toggle("active", link.dataset.nav === active);
  });
}

function shell(content, className = "") {
  view.innerHTML = `<div class="page ${className}">${content}</div>`;
}

function renderHome() {
  const profile = getProfile();
  const lang = profile?.course === "ru" ? "ru" : "kk";
  const resume = nextLesson(lang);
  shell(`
    <section class="home-hero"><div class="container hero-grid">
      <div class="hero-copy">
        <span class="eyebrow">ҚАЗАҚША · РУССКИЙ · 中文</span>
        <h1>${profile ? `Сәлем, ${escapeHtml(profile.name)}!` : "Жаңа тіл.<br>Кішкентай қадам.<br><em>Үлкен мүмкіндік.</em>"}</h1>
        <p>${profile ? "Бүгін тағы бір қадам жаса. Тоқтаған жеріңнен жалғастыр." : "Әріптерді таны. Сөздерді үйрен. Алғашқы сөйлеміңді құра. Әр сабақта — бір түсінікті мақсат."}</p>
        <div class="hero-actions"><a class="btn btn-primary" href="${profile ? resume : "#register"}">${profile ? "Оқуды жалғастыру" : "Оқуды бастау"} <span>→</span></a>
        <a class="text-link" href="#path">Курсты көру ↗</a></div>
        <p class="hero-caption">3 модуль · әр тілде 16 сабақ · өз қарқыныңмен</p>
      </div>
      <div class="learning-art" aria-label="Әріптен сөзге, сөзден сөйлемге">
        <span class="art-caption">СЕНІҢ АЛҒАШҚЫ ҚАДАМЫҢ</span>
        <div class="art-letter">Ә<span>ә</span><small>01 / ӘРІПТЕР</small></div>
        <div class="art-word"><span>02 / СӨЗДЕР</span><strong>әке</strong><small>爸爸 · папа</small></div>
        <div class="art-sentence"><span>03 / СӨЙЛЕМДЕР</span><strong>Бұл — менің әкем.</strong><small>这是我的爸爸。</small></div>
      </div>
    </div></section>
    <section class="section"><div class="container">
      <div class="section-head"><span class="eyebrow">БӘРІ ТҮСІНІКТІ</span><h2>Үйренудің үш қадамы</h2></div>
      <div class="how-grid"><article><span>01</span><h3>Оқып түсін</h3><p>Қысқа ереже мен нақты мысалдар.</p></article><article><span>02</span><h3>Өзіңді тексер</h3><p>Конспектсіз жауап бер. Түсіндірмені оқы.</p></article><article><span>03</span><h3>Жалғастыр</h3><p>Нәтижең осы браузерде сақталады.</p></article></div>
    </div></section>
  `, "home-page");
}

function getProfile() {
  const value = readJson(profileKey, null);
  return value && typeof value.name === "string" && ["kk", "ru", "both"].includes(value.course) ? value : null;
}

function nextLesson(lang) {
  for (const stage of data.stages) {
    const index = data.lessons[lang][stage.id].findIndex((_, i) => !isCompleted(lang, stage.id, i + 1));
    if (index !== -1) return `#lesson/${lang}/${stage.id}/${index + 1}`;
  }
  return `#course/${lang}`;
}

function renderPath() {
  const lang = getProfile()?.course === "ru" ? "ru" : "kk";
  renderCourse(lang);
}

function renderCourse(lang) {
  lang = normalizeLanguage(lang);
  const kk = lang === "kk", done = countCompleted(lang), total = countLessons(lang);
  shell(`
    <section class="course-heading container">
      <div class="course-heading-top"><span class="eyebrow">СЕНІҢ ОҚУ ЖОЛЫҢ</span>
        <nav class="language-switch" aria-label="Курс тілі"><a href="#course/kk" ${kk ? 'aria-current="page"' : ""}>Қазақша</a><a href="#course/ru" ${!kk ? 'aria-current="page"' : ""}>Русский</a></nav>
      </div>
      <h1>${kk ? "Қазақ тілін бірге үйренейік" : "Русский язык. Шаг за шагом."}</h1>
      <p>${kk ? "Әріптен алғашқы сөйлемге дейін. Бір сабақ — бір жаңа дағды." : "От букв к первым предложениям. Один урок — один новый навык."}</p>
      <div class="course-progress"><div><strong>${done} / ${total}</strong><span>${kk ? "сабақ аяқталды" : "уроков завершено"}</span></div><div class="progress-line"><span style="width:${done / total * 100}%"></span></div>
        <a class="btn btn-primary btn-small" href="${nextLesson(lang)}">${done === total ? (kk ? "Қайталау" : "Повторить") : done ? (kk ? "Жалғастыру" : "Продолжить") : (kk ? "Бірінші сабақ" : "Первый урок")} →</a></div>
    </section>
    <section class="section course-body"><div class="container">
      <div class="stage-grid">${data.stages.map(stage => stageCard(lang, stage)).join("")}</div>
      <div class="course-help"><span>${kk ? "Қай жерден бастарыңды білмейсің бе?" : "Не знаешь, с чего начать?"}</span><a href="#diagnostics" class="text-link">${kk ? "Біліміңді тексер" : "Проверь свои знания"} →</a></div>
    </div></section>
  `, "course-page");
}

function renderRegistration() {
  const profile = getProfile();
  const selectedCourse = profile?.course || "kk";
  const chosenCourse = selectedCourse === "both" ? "Екі тіл" : selectedCourse === "ru" ? "Русский язык" : "Қазақ тілі";
  const progressCards = selectedCourse === "both" ? ["kk", "ru"] : [selectedCourse === "ru" ? "ru" : "kk"];
  shell(`
    ${pageBanner(profile ? "Жергілікті профиль" : "Бір минутта тіркел", profile ? `Қайта келдің, ${profile.name}` : "Оқуыңды өз браузеріңде сақта", "Есіміңді енгізіп, үйренетін тіліңді таңда. Бұл — бір браузерге арналған жергілікті профиль.", "Тек осы браузерде")}
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
    if (!saveJson(profileKey, { name, course, updatedAt: new Date().toISOString() })) return;
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

function renderLesson(lang, stageId, number, testing = false) {
  lang = normalizeLanguage(lang);
  const kk = lang === "kk";
  const stage = data.stages.find(item => item.id === stageId) || data.stages[0];
  const lessons = data.lessons[lang][stage.id];
  const n = Number.isFinite(number) ? Math.min(Math.max(Math.trunc(number), 1), lessons.length) : 1;
  const current = lessons[n - 1];
  const base = `${lang}/${stage.id}/${n}`;
  const source = data.sources[lang];
  if (testing && (!appState.test || appState.test.key !== base)) {
    appState.test = { key: base, index: 0, answers: [], finished: false };
  }
  shell(`
    <section class="lesson-heading container narrow">
      <a href="#stage/${lang}/${stage.id}" class="back-link">← ${kk ? stage.titleKk : stage.titleRu}</a>
      <div class="lesson-heading-meta"><span class="eyebrow">${kk ? "САБАҚ" : "УРОК"} ${n} / ${lessons.length}</span><span>~ 5 ${kk ? "минут" : "минут"}</span></div>
      <h1>${escapeHtml(current.title)}</h1><p>${escapeHtml(current.summary)}</p>
      <div class="lesson-steps"><span class="${!testing ? "current" : ""}">01 · ${kk ? "Үйрену" : "Изучить"}</span><span class="${testing ? "current" : ""}">02 · ${kk ? "Өзіңді тексеру" : "Проверить себя"}</span></div>
    </section>
    <section class="section lesson-section"><div class="container narrow">
    ${testing ? '<div id="test-panel"></div>' : `
      <article class="lesson-content-card">
        <span class="eyebrow">${kk ? "НЕГІЗГІ ЕРЕЖЕ" : "ГЛАВНОЕ ПРАВИЛО"}</span>
        <h2>${kk ? "Оқып, түсініп ал" : "Разберёмся вместе"}</h2>
        <p class="lesson-theory">${escapeHtml(current.theory)}</p>
        <div class="lesson-tip">${escapeHtml(current.note)}</div>
        <h3>${kk ? "Мысалдарды салыстыр" : "Сравни примеры"}</h3>
        <div class="example-grid">${current.examples.map(example => `<div class="example-card"><strong>${escapeHtml(example[0])}</strong><span>${escapeHtml(example[1])}</span>${stage.id !== "letters" ? `<button class="speak-button" type="button" data-action="speak" data-text="${escapeAttr(example[0])}" data-lang="${lang}" aria-label="${kk ? "Тыңдау:" : "Прослушать:"} ${escapeAttr(example[0])}">▷</button>` : ""}</div>`).join("")}</div>
        <div class="practice-note"><strong>${kk ? "Кішкентай жаттығу" : "Небольшая практика"}</strong><p>${escapeHtml(current.practice)}</p></div>
        <details class="lesson-sources"><summary>${kk ? "Дереккөздер және дыбыстау туралы" : "Источники и озвучивание"}</summary>
          <p>${kk ? "Конспект қысқаша, өз сөзімізбен жазылған. Қосымша оқу:" : "Конспект изложен своими словами. Дополнительное чтение:"}</p>
          ${source.map(item => `<a href="${item.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)} ↗</a>`).join("")}
          <p>${kk ? "Автоматты дауыс — көмекші құрал, айтылым үлгісі емес. Әріп атауын дыбыспен шатастырмау үшін жеке әріптер дыбысталмайды. Қажетті дауыс болмаса, аудио өшіріледі." : "Синтез речи — вспомогательный инструмент, не эталон произношения. Отдельные буквы не озвучиваются: название буквы и звук отличаются. Без подходящего голоса аудио недоступно."}</p>
        </details>
      </article>
      <div class="study-finish"><div><strong>${kk ? "Дайынсың ба?" : "Готов проверить себя?"}</strong><p>${kk ? "Тексеру кезінде конспект көрсетілмейді." : "Во время проверки конспект будет скрыт."}</p></div>
        <a class="btn btn-primary" href="#test/${base}">${kk ? "Тестке өту" : "Перейти к тесту"} →</a></div>
    `}
    </div></section>`, "lesson-page");
  if (testing) renderTestPanel(current, lang, stage.id, n);
}

function renderTestPanel(lesson, lang, stage, number) {
  const session = appState.test, kk = lang === "kk";
  const panel = document.querySelector("#test-panel");
  if (!panel) return;
  if (session.finished) {
    const score = session.answers.filter(Boolean).length, passed = score === lesson.questions.length;
    const next = number < data.lessons[lang][stage].length ? `#lesson/${lang}/${stage}/${number + 1}` : nextStageHref(lang, stage);
    panel.innerHTML = `<article class="quiz-card result-hero"><span class="badge">${kk ? "НӘТИЖЕ" : "РЕЗУЛЬТАТ"}</span><div class="result-score">${score}/${lesson.questions.length}</div>
      <h2>${passed ? (kk ? "Жарайсың!" : "Отличная работа!") : (kk ? "Тағы бір рет қайталайық" : "Давай ещё немного потренируемся")}</h2>
      <p>${passed ? (kk ? "Барлық жауап дұрыс. Сабақ аяқталды." : "Все ответы верны. Урок завершён.") : (kk ? "Сабақты аяқтау үшін барлық сұраққа дұрыс жауап бер." : "Для завершения урока ответь верно на все вопросы.")}</p>
      <div class="hero-actions"><button class="btn btn-secondary" data-action="retry-test">${kk ? "Қайта тексеру" : "Попробовать снова"}</button><a class="btn btn-primary" href="${passed ? next : `#lesson/${lang}/${stage}/${number}`}">${passed ? (kk ? "Жалғастыру" : "Продолжить") : (kk ? "Конспектке оралу" : "Вернуться к конспекту")} →</a></div></article>`;
    return;
  }
  const q = lesson.questions[session.index];
  panel.innerHTML = `<article class="quiz-card"><div class="test-top"><span class="eyebrow">${kk ? "ӨЗІҢДІ ТЕКСЕР" : "ПРОВЕРЬ СЕБЯ"}</span><span>${session.index + 1} / ${lesson.questions.length}</span></div>
    <h2>${escapeHtml(q.question)}</h2><p class="muted">${kk ? "Бір дұрыс жауапты таңда." : "Выбери один правильный ответ."}</p>
    <div class="quiz-options">${q.options.map((option, i) => `<button class="quiz-option" data-option="${i}"><span class="option-index">${i + 1}</span>${escapeHtml(option)}</button>`).join("")}</div>
    <div class="quiz-feedback" role="status"></div><button class="btn btn-primary" id="test-next" hidden>${session.index + 1 === lesson.questions.length ? (kk ? "Нәтижені көру" : "Посмотреть результат") : (kk ? "Келесі сұрақ" : "Следующий вопрос")} →</button></article>`;
  panel.querySelectorAll("[data-option]").forEach(button => button.addEventListener("click", () => {
    if (session.answers.length > session.index) return;
    const correct = q.options[Number(button.dataset.option)] === q.answer;
    session.answers.push(correct);
    panel.querySelectorAll("[data-option]").forEach(el => {
      el.disabled = true;
      if (q.options[Number(el.dataset.option)] === q.answer) el.classList.add("correct");
      else if (el === button) el.classList.add("wrong");
    });
    panel.querySelector(".quiz-feedback").textContent = `${correct ? (kk ? "Дұрыс! " : "Верно! ") : (kk ? "Әзірге дұрыс емес. " : "Пока неверно. ")}${q.explanation}`;
    panel.querySelector("#test-next").hidden = false;
  }));
  panel.querySelector("#test-next").addEventListener("click", () => {
    if (session.answers.length <= session.index) return;
    session.index++;
    if (session.index >= lesson.questions.length) {
      session.finished = true;
      if (session.answers.every(Boolean)) markLessonCompleted(lang, stage, number);
    }
    renderTestPanel(lesson, lang, stage, number);
    panel.querySelector("h2").setAttribute("tabindex", "-1");
    panel.querySelector("h2").focus();
  });
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
  shell(`${pageBanner("Біліміңді тексер", "Қай жерден бастаймыз?", "Тілді таңда. 6 қысқа сұрақ таныс тақырыптарды анықтауға көмектеседі. Бұл ресми деңгей емтиханы емес.", "Шамамен 3 минут")}
    <section class="section"><div class="container diagnostic-shell"><div class="diagnostic-card result-hero">
      <span class="badge">Әріптер → сөздер → сөйлемдер</span><h2 style="margin-top:22px">Қай тілді тексереміз?</h2>
      <p>Әр жауаптан кейін түсіндірмені оқып, келесі сұраққа өзің өтесің.</p>
      ${latest && typeof latest.percent === "number" ? `<p>Соңғы нәтиже: ${latest.lang === "ru" ? "Русский" : latest.lang === "kk" ? "Қазақша" : ""} · ${latest.percent}% · ${escapeHtml(latest.date)}</p>` : ""}
      <div class="hero-actions"><button class="btn btn-primary" data-action="start-diagnostic" data-lang="kk">Қазақша →</button><button class="btn btn-secondary" data-action="start-diagnostic" data-lang="ru">Русский →</button></div>
    </div></div></section>`, "diagnostics-page");
}

function renderDiagnosticQuestion() {
  const session = appState.diagnostic, kk = session.lang === "kk";
  const item = session.questions[session.index];
  shell(`<section class="section"><div class="container diagnostic-shell"><div class="diagnostic-card">
    <div class="test-top"><span class="eyebrow">${kk ? "БІЛІМІҢДІ ТЕКСЕР" : "ПРОВЕРЬ СВОИ ЗНАНИЯ"}</span><span>${session.index + 1} / ${session.questions.length}</span></div>
    <span class="badge">${item.topic}</span><h2 style="margin-top:20px">${escapeHtml(item.question)}</h2>
    <div class="diagnostic-options">${item.options.map(option => `<button class="diagnostic-answer" data-action="diagnostic-answer" data-answer="${escapeAttr(option)}">${escapeHtml(option)}</button>`).join("")}</div>
    <p id="level-feedback" role="status"></p><button class="btn btn-primary" data-action="level-next" hidden>${kk ? "Жалғастыру" : "Продолжить"} →</button>
    <div style="margin-top:22px"><a href="#path" class="text-link">${kk ? "Курсқа оралу" : "Вернуться к курсу"}</a></div>
  </div></div></section>`, "diagnostic-active");
}

function renderDiagnosticResult() {
  const session = appState.diagnostic, kk = session.lang === "kk";
  const percent = Math.round(session.correct / session.questions.length * 100);
  const weak = data.stages.find(stage => session.answers.some((a, index) => !a && session.questions[index].stage === stage.id));
  const target = weak || data.stages[2];
  shell(`<section class="section"><div class="container diagnostic-shell"><div class="diagnostic-card result-hero">
    <span class="badge">${kk ? "Тексеру аяқталды" : "Проверка завершена"}</span><div class="result-score">${session.correct}/${session.questions.length}</div>
    <h2>${weak ? (kk ? "Осы тақырыпты қайталап көр" : "Начни с повторения этой темы") : (kk ? "Жақсы бастама!" : "Отличное начало!")}</h2>
    <p>${kk ? target.titleKk : target.titleRu} · ${percent}%</p>
    <p>${kk ? "Бұл шағын тексеру тілді толық меңгеру деңгейін анықтамайды." : "Эта короткая проверка не определяет общий уровень владения языком."}</p>
    <div class="hero-actions"><a class="btn btn-primary" href="#stage/${session.lang}/${target.id}">${kk ? "Модульге өту" : "Перейти к модулю"} →</a><button class="btn btn-secondary" data-action="restart-diagnostic" data-lang="${session.lang}">${kk ? "Қайта өту" : "Ещё раз"}</button></div>
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
      <div class="research-note"><strong>Деректер туралы:</strong> сайт жеке оқушының мәліметтерін жинамайды. Сабақ прогресі мен соңғы тексеру нәтижесі тек пайдаланушының браузерінде сақталады.</div>
      <div class="hero-actions"><a class="btn btn-primary" href="#path">Курсты ашу</a><a class="btn btn-secondary" href="#diagnostics">Біліміңді тексер</a></div>
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
  if (action === "retry-test") { appState.test = null; renderRoute(); }

  else if (action === "speak") speak(trigger.dataset.text || "", trigger.dataset.lang || "kk");
  else if (action === "start-diagnostic" || action === "restart-diagnostic") startDiagnostic(trigger.dataset.lang);
  else if (action === "level-next") nextDiagnosticQuestion();
  else if (action === "diagnostic-answer") answerDiagnostic(trigger.dataset.answer);
  else if (action === "translate") translateCurrent();
  else if (action === "swap-languages") swapLanguages();
  else if (action === "dictionary-chip") useDictionaryChip(trigger.dataset.value);
  else if (action === "speak-translation") speakTranslation();
}

function startDiagnostic(lang = "kk") {
  lang = normalizeLanguage(lang);
  const questions = data.stages.flatMap(stage => [0, data.lessons[lang][stage.id].length - 1].map(i => ({
    ...data.lessons[lang][stage.id][i].questions[1], stage: stage.id,
    topic: lang === "kk" ? stage.titleKk : stage.titleRu
  })));
  appState.diagnostic = { lang, questions, index: 0, correct: 0, answers: [], finished: false };
  renderDiagnosticQuestion();
}

function answerDiagnostic(answer) {
  const session = appState.diagnostic;
  if (!session || session.finished || session.answers.length > session.index) return;
  const current = session.questions[session.index];
  const correct = answer === current.answer;
  session.answers.push(correct);
  if (correct) session.correct++;
  document.querySelectorAll(".diagnostic-answer").forEach(button => {
    button.disabled = true;
    if (button.dataset.answer === current.answer) button.style.cssText = "border-color:#59936b;background:#eaf5ee";
    else if (button.dataset.answer === answer) button.style.cssText = "border-color:#cf8c80;background:#fff0ed";
  });
  document.querySelector("#level-feedback").textContent = current.explanation;
  document.querySelector("[data-action=level-next]").hidden = false;
}

function nextDiagnosticQuestion() {
  const session = appState.diagnostic;
  if (!session || session.answers.length <= session.index) return;
  session.index++;
  if (session.index >= session.questions.length) {
    session.finished = true;
    saveJson(diagnosticKey, { lang: session.lang, percent: Math.round(session.correct / session.questions.length * 100), correct: session.correct, date: new Date().toLocaleDateString("kk-KZ") });
    renderDiagnosticResult();
  } else renderDiagnosticQuestion();
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
  output.textContent = "Оқу сөздігінде табылмады";
  note.textContent = "Тек сөздіктегі дайын үлгілер аударылады";
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
    saveJson(completionKey, progress);
  }
}

function readProgress() {
  const progress = readJson(completionKey, []);
  return Array.isArray(progress) ? progress.filter(id => typeof id === "string") : [];
}

function saveJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch (_) { showToast("Сақтау мүмкін болмады. Браузер баптауларын тексеріңіз."); return false; }
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
const welcomeDialog = document.querySelector("#welcome-dialog");
function rememberWelcome() {
  try { sessionStorage.setItem("tilBridgeWelcomeSeen", "1"); } catch (_) {}
}
welcomeDialog.addEventListener("close", rememberWelcome);
document.querySelector("#welcome-start").addEventListener("click", () => welcomeDialog.close());
let welcomeSeen = false;
try { welcomeSeen = sessionStorage.getItem("tilBridgeWelcomeSeen") === "1"; } catch (_) {}
if (!getProfile() && !welcomeSeen && routeParts()[0] === "home") welcomeDialog.showModal();
