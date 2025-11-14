// OrdoMedIQ cinematic landingpage JS
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  // ---------- THEME / MODE TOGGLE ----------
  const modeToggle = document.querySelector(".mode-toggle");
  const modeIcon = document.querySelector(".mode-icon");
  const THEME_KEY = "ordomed-theme";

  const getSystemTheme = () => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    return "dark";
  };

  const applyTheme = (theme) => {
    const next = theme === "light" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    if (modeIcon) {
      modeIcon.textContent = next === "dark" ? "☾" : "☼";
    }
  };

  const storedTheme = window.localStorage.getItem(THEME_KEY);
  applyTheme(storedTheme || getSystemTheme());

  if (modeToggle) {
    modeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      window.localStorage.setItem(THEME_KEY, next);
    });
  }

  // ---------- NAVIGATION / MOBILE MENU ----------
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");

  const closeNav = () => {
    if (!navList || !navToggle) return;
    navList.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  if (navToggle && navList) {
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-controls", "primary-nav");

    navToggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navList.querySelectorAll("a[href^='#']").forEach((link) => {
      link.addEventListener("click", () => closeNav());
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  // ---------- SMOOTH SCROLL ----------
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const smoothScrollTo = (target) => {
    if (!target) return;
    const behavior = prefersReducedMotion ? "auto" : "smooth";
    target.scrollIntoView({ behavior, block: "start" });
  };

  document.querySelectorAll("[data-scroll-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetSelector = btn.getAttribute("data-scroll-target");
      if (!targetSelector) return;
      const target = document.querySelector(targetSelector);
      if (!target) return;
      smoothScrollTo(target);
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      smoothScrollTo(target);
    });
  });

  // ---------- SCROLL REVEAL ----------
  const revealSelector = ".section, .panel-card, .signal-card, .who-card, .film-scene, .ai-magic";
  const revealEls = document.querySelectorAll(revealSelector);

  if (revealEls.length) {
    if (!("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("reveal", "is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );

      revealEls.forEach((el) => {
        el.classList.add("reveal");
        observer.observe(el);
      });
    }
  }

  // ---------- AI MAGIC WIDGET ----------
  const aiForm = document.querySelector("[data-ai-widget]");
  const aiOutput = document.querySelector("[data-ai-output]");

  const buildAiResponse = (role, questionRaw) => {
    const question = (questionRaw || "").trim();
    const baseIntro = question
      ? `Ausgehend von der Fragestellung „${question}“ skizziert die OrdoMedIQ-Engine einen möglichen Refinement-Ansatz:`
      : "Auf Basis typischer Radiologie-/PVS-Setups skizziert die OrdoMedIQ-Engine einen generischen Refinement-Ansatz:";

    const normalize = role || "radiologie";

    if (normalize === "pvs") {
      return `
        <h4>PVS-Refinement-Fokus</h4>
        <p>${baseIntro}</p>
        <ul>
          <li><strong>1. Engine-Checks vor Übergabe:</strong> Alle §12-Pflichtangaben, Faktorbereiche und Zusätze (A–D/J/K1/K2) werden vor dem PAD-Export hart geprüft. Fälle mit Risiko laufen in eine „PVS-Ready“-Queue.</li>
          <li><strong>2. Rückläufer-Raster:</strong> Typische PVS-Rückläufer (z. B. unplausible Mehrphasen-CT, fehlende Analogbegründung) werden als strukturierte Codes erfasst und direkt auf die zugrunde liegende Regel gemappt.</li>
          <li><strong>3. Lernschleife im Regelwerk:</strong> Häufige Muster führen zu gezielter Regelverschärfung (z. B. strengere KM-Dokumentation, klarere Zeitfenster für Zuschläge) – ohne dass der Workload in der PVS steigt.</li>
          <li><strong>4. Transparenz &amp; KPIs:</strong> BI-Kacheln zeigen First-Pass-Quote, DSO-Entwicklung und Rückläufer-Cluster je Standort/Partner. Das ermöglicht PVS-intern eine kontrollierte Governance über die GOÄ-Strategie.</li>
        </ul>
        <p><em>Ergebnis:</em> Weniger Rückläufer, klarere Erwartungshorizonte gegenüber Radiologie/Klinik und ein Engine-Layer, der PVS-Logik ernst nimmt – statt sie zu umgehen.</p>
      `;
    }

    if (normalize === "klinik") {
      return `
        <h4>Klinik- &amp; Controlling-Fokus</h4>
        <p>${baseIntro}</p>
        <ul>
          <li><strong>1. Case-Mix-Transparenz:</strong> Die Engine kennzeichnet radiologische Fälle nach Erlöspotenzial, Risiko und Komplexität (z. B. Notfall + Teleradiologie + Mehrphase) und macht sie im Cockpit filterbar.</li>
          <li><strong>2. Szenario-Simulation:</strong> Änderungen in Faktorpolitik oder Analogstrategien können als Szenario gegen historische Daten gerechnet werden – ohne dass reale Rechnungen verändert werden.</li>
          <li><strong>3. Standort- &amp; Dienstzeitvergleich:</strong> KPI-Kacheln zeigen, wo Rückläufer und Erlösverluste gehäuft auftreten (z. B. Nacht-/Wochenenddienst, bestimmte Modalitäten oder Teams).</li>
          <li><strong>4. Governance:</strong> Die Klinik kann Leitplanken definieren (z. B. maximale Faktoren, zulässige Analogpfade), die als Policies in der Engine hinterlegt und im Explain-Trail nachvollziehbar sind.</li>
        </ul>
        <p><em>Ergebnis:</em> GOÄ wird steuerbar wie ein eigener Erlöskanal – mit klaren Leitplanken statt Einzelfalldiskussionen.</p>
      `;
    }

    if (normalize === "investor") {
      return `
        <h4>Investor- &amp; Strategie-Fokus</h4>
        <p>${baseIntro}</p>
        <ul>
          <li><strong>1. Standardisierte KPI-Landschaft:</strong> Die Engine liefert eine einheitliche KPI-Basis (First-Pass-Quote, DSO, Erlös je Modalität, Rückläuferquote), unabhängig von der lokalen PVS-/RIS-Landschaft.</li>
          <li><strong>2. Risk &amp; Compliance View:</strong> Abweichungen von Policies (z. B. überzogene Faktoren, atypische Analogien) werden sichtbar, ohne medizinische Entscheidungsfreiheit zu untergraben.</li>
          <li><strong>3. Skalierbarkeit:</strong> Der gleiche Regelkern kann auf weitere Fachgruppen ausgebaut werden, sodass ein konsistenter Private-Pay-Standard über mehrere Häuser/MVZ hinweg entsteht.</li>
          <li><strong>4. Value Creation Narrative:</strong> Die Kombination aus Engine, Explain-Trail und PVS-Refinement liefert einen klaren Business Case – messbar in „Cash, Compliance &amp; Confidence“.</li>
        </ul>
        <p><em>Ergebnis:</em> GOÄ wird von einem Blackbox-Risiko zu einem planbaren Werttreiber im Portfolio.</p>
      `;
    }

    // Default: Radiologie
    return `
      <h4>Radiologie- &amp; MVZ-Fokus</h4>
      <p>${baseIntro}</p>
      <ul>
        <li><strong>1. Clean MedDok:</strong> Die Engine markiert im MedDok-Workspace alle abrechnungsrelevanten Befundelemente (z. B. KM, Phasen, Teleradiologie, Notfall) und prüft, ob sie ausreichend dokumentiert sind.</li>
        <li><strong>2. Smart Defaults:</strong> Für typische CT-/MRT-Standardfälle werden stabile Regelpfade genutzt, die Radiologie-Teams entlasten – nur bei Abweichungen sind aktive Entscheidungen nötig.</li>
        <li><strong>3. Sofort sichtbare Risiken:</strong> Ampeln im Abrechnungs-Cockpit zeigen, wo Dokumentation oder Begründung für §5/§6(2)/§12 noch nicht „prüffest“ sind.</li>
        <li><strong>4. Feedback-Schleife mit PVS:</strong> Rückläufer der PVS werden strukturiert zurückgespielt, damit das Regelwerk für Radiologie zunehmend „friktionsfrei“ wird.</li>
      </ul>
      <p><em>Ergebnis:</em> Radiolog:innen sehen klar, welche Fälle sie fachlich priorisieren müssen – und PVS/PKV sehen, dass jede Rechnung auf einem nachvollziehbaren Regelpfad basiert.</p>
    `;
  };

  if (aiForm && aiOutput) {
    aiForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const role = aiForm.querySelector("select[name='role']")?.value || "radiologie";
      const question = aiForm.querySelector("textarea[name='question']")?.value || "";

      // Loading-State
      aiOutput.innerHTML = `
        <p class="ai-magic-loading">
          <span class="ai-magic-spinner"></span>
          OrdoMedIQ AI bewertet Setup &amp; PVS-Perspektive …
        </p>
      `;

      const delay = question.trim().length > 40 ? 750 : 450;

      window.setTimeout(() => {
        aiOutput.innerHTML = buildAiResponse(role, question);
      }, delay);
    });
  }
});

