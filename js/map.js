document.addEventListener("DOMContentLoaded", () => {
  init();
});

/* =====================================
   CONSTANTS
===================================== */

const REQUEST_KEY = "miraba_requests";
const SAVED_KEY   = "miraba_saved_requests";
const CURRENT_KEY = "miraba_current_request";

/* =====================================
   REGION DATA
===================================== */

const REGION_DATA = {
  "北海道方面": ["北海道"],
  "東北": ["青森県","岩手県","宮城県","秋田県","山形県","福島県"],
  "関東": ["茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県"],
  "中部": [
    "新潟県","富山県","石川県","福井県",
    "山梨県","長野県","岐阜県","静岡県","愛知県"
  ],
  "近畿": ["三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県"],
  "中国": ["鳥取県","島根県","岡山県","広島県","山口県"],
  "四国": ["徳島県","香川県","愛媛県","高知県"],
  "九州": [
    "福岡県","佐賀県","長崎県","熊本県",
    "大分県","宮崎県","鹿児島県","沖縄県"
  ]
};

/* =====================================
   INIT
===================================== */

function init() {
  bindZipSearch();
  bindSubmit();
  initRegionFilter();
  bindFilter();
  renderRequestList();
  renderSavedPanel();
}

/* =====================================
   FILTER + RENDER
===================================== */

function renderRequestList() {

  const list = document.querySelector(".request-list");
  if (!list) return;

  list.innerHTML = "";

  let requests = getRequests();

  /* ===== TYPE FILTER ===== */

  const typeFilter =
    document.querySelector('select[name="filter-type"]')?.value;

  if (typeFilter && typeFilter !== "すべて") {
    requests = requests.filter(r => r.type === typeFilter);
  }

  /* ===== LOCATION FILTER ===== */

  const region =
    document.getElementById("filter-region")?.value;

  const pref =
    document.getElementById("filter-pref")?.value;

  // ① 都道府県まで選択
  if (pref) {
    requests = requests.filter(r => r.prefecture === pref);
  }

  // ② 方面のみ選択
  else if (region) {
    const targetPrefs = REGION_DATA[region] || [];
    requests = requests.filter(r =>
      targetPrefs.includes(r.prefecture)
    );
  }

  /* ===== RENDER ===== */

  requests.forEach(req => {
    list.appendChild(createRequestItem(req, true));
  });
}

/* =====================================
   FILTER BIND
===================================== */

function bindFilter() {

  const selects = document.querySelectorAll(".request-filter select");

  selects.forEach(select => {
    select.addEventListener("change", renderRequestList);
  });
}

/* =====================================
   ZIP SEARCH
===================================== */

function bindZipSearch() {

  const zipInput   = document.querySelector(".address-zip");
  const zipBtn     = document.querySelector(".zip-search-btn");
  const prefSelect = document.querySelector(".address-pref");
  const cityInput  = document.querySelector(".address-city");

  zipBtn?.addEventListener("click", () => {

    const zip = zipInput.value.replace(/[^0-9]/g, "");
    if (zip.length !== 7) return;

    fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`)
      .then(res => res.json())
      .then(data => {

        if (!data.results) return;

        const r = data.results[0];
        prefSelect.value = r.address1;
        cityInput.value  = r.address2 + r.address3;

      })
      .catch(() => {
        console.warn("郵便番号検索に失敗しました");
      });
  });
}

/* =====================================
   STORAGE
===================================== */

function getRequests() {
  return JSON.parse(localStorage.getItem(REQUEST_KEY)) || [];
}

function setRequests(data) {
  localStorage.setItem(REQUEST_KEY, JSON.stringify(data));
}

function getSaved() {
  return JSON.parse(localStorage.getItem(SAVED_KEY)) || [];
}

function setSaved(data) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(data));
}

/* =====================================
   REQUEST SUBMIT
===================================== */

function bindSubmit() {

  const btn = document.querySelector(".request-submit");
  if (!btn) return;

  btn.addEventListener("click", () => {

    const user = MirabaUser.get();
    const requests = getRequests();

    const dates = document.querySelectorAll('input[type="date"]');
    const textareas = document.querySelectorAll(".request-form textarea");
    const selects = document.querySelectorAll(".request-form select");

    const newRequest = {
      id: "req_" + Date.now(),

      userId: user.id || "guest_default",
      userName: user.name,
      userAvatar: user.avatar || null,

      startDate: dates[0]?.value || "",
      endDate: dates[1]?.value || "",

      prefecture: document.querySelector(".address-pref")?.value || "",
      city: document.querySelector(".address-city")?.value || "",
      detailAddress: document.querySelector(".address-detail")?.value || "",

      type: selects[selects.length - 1]?.value || "",
      summary: textareas[0]?.value || "",
      note: textareas[1]?.value || "",

      lat: null,
      lng: null,

      status: "open",
      createdAt: Date.now()
    };

    requests.unshift(newRequest);
    setRequests(requests);

    clearForm();
    renderRequestList();
    renderSavedPanel();
  });
}

/* =====================================
   CLEAR FORM
===================================== */

function clearForm() {
  document.querySelectorAll(".request-form input").forEach(i => i.value = "");
  document.querySelectorAll(".request-form textarea").forEach(t => t.value = "");
}

/* =====================================
   SAVED PANEL
===================================== */

function renderSavedPanel() {

  const savedList = document.querySelector(".saved-left-list");
  const ownList   = document.querySelector(".saved-own-list");

  if (!savedList || !ownList) return;

  savedList.innerHTML = "";
  ownList.innerHTML   = "";

  const requests = getRequests();
  const savedIds = getSaved();
  const currentUser = MirabaUser.get();

  const savedRequests = requests.filter(r => savedIds.includes(r.id));
  const ownRequests   = requests.filter(r => r.userId === currentUser.id);

  if (savedRequests.length === 0) {
    savedList.innerHTML = `<li class="saved-empty">保存したREQUESTはありません</li>`;
  } else {
    savedRequests.forEach(req => {
      savedList.appendChild(createRequestItem(req));
    });
  }

  if (ownRequests.length === 0) {
    ownList.innerHTML = `<li class="saved-empty">自分のREQUESTはありません</li>`;
  } else {
    ownRequests.forEach(req => {
      ownList.appendChild(createRequestItem(req));
    });
  }
}

/* =====================================
   REQUEST ITEM
===================================== */

function createRequestItem(req, showButton = false) {

  const li = document.createElement("li");
  li.className = "request-item";
  li.dataset.requestId = req.id;

  const statusLabel =
    req.status === "archived"
      ? `<span class="request-status archived">終了済み</span>`
      : "";

  const button =
    showButton
      ? `<button class="request-check">確認する</button>`
      : "";

  li.innerHTML = `
    <div class="request-left">
      <div class="request-user-icon"></div>
      <span class="request-user-name">${req.userName}</span>
    </div>
    <span class="request-date">${formatDate(req.createdAt)}</span>
    ${button}
    ${statusLabel}
  `;

  if (showButton) {
    li.querySelector(".request-check").addEventListener("click", e => {
      e.stopPropagation();
      localStorage.setItem(CURRENT_KEY, req.id);
      location.href = "map-detail.html";
    });
  }

  li.addEventListener("click", () => {
    localStorage.setItem(CURRENT_KEY, req.id);
    location.href = "map-detail.html";
  });

  return li;
}

function initRegionFilter() {

  const modeSelect   = document.getElementById("filter-location-mode");
  const regionSelect = document.getElementById("filter-region");
  const prefSelect   = document.getElementById("filter-pref");

  if (!modeSelect || !regionSelect || !prefSelect) {
    console.warn("Region filter elements not found");
    return;
  }

  /* ===== 方面初期化 ===== */

  regionSelect.innerHTML = `<option value="">方面を選択</option>`;

  Object.keys(REGION_DATA).forEach(region => {
    const opt = document.createElement("option");
    opt.value = region;
    opt.textContent = region;
    regionSelect.appendChild(opt);
  });

  /* ===== モード変更 ===== */

  modeSelect.addEventListener("change", () => {

    regionSelect.classList.add("is-hidden");
    prefSelect.classList.add("is-hidden");

    if (modeSelect.value === "region") {
      regionSelect.classList.remove("is-hidden");
    }

    renderRequestList();
  });

  /* ===== 方面選択 ===== */

  regionSelect.addEventListener("change", () => {

    prefSelect.innerHTML = `<option value="">都道府県を選択</option>`;

    if (!regionSelect.value) {
      prefSelect.classList.add("is-hidden");
      renderRequestList();
      return;
    }

    const prefs = REGION_DATA[regionSelect.value] || [];

    prefs.forEach(pref => {
      const opt = document.createElement("option");
      opt.value = pref;
      opt.textContent = pref;
      prefSelect.appendChild(opt);
    });

    prefSelect.classList.remove("is-hidden");
    renderRequestList();
  });

  /* ===== 都道府県選択 ===== */

  prefSelect.addEventListener("change", () => {
    renderRequestList();
  });
}

/* =====================================
   UTIL
===================================== */

function formatDate(ts) {
  if (!ts) return "-";
  const d = new Date(ts);
  return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;
};

const newRequest = {
  id: "req_" + Date.now(),

  zipcode: document.querySelector(".address-zip")?.value || "",

  userId: user.id || "guest_default",
  userName: user.name,
  userAvatar: user.avatar || null,

  startDate: dates[0]?.value || "",
  endDate: dates[1]?.value || "",

  prefecture: document.querySelector(".address-pref")?.value || "",
  city: document.querySelector(".address-city")?.value || "",
  detailAddress: document.querySelector(".address-detail")?.value || "",

  type: selects[selects.length - 1]?.value || "",
  summary: textareas[0]?.value || "",
  note: textareas[1]?.value || "",

  lat: null,
  lng: null,

  status: "open",
  createdAt: Date.now()
};
