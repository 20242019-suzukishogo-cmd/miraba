function logout(){
  localStorage.removeItem("miraba_login");
  localStorage.removeItem("miraba_user");
  location.href = "login.html";
}
