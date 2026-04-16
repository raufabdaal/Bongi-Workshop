// Mobile navigation controls and menu state.
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const mobileClose = document.getElementById("mobileClose");
const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];

function openMobileMenu() {
  if (!mobileMenu || !menuToggle) return;
  mobileMenu.classList.add("open");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  if (!mobileMenu || !menuToggle) return;
  mobileMenu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    if (mobileMenu.classList.contains("open")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
}

if (mobileClose) {
  mobileClose.addEventListener("click", closeMobileMenu);
}

mobileLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

// Sticky header blur state on scroll.
const siteHeader = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  if (!siteHeader) return;
  siteHeader.classList.toggle("scrolled", window.scrollY > 8);
});

// Scroll-driven section reveal animation with IntersectionObserver.
const revealTargets = document.querySelectorAll(".section-observe");
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
);

revealTargets.forEach((target) => revealObserver.observe(target));

// Stagger service card animation by 0.1s for a progressive reveal.
const serviceCards = document.querySelectorAll(".stagger-card");
serviceCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.1}s`;
  revealObserver.observe(card);
});

// Gallery fade-in stagger based on assigned column class.
const galleryItems = document.querySelectorAll(".gallery-item");
galleryItems.forEach((item) => {
  const colClass = [...item.classList].find((name) => name.startsWith("col-"));
  const col = colClass ? Number(colClass.split("-")[1]) : 1;
  item.style.transitionDelay = `${(col - 1) * 0.1}s`;
});

// Animate engineering-style counters when stats become visible.
const statNumbers = document.querySelectorAll(".stat-number");
let countersStarted = false;

function animateCount(el, target, duration = 1200) {
  const startTime = performance.now();
  function step(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const value = Math.floor(progress * target);
    const suffix = target >= 100 ? "+" : target > 15 ? "" : "+";
    el.textContent = `${value}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = `${target}${suffix}`;
    }
  }
  requestAnimationFrame(step);
}

const statsRow = document.querySelector(".stats-row");
if (statsRow) {
  const statsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          statNumbers.forEach((stat) => {
            const target = Number(stat.dataset.target || 0);
            animateCount(stat, target);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.45 }
  );
  statsObserver.observe(statsRow);
}

// Active navigation link highlighting by current section.
const navLinks = document.querySelectorAll(".nav-links a");
const navSections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", active);
      });
    });
  },
  { threshold: 0.55 }
);

navSections.forEach((section) => navObserver.observe(section));

// Gallery "Load More" v1 stub behavior.
const loadMoreBtn = document.getElementById("loadMoreBtn");
const comingSoon = document.getElementById("comingSoon");
if (loadMoreBtn && comingSoon) {
  loadMoreBtn.addEventListener("click", () => {
    comingSoon.textContent = "Coming Soon: additional project photos will be available here.";
  });
}

// Form submission UX for Formspree integration with graceful fallback.
const quoteForm = document.getElementById("quoteForm");
const formNote = document.getElementById("formNote");

if (quoteForm && formNote) {
  quoteForm.addEventListener("submit", async (event) => {
    const action = quoteForm.getAttribute("action") || "";
    if (action.includes("YOUR_FORMSPREE_ID")) {
      event.preventDefault();
      formNote.textContent = "Set your Formspree ID in the form action before going live.";
      return;
    }

    event.preventDefault();
    formNote.textContent = "Sending your inquiry...";

    try {
      const response = await fetch(action, {
        method: "POST",
        body: new FormData(quoteForm),
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        quoteForm.reset();
        formNote.textContent = "Thank you. Your inquiry has been sent successfully.";
      } else {
        formNote.textContent = "Could not send inquiry. Please try again or contact us directly.";
      }
    } catch (error) {
      formNote.textContent = "Network error. Please check your connection and try again.";
    }
  });
}
