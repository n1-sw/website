const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navItems = document.querySelectorAll(".nav__item");
const navLinks = document.querySelectorAll(".nav__link");
const header = document.getElementById("header");
const themeToggle = document.getElementById("theme-toggle");
const loadingScreen = document.getElementById("loading-screen");
const securityWarning = document.getElementById("security-warning");
const cursor = document.querySelector(".cursor");
const cursorFollower = document.querySelector(".cursor-follower");
const particlesBg = document.getElementById("particles-bg");

const CRYPTO_ADDRESSES = {
    BTC: 'bc1qvgxyvd9kh8fmryqvfc6q0djxpgtr7a7xyjzpej',
    LTC: 'LYhPYYmRWUHn1njzXrSnjNXE8TEPwsP1EZ',
    ETH: '0x1B1E1329AD8572975d379C5740E98d48AAA36159'
};

let selectedCrypto = null;

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        loadingScreen.classList.add("hidden");
        document.body.style.overflow = "auto";
        initTypingEffect();
    }, 1200);

    initParticles();
    initSkillBars();
    initSnow();
    initBubbles();
    initSparkles();
    initContactForm();
});

function initTypingEffect() {
    const typingText = document.querySelector(".typing-text");
    const cursorBlink = document.querySelector(".cursor-blink");
    const typingRole = document.querySelector(".typing-role");

    const textToType = "ABID HASAN SAJID";
    const roles = [
        "I'm a Student",
        "I'm a Developer",
        "I'm a Coder",
        "I'm a Web Designer",
        "I'm Creative",
        "I'm Passionate"
    ];
    let charIndex = 0;
    let roleIndex = 0;
    let isDeleting = false;
    let currentRole = "";

    function type() {
        if (charIndex < textToType.length) {
            typingText.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(type, 150);
        } else {
            setTimeout(() => {
                typeRole();
            }, 500);
        }
    }

    function typeRole() {
        const fullRole = roles[roleIndex];
        
        if (!isDeleting && currentRole.length < fullRole.length) {
            currentRole = fullRole.substring(0, currentRole.length + 1);
            typingRole.textContent = currentRole;
            setTimeout(typeRole, 100);
        } else if (!isDeleting && currentRole.length === fullRole.length) {
            setTimeout(() => {
                isDeleting = true;
                typeRole();
            }, 2000);
        } else if (isDeleting && currentRole.length > 0) {
            currentRole = currentRole.substring(0, currentRole.length - 1);
            typingRole.textContent = currentRole;
            setTimeout(typeRole, 50);
        } else if (isDeleting && currentRole.length === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(typeRole, 500);
        }
    }

    setTimeout(type, 300);
}

if (window.innerWidth > 768) {
    document.addEventListener("mousemove", (e) => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";

        setTimeout(() => {
            cursorFollower.style.left = e.clientX + "px";
            cursorFollower.style.top = e.clientY + "px";
        }, 100);
    });

    const hoverElements = document.querySelectorAll(
        "a, button, .btn, .shop__card, .skill-item",
    );
    hoverElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
            cursorFollower.style.transform = "translate(-50%, -50%) scale(1.5)";
        });
        el.addEventListener("mouseleave", () => {
            cursor.style.transform = "translate(-50%, -50%) scale(1)";
            cursorFollower.style.transform = "translate(-50%, -50%) scale(1)";
        });
    });
}

function initParticles() {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
}

function createParticle() {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    const size = Math.random() * 3 + 1;
    particle.style.width = size + "px";
    particle.style.height = size + "px";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDuration = Math.random() * 10 + 10 + "s";
    particle.style.animationDelay = Math.random() * 5 + "s";

    particlesBg.appendChild(particle);

    setTimeout(
        () => {
            particle.remove();
            createParticle();
        },
        (Math.random() * 10 + 10) * 1000,
    );
}

function initSkillBars() {
    const skillBars = document.querySelectorAll(".skill-progress");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const progress = entry.target.getAttribute("data-progress");
                    entry.target.style.width = progress + "%";
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 },
    );

    skillBars.forEach((bar) => observer.observe(bar));
}

function initSnow() {
    let snowContainer = document.querySelector('.snow-container');
    if (!snowContainer) {
        snowContainer = document.createElement('div');
        snowContainer.className = 'snow-container';
        document.body.appendChild(snowContainer);
    }

    const snowflakeCount = 30;
    const snowflakes = ['❄', '❅', '❆'];

    for (let i = 0; i < snowflakeCount; i++) {
        createSnowflake(snowContainer, snowflakes);
    }

    setInterval(() => {
        if (snowContainer.children.length < snowflakeCount) {
            createSnowflake(snowContainer, snowflakes);
        }
    }, 3000);
}

function createSnowflake(container, symbols) {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    snowflake.style.left = Math.random() * 100 + '%';
    snowflake.style.fontSize = (Math.random() * 1 + 1) + 'rem';
    snowflake.style.animationDuration = (Math.random() * 5 + 10) + 's';
    snowflake.style.animationDelay = Math.random() * 5 + 's';

    container.appendChild(snowflake);

    setTimeout(() => {
        snowflake.remove();
    }, (Math.random() * 5 + 10) * 1000);
}

function initBubbles() {
    let bubbleContainer = document.querySelector('.bubble-container');
    if (!bubbleContainer) {
        bubbleContainer = document.createElement('div');
        bubbleContainer.className = 'bubble-container';
        document.body.appendChild(bubbleContainer);
    }

    const bubbleCount = 15;

    for (let i = 0; i < bubbleCount; i++) {
        createBubble(bubbleContainer);
    }

    setInterval(() => {
        if (bubbleContainer.children.length < bubbleCount) {
            createBubble(bubbleContainer);
        }
    }, 4000);
}

function createBubble(container) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    const size = Math.random() * 60 + 20;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = Math.random() * 100 + '%';
    bubble.style.animationDuration = (Math.random() * 6 + 8) + 's';
    bubble.style.animationDelay = Math.random() * 3 + 's';
    bubble.style.setProperty('--bubble-drift', (Math.random() * 2 - 1).toFixed(2));

    container.appendChild(bubble);

    setTimeout(() => {
        bubble.remove();
    }, (Math.random() * 6 + 8) * 1000);
}

function initSparkles() {
    let sparkleContainer = document.querySelector('.sparkle-container');
    if (!sparkleContainer) {
        sparkleContainer = document.createElement('div');
        sparkleContainer.className = 'sparkle-container';
        document.body.appendChild(sparkleContainer);
    }

    setInterval(() => {
        createSparkle(sparkleContainer);
    }, 800);
}

function createSparkle(container) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.animationDuration = (Math.random() * 1 + 1.5) + 's';

    container.appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, (Math.random() * 1 + 1.5) * 1000);
}

const currentTheme = localStorage.getItem("theme");
if (currentTheme) {
    document.body.classList.add(currentTheme);
    if (currentTheme === "light-theme") {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");

    if (document.body.classList.contains("light-theme")) {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem("theme", "light-theme");
    } else {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem("theme", "");
    }
});

navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("nav__menu--open");
    changeIcon();
});

navItems.forEach((item) => {
    item.addEventListener("click", () => {
        if (navMenu.classList.contains("nav__menu--open")) {
            navMenu.classList.remove("nav__menu--open");
        }
        changeIcon();
    });
});

function changeIcon() {
    if (navMenu.classList.contains("nav__menu--open")) {
        navToggle.classList.replace("ri-menu-3-line", "ri-close-line");
    } else {
        navToggle.classList.replace("ri-close-line", "ri-menu-3-line");
    }
}

window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
        header.classList.add("header--scroll");
    } else {
        header.classList.remove("header--scroll");
    }

    updateActiveNav();
});

function updateActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute("id");

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach((link) => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${sectionId}`) {
                    link.classList.add("active");
                }
            });
        }
    });
}

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!checkRateLimit()) {
            showFormMessage('Please wait before sending another message.', 'error');
            return;
        }

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
        submitBtn.disabled = true;

        try {
            const response = await sendToDiscordWebhook(formData);
            
            if (response.success) {
                showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                showFormMessage('Failed to send message. Please try contacting me via Discord or email directly.', 'error');
            }
        } catch (error) {
            showFormMessage('An error occurred. Please contact me via Discord or email.', 'error');
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

async function sendToDiscordWebhook(formData) {
    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1431698257574367272/5dW4OkjpYYe0d19zMPHf4pz9HQLj46qnxZKnWRbIbekT7MXk4DrxXMKMvTB8Z-FcF8s8';
    
    const embed = {
        title: '📬 New Contact Form Submission',
        color: 6450047,
        fields: [
            {
                name: '👤 Name',
                value: formData.name,
                inline: true
            },
            {
                name: '📧 Email',
                value: formData.email,
                inline: true
            },
            {
                name: '💬 Message',
                value: formData.message
            }
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: 'abidhasansajid.me'
        }
    };

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'Portfolio Bot',
                embeds: [embed]
            })
        });

        return { success: response.ok };
    } catch (error) {
        console.error('Webhook error:', error);
        return { success: false };
    }
}

function showFormMessage(message, type) {
    const formMessage = document.getElementById('form-message');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    setTimeout(() => {
        formMessage.className = 'form-message';
    }, 5000);
}

function openCryptoPayment(productName) {
    if (!checkRateLimit()) {
        return;
    }

    const cryptoProduct = document.getElementById("crypto-product");
    const cryptoModal = document.getElementById("crypto-modal");
    
    cryptoProduct.textContent = "Product: " + productName;
    cryptoModal.classList.add("active");
    
    selectedCrypto = null;
    document.querySelectorAll('.crypto-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('crypto-address-container').classList.remove('active');
}

function closeCryptoModal() {
    const cryptoModal = document.getElementById("crypto-modal");
    cryptoModal.classList.remove("active");
}

function selectCrypto(crypto) {
    selectedCrypto = crypto;
    
    document.querySelectorAll('.crypto-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.crypto-btn').classList.add('active');
    
    const walletElement = document.getElementById('crypto-wallet');
    const addressContainer = document.getElementById('crypto-address-container');
    
    walletElement.textContent = CRYPTO_ADDRESSES[crypto];
    addressContainer.classList.add('active');
}

function copyCryptoAddress() {
    if (!selectedCrypto) {
        alert('Please select a cryptocurrency first!');
        return;
    }

    const address = CRYPTO_ADDRESSES[selectedCrypto];
    
    navigator.clipboard.writeText(address).then(() => {
        const copyBtn = event.target.closest('.copy-btn');
        const originalHTML = copyBtn.innerHTML;
        
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.background = '#10b981';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.background = '';
        }, 2000);
    }).catch(() => {
        const tempInput = document.createElement('input');
        tempInput.value = address;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('Address copied to clipboard!');
    });
}

window.addEventListener("click", (e) => {
    const cryptoModal = document.getElementById("crypto-modal");
    if (e.target === cryptoModal) {
        closeCryptoModal();
    }
});

let suspiciousActivityCount = 0;
const maxSuspiciousActivity = 3;

function showSecurityWarning(message) {
    const securityMessage = document.getElementById("security-message");
    securityMessage.textContent = message;
    securityWarning.classList.add("active");

    suspiciousActivityCount++;

    if (suspiciousActivityCount >= maxSuspiciousActivity) {
        securityMessage.textContent =
            "Multiple security violations detected! Your activity is being monitored.";
    }
}

function closeSecurityWarning() {
    securityWarning.classList.remove("active");
}

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    showSecurityWarning("Right-click is disabled for security purposes!");
    return false;
});

let devtoolsOpen = false;
const threshold = 160;

setInterval(() => {
    if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
    ) {
        if (!devtoolsOpen) {
            devtoolsOpen = true;
            showSecurityWarning(
                "Developer Tools detected! Please close them for the best experience.",
            );
        }
    } else {
        devtoolsOpen = false;
    }
}, 1000);

document.addEventListener("keydown", (e) => {
    if (
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) ||
        (e.ctrlKey && e.keyCode === 85)
    ) {
        e.preventDefault();
        showSecurityWarning("This keyboard shortcut is disabled for security!");
        return false;
    }
});

document.addEventListener("selectstart", (e) => {
    if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        if (suspiciousActivityCount < maxSuspiciousActivity - 1) {
            const shouldWarn = Math.random() > 0.7;
            if (shouldWarn) {
                showSecurityWarning("Content selection is monitored!");
            }
        }
    }
});

let requestCount = 0;
let lastRequestTime = Date.now();

function checkRateLimit() {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastRequestTime;

    if (timeDiff < 1000) {
        requestCount++;
        if (requestCount > 50) {
            showSecurityWarning(
                "Too many requests detected! Please slow down.",
            );
            return false;
        }
    } else {
        requestCount = 0;
        lastRequestTime = currentTime;
    }
    return true;
}

console.log("%c⚠️ WARNING!", "color: red; font-size: 50px; font-weight: bold;");
console.log(
    "%cThis is a browser feature intended for developers. If someone told you to copy-paste something here, it's a scam!",
    "font-size: 20px;",
);
console.log(
    "%cPasting anything here could give attackers access to your information.",
    "font-size: 16px; color: red;",
);

if (typeof ScrollReveal !== "undefined") {
    const sr = ScrollReveal({
        duration: 1500,
        distance: "60px",
        delay: 300,
        reset: false,
        origin: "bottom",
    });

    sr.reveal(".hero__content", { delay: 400 });
    sr.reveal(".hero__img-wrapper", { origin: "top", delay: 600 });
    sr.reveal(".hero__social", { origin: "bottom", delay: 800 });

    sr.reveal(".section__header", { interval: 200 });
    sr.reveal(".about__content", { origin: "left", delay: 400 });
    sr.reveal(".skills", { origin: "right", delay: 600 });
    sr.reveal(".discord-card", { delay: 400 });
    sr.reveal(".shop__card", { interval: 200 });
    sr.reveal(".contact__content", { delay: 400 });
    sr.reveal(".footer__content", { interval: 100 });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition =
                elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    });
});

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 20);
}

const discordSection = document.querySelector(".discord-section");
let statsAnimated = false;

const statsObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !statsAnimated) {
                const statNumbers = document.querySelectorAll(
                    ".discord-card .stat-number",
                );
                statNumbers.forEach((stat) => {
                    const target = parseInt(stat.textContent.replace(/,/g, ""));
                    animateCounter(stat, target);
                });
                statsAnimated = true;
            }
        });
    },
    { threshold: 0.5 },
);

if (discordSection) {
    statsObserver.observe(discordSection);
}

const aboutStatsObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    },
    { threshold: 0.3 },
);

const statBoxes = document.querySelectorAll(".stat-box");
statBoxes.forEach((box) => {
    box.style.opacity = "0";
    box.style.transform = "translateY(20px)";
    box.style.transition = "all 0.6s ease-out";
    aboutStatsObserver.observe(box);
});

class ChatbotController {
    constructor() {
        this.panel = document.getElementById("chatbot-panel");
        this.bubble = document.getElementById("chatbot-bubble");
        this.closeBtn = document.getElementById("chatbot-close");
        this.messagesContainer = document.getElementById("chatbot-messages");
        this.inputField = document.getElementById("chatbot-input");
        this.sendBtn = document.getElementById("chatbot-send");
        this.typingIndicator = document.getElementById("chatbot-typing");
        this.notification = document.getElementById("chatbot-notification");
        
        this.isOpen = false;
        this.messageCount = 0;
        this.lastUserMessage = "";
        
        this.responses = {
            greetings: [
                "Hello! How can I assist you today? 😊",
                "Hi there! What would you like to know?",
                "Hey! I'm here to help. What's on your mind?"
            ],
            portfolio: [
                "Sajid is a talented web developer from Bangladesh! He specializes in modern web design and UI/UX. Check out the portfolio section above to see his work! ✨",
                "You can explore Sajid's projects and skills in the About section. He's passionate about creating beautiful, responsive websites! 💻"
            ],
            discord: [
                "Yes! Sajid offers Discord Nitro, server boosts, and custom effects. Scroll to the shop section to see all available products! 🎮",
                "Discord products are available including Nitro and Effects! Check out the shop section for pricing and details. 💎"
            ],
            shop: [
                "The shop offers Discord Nitro, Server Boosts, Profile Effects, and more! All payments are via cryptocurrency (BTC, LTC, ETH). 💰",
                "You can purchase various Discord products! Scroll down to the shop section to see everything available. Crypto payments accepted! 🚀"
            ],
            contact: [
                "You can reach out through the contact form at the bottom of the page! Sajid typically responds within 24 hours. 📧",
                "Great! Let me take you to the contact section...",
                "Feel free to use the contact form below to get in touch with Sajid directly! 💬"
            ],
            price: [
                "Prices vary by product! Check the shop section below for detailed pricing on Discord Nitro, boosts, and effects. All transactions are in cryptocurrency! 💵",
                "Product prices are listed in the shop section! Scroll down to see the full catalog with crypto payment options. 📊"
            ],
            help: [
                "I can help you with:\n• Sajid's portfolio and skills\n• Discord products and shop\n• Contact information\n• General questions\n\nWhat would you like to know? 🤔",
                "I'm here to guide you! You can ask about Sajid's work, Discord products, or how to get in touch. What interests you? 💡"
            ],
            thanks: [
                "You're welcome! Is there anything else I can help you with? 😊",
                "Happy to help! Feel free to ask if you have more questions! ✨",
                "Anytime! Don't hesitate to reach out if you need more information! 🙌"
            ],
            default: [
                "That's a great question! For specific inquiries, I recommend using the contact form below to reach Sajid directly. 📬",
                "Hmm, I'm not quite sure about that! You might want to contact Sajid directly through the form below for detailed information. 💭",
                "Interesting! For the most accurate answer, please use the contact section to message Sajid. He'll get back to you soon! 🎯"
            ]
        };
        
        this.init();
    }
    
    init() {
        this.bubble.addEventListener("click", () => this.toggle());
        this.closeBtn.addEventListener("click", () => this.close());
        this.sendBtn.addEventListener("click", () => this.sendMessage());
        this.inputField.addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.sendMessage();
        });
        
        setTimeout(() => {
            if (!this.isOpen && this.notification) {
                this.notification.style.display = "flex";
            }
        }, 3000);
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        this.isOpen = true;
        this.panel.classList.add("chatbot-panel--open");
        if (this.notification) {
            this.notification.style.display = "none";
        }
        this.inputField.focus();
        this.scrollToBottom();
    }
    
    close() {
        this.isOpen = false;
        this.panel.classList.remove("chatbot-panel--open");
    }
    
    sendMessage() {
        const message = this.inputField.value.trim();
        if (!message || message.length === 0) return;
        
        this.addUserMessage(message);
        this.lastUserMessage = message.toLowerCase();
        this.inputField.value = "";
        
        this.showTyping();
        setTimeout(() => {
            this.hideTyping();
            this.addBotResponse(message.toLowerCase());
            this.messageCount++;
            
            if (this.messageCount >= 3 && this.lastUserMessage.includes("contact")) {
                setTimeout(() => {
                    this.scrollToContact();
                }, 1000);
            }
        }, 1500 + Math.random() * 1000);
    }
    
    addUserMessage(text) {
        const messageDiv = document.createElement("div");
        messageDiv.className = "chatbot-message chatbot-message--user";
        messageDiv.innerHTML = `<div class="chatbot-message__bubble">${this.escapeHtml(text)}</div>`;
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    addBotMessage(text) {
        const messageDiv = document.createElement("div");
        messageDiv.className = "chatbot-message chatbot-message--bot";
        messageDiv.innerHTML = `<div class="chatbot-message__bubble">${text}</div>`;
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    addBotResponse(userMessage) {
        let response;
        
        if (this.matchKeywords(userMessage, ["hi", "hello", "hey", "sup", "yo"])) {
            response = this.getRandomResponse("greetings");
        } else if (this.matchKeywords(userMessage, ["portfolio", "work", "project", "skill", "about"])) {
            response = this.getRandomResponse("portfolio");
        } else if (this.matchKeywords(userMessage, ["discord", "nitro", "boost", "effect"])) {
            response = this.getRandomResponse("discord");
        } else if (this.matchKeywords(userMessage, ["shop", "buy", "purchase", "product", "sell"])) {
            response = this.getRandomResponse("shop");
        } else if (this.matchKeywords(userMessage, ["contact", "email", "reach", "message", "talk"])) {
            response = this.getRandomResponse("contact");
        } else if (this.matchKeywords(userMessage, ["price", "cost", "how much", "payment", "pay"])) {
            response = this.getRandomResponse("price");
        } else if (this.matchKeywords(userMessage, ["help", "what can", "assist", "support"])) {
            response = this.getRandomResponse("help");
        } else if (this.matchKeywords(userMessage, ["thank", "thanks", "appreciate"])) {
            response = this.getRandomResponse("thanks");
        } else {
            response = this.getRandomResponse("default");
        }
        
        this.addBotMessage(response);
    }
    
    matchKeywords(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }
    
    getRandomResponse(category) {
        const responses = this.responses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    showTyping() {
        this.typingIndicator.style.display = "block";
        this.scrollToBottom();
    }
    
    hideTyping() {
        this.typingIndicator.style.display = "none";
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }
    
    scrollToContact() {
        this.close();
        window.location.href = "#contact";
    }
    
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

const chatbot = new ChatbotController();

console.log("✨ Modern Portfolio initialized successfully!");
console.log("🚀 All features loaded and ready!");
