/* ═══════════════════════════════════════════
   MENU MOBILE
═══════════════════════════════════════════ */
const menuToggle = document.querySelector(".menu-toggle");
const mainNav    = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}


/* ═══════════════════════════════════════════
   SLIDER AVANT / APRÈS
═══════════════════════════════════════════ */
document.querySelectorAll("[data-before-after]").forEach((slider) => {
  const range       = slider.querySelector(".before-after-range");
  const afterWrapper = slider.querySelector(".after-image-wrapper");
  const divider     = slider.querySelector(".before-after-divider");

  if (!range || !afterWrapper || !divider) return;

  const updateSlider = (value) => {
    afterWrapper.style.width = `${value}%`;
    divider.style.left       = `${value}%`;
  };

  updateSlider(range.value);
  range.addEventListener("input", (e) => updateSlider(e.target.value));
});


/* ═══════════════════════════════════════════
   FONDU DU HERO AU SCROLL (index.html)
═══════════════════════════════════════════ */
const heroPanel = document.querySelector(".hero-fullwidth");

if (heroPanel) {
  const FADE_START = 0.30;
  const FADE_END   = 0.65;

  const updateHeroOpacity = () => {
    const heroHeight = heroPanel.offsetHeight;
    const scrollY    = window.scrollY;
    const start      = heroHeight * FADE_START;
    const end        = heroHeight * FADE_END;

    const MIN_OPACITY = 0.30;
    let opacity = 1;
    if (scrollY >= end)        opacity = MIN_OPACITY;
    else if (scrollY > start)  opacity = 1 - (1 - MIN_OPACITY) * (scrollY - start) / (end - start);

    heroPanel.style.opacity = opacity;
  };

  window.addEventListener("scroll", updateHeroOpacity, { passive: true });
  updateHeroOpacity();
}


/* ═══════════════════════════════════════════
   NAV ACTIVE — page courante en surbrillance
═══════════════════════════════════════════ */
const currentFile    = window.location.pathname.split("/").pop() || "index.html";
const expertisePages = ["maconnerie.html", "toiture.html", "carrelage.html", "expertises.html"];

document.querySelectorAll(".nav-pill[href]").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentFile) {
    link.classList.add("active");
  }
  // Le pill "Expertises" reste actif sur toutes les sous-pages expertise
  if (href === "expertises.html" && expertisePages.includes(currentFile)) {
    link.classList.add("active");
  }
});


/* ═══════════════════════════════════════════
   ANIMATIONS D'ENTRÉE AU SCROLL
   (éléments des pages intérieures seulement,
    on exclut les stack-cards de l'accueil)
═══════════════════════════════════════════ */
const revealTargets = document.querySelectorAll(
  ".section .split-grid > *," +
  ".section .content-card," +
  ".section .cards-grid > *," +
  ".section .before-after-slider," +
  ".project-card-vertical"
);

revealTargets.forEach((el, i) => {
  el.classList.add("reveal");
  // Décalage léger pour les éléments côte à côte (grilles)
  const siblings = el.parentElement.querySelectorAll(".reveal");
  const idx      = Array.from(siblings).indexOf(el);
  if (siblings.length > 1) {
    el.style.transitionDelay = `${idx * 0.08}s`;
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));


/* ═══════════════════════════════════════════
   LIGHTBOX — photos de réalisations
═══════════════════════════════════════════ */
const galleryImages = Array.from(document.querySelectorAll(".project-gallery img"));

if (galleryImages.length > 0) {
  // Créer l'élément lightbox
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = `
    <button class="lb-close" aria-label="Fermer">×</button>
    <button class="lb-prev"  aria-label="Précédent">&#8249;</button>
    <button class="lb-next"  aria-label="Suivant">&#8250;</button>
    <div class="lb-wrap">
      <img class="lb-img" src="" alt="" />
    </div>
  `;
  document.body.appendChild(lb);

  const lbImg  = lb.querySelector(".lb-img");
  let current  = 0;

  const open = (index) => {
    current = index;
    lbImg.src = galleryImages[current].src;
    lbImg.alt = galleryImages[current].alt;
    lb.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    lb.classList.remove("active");
    document.body.style.overflow = "";
  };

  const prev = () => {
    current = (current - 1 + galleryImages.length) % galleryImages.length;
    lbImg.src = galleryImages[current].src;
    lbImg.alt = galleryImages[current].alt;
  };

  const next = () => {
    current = (current + 1) % galleryImages.length;
    lbImg.src = galleryImages[current].src;
    lbImg.alt = galleryImages[current].alt;
  };

  // Clic sur les images
  galleryImages.forEach((img, i) => img.addEventListener("click", () => open(i)));

  // Contrôles lightbox
  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", prev);
  lb.querySelector(".lb-next").addEventListener("click", next);
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });

  // Clavier
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("active")) return;
    if (e.key === "Escape")      close();
    if (e.key === "ArrowLeft")   prev();
    if (e.key === "ArrowRight")  next();
  });
}


/* ═══════════════════════════════════════════
   PHOTO STACK — clic pour défiler
═══════════════════════════════════════════ */
const photoStack = document.getElementById("photoStack");

if (photoStack) {
  const getCards = () => Array.from(photoStack.querySelectorAll(".photo-stack-card:not(.swipe-up)"));

  photoStack.addEventListener("click", () => {
    const cards = getCards();
    if (cards.length === 0) return;

    // La carte du dessus = dernière dans le DOM (z-index le plus élevé)
    const top = cards[cards.length - 1];

    // Animer vers le haut
    top.classList.add("swipe-up");

    // Après l'animation, déplacer la carte en bas du stack et la réinitialiser
    top.addEventListener("transitionend", () => {
      top.classList.remove("swipe-up");
      photoStack.insertBefore(top, photoStack.firstChild);
    }, { once: true });
  });
}


/* ═══════════════════════════════════════════
   BOUTON RETOUR EN HAUT
═══════════════════════════════════════════ */
const scrollTopBtn = document.createElement("button");
scrollTopBtn.className    = "scroll-top-btn";
scrollTopBtn.setAttribute("aria-label", "Retour en haut");
scrollTopBtn.innerHTML    = "↑";
document.body.appendChild(scrollTopBtn);

window.addEventListener("scroll", () => {
  scrollTopBtn.classList.toggle("visible", window.scrollY > 500);
}, { passive: true });

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
