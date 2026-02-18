// auth-guard.js
document.addEventListener("DOMContentLoaded", () => {

  // loginページではガードを無効化
  if (location.pathname.includes("login.html")) return;

  const isLogin = localStorage.getItem("miraba_login");

  if (!isLogin) {
    location.href = "/miraba/login.html";
  }

});
