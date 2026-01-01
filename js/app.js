/* XSSNow - Main Application JavaScript - Updated 2025-12-31 */

class XSSNow {
  constructor() {
    this.payloadDatabase = [];
    this.filteredPayloads = [];
    this.currentPage = 1;
    this.payloadsPerPage = 12;
    this.searchQuery = '';
    this.activeFilter = 'all';
    this.init();
  }

  init() {
    this.loadPayloads();
    this.setupEventListeners();
    this.initializeAnimations();
    this.setupTheme();
    this.setupNavigation();
    this.displayPayloads();
    this.setupSearch();
    this.startMatrixAnimation();
  }

  loadPayloads() {
    // Initialize with empty database - payloads will be loaded from other sources if needed
    this.payloadDatabase = [];
    this.filteredPayloads = [];
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('payloadSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.filterPayloads();
      });
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filter = e.target.dataset.filter;
        this.setActiveFilter(filter);
      });
    });

    // Load more button
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        this.loadMorePayloads();
      });
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    // Category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const category = e.currentTarget.dataset.category;
        this.filterByCategory(category);
      });
    });

    // Copy payload functionality
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('copy-payload-btn')) {
        const payloadCode = e.target.dataset.payload;
        this.copyToClipboard(payloadCode);
      }
    });

    // Scroll animations
    window.addEventListener('scroll', () => {
      this.handleScrollAnimations();
    });
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const target = e.target.getAttribute('href');

        // Only prevent default for same-page anchors, allow normal page navigation
        if (target && target.startsWith('#')) {
          e.preventDefault();

          // Update active nav link
          navLinks.forEach(l => l.classList.remove('active'));
          e.target.classList.add('active');

          // Smooth scroll to section
          const section = document.querySelector(target);
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }
        // For other links (like payloads.html, contributors.html), allow normal navigation
      });
    });

    // Update active nav on scroll
    window.addEventListener('scroll', () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPos = window.scrollY + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    });
  }

  setupSearch() {
    const searchInput = document.getElementById('payloadSearch');
    if (searchInput) {
      // Add search suggestions
      searchInput.setAttribute('placeholder', 'Search: svg onload, cloudflare bypass, csp evasion...');

      // Search hints
      const searchHints = [
        'svg onload',
        'cloudflare bypass',
        'csp evasion',
        'angular injection',
        'waf bypass',
        'polyglot payload',
        'dom xss'
      ];

      let hintIndex = 0;
      setInterval(() => {
        if (searchInput.value === '') {
          searchInput.setAttribute('placeholder', `Search: ${searchHints[hintIndex]}`);
          hintIndex = (hintIndex + 1) % searchHints.length;
        }
      }, 3000);
    }
  }

  setActiveFilter(filter) {
    this.activeFilter = filter;
    this.currentPage = 1;

    // Update button states
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.filter === filter) {
        btn.classList.add('active');
      }
    });

    this.filterPayloads();
  }

  filterByCategory(category) {
    const categoryMap = {
      'reflected': 'basic',
      'stored': 'advanced',
      'dom': 'advanced',
      'csp': 'csp',
      'waf': 'waf',
      'polyglot': 'polyglot'
    };

    this.setActiveFilter(categoryMap[category] || 'all');

    // Scroll to payloads section
    document.getElementById('payloads').scrollIntoView({ behavior: 'smooth' });
  }

  filterPayloads() {
    let filtered = [...this.payloadDatabase];

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(payload =>
        payload.name.toLowerCase().includes(query) ||
        payload.description.toLowerCase().includes(query) ||
        payload.code.toLowerCase().includes(query) ||
        payload.tags.some(tag => tag.toLowerCase().includes(query)) ||
        payload.context.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(payload => {
        switch (this.activeFilter) {
          case 'basic': return payload.difficulty === 'Basic';
          case 'advanced': return payload.difficulty === 'Advanced' || payload.difficulty === 'Expert';
          case 'bypass': return payload.tags.includes('bypass') || payload.tags.includes('waf');
          case 'polyglot': return payload.tags.includes('polyglot');
          default: return true;
        }
      });
    }

    this.filteredPayloads = filtered;
    this.currentPage = 1;
    this.displayPayloads();
  }

  displayPayloads() {
    const grid = document.getElementById('payloadGrid');
    if (!grid) return;

    const startIndex = 0;
    const endIndex = this.currentPage * this.payloadsPerPage;
    const payloadsToShow = this.filteredPayloads.slice(startIndex, endIndex);

    if (this.currentPage === 1) {
      grid.innerHTML = '';
    }

    payloadsToShow.slice((this.currentPage - 1) * this.payloadsPerPage).forEach((payload, index) => {
      const card = this.createPayloadCard(payload);
      card.style.animationDelay = `${index * 0.1}s`;
      grid.appendChild(card);
    });

    // Update load more button
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
      if (endIndex >= this.filteredPayloads.length) {
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'block';
      }
    }

    // Update results count
    this.updateResultsCount();
  }

  createPayloadCard(payload) {
    const card = document.createElement('div');
    card.className = 'payload-card fade-in-on-scroll';

    const difficultyColor = {
      'Basic': 'var(--neon-green)',
      'Intermediate': 'var(--neon-cyan)',
      'Advanced': 'var(--neon-orange)',
      'Expert': 'var(--neon-pink)'
    };

    const browserIcons = {
      'Chrome': 'fab fa-chrome',
      'Firefox': 'fab fa-firefox',
      'Safari': 'fab fa-safari',
      'Edge': 'fab fa-edge',
      'IE': 'fab fa-internet-explorer'
    };

    card.innerHTML = `
      <div class="payload-header">
        <div class="payload-type" style="background-color: ${difficultyColor[payload.difficulty]}">
          ${payload.difficulty}
        </div>
        <div class="payload-rating">
          ${this.generateStars(payload.rating)}
          <span>${payload.rating}</span>
        </div>
      </div>

      <h3 class="payload-title">${payload.name}</h3>
      <p class="payload-description">${payload.description}</p>

      <div class="payload-code">
        <code>${this.escapeHtml(payload.code)}</code>
        <button class="copy-payload-btn" data-payload="${this.escapeHtml(payload.code)}" title="Copy payload">
          <i class="fas fa-copy"></i>
        </button>
      </div>

      <div class="payload-tags">
        ${payload.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>

      <div class="payload-meta">
        <div class="payload-context">
          <i class="fas fa-code"></i>
          <span>${payload.context}</span>
        </div>
        <div class="payload-browsers">
          ${payload.browsers.map(browser =>
            `<i class="${browserIcons[browser] || 'fas fa-globe'}" title="${browser}"></i>`
          ).join('')}
        </div>
        <div class="payload-effectiveness">
          <span class="effectiveness-label">Success Rate:</span>
          <span class="effectiveness-value">${payload.effectiveness}%</span>
        </div>
      </div>

      <div class="payload-footer">
        <div class="payload-contributor">
          <i class="fas fa-user"></i>
          <span>by ${payload.contributor}</span>
        </div>
        <button class="btn btn-sm btn-primary" onclick="xssNinja.showPayloadDetails(${payload.id})">
          <i class="fas fa-info-circle"></i>
          Details
        </button>
      </div>
    `;

    return card;
  }

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star"></i>';
    }

    return stars;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.showNotification('Payload copied to clipboard!', 'success');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showNotification('Payload copied to clipboard!', 'success');
    });
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
      <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  loadMorePayloads() {
    this.currentPage++;
    this.displayPayloads();
  }

  updateResultsCount() {
    const totalResults = this.filteredPayloads.length;
    const shownResults = Math.min(this.currentPage * this.payloadsPerPage, totalResults);

    // Update any results counter if it exists
    const resultsCounter = document.getElementById('resultsCount');
    if (resultsCounter) {
      resultsCounter.textContent = `Showing ${shownResults} of ${totalResults} payloads`;
    }
  }

  setupTheme() {
    const savedTheme = localStorage.getItem('xss-ninja-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
      themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('xss-ninja-theme', newTheme);

    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
      themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  initializeAnimations() {
    // Animate counter numbers
    this.animateCounters();

    // Setup intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-on-scroll, .slide-in-left-on-scroll, .slide-in-right-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  animateCounters() {
    const counters = document.querySelectorAll('[data-count]');

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60 FPS
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };

      // Start animation when element is visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            updateCounter();
            observer.unobserve(entry.target);
          }
        });
      });

      observer.observe(counter);
    });
  }

  startMatrixAnimation() {
    const matrixBg = document.getElementById('matrix-bg');
    if (!matrixBg) return;

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz<>{}[]()!@#$%^&*+-=|\\/?';

    for (let i = 0; i < 50; i++) {
      const char = document.createElement('div');
      char.className = 'matrix-char';
      char.textContent = chars[Math.floor(Math.random() * chars.length)];
      char.style.left = Math.random() * 100 + 'vw';
      char.style.animationDelay = Math.random() * 3 + 's';
      char.style.animationDuration = (Math.random() * 3 + 2) + 's';
      matrixBg.appendChild(char);
    }

    // Clean up old characters periodically
    setInterval(() => {
      const chars = matrixBg.querySelectorAll('.matrix-char');
      if (chars.length > 100) {
        chars[0].remove();
      }
    }, 5000);
  }

  /* setupTypewriter() - Disabled to prevent irrelevant terminal output
  setupTypewriter() {
    const typewriter = document.getElementById('typewriter');
    const output = document.getElementById('terminal-output');

    if (!typewriter || !output) return;

    const commands = [
      { cmd: 'xss-ninja --scan target.com', response: 'Scanning for XSS vulnerabilities...\n✓ Found 12 injection points\n✓ Generated 47 custom payloads' },
      { cmd: 'xss-ninja --generate --context html', response: 'Generated: <svg onload=alert(document.domain)>\nEffectiveness: 94%\nWAF Status: Bypassed' },
      { cmd: 'xss-ninja --bypass cloudflare', response: 'CloudFlare bypass payload:\n<SVG/oNlOaD=confirm(1)>\nSuccess Rate: 71%' },
      { cmd: 'xss-ninja --polyglot', response: 'Universal polyglot generated!\nWorks in 6 different contexts\nReady for deployment...' }
    ];

    let commandIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;

    const typeSpeed = 100;
    const deleteSpeed = 50;
    const waitTime = 3000;

    function type() {
      const currentCommand = commands[commandIndex];

      if (isWaiting) {
        setTimeout(() => {
          isWaiting = false;
          isDeleting = true;
          type();
        }, waitTime);
        return;
      }

      if (!isDeleting && charIndex < currentCommand.cmd.length) {
        typewriter.textContent = currentCommand.cmd.slice(0, charIndex + 1);
        charIndex++;
        setTimeout(type, typeSpeed);
      } else if (!isDeleting && charIndex === currentCommand.cmd.length) {
        // Show response
        output.innerHTML = `<div class="terminal-response">${currentCommand.response}</div>`;
        isWaiting = true;
        type();
      } else if (isDeleting && charIndex > 0) {
        typewriter.textContent = currentCommand.cmd.slice(0, charIndex - 1);
        charIndex--;
        setTimeout(type, deleteSpeed);
      } else {
        // Move to next command
        isDeleting = false;
        output.innerHTML = '';
        commandIndex = (commandIndex + 1) % commands.length;
        setTimeout(type, typeSpeed);
      }
    }

    type();
  }
  */

  async loadCommunityStats() {
    const leaderboard = document.getElementById('leaderboard');

    if (!leaderboard) {
      return;
    }

    try {
      // Try to load real contributor data from YAML
      const response = await fetch('data/payloads.yaml');
      if (response.ok) {
        const yamlText = await response.text();
        const data = jsyaml.load(yamlText);

        if (data && data.payloads && data.payloads.length > 0) {
          // First try to get recent contributors (last 30 days)
          const recentContributors = this.getTopContributorsFromPayloads(data.payloads);

          if (recentContributors.length > 0) {
            this.displayTopContributors(recentContributors, leaderboard);
            return;
          }

          // If no recent contributors, get all-time contributors
          const allTimeContributors = this.getAllTimeContributorsFromPayloads(data.payloads);

          if (allTimeContributors.length > 0) {
            this.displayTopContributors(allTimeContributors, leaderboard);
            return;
          }
        }
      }
    } catch (error) {
      // Silent fallback
    }

    // Fallback to hardcoded data
    this.displayFallbackContributors(leaderboard);
  }

  getTopContributorsFromPayloads(payloads) {
    // Filter payloads from this month (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0); // Set to beginning of the day


    const recentPayloads = payloads.filter(payload => {
      if (!payload.date_added) {
        return false;
      }

      const payloadDate = this.parseDate(payload.date_added);
      if (!payloadDate || isNaN(payloadDate.getTime())) {
        return false;
      }

      payloadDate.setHours(0, 0, 0, 0);
      return payloadDate >= thirtyDaysAgo;
    });


    // Group payloads by contributor
    const contributorMap = new Map();

    recentPayloads.forEach(payload => {
      const contributor = payload.contributor;
      const githubUsername = payload.github_username || contributor.toLowerCase().replace(/\s+/g, '');

      if (!contributorMap.has(contributor)) {
        contributorMap.set(contributor, {
          name: contributor,
          username: githubUsername,
          payloads: 0,
          lastContribution: payload.date_added,
          avatar: contributor.charAt(0).toUpperCase()
        });
      }

      contributorMap.get(contributor).payloads++;

      // Update last contribution date
      const currentDate = this.parseDate(payload.date_added);
      const lastDate = this.parseDate(contributorMap.get(contributor).lastContribution);
      if (currentDate && lastDate && currentDate > lastDate) {
        contributorMap.get(contributor).lastContribution = payload.date_added;
      }
    });

    // Convert to array and sort by payloads
    const contributors = Array.from(contributorMap.values())
      .sort((a, b) => b.payloads - a.payloads);


    return contributors.slice(0, 5); // Top 5
  }

  getAllTimeContributorsFromPayloads(payloads) {

    // Group all payloads by contributor (no date filtering)
    const contributorMap = new Map();

    payloads.forEach((payload) => {
      if (!payload.contributor) {
        return;
      }

      const contributor = payload.contributor;
      const githubUsername = payload.github_username || contributor.toLowerCase().replace(/\s+/g, '');

      if (!contributorMap.has(contributor)) {
        contributorMap.set(contributor, {
          name: contributor,
          username: githubUsername,
          payloads: 0,
          lastContribution: payload.date_added || 'Unknown',
          avatar: contributor.charAt(0).toUpperCase()
        });
      }

      contributorMap.get(contributor).payloads++;

      // Update last contribution date if available
      if (payload.date_added) {
        const currentDate = this.parseDate(payload.date_added);
        const lastDate = this.parseDate(contributorMap.get(contributor).lastContribution);
        if (currentDate && (!lastDate || currentDate > lastDate)) {
          contributorMap.get(contributor).lastContribution = payload.date_added;
        }
      }
    });

    // Convert to array and sort by payloads
    const contributors = Array.from(contributorMap.values())
      .sort((a, b) => b.payloads - a.payloads);


    return contributors.slice(0, 5); // Top 5
  }

  parseDate(dateStr) {
    // Handle both DD-MM-YYYY and YYYY-MM-DD formats
    if (!dateStr) return new Date(0);


    if (dateStr.includes('/')) {
      // DD/MM/YYYY format
      const [day, month, year] = dateStr.split('/');
      return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    } else if (dateStr.includes('-')) {
      if (dateStr.length === 10 && dateStr.split('-')[0].length === 4) {
        // YYYY-MM-DD format
        return new Date(dateStr);
      } else {
        // DD-MM-YYYY format
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
          const year = parseInt(parts[2], 10);

          if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return new Date(0);
          }

          return new Date(year, month, day);
        }
      }
    }

    return new Date(dateStr);
  }

  displayTopContributors(contributors, leaderboard) {
    if (!leaderboard) {
      return;
    }

    leaderboard.innerHTML = '';

    if (contributors.length === 0) {
      leaderboard.innerHTML = `
        <div class="no-contributors" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
          <h4>No contributors found</h4>
          <a href="contributors.html" class="btn" style="margin-top: 1rem;">View All Contributors</a>
        </div>
      `;
      return;
    }

    contributors.forEach((contributor, index) => {
      const item = document.createElement('div');
      item.className = 'leader-item slide-in-left-on-scroll';
      item.style.animationDelay = `${index * 0.1}s`;

      const safeUsername = contributor.username || 'unknown';
      const safeName = contributor.name || 'Unknown';
      const safePayloads = contributor.payloads || 0;
      const safeAvatar = contributor.avatar || safeName.charAt(0).toUpperCase();

      item.innerHTML = `
        <div class="leader-rank">#${index + 1}</div>
        <div class="leader-avatar">
          <img src="https://github.com/${safeUsername}.png"
               alt="${safeName}"
               style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div style="display: none; width: 40px; height: 40px; background: var(--neon-green); color: var(--bg-primary); border-radius: 50%; justify-content: center; align-items: center; font-weight: bold; font-size: 1.2rem;">${safeAvatar}</div>
        </div>
        <div class="leader-info">
          <div class="leader-name">${safeName}</div>
          <div class="leader-stats">${safePayloads} payload${safePayloads !== 1 ? 's' : ''} • @${safeUsername}</div>
        </div>
        <div class="leader-score">${(safePayloads * 125).toLocaleString()}</div>
      `;

      leaderboard.appendChild(item);
    });
  }

  displayFallbackContributors(leaderboard) {
    const fallbackContributors = [
      { name: 'Sid Joshi', username: 'dr34mhacks', payloads: 25, avatar: 'S' },
      { name: 'Sandeep Wawdane', username: 'thecybersandeep', payloads: 18, avatar: 'S' }
    ];

    this.displayTopContributors(fallbackContributors, leaderboard);
  }

  showPayloadDetails(payloadId) {
    const payload = this.payloadDatabase.find(p => p.id === payloadId);
    if (!payload) return;

    // Create modal content
    const modalContent = `
      <div class="modal-overlay active" id="payloadModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">${payload.name}</h3>
            <button class="modal-close" onclick="xssNinja.closeModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="payload-detail-info">
              <div class="detail-section">
                <h4>Payload Code</h4>
                <div class="code-block">
                  <div class="code-header">
                    <span class="code-language">${payload.context}</span>
                    <button class="code-copy" onclick="xssNinja.copyToClipboard('${this.escapeHtml(payload.code)}')">
                      <i class="fas fa-copy"></i> Copy
                    </button>
                  </div>
                  <div class="code-body">
                    <pre>${this.escapeHtml(payload.code)}</pre>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h4>Description</h4>
                <p>${payload.description}</p>
              </div>

              <div class="detail-grid">
                <div class="detail-item">
                  <strong>Context:</strong>
                  <span>${payload.context}</span>
                </div>
                <div class="detail-item">
                  <strong>Difficulty:</strong>
                  <span class="badge badge-${payload.difficulty.toLowerCase()}">${payload.difficulty}</span>
                </div>
                <div class="detail-item">
                  <strong>Effectiveness:</strong>
                  <span>${payload.effectiveness}%</span>
                </div>
                <div class="detail-item">
                  <strong>Contributor:</strong>
                  <span>${payload.contributor}</span>
                </div>
              </div>

              <div class="detail-section">
                <h4>Browser Support</h4>
                <div class="browser-support">
                  ${payload.browsers.map(browser => `
                    <div class="browser-item">
                      <i class="${this.getBrowserIcon(browser)}"></i>
                      <span>${browser}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="detail-section">
                <h4>Tags</h4>
                <div class="tag-container">
                  ${payload.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
              </div>

              ${payload.restrictions.length > 0 ? `
                <div class="detail-section">
                  <h4>Bypassed Restrictions</h4>
                  <ul class="restrictions-list">
                    ${payload.restrictions.map(restriction => `<li>${restriction}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalContent);
  }

  getBrowserIcon(browser) {
    const icons = {
      'Chrome': 'fab fa-chrome',
      'Firefox': 'fab fa-firefox',
      'Safari': 'fab fa-safari',
      'Edge': 'fab fa-edge',
      'IE': 'fab fa-internet-explorer'
    };
    return icons[browser] || 'fas fa-globe';
  }

  closeModal() {
    const modal = document.getElementById('payloadModal');
    if (modal) {
      modal.remove();
    }
  }

  handleScrollAnimations() {
    // Add navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
}

// Utility functions
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.xssNinja = new XSSNow();
});

// Add notification styles
const notificationStyles = `
<style>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--neon-green);
  border-radius: var(--border-radius);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  z-index: 10000;
  transform: translateX(100%);
  opacity: 0;
  transition: all 0.3s ease;
  box-shadow: var(--glow-green);
  backdrop-filter: blur(20px);
}

.notification.show {
  transform: translateX(0);
  opacity: 1;
}

.notification-success {
  border-color: var(--neon-green);
  color: var(--neon-green);
}

.notification-error {
  border-color: var(--neon-pink);
  color: var(--neon-pink);
}

.notification-info {
  border-color: var(--neon-cyan);
  color: var(--neon-cyan);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.detail-item {
  padding: 0.8rem;
  background: var(--bg-tertiary);
  border-radius: var(--border-radius);
  border: 1px solid rgba(0, 255, 65, 0.2);
}

.detail-item strong {
  display: block;
  color: var(--text-primary);
  margin-bottom: 0.3rem;
}

.detail-section {
  margin: 1.5rem 0;
}

.detail-section h4 {
  color: var(--neon-green);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.browser-support {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.browser-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-tertiary);
  border-radius: var(--border-radius);
  border: 1px solid rgba(0, 255, 65, 0.2);
}

.browser-item i {
  font-size: 1.2rem;
}

.restrictions-list {
  list-style: none;
  padding: 0;
}

.restrictions-list li {
  padding: 0.5rem;
  background: rgba(255, 69, 0, 0.1);
  border: 1px solid var(--neon-orange);
  border-radius: var(--border-radius);
  margin-bottom: 0.5rem;
  color: var(--neon-orange);
}

.badge-basic { background: var(--neon-green); }
.badge-intermediate { background: var(--neon-cyan); }
.badge-advanced { background: var(--neon-orange); }
.badge-expert { background: var(--neon-pink); }

@media (max-width: 768px) {
  .notification {
    right: 10px;
    left: 10px;
    transform: translateY(-100%);
  }

  .notification.show {
    transform: translateY(0);
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .browser-support {
    flex-direction: column;
  }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);