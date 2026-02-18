/* =====================================
   MIRABA | Logout (UI only version)
===================================== */

document.addEventListener("DOMContentLoaded", () => {

  const logoutBtn = document.querySelector(".logout-button");

  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {

    // ユーザー情報削除
    if (typeof MirabaUser !== "undefined") {
      MirabaUser.clear();
    }

    // ローカルのログインフラグも消すなら
    localStorage.removeItem("miraba_profile");

    // ログイン画面へ
    window.location.href = "login.html";

  });

});
