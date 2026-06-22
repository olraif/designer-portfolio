const data = window.PORTFOLIO_DATA || { series: [], presentations: [], heroImages: [] };

const heroStrip = document.querySelector("#heroStrip");
const seriesNav = document.querySelector("#seriesNav");
const seriesRoot = document.querySelector("#seriesRoot");
const profilePhoto = document.querySelector("#profilePhoto");
const presentationList = document.querySelector("#presentationList");
const pdfFrame = document.querySelector("#pdfFrame");
const pdfTitle = document.querySelector("#pdfTitle");
const pdfOpenLink = document.querySelector("#pdfOpenLink");
const modal = document.querySelector("#imageModal");
const modalImage = document.querySelector("#modalImage");
const modalTitle = document.querySelector("#modalTitle");
const modalKicker = document.querySelector("#modalKicker");

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

let activeGallery = [];
let activeIndex = 0;
let activeKicker = "";
let visiblePresentations = [];

if (data.profile && profilePhoto) {
  profilePhoto.src = data.profile;
}

function renderHero() {
  if (!heroStrip) return;

  heroStrip.innerHTML = data.heroImages.map((src) => (
    `<img src="${src}" alt="" loading="eager">`
  )).join("");
}

function renderNav() {
  seriesNav.innerHTML = data.series.map((section) => (
    `<a href="#${section.id}">${section.nav}</a>`
  )).join("");
}

function renderSeries() {
  seriesRoot.innerHTML = data.series.map((section) => {
    const items = section.items.map((item, index) => {
      const media = item.type === "video"
        ? `<video src="${item.src}" controls muted playsinline preload="metadata"></video>`
        : `<img src="${item.src}" alt="${item.title}" loading="lazy">`;
      const buttonAttrs = item.href
        ? `data-href="${item.href}" tabindex="0" role="link" aria-label="Open ${item.title}"`
        : item.type === "video"
          ? ""
          : `data-section="${section.id}" data-index="${index}" tabindex="0" role="button" aria-label="Open ${item.title}"`;

      const linkBadge = item.href ? `<span class="work-link-badge">Смотреть сайт</span>` : "";

      return `
        <article class="work-slide" ${buttonAttrs}>
          ${media}
          ${linkBadge}
        </article>
      `;
    }).join("");

    return `
      <section class="series-section" id="${section.id}" data-format="${section.format}">
        <div class="section-top">
          <div class="section-heading">
            <p class="eyebrow">${section.kicker}</p>
          </div>
        </div>
        <div class="carousel-shell">
          <button class="side-arrow side-prev" type="button" data-scroll="${section.id}" data-direction="-1" aria-label="Back">&#8249;</button>
          <div class="work-rail" data-rail="${section.id}">
            ${items}
          </div>
          <button class="side-arrow side-next" type="button" data-scroll="${section.id}" data-direction="1" aria-label="Forward">&#8250;</button>
        </div>
      </section>
    `;
  }).join("");
}

function renderPresentations() {
  visiblePresentations = [
    data.presentations.find((item) => item.title.startsWith("Roblox Quest.")),
    data.presentations.find((item) => item.src.includes("python-quest-01"))
  ].filter(Boolean);

  if (!visiblePresentations.length) {
    document.querySelector("#presentations").hidden = true;
    return;
  }

  presentationList.innerHTML = visiblePresentations.map((item, index) => `
    <button class="pdf-button" type="button" data-pdf-index="${index}">
      ${item.title}
      <span>${item.sizeMB} MB</span>
    </button>
  `).join("");

  setPresentation(0);
}

function setPresentation(index) {
  const item = visiblePresentations[index];
  if (!item) return;

  pdfTitle.textContent = item.title;
  pdfFrame.src = item.src;
  pdfOpenLink.href = item.src;

  presentationList.querySelectorAll(".pdf-button").forEach((button, buttonIndex) => {
    button.classList.toggle("is-active", buttonIndex === index);
  });
}

function scrollRail(sectionId, direction) {
  const rail = document.querySelector(`[data-rail="${sectionId}"]`);
  if (!rail) return;

  rail.scrollBy({
    left: direction * Math.max(rail.clientWidth * 0.82, 320),
    behavior: "smooth"
  });
}

function openModal(sectionId, index) {
  const section = data.series.find((item) => item.id === sectionId);
  if (!section) return;

  activeGallery = section.items;
  activeIndex = index;
  activeKicker = section.kicker;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  setModalImage(index);
}

function setModalImage(index) {
  if (!activeGallery.length) return;

  activeIndex = (index + activeGallery.length) % activeGallery.length;
  const item = activeGallery[activeIndex];
  modalImage.src = item.src;
  modalImage.alt = item.title;
  modalTitle.textContent = item.title;
  modalKicker.textContent = `${activeKicker} / ${activeIndex + 1} из ${activeGallery.length}`;
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  activeGallery = [];
  activeIndex = 0;
}

function scrollToHash() {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (target) {
    const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top, behavior: "auto" });
  }
}

function settleHashScroll() {
  [0, 120, 350, 900, 1800, 3500, 6000].forEach((delay) => {
    window.setTimeout(scrollToHash, delay);
  });
}

document.addEventListener("click", (event) => {
  const anchor = event.target.closest('a[href^="#"]');
  if (anchor && anchor.getAttribute("href").length > 1) {
    event.preventDefault();
    history.pushState(null, "", anchor.getAttribute("href"));
    settleHashScroll();
    return;
  }

  const scrollButton = event.target.closest("[data-scroll]");
  if (scrollButton) {
    scrollRail(scrollButton.dataset.scroll, Number(scrollButton.dataset.direction));
  }

  const slide = event.target.closest(".work-slide");
  if (slide?.dataset.href) {
    window.open(slide.dataset.href, "_blank", "noopener");
    return;
  }
  if (slide && slide.dataset.section) {
    openModal(slide.dataset.section, Number(slide.dataset.index));
  }

  const pdfButton = event.target.closest("[data-pdf-index]");
  if (pdfButton) {
    setPresentation(Number(pdfButton.dataset.pdfIndex));
  }

  if (event.target.matches("[data-close-modal]")) {
    closeModal();
  }

  if (event.target.closest("[data-modal-prev]")) {
    setModalImage(activeIndex - 1);
  }

  if (event.target.closest("[data-modal-next]")) {
    setModalImage(activeIndex + 1);
  }
});

document.addEventListener("keydown", (event) => {
  const slide = event.target.closest(".work-slide");
  if (slide && (event.key === "Enter" || event.key === " ")) {
    if (slide.dataset.href) {
      event.preventDefault();
      window.open(slide.dataset.href, "_blank", "noopener");
      return;
    }
    if (slide.dataset.section) {
      event.preventDefault();
      openModal(slide.dataset.section, Number(slide.dataset.index));
    }
  }

  if (!modal.classList.contains("is-open")) return;

  if (event.key === "Escape") closeModal();
  if (event.key === "ArrowLeft") setModalImage(activeIndex - 1);
  if (event.key === "ArrowRight") setModalImage(activeIndex + 1);
});

renderHero();
renderNav();
renderSeries();
renderPresentations();
settleHashScroll();
window.addEventListener("load", settleHashScroll);
window.addEventListener("hashchange", settleHashScroll);

