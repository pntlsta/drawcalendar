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
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas(); // call AFTER calendar renders

  let drawing = false;
  let penColor = 'black';
  let penSize = 2;

  // Desktop mouse events
  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDraw);
  canvas.addEventListener('mouseleave', stopDraw);

  // iPad / touch events (with preventDefault to stop scrolling)
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startDraw(e);
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    draw(e);
  }, { passive: false });

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    stopDraw(e);
  }, { passive: false });

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
    return (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  }

  function getY(e) {
    const rect = canvas.getBoundingClientRect();
    return (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  }
});
