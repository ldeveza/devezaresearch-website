import Link from 'next/link';
import React from 'react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="logo mb-4 md:mb-0">
            <Link href="/" className="text-2xl font-bold">Deveza Research and Projects</Link>
          </div>
          <nav>
            <ul className="flex flex-wrap justify-center gap-1 md:gap-6">
              <li><Link href="/" className="px-3 py-2 hover:text-blue-600 transition-colors">Home</Link></li>
              <li><Link href="/news" className="px-3 py-2 hover:text-blue-600 transition-colors">News</Link></li>
              <li><Link href="/publications" className="px-3 py-2 hover:text-blue-600 transition-colors">Publications</Link></li>
              <li><Link href="/research" className="px-3 py-2 hover:text-blue-600 transition-colors">Research Directions</Link></li>
              <li><Link href="/team" className="px-3 py-2 hover:text-blue-600 transition-colors">Team</Link></li>
              <li><Link href="/rag-models" className="px-3 py-2 hover:text-blue-600 transition-colors">RAG Models</Link></li>
              <li>
                <a 
                  href="#" 
                  className="px-3 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors"
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
