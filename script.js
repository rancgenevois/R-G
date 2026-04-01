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
const heroContent = document.querySelector(".hero-content-wrapper");
const heroPanel   = document.querySelector(".hero-fullwidth");

if (heroContent && heroPanel) {
  // Le fondu commence quand on a scrollé 30% de la hauteur du hero
  // et se termine à 65% (le contenu est alors invisible)
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

    heroContent.style.opacity = opacity;
  };

  window.addEventListener("scroll", updateHeroOpacity, { passive: true });
  updateHeroOpacity(); // état initial
}
