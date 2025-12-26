function toggleProfileMenu() {
  const menu = document.getElementById("profileMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", function (e) {
  const profile = document.querySelector(".profile-circle");
  const menu = document.getElementById("profileMenu");

  if (menu && profile && !profile.contains(e.target)) {
    menu.style.display = "none";
  }
});


function toggleTheme() {
  document.body.classList.toggle("dark");

  const mode = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", mode);
}

// Load theme
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
});



function uploadAvatar(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    localStorage.setItem("avatar", reader.result);
    document.getElementById("avatar").src = reader.result;
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
        <h4>Demo User – Full Stack Dev</h4>
        <p><b>Can Teach:</b> Web Development</p>
        <p><b>Wants to Learn:</b> ${teachInput || "Any Skill"}</p>

        <button>📹 Video Call</button>
        <button>📂 Share Notes</button>
        <button>📅 Schedule Meet</button>
      </div>
    `;
  }
}


  if (!found) {
    cards.innerHTML = "<p>No matching users found yet.</p>";
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
    return "Add your skills using the Add Skills section above.";

  if (msg.includes("match"))
    return "Matches appear only after submitting your skills.";

  if (msg.includes("learn"))
    return "Learning is better when you teach and learn together!";

  if (msg.includes("hackathon"))
    return "SkillSwap helps you find collaborators for hackathons.";

  if (msg.includes("contact"))
    return "You can contact us using the Contact section below.";

  return "I'm here to help 😊 Ask me about skills, matches, or learning.";
}
// LANGUAGE TOGGLE
let currentLang = localStorage.getItem("lang") || "en";

function applyLanguage() {
  document.querySelectorAll("[data-en]").forEach(el => {
    el.textContent = currentLang === "hi" && el.dataset.hi ? el.dataset.hi : el.dataset.en;
  });
}

// Expose globally
function toggleLanguage() {
  currentLang = currentLang === "en" ? "hi" : "en";
  localStorage.setItem("lang", currentLang);
  applyLanguage();
}

// Apply language on page load
document.addEventListener("DOMContentLoaded", applyLanguage);


function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "auth.html";
}





