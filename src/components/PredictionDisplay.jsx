import { useEffect, useState } from 'react';
import '../styles/PredictionDisplay.css';
import PropTypes from 'prop-types';

const PredictionDisplay = ({ predictions, isActive }) => {
  const [animatedPredictions, setAnimatedPredictions] = useState([]);

  useEffect(() => {
    if (predictions.length > 0) {
      setAnimatedPredictions(predictions);
    } else if (!isActive) {
      setAnimatedPredictions([]);
    }
  }, [predictions, isActive]);

  if (!isActive && animatedPredictions.length === 0) {
    return (
      <div className="prediction-placeholder">
        <p>Start the camera to see doll classifications</p>
      </div>
    );
  }

  return (
    <div className={`prediction-display ${isActive ? 'active' : ''}`}>
      {animatedPredictions.length > 0 ? (
        <>
          <div className="top-prediction">
            <div className="prediction-label">
              <h3>{animatedPredictions[0].className}</h3>
              <span className="confidence-value">
                {Math.round(animatedPredictions[0].probability * 100)}%
              </span>
            </div>
            <div className="confidence-bar-container">
              <div
                className="confidence-bar"
                style={{ width: `${animatedPredictions[0].probability * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="other-predictions">
            {animatedPredictions.slice(1).map((prediction, index) => (
              <div key={index} className="prediction-item">
                <div className="prediction-label">
                  <span className="prediction-name">{prediction.className}</span>
                  <span className="confidence-value">
                    {Math.round(prediction.probability * 100)}%
                  </span>
                </div>
                <div className="confidence-bar-container">
                  <div
                    className="confidence-bar secondary"
                    style={{ width: `${prediction.probability * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="prediction-placeholder">
          <div className="scanning-animation">
            <div className="scanning-line"></div>
          </div>
          <p>Analyzing image...</p>
        </div>
      )}
    </div>
  );
};

PredictionDisplay.propTypes = {
  isActive: PropTypes.bool.isRequired,
  predictions: PropTypes.array.isRequired,
};

export default PredictionDisplay;