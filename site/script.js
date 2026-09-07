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
