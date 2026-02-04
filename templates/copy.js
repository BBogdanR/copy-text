document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copyBtn');
  const payloadBox = document.getElementById('payload');
  const statusMsg = document.getElementById('status');

  if (!copyBtn || !payloadBox) return;

  // Создание индикатора копирования
  const createCopyIndicator = () => {
    const indicator = document.createElement('div');
    indicator.className = 'copy-indicator';
    indicator.innerHTML = `
      <div class="copy-indicator-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>
      <div class="copy-indicator-text">Текст скопирован в буфер обмена</div>
    `;
    document.body.appendChild(indicator);
    return indicator;
  };

  // Показ индикатора
  const showCopyIndicator = () => {
    let indicator = document.querySelector('.copy-indicator');
    if (!indicator) {
      indicator = createCopyIndicator();
    }
    
    indicator.classList.add('show');
    
    setTimeout(() => {
      indicator.classList.remove('show');
    }, 3000);
  };

  // Эффект ripple
  const createRipple = (e, element) => {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      pointer-events: none;
      animation: ripple-effect 0.6s ease-out;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  };

  // Добавление CSS для ripple анимации
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-effect {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-8px); }
      50% { transform: translateX(8px); }
      75% { transform: translateX(-8px); }
    }
    
    @keyframes success-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `;
  document.head.appendChild(style);

  // Обработка копирования
  copyBtn.addEventListener('click', async (e) => {
    const textContent = payloadBox.textContent || '';

    // Ripple эффект
    createRipple(e, copyBtn);

    // Анимация нажатия
    copyBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      copyBtn.style.transform = '';
    }, 150);

    try {
      await navigator.clipboard.writeText(textContent);

      // Показ статуса
      if (statusMsg) {
        statusMsg.textContent = 'Скопировано ✓';
        statusMsg.className = 'success';

        // Анимация успеха
        payloadBox.style.animation = 'success-pulse 0.4s ease';
        payloadBox.style.borderColor = '#10b981';
        
        setTimeout(() => {
          payloadBox.style.animation = '';
          payloadBox.style.borderColor = '';
        }, 400);

        // Очистка через 3 секунды
        setTimeout(() => {
          statusMsg.textContent = '';
          statusMsg.className = '';
        }, 3000);
      }

      // Показ индикатора
      showCopyIndicator();

      // Обновление статистики
      updateCopyStats();

    } catch (error) {
      if (statusMsg) {
        statusMsg.textContent = 'Не удалось скопировать. Попробуйте выделить текст и нажать Ctrl+C.';
        statusMsg.className = 'error';

        // Анимация ошибки
        copyBtn.style.animation = 'shake 0.5s';
        setTimeout(() => {
          copyBtn.style.animation = '';
        }, 500);

        // Очистка через 5 секунд
        setTimeout(() => {
          statusMsg.textContent = '';
          statusMsg.className = '';
        }, 5000);
      }
    }
  });

  // Подсветка синтаксиса для кода (если необходимо)
  const highlightSyntax = () => {
    const text = payloadBox.textContent;
    if (text.includes('https://') || text.includes('http://')) {
      const highlighted = text.replace(
        /(https?:\/\/[^\s]+)/g,
        '<span style="color: #06b6d4; text-decoration: underline;">$1</span>'
      );
      payloadBox.innerHTML = highlighted;
    }
  };

  // Применение подсветки
  highlightSyntax();

  // Сохранение статистики копирований
  const updateCopyStats = () => {
    const templateId = window.location.pathname.split('/').pop().replace('.html', '');
    const stats = JSON.parse(localStorage.getItem('templateStats') || '{}');
    
    if (!stats[templateId]) {
      stats[templateId] = { copies: 0, lastCopy: null };
    }
    
    stats[templateId].copies++;
    stats[templateId].lastCopy = new Date().toISOString();
    
    localStorage.setItem('templateStats', JSON.stringify(stats));
  };

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + C для копирования
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      e.preventDefault();
      copyBtn.click();
    }
    
    // Escape для возврата
    if (e.key === 'Escape') {
      const backBtn = document.querySelector('.btn-back');
      if (backBtn) {
        window.location.href = backBtn.href;
      }
    }
  });

  // Показать hint о keyboard shortcuts
  const showKeyboardHint = () => {
    const hint = document.createElement('div');
    hint.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 13px;
      color: var(--text-muted);
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 1000;
    `;
    hint.innerHTML = `
      <div style="margin-bottom: 4px;"><kbd style="padding: 2px 6px; background: var(--bg-secondary); border-radius: 4px; font-family: 'JetBrains Mono', monospace;">Ctrl</kbd> + <cbd style="padding: 2px 6px; background: var(--bg-secondary); border-radius: 4px; font-family: 'JetBrains Mono', monospace;">C</kbd> — скопировать</div>
      <div><kbd style="padding: 2px 6px; background: var(--bg-secondary); border-radius: 4px; font-family: 'JetBrains Mono', monospace;">Esc</kbd> — назад</div>
    `;
    
    document.body.appendChild(hint);
    
    setTimeout(() => {
      hint.style.opacity = '1';
    }, 500);
    
    setTimeout(() => {
      hint.style.opacity = '0';
      setTimeout(() => hint.remove(), 300);
    }, 5000);
  };

  // Показать hint при загрузке
  setTimeout(showKeyboardHint, 1000);
});