document.addEventListener("DOMContentLoaded", () => {

  const yearEl  = document.querySelector(".cal-year");
  const monthEl = document.querySelector(".cal-month");
  const datesEl = document.querySelector(".cal-dates");

  const prevYearBtn  = document.querySelector(".btn-prev-year");
  const prevMonthBtn = document.querySelector(".btn-prev-month");
  const nextMonthBtn = document.querySelector(".btn-next-month");
  const nextYearBtn  = document.querySelector(".btn-next-year");

  let current = new Date();

  function renderCalendar(){

    const year  = current.getFullYear();
    const month = current.getMonth();

    yearEl.textContent  = year;
    monthEl.textContent = String(month + 1).padStart(2, "0");

    datesEl.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    for(let i = 0; i < firstDay; i++){
      const empty = document.createElement("div");
      empty.className = "cal-empty";
      datesEl.appendChild(empty);
    }

    for(let d = 1; d <= lastDate; d++){
      const cell = document.createElement("div");
      cell.className = "cal-date";
      cell.textContent = d;

      if(
        d === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      ){
        cell.classList.add("today");
      }

      if(d === 5 || d === 15 || d === 23){
        cell.classList.add("event");
        const label = document.createElement("span");
        label.textContent = "EVENT";
        cell.appendChild(label);
      }

      datesEl.appendChild(cell);
    }
  }

  prevMonthBtn.addEventListener("click", () => {
    current.setMonth(current.getMonth() - 1);
    renderCalendar();
  });

  nextMonthBtn.addEventListener("click", () => {
    current.setMonth(current.getMonth() + 1);
    renderCalendar();
  });

  prevYearBtn.addEventListener("click", () => {
    current.setFullYear(current.getFullYear() - 1);
    renderCalendar();
  });

  nextYearBtn.addEventListener("click", () => {
    current.setFullYear(current.getFullYear() + 1);
    renderCalendar();
  });

  renderCalendar();
});
