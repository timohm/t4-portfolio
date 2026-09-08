// Goes through every project card, colours its links by project, and lays each link's
// Without JavaScript the name stays plain text and the card links keep the muted underline.

const name = document.querySelector(".masthead h1");
const cards = [...document.querySelectorAll(".card")];
const links = [];

cards.forEach((card, i) => {
  card.style.setProperty("--hue", Math.round(25 + (360 * i) / cards.length));
  for (const link of card.querySelectorAll(".links a")) {
    link.classList.add("linked");
    links.push(link);
  }
});

// Where the vertical stem of each letter sits in a mono sans face: x and y as a
// percentage of the letter box, and the stem's length in em of the name.
const stems = {
  T: [50, 52, 0.71],
  i: [53, 59, 0.54],
  m: [50, 59, 0.54],
  M: [15, 52, 0.71],
  r: [40, 59, 0.54],
  k: [30, 51, 0.76],
};

if (name && links.length) {
  // Wrap every letter so a mark can be placed on it. Line breaks stay where they are.
  const letters = [];
  const fragment = document.createDocumentFragment();
  const words = [];
  for (const node of name.childNodes) {
    if (node.nodeType !== Node.TEXT_NODE) {
      fragment.append(node.cloneNode(true));
      continue;
    }
    words.push(node.textContent);
    for (const char of node.textContent) {
      if (!char.trim()) {
        fragment.append(char);
        continue;
      }
      const letter = document.createElement("span");
      letter.className = "letter";
      letter.textContent = char;
      fragment.append(letter);
      
  const marks = links.map((link) => {
    const mark = link.cloneNode(false);
    mark.classList.add("mark");
    mark.style.setProperty("--hue", link.closest(".card").style.getPropertyValue("--hue"));
    mark.textContent = link.getAttribute("href").replace(/^https?:\/\//, "").replace(/\/$/, "");
    mark.title = link.textContent;
    mark.setAttribute("aria-label", link.textContent);

    return mark;
  });
  const byLength = [...marks].sort((a, b) => b.textContent.length - a.textContent.length);
  const byStem = [...letters].sort((a, b) => stems[b.textContent][2] - stems[a.textContent][2]);

  byLength.forEach((mark, i) => {
    const letter = byStem[i % byStem.length];
    const [x, y] = stems[letter.textContent];
    mark.style.setProperty("--x", `${x}%`);
    mark.style.setProperty("--y", `${y}%`);
    letter.append(mark);
  });

  name.setAttribute("aria-label", words.join(" ").replace(/\s+/g, " ").trim());
  name.replaceChildren(fragment);
}
