// ================================
// LAUNCHPAD - COMPLETE JAVASCRIPT
// All Features + Improvements
// ================================

// ========== STATE MANAGEMENT ==========
const state = {
    websites: [],
    todos: [],
    currentCategory: 'all',
    editingWebsiteId: null,
    settings: {
        theme: 'light',
        searchEngine: 'google',
        timeFormat: '12',
        gridSize: 'medium',
        showGreeting: true,
        showDate: true,
        backgroundUrl: '',
        backgroundBlur: 0
    },
    pomodoro: {
        selectedDuration: 25, // minutes
        duration: 25 * 60, // seconds
        timeRemaining: 25 * 60,
        isRunning: false,
        isPaused: false,
        interval: null,
        sessionsToday: 0
    },
    panels: {
        todo: true,
        pomodoro: true
    }
};

// ========== DOM ELEMENTS ==========
const el = {
    // Header
    greetingEmoji: document.getElementById('greetingEmoji'),
    greetingMessage: document.getElementById('greetingMessage'),
    timeMain: document.getElementById('timeMain'),
    timePeriod: document.getElementById('timePeriod'),
    dateDisplay: document.getElementById('dateDisplay'),
    themeToggle: document.getElementById('themeToggle'),
    settingsBtn: document.getElementById('settingsBtn'),
    
    // Search
    searchInput: document.getElementById('searchInput'),
    searchEngine: document.getElementById('searchEngine'),
    
    // Categories
    categoriesContainer: document.getElementById('categoriesContainer'),
    openAllBtn: document.getElementById('openAllBtn'),
    
    // Websites
    websitesGrid: document.getElementById('websitesGrid'),
    addWebsiteBtn: document.getElementById('addWebsiteBtn'),
    
    // Website Modal
    websiteModal: document.getElementById('websiteModal'),
    websiteModalOverlay: document.getElementById('websiteModalOverlay'),
    websiteModalClose: document.getElementById('websiteModalClose'),
    websiteModalTitle: document.getElementById('websiteModalTitle'),
    websiteUrl: document.getElementById('websiteUrl'),
    websiteName: document.getElementById('websiteName'),
    websiteCategory: document.getElementById('websiteCategory'),
    websiteModalCancel: document.getElementById('websiteModalCancel'),
    websiteModalSave: document.getElementById('websiteModalSave'),
    
    // Settings Modal
    settingsModal: document.getElementById('settingsModal'),
    settingsModalOverlay: document.getElementById('settingsModalOverlay'),
    settingsModalClose: document.getElementById('settingsModalClose'),
    settingsTimeFormat: document.getElementById('settingsTimeFormat'),
    settingsGridSize: document.getElementById('settingsGridSize'),
    settingsShowGreeting: document.getElementById('settingsShowGreeting'),
    settingsShowDate: document.getElementById('settingsShowDate'),
    settingsBgUrl: document.getElementById('settingsBgUrl'),
    settingsBgUpload: document.getElementById('settingsBgUpload'),
    settingsBgUploadBtn: document.getElementById('settingsBgUploadBtn'),
    settingsBgRemove: document.getElementById('settingsBgRemove'),
    settingsBgBlur: document.getElementById('settingsBgBlur'),
    blurValueDisplay: document.getElementById('blurValueDisplay'),
    settingsReset: document.getElementById('settingsReset'),
    downloadDataBtn: document.getElementById('downloadDataBtn'),
    uploadDataBtn: document.getElementById('uploadDataBtn'),
    uploadDataInput: document.getElementById('uploadDataInput'),
    
    // Background
    backgroundOverlay: document.getElementById('backgroundOverlay'),
    
    // Todo Modal
    openTodoBtn: document.getElementById('openTodoBtn'),
    todoModal: document.getElementById('todoModal'),
    todoModalOverlay: document.getElementById('todoModalOverlay'),
    todoModalClose: document.getElementById('todoModalClose'),
    todoInput: document.getElementById('todoInput'),
    addTodoBtn: document.getElementById('addTodoBtn'),
    todoList: document.getElementById('todoList'),
    taskCount: document.getElementById('taskCount'),
    fabTaskCount: document.getElementById('fabTaskCount'),
    clearCompletedBtn: document.getElementById('clearCompletedBtn'),
    
    // Timer Modal
    openTimerBtn: document.getElementById('openTimerBtn'),
    timerModal: document.getElementById('timerModal'),
    timerModalOverlay: document.getElementById('timerModalOverlay'),
    timerModalClose: document.getElementById('timerModalClose'),
    timerTime: document.getElementById('timerTime'),
    timerLabel: document.getElementById('timerLabel'),
    timerProgress: document.getElementById('timerProgress'),
    timerStart: document.getElementById('timerStart'),
    timerReset: document.getElementById('timerReset'),
    sessionsToday: document.getElementById('sessionsToday'),
    
    // Timer Notification
    timerNotification: document.getElementById('timerNotification'),
    closeNotification: document.getElementById('closeNotification')
};

// ========== INITIALIZATION ==========
function init() {
    console.log('🚀 Initializing Launchpad...');
    
    loadData();
    applyTheme();
    applySettings();
    updateClock();
    updateGreeting();
    renderWebsites();
    renderTodos();
    updatePomodoroDisplay();
    setupEventListeners();
    
    // Focus search
    el.searchInput.focus();
    
    // Start clock
    setInterval(updateClock, 1000);
    
    // Update greeting every minute
    setInterval(updateGreeting, 60000);
    
    console.log('✅ Launchpad ready!');
}

// ========== LOCAL STORAGE ==========
function saveData() {
    try {
        localStorage.setItem('launchpad_data', JSON.stringify({
            websites: state.websites,
            todos: state.todos,
            settings: state.settings,
            panels: state.panels,
            pomodoro: {
                selectedDuration: state.pomodoro.selectedDuration,
                sessionsToday: state.pomodoro.sessionsToday
            }
        }));
    } catch (e) {
        console.error('Failed to save data:', e);
    }
}

function loadData() {
    try {
        const saved = localStorage.getItem('launchpad_data');
        if (!saved) return;
        
        const data = JSON.parse(saved);
        
        if (data.websites) state.websites = data.websites;
        if (data.todos) state.todos = data.todos;
        if (data.settings) state.settings = { ...state.settings, ...data.settings };
        if (data.panels) state.panels = { ...state.panels, ...data.panels };
        if (data.pomodoro) {
            if (data.pomodoro.selectedDuration) {
                state.pomodoro.selectedDuration = data.pomodoro.selectedDuration;
                state.pomodoro.duration = data.pomodoro.selectedDuration * 60;
                state.pomodoro.timeRemaining = data.pomodoro.selectedDuration * 60;
            }
            if (data.pomodoro.sessionsToday !== undefined) {
                state.pomodoro.sessionsToday = data.pomodoro.sessionsToday;
            }
        }
        
        // Reset sessions daily
        const lastDate = localStorage.getItem('launchpad_last_date');
        const today = new Date().toDateString();
        if (lastDate !== today) {
            state.pomodoro.sessionsToday = 0;
            localStorage.setItem('launchpad_last_date', today);
        }
        
    } catch (e) {
        console.error('Failed to load data:', e);
    }
}

// ========== THEME ==========
function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.settings.theme);
    
    const sunIcon = el.themeToggle.querySelector('.sun-icon');
    const moonIcon = el.themeToggle.querySelector('.moon-icon');
    
    if (state.settings.theme === 'dark') {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
}

function toggleTheme() {
    state.settings.theme = state.settings.theme === 'light' ? 'dark' : 'light';
    applyTheme();
    saveData();
    
    // Update timer gradient for new theme
    if (window.updateTimerGradient) {
        window.updateTimerGradient();
    }
}

// ========== CLOCK & GREETING ==========
function updateClock() {
    const now = new Date();
    const is24Hour = state.settings.timeFormat === '24';
    
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let period = '';
    
    if (!is24Hour) {
        period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
    }
    
    el.timeMain.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    el.timePeriod.textContent = period;
    el.timePeriod.style.display = is24Hour ? 'none' : 'block';
    
    // Date
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    el.dateDisplay.textContent = now.toLocaleDateString('en-US', options);
    el.dateDisplay.style.display = state.settings.showDate ? 'block' : 'none';
}

function updateGreeting() {
    const hour = new Date().getHours();
    let emoji = '👋';
    let message = 'Hello';
    
    if (hour >= 5 && hour < 12) {
        emoji = '🌅';
        message = 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
        emoji = '☀️';
        message = 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
        emoji = '🌆';
        message = 'Good Evening';
    } else {
        emoji = '🌙';
        message = 'Good Night';
    }
    
    el.greetingEmoji.textContent = emoji;
    el.greetingMessage.textContent = message;
    
    const greetingInline = document.getElementById('greetingInline');
    if (greetingInline) {
        greetingInline.style.display = state.settings.showGreeting ? 'flex' : 'none';
    }
}

// ========== SEARCH ==========
function handleSearch(e) {
    e.preventDefault();
    const query = el.searchInput.value.trim();
    if (!query) return;
    
    const engines = {
        google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        brave: `https://search.brave.com/search?q=${encodeURIComponent(query)}`,
        bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`
    };
    
    window.open(engines[state.settings.searchEngine] || engines.google, '_blank');
    el.searchInput.value = '';
}

// ========== WEBSITES ==========
function renderWebsites() {
    const filtered = state.currentCategory === 'all' 
        ? state.websites 
        : state.websites.filter(w => w.category === state.currentCategory);
    
    el.websitesGrid.innerHTML = '';
    
    // Show/hide "Open All" button
    el.openAllBtn.style.display = filtered.length > 0 && state.currentCategory !== 'all' ? 'flex' : 'none';
    
    if (filtered.length === 0) {
        el.websitesGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                </div>
                <h3 class="empty-title">No websites yet</h3>
                <p class="empty-text">Click the <strong>+</strong> button to add your first website</p>
            </div>
        `;
        return;
    }
    
    filtered.forEach(website => {
        const card = createWebsiteCard(website);
        el.websitesGrid.appendChild(card);
    });
}

function createWebsiteCard(website) {
    const card = document.createElement('div');
    card.className = 'website-card';
    card.draggable = true;
    card.dataset.id = website.id;
    
    const faviconUrl = getFaviconUrl(website.url);
    
    card.innerHTML = `
        <button class="website-delete">×</button>
        <button class="website-edit">✏️</button>
        <div class="website-icon">
            <img src="${faviconUrl}" alt="${website.name}" 
                onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23cbd5e1%22 stroke-width=%222%22%3E%3Ccircle cx=%2212%22 cy=%2212%22 r=%2210%22/%3E%3Cline x1=%2212%22 y1=%228%22 x2=%2212%22 y2=%2212%22/%3E%3Cline x1=%2212%22 y1=%2216%22 x2=%2212.01%22 y2=%2216%22/%3E%3C/svg%3E'">
        </div>
        <div class="website-name">${escapeHtml(website.name)}</div>
    `;
    
    // Click to open
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.website-delete') && !e.target.closest('.website-edit')) {
            window.open(website.url, '_blank');
        }
    });
    
    // Delete
    card.querySelector('.website-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteWebsite(website.id);
    });
    
    // Edit
    card.querySelector('.website-edit').addEventListener('click', (e) => {
        e.stopPropagation();
        openEditWebsiteModal(website);
    });
    
    // Drag & Drop
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    card.addEventListener('dragover', handleDragOver);
    card.addEventListener('drop', handleDrop);
    
    return card;
}

function getFaviconUrl(url) {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
        return 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23cbd5e1%22 stroke-width=%222%22%3E%3Ccircle cx=%2212%22 cy=%2212%22 r=%2210%22/%3E%3C/svg%3E';
    }
}

function getWebsiteNameFromUrl(url) {
    try {
        const hostname = new URL(url).hostname.replace('www.', '');
        const name = hostname.split('.')[0];
        return name.charAt(0).toUpperCase() + name.slice(1);
    } catch {
        return 'Website';
    }
}

// ========== DRAG & DROP ==========
let draggedElement = null;
let draggedId = null;

function handleDragStart(e) {
    draggedElement = e.currentTarget;
    draggedId = e.currentTarget.dataset.id;
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
    document.querySelectorAll('.website-card').forEach(card => {
        card.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const target = e.currentTarget;
    if (target !== draggedElement && target.classList.contains('website-card')) {
        target.classList.add('drag-over');
    }
    
    return false;
}

function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    
    const target = e.currentTarget;
    target.classList.remove('drag-over');
    
    if (draggedElement !== target) {
        const draggedIndex = state.websites.findIndex(w => w.id === draggedId);
        const targetIndex = state.websites.findIndex(w => w.id === target.dataset.id);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
            // Swap
            [state.websites[draggedIndex], state.websites[targetIndex]] = 
            [state.websites[targetIndex], state.websites[draggedIndex]];
            
            saveData();
            renderWebsites();
        }
    }
    
    return false;
}

// ========== WEBSITE MODAL ==========
function openAddWebsiteModal() {
    state.editingWebsiteId = null;
    el.websiteModalTitle.textContent = 'Add Website';
    el.websiteUrl.value = '';
    el.websiteName.value = '';
    el.websiteCategory.value = state.currentCategory === 'all' ? 'personal' : state.currentCategory;
    el.websiteModalSave.textContent = 'Add Website';
    el.websiteModal.classList.add('active');
    el.websiteUrl.focus();
}

function openEditWebsiteModal(website) {
    state.editingWebsiteId = website.id;
    el.websiteModalTitle.textContent = 'Edit Website';
    el.websiteUrl.value = website.url;
    el.websiteName.value = website.name;
    el.websiteCategory.value = website.category;
    el.websiteModalSave.textContent = 'Save Changes';
    el.websiteModal.classList.add('active');
    el.websiteUrl.focus();
}

function closeWebsiteModal() {
    el.websiteModal.classList.remove('active');
    state.editingWebsiteId = null;
}

function saveWebsite() {
    let url = el.websiteUrl.value.trim();
    if (!url) {
        alert('Please enter a URL');
        return;
    }
    
    // Add https if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    
    const name = el.websiteName.value.trim() || getWebsiteNameFromUrl(url);
    const category = el.websiteCategory.value;
    
    if (state.editingWebsiteId) {
        // Edit
        const website = state.websites.find(w => w.id === state.editingWebsiteId);
        if (website) {
            website.url = url;
            website.name = name;
            website.category = category;
        }
    } else {
        // Add
        state.websites.push({
            id: Date.now().toString(),
            url,
            name,
            category
        });
    }
    
    saveData();
    renderWebsites();
    closeWebsiteModal();
}

function deleteWebsite(id) {
    if (confirm('Delete this website?')) {
        state.websites = state.websites.filter(w => w.id !== id);
        saveData();
        renderWebsites();
    }
}

// ========== CATEGORIES ==========
function switchCategory(category) {
    state.currentCategory = category;
    
    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.category === category);
    });
    
    renderWebsites();
}

function openAllWebsites() {
    const filtered = state.websites.filter(w => w.category === state.currentCategory);
    
    if (filtered.length === 0) return;
    
    if (filtered.length > 10) {
        if (!confirm(`Open ${filtered.length} websites? This might slow down your browser.`)) {
            return;
        }
    }
    
    filtered.forEach(website => {
        window.open(website.url, '_blank');
    });
}

// ========== TODO LIST ==========
function renderTodos() {
    el.todoList.innerHTML = '';
    
    state.todos.forEach(todo => {
        const item = createTodoItem(todo);
        el.todoList.appendChild(item);
    });
    
    updateTaskCount();
}

function createTodoItem(todo) {
    const item = document.createElement('div');
    item.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    item.dataset.id = todo.id;
    
    item.innerHTML = `
        <div class="todo-checkbox ${todo.completed ? 'checked' : ''}"></div>
        <div class="todo-text">${escapeHtml(todo.text)}</div>
        <button class="todo-delete">×</button>
    `;
    
    item.querySelector('.todo-checkbox').addEventListener('click', () => toggleTodo(todo.id));
    item.querySelector('.todo-delete').addEventListener('click', () => deleteTodo(todo.id));
    
    return item;
}

function addTodo() {
    const text = el.todoInput.value.trim();
    if (!text) return;
    
    state.todos.push({
        id: Date.now().toString(),
        text,
        completed: false
    });
    
    el.todoInput.value = '';
    saveData();
    renderTodos();
}

function toggleTodo(id) {
    const todo = state.todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveData();
        renderTodos();
    }
}

function deleteTodo(id) {
    state.todos = state.todos.filter(t => t.id !== id);
    saveData();
    renderTodos();
}

function clearCompletedTodos() {
    const count = state.todos.filter(t => t.completed).length;
    if (count === 0) {
        alert('No completed tasks');
        return;
    }
    
    if (confirm(`Clear ${count} completed task(s)?`)) {
        state.todos = state.todos.filter(t => !t.completed);
        saveData();
        renderTodos();
    }
}

function updateTaskCount() {
    const active = state.todos.filter(t => !t.completed).length;
    el.taskCount.textContent = active;
    el.fabTaskCount.textContent = active;
    
    // Show/hide badge
    if (active > 0) {
        el.fabTaskCount.style.display = 'flex';
    } else {
        el.fabTaskCount.style.display = 'none';
    }
}

// ========== POMODORO TIMER ==========
function updatePomodoroDisplay() {
    const minutes = Math.floor(state.pomodoro.timeRemaining / 60);
    const seconds = state.pomodoro.timeRemaining % 60;
    el.timerTime.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // Progress circle
    const circumference = 2 * Math.PI * 70;
    const progress = state.pomodoro.timeRemaining / state.pomodoro.duration;
    const offset = circumference * (1 - progress);
    el.timerProgress.style.strokeDashoffset = offset;
    
    // Sessions
    el.sessionsToday.textContent = state.pomodoro.sessionsToday;
    
    // Update title when running
    if (state.pomodoro.isRunning) {
        document.title = `${minutes}:${String(seconds).padStart(2, '0')} - Launchpad`;
    } else {
        document.title = 'Launchpad';
    }
}

function selectTimerDuration(minutes) {
    if (state.pomodoro.isRunning) {
        if (!confirm('Timer is running. Change duration?')) return;
        resetPomodoro();
    }
    
    state.pomodoro.selectedDuration = minutes;
    state.pomodoro.duration = minutes * 60;
    state.pomodoro.timeRemaining = minutes * 60;
    
    // Update active button
    document.querySelectorAll('.timer-mode-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.minutes) === minutes);
    });
    
    updatePomodoroDisplay();
    saveData();
}

function togglePomodoro() {
    if (state.pomodoro.isRunning) {
        pausePomodoro();
    } else {
        startPomodoro();
    }
}

function startPomodoro() {
    state.pomodoro.isRunning = true;
    state.pomodoro.isPaused = false;
    
    el.timerStart.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
        Pause
    `;
    
    el.timerLabel.textContent = 'Focusing...';
    
    state.pomodoro.interval = setInterval(() => {
        state.pomodoro.timeRemaining--;
        
        if (state.pomodoro.timeRemaining <= 0) {
            completePomodoro();
        }
        
        updatePomodoroDisplay();
    }, 1000);
}

function pausePomodoro() {
    state.pomodoro.isRunning = false;
    state.pomodoro.isPaused = true;
    clearInterval(state.pomodoro.interval);
    
    el.timerStart.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Resume
    `;
    
    el.timerLabel.textContent = 'Paused';
}

function resetPomodoro() {
    pausePomodoro();
    state.pomodoro.timeRemaining = state.pomodoro.duration;
    state.pomodoro.isPaused = false;
    
    el.timerStart.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Start
    `;
    
    el.timerLabel.textContent = 'Focus Time';
    updatePomodoroDisplay();
}

function completePomodoro() {
    pausePomodoro();
    state.pomodoro.sessionsToday++;
    state.pomodoro.timeRemaining = state.pomodoro.duration;
    updatePomodoroDisplay();
    saveData();
    
    // Show custom notification popup
    showTimerNotification();
}

function showTimerNotification() {
    const notification = document.getElementById('timerNotification');
    notification.classList.add('show');
}

function hideTimerNotification() {
    const notification = document.getElementById('timerNotification');
    notification.classList.remove('show');
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// ========== MODAL FUNCTIONS ==========
function openTodoModal() {
    el.todoModal.classList.add('active');
}

function closeTodoModal() {
    el.todoModal.classList.remove('active');
}

function openTimerModal() {
    el.timerModal.classList.add('active');
}

function closeTimerModal() {
    el.timerModal.classList.remove('active');
}

// ========== SETTINGS ==========
function openSettingsModal() {
    // Load current settings
    el.settingsTimeFormat.value = state.settings.timeFormat;
    el.settingsGridSize.value = state.settings.gridSize;
    el.settingsShowGreeting.checked = state.settings.showGreeting;
    el.settingsShowDate.checked = state.settings.showDate;
    el.settingsBgUrl.value = state.settings.backgroundUrl;
    el.settingsBgBlur.value = state.settings.backgroundBlur;
    el.blurValueDisplay.textContent = `${state.settings.backgroundBlur}px`;
    
    el.settingsModal.classList.add('active');
}

function closeSettingsModal() {
    el.settingsModal.classList.remove('active');
}

function applySettings() {
    // Grid size
    document.body.setAttribute('data-grid-size', state.settings.gridSize);
    
    // Background
    if (state.settings.backgroundUrl) {
        el.backgroundOverlay.style.backgroundImage = `url(${state.settings.backgroundUrl})`;
        el.backgroundOverlay.classList.add('active');
    } else {
        el.backgroundOverlay.classList.remove('active');
    }
    
    // Blur
    document.documentElement.style.setProperty('--custom-bg-blur', `${state.settings.backgroundBlur}px`);
}

function uploadBackground() {
    el.settingsBgUpload.click();
}

function handleBackgroundUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        alert('Image too large. Max 5MB.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
        state.settings.backgroundUrl = event.target.result;
        el.settingsBgUrl.value = 'Custom image uploaded';
        saveData();
        applySettings();
    };
    reader.readAsDataURL(file);
}

function removeBackground() {
    state.settings.backgroundUrl = '';
    el.settingsBgUrl.value = '';
    saveData();
    applySettings();
}

// ========== DATA MANAGEMENT ==========
function downloadData() {
    try {
        // Get all data from localStorage
        const data = {
            websites: state.websites,
            todos: state.todos,
            settings: state.settings,
            panels: state.panels,
            pomodoro: {
                selectedDuration: state.pomodoro.selectedDuration,
                sessionsToday: state.pomodoro.sessionsToday
            },
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        // Convert to JSON string
        const jsonString = JSON.stringify(data, null, 2);
        
        // Create blob
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `launchpad-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('✅ Data exported successfully!');
        alert('✅ Data downloaded successfully!');
    } catch (e) {
        console.error('Failed to download data:', e);
        alert('❌ Failed to download data. Please try again.');
    }
}

function uploadData(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Confirm before uploading
    if (!confirm('⚠️ Upload Data?\n\nThis will replace your current data with the data from the file.\n\nYour current data will be lost unless you have downloaded it first.\n\nContinue?')) {
        el.uploadDataInput.value = '';
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(event) {
        try {
            // Parse JSON
            const data = JSON.parse(event.target.result);
            
            // Validate data structure
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid data format');
            }
            
            // Import data
            if (data.websites && Array.isArray(data.websites)) {
                state.websites = data.websites;
            }
            
            if (data.todos && Array.isArray(data.todos)) {
                state.todos = data.todos;
            }
            
            if (data.settings && typeof data.settings === 'object') {
                state.settings = { ...state.settings, ...data.settings };
            }
            
            if (data.panels && typeof data.panels === 'object') {
                state.panels = { ...state.panels, ...data.panels };
            }
            
            if (data.pomodoro) {
                if (data.pomodoro.selectedDuration) {
                    state.pomodoro.selectedDuration = data.pomodoro.selectedDuration;
                    state.pomodoro.duration = data.pomodoro.selectedDuration * 60;
                    state.pomodoro.timeRemaining = data.pomodoro.selectedDuration * 60;
                }
                if (data.pomodoro.sessionsToday !== undefined) {
                    state.pomodoro.sessionsToday = data.pomodoro.sessionsToday;
                }
            }
            
            // Save to localStorage
            saveData();
            
            // Update UI
            applyTheme();
            applySettings();
            renderWebsites();
            renderTodos();
            updatePomodoroDisplay();
            
            console.log('✅ Data imported successfully!');
            alert('✅ Data uploaded successfully! The page will reload.');
            
            // Reload to apply all changes
            setTimeout(() => location.reload(), 1000);
            
        } catch (e) {
            console.error('Failed to import data:', e);
            alert('❌ Failed to upload data. Please make sure the file is a valid Launchpad data file.');
        }
        
        // Reset file input
        el.uploadDataInput.value = '';
    };
    
    reader.onerror = function() {
        console.error('Failed to read file');
        alert('❌ Failed to read file. Please try again.');
        el.uploadDataInput.value = '';
    };
    
    reader.readAsText(file);
}

function resetAll() {
    if (!confirm('⚠️ Delete ALL data?\n\nThis will remove:\n• All websites\n• All tasks\n• All notes\n• All settings\n\nThis cannot be undone!')) {
        return;
    }
    
    if (!confirm('Are you absolutely sure?')) {
        return;
    }
    
    localStorage.clear();
    location.reload();
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
    // Search
    el.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch(e);
    });
    
    el.searchEngine.addEventListener('change', (e) => {
        state.settings.searchEngine = e.target.value;
        saveData();
    });
    
    // Theme
    el.themeToggle.addEventListener('click', toggleTheme);
    
    // Settings button
    el.settingsBtn.addEventListener('click', openSettingsModal);
    
    // Categories
    el.categoriesContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.category-pill');
        if (pill) switchCategory(pill.dataset.category);
    });
    
    // Open All
    el.openAllBtn.addEventListener('click', openAllWebsites);
    
    // Add website
    el.addWebsiteBtn.addEventListener('click', openAddWebsiteModal);
    
    // Website modal
    el.websiteModalClose.addEventListener('click', closeWebsiteModal);
    el.websiteModalOverlay.addEventListener('click', closeWebsiteModal);
    el.websiteModalCancel.addEventListener('click', closeWebsiteModal);
    el.websiteModalSave.addEventListener('click', saveWebsite);
    
    // Settings modal
    el.settingsModalClose.addEventListener('click', closeSettingsModal);
    el.settingsModalOverlay.addEventListener('click', closeSettingsModal);
    
    el.settingsTimeFormat.addEventListener('change', (e) => {
        state.settings.timeFormat = e.target.value;
        saveData();
        updateClock();
    });
    
    el.settingsGridSize.addEventListener('change', (e) => {
        state.settings.gridSize = e.target.value;
        saveData();
        applySettings();
    });
    
    el.settingsShowGreeting.addEventListener('change', (e) => {
        state.settings.showGreeting = e.target.checked;
        saveData();
        updateGreeting();
    });
    
    el.settingsShowDate.addEventListener('change', (e) => {
        state.settings.showDate = e.target.checked;
        saveData();
        updateClock();
    });
    
    el.settingsBgUrl.addEventListener('change', (e) => {
        state.settings.backgroundUrl = e.target.value.trim();
        saveData();
        applySettings();
    });
    
    el.settingsBgBlur.addEventListener('input', (e) => {
        state.settings.backgroundBlur = parseInt(e.target.value);
        el.blurValueDisplay.textContent = `${e.target.value}px`;
        saveData();
        applySettings();
    });
    
    el.settingsBgUploadBtn.addEventListener('click', uploadBackground);
    el.settingsBgUpload.addEventListener('change', handleBackgroundUpload);
    el.settingsBgRemove.addEventListener('click', removeBackground);
    el.settingsReset.addEventListener('click', resetAll);
    
    // Data Management
    el.downloadDataBtn.addEventListener('click', downloadData);
    el.uploadDataBtn.addEventListener('click', () => el.uploadDataInput.click());
    el.uploadDataInput.addEventListener('change', uploadData);
    
    // Paste image for background
    el.settingsBgUrl.addEventListener('paste', (e) => {
        const items = e.clipboardData.items;
        for (let item of items) {
            if (item.type.indexOf('image') !== -1) {
                e.preventDefault();
                const blob = item.getAsFile();
                const reader = new FileReader();
                reader.onload = (event) => {
                    state.settings.backgroundUrl = event.target.result;
                    el.settingsBgUrl.value = 'Image pasted';
                    saveData();
                    applySettings();
                };
                reader.readAsDataURL(blob);
                break;
            }
        }
    });
    
    // Todo Modal
    el.openTodoBtn.addEventListener('click', openTodoModal);
    el.todoModalClose.addEventListener('click', closeTodoModal);
    el.todoModalOverlay.addEventListener('click', closeTodoModal);
    el.addTodoBtn.addEventListener('click', addTodo);
    el.todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
    el.clearCompletedBtn.addEventListener('click', clearCompletedTodos);
    
    // Timer Modal
    el.openTimerBtn.addEventListener('click', openTimerModal);
    el.timerModalClose.addEventListener('click', closeTimerModal);
    el.timerModalOverlay.addEventListener('click', closeTimerModal);
    el.timerStart.addEventListener('click', togglePomodoro);
    el.timerReset.addEventListener('click', resetPomodoro);
    
    // Timer Notification
    el.closeNotification.addEventListener('click', hideTimerNotification);
    
    // Timer duration buttons
    document.querySelectorAll('.timer-mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectTimerDuration(parseInt(btn.dataset.minutes));
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // / - Focus search
        if (e.key === '/' && !isInputFocused()) {
            e.preventDefault();
            el.searchInput.focus();
        }
        
        // Escape - Close modals
        if (e.key === 'Escape') {
            closeWebsiteModal();
            closeSettingsModal();
            closeTodoModal();
            closeTimerModal();
        }
        
        // Ctrl/Cmd + N - Add website
        if ((e.ctrlKey || e.metaKey) && e.key === 'n' && !isInputFocused()) {
            e.preventDefault();
            openAddWebsiteModal();
        }
        
        // Ctrl/Cmd + , - Settings
        if ((e.ctrlKey || e.metaKey) && e.key === ',') {
            e.preventDefault();
            openSettingsModal();
        }
    });
}

function isInputFocused() {
    const active = document.activeElement;
    return active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable;
}

// ========== UTILITIES ==========
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== START ==========
document.addEventListener('DOMContentLoaded', init);

// Add SVG gradient for timer
const svg = document.querySelector('.timer-ring');
if (svg) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'timerGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('style', 'stop-color:#9333ea;stop-opacity:1');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('style', 'stop-color:#7c3aed;stop-opacity:1');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.insertBefore(defs, svg.firstChild);
    
    // Update gradient colors based on theme
    window.updateTimerGradient = function() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            stop1.setAttribute('style', 'stop-color:#b084cc;stop-opacity:1');
            stop2.setAttribute('style', 'stop-color:#9370db;stop-opacity:1');
        } else {
            stop1.setAttribute('style', 'stop-color:#9333ea;stop-opacity:1');
            stop2.setAttribute('style', 'stop-color:#7c3aed;stop-opacity:1');
        }
    };
}

console.log('✨ Launchpad JavaScript loaded successfully!');