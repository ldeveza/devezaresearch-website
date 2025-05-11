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
    };
    reader.readAsDataURL(file);
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
      <h2 className="text-2xl font-bold text-black mb-4">X-Ray Fracture Reduction Assessment</h2>
      
      {!isModelLoaded ? (
        <div className={styles.loading}>
          <p>Loading model... Please wait.</p>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <div>
          <div className={styles.imageUploadContainer}>
            <div className={styles.imageUpload}>
              <label className="font-bold text-black">AP View</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'ap')} 
                className="text-black"
              />
              {apImageSrc && <img src={apImageSrc} alt="AP View" width="150" />}
            </div>
            
            <div className={styles.imageUpload}>
              <label className="font-bold text-black">Lateral View</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'lat')} 
                className="text-black"
              />
              {latImageSrc && <img src={latImageSrc} alt="Lateral View" width="150" />}
            </div>
            
            <div className={styles.imageUpload}>
              <label className="font-bold text-black">Oblique View</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'ob')} 
                className="text-black"
              />
              {obImageSrc && <img src={obImageSrc} alt="Oblique View" width="150" />}
            </div>
          </div>
          
          <button 
            className={styles.analyzeButton}
            onClick={handlePredict} 
            disabled={isLoading || !apImageSrc || !latImageSrc || !obImageSrc}
          >
            {isLoading ? 'Analyzing...' : 'Detect Need for Fracture Reduction'}
          </button>
          
          {error && <p className={styles.error}>{error}</p>}
          
          {prediction !== null && (
            <div className={styles.predictionResult}>
              <h3 className="text-xl font-semibold mb-2 text-black">Analysis Result:</h3>
              <p className="text-lg mb-2 text-black">Reduction Probability: <span className="font-bold">{(prediction * 100).toFixed(2)}%</span></p>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-6 mb-4">
                <div 
                  className={`h-6 rounded-full ${prediction > 0.5 ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${(prediction * 100).toFixed(1)}%` }}
                ></div>
              </div>
              
              {prediction > 0.5 ? (
                <p className={styles.highRisk}>Fracture reduction likely needed</p>
              ) : (
                <p className={styles.lowRisk}>Fracture reduction likely not needed</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
