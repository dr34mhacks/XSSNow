/* XSSNinja - Advanced Animation System */

class AnimationController {
  constructor() {
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン<>[]{}()';
    this.init();
  }

  init() {
    if (this.isReducedMotion) {
      this.disableAnimations();
      return;
    }

    this.setupIntersectionObserver();
    this.initializeParallax();
    this.startMatrixRain();
    this.initializeGlitchEffects();
    this.setupHoverAnimations();
    this.initializeTerminalAnimation();
  }

  disableAnimations() {
    document.body.classList.add('reduced-motion');
    const style = document.createElement('style');
    style.textContent = `
      .reduced-motion *,
      .reduced-motion *::before,
      .reduced-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: [0.1, 0.3, 0.7],
      rootMargin: '-10% 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.triggerElementAnimation(entry.target, entry.intersectionRatio);
        }
      });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll(`
      .fade-in-on-scroll,
      .slide-in-left-on-scroll,
      .slide-in-right-on-scroll,
      .category-card,
      .payload-card,
      .stat-card,
      .leader-item
    `).forEach(el => observer.observe(el));
  }

  triggerElementAnimation(element, ratio) {
    if (ratio > 0.1) {
      element.classList.add('visible');

      // Add staggered animation for groups
      if (element.parentElement.classList.contains('categories-grid') ||
          element.parentElement.classList.contains('payload-grid')) {
        const siblings = Array.from(element.parentElement.children);
        const index = siblings.indexOf(element);
        element.style.animationDelay = `${index * 0.1}s`;
      }

      // Special effects for certain elements
      if (element.classList.contains('stat-card')) {
        this.animateStatNumbers(element);
      }

      if (element.classList.contains('payload-card')) {
        this.addCardHoverGlow(element);
      }
    }
  }

  animateStatNumbers(statCard) {
    const numbers = statCard.querySelectorAll('[data-count]');
    numbers.forEach(number => {
      if (!number.hasAttribute('data-animated')) {
        this.countUpAnimation(number);
        number.setAttribute('data-animated', 'true');
      }
    });
  }

  countUpAnimation(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateNumber = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = target.toLocaleString();
      }
    };

    updateNumber();
  }

  addCardHoverGlow(card) {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = '0 10px 30px rgba(0, 255, 65, 0.3)';
      card.style.transform = 'translateY(-5px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
      card.style.transform = '';
    });
  }

  initializeParallax() {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallax = document.querySelectorAll('.parallax');

      parallax.forEach(element => {
        const speed = element.getAttribute('data-speed') || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  startMatrixRain() {
    const matrixContainer = document.getElementById('matrix-bg');
    if (!matrixContainer) return;

    const createMatrixColumn = () => {
      const column = document.createElement('div');
      column.className = 'matrix-column';
      column.style.left = Math.random() * 100 + 'vw';
      column.style.animationDelay = Math.random() * 3 + 's';
      column.style.animationDuration = (Math.random() * 3 + 2) + 's';

      // Add characters to column
      for (let i = 0; i < 20; i++) {
        const char = document.createElement('span');
        char.textContent = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
        char.style.opacity = Math.random();
        char.style.color = `rgba(0, 255, 65, ${Math.random() * 0.8 + 0.2})`;
        column.appendChild(char);
      }

      matrixContainer.appendChild(column);

      // Remove column after animation
      setTimeout(() => {
        if (column.parentNode) {
          column.parentNode.removeChild(column);
        }
      }, 5000);
    };

    // Create initial columns
    for (let i = 0; i < 10; i++) {
      setTimeout(createMatrixColumn, i * 300);
    }

    // Continue creating columns
    setInterval(createMatrixColumn, 1500);
  }

  initializeGlitchEffects() {
    const glitchElements = document.querySelectorAll('.glitch-text');

    glitchElements.forEach(element => {
      element.setAttribute('data-text', element.textContent);

      // Random glitch trigger
      setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance
          this.triggerGlitch(element);
        }
      }, 2000);
    });
  }

  triggerGlitch(element) {
    element.classList.add('glitching');

    setTimeout(() => {
      element.classList.remove('glitching');
    }, 500);
  }

  setupHoverAnimations() {
    // Add magnetic effect to buttons
    const buttons = document.querySelectorAll('.btn, .nav-link, .category-card');

    buttons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.1;
        const deltaY = (e.clientY - centerY) * 0.1;

        button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = '';
      });
    });

    // Neon glow effect on code blocks
    const codeBlocks = document.querySelectorAll('.payload-code');
    codeBlocks.forEach(block => {
      block.addEventListener('mouseenter', () => {
        block.style.boxShadow = '0 0 20px rgba(0, 255, 65, 0.5)';
        block.style.borderColor = 'var(--neon-green)';
      });

      block.addEventListener('mouseleave', () => {
        block.style.boxShadow = '';
        block.style.borderColor = '';
      });
    });
  }

  initializeTypewriterEffects() {
    const typewriterElements = document.querySelectorAll('.typewriter');

    typewriterElements.forEach(element => {
      const text = element.textContent;
      element.textContent = '';
      element.style.borderRight = '2px solid var(--neon-green)';

      this.typeText(element, text, 100);
    });
  }

  typeText(element, text, speed) {
    let i = 0;
    const timer = setInterval(() => {
      element.textContent += text.charAt(i);
      i++;

      if (i >= text.length) {
        clearInterval(timer);
        // Blinking cursor effect
        setInterval(() => {
          element.style.borderRight = element.style.borderRight === 'none'
            ? '2px solid var(--neon-green)'
            : 'none';
        }, 530);
      }
    }, speed);
  }

  // Terminal animation for hero section
  initializeTerminalAnimation() {
    // Prevent multiple terminal animations
    if (window.terminalAnimationRunning) return;
    window.terminalAnimationRunning = true;

    const typewriterElement = document.getElementById('typewriter');
    const outputElement = document.getElementById('terminal-output');
    if (!typewriterElement || !outputElement) return;

    const commands = [
      {
        command: 'curl -s localhost:3000/api/status && whoami',
        output: `
🌐 XSSNow Web Application Status:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Server Status: Online
📊 Database: 876 XSS payloads loaded
🚀 API Endpoints: /payloads, /search, /generate
🔥 Active Users: 247 security researchers
📈 Success Rate: 94.2% payload effectiveness
🛡️ WAF Bypass Coverage: 15+ protection systems

⚡ Latest Features:
• Advanced search & filtering
• Real-time payload testing
• Built with community contributions

🥷 Current User: ninja
🎯 Access Level: root
💻 Session: Active since 2 hours ago
⭐ Please leave us a star on github`
      }
    ];

    let currentCommand = 0;

    const runCommand = () => {
      const cmd = commands[currentCommand];
      this.typeHeroTerminalCommand(typewriterElement, outputElement, cmd.command, cmd.output, () => {
        currentCommand = (currentCommand + 1) % commands.length;
        setTimeout(runCommand, 5000);
      });
    };

    // Start the terminal animation after a short delay
    setTimeout(runCommand, 1000);
  }

  typeHeroTerminalCommand(commandElement, outputElement, command, output, callback) {
    // Clear any existing timers and content
    if (this.terminalTimer) {
      clearInterval(this.terminalTimer);
    }
    if (this.outputTimer) {
      clearInterval(this.outputTimer);
    }

    commandElement.textContent = '';
    outputElement.innerHTML = '';

    // Type the command
    this.typeTerminalText(commandElement, command, 80, () => {
      // After command is typed, show output after a brief pause
      setTimeout(() => {
        const outputLines = output.split('\n');
        this.typeOutputLines(outputElement, outputLines, 0, () => {
          // Wait a bit before running next command
          setTimeout(() => {
            callback();
          }, 3000);
        });
      }, 1000);
    });
  }

  typeTerminalText(element, text, speed, callback) {
    let i = 0;
    element.textContent = '';
    this.terminalTimer = setInterval(() => {
      if (i < text.length) {
        element.textContent = text.substring(0, i + 1);
        i++;
      } else {
        clearInterval(this.terminalTimer);
        this.terminalTimer = null;
        if (callback) callback();
      }
    }, speed);
  }

  typeOutputLines(outputElement, lines, lineIndex, callback) {
    if (lineIndex >= lines.length) {
      if (callback) callback();
      return;
    }

    const line = document.createElement('div');
    line.style.color = 'var(--neon-green)';
    line.style.marginBottom = '4px';
    line.textContent = lines[lineIndex]; // Set text directly without animation for now
    outputElement.appendChild(line);

    // Move to next line after a small delay
    setTimeout(() => {
      this.typeOutputLines(outputElement, lines, lineIndex + 1, callback);
    }, 100);
  }

  // Particle system
  createParticleSystem() {
    const container = document.createElement('div');
    container.className = 'particle-system';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '-1';

    document.body.appendChild(container);

    setInterval(() => {
      this.createParticle(container);
    }, 2000);
  }

  createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.position = 'absolute';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.backgroundColor = 'var(--neon-green)';
    particle.style.borderRadius = '50%';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = '100%';
    particle.style.opacity = '0.7';

    container.appendChild(particle);

    // Animate particle
    const animation = particle.animate([
      {
        transform: 'translateY(0) translateX(0) rotateZ(0deg)',
        opacity: 1
      },
      {
        transform: `translateY(-100vh) translateX(${Math.random() * 200 - 100}px) rotateZ(360deg)`,
        opacity: 0
      }
    ], {
      duration: 4000 + Math.random() * 2000,
      easing: 'linear'
    });

    animation.onfinish = () => {
      particle.remove();
    };
  }

  // Scanline effect
  addScanlineEffect() {
    const scanline = document.createElement('div');
    scanline.className = 'scanline-effect';
    scanline.style.position = 'fixed';
    scanline.style.top = '0';
    scanline.style.left = '0';
    scanline.style.width = '100%';
    scanline.style.height = '2px';
    scanline.style.background = 'linear-gradient(90deg, transparent, var(--neon-cyan), transparent)';
    scanline.style.zIndex = '9999';
    scanline.style.pointerEvents = 'none';
    scanline.style.opacity = '0.6';

    document.body.appendChild(scanline);

    // Animate scanline
    scanline.animate([
      { transform: 'translateY(0)' },
      { transform: 'translateY(100vh)' }
    ], {
      duration: 3000,
      iterations: Infinity,
      easing: 'linear'
    });
  }

  // Screen shake effect
  shakeScreen(duration = 500) {
    const shake = [
      { transform: 'translate(0, 0) rotate(0deg)' },
      { transform: 'translate(-2px, 2px) rotate(1deg)' },
      { transform: 'translate(2px, -2px) rotate(-1deg)' },
      { transform: 'translate(-2px, -2px) rotate(1deg)' },
      { transform: 'translate(2px, 2px) rotate(-1deg)' },
      { transform: 'translate(0, 0) rotate(0deg)' }
    ];

    document.body.animate(shake, {
      duration: duration,
      iterations: 1
    });
  }

  // Add dynamic background effects
  addBackgroundEffects() {
    const bg = document.createElement('div');
    bg.className = 'dynamic-bg';
    bg.style.position = 'fixed';
    bg.style.top = '0';
    bg.style.left = '0';
    bg.style.width = '100%';
    bg.style.height = '100%';
    bg.style.zIndex = '-2';
    bg.style.background = `
      radial-gradient(circle at 20% 50%, rgba(0, 255, 65, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(0, 245, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(255, 0, 128, 0.1) 0%, transparent 50%)
    `;

    document.body.appendChild(bg);

    // Animate background gradients
    setInterval(() => {
      bg.style.background = `
        radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(0, 255, 65, 0.1) 0%, transparent 50%),
        radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(0, 245, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(255, 0, 128, 0.1) 0%, transparent 50%)
      `;
    }, 5000);
  }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.animationController = new AnimationController();
});

// Add matrix column animation styles
const matrixStyles = `
<style>
.matrix-column {
  position: absolute;
  top: -100px;
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 20px;
  color: var(--matrix-green);
  animation: matrix-fall 4s linear infinite;
  pointer-events: none;
}

.matrix-column span {
  display: block;
  text-shadow: 0 0 5px currentColor;
}

@keyframes matrix-fall {
  from {
    transform: translateY(-100vh);
    opacity: 1;
  }
  to {
    transform: translateY(100vh);
    opacity: 0;
  }
}

.glitching {
  animation: textShadowGlitch 0.5s linear;
}

.terminal-command-line {
  margin: 10px 0;
  font-family: var(--font-mono);
}

.terminal-prompt {
  color: var(--neon-green);
  font-weight: bold;
}

.particle-system .particle {
  box-shadow: 0 0 10px currentColor;
}

.scanline-effect {
  box-shadow: 0 0 20px var(--neon-cyan);
}

@media (max-width: 768px) {
  .matrix-column {
    font-size: 12px;
    line-height: 16px;
  }
}

/* Reduced motion overrides */
@media (prefers-reduced-motion: reduce) {
  .matrix-column,
  .particle,
  .scanline-effect {
    animation: none !important;
    opacity: 0.3;
  }

  .glitching {
    animation: none !important;
  }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', matrixStyles);

// Initialize animation controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Prevent multiple instances
  if (!window.animationControllerInitialized) {
    window.animationControllerInitialized = true;
    new AnimationController();
  }
});