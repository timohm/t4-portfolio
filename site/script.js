const themeButton = document.getElementById("themeButton");

function setTheme(dark) {
  document.documentElement.classList.toggle("dark", dark);
  localStorage.theme = dark ? "dark" : "light";
}

themeButton.addEventListener("click", () =>
  setTheme(!document.documentElement.classList.contains("dark"))
);

const navButton = document.getElementById("navButton");
const navList = document.getElementById("navList");
let open = false;

function setNav(next) {
  open = next;
  navButton.setAttribute("aria-expanded", open);
  navList.classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
  (open ? navList.querySelector("a") : navButton).focus();
}

navButton.addEventListener("click", () => setNav(!open));

navList.addEventListener("click", (event) => {
  if (event.target.closest("a")) setNav(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && open) setNav(false);
});

const count = document.getElementById("count");
if (count) {
  const cards = [...document.querySelectorAll(".card")];
  const filters = [...document.querySelectorAll(".filter")];
  for (const button of filters) {
    button.addEventListener("click", () => {
      filters.forEach((b) => b.setAttribute("aria-pressed", b === button));
      cards.forEach((card) =>
        card.toggleAttribute("hidden", button.textContent !== "Alla" && !card.dataset.tech.includes(button.textContent))
      );
      count.textContent = `${cards.filter((card) => !card.hidden).length} av ${cards.length} projekt`;
    });
  }
}

const toTop = document.querySelector(".to-top");
const bar = document.querySelector("header nav");

new IntersectionObserver(([entry]) => {
  bar.classList.toggle("scrolled", !entry.isIntersecting);
  toTop.classList.toggle("show", !entry.isIntersecting);
}).observe(document.getElementById("top"));
