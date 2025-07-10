const socket = io();

const timerEl = document.getElementById('timer');
const timerScreen = document.getElementById('timerScreen');
const setup = document.getElementById('setup');
const stopBtn = document.getElementById('stop');

let intervalId = null;


socket.on('timer_state', ({ duration, startTime }) => {
  if (duration > 0 && startTime) {
    setup.style.display = 'none';
    timerScreen.style.display = 'flex';

    if (intervalId) clearInterval(intervalId);

    function tick() {
      const now = Date.now();
      let remaining = Math.round((duration * 1000 - (now - startTime)) / 1000);
      if (remaining < 0) remaining = 0;
      timerEl.textContent = formatTime(remaining);

      if (remaining === 0) {
        clearInterval(intervalId);
      }
    }

    tick();
    intervalId = setInterval(tick, 1000);
  } else {

    if (intervalId) clearInterval(intervalId);
    timerEl.textContent = '--:--:--';
    timerScreen.style.display = 'none';
    setup.style.display = 'block';
    exitFullscreen();
  }
});


document.getElementById('start').onclick = () => {
  const h = parseInt(document.getElementById('h').value) || 0;
  const m = parseInt(document.getElementById('m').value) || 0;
  const s = parseInt(document.getElementById('s').value) || 0;
  const duration = h * 3600 + m * 60 + s;
  if (duration > 0) {
    socket.emit('start_timer', { duration });
  }
};


stopBtn.onclick = () => {
  socket.emit('stop_timer');
};


function formatTime(t) {
  const h = String(Math.floor(t / 3600)).padStart(2, '0');
  const m = String(Math.floor((t % 3600) / 60)).padStart(2, '0');
  const s = String(t % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}


function openFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
}

function exitFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
}


timerScreen.addEventListener('click', openFullscreen);
timerScreen.addEventListener('touchstart', openFullscreen, { passive: true });
