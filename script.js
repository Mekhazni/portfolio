
/* ========================================
   NIHAD PORTFOLIO — MAIN SCRIPT
   ======================================== */


/* ========================================
   1. MOBILE NAVIGATION
   ======================================== */

const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Open navigation menu" : "Close navigation menu"
    );

    menuToggle.textContent = isOpen ? "☰" : "✕";
    mobileNav.hidden = isOpen;
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.hidden = true;
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      menuToggle.textContent = "☰";
    });
  });
}


/* ========================================
   2. HELPER FUNCTIONS
   ======================================== */

async function loadJSON(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Could not load ${path}: ${response.status}`);
  }

  return response.json();
}

function createElement(tag, className = "", text = null) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== null && text !== undefined) {
    element.textContent = text;
  }

  return element;
}

function addText(parent, tag, className, text) {
  const element = createElement(tag, className, text);
  parent.appendChild(element);
  return element;
}

function addTags(parent, technologies) {
  if (!Array.isArray(technologies) || technologies.length === 0) {
    return;
  }

  const tags = createElement("div", "tags");

  technologies.forEach((technology) => {
    tags.appendChild(createElement("span", "tag", technology));
  });

  parent.appendChild(tags);
}

function addLink(parent, text, href, className) {
  if (!href) return null;

  const link = createElement("a", className, text);
  link.href = href;
  parent.appendChild(link);

  return link;
}

function formatDateRange(start, end) {
  if (start && end) return `${start} — ${end}`;
  return start || end || "";
}


function setLink(element, field, contact) {
  if (!element) return;

  const value = contact?.[field];

  if (!value) {
    element.hidden = true;
    return;
  }

  element.hidden = false;

  if (field === "email") {
    element.href = `mailto:${value}`;
  } else if (field === "phone") {
    element.href = `tel:${value.replace(/[^\d+]/g, "")}`;

    const phoneText = element.querySelector("[data-contact-phone]");
    if (phoneText) {
      phoneText.textContent = value;
    }
  } else if (field === "cv") {
    element.href = value;
    element.setAttribute("download", "");
  } else {
    element.href = value.startsWith("http")
      ? value
      : `https://${value}`;

    element.target = "_blank";
    element.rel = "noopener noreferrer";
  }
}



/* ========================================
   3. PROFILE, ABOUT AND CONTACT
   ======================================== */

function renderProfile(profile) {
  document.querySelectorAll("[data-profile]").forEach((element) => {
    const field = element.dataset.profile;

    let value = profile[field];

    if (field === "intro" && !value) {
      value = profile.about?.[0] || "";
    }

    if (value !== undefined && value !== null) {
      element.textContent = value;
    }
  });

  document.querySelectorAll("[data-link]").forEach((element) => {
    setLink(element, element.dataset.link, profile.contact);
  });

  const aboutContainer = document.querySelector("#about-content");

  if (aboutContainer && Array.isArray(profile.about)) {
    aboutContainer.replaceChildren();

    profile.about.forEach((paragraph) => {
      addText(aboutContainer, "p", "", paragraph);
    });
  }

  renderAboutDetails(profile.aboutDetails);
}


/* ========================================
   ABOUT ME MODAL CONTENT
   ======================================== */

function renderAboutDetails(details) {
  const container = document.querySelector("#about-modal-content");

  if (!container) return;

  container.replaceChildren();

  if (!Array.isArray(details)) return;

  const iconSymbols = {
    "user-round": "◎",
    brain: "✳",
    "code-2": "</>",
    target: "◎"
  };

  details.forEach((detail) => {
    if (!detail || !detail.title || !detail.text) return;

    const card = createElement("article", "about-detail-card");

    const icon = createElement(
      "span",
      "about-detail-icon",
      iconSymbols[detail.icon] || "✦"
    );

    icon.setAttribute("aria-hidden", "true");

    const heading = createElement("h3", "", detail.title);
    const paragraph = createElement("p", "", detail.text);

    card.appendChild(icon);
    card.appendChild(heading);
    card.appendChild(paragraph);

    container.appendChild(card);
  });
}



/* ========================================
   4. FEATURED PROJECT
   Uses the original CSS preview structure.
   ======================================== */

function renderFeaturedProject(projectsData) {
  const container = document.querySelector("#featured-project");
  if (!container) return;

  const projects = projectsData.projects || [];

  const featured =
    projects.find(
      (project) => project.id === projectsData.featuredProject
    ) || projects.find((project) => project.featured);

  if (!featured) return;

  container.replaceChildren();

  const article = createElement("article", "featured");

  // Left column
  const content = createElement("div", "");

  addText(
    content,
    "div",
    "feature-label",
    featured.category || "Featured Project"
  );

  addText(content, "h3", "", featured.title);

  addText(
    content,
    "p",
    "",
    featured.card?.description ||
      featured.details?.overview ||
      ""
  );

  addTags(content, featured.card?.technologies || []);

  const actions = createElement("div", "actions");

  addLink(
    actions,
    "Explore project ↗",
    `project.html?id=${encodeURIComponent(featured.id)}`,
    "btn"
  );

  const github = featured.details?.links?.github;

  if (github) {
    const githubLink = addLink(actions, "GitHub ↗", github, "btn");

    if (githubLink) {
      githubLink.target = "_blank";
      githubLink.rel = "noopener noreferrer";
    }
  }

  content.appendChild(actions);
  article.appendChild(content);

  // Right column: mock preview matching style.css
  const mockWindow = createElement("div", "mock-window");

  const mockSide = createElement("div", "mock-side");

  for (let i = 0; i < 5; i++) {
    mockSide.appendChild(createElement("i"));
  }

  mockWindow.appendChild(mockSide);

  const mockApp = createElement("div", "mock-app");

  const mockTop = createElement("div", "mock-top");
  addText(mockTop, "span", "", "Knowledge Assistant");
  addText(mockTop, "span", "", "●  ●  ●");
  mockApp.appendChild(mockTop);

  addText(
    mockApp,
    "div",
    "mock-question",
    "How can I help you today?"
  );

  addText(
    mockApp,
    "div",
    "mock-search",
    "Search technical documentation..."
  );

  const mockAnswer = createElement("div", "mock-answer");

  const answerLeft = createElement("div");
  answerLeft.appendChild(createElement("i"));
  answerLeft.appendChild(createElement("i"));
  answerLeft.appendChild(createElement("i"));
  answerLeft.appendChild(createElement("i"));

  const answerRight = createElement("div");
  answerRight.appendChild(createElement("i"));
  answerRight.appendChild(createElement("i"));
  answerRight.appendChild(createElement("i"));

  mockAnswer.appendChild(answerLeft);
  mockAnswer.appendChild(answerRight);

  mockApp.appendChild(mockAnswer);
  mockWindow.appendChild(mockApp);
  article.appendChild(mockWindow);

  container.appendChild(article);
}


/* ========================================
   5. PROJECT CARDS
   ======================================== */

function renderProjects(projectsData) {
  const container = document.querySelector("#project-grid");
  if (!container) return;

  container.replaceChildren();

  const projects = projectsData.projects || [];

  const featured =
    projects.find(
      (project) => project.id === projectsData.featuredProject
    ) || projects.find((project) => project.featured);

  const otherProjects = projects.filter(
    (project) => project.id !== featured?.id
  );

  otherProjects.forEach((project) => {
    const card = createElement("article", "project-card");

    // Decorative thumbnail
    const thumbnail = createElement("div", "project-thumb");
    const thumbnailUI = createElement("div", "thumb-ui");

    for (let i = 0; i < 3; i++) {
      thumbnailUI.appendChild(createElement("i"));
    }

    thumbnail.appendChild(thumbnailUI);
    card.appendChild(thumbnail);

    // Card content
    const body = createElement("div", "project-body");

    if (project.status) {
      addText(body, "div", "project-status", project.status);
    }

    addText(body, "h3", "", project.title);

    addText(
      body,
      "p",
      "",
      project.card?.description || ""
    );

    addTags(body, project.card?.technologies || []);

    addLink(
      body,
      "View project ↗",
      `project.html?id=${encodeURIComponent(project.id)}`,
      "card-link"
    );

    card.appendChild(body);
    container.appendChild(card);
  });
}


/* ========================================
   6. EXPERIENCE
   Keep the date and content in separate columns.
   ======================================== */

function renderExperience(experienceData) {
  const container = document.querySelector("#experience-list");
  if (!container) return;

  container.replaceChildren();

  const experiences = (experienceData.experiences || []).filter(
    (experience) =>
      experience.startDate ||
      experience.endDate ||
      experience.description ||
      (experience.responsibilities || []).length > 0
  );

  experiences.forEach((experience) => {
    const item = createElement("article", "timeline-item");

    // First grid column: date
    addText(
      item,
      "div",
      "date",
      formatDateRange(experience.startDate, experience.endDate)
    );

    // Second grid column: all experience details
    const content = createElement("div");

    addText(
      content,
      "b",
      "",
      experience.organization || ""
    );

    const roleDetails = [
      experience.role,
      experience.location
    ].filter(Boolean).join(" · ");

    if (roleDetails) {
      addText(content, "em", "", roleDetails);
    }

    if (experience.description) {
      addText(content, "p", "", experience.description);
    }

    if (
      Array.isArray(experience.responsibilities) &&
      experience.responsibilities.length > 0
    ) {
      const list = createElement("ul");

      list.style.margin = "8px 0 0";
      list.style.paddingLeft = "17px";

      experience.responsibilities.forEach((responsibility) => {
        const li = createElement("li", "", responsibility);

        list.appendChild(li);
      });

      content.appendChild(list);
    }

    item.appendChild(content);
    container.appendChild(item);
  });
}


/* ========================================
   7. EDUCATION
   ======================================== */

function renderEducation(educationData) {
  const container = document.querySelector("#education-list");
  if (!container) return;

  container.replaceChildren();

  (educationData.education || []).forEach((entry) => {
    const item = createElement("article", "timeline-item");

    let date = "";

    if (entry.startYear && entry.endYear) {
      date = entry.startYear === entry.endYear
        ? String(entry.endYear)
        : `${entry.startYear} — ${entry.endYear}`;
    } else {
      date = String(entry.startYear || entry.endYear || "");
    }

    addText(item, "div", "date", date);

    const content = createElement("div");

    addText(
      content,
      "b",
      "",
      entry.institution || entry.degree || "Education"
    );

    const degreeDetails = [
      entry.degree,
      entry.field
    ].filter(Boolean).join(" · ");

    if (degreeDetails) {
      addText(content, "em", "", degreeDetails);
    }

    const additionalDetails = [
      entry.status,
      entry.result,
      entry.location
    ].filter(Boolean).join(" · ");

    if (additionalDetails) {
      addText(content, "p", "", additionalDetails);
    }

    item.appendChild(content);
    container.appendChild(item);
  });
}


/* ========================================
   8. SKILLS
   Preserve the existing .skill-grid and .skill-title CSS.
   ======================================== */

function renderSkills(skillsData) {
  const container = document.querySelector("#skills-grid");
  if (!container) return;

  container.replaceChildren();

  const symbols = {
    programming: "</>",
    "ai-machine-learning": "✳",
    "data-databases": "▤",
    "frameworks-tools": "⚙",
    web: "⌘"
  };

  (skillsData.categories || []).forEach((category) => {
    const card = createElement("div", "skill-card");

    // .skill-title is already styled as a flex heading in style.css
    const heading = createElement("div", "skill-title");

    addText(
      heading,
      "span",
      "skill-symbol",
      symbols[category.id] || "✳"
    );

    heading.appendChild(
      document.createTextNode(category.title || "")
    );

    card.appendChild(heading);
    addTags(card, category.skills || []);

    container.appendChild(card);
  });
}


/* ========================================
   9. FOOTER YEAR
   ======================================== */

function renderFooterYear() {
  const year = document.querySelector("#current-year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}


/* ========================================
   10. INITIALIZE PORTFOLIO
   ======================================== */

async function initializePortfolio() {
  try {
    const [
      profile,
      projects,
      experience,
      education,
      skills
    ] = await Promise.all([
      loadJSON("data/profile.json"),
      loadJSON("data/projects.json"),
      loadJSON("data/experience.json"),
      loadJSON("data/education.json"),
      loadJSON("data/skills.json")
    ]);

    renderProfile(profile);
    renderFeaturedProject(projects);
    renderProjects(projects);
    renderExperience(experience);
    renderEducation(education);
    renderSkills(skills);
    renderFooterYear();

    console.log("Portfolio data loaded successfully.");
  } catch (error) {
    console.error("Portfolio data could not be loaded:", error);
    console.error(
      "Check that all five JSON files exist in the data folder and that the page is opened with VS Code Live Server."
    );
  }
}

initializePortfolio();


/* ========================================
   11. DARK / LIGHT THEME TOGGLE
   ======================================== */

function initializeThemeToggle() {
  const themeToggle = document.querySelector(".theme-toggle");
  const root = document.documentElement;

  // Restore the saved theme, or use dark mode by default.
  let savedTheme = "dark";

  try {
    savedTheme = localStorage.getItem("portfolio-theme") || "dark";
  } catch (error) {
    console.warn("Theme preference could not be loaded.", error);
  }

  function applyTheme(theme) {
    const selectedTheme = theme === "light" ? "light" : "dark";

    root.dataset.theme = selectedTheme;

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        selectedTheme === "light"
          ? "Switch to dark mode"
          : "Switch to light mode"
      );

      themeToggle.setAttribute(
        "aria-pressed",
        String(selectedTheme === "light")
      );

      themeToggle.setAttribute("title",
        selectedTheme === "light"
          ? "Switch to dark mode"
          : "Switch to light mode"
      );
    }

    try {
      localStorage.setItem("portfolio-theme", selectedTheme);
    } catch (error) {
      console.warn("Theme preference could not be saved.", error);
    }
  }

  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = root.dataset.theme || "dark";

      applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
  }
}

initializeThemeToggle();



/* ========================================
   12. ACTIVE NAVIGATION
   ======================================== */

function initializeActiveNavigation() {
  const desktopNav = document.querySelector("#main-nav");
  const mobileNav = document.querySelector("#mobile-nav");
  const header = document.querySelector("header");

  if (!desktopNav) {
    console.warn(
      'Active navigation could not initialize: "#main-nav" was not found.'
    );
    return;
  }

  const desktopLinks = [
    ...desktopNav.querySelectorAll('a[href^="#"]')
  ];

  const mobileLinks = mobileNav
    ? [...mobileNav.querySelectorAll('a[href^="#"]')]
    : [];

  const allLinks = [...desktopLinks, ...mobileLinks];

  const sections = desktopLinks
    .map((link) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return null;

      return document.querySelector(href);
    })
    .filter(Boolean);

  if (sections.length === 0) {
    console.warn(
      "Active navigation could not initialize: no matching sections were found."
    );
    return;
  }

  function setActive(id) {
    allLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const active = href === `#${id}`;

      link.classList.toggle("active", active);

      if (active) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateFromScroll() {
    const headerHeight = header?.offsetHeight || 0;
    const marker = headerHeight + 100;

    let current = sections[0];

    for (const section of sections) {
      if (section.getBoundingClientRect().top <= marker) {
        current = section;
      } else {
        break;
      }
    }

    /*
     * At the bottom of the page, select the final section
     * so the last navigation item can become active.
     */
    const atPageBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2;

    if (atPageBottom) {
      current = sections[sections.length - 1];
    }

    if (current) {
      setActive(current.id);
    }
  }

  /*
   * Clicking a link updates both desktop and mobile navigation.
   * The browser retains its normal anchor scrolling behavior.
   */
  allLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) return;

      const id = href.slice(1);

      if (document.getElementById(id)) {
        setActive(id);
      }

      /*
       * Close the mobile menu after selecting a destination.
       */
      if (
        mobileNav &&
        mobileNav.contains(link) &&
        menuToggle
      ) {
        mobileNav.hidden = true;
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute(
          "aria-label",
          "Open navigation menu"
        );
        menuToggle.textContent = "☰";
      }
    });
  });

  /*
   * Keep the active item synchronized while scrolling.
   */
  window.addEventListener("scroll", updateFromScroll, {
    passive: true
  });

  window.addEventListener("resize", updateFromScroll);

  /*
   * Recalculate after the page has loaded and its layout is ready.
   */
  window.addEventListener("load", updateFromScroll, {
    once: true
  });

  updateFromScroll();
}

initializeActiveNavigation();


/* ========================================
   13. ABOUT ME MODAL
   ======================================== */

function initializeAboutModal() {
  const modal = document.querySelector("#about-modal");
  const openButton = document.querySelector("#open-about-modal");
  const modalWindow = modal?.querySelector(".about-modal-window");
  const closeButtons = modal?.querySelectorAll("[data-about-modal-close]");

  if (!modal || !openButton || !modalWindow || !closeButtons) return;

  let previousFocus = null;

  function openModal() {
    previousFocus = document.activeElement;

    modal.hidden = false;
    document.body.style.overflow = "hidden";

    modalWindow.focus();
  }

  function closeModal() {
    if (modal.hidden) return;

    modal.hidden = true;
    document.body.style.overflow = "";

    if (previousFocus instanceof HTMLElement) {
      previousFocus.focus();
    }
  }

  openButton.addEventListener("click", openModal);

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (modal.hidden) return;

    if (event.key === "Escape") {
      closeModal();
      return;
    }

    // Keep keyboard focus inside the modal while it is open.
    if (event.key === "Tab") {
      const focusableElements = [
        ...modalWindow.querySelectorAll(
          'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ].filter((element) => element.getClientRects().length > 0);

      if (focusableElements.length === 0) {
        event.preventDefault();
        modalWindow.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });
}

initializeAboutModal();
