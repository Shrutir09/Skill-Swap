// Profile Menu Management
function toggleProfileMenu() {
  const menu = document.getElementById("profileMenu");
  const profileCircle = document.querySelector(".profile-circle");
  const isOpen = menu.classList.contains("show");

  if (isOpen) {
    closeProfileMenu();
  } else {
    openProfileMenu();
  }
}

function openProfileMenu() {
  const menu = document.getElementById("profileMenu");
  const profileCircle = document.querySelector(".profile-circle");
  
  menu.classList.add("show");
  profileCircle.setAttribute("aria-expanded", "true");
  
  // Make menu items focusable
  const menuItems = menu.querySelectorAll(".menu-item, .upload-btn");
  menuItems.forEach(item => {
    item.setAttribute("tabindex", "0");
  });
  
  // Focus first menu item for keyboard navigation
  const firstItem = menu.querySelector(".menu-item, .upload-btn");
  if (firstItem) {
    setTimeout(() => firstItem.focus(), 100);
  }
}

function closeProfileMenu() {
  const menu = document.getElementById("profileMenu");
  const profileCircle = document.querySelector(".profile-circle");
  
  menu.classList.remove("show");
  profileCircle.setAttribute("aria-expanded", "false");
  
  // Make menu items unfocusable when closed
  const menuItems = menu.querySelectorAll(".menu-item, .upload-btn");
  menuItems.forEach(item => {
    item.setAttribute("tabindex", "-1");
  });
  
  profileCircle.focus();
}

// Close menu when clicking outside
document.addEventListener("click", function (e) {
  const profile = document.querySelector(".profile-circle");
  const menu = document.getElementById("profileMenu");

  if (menu && profile && !menu.contains(e.target) && !profile.contains(e.target)) {
    closeProfileMenu();
  }
});

// Keyboard support for profile circle
function handleProfileKeydown(event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleProfileMenu();
  } else if (event.key === "Escape") {
    closeProfileMenu();
  }
}

// Keyboard support for menu items
function handleMenuItemKeydown(event, action) {
  const menu = document.getElementById("profileMenu");
  const items = Array.from(menu.querySelectorAll(".menu-item, .upload-btn"));
  const currentIndex = items.indexOf(event.target);

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (action) action();
    closeProfileMenu();
  } else if (event.key === "Escape") {
    event.preventDefault();
    closeProfileMenu();
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    const nextIndex = (currentIndex + 1) % items.length;
    items[nextIndex].focus();
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    items[prevIndex].focus();
  } else if (event.key === "Home") {
    event.preventDefault();
    items[0].focus();
  } else if (event.key === "End") {
    event.preventDefault();
    items[items.length - 1].focus();
  }
}


// Global Theme Management
function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  const mode = isDark ? "dark" : "light";
  localStorage.setItem("theme", mode);
  
  // Update theme icon
  updateThemeIcon(isDark);
  
  // Dispatch event for other components
  document.dispatchEvent(new CustomEvent("themeChanged", { detail: { mode } }));
}

// Handle theme toggle from mobile menu - uses same global state as desktop
function handleThemeToggle(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  // Use the same global toggleTheme function (shared state)
  toggleTheme();
  // Close mobile menu immediately
  closeMobileMenu();
}

function updateThemeIcon(isDark) {
  // Update all theme icons (both desktop and mobile use same class)
  const themeIcons = document.querySelectorAll(".theme-icon");
  themeIcons.forEach(icon => {
    icon.textContent = isDark ? "☀️" : "🌙";
  });
}

// Load theme on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    updateThemeIcon(true);
  } else {
    updateThemeIcon(false);
  }
});



function uploadAvatar(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    localStorage.setItem("avatar", reader.result);
    const navAvatar = document.getElementById("avatar");
    if (navAvatar) navAvatar.src = reader.result;
    
    // Also update profile page avatar if it exists
    const profileAvatar = document.getElementById("profileAvatar");
    if (profileAvatar) profileAvatar.src = reader.result;
  };
  reader.readAsDataURL(file);
}


document.addEventListener("DOMContentLoaded", () => {
  const savedAvatar = localStorage.getItem("avatar");
  if (savedAvatar) {
    document.getElementById("avatar").src = savedAvatar;
  }
});

const demoUsers = [
  { name: "Aman", teach: ["JS"], learn: ["Python"] },
  { name: "Riya", teach: ["Python"], learn: ["JS"] },
  { name: "Neha", teach: ["CSS"], learn: ["HTML"] },
  { name: "Karan", teach: ["HTML"], learn: ["CSS"] }
];



function handleSkillSubmit() {
  findMatches();
  document.getElementById("matches").classList.remove("hidden");
  document.getElementById("matches")
    .scrollIntoView({ behavior: "smooth" });
}

function findMatches() {
  const teachInput = document.getElementById("teach").value.trim();
  const learnInput = document.getElementById("learn").value.trim();

  const cards = document.getElementById("cards");
  cards.innerHTML = "";

  let found = false;

  demoUsers.forEach(user => {
    const teachMatch = user.learn.some(
      skill => skill.toLowerCase() === teachInput.toLowerCase()
    );

    const learnMatch = user.teach.some(
      skill => skill.toLowerCase() === learnInput.toLowerCase()
    );

    if (teachMatch && learnMatch) {
      found = true;
      cards.innerHTML += createMatchCard(user.name, user.teach, user.learn);
    }
  });

  /* 🔥 DEMO FALLBACK (VERY IMPORTANT) */
  if (!found) {
    cards.innerHTML += `
      <div class="match-card">
        <h4>${t("demoUser")}</h4>
        <p><b>${t("canTeach")}</b> Web Development</p>
        <p><b>${t("wantsToLearn")}</b> ${teachInput || t("anySkill")}</p>

        <button>${t("videoCall")}</button>
        <button>${t("shareNotes")}</button>
        <button>${t("scheduleMeet")}</button>
      </div>
    `;
  }

  if (!found && cards.innerHTML === "") {
    cards.innerHTML = `<p>${t("noMatches")}</p>`;
  }
}

function toggleChatbot() {
  document.getElementById("chatbotBox").classList.toggle("hidden");
}

function sendMessage() {
  const input = document.getElementById("chatInput");
  const msg = input.value.trim();
  if (!msg) return;

  const chat = document.getElementById("chatBody");

  chat.innerHTML += `<div class="user-msg">${msg}</div>`;
  input.value = "";

  setTimeout(() => {
    chat.innerHTML += `<div class="bot-msg">${botReply(msg)}</div>`;
    chat.scrollTop = chat.scrollHeight;
  }, 600);
}

function botReply(msg) {
  msg = msg.toLowerCase();

  if (msg.includes("skill"))
    return t("botSkillHelp");

  if (msg.includes("match"))
    return t("botMatchHelp");

  if (msg.includes("learn"))
    return t("botLearnHelp");

  if (msg.includes("hackathon"))
    return t("botHackathonHelp");

  if (msg.includes("contact"))
    return t("botContactHelp");

  return t("botDefault");
}
// Centralized Language Management
let currentLang = localStorage.getItem("lang") || "en";

// Translation dictionary for JavaScript strings
const translations = {
  en: {
    // Bot messages
    botGreeting: "Hi 👋 I'm SkillSwap AI. How can I help you?",
    botSkillHelp: "Add your skills using the Add Skills section above.",
    botMatchHelp: "Matches appear only after submitting your skills.",
    botLearnHelp: "Learning is better when you teach and learn together!",
    botHackathonHelp: "SkillSwap helps you find collaborators for hackathons.",
    botContactHelp: "You can contact us using the Contact section below.",
    botDefault: "I'm here to help 😊 Ask me about skills, matches, or learning.",
    
    // Match card
    demoUser: "Demo User – Full Stack Dev",
    canTeach: "Can Teach:",
    wantsToLearn: "Wants to Learn:",
    anySkill: "Any Skill",
    videoCall: "📹 Video Call",
    shareNotes: "📂 Share Notes",
    scheduleMeet: "📅 Schedule Meet",
    noMatches: "No matching users found yet.",
    
    // Validation
    fillAllFields: "Please fill all fields",
    userExists: "User already exists. Please login.",
    accountCreated: "Account created successfully! Now login.",
    invalidCredentials: "Invalid credentials",
    
    // Select options
    beginner: "Beginner",
    medium: "Medium",
    pro: "Pro",
    master: "Master"
  },
  hi: {
    // Bot messages
    botGreeting: "नमस्ते 👋 मैं SkillSwap AI हूं। मैं आपकी कैसे मदद कर सकता हूं?",
    botSkillHelp: "ऊपर दिए गए Add Skills सेक्शन का उपयोग करके अपने कौशल जोड़ें।",
    botMatchHelp: "अपने कौशल सबमिट करने के बाद ही मैच दिखाई देते हैं।",
    botLearnHelp: "जब आप एक साथ सिखाते और सीखते हैं तो सीखना बेहतर होता है!",
    botHackathonHelp: "SkillSwap हैकाथॉन के लिए सहयोगियों को खोजने में आपकी मदद करता है।",
    botContactHelp: "आप नीचे दिए गए Contact सेक्शन का उपयोग करके हमसे संपर्क कर सकते हैं।",
    botDefault: "मैं यहाँ मदद के लिए हूं 😊 मुझसे कौशल, मैच, या सीखने के बारे में पूछें।",
    
    // Match card
    demoUser: "डेमो उपयोगकर्ता – फुल स्टैक डेव",
    canTeach: "सिखा सकते हैं:",
    wantsToLearn: "सीखना चाहते हैं:",
    anySkill: "कोई भी कौशल",
    videoCall: "📹 वीडियो कॉल",
    shareNotes: "📂 नोट्स साझा करें",
    scheduleMeet: "📅 मीट शेड्यूल करें",
    noMatches: "अभी तक कोई मैचिंग उपयोगकर्ता नहीं मिला।",
    
    // Validation
    fillAllFields: "कृपया सभी फ़ील्ड भरें",
    userExists: "उपयोगकर्ता पहले से मौजूद है। कृपया लॉगिन करें।",
    accountCreated: "खाता सफलतापूर्वक बनाया गया! अब लॉगिन करें।",
    invalidCredentials: "अमान्य क्रेडेंशियल",
    
    // Select options
    beginner: "शुरुआती",
    medium: "मध्यम",
    pro: "पेशेवर",
    master: "मास्टर"
  }
};

function t(key) {
  return translations[currentLang]?.[key] || translations.en[key] || key;
}

function applyLanguage() {
  document.querySelectorAll("[data-en]").forEach(el => {
    const text = currentLang === "hi" && el.dataset.hi ? el.dataset.hi : el.dataset.en;
    if (el.tagName === "INPUT" && el.type === "file") {
      // Handle file input labels differently
      const label = el.closest("label");
      if (label) {
        const span = label.querySelector("span");
        if (span) span.textContent = text;
      }
    } else if (el.tagName === "OPTION") {
      // Handle select options
      const optionText = currentLang === "hi" && el.dataset.hi ? el.dataset.hi : el.dataset.en;
      if (optionText) {
        el.textContent = optionText;
      }
    } else {
      el.textContent = text;
    }
  });
  
  // Handle placeholders
  document.querySelectorAll("[data-placeholder-en]").forEach(el => {
    const placeholder = currentLang === "hi" && el.dataset.placeholderHi 
      ? el.dataset.placeholderHi 
      : el.dataset.placeholderEn;
    if (placeholder) {
      el.placeholder = placeholder;
    }
  });
  
  // Update HTML lang attribute
  document.documentElement.lang = currentLang;
  
  // Update chatbot greeting
  const botGreeting = document.querySelector(".bot-msg");
  if (botGreeting && botGreeting.dataset.en) {
    botGreeting.textContent = currentLang === "hi" && botGreeting.dataset.hi 
      ? botGreeting.dataset.hi 
      : botGreeting.dataset.en;
  }
  
  // Dispatch event for other components
  document.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang: currentLang } }));
}

function toggleLanguage() {
  currentLang = currentLang === "en" ? "hi" : "en";
  localStorage.setItem("lang", currentLang);
  applyLanguage();
  
  // Update language icon
  updateLanguageIcon(currentLang);
}

// Handle language toggle from mobile menu - uses same global state as desktop
function handleLanguageToggle(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  // Use the same global toggleLanguage function (shared state)
  toggleLanguage();
  // Close mobile menu immediately
  closeMobileMenu();
}

function updateLanguageIcon(lang) {
  // Update all language icons (both desktop and mobile use same class)
  const langIcons = document.querySelectorAll(".lang-icon");
  langIcons.forEach(icon => {
    icon.textContent = lang === "hi" ? "A/हिं" : "A/文";
  });
}

// Set active navigation state
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'app.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    
    // Check if link matches current page
    if (href === currentPage || 
        (currentPage === 'app.html' && (href === 'app.html' || href.startsWith('#'))) ||
        (currentPage === 'profile.html' && href === 'app.html')) {
      link.classList.add('active');
    }
  });
}

// Apply language on page load
document.addEventListener("DOMContentLoaded", () => {
  // Load saved language
  const savedLang = localStorage.getItem("lang");
  if (savedLang) {
    currentLang = savedLang;
  }
  applyLanguage();
  updateLanguageIcon(currentLang);
  const isDark = document.body.classList.contains("dark");
  updateThemeIcon(isDark);
  setActiveNavLink();
});

// Also apply language immediately if DOM is already loaded
// Handle hash scrolling after page load (for cross-page navigation)
function handleHashScroll() {
  // Check if there's a hash in the URL
  const hash = window.location.hash.substring(1);
  const storedHash = sessionStorage.getItem('scrollToHash');
  
  const targetHash = hash || storedHash;
  
  if (targetHash) {
    // Clear stored hash
    if (storedHash) {
      sessionStorage.removeItem('scrollToHash');
    }
    
    // Scroll to target after a short delay to ensure page is fully loaded
    setTimeout(() => {
      const targetElement = document.getElementById(targetHash);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    applyLanguage();
    const isDark = document.body.classList.contains("dark");
    updateThemeIcon(isDark);
    updateLanguageIcon(currentLang);
    setActiveNavLink();
    handleHashScroll();
  });
} else {
  applyLanguage();
  updateThemeIconInMenu();
  updateLanguageIconInMenu();
  setActiveNavLink();
  handleHashScroll();
}


function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "auth.html";
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  const navLinks = document.getElementById("navLinks");
  const menuBtn = document.querySelector(".mobile-menu-btn");
  
  const isOpen = navLinks.classList.contains("show");
  
  if (isOpen) {
    // Close menu
    navLinks.classList.remove("show");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    
    // Update icon
    const icon = menuBtn.querySelector("i");
    if (icon) {
      icon.className = "fas fa-bars";
    }
  } else {
    // Open menu
    navLinks.classList.add("show");
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    
    // Update icon
    const icon = menuBtn.querySelector("i");
    if (icon) {
      icon.className = "fas fa-times";
    }
  }
}

// Close mobile menu when clicking on backdrop
document.addEventListener("click", function(e) {
  const navLinks = document.getElementById("navLinks");
  const menuBtn = document.querySelector(".mobile-menu-btn");
  
  if (navLinks && menuBtn && navLinks.classList.contains("show")) {
    // Check if click is on backdrop (the ::after pseudo-element area)
    // The backdrop is behind the menu, so clicks on it should close the menu
    const clickedNavLink = e.target.closest('.nav-link');
    const clickedToggle = e.target.closest('.mobile-theme-toggle, .mobile-lang-toggle');
    const clickedMenuDivider = e.target.closest('.menu-divider');
    const clickedMobileToggles = e.target.closest('.mobile-menu-toggles');
    
    // If click is outside menu container and not on hamburger button, close menu
    if (!navLinks.contains(e.target) && 
        !menuBtn.contains(e.target) && 
        !clickedNavLink && 
        !clickedToggle &&
        !clickedMenuDivider &&
        !clickedMobileToggles) {
      // This is a backdrop click - close the menu
      closeMobileMenu();
    }
  }
});

// Close mobile menu function
function closeMobileMenu() {
  const menu = document.getElementById("navLinks");
  const menuBtn = document.querySelector(".mobile-menu-btn");
  if (menu && menu.classList.contains("show")) {
    menu.classList.remove("show");
    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", "false");
      const icon = menuBtn.querySelector("i");
      if (icon) icon.className = "fas fa-bars";
    }
    // Re-enable body scroll
    document.body.style.overflow = "";
    document.body.style.position = "";
  }
}

// Setup mobile menu navigation
function setupMobileMenuNavigation() {
  // Use event delegation on the nav-links container for better reliability
  const navLinksContainer = document.getElementById("navLinks");
  if (navLinksContainer) {
    // Remove any existing listeners
    navLinksContainer.removeEventListener("click", handleNavLinkClickDelegate);
    
    // Add event delegation listener
    navLinksContainer.addEventListener("click", handleNavLinkClickDelegate, { capture: false });
  }
}

// Event delegation handler for nav links
function handleNavLinkClickDelegate(e) {
  // Don't interfere with toggle buttons - they have their own onclick handlers
  const clickedToggle = e.target.closest('.mobile-theme-toggle, .mobile-lang-toggle');
  if (clickedToggle) {
    return; // Let the onclick handler work
  }
  
  const navLink = e.target.closest('.nav-link');
  if (navLink) {
    handleNavLinkClick.call(navLink, e);
  }
}

// Navigation link click handler
function handleNavLinkClick(e) {
  const link = this; // 'this' refers to the nav-link element when called with .call()
  const href = link.getAttribute("href");
  
  if (!href) return;
  
  // Always close menu immediately
  closeMobileMenu();
  
  // Handle hash links with smooth scroll (same page)
  if (href.startsWith("#")) {
    e.preventDefault();
    e.stopPropagation();
    
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    // Scroll to target after menu closes
    if (targetElement) {
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 250);
    } else {
      // If element not found, try scrolling after a longer delay
      setTimeout(() => {
        const retryElement = document.getElementById(targetId);
        if (retryElement) {
          retryElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    }
  } else if (href.includes("app.html")) {
    // For app.html links, handle navigation
    if (href.includes("#")) {
      // Link has both page and hash (e.g., app.html#opportunities)
      e.preventDefault();
      e.stopPropagation();
      
      const parts = href.split("#");
      const page = parts[0];
      const hash = parts[1];
      
      // Check if we're already on the target page
      const currentPage = window.location.pathname.split('/').pop() || 'app.html';
      if (currentPage === page || (currentPage === '' && page === 'app.html')) {
        // Same page - just scroll to hash
        closeMobileMenu();
        setTimeout(() => {
          const targetElement = document.getElementById(hash);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 250);
      } else {
        // Different page - navigate first, then scroll
        // Store hash in sessionStorage for after page load
        sessionStorage.setItem('scrollToHash', hash);
        window.location.href = href; // Navigate with hash
      }
    } else {
      // Just app.html - allow natural navigation
      // Don't prevent default - menu already closed
    }
  }
  // For any other links, allow natural navigation
}

// Setup mobile toggle button event listeners - uses shared global state
function setupMobileToggleButtons() {
  const mobileThemeToggle = document.querySelector('.mobile-theme-toggle');
  const mobileLangToggle = document.querySelector('.mobile-lang-toggle');
  
  if (mobileThemeToggle) {
    // Remove any existing listeners by cloning
    const newThemeBtn = mobileThemeToggle.cloneNode(true);
    mobileThemeToggle.parentNode.replaceChild(newThemeBtn, mobileThemeToggle);
    
    newThemeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      // Use shared global state function (same as desktop)
      toggleTheme();
      // Close menu immediately
      closeMobileMenu();
    });
  }
  
  if (mobileLangToggle) {
    // Remove any existing listeners by cloning
    const newLangBtn = mobileLangToggle.cloneNode(true);
    mobileLangToggle.parentNode.replaceChild(newLangBtn, mobileLangToggle);
    
    newLangBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      // Use shared global state function (same as desktop)
      toggleLanguage();
      // Close menu immediately
      closeMobileMenu();
    });
  }
}

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenuNavigation();
    setupMobileToggleButtons();
  });
} else {
  // DOM already loaded
  setupMobileMenuNavigation();
  setupMobileToggleButtons();
}

function scrollToProfile() {
  closeProfileMenu();
  window.location.href = "profile.html";
}





