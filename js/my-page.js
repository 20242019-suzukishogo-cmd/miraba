/* =====================================
   MIRABA | MY PAGE
   Controller（FINAL）
===================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     USER DISPLAY
     - プロフィール正本参照
  =============================== */

  const user = getMirabaUser();

  const nameEl = document.querySelector(".my-user-name");
  if (nameEl) nameEl.textContent = user.name;

  const iconEl = document.querySelector(".my-user-icon");
  if (iconEl && user.avatar) {
    iconEl.innerHTML = `<img src="${user.avatar}" alt="">`;
  }

  /* ===============================
     TAB CONTROLLER
     - 投稿 / いいね
  =============================== */

  const tabButtons   = document.querySelectorAll(".tab-button");
  const slideWrapper = document.querySelector(".slide-wrapper");

  let tabIndex = 0;

  if (slideWrapper && tabButtons.length) {

    slideWrapper.style.display = "flex";
    slideWrapper.style.transition = "transform 0.45s ease";

    const updateTab = () => {
      slideWrapper.style.transform =
        `translateX(-${tabIndex * 100}%)`;

      tabButtons.forEach((btn, i) => {
        btn.classList.toggle("active", i === tabIndex);
      });
    };

    tabButtons.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        if (tabIndex === i) return;
        tabIndex = i;
        updateTab();
      });
    });

    updateTab();
  }

  /* ===============================
     POST DATA
  =============================== */

  const posts =
    JSON.parse(localStorage.getItem("miraba_posts")) || [];

  const emptyState =
    document.querySelector(".empty-state");

  const emptyImageState =
    document.querySelector(".empty-image-state");

  const postArea =
    document.querySelector(".my-post-list");

  if (!postArea) return;

  postArea.innerHTML = "";

  if (posts.length === 0) {
    if (emptyState) emptyState.hidden = false;
    if (emptyImageState) emptyImageState.hidden = false;
    return;
  }

  if (emptyState) emptyState.hidden = true;
  if (emptyImageState) emptyImageState.hidden = true;

  /* ===============================
     POST CARD RENDER
  =============================== */

  posts.forEach(post => {

    const card = document.createElement("article");
    card.className = "post-card";

    card.innerHTML = `
      <div class="post-user">
        <div class="user-icon">
          ${post.user?.avatar ? `<img src="${post.user.avatar}" alt="">` : ""}
        </div>
        <span class="user-name">
          ${post.user?.name || "MIRABA User"}
        </span>
      </div>

      <p class="post-text">${post.text}</p>

      ${
        post.images && post.images.length
          ? `<div class="post-image-frame image-post"
               data-images='${JSON.stringify(post.images)}'>
               <img src="${post.images[0]}">
             </div>`
          : ""
      }
    `;

    postArea.appendChild(card);
  });

  /* ===============================
     IMAGE OVERLAY & SLIDER
  =============================== */

  const overlay = document.querySelector(".image-overlay");
  if (!overlay) return;

  const track     = overlay.querySelector(".overlay-image-track");
  const prevBtn   = overlay.querySelector(".slide-nav.prev");
  const nextBtn   = overlay.querySelector(".slide-nav.next");
  const closeBtn  = overlay.querySelector(".overlay-close");
  const currentEl = overlay.querySelector(".slide-indicator .current");
  const totalEl   = overlay.querySelector(".slide-indicator .total");

  let currentIndex = 0;
  let images = [];

  const updateArrowVisibility = () => {
    const multi = images.length > 1;
    if (prevBtn) prevBtn.style.display = multi ? "" : "none";
    if (nextBtn) nextBtn.style.display = multi ? "" : "none";
  };

  const updateSlide = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    if (currentEl) currentEl.textContent = currentIndex + 1;

    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === images.length - 1;
  };

  const openOverlay = (imageList) => {
    if (!Array.isArray(imageList) || imageList.length === 0) return;

    images = imageList;
    currentIndex = 0;
    track.innerHTML = "";

    images.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      track.appendChild(img);
    });

    if (totalEl) totalEl.textContent = images.length;

    updateArrowVisibility();
    updateSlide();

    overlay.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const closeOverlay = () => {
    overlay.hidden = true;
    document.body.style.overflow = "";
  };

  prevBtn?.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlide();
    }
  });

  nextBtn?.addEventListener("click", () => {
    if (currentIndex < images.length - 1) {
      currentIndex++;
      updateSlide();
    }
  });

  closeBtn?.addEventListener("click", closeOverlay);

  document.querySelectorAll(".image-post").forEach(post => {
    post.addEventListener("click", () => {
      try {
        const imageList = JSON.parse(post.dataset.images);
        openOverlay(imageList);
      } catch {
        console.warn("Invalid image data:", post.dataset.images);
      }
    });
  });

});
