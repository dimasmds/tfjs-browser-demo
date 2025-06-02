import '../styles/Footer.css';
import PropTypes from 'prop-types';

const Footer = ({ isModelLoaded }) => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="model-status">
          <div className={`status-indicator ${isModelLoaded ? 'active' : 'loading'}`}></div>
          <span>TensorFlow.js Model: {isModelLoaded ? 'Loaded' : 'Loading...'}</span>
        </div>
        <p className="footer-note">
          Point your camera at a doll to identify it. For demonstration purposes only.
        </p>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  isModelLoaded: PropTypes.bool,
};

export default Footer;