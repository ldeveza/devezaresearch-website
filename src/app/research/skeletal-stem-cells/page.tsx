import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SkeletalStemCellsPage() {
  return (
    <main className="py-16 bg-white text-gray-800">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="text-[#0f2862] hover:text-[#001440] font-semibold">
            ← Back to Home
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-8 text-[#0f2862]">Skeletal Stem Cell Biology & Regenerative Repair</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#0f2862]">Periosteal Skeletal Stem Cells and Chondrogenesis</h2>
              <div className="prose max-w-none">
                {/* Image placeholder - update the src path once you add your image */}
                <div className="mb-6 relative">
                  <div className="rounded-lg overflow-hidden">
                    <Image 
                      src="/images/research/skeletal-stem-cells/periosteal_chondrogenesis.png" 
                      alt="Periosteal stem cells and chondrogenesis" 
                      width={600} 
                      height={375} 
                      className="rounded-lg mx-auto object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2 italic">Figure 1: Periosteal stem cell populations and chondrogenic differentiation.</p>
                </div>
                
                <p className="mb-4">
                  Periosteum is a remarkably rich yet underexplored reservoir of skeletal stem and progenitor cells. In collaboration with the Park lab, our prior work first compared periosteal and bone marrow‐derived stem cells at the transcriptomic level (Deveza et al., PLOS ONE 2018) and then went on to define two functionally distinct periosteal stem cell populations—Mx1⁺αSMA⁺ cells (Ortinau et al., Cell Stem Cell 2019) and LRP1⁺CD13⁺ cells (Jeong et al., JCI Insight 2024)—each of which proved essential for effective bone regeneration.
                </p>
                <p className="mb-4">
                  Building on these foundations, we are now probing a TGF‑βRI/II⁺ subpopulation of periosteal cells to determine whether they serve as bona fide chondroprogenitors or instead orchestrate cartilage formation through paracrine signaling. To address this question, we combine single‑cell RNA sequencing to reconstruct lineage hierarchies with flow cytometric purification of TGF‑βRI/II⁺ cells and in vivo cartilage repair models to distinguish direct differentiation from indirect, secreted‐factor effects.
                </p>
                <p className="mb-4">
                  Ultimately, by clarifying how periosteal‑derived progenitors contribute to both bone and cartilage repair, we aim to develop novel cell‑ and biologic‑based therapies for osteoarthritis and fracture healing.
                </p>
                
                <h3 className="text-xl font-bold mt-6 mb-3 text-[#0f2862]">Key References</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Deveza L, Ortinau L, Lei K, Park D. "Distinct Molecular Signatures of Bone Marrow‑ and Periosteal‑SSCs." <span className="italic">PLOS ONE</span>. 2018. PMID 29342188
                  </li>
                  <li>
                    Ortinau L, Wang H, Lei K, Deveza L, et al. "Functionally Distinct Mx1⁺αSMA⁺ Periosteal Skeletal Stem Cells." <span className="italic">Cell Stem Cell</span>. 2019. PMID 31809737
                  </li>
                  <li>
                    Jeong Y, Deveza L, et al. "Identification of LRP1⁺CD13⁺ Human Periosteal Stem Cells That Require LRP1 for Bone Repair." <span className="italic">JCI Insight</span>. 2024. PMID 39405183
                  </li>
                </ul>
                
                <h3 className="text-xl font-bold mt-6 mb-3 text-[#0f2862]">Current Research Focus</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Single-cell RNA sequencing of periosteal cell populations</li>
                  <li>Functional analysis of TGF‑βRI/II⁺ cells in cartilage repair</li>
                  <li>Development of cell-based therapies for osteoarthritis</li>
                  <li>Translational applications for fracture healing</li>
                </ul>
              </div>
            </section>
            
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-[#0f2862]">Nucleus Pulposus Cell Analysis</h2>
              <div className="prose max-w-none">
                <p className="mb-4">
                  We are performing single cell analytics to identify Nucleus Pulposus cell populations and verify their multipotency. This emerging research direction aims to enhance our understanding of intervertebral disc regeneration and develop potential therapeutic approaches for degenerative disc disease.
                </p>
                
                <h3 className="text-xl font-bold mt-6 mb-3 text-[#0f2862]">Current Research Focus</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Nucleus Pulposus cell multipotency verification</li>
                  <li>Single-cell analytics of intervertebral disc tissue</li>
                  <li>Potential regenerative approaches for degenerative disc disease</li>
                </ul>
              </div>
            </section>
          </div>
          
          {/* Sidebar - 1/3 width on large screens */}
          <div className="lg:col-span-1">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-[#0f2862]">Lab Highlights</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Pioneering research on TGF-βRI/II⁺ periosteal stem cells</li>
                <li>Cutting-edge single-cell RNA sequencing technology</li>
                <li>Interdisciplinary research combining regenerative medicine with orthopaedic applications</li>
                <li>Focus on translational outcomes for patients with orthopaedic injuries</li>
                <li>Collaborative approach with leading research groups</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
