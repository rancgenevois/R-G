const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}

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
