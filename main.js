(function () {
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sectionIds = navLinks
    .map((link) => link.getAttribute("href"))
    .filter((href) => href && href.startsWith("#"))
    .map((href) => href.slice(1));

  function setActiveNav(id) {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
    });
  }

  function chooseActiveSection() {
    const offset = window.innerHeight * 0.32;
    let activeId = sectionIds[0];

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (!section) return;
      if (section.getBoundingClientRect().top <= offset) {
        activeId = id;
      }
    });

    setActiveNav(activeId);
  }

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = window.localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.dataset.theme = savedTheme;
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = nextTheme;
      window.localStorage.setItem("theme", nextTheme);
    });
  }

  const carousel = document.querySelector(".photo-carousel");
  const slides = Array.from(document.querySelectorAll(".carousel-slide"));
  const dots = Array.from(document.querySelectorAll("[data-carousel-dot]"));
  const prevButton = document.querySelector("[data-carousel-prev]");
  const nextButton = document.querySelector("[data-carousel-next]");
  let activeSlide = 0;
  let dragStartX = null;

  function showSlide(index) {
    if (!slides.length) return;
    activeSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeSlide);
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeSlide;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function recordDragStart(clientX) {
    dragStartX = clientX;
  }

  function finishDrag(clientX) {
    if (dragStartX === null) return;
    const dragDistance = clientX - dragStartX;
    dragStartX = null;

    if (Math.abs(dragDistance) < 45) return;
    showSlide(activeSlide + (dragDistance < 0 ? 1 : -1));
  }

  if (slides.length) {
    prevButton?.addEventListener("click", () => showSlide(activeSlide - 1));
    nextButton?.addEventListener("click", () => showSlide(activeSlide + 1));

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        showSlide(Number(dot.dataset.carouselDot));
      });
    });

    carousel?.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showSlide(activeSlide - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showSlide(activeSlide + 1);
      }
    });

    carousel?.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button")) return;
      recordDragStart(event.clientX);
      carousel.setPointerCapture?.(event.pointerId);
    });

    carousel?.addEventListener("pointerup", (event) => {
      finishDrag(event.clientX);
    });

    carousel?.addEventListener("pointercancel", () => {
      dragStartX = null;
    });

    carousel?.addEventListener("mousedown", (event) => {
      if (event.target.closest("button")) return;
      event.preventDefault();
      recordDragStart(event.clientX);
    });

    window.addEventListener("mouseup", (event) => {
      finishDrag(event.clientX);
    });

    carousel?.addEventListener("touchstart", (event) => {
      recordDragStart(event.changedTouches[0].clientX);
    }, { passive: true });

    carousel?.addEventListener("touchend", (event) => {
      finishDrag(event.changedTouches[0].clientX);
    });

    showSlide(0);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        setActiveNav(href.slice(1));
      }
    });
  });

  window.addEventListener("scroll", chooseActiveSection, { passive: true });
  window.addEventListener("hashchange", chooseActiveSection);
  chooseActiveSection();
})();
