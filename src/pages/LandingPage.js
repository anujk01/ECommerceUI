import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/romantic.css";
import wallpaper from "../assets/login_bg.png";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleHeartClick = () => {
    navigate("/login", { state: { allowed: true } });
  };

  return (
    <div 
      className="landing-page" 
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className="landing-overlay"></div>
      
      <div className="landing-heart-container" onClick={handleHeartClick}>
        <div className="big-heart">❤️</div>
        <div className="landing-text">if you love me then press</div>
      </div>
    </div>
  );
};

export default LandingPage;
