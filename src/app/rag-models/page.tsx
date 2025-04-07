import React from 'react';

export default function RagModels() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">RAG Models</h1>
      <p className="mb-8">Explore our interactive AI-powered chatbots designed to support healthcare professionals and patients.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Spine Surgery RAG Model */}
        <div className="border rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-3">Spine Surgery RAG Model</h2>
          <p className="mb-4">
            An interactive retrieval-augmented generation model specifically tailored for spine surgery queries. 
            This tool helps healthcare providers access the latest evidence-based information for spine surgery care.
          </p>
          <div className="mt-6 p-4 border rounded bg-gray-50">
            <p className="text-center text-gray-500 mb-2">Chat interface coming soon</p>
            <button disabled className="w-full py-2 bg-blue-100 text-blue-400 rounded cursor-not-allowed">
              Launch Demo (Coming Soon)
            </button>
          </div>
        </div>
        
        {/* Ortho Oncology RAG Model */}
        <div className="border rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-3">Ortho Oncology RAG Model</h2>
          <p className="mb-4">
            A specialized retrieval-augmented generation model focused on orthopaedic oncology. 
            This tool provides access to current research and treatment guidelines for musculoskeletal tumors.
          </p>
          <div className="mt-6 p-4 border rounded bg-gray-50">
            <p className="text-center text-gray-500 mb-2">Chat interface coming soon</p>
            <button disabled className="w-full py-2 bg-blue-100 text-blue-400 rounded cursor-not-allowed">
              Launch Demo (Coming Soon)
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-12 p-6 border rounded-lg bg-blue-50">
        <h2 className="text-xl font-bold mb-3">About Our RAG Models</h2>
        <p>
          Our Retrieval-Augmented Generation (RAG) models combine the power of large language models with a knowledge base 
          of curated medical literature. This approach ensures that responses are both contextually relevant and grounded 
          in peer-reviewed evidence.
        </p>
      </div>
    </main>
  );
}
