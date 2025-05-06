'use client';

import React from 'react';

export default function XrayToolPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Distal Radius X-ray Fracture Detection</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 text-center">
        <div className="py-8">
          {/* Construction icon */}
          <svg 
            className="w-20 h-20 mx-auto mb-6 text-blue-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" 
            />
          </svg>
          
          <h2 className="text-2xl font-semibold mb-4">Under Construction</h2>
          
          <p className="text-lg mb-4 max-w-2xl mx-auto">
            Our X-ray fracture detection tool is currently under development. 
            We're working on integrating a machine learning model to detect 
            distal radius fractures from multiple X-ray views.
          </p>
        </div>
        
        {/* Coming soon features */}
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg max-w-xl mx-auto mb-6">
          <p className="font-semibold mb-2">Coming Soon:</p>
          <ul className="list-disc pl-6 text-left">
            <li>Upload AP, Lateral, and Oblique X-ray views</li>
            <li>AI-powered fracture detection</li>
            <li>Reduction requirement assessment</li>
            <li>Confidence scores for predictions</li>
          </ul>
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-md text-sm text-yellow-800">
        <p className="font-semibold mb-1">Disclaimer:</p>
        <p>
          When completed, this tool will be for research and educational purposes only. 
          It should not be used for clinical decision-making without expert radiological assessment. 
          Always consult with a qualified healthcare professional for proper diagnosis and treatment.
        </p>
      </div>
    </div>
  );
}
