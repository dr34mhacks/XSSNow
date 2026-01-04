/* XSSNow - Contributors Management System */

class ContributorsManager {
    constructor() {
        this.contributors = [];
        this.payloadData = null;
        this.init();
    }

    async init() {
        try {
            await this.loadPayloads();
            this.generateContributorsFromPayloads();
            this.displayContributors();
            this.updateStats();
        } catch (error) {
            this.showError();
        }
    }

    async loadPayloads() {
        try {
            const response = await fetch('data/payloads.yaml?v=' + Date.now(), {
                method: 'GET',
                cache: 'no-cache',
                headers: {
                    'Accept': 'text/plain',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to load payloads.yaml: ${response.status} ${response.statusText}`);
            }
            const yamlText = await response.text();

            if (!yamlText || yamlText.trim() === '') {
                throw new Error('YAML file is empty');
            }

            this.payloadData = jsyaml.load(yamlText);

            if (!this.payloadData || !this.payloadData.payloads) {
                throw new Error('Invalid YAML structure - no payloads found');
            }

            // Successfully loaded payloads
        } catch (error) {
            // Fallback to dummy data if YAML fails to load
            this.payloadData = this.createFallbackData();
        }
    }

    createFallbackData() {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        const twoWeeksAgo = new Date(today);
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        // Helper function to format date as DD-MM-YYYY
        const formatDate = (date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };

        return {
            payloads: [
                {
                    contributor: "Sid Joshi",
                    github_username: "dr34mhacks",
                    country: "India",
                    category: "basic",
                    tags: ["alert", "basic", "script"],
                    date_added: formatDate(today)
                },
                {
                    contributor: "Sandeep Wawdane",
                    github_username: "thecybersandeep",
                    country: "India",
                    category: "advanced",
                    tags: ["bypass", "encoding"],
                    date_added: formatDate(yesterday)
                },
                {
                    contributor: "Sid Joshi",
                    github_username: "dr34mhacks",
                    country: "India",
                    category: "basic",
                    tags: ["research", "payloads"],
                    date_added: formatDate(lastWeek)
                },
                {
                    contributor: "Sandeep Wawdane",
                    github_username: "thecybersandeep",
                    country: "India",
                    category: "advanced",
                    tags: ["waf-bypass", "obfuscation"],
                    date_added: formatDate(twoWeeksAgo)
                },
                {
                    contributor: "Sid Joshi",
                    github_username: "dr34mhacks",
                    country: "India",
                    category: "advanced",
                    tags: ["dom-xss", "research"],
                    date_added: formatDate(today)
                },
                {
                    contributor: "Sandeep Wawdane",
                    github_username: "thecybersandeep",
                    country: "India",
                    category: "advanced",
                    tags: ["security", "research"],
                    date_added: formatDate(lastWeek)
                }
            ]
        };
    }

    // Helper function to parse DD-MM-YYYY format
    parseDate(dateString) {
        if (!dateString) return null;

        const parts = dateString.split('-');
        if (parts.length !== 3) return null;

        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
        const year = parseInt(parts[2], 10);

        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return null;
        }

        return new Date(year, month, day);
    }

    generateContributorsFromPayloads() {
        if (!this.payloadData || !this.payloadData.payloads) {
            throw new Error('No payload data found');
        }

        // Group payloads by contributor
        const contributorMap = new Map();

        this.payloadData.payloads.forEach(payload => {
            const contributor = payload.contributor;
            const githubUsername = payload.github_username || contributor;
            const country = payload.country || 'Unknown';

            if (!contributorMap.has(contributor)) {
                contributorMap.set(contributor, {
                    id: contributor,
                    username: githubUsername,
                    github_username: githubUsername,
                    name: this.getDisplayName(contributor),
                    avatar_url: `https://github.com/${githubUsername}.png`,
                    bio: this.getBio(contributor),
                    location: country,
                    payloads_contributed: 0,
                    join_date: payload.date_added,
                    last_contribution: payload.date_added,
                    badges: this.getBadges(contributor),
                    specialties: [],
                    categories: new Set(),
                    tags: new Set()
                });
            }

            const contributorData = contributorMap.get(contributor);
            contributorData.payloads_contributed++;

            // Update last contribution date using proper date parsing
            const currentContribDate = this.parseDate(payload.date_added);
            const lastContribDate = this.parseDate(contributorData.last_contribution);

            if (currentContribDate && (!lastContribDate || currentContribDate > lastContribDate)) {
                contributorData.last_contribution = payload.date_added;
            }

            // Collect categories and tags
            if (payload.category) {
                contributorData.categories.add(payload.category);
            }
            if (payload.tags) {
                payload.tags.forEach(tag => contributorData.tags.add(tag));
            }
        });

        // Convert sets to arrays and finalize data
        this.contributors = Array.from(contributorMap.values()).map(contributor => {
            contributor.specialties = Array.from(contributor.categories).slice(0, 3);
            delete contributor.categories;
            delete contributor.tags;
            return contributor;
        });

        // Sort by payloads contributed (descending)
        this.contributors.sort((a, b) => b.payloads_contributed - a.payloads_contributed);
    }

    getDisplayName(username) {
        const nameMap = {
            'dr34mhacks': 'Sid Joshi',
            'mathiasbynens': 'Mathias Bynens',
            'portswigger': 'PortSwigger Team',
            'brutelogic': 'BruteLogic',
            'garethheyes': 'Gareth Heyes',
            'cure53': 'Mario Heiderich',
            'security_researcher': 'Security Researcher',
            'white_hat': 'White Hat'
        };
        return nameMap[username] || username;
    }

    getBio(username) {
        const bioMap = {
            'dr34mhacks': 'XSSNow creator and cybersecurity researcher',
            'mathiasbynens': 'JavaScript engine researcher and V8 team member',
            'portswigger': 'Creators of Burp Suite and web security research',
            'brutelogic': 'XSS research pioneer and security expert',
            'garethheyes': 'PortSwigger Research Director and XSS expert',
            'cure53': 'Cure53 founder and web security expert',
            'security_researcher': 'Penetration tester and security researcher',
            'white_hat': 'Ethical hacker and bug bounty hunter'
        };
        return bioMap[username] || 'Security researcher and XSS expert';
    }

    getBadges(username) {
        const badgeMap = {
            'dr34mhacks': ['contributor', 'researcher', 'expert', 'ninja', 'legend', 'founder'],
            'mathiasbynens': ['contributor', 'researcher', 'expert', 'ninja', 'legend'],
            'portswigger': ['contributor', 'researcher', 'expert', 'ninja'],
            'brutelogic': ['contributor', 'researcher', 'expert', 'ninja'],
            'garethheyes': ['contributor', 'researcher', 'expert', 'ninja'],
            'cure53': ['contributor', 'researcher', 'expert', 'ninja'],
            'security_researcher': ['contributor', 'researcher'],
            'white_hat': ['contributor', 'researcher']
        };
        return badgeMap[username] || ['contributor'];
    }

    getCountryFlag(country) {
        const flagMap = {
            // North America
            'USA': '🇺🇸',
            'United States': '🇺🇸',
            'Canada': '🇨🇦',
            'Mexico': '🇲🇽',

            // Europe
            'United Kingdom': '🇬🇧',
            'UK': '🇬🇧',
            'Germany': '🇩🇪',
            'France': '🇫🇷',
            'Netherlands': '🇳🇱',
            'Belgium': '🇧🇪',
            'Switzerland': '🇨🇭',
            'Sweden': '🇸🇪',
            'Norway': '🇳🇴',
            'Denmark': '🇩🇰',
            'Finland': '🇫🇮',
            'Italy': '🇮🇹',
            'Spain': '🇪🇸',
            'Portugal': '🇵🇹',
            'Poland': '🇵🇱',
            'Czech Republic': '🇨🇿',
            'Austria': '🇦🇹',
            'Romania': '🇷🇴',
            'Bulgaria': '🇧🇬',
            'Estonia': '🇪🇪',
            'Latvia': '🇱🇻',
            'Lithuania': '🇱🇹',
            'Russia': '🇷🇺',
            'Ukraine': '🇺🇦',

            // Asia Pacific
            'India': '🇮🇳',
            'China': '🇨🇳',
            'Japan': '🇯🇵',
            'South Korea': '🇰🇷',
            'Singapore': '🇸🇬',
            'Australia': '🇦🇺',
            'New Zealand': '🇳🇿',
            'Malaysia': '🇲🇾',
            'Thailand': '🇹🇭',
            'Vietnam': '🇻🇳',
            'Philippines': '🇵🇭',
            'Indonesia': '🇮🇩',
            'Taiwan': '🇹🇼',
            'Hong Kong': '🇭🇰',

            // Middle East & Africa
            'Israel': '🇮🇱',
            'Turkey': '🇹🇷',
            'UAE': '🇦🇪',
            'Saudi Arabia': '🇸🇦',
            'South Africa': '🇿🇦',
            'Nigeria': '🇳🇬',
            'Egypt': '🇪🇬',
            'Kenya': '🇰🇪',

            // South America
            'Brazil': '🇧🇷',
            'Argentina': '🇦🇷',
            'Chile': '🇨🇱',
            'Colombia': '🇨🇴',
            'Peru': '🇵🇪',
            'Venezuela': '🇻🇪'
        };
        return flagMap[country] || '🌍';
    }

    displayContributors() {
        this.displayEliteTier();
        this.displayRisingStars();
    }

    displayEliteTier() {
        const eliteContainer = document.getElementById('eliteGrid');
        if (!eliteContainer) {
            return;
        }

        // Get top 3 contributors
        const top3 = this.contributors.slice(0, 3);

        eliteContainer.innerHTML = top3.map((contributor, index) => {
            const rank = index + 1;
            return this.createEliteCard(contributor, rank);
        }).join('');
    }

    displayRisingStars() {
        const starsContainer = document.getElementById('starsGrid');
        if (!starsContainer) {
            return;
        }

        // Get contributors 4-10
        const restContributors = this.contributors.slice(3, 10);

        starsContainer.innerHTML = restContributors.map((contributor, index) => {
            const rank = index + 4; // Starting from 4th position
            return this.createRisingStarItem(contributor, rank);
        }).join('');
    }

    createEliteCard(contributor, rank) {
        const crownBadge = rank === 1 ? '<div class="crown-badge">👑</div>' : '';
        const countryFlag = this.getCountryFlag(contributor.location);
        const username = contributor.github_username || contributor.username;
        const avatarUrl = contributor.avatar_url || `https://github.com/${username}.png`;
        return `
            <div class="podium-position rank-${rank}">
                <div class="podium-card rank-${rank}">
                    ${crownBadge}

                    <a href="https://github.com/${username}"
                       target="_blank" style="color: inherit; text-decoration: none;">
                        <img src="${avatarUrl}"
                             alt="${contributor.name}"
                             class="contributor-avatar-podium"
                             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                    </a>
                    <div style="display:none;width:100px;height:100px;background:#333;color:#fff;align-items:center;justify-content:center;font-family:Arial;font-size:40px;border-radius:50%;">
                        ${(contributor.username || 'U').charAt(0).toUpperCase()}
                    </div>

                    <div class="contributor-info">
                        <a href="https://github.com/${username}"
                           target="_blank" style="color: inherit; text-decoration: none;">
                            <div class="contributor-name-podium">${contributor.name || contributor.username}</div>
                        </a>
                        <div class="contributor-username">@${username}</div>
                    </div>

                    <div class="contributor-stats">
                        <div class="stat-elite">
                            <div class="stat-number">${contributor.payloads_contributed || 0}</div>
                            <div class="stat-label">Payloads</div>
                        </div>
                        <div class="country-info">
                            <span class="country-flag">${countryFlag}</span>
                            <span class="country-name">${contributor.location || 'Unknown'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createRisingStarItem(contributor, rank) {
        const countryFlag = this.getCountryFlag(contributor.location);
        const username = contributor.github_username || contributor.username;
        const avatarUrl = contributor.avatar_url || `https://github.com/${username}.png`;
        return `
            <div class="ranking-item-modern">
                <div class="ranking-left-modern">
                    <div class="ranking-number-modern">#${rank}</div>

                    <a href="https://github.com/${username}"
                       target="_blank" style="color: inherit; text-decoration: none;">
                        <img src="${avatarUrl}"
                             alt="${contributor.name}"
                             class="ranking-avatar"
                             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                    </a>
                    <div style="display:none;width:40px;height:40px;background:#333;color:#fff;align-items:center;justify-content:center;font-family:Arial;font-size:16px;border-radius:50%;">
                        ${(contributor.username || 'U').charAt(0).toUpperCase()}
                    </div>

                    <div class="ranking-info">
                        <a href="https://github.com/${username}"
                           target="_blank" style="color: inherit; text-decoration: none;">
                            <div class="ranking-name-modern">${contributor.name || contributor.username}</div>
                        </a>
                        <div class="ranking-username">@${username}</div>
                        <div class="location">${countryFlag} ${contributor.location || 'Unknown'}</div>
                    </div>
                </div>

                <div class="ranking-right-modern">
                    <div class="ranking-score-modern">
                        <span class="payload-count">${contributor.payloads_contributed || 0}</span>
                        <span class="payload-label">payloads</span>
                    </div>
                </div>
            </div>
        `;
    }

    updateStats() {
        // Update hero stats
        const heroContributors = document.getElementById('heroContributors');
        if (heroContributors) {
            heroContributors.textContent = this.contributors.length;
        }

        const heroPayloads = document.getElementById('heroPayloads');
        if (heroPayloads) {
            const payloadCount = this.contributors.reduce((sum, c) => sum + (c.payloads_contributed || 0), 0);
            heroPayloads.textContent = payloadCount.toString();
        }

        // Update community impact stats
        const totalPayloadsElement = document.querySelector('.impact-card .impact-number');
        if (totalPayloadsElement) {
            const totalPayloads = this.contributors.reduce((sum, c) => sum + (c.payloads_contributed || 0), 0);
            totalPayloadsElement.textContent = `🔥 ${totalPayloads}+`;
        }

        const totalContributorsElement = document.querySelectorAll('.impact-card .impact-number')[1];
        if (totalContributorsElement) {
            totalContributorsElement.textContent = `🌐 ${this.contributors.length}`;
        }

        const uniqueCountries = new Set(this.contributors.map(c => c.location).filter(location => location && location !== 'Unknown')).size;
        const countriesElement = document.querySelectorAll('.impact-card .impact-number')[2];
        if (countriesElement) {
            countriesElement.textContent = `🚀 ${uniqueCountries}+`;
        }

        // Update achievement showcase with real data
        this.updateAchievementShowcase();
    }

    updateAchievementShowcase() {
        if (this.contributors.length === 0) return;

        const top1 = this.contributors[0]; // Highest contributor
        const mostActive = this.contributors[0]; // Same as top1 since sorted by payloads

        // Get recent contributors (joined in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentContributors = this.contributors.filter(c => {
            if (!c.join_date) return false;
            const joinDate = this.parseDate(c.join_date);
            return joinDate && joinDate >= thirtyDaysAgo;
        });

        // Update Top Researcher card (1st card)
        const topCard = document.querySelector('.achievement-card.active');
        if (topCard && top1) {
            const nameElement = topCard.querySelector('p');
            const scoreElement = topCard.querySelector('.achievement-score');
            if (nameElement) nameElement.textContent = top1.name;
            if (scoreElement) scoreElement.textContent = `${top1.payloads_contributed} Payloads`;
        }

        // Update Most Active card (2nd card)
        const achievementCards = document.querySelectorAll('.achievement-card');
        if (achievementCards.length > 1 && mostActive) {
            const mostActiveCard = achievementCards[1];
            const nameElement = mostActiveCard.querySelector('p');
            const scoreElement = mostActiveCard.querySelector('.achievement-score');
            if (nameElement) nameElement.textContent = mostActive.name;
            if (scoreElement) scoreElement.textContent = `${mostActive.payloads_contributed} Payloads`;
        }

        // Update Rising Star card (3rd card)
        if (achievementCards.length > 2) {
            const risingStarCard = achievementCards[2];
            const nameElement = risingStarCard.querySelector('p');
            const scoreElement = risingStarCard.querySelector('.achievement-score');

            if (recentContributors.length > 0) {
                // Show the newest contributor as rising star
                const newestContributor = recentContributors.sort((a, b) =>
                    new Date(b.join_date) - new Date(a.join_date)
                )[0];
                if (nameElement) nameElement.textContent = newestContributor.name;
                if (scoreElement) scoreElement.textContent = `${newestContributor.payloads_contributed} Payloads`;
            } else {
                // Fallback to 2nd place contributor
                const secondPlace = this.contributors[1];
                if (secondPlace) {
                    if (nameElement) nameElement.textContent = secondPlace.name || 'Rising Contributors';
                    if (scoreElement) scoreElement.textContent = `${secondPlace.payloads_contributed || 0} Payloads`;
                } else {
                    if (nameElement) nameElement.textContent = 'New Contributors';
                    if (scoreElement) scoreElement.textContent = '+0 This Month';
                }
            }
        }
    }

    // Filter contributors by time period
    filterByPeriod(period) {
        let filteredContributors = [...this.contributors];

        if (period === 'this-month') {
            // Filter contributors who have contributed in the last 30 days
            const now = new Date();
            const thirtyDaysAgo = new Date(now);
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            thirtyDaysAgo.setHours(0, 0, 0, 0); // Set to beginning of the day

            filteredContributors = filteredContributors.filter(contributor => {
                if (!contributor.last_contribution && !contributor.join_date) {
                    return false;
                }

                // Parse dates more reliably
                let lastContribDate = null;
                let joinDate = null;
                let hasRecentActivity = false;

                try {
                    if (contributor.last_contribution) {
                        lastContribDate = this.parseDate(contributor.last_contribution);
                        if (lastContribDate && !isNaN(lastContribDate.getTime())) {
                            lastContribDate.setHours(0, 0, 0, 0);
                            hasRecentActivity = lastContribDate >= thirtyDaysAgo;
                        }
                    }

                    if (contributor.join_date) {
                        joinDate = this.parseDate(contributor.join_date);
                        if (joinDate && !isNaN(joinDate.getTime())) {
                            joinDate.setHours(0, 0, 0, 0);
                            const isRecentJoin = joinDate >= thirtyDaysAgo;
                            hasRecentActivity = hasRecentActivity || isRecentJoin;
                        }
                    }
                } catch (error) {
                    return false;
                }

                return hasRecentActivity;
            });

            // If no contributors found, show a message
            if (filteredContributors.length === 0) {
                this.showNoContributorsMessage();
                return;
            }
        }
        // 'all-time' shows all contributors (no filtering)

        // Sort the filtered contributors by payloads contributed
        filteredContributors.sort((a, b) => (b.payloads_contributed || 0) - (a.payloads_contributed || 0));

        // Update the contributors array temporarily for display
        const originalContributors = this.contributors;
        this.contributors = filteredContributors;

        // Re-display with filtered data
        this.displayContributors();
        this.updateStats();

        // Restore original contributors array
        this.contributors = originalContributors;
    }

    showNoContributorsMessage() {
        const eliteContainer = document.getElementById('eliteGrid');
        const starsContainer = document.getElementById('starsGrid');

        const noContributorsHTML = `
            <div class="no-contributors-state" style="text-align: center; padding: 3rem; grid-column: 1 / -1;">
                <div class="no-contributors-icon" style="font-size: 4rem; margin-bottom: 1rem;">
                    📅
                </div>
                <h3 style="color: var(--text-primary); margin-bottom: 1rem;">No Recent Contributors</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">No contributors found for this month. Switch to "All Time" to see all contributors.</p>
                <button class="btn btn-secondary" onclick="document.querySelector('[data-period=all-time]').click()" style="padding: 0.75rem 1.5rem; background: var(--neon-green); color: var(--bg-primary); border: none; border-radius: 6px; cursor: pointer;">
                    View All Contributors
                </button>
            </div>
        `;

        if (eliteContainer) {
            eliteContainer.innerHTML = noContributorsHTML;
        }
        if (starsContainer) {
            starsContainer.innerHTML = '';
        }
    }

    showError() {
        const eliteContainer = document.getElementById('eliteGrid');
        const starsContainer = document.getElementById('starsGrid');

        const errorHTML = `
            <div class="error-state">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Failed to Load Contributors</h3>
                <p>Unable to load the contributors data. Please try refreshing the page.</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    <i class="fas fa-refresh"></i>
                    Retry
                </button>
            </div>
        `;

        if (eliteContainer) {
            eliteContainer.innerHTML = errorHTML;
        }
        if (starsContainer) {
            starsContainer.innerHTML = '';
        }
    }

    // Utility method to get contributor by ID
    getContributor(id) {
        return this.contributors.find(c => c.id === id);
    }
}

// Initialize contributors manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
        });
    }

    // Initialize contributors
    window.contributorsManager = new ContributorsManager();

    // Filter functionality
    document.querySelectorAll('.filter-btn-new').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn-new').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const period = this.getAttribute('data-period');
            window.contributorsManager.filterByPeriod(period);
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add copy functionality for code examples
    document.querySelectorAll('.code-example').forEach(codeBlock => {
        const copyBtn = document.createElement('button');
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.className = 'copy-code-btn';
        copyBtn.style.cssText = `
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: rgba(0, 255, 65, 0.1);
            border: 1px solid rgba(0, 255, 65, 0.3);
            color: var(--neon-green);
            padding: 0.5rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.8rem;
        `;

        copyBtn.addEventListener('click', () => {
            const code = codeBlock.textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                copyBtn.style.color = '#4ade80';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    copyBtn.style.color = 'var(--neon-green)';
                }, 2000);
            });
        });

        codeBlock.style.position = 'relative';
        codeBlock.appendChild(copyBtn);
    });

});