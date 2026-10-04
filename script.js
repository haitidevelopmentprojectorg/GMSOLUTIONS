const header = document.querySelector(".site-header");
const progress = document.getElementById("pageProgress");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progress.style.width = `${percent}%`;
  header.classList.toggle("scrolled", scrollTop > 18);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

document.querySelectorAll(".service-expand").forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".service-card");
    const open = card.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });
});

document.querySelectorAll(".faq-item button").forEach(button => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    document.querySelectorAll(".faq-item").forEach(other => {
      if (other !== item) {
        other.classList.remove("open");
        other.querySelector("button")?.setAttribute("aria-expanded", "false");
      }
    });
    const open = item.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });
});

const counters = document.querySelectorAll("[data-counter]");
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.counter);
    const duration = 900;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.7 });
counters.forEach(counter => counterObserver.observe(counter));

const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

contactForm.addEventListener("submit", event => {
  event.preventDefault();

  const data = new FormData(contactForm);
  const name = (data.get("name") || "").trim();
  const business = (data.get("business") || "").trim();
  const email = (data.get("email") || "").trim();
  const phone = (data.get("phone") || "").trim();
  const service = (data.get("service") || "").trim();
  const message = (data.get("message") || "").trim();

  const subject = encodeURIComponent(`Consultation Request - ${business || name || "G&M Website Inquiry"}`);
  const body = encodeURIComponent(
`Name: ${name}
Business: ${business}
Email: ${email}
Phone: ${phone}
Service: ${service}

Goal / Request:
${message}`
  );

  formSuccess.textContent = "Your email app will open with the consultation request prepared for G&M Business Solutions.";
  window.location.href = `mailto:gnmbusinesses@gmail.com?subject=${subject}&body=${body}`;
});

document.getElementById("currentYear").textContent = new Date().getFullYear();
