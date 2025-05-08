'use client';
import { useState } from 'react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all images are uploaded
    if (!apImage || !latImage || !obImage) {
      setError('Please upload all three X-ray views');
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
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      setPrediction(data.probability);
    } catch (err) {
      console.error('Error making prediction:', err);
      setError(err.message || 'Failed to make prediction');
    } finally {
      setLoading(false);
    }
  };

  const renderPredictionResult = () => {
    if (prediction === null) return null;
    
    const percentage = (prediction * 100).toFixed(1);
    const isHighRisk = prediction > 0.5;
    
    return (
      <div className="mt-6 p-4 rounded-lg border">
        <h3 className="text-xl font-semibold mb-2 text-blue-600">Fracture Prediction Result</h3>
        <p className="text-lg">
          Probability of fracture: <span className="font-bold">{percentage}%</span>
        </p>
        <p className="mt-2">
          Assessment: 
          <span className={`ml-2 font-bold ${isHighRisk ? 'text-red-500' : 'text-green-500'}`}>
            {isHighRisk ? 'High risk of fracture' : 'Low risk of fracture'}
          </span>
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">X-Ray Fracture Prediction</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* AP View */}
          <div className="p-4 border rounded-lg">
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
          <div className="p-4 border rounded-lg">
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
          <div className="p-4 border rounded-lg">
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
            className="bg-blue-600 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition-colors"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Predict Fracture'}
          </button>
        </div>
      </form>
      
      {renderPredictionResult()}
    </div>
  );
}
