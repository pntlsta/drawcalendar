document.addEventListener('DOMContentLoaded', function() {
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
  resizeCanvas();

  let drawing = false;
  let penColor = 'black';
  let penSize = 2;

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('touchstart', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('mouseup', stopDraw);
  canvas.addEventListener('mouseleave', stopDraw);
  canvas.addEventListener('touchend', stopDraw);

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
    return e.touches ? e.touches[0].clientX - canvas.getBoundingClientRect().left : e.clientX - canvas.getBoundingClientRect().left;
  }
  function getY(e) {
    return e.touches ? e.touches[0].clientY - canvas.getBoundingClientRect().top : e.clientY - canvas.getBoundingClientRect().top;
  }
});
