import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "../styles/romantic.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [hearts, setHearts] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

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



  const greetingCards = [
    { 
      id: 1, 
      text: "Click if you love me ❤️", 
      icon: "💖", 
      theme: "card-love",
      message: "I knew it! But just so you know, I love you infinitely more. ❤️",
      subtext: "You're my forever and always.",
      actionText: "Step into the sanctuary of our love...",
      mood: "happy"
    },
    { 
      id: 2, 
      text: "Click if you hate me 🥺", 
      icon: "💔", 
      theme: "card-hate",
      message: "Oh no! Even when you're mad, you're the most beautiful person in the world. 🥺",
      subtext: "Can I earn a tiny smile back?",
      actionText: "Let our memories melt the silence away...",
      mood: "funny"
    },
    { 
      id: 3, 
      text: "Click if you're hungry 🍕", 
      icon: "😋", 
      theme: "card-hungry",
      message: "Virtual Menu for my Queen: 🍕 Infinite Kisses, 🍫 Warm Hugs, 🌹 A real date night.",
      subtext: "What are we ordering tonight?",
      actionText: "A banquet of our best moments awaits...",
      mood: "vacation"
    },
    { 
      id: 4, 
      text: "Click if you're upset with me 😔", 
      icon: "🌹", 
      theme: "card-upset",
      message: "I'm sorry for being silly. Here is a flower for the flower of my life. 🌹",
      subtext: "You're too precious to be upset with.",
      actionText: "Let's find our sunshine in these pages...",
      mood: "cute"
    },
    { 
      id: 5, 
      text: "Click if you want to go for a long drive 🚗", 
      icon: "✨", 
      theme: "card-drive",
      message: "Pack your bags in your mind! We’re heading to the stars tonight. 🚗✨",
      subtext: "Buckle up, Buttercup! Our destination is happiness.",
      actionText: "Start the engine of our memory lane...",
      mood: "magic"
    },
    { 
      id: 6, 
      text: "Click if you're missing me right now 🫂", 
      icon: "💌", 
      theme: "card-missing",
      message: "Close your eyes... I'm sending a warm hug right through the screen. 🫂",
      subtext: "I'm missing you even more than you think.",
      actionText: "Touch me to feel our hearts beat as one...",
      mood: "all"
    }
  ];

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

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
    <div className="romantic-dashboard">
      <button className="romantic-logout-btn" onClick={handleLogoutClick}>
        Please don't go?
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
      <div className="dashboard-header">
        <h1>Welcome, My Dear!</h1>
        <p>Choose a card to express your feelings...</p>
      </div>

      <div className="dashboard-grid">
        {greetingCards.map((card) => (
          <div 
            key={card.id} 
            className={`greeting-card ${card.theme}`}
            onClick={() => handleCardClick(card)}
          >
            <div className="card-icon">{card.icon}</div>
            <h3>{card.text}</h3>
          </div>
        ))}
      </div>

      {/* Romantic Message Modal */}
      {isModalOpen && selectedCard && (
        <div className="romantic-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="romantic-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            <div className="modal-icon">{selectedCard.icon}</div>
            <h2 className="modal-message">{selectedCard.message}</h2>
            <p className="modal-subtext">{selectedCard.subtext}</p>
            <button 
              className="modal-action-btn" 
              onClick={() => navigate("/gallery", { state: { mood: selectedCard.mood } })}
            >
              {selectedCard.actionText}
            </button>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default Dashboard;
