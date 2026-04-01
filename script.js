/* ── Menu mobile ── */
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}

/* ── Slider avant / après ── */
const beforeAfterSliders = document.querySelectorAll("[data-before-after]");

beforeAfterSliders.forEach((slider) => {
  const range = slider.querySelector(".before-after-range");
  const afterWrapper = slider.querySelector(".after-image-wrapper");
  const divider = slider.querySelector(".before-after-divider");

  if (!range || !afterWrapper || !divider) return;

  const updateSlider = (value) => {
    afterWrapper.style.width = `${value}%`;
    divider.style.left = `${value}%`;
  };

  updateSlider(range.value);

  range.addEventListener("input", (event) => {
    updateSlider(event.target.value);
  });
});

/* ── Fondu du hero au scroll ── */
const heroPanel = document.querySelector(".hero-fullwidth");

if (heroPanel) {
  // Fondu linéaire : commence à 30% de scroll dans le hero, termine à 65%
  // On applique sur tout le panel (image + texte) pour éviter le snap
  // quand le sticky se relâche en bas de page.
  const FADE_START = 0.30;
  const FADE_END   = 0.65;

  const updateHeroOpacity = () => {
    const heroHeight = heroPanel.offsetHeight;
    const scrollY    = window.scrollY;

    const start = heroHeight * FADE_START;
    const end   = heroHeight * FADE_END;

    let opacity = 1;

    if (scrollY >= end) {
      opacity = 0;
    } else if (scrollY > start) {
      opacity = 1 - (scrollY - start) / (end - start);
    }

    heroPanel.style.opacity = opacity;
  };

  window.addEventListener("scroll", updateHeroOpacity, { passive: true });
  updateHeroOpacity(); // état initial
}
