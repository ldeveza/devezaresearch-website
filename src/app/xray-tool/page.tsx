'use client';

import React from 'react';
import FracturePrediction from '@/components/FracturePrediction';

export default function XrayToolPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Distal Radius X-ray Fracture Detection</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <p className="text-lg mb-8 max-w-3xl">
          This tool uses our deep learning model to detect distal radius fractures from three standard X-ray views.
          Upload your AP, Lateral, and Oblique X-ray images below to get a fracture probability assessment.
        </p>
        
        {/* Fracture Prediction Component */}
        <FracturePrediction />
      </div>
      
      {/* Features */}
      <div className="bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-lg max-w-3xl mb-8">
        <p className="font-semibold mb-3 text-xl">Features:</p>
        <ul className="list-disc pl-6">
          <li className="mb-2">Multi-view analysis using AP, Lateral, and Oblique perspectives</li>
          <li className="mb-2">AI-powered fracture probability estimation</li>
          <li className="mb-2">Based on DenseNet-169 architecture trained on radiologist-labeled images</li>
          <li className="mb-2">Real-time prediction with instant results</li>
        </ul>
      </div>
      
      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-md text-sm text-yellow-800">
        <p className="font-semibold mb-1">Disclaimer:</p>
        <p>
          This tool is for research and educational purposes only. 
          It should not be used for clinical decision-making without expert radiological assessment. 
          Always consult with a qualified healthcare professional for proper diagnosis and treatment.
        </p>
      </div>
    </div>
  );
}
