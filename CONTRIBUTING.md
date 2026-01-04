# 🤝 Contributing to XSSNow

<div align="center">

![XSSNow Logo](/assets/xss_now_logo.png)

**Share Your XSS Discoveries. Become a Recognized Contributor.**

[![Get Listed As Contributor](https://img.shields.io/badge/🌐_Find_Contributors-xssnow.in-00d4aa?style=for-the-badge)](https://xssnow.in/contributors.html)

</div>

---

## 🎯 **How to Add Your Payload**

### **Step 1: Fork the Repository**
Fork the XSSNow repository on GitHub to your account: [Fork Repository](https://github.com/dr34mhacks/XSSNow/fork)

### **Step 2: Add Your Payload**
Edit `data/payloads.yaml` and add your XSS payload using YAML format (no escaping needed!):

```yaml
- code: |
    <script>alert("Hello World")</script>
  description: "Description of what your payload does"
  category: "advanced"
  contributor: "Your Full Name"
  github_username: "your-github-username"
  country: "Your Country"
  tags: ["bypass", "script", "alert"]
  browsers: ["Chrome", "Firefox", "Safari", "Edge"]
  date_added: "31-12-2025"
```

### **📝 Format Notes:**
- **Date Format:** Use DD-MM-YYYY format (e.g., "31-12-2025")
- **Contributor:** Use your full name
- **GitHub Username:** Your GitHub username for profile linking
- **Tags & Browsers:** Use inline array format ["item1", "item2"]

### **Step 3: Test Your Payload**
Before submitting, ensure your payload:
- ✅ Works in specified browsers
- ✅ Is properly categorized
- ✅ Has clear description and context
- ✅ Follows ethical usage guidelines

### **Step 4: Submit Pull Request**
Create a pull request with your contribution. Include:
- ✅ Clear PR title
- ✅ Payload testing results
- ✅ Browser compatibility notes
- ✅ Proper contributor attribution

### **Step 5: Get Featured!**
Once merged, you'll be featured on our contributors leaderboard and your payloads will help the security community!

Benefits:
- 🏆 Leaderboard recognition
- 👥 Community impact
- ⭐ Security researcher credit

---

## 📋 **Available Categories**

Choose the most appropriate category for your payload:

- **basic** - Simple, fundamental XSS vectors
- **advanced** - Complex techniques requiring expertise
- **research** - Well-researched, expertly validated payloads
- **bypass** - Filter and encoding bypass methods
- **waf** - Web Application Firewall evasion
- **csp** - Content Security Policy bypasses
- **polyglot** - Multi-context universal payloads
- **mobile** - Mobile-specific attack vectors
- **dom** - DOM-based XSS techniques
- **event** - Event handler based attacks
- **browser** - Browser-specific quirks and features
- **framework** - Framework-specific vulnerabilities
- **context** - Context-specific injection methods
- **unicode** - Unicode and encoding attacks
- **blind** - Blind XSS techniques
- **social** - Social engineering combined XSS
- **api** - API-related XSS vectors
- **unique** - Rare or unique attack methods
- **non-english** - Non-English character attacks

---

## 🏆 **Contributor Recognition**

### **Automatic Benefits:**
- Your name appears on [Contributors Page](https://xssnow.in/contributors.html)
- GitHub profile linked to your contributions
- Payload attribution with your name/handle
- Recognition in the security community

### **Recognition Levels:**
- **🌟 New Contributor** - First payload accepted
- **🔥 Active Contributor** - Multiple quality payloads
- **🔬 Expert Contributor** - Advanced research-grade techniques and mentoring
- **⚡ Master Contributor** - Exceptional contributions and community leadership

---

## ✅ **Quality Guidelines**

### **We Accept:**
- Original XSS payloads you've discovered or created
- Well-tested payloads that work in real scenarios
- Clear descriptions of how and why they work
- Proper categorization and metadata

### **We Don't Accept:**
- Untested or theoretical payloads
- Poorly documented submissions

---

<div align="center">

## 🚀 **Ready to Contribute?**

**Your expertise helps secure the web for everyone.**

[![Fork & Contribute](https://img.shields.io/badge/Fork_&_Contribute-Now-00d4aa?style=for-the-badge)](https://github.com/dr34mhacks/XSSNow/fork)

</div>