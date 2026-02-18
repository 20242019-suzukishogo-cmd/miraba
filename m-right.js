/* =====================================
   MIRABA | RIGHT（STABLE + FINAL）
===================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     LEFT / RIGHT 切替
  =============================== */
  const leftBtn  = document.querySelector('[data-view="left"]');
  const rightBtn = document.querySelector('[data-view="right"]');
  const panel    = document.querySelector('.miraba-right-panel');

  rightBtn?.addEventListener("click", () => {
    panel.classList.add("is-active");
    document.body.classList.add("right-open");
    rightBtn.classList.add("active");
    leftBtn?.classList.remove("active");
  });

  leftBtn?.addEventListener("click", () => {
    panel.classList.remove("is-active");
    document.body.classList.remove("right-open");
    leftBtn.classList.add("active");
    rightBtn?.classList.remove("active");
  });

  /* ===============================
     DATA
  =============================== */
  const user  = MirabaUser.get();
  const posts = JSON.parse(localStorage.getItem("miraba_posts")) || [];

  const timeline = document.getElementById("timeline");
  if (!timeline) return;

  timeline.innerHTML = "";

  if (!posts.length) {
    timeline.innerHTML = `
      <div class="empty-state">
        <p class="empty-title">まだ投稿はありません</p>
      </div>
    `;
    return;
  }

  /* ===============================
     POST RENDER
  =============================== */
  posts.forEach(post => {

    if (!Array.isArray(post.comments)) post.comments = [];

    const card = document.createElement("article");
    card.className = "post-card";

    const hasText  = !!post.text?.trim();
    const hasImage = Array.isArray(post.images) && post.images.length > 0;

    card.classList.add(
      hasText && hasImage ? "has-both" :
      hasImage ? "image-only" : "text-only"
    );

    const isMyPost = post.user?.name === user.name;

    card.innerHTML = `
      <div class="post-header">
        <div class="post-user">
          <div class="user-icon">
            ${post.user?.avatar ? `<img src="${post.user.avatar}">` : ""}
          </div>
          <span class="user-name">${post.user?.name || "MIRABA User"}</span>
        </div>
        ${isMyPost ? `
          <div class="post-menu">
            <button class="edit-post">編集</button>
            <button class="delete-post">削除</button>
          </div>` : ""}
      </div>

      <div class="post-main">
        <div class="post-content">
          ${hasText ? `<p class="post-text">${post.text}</p>` : ""}
          <div class="post-actions">
            <button class="comment-btn">COMMENT</button>
          </div>
        </div>
        ${hasImage ? `<div class="post-media"><img src="${post.images[0]}"></div>` : ""}
      </div>

      <!-- ★ 表示専用（常時） -->
      <div class="comment-preview"></div>

      <!-- ★ 入力専用 -->
      <div class="comment-panel">
        <div class="comment-input">
          <input type="text" placeholder="コメントを書く">
          <button type="button">送信</button>
        </div>
      </div>
    `;

    timeline.appendChild(card);

    /* ===============================
       COMMENT（表示は preview のみ）
    =============================== */
    const openBtn = card.querySelector(".comment-btn");
    const panelEl = card.querySelector(".comment-panel");
    const preview = card.querySelector(".comment-preview");
    const input   = card.querySelector(".comment-input input");
    const sendBtn = card.querySelector(".comment-input button");

/* ===============================
   COMMENT（表示は preview のみ）
=============================== */

const MAX_VISIBLE = 5; // ← 表示したい最大行数

const renderPreview = () => {
  preview.innerHTML = "";

  post.comments
    .slice()                 // 元配列を壊さない
    .reverse()               // 新しい順（降順）
    .slice(0, MAX_VISIBLE)   // 最新 N 件だけ
    .forEach(c => {
      const item = document.createElement("div");
      item.className =
        "comment-item" + (c.user.name === user.name ? " self" : "");

      item.innerHTML = `
        <img class="comment-user-icon" src="${c.user.avatar}">
        <div class="comment-body">
          <span class="comment-user-name">${c.user.name}</span>
          <span class="comment-text">${c.text}</span>
        </div>
      `;

      preview.appendChild(item);
    });
};


    renderPreview();

    openBtn.addEventListener("click", () => {
      document
        .querySelectorAll(".comment-panel.is-open")
        .forEach(p => p.classList.remove("is-open"));

      panelEl.classList.add("is-open");
      input.focus();
    });

    sendBtn.addEventListener("click", () => {
      const text = input.value.trim();
      if (!text) return;

      post.comments.push({
        user: { name: user.name, avatar: user.avatar },
        text,
        time: Date.now()
      });

      localStorage.setItem("miraba_posts", JSON.stringify(posts));
      renderPreview();
      input.value = "";
    });

    input.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
      }
    });

    /* ===============================
       DELETE / EDIT（自分のみ）
    =============================== */
    if (isMyPost) {
      card.querySelector(".delete-post")?.addEventListener("click", () => {
        if (!confirm("本当に投稿を消去しますか？")) return;
        const newPosts = posts.filter(p => p !== post);
        localStorage.setItem("miraba_posts", JSON.stringify(newPosts));
        card.remove();
      });

      card.querySelector(".edit-post")?.addEventListener("click", () => {
        const textEl = card.querySelector(".post-text");
        if (!textEl) return;

        const textarea = document.createElement("textarea");
        textarea.className = "edit-textarea";
        textarea.value = post.text;
        textEl.replaceWith(textarea);
        textarea.focus();

        textarea.addEventListener("keydown", e => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            post.text = textarea.value.trim();
            localStorage.setItem("miraba_posts", JSON.stringify(posts));
            textarea.replaceWith(Object.assign(document.createElement("p"), {
              className: "post-text",
              textContent: post.text
            }));
          }
        });
      });
    }
  });
});
