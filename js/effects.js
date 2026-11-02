/*
  화면 효과 — 아이콘(Lucide), 부드러운 스크롤(Lenis), 등장 애니메이션(GSAP).
  라이브러리를 못 불러와도 내용은 그대로 보이도록 각각 따로 확인합니다.
*/
(function () {
  if (window.lucide) lucide.createIcons();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const NAV_OFFSET = -64;
  let lenis = null;

  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.1 });
    document.documentElement.style.scrollBehavior = "auto";

    // 메뉴·버튼의 #링크도 Lenis로 부드럽게 이동
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const target = document.querySelector(a.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: a.getAttribute("href") === "#top" ? 0 : NAV_OFFSET });
      });
    });
  }

  if (!window.gsap) {
    if (lenis) {
      (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(performance.now());
    }
    return;
  }

  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  // Lenis와 ScrollTrigger가 같은 스크롤 위치를 보도록 연결
  if (lenis) {
    if (window.ScrollTrigger) lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // 첫 화면: 이니셜 → 제목 한 줄씩 → 근거 → 버튼
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".hero__watermark", { xPercent: 8, opacity: 0, duration: 1.4 }, 0)
    .from(".monogram", { scale: 0.6, opacity: 0, duration: 0.7, ease: "back.out(1.7)" }, 0)
    .from(".hero__eyebrow", { x: -12, opacity: 0, duration: 0.6 }, 0.2)
    .from(".hero__title .line > span", { yPercent: 110, duration: 0.9, stagger: 0.12 }, "-=0.3")
    .from(".hero__proof", { y: 16, opacity: 0, duration: 0.7 }, "-=0.4")
    .from(".btn", { y: 16, opacity: 0, duration: 0.6 }, "-=0.45")
    .from(".hero__scroll", { opacity: 0, duration: 0.6 }, "-=0.2");

  if (!window.ScrollTrigger) return;

  // 스크롤해서 화면에 들어오면 살짝 떠오르며 나타남
  const revealItems = gsap.utils.toArray("[data-reveal], .work");
  gsap.set(revealItems, { y: 28, opacity: 0 });
  ScrollTrigger.batch(revealItems, {
    start: "top 88%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.08, overwrite: true }),
  });

  // 화면이 아주 길면 맨 아래 요소가 시작 지점까지 못 올라오므로, 페이지 끝에 닿으면 남은 것을 모두 보여줌
  ScrollTrigger.create({
    trigger: ".footer",
    start: "top bottom",
    once: true,
    onEnter: () => {
      const hidden = revealItems.filter((item) => gsap.getProperty(item, "opacity") < 1);
      gsap.to(hidden, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.08, overwrite: true });
    },
  });
})();
