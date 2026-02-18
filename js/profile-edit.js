/* =====================================
   MIRABA | PROFILE EDIT FINAL
===================================== */

const STORAGE_KEY = "miraba_profile";

/* =====================
   初期ロード
===================== */

let savedProfile =
  JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

/* 初期構造保証 */
savedProfile.visibility = savedProfile.visibility || {
  gender:false,
  birthday:false,
  address:false,
  age:false
};

/* =====================
   DOM取得
===================== */

const lastNameInput  = document.getElementById("lastNameInput");
const firstNameInput = document.getElementById("firstNameInput");

const yearSel  = document.getElementById("birthYear");
const monthSel = document.getElementById("birthMonth");
const daySel   = document.getElementById("birthDay");

const genderSelect = document.getElementById("genderSelect");

const postalCode = document.getElementById("postalCode");
const prefecture = document.getElementById("prefecture");
const city       = document.getElementById("city");
const street     = document.getElementById("street");
const building   = document.getElementById("building");

const avatarEdit    = document.getElementById("avatarEdit");
const avatarInput   = document.getElementById("avatarInput");
const avatarPreview = document.getElementById("avatarPreview");

const saveButton = document.getElementById("saveProfile");

/* =====================
   入力初期反映
===================== */

lastNameInput.value  = savedProfile.lastName || "";
firstNameInput.value = savedProfile.firstName || "";
genderSelect.value   = savedProfile.gender || "";

if(savedProfile.avatar){
  avatarPreview.src = savedProfile.avatar;
}

if(savedProfile.address){
  postalCode.value = savedProfile.address.postalCode || "";
  prefecture.value = savedProfile.address.prefecture || "";
  city.value       = savedProfile.address.city || "";
  street.value     = savedProfile.address.street || "";
  building.value   = savedProfile.address.building || "";
}

/* =====================
   生年月日select生成
===================== */

const currentYear = new Date().getFullYear();

for(let y=currentYear; y>=1900; y--){
  yearSel.innerHTML += `<option value="${y}">${y}</option>`;
}
for(let m=1; m<=12; m++){
  monthSel.innerHTML += `<option value="${m}">${m}</option>`;
}
for(let d=1; d<=31; d++){
  daySel.innerHTML += `<option value="${d}">${d}</option>`;
}

if(savedProfile.birthday){
  const [y,m,d] = savedProfile.birthday.split("-");
  yearSel.value  = y;
  monthSel.value = Number(m);
  daySel.value   = Number(d);
}

/* =====================
   公開トグル
===================== */

document.querySelectorAll("[data-field]").forEach(toggle=>{
  const field = toggle.dataset.field;

  toggle.checked = savedProfile.visibility[field] || false;

  toggle.addEventListener("change",()=>{
    savedProfile.visibility[field] = toggle.checked;
  });
});

/* =====================
   アバター変更
===================== */

avatarEdit.addEventListener("click",()=>{
  avatarInput.click();
});

avatarInput.addEventListener("change",()=>{
  const file = avatarInput.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = ()=>{
    avatarPreview.src = reader.result;
  };
  reader.readAsDataURL(file);
});

/* =====================
   保存
===================== */

saveButton.addEventListener("click",()=>{

  const birthday =
    `${yearSel.value}-${monthSel.value.padStart(2,"0")}-${daySel.value.padStart(2,"0")}`;

  const fullName =
    [lastNameInput.value.trim(),firstNameInput.value.trim()]
    .filter(Boolean)
    .join(" ");

  const avatarSrc = avatarPreview.src || null;

  const profileData = {
    ...savedProfile,
    lastName:lastNameInput.value.trim(),
    firstName:firstNameInput.value.trim(),
    gender:genderSelect.value,
    birthday,
    avatar:avatarSrc,
    createdAt:savedProfile.createdAt || Date.now(),
    address:{
      postalCode:postalCode.value,
      prefecture:prefecture.value,
      city:city.value,
      street:street.value,
      building:building.value
    }
  };

  localStorage.setItem(STORAGE_KEY,JSON.stringify(profileData));

  window.location.href="profile.html";
});

postalCode.addEventListener("blur", async ()=>{

  const code = postalCode.value.replace("-","");

  if(code.length !== 7) return;

  try{
    const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${code}`);
    const data = await res.json();

    if(data.results){
      const result = data.results[0];
      prefecture.value = result.address1;
      city.value = result.address2 + result.address3;
    }
  }catch(err){
    console.log("郵便番号取得失敗");
  }
});
