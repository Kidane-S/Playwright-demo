const appState = {
  clickCount: 0,
  theme: 'dark',
  tasks: ['Review test page', 'Write a Playwright spec', 'Verify modal behavior'],
  currentQuoteIndex: 0,
};

const quotes = [
  'Automation improves repeatability and reliability.',
  'Good test pages should be easy to interact with.',
  'Dynamic behavior makes browser tests more valuable.',
];

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
    themeLabel.textContent = `Theme: ${appState.theme}`;
  }
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
  const closeModal = document.getElementById('closeModal');
  const overlay = document.getElementById('modalOverlay');
  if (!openModal || !overlay) return;

  openModal.addEventListener('click', () => {
    overlay.hidden = false;
  });

  closeModal?.addEventListener('click', () => {
    overlay.hidden = true;
  });

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      overlay.hidden = true;
    }
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

    if (!emailInput?.value.trim() || !emailInput.value.includes('@')) {
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

    if (!emailInput.value.includes('@')) {
      result?.classList.add('error');
      if (result) result.textContent = 'Please enter a valid email address.';
      return;
    }

    if (result) result.textContent = `Message sent! We will contact ${nameInput.value.trim()} soon.`;
    form.reset();
  });
}

function initPage() {
  setActiveNav();
  updateHeroStatus();
  setupClickCounter();
  setupThemeToggle();
  setupModal();
  setupTaskManager();
  setupMainForm();
  setupQuoteRotator();
  setupDashboardPage();
  setupContactPage();
}

window.addEventListener('DOMContentLoaded', initPage);
