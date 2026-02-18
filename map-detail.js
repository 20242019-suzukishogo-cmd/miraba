/* =====================================
   MIRABA | MAP DETAIL FINAL CLEAN
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  initDetail();
});

/* =====================================
   CONSTANT
===================================== */

const REQUEST_KEY = "miraba_requests";
const SAVED_KEY   = "miraba_saved_requests";
const CURRENT_KEY = "miraba_current_request";
const USER_KEY    = "miraba_user";

/* =====================================
   INIT
===================================== */

function initDetail() {

  bindBackButton();

  const request = getCurrentRequest();
  if (!request) return;

  renderDetail(request);
  bindSaveButton(request);
  setupOwnerControls(request);
  initMap(request);
}

/* =====================================
   GET CURRENT REQUEST
===================================== */

function getCurrentRequest() {
  const id = localStorage.getItem(CURRENT_KEY);
  if (!id) return null;

  const requests = getRequests();
  return requests.find(r => r.id === id);
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

/* =====================================
   RENDER
===================================== */

function renderDetail(req) {

  setText(".detail-user-name", req.userName);

  setField("date", formatDate(req.createdAt));

  setField(
    "location",
    `${req.prefecture || ""} ${req.city || ""} ${req.detailAddress || ""}`
  );

  setField("type", req.type);
  setField("summary", req.summary);
  setField("note", req.note);
}

function setField(fieldName, value) {
  const el = document.querySelector(`[data-field="${fieldName}"]`);
  if (el) el.textContent = value || "-";
}

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value || "-";
}

/* =====================================
   SAVE BUTTON
===================================== */

function bindSaveButton(req) {

  const saveBtn = document.querySelector(".request-save-btn");
  if (!saveBtn) return;

  const currentUser = JSON.parse(localStorage.getItem(USER_KEY)) || {};

  if (req.userId === currentUser.id) {
    saveBtn.style.display = "none";
    return;
  }

  updateSaveButtonUI(req.id);

  saveBtn.addEventListener("click", () => {

    let saved = JSON.parse(localStorage.getItem(SAVED_KEY)) || [];

    if (saved.includes(req.id)) {
      saved = saved.filter(id => id !== req.id);
    } else {
      saved.push(req.id);
    }

    localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
    updateSaveButtonUI(req.id);
  });
}

function updateSaveButtonUI(id) {

  const saveBtn = document.querySelector(".request-save-btn");
  if (!saveBtn) return;

  const saved = JSON.parse(localStorage.getItem(SAVED_KEY)) || [];

  if (saved.includes(id)) {
    saveBtn.textContent = "保存済み";
    saveBtn.classList.add("is-saved");
  } else {
    saveBtn.textContent = "保存";
    saveBtn.classList.remove("is-saved");
  }
}

/* =====================================
   OWNER CONTROL
===================================== */

function setupOwnerControls(req) {

  const currentUser = JSON.parse(localStorage.getItem(USER_KEY)) || {};
  if (req.userId !== currentUser.id) return;

  showArchiveButton(req);
}

function showArchiveButton(req) {

  const footer = document.querySelector(".detail-footer");
  if (!footer) return;

  const archiveBtn = document.createElement("button");
  archiveBtn.textContent = "REQUESTを取り下げる";
  archiveBtn.className = "detail-archive-btn";

  footer.appendChild(archiveBtn);

  archiveBtn.addEventListener("click", () => {

    const requests = getRequests();
    const index = requests.findIndex(r => r.id === req.id);
    if (index === -1) return;

    requests[index].status = "archived";
    setRequests(requests);

    location.href = "map.html";
  });
}

/* =====================================
   BACK BUTTON
===================================== */

function bindBackButton() {

  const backBtn = document.querySelector(".back-btn");
  if (!backBtn) return;

  backBtn.addEventListener("click", () => {
    location.href = "map.html";
  });
}

/* =====================================
   JAPAN GEOCODE (ZIP → ADDRESS → LATLNG)
===================================== */

async function geocodeAddress(req) {

  /* ===============================
     ① 郵便番号優先
  =============================== */

  const zip = (req.zipcode || "").replace(/-/g, "");

  if (zip && zip.length === 7) {

    console.log("ZIP Searching:", zip);

    try {
      const zipRes = await fetch(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`
      );

      const zipData = await zipRes.json();

      if (zipData.status === 200 && zipData.results) {

        const r = zipData.results[0];

        const fullAddress =
          r.address1 + r.address2 + r.address3;

        console.log("ZIP → Address:", fullAddress);

        const result = await fetchNominatim(fullAddress);
        if (result) return result;
      }

    } catch (e) {
      console.warn("Zipcloud error:", e);
    }
  }

  /* ===============================
     ② 住所直接検索
  =============================== */

const address =
  `${req.prefecture || ""}${req.city || ""}${req.detailAddress || ""}`;

  console.log("Address Searching:", address);

  return await fetchNominatim(address);
}


/* =====================================
   NOMINATIM
===================================== */

async function fetchNominatim(address) {

  if (!address) return null;

  // ★ 札幌強化検索
  const query = address.replace(/-/g, " ");

  const url =
    `https://nominatim.openstreetmap.org/search?` +
    `format=json` +
    `&countrycodes=jp` +
    `&limit=1` +
    `&addressdetails=1` +
    `&q=${encodeURIComponent(query)}`;

  try {

    const res = await fetch(url, {
      headers: {
        "Accept-Language": "ja",
        "User-Agent": "miraba-app"
      }
    });

    const data = await res.json();

    if (!data || data.length === 0) {
      console.warn("Nominatim no result");
      return null;
    }

    console.log("Nominatim success:", data[0].display_name);

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };

  } catch (e) {
    console.warn("Nominatim error:", e);
    return null;
  }
}

/* =====================================
   NORMALIZE
===================================== */

function normalizeAddress(str) {
  return str
    .replace(/[一二三四五六七八九]/g, s =>
      "一二三四五六七八九".indexOf(s) + 1
    )
    .replace(/丁目/g, "-")
    .replace(/番地/g, "-")
    .replace(/番/g, "-")
    .replace(/号/g, "")
    .trim();
}

/* =====================================
   FETCH
===================================== */

async function fetchGeocode(address) {

  const url =
    `https://nominatim.openstreetmap.org/search?` +
    `format=json&countrycodes=jp&limit=1&q=${encodeURIComponent(address)}`;

  try {

    const res = await fetch(url, {
      headers: { "Accept-Language": "ja" }
    });

    const data = await res.json();
    if (!data || data.length === 0) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };

  } catch (e) {
    console.warn("Geocode error:", e);
    return null;
  }
}

/* =====================================
   UTIL
===================================== */

function formatDate(ts) {
  if (!ts) return "-";
  const d = new Date(ts);
  return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;
}

/* =====================================
   MAP INITIALIZE
===================================== */

async function initMap(req) {

  if (!req) return;

  let lat = req.lat;
  let lng = req.lng;

  /* 座標がなければジオコーディング */
  if (!lat || !lng) {

    const result = await geocodeAddress(req);

    if (result) {
      lat = result.lat;
      lng = result.lng;

      // 保存
      const requests = getRequests();
      const index = requests.findIndex(r => r.id === req.id);

      if (index !== -1) {
        requests[index].lat = lat;
        requests[index].lng = lng;
        setRequests(requests);
      }
    }
  }

  /* fallback */
  if (!lat || !lng) {
    console.warn("Geocode failed → fallback 東京駅");
    lat = 35.6812;
    lng = 139.7671;
  }

  /* MAP生成 */
  const map = L.map("real-map").setView([lat, lng], 16);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  L.marker([lat, lng]).addTo(map);
}
