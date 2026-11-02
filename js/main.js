(function () {
  const grid = document.getElementById("works-grid");
  if (!grid) return;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  // Lucide 아이콘 자리 (effects.js 에서 실제 아이콘으로 바뀜)
  function icon(name) {
    const i = document.createElement("i");
    i.setAttribute("data-lucide", name);
    return i;
  }

  function row(label, value) {
    const wrap = el("div", "work__row");
    wrap.append(el("dt", null, label), el("dd", null, value));
    return wrap;
  }

  function workCard(work, index) {
    const card = el("article", "work");
    const head = el("div", "work__head");
    head.append(el("span", "work__num", String(index + 1).padStart(2, "0")));
    if (work.date) head.append(el("span", "work__date", work.date));
    card.append(head, el("h3", "work__title", work.title));

    const list = el("dl", "work__list");
    list.append(
      row("문제", work.problem),
      row("내가 한 일", work.action),
      row("사용 기술", work.tech),
      row("결과", work.result)
    );
    card.append(list);

    if (work.link) {
      const a = el("a", "work__link", "자세히 보기");
      a.append(icon("arrow-up-right"));
      a.href = work.link;
      a.target = "_blank";
      a.rel = "noopener";
      card.append(a);
    }
    return card;
  }

  function emptyCard(index) {
    const card = el("article", "work work--empty");
    const head = el("div", "work__head");
    head.append(el("span", "work__num", String(index + 1).padStart(2, "0")));
    const soon = el("p", "work__soon");
    soon.append(icon("clock"), "준비 중 · 곧 추가됩니다");
    card.append(head, soon);
    return card;
  }

  WORKS.forEach((work, i) => grid.append(workCard(work, i)));
  for (let i = WORKS.length; i < MIN_SLOTS; i++) grid.append(emptyCard(i));
})();
