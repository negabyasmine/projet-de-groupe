// =========================
// script.js
// =========================

const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
const navbar = document.getElementById("navbar");
const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");

// Mobile menu
burger.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

// Close menu on link click (mobile)
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
  });
});

// Smooth scroll
document.querySelectorAll("a[href^='#']").forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    // Set active link on click
    setActiveNav(anchor.getAttribute("href"));
  });
});

// Navbar style on scroll
const onScroll = () => {
  if (window.scrollY > 20) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
};
window.addEventListener("scroll", onScroll);
onScroll();

// Reveal on view
if (prefersReducedMotion.matches) {
  revealItems.forEach((item) => item.classList.add("reveal--visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

// =========================
// Navbar active link on scroll
// =========================
const sectionMap = new Map();
navAnchors.forEach((link) => {
  const id = link.getAttribute("href");
  const section = document.querySelector(id);
  if (section) sectionMap.set(section, link);
});

const setActiveNav = (hash) => {
  navAnchors.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === hash);
  });
};

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const link = sectionMap.get(entry.target);
        if (link) {
          setActiveNav(link.getAttribute("href"));
        }
      }
    });
  },
  {
    rootMargin: "-40% 0px -55% 0px",
    threshold: 0
  }
);

sectionMap.forEach((_, section) => navObserver.observe(section));
if (navAnchors.length) {
  setActiveNav(navAnchors[0].getAttribute("href"));
}

// =========================
// Cartes & Themes dynamique
// =========================
const cardTypes = [
  "Symptomes",
  "Association",
  "Diagnostic",
  "Organe",
  "Prevention",
  "Causes",
  "Soins"
];

const themesData = [
  {
    id: "cardiomyopathie-hypertrophique",
    label: "Cardiomyopathie hypertrophique",
    icon: "❤️",
    folder: "Cardiomyopathie hypertrophique"
  },
  {
    id: "sarcoidose-pulmonaire",
    label: "Sarcoïdose pulmonaire",
    icon: "🫁",
    folder: "Sarcoïdose pulmonaire"
  },
  {
    id: "maladie-de-wilson",
    label: "Maladie de Wilson",
    icon: "🧬",
    folder: "Maladie de Wilson"
  },
  {
    id: "polykystose-renale",
    label: "Polykystose rénale",
    icon: "🫘",
    folder: "Polykystose rénale"
  },
  {
    id: "maladie-de-crohn",
    label: "Maladie de Crohn",
    icon: "🍽️",
    folder: "Maladie de Crohn"
  },
  {
    id: "maladie-d-addison",
    label: "Maladie d’Addison",
    icon: "🧪",
    folder: "Maladie d’Addison"
  },
  {
    id: "sclerose-en-plaques",
    label: "Sclérose en plaques (SEP)",
    icon: "🧠",
    folder: "Sclérose en plaques (SEP)"
  }
].map((theme) => ({
  ...theme,
  cards: cardTypes.map((type) => {
    const fileName =
      theme.id === "maladie-d-addison" && type === "Association"
        ? "Association .jpeg"
        : `${type}.jpeg`;
    return {
      title: theme.label,
      type,
      img: encodeURI(`assets/carte/${theme.folder}/${fileName}`)
    };
  })
}));

const themesList = document.getElementById("themesList");
const panelTitle = document.getElementById("panelTitle");
const panelCards = document.getElementById("panelCards");
const panelDownloadAll = document.getElementById("panelDownloadAll");

const renderThemes = (activeId) => {
  if (!themesList) return;
  themesList.innerHTML = "";
  themesData.forEach((theme) => {
    const item = document.createElement("div");
    item.className = `theme-item ${theme.id === activeId ? "active" : ""}`;
    item.innerHTML = `
      <div class="left">
        <span class="icon">${theme.icon}</span>
        <span>${theme.label}</span>
      </div>
      <span class="arrow">→</span>
    `;
    item.addEventListener("click", () => updatePanel(theme.id));
    themesList.appendChild(item);
  });
};

const updatePanel = (themeId) => {
  const theme = themesData.find((t) => t.id === themeId);
  if (!theme || !panelTitle || !panelCards) return;

  panelTitle.textContent = theme.label;

  panelCards.classList.remove("panel-fade");
  void panelCards.offsetWidth;
  panelCards.classList.add("panel-fade");

  panelCards.innerHTML = theme.cards
    .map(
      (card) => `
        <div class="card-preview">
          <img src="${card.img}" alt="${card.title} - ${card.type}">
          <h4>${card.title}</h4>
          <p>${card.type}</p>
        </div>
      `
    )
    .join("");

  renderThemes(themeId);
};

updatePanel("cardiomyopathie-hypertrophique");

if (panelDownloadAll) {
  panelDownloadAll.style.display = "none";
}

// =========================
// Temoignages slider (dots)
// =========================
const testimonials = [
  {
    name: "Messali Idir",
    role: "Testeur",
    text:
      "Ce jeu m’a permis de découvrir de nouvelles maladies et des associations dédiées, tout en offrant une expérience ludique qui pourrait être améliorée par des explications plus détaillées et un design de cartes plus clair."
  },
  {
    name: "Seddik Chams Eddine",
    role: "Testeur",
    text:
      "Le jeu est très amusant et bien conçu, mais il gagnerait en intérêt pédagogique avec des règles renforçant l’apprentissage des maladies et une meilleure organisation des cartes."
  },
  {
    name: "Benachour Ismail",
    role: "Testeur",
    text:
      "J’ai apprécié le jeu pour sa simplicité et son aspect éducatif, notamment grâce à la découverte de maladies et d’associations, même si le vocabulaire pourrait être rendu plus accessible."
  },
  {
    name: "Bireche Mohamed Ayhem",
    role: "Testeur",
    text:
      "Bien que le jeu soit divertissant, des ajustements dans les règles et une meilleure incitation à lire les cartes permettraient d’en améliorer l’aspect éducatif."
  }
];

const temoignageCard = document.getElementById("temoignageCard");
const temoignageTexte = document.getElementById("temoignageTexte");
const temoignageNom = document.getElementById("temoignageNom");
const temoignageRole = document.getElementById("temoignageRole");
const temoignageDots = document.getElementById("temoignageDots");

let currentTemoignage = 0;
let temoignageTimer = null;
const TEMOIGNAGE_DELAY = 5000;

const renderDots = () => {
  if (!temoignageDots) return;
  temoignageDots.innerHTML = "";
  testimonials.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `temoignage-dot ${index === currentTemoignage ? "active" : ""}`;
    dot.setAttribute("aria-label", `Voir temoignage ${index + 1}`);
    // Click user -> jump and reset timer
    dot.addEventListener("click", () => updateTemoignage(index, true));
    temoignageDots.appendChild(dot);
  });
};

const updateTemoignage = (index, fromUser = false) => {
  if (!temoignageCard || !temoignageTexte || !temoignageNom || !temoignageRole) return;
  currentTemoignage = (index + testimonials.length) % testimonials.length;
  const item = testimonials[currentTemoignage];

  temoignageTexte.textContent = item.text;
  temoignageNom.textContent = item.name;
  temoignageRole.textContent = item.role || "";

  // Animation fade + slide
  temoignageCard.classList.remove("animate");
  void temoignageCard.offsetWidth;
  temoignageCard.classList.add("animate");

  renderDots();

  if (fromUser) {
    restartTemoignageAuto();
  }
};

if (temoignageCard) {
  updateTemoignage(0);
}

const startTemoignageAuto = () => {
  if (!temoignageCard) return;
  temoignageTimer = setInterval(() => {
    updateTemoignage(currentTemoignage + 1);
  }, TEMOIGNAGE_DELAY);
};

const stopTemoignageAuto = () => {
  if (temoignageTimer) {
    clearInterval(temoignageTimer);
    temoignageTimer = null;
  }
};

const restartTemoignageAuto = () => {
  stopTemoignageAuto();
  startTemoignageAuto();
};

if (temoignageCard) {
  // Pause auto-scroll on hover
  temoignageCard.addEventListener("mouseenter", stopTemoignageAuto);
  temoignageCard.addEventListener("mouseleave", startTemoignageAuto);
  startTemoignageAuto();
}

// =========================
// Contact form submit feedback
// =========================
const contactForm = document.getElementById("contactForm");
const contactSuccess = document.getElementById("contactSuccess");

if (contactForm && contactSuccess) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    contactSuccess.textContent = "Merci ! Votre message a bien ete envoye.";
    contactForm.reset();
  });
}
