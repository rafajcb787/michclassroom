/* ===== DOM Elements ===== */
const workList = document.getElementById("work-list");
const eventList = document.getElementById("event-list");
const workEmpty = document.getElementById("work-empty");
const eventEmpty = document.getElementById("event-empty");
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");
const scrollTopBtn = document.getElementById("scroll-top");

/* ===== Toast Notification System ===== */
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icons = {
    success: "fa-circle-check",
    info: "fa-circle-info",
    warning: "fa-triangle-exclamation",
    error: "fa-circle-xmark",
  };

  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "toastOut 0.4s ease forwards";
    toast.addEventListener("animationend", () => toast.remove());
  }, 3500);
}

/* ===== List Helpers ===== */
function addWorkItem(title, notes) {
  const item = document.createElement("li");
  const textSpan = document.createElement("span");
  textSpan.textContent = notes ? `${title} — ${notes}` : title;
  item.appendChild(textSpan);
  workList.prepend(item);
  updateEmptyStates();
}

function addEventItem(title, date) {
  const item = document.createElement("li");
  const textSpan = document.createElement("span");
  textSpan.textContent = title;
  const dateSpan = document.createElement("span");
  dateSpan.className = "item-date";
  dateSpan.textContent = formatDate(date);
  item.appendChild(textSpan);
  item.appendChild(dateSpan);
  eventList.prepend(item);
  updateEmptyStates();
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function updateEmptyStates() {
  if (workEmpty) {
    workEmpty.style.display = workList.children.length > 0 ? "none" : "block";
  }
  if (eventEmpty) {
    eventEmpty.style.display =
      eventList.children.length > 0 ? "none" : "block";
  }
}

/* ===== Form: Post Classwork ===== */
document.getElementById("upload-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("work-title").value.trim();
  const notes = document.getElementById("work-notes").value.trim();

  if (!title) return;

  addWorkItem(title, notes);
  showToast(`"${title}" published successfully!`, "success");
  e.target.reset();
});

/* ===== Form: Calendar Event ===== */
document.getElementById("calendar-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("event-title").value.trim();
  const date = document.getElementById("event-date").value;

  if (!title || !date) return;

  addEventItem(title, date);
  showToast(`Event "${title}" added to calendar.`, "success");
  e.target.reset();
});

/* ===== Form: Messaging ===== */
document.getElementById("message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const to = document.getElementById("message-to").value.trim();
  const body = document.getElementById("message-body").value.trim();

  if (!to || !body) {
    showToast("Please fill in all message fields.", "warning");
    return;
  }

  showToast(`Message sent to ${to}!`, "success");
  e.target.reset();
});

/* ===== Form: Registration ===== */
document.getElementById("register-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const role = document.getElementById("role").value;

  if (!name || !email || !role) {
    showToast("Please complete all registration fields.", "warning");
    return;
  }

  const key = "micheline-classroom-users";
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  existing.push({ name, email, role, createdAt: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(existing));

  showToast(
    `Welcome, ${name}! Your ${role.toLowerCase()} account is ready.`,
    "success"
  );
  e.target.reset();
});

/* ===== Navbar: Scroll Effect ===== */
function handleNavbarScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

/* ===== Navbar: Active Link Highlighting ===== */
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const scrollPos = window.scrollY + 120;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);

    if (link) {
      if (scrollPos >= top && scrollPos < top + height) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    }
  });
}

/* ===== Navbar: Mobile Toggle ===== */
navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("active");
  navLinks.classList.toggle("open");
});

/* Close mobile menu when clicking a link */
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("active");
    navLinks.classList.remove("open");
  });
});

/* ===== Scroll to Top ===== */
function handleScrollTopBtn() {
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add("visible");
  } else {
    scrollTopBtn.classList.remove("visible");
  }
}

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ===== Scroll-Based Animations (Intersection Observer) ===== */
const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".animate-on-scroll").forEach((el) => {
  observer.observe(el);
});

/* ===== Hero Stats Counter Animation ===== */
function animateCounters() {
  document.querySelectorAll(".stat-num").forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"), 10);
    if (!target) return;

    const duration = 2000;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target + "+";
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current) + "+";
      }
    }, stepTime);
  });
}

/* Trigger counter animation when hero is visible */
const heroObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        heroObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

const heroSection = document.getElementById("hero");
if (heroSection) {
  heroObserver.observe(heroSection);
}

/* ===== Scroll Event Listener ===== */
window.addEventListener("scroll", () => {
  handleNavbarScroll();
  updateActiveNavLink();
  handleScrollTopBtn();
});

/* ===== Demo Data ===== */
addWorkItem("Welcome Pack", "Read this before Monday");
addEventItem("First Day of Class", "2026-09-01");

/* ===== Initial State ===== */
handleNavbarScroll();
updateActiveNavLink();
updateEmptyStates();
