document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  // FullCalendar setup
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    height: '100%',
    expandRows: true,
    fixedWeekCount: true,
    headerToolbar: false
  });

  calendar.render();

  const canvas = document.getElementById('drawCanvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset scale
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  canvas.style.touchAction = 'none';

  let drawing = false;
  let penColor = 'black';
  let penSize = 2;

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
