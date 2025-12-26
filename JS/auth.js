// SIGN UP FUNCTION
function signup() {
  const name = document.getElementById("su-name").value;
  const email = document.getElementById("su-email").value;
  const password = document.getElementById("su-password").value;

  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const userExists = users.find(user => user.email === email);
  if (userExists) {
    alert("User already exists. Please login.");
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created successfully! Now login.");
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
    alert("Invalid credentials");
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
