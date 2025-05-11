'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

// API URL - can be changed based on environment
const API_URL = 'https://dr3vbinary-api.onrender.com';

export default function FracturePrediction() {
  const [apImage, setApImage] = useState(null);
  const [latImage, setLatImage] = useState(null);
  const [obImage, setObImage] = useState(null);
  const [previews, setPreviews] = useState({
    ap: null,
    lat: null,
    ob: null
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking', 'online', 'offline'

  // Load the TensorFlow.js model
  useEffect(() => {
    async function loadModel() {
      try {
        // Set model to loading state
        setModelStatus('loading');
        setModelProgress(0);
        
        // Load TensorFlow.js
        await tf.ready();
        console.log('TensorFlow.js is ready');
        
        // Define model URL (model.json in the public/model directory)
        const modelUrl = '/model/model.json';
        
        // Load model with progress monitoring
        const loadedModel = await tf.loadGraphModel(modelUrl, {
          onProgress: (fraction) => {
            // Update loading progress (0-100%)
            const percent = Math.round(fraction * 100);
            console.log(`Model loading progress: ${percent}%`);
            setModelProgress(percent);
          }
        });
        
        // Store model in ref for later use
        modelRef.current = loadedModel;
        console.log('Model loaded successfully');
        
        // Print model inputs and outputs for debugging
        console.log('Model inputs:', Object.keys(loadedModel.inputs));
        console.log('Model outputs:', Object.keys(loadedModel.outputs));
        
        // Update model status
        setModelStatus('ready');
        setError(null);
      } catch (err) {
        console.error('Error loading model:', err);
        setModelStatus('error');
        setError(`Failed to load model: ${err.message}`);
      }
    }
    
    loadModel();
    
    // Cleanup function
    return () => {
      // Dispose of model resources when component unmounts
      if (modelRef.current) {
        try {
          // Attempt to dispose of the model
          modelRef.current.dispose();
          console.log('Model resources released');
        } catch (err) {
          console.warn('Error disposing model:', err);
        }
      }
    };
  }, []);

  const handleImageChange = (e, view) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Set the file for form submission
    switch(view) {
      case 'ap':
        setApImage(file);
        break;
      case 'lat':
        setLatImage(file);
        break;
      case 'ob':
        setObImage(file);
        break;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviews(prev => ({
        ...prev,
        [view]: e.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setApImage(null);
    setLatImage(null);
    setObImage(null);
    setPreviews({
      ap: null,
      lat: null,
      ob: null
    });
    setPrediction(null);
    setError(null);
  };

  // Helper function to preprocess an image for the model
  const preprocessImage = async (file) => {
    return new Promise((resolve, reject) => {
      try {
        // Create FileReader to read the image file
        const reader = new FileReader();
        
        reader.onload = (e) => {
          // Create an HTMLImageElement to load the image data
          const img = new Image();
          
          img.onload = () => {
            try {
              // Create a canvas to resize and process the image
              const canvas = document.createElement('canvas');
              canvas.width = 224;  // Model expects 224x224 images
              canvas.height = 224;
              const ctx = canvas.getContext('2d');
              
              // Draw and resize the image on the canvas
              ctx.drawImage(img, 0, 0, 224, 224);
              
              // Get the image data from the canvas
              const imageData = ctx.getImageData(0, 0, 224, 224);
              
              // Convert to tensor, normalize, and add batch dimension
              const tensor = tf.tidy(() => {
                // Create tensor from image data (0-255) and normalize to 0-1
                const imageTensor = tf.browser.fromPixels(imageData)
                  .toFloat()
                  .div(tf.scalar(255))
                  .expandDims(0);  // Add batch dimension
                
                return imageTensor;
              });
              
              // Return the preprocessed tensor
              resolve(tensor);
            } catch (err) {
              reject(err);
            }
          };
          
          img.onerror = (err) => {
            reject(new Error('Failed to load image: ' + err));
          };
          
          // Set the image source to the file data
          img.src = e.target.result;
        };
        
        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
        
        // Read the file as a data URL
        reader.readAsDataURL(file);
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (modelStatus !== 'ready') {
      setError('Model is not loaded yet. Please wait for the model to load or refresh the page.');
      return;
    }
    
    // Check if all images are uploaded
    if (!apImage || !latImage || !obImage) {
      setError('Please upload all three X-ray views (AP, Lateral, and Oblique)');
      return;
    }
    
    setLoading(true);
    setError(null);
    setPrediction(null);
    
    try {
      // Process each image to create input tensors
      console.log('Processing AP image...');
      const apTensor = await preprocessImage(apImage);
      
      console.log('Processing Lateral image...');
      const latTensor = await preprocessImage(latImage);
      
      console.log('Processing Oblique image...');
      const obTensor = await preprocessImage(obImage);
      
      console.log('All images processed, running prediction...');
      
      // Run prediction with the model
      const result = tf.tidy(() => {
        // Create feed dictionary with input tensors
        const feedDict = {
          'input_ap': apTensor,
          'input_lat': latTensor,
          'input_ob': obTensor
        };
        
        // Run model prediction
        return modelRef.current.predict(feedDict);
      });
      
      // Get prediction probability
      const probabilityTensor = result['output_0']; // Assuming output tensor name
      const probability = await probabilityTensor.data();
      const predictionValue = probability[0]; // First (and only) value
      
      console.log('Prediction complete:', predictionValue);
      
      // Set prediction result
      setPrediction(predictionValue);
      
      // Clean up tensors to avoid memory leaks
      tf.dispose([apTensor, latTensor, obTensor, result, probabilityTensor]);
      
    } catch (err) {
      console.error('Error making prediction:', err);
      setError(err.message || 'Failed to run prediction with the model.');
    } finally {
      setLoading(false);
    }
  };

  const renderPredictionResult = () => {
    if (prediction === null) return null;
    
    const percentage = (prediction * 100).toFixed(1);
    const isHighRisk = prediction > 0.5;
    
    return (
      <div className="mt-6 p-4 rounded-lg border shadow">
        <h3 className="text-xl font-semibold mb-2 text-navy-700">Fracture Prediction Result</h3>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="w-full md:w-1/2">
            <p className="text-lg mb-2">
              Probability of fracture: <span className="font-bold text-xl">{percentage}%</span>
            </p>
            
            <div className="w-full bg-gray-200 rounded-full h-6 mb-4">
              <div 
                className={`h-6 rounded-full ${isHighRisk ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            
            <p className="text-lg">
              Assessment: 
              <span className={`ml-2 font-bold ${isHighRisk ? 'text-navy-500' : 'text-green-500'}`}>
                {isHighRisk ? 'High risk of fracture' : 'Low risk of fracture'}
              </span>
            </p>
          </div>
          
          <div className="w-full md:w-1/2 p-4 bg-navy-50 rounded-lg">
            <h4 className="font-semibold text-navy-700 mb-2">Interpretation Guidelines:</h4>
            <ul className="list-disc pl-5">
              <li>Probability below 50%: Low likelihood of fracture</li>
              <li>Probability above 50%: High likelihood of fracture</li>
              <li>This is a research tool only - clinical validation required</li>
              <li>Always consult a radiologist for diagnosis</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleReset}
            className="py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition-colors"
          >
            Reset & Try Again
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      {/* Add Tailwind navy colors to the top of the component */}
      <style jsx global>{`
        .text-navy-700 { color: #1e3a8a; }
        .text-navy-900 { color: #0c1c44; }
        .bg-navy-50 { background-color: #f0f5ff; }
        .bg-navy-700 { background-color: #1e3a8a; }
        .bg-navy-800 { background-color: #172b6e; }
        .hover\:bg-navy-800:hover { background-color: #172b6e; }
        .hover\:text-navy-900:hover { color: #0c1c44; }
      `}</style>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-navy-700">X-Ray Fracture Detection</h2>
        
        <div className="flex items-center">
          <span className="mr-2">Model Status:</span>
          {modelStatus === 'loading' && (
            <span className="inline-flex items-center">
              <span className="h-3 w-3 bg-yellow-400 rounded-full mr-1 animate-pulse"></span>
              Loading...
            </span>
          )}
          {modelStatus === 'ready' && (
            <span className="inline-flex items-center text-green-600">
              <span className="h-3 w-3 bg-green-500 rounded-full mr-1"></span>
              Ready
            </span>
          )}
          {modelStatus === 'error' && (
            <span className="inline-flex items-center text-red-600">
              <span className="h-3 w-3 bg-red-500 rounded-full mr-1"></span>
              Error
            </span>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {modelStatus === 'loading' && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md">
          <p className="font-medium">Loading X-ray prediction model... {modelProgress}%</p>
          <div className="w-full h-2 bg-blue-200 rounded-full mt-2">
            <div 
              className="h-2 bg-blue-600 rounded-full" 
              style={{ width: `${modelProgress}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1">This may take a few moments on first load.</p>
        </div>
      )}
      
      {modelStatus === 'error' && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
          <p className="font-medium">Failed to load prediction model!</p>
          <p>Please refresh the page to try again. If the problem persists, check your network connection.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* AP View */}
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium mb-2 text-navy-700">AP View</h3>
            <div className="h-48 bg-gray-100 flex justify-center items-center mb-2 relative">
              {previews.ap ? (
                <div className="relative w-full h-full">
                  <Image 
                    src={previews.ap} 
                    alt="AP X-ray preview"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <p className="text-gray-400">No image selected</p>
              )}
            </div>
            <input
              type="file"
              onChange={(e) => handleImageChange(e, 'ap')}
              accept="image/*"
              className="w-full"
            />
          </div>
          
          {/* Lateral View */}
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium mb-2 text-navy-700">Lateral View</h3>
            <div className="h-48 bg-gray-100 flex justify-center items-center mb-2 relative">
              {previews.lat ? (
                <div className="relative w-full h-full">
                  <Image 
                    src={previews.lat} 
                    alt="Lateral X-ray preview"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <p className="text-gray-400">No image selected</p>
              )}
            </div>
            <input
              type="file"
              onChange={(e) => handleImageChange(e, 'lat')}
              accept="image/*"
              className="w-full"
            />
          </div>
          
          {/* Oblique View */}
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium mb-2 text-navy-700">Oblique View</h3>
            <div className="h-48 bg-gray-100 flex justify-center items-center mb-2 relative">
              {previews.ob ? (
                <div className="relative w-full h-full">
                  <Image 
                    src={previews.ob} 
                    alt="Oblique X-ray preview"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <p className="text-gray-400">No image selected</p>
              )}
            </div>
            <input
              type="file"
              onChange={(e) => handleImageChange(e, 'ob')}
              accept="image/*"
              className="w-full"
            />
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-navy-700 hover:bg-navy-800 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || modelStatus !== 'ready'}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Predict Fracture'
            )}
          </button>
        </div>
      </form>
      
      {renderPredictionResult()}
    </div>
  );
}
