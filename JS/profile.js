// Profile Page JavaScript

// Translation helper for profile.js
function getProfileTranslation(key) {
  const currentLang = localStorage.getItem("lang") || "en";
  const translations = {
    en: {
      fieldRequired: "This field is required",
      validEmail: "Please enter a valid email address",
      validURL: "Please enter a valid URL",
      validPhone: "Please enter a valid phone number",
      imageFile: "Please select an image file",
      imageSize: "Image size should be less than 5MB",
      enterSkill: "Please enter a skill",
      skillExists: "This skill is already added",
      maxSkills: "Maximum 20 skills allowed",
      resetConfirm: "Are you sure you want to reset all changes?",
      profileSaved: "Profile saved successfully!"
    },
    hi: {
      fieldRequired: "यह फ़ील्ड आवश्यक है",
      validEmail: "कृपया एक वैध ईमेल पता दर्ज करें",
      validURL: "कृपया एक वैध URL दर्ज करें",
      validPhone: "कृपया एक वैध फोन नंबर दर्ज करें",
      imageFile: "कृपया एक छवि फ़ाइल चुनें",
      imageSize: "छवि का आकार 5MB से कम होना चाहिए",
      enterSkill: "कृपया एक कौशल दर्ज करें",
      skillExists: "यह कौशल पहले से जोड़ा गया है",
      maxSkills: "अधिकतम 20 कौशल की अनुमति है",
      resetConfirm: "क्या आप वाकई सभी परिवर्तनों को रीसेट करना चाहते हैं?",
      profileSaved: "प्रोफ़ाइल सफलतापूर्वक सहेजी गई!"
    }
  };
  return translations[currentLang]?.[key] || translations.en[key] || key;
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  setupFormValidation();
  setupBioCharCount();
  setupSkillInput();
  applyLanguage();
  updateThemeIcon(document.body.classList.contains("dark"));
  updateLanguageIcon(localStorage.getItem("lang") || "en");
});

// Load saved profile data
function loadProfile() {
  // Load avatar from localStorage first (for backward compatibility)
  const savedAvatar = localStorage.getItem("avatar");
  if (savedAvatar) {
    document.getElementById("profileAvatar").src = savedAvatar;
    const navAvatar = document.getElementById("avatar");
    if (navAvatar) navAvatar.src = savedAvatar;
  }
  
  const profileData = localStorage.getItem("profileData");
  if (profileData) {
    try {
      const data = JSON.parse(profileData);
      
      // Load avatar from profile data (overrides localStorage if exists)
      if (data.avatar) {
        document.getElementById("profileAvatar").src = data.avatar;
        const navAvatar = document.getElementById("avatar");
        if (navAvatar) navAvatar.src = data.avatar;
      }
      
      // Load form fields
      if (data.fullName) document.getElementById("fullName").value = data.fullName;
      if (data.email) document.getElementById("email").value = data.email;
      if (data.phone) document.getElementById("phone").value = data.phone;
      if (data.location) document.getElementById("location").value = data.location;
      if (data.bio) {
        document.getElementById("bio").value = data.bio;
        updateBioCharCount();
      }
      if (data.github) document.getElementById("github").value = data.github;
      if (data.linkedin) document.getElementById("linkedin").value = data.linkedin;
      if (data.portfolio) document.getElementById("portfolio").value = data.portfolio;
      if (data.twitter) document.getElementById("twitter").value = data.twitter;
      
      // Load skills
      if (data.skills && Array.isArray(data.skills)) {
        data.skills.forEach(skill => {
          addSkillToContainer(skill);
        });
      }
    } catch (e) {
      console.error("Error loading profile:", e);
    }
  }
}

// Save profile data
function saveProfile() {
  const form = document.getElementById("profileForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }

  const skills = Array.from(document.querySelectorAll(".skill-tag span")).map(tag => tag.textContent.trim());
  
  const profileData = {
    avatar: document.getElementById("profileAvatar").src,
    fullName: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    location: document.getElementById("location").value.trim(),
    bio: document.getElementById("bio").value.trim(),
    skills: skills,
    github: document.getElementById("github").value.trim(),
    linkedin: document.getElementById("linkedin").value.trim(),
    portfolio: document.getElementById("portfolio").value.trim(),
    twitter: document.getElementById("twitter").value.trim(),
    lastUpdated: new Date().toISOString()
  };

  localStorage.setItem("profileData", JSON.stringify(profileData));
  
  // Update navbar avatar
  const navAvatar = document.getElementById("avatar");
  if (navAvatar) {
    navAvatar.src = profileData.avatar;
  }
  
  // Save avatar separately for quick access
  if (profileData.avatar) {
    localStorage.setItem("avatar", profileData.avatar);
  }

  showSuccessMessage();
  return true;
}

// Handle form submission
document.getElementById("profileForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (saveProfile()) {
    // Optional: redirect after save
    // setTimeout(() => window.location.href = "app.html", 1500);
  }
});

// Avatar upload handler
function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith("image/")) {
    showError(getProfileTranslation("imageFile"));
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showError(getProfileTranslation("imageSize"));
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const avatarImg = document.getElementById("profileAvatar");
    avatarImg.src = e.target.result;
    
    // Update navbar avatar immediately
    const navAvatar = document.getElementById("avatar");
    if (navAvatar) {
      navAvatar.src = e.target.result;
    }
    
    // Auto-save avatar
    localStorage.setItem("avatar", e.target.result);
  };
  reader.readAsDataURL(file);
}

// Remove avatar
function removeAvatar() {
  const defaultAvatar = "assets/profile.png";
  document.getElementById("profileAvatar").src = defaultAvatar;
  
  const navAvatar = document.getElementById("avatar");
  if (navAvatar) {
    navAvatar.src = defaultAvatar;
  }
  
  localStorage.removeItem("avatar");
}

// Setup form validation
function setupFormValidation() {
  const form = document.getElementById("profileForm");
  const inputs = form.querySelectorAll("input[required], textarea[required]");

  inputs.forEach(input => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => clearError(input));
  });

  // Email validation
  const emailInput = document.getElementById("email");
  emailInput.addEventListener("blur", () => {
    if (emailInput.value && !isValidEmail(emailInput.value)) {
      showFieldError(emailInput, getProfileTranslation("validEmail"));
    }
  });

  // URL validation for social links
  const urlInputs = ["github", "linkedin", "portfolio", "twitter"];
  urlInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("blur", () => {
        if (input.value && !isValidURL(input.value)) {
          showFieldError(input, getProfileTranslation("validURL"));
        } else {
          clearError(input);
        }
      });
    }
  });

  // Phone validation
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("blur", () => {
      if (phoneInput.value && !isValidPhone(phoneInput.value)) {
        showFieldError(phoneInput, getProfileTranslation("validPhone"));
      } else {
        clearError(phoneInput);
      }
    });
  }
}

// Validate individual field
function validateField(field) {
  if (field.hasAttribute("required") && !field.value.trim()) {
    showFieldError(field, getProfileTranslation("fieldRequired"));
    return false;
  }
  clearError(field);
  return true;
}

// Show field error
function showFieldError(field, message) {
  const errorId = field.id + "Error";
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.textContent = message;
  }
  field.style.borderColor = "#dc2626";
}

// Clear field error
function clearError(field) {
  const errorId = field.id + "Error";
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.textContent = "";
  }
  field.style.borderColor = "";
}

// Validation helpers
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

// Bio character count
function setupBioCharCount() {
  const bioTextarea = document.getElementById("bio");
  bioTextarea.addEventListener("input", updateBioCharCount);
  updateBioCharCount();
}

function updateBioCharCount() {
  const bio = document.getElementById("bio");
  const charCount = document.getElementById("bioCharCount");
  const count = bio.value.length;
  charCount.textContent = count;
  
  if (count > 500) {
    charCount.style.color = "#dc2626";
    bio.style.borderColor = "#dc2626";
  } else {
    charCount.style.color = "";
    bio.style.borderColor = "";
  }
}

// Skills management
let skills = [];

function setupSkillInput() {
  const skillInput = document.getElementById("skillInput");
  
  skillInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  });
}

function addSkill() {
  const skillInput = document.getElementById("skillInput");
  const skill = skillInput.value.trim();
  
  if (!skill) {
    showError(getProfileTranslation("enterSkill"));
    return;
  }
  
  if (skills.includes(skill)) {
    showError(getProfileTranslation("skillExists"));
    return;
  }
  
  if (skills.length >= 20) {
    showError(getProfileTranslation("maxSkills"));
    return;
  }
  
  skills.push(skill);
  addSkillToContainer(skill);
  skillInput.value = "";
  skillInput.focus();
}

function addSkillToContainer(skill) {
  const container = document.getElementById("skillsContainer");
  const tag = document.createElement("div");
  tag.className = "skill-tag";
  tag.innerHTML = `
    <span>${escapeHtml(skill)}</span>
    <button type="button" class="remove-skill" onclick="removeSkill('${escapeHtml(skill)}')" aria-label="Remove skill">
      <i class="fas fa-times"></i>
    </button>
  `;
  container.appendChild(tag);
}

function removeSkill(skill) {
  skills = skills.filter(s => s !== skill);
  const container = document.getElementById("skillsContainer");
  const tags = container.querySelectorAll(".skill-tag");
  tags.forEach(tag => {
    if (tag.querySelector("span").textContent.trim() === skill) {
      tag.remove();
    }
  });
}

// Reset form
function resetForm() {
  if (confirm(getProfileTranslation("resetConfirm"))) {
    document.getElementById("profileForm").reset();
    document.getElementById("skillsContainer").innerHTML = "";
    skills = [];
    document.getElementById("profileAvatar").src = "assets/profile.png";
    updateBioCharCount();
    
    // Clear all errors
    document.querySelectorAll(".error-message").forEach(el => {
      el.textContent = "";
    });
    
    document.querySelectorAll("input, textarea").forEach(field => {
      field.style.borderColor = "";
    });
  }
}

// Success message
function showSuccessMessage() {
  const message = document.getElementById("successMessage");
  message.classList.remove("hidden");
  
  setTimeout(() => {
    message.classList.add("hidden");
  }, 3000);
}

// Error message (simple alert for now)
function showError(message) {
  alert(message);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Load skills from saved data
document.addEventListener("DOMContentLoaded", () => {
  const profileData = localStorage.getItem("profileData");
  if (profileData) {
    try {
      const data = JSON.parse(profileData);
      if (data.skills && Array.isArray(data.skills)) {
        skills = [...data.skills];
      }
    } catch (e) {
      console.error("Error loading skills:", e);
    }
  }
});

