// ==================== COPY FUNCTIONALITY ====================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("copyBtn");
  const payload = document.getElementById("payload");
  const status = document.getElementById("status");

  if (!btn || !payload) return;

  // ==================== MOUSE TRACKING FOR GLOW EFFECT ====================
  if (payload) {
    payload.addEventListener('mousemove', (e) => {
      const rect = payload.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      payload.style.setProperty('--mouse-x', x + '%');
      payload.style.setProperty('--mouse-y', y + '%');
    });
  }

  // ==================== COPY BUTTON CLICK ====================
  btn.addEventListener("click", async () => {
    const text = payload.textContent || "";

    // Button press animation
    btn.style.transform = "scale(0.95)";
    setTimeout(() => {
      btn.style.transform = "";
    }, 150);

    try {
      await navigator.clipboard.writeText(text);
      
      if (status) {
        // Success message
        status.textContent = "Скопировано ✔";
        status.className = "success";

        // Payload flash animation
        payload.style.transform = "scale(0.99)";
        payload.style.boxShadow = "0 0 40px rgba(139, 92, 246, 0.6)";
        
        setTimeout(() => {
          payload.style.transform = "";
          payload.style.boxShadow = "";
        }, 300);

        // Create effects
        createConfetti(btn);
        createSuccessParticles(btn);

        // Clear message after 3 seconds
        setTimeout(() => {
          status.textContent = "";
          status.className = "";
        }, 3000);
      }
      
    } catch (e) {
      if (status) {
        status.textContent = "Не удалось скопировать автоматически. Выделите текст и нажмите Ctrl+C.";
        status.className = "error";

        // Shake animation on error
        btn.style.animation = "shake 0.5s";
        setTimeout(() => {
          btn.style.animation = "";
        }, 500);

        // Clear error message after 5 seconds
        setTimeout(() => {
          status.textContent = "";
          status.className = "";
        }, 5000);
      }
    }
  });

  // ==================== CONFETTI EFFECT ====================
  function createConfetti(element) {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
    const confettiCount = 25;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = Math.random() * 8 + 4 + 'px';
      confetti.style.height = Math.random() * 8 + 4 + 'px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      confetti.style.left = centerX + 'px';
      confetti.style.top = centerY + 'px';
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '10000';
      confetti.style.boxShadow = '0 0 10px currentColor';
      
      document.body.appendChild(confetti);

      const angle = (Math.PI * 2 * i) / confettiCount;
      const velocity = 150 + Math.random() * 100;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 50;
      const rotation = Math.random() * 360;
      const rotationSpeed = (Math.random() - 0.5) * 720;

      animateConfetti(confetti, vx, vy, rotation, rotationSpeed);
    }
  }

  function animateConfetti(element, vx, vy, rotation, rotationSpeed) {
    let x = 0, y = 0, currentRotation = rotation;
    let opacity = 1;
    const gravity = 600;
    const startTime = Date.now();

    function update() {
      const elapsed = (Date.now() - startTime) / 1000;
      
      x += vx * elapsed * 0.08;
      y += (vy + gravity * elapsed) * elapsed * 0.08;
      currentRotation += rotationSpeed * elapsed * 0.05;
      opacity = Math.max(0, 1 - elapsed * 0.8);

      element.style.transform = `translate(${x}px, ${y}px) rotate(${currentRotation}deg)`;
      element.style.opacity = opacity;

      if (opacity > 0 && elapsed < 2) {
        requestAnimationFrame(update);
      } else {
        element.remove();
      }
    }

    update();
  }

  // ==================== SUCCESS PARTICLES ====================
  function createSuccessParticles(element) {
    const rect = element.getBoundingClientRect();
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.width = '4px';
      particle.style.height = '4px';
      particle.style.backgroundColor = '#8b5cf6';
      particle.style.borderRadius = '50%';
      particle.style.left = rect.left + Math.random() * rect.width + 'px';
      particle.style.top = rect.bottom + 'px';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '10000';
      particle.style.boxShadow = '0 0 10px #8b5cf6';
      
      document.body.appendChild(particle);

      animateSuccessParticle(particle);
    }
  }

  function animateSuccessParticle(element) {
    let y = 0;
    let x = (Math.random() - 0.5) * 100;
    let opacity = 1;
    const startTime = Date.now();
    const duration = 1.5;

    function update() {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = elapsed / duration;
      
      y = -150 * progress;
      opacity = 1 - progress;

      element.style.transform = `translate(${x}px, ${y}px)`;
      element.style.opacity = opacity;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.remove();
      }
    }

    update();
  }

  // ==================== RIPPLE EFFECT ====================
  btn.addEventListener('mousedown', (e) => {
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';

    btn.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });

  // ==================== ADD CSS ANIMATIONS ====================
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-8px); }
      75% { transform: translateX(8px); }
    }
  `;
  document.head.appendChild(style);
});