import * as tf from '@tensorflow/tfjs';

export async function loadModel() {
  try {
    const model = await tf.loadLayersModel('/model/model.json');
    console.log('Model loaded successfully');
    return model;
  } catch (error) {
    console.error('Error loading the model:', error);
    throw new Error('Failed to load TensorFlow.js model');
  }
}

async function processPredictions(predictions) {
  const response = await fetch('/model/metadata.json');
  const { labels } = await response.json();

  return Array.from(predictions)
    .map((prediction, index) => ({
      probability: prediction,
      className: labels[index],
    })).sort((a, b) => b.probability - a.probability);
}

/**
 * Process video frame for prediction
 * @param model
 * @param {HTMLVideoElement} videoElement - The video element containing camera feed
 */
export async function processFrame(model, videoElement) {
  try {
    // Convert video to tensor
    const videoTensor = tf.browser.fromPixels(videoElement);

    // Preprocess the image as required by your model
    const resized = tf.image.resizeNearestNeighbor(videoTensor, [224, 224]);
    const normalized = resized.div(255).expandDims(0);

    // Make prediction
    const predictions = await model.predict(normalized);
    const predictionData = await predictions.data();

    // Process the prediction results
    const results = await processPredictions(predictionData);

    // Clean up tensors to prevent memory leaks
    videoTensor.dispose();
    resized.dispose();
    normalized.dispose();
    predictions.dispose();

    return results;
  } catch (error) {
    console.error('Error processing video frame:', error);
    throw error;
  }
}