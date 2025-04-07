import Link from 'next/link';
import React from 'react';

export default function ResearchHighlights() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Research Highlights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* AI in Healthcare */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-blue-100 flex items-center justify-center">
              <svg className="w-20 h-20 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">AI in Healthcare</h3>
              <p className="text-gray-600 mb-4">
                Developing RAG models to support clinical decision-making and patient education in orthopaedic care.
              </p>
              <Link href="/research#ai-healthcare" className="text-blue-600 hover:underline">
                Learn more
              </Link>
            </div>
          </div>
          
          {/* Medical Imaging Analysis */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-green-100 flex items-center justify-center">
              <svg className="w-20 h-20 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Medical Imaging Analysis</h3>
              <p className="text-gray-600 mb-4">
                Creating advanced algorithms for x-ray and medical imaging classification to improve diagnostic accuracy.
              </p>
              <Link href="/research#imaging" className="text-blue-600 hover:underline">
                Learn more
              </Link>
            </div>
          </div>
          
          {/* Clinical NLP */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-purple-100 flex items-center justify-center">
              <svg className="w-20 h-20 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Clinical NLP</h3>
              <p className="text-gray-600 mb-4">
                Extracting meaningful insights from clinical notes and medical literature to enhance research and clinical care.
              </p>
              <Link href="/research#nlp" className="text-blue-600 hover:underline">
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
