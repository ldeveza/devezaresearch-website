import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

export default function ResearchHighlights() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center text-[#0f2862]">Research Directions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bench & Translational */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-blue-100 overflow-hidden">
              <Image
                src="/images/research/skeletal-stem-cells/periosteal_chondrogenesis.png"
                alt="Skeletal Stem Cell Biology"
                width={800}
                height={400}
                className="w-full h-full object-cover object-center"
                priority
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-[#0f2862]">Skeletal Stem Cell Biology & Regenerative Repair</h3>
              <p className="text-gray-600 mb-4">
                Defining periosteal stem cells & cartilage repair mechanisms. Understanding nucleus pulposus cell analysis for intervertebral disc regeneration.
              </p>
              <Link href="/research/skeletal-stem-cells" className="text-[#0f2862] hover:text-[#001440] hover:underline">
                Learn more →
              </Link>
            </div>
          </div>

          {/* AI / ML / LLM */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-blue-100 flex items-center justify-center">
              <svg className="w-20 h-20 text-[#0f2862]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-[#0f2862]">AI‑Powered Orthopaedic Insights</h3>
              <p className="text-gray-600 mb-4">
                Building orthopaedic RAG models for clinical decision‑support
              </p>
              <Link href="/research/ai-orthopaedic-insights" className="text-[#0f2862] hover:text-[#001440] hover:underline">
                Learn more →
              </Link>
            </div>
          </div>
          
          {/* SDOH & Outcomes */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-green-100 flex items-center justify-center">
              <svg className="w-20 h-20 text-[#0f2862]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-[#0f2862]">Health Equity & Social Determinants in Spine Surgery and Orthopaedic Oncology</h3>
              <p className="text-gray-600 mb-4">
                Analyzing social determinants in spine and oncology care
              </p>
              <Link href="/research/health-equity" className="text-[#0f2862] hover:text-[#001440] hover:underline">
                Learn more →
              </Link>
            </div>
          </div>
          
          {/* Clinical Databases */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-blue-100 flex items-center justify-center">
              <svg className="w-20 h-20 text-[#0f2862]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-[#0f2862]">Real‑World Evidence & Outcomes Analytics in Spine Surgery and Orthopaedic Oncology</h3>
              <p className="text-gray-600 mb-4">
                Leveraging TRINETX & local registries for complication risk modeling
              </p>
              <Link href="/research/real-world-evidence" className="text-[#0f2862] hover:text-[#001440] hover:underline">
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
