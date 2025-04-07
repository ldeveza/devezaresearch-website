import React from 'react';

export default function Research() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Research Directions</h1>
      <p className="mb-8">Exploring innovations in orthopaedic research through bench science, AI, and health equity.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bench Research */}
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-3">Bench Research</h2>
          <p>Our laboratory studies focus on skeletal stem cells and tissue regeneration, aiming to develop innovative approaches for bone and cartilage repair.</p>
          <button className="mt-4 text-blue-600 hover:underline">Learn more</button>
        </div>
        
        {/* AI Research */}
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-3">AI Research</h2>
          <p>We develop machine learning models and computer vision algorithms to improve diagnosis, treatment planning, and clinical decision support for orthopaedic conditions.</p>
          <button className="mt-4 text-blue-600 hover:underline">Learn more</button>
        </div>
        
        {/* SDOH Research */}
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-3">SDOH Research</h2>
          <p>Our work addresses social determinants of health, health disparities, and ethical considerations in orthopaedic care delivery and outcomes.</p>
          <button className="mt-4 text-blue-600 hover:underline">Learn more</button>
        </div>
      </div>
    </main>
  );
}
