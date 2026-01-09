// Translation helper for auth.js
function getTranslation(key) {
  const currentLang = localStorage.getItem("lang") || "en";
  const translations = {
    en: {
      fillAllFields: "Please fill all fields",
      userExists: "User already exists. Please login.",
      accountCreated: "Account created successfully! Now login.",
      invalidCredentials: "Invalid credentials"
    },
    hi: {
      fillAllFields: "कृपया सभी फ़ील्ड भरें",
      userExists: "उपयोगकर्ता पहले से मौजूद है। कृपया लॉगिन करें।",
      accountCreated: "खाता सफलतापूर्वक बनाया गया! अब लॉगिन करें।",
      invalidCredentials: "अमान्य क्रेडेंशियल"
    }
  };
  return translations[currentLang]?.[key] || translations.en[key] || key;
}

// SIGN UP FUNCTION
function signup() {
  const name = document.getElementById("su-name").value;
  const email = document.getElementById("su-email").value;
  const password = document.getElementById("su-password").value;

  if (!name || !email || !password) {
    alert(getTranslation("fillAllFields"));
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const userExists = users.find(user => user.email === email);
  if (userExists) {
    alert(getTranslation("userExists"));
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));

  alert(getTranslation("accountCreated"));
}


// LOGIN FUNCTION
function login() {
  const email = document.getElementById("li-email").value;
  const password = document.getElementById("li-password").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    user => user.email === email && user.password === password
  );

  if (!user) {
    alert(getTranslation("invalidCredentials"));
    return;
  }

  localStorage.setItem("loggedIn", "true");
  localStorage.setItem("currentUser", JSON.stringify(user));

  window.location.href = "app.html";
}


// LOGOUT
function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("currentUser");
  window.location.href = "auth.html";
}
