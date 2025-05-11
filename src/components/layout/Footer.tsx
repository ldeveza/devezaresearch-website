import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white text-[#0f2862] py-8 shadow-inner">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="footer-section">
            <h3 className="text-xl font-bold mb-4">Deveza Research and Projects</h3>
            <p className="font-semibold">Advancing healthcare through innovative AI research and orthopaedic science.</p>
          </div>
          
          <div className="footer-section">
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="mb-2 font-semibold">Email: Lorenzo.Deveza@bcm.edu</p>
          </div>
          
          <div className="footer-section">
            <h3 className="text-xl font-bold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/in/lorenzo-deveza-830b132b/" className="font-semibold hover:text-[#001440] transition-colors" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://github.com/devezalab" className="font-semibold hover:text-[#001440] transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://discord.gg/DmUBwVE3ps" className="font-semibold hover:text-[#001440] transition-colors" target="_blank" rel="noopener noreferrer">Discord</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="font-semibold">&copy; {new Date().getFullYear()} Deveza Research and Projects. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
