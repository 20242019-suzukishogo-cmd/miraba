document.addEventListener("DOMContentLoaded", () => {

  const loginBtn = document.getElementById("loginBtn");

  // ===============================
  // LOGIN
  // ===============================
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {

      const email = document.getElementById("email")?.value;
      const pass  = document.getElementById("password")?.value;

      if (!email || !pass) {
        alert("メールアドレスとパスワードを入力してください");
        return;
      }

      // 仮ログイン（後でFirebaseに差し替え）
      localStorage.setItem("miraba_login", "google");
      localStorage.setItem("miraba_user", email);

      window.location.href = "index.html";
    });
  }

  // ===============================
  // AUTH CHECK（全ページ共通）
  // ===============================
  const isLoginPage = location.pathname.includes("login.html");
  const isLoggedIn  = localStorage.getItem("miraba_login");

  if (!isLoggedIn && !isLoginPage) {
    location.href = "login.html";
  }

});
