import { useState, useEffect } from 'react';
import '../styles/Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
        return;
      }

      setScrolled(false);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`app-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">🧸</div>
          <h1>Doll Detector</h1>
        </div>
        <div className="tagline">
          Real-time doll classification with TensorFlow.js
        </div>
      </div>
    </header>
  );
};

export default Header;