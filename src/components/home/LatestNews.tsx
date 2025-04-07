import Link from 'next/link';
import React from 'react';

export default function LatestNews() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Latest News</h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* News Item 1 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/4 mb-4 md:mb-0">
                  <div className="text-gray-600">April 7, 2025</div>
                  <div className="inline-block px-3 py-1 mt-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Announcement
                  </div>
                </div>
                <div className="md:w-3/4 md:pl-6">
                  <h3 className="text-xl font-bold mb-2">Devezaresearch Lab Website Launch</h3>
                  <p className="text-gray-600 mb-4">
                    We are excited to announce the launch of our new research lab website, showcasing our 
                    ongoing projects and team dedicated to advancing orthopaedic research.
                  </p>
                  <Link href="/news#launch" className="text-blue-600 hover:underline">
                    Read more
                  </Link>
                </div>
              </div>
            </div>
            
            {/* News Item 2 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/4 mb-4 md:mb-0">
                  <div className="text-gray-600">March 15, 2025</div>
                  <div className="inline-block px-3 py-1 mt-2 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Research
                  </div>
                </div>
                <div className="md:w-3/4 md:pl-6">
                  <h3 className="text-xl font-bold mb-2">New Research Grant Awarded</h3>
                  <p className="text-gray-600 mb-4">
                    Our lab has been awarded a significant grant to advance our work in AI-assisted 
                    diagnosis for orthopaedic conditions, focusing on improving accessibility and accuracy.
                  </p>
                  <Link href="/news#grant" className="text-blue-600 hover:underline">
                    Read more
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link 
              href="/news" 
              className="px-6 py-3 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
            >
              View All News
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
