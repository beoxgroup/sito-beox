const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const checkForm = document.querySelector("[data-check-form]");
const miniForm = document.querySelector("[data-mini-form]");
const contactForm = document.querySelector("[data-contact-form]");
const reportRoot = document.querySelector("[data-report-root]");

const reportStorageKey = "beoxTeamCheckReport";
const reportRecipientEmail = "inserisci-la-tua-email@beox.it";

const checkQuestions = [
  { name: "alignment", label: "Obiettivi chiari e condivisi", area: "direzione" },
  { name: "priorities", label: "Priorita operative comprese", area: "direzione" },
  { name: "communication", label: "Comunicazione diretta e tempestiva", area: "comunicazione" },
  { name: "informationFlow", label: "Circolazione delle informazioni", area: "comunicazione" },
  { name: "conflictManagement", label: "Gestione costruttiva dei conflitti", area: "comunicazione" },
  { name: "trust", label: "Fiducia e sicurezza psicologica", area: "coesione" },
  { name: "responsibility", label: "Responsabilita individuale", area: "responsabilita" },
  { name: "roles", label: "Chiarezza di ruoli e aspettative", area: "responsabilita" },
  { name: "leadership", label: "Leadership efficace", area: "leadership" },
  { name: "followership", label: "Followership e feedback ai leader", area: "leadership" },
  { name: "collaboration", label: "Collaborazione tra funzioni", area: "coesione" },
  { name: "errorLearning", label: "Apprendimento dall'errore", area: "performance" },
  { name: "stress", label: "Stress sostenibile nel tempo", area: "pressione" },
  { name: "pressure", label: "Lucidita sotto pressione", area: "pressione" },
  { name: "energy", label: "Energia e motivazione", area: "pressione" },
  { name: "decisionMaking", label: "Rapidita decisionale", area: "performance" },
  { name: "execution", label: "Rispetto degli accordi", area: "performance" },
  { name: "feedback", label: "Qualita del feedback", area: "comunicazione" },
  { name: "routines", label: "Routine di miglioramento", area: "performance" },
  { name: "readiness", label: "Prontezza ad allenarsi", area: "coesione" }
];

const areaLabels = {
  direzione: "Direzione e allineamento",
  comunicazione: "Comunicazione e conflittualita",
  coesione: "Coesione e fiducia",
  responsabilita: "Responsabilita e ruoli",
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
  if (score <= 2) return `${score}/10 - Criticita alta`;
  if (score <= 4) return `${score}/10 - Da allenare`;
  if (score <= 6) return `${score}/10 - Intermedio`;
  if (score <= 8) return `${score}/10 - Buona base`;
  return `${score}/10 - Punto di forza`;
}

function updateRangeLabel(input) {
  const label = input.parentElement.querySelector("[data-range-label]");
  if (label) label.textContent = getRangeText(input.value);
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
      subtitle: "Le basi sono solide: il lavoro BeOx puo alzare standard, mentalita e performance sostenibile.",
      direction: "Sport Academy + percorso performance"
    };
  }

  if (weakestArea === "pressione") {
    return {
      title: "Team sotto pressione",
      subtitle: "Stress, urgenza e imprevisti sembrano incidere sulla lucidita e sulla qualita delle relazioni.",
      direction: "Sport Academy + allenamento su pressione, energia e routine"
    };
  }

  if (weakestArea === "comunicazione") {
    return {
      title: "Team con comunicazione da riallineare",
      subtitle: "Conflittualita, feedback e circolazione delle informazioni sono leve prioritarie.",
      direction: "Team Building Formativo + Team Working"
    };
  }

  if (weakestArea === "leadership") {
    return {
      title: "Team da guidare con piu chiarezza",
      subtitle: "Leadership e followership vanno allenate insieme: guida, responsabilita e feedback devono rinforzarsi.",
      direction: "Percorso leadership, followership e debriefing operativo"
    };
  }

  if (overall < 5) {
    return {
      title: "Team da leggere con priorita",
      subtitle: "Il quadro suggerisce piu segnali deboli: prima di scegliere il format serve una lettura strutturata.",
      direction: "Analisi Stato di Salute del Team + percorso su misura"
    };
  }

  return {
    title: "Team da consolidare",
    subtitle: "Ci sono basi su cui costruire, ma alcune abitudini operative devono diventare piu solide e condivise.",
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
    direzione: "Chiarezza degli obiettivi, priorita e direzione comune.",
    comunicazione: "Qualita dello scambio, gestione dei conflitti e feedback.",
    coesione: "Fiducia, collaborazione e disponibilita ad allenarsi insieme.",
    responsabilita: "Ruoli, ownership e rispetto degli impegni.",
    leadership: "Equilibrio tra guida, autonomia e followership.",
    pressione: "Stress, energia e lucidita nei momenti intensi.",
    performance: "Decisione, apprendimento dall'errore e miglioramento continuo."
  };
  return `${band}: ${insights[area]}`;
}

function getRecommendations(report) {
  const recommendations = [
    "Approfondire i risultati con una Analisi Stato di Salute del Team per validare segnali e priorita.",
    "Tradurre le evidenze in comportamenti osservabili: accordi, routine, feedback e responsabilita.",
    "Usare la metafora sportiva per rendere visibili pressione, ruoli, errore, leadership e collaborazione."
  ];

  if (report.weakestArea === "pressione") {
    recommendations.unshift("Allenare gestione della pressione, recupero di lucidita e sostenibilita dello stress.");
  } else if (report.weakestArea === "comunicazione") {
    recommendations.unshift("Lavorare su comunicazione diretta, conflitto costruttivo e feedback tra persone e funzioni.");
  } else if (report.weakestArea === "leadership") {
    recommendations.unshift("Rafforzare leadership e followership con esercizi pratici, debriefing e responsabilita condivise.");
  }

  return recommendations;
}

function buildEmailBody(report) {
  const lines = [
    "Nuovo Team Check BeOx",
    "",
    `Nome: ${report.lead.fullName}`,
    `Email: ${report.lead.email}`,
    `Cellulare: ${report.lead.phone}`,
    `Azienda: ${report.lead.company || "Non indicata"}`,
    `Citta: ${report.lead.city || "Non indicata"}`,
    `Ruolo: ${report.lead.role}`,
    `Dimensione team: ${report.lead.size}`,
    `Priorita percepita: ${report.lead.priority}`,
    "",
    `Profilo: ${report.profile.title}`,
    `Indice generale: ${report.overall}/10`,
    `Area piu forte: ${areaLabels[report.strongestArea]} (${report.areaScores[report.strongestArea]}/10)`,
    `Area prioritaria: ${areaLabels[report.weakestArea]} (${report.areaScores[report.weakestArea]}/10)`,
    `Direzione consigliata: ${report.profile.direction}`,
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

  const emailHref = `mailto:${reportRecipientEmail}?subject=${encodeURIComponent("Nuovo Team Check BeOx - " + report.lead.fullName)}&body=${encodeURIComponent(buildEmailBody(report))}`;

  reportRoot.innerHTML = `
    <div class="report-grid">
      <section class="report-main-card">
        <p class="result-label">Profilo emerso</p>
        <h2>${report.profile.title}</h2>
        <p>${report.profile.subtitle}</p>
        <div class="report-score">
          <span>Indice generale</span>
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
          <div><dt>Citta</dt><dd>${report.lead.city || "Non indicata"}</dd></div>
          <div><dt>Priorita percepita</dt><dd>${report.lead.priority}</dd></div>
        </dl>
      </aside>
    </div>

    <section class="report-block">
      <div class="section-heading narrow">
        <p class="eyebrow">Lettura per aree</p>
        <h2>Le aree che compongono lo stato di salute del team.</h2>
      </div>
      <div class="area-grid">${areaRows}</div>
    </section>

    <section class="report-block report-two-columns">
      <div>
        <p class="eyebrow">Priorita</p>
        <h2>Da dove partire.</h2>
        <p>L'area piu solida e <strong>${areaLabels[report.strongestArea]}</strong>. L'area da leggere con piu attenzione e <strong>${areaLabels[report.weakestArea]}</strong>.</p>
        <ul class="report-recommendations">${recommendations}</ul>
      </div>
      <div class="report-method-card">
        <p class="result-label">Perche BeOx</p>
        <h3>Dalla fotografia all'allenamento.</h3>
        <p>BeOx non si limita a restituire un punteggio: usa l'analisi per costruire esperienze pratiche, metafora sportiva, debriefing e trasferimento operativo nel lavoro quotidiano.</p>
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
        <h2>Salva o riparti da zero.</h2>
      </div>
      <div class="result-actions">
        <button class="button button-primary" type="button" data-print-report>Stampa report</button>
        <button class="button button-secondary" type="button" data-reset-check>Ricompila da 0</button>
        <a class="inline-link" href="${emailHref}" data-mail-report>Prepara email a BeOx</a>
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
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("is-open"));
  });
}

document.querySelectorAll("input[type='range']").forEach((input) => {
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
    if (message) message.textContent = "Perfetto: nella versione finale qui partiranno invio checklist e automazione lead.";
    miniForm.reset();
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = contactForm.querySelector("[data-contact-message]");
    if (message) message.textContent = "Richiesta registrata nel prototipo. Nella versione finale verra collegata a CRM o email.";
    contactForm.reset();
  });
}

initReportPage();
