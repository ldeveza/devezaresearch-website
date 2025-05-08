import React from 'react';

export default function SviExplorerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">CDC Social Vulnerability Index (SVI) Explorer</h1>
      
      <div className="mb-6">
        <p className="mb-4">
          Explore CDC&apos;s Social Vulnerability Index data at the ZIP code level. SVI helps identify communities 
          that may need support before, during, or after disasters.
        </p>
        <p>
          Enter a ZIP code to explore SVI data across four key themes: Socioeconomic Status, 
          Household Composition & Disability, Minority Status & Language, and Housing Type & Transportation.
        </p>
      </div>
      
      <div className="bg-white border rounded-lg shadow-lg">
        <iframe
          src="/sdoh-api/svi_explorer.html"
          className="w-full h-[800px] border-0"
          title="CDC Social Vulnerability Index Explorer"
        />
      </div>
    </div>
  );
}
