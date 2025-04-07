import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="footer-section">
            <h3 className="text-xl font-bold mb-4">Devezaresearch Lab</h3>
            <p>Advancing healthcare through innovative AI research and orthopaedic science.</p>
          </div>
          
          <div className="footer-section">
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="mb-2">Email: info@devezaresearch.org</p>
            <p>Phone: (123) 456-7890</p>
          </div>
          
          <div className="footer-section">
            <h3 className="text-xl font-bold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors">Twitter</a>
              <a href="#" className="hover:text-blue-400 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-blue-400 transition-colors">GitHub</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Discord</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} Devezaresearch Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
