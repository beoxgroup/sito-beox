const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const checkForm = document.querySelector("[data-check-form]");
const miniForm = document.querySelector("[data-mini-form]");
const contactForm = document.querySelector("[data-contact-form]");
const reportRoot = document.querySelector("[data-report-root]");

const reportStorageKey = "beoxTeamCheckReport";
const reportRecipientEmail = "francescofranzoso@beoxgroup.it";

const checkQuestions = [
  { name: "alignment", label: "Obiettivi chiari e condivisi", area: "direzione" },
  { name: "priorities", label: "Priorità operative comprese", area: "direzione" },
  { name: "communication", label: "Comunicazione diretta e tempestiva", area: "comunicazione" },
  { name: "informationFlow", label: "Circolazione delle informazioni", area: "comunicazione" },
  { name: "conflictManagement", label: "Gestione costruttiva dei conflitti", area: "comunicazione" },
  { name: "trust", label: "Fiducia e sicurezza psicologica", area: "coesione" },
  { name: "responsibility", label: "Responsabilità individuale", area: "responsabilita" },
  { name: "roles", label: "Chiarezza di ruoli e aspettative", area: "responsabilita" },
  { name: "leadership", label: "Leadership efficace", area: "leadership" },
  { name: "followership", label: "Followership e feedback ai leader", area: "leadership" },
  { name: "collaboration", label: "Collaborazione tra funzioni", area: "coesione" },
  { name: "errorLearning", label: "Apprendimento dall'errore", area: "performance" },
  { name: "stress", label: "Stress sostenibile nel tempo", area: "pressione" },
  { name: "pressure", label: "Lucidità sotto pressione", area: "pressione" },
  { name: "energy", label: "Energia e motivazione", area: "pressione" },
  { name: "decisionMaking", label: "Rapidità decisionale", area: "performance" },
  { name: "execution", label: "Rispetto degli accordi", area: "performance" },
  { name: "feedback", label: "Qualità del feedback", area: "comunicazione" },
  { name: "routines", label: "Routine di miglioramento", area: "performance" },
  { name: "readiness", label: "Prontezza ad allenarsi", area: "coesione" }
];

const areaLabels = {
  direzione: "Direzione e allineamento",
  comunicazione: "Comunicazione e conflittualità",
  coesione: "Coesione e fiducia",
  responsabilita: "Responsabilità e ruoli",
  leadership: "Leadership e followership",
  pressione: "Stress e pressione",
  performance: "Performance e miglioramento"
};

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

function getRangeText(value) {
  const score = Number(value);
  if (score <= 2) return `${score}/10 - Criticità alta`;
  if (score <= 4) return `${score}/10 - Da allenare`;
  if (score <= 6) return `${score}/10 - Intermedio`;
  if (score <= 8) return `${score}/10 - Buona base`;
  return `${score}/10 - Punto di forza`;
}

function ensureRangeScale(input) {
  const question = input.closest(".range-question");
  if (!question || question.querySelector(".range-scale")) return;

  const min = Number(input.min || 1);
  const max = Number(input.max || 10);
  const scale = document.createElement("div");
  scale.className = "range-scale";
  scale.setAttribute("aria-hidden", "true");

  for (let value = min; value <= max; value += 1) {
    const tick = document.createElement("span");
    tick.textContent = value;
    tick.dataset.rangeTick = value;
    scale.appendChild(tick);
  }

  input.insertAdjacentElement("afterend", scale);
}

function updateRangeLabel(input) {
  const min = Number(input.min || 1);
  const max = Number(input.max || 10);
  const value = Number(input.value);
  const progress = max === min ? 0 : ((value - min) / (max - min)) * 100;
  const label = input.parentElement.querySelector("[data-range-label]");
  const text = getRangeText(value);

  input.style.setProperty("--range-progress", `${progress}%`);
  input.setAttribute("aria-valuetext", text);

  if (label) label.textContent = text;

  input.parentElement.querySelectorAll("[data-range-tick]").forEach((tick) => {
    const tickValue = Number(tick.dataset.rangeTick);
    tick.classList.toggle("is-active", tickValue <= value);
    tick.classList.toggle("is-current", tickValue === value);
  });
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function roundOne(value) {
  return Math.round(value * 10) / 10;
}

function getAreaScores(scores) {
  return Object.keys(areaLabels).reduce((areas, area) => {
    const values = checkQuestions
      .filter((question) => question.area === area)
      .map((question) => scores[question.name]);
    areas[area] = roundOne(average(values));
    return areas;
  }, {});
}

function getScoreBand(score) {
  if (score < 4) return "area critica";
  if (score < 6.5) return "area da allenare";
  if (score < 8) return "buona base";
  return "punto di forza";
}

function getProfile(overall, weakestArea) {
  if (overall >= 8) {
    return {
      title: "Team ad alto potenziale",
      subtitle: "Nella tua percezione le basi sono solide: per confermarlo serve ascoltare anche il team e verificare se la lettura è condivisa.",
      direction: "Sport Academy + percorso performance"
    };
  }

  if (weakestArea === "pressione") {
    return {
      title: "Team sotto pressione",
      subtitle: "Nella tua percezione stress, urgenza e imprevisti sembrano incidere su lucidità e qualità delle relazioni.",
      direction: "Sport Academy + allenamento su pressione, energia e routine"
    };
  }

  if (weakestArea === "comunicazione") {
    return {
      title: "Team con comunicazione da riallineare",
      subtitle: "Nella tua percezione conflittualità, feedback e circolazione delle informazioni sono leve prioritarie.",
      direction: "Team Building Formativo + Team Working"
    };
  }

  if (weakestArea === "leadership") {
    return {
      title: "Team da guidare con più chiarezza",
      subtitle: "Nella tua percezione leadership e followership vanno allenate insieme: guida, responsabilità e feedback devono rinforzarsi.",
      direction: "Percorso leadership, followership e debriefing operativo"
    };
  }

  if (overall < 5) {
    return {
      title: "Team da leggere con priorità",
      subtitle: "La tua lettura suggerisce più segnali deboli: prima di scegliere il percorso serve una rilevazione strutturata sul team.",
      direction: "Analisi Stato di Salute del Team + percorso su misura"
    };
  }

  return {
    title: "Team da consolidare",
    subtitle: "Dalla tua percezione emergono basi su cui costruire, ma alcune abitudini operative vanno verificate con il team e rese più solide.",
    direction: "Analisi Stato di Salute del Team + Team Working"
  };
}

function buildReport(form) {
  const lead = {
    fullName: form.elements.fullName.value.trim(),
    email: form.elements.email.value.trim(),
    phone: form.elements.phone.value.trim(),
    company: form.elements.company.value.trim(),
    city: form.elements.city.value.trim(),
    role: form.elements.role.value,
    size: form.elements.size.value,
    priority: form.elements.priority.value
  };

  const scores = {};
  checkQuestions.forEach((question) => {
    scores[question.name] = Number(form.elements[question.name].value);
  });

  const areaScores = getAreaScores(scores);
  const overall = roundOne(average(Object.values(scores)));
  const sortedAreas = Object.entries(areaScores).sort((a, b) => a[1] - b[1]);
  const weakestArea = sortedAreas[0][0];
  const strongestArea = sortedAreas[sortedAreas.length - 1][0];
  const profile = getProfile(overall, weakestArea);

  return {
    createdAt: new Date().toISOString(),
    lead,
    scores,
    areaScores,
    overall,
    weakestArea,
    strongestArea,
    profile,
    questions: checkQuestions
  };
}

function saveReport(report) {
  localStorage.setItem(reportStorageKey, JSON.stringify(report));
}

function resetReport() {
  localStorage.removeItem(reportStorageKey);
  window.location.href = "ai-team-check.html";
}

function getAreaInsight(area, score) {
  const band = getScoreBand(score);
  const insights = {
    direzione: "Chiarezza degli obiettivi, priorità e direzione comune.",
    comunicazione: "Qualità dello scambio, gestione dei conflitti e feedback.",
    coesione: "Fiducia, collaborazione e disponibilità ad allenarsi insieme.",
    responsabilita: "Ruoli, ownership e rispetto degli impegni.",
    leadership: "Equilibrio tra guida, autonomia e followership.",
    pressione: "Stress, energia e lucidità nei momenti intensi.",
    performance: "Decisione, apprendimento dall'errore e miglioramento continuo."
  };
  return `${band}: ${insights[area]}`;
}

function getRecommendations(report) {
  const recommendations = [
    "Somministrare una survey al team per confrontare la tua percezione con quella di collaboratori, reparto o gruppo di lavoro.",
    "Approfondire i risultati con una Analisi Stato di Salute del Team per validare segnali, bisogni reali e priorità condivise.",
    "Tradurre le evidenze in comportamenti osservabili: accordi, routine, feedback e responsabilità.",
    "Usare la metafora sportiva per rendere visibili pressione, ruoli, errore, leadership e collaborazione."
  ];

  if (report.weakestArea === "pressione") {
    recommendations.unshift("Verificare con il team quanto pressione, lucidità e sostenibilità dello stress siano vissute in modo condiviso.");
  } else if (report.weakestArea === "comunicazione") {
    recommendations.unshift("Lavorare su comunicazione diretta, conflitto costruttivo e feedback tra persone e funzioni.");
  } else if (report.weakestArea === "leadership") {
    recommendations.unshift("Rafforzare leadership e followership con esercizi pratici, debriefing e responsabilità condivise.");
  }

  return recommendations;
}

function buildEmailBody(report) {
  const lines = [
    "Nuovo iCheck Team BeOx",
    "",
    `Nome: ${report.lead.fullName}`,
    `Email: ${report.lead.email}`,
    `Cellulare: ${report.lead.phone}`,
    `Azienda: ${report.lead.company || "Non indicata"}`,
    `Città: ${report.lead.city || "Non indicata"}`,
    `Ruolo: ${report.lead.role}`,
    `Dimensione team: ${report.lead.size}`,
    `Priorità percepita: ${report.lead.priority}`,
    "",
    `Profilo: ${report.profile.title}`,
    `Indice generale: ${report.overall}/10`,
    `Area più forte: ${areaLabels[report.strongestArea]} (${report.areaScores[report.strongestArea]}/10)`,
    `Area prioritaria: ${areaLabels[report.weakestArea]} (${report.areaScores[report.weakestArea]}/10)`,
    `Direzione consigliata: ${report.profile.direction}`,
    `Passo successivo consigliato: survey sullo stato di salute del team per rilevare bisogni reali e priorità condivise`,
    "",
    "Risposte:",
    ...report.questions.map((question) => `${question.label}: ${report.scores[question.name]}/10`)
  ];

  return lines.join("\n");
}

function renderReport(report) {
  if (!reportRoot) return;

  const areaRows = Object.entries(report.areaScores)
    .map(([area, score]) => `
      <article class="area-card">
        <div>
          <h3>${areaLabels[area]}</h3>
          <p>${getAreaInsight(area, score)}</p>
        </div>
        <strong>${score}/10</strong>
        <div class="area-meter" aria-hidden="true"><span style="width: ${score * 10}%"></span></div>
      </article>
    `)
    .join("");

  const answerRows = report.questions
    .map((question) => `
      <div class="answer-row">
        <span>${question.label}</span>
        <strong>${report.scores[question.name]}/10</strong>
      </div>
    `)
    .join("");

  const recommendations = getRecommendations(report)
    .map((item) => `<li>${item}</li>`)
    .join("");

  const emailHref = `mailto:${reportRecipientEmail}?subject=${encodeURIComponent("Nuovo iCheck Team BeOx - " + report.lead.fullName)}&body=${encodeURIComponent(buildEmailBody(report))}`;

  reportRoot.innerHTML = `
    <div class="report-grid">
      <section class="report-main-card">
        <p class="result-label">Profilo percepito</p>
        <h2>${report.profile.title}</h2>
        <p>${report.profile.subtitle}</p>
        <div class="report-score">
          <span>Indice percettivo</span>
          <strong>${report.overall}/10</strong>
        </div>
        <div class="result-meter report-meter" aria-hidden="true"><span style="width: ${report.overall * 10}%"></span></div>
        <p><strong>Direzione BeOx consigliata:</strong><br>${report.profile.direction}</p>
      </section>

      <aside class="report-lead-card">
        <p class="result-label">Dati compilatore</p>
        <h3>${report.lead.fullName}</h3>
        <p>${report.lead.role} · ${report.lead.size}</p>
        <dl>
          <div><dt>Email</dt><dd>${report.lead.email}</dd></div>
          <div><dt>Cellulare</dt><dd>${report.lead.phone}</dd></div>
          <div><dt>Azienda</dt><dd>${report.lead.company || "Non indicata"}</dd></div>
          <div><dt>Città</dt><dd>${report.lead.city || "Non indicata"}</dd></div>
          <div><dt>Priorità percepita</dt><dd>${report.lead.priority}</dd></div>
        </dl>
      </aside>
    </div>

    <section class="report-block report-perception-card">
      <div>
        <p class="eyebrow">Come leggere questo report</p>
        <h2>Questo risultato nasce dalla percezione di chi ha compilato.</h2>
        <p>L'iCheck Team non misura da solo i bisogni reali del team: restituisce una prima lettura individuale. Per decidere come intervenire serve ascoltare anche collaboratori, reparto o gruppo di lavoro con una survey sullo stato di salute del team.</p>
      </div>
      <div class="report-method-card">
        <p class="result-label">Passo successivo</p>
        <h3>Survey Stato di Salute del Team</h3>
        <p>La survey permette di confrontare percezioni diverse, individuare convergenze e disallineamenti, rilevare bisogni reali e definire priorità di intervento fondate su dati del gruppo.</p>
      </div>
    </section>

    <section class="report-block">
      <div class="section-heading narrow">
        <p class="eyebrow">Lettura per aree</p>
        <h2>Le aree che compongono la tua lettura dello stato di salute del team.</h2>
      </div>
      <div class="area-grid">${areaRows}</div>
    </section>

    <section class="report-block report-two-columns">
      <div>
        <p class="eyebrow">Priorità</p>
        <h2>Da dove partire.</h2>
        <p>Nella tua percezione, l'area più solida è <strong>${areaLabels[report.strongestArea]}</strong>. L'area da leggere con più attenzione è <strong>${areaLabels[report.weakestArea]}</strong>.</p>
        <ul class="report-recommendations">${recommendations}</ul>
      </div>
      <div class="report-method-card">
        <p class="result-label">Perché BeOx</p>
        <h3>Dalla percezione ai bisogni reali.</h3>
        <p>BeOx usa l'iCheck come punto di partenza: poi può somministrare una survey al team, leggere i dati emersi e costruire esperienze pratiche, metafora sportiva, debriefing e trasferimento operativo nel lavoro quotidiano.</p>
      </div>
    </section>

    <section class="report-block">
      <details class="answers-detail">
        <summary>Vedi dettaglio delle 20 risposte</summary>
        <div class="answer-list">${answerRows}</div>
      </details>
    </section>

    <section class="report-actions-panel">
      <div>
        <p class="eyebrow">Azioni</p>
        <h2>Salva il report o attiva il passo successivo.</h2>
      </div>
      <div class="result-actions">
        <button class="button button-primary" type="button" data-print-report>Stampa report</button>
        <button class="button button-secondary" type="button" data-reset-check>Ricompila da 0</button>
        <a class="inline-link" href="${emailHref}" data-mail-report>Richiedi la survey al team</a>
      </div>
    </section>
  `;

  const printButton = reportRoot.querySelector("[data-print-report]");
  const resetButton = reportRoot.querySelector("[data-reset-check]");

  if (printButton) printButton.addEventListener("click", () => window.print());
  if (resetButton) resetButton.addEventListener("click", resetReport);
}

function initReportPage() {
  if (!reportRoot) return;
  const rawReport = localStorage.getItem(reportStorageKey);
  if (!rawReport) return;

  try {
    renderReport(JSON.parse(rawReport));
  } catch (error) {
    localStorage.removeItem(reportStorageKey);
  }
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (menuToggle && nav) {
  if (!nav.id) nav.id = "main-nav";
  menuToggle.setAttribute("aria-controls", nav.id);
  menuToggle.setAttribute("aria-expanded", "false");

  const setMenuState = (isOpen) => {
    nav.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  };

  menuToggle.addEventListener("click", () => {
    setMenuState(!nav.classList.contains("is-open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(false);
  });
}

document.querySelectorAll("input[type='range']").forEach((input) => {
  ensureRangeScale(input);
  updateRangeLabel(input);
  input.addEventListener("input", () => updateRangeLabel(input));
});

if (checkForm) {
  checkForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const report = buildReport(checkForm);
    saveReport(report);
    window.location.href = "team-check-report.html";
  });
}

if (miniForm) {
  miniForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = miniForm.querySelector("[data-mini-message]");
    if (message) message.textContent = "Perfetto, abbiamo registrato il tuo interesse. BeOx potrà usare questi dati per preparare un approfondimento dedicato.";
    miniForm.reset();
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = contactForm.querySelector("[data-contact-message]");
    if (message) message.textContent = "Grazie, la richiesta è stata registrata. Il team BeOx potrà ricontattarti per approfondire il bisogno.";
    contactForm.reset();
  });
}

document.querySelectorAll("[data-iubenda-preferences]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    if (window._iub && window._iub.cs && window._iub.cs.api && typeof window._iub.cs.api.openPreferences === "function") {
      window._iub.cs.api.openPreferences();
      return;
    }
    window.alert("Le preferenze cookie saranno disponibili dopo l'inserimento dello script Iubenda ufficiale.");
  });
});

initReportPage();
