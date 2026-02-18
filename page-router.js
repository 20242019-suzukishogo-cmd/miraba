// ==================================
// MIRABA Page Router（FINAL）
// data-page 属性を持つ要素の画面遷移
// ==================================

document.addEventListener("click", (e) => {
  const target = e.target.closest("[data-page]");
  if (!target) return;

  const page = target.dataset.page;
  if (!page) return;

  e.preventDefault();

  // 将来拡張用（今は使わない）
  const friendId = target.dataset.friendId;
  if (friendId) {
    sessionStorage.setItem("currentFriendId", friendId);
  }

  window.location.href = page;
}, true); // ★ capture = true（最重要）
