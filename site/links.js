// Goes through every project card, colours its links by project, and lays each link's
// address inside the vertical stem of one of the letters of the name in the masthead.
// The stems are measured from the rendered glyphs, so the marks stay inside the ink
// whatever mono face the visitor has. A mark that cannot fit legibly is left out.
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

if (name && links.length) {
  const SIZE = 256;
  const BAND = Math.round(SIZE * 0.05);
  const MIN = 7;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const family = getComputedStyle(name).fontFamily;
  const font = (weight) => `${weight} ${SIZE}px ${family}`;

  // The tallest solid vertical strip of ink in a glyph, as fractions of the letter box:
  // x and w in em, y and h as a share of the box height. Null when the glyph has none.
  const stemOf = (char) => {
    ctx.font = font(400);
    const metrics = ctx.measureText(char);
    const ascent = Math.ceil(metrics.fontBoundingBoxAscent);
    const width = Math.ceil(metrics.width);
    const height = ascent + Math.ceil(metrics.fontBoundingBoxDescent);
    canvas.width = width;
    canvas.height = height;
    ctx.font = font(400);
    ctx.textBaseline = "alphabetic";
    ctx.fillText(char, 0, ascent);
    const alpha = ctx.getImageData(0, 0, width, height).data;
    const ink = (x, y) => alpha[(y * width + x) * 4 + 3] > 127;

    // Tallest run that is inked across a band of columns at least BAND wide, then
    // widened as far as the run stays solid.
    const band = (x0, y) => {
      for (let x = x0; x < x0 + BAND; x++) if (!ink(x, y)) return false;
      return true;
    };
    let best = [0, 0, 0];
    for (let x = 0; x + BAND <= width; x++) {
      let run = 0;
      for (let y = 0; y <= height; y++) {
        if (y < height && band(x, y)) run++;
        else {
          if (run > best[2]) best = [x, y - run, run];
          run = 0;
        }
      }
    }
    const [column, top, length] = best;
    if (!length) return null;
    const solid = (x) => {
      for (let y = top; y < top + length; y++) if (!ink(x, y)) return false;
      return true;
    };
    let left = column;
    let right = column + BAND - 1;
    while (left > 0 && solid(left - 1)) left--;
    while (right < width - 1 && solid(right + 1)) right++;
    return { x: left / SIZE, w: (right - left + 1) / SIZE, y: top / height, h: length / height };
  };

  // Wrap every letter and measure it. Line breaks stay where they are.
  const letters = [];
  const fragment = document.createDocumentFragment();
  const words = [];
  const stems = {};
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
      stems[char] ??= stemOf(char);
      if (stems[char]) letters.push(letter);
    }
  }
  name.setAttribute("aria-label", words.join(" ").replace(/\s+/g, " ").trim());
  name.replaceChildren(fragment);

  // One mark per link, longest address on the longest stem.
  ctx.font = font(600);
  const marks = links.map((link) => {
    const mark = link.cloneNode(false);
    mark.classList.add("mark");
    mark.style.setProperty("--hue", link.closest(".card").style.getPropertyValue("--hue"));
    mark.textContent = link.getAttribute("href").replace(/^https?:\/\//, "").replace(/\/$/, "");
    mark.title = link.textContent;
    mark.setAttribute("aria-label", link.textContent);
    return { mark, length: ctx.measureText(mark.textContent).width / SIZE };
  });
  const charOf = (letter) => letter.firstChild.textContent;
  const byStem = [...letters].sort((a, b) => stems[charOf(b)].h - stems[charOf(a)].h);
  marks
    .sort((a, b) => b.length - a.length)
    .forEach((entry, i) => {
      entry.letter = byStem[i % byStem.length];
      entry.letter.append(entry.mark);
    });

  // Fit every mark to its stem at the current size. Runs again when the name is resized.
  const layout = () => {
    const size = parseFloat(getComputedStyle(name).fontSize);
    for (const { mark, letter, length } of marks) {
      const stem = stems[charOf(letter)];
      const box = letter.getBoundingClientRect();
      const width = stem.w * size;
      const height = stem.h * box.height;
      const chars = mark.textContent.length;
      const fontSize = Math.min(width, height / length);
      mark.hidden = fontSize < MIN;
      if (mark.hidden) continue;
      const spacing = Math.min((height - length * fontSize) / chars, 0.25 * fontSize);
      Object.assign(mark.style, {
        left: `${((stem.x * size) / box.width) * 100}%`,
        top: `${stem.y * 100}%`,
        width: `${(width / box.width) * 100}%`,
        height: `${stem.h * 100}%`,
        fontSize: `${fontSize}px`,
        letterSpacing: `${spacing}px`,
      });
    }
  };

  document.fonts.ready.then(layout);
  addEventListener("resize", () => requestAnimationFrame(layout));
}
