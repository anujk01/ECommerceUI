import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import "../styles/romantic.css";

const Gallery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const [activeMood, setActiveMood] = useState(location.state?.mood || "all");

  const moods = [
    { id: "all", label: "All Moments", icon: "✨" },
    { id: "happy", label: "Happy", icon: "😊" },
    { id: "funny", label: "Funny", icon: "😂" },
    { id: "vacation", label: "Vacation", icon: "🏖️" },
    { id: "angry", label: "Angry", icon: "😡" },
    { id: "cute", label: "Cute", icon: "🥺" },
    { id: "magic", label: "Magic", icon: "🪄" }
  ];

  const photos = [
    { id: 1, mood: "happy", url: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=600", caption: "Our brightest smiles! ❤️" },
    { id: 2, mood: "funny", url: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?q=80&w=600", caption: "Always making me laugh! 😂" },
    { id: 3, mood: "vacation", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600", caption: "Under the summer sun 🏖️" },
    { id: 4, mood: "angry", url: "https://images.unsplash.com/photo-1516589174184-c68526514b0c?q=80&w=600", caption: "Even when you're mad, you're cute! 😡❤️" },
    { id: 5, mood: "cute", url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600", caption: "Simply adorable... 🥺" },
    { id: 6, mood: "magic", url: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=600", caption: "Magic in the air ✨" },
    { id: 7, mood: "happy", url: "https://images.unsplash.com/photo-1516589174184-c68526514b0c?q=80&w=600", caption: "Pure joy with you! 🥰" },
    { id: 8, mood: "vacation", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600", caption: "Lost in paradise 🏔️" },
  ];

  const filteredPhotos = activeMood === "all" 
    ? photos 
    : photos.filter(p => p.mood === activeMood);

  const [logoutStep, setLogoutStep] = useState(0);

  const handleLogoutClick = () => {
    setLogoutStep(1);
  };

  const handleConfirmLogout = () => {
    if (logoutStep < 4) {
      setLogoutStep(logoutStep + 1);
    } else {
      localStorage.removeItem("token");
      navigate("/", { replace: true });
    }
  };

  const cancelLogout = () => {
    setLogoutStep(0);
  };

  const logoutMessages = [
    {
      q: "Are you sure you want to leave my heart? 🥺",
      yes: "Yes, I must go",
      no: "No, keep me in your world"
    },
    {
      q: "Really? You're breaking our magic... 💔",
      yes: "I'm sure",
      no: "Never mind, I'm staying"
    },
    {
      q: "Is this a dream? Please say you're staying! 🌹",
      yes: "Yes, I'm leaving",
      no: "I can't leave you"
    },
    {
      q: "Final chance... Do you really want to wake up from this dream? ✨",
      yes: "Yes, Goodbye",
      no: "No, let's keep dreaming ❤️"
    }
  ];

  return (
    <div className="romantic-dashboard gallery-page">
      <button className="romantic-logout-btn" onClick={handleLogoutClick}>
        Goodbye for now?
      </button>

      {/* Persistent Logout Modal */}
      {logoutStep > 0 && (
        <div className="romantic-modal-overlay" onClick={cancelLogout}>
          <div className="romantic-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={cancelLogout}>✕</button>
            <div className="modal-icon">🥺</div>
            <h2 className="modal-message">{logoutMessages[logoutStep - 1].q}</h2>
            <div className="logout-options">
              <button className="logout-yes-btn" onClick={handleConfirmLogout}>
                {logoutMessages[logoutStep - 1].yes}
              </button>
              <button className="logout-no-btn" onClick={cancelLogout}>
                {logoutMessages[logoutStep - 1].no}
              </button>
            </div>
          </div>
        </div>
      )}
      <button className="back-to-cards-btn" onClick={() => navigate("/dashboard")}>
        Back to Cards
      </button>

      <div className="dashboard-header">
        <h1>Our Memory Lane</h1>
        <p>A collection of our beautiful moments together...</p>
      </div>

      <div className="mood-tabs">
        {moods.map(mood => (
          <button 
            key={mood.id}
            className={`mood-tab ${activeMood === mood.id ? "active" : ""}`}
            onClick={() => setActiveMood(mood.id)}
          >
            <span>{mood.icon}</span> {mood.label}
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {filteredPhotos.map(photo => (
          <div key={photo.id} className="gallery-card">
            <div className="photo-container">
              <img src={photo.url} alt={photo.caption} />
              <div className="photo-overlay">
                <p>{photo.caption}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
