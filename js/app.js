/* ---- 스크롤 등장 애니메이션 ----
   화면에 이미 보이는 요소는 바로 표시(깜빡임 방지), 나머지는 스크롤로 들어올 때 등장.
   '동작 줄이기' 설정이거나 IntersectionObserver 미지원 브라우저에서는 애니메이션 없이 바로 보임. */
(function () {
  const items = document.querySelectorAll("[data-reveal]");
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!items.length || reduce || !("IntersectionObserver" in window)) return;
  const vh = window.innerHeight;
  items.forEach((el) => {
    if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add("is-in");
  });
  document.documentElement.classList.add("reveal-ready");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  items.forEach((el) => {
    if (!el.classList.contains("is-in")) io.observe(el);
  });
})();

/* ---- 페이스 그룹 탭 (1km 페이스 · 출발 시간) ---- */
const groups = {
  A: { pace: "7분 30초", depart: "08:30" },
  B: { pace: "7분", depart: "08:40" },
  C: { pace: "6분 30초", depart: "08:50" },
};

const tabs = document.querySelectorAll("[data-tab]");
const labels = document.querySelectorAll("[data-group-label]");
const gatherOut = document.querySelector("[data-pace-out]");
const departOut = document.querySelector("[data-depart-out]");
const timePanel = document.getElementById("fr-timepanel");

function selectGroup(key) {
  const group = groups[key];
  if (!group) return;
  tabs.forEach((tab) => {
    const on = tab.dataset.tab === key;
    tab.classList.toggle("is-active", on);
    tab.setAttribute("aria-selected", String(on));
  });
  labels.forEach((el) => {
    el.textContent = `${key} 그룹`;
  });
  if (gatherOut) gatherOut.textContent = group.pace;
  if (departOut) departOut.textContent = group.depart;
  if (timePanel) timePanel.setAttribute("aria-labelledby", `fr-tab-${key}`);
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => selectGroup(tab.dataset.tab));
});

document.querySelectorAll("[data-acc-group]").forEach((group) => {
  group.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-acc-btn]");
    if (!btn || !group.contains(btn)) return;
    const item = btn.closest("[data-acc-item]");
    const willOpen = !item.classList.contains("is-open");
    group.querySelectorAll("[data-acc-item]").forEach((el) => {
      const open = willOpen && el === item;
      el.classList.toggle("is-open", open);
      el.querySelector("[data-acc-btn]").setAttribute("aria-expanded", String(open));
    });
  });
});

const lightbox = document.querySelector("[data-fr-lightbox]");
const caption = document.querySelector("[data-fr-caption]");

document.querySelectorAll("[data-lightbox-open]").forEach((btn) => {
  btn.addEventListener("click", () => {
    caption.textContent = btn.dataset.caption || "";
    lightbox.classList.add("is-open");
  });
});

function closeLightbox() {
  lightbox.classList.remove("is-open");
}

document.querySelector("[data-fr-close]").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

const toast = document.querySelector("[data-toast]");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-on"), 2200);
}

document.querySelectorAll("[data-apply]").forEach((btn) => {
  btn.addEventListener("click", () => {
    showToast("10월 9일(월) 오전 10시, 네이버 예약이 열려요!");
  });
});

const sticky = document.querySelector("[data-fr-bar]");
const applySection = document.getElementById("fr-apply");

function updateSticky() {
  const scrolled = window.scrollY > 420;
  const applyVisible =
    applySection.getBoundingClientRect().top < window.innerHeight - 80;
  sticky.classList.toggle("is-visible", scrolled && !applyVisible);
}

window.addEventListener("scroll", updateSticky, { passive: true });
updateSticky();
