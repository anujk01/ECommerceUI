import React, { useState } from "react";
import { login } from "../api/authService";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
debugger;
  const handleSubmit = async (e) => {
    e.preventDefault(); // important! prevents page navigation
    try {
      const response = await login({ username, password });
      console.log("Login response:", response);
      // Save token to localStorage or state
      localStorage.setItem("token", response.token);
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;