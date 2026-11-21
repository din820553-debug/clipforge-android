const screens = [...document.querySelectorAll('.screen')];
const toast = document.querySelector('#toast');
const clips = [
  ['Невероятная реакция', '00:12 — 00:43', '98%'],
  ['Финальный килл', '02:17 — 02:46', '94%'],
  ['Чат в восторге', '05:08 — 05:35', '89%'],
];

function showScreen(id) {
  screens.forEach((screen) => screen.classList.toggle('active', screen.id === id));
  document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('selected', item.dataset.nav === id));
}
function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2600);
}
function renderClips() {
  document.querySelector('#clips-list').innerHTML = clips.map(([title, duration, score]) => `
    <button class="clip-card" type="button"><span class="clip-preview"></span><span class="clip-info"><strong>${title}</strong><small>${duration}</small></span><span class="score">${score}</span></button>`).join('');
  document.querySelectorAll('.clip-card').forEach((card) => card.addEventListener('click', () => showScreen('editor-screen')));
}
function processSource(label) {
  showScreen('processing-screen');
  const status = document.querySelector('#processing-status');
  const bar = document.querySelector('#progress-bar');
  const labelNode = document.querySelector('#progress-label');
  const steps = ['Проверяем видео…', 'Ищем лицо стримера…', 'Находим эмоциональные моменты…', 'Создаём вертикальные клипы…'];
  let progress = 0;
  const timer = window.setInterval(() => {
    progress += 8;
    bar.style.width = `${progress}%`;
    labelNode.textContent = `${progress}%`;
    status.textContent = steps[Math.min(Math.floor(progress / 26), steps.length - 1)];
    if (progress >= 100) {
      window.clearInterval(timer);
      renderClips();
      window.setTimeout(() => { showScreen('results-screen'); notify(`${label}: 3 клипа готовы`); }, 400);
    }
  }, 190);
}

document.querySelector('#twitch-source').addEventListener('click', () => showScreen('source-screen'));
document.querySelector('#analyze-twitch').addEventListener('click', () => {
  const url = document.querySelector('#twitch-url').value.trim();
  if (!url || !/twitch\.tv/i.test(url)) return notify('Вставьте ссылку на Twitch VOD или канал');
  processSource('Twitch-проект');
});
document.querySelector('#video-input').addEventListener('change', (event) => {
  const [file] = event.target.files;
  if (file) processSource(file.name);
});
document.querySelectorAll('[data-back]').forEach((button) => button.addEventListener('click', () => showScreen('home-screen')));
document.querySelectorAll('[data-results]').forEach((button) => button.addEventListener('click', () => showScreen('results-screen')));
document.querySelectorAll('.toggle').forEach((button) => button.addEventListener('click', () => {
  button.classList.toggle('on'); button.setAttribute('aria-pressed', button.classList.contains('on'));
}));
document.querySelector('#export-button').addEventListener('click', () => notify('Экспорт будет запущен сервером обработки')); 
document.querySelectorAll('.nav-item').forEach((item) => item.addEventListener('click', () => {
  if (item.dataset.nav) showScreen(item.dataset.nav);
  else notify('Этот раздел появится в следующей версии');
}));
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js');
