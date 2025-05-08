import React from 'react';

export default function PlacesApiTesterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">CDC PLACES API SDOH Explorer</h1>
      
      <div className="mb-6">
        <p className="mb-4">
          This tool allows you to explore Social Determinants of Health (SDOH) measures 
          available in the CDC PLACES dataset for a specific ZIP code.
        </p>
        <p>
          Enter a ZIP code to view SDOH measures and generate code for accessing this data programmatically.
        </p>
      </div>
      
      <div className="bg-white border rounded-lg shadow-lg">
        <iframe
          src="/sdoh-api/places_api_tester.html"
          className="w-full h-[800px] border-0"
          title="CDC PLACES API SDOH Explorer"
        />
      </div>
    </div>
  );
}
