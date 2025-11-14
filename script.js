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

  // Initial-Theme: LocalStorage → System-Theme → Fallback "dark"
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

    // Mobile: Navigation nach Klick schließen
    navList.querySelectorAll("a[href^='#']").forEach((link) => {
      link.addEventListener("click", () => {
        closeNav();
      });
    });

    // ESC schließt das mobile Menü
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeNav();
      }
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

  // Buttons / Links mit data-scroll-target (z. B. CTAs)
  document.querySelectorAll("[data-scroll-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetSelector = btn.getAttribute("data-scroll-target");
      if (!targetSelector) return;
      const target = document.querySelector(targetSelector);
      if (!target) return;
      smoothScrollTo(target);
    });
  });

  // Standard-Anchor-Links innerhalb der Seite
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;

      // Nur interne Anchors behandeln
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      smoothScrollTo(target);
    });
  });

  // ---------- SCROLL REVEAL / CINEMATIC EFFECT ----------
  const revealSelector =
    ".section, .panel-card, .signal-card, .who-card, .film-scene";
  const revealEls = document.querySelectorAll(revealSelector);

  if (!revealEls.length) {
    return;
  }

  // Fallback ohne IntersectionObserver: einfach alles sichtbar machen
  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("reveal", "is-visible"));
    return;
  }

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
});
