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

// Gallery dynamic loading system for additional project photos.
const GALLERY_IMAGES = [
  "482250585_1212643963646300_812601339241377936_n.jpg",
  "483467696_1212642853646411_1902406934921670911_n.jpg",
  "483524302_1216883283222368_2713197717427553263_n.jpg",
  "484235257_1216883083222388_1610714306768245589_n.jpg",
  "487129905_1228476152063081_7249714506273774641_n.jpg",
  "487240762_1228475902063106_455077724968791157_n.jpg",
  "487795166_1228476308729732_570991038891104192_n.jpg",
  "487813103_1229628648614498_1790016502545482806_n.jpg",
  "488055519_1234338364810193_2094170539113404632_n.jpg",
  "488526461_1234338351476861_6216482982461261822_n.jpg",
  "488899112_1234338281476868_4373262137200343668_n.jpg",
  "489224455_1234338348143528_1463275537696046455_n.jpg",
  "489927102_1255345812709448_6064744500604990330_n.jpg",
  "490999434_1276211603956202_4914822629251794343_n.jpg",
  "492504838_1286187942958568_5342720887678939343_n.jpg",
  "492729996_1276210587289637_669365874416233683_n.jpg",
  "493130534_1255345659376130_1405527030597700325_n.jpg",
  "493469339_1255357129374983_2804292264011283859_n.jpg",
  "493485157_1255345826042780_1821513909830628366_n.jpg",
  "493641131_1276211883956174_3651009920875744196_n.jpg",
  "493827517_1255345972709432_1689227082022748030_n.jpg",
  "493960324_1276211560622873_214125363605324960_n.jpg",
  "494995732_1276211510622878_3950466344945076980_n.jpg",
  "495244657_1286187359625293_5358184304200179263_n.jpg",
  "495600931_1276211677289528_6587147870990911878_n.jpg",
  "498196935_1286187349625294_167345775966771301_n.jpg",
  "498227758_1271023224475040_5759612144743383567_n.jpg",
  "499233379_1271022991141730_7843802858046449599_n.jpg",
  "499300759_1276211840622845_761101514680155137_n.jpg",
  "499565694_1276211970622832_4768251673666444328_n.jpg",
  "499580273_1276211640622865_1866668170648295394_n.jpg",
  "499757175_1276210647289631_5554772931428756960_n.jpg",
  "499933310_1276210637289632_4240905222907227731_n.jpg",
  "502641878_1286188012958561_1473032615838943310_n.jpg",
  "503725152_1286188146291881_2407252072596043854_n.jpg",
  "504248350_1286188046291891_2158179522066578357_n.jpg",
  "504403997_1286188036291892_6727979641760782917_n.jpg",
  "505077746_1286187959625233_561115169945249575_n.jpg",
  "644225624_1515654326678594_5848860671218649077_n.jpg",
  "644284409_1515654380011922_5898610193863375969_n.jpg",
  "644509967_1515652943345399_4494627157087844067_n.jpg",
  "644529224_1515654366678590_1430080031831235089_n.jpg",
  "644816599_1515654310011929_7862664974600816693_n.jpg",
  "644920442_1515653490012011_7671857564925637077_n.jpg",
  "644946749_1515654256678601_347617683220808181_n.jpg",
  "645070572_1515652753345418_6626578626932350532_n.jpg",
  "645120656_1515652793345414_2667381084156044873_n.jpg",
  "645308082_1515652833345410_3957226055200387231_n.jpg",
  "645421358_1515654440011916_582401275097214900_n.jpg",
  "645510765_1515654290011931_8953494289787288633_n.jpg",
  "646368412_1515652883345405_365747562404593247_n.jpg",
  "646376690_1515654413345252_6572097714367931488_n.jpg",
  "646431159_1515654266678600_8699602842321894431_n.jpg",
  "671975799_1555679126009447_7410312072867135199_n.jpg",
  "672672581_1555679119342781_701885304866701539_n.jpg",
  "674215698_1555679096009450_7157186855133480174_n.jpg"
];

let galleryIndex = 0;
const batchSize = 12;
const galleryGrid = document.querySelector(".gallery-grid");
const loadMoreBtn = document.getElementById("loadMoreBtn");

function createGalleryItem(filename, index) {
  const col = (index % 3) + 1;
  const figure = document.createElement("figure");
  figure.className = `gallery-item col-${col} section-observe`;
  figure.style.transitionDelay = `${(col - 1) * 0.1}s`;

  // We use a realistic caption based on the context of the workshop
  const captions = [
    "Precision Welding", "Structural Assembly", "Metal Fabrication",
    "Security Gate Detail", "Street Pole Installation", "Workshop Production",
    "Custom Steel Work", "Urban Infrastructure", "Quality Inspection"
  ];
  const caption = captions[Math.floor(Math.random() * captions.length)];

  figure.innerHTML = `
    <img src="photos/${filename}" alt="${caption}" class="gallery-photo" loading="lazy">
    <figcaption>${caption}</figcaption>
  `;

  return figure;
}

function loadGalleryBatch() {
  if (!galleryGrid || !loadMoreBtn) return;

  const fragment = document.createDocumentFragment();
  const nextBatch = GALLERY_IMAGES.slice(galleryIndex, galleryIndex + batchSize);

  nextBatch.forEach((filename, i) => {
    const item = createGalleryItem(filename, galleryIndex + i);
    fragment.appendChild(item);
    // Register the new item with the reveal observer
    revealObserver.observe(item);
  });

  galleryGrid.appendChild(fragment);
  galleryIndex += nextBatch.length;

  // Hide button if no more images remain
  if (galleryIndex >= GALLERY_IMAGES.length) {
    loadMoreBtn.style.display = "none";
  }
}

if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    loadGalleryBatch();
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
