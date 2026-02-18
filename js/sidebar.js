document.addEventListener("DOMContentLoaded", () => {

  const menuBtn   = document.getElementById("menu-toggle");
  const sidebar   = document.querySelector(".sidebar");
  const overlay   = document.querySelector(".sidebar-overlay");

  if (!menuBtn || !sidebar || !overlay) return;

  /* ===============================
     OPEN / CLOSE
  =============================== */

  function openMenu(){
    sidebar.classList.add("open");
    overlay.classList.add("active");
    document.body.classList.add("menu-open");
  }

  function closeMenu(){
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
    document.body.classList.remove("menu-open");
  }

  function toggleMenu(){
    sidebar.classList.contains("open") ? closeMenu() : openMenu();
  }

  /* ===============================
     EVENTS
  =============================== */

  menuBtn.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", closeMenu);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && sidebar.classList.contains("open")) {
      closeMenu();
    }
  });

  /* ===============================
     PAGE TRANSITION
  =============================== */

  document.addEventListener("click", e => {
    const item = e.target.closest("[data-page]");
    if (!item) return;

    const page = item.dataset.page;
    if (!page) return;

    closeMenu();

    setTimeout(() => {
      window.location.href = page;
    }, 250);
  });

});
