import React from 'react';
import { BookOpen } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold">Guardians Club</span>
            </div>
            <p className="mt-2 text-gray-400">
              Empowering the next generation through interactive Christian education.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Stories</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Activities</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Videos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Quizzes</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Community</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-800 pt-8">
          <p className="text-gray-400 text-center">
            © {new Date().getFullYear()} Guardians Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}