/* =====================================
   MIRABA | PROFILE
===================================== */

const PROFILE_KEY = "miraba_profile";
const POSTS_KEY   = "miraba_posts";

/* =====================
   データ取得
===================== */
const profile = JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
const posts   = JSON.parse(localStorage.getItem(POSTS_KEY)) || [];

/* =====================
   名前（常に表示）
===================== */
const nameEl = document.querySelector(".display-name");
if (nameEl) {
  nameEl.textContent =
    [profile.lastName, profile.firstName]
      .filter(Boolean)
      .join(" ")
      || "MIRABA User";
}

/* =====================
   アバター
===================== */
const avatarEl = document.querySelector(".avatar-circle");
if (avatarEl) {
  if (profile.avatar) {
    avatarEl.innerHTML = `<img src="${profile.avatar}" alt="avatar">`;
  } else {
    avatarEl.innerHTML = "";
  }
}

/* =====================
   年齢（公開制御あり）
===================== */
const ageEl = document.getElementById("profileAge");
if (ageEl) {
  if (!profile.birthday) {
    ageEl.textContent = "--";
  } else if (!profile.visibility?.age) {
    ageEl.textContent = "非公開";
  } else {
    const birth = new Date(profile.birthday);
    const now = new Date();

    let age = now.getFullYear() - birth.getFullYear();
    if (
      now.getMonth() < birth.getMonth() ||
      (now.getMonth() === birth.getMonth() &&
        now.getDate() < birth.getDate())
    ) {
      age--;
    }

    ageEl.textContent = `${age}歳`;
  }
}

/* =====================
   生年月日（公開制御）
===================== */
const birthdayEl = document.getElementById("profileBirthday");
if (birthdayEl) {
  if (!profile.birthday) {
    birthdayEl.textContent = "--";
  } else {
    birthdayEl.textContent =
      profile.visibility?.birthday
        ? profile.birthday
        : "非公開";
  }
}

/* =====================
   性別（公開制御）
===================== */
const genderEl = document.getElementById("profileGender");
if (genderEl) {
  genderEl.textContent =
    profile.visibility?.gender
      ? profile.gender || "--"
      : "非公開";
}

/* =====================
   住所（都道府県のみ・公開制御）
===================== */
const addressEl = document.getElementById("profileAddress");
if (addressEl) {
  if (!profile.address?.prefecture) {
    addressEl.textContent = "--";
  } else {
    addressEl.textContent =
      profile.visibility?.address
        ? profile.address.prefecture
        : "非公開";
  }
}

/* =====================
   投稿数
===================== */
const postCountEl = document.getElementById("postCount");
if (postCountEl) {
  postCountEl.textContent = posts.length;
}

/* =====================
   利用期間
===================== */
const usageEl = document.getElementById("usagePeriod");
if (usageEl) {
  if (!profile.createdAt) {
    usageEl.textContent = "--";
  } else {
    const days = Math.floor(
      (Date.now() - profile.createdAt) / 86400000
    );

    usageEl.textContent =
      days <= 0
        ? "1日"
        : days < 30
        ? `${days}日`
        : `${Math.floor(days / 30)}ヶ月`;
  }
}

/* =====================
   編集ボタン
===================== */
const editBtn = document.querySelector(".edit-button");
if (editBtn) {
  editBtn.addEventListener("click", () => {
    window.location.href = "profile-edit.html";
  });
}
