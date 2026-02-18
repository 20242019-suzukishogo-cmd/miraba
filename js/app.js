// app placeholder
import { db } from "./firebase.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const postList = document.getElementById("post-list");

const q = query(
  collection(db, "posts"),
  orderBy("createdAt", "desc")
);

onSnapshot(q, snapshot => {
  postList.innerHTML = "";

  snapshot.forEach(doc => {
    const post = doc.data();

    postList.innerHTML += `
      <div class="post-card">
        <div class="post-meta">${post.authorName}</div>
        <p>${post.text}</p>
        ${post.imageUrl ? `<img src="${post.imageUrl}">` : ""}
        <button class="like-btn">❤️ ${post.likeCount || 0}</button>
      </div>
    `;
  });
});

const toggleBtn = document.getElementById("sidebar-toggle");
const sidebar = document.querySelector(".miraba-sidebar");
const main = document.querySelector(".miraba-main");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("closed");
  main.classList.toggle("full");
});
