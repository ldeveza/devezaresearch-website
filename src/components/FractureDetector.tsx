'use client';

import { useState, useEffect, useRef } from 'react';
import { loadModel, predictFracture } from '../services/modelService';
import styles from './FractureDetector.module.css';

export default function FractureDetector() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Image references
  const apImageRef = useRef<HTMLImageElement | null>(null);
  const latImageRef = useRef<HTMLImageElement | null>(null);
  const obImageRef = useRef<HTMLImageElement | null>(null);
  
  // Image data URLs
  const [apImageSrc, setApImageSrc] = useState<string | null>(null);
  const [latImageSrc, setLatImageSrc] = useState<string | null>(null);
  const [obImageSrc, setObImageSrc] = useState<string | null>(null);
  
  // Load model on component mount
  useEffect(() => {
    async function initModel() {
      try {
        await loadModel();
        setIsModelLoaded(true);
      } catch (err) {
        setError("Failed to load model. Please try again later.");
        console.error(err);
      }
    }
    
    initModel();
  }, []);
  
  // Handle image upload
  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>, view: 'ap' | 'lat' | 'ob') {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (view === 'ap') {
          setApImageSrc(e.target?.result as string);
          apImageRef.current = img;
        } else if (view === 'lat') {
          setLatImageSrc(e.target?.result as string);
          latImageRef.current = img;
        } else if (view === 'ob') {
          setObImageSrc(e.target?.result as string);
          obImageRef.current = img;
        }
      };
      img.src = e.target?.result as string;
      
      // Ensure consistent image processing for model input
      img.crossOrigin = 'anonymous';
    };
    reader.readAsDataURL(file);
  }
  
  // Create refs for file inputs
  const apFileInputRef = useRef<HTMLInputElement>(null);
  const latFileInputRef = useRef<HTMLInputElement>(null);
  const obFileInputRef = useRef<HTMLInputElement>(null);

  // Reset function to clear images and prediction
  function handleReset() {
    // Clear image references
    apImageRef.current = null;
    latImageRef.current = null;
    obImageRef.current = null;
    
    // Clear image sources
    setApImageSrc(null);
    setLatImageSrc(null);
    setObImageSrc(null);
    
    // Reset prediction and error state
    setPrediction(null);
    setError(null);
    
    // Reset file input fields
    if (apFileInputRef.current) apFileInputRef.current.value = '';
    if (latFileInputRef.current) latFileInputRef.current.value = '';
    if (obFileInputRef.current) obFileInputRef.current.value = '';
  }
  
  // Run prediction
  async function handlePredict() {
    if (!apImageRef.current || !latImageRef.current || !obImageRef.current) {
      setError("Please upload all three X-ray views.");
      return;
    }
    
    setIsLoading(true);
    setPrediction(null);
    setError(null);
    
    try {
      const result = await predictFracture(
        apImageRef.current, 
        latImageRef.current, 
        obImageRef.current
      );
      setPrediction(result);
    } catch (err) {
      setError("Error processing images. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className={styles.fractureDetector}>
      <h2 className="text-2xl font-bold text-black mb-4">Distal Radius Fracture Reduction Assessment</h2>
      
      {!isModelLoaded ? (
        <div className={styles.loading}>
          <p>Loading model... Please wait.</p>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
              {/* AP View Upload */}
              <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#f9f9f9', width: '300px' }}>
                <label className="font-bold block mb-2 text-black">AP View</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'ap')} 
                  className="text-black mb-2 w-full"
                  ref={apFileInputRef}
                />
              </div>

              {/* Lateral View Upload */}
              <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#f9f9f9', width: '300px' }}>
                <label className="font-bold block mb-2 text-black">Lateral View</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'lat')} 
                  className="text-black mb-2 w-full"
                  ref={latFileInputRef}
                />
              </div>

              {/* Oblique View Upload */}
              <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#f9f9f9', width: '300px' }}>
                <label className="font-bold block mb-2 text-black">Oblique View</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'ob')} 
                  className="text-black mb-2 w-full"
                  ref={obFileInputRef}
                />
              </div>
            </div>

            {/* Image Preview Section */}
            {(apImageSrc || latImageSrc || obImageSrc) && (
              <div style={{ marginTop: '30px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px 0px', backgroundColor: '#f8fafc', width: '100%', overflow: 'hidden' }}>
                <h3 className="text-xl font-bold mb-4 text-center text-blue-600">X-ray Images Preview</h3>
                <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'flex-start', gap: '0px', overflowX: 'auto', paddingBottom: '10px', paddingLeft: '10px', width: '100%' }}>
                  {apImageSrc && (
                    <div style={{ textAlign: 'center', margin: '0', padding: '0' }}>
                      <p className="font-medium text-gray-700 mb-1">AP View</p>
                      <div style={{ height: '450px', width: '410px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '5px', margin: '0 -10px' }}>
                        {/* Use the same image ref that's used by the model */}
                        {apImageRef.current && (
                          <img 
                            ref={(el) => {
                              // This ensures we're referencing the same image for display and model
                              if (el && apImageRef.current) {
                                el.src = apImageRef.current.src;
                              }
                            }}
                            alt="AP View" 
                            style={{ maxHeight: '420px', maxWidth: '420px', objectFit: 'contain' }} 
                          />
                        )}
                      </div>
                    </div>
                  )}
                  
                  {latImageSrc && (
                    <div style={{ textAlign: 'center', margin: '0', padding: '0' }}>
                      <p className="font-medium text-gray-700 mb-1">Lateral View</p>
                      <div style={{ height: '450px', width: '410px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '5px', margin: '0 -10px' }}>
                        {/* Use the same image ref that's used by the model */}
                        {latImageRef.current && (
                          <img 
                            ref={(el) => {
                              // This ensures we're referencing the same image for display and model
                              if (el && latImageRef.current) {
                                el.src = latImageRef.current.src;
                              }
                            }}
                            alt="Lateral View" 
                            style={{ maxHeight: '420px', maxWidth: '420px', objectFit: 'contain' }} 
                          />
                        )}
                      </div>
                    </div>
                  )}
                  
                  {obImageSrc && (
                    <div style={{ textAlign: 'center', margin: '0', padding: '0' }}>
                      <p className="font-medium text-gray-700 mb-1">Oblique View</p>
                      <div style={{ height: '450px', width: '410px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '5px', margin: '0 -10px' }}>
                        {/* Use the same image ref that's used by the model */}
                        {obImageRef.current && (
                          <img 
                            ref={(el) => {
                              // This ensures we're referencing the same image for display and model
                              if (el && obImageRef.current) {
                                el.src = obImageRef.current.src;
                              }
                            }}
                            alt="Oblique View" 
                            style={{ maxHeight: '420px', maxWidth: '420px', objectFit: 'contain' }} 
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', marginBottom: '20px', justifyContent: 'center' }}>
            <button 
              className={styles.analyzeButton}
              onClick={handlePredict} 
              disabled={isLoading || !apImageSrc || !latImageSrc || !obImageSrc}
            >
              {isLoading ? 'Analyzing...' : 'Detect Need for Fracture Reduction'}
            </button>
            
            <button 
              className={styles.resetButton}
              onClick={handleReset}
              disabled={isLoading || (!apImageSrc && !latImageSrc && !obImageSrc && prediction === null)}
            >
              Reset All
            </button>
          </div>
          
          {error && <p className={styles.error}>{error}</p>}
          
          {prediction !== null && (
            <div className={styles.predictionResult}>
              <h3 className="text-xl font-semibold mb-2 text-black">Distal Radius Analysis Result:</h3>
              <p className="text-lg mb-2 text-black">Probability of Needed Reduction: <span className="font-bold">{(prediction * 100).toFixed(2)}%</span></p>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-6 mb-4">
                <div 
                  className={`h-6 rounded-full ${prediction > 0.5 ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${(prediction * 100).toFixed(1)}%` }}
                ></div>
              </div>
              
              {prediction > 0.5 ? (
                <p className={styles.highRisk}>Distal radius fracture reduction likely needed</p>
              ) : (
                <p className={styles.lowRisk}>Distal radius fracture reduction likely not needed</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
