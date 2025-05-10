'use client';
import { useState, useEffect } from 'react';

// Update this with your deployed Cloud Run URL
// When you get your Cloud Run URL, replace the value below
const API_URL = 'http://localhost:8080'; // Replace with https://xray-api-xxxxxxxx-uc.a.run.app
import Image from 'next/image';

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

  // Check if API is running
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/health`, { 
          method: 'GET',
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response.ok) {
          setApiStatus('online');
        } else {
          setApiStatus('offline');
        }
      } catch (err) {
        console.error('API health check failed:', err);
        setApiStatus('offline');
      }
    };

    checkApiStatus();
    
    // Set up a periodic health check
    const intervalId = setInterval(checkApiStatus, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId); // Cleanup on unmount
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (apiStatus === 'offline') {
      setError('API server is offline. Please start the X-ray API server using the start-xray-api.bat script.');
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
    
    // Create form data
    const formData = new FormData();
    formData.append('ap', apImage);
    formData.append('lat', latImage);
    formData.append('ob', obImage);
    
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setPrediction(data.probability);
    } catch (err) {
      console.error('Error making prediction:', err);
      setError(err.message || 'Failed to make prediction. Check if the API server is running.');
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
        <h3 className="text-xl font-semibold mb-2 text-blue-600">Fracture Prediction Result</h3>
        
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
              <span className={`ml-2 font-bold ${isHighRisk ? 'text-red-500' : 'text-green-500'}`}>
                {isHighRisk ? 'High risk of fracture' : 'Low risk of fracture'}
              </span>
            </p>
          </div>
          
          <div className="w-full md:w-1/2 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-600 mb-2">Interpretation Guidelines:</h4>
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-600">X-Ray Fracture Detection</h2>
        
        <div className="flex items-center">
          <span className="mr-2">API Status:</span>
          {apiStatus === 'checking' && (
            <span className="inline-flex items-center">
              <span className="h-3 w-3 bg-yellow-400 rounded-full mr-1"></span>
              Checking...
            </span>
          )}
          {apiStatus === 'online' && (
            <span className="inline-flex items-center text-green-600">
              <span className="h-3 w-3 bg-green-500 rounded-full mr-1"></span>
              Online
            </span>
          )}
          {apiStatus === 'offline' && (
            <span className="inline-flex items-center text-red-600">
              <span className="h-3 w-3 bg-red-500 rounded-full mr-1"></span>
              Offline
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
      
      {apiStatus === 'offline' && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
          <p className="font-medium">API Server is not running!</p>
          <p>Please start the API server by running the <code>start-xray-api.bat</code> script in the project root.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* AP View */}
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium mb-2 text-blue-600">AP View</h3>
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
            <h3 className="text-lg font-medium mb-2 text-blue-600">Lateral View</h3>
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
            <h3 className="text-lg font-medium mb-2 text-blue-600">Oblique View</h3>
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
            className="bg-blue-600 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || apiStatus === 'offline'}
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
