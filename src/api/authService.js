const API_BASE = process.env.REACT_APP_API_BASE_URL || "https://localhost:7051";

export async function login(username, password) {
  const url = new URL(`${API_BASE}/Auth/api/login`);
  url.searchParams.append("username", username);
  url.searchParams.append("password", password);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "accept": "*/*",
    },
    body: "", // Empty body as per -d ''
  });

  if (!response.ok) {
    let errorMessage = "Login failed";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
    } catch (e) {
      errorMessage = await response.text() || response.statusText;
    }
    throw new Error(errorMessage);
  }
  return await response.json(); // This should include the JWT token
}

export async function addUser(userDetails) {
  const { username, password, email, secretkey } = userDetails;
  const url = new URL(`${API_BASE}/Feature/api/addUser`);
  url.searchParams.append("username", username);
  url.searchParams.append("password", password);
  url.searchParams.append("email", email);
  url.searchParams.append("secretkey", secretkey);

  const token = localStorage.getItem("token");

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "accept": "*/*",
      "Authorization": token ? `Bearer ${token}` : "",
    },
    body: "", // Empty body as per -d ''
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to add user");
  }
  return await response.json();
}