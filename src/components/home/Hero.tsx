import Link from 'next/link';
import React from 'react';

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Deveza Research and Projects
          </h1>
          <p className="text-xl md:text-2xl mb-2">
            Spine Surgery and Orthopaedic Oncology Research
          </p>
          <p className="text-xl md:text-2xl mb-6">
            Innovating Orthopaedic Research through Bench Science, AI, and Health Equity
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/research" 
              className="px-6 py-3 bg-white text-blue-900 font-bold rounded-md hover:bg-gray-100 transition-colors"
            >
              Explore Our Research
            </Link>
            <Link 
              href="/rag-models" 
              className="px-6 py-3 border border-white text-white font-bold rounded-md hover:bg-white hover:text-blue-900 transition-colors"
            >
              RAG Models
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
