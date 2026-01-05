/* Modern Payloads Page JavaScript */

class PayloadsManager {
  constructor() {
    this.payloads = [];
    this.filteredPayloads = [];
    this.currentView = 'cards';
    this.filters = {
      search: '',
      category: 'all',
      context: [],
      features: []
    };

    this.init();
  }

  async init() {
    await this.loadPayloads();
    this.setupEventListeners();
    this.renderPayloads();
    this.updateStats();
  }

  async loadPayloads() {
    try {
      const response = await fetch('data/payloads.yaml?v=' + Date.now(), {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const yamlText = await response.text();
      const yamlData = jsyaml.load(yamlText) || {};
      this.payloads = yamlData.payloads || [];

      this.filteredPayloads = [...this.payloads];

    } catch (error) {
      console.error('Failed to load payloads:', error);
      this.payloads = this.getFallbackPayloads();
      this.filteredPayloads = [...this.payloads];
    }
  }

  setupEventListeners() {
    // Search
    const searchInput = document.getElementById('payloadSearch');
    const clearSearch = document.getElementById('clearSearch');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filters.search = e.target.value.trim();
        this.applyFilters();

        if (clearSearch) {
          clearSearch.style.display = this.filters.search ? 'block' : 'none';
        }
      });
    }

    if (clearSearch) {
      clearSearch.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        this.filters.search = '';
        clearSearch.style.display = 'none';
        this.applyFilters();
      });
    }

    // Category filters (radio buttons)
    const categoryInputs = document.querySelectorAll('input[name="category"]');
    categoryInputs.forEach(input => {
      input.addEventListener('change', () => {
        this.filters.category = input.value;

        // Clear other filters when switching to expert to avoid conflicts
        if (input.value === 'expert') {
          this.filters.context = [];
          this.filters.features = [];
          this.filters.search = '';

          // Clear search input
          const searchInput = document.getElementById('payloadSearch');
          if (searchInput) searchInput.value = '';

          // Clear context checkboxes
          document.querySelectorAll('input[name="context"]:checked').forEach(cb => cb.checked = false);

          // Clear feature checkboxes
          document.querySelectorAll('input[name="features"]:checked').forEach(cb => cb.checked = false);
        }

        this.applyFilters();
      });
    });

    // Context filters (checkboxes)
    const contextInputs = document.querySelectorAll('input[name="context"]');
    contextInputs.forEach(input => {
      input.addEventListener('change', () => {
        this.updateCheckboxFilter('context', input.value, input.checked);
      });
    });

    // Feature filters (checkboxes)
    const featureInputs = document.querySelectorAll('input[name="feature"]');
    featureInputs.forEach(input => {
      input.addEventListener('change', () => {
        this.updateCheckboxFilter('features', input.value, input.checked);
      });
    });

    // Initialize context filters as all checked
    contextInputs.forEach(input => {
      if (input.checked) {
        this.filters.context.push(input.value);
      }
    });

    // View toggles
    const viewToggles = document.querySelectorAll('.view-toggle');
    viewToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const view = toggle.dataset.view;
        if (view !== this.currentView) {
          viewToggles.forEach(t => t.classList.remove('active'));
          toggle.classList.add('active');
          this.currentView = view;
          this.renderPayloads();
        }
      });
    });

    // Reset filters
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        this.resetFilters();
      });
    }

    // Download filtered
    const downloadBtn = document.getElementById('downloadFiltered');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        this.downloadFiltered();
      });
    }
  }

  updateCheckboxFilter(filterType, value, checked) {
    if (checked) {
      if (!this.filters[filterType].includes(value)) {
        this.filters[filterType].push(value);
      }
    } else {
      this.filters[filterType] = this.filters[filterType].filter(v => v !== value);
    }
    this.applyFilters();
  }

  applyFilters() {
    this.filteredPayloads = this.payloads.filter(payload => {
      // Search filter - prioritize payload code matching
      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase();

        // Check if the search term matches the payload code directly
        const codeMatch = payload.code.toLowerCase().includes(searchTerm);

        // Check other fields as secondary match
        const secondaryText = [
          payload.description || '',
          payload.category || '',
          ...(payload.tags || [])
        ].join(' ').toLowerCase();
        const secondaryMatch = secondaryText.includes(searchTerm);

        // Return true if either primary (code) or secondary match is found
        if (!codeMatch && !secondaryMatch) {
          return false;
        }
      }

      // Category filter
      if (this.filters.category !== 'all') {
        const category = (payload.category || 'basic').toLowerCase();
        const filterCategory = this.filters.category === 'expert' ? 'research' : this.filters.category;
        if (category !== filterCategory) {
          return false;
        }
      }

      // Context filter
      if (this.filters.context.length > 0) {
        const payloadTags = payload.tags || [];
        const hasContext = this.filters.context.some(context =>
          payloadTags.some(tag => tag.toLowerCase().includes(context))
        );
        if (!hasContext) {
          return false;
        }
      }

      // Feature filters
      if (this.filters.features.length > 0) {
        for (const feature of this.filters.features) {
          if (!this.payloadHasFeature(payload, feature)) {
            return false;
          }
        }
      }

      return true;
    });

    this.renderPayloads();
    this.updateStats();
  }

  payloadHasFeature(payload, feature) {
    const code = payload.code;

    switch (feature) {
      case 'no-parentheses':
        return !code.includes('(') && !code.includes(')');
      case 'no-quotes':
        return !code.includes('"') && !code.includes("'");
      case 'no-brackets':
        return !code.includes('<') && !code.includes('>');
      case 'short':
        return code.length < 50;
      default:
        return false;
    }
  }

  renderPayloads() {
    const container = document.getElementById('payloadsContainer');
    if (!container) return;

    if (this.filteredPayloads.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-search"></i>
          <h3>No payloads found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      `;
      this.ensureExportButtonVisible();
      return;
    }

    if (this.currentView === 'cards') {
      this.renderCardsView(container);
    } else {
      this.renderListView(container);
    }

    this.setupPayloadEventListeners();
    this.ensureExportButtonVisible();
  }

  ensureExportButtonVisible() {
    // Ensure export button remains visible after view changes
    const exportBtn = document.getElementById('downloadFiltered');
    if (exportBtn) {
      exportBtn.style.display = 'flex';
      exportBtn.style.visibility = 'visible';
      exportBtn.style.opacity = '1';
    }
  }

  renderCardsView(container) {
    const cardsHTML = this.filteredPayloads.map((payload, index) => {
      const isExpert = payload.category === 'research';
      const authorInfo = isExpert ? this.renderAuthorInfo(payload) : '';

      return `
        <div class="payload-card ${isExpert ? 'curated-payload' : ''}">
          <div class="payload-header">
            <span class="payload-category">${this.escapeHtml(payload.category || 'XSS')}</span>
            <div class="payload-actions">
              <button data-action="copy" data-index="${index}" title="Copy">
                <i class="fas fa-copy"></i>
              </button>
              <button data-action="bookmark" data-index="${index}" title="Bookmark">
                <i class="fas fa-bookmark"></i>
              </button>
            </div>
          </div>
          ${authorInfo}
          <div class="payload-code">
            <code>${this.escapeHtml(payload.code)}</code>
          </div>
          <div class="payload-description">
            <p>${this.escapeHtml(payload.description || '')}</p>
          </div>
          <div class="payload-meta">
            <span class="payload-context">${this.getContextFromTags(payload.tags)}</span>
            <span class="payload-length">${payload.code.length} chars</span>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `<div class="payloads-grid">${cardsHTML}</div>`;
  }

  renderAuthorInfo(payload) {
    const authorName = this.escapeHtml(payload.contributor || 'Anonymous');
    const githubUsername = payload.github_username || '';
    const country = payload.country || 'Unknown';
    const avatarUrl = githubUsername ? `https://github.com/${githubUsername}.png?size=40` : '';

    return `
      <div class="payload-author">
        <div class="author-avatar">
          ${avatarUrl ?
            `<img src="${avatarUrl}" alt="${authorName}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
             <div class="avatar-fallback" style="display:none">${authorName.charAt(0).toUpperCase()}</div>` :
            `<div class="avatar-fallback">${authorName.charAt(0).toUpperCase()}</div>`
          }
        </div>
        <div class="author-info">
          <div class="author-name">
            ${githubUsername ?
              `<a href="https://github.com/${githubUsername}" target="_blank" rel="noopener">${authorName}</a>` :
              authorName
            }
            <span class="curated-badge">🔬</span>
          </div>
          <div class="author-meta">
            ${githubUsername ? `@${githubUsername}` : ''} ${country !== 'Unknown' ? `• ${country}` : ''}
          </div>
        </div>
      </div>
    `;
  }

  renderListView(container) {
    const listHTML = this.filteredPayloads.map((payload, index) => `
      <div class="payload-list-item">
        <span class="payload-list-category">${this.escapeHtml(payload.category || 'XSS')}</span>
        <code class="payload-list-code">${this.escapeHtml(payload.code)}</code>
        <div class="payload-list-meta">
          <span>${this.getContextFromTags(payload.tags)}</span>
          <span>${payload.code.length} chars</span>
        </div>
        <div class="payload-list-actions">
          <button data-action="copy" data-index="${index}" title="Copy">
            <i class="fas fa-copy"></i>
          </button>
          <button data-action="bookmark" data-index="${index}" title="Bookmark">
            <i class="fas fa-bookmark"></i>
          </button>
        </div>
      </div>
    `).join('');

    container.innerHTML = `<div class="payloads-list">${listHTML}</div>`;
  }

  setupPayloadEventListeners() {
    const actionButtons = document.querySelectorAll('[data-action]');
    actionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        const index = parseInt(e.currentTarget.dataset.index);
        const payload = this.filteredPayloads[index];

        if (action === 'copy' && payload) {
          this.copyPayload(payload.code, e.currentTarget);
        } else if (action === 'bookmark' && payload) {
          this.bookmarkPayload(payload, e.currentTarget);
        }
      });
    });
  }

  copyPayload(code, button) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.color = 'var(--neon-green)';

        setTimeout(() => {
          button.innerHTML = originalIcon;
          button.style.color = '';
        }, 1500);
      }).catch(err => {
        console.error('Failed to copy payload:', err);
        this.fallbackCopyText(code, button);
      });
    } else {
      this.fallbackCopyText(code, button);
    }
  }

  fallbackCopyText(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.color = 'var(--neon-green)';

        setTimeout(() => {
          button.innerHTML = originalIcon;
          button.style.color = '';
        }, 1500);
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
    } finally {
      document.body.removeChild(textArea);
    }
  }

  bookmarkPayload(payload, button) {
    const bookmarks = JSON.parse(localStorage.getItem('xssnow-bookmarks') || '[]');
    const isBookmarked = bookmarks.some(b => b.code === payload.code);

    if (isBookmarked) {
      const filteredBookmarks = bookmarks.filter(b => b.code !== payload.code);
      localStorage.setItem('xssnow-bookmarks', JSON.stringify(filteredBookmarks));
      button.innerHTML = '<i class="fas fa-bookmark"></i>';
      button.style.color = '';
    } else {
      bookmarks.push({
        ...payload,
        bookmarkedAt: new Date().toISOString()
      });
      localStorage.setItem('xssnow-bookmarks', JSON.stringify(bookmarks));
      button.innerHTML = '<i class="fas fa-bookmark"></i>';
      button.style.color = 'var(--neon-green)';
    }
  }

  resetFilters() {
    const searchInput = document.getElementById('payloadSearch');
    const clearSearch = document.getElementById('clearSearch');
    if (searchInput) searchInput.value = '';
    if (clearSearch) clearSearch.style.display = 'none';

    const allCategoryRadio = document.querySelector('input[name="category"][value="all"]');
    if (allCategoryRadio) allCategoryRadio.checked = true;

    const contextInputs = document.querySelectorAll('input[name="context"]');
    contextInputs.forEach(input => input.checked = true);

    const featureInputs = document.querySelectorAll('input[name="feature"]');
    featureInputs.forEach(input => input.checked = false);

    this.filters = {
      search: '',
      category: 'all',
      context: ['html', 'javascript', 'css', 'attribute', 'url'],
      features: []
    };

    this.applyFilters();
  }

  downloadFiltered() {
    if (this.filteredPayloads.length === 0) {
      alert('No payloads to export. Try adjusting your filters.');
      return;
    }

    const payloadLines = this.filteredPayloads
      .map(payload => payload.code.trim())
      .filter(code => code.length > 0)
      .join('\n');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `xssnow-filtered-payloads-${timestamp}.txt`;

    const blob = new Blob([payloadLines], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

  }

  updateStats() {
    const totalCountEl = document.getElementById('totalCount');
    const downloadCountEl = document.getElementById('downloadCount');

    if (totalCountEl) {
      totalCountEl.textContent = this.payloads.length;
    }

    if (downloadCountEl) {
      downloadCountEl.textContent = this.filteredPayloads.length;
    }
  }

  getContextFromTags(tags) {
    if (!tags || !Array.isArray(tags)) return 'HTML';

    const contextTags = ['html', 'javascript', 'css', 'attribute', 'url', 'dom', 'json', 'xml'];
    const foundContext = tags.find(tag =>
      contextTags.some(context => tag.toLowerCase().includes(context))
    );

    return foundContext ? foundContext.toUpperCase() : 'HTML';
  }

  escapeHtml(text) {
    if (typeof text !== 'string') return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  getFallbackPayloads() {
    return [
      {
        code: '<script>alert("XSS")</script>',
        category: 'basic',
        tags: ['basic', 'script', 'alert'],
        description: 'Basic script tag XSS payload',
        contributor: 'XSSNow',
        date_added: '2024-12-31'
      },
      {
        code: '<img src=x onerror=alert("XSS")>',
        category: 'basic',
        tags: ['basic', 'img', 'onerror'],
        description: 'Image tag with onerror event',
        contributor: 'XSSNow',
        date_added: '2024-12-31'
      },
      {
        code: '<svg onload=alert("XSS")>',
        category: 'bypass',
        tags: ['svg', 'onload', 'bypass'],
        description: 'SVG tag with onload event',
        contributor: 'XSSNow',
        date_added: '2024-12-31'
      },
      {
        code: 'javascript:alert("XSS")',
        category: 'basic',
        tags: ['javascript', 'url'],
        description: 'JavaScript URL scheme',
        contributor: 'XSSNow',
        date_added: '2024-12-31'
      },
      {
        code: '<iframe src=javascript:alert("XSS")>',
        category: 'basic',
        tags: ['iframe', 'javascript'],
        description: 'Iframe with JavaScript URL',
        contributor: 'XSSNow',
        date_added: '2024-12-31'
      }
    ];
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.payloadsManager = new PayloadsManager();
});