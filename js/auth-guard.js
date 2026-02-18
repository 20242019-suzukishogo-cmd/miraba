// auth-guard.js
document.addEventListener("DOMContentLoaded", () => {

  // loginページではガードを無効化
  if (location.pathname.includes("login.html")) return;

  const isLogin = localStorage.getItem("miraba_login");

  if (!isLogin) {
    window.location.href = "login.html";
  }

});
