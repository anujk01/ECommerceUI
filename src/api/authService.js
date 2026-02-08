const API_BASE = "https://localhost:7051";

export async function login(username, password) {
  const response = await fetch(`${API_BASE}/Auth/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }
  return await response.json(); // This should include the JWT token
}
