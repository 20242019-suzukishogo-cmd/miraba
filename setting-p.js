/* =====================================
   MIRABA | LOGOUT
===================================== */

document.addEventListener("DOMContentLoaded", () => {

  const logoutBtn = document.querySelector(".logout-button");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {

    const confirmLogout = confirm("ログアウトしますか？");
    if (!confirmLogout) return;

    /* =========================
       セッション削除
    ========================= */

    // MirabaUserが存在する場合
    if (typeof MirabaUser !== "undefined") {
      MirabaUser.clear?.();
      localStorage.removeItem("miraba_user");
    }

    // 一時ログインフラグ削除
    localStorage.removeItem("miraba_auth");

    /* =========================
       完全ログアウト後遷移
    ========================= */

    window.location.href = "index.html";

  });

});
