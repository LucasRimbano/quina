  // =============================
  // MODO CLARO / OSCURO (DESKTOP + MOBILE)
  // =============================
  (function () {
    const body = document.body;
    const toggleDesktop = document.getElementById("themeToggle");
    const toggleMobile = document.getElementById("themeToggleMobile");
    const KEY = "site_theme";

    function applyTheme(theme) {
      const isLight = theme === "light";
      body.classList.toggle("light-theme", isLight);

      const label = isLight ? "Modo oscuro" : "Modo claro";
      if (toggleDesktop) toggleDesktop.textContent = label;
      if (toggleMobile) toggleMobile.textContent = label;
    }

    // Estado inicial
    const saved = localStorage.getItem(KEY) || "dark";
    applyTheme(saved);

    function toggleTheme() {
      const next = body.classList.contains("light-theme") ? "dark" : "light";
      localStorage.setItem(KEY, next);
      applyTheme(next);
    }

    if (toggleDesktop) toggleDesktop.addEventListener("click", toggleTheme);
    if (toggleMobile) toggleMobile.addEventListener("click", toggleTheme);
  })();


  // =============================
  // REVEAL EN SCROLL (si usás .reveal)
  // =============================
  (function () {
    const elements = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    elements.forEach((el) => observer.observe(el));
  })();

  // =============================
  // CONTADOR SUAVE DE STATS
  // =============================
  (function () {
    const statsSection = document.getElementById("stats");
    if (!statsSection) return;

    const counters = statsSection.querySelectorAll("[data-count]");
    if (!counters.length) return;

    function animateCounter(el) {
      const target = Number(el.getAttribute("data-count")) || 0;
      let current = 0;
      const duration = 1200; // ms
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        el.textContent = value.toLocaleString("es-AR");
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            counters.forEach(animateCounter);
            obs.disconnect(); // solo una vez
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(statsSection);
  })();

  // =============================
  // SECCIÓN SERVICIO: ABRIR / CERRAR
  // (colapsa toda la sección, solo queda el botón)
  // =============================
  (function () {
    const serviceSection = document.getElementById("servicio-web");
    if (!serviceSection) return;

    const toggleBtn = serviceSection.querySelector(".service-toggle-btn");
    if (!toggleBtn) return;

    function aplicarEstadoDesdeClase() {
      const isCollapsed = serviceSection.classList.contains("is-collapsed");
      const expanded = !isCollapsed;

      toggleBtn.setAttribute("aria-expanded", String(expanded));
      toggleBtn.textContent = expanded
        ? "Ocultar información del servicio web"
        : "¿Querés una web como esta? Ver servicio";
    }

    // Estado inicial según la clase del HTML (.is-collapsed)
    aplicarEstadoDesdeClase();

    toggleBtn.addEventListener("click", () => {
      serviceSection.classList.toggle("is-collapsed");
      aplicarEstadoDesdeClase();
    });
  })();

  // =============================
  // BOTÓN VOLVER ARRIBA
  // =============================
  (function () {
    const scrollBtn = document.getElementById("scrollTopBtn");
    if (!scrollBtn) return;

    function actualizarVisibilidad() {
      const shouldShow = window.scrollY > 250; // umbral para mostrar
      scrollBtn.classList.toggle("is-visible", shouldShow);
    }

    // Mostrar/ocultar según scroll
    window.addEventListener("scroll", actualizarVisibilidad);
    actualizarVisibilidad(); // chequeo inicial

    // Scroll suave hacia arriba
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  })();

    // =============================
  // MENÚ HAMBURGUESA (MOBILE)
  // =============================
  (function () {
    const btn = document.querySelector(".hamburger-btn");
    const drawer = document.getElementById("mobileDrawer");
    const overlay = document.getElementById("mobileDrawerOverlay");
    const closeBtn = document.querySelector(".mobile-drawer-close");

    if (!btn || !drawer || !overlay || !closeBtn) return;

    function openDrawer() {
      drawer.classList.add("is-open");
      overlay.hidden = false;
      drawer.setAttribute("aria-hidden", "false");
      btn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    function closeDrawer() {
      drawer.classList.remove("is-open");
      overlay.hidden = true;
      drawer.setAttribute("aria-hidden", "true");
      btn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    btn.addEventListener("click", () => {
      const isOpen = drawer.classList.contains("is-open");
      isOpen ? closeDrawer() : openDrawer();
    });

    closeBtn.addEventListener("click", closeDrawer);
    overlay.addEventListener("click", closeDrawer);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });

    // Cerrar al tocar un link del drawer
    drawer.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) closeDrawer();
    });
  })();

  // =============================
  // ANIMACIÓN CTA CADA 5 SEGUNDOS
  // =============================
  (function () {
    const targets = [
      document.querySelector(".floating-btn.floating-instagram"),
      document.querySelector(".floating-btn.floating-whatsapp"),
      document.getElementById("scrollTopBtn"),
    ].filter(Boolean);

    if (!targets.length) return;

    function triggerAnimation() {
      targets.forEach((el) => {
        // Reinicia la animación
        el.classList.remove("is-attention");
        void el.offsetWidth; // fuerza reflow
        el.classList.add("is-attention");
      });
    }

    // Primera animación al cargar
    setTimeout(triggerAnimation, 1200);

    // Repetir cada 5 segundos
    setInterval(triggerAnimation, 5000);
  })();

  // =============================
  // HERO CAROUSEL (2 imágenes) - cada 5s
  // =============================

  (function () {
    const root = document.getElementById("heroCarousel");
    if (!root) return;

    const track = root.querySelector(".hero-carousel-track");
    const dots = Array.from(root.querySelectorAll(".dot"));
    const btnPrev = root.querySelector(".hero-carousel-btn.prev");
    const btnNext = root.querySelector(".hero-carousel-btn.next");

    let index = 0;
    const total = 2;
    const intervalMs = 5000;
    let timer = null;

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`; // FIX: 0% o 100%
      dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
    }

    function next() {
      index = (index + 1) % total;
      render();
    }

    function prev() {
      index = (index - 1 + total) % total;
      render();
    }

    function start() {
      stop();
      timer = setInterval(next, intervalMs);
    }

    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    btnNext?.addEventListener("click", () => { next(); start(); });
    btnPrev?.addEventListener("click", () => { prev(); start(); });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);

    render();
    start();
  })();


   window.addEventListener("load", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  if (!window.AOS) return;

  AOS.init({
    once: true,
    offset: 120,
    duration: 900,
    easing: "ease-out-cubic",
    disableMutationObserver: false
  });

  AOS.refreshHard();

  window.addEventListener("orientationchange", () => {
    setTimeout(() => AOS.refreshHard(), 250);
  });
});


// =============================
// HEADER BUTTONS: REPLAY CADA 10s
// =============================
(function () {
  const actions = document.querySelector(".header-actions");
  if (!actions) return;

  function replay() {
    actions.classList.remove("is-animating");
    void actions.offsetWidth; // reflow
    actions.classList.add("is-animating");
  }

  setTimeout(replay, 300);
  setInterval(replay, 10000);
})();

 document.querySelectorAll(".js-blur-go").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const url = btn.getAttribute("href");

      // reinicia animación si ya estaba
      btn.classList.remove("blur-out-expand");
      void btn.offsetWidth;

      // dispara animación
      btn.classList.add("blur-out-expand");

      setTimeout(() => {
        if (url && url.startsWith("#")) {
          const target = document.querySelector(url);
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.location.href = url;
        }

        // vuelve el botón visible para futuros clicks
        btn.classList.remove("blur-out-expand");
      }, 520);
    });
  });
