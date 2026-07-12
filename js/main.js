/* ============================================================
   Sarjavex — interactions
   ============================================================ */

// ---------- Header: border after scroll ----------
const header = document.getElementById("site-header");
const onScroll = () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Mobile nav ----------
const nav = document.getElementById("nav");
const navToggle = document.getElementById("nav-toggle");
navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

// ---------- Copy email ----------
const copyBtn = document.getElementById("copy-email");
const emailText = document.getElementById("email-text");
if (copyBtn && emailText) {
  const email = emailText.textContent.trim();
  let resetTimer;
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // fallback: select-and-copy for older browsers / non-secure contexts
      const ta = document.createElement("textarea");
      ta.value = email;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    copyBtn.textContent = "✓ コピーしました";
    copyBtn.classList.add("copied");
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      copyBtn.textContent = "コピー";
      copyBtn.classList.remove("copied");
    }, 2000);
  });
}

// ---------- Contact form (FormSubmit AJAX) ----------
const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const formSubmit = document.getElementById("form-submit");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formSubmit.disabled = true;
    formSubmit.textContent = "送信中…";
    formStatus.className = "form-status";
    formStatus.textContent = "";

    try {
      const res = await fetch("https://formsubmit.co/ajax/sarjavex.official@gmail.com", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // FormSubmit returns 200 even on failure (e.g. unactivated form) — check the body
      const data = await res.json();
      if (String(data.success) !== "true") throw new Error(data.message || "submit failed");
      form.reset();
      formStatus.classList.add("ok");
      formStatus.textContent = "送信しました。ご連絡ありがとうございます。";
    } catch {
      formStatus.classList.add("ng");
      formStatus.textContent =
        "送信に失敗しました。お手数ですが下記のメールアドレス宛に直接ご連絡ください。";
    } finally {
      formSubmit.disabled = false;
      formSubmit.textContent = "送信する";
    }
  });
}

// ---------- Scroll reveal ----------
const observer = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    }
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
