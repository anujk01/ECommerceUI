import React, { useState, useEffect } from "react";
import { login } from "../api/authService";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [username, setUsername] = useState("anuj");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const videoRef = React.useRef(null);
  const [smileStatus, setSmileStatus] = useState(""); // "", "scanning", "detected", "error"
  const [hearts, setHearts] = useState([]);
  const [staticHearts, setStaticHearts] = useState([]);
  const [bgQuotes, setBgQuotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load face-api models
    const loadModels = async () => {
      const MODEL_URL = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights";
      try {
        await window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await window.faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        setIsModelsLoaded(true);
      } catch (err) {
        console.error("Failed to load models:", err);
      }
    };

    if (window.faceapi) {
      loadModels();
    } else {
      // If script not loaded yet, wait a bit
      setTimeout(loadModels, 1000);
    }

    // ... rest of previous useEffect ...
    const emojis = ["❤️", "💖", "💗", "💓", "💘", "💝"];
    const newHearts = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100 + "%",
      delay: Math.random() * 10 + "s",
      duration: Math.random() * 6 + 4 + "s",
      size: Math.random() * 1.5 + 0.5 + "rem",
    }));
    setHearts(newHearts);

    const newStaticHearts = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      top: Math.random() * 90 + "%",
      left: Math.random() * 90 + "%",
      size: Math.random() * 2 + 2 + "rem",
      rotate: Math.random() * 360 + "deg",
    }));
    setStaticHearts(newStaticHearts);

    const quotesPool = [
      "You + Me = ❤️", "Me & You Always", "Us Forever", "Only You & Me",
      "Perfect Together", "You + Me = Forever", "Better Together",
      "I love you more", "Forever and Always", "You are my heart",
      "Soulmates", "Always Mine", "My Everything", "Love is all we need",
      "Together Forever", "My One and Only", "Love You Always",
      "Infinite Love", "My Soulmate", "Simply Beautiful", "You are the One", "Mine Forever"
    ];
    const shuffledQuotes = [...quotesPool].sort(() => Math.random() - 0.5);
    let quoteIndex = 0;
    const numSlots = 8;
    const newBgQuotes = [];
    for (let i = 0; i < numSlots; i++) {
      if (Math.random() > 0.2 && quoteIndex < shuffledQuotes.length) {
        newBgQuotes.push({
          id: `left-${i}`, side: 'left', text: shuffledQuotes[quoteIndex++],
          top: (i * (90 / numSlots) + 5) + (Math.random() * 5) + "%",
          left: (Math.random() * 10 + 2) + "%",
          rotate: (Math.random() * 15 - 7.5) + "deg", size: Math.random() * 0.3 + 2.5 + "rem",
        });
      }
    }
    for (let i = 0; i < numSlots; i++) {
      if (Math.random() > 0.2 && quoteIndex < shuffledQuotes.length) {
        newBgQuotes.push({
          id: `right-${i}`, side: 'right', text: shuffledQuotes[quoteIndex++],
          top: (i * (90 / numSlots) + 5) + (Math.random() * 5) + "%",
          right: (Math.random() * 10 + 2) + "%",
          rotate: (Math.random() * 15 - 7.5) + "deg", size: Math.random() * 0.3 + 2.5 + "rem",
        });
      }
    }
    setBgQuotes(newBgQuotes);
  }, []);

  const startCamera = async () => {
    setIsCameraOpen(true);
    setSmileStatus("scanning");
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Camera access denied. Please allow camera to login.");
      setIsCameraOpen(false);
    }
  };

  const handleVideoPlay = () => {
    const interval = setInterval(async () => {
      if (!videoRef.current || !isCameraOpen) {
        clearInterval(interval);
        return;
      }

      const detections = await window.faceapi.detectAllFaces(
        videoRef.current, 
        new window.faceapi.TinyFaceDetectorOptions()
      ).withFaceExpressions();

      if (detections.length > 0) {
        const expressions = detections[0].expressions;
        // More sensitive threshold (0.6) for real-time feel
        if (expressions.happy > 0.6) {
          setSmileStatus("detected");
          clearInterval(interval);
          setTimeout(() => {
            stopCamera();
            setIsCameraOpen(false);
            performLogin();
          }, 800); // Slightly longer pause for effect
        } else {
          setSmileStatus("scanning");
        }
      }
    }, 100); // 100ms for real-time feel

    // Timeout if no smile detected
    setTimeout(() => {
      if (smileStatus === "scanning") {
        setSmileStatus("error");
        setError("Please show me a bigger smile? 😊");
        stopCamera();
        setIsCameraOpen(false);
      }
    }, 12000); // Slightly longer timeout for better experience
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isModelsLoaded) {
      setError("Models still loading, please wait a second...");
      return;
    }
    startCamera();
  };

  const performLogin = async () => {
    setLoading(true);
    try {
      const response = await login(username, password);
      if (response && response.token) {
        localStorage.setItem("token", response.token);
        navigate("/dashboard");
      } else {
        setError("Invalid response: Token missing from server.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Camera Overlay */}
      {isCameraOpen && (
        <div className="camera-overlay">
          <div className="camera-content">
            <h3>Smile to Open My Heart</h3>
            <div className={`video-container ${smileStatus === "scanning" ? "scanning-active" : ""}`}>
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                onPlay={handleVideoPlay}
                style={{ width: '100%', borderRadius: '20px' }}
              />
              <div className="scan-line"></div>
              {smileStatus === "scanning" && <div className="scanning-heart-pulse">❤️</div>}
            </div>
            <div className="status-container">
              {smileStatus === "scanning" && (
                <p className="scanning-text">Scanning for your beautiful smile...</p>
              )}
              {smileStatus === "detected" && (
                <div className="success-message">
                  <span className="heart-icon">❤️</span>
                  <p>I love that smile!</p>
                </div>
              )}
              {smileStatus === "error" && (
                <p className="status-error">Please show me a bigger smile? 😊</p>
              )}
            </div>
            <button className="camera-cancel-btn" onClick={() => { stopCamera(); setIsCameraOpen(false); }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Static Background Hearts */}
      <div className="static-hearts-container">
        {staticHearts.map((heart) => (
          <div
            key={heart.id}
            className="static-heart"
            style={{
              top: heart.top,
              left: heart.left,
              fontSize: heart.size,
              transform: `rotate(${heart.rotate})`,
            }}
          >
            ❤
          </div>
        ))}
      </div>

      {/* Background Cursive Quotes */}
      <div className="bg-quotes-container">
        {bgQuotes.map((quote) => (
          <div
            key={quote.id}
            className={`bg-quote ${quote.side === 'right' ? 'bg-quote-right' : ''}`}
            style={{
              top: quote.top,
              left: quote.side === 'right' ? 'auto' : quote.left,
              right: quote.side === 'right' ? quote.right : 'auto',
              fontSize: quote.size,
              transform: `rotate(${quote.rotate})`,
            }}
          >
            {quote.text}
          </div>
        ))}
      </div>

      {/* Background Floating Hearts */}
      <div className="floating-hearts">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="heart"
            style={{
              left: heart.left,
              animationDelay: heart.delay,
              animationDuration: heart.duration,
              fontSize: heart.size,
            }}
          >
            {heart.emoji}
          </div>
        ))}
      </div>

      {/* Main Login Card */}
      <div className="login-container">
        <div className="emojis">💑✨</div>
        <h2>Welcome Love❤️</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="password">Do you love me?</label>
            <input
              id="password"
              type="text"
              // placeholder="do you love me?"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Connecting..." : "Open My Heart"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
