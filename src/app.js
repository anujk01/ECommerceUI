// === CONFIG ===
// change if your API is hosted elsewhere:
const API_BASE = "https://localhost:7051/"; // <-- replace with your API URL (http/https)
const LOGIN_PATH = "/api/auth/login";
const PROFILE_PATH = "/api/user/addUser";

const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const messageEl = document.getElementById("message");
const callProtectedBtn = document.getElementById("callProtected");
const logoutBtn = document.getElementById("logoutBtn");

function showMessage(text, type = "info") {
  messageEl.textContent = text;
  messageEl.className = "message " + (type === "success" ? "success" : type === "error" ? "error" : "");
}

function saveToken(token) {
  localStorage.setItem("authToken", token);
}

function getToken() {
  return localStorage.getItem("authToken");
}

function clearToken() {
  localStorage.removeItem("authToken");
}

// wrapper for fetch with token
async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = options.headers || {};

  if (token) headers["Authorization"] = "Bearer " + token;
  headers["Content-Type"] = "application/json";

  const res = await fetch(url, {...options, headers});
  return res;
}

// handle login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    showMessage("Enter username and password", "error");
    return;
  }

  loginBtn.disabled = true;
  showMessage("Signing in...");

  try {
    const res = await fetch(API_BASE + LOGIN_PATH, {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      if (res.status === 401) {
        showMessage("Invalid credentials", "error");
      } else {
        showMessage("Login failed (status " + res.status + ")", "error");
      }
      loginBtn.disabled = false;
      return;
    }

    const data = await res.json();
    const token = data.token || data.token?.token || data.accessToken || data?.tokenString;

    if (!token) {
      // sometimes API returns different shape: adjust accordingly
      showMessage("Login response does not include token", "error");
      loginBtn.disabled = false;
      return;
    }

    saveToken(token);
    showMessage("Logged in ✅", "success");
    loginBtn.disabled = false;
  } catch (err) {
    console.error(err);
    showMessage("Network error", "error");
    loginBtn.disabled = false;
  }
});

// call protected API
callProtectedBtn.addEventListener("click", async () => {
  showMessage("Calling protected API...");
  try {
    const res = await authFetch(API_BASE + PROFILE_PATH, { method: "GET" });

    if (res.status === 401) {
      showMessage("Unauthorized — token missing/invalid/expired", "error");
      return;
    }

    if (!res.ok) {
      showMessage("Error calling API: status " + res.status, "error");
      return;
    }

    const payload = await res.json();
    showMessage("Protected API returned: " + JSON.stringify(payload), "success");
  } catch (err) {
    console.error(err);
    showMessage("Network error while calling protected API", "error");
  }
});

logoutBtn.addEventListener("click", () => {
  clearToken();
  showMessage("Logged out");
});