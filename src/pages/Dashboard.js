import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/romantic.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Generate random hearts for animation
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + "%",
      delay: Math.random() * 5 + "s",
      duration: Math.random() * 3 + 3 + "s",
    }));
    setHearts(newHearts);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="romantic-dashboard">
      <button className="logout-btn-top" onClick={handleLogout}>
        Logout
      </button>

      <div className="floating-hearts">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="heart"
            style={{
              left: heart.left,
              animationDelay: heart.delay,
              animationDuration: heart.duration,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      <div className="romantic-content">
        <img 
          src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000&auto=format&fit=crop" 
          alt="Romantic" 
          className="romantic-image" 
        />
        <h1>Hello, My Dear!</h1>
        <div className="emojis">❤️ 💖 💋 🌹 💏</div>
        <p>Welcome to your personal romantic space.</p>
      </div>

      <div className="add-user-icon-container" onClick={() => navigate("/add-user")}>
        <div className="tooltip">Add New User</div>
        <div className="add-user-icon">
          👤<span style={{ fontSize: "1rem", position: "absolute", bottom: "15px", right: "15px" }}>+</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
