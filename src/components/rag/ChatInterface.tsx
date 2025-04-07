import React from 'react';

type ChatInterfaceProps = {
  title: string;
  description: string;
};

export default function ChatInterface({ title, description }: ChatInterfaceProps) {
  return (
    <div className="border rounded-lg shadow-lg overflow-hidden">
      <div className="bg-indigo-700 text-white p-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
      
      <div className="bg-gray-50 h-80 p-4 overflow-y-auto">
        {/* Messages will appear here */}
        <div className="space-y-4">
          <div className="bg-indigo-100 p-3 rounded-lg max-w-[80%]">
            <p className="text-sm font-medium text-gray-500 mb-1">AI Assistant</p>
            <p>Hello! I'm a specialized RAG model designed to help with orthopaedic queries. How can I assist you today?</p>
          </div>
          
          {/* This component is currently a static mockup; it will be implemented with actual functionality later */}
          <div className="ml-auto bg-white border p-3 rounded-lg max-w-[80%]">
            <p className="text-sm font-medium text-gray-500 mb-1">You</p>
            <p>This is a demo of how the chat interface will look.</p>
          </div>
          
          <div className="bg-indigo-100 p-3 rounded-lg max-w-[80%]">
            <p className="text-sm font-medium text-gray-500 mb-1">AI Assistant</p>
            <p>Great! This interface will be fully functional in a future update. It will use a retrieval-augmented generation system to provide evidence-based responses.</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t">
        <form className="flex gap-2">
          <input 
            type="text" 
            placeholder="Type your question here..."
            disabled
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100"
          />
          <button 
            type="button" 
            disabled
            className="px-4 py-2 bg-indigo-200 text-indigo-500 rounded font-medium cursor-not-allowed"
          >
            Coming Soon
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          Note: This is a prototype interface. The fully functional RAG model will be implemented in a future update.
        </p>
      </div>
    </div>
  );
}
