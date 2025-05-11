'use client';

import * as tf from '@tensorflow/tfjs';

let model = null;

export async function loadModel() {
  if (model) return model;
  
  try {
    // Set WebGL backend for better performance
    await tf.setBackend('webgl');
    console.log('Loading fracture detection model...');
    model = await tf.loadGraphModel('/model/model.json');
    console.log('Model loaded successfully');
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    throw error;
  }
}

export async function predictFracture(apImage, latImage, obImage) {
  if (!model) await loadModel();
  
  // Process images
  const ap = tf.browser.fromPixels(apImage)
    .resizeBilinear([224, 224])
    .div(tf.scalar(255))
    .expandDims(0);
    
  const lat = tf.browser.fromPixels(latImage)
    .resizeBilinear([224, 224])
    .div(tf.scalar(255))
    .expandDims(0);
    
  const ob = tf.browser.fromPixels(obImage)
    .resizeBilinear([224, 224])
    .div(tf.scalar(255))
    .expandDims(0);
  
  // Run prediction
  const prediction = await model.predict({
    'input_ap': ap,
    'input_lat': lat,
    'input_ob': ob
  });
  
  // Get result
  const result = await prediction.dataSync()[0];
  
  // Clean up tensors to prevent memory leaks
  tf.dispose([ap, lat, ob, prediction]);
  
  return result;
}
