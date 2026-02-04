// Управление навигацией и фильтрацией
(function() {
  'use strict';

  const navLinks = document.querySelectorAll('.nav-link');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const templateCards = document.querySelectorAll('.template-card');
  const searchBtn = document.getElementById('searchBtn');
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const themeToggle = document.getElementById('themeToggle');

  // Данные шаблонов для поиска
  const templatesData = [
    { id: 'slowmode', title: '— Роль Slowmode', description: 'Уведомление о временном ограничении отправки сообщений', url: './templates/slowmode.html', icon: 'primary' },
    { id: 'appeal', title: '— Обжалование наказаний', description: 'Информация о порядке обжалования наказаний', url: './templates/appeal-main-discord.html', icon: 'secondary' },
    { id: 'roles', title: '— Роли Novice / Prime Trader', description: 'Информация о выдаче ролей за достижение уровней', url: './templates/novice-prime-trader.html', icon: 'accent' },
    { id: 'punishment', title: '— Наказание', description: 'Информация о проверке и деталях наказаний', url: './templates/punishment-info.html', icon: 'warning' },
    { id: 'org', title: '— Покупка организации', description: 'Предупреждение о запрете покупки организаций с рук', url: './templates/org-purchase.html', icon: 'primary' },
    { id: 'caller', title: '— Поиск услуг коллера', description: 'Предупреждение о запрете услуг по прогнозированию ставок', url: './templates/caller-services.html', icon: 'danger' },
    { id: 'loan', title: '— Поиск кредитора «в долг»', description: 'Предупреждение о запрете кредитования и займов', url: './templates/creditor-loan.html', icon: 'warning' },
    { id: 'channels', title: '— Не видно каналы', description: 'Инструкция по отображению категорий и каналов', url: './templates/not-seeing-channels.html', icon: 'secondary' },
    { id: 'mee6', title: '— MEE6 удаляет сообщения', description: 'Информация об автоматическом удалении сообщений ботом', url: './templates/mee6-deletes.html', icon: 'accent' },
    { id: 'wrong', title: '— Неправильная причина наказания', description: 'Уведомление о корректировке причины наказания', url: './templates/wrong-reason.html', icon: 'danger' }
  ];

  // Поиск
  if (searchBtn && searchModal && searchInput) {
    searchBtn.addEventListener('click', openSearch);
    searchModal.addEventListener('click', handleModalClick);
    searchInput.addEventListener('input', handleSearch);
  }

  function openSearch() {
    searchModal.classList.add('active');
    setTimeout(() => searchInput.focus(), 100);
  }

  function handleModalClick(e) {
    if (e.target === searchModal) {
      closeSearch();
    }
  }

  function closeSearch() {
    searchModal.classList.remove('active');
    searchInput.value = '';
    showEmptyState();
  }

  function showEmptyState() {
    searchResults.innerHTML = '<div class="search-empty">Начните вводить для поиска...</div>';
  }

  function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (!query) {
      showEmptyState();
      return;
    }
    
    const filtered = templatesData.filter(template => 
      template.title.toLowerCase().includes(query) || 
      template.description.toLowerCase().includes(query)
    );
    
    if (filtered.length === 0) {
      searchResults.innerHTML = '<div class="search-empty">Ничего не найдено</div>';
      return;
    }
    
    searchResults.innerHTML = filtered.map(template => `
      <a href="${template.url}" class="search-result-item">
        <div class="search-result-icon icon-${template.icon}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </div>
        <div class="search-result-content">
          <div class="search-result-title">${template.title}</div>
          <div class="search-result-description">${template.description}</div>
        </div>
        <div class="search-result-badge">#${template.id}</div>
      </a>
    `).join('');
  }

  // Клавиатурные сокращения
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (searchModal) openSearch();
    }
    
    if (e.key === 'Escape' && searchModal && searchModal.classList.contains('active')) {
      closeSearch();
    }
  });

  // Переключение темы
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    initTheme();
  }

  function toggleTheme() {
    document.body.classList.toggle('light-theme');
    
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      themeToggle.style.transform = '';
    }, 300);
    
    updateThemeIcon(isLight);
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      updateThemeIcon(true);
    }
  }

  function updateThemeIcon(isLight) {
    const icon = themeToggle.querySelector('svg');
    if (!icon) return;
    
    if (isLight) {
      icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    } else {
      icon.innerHTML = `
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      `;
    }
  }

  // Активация ссылок навигации
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      
      const category = this.getAttribute('href').slice(1);
      filterTemplates(category);
    });
  });

  // Фильтрация шаблонов
  function filterTemplates(category) {
    templateCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      
      if (category === 'all') {
        card.style.display = 'flex';
      } else {
        card.style.display = cardCategory === category ? 'flex' : 'none';
      }
    });
  }

  // Фильтры
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Избранное
  const favoriteButtons = document.querySelectorAll('.card-favorite');
  
  favoriteButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      
      this.classList.toggle('favorited');
      
      const svg = this.querySelector('svg path');
      if (this.classList.contains('favorited')) {
        svg.setAttribute('fill', 'currentColor');
        this.style.color = '#ef4444';
        this.style.borderColor = '#ef4444';
        this.style.background = 'rgba(239, 68, 68, 0.1)';
      } else {
        svg.setAttribute('fill', 'none');
        this.style.color = '';
        this.style.borderColor = '';
        this.style.background = '';
      }
    });
  });

  // Переключение вида
  const viewButtons = document.querySelectorAll('.view-btn');
  const templatesGrid = document.querySelector('.templates-grid');
  
  if (viewButtons.length && templatesGrid) {
    viewButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        viewButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        if (this === viewButtons[1]) {
          templatesGrid.style.gridTemplateColumns = '1fr';
        } else {
          templatesGrid.style.gridTemplateColumns = '';
        }
      });
    });
  }

  // Анимация появления карточек
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const cardObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        cardObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Инициализация анимации
  document.addEventListener('DOMContentLoaded', function() {
    templateCards.forEach(function(card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      cardObserver.observe(card);
    });
  });

  // Обработка кликов по карточкам
  templateCards.forEach(card => {
    card.addEventListener('click', function(e) {
      if (!e.target.closest('.card-favorite') && !e.target.closest('.card-link')) {
        const link = this.querySelector('.card-link');
        if (link) {
          window.location.href = link.href;
        }
      }
    });
  });

  // Плавная прокрутка
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

})();

// Данные шаблонов для поиска
const templatesData = [
  { id: 'slowmode', title: '— Роль Slowmode', description: 'Уведомление о временном ограничении отправки сообщений', url: './templates/slowmode.html', icon: 'primary' },
  { id: 'appeal', title: '— Обжалование наказаний', description: 'Информация о порядке обжалования наказаний', url: './templates/appeal-main-discord.html', icon: 'secondary' },
  { id: 'roles', title: '— Роли Novice / Prime Trader', description: 'Информация о выдаче ролей за достижение уровней', url: './templates/novice-prime-trader.html', icon: 'accent' },
  { id: 'punishment', title: '— Наказание', description: 'Информация о проверке и деталях наказаний', url: './templates/punishment-info.html', icon: 'warning' },
  { id: 'org', title: '— Покупка организации', description: 'Предупреждение о запрете покупки организаций с рук', url: './templates/org-purchase.html', icon: 'primary' },
  { id: 'caller', title: '— Поиск услуг коллера', description: 'Предупреждение о запрете услуг по прогнозированию ставок', url: './templates/caller-services.html', icon: 'danger' },
  { id: 'loan', title: '— Поиск кредитора «в долг»', description: 'Предупреждение о запрете кредитования и займов', url: './templates/creditor-loan.html', icon: 'warning' },
  { id: 'channels', title: '— Не видно каналы', description: 'Инструкция по отображению категорий и каналов', url: './templates/not-seeing-channels.html', icon: 'secondary' },
  { id: 'mee6', title: '— MEE6 удаляет сообщения', description: 'Информация об автоматическом удалении сообщений ботом', url: './templates/mee6-deletes.html', icon: 'accent' },
  { id: 'wrong', title: '— Неправильная причина наказания', description: 'Уведомление о корректировке причины наказания', url: './templates/wrong-reason.html', icon: 'danger' }
];

// Поиск
searchBtn.addEventListener('click', () => {
  searchModal.classList.add('active');
  setTimeout(() => searchInput.focus(), 100);
});

searchModal.addEventListener('click', (e) => {
  if (e.target === searchModal) {
    closeSearch();
  }
});

function closeSearch() {
  searchModal.classList.remove('active');
  searchInput.value = '';
  showEmptyState();
}

function showEmptyState() {
  searchResults.innerHTML = '<div class="search-empty">Начните вводить для поиска...</div>';
}

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  
  if (!query) {
    showEmptyState();
    return;
  }
  
  const filtered = templatesData.filter(template => 
    template.title.toLowerCase().includes(query) || 
    template.description.toLowerCase().includes(query)
  );
  
  if (filtered.length === 0) {
    searchResults.innerHTML = '<div class="search-empty">Ничего не найдено</div>';
    return;
  }
  
  searchResults.innerHTML = filtered.map(template => `
    <a href="${template.url}" class="search-result-item">
      <div class="search-result-icon icon-${template.icon}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      </div>
      <div class="search-result-content">
        <div class="search-result-title">${template.title}</div>
        <div class="search-result-description">${template.description}</div>
      </div>
      <div class="search-result-badge">#${template.id}</div>
    </a>
  `).join('');
});

// Клавиатурные сокращения для поиска
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    searchModal.classList.add('active');
    setTimeout(() => searchInput.focus(), 100);
  }
  
  if (e.key === 'Escape' && searchModal.classList.contains('active')) {
    closeSearch();
  }
});

// Переключение темы
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  
  const isLight = document.body.classList.contains('light-theme');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  
  // Анимация кнопки
  themeToggle.style.transform = 'rotate(360deg)';
  setTimeout(() => {
    themeToggle.style.transform = '';
  }, 300);
  
  // Обновление иконки
  const icon = themeToggle.querySelector('svg');
  if (isLight) {
    icon.innerHTML = `
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    `;
  } else {
    icon.innerHTML = `
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    `;
  }
});

// Загрузка сохраненной темы
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.body.classList.add('light-theme');
  const icon = themeToggle.querySelector('svg');
  icon.innerHTML = `
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  `;
}

// Активация ссылок навигации
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    const category = link.getAttribute('href').slice(1);
    filterTemplates(category);
  });
});

// Фильтрация шаблонов
function filterTemplates(category) {
  templateCards.forEach(card => {
    if (category === 'all') {
      card.style.display = 'block';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 10);
    } else {
      const cardCategory = card.getAttribute('data-category');
      if (cardCategory === category) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    }
  });
}

// Фильтры
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Избранное
const favoriteButtons = document.querySelectorAll('.card-favorite');

favoriteButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    btn.classList.toggle('favorited');
    
    const svg = btn.querySelector('svg path');
    if (btn.classList.contains('favorited')) {
      svg.setAttribute('fill', 'currentColor');
      btn.style.color = '#ef4444';
      btn.style.borderColor = '#ef4444';
      btn.style.background = 'rgba(239, 68, 68, 0.1)';
    } else {
      svg.setAttribute('fill', 'none');
      btn.style.color = '';
      btn.style.borderColor = '';
      btn.style.background = '';
    }
  });
});

// Переключение вида
const viewButtons = document.querySelectorAll('.view-btn');
const templatesGrid = document.querySelector('.templates-grid');

viewButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    viewButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    if (btn === viewButtons[1]) {
      templatesGrid.style.gridTemplateColumns = '1fr';
    } else {
      templatesGrid.style.gridTemplateColumns = '';
    }
  });
});

// Анимация появления карточек
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      cardObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  templateCards.forEach((card) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    cardObserver.observe(card);
  });
});

// Обработка кликов по карточкам
templateCards.forEach(card => {
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.card-favorite') && !e.target.closest('.card-link')) {
      const link = card.querySelector('.card-link');
      if (link) {
        window.location.href = link.href;
      }
    }
  });
});

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Статистика просмотров и копирований (сохранение в localStorage)
function updateStats(cardId, type) {
  const stats = JSON.parse(localStorage.getItem('templateStats') || '{}');
  if (!stats[cardId]) {
    stats[cardId] = { views: 0, copies: 0 };
  }
  stats[cardId][type]++;
  localStorage.setItem('templateStats', JSON.stringify(stats));
  
  // Обновление отображения статистики
  const card = document.querySelector(`[data-id="${cardId}"]`);
  if (card) {
    const statElements = card.querySelectorAll('.stat');
    if (statElements[0]) statElements[0].textContent = stats[cardId].views;
    if (statElements[1]) statElements[1].textContent = stats[cardId].copies;
  }
}

// Загрузка статистики при старте
document.addEventListener('DOMContentLoaded', () => {
  const stats = JSON.parse(localStorage.getItem('templateStats') || '{}');
  templateCards.forEach(card => {
    const cardId = card.getAttribute('data-id');
    if (stats[cardId]) {
      const statElements = card.querySelectorAll('.stat');
      // Обновление счетчиков будет в реальном проекте
    }
  });
});