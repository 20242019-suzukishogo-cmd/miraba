document.addEventListener("DOMContentLoaded", () => {

  const input  = document.getElementById("faqInput");
  const submit = document.getElementById("faqSubmit");
  const list   = document.querySelector(".faq-list");

  if(!list) return;

  /* ===============================
     FAQ 開閉処理
  =============================== */

  function setupFaqToggle(target = document){
    const questions = target.querySelectorAll(".faq-question");

    questions.forEach(q => {
      q.addEventListener("click", () => {
        q.classList.toggle("open");
        q.nextElementSibling?.classList.toggle("open");
      });
    });
  }

  setupFaqToggle();

  /* ===============================
     FAQ 送信処理
  =============================== */

  if(input && submit){
    submit.addEventListener("click", () => {

      const text = input.value.trim();
      if(text === "") return;

      const item = document.createElement("div");
      item.className = "faq-item";

      item.innerHTML = `
        <button class="faq-question">${text}</button>
        <div class="faq-answer"></div>
      `;

      list.prepend(item);
      setupFaqToggle(item); // ← 追加分にも開閉付与
      input.value = "";
    });
  }

});
