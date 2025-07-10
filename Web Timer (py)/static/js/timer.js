let timerRunning = false;
let timerInterval;
let timerEl = document.getElementById('timer');
const startStopBtn = document.getElementById('startStopBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

function formatTime(t) {
  let h = Math.floor(t / 3600);
  let m = Math.floor((t % 3600) / 60);
  let s = t % 60;
  return (
    String(h).padStart(2,'0') + ':' +
    String(m).padStart(2,'0') + ':' +
    String(s).padStart(2,'0')
  );
}

function updateTimerDisplay(remaining) {
  timerEl.textContent = formatTime(Math.max(0, remaining));
}

function syncAndStart() {
  fetch('/api/now')
    .then(res => res.json())
    .then(data => {
      const { start, duration, now } = data;
      let elapsed = Math.floor(now - start);
      let remaining = duration - elapsed;

      if (remaining <= 0) {
        updateTimerDisplay(0);
        return;
      }

      updateTimerDisplay(remaining);
      timerRunning = true;
      startStopBtn.textContent = 'Пауза';

      timerInterval = setInterval(() => {
        remaining--;
        updateTimerDisplay(remaining);
        if (remaining <= 0) {
          clearInterval(timerInterval);
          alert('Время вышло!');
        }
      }, 1000);
    })
    .catch(() => {
      timerEl.textContent = '00:00:00';
    });
}

startStopBtn.onclick = () => {
  alert('Таймер синхронизирован. Пауза не поддерживается.');
};

fullscreenBtn.onclick = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    fullscreenBtn.textContent = 'Выйти из полноэкранного';
  } else {
    document.exitFullscreen();
    fullscreenBtn.textContent = 'Во весь экран';
  }
};

document.addEventListener('fullscreenchange', () => {
  fullscreenBtn.textContent = document.fullscreenElement
    ? 'Выйти из полноэкранного'
    : 'Во весь экран';
});

// ⏱ Запуск таймера и fullscreen после любого действия пользователя
function initOnUserInteraction() {
  document.documentElement.requestFullscreen().catch(() => {});
  syncAndStart();
  window.removeEventListener('click', initOnUserInteraction);
  window.removeEventListener('keydown', initOnUserInteraction);
}

window.addEventListener('click', initOnUserInteraction);
window.addEventListener('keydown', initOnUserInteraction);
