import React from 'react';

export default function Team() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Our Team</h1>
      <p className="mb-8">Meet the researchers, collaborators, and advisors at Devezaresearch Lab.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Team members will be dynamically generated here */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <div className="h-64 bg-gray-200"></div> {/* Placeholder for image */}
          <div className="p-4">
            <h3 className="text-xl font-bold">Dr. Deveza</h3>
            <p className="text-gray-600">Principal Investigator</p>
            <p className="mt-2">Research focus on orthopaedics, AI integration, and healthcare disparities.</p>
            <div className="mt-4 flex space-x-3">
              <a href="#" className="text-blue-600 hover:underline">LinkedIn</a>
              <a href="#" className="text-blue-600 hover:underline">ResearchGate</a>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <div className="h-64 bg-gray-200"></div> {/* Placeholder for image */}
          <div className="p-4">
            <h3 className="text-xl font-bold">Team Member</h3>
            <p className="text-gray-600">Research Associate</p>
            <p className="mt-2">Coming soon...</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <div className="h-64 bg-gray-200"></div> {/* Placeholder for image */}
          <div className="p-4">
            <h3 className="text-xl font-bold">Team Member</h3>
            <p className="text-gray-600">Research Assistant</p>
            <p className="mt-2">Coming soon...</p>
          </div>
        </div>
      </div>
    </main>
  );
}
