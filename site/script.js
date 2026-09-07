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
  const reset = document.querySelector(".reset");
  const apply = () => {
    const active = filters.filter((b) => b.getAttribute("aria-pressed") === "true").map((b) => b.textContent);
    cards.forEach((card) =>
      card.toggleAttribute("hidden", !active.every((tech) => card.dataset.tech.split(" ").includes(tech)))
    );
    reset.disabled = !active.length;
    count.textContent = `${cards.filter((card) => !card.hidden).length} av ${cards.length} projekt`;
  };
  for (const button of filters) {
    button.addEventListener("click", () => {
      button.setAttribute("aria-pressed", button.getAttribute("aria-pressed") !== "true");
      apply();
    });
  }
  reset.addEventListener("click", () => {
    filters.forEach((b) => b.setAttribute("aria-pressed", "false"));
    apply();
  });
}

const toTop = document.querySelector(".to-top");
const bar = document.querySelector("header nav");

new IntersectionObserver(([entry]) => {
  bar.classList.toggle("scrolled", !entry.isIntersecting);
  toTop.classList.toggle("show", !entry.isIntersecting);
}).observe(document.getElementById("top"));

const navLinks = [...document.querySelectorAll("#navList a")];
if (navLinks.length) {
  const spy = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      navLinks.forEach((a) =>
        a.hash === `#${entry.target.id}` ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")
      );
    }
  }, { rootMargin: "-50% 0px -50% 0px" });
  document.querySelectorAll("main section").forEach((s) => spy.observe(s));
}

const reveal = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.classList.add("in");
    reveal.unobserve(entry.target);
  }
}, { rootMargin: "0px 0px -10% 0px" });
document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));

const copy = document.querySelector(".copy");
if (copy) {
  const note = copy.nextElementSibling;
  copy.addEventListener("click", () => {
    navigator.clipboard.writeText("portfolio@tihm.net");
    note.textContent = "Kopierat!";
    setTimeout(() => (note.textContent = ""), 2500);
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
