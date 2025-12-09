// CHANGE THIS to your secret member code
const SECRET_ACCESS_CODE = "CJHOUSE2025";

const form = document.getElementById("loginForm");
const errorBox = document.getElementById("error");

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.style.display = "block";
  setTimeout(() => {
    errorBox.style.display = "none";
  }, 3000);
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const usernameRaw = document.getElementById("username").value.trim();
  const code = document.getElementById("code").value.trim();

  if (code !== SECRET_ACCESS_CODE) {
    showError("Invalid access code. Please check and try again.");
    return;
  }

  const username = usernameRaw || "Member";

  // Load existing member DB
  let members = {};
  try {
    members = JSON.parse(localStorage.getItem("cj_members") || "{}");
  } catch (err) {
    members = {};
  }

  const now = new Date().toLocaleString();
  const key = username;

  // Block login if disabled
  if (members[key] && members[key].active === false) {
    showError("Your access has been disabled. Please contact Coach Joel.");
    return;
  }

  // First time login
  if (!members[key]) {
    members[key] = {
      username: username,
      registered: now,
      lastLogin: now,
      active: true,
      logins: [now]
    };
  } else {
    members[key].lastLogin = now;
    if (!Array.isArray(members[key].logins)) {
      members[key].logins = [];
    }
    members[key].logins.push(now);

    if (typeof members[key].active === "undefined") {
      members[key].active = true;
    }
  }

  // Save database
  localStorage.setItem("cj_members", JSON.stringify(members));

  // Session flags
  localStorage.setItem("cj_logged_in", "1");
  localStorage.setItem("cj_username", username);

  window.location.href = "dashboard.html";
});
