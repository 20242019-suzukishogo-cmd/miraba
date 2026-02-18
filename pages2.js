document.addEventListener("DOMContentLoaded", () => {

  const circles = document.querySelectorAll("#page2 .keyword-circle");
  if(circles.length !== 5) return;

  let index = 0;
  const total = circles.length;

  const radiusX = 420;
  const radiusY = 90;
  const depthZ  = 300;

  const baseSize  = 200;
  const frontSize = 280;

  const stopTime = 3000;
  const moveTime = 1800;

  function animate(){

    let maxZ = -9999;
    let front = null;

    circles.forEach((circle, i) => {

      const t = ((i - index + total) % total) / total;
      const angle = t * Math.PI * 2 - Math.PI / 2;

      const x = Math.cos(angle) * radiusX;
      const y = Math.sin(angle) * radiusY;
      const z = -Math.sin(angle) * depthZ;

      circle.style.transform = `
        translate(-50%, -50%)
        translate3d(${x}px, ${y}px, ${z}px)
      `;

      circle.style.zIndex = Math.round(1000 + z);

      if(z > maxZ){
        maxZ = z;
        front = circle;
      }
    });

    circles.forEach(circle => {
      const isFront = circle === front;
      circle.style.width  = isFront ? `${frontSize}px` : `${baseSize}px`;
      circle.style.height = isFront ? `${frontSize}px` : `${baseSize}px`;
      circle.style.opacity = isFront ? 1 : 0.6;
    });

    setTimeout(() => {
      index = (index + 1) % total;
      animate();
    }, stopTime + moveTime);
  }

  animate();
});
