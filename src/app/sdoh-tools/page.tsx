import React from 'react';
import Link from 'next/link';

export default function SDOHToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">SDOH Tools</h1>
      <p className="mb-6">
        Explore our Social Determinants of Health (SDOH) tools to analyze and visualize health data across different demographics and geographic regions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">CDC PLACES API SDOH Explorer</h2>
          <p className="mb-4 text-gray-800">
            Explore Social Determinants of Health (SDOH) measures available in the CDC PLACES dataset for a specific ZIP code.
            This tool helps you select and analyze various health measures for your research.
          </p>
          <Link 
            href="/sdoh-tools/places-api-tester"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 transition-colors"
          >
            Launch PLACES API Explorer
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">CDC Social Vulnerability Index (SVI) Explorer</h2>
          <p className="mb-4 text-gray-800">
            Explore CDC&apos;s Social Vulnerability Index data at the ZIP code level. SVI helps identify communities 
            that may need support before, during, or after disasters.
          </p>
          <Link 
            href="/sdoh-tools/svi-explorer"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 transition-colors"
          >
            Launch SVI Explorer
          </Link>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">About SDOH</h2>
        <p className="mb-4 text-gray-800">
          Social Determinants of Health (SDOH) are the conditions in the environments where people are born, live, learn, work, 
          play, worship, and age that affect a wide range of health, functioning, and quality-of-life outcomes and risks.
        </p>
        <p className="text-gray-800">
          These tools provide researchers, healthcare professionals, and policymakers with resources to analyze 
          SDOH factors and develop more targeted interventions to improve community health outcomes.
        </p>
      </div>
    </div>
  );
}
