'use client';

import React, { useState } from 'react';
import Image from 'next/image';

type XrayView = 'AP' | 'Lateral' | 'Oblique';
type UploadState = Record<XrayView, { file: File | null; preview: string | null }>;
type PredictionResult = {
  fracture: boolean;
  needsReduction: boolean;
  confidence: number;
};

export default function XrayToolPage() {
  const [uploads, setUploads] = useState<UploadState>({
    AP: { file: null, preview: null },
    Lateral: { file: null, preview: null },
    Oblique: { file: null, preview: null },
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (view: XrayView, file: File | null) => {
    if (!file) {
      setUploads((prev) => ({
        ...prev,
        [view]: { file: null, preview: null },
      }));
      return;
    }

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      setError(`Please upload an image file for the ${view} view.`);
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploads((prev) => ({
        ...prev,
        [view]: { 
          file, 
          preview: e.target?.result as string,
        },
      }));
    };
    reader.readAsDataURL(file);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all views have been uploaded
    if (!uploads.AP.file || !uploads.Lateral.file || !uploads.Oblique.file) {
      setError('Please upload all three X-ray views (AP, Lateral, and Oblique).');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('ap', uploads.AP.file);
      formData.append('lateral', uploads.Lateral.file);
      formData.append('oblique', uploads.Oblique.file);

      const response = await fetch('/api/xray-prediction', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(`Error processing X-rays: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setUploads({
      AP: { file: null, preview: null },
      Lateral: { file: null, preview: null },
      Oblique: { file: null, preview: null },
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Distal Radius X-ray Fracture Detection</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload X-ray Images</h2>
        <p className="mb-6 text-gray-700">
          Upload three views of the distal radius X-ray images (AP, Lateral, and Oblique) to detect fractures and determine if reduction is needed.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['AP', 'Lateral', 'Oblique'] as XrayView[]).map((view) => (
              <div key={view} className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">{view} View</h3>
                
                <div className="mb-4 bg-gray-100 rounded-lg flex items-center justify-center aspect-square overflow-hidden">
                  {uploads[view].preview ? (
                    <Image 
                      src={uploads[view].preview!} 
                      alt={`${view} X-ray preview`} 
                      width={200} 
                      height={200}
                      className="object-contain max-h-full"
                    />
                  ) : (
                    <div className="text-gray-400 text-center p-4">
                      No image uploaded
                    </div>
                  )}
                </div>

                <label className="block">
                  <span className="sr-only">Choose {view} X-ray</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(view, e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </label>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors disabled:bg-blue-300"
            >
              {isLoading ? 'Processing...' : 'Analyze X-rays'}
            </button>
            
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-md transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
          
          <div className={`p-4 rounded-md mb-4 ${result.fracture ? 'bg-red-100' : 'bg-green-100'}`}>
            <p className="font-bold text-lg">
              {result.fracture 
                ? 'Fracture detected' 
                : 'No fracture detected'}
            </p>
            
            {result.fracture && (
              <p className="mt-2">
                <span className="font-semibold">Reduction needed:</span> {result.needsReduction ? 'Yes' : 'No'}
              </p>
            )}
            
            <p className="mt-2">
              <span className="font-semibold">Confidence:</span> {(result.confidence * 100).toFixed(1)}%
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md text-sm text-gray-700">
            <p className="font-semibold mb-2">Important Disclaimer:</p>
            <p>
              This tool is for educational and research purposes only. The results should not be used for clinical decision-making without expert radiological assessment. Always consult with a qualified healthcare professional for proper diagnosis and treatment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
