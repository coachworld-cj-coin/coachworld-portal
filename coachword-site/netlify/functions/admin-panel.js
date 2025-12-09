// === AUTH GUARD ===
const adminAuth = localStorage.getItem("cj_admin_logged");
if (adminAuth !== "1") window.location = "admin.html";

const tableBody = document.querySelector("#memberTable tbody");
let members = {};

function loadMembers() {
  try {
    members = JSON.parse(localStorage.getItem("cj_members") || "{}");
  } catch (e) {
    members = {};
  }
}

function saveMembers() {
  localStorage.setItem("cj_members", JSON.stringify(members));
}

function renderTable() {
  loadMembers();
  tableBody.innerHTML = "";
  const keys = Object.keys(members);
  if (keys.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='6'>No members have logged in yet.</td></tr>";
    return;
  }

  keys.forEach(user => {
    const m = members[user];
    const loginCount = m.logins && Array.isArray(m.logins) ? m.logins.length : 0;
    const registered = m.registered || "-";
    const lastLogin = m.lastLogin || "-";
    const active = (typeof m.active === "undefined") ? true : m.active;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${m.username || user}</td>
      <td>${registered}</td>
      <td>${lastLogin}</td>
      <td>${loginCount}</td>
      <td>
        ${active ?
          "<span class='status-active'>Active</span>" :
          "<span class='status-disabled'>Disabled</span>"
        }
      </td>
      <td>
        <span class="pill" onclick="toggleStatus('${user}')">
          ${active ? "Disable" : "Activate"}
        </span>
        <span class="pill" onclick="viewHistory('${user}')">
          History
        </span>
        <span class="pill" onclick="deleteMember('${user}')">
          Delete
        </span>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// === ACTIONS ===
function toggleStatus(user) {
  loadMembers();
  if (!members[user]) return;
  const current = (typeof members[user].active === "undefined") ? true : members[user].active;
  members[user].active = !current;
  saveMembers();
  renderTable();
}

function viewHistory(user) {
  loadMembers();
  const m = members[user];
  if (!m || !Array.isArray(m.logins) || m.logins.length === 0) {
    alert("No login history for " + user);
    return;
  }
  alert("Login history for " + (m.username || user) + ":\n\n" + m.logins.join("\n"));
}

function deleteMember(user) {
  if (!confirm("Delete member '" + user + "' from records? This cannot be undone.")) return;
  loadMembers();
  delete members[user];
  saveMembers();
  renderTable();
}

// Expose functions for inline onclick
window.toggleStatus = toggleStatus;
window.viewHistory = viewHistory;
window.deleteMember = deleteMember;

// === ADMIN LOGOUT ===
document.getElementById("adminLogout").addEventListener("click", () => {
  localStorage.removeItem("cj_admin_logged");
  window.location = "admin.html";
});

// Init
renderTable();
