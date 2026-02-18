/* =====================================
   MIRABA | UP（STABLE FINAL）
===================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     USER
  =============================== */

  const user = MirabaUser.get();

  const nameEl = document.querySelector(".up-user-name");
  const iconEl = document.querySelector(".up-user-icon");

  if (nameEl) nameEl.textContent = user.name || "MIRABA User";
  if (iconEl && user.avatar) {
    iconEl.innerHTML = `<img src="${user.avatar}" alt="">`;
  }

  /* ===============================
     IMAGE SELECT / PREVIEW
  =============================== */

  const fileInput = document.getElementById("image-input");
  const wrapper   = document.querySelector(".up-image-wrapper");
  const imageEl   = wrapper?.querySelector("img");
  const prevBtn   = wrapper?.querySelector(".prev");
  const nextBtn   = wrapper?.querySelector(".next");

  let images = [];
  let currentIndex = 0;

  fileInput?.addEventListener("change", () => {
    images = Array.from(fileInput.files || []);
    if (!images.length) return;

    currentIndex = 0;
    wrapper.classList.remove("is-hidden");
    renderImage();
  });

  function renderImage() {
    const file = images[currentIndex];
    if (!file || !imageEl) return;

    const reader = new FileReader();
    reader.onload = () => imageEl.src = reader.result;
    reader.readAsDataURL(file);

    const multi = images.length > 1;
    if (prevBtn) prevBtn.style.visibility = multi ? "visible" : "hidden";
    if (nextBtn) nextBtn.style.visibility = multi ? "visible" : "hidden";
  }

  prevBtn?.addEventListener("click", () => {
    if (images.length <= 1) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    renderImage();
  });

  nextBtn?.addEventListener("click", () => {
    if (images.length <= 1) return;
    currentIndex = (currentIndex + 1) % images.length;
    renderImage();
  });

  /* ===============================
     POST SAVE（← これが消えてた）
  =============================== */

  const submitBtn = document.querySelector(".up-submit-button");
  const textarea  = document.querySelector(".up-textarea");

  submitBtn?.addEventListener("click", () => {
    const text = textarea.value.trim();
    if (!text && images.length === 0) return;

    const post = {
      id: crypto.randomUUID(),
      user: {
        name: user.name || "MIRABA User",
        avatar: user.avatar || null
      },
      text,
      images: [],
      createdAt: Date.now()
    };

    if (!images.length) {
      savePost(post);
      return;
    }

    Promise.all(
      images.map(file =>
        new Promise(resolve => {
          const r = new FileReader();
          r.onload = () => resolve(r.result);
          r.readAsDataURL(file);
        })
      )
    ).then(imgs => {
      post.images = imgs;
      savePost(post);
    });
  });

  function savePost(post) {
    const posts =
      JSON.parse(localStorage.getItem("miraba_posts")) || [];

    posts.unshift(post);
    localStorage.setItem("miraba_posts", JSON.stringify(posts));

    // reset
    textarea.value = "";
    images = [];
    currentIndex = 0;
    wrapper?.classList.add("is-hidden");

    // TOPへ戻る
    document.querySelector('[data-page="index.html"]')?.click();
  }
});
