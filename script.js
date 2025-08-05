document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  // FullCalendar setup
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    height: '100%',
    expandRows: true,
    fixedWeekCount: true,
    headerToolbar: false // remove header buttons (today/next/prev)
  });

  calendar.render();

  // Drawing setup
  const canvas = document.getElementById('drawCanvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
  canvas.width = canvas.clientWidth * window.devicePixelRatio;
  canvas.height = canvas.clientHeight * window.devicePixelRatio;
  canvas.style.width = canvas.clientWidth + "px";
  canvas.style.height = canvas.clientHeight + "px";
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas(); // call AFTER calendar renders

  let drawing = false;
  let penColor = 'black';
  let penSize = 2;

  // Disable touch gestures (like pinch/zoom) on iPad
  canvas.style.touchAction = 'none';

  // Use pointer events (works with mouse, touch, and Apple Pencil)
  canvas.addEventListener('pointerdown', startDraw);
  canvas.addEventListener('pointermove', draw);
  canvas.addEventListener('pointerup', stopDraw);
  canvas.addEventListener('pointercancel', stopDraw);

  function startDraw(e) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(getX(e), getY(e));
  }

  function draw(e) {
    if (!drawing) return;
    ctx.lineWidth = penSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = penColor;
    ctx.lineTo(getX(e), getY(e));
    ctx.stroke();
  }

  function stopDraw() {
    drawing = false;
    ctx.closePath();
  }

  function getX(e) {
    const rect = canvas.getBoundingClientRect();
    return e.clientX - rect.left;
  }

  function getY(e) {
    const rect = canvas.getBoundingClientRect();
    return e.clientY - rect.top;
  }
});

