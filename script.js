document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    height: '100%',
    expandRows: true,
    fixedWeekCount: true,
    headerToolbar: false // hide default buttons
  });
  calendar.render();

  // Sidebar month navigation
  document.getElementById('prevMonth').onclick = () => { calendar.prev(); loadCanvas(); };
  document.getElementById('nextMonth').onclick = () => { calendar.next(); loadCanvas(); };

  const canvas = document.getElementById('drawCanvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    loadCanvas(); // reload saved notes after resizing
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  canvas.style.touchAction = 'none';

  let drawing = false;
  let penColor = 'black';
  let penSize = 2;
  let erasing = false;

  // Sidebar color buttons
  document.getElementById('color1').onclick = () => setPen('red');
  document.getElementById('color2').onclick = () => setPen('blue');
  document.getElementById('color3').onclick = () => setPen('green');
  document.getElementById('color4').onclick = () => setPen('orange');
  document.getElementById('color5').onclick = () => setPen('purple');
  document.getElementById('eraser').onclick = () => setEraser();
  document.getElementById('clearAll').onclick = () => clearCanvas();

  function setPen(color) {
    erasing = false;
    ctx.globalCompositeOperation = 'source-over';
    penColor = color;
  }

  function setEraser() {
    erasing = true;
    ctx.globalCompositeOperation = 'destination-out';
  }

  function getStorageKey() {
    // Save per month (e.g., "calendarDrawing-2025-08")
    const date = calendar.getDate();
    return 'calendarDrawing-' + date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
  }

  function saveCanvas() {
    try {
      localStorage.setItem(getStorageKey(), canvas.toDataURL());
    } catch (e) {
      console.warn("Could not save canvas:", e);
    }
  }

  function loadCanvas() {
    const dataURL = localStorage.getItem(getStorageKey());
    if (dataURL) {
      const img = new Image();
      img.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = dataURL;
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    localStorage.removeItem(getStorageKey());
  }

  canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'pen' && e.pressure === 0) return;
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(getX(e), getY(e));
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    if (e.pointerType === 'pen' && e.pressure === 0) return;
    ctx.lineWidth = erasing ? penSize * 8 : penSize * (e.pressure > 0 ? e.pressure * 2 : 1);
    ctx.lineCap = 'round';
    ctx.strokeStyle = erasing ? 'rgba(0,0,0,1)' : penColor;
    ctx.lineTo(getX(e), getY(e));
    ctx.stroke();
  });

  canvas.addEventListener('pointerup', stopDraw);
  canvas.addEventListener('pointercancel', stopDraw);

  function stopDraw() {
    if (!drawing) return;
    drawing = false;
    ctx.closePath();
    saveCanvas(); // auto-save when you finish drawing
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
