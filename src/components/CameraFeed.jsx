import { useRef, useEffect, useState } from 'react';
import '../styles/CameraFeed.css';
import PropTypes from 'prop-types';

const CameraFeed = ({ onVideoElement, isRunning }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    let stream = null;

    const setupCamera = async () => {
      if (!isRunning) {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setCameraActive(false);
        }
        return;
      }

      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'environment', // Use back camera if available
              width: { ideal: 640 },
              height: { ideal: 480 }
            }
          });

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play();
              setCameraActive(true);
              if (onVideoElement) {
                onVideoElement(videoRef.current);
              }
            };
          }
          setError(null);
        } else {
          setError('Camera access is not supported in your browser');
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError(
          err.name === 'NotAllowedError'
            ? 'Camera access denied. Please allow camera access to use this feature.'
            : `Error accessing camera: ${  err.message}`
        );
      }
    };

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isRunning, onVideoElement]);

  return (
    <div className="camera-container">
      {error && <div className="camera-error">{error}</div>}
      <div className={`video-container ${cameraActive ? 'active' : ''}`}>
        <video
          ref={videoRef}
          className="camera-feed"
          playsInline
          muted
        />
        {!cameraActive && !error && isRunning && (
          <div className="camera-loading">
            <div className="loading-spinner"></div>
            <p>Accessing camera...</p>
          </div>
        )}
        {!isRunning && (
          <div className="camera-placeholder">
            <div className="camera-icon">📷</div>
            <p>Click &#34;Start Camera&#34; to begin</p>
          </div>
        )}
      </div>
    </div>
  );
};

CameraFeed.propTypes = {
  onVideoElement: PropTypes.func.isRequired,
  isRunning: PropTypes.bool.isRequired,
};

export default CameraFeed;