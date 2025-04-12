document.addEventListener('DOMContentLoaded', function () {
  const onboardingContainer = document.getElementById('onboardingContainer');
  const nameInputContainer = document.getElementById('nameInputContainer');
  const appContainer = document.getElementById('appContainer');
  const onboardingBtn = document.getElementById('onboardingBtn');
  const userNameInput = document.getElementById('userNameInput');
  const submitNameBtn = document.getElementById('submitNameBtn');
  const usernameDisplay = document.getElementById('usernameDisplay');
  const pendingTasksCount = document.getElementById('pendingTasksCount');
  const searchIcon = document.querySelector('.search-icon');
  const searchContainer = document.getElementById('searchContainer');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const taskList = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const addTaskModal = document.getElementById('addTaskModal');
  const newTaskInput = document.getElementById('newTaskInput');
  const reminderTimeInput = document.getElementById('reminderTimeInput');
  const cancelAddTask = document.getElementById('cancelAddTask');
  const saveTask = document.getElementById('saveTask');
  const homeNav = document.getElementById('homeNav');
  const tasksNav = document.getElementById('tasksNav');
  const logoutBtn = document.getElementById('logoutBtn');
  const statsSection = document.querySelector('.stats');
  const header = document.querySelector('.header');
  const searchInput = document.getElementById('searchInput');
  const slides = document.querySelectorAll('.slide');
  const indicators = document.querySelectorAll('.indicator');
  let currentSlide = 0;
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let username = localStorage.getItem('username') || '';
  function init() {
    if (username) {
      onboardingContainer.style.display = 'none';
      nameInputContainer.style.display = 'none';
      appContainer.style.display = 'flex';
      usernameDisplay.textContent = username;
      updatePendingTasksCount();
      renderTasks();
      tasks.forEach(task => scheduleReminder(task));
    } else {
      showSlide(currentSlide);
    }
    setupEventListeners();
  }
  function setupEventListeners() {
    onboardingBtn.addEventListener('click', () => {
      if (currentSlide === slides.length - 1) {
        showNameInputScreen();
      } else {
        currentSlide++;
        showSlide(currentSlide);
      }
    });
    userNameInput.addEventListener('input', () => {
      submitNameBtn.disabled = userNameInput.value.trim() === '';
    });
    submitNameBtn.addEventListener('click', saveUsername);
    searchIcon.addEventListener('click', () => (searchContainer.style.display = 'flex'));
    closeSearchBtn.addEventListener('click', () => {
      searchContainer.style.display = 'none';
      searchInput.value = '';
      renderTasks();
    });
    searchInput.addEventListener('input', renderTasks);
    addTaskBtn.addEventListener('click', () => {
      newTaskInput.value = '';
      reminderTimeInput.value = '';
      addTaskModal.style.display = 'flex';
    });
    cancelAddTask.addEventListener('click', () => (addTaskModal.style.display = 'none'));
    saveTask.addEventListener('click', addNewTask);
    newTaskInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') addNewTask();
    });
    homeNav.addEventListener('click', () => {
      homeNav.classList.add('active');
      tasksNav.classList.remove('active');
      statsSection.style.display = 'flex';
      header.style.display = 'flex';
      searchContainer.style.display = 'none';
    });
    tasksNav.addEventListener('click', () => {
      tasksNav.classList.add('active');
      homeNav.classList.remove('active');
      statsSection.style.display = 'none';
      header.style.display = 'none';
      searchContainer.style.display = 'flex';
    });
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('username');
        localStorage.removeItem('tasks');
        location.reload();
      });
    }
    onboardingContainer.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    });
    onboardingContainer.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
  }
  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    onboardingBtn.textContent = index === slides.length - 1 ? 'Get Started' : 'Next';
  }
  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      currentSlide = Math.min(currentSlide + 1, slides.length - 1);
      showSlide(currentSlide);
    } else if (touchEndX > touchStartX + 50) {
      currentSlide = Math.max(currentSlide - 1, 0);
      showSlide(currentSlide);
    }
  }
  function showNameInputScreen() {
    onboardingContainer.style.display = 'none';
    nameInputContainer.style.display = 'flex';
  }
  function saveUsername() {
    const name = userNameInput.value.trim();
    if (name) {
      username = name;
      localStorage.setItem('username', username);
      nameInputContainer.style.display = 'none';
      appContainer.style.display = 'flex';
      usernameDisplay.textContent = username;
      updatePendingTasksCount();
      renderTasks();
    }
  }
  function addNewTask() {
    const title = newTaskInput.value.trim();
    const reminder = reminderTimeInput.value;
    if (title) {
      const newTask = {
        id: Date.now(),
        title,
        completed: false,
        reminder: reminder || null
      };
      tasks.unshift(newTask);
      saveTasks();
      renderTasks();
      addTaskModal.style.display = 'none';
      updatePendingTasksCount();
      showNotification(title);
      scheduleReminder(newTask);
    }
  }
  function renderTasks() {
    const searchQuery = searchInput.value.toLowerCase();
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(searchQuery));
    if (filteredTasks.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'task-completed' : ''}`;
        li.dataset.id = task.id;
        li.innerHTML = `
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
          <div class="task-content">
            <div class="task-title">${task.title}</div>
            ${task.reminder ? `<div class="task-reminder">⏰ ${new Date(task.reminder).toLocaleString()}</div>` : ''}
          </div>
          <div class="task-actions">
            <button class="delete-btn">🗑️</button>
          </div>
        `;
        li.querySelector('.task-checkbox').addEventListener('change', () => toggleTaskCompletion(task.id));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
        taskList.appendChild(li);
      });
    }
  }
  function toggleTaskCompletion(taskId) {
    const index = tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      updatePendingTasksCount();
      renderTasks();
    }
  }
  function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
    updatePendingTasksCount();
  }
  function updatePendingTasksCount() {
    const count = tasks.filter(task => !task.completed).length;
    pendingTasksCount.textContent = count;
  }
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  function showNotification(taskTitle) {
    if (Notification.permission === 'granted') {
      new Notification('Task Added', {
        body: `"${taskTitle}" has been added to your list.`,
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showNotification(taskTitle);
        }
      });
    }
  }
  function scheduleReminder(task) {
    if (task.reminder) {
      const delay = new Date(task.reminder).getTime() - Date.now();
      if (delay > 0) {
        setTimeout(() => {
          const latest = JSON.parse(localStorage.getItem('tasks')) || [];
          const match = latest.find(t => t.id === task.id);
          if (match && !match.completed) {
            showNotification(`⏰ Reminder: ${match.title} is still pending!`);
          }
        }, delay);
      }
    }
  }
  let touchStartX = 0;
  let touchEndX = 0;

  init();
});
