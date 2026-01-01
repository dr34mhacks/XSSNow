/**
 * XSSNow - Ultimate XSS Payload Arsenal
 * Author: Sid Joshi (@dr34mhacks)
 * GitHub: https://github.com/dr34mhacks/XSSNow
 * Website: https://xssnow.in
 * LinkedIn: https://www.linkedin.com/in/sid-j0shi/
 *
 * Built with ❤️ for the security research community
 * Licensed under MIT License
 */

(function() {
    'use strict';

    const styles = {
        title: 'color: #00ff41; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px rgba(0,255,65,0.5);',
        author: 'color: #fff; font-size: 16px; font-weight: bold;',
        info: 'color: #ccc; font-size: 14px;',
        warning: 'color: #ffa500; font-size: 12px; font-weight: bold;',
        link: 'color: #00d4aa; font-size: 12px;'
    };

    const asciiArt = `
    ██╗  ██╗███████╗███████╗███╗   ██╗ ██████╗ ██╗    ██╗
    ╚██╗██╔╝██╔════╝██╔════╝████╗  ██║██╔═══██╗██║    ██║
     ╚███╔╝ ███████╗███████╗██╔██╗ ██║██║   ██║██║ █╗ ██║
     ██╔██╗ ╚════██║╚════██║██║╚██╗██║██║   ██║██║███╗██║
    ██╔╝ ██╗███████║███████║██║ ╚████║╚██████╔╝╚███╔███╔╝
    ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚══╝╚══╝
    `;

    console.log(`%c${asciiArt}`, styles.title);
    console.log('%c🥷 XSSNow - Ultimate XSS Payload Arsenal', styles.title);
    console.log('%c════════════════════════════════════════', 'color: #00ff41;');
    console.log('%c👨‍💻 Author: Sid Joshi (@dr34mhacks)', styles.author);
    console.log('%c🔗 GitHub: https://github.com/dr34mhacks', styles.link);
    console.log('%c💼 LinkedIn: https://www.linkedin.com/in/sid-j0shi/', styles.link);
    console.log('%c🌐 Website: https://xssnow.in', styles.link);
    console.log('%c════════════════════════════════════════', 'color: #00ff41;');
    console.log('%c📝 For educational and authorized testing only', styles.warning);
    console.log('%c🛡️ Use responsibly and ethically', styles.warning);
    console.log('%c════════════════════════════════════════', 'color: #00ff41;');
    console.log('%c💡 Found a bug? Contribute: https://github.com/dr34mhacks/XSSNow', styles.info);
    console.log('%c⭐ Like this project? Give it a star!', styles.info);

    // Easter egg for curious developers
    window.author = {
        name: 'Sid Joshi',
        username: 'dr34mhacks',
        github: 'https://github.com/dr34mhacks',
        linkedin: 'https://www.linkedin.com/in/sid-j0shi/',
        project: 'XSSNow',
        website: 'https://xssnow.in',
        message: 'Thanks for checking out the console! 🥷',
        hire: function() {
            console.log('%c💼  Let\'s connect on LinkedIn!', 'color: #00d4aa; font-size: 14px; font-weight: bold;');
            window.open('https://www.linkedin.com/in/sid-j0shi/', '_blank');
        }
    };

    // Add to global scope for easy access
    window.xssnow = {
        author: window.author,
        version: '1.0.0',
        repository: 'https://github.com/dr34mhacks/XSSNow',
        contribute: 'https://github.com/dr34mhacks/XSSNow/blob/main/CONTRIBUTING.md'
    };

})();