import React, { useState, useEffect } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { journeyPhotos } from "../data/galleryData";
import "../styles/romantic.css";

const Gallery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const [currentIndex, setCurrentIndex] = useState(location.state?.startIndex || 0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [logoutStep, setLogoutStep] = useState(0);

  const currentPhoto = journeyPhotos[currentIndex];

  // Preload images for a faster experience
  useEffect(() => {
    const preloadImages = () => {
      const nextIndex = currentIndex + 1;
      const prevIndex = currentIndex - 1;
      
      const toPreload = [];
      if (nextIndex < journeyPhotos.length) toPreload.push(journeyPhotos[nextIndex].fileName);
      if (prevIndex >= 0) toPreload.push(journeyPhotos[prevIndex].fileName);

      toPreload.forEach(fileName => {
        const img = new Image();
        img.src = require(`../assets/${fileName}`);
      });
    };
    preloadImages();
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < journeyPhotos.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setShowThankYou(true);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleStartOver = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(0);
      setShowThankYou(false);
      setIsTransitioning(false);
    }, 300);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleLogoutClick = () => setLogoutStep(1);
  const handleConfirmLogout = () => {
    if (logoutStep < 4) setLogoutStep(logoutStep + 1);
    else {
      localStorage.removeItem("token");
      navigate("/", { replace: true });
    }
  };
  const cancelLogout = () => setLogoutStep(0);

  const logoutMessages = [
    { q: "Are you sure you want to leave my heart? 🥺", yes: "Yes, I must go", no: "No, keep me in your world" },
    { q: "Really? You're breaking our magic... 💔", yes: "I'm sure", no: "Never mind, I'm staying" },
    { q: "Is this a dream? Please say you're staying! 🌹", yes: "Yes, I'm leaving", no: "I can't leave you" },
    { q: "Final chance... Do you really want to wake up from this dream? ✨", yes: "Yes, Goodbye", no: "No, let's keep dreaming ❤️" }
  ];

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handleBack();
  };

  return (
    <div className="romantic-dashboard story-page" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
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
              <button className="logout-yes-btn" onClick={handleConfirmLogout}>{logoutMessages[logoutStep - 1].yes}</button>
              <button className="logout-no-btn" onClick={cancelLogout}>{logoutMessages[logoutStep - 1].no}</button>
            </div>
          </div>
        </div>
      )}

      <button className="back-to-dashboard-btn" onClick={() => navigate("/dashboard")}>
        Home
      </button>

      <div className="story-container">
        {showThankYou ? (
          <div className={`thank-you-page ${isTransitioning ? "fade-out" : "fade-in"}`}>
            <div className="thank-you-content">
              <div className="heart-icon-large">❤️</div>
              <h1>My Dearest,</h1>
              <p className="main-thank-you">
                Thank you for being the most beautiful part of my life. You didn't just come into my world; 
                you made it a place worth living in. Every laugh we've shared, every memory we've captured, 
                and even the quiet moments in between are treasures I hold close to my heart.
              </p>
              <p className="main-thank-you">
                Thank you for loving me for who I am. You are my home, my anchor, and my forever. 
                I am so lucky to walk this path of life with you.
              </p>
              <p className="final-note">
                Our journey together is my favorite story, and I can't wait for all 
                the unwritten chapters we have yet to live together.
              </p>
              <p className="love-signature">I love you, now and always. ❤️</p>
              <button className="start-over-btn" onClick={handleStartOver}>
                Start Our Story Over ❤️
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="story-header">
              <div className="story-progress">
                <div 
                  className="progress-bar-inner" 
                  style={{ width: `${((currentIndex + 1) / journeyPhotos.length) * 100}%` }}
                />
              </div>
            </div>

            <div className={`story-content ${isTransitioning ? "fade-out" : "fade-in"}`}>
              <div className="story-image-wrapper">
                <img 
                  src={require(`../assets/${currentPhoto.fileName}`)} 
                  alt={currentPhoto.title} 
                  className="story-image"
                />
              </div>
              
              <div className="story-narrative">
                <h2>{currentPhoto.title}</h2>
                <p>{currentPhoto.story}</p>
              </div>
            </div>

            <div className="story-actions">
              {currentIndex > 0 && (
                <button className="story-btn prev" onClick={handleBack}>
                  Previous Chapter
                </button>
              )}
              <button className="story-btn next" onClick={handleNext}>
                Swipe for More ❤️
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Gallery;
