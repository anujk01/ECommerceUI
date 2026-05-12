import React, { useState } from "react";
import { addUser } from "../api/authService";
import "../styles/login.css"; // Reuse premium styles
import { useNavigate } from "react-router-dom";

function AddUser() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    secretkey: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await addUser(formData);
      setSuccess("User added successfully!");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error("Add user failed:", err);
      setError(err.message || "Failed to add user. Check your permissions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: "500px" }}>
      <h2>Add New User</h2>
      <p className="subtitle">Fill in the details to register a new account</p>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message" style={{ color: "#059669", background: "#ecfdf5", padding: "12px", borderRadius: "8px", textAlign: "center", marginBottom: "20px", border: "1px solid #d1fae5" }}>{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="secretkey">Secret Key</label>
          <input
            id="secretkey"
            type="text"
            placeholder="Admin secret key"
            value={formData.secretkey}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Adding User..." : "Add User"}
        </button>
        <button 
          type="button" 
          className="secondary-button" 
          onClick={() => navigate("/dashboard")}
          style={{ background: "transparent", color: "#6b7280", border: "1px solid #e5e7eb", marginTop: "10px" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddUser;
