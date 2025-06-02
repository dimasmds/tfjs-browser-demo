import { useState, useEffect, useRef } from 'react';
import CameraFeed from './CameraFeed';
import PredictionDisplay from './PredictionDisplay';
import { loadModel, processFrame } from '../utils/ml.js';
import PropTypes from 'prop-types';

import '../styles/DollDetector.css';

const DollDetector = ({ onModelLoaded }) => {
  const [predictions, setPredictions] = useState([]);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isCameraRunning, setIsCameraRunning] = useState(false);
  const [modelLoadError, setModelLoadError] = useState(null);
  const [history, setHistory] = useState([]);

  const model = useRef(null);
  const videoElement = useRef(null);
  const predictionInterval = useRef(null);

  // Load the model on component mount
  useEffect(() => {
    async function initializeModel() {
      try {
        setIsModelLoading(true);

        model.current = await loadModel();

        setIsModelLoading(false);

        if (onModelLoaded) onModelLoaded(true);
      } catch (error) {
        console.error('Failed to load model:', error);
        setModelLoadError('Failed to load the TensorFlow model. Please refresh the page to try again.');
        setIsModelLoading(false);
      }
    }

    initializeModel();

    return () => {
      // Clean up resources
      if (predictionInterval.current) {
        clearInterval(predictionInterval.current);
      }
    };
  }, [onModelLoaded]);

  const handleVideoElement = (video) => {
    videoElement.current = video;
    if (video && model.current && isCameraRunning) {
      startPrediction();
    }
  };

  const startPrediction = () => {
    if (predictionInterval.current) {
      clearInterval(predictionInterval.current);
    }

    predictionInterval.current = setInterval(async () => {
      if (!videoElement.current || !model.current || !isCameraRunning) return;

      try {
        await simulatePrediction();
      } catch (error) {
        console.error('Prediction error:', error);
      }
    }, 2000); // Predict every 2seconds
  };

  const simulatePrediction = async () => {
    const topPredictions = await processFrame(model.current, videoElement.current);
    setPredictions(topPredictions);

    // Add to history if confidence is high enough
    const topPrediction = topPredictions[0];

    if (topPrediction.probability > 0.7) {
      const timestamp = new Date().toLocaleTimeString();
      setHistory((prev) => {
        const newHistory = [{
          label: topPrediction.className,
          confidence: topPrediction.probability,
          timestamp
        }, ...prev];

        // Keep only last 5 items
        return newHistory.slice(0, 5);
      });
    }
  };

  const toggleCamera = () => {
    if (!isCameraRunning) {
      setIsCameraRunning(true);
      return;
    }

    setIsCameraRunning(false);

    if (predictionInterval.current) {
      clearInterval(predictionInterval.current);
    }

    setPredictions([]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="doll-detector">
      <div className="detector-container">
        <div className="camera-section">
          <CameraFeed
            onVideoElement={handleVideoElement}
            isRunning={isCameraRunning}
          />
          <div className="camera-controls">
            <button
              onClick={toggleCamera}
              disabled={isModelLoading || !!modelLoadError}
              className={isCameraRunning ? 'btn-danger' : 'btn-primary'}
            >
              {isCameraRunning ? 'Stop Camera' : 'Start Camera'}
            </button>
          </div>
        </div>

        <div className="predictions-section">
          <h2>Doll Classification</h2>
          {isModelLoading ? (
            <div className="loading-model">
              <div className="loading-spinner"></div>
              <p>Loading TensorFlow.js model...</p>
            </div>
          ) : modelLoadError ? (
            <div className="model-error">{modelLoadError}</div>
          ) : (
            <PredictionDisplay
              predictions={predictions}
              isActive={isCameraRunning}
            />
          )}

          {history.length > 0 && (
            <div className="detection-history">
              <div className="history-header">
                <h3>Recent Detections</h3>
                <button
                  onClick={clearHistory}
                  className="clear-history-btn"
                >
                  Clear
                </button>
              </div>
              <ul className="history-list">
                {history.map((item, index) => (
                  <li key={index} className="history-item">
                    <span className="history-label">{item.label}</span>
                    <span className="history-confidence">
                      {Math.round(item.confidence * 100)}%
                    </span>
                    <span className="history-time">{item.timestamp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

DollDetector.propTypes = {
  onModelLoaded: PropTypes.func.isRequired,
};

export default DollDetector;