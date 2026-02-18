document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     HEADER FADE CONTROL
  =============================== */

  const header = document.querySelector(".top-header");

  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 120) {
      header.classList.add("fade-out");
    } else {
      header.classList.remove("fade-out");
    }
  });


  /* ===============================
     KEYWORD ORBIT ANIMATION
  =============================== */

  const circles = document.querySelectorAll(".keyword-circle");
  const total = circles.length;
  if (total !== 5) return;

  let index = 0;

  const radiusX = 520;
  const radiusY = 120;
  const depthZ  = 420;

  const baseSize  = 240;
  const frontSize = 320;

  const stopTime = 3000;
  const moveTime = 1800;

  function updateOrbit(){

    let maxZ = -Infinity;
    let frontCircle = null;

    circles.forEach((circle, i) => {

      const offset = (i - index + total) % total;
      const t = offset / total;
      const angle = t * Math.PI * 2 - Math.PI / 2;

      const x = Math.cos(angle) * radiusX;
      const y = Math.sin(angle) * radiusY;
      const z = -Math.sin(angle) * depthZ;

      if (z > maxZ) {
        maxZ = z;
        frontCircle = circle;
      }

      circle.style.transform = `
        translate(-50%, -50%)
        translate3d(${x}px, ${y}px, ${z}px)
      `;

      circle.style.zIndex = Math.round(1000 + z);
    });

    circles.forEach(circle => {
      const isFront = circle === frontCircle;
      const size = isFront ? frontSize : baseSize;

      circle.classList.toggle("is-front", isFront);
      circle.style.width  = `${size}px`;
      circle.style.height = `${size}px`;
    });

    setTimeout(() => {
      index = (index + 1) % total;
      updateOrbit();
    }, stopTime + moveTime);
  }

  updateOrbit();
});
