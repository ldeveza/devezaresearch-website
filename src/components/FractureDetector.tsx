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
      <h2>X-Ray Fracture Detection</h2>
      
      {!isModelLoaded ? (
        <div className={styles.loading}>
          <p>Loading model... Please wait.</p>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <div>
          <div className={styles.imageUploadContainer}>
            <div className={styles.imageUpload}>
              <label>AP View</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'ap')} 
              />
              {apImageSrc && <img src={apImageSrc} alt="AP View" width="150" />}
            </div>
            
            <div className={styles.imageUpload}>
              <label>Lateral View</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'lat')} 
              />
              {latImageSrc && <img src={latImageSrc} alt="Lateral View" width="150" />}
            </div>
            
            <div className={styles.imageUpload}>
              <label>Oblique View</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'ob')} 
              />
              {obImageSrc && <img src={obImageSrc} alt="Oblique View" width="150" />}
            </div>
          </div>
          
          <button 
            className={styles.analyzeButton}
            onClick={handlePredict} 
            disabled={isLoading || !apImageSrc || !latImageSrc || !obImageSrc}
          >
            {isLoading ? 'Analyzing...' : 'Detect Fracture'}
          </button>
          
          {error && <p className={styles.error}>{error}</p>}
          
          {prediction !== null && (
            <div className={styles.predictionResult}>
              <h3>Analysis Result:</h3>
              <p>Fracture Probability: {(prediction * 100).toFixed(2)}%</p>
              {prediction > 0.5 ? (
                <p className={styles.highRisk}>High probability of fracture detected</p>
              ) : (
                <p className={styles.lowRisk}>Low probability of fracture</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
