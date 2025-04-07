import React from 'react';

export default function NewsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">News & Updates</h1>
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-gray-500 mb-2">April 7, 2025</div>
          <h2 className="text-2xl font-semibold mb-2">Devezaresearch Lab Website Launch</h2>
          <p className="mb-4">
            We are excited to announce the launch of our new research lab website, showcasing our ongoing projects and team.
          </p>
          <a href="#" className="text-blue-600 hover:underline">Read more</a>
        </div>
        {/* More news items will be added here */}
      </div>
    </main>
  );
}
