const firstButton = document.querySelector('#first-button');
const firstTimer = document.querySelector('#first-timer');
const firstMessage = document.querySelector('#first-message');

const secondButton = document.querySelector('#second-button');
const secondTimer = document.querySelector('#second-timer');
const secondMessage = document.querySelector('#second-message');
const secondRing = document.querySelector('#second-ring');

const ONE_HOUR_MS = 60 * 60 * 1000;
const HALF_HOUR_MS = 30 * 60 * 1000;
const SECOND_TIMER_START_MS = 30 * 1000;

function formatHourTimer(ms) {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const minutes = String(totalMinutes % 60).padStart(2, '0');
  return `${hours}:${minutes}:00`;
}

function formatSecondTimer(ms) {
  const safeMs = Math.max(0, ms);
  const totalSeconds = Math.floor(safeMs / 1000);
  const milliseconds = safeMs % 1000;
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}.${String(milliseconds).padStart(3, '0')}`;
}

let firstIntervalId = null;
let firstRemainingMs = ONE_HOUR_MS;

function resetFirstTask() {
  firstRemainingMs = ONE_HOUR_MS;
  firstTimer.textContent = formatHourTimer(firstRemainingMs);
  firstMessage.classList.add('hidden');
  firstMessage.classList.remove('alert');
  firstButton.textContent = 'Почати відлік';
  firstButton.disabled = false;
}

firstButton.addEventListener('click', () => {
  if (firstIntervalId) {
    return;
  }

  firstButton.disabled = true;
  firstButton.textContent = 'Триває...';
  firstRemainingMs = ONE_HOUR_MS;
  firstMessage.classList.add('hidden');
  firstMessage.classList.remove('alert');
  firstTimer.textContent = formatHourTimer(firstRemainingMs);

  firstIntervalId = setInterval(() => {
    firstRemainingMs -= 60 * 1000;

    if (firstRemainingMs <= HALF_HOUR_MS) {
      firstMessage.textContent = 'Залишилось менше половини часу!';
      firstMessage.classList.remove('hidden');
      firstMessage.classList.add('alert');
    }

    if (firstRemainingMs <= 0) {
      firstRemainingMs = 0;
      clearInterval(firstIntervalId);
      firstIntervalId = null;
      firstTimer.textContent = formatHourTimer(firstRemainingMs);
      firstMessage.textContent = 'Час вийшов!';
      firstMessage.classList.remove('hidden');
      firstMessage.classList.add('alert');
      firstButton.textContent = 'Почати знову';
      firstButton.disabled = false;
      return;
    }

    firstTimer.textContent = formatHourTimer(firstRemainingMs);
  }, 60000);
});

let secondIntervalId = null;
let secondStartTime = 0;
let secondDurationMs = SECOND_TIMER_START_MS;

function renderSecondTimer() {
  const leftMs = Math.max(0, secondDurationMs - (Date.now() - secondStartTime));
  secondTimer.textContent = formatSecondTimer(leftMs);

  if (leftMs <= 10_000) {
    secondTimer.classList.add('warning');
    secondRing.classList.add('active');
    secondMessage.textContent = 'Менше 10 секунд — анімація активна';
    secondMessage.classList.add('warning');
  } else {
    secondTimer.classList.remove('warning');
    secondRing.classList.remove('active');
    secondMessage.textContent = 'Таймер працює';
    secondMessage.classList.remove('warning');
  }
}

function stopSecondTask() {
  clearInterval(secondIntervalId);
  secondIntervalId = null;
  secondButton.disabled = false;
  secondButton.textContent = 'Почати знову';
  secondMessage.textContent = 'Час вийшов! Кнопка активна знову.';
  secondMessage.classList.remove('warning');
  secondRing.classList.remove('active');
}

secondButton.addEventListener('click', () => {
  if (secondIntervalId) {
    return;
  }

  secondButton.disabled = true;
  secondButton.textContent = 'Триває...';
  secondDurationMs = SECOND_TIMER_START_MS;
  secondStartTime = Date.now();
  secondTimer.classList.remove('warning');
  secondMessage.classList.remove('warning');
  secondMessage.textContent = 'Таймер працює';
  secondRing.classList.remove('active');
  renderSecondTimer();

  secondIntervalId = setInterval(() => {
    const leftMs = Math.max(0, secondDurationMs - (Date.now() - secondStartTime));

    if (leftMs <= 0) {
      secondTimer.textContent = '00:00.000';
      stopSecondTask();
      return;
    }

    renderSecondTimer();
  }, 10);
});

resetFirstTask();
secondTimer.textContent = '00:30.000';
secondMessage.textContent = 'Готово до запуску';
