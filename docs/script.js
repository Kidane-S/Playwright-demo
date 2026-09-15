const appState = {
  clickCount: 0,
  theme: 'dark',
  tasks: ['Review test page', 'Write a Playwright spec', 'Verify modal behavior'],
  currentQuoteIndex: 0,
};

const THEME_STORAGE_KEY = 'playwright-demo-theme';

const quotes = [
  'Automation improves repeatability and reliability.',
  'Good test pages should be easy to interact with.',
  'Dynamic behavior makes browser tests more valuable.',
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showLocalEnvironmentBanner() {
  const localHosts = new Set(['localhost', '127.0.0.1', '[::1]']);
  if (!localHosts.has(window.location.hostname)) return;

  const banner = document.createElement('div');
  banner.className = 'local-environment-banner';
  banner.setAttribute('role', 'status');
  banner.textContent = 'LOCAL ENVIRONMENT';
  document.body.prepend(banner);
}

function setActiveNav() {
  const currentPage = document.body.dataset.page || 'home';
  document.querySelectorAll('.main-nav .nav-link').forEach((link) => {
    const href = link.getAttribute('href')?.replace('.html', '') || 'home';
    link.classList.toggle('active', href === currentPage);
  });
}

function updateHeroStatus() {
  const countLabel = document.getElementById('clickCount');
  const themeLabel = document.getElementById('themeStatus');
  if (countLabel) {
    countLabel.textContent = `Clicked ${appState.clickCount} times`;
  }
  if (themeLabel) {
    themeLabel.textContent = appState.theme;
  }
}

function initializeTheme() {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    appState.theme = savedTheme;
  }
  document.body.classList.toggle('light', appState.theme === 'light');
}

function refreshTaskList(filter = '') {
  const list = document.getElementById('taskList');
  if (!list) return;
  list.innerHTML = '';
  const normalizedFilter = filter.trim().toLowerCase();
  appState.tasks.forEach((task) => {
    if (!normalizedFilter || task.toLowerCase().includes(normalizedFilter)) {
      const item = document.createElement('li');
      item.textContent = task;
      list.appendChild(item);
    }
  });
}

function setupTaskManager() {
  const addButton = document.getElementById('addTaskButton');
  const taskInput = document.getElementById('taskInput');
  const filterInput = document.getElementById('filterInput');
  if (!addButton || !taskInput) return;

  refreshTaskList();

  addButton.addEventListener('click', () => {
    const value = taskInput.value.trim();
    if (value) {
      appState.tasks.push(value);
      taskInput.value = '';
      refreshTaskList(filterInput?.value || '');
    }
  });

  filterInput?.addEventListener('input', () => {
    refreshTaskList(filterInput.value);
  });
}

function setupThemeToggle() {
  const button = document.getElementById('themeToggle');
  if (!button) return;
  button.addEventListener('click', () => {
    appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem(THEME_STORAGE_KEY, appState.theme);
    document.body.classList.toggle('light', appState.theme === 'light');
    updateHeroStatus();
  });
}

function setupClickCounter() {
  const button = document.getElementById('clickCounterButton');
  if (!button) return;
  button.addEventListener('click', () => {
    appState.clickCount += 1;
    updateHeroStatus();
  });
}

function setupModal() {
  const openModal = document.getElementById('openModal');
  const closeButton = document.getElementById('closeModal');
  const overlay = document.getElementById('modalOverlay');
  if (!openModal || !overlay) return;

  let previouslyFocusedElement = null;
  const getFocusableElements = () => Array.from(
    overlay.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => !element.hasAttribute('hidden') && element.offsetParent !== null);

  const focusFirstModalElement = () => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
      return;
    }
    overlay.focus();
  };

  const closeModal = () => {
    overlay.hidden = true;
    if (previouslyFocusedElement instanceof HTMLElement) {
      previouslyFocusedElement.focus();
      return;
    }
    openModal.focus();
  };

  openModal.addEventListener('click', () => {
    previouslyFocusedElement = document.activeElement;
    overlay.hidden = false;
    requestAnimationFrame(focusFirstModalElement);
  });

  closeButton?.addEventListener('click', closeModal);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (overlay.hidden) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) {
      event.preventDefault();
      overlay.focus();
      return;
    }

    const currentIndex = focusableElements.indexOf(document.activeElement);
    const nextIndex = event.shiftKey
      ? currentIndex <= 0
        ? focusableElements.length - 1
        : currentIndex - 1
      : currentIndex === focusableElements.length - 1
        ? 0
        : currentIndex + 1;

    event.preventDefault();
    focusableElements[nextIndex].focus();
  });
}

function setupMainForm() {
  const form = document.getElementById('mainForm');
  if (!form) return;

  const nameInput = document.getElementById('nameInput');
  const emailInput = document.getElementById('emailInput');
  const result = document.getElementById('formResult');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    result?.classList.remove('error');

    if (!nameInput?.value.trim()) {
      result?.classList.add('error');
      if (result) result.textContent = 'Please enter your name.';
      return;
    }

    if (!emailInput?.value.trim() || !emailPattern.test(emailInput.value.trim())) {
      result?.classList.add('error');
      if (result) result.textContent = 'Please enter a valid email address.';
      return;
    }

    if (result) result.textContent = `Thanks, ${nameInput.value.trim()}! Your message was submitted.`;
    form.reset();
  });
}

function setupQuoteRotator() {
  const button = document.getElementById('quoteButton');
  const quoteText = document.getElementById('quoteText');
  if (!button || !quoteText) return;

  button.addEventListener('click', () => {
    appState.currentQuoteIndex = (appState.currentQuoteIndex + 1) % quotes.length;
    quoteText.textContent = quotes[appState.currentQuoteIndex];
  });
}

function refreshMetrics() {
  const metrics = [
    { label: 'Uptime', selector: 'metricValueA', fill: 'metricFillA' },
    { label: 'Performance', selector: 'metricValueB', fill: 'metricFillB' },
    { label: 'Coverage', selector: 'metricValueC', fill: 'metricFillC' },
  ];

  metrics.forEach((metric) => {
    const valueElement = document.getElementById(metric.selector);
    const fillElement = document.getElementById(metric.fill);
    if (!valueElement || !fillElement) return;
    const amount = Math.floor(Math.random() * 41) + 60;
    valueElement.textContent = `${amount}%`;
    fillElement.style.width = `${amount}%`;
  });
}

function setupDashboardPage() {
  const refreshButton = document.getElementById('refreshMetrics');
  if (!refreshButton) return;
  refreshMetrics();
  refreshButton.addEventListener('click', refreshMetrics);
}

function setupContactPage() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');
  const result = document.getElementById('contactResult');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    result?.classList.remove('error');

    if (!nameInput?.value.trim() || !emailInput?.value.trim() || !messageInput?.value.trim()) {
      result?.classList.add('error');
      if (result) result.textContent = 'All fields are required.';
      return;
    }

    if (!emailPattern.test(emailInput.value.trim())) {
      result?.classList.add('error');
      if (result) result.textContent = 'Please enter a valid email address.';
      return;
    }

    if (result) result.textContent = `Message sent! We will contact ${nameInput.value.trim()} soon.`;
    form.reset();
  });
}

function setupSnakePage() {
  const board = document.getElementById('snakeBoard');
  const scoreElement = document.getElementById('snakeScore');
  const statusElement = document.getElementById('snakeStatus');
  const startButton = document.getElementById('snakeStartButton');
  if (!board || !scoreElement || !statusElement || !startButton) return;

  const size = 20;
  const startingSnake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  let snake = [...startingSnake];
  let food = { x: 15, y: 10 };
  let direction = { x: 1, y: 0 };
  let nextDirection = { ...direction };
  let score = 0;
  let gameRunning = false;
  let gamePaused = false;
  let timerId = null;

  board.innerHTML = '';
  for (let index = 0; index < size * size; index += 1) {
    const cell = document.createElement('div');
    cell.className = 'snake-cell';
    cell.setAttribute('role', 'gridcell');
    cell.dataset.index = String(index);
    board.appendChild(cell);
  }

  const render = () => {
    board.querySelectorAll('.snake-cell').forEach((cell) => {
      cell.classList.remove('snake-segment', 'snake-head', 'snake-food');
    });
    snake.forEach((segment, index) => {
      const cell = board.querySelector(`[data-index="${segment.y * size + segment.x}"]`);
      cell?.classList.add(index === 0 ? 'snake-head' : 'snake-segment');
    });
    board.querySelector(`[data-index="${food.y * size + food.x}"]`)?.classList.add('snake-food');
    scoreElement.textContent = String(score);
  };

  const endGame = () => {
    gameRunning = false;
    if (timerId !== null) window.clearInterval(timerId);
    timerId = null;
    statusElement.textContent = `Game over! Final score: ${score}`;
    startButton.textContent = 'Restart game';
  };

  const move = () => {
    direction = nextDirection;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    const hitWall = head.x < 0 || head.x >= size || head.y < 0 || head.y >= size;
    const hitSelf = snake.some((segment) => segment.x === head.x && segment.y === head.y);
    if (hitWall || hitSelf) {
      endGame();
      return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 1;
      food = { x: (food.x + 7) % size, y: (food.y + 5) % size };
      statusElement.textContent = `Food collected! Score: ${score}`;
    } else {
      snake.pop();
    }
    render();
  };

  const setDirection = (event) => {
    const directions = {
      ArrowUp: { x: 0, y: -1 },
      w: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      s: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      a: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      d: { x: 1, y: 0 },
    };
    const requested = directions[event.key];
    if (!requested || (requested.x === -direction.x && requested.y === -direction.y)) return;
    event.preventDefault();
    nextDirection = requested;
  };

  const togglePause = () => {
    if (!gameRunning) {
      startGame();
      return;
    }
    gamePaused = !gamePaused;
    if (gamePaused) {
      if (timerId !== null) window.clearInterval(timerId);
      timerId = null;
      statusElement.textContent = 'Game paused';
      return;
    }

    statusElement.textContent = 'Game in progress';
    timerId = window.setInterval(move, 180);
  };

  const startGame = () => {
    if (timerId !== null) window.clearInterval(timerId);
    snake = [...startingSnake];
    food = { x: 15, y: 10 };
    direction = { x: 1, y: 0 };
    nextDirection = { ...direction };
    score = 0;
    gameRunning = true;
    gamePaused = false;
    statusElement.textContent = 'Game in progress';
    startButton.textContent = 'Restart game';
    render();
    timerId = window.setInterval(move, 180);
  };

  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      event.preventDefault();
      togglePause();
      return;
    }
    if (gameRunning && !gamePaused) setDirection(event);
  });
  startButton.addEventListener('click', startGame);
  render();
}

function initPage() {
  showLocalEnvironmentBanner();
  setActiveNav();
  initializeTheme();
  updateHeroStatus();
  setupClickCounter();
  setupThemeToggle();
  setupModal();
  setupTaskManager();
  setupMainForm();
  setupQuoteRotator();
  setupDashboardPage();
  setupContactPage();
  setupSnakePage();
}

window.addEventListener('DOMContentLoaded', initPage);
