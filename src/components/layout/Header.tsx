import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="logo mb-4 md:mb-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/logo/logo_v2.png" 
                alt="Deveza Research and Projects Logo" 
                width={120} 
                height={120} 
                className="mr-4"
                priority
              />
              <span className="text-2xl font-bold text-[#0f2862]">Deveza Research and Projects</span>
            </Link>
          </div>
          <nav>
            <ul className="flex flex-wrap justify-center gap-1 md:gap-6">
              <li><Link href="/" className="px-3 py-2 text-[#0f2862] hover:text-[#001440] transition-colors font-semibold">Home</Link></li>
              <li><Link href="/news" className="px-3 py-2 text-[#0f2862] hover:text-[#001440] transition-colors font-semibold">News</Link></li>
              <li><Link href="/publications" className="px-3 py-2 text-[#0f2862] hover:text-[#001440] transition-colors font-semibold">Publications</Link></li>
              <li><Link href="/team" className="px-3 py-2 text-[#0f2862] hover:text-[#001440] transition-colors font-semibold">Team</Link></li>
              <li><Link href="/rag-models" className="px-3 py-2 text-[#0f2862] hover:text-[#001440] transition-colors font-semibold">RAG Models</Link></li>
              <li><Link href="/xray-tool" className="px-3 py-2 text-[#0f2862] hover:text-[#001440] transition-colors font-semibold">X-ray Tool</Link></li>
              <li><Link href="/sdoh-tools" className="px-3 py-2 text-[#0f2862] hover:text-[#001440] transition-colors font-semibold">SDOH Tools</Link></li>
              <li>
                <a 
                  href="https://discord.gg/DmUBwVE3ps" 
                  className="px-3 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors font-semibold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
